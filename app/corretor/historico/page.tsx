import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { listarMinhasCorrecoes } from "@/lib/corretor/feedback-real/store";
import { formatarData, nomeDaBanca } from "@/lib/corretor/formatacao";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Minhas correções | AvalIA Discursiva",
  robots: { index: false, follow: false },
};

export default async function HistoricoPage({
  searchParams,
}: {
  searchParams: Promise<{ apagada?: string }>;
}) {
  // Defesa em profundidade — o proxy.ts já redireciona quem não está logado.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=/corretor/historico");

  const { apagada } = await searchParams;
  const correcoes = await listarMinhasCorrecoes(user.id);

  return (
    <main className="flex-1 bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/corretor" className="text-sm font-medium text-indigo-600 hover:underline">
          ← Nova correção
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Minhas correções</h1>

        {apagada === "1" && (
          <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            Correção apagada.
          </p>
        )}

        {correcoes.length === 0 ? (
          <p className="mt-8 text-slate-600">
            Você ainda não tem correções.{" "}
            <Link href="/corretor" className="font-medium text-indigo-600 hover:underline">
              Fazer a primeira
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {correcoes.map((c) => (
              <li key={c.correcaoId}>
                <Link
                  href={`/corretor/historico/${c.correcaoId}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-300"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">
                      {formatarData(c.criadoEm)} · {nomeDaBanca(c.bancaId)}
                    </p>
                    <p className="mt-1 truncate font-medium text-slate-900">{c.tema}</p>
                  </div>
                  <p className="shrink-0 text-lg font-bold text-indigo-600">
                    {c.notaEstimada}
                    <span className="text-sm font-normal text-slate-500"> / {c.notaMaxima}</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
