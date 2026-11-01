import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { CorrecaoRegistrada, FeedbackReal } from "../types";
import type { FeedbackRealAdapter, TipoReserva, UsoTokens } from "./types";

type CorrecaoRow = {
  id: string;
  criado_em: string;
  user_id: string;
  banca_id: string;
  tema: string;
  nota_estimada: number;
  nota_maxima: number;
  fonte_dos_itens: CorrecaoRegistrada["fonteDosItens"];
  input_tokens: number;
  output_tokens: number;
};

type FeedbackRow = {
  nota_real: number;
  observacao: string | null;
  registrado_em: string;
};

function toRegistro(row: CorrecaoRow, feedback: FeedbackRow | null): CorrecaoRegistrada {
  const feedbackReal: FeedbackReal | null = feedback
    ? {
        notaReal: feedback.nota_real,
        observacao: feedback.observacao,
        registradoEm: feedback.registrado_em,
      }
    : null;
  return {
    correcaoId: row.id,
    criadoEm: row.criado_em,
    userId: row.user_id,
    bancaId: row.banca_id,
    tema: row.tema,
    notaEstimada: row.nota_estimada,
    notaMaxima: row.nota_maxima,
    fonteDosItens: row.fonte_dos_itens,
    inputTokens: row.input_tokens,
    outputTokens: row.output_tokens,
    feedbackReal,
  };
}

export const supabaseAdapter: FeedbackRealAdapter = {
  async salvar(registro) {
    const { error } = await getSupabaseAdmin().from("correcoes").insert({
      id: registro.correcaoId,
      criado_em: registro.criadoEm,
      user_id: registro.userId,
      banca_id: registro.bancaId,
      tema: registro.tema,
      nota_estimada: registro.notaEstimada,
      nota_maxima: registro.notaMaxima,
      fonte_dos_itens: registro.fonteDosItens,
      input_tokens: registro.inputTokens,
      output_tokens: registro.outputTokens,
    });
    if (error) throw new Error(`Falha ao gravar correção no Supabase: ${error.message}`);
  },

  async buscar(correcaoId) {
    const admin = getSupabaseAdmin();
    const { data: correcao, error } = await admin
      .from("correcoes")
      .select("*")
      .eq("id", correcaoId)
      .maybeSingle<CorrecaoRow>();
    if (error) throw new Error(`Falha ao buscar correção no Supabase: ${error.message}`);
    if (!correcao) return null;

    const { data: feedback, error: feedbackError } = await admin
      .from("feedbacks_reais")
      .select("nota_real, observacao, registrado_em")
      .eq("correcao_id", correcaoId)
      .maybeSingle<FeedbackRow>();
    if (feedbackError) throw new Error(`Falha ao buscar feedback real no Supabase: ${feedbackError.message}`);

    return toRegistro(correcao, feedback ?? null);
  },

  async atualizarFeedback(registro) {
    if (!registro.feedbackReal) return;
    const { error } = await getSupabaseAdmin().from("feedbacks_reais").upsert(
      {
        correcao_id: registro.correcaoId,
        nota_real: registro.feedbackReal.notaReal,
        observacao: registro.feedbackReal.observacao,
        registrado_em: registro.feedbackReal.registradoEm,
      },
      { onConflict: "correcao_id" },
    );
    if (error) throw new Error(`Falha ao gravar feedback real no Supabase: ${error.message}`);
  },

  async listarComFeedback() {
    // feedbacks_reais vem como OBJETO (não array) no embed: correcao_id tem
    // "unique" na tabela, e o PostgREST detecta relação 1-1 a partir disso.
    const { data, error } = await getSupabaseAdmin()
      .from("correcoes")
      .select("*, feedbacks_reais!inner(nota_real, observacao, registrado_em)")
      .returns<(CorrecaoRow & { feedbacks_reais: FeedbackRow })[]>();
    if (error) throw new Error(`Falha ao listar feedback real no Supabase: ${error.message}`);

    return (data ?? []).map((row) => toRegistro(row, row.feedbacks_reais));
  },

  async listarCriadoEmDesde(userId, desde) {
    const { data, error } = await getSupabaseAdmin()
      .from("correcoes")
      .select("criado_em")
      .eq("user_id", userId)
      .gte("criado_em", desde)
      .order("criado_em", { ascending: true })
      .returns<{ criado_em: string }[]>();
    if (error) throw new Error(`Falha ao checar limite de uso no Supabase: ${error.message}`);
    return (data ?? []).map((row) => row.criado_em);
  },

  async listarUsoTokens(desde) {
    let query = getSupabaseAdmin()
      .from("correcoes")
      .select("id, criado_em, banca_id, input_tokens, output_tokens");
    if (desde) query = query.gte("criado_em", desde);
    const { data, error } = await query.returns<
      { id: string; criado_em: string; banca_id: string; input_tokens: number; output_tokens: number }[]
    >();
    if (error) throw new Error(`Falha ao listar uso de tokens no Supabase: ${error.message}`);

    return (data ?? []).map((row): UsoTokens => ({
      correcaoId: row.id,
      criadoEm: row.criado_em,
      bancaId: row.banca_id,
      inputTokens: row.input_tokens,
      outputTokens: row.output_tokens,
    }));
  },

  async reservarCorrecao(userId, limiteGratis) {
    const { data, error } = await getSupabaseAdmin().rpc("reservar_correcao", {
      p_user_id: userId,
      p_limite_gratis: limiteGratis,
    });
    if (error) throw new Error(`Falha ao reservar correção no Supabase: ${error.message}`);
    return (data as TipoReserva | null) ?? null;
  },

  async devolverCorrecao(userId, tipo) {
    const { error } = await getSupabaseAdmin().rpc("devolver_correcao", {
      p_user_id: userId,
      p_tipo: tipo,
    });
    if (error) throw new Error(`Falha ao devolver reserva no Supabase: ${error.message}`);
  },

  async consultarGratisUsadas(userId) {
    const { data, error } = await getSupabaseAdmin()
      .from("contas_uso")
      .select("gratis_usadas")
      .eq("user_id", userId)
      .maybeSingle<{ gratis_usadas: number }>();
    if (error) throw new Error(`Falha ao consultar cota no Supabase: ${error.message}`);
    return data?.gratis_usadas ?? 0;
  },
};
