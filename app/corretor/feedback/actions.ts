"use server";

import { getRegistro, registrarFeedbackReal } from "@/lib/corretor/feedback-real/store";
import type { CorrecaoRegistrada } from "@/lib/corretor/feedback-real/types";

export type FeedbackState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; registro: CorrecaoRegistrada };

export async function registrarFeedbackRealAction(
  _prevState: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  const correcaoId = String(formData.get("correcaoId") ?? "").trim();
  const notaRealRaw = String(formData.get("notaReal") ?? "").trim();
  const observacao = String(formData.get("observacao") ?? "").trim();

  if (!correcaoId) {
    return { status: "error", message: "Informe o código da correção." };
  }
  const notaReal = Number(notaRealRaw.replace(",", "."));
  if (!notaRealRaw || !Number.isFinite(notaReal)) {
    return { status: "error", message: "Informe a nota real como um número." };
  }

  const registroExistente = await getRegistro(correcaoId);
  if (!registroExistente) {
    return {
      status: "error",
      message: "Correção não encontrada. Confira se o código foi colado corretamente.",
    };
  }

  const resultado = await registrarFeedbackReal({
    correcaoId,
    notaReal,
    observacao: observacao || undefined,
  });

  if (!resultado.ok) {
    return { status: "error", message: resultado.error };
  }

  return { status: "success", registro: resultado.registro };
}
