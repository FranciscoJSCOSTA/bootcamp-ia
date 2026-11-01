import Link from "next/link";
import { ATUALIZACAO_DOCUMENTOS_LEGAIS } from "@/lib/empresa";

// Moldura comum de Política de Privacidade e Termos de Uso.
export function PaginaLegal({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <main className="flex-1 bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-left">
        <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">
          ← Voltar para a página inicial
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">{titulo}</h1>
        <p className="mt-2 text-sm text-slate-500">Última atualização: {ATUALIZACAO_DOCUMENTOS_LEGAIS}</p>
        <div className="mt-8 space-y-8 text-base text-slate-700 [&_li]:mt-1 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </main>
  );
}

export function SecaoLegal({
  id,
  titulo,
  children,
}: {
  id?: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">{titulo}</h2>
      {children}
    </section>
  );
}

export function IdentificacaoResponsavel({
  nome,
  cnpj,
  endereco,
  email,
}: {
  nome: string;
  cnpj: string | null;
  endereco: string | null;
  email: string;
}) {
  return (
    <p>
      <strong>{nome}</strong>
      {cnpj && <>, CNPJ {cnpj}</>}
      {endereco && <>, {endereco}</>}. Contato:{" "}
      <a href={`mailto:${email}`} className="text-indigo-600 hover:underline">
        {email}
      </a>
      .
    </p>
  );
}
