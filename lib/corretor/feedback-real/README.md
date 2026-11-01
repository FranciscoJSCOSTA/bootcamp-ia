# Feedback real (nota estimada vs. nota oficial da banca)

Segundo mecanismo de crescimento controlado do AvalIA Discursiva — ver
também `scripts/crescimento-base-calibracao/` (crescimento da base de
calibração). Este aqui captura a única fonte de "gabarito" verdadeiro que
existe: a nota que a própria banca divulgou.

## Como funciona

1. Toda correção bem-sucedida (`lib/corretor/engine.ts`) gera um
   `correcaoId` e grava um snapshot em `registros/{correcaoId}.json` — banca,
   tema, nota estimada, nota máxima, fonte dos itens. Não grava o texto da
   resposta (não é necessário pra comparação, e evita reter dado sensível
   sem motivo).
2. O relatório mostrado ao usuário (`CorrectionReport.tsx`) exibe esse
   código e um link pra `/corretor/feedback?id={correcaoId}`.
3. Quando (e se) o usuário quiser, semanas depois, após o resultado oficial
   sair, ele volta nessa página e informa a nota real. Isso só acrescenta
   `feedbackReal` ao registro existente — nunca recalcula nem altera a
   correção original.
4. `scripts/analisar-feedback-real.mjs` lê (só leitura) todos os registros
   com feedback real e reporta erro médio, viés e volume por banca — só
   para decisão humana. Nunca ajusta prompt, calibração ou lógica sozinho.

## Regra que não pode ser quebrada

Nenhum código aqui pode alimentar de volta `lib/corretor/bancas/*.ts` ou
`lib/corretor/calibration/` automaticamente. Se o script de análise
apontar volume e padrão de erro relevantes, isso é um sinal pra revisão
manual — a mudança de critério, se acontecer, é uma decisão e um commit
separado, feito por uma pessoa.

## Armazenamento: dev local vs. produção (Supabase)

A persistência é escolhida em runtime por uma variável de ambiente —
`FEEDBACK_REAL_STORE` — sem duplicar lógica de negócio: `store.ts`
contém a única cópia das regras (gerar `correcaoId`, validar a nota real,
compor o registro) e delega a leitura/escrita pra um dos dois adaptadores
em `persistence/`:

- `persistence/local.ts` — um arquivo JSON por correção em `registros/`
  (usado quando `FEEDBACK_REAL_STORE` está vazio ou é qualquer valor
  diferente de `"supabase"` — o padrão em dev). Nunca usar em produção: o
  filesystem em serverless (ex: Vercel) é efêmero fora de `/tmp`.
- `persistence/supabase.ts` — duas tabelas no mesmo projeto Supabase já
  usado pela waitlist (`correcoes` e `feedbacks_reais`, ligadas por
  `correcao_id`, schema em `supabase/schema.sql`), usado quando
  `FEEDBACK_REAL_STORE=supabase`. Grava via `lib/supabase/admin.ts`, um
  cliente server-only com a **service role key** — não a chave pública
  (`anon`). RLS está habilitada nas duas tabelas sem nenhuma policy pra
  `anon`/`authenticated`: diferente da waitlist (insert público
  proposital), este dado é mais sensível, então só a service role
  (que ignora RLS) consegue ler/escrever, e só a partir das Server
  Actions do app — nunca direto do browser.

`scripts/analisar-feedback-real.mjs` segue a mesma variável: lê o JSON
local por padrão, ou o Supabase se `FEEDBACK_REAL_STORE=supabase` estiver
no ambiente em que o script rodar.
