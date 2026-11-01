"use server";

import { redirect } from "next/navigation";
import { apagarMinhaCorrecao } from "@/lib/corretor/feedback-real/store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function apagarCorrecaoAction(formData: FormData): Promise<void> {
  // Defesa em profundidade (o proxy.ts já protege /corretor/*): o id vem do
  // formulário, mas o dono vem da sessão — apagarMinhaCorrecao só mexe em
  // correção desse usuário.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=/corretor/historico");

  const correcaoId = String(formData.get("correcaoId") ?? "").trim();
  await apagarMinhaCorrecao(correcaoId, user.id);
  redirect("/corretor/historico?apagada=1");
}
