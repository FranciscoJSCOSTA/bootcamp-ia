import type { Metadata } from "next";
import Link from "next/link";
import { IdentificacaoResponsavel, PaginaLegal, SecaoLegal } from "@/components/PaginaLegal";
import {
  COTA_GRATIS_POR_CONTA,
  formatarPreco,
  PACOTES,
  PRAZO_ARREPENDIMENTO_DIAS,
  VENDAS_ABERTAS,
} from "@/lib/cobranca/config";
import { EMPRESA } from "@/lib/empresa";

export const metadata: Metadata = {
  title: "Termos de Uso | AvalIA Discursiva",
  description: "Regras de uso do AvalIA Discursiva: correções grátis, créditos, reembolso e arrependimento.",
};

const email = (
  <a href={`mailto:${EMPRESA.email}`} className="text-indigo-600 hover:underline">
    {EMPRESA.email}
  </a>
);

export default function TermosPage() {
  return (
    <PaginaLegal titulo="Termos de Uso">
      <SecaoLegal titulo="1. Quem somos">
        <p>O AvalIA Discursiva (www.avaliadiscursiva.com.br) é oferecido por:</p>
        <IdentificacaoResponsavel {...EMPRESA} />
        <p>
          Ao criar uma conta ou comprar créditos, você concorda com estes Termos e com a nossa{" "}
          <Link href="/privacidade" className="text-indigo-600 hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="2. O que o serviço faz (e o que não faz)">
        <p>
          O AvalIA Discursiva gera, com inteligência artificial, uma <strong>avaliação estimada</strong>{" "}
          da sua resposta a uma questão discursiva, seguindo os critérios públicos da banca que você
          escolher.
        </p>
        <ul>
          <li>
            A nota é uma <strong>estimativa para fins de estudo</strong>. Ela não é a nota oficial,
            não substitui a correção da banca e não garante aprovação nem uma nota específica.
          </li>
          <li>
            Não temos vínculo com nenhuma banca ou órgão público. Os nomes das bancas aparecem só para
            indicar qual critério de correção foi seguido.
          </li>
          <li>A IA pode errar. Use a correção como apoio ao estudo, junto com outras fontes.</li>
        </ul>
      </SecaoLegal>

      <SecaoLegal titulo="3. Conta e acesso">
        <ul>
          <li>
            O acesso é por um link enviado ao seu e-mail. Quem tiver acesso ao seu e-mail consegue
            entrar na sua conta, então mantenha-o seguro.
          </li>
          <li>
            <strong>Uma conta por pessoa.</strong> Não aceitamos e-mails temporários ou descartáveis.
          </li>
          <li>
            Para proteger o serviço, há um intervalo mínimo entre correções e um máximo de correções
            por dia, iguais para todos.
          </li>
          <li>
            Podemos suspender contas usadas para fraude, para burlar as correções grátis, para
            automatizar envios ou para uso ilegal. Ao encerrar a conta, os créditos pagos e não
            usados são reembolsados proporcionalmente, salvo fraude no próprio pagamento.
          </li>
        </ul>
      </SecaoLegal>

      <SecaoLegal titulo="4. Correções grátis">
        <p>
          Cada pessoa tem direito a <strong>{COTA_GRATIS_POR_CONTA} correções grátis</strong>, no
          total (não por dia). Variações do mesmo endereço de e-mail (por exemplo, com &quot;+&quot; ou,
          no Gmail, com pontos) contam como o mesmo e-mail. A correção grátis só é descontada quando
          a correção é concluída com sucesso.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="5. Créditos e pacotes">
        {!VENDAS_ABERTAS && (
          <p className="rounded-lg bg-amber-50 p-4 text-amber-900">
            A compra de créditos ainda não está disponível. As regras abaixo e nas seções 6 e 7 valem a
            partir da abertura das vendas; os preços serão informados aqui antes disso.
          </p>
        )}
        <ul>
          <li>
            Cada correção concluída com sucesso consome <strong>1 crédito</strong>.
          </li>
          {VENDAS_ABERTAS && (
            <li>
              Pacotes:{" "}
              {PACOTES.map((p, i) => (
                <span key={p.id}>
                  {i > 0 && "; "}
                  {p.creditos} créditos por {formatarPreco(p.precoCentavos)}
                </span>
              ))}
              . Os preços podem mudar, mas a mudança nunca afeta créditos já comprados.
            </li>
          )}
          <li>
            <strong>Os créditos não expiram.</strong> Eles ficam na sua conta até serem usados.
          </li>
          <li>
            O pagamento é processado pelo <strong>Mercado Pago</strong> (Pix ou cartão). Não recebemos
            nem guardamos os dados do seu cartão.
          </li>
          <li>
            Os créditos entram na conta assim que o Mercado Pago confirma o pagamento. No Pix isso
            costuma levar segundos; no cartão, depende da análise da operadora.
          </li>
          <li>
            Os créditos são pessoais: não podem ser transferidos para outra conta nem revendidos.
          </li>
        </ul>
      </SecaoLegal>

      <SecaoLegal titulo="6. Se a correção falhar">
        <p>
          Se a correção não for concluída — por erro técnico, instabilidade do serviço de IA, recusa
          do modelo em avaliar o conteúdo ou tempo esgotado — <strong>o crédito (ou a correção
          grátis) volta automaticamente</strong> para o seu saldo. Só é descontada a correção que você
          recebe completa na tela.
        </p>
        <p>
          Se você recebeu uma correção que claramente falhou (por exemplo, um relatório vazio ou
          corrompido) e o crédito foi descontado, escreva para {email} com o código da correção, que
          devolvemos o crédito.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo={`7. Direito de arrependimento (${PRAZO_ARREPENDIMENTO_DIAS} dias)`}>
        <p>
          Como a compra é feita pela internet, você pode <strong>desistir em até{" "}
          {PRAZO_ARREPENDIMENTO_DIAS} dias corridos</strong> a partir do pagamento (art. 49 do Código
          de Defesa do Consumidor), sem precisar justificar.
        </p>
        <ul>
          <li>
            O reembolso é <strong>integral</strong>, mesmo que você já tenha usado parte ou todos os
            créditos do pacote.
          </li>
          <li>
            Para desistir, escreva para {email} a partir do e-mail da sua conta, informando a compra.
          </li>
          <li>
            O valor é devolvido pelo mesmo meio de pagamento (estorno no cartão ou devolução do Pix),
            pelo Mercado Pago.
          </li>
          <li>Os créditos que ainda restarem do pacote reembolsado são retirados da conta.</li>
        </ul>
        <p>
          Depois desse prazo, não há reembolso de créditos não usados, exceto nos casos previstos em
          lei ou nestes Termos (como a seção 6).
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="8. Os seus textos">
        <ul>
          <li>Você continua dono(a) dos textos que envia.</li>
          <li>
            Usamos os seus textos <strong>apenas</strong> para gerar a sua correção e mostrar o seu
            histórico. Eles <strong>não são usados para treinar modelos de inteligência
            artificial</strong> nem para nenhuma outra finalidade sem o seu consentimento.
          </li>
          <li>
            O enunciado, a sua resposta e o relatório ficam guardados em &quot;Minhas correções&quot;
            até você apagar. Os detalhes estão na{" "}
            <Link href="/privacidade" className="text-indigo-600 hover:underline">
              Política de Privacidade
            </Link>
            .
          </li>
          <li>
            Não envie dados pessoais de terceiros, conteúdo ilegal ou material que você não tem
            direito de usar.
          </li>
        </ul>
      </SecaoLegal>

      <SecaoLegal titulo="9. Disponibilidade e mudanças">
        <p>
          Fazemos o possível para manter o serviço no ar, mas pode haver instabilidades e
          manutenções; correções que falharem nessas situações seguem a seção 6. Podemos alterar
          estes Termos, avisando mudanças relevantes no site ou por e-mail antes de valerem. Mudanças
          nunca reduzem o que você já comprou.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="10. Responsabilidade, lei e foro">
        <p>
          Respondemos pelo serviço nos termos do Código de Defesa do Consumidor. Como a nota é uma
          estimativa (seção 2), não respondemos por decisões tomadas apenas com base nela nem pelo
          resultado do seu concurso. Estes Termos seguem a lei brasileira, e fica eleito o foro do
          domicílio do consumidor.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="11. Contato">
        <p>
          {email}. Respondemos em até 5 dias úteis.
        </p>
      </SecaoLegal>
    </PaginaLegal>
  );
}
