import type { Metadata } from "next";
import { BANCAS_DISPONIVEIS } from "@/lib/corretor/bancas";
import { CorrectionForm } from "@/components/corretor/CorrectionForm";

export const metadata: Metadata = {
  title: "Corretor de questões discursivas (interno) | AvalIA Discursiva",
  robots: { index: false, follow: false },
};

export default function CorretorPage() {
  return (
    <main className="flex-1 bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
          Ferramenta interna — não pública
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Corretor de questões discursivas (teste)
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg">
          Escolha a banca, cole o enunciado da questão discursiva e o texto
          da sua resposta (e, se tiver, o documento oficial de correção). A
          avaliação é feita item por item, seguindo os critérios reais de
          cada banca — não por competências genéricas fixas.
        </p>

        <div className="mt-10">
          <CorrectionForm bancas={BANCAS_DISPONIVEIS} />
        </div>
      </div>
    </main>
  );
}
