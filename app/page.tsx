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
    icon: "📝",
    title: "Envie o tema e o texto da sua redação",
  },
  {
    number: 2,
    icon: "🤖",
    title:
      "Nossa IA analisa segundo os critérios oficiais da banca do seu concurso",
  },
  {
    number: 3,
    icon: "📊",
    title:
      "Receba nota estimada, competência por competência, e o que ajustar — em minutos",
  },
];

const EXAMPLE_COMPETENCIES = [
  { label: "Competência 1 — Domínio da norma culta", score: 160, max: 200 },
  { label: "Competência 2 — Compreensão da proposta", score: 180, max: 200 },
  { label: "Competência 3 — Argumentação", score: 140, max: 200 },
];

const CTA_LINK_CLASSES =
  "inline-block rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-lg";

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
    <main className="flex-1 bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50 to-white px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-8 text-3xl font-bold sm:mb-10 sm:text-4xl">
            <span className="text-slate-900">Aval</span>
            <span className="text-indigo-600">IA</span>{" "}
            <span className="font-script text-4xl text-indigo-600 sm:text-5xl">
              Discursiva
            </span>
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Sua redação pode estar perdendo pontos que você nem percebe
          </h1>
          <p className="mt-6 text-lg text-slate-700 sm:text-xl">
            Um corretor de redação com IA treinado para avaliar seu texto do
            jeito que a banca do seu concurso avalia — não com critérios
            genéricos de redação escolar.
          </p>

          <ul className="mt-10 space-y-4 text-left">
            {BULLETS.map((bullet) => (
              <li
                key={bullet}
                className="flex gap-3 text-base text-slate-700 sm:text-lg"
              >
                <span className="mt-1 text-indigo-600">✓</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <a href="#formulario" className={CTA_LINK_CLASSES}>
              Quero garantir minha vaga
            </a>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Como funciona
          </h2>
          <ol className="mt-10 grid gap-8 text-left sm:grid-cols-3">
            {STEPS.map((step) => (
              <li
                key={step.number}
                className="flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-2xl">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow">
                    {step.number}
                  </span>
                </div>
                <p className="text-base text-slate-700 sm:text-lg">
                  {step.title}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Exemplo de resultado */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Veja como fica o retorno da correção
          </h2>
          <p className="mt-3 text-center text-sm text-slate-500">
            Exemplo ilustrativo do tipo de retorno que você vai receber — não é
            o resultado de uma redação real.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md sm:p-8">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              Exemplo ilustrativo
            </span>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-indigo-600 sm:text-5xl">
                780
              </span>
              <span className="text-slate-500">
                / 1000 pontos (nota estimada)
              </span>
            </div>

            <ul className="mt-8 space-y-5">
              {EXAMPLE_COMPETENCIES.map((competency) => (
                <li key={competency.label}>
                  <div className="flex items-center justify-between gap-4 text-sm sm:text-base">
                    <span className="text-slate-700">{competency.label}</span>
                    <span className="whitespace-nowrap font-semibold text-slate-900">
                      {competency.score}/{competency.max}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${(competency.score / competency.max) * 100}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
              <strong>Ponto de melhoria:</strong> reforce a conexão entre os
              argumentos do 2º parágrafo — a banca considerou a progressão
              textual abaixo do esperado.
            </div>
          </div>
        </div>
      </section>

      {/* Cadastro */}
      <section
        id="formulario"
        className="bg-indigo-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
            Os 100 primeiros cadastrados garantem 1 mês grátis quando
            lançarmos.
          </span>

          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <WaitlistForm />
              <p className="mt-4 text-xs text-slate-500">
                Sem spam. Seus dados são protegidos conforme a LGPD e usados
                só para avisar sobre o lançamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-left">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Perguntas frequentes
          </h2>
          <div className="mt-10 space-y-8">
            {FAQS.map((faq) => (
              <div key={faq.question}>
                <p className="text-base font-semibold text-slate-900 sm:text-lg">
                  {faq.question}
                </p>
                <p className="mt-2 text-base text-slate-600 sm:text-lg">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA de fechamento */}
      <section className="bg-indigo-50 px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Pronto para garantir sua vaga?
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Cadastre seu e-mail e o concurso que você estuda — leva menos de
            um minuto.
          </p>
          <a href="#formulario" className={`mt-8 ${CTA_LINK_CLASSES}`}>
            Quero garantir minha vaga
          </a>
        </div>
      </section>
    </main>
  );
}
