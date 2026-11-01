import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BANCAS_DISPONIVEIS } from "@/lib/corretor/bancas";
import { CorrectionForm } from "@/components/corretor/CorrectionForm";
import { sairAction } from "@/app/entrar/actions";
import { COTA_GRATIS_POR_CONTA } from "@/lib/cobranca/config";
import { consultarGratisRestantes } from "@/lib/corretor/feedback-real/store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Corretor de questões discursivas (interno) | AvalIA Discursiva",
  robots: { index: false, follow: false },
};

export default async function CorretorPage() {
  // O proxy.ts já redireciona quem não está logado antes de chegar aqui —
  // esta é a checagem "segura" de defesa em profundidade recomendada pelo
  // próprio guia de auth do Next.js (nunca confiar só no proxy/middleware).
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/entrar?next=/corretor");
  }
  const gratisRestantes = await consultarGratisRestantes(user.id);

  return (
    <main className="flex-1 bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
            Ferramenta interna — não pública
          </p>
          <form action={sairAction} className="shrink-0">
            <span className="mr-3 text-xs text-slate-500">{user.email}</span>
            <button
              type="submit"
              className="text-xs font-medium text-slate-500 underline hover:text-slate-800"
            >
              Sair
            </button>
          </form>
        </div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Corretor de questões discursivas (teste)
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg">
          Escolha a banca, cole o enunciado da questão discursiva e o texto
          da sua resposta (e, se tiver, o documento oficial de correção). A
          avaliação é feita item por item, seguindo os critérios reais de
          cada banca — não por competências genéricas fixas.
        </p>

        <p className="mt-4 text-sm font-medium text-slate-700">
          Correções grátis restantes: {gratisRestantes} de {COTA_GRATIS_POR_CONTA}
        </p>

        <div className="mt-10">
          <CorrectionForm bancas={BANCAS_DISPONIVEIS} />
        </div>
      </div>
    </main>
  );
}
