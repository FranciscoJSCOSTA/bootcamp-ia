import Link from "next/link";
import { BANCAS_DISPONIVEIS } from "@/lib/corretor/bancas";
import {
  COTA_GRATIS_POR_CONTA,
  formatarPreco,
  PACOTES,
  PRAZO_ARREPENDIMENTO_DIAS,
} from "@/lib/cobranca/config";

// Preços, cota grátis e bancas vêm da config e do motor — a página nunca
// promete algo diferente do que o produto cobra/faz.

const CTA_GRATIS = `Fazer minhas ${COTA_GRATIS_POR_CONTA} correções grátis`;

const BULLETS = [
  <>
    O <span className="font-bold text-violet-300">Raio-X da Banca</span> da sua
    prova: a resposta é avaliada item por item, no critério da banca que você
    escolher — não num critério genérico de redação escolar.
  </>,
  "Você vê onde perdeu ponto, por quê e o que ajustar — antes de gastar mais um mês estudando na direção errada.",
  "Resposta em minutos. Sem esperar a agenda de um professor nem o resultado da prova.",
  <>
    Comece com <strong className="text-white">{COTA_GRATIS_POR_CONTA} correções grátis</strong>,
    sem cartão. Depois, pacotes avulsos a partir de{" "}
    {formatarPreco(Math.min(...PACOTES.map((p) => Math.round(p.precoCentavos / p.creditos))))} por
    correção — sem assinatura.
  </>,
];

const STEPS = [
  "Escolha a banca e cole o enunciado e a sua resposta (e, se tiver, o padrão de resposta oficial).",
  "A IA avalia a resposta seguindo os critérios daquela banca, item por item.",
  "Receba o Raio-X da Banca: nota estimada, pontos fortes, onde perdeu ponto e sugestões. Fica salvo em “Minhas correções”.",
];

// Exemplo no formato real do relatório (itens da banca + pontos de melhoria).
const EXEMPLO_ITENS = [
  { label: "Item 1 — Conceito de controle externo", score: 2.5, max: 3 },
  { label: "Item 2 — Competências do Tribunal de Contas", score: 2.0, max: 3 },
  { label: "Item 3 — Exemplo de fiscalização operacional", score: 1.0, max: 2 },
  { label: "Apresentação e estrutura textual", score: 1.5, max: 2 },
];
const EXEMPLO_NOTA = EXEMPLO_ITENS.reduce((s, i) => s + i.score, 0);
const EXEMPLO_MAX = EXEMPLO_ITENS.reduce((s, i) => s + i.max, 0);
const num = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

const FAQS: { question: React.ReactNode; answer: React.ReactNode }[] = [
  {
    question: (
      <>
        O que é o ‘<span className="text-indigo-600">Raio-X da Banca</span>’?
      </>
    ),
    answer:
      "É o que você recebe a cada correção: não só uma nota, mas a visão de como a banca escolhida avaliaria aquela resposta — item por item, com o que você acertou, onde perdeu ponto e o que ajustar.",
  },
  {
    question: "A nota é a nota oficial da banca?",
    answer:
      "Não. É uma estimativa feita por IA seguindo os critérios públicos da banca, para você estudar com direção. Ela não substitui a correção oficial e não garante nota ou aprovação. Se você tiver o padrão de resposta oficial da questão, cole junto: a estimativa fica mais precisa.",
  },
  {
    question: "Quanto custa?",
    answer: (
      <>
        Toda pessoa começa com {COTA_GRATIS_POR_CONTA} correções grátis. Depois, você compra
        créditos avulsos: {PACOTES.map((p) => `${p.creditos} por ${formatarPreco(p.precoCentavos)}`).join(" ou ")}.
        Cada correção usa 1 crédito. Não é assinatura: não há cobrança recorrente.
      </>
    ),
  },
  {
    question: "Os créditos expiram?",
    answer: "Não. Ficam na sua conta até você usar.",
  },
  {
    question: "E se a correção der erro?",
    answer:
      "O crédito (ou a correção grátis) volta automaticamente. Só é descontada a correção que você recebe completa na tela.",
  },
  {
    question: "Posso pedir reembolso?",
    answer: `Sim. Em até ${PRAZO_ARREPENDIMENTO_DIAS} dias da compra você pode desistir e receber o valor integral de volta, mesmo que já tenha usado créditos.`,
  },
  {
    question: "Meus textos são usados para treinar IA?",
    answer:
      "Não. Seus textos são usados só para gerar a sua correção e mostrar o seu histórico — nem nós nem o nosso fornecedor de IA os usam para treinar modelos. E você pode apagar qualquer correção quando quiser.",
  },
  {
    question: "Preciso criar senha?",
    answer:
      "Não. Você informa seu e-mail e recebe um link de acesso. E-mails temporários não são aceitos.",
  },
];

const CTA_LINK_CLASSES =
  "inline-block rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-lg";

