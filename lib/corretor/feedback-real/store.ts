import crypto from "node:crypto";
import type { FonteDosItens } from "../types";
import { localAdapter } from "./persistence/local";
import { supabaseAdapter } from "./persistence/supabase";
import type { FeedbackRealAdapter, UsoTokens } from "./persistence/types";
import type { CorrecaoRegistrada } from "./types";

// Limites de uso do /corretor — proteção básica de custo/abuso enquanto não
// há cobrança (trilha A, item 4). Números aprovados com base em custo real
// medido (message.usage de 3 correções reais, preço do claude-opus-4-8):
// ~$0,06–0,07/correção observado, $0,10/correção usado como margem de
// segurança. 20/dia limita o pior caso a $2,00/dia por usuário; 30s de
// intervalo é maior que o tempo de processamento de uma correção (10-30s),
// então não afeta uso normal, só rajada automatizada.
const JANELA_RAJADA_MS = 30 * 1000;
const JANELA_DIARIA_MS = 24 * 60 * 60 * 1000;
const TETO_DIARIO = 20;

// FEEDBACK_REAL_STORE=supabase liga a persistência de produção; qualquer
// outro valor (ou ausência) mantém o JSON local de dev. Isso é a única
// diferença entre os dois modos — a lógica de negócio abaixo (geração de
// id, validação, composição do registro) roda uma única vez, igual nos
// dois casos; só o adaptador de I/O muda.
function getAdapter(): FeedbackRealAdapter {
  return process.env.FEEDBACK_REAL_STORE === "supabase" ? supabaseAdapter : localAdapter;
}

/**
 * Chamado pelo motor de correção logo após uma correção bem-sucedida. Só
 * grava o snapshot necessário pra comparação futura — nunca lê nem altera
 * critério/lógica de correção. Retorna o correcaoId gerado.
 */
export async function registrarCorrecao(input: {
  userId: string;
  bancaId: string;
  tema: string;
  notaEstimada: number;
  notaMaxima: number;
  fonteDosItens: FonteDosItens;
  inputTokens: number;
  outputTokens: number;
}): Promise<string> {
  const correcaoId = crypto.randomUUID();
  const registro: CorrecaoRegistrada = {
    correcaoId,
    criadoEm: new Date().toISOString(),
    userId: input.userId,
    bancaId: input.bancaId,
    tema: input.tema,
    notaEstimada: input.notaEstimada,
    notaMaxima: input.notaMaxima,
    fonteDosItens: input.fonteDosItens,
    inputTokens: input.inputTokens,
    outputTokens: input.outputTokens,
    feedbackReal: null,
  };
  await getAdapter().salvar(registro);
  return correcaoId;
}

export type LimiteResultado =
  | { ok: true }
  | { ok: false; motivo: "rajada"; tentarNovamenteEm: string }
  | { ok: false; motivo: "teto_diario"; tentarNovamenteEm: string };

/**
 * Checagem de rajada + teto diário — chamada pela Server Action ANTES de
 * gastar uma chamada de API. Uma única consulta (últimas 24h do usuário)
 * serve os dois limites: o item mais recente decide a rajada, a contagem
 * total decide o teto diário. Não fecha 100% o caso de N requisições
 * paralelas disparadas no mesmo instante (nenhuma ainda gravou linha quando
 * as outras chegam) — aceitável no volume atual; se isso virar um problema
 * real, a evolução natural é um lock/contador atômico (ex: Redis) só aqui
 * dentro, sem mudar a assinatura desta função nem o call site.
 */
export async function verificarLimite(userId: string): Promise<LimiteResultado> {
  const agora = Date.now();
  const desde = new Date(agora - JANELA_DIARIA_MS).toISOString();
  const timestamps = await getAdapter().listarCriadoEmDesde(userId, desde);

  if (timestamps.length > 0) {
    const maisRecente = new Date(timestamps[timestamps.length - 1]).getTime();
    if (agora - maisRecente < JANELA_RAJADA_MS) {
      return {
        ok: false,
        motivo: "rajada",
        tentarNovamenteEm: new Date(maisRecente + JANELA_RAJADA_MS).toISOString(),
      };
    }
  }

  if (timestamps.length >= TETO_DIARIO) {
    const maisAntiga = new Date(timestamps[0]).getTime();
    return {
      ok: false,
      motivo: "teto_diario",
      tentarNovamenteEm: new Date(maisAntiga + JANELA_DIARIA_MS).toISOString(),
    };
  }

  return { ok: true };
}

/**
 * Uso de tokens de todas as correções (opcionalmente só a partir de
 * "desde") — base do alarme de custo manual (scripts/analisar-custo.mjs).
 */
export async function listarUsoTokens(desde?: string): Promise<UsoTokens[]> {
  return getAdapter().listarUsoTokens(desde);
}

export async function getRegistro(correcaoId: string): Promise<CorrecaoRegistrada | null> {
  return getAdapter().buscar(correcaoId);
}

export type RegistrarFeedbackResultado =
  | { ok: true; registro: CorrecaoRegistrada }
  | { ok: false; error: string };

/**
 * Registra a nota real informada pelo usuário pra uma correção já existente.
 * Só acrescenta o dado — nunca recalcula, ajusta ou realimenta o motor. Isso
 * fica só acumulado pro script de análise (scripts/analisar-feedback-real.mjs)
 * ler depois; qualquer ajuste real de critério continua exigindo revisão
 * humana explícita.
 */
export async function registrarFeedbackReal(input: {
  correcaoId: string;
  notaReal: number;
  observacao?: string;
}): Promise<RegistrarFeedbackResultado> {
  const adapter = getAdapter();
  const registro = await adapter.buscar(input.correcaoId);
  if (!registro) {
    return { ok: false, error: "Correção não encontrada. Confira o código informado." };
  }
  if (!Number.isFinite(input.notaReal) || input.notaReal < 0 || input.notaReal > registro.notaMaxima) {
    return {
      ok: false,
      error: `Nota real inválida — deve ser um número entre 0 e ${registro.notaMaxima}.`,
    };
  }

  const atualizado: CorrecaoRegistrada = {
    ...registro,
    feedbackReal: {
      notaReal: input.notaReal,
      observacao: input.observacao?.trim() || null,
      registradoEm: new Date().toISOString(),
    },
  };
  await adapter.atualizarFeedback(atualizado);
  return { ok: true, registro: atualizado };
}

/**
 * Lê todos os registros que já têm feedback real associado. Só leitura — usado
 * pelo script de análise, nunca pelo motor de correção em si.
 */
export async function listRegistrosComFeedback(): Promise<CorrecaoRegistrada[]> {
  return getAdapter().listarComFeedback();
}
