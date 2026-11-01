import type { Metadata } from "next";
import { EntrarForm } from "@/components/auth/EntrarForm";
import { caminhoInterno } from "@/lib/caminho-interno";

export const metadata: Metadata = {
  title: "Entrar | AvalIA Discursiva",
  robots: { index: false, follow: false },
};

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; erro?: string }>;
}) {
  const { next, erro } = await searchParams;

  return (
    <main className="flex-1 bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-md">
        <p className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
          AvalIA Discursiva
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Entrar</h1>
        <p className="mt-3 text-base text-slate-600">
          Informe seu e-mail e enviaremos um link de acesso — sem senha pra lembrar.
        </p>

        {erro === "link_invalido" && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            Esse link expirou ou já foi usado. Peça um novo abaixo.
          </p>
        )}

        <div className="mt-10">
          <EntrarForm nextPath={caminhoInterno(next)} />
        </div>
      </div>
    </main>
  );
}
