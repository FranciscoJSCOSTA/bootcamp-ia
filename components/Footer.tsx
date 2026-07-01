import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link
            href="/privacidade"
            className="hover:text-indigo-600 hover:underline"
          >
            Política de Privacidade
          </Link>
          <a
            href="mailto:contato@avaliadiscursiva.com.br"
            className="hover:text-indigo-600 hover:underline"
          >
            contato@avaliadiscursiva.com.br
          </a>
        </div>
        <p>© 2026 AvalIA Discursiva</p>
      </div>
    </footer>
  );
}
