import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BotaoApagarCorrecao } from "@/components/corretor/BotaoApagarCorrecao";
import { CorrectionReport } from "@/components/corretor/CorrectionReport";
import { getMinhaCorrecao } from "@/lib/corretor/feedback-real/store";
import { formatarData, nomeDaBanca } from "@/lib/corretor/formatacao";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Correção | AvalIA Discursiva",
  robots: { index: false, follow: false },
};

export default async function CorrecaoDoHistoricoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Defesa em profundidade — o proxy.ts já redireciona quem não está logado.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/entrar?next=${encodeURIComponent(`/corretor/historico/${id}`)}`);

  // Correção de outro usuário, apagada ou inexistente: 404 igual pras três.
  const correcao = await getMinhaCorrecao(id, user.id);
  if (!correcao) notFound();

  return (
    <main className="flex-1 bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/corretor/historico" className="text-sm font-medium text-indigo-600 hover:underline">
          ← Minhas correções
        </Link>
        <p className="mt-4 text-xs text-slate-500">
          {formatarData(correcao.criadoEm)} · {nomeDaBanca(correcao.bancaId)}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Correção</h1>

        <section className="mt-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-700">Enunciado</h2>
            <p className="mt-1 whitespace-pre-wrap rounded-lg bg-white p-4 text-sm text-slate-800 shadow-sm">
              {correcao.tema}
            </p>
          </div>
          {correcao.textoResposta && (
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Sua resposta</h2>
              <p className="mt-1 whitespace-pre-wrap rounded-lg bg-white p-4 text-sm text-slate-800 shadow-sm">
                {correcao.textoResposta}
              </p>
            </div>
          )}
          {correcao.padraoResposta && (
            <details className="rounded-lg bg-white p-4 text-sm shadow-sm">
              <summary className="cursor-pointer font-semibold text-slate-700">
                Padrão de resposta informado
              </summary>
              <p className="mt-2 whitespace-pre-wrap text-slate-800">{correcao.padraoResposta}</p>
            </details>
          )}
        </section>

        <div className="mt-8">
          {correcao.relatorio ? (
            <CorrectionReport data={correcao.relatorio} />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              <p>
                Nota estimada: <strong>{correcao.notaEstimada}</strong> / {correcao.notaMaxima}
              </p>
              <p className="mt-2">
                Esta correção é anterior ao histórico, então o relatório completo não foi guardado.
              </p>
            </div>
          )}
        </div>

        {correcao.feedbackReal && (
          <p className="mt-4 text-sm text-slate-700">
            Nota real registrada: <strong>{correcao.feedbackReal.notaReal}</strong> / {correcao.notaMaxima}
          </p>
        )}

        <div className="mt-10 border-t border-slate-200 pt-6">
          <BotaoApagarCorrecao correcaoId={correcao.correcaoId} />
          <p className="mt-2 text-xs text-slate-500">
            Apaga o enunciado, a sua resposta e o relatório de forma definitiva.
          </p>
        </div>
      </div>
    </main>
  );
}
