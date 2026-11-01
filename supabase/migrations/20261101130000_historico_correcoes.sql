-- "Minhas correções": guarda a resposta enviada e o relatório completo pra o
-- usuário reabrir depois. Até aqui a tabela só tinha o snapshot numérico
-- (banca, tema, notas, tokens) — a resposta não era guardada.
--
-- Apagar (pelo botão do usuário) remove o CONTEÚDO — tema, resposta,
-- padrão de resposta, relatório e observação da nota real — e marca
-- apagado_em. A linha continua existindo com data, banca, notas e tokens,
-- porque é ela que sustenta os limites de uso (rajada/teto diário) e o
-- controle de custo; ela some do histórico do usuário.
--
-- Mesmo acesso de antes: RLS ligada sem policy, só service_role.

alter table correcoes
  add column texto_resposta text,
  add column padrao_resposta text,
  add column relatorio jsonb,
  add column apagado_em timestamptz;

-- Listagem do histórico: correções não apagadas do usuário, mais novas antes.
create index if not exists correcoes_historico_idx
  on correcoes (user_id, criado_em desc)
  where apagado_em is null;
