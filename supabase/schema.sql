-- DEPRECATED (2026-07-21): este arquivo documenta o histórico de mudanças
-- aplicadas manualmente pelo SQL Editor do painel, mas não é mais a fonte
-- de verdade do schema. A partir de agora, qualquer mudança de schema é uma
-- migração nova em supabase/migrations/, aplicada via `supabase db push`
-- (CLI linkado ao projeto). Este arquivo fica só como referência histórica
-- — não edite mais este arquivo pra novas mudanças.
--
-- Rode este script no SQL Editor do painel do Supabase (Project > SQL Editor > New query).

create table if not exists waitlist_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  concurso_banca text not null,
  created_at timestamptz not null default now()
);

alter table waitlist_leads enable row level security;

create policy "Permitir insert publico na waitlist"
  on waitlist_leads
  for insert
  to anon
  with check (true);

-- Feedback real do /corretor (lib/corretor/feedback-real/). Diferente da
-- waitlist (insert público proposital), este dado é mais sensível — nota
-- estimada e nota real de usuários — e só é gravado/lido pelas Server
-- Actions do app (nunca direto do browser). Por isso RLS fica habilitada
-- SEM nenhuma policy pra anon/authenticated: o acesso em produção é feito
-- só via service_role (que ignora RLS por padrão), a partir de
-- lib/supabase/admin.ts — a chave pública (anon) não enxerga essas tabelas.

-- Snapshot de cada correção gerada pelo motor (1 linha por correcaoId).
-- "id" não usa "default gen_random_uuid()" porque o app já gera o UUID
-- antes de inserir (lib/corretor/feedback-real/store.ts), preservando a
-- mesma assinatura de registrarCorrecao() que já existia na versão local.
create table if not exists correcoes (
  id uuid primary key,
  criado_em timestamptz not null default now(),
  banca_id text not null,
  tema text not null,
  nota_estimada numeric not null,
  nota_maxima numeric not null,
  fonte_dos_itens text not null
);

-- Feedback real (nota oficial da banca) — no máximo 1 por correção.
create table if not exists feedbacks_reais (
  id uuid primary key default gen_random_uuid(),
  correcao_id uuid not null unique references correcoes(id) on delete cascade,
  nota_real numeric not null,
  observacao text,
  registrado_em timestamptz not null default now()
);

alter table correcoes enable row level security;
alter table feedbacks_reais enable row level security;

-- Migração (2026-07-21): autenticação de usuários (Supabase Auth) chegou
-- depois da tabela correcoes já existir — antes disso não fazia sentido
-- vincular uma correção a ninguém. Agora toda correção nova precisa saber
-- quem a gerou (rate limiting por usuário, "minhas correções", e depois
-- cobrança). A tabela correcoes está vazia hoje (confirmado antes desta
-- migração), então dá pra adicionar como NOT NULL direto, sem backfill.
alter table correcoes
  add column user_id uuid not null references auth.users (id) on delete cascade;

create index if not exists correcoes_user_id_idx on correcoes (user_id);

-- Migração (2026-07-21): rate limiting/alarme de custo (trilha A, item 4).
-- Uso real de tokens (message.usage da chamada ao Claude) por correção —
-- base do script scripts/analisar-custo.mjs. Default 0 porque a tabela pode
-- já ter linhas de teste sem esse dado (não quebra o not null).
alter table correcoes
  add column input_tokens integer not null default 0,
  add column output_tokens integer not null default 0;
