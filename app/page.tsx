import { WaitlistForm } from "@/components/WaitlistForm";

const BULLETS = [
  "Correção alinhada à banca do seu concurso (Cebraspe, FGV, Cesgranrio, FCC, Idecan, Vunesp e outras), não um critério genérico de redação escolar.",
  "Feedback por competência, mostrando exatamente onde você perde pontos.",
  "Resposta em minutos, sem depender da agenda de um professor particular.",
  "Preço pensado para quem estuda todo mês, não para uma correção avulsa cara.",
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Sua redação pode estar perdendo pontos que você nem percebe
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Um corretor de redação com IA treinado para avaliar seu texto do
          jeito que a banca do seu concurso avalia — não com critérios
          genéricos de redação escolar.
        </p>

        <ul className="mt-10 space-y-4 text-left">
          {BULLETS.map((bullet) => (
            <li key={bullet} className="flex gap-3 text-slate-700">
              <span className="mt-1 text-indigo-600">✓</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <WaitlistForm />
        </div>
      </div>
    </main>
  );
}
