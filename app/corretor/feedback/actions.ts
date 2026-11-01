"use server";

import { registrarFeedbackReal } from "@/lib/corretor/feedback-real/store";
import type { CorrecaoRegistrada } from "@/lib/corretor/feedback-real/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type FeedbackState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; registro: CorrecaoRegistrada };

export async function registrarFeedbackRealAction(
  _prevState: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  // Defesa em profundidade (o proxy.ts já protege /corretor/*): a Server
  // Action é um endpoint POST próprio e precisa saber QUEM está registrando,
  // pra só aceitar correções do próprio usuário.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Sessão expirada. Faça login de novo." };
  }

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

  // A checagem de dono fica dentro do store (getRegistroDoUsuario): correção
  // de outro usuário recebe a mesma mensagem de "não encontrada".
  const resultado = await registrarFeedbackReal({
    correcaoId,
    userId: user.id,
    notaReal,
    observacao: observacao || undefined,
  });

  if (!resultado.ok) {
    return { status: "error", message: resultado.error };
  }

  return { status: "success", registro: resultado.registro };
}
