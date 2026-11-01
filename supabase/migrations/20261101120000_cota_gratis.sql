-- Cota grátis (total, não por dia). Contar linhas de "correcoes" não basta:
-- N requisições paralelas leem a mesma contagem antes de qualquer uma
-- gravar, e todas passariam. Aqui o uso é RESERVADO antes de chamar a IA,
-- num único UPDATE condicional (atômico: o Postgres trava a linha e
-- reavalia o WHERE), e devolvido se a correção falhar — no fim só correção
-- bem-sucedida consome cota.
--
-- A cota é contada pelo E-MAIL NORMALIZADO, não pelo user_id: senão
-- voce+1@gmail.com, voce+2@gmail.com, v.o.c.e@gmail.com... seriam contas
-- diferentes, cada uma com cota cheia, todas caindo na mesma caixa.

-- Minúsculas, sem "+apelido" (vale pra qualquer provedor — Gmail, Outlook,
-- iCloud, Proton etc. entregam voce+x@ em voce@) e, no Gmail, sem pontos
-- (o Gmail ignora pontos; googlemail.com é o mesmo serviço).
create or replace function normalizar_email_cota(p_email text)
returns text
language sql
immutable
set search_path = public
as $$
  with partes as (
    select
      regexp_replace(regexp_replace(lower(trim(p_email)), '@[^@]*$', ''), '\+.*$', '') as local,
      regexp_replace(substring(lower(trim(p_email)) from '@([^@]*)$'), '\.$', '') as dominio
  )
  select case
    when dominio in ('gmail.com', 'googlemail.com') then replace(local, '.', '') || '@gmail.com'
    else local || '@' || dominio
  end
  from partes;
$$;

create table if not exists cota_gratis (
  email_normalizado text primary key,
  usadas integer not null default 0 check (usadas >= 0),
  atualizado_em timestamptz not null default now()
);

-- Mesmo padrão de correcoes/feedbacks_reais: RLS ligada, sem policy — só o
-- servidor (service_role, lib/supabase/admin.ts) lê e escreve.
alter table cota_gratis enable row level security;

-- Contas que já existem: correções bem-sucedidas anteriores contam na cota
-- (2 = COTA_GRATIS_POR_CONTA na data desta migração).
insert into cota_gratis (email_normalizado, usadas)
select normalizar_email_cota(u.email), least(count(*), 2)::integer
from correcoes c
join auth.users u on u.id = c.user_id
where u.email is not null
group by normalizar_email_cota(u.email)
on conflict (email_normalizado) do nothing;

-- Reserva 1 correção grátis para o e-mail da sessão (o app passa o e-mail
-- que o próprio Supabase Auth devolveu em getUser, nunca um valor digitado).
-- Retorna 'gratis' se reservou, null se a cota acabou. O limite vem do app
-- (lib/cobranca/config.ts), não fica fixo aqui.
create or replace function reservar_correcao(p_email text, p_limite_gratis integer)
returns text
language plpgsql
set search_path = public
as $$
declare
  v_email text := normalizar_email_cota(p_email);
  v_linhas integer;
begin
  insert into cota_gratis (email_normalizado) values (v_email) on conflict do nothing;

  update cota_gratis
     set usadas = usadas + 1, atualizado_em = now()
   where email_normalizado = v_email and usadas < p_limite_gratis;
  get diagnostics v_linhas = row_count;
  if v_linhas = 1 then
    return 'gratis';
  end if;

  return null;
end;
$$;

-- Devolve uma reserva quando a correção falhou.
create or replace function devolver_correcao(p_email text, p_tipo text)
returns void
language plpgsql
set search_path = public
as $$
begin
  if p_tipo = 'gratis' then
    update cota_gratis
       set usadas = usadas - 1, atualizado_em = now()
     where email_normalizado = normalizar_email_cota(p_email) and usadas > 0;
  else
    raise exception 'tipo de reserva desconhecido: %', p_tipo;
  end if;
end;
$$;

-- Quantas grátis o e-mail já usou (0 se nunca usou).
create or replace function consultar_gratis_usadas(p_email text)
returns integer
language sql
stable
set search_path = public
as $$
  select coalesce(
    (select usadas from cota_gratis where email_normalizado = normalizar_email_cota(p_email)),
    0
  );
$$;

-- Funções em "public" ficam executáveis por PUBLIC por padrão, e o
-- PostgREST as expõe como /rpc/... para a chave anon (que é pública). Sem
-- este revoke, qualquer um chamaria devolver_correcao e zeraria a própria
-- cota quantas vezes quisesse. Só o servidor (service_role) chama.
revoke all on function normalizar_email_cota(text) from public, anon, authenticated;
revoke all on function reservar_correcao(text, integer) from public, anon, authenticated;
revoke all on function devolver_correcao(text, text) from public, anon, authenticated;
revoke all on function consultar_gratis_usadas(text) from public, anon, authenticated;
grant execute on function normalizar_email_cota(text) to service_role;
grant execute on function reservar_correcao(text, integer) to service_role;
grant execute on function devolver_correcao(text, text) to service_role;
grant execute on function consultar_gratis_usadas(text) to service_role;
