-- Rate limiting/alarme de custo (trilha A, item 4). Uso real de tokens
-- (message.usage da chamada ao Claude) por correção — base do script
-- scripts/analisar-custo.mjs. Default 0 porque a tabela pode já ter linhas
-- de teste sem esse dado (não quebra o not null).
alter table correcoes
  add column input_tokens integer not null default 0,
  add column output_tokens integer not null default 0;
