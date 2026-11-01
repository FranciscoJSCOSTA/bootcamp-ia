"use server";

import { BANCAS_DISPONIVEIS } from "@/lib/corretor/bancas";
import { correctEssay } from "@/lib/corretor/engine";
import type { CorrectionView } from "@/lib/corretor/types";
import { verificarLimite } from "@/lib/corretor/feedback-real/store";
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

  const outcome = await correctEssay({
    bancaId,
    tema,
    texto,
    padraoResposta: padraoResposta || undefined,
    limiteLinhas,
    limiteLinhasMinimo,
    userId: user.id,
  });

  if (!outcome.ok) {
    return { status: "error", message: outcome.error };
  }

  return { status: "success", data: outcome.data };
}
