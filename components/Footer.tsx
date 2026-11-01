import Link from "next/link";
import { BotaoPreferenciasCookies } from "@/components/ConsentimentoCookies";
import { EMPRESA } from "@/lib/empresa";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link href="/termos" className="hover:text-indigo-600 hover:underline">
            Termos de Uso
          </Link>
          <Link
            href="/privacidade"
            className="hover:text-indigo-600 hover:underline"
          >
            Política de Privacidade
          </Link>
          <BotaoPreferenciasCookies />
          <a
            href={`mailto:${EMPRESA.email}`}
            className="hover:text-indigo-600 hover:underline"
          >
            {EMPRESA.email}
          </a>
        </div>
        <p>
          © 2026 AvalIA Discursiva · {EMPRESA.nome}
          {EMPRESA.cnpj && <> · CNPJ {EMPRESA.cnpj}</>}
        </p>
        {EMPRESA.endereco && <p>{EMPRESA.endereco}</p>}
      </div>
    </footer>
  );
}
