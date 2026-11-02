import crypto from "node:crypto";
import type { FonteDosItens } from "../types";
import { localAdapter } from "./persistence/local";
import { supabaseAdapter } from "./persistence/supabase";
import { COTA_GRATIS_POR_CONTA } from "@/lib/cobranca/config";
import type { FeedbackRealAdapter, TipoReserva, UsoTokens } from "./persistence/types";
import type {
  ConteudoCorrecao,
  CorrecaoHistorico,
  CorrecaoRegistrada,
  CorrecaoResumo,
} from "./types";

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
  if (process.env.FEEDBACK_REAL_STORE === "supabase") return supabaseAdapter;
  // Na Vercel (produção ou preview) o modo local não funciona: o sistema de
  // arquivos é somente leitura/efêmero, e cota/histórico se perderiam. Falha
  // aqui, com a causa explícita no log, em vez de um erro de disco confuso.
  if (process.env.VERCEL === "1") {
    throw new Error(
      'FEEDBACK_REAL_STORE precisa ser "supabase" na Vercel (variável ausente ou com outro valor neste ambiente).',
    );
  }
  return localAdapter;
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

export type Reserva = { email: string; tipo: TipoReserva };

export type ReservaResultado = { ok: true; reserva: Reserva } | { ok: false; motivo: "sem_cota" };

/**
 * Reserva 1 correção (cota grátis) ANTES de chamar a IA — atômico no
 * Supabase, então requisições paralelas não furam a cota. Quem chama tem
 * que devolver a reserva (devolverReserva) se a correção falhar: no saldo
 * final, só correção bem-sucedida consome.
 *
 * "email" tem que ser o e-mail da sessão (user.email do getUser), nunca um
 * valor vindo do formulário — a cota grátis é por e-mail normalizado.
 */
export async function reservarCorrecao(email: string): Promise<ReservaResultado> {
  const tipo = await getAdapter().reservarCorrecao(email, COTA_GRATIS_POR_CONTA);
  if (!tipo) return { ok: false, motivo: "sem_cota" };
  return { ok: true, reserva: { email, tipo } };
}

export async function devolverReserva(reserva: Reserva): Promise<void> {
  await getAdapter().devolverCorrecao(reserva.email, reserva.tipo);
}

export async function consultarGratisRestantes(email: string): Promise<number> {
  const usadas = await getAdapter().consultarGratisUsadas(email);
  return Math.max(0, COTA_GRATIS_POR_CONTA - usadas);
}

// --- "Minhas correções" ------------------------------------------------------
// Toda função recebe o userId da SESSÃO e só enxerga correções desse usuário
// que não foram apagadas.

/**
 * Guarda resposta, padrão de resposta e relatório de uma correção que acabou
 * de dar certo. Chamado pela Server Action, não pelo motor.
 */
export async function salvarConteudoCorrecao(
  correcaoId: string,
  userId: string,
  conteudo: ConteudoCorrecao,
): Promise<void> {
  await getAdapter().salvarConteudo(correcaoId, userId, conteudo);
}

export async function listarMinhasCorrecoes(userId: string): Promise<CorrecaoResumo[]> {
  return getAdapter().listarHistorico(userId);
}

export async function getMinhaCorrecao(
  correcaoId: string,
  userId: string,
): Promise<CorrecaoHistorico | null> {
  if (!UUID_RE.test(correcaoId)) return null;
  return getAdapter().buscarHistorico(correcaoId, userId);
}

/**
 * Apaga o conteúdo (tema, resposta, padrão, relatório, observação da nota
 * real) e tira a correção do histórico. Data, banca, notas e tokens ficam —
 * sustentam limites de uso e controle de custo (ver migração
 * historico_correcoes).
 */
export async function apagarMinhaCorrecao(correcaoId: string, userId: string): Promise<boolean> {
  if (!UUID_RE.test(correcaoId)) return false;
  return getAdapter().apagarConteudo(correcaoId, userId);
}

/**
 * Uso de tokens de todas as correções (opcionalmente só a partir de
 * "desde") — base do alarme de custo manual (scripts/analisar-custo.mjs).
 */
export async function listarUsoTokens(desde?: string): Promise<UsoTokens[]> {
  return getAdapter().listarUsoTokens(desde);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Busca uma correção SÓ se ela pertencer ao usuário informado. Correção de
 * outra pessoa volta como null, igual a uma inexistente — quem chama não
 * consegue distinguir os dois casos (não revela que o código existe nem a
 * nota estimada de terceiros). Código mal formatado também volta null
 * (no Supabase, um id que não é UUID viraria erro de cast do Postgres).
 */
export async function getRegistroDoUsuario(
  correcaoId: string,
  userId: string,
): Promise<CorrecaoRegistrada | null> {
  if (!UUID_RE.test(correcaoId)) return null;
  const registro = await getAdapter().buscar(correcaoId);
  if (!registro || registro.userId !== userId) return null;
  return registro;
}

export type RegistrarFeedbackResultado =
  | { ok: true; registro: CorrecaoRegistrada }
  | { ok: false; error: string };

/**
 * Registra a nota real informada pelo usuário pra uma correção já existente.
 * Só acrescenta o dado — nunca recalcula, ajusta ou realimenta o motor. Isso
 * fica só acumulado pro script de análise (scripts/analisar-feedback-real.mjs)
 * ler depois; qualquer ajuste real de critério continua exigindo revisão
 * humana explícita. Só o dono da correção (userId) pode registrar a nota.
 */
export async function registrarFeedbackReal(input: {
  correcaoId: string;
  userId: string;
  notaReal: number;
  observacao?: string;
}): Promise<RegistrarFeedbackResultado> {
  const adapter = getAdapter();
  const registro = await getRegistroDoUsuario(input.correcaoId, input.userId);
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
