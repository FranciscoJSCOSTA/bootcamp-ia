import { WaitlistForm } from "@/components/WaitlistForm";

const BULLETS = [
  <>
    O <span className="font-bold text-violet-300">Raio-X da Banca</span> do
    seu concurso (Cebraspe, FGV, Cesgranrio, FCC, Idecan, Vunesp e outras) —
    critério real da sua prova, não um critério genérico de redação escolar.
  </>,
  "Você vê exatamente onde perdeu ponto, competência por competência — antes de gastar mais um mês estudando na direção errada.",
  "Resposta em minutos. Chega de esperar a agenda de um professor particular, ou o resultado da prova, pra descobrir se você estava no caminho certo.",
  "Preço pensado pra quem estuda todo santo dia — não pra quem paga uma correção avulsa cara de vez em quando.",
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
      "Receba seu Raio-X da Banca — nota estimada, competência por competência, e o que ajustar em minutos.",
  },
];

const EXAMPLE_COMPETENCIES = [
  { label: "Competência 1 — Domínio da norma culta", score: 160, max: 200 },
  { label: "Competência 2 — Compreensão da proposta", score: 180, max: 200 },
  { label: "Competência 3 — Argumentação", score: 140, max: 200 },
];

const CTA_LINK_CLASSES =
  "inline-block rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-lg";

const HERO_CTA_CLASSES =
  "inline-block rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-xl";

const FAQS = [
  {
    question: (
      <>O que é esse ‘<span className="text-indigo-600">Raio-X da Banca</span>’?</>
    ),
    answer:
      "É o nome do que você recebe a cada correção: não só uma nota, mas a visão exata, competência por competência, de como a banca do seu concurso avaliaria aquele texto. A ideia é simples — você merece saber isso antes da prova, não só depois.",
  },
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
      <section className="bg-gradient-to-b from-[#312e81] to-[#4237c9] px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-8 text-3xl font-bold sm:mb-10 sm:text-4xl">
            <span className="font-sans text-white">Aval</span>
            <span className="font-sans text-indigo-300">IA</span>{" "}
            <span className="font-script text-4xl text-indigo-300 sm:text-5xl">
              Discursiva
            </span>
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Você está estudando redação no escuro — e só vai descobrir isso
            quando já for tarde demais.
          </h1>
          <p className="mt-6 text-lg text-indigo-100 sm:text-xl">
            A maioria de quem estuda pra discursiva nunca vê, de verdade, como
            a banca do seu concurso avaliaria o texto. Só descobre no
            resultado da prova — quando já não dá mais pra corrigir o rumo. A
            AvalIA Discursiva existe pra acabar com isso: o{" "}
            <span className="font-bold text-violet-300">Raio-X</span> de como
            a sua banca veria essa redação, antes da prova, não depois.
          </p>

          <div className="mt-10 text-left">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              O que é o{" "}
              <span className="font-bold text-violet-300">
                Raio-X da Banca
              </span>
              ?
            </h2>
            <p className="mt-3 text-base text-indigo-100 sm:text-lg">
              Não é uma nota. É a visão de dentro pra fora de como Cebraspe,
              FGV, FCC, Idecan, Vunesp ou a banca do seu concurso enxergaria o
              seu texto — competência por competência, com o critério real
              que vale na sua prova, não um resumo genérico de redação
              escolar. Você não sai daqui só sabendo &ldquo;está bom&rdquo; ou
              &ldquo;está ruim&rdquo;. Sai sabendo exatamente onde perdeu
              ponto, e por quê.
            </p>
          </div>

          <ul className="mt-10 space-y-4 text-left">
            {BULLETS.map((bullet, i) => (
              <li
                key={i}
                className="flex gap-3 text-base text-indigo-100 sm:text-lg"
              >
                <span className="mt-1 text-violet-300">✓</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <a href="#formulario" className={HERO_CTA_CLASSES}>
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
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
                  {step.number}
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
            Veja o Raio-X da Banca na prática
          </h2>
          <p className="mt-3 text-center text-sm text-slate-500">
            Nota estimada e feedback detalhado por competência — o formato do
            retorno que você vai receber a cada redação enviada.
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
            {FAQS.map((faq, i) => (
              <div key={i}>
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
