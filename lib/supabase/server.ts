import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variáveis de ambiente do Supabase ausentes. Confira NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local.",
  );
}

// Cliente com contexto de sessão (cookies), usado em Server Components,
// Server Actions e Route Handlers pra saber QUEM está logado — diferente de
// lib/supabase/admin.ts, que ignora RLS e não tem noção de sessão/usuário.
// Precisa ser criado a cada request (não pode ser um singleton top-level)
// porque cada request tem seus próprios cookies.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // Em Server Components (não em Server Actions/Route Handlers), setar
        // cookie lança — ignorável aqui porque o proxy.ts já cuida de
        // refrescar a sessão em todo request.
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Ignorado de propósito — ver comentário acima.
        }
      },
    },
  });
}
