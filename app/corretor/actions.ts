"use server";

import { emailDescartavel, MENSAGEM_EMAIL_DESCARTAVEL } from "@/lib/anti-abuso/email";
import { BANCAS_DISPONIVEIS } from "@/lib/corretor/bancas";
import { correctEssay } from "@/lib/corretor/engine";
import type { CorrectionView } from "@/lib/corretor/types";
import { COTA_GRATIS_POR_CONTA } from "@/lib/cobranca/config";
import {
  devolverReserva,
  reservarCorrecao,
  salvarConteudoCorrecao,
  verificarLimite,
  type Reserva,
} from "@/lib/corretor/feedback-real/store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatarDataHora(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export type CorrectorState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; data: CorrectionView };

export async function correctEssayAction(
  _prevState: CorrectorState,
  formData: FormData,
): Promise<CorrectorState> {
  // O proxy.ts já bloqueia quem não está logado antes de chegar aqui — esta
  // é a checagem "segura" de defesa em profundidade (nunca confiar só no
  // proxy pra proteger uma Server Action, ver guia de auth do Next.js).
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Sessão expirada. Faça login de novo." };
  }

  // O formulário de /entrar já recusa e-mail descartável, mas a chave anon
  // do Supabase é pública — dá pra criar conta chamando a API de Auth
  // direto. Esta checagem fecha esse atalho antes de gastar qualquer coisa.
  // A cota grátis é por e-mail (ver reservarCorrecao) — conta sem e-mail
  // (não acontece com o login por link mágico) não tem como ser contada.
  if (!user.email) {
    return { status: "error", message: "Sua conta não tem e-mail associado. Entre novamente pelo link." };
  }
  if (emailDescartavel(user.email)) {
    return { status: "error", message: MENSAGEM_EMAIL_DESCARTAVEL };
  }

  // Proteção básica de custo/abuso (rajada + teto diário) — checada ANTES
  // de gastar uma chamada de API. Ver lib/corretor/feedback-real/store.ts.
  const limite = await verificarLimite(user.id);
  if (!limite.ok) {
    if (limite.motivo === "rajada") {
      const segundos = Math.max(
        1,
        Math.ceil((new Date(limite.tentarNovamenteEm).getTime() - Date.now()) / 1000),
      );
      return {
        status: "error",
        message: `Aguarde ${segundos} segundo(s) antes de corrigir outra questão.`,
      };
    }
    return {
      status: "error",
      message: `Você atingiu o limite de 20 correções por dia. Tente novamente a partir de ${formatarDataHora(limite.tentarNovamenteEm)}.`,
    };
  }

  const bancaId = String(formData.get("banca") ?? "").trim();
  const tema = String(formData.get("tema") ?? "").trim();
  const texto = String(formData.get("texto") ?? "").trim();
  const padraoResposta = String(formData.get("padraoResposta") ?? "").trim();
  const limiteLinhasRaw = String(formData.get("limiteLinhas") ?? "").trim();
  const limiteLinhasMinimoRaw = String(formData.get("limiteLinhasMinimo") ?? "").trim();

  if (!BANCAS_DISPONIVEIS.some((b) => b.id === bancaId)) {
    return { status: "error", message: "Selecione uma banca válida." };
  }
  if (!tema) {
    return { status: "error", message: "Informe o tema/enunciado da questão discursiva." };
  }
  if (!texto) {
    return { status: "error", message: "Cole o texto da resposta." };
  }

  let limiteLinhas: number | undefined;
  if (limiteLinhasRaw) {
    const parsed = Number(limiteLinhasRaw);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return { status: "error", message: "Limite de linhas inválido." };
    }
    limiteLinhas = parsed;
  }

  let limiteLinhasMinimo: number | undefined;
  if (limiteLinhasMinimoRaw) {
    const parsed = Number(limiteLinhasMinimoRaw);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return { status: "error", message: "Limite mínimo de linhas inválido." };
    }
    limiteLinhasMinimo = parsed;
  }

  // Reserva depois da validação (formulário inválido não consome nada) e
  // antes da chamada à API. Ver reservarCorrecao em store.ts.
  const reserva = await reservarCorrecao(user.email);
  if (!reserva.ok) {
    return {
      status: "error",
      message: `Você já usou suas ${COTA_GRATIS_POR_CONTA} correções grátis. Para continuar, adquira um pacote de créditos.`,
    };
  }

  let outcome: Awaited<ReturnType<typeof correctEssay>>;
  try {
    outcome = await correctEssay({
      bancaId,
      tema,
      texto,
      padraoResposta: padraoResposta || undefined,
      limiteLinhas,
      limiteLinhasMinimo,
      userId: user.id,
    });
  } catch (error) {
    console.error("Erro inesperado na correção:", error);
    outcome = { ok: false, error: "Erro inesperado ao processar a correção." };
  }

  if (!outcome.ok) {
    await devolverSemFalhar(reserva.reserva);
    return { status: "error", message: outcome.error };
  }

  // Histórico ("Minhas correções"). A correção já deu certo e já foi
  // cobrada — falha aqui só deixa o relatório fora do histórico, não pode
  // tirar o resultado da tela do usuário.
  try {
    await salvarConteudoCorrecao(outcome.data.correcaoId, user.id, {
      textoResposta: texto,
      padraoResposta: padraoResposta || null,
      relatorio: outcome.data,
    });
  } catch (error) {
    console.error("Falha ao guardar correção no histórico:", outcome.data.correcaoId, error);
  }

  return { status: "success", data: outcome.data };
}

// Falha ao devolver não pode esconder o erro original da correção — só
// registra no log pra conferência manual.
async function devolverSemFalhar(reserva: Reserva): Promise<void> {
  try {
    await devolverReserva(reserva);
  } catch (error) {
    console.error("Falha ao devolver reserva de correção:", reserva, error);
  }
}
