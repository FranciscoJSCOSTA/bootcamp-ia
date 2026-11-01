import fs from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

const MIGRACOES = path.join(import.meta.dirname, "..", "..", "supabase", "migrations");

// Postgres em memória (PGlite, WASM) com o mínimo do Supabase que as
// migrações referenciam — schema auth.users e os papéis anon,
// authenticated e service_role — e TODAS as migrações aplicadas em ordem,
// do mesmo jeito que `supabase db push` faria.
export async function criarBancoComMigracoes() {
  const db = new PGlite();
  await db.exec(`
    create schema auth;
    create table auth.users (id uuid primary key, email text);
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    grant usage on schema public to anon, authenticated, service_role;
    -- Padrão (permissivo) do Supabase: tabelas e funções novas em public
    -- já nascem acessíveis aos três papéis — quem protege é RLS e revoke.
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
  `);
  for (const arquivo of fs.readdirSync(MIGRACOES).filter((f) => f.endsWith(".sql")).sort()) {
    await db.exec(fs.readFileSync(path.join(MIGRACOES, arquivo), "utf-8"));
  }
  return db;
}

export async function criarUsuario(db, id) {
  await db.query("insert into auth.users (id) values ($1)", [id]);
}

/** Executa fn com outro papel (ex.: "anon"), voltando ao superusuário no fim. */
export async function comoPapel(db, papel, fn) {
  await db.exec(`set role ${papel}`);
  try {
    return await fn();
  } finally {
    await db.exec("reset role");
  }
}
