"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { dominioDoEmail, emailDescartavel, MENSAGEM_EMAIL_DESCARTAVEL } from "@/lib/anti-abuso/email";
import { caminhoInterno } from "@/lib/caminho-interno";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type EntrarState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "sent"; email: string };

async function getOrigin(): Promise<string> {
  const headerList = await headers();
  const origin = headerList.get("origin");
  if (origin) return origin;
  const host = headerList.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  return `${proto}://${host}`;
}

export async function enviarMagicLinkAction(
  _prevState: EntrarState,
  formData: FormData,
): Promise<EntrarState> {
  const email = String(formData.get("email") ?? "").trim();
  const next = caminhoInterno(String(formData.get("next") ?? "").trim());

  if (!email || !dominioDoEmail(email)) {
    return { status: "error", message: "Informe um e-mail válido." };
  }
  if (emailDescartavel(email)) {
    return { status: "error", message: MENSAGEM_EMAIL_DESCARTAVEL };
  }

  const supabase = await createSupabaseServerClient();
  const origin = await getOrigin();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    return { status: "error", message: "Não foi possível enviar o link. Tente novamente em instantes." };
  }

  return { status: "sent", email };
}

export async function sairAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/entrar");
}