const HERO_CTA_CLASSES =
  "inline-block rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-xl";

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#312e81] to-[#4237c9] px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-8 text-3xl font-bold sm:mb-10 sm:text-4xl">
            <span className="font-sans text-white">Aval</span>
            <span className="font-sans text-indigo-300">IA</span>{" "}
            <span className="font-script text-4xl text-indigo-300 sm:text-5xl">Discursiva</span>
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Você está estudando discursiva no escuro — e só vai descobrir isso
            quando já for tarde demais.
          </h1>
          <p className="mt-6 text-lg text-indigo-100 sm:text-xl">
            A maioria de quem estuda pra discursiva nunca vê como a banca do seu
            concurso avaliaria a resposta. Só descobre no resultado da prova —
            quando já não dá mais pra corrigir o rumo. A AvalIA Discursiva te
            mostra o <span className="font-bold text-violet-300">Raio-X</span>{" "}
            disso antes da prova, não depois.
          </p>

          <ul className="mt-10 space-y-4 text-left">
            {BULLETS.map((bullet, i) => (
              <li key={i} className="flex gap-3 text-base text-indigo-100 sm:text-lg">
                <span className="mt-1 text-violet-300">✓</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Link href="/entrar" className={HERO_CTA_CLASSES}>
              {CTA_GRATIS}
            </Link>
            <p className="mt-3 text-sm text-indigo-200">Sem cartão. Sem assinatura.</p>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">Como funciona</h2>
          <ol className="mt-10 grid gap-8 text-left sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={i}
                className="flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
                  {i + 1}
                </div>
                <p className="text-base text-slate-700 sm:text-lg">{step}</p>
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
            Nota estimada e avaliação item por item — o formato do retorno que você recebe a cada
            resposta enviada.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md sm:p-8">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              Exemplo ilustrativo
            </span>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-indigo-600 sm:text-5xl">{num(EXEMPLO_NOTA)}</span>
              <span className="text-slate-500">/ {num(EXEMPLO_MAX)} pontos (nota estimada)</span>
            </div>

            <ul className="mt-8 space-y-5">
              {EXEMPLO_ITENS.map((item) => (
                <li key={item.label}>
                  <div className="flex items-center justify-between gap-4 text-sm sm:text-base">
                    <span className="text-slate-700">{item.label}</span>
                    <span className="whitespace-nowrap font-semibold text-slate-900">
                      {num(item.score)}/{num(item.max)}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
              <strong>Onde você perdeu ponto:</strong> o item 3 pede um exemplo concreto de fiscalização
              operacional, e a resposta só define o conceito — a banca costuma pontuar o exemplo
              separadamente.
            </div>
          </div>
        </div>
      </section>

      {/* Bancas */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {BANCAS_DISPONIVEIS.length} bancas disponíveis
          </h2>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {BANCAS_DISPONIVEIS.map((b) => (
              <li
                key={b.id}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700"
              >
                {b.nome}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="bg-indigo-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Comece grátis. Pague só pelo que usar.
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Sem assinatura e sem cobrança recorrente. Créditos não expiram.
          </p>

          <div className="mt-10 grid gap-6 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-indigo-600">Para começar</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">Grátis</p>
              <p className="mt-2 text-slate-600">
                {COTA_GRATIS_POR_CONTA} correções completas, sem cartão.
              </p>
            </div>
            {PACOTES.map((p) => (
              <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-indigo-600">{p.creditos} correções</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{formatarPreco(p.precoCentavos)}</p>
                <p className="mt-2 text-slate-600">
                  {formatarPreco(Math.round(p.precoCentavos / p.creditos))} por correção. Pix ou cartão.
                </p>
              </div>
            ))}
          </div>

          <ul className="mx-auto mt-8 max-w-xl space-y-2 text-left text-sm text-slate-600">
            <li>✓ O crédito só é descontado quando a correção sai completa — se der erro, ele volta.</li>
            <li>
              ✓ Arrependimento em até {PRAZO_ARREPENDIMENTO_DIAS} dias com reembolso integral.
            </li>
          </ul>

          <Link href="/entrar" className={`mt-10 ${CTA_LINK_CLASSES}`}>
            {CTA_GRATIS}
          </Link>
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
                <p className="text-base font-semibold text-slate-900 sm:text-lg">{faq.question}</p>
                <p className="mt-2 text-base text-slate-600 sm:text-lg">{faq.answer}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-slate-500">
            Detalhes nos{" "}
            <Link href="/termos" className="text-indigo-600 hover:underline">
              Termos de Uso
            </Link>{" "}
            e na{" "}
            <Link href="/privacidade" className="text-indigo-600 hover:underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CTA de fechamento */}
      <section className="bg-gradient-to-b from-[#312e81] to-[#4237c9] px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Descubra como a banca veria a sua resposta.
          </h2>
          <p className="mt-3 text-base text-indigo-100 sm:text-lg">
            Leva menos de um minuto para entrar — só o seu e-mail.
          </p>
          <Link href="/entrar" className={`mt-8 ${HERO_CTA_CLASSES}`}>
            {CTA_GRATIS}
          </Link>
        </div>
      </section>
    </main>
  );
}
