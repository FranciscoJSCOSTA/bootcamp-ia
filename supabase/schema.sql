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
