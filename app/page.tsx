import { WaitlistForm } from "@/components/WaitlistForm";
import { RaioXReportCard } from "@/components/RaioXReportCard";
import { FaqAccordion } from "@/components/FaqAccordion";
import {
  BoltIcon,
  ChartBarIcon,
  ClockIcon,
  ListChecksIcon,
  MailIcon,
  ReportIcon,
  ShieldCheckIcon,
  SparkleIcon,
  TargetIcon,
  TrendingUpIcon,
} from "@/components/icons";

const HERO_BULLETS = [
  "Raio-X completo, competência por competência.",
  "Baseado nos critérios reais da sua banca.",
  "Resultado em minutos, não semanas.",
];

const TRUST_ITEMS = [
  {
    icon: ShieldCheckIcon,
    label: "Correção baseada nos critérios das principais bancas",
  },
  { icon: ClockIcon, label: "Resultado em poucos minutos" },
  { icon: ListChecksIcon, label: "Feedback extremamente detalhado" },
];

const BENEFITS = [
  {
    icon: TargetIcon,
    title: "Raio-X completo da Banca",
    description:
      "Veja exatamente como Cebraspe, FGV, FCC, Idecan, Vunesp (ou a banca do seu concurso) avaliaria sua redação, competência por competência.",
  },
  {
    icon: BoltIcon,
    title: "Correção em minutos",
    description:
      "Sem esperar a agenda de um professor particular, nem o resultado da prova pra descobrir se você estava no caminho certo.",
  },
  {
    icon: ChartBarIcon,
    title: "Feedback por competência",
    description:
      'Nada de "está bom" ou "está ruim". Você vê exatamente onde perdeu ponto — e por quê.',
  },
  {
    icon: TrendingUpIcon,
    title: "Plano de melhoria",
    description:
      "Cada Raio-X vem com sugestões práticas do que ajustar na próxima redação.",
  },
];

const STEPS = [
  {
    number: 1,
    icon: MailIcon,
    title: "Envie sua redação (quando o produto lançar)",
  },
  {
    number: 2,
    icon: SparkleIcon,
    title: "Nossa IA analisa com os critérios da banca do seu concurso",
  },
  {
    number: 3,
    icon: ReportIcon,
    title:
      "Receba seu Raio-X da Banca — nota, competências e sugestões detalhadas",
  },
];

const EXAMPLE_COMPETENCIES = [
  { label: "Competência 1 — Domínio da norma culta", score: 160, max: 200 },
  { label: "Competência 2 — Compreensão da proposta", score: 180, max: 200 },
  { label: "Competência 3 — Argumentação", score: 140, max: 200 },
  { label: "Competência 4 — Coesão textual", score: 150, max: 200 },
  { label: "Competência 5 — Proposta de intervenção", score: 150, max: 200 },
];

const EXAMPLE_STRENGTHS = [
  "Repertório sociocultural bem articulado na introdução.",
  "Domínio consistente da norma culta ao longo do texto.",
];

const EXAMPLE_WEAKNESSES = [
  "Progressão textual fraca entre o 2º e o 3º parágrafo.",
  "Proposta de intervenção sem detalhamento do agente executor.",
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
      <section className="bg-gradient-to-b from-[#312e81] to-[#4237c9] px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-10 text-center text-2xl font-bold sm:text-3xl lg:mb-14 lg:text-left">
            <span className="font-sans text-white">Aval</span>
            <span className="font-sans text-indigo-300">IA</span>{" "}
            <span className="font-script text-3xl text-indigo-300 sm:text-4xl">
              Discursiva
            </span>
          </p>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-violet-200 ring-1 ring-inset ring-white/20">
                Lista de espera aberta
              </span>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-5xl">
                Descubra o{" "}
                <span className="text-violet-300">Raio-X</span> de como a
                banca veria sua redação — antes da prova, não depois.
              </h1>

              <p className="mt-6 text-lg text-indigo-100 sm:text-xl">
                A IA simula a correção da banca do seu concurso e devolve o
                seu Raio-X da Banca — nota estimada, competência por
                competência, pontos fortes, pontos de atenção e o que
                ajustar. Assim você nunca mais entra numa prova sem saber
                exatamente onde está.
              </p>

              <ul className="mx-auto mt-8 max-w-md space-y-3 text-left lg:mx-0">
                {HERO_BULLETS.map((bullet) => (
                  <li
                    key={bullet}
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
                <p className="mt-3 text-sm text-indigo-200">
                  Lista de espera — sem cobrança agora.
                </p>
              </div>
            </div>

            <div>
              <RaioXReportCard
                variant="compact"
                score={780}
                maxScore={1000}
                competencies={EXAMPLE_COMPETENCIES}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Barra de confiança */}
      <section className="border-b border-slate-100 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-10">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-sm font-medium text-slate-600"
            >
              <item.icon className="h-5 w-5 flex-shrink-0 text-indigo-500" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Benefícios */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Por que o Raio-X da Banca
            </h2>
            <p className="mt-3 text-base text-slate-600 sm:text-lg">
              Quatro razões pra parar de estudar redação no escuro.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                  <benefit.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  {benefit.title}
                </p>
                <p className="mt-2 text-sm text-slate-600 sm:text-base">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Como funciona
          </h2>

          <div className="relative mt-14 grid gap-10 sm:grid-cols-3">
            <div
              className="absolute top-8 right-0 left-0 hidden h-px bg-slate-200 sm:block"
              aria-hidden
            />
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white text-indigo-600 shadow-md ring-1 ring-slate-200">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="mt-4 text-xs font-bold tracking-wide text-indigo-500 uppercase">
                  Passo {step.number}
                </span>
                <p className="mt-2 max-w-xs text-base text-slate-700 sm:text-lg">
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Raio-X da Banca — mockup do relatório */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Veja o Raio-X da Banca na prática
            </h2>
            <p className="mt-3 text-base text-slate-600 sm:text-lg">
              Nota estimada, feedback por competência, pontos fortes e o que
              ajustar — o formato do retorno que você vai receber a cada
              redação enviada.
            </p>
          </div>

          <div className="mt-10">
            <RaioXReportCard
              variant="full"
              score={780}
              maxScore={1000}
              competencies={EXAMPLE_COMPETENCIES}
              strengths={EXAMPLE_STRENGTHS}
              weaknesses={EXAMPLE_WEAKNESSES}
              suggestion="reforce a conexão entre os argumentos do 2º parágrafo e detalhe quem executa a proposta de intervenção — isso costuma custar pontos na competência 5."
            />
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
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/5 sm:p-8">
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
          <FaqAccordion items={FAQS} />
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
