"use server";

import { BANCAS_DISPONIVEIS } from "@/lib/corretor/bancas";
import { correctEssay } from "@/lib/corretor/engine";
import type { CorrectionView } from "@/lib/corretor/types";

export type CorrectorState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; data: CorrectionView };

export async function correctEssayAction(
  _prevState: CorrectorState,
  formData: FormData,
): Promise<CorrectorState> {
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
  });

  if (!outcome.ok) {
    return { status: "error", message: outcome.error };
  }

  return { status: "success", data: outcome.data };
}
