-- Cota grátis por conta (total, não por dia). Contar linhas de "correcoes"
-- não basta: N requisições paralelas leem a mesma contagem antes de qualquer
-- uma gravar, e todas passariam. Aqui o uso é RESERVADO antes de chamar a
-- IA, num único UPDATE condicional (atômico: o Postgres trava a linha e
-- reavalia o WHERE), e devolvido se a correção falhar — no fim só correção
-- bem-sucedida consome cota.

create table if not exists contas_uso (
  user_id uuid primary key references auth.users (id) on delete cascade,
  gratis_usadas integer not null default 0 check (gratis_usadas >= 0),
  atualizado_em timestamptz not null default now()
);

-- Mesmo padrão de correcoes/feedbacks_reais: RLS ligada, sem policy — só o
-- servidor (service_role, lib/supabase/admin.ts) lê e escreve.
alter table contas_uso enable row level security;

-- Contas que já existem: correções bem-sucedidas anteriores contam na cota
-- (2 = COTA_GRATIS_POR_CONTA na data desta migração).
insert into contas_uso (user_id, gratis_usadas)
select user_id, least(count(*), 2)::integer
from correcoes
group by user_id
on conflict (user_id) do nothing;

-- Reserva 1 correção grátis. Retorna 'gratis' se reservou, null se a cota
-- acabou. O limite vem do app (lib/cobranca/config.ts), não fica fixo aqui.
create or replace function reservar_correcao(p_user_id uuid, p_limite_gratis integer)
returns text
language plpgsql
set search_path = public
as $$
declare
  v_linhas integer;
begin
  insert into contas_uso (user_id) values (p_user_id) on conflict (user_id) do nothing;

  update contas_uso
     set gratis_usadas = gratis_usadas + 1, atualizado_em = now()
   where user_id = p_user_id and gratis_usadas < p_limite_gratis;
  get diagnostics v_linhas = row_count;
  if v_linhas = 1 then
    return 'gratis';
  end if;

  return null;
end;
$$;

-- Devolve uma reserva quando a correção falhou.
create or replace function devolver_correcao(p_user_id uuid, p_tipo text)
returns void
language plpgsql
set search_path = public
as $$
begin
  if p_tipo = 'gratis' then
    update contas_uso
       set gratis_usadas = gratis_usadas - 1, atualizado_em = now()
     where user_id = p_user_id and gratis_usadas > 0;
  else
    raise exception 'tipo de reserva desconhecido: %', p_tipo;
  end if;
end;
$$;

-- Funções em "public" ficam executáveis por PUBLIC por padrão, e o
-- PostgREST as expõe como /rpc/... para a chave anon (que é pública). Sem
-- este revoke, qualquer um chamaria devolver_correcao e zeraria a própria
-- cota quantas vezes quisesse. Só o servidor (service_role) chama.
revoke all on function reservar_correcao(uuid, integer) from public, anon, authenticated;
revoke all on function devolver_correcao(uuid, text) from public, anon, authenticated;
grant execute on function reservar_correcao(uuid, integer) to service_role;
grant execute on function devolver_correcao(uuid, text) to service_role;
