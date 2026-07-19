import type { Metadata } from "next";
import { FeedbackForm } from "@/components/corretor/FeedbackForm";

export const metadata: Metadata = {
  title: "Registrar nota real | AvalIA Discursiva",
  robots: { index: false, follow: false },
};

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <main className="flex-1 bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
          Ferramenta interna — não pública
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Registrar nota real
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg">
          Depois que o resultado oficial da banca sair, volte aqui e informe a
          nota real que você recebeu naquela questão. É a única forma de saber,
          com base em fato e não suposição, se o corretor está calibrado bem ou
          mal ao longo do tempo — isso não altera nenhuma correção
          automaticamente.
        </p>

        <div className="mt-10">
          <FeedbackForm correcaoIdInicial={id ?? ""} />
        </div>
      </div>
    </main>
  );
}
