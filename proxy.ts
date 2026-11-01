import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 renomeou "middleware" pra "proxy" (arquivo proxy.ts na raiz,
// função exportada como "proxy", runtime Node.js por padrão) — ver
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
const PROTECTED_PREFIX = "/corretor";
const LOGIN_PATH = "/entrar";

export async function proxy(request: NextRequest) {
  // supabaseResponse começa como NextResponse.next({ request }) e é
  // reatribuído dentro de setAll — precisa ser retornado exatamente como
  // está no final (não copiado pra outro objeto), senão a sessão
  // refrescada não chega no navegador. Ver comentário do Supabase sobre
  // "IMPORTANT: You must return the supabaseResponse object as it is."
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() bate no servidor de Auth (não só decodifica o JWT local) —
  // importante pra pegar sessão revogada/expirada, não só refrescar cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = path === PROTECTED_PREFIX || path.startsWith(`${PROTECTED_PREFIX}/`);
  const isLoginPage = path === LOGIN_PATH;

  if (isProtected && !user) {
    // Leva a query junto no "next" (ex.: /corretor/feedback?id=...), em vez
    // de deixá-la solta na URL do login, onde se perderia. URL nova (não
    // clone do nextUrl) pra não herdar a query original.
    const url = new URL(LOGIN_PATH, request.url);
    url.searchParams.set("next", path + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = PROTECTED_PREFIX;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
