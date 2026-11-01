import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getBancaConfig } from "./bancas";
import { getCalibrationReference, getSinteseGeral } from "./calibration";
import { registrarCorrecao } from "./feedback-real/store";
import { estimarLinhas } from "./linhas";
import { buildCorrectionResultSchema } from "./schema";
import type { CorrectEssayInput, CorrectEssayOutcome } from "./types";

export async function correctEssay(
  input: CorrectEssayInput,
): Promise<CorrectEssayOutcome> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error:
        "ANTHROPIC_API_KEY não configurada no servidor. Adicione essa variável no .env.local.",
    };
  }

  const banca = getBancaConfig(input.bancaId);
  const schema = buildCorrectionResultSchema();
  const client = new Anthropic({ apiKey });

  const estimativaLinhas = estimarLinhas(input.texto, input.limiteLinhas, input.limiteLinhasMinimo);

  const referenciaCalibracao = input.padraoResposta
    ? null
    : getCalibrationReference(input.bancaId, input.tema);

  // Camada 4 (síntese geral) só entra em jogo quando as camadas 1-3 não
  // resolveram — não é computada/usada quando já há prova semelhante, pois
  // a referência específica é sempre preferível a um padrão agregado.
  const sinteseGeral = input.padraoResposta || referenciaCalibracao
    ? null
    : getSinteseGeral(input.bancaId);

  const systemPrompt = banca.buildSystemPrompt({
    temPadraoResposta: Boolean(input.padraoResposta),
    referenciaCalibracao,
    sinteseGeral,
  });

  const userContent = [
    `TEMA/ENUNCIADO DA QUESTÃO:\n${input.tema}`,
    input.padraoResposta
      ? `PADRÃO DE RESPOSTA OFICIAL:\n${input.padraoResposta}`
      : null,
    estimativaLinhas.limiteLinhas != null || estimativaLinhas.limiteLinhasMinimo != null
      ? `${estimativaLinhas.limiteLinhas != null ? `LIMITE MÁXIMO DE LINHAS DO ENUNCIADO: ${estimativaLinhas.limiteLinhas}\n` : ""}${
          estimativaLinhas.limiteLinhasMinimo != null
            ? `LIMITE MÍNIMO DE LINHAS DO ENUNCIADO: ${estimativaLinhas.limiteLinhasMinimo}\n`
            : ""
        }LINHAS MANUSCRITAS ESTIMADAS DO TEXTO ENVIADO: ${estimativaLinhas.linhasEstimadas} (estimativa por quantidade de caracteres — não é a contagem de quebras de linha do textarea, já que a largura da folha física da banca é bem menor que a caixa de texto do navegador; não existe especificação oficial de caracteres por linha, então trate isso como aproximado)${
          estimativaLinhas.ultrapassouLimite ? " — ULTRAPASSOU O LIMITE MÁXIMO ESTIMADO" : ""
        }${estimativaLinhas.abaixoDoMinimo ? " — FICOU ABAIXO DO LIMITE MÍNIMO ESTIMADO" : ""}`
      : null,
    `TEXTO DA RESPOSTA:\n${input.texto}`,
  ]
    .filter((part): part is string => Boolean(part))
    .join("\n\n---\n\n");

  let message;
  try {
    message = await client.messages.parse({
      model: "claude-opus-4-8",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }],
      output_config: { format: zodOutputFormat(schema) },
    });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return {
        ok: false,
        error: "Limite de requisições da API atingido. Tente novamente em instantes.",
      };
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return {
        ok: false,
        error: "Chave de API inválida. Confira o ANTHROPIC_API_KEY no .env.local.",
      };
    }
    if (error instanceof Anthropic.APIError) {
      return { ok: false, error: `Erro da API Anthropic: ${error.message}` };
    }
    console.error("Erro inesperado ao corrigir questão discursiva:", error);
    return { ok: false, error: "Erro inesperado ao processar a correção." };
  }

  if (message.stop_reason === "refusal") {
    return { ok: false, error: "O modelo recusou avaliar este conteúdo." };
  }

  const parsed = message.parsed_output;
  if (!parsed) {
    return {
      ok: false,
      error:
        "Não foi possível interpretar a resposta do modelo. Tente novamente.",
    };
  }

  if (parsed.itens.length === 0) {
    return {
      ok: false,
      error: "O modelo não retornou nenhum item avaliado. Tente novamente.",
    };
  }

  // Arredonda pra 2 casas (escala usual do Cebraspe) — soma de floats como
  // 0.7 + 0.85 + 0.4 + 0.7 gera erro de ponto flutuante (ex: 2.6499999999999995)
  // que não pode vazar pra UI.
  const arredonda = (n: number) => Math.round(n * 100) / 100;

  const itensClamped = parsed.itens.map((item) => ({
    ...item,
    pontuacao: arredonda(Math.max(0, Math.min(item.pontuacao, item.pontuacaoMaxima))),
  }));

  const notaMaxima = arredonda(itensClamped.reduce((sum, item) => sum + item.pontuacaoMaxima, 0));
  const somaItens = itensClamped.reduce((sum, item) => sum + item.pontuacao, 0);
  const somaDeducoes = parsed.deducoes.reduce((sum, d) => sum + d.impactoPontos, 0);
  const notaEstimada = arredonda(Math.max(0, Math.min(notaMaxima, somaItens + somaDeducoes)));

  // Grava um snapshot da correção pra o usuário poder, mais tarde, voltar e
  // registrar a nota real que a banca deu (única fonte de "gabarito"
  // verdadeiro) — ver lib/corretor/feedback-real/. Isso só acumula dado; não
  // afeta o resultado desta correção nem de nenhuma futura sozinho.
  const correcaoId = await registrarCorrecao({
    userId: input.userId,
    bancaId: input.bancaId,
    tema: input.tema,
    notaEstimada,
    notaMaxima,
    fonteDosItens: parsed.fonteDosItens,
    // output_tokens já inclui os tokens de thinking (billing da Anthropic
    // conta thinking como saída) — usado pro alarme de custo manual.
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
  });

  return {
    ok: true,
    data: {
      correcaoId,
      notaEstimada,
      notaMaxima,
      fonteDosItens: parsed.fonteDosItens,
      itens: itensClamped,
      pontosFortes: parsed.pontosFortes,
      pontosMelhoria: parsed.pontosMelhoria,
      sugestoes: parsed.sugestoes,
      deducoes: parsed.deducoes,
      avaliacaoAproximada: parsed.avaliacaoAproximada,
      avisoTransparencia: parsed.avisoTransparencia,
      estimativaLinhas:
        estimativaLinhas.limiteLinhas != null || estimativaLinhas.limiteLinhasMinimo != null
          ? {
              linhasEstimadas: estimativaLinhas.linhasEstimadas,
              limiteLinhas: estimativaLinhas.limiteLinhas,
              ultrapassouLimite: estimativaLinhas.ultrapassouLimite,
              proximoDoLimite: estimativaLinhas.proximoDoLimite,
              limiteLinhasMinimo: estimativaLinhas.limiteLinhasMinimo,
              abaixoDoMinimo: estimativaLinhas.abaixoDoMinimo,
              proximoDoMinimo: estimativaLinhas.proximoDoMinimo,
              aviso: estimativaLinhas.aviso as string,
            }
          : null,
    },
  };
}
