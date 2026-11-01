-- Migração de organização (2026-07-21): representa o estado ATUAL do banco de
-- produção, já aplicado manualmente via SQL Editor do painel ao longo do
-- projeto — não é uma mudança nova. Conferido coluna a coluna contra o banco
-- real (via service_role) antes de virar este arquivo:
--   - correcoes: tem user_id, NÃO tem input_tokens/output_tokens ainda
--     (essa migração é a próxima, separada, aplicada de verdade via CLI).
--   - feedbacks_reais e waitlist_leads: como abaixo.
-- Esta migração é marcada como "applied" via `supabase migration repair`,
-- sem executar (as tabelas/colunas já existem — rodar de novo daria erro).

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

-- Autenticação de usuários (Supabase Auth) chegou depois da tabela correcoes
-- já existir. Agora toda correção nova precisa saber quem a gerou (rate
-- limiting por usuário, "minhas correções", e depois cobrança).
alter table correcoes
  add column user_id uuid not null references auth.users (id) on delete cascade;

create index if not exists correcoes_user_id_idx on correcoes (user_id);
