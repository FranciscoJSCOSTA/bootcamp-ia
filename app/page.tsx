import { WaitlistForm } from "@/components/WaitlistForm";

const BULLETS = [
  "Correção alinhada à banca do seu concurso (Cebraspe, FGV, Cesgranrio, FCC, Idecan, Vunesp e outras), não um critério genérico de redação escolar.",
  "Feedback por competência, mostrando exatamente onde você perde pontos.",
  "Resposta em minutos, sem depender da agenda de um professor particular.",
  "Preço pensado para quem estuda todo mês, não para uma correção avulsa cara.",
];

const STEPS = [
  {
    number: 1,
    title: "Envie o tema e o texto da sua redação",
  },
  {
    number: 2,
    title:
      "Nossa IA analisa segundo os critérios oficiais da banca do seu concurso",
  },
  {
    number: 3,
    title:
      "Receba nota estimada, competência por competência, e o que ajustar — em minutos",
  },
];

const EXAMPLE_COMPETENCIES = [
  { label: "Competência 1 — Domínio da norma culta", score: 160, max: 200 },
  { label: "Competência 2 — Compreensão da proposta", score: 180, max: 200 },
  { label: "Competência 3 — Argumentação", score: 140, max: 200 },
];

const FAQS = [
  {
    question: "Funciona para a banca do meu concurso?",
    answer:
      "Estamos construindo o corretor com foco nas bancas mais usadas em concursos (Cebraspe, FGV, Cesgranrio, FCC, Idecan, Vunesp e outras). Ao contar pra gente qual banca você estuda, você ajuda a definir qual banca priorizamos no lançamento.",
  },
  {
    question: "Quanto vai custar quando lançar?",
    answer:
      "Ainda estamos definindo o preço final, mas a ideia é uma assinatura mensal acessível para quem estuda todos os dias — bem diferente do valor de uma correção avulsa com professor particular. Quem entra na lista agora garante condição especial de lançamento.",
  },
  {
    question: "Quando o produto lança de verdade?",
    answer:
      "Estamos validando o interesse antes de construir a versão completa, então ainda não temos uma data fechada. Quem está na lista de espera é avisado em primeira mão, assim que o acesso abrir.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim. Guardamos apenas seu e-mail e o concurso/banca informado, usados só para te avisar sobre o lançamento — sem spam e sem compartilhar com terceiros.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-12 sm:px-6 sm:py-16">
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

        {/* Como funciona */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Como funciona
          </h2>
          <ol className="mt-8 grid gap-6 text-left sm:grid-cols-3">
            {STEPS.map((step) => (
              <li
                key={step.number}
                className="flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {step.number}
                </span>
                <p className="text-slate-700">{step.title}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Exemplo de resultado */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Veja como fica o retorno da correção
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Exemplo ilustrativo do tipo de retorno que você vai receber — não é
            o resultado de uma redação real.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              Exemplo ilustrativo
            </span>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-indigo-600">780</span>
              <span className="text-slate-500">
                / 1000 pontos (nota estimada)
              </span>
            </div>

            <ul className="mt-6 space-y-3">
              {EXAMPLE_COMPETENCIES.map((competency) => (
                <li
                  key={competency.label}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 text-sm sm:text-base"
                >
                  <span className="text-slate-700">{competency.label}</span>
                  <span className="whitespace-nowrap font-semibold text-slate-900">
                    {competency.score}/{competency.max}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              <strong>Ponto de melhoria:</strong> reforce a conexão entre os
              argumentos do 2º parágrafo — a banca considerou a progressão
              textual abaixo do esperado.
            </div>
          </div>
        </section>

        {/* Cadastro */}
        <section className="mt-16">
          <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-800">
            Os 100 primeiros cadastrados garantem 1 mês grátis quando
            lançarmos.
          </div>

          <div className="flex justify-center">
            <WaitlistForm />
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Sem spam. Usamos seu e-mail só para avisar sobre o lançamento.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-16 text-left">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Perguntas frequentes
          </h2>
          <div className="mt-8 space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.question}>
                <p className="font-semibold text-slate-900">
                  {faq.question}
                </p>
                <p className="mt-1 text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
