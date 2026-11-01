// Valida o parâmetro "next" usado nos redirecionamentos de login
// (app/entrar/actions.ts e app/auth/confirm/route.ts). Sem isso,
// /auth/confirm?next=https://site-falso.com mandaria o usuário, já logado,
// para fora do domínio (open redirect) — útil pra phishing.
//
// Só aceita caminho interno: começa com "/" mas não com "//" (URL relativa
// ao protocolo, que o navegador trata como outro host). Barra invertida e
// caracteres de controle também são recusados: navegadores normalizam "\"
// para "/" (então "/\site.com" vira "//site.com") e ignoram tab/quebra de
// linha no meio da URL.
export function caminhoInterno(next: string | null | undefined, fallback = "/corretor"): string {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//")) return fallback;
  if (/[\\\u0000-\u001f\u007f]/.test(next)) return fallback;
  return next;
}
