"use server";

import { supabase } from "@/lib/supabase/client";

export type WaitlistState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToWaitlist(
  _prevState: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim();
  const concursoBanca = String(formData.get("concursoBanca") ?? "").trim();

  if (!EMAIL_REGEX.test(email)) {
    return { status: "error", message: "Digite um e-mail válido." };
  }

  if (!concursoBanca) {
    return {
      status: "error",
      message: "Conta pra gente qual concurso ou banca você estuda.",
    };
  }

  const { error } = await supabase
    .from("waitlist_leads")
    .insert({ email, concurso_banca: concursoBanca });

  if (error) {
    console.error("Erro ao salvar lead na waitlist:", error);
    return {
      status: "error",
      message: "Não conseguimos salvar seu contato agora. Tenta de novo em instantes.",
    };
  }

  return {
    status: "success",
    message: "Prontinho! Vamos te avisar assim que lançar.",
  };
}
