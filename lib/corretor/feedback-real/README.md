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

## Limitação atual de armazenamento

Isso guarda cada registro como um arquivo JSON em `registros/` (mesmo
espírito da base de calibração). Funciona rodando local. Mas **antes de
qualquer deploy real** (ex: Vercel), isso precisa migrar pra um
armazenamento persistente de verdade — o filesystem em serverless é
efêmero fora de `/tmp` e não sobrevive entre deploys/instâncias. O projeto
já tem `@supabase/supabase-js` configurado (`lib/supabase/client.ts`) para
outro fim — é o candidato natural quando isso for pra produção. Essa
migração não foi feita agora porque o pedido era só construir e mostrar a
estrutura, sem deploy ainda.
