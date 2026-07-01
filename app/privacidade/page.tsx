import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | AvalIA Discursiva",
  description:
    "Como a AvalIA Discursiva coleta e usa seus dados durante a fase de validação do produto.",
};

export default function PrivacidadePage() {
  return (
    <main className="flex-1 bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-left">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Voltar para a página inicial
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
          Política de Privacidade
        </h1>

        <div className="mt-8 space-y-6 text-base text-slate-700 sm:text-lg">
          <p>
            A AvalIA Discursiva está atualmente em fase de validação: ainda
            não lançamos o produto de correção de redação, e esta página
            existe apenas para captar o interesse de quem estuda para
            concursos públicos.
          </p>

          <p>
            <strong>Quais dados coletamos:</strong> quando você se cadastra na
            lista de espera, guardamos apenas o seu e-mail e o concurso ou
            banca que você informou estudar.
          </p>

          <p>
            <strong>Para que usamos esses dados:</strong> exclusivamente para
            avisar você sobre o lançamento do produto e para entender quais
            bancas priorizar no desenvolvimento. Não vendemos, alugamos ou
            compartilhamos seus dados com terceiros, e não enviamos spam.
          </p>

          <p>
            <strong>Por quanto tempo guardamos:</strong> enquanto o produto
            estiver em fase de validação/pré-lançamento, ou até você pedir a
            remoção.
          </p>

          <p>
            <strong>Como pedir a remoção dos seus dados:</strong> envie um
            e-mail para{" "}
            <a
              href="mailto:contato@avaliadiscursiva.com.br"
              className="text-indigo-600 hover:underline"
            >
              contato@avaliadiscursiva.com.br
            </a>{" "}
            solicitando a exclusão do seu cadastro. Atendemos o pedido o
            quanto antes.
          </p>

          <p>
            Esta política pode ser atualizada conforme o produto evolui.
            Qualquer dúvida, é só mandar um e-mail.
          </p>
        </div>
      </div>
    </main>
  );
}
