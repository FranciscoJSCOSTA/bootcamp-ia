import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente server-only, com a service role key (ignora RLS). NUNCA importe
// este módulo de um componente client — a ausência do prefixo NEXT_PUBLIC_
// já garante que a variável não existe no bundle do browser, então
// importar isso no client faria o createClient falhar em runtime.
// Usado só por lib/corretor/feedback-real/persistence/supabase.ts.
//
// Construção sob demanda (não no top-level do módulo): em dev,
// FEEDBACK_REAL_STORE fica no modo local e este cliente nunca é usado, mas
// o módulo ainda é importado (store.ts importa os dois adaptadores).
// Lançar o erro de env var ausente já no import quebraria o dev mode
// inteiro mesmo sem SUPABASE_SERVICE_ROLE_KEY configurada.
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Variáveis de ambiente do Supabase (admin) ausentes. Confira NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local.",
    );
  }

  cached = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  return cached;
}
