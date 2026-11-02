import type { Metadata } from "next";
import Link from "next/link";
import { IdentificacaoResponsavel, PaginaLegal, SecaoLegal } from "@/components/PaginaLegal";
import { EMPRESA } from "@/lib/empresa";

export const metadata: Metadata = {
  title: "Política de Privacidade | AvalIA Discursiva",
  description: "Quais dados o AvalIA Discursiva coleta, para quê, com quem compartilha e como exercer seus direitos (LGPD).",
};

const email = (
  <a href={`mailto:${EMPRESA.email}`} className="text-indigo-600 hover:underline">
    {EMPRESA.email}
  </a>
);

export default function PrivacidadePage() {
  return (
    <PaginaLegal titulo="Política de Privacidade">
      <p>
        Esta política explica quais dados pessoais o AvalIA Discursiva trata, para quê, com quem
        compartilha e como você exerce seus direitos, conforme a Lei Geral de Proteção de Dados
        (Lei 13.709/2018, LGPD).
      </p>

      <SecaoLegal titulo="1. Quem é o responsável (controlador)">
        <IdentificacaoResponsavel {...EMPRESA} />
        <p>
          Esse e-mail é também o canal para qualquer assunto sobre os seus dados pessoais.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="2. Quais dados tratamos e por quê">
        <ul>
          <li>
            <strong>Conta:</strong> seu e-mail, usado para o login por link e para falar com você
            sobre a conta. Base legal: execução de contrato.
          </li>
          <li>
            <strong>Correções:</strong> a banca escolhida, o enunciado da questão, o texto da sua
            resposta, o padrão de resposta (se você informar), o relatório gerado, a nota estimada,
            a data e o volume de processamento usado. Servem para gerar a correção e para mostrar o
            seu histórico em &quot;Minhas correções&quot;. Base legal: execução de contrato.
          </li>
          <li>
            <strong>Nota real (opcional):</strong> se você informar a nota oficial que recebeu, ela
            é comparada com a nossa estimativa para medir a qualidade do corretor. Base legal:
            legítimo interesse, sempre a partir de um dado que você escolheu enviar.
          </li>
          <li>
            <strong>Compras:</strong> pacote comprado, valor, data, status e identificador do
            pagamento no Mercado Pago. <strong>Não recebemos nem guardamos dados do seu cartão</strong>{" "}
            — o pagamento acontece no ambiente do Mercado Pago. Base legal: execução de contrato e
            cumprimento de obrigação legal (registros fiscais).
          </li>
          <li>
            <strong>Segurança e limites de uso:</strong> registros técnicos (como data e hora de
            acesso e endereço IP, mantidos pelos nossos provedores de infraestrutura) e a contagem
            de correções por conta, para evitar abuso e fraude. Base legal: legítimo interesse.
          </li>
          <li>
            <strong>Lista de espera:</strong> se você entrou na lista antes do lançamento, guardamos
            o e-mail e o concurso ou banca informados, só para avisar sobre o produto.
          </li>
          <li>
            <strong>Medição de anúncios:</strong> só com o seu consentimento (veja a seção 6).
          </li>
        </ul>
      </SecaoLegal>

      <SecaoLegal titulo="3. O que NÃO fazemos com os seus textos">
        <p>
          Os enunciados, as respostas e os relatórios são usados <strong>apenas</strong> para gerar a
          sua correção e mostrar o seu histórico. Eles <strong>não são usados para treinar modelos de
          inteligência artificial</strong> — nem por nós, nem pelo nosso fornecedor de IA — e não são
          usados para nenhuma outra finalidade sem o seu consentimento. Não vendemos nem alugamos
          dados pessoais.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="4. Com quem compartilhamos">
        <p>Só com os fornecedores necessários para o serviço funcionar, cada um no seu papel:</p>
        <ul>
          <li>
            <strong>Anthropic</strong> (EUA), fornecedora do modelo de IA que gera a correção: recebe
            o enunciado, a resposta e o padrão de resposta de cada correção. Pelos{" "}
            <a
              href="https://www.anthropic.com/legal/commercial-terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              termos comerciais da Anthropic
            </a>
            , dados enviados pela API não são usados para treinar os modelos dela.
          </li>
          <li>
            <strong>Supabase</strong> (servidores em São Paulo): banco de dados e login.
          </li>
          <li>
            <strong>Vercel</strong> (EUA): hospedagem do site.
          </li>
          <li>
            <strong>Resend</strong> (EUA): envio dos e-mails de login.
          </li>
          <li>
            <strong>Mercado Pago</strong>: processamento dos pagamentos.
          </li>
          <li>
            <strong>Meta</strong> (EUA): medição de anúncios, apenas se você aceitar (seção 6).
          </li>
        </ul>
        <p>
          Alguns desses fornecedores ficam fora do Brasil. Nesses casos, a transferência
          internacional acontece para executar o serviço que você contratou (art. 33 da LGPD), com
          fornecedores que adotam medidas de segurança compatíveis. Também podemos compartilhar
          dados quando a lei ou uma ordem judicial exigir.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="5. Por quanto tempo guardamos">
        <ul>
          <li>
            <strong>Conteúdo das correções</strong> (enunciado, resposta, padrão de resposta,
            relatório): até você apagar a correção em &quot;Minhas correções&quot; ou pedir a exclusão
            da conta. Ao apagar, esse conteúdo é removido de forma definitiva.
          </li>
          <li>
            <strong>Registro numérico de cada correção</strong> (data, banca, nota estimada e volume
            de processamento): enquanto a conta existir, mesmo depois de você apagar a correção,
            porque é ele que controla os limites de uso e o custo do serviço. Não contém o seu texto.
          </li>
          <li>
            <strong>Compras:</strong> 5 anos, pelo prazo das obrigações fiscais.
          </li>
          <li>
            <strong>Conta:</strong> até você pedir a exclusão.
          </li>
          <li>
            <strong>Lista de espera:</strong> até o lançamento ou até você pedir a remoção.
          </li>
        </ul>
      </SecaoLegal>

      <SecaoLegal id="cookies" titulo="6. Cookies e Pixel da Meta">
        <p>
          Usamos <strong>cookies essenciais</strong> para manter você conectado depois do login. Sem
          eles, a conta não funciona, então não dependem de consentimento.
        </p>
        <p>
          Com o seu <strong>consentimento</strong>, usamos também o <strong>Pixel da Meta</strong>,
          que informa à Meta (Facebook/Instagram) as visitas ao site, para medirmos o resultado dos
          nossos anúncios. O Pixel só é carregado depois que você clica em &quot;Aceitar&quot; no aviso
          de cookies. Se recusar, nada é enviado à Meta. Você pode mudar de ideia a qualquer momento
          em &quot;Preferências de cookies&quot;, no rodapé do site.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="7. Seus direitos">
        <p>Pela LGPD (art. 18), você pode pedir, a qualquer momento:</p>
        <ul>
          <li>confirmação de que tratamos seus dados e acesso a eles;</li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
          <li>portabilidade dos seus dados;</li>
          <li>exclusão da conta e dos dados tratados com base no seu consentimento;</li>
          <li>informação sobre com quem compartilhamos seus dados;</li>
          <li>revogação do consentimento (no caso do Pixel, em &quot;Preferências de cookies&quot;).</li>
        </ul>
        <p>
          Para isso, escreva para {email} a partir do e-mail da sua conta. Respondemos em até 15
          dias. Cada correção também pode ser apagada por você mesmo em{" "}
          <Link href="/corretor/historico" className="text-indigo-600 hover:underline">
            Minhas correções
          </Link>
          . Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="8. Segurança">
        <p>
          Os dados ficam em banco com acesso restrito ao servidor do site, a conexão é sempre
          criptografada (HTTPS) e cada pessoa só consegue ver as próprias correções. Nenhum sistema é
          100% imune a falhas; se acontecer um incidente de segurança que possa causar risco ou dano
          relevante, avisaremos você e a ANPD.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="9. Mudanças nesta política">
        <p>
          Podemos atualizar esta política conforme o serviço evolui. Mudanças relevantes serão
          avisadas no site ou por e-mail. Veja também os{" "}
          <Link href="/termos" className="text-indigo-600 hover:underline">
            Termos de Uso
          </Link>
          .
        </p>
      </SecaoLegal>
    </PaginaLegal>
  );
}
