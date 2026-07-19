# Base de calibração FEPESE

Pesquisamos concursos de nível superior organizados pela FEPESE
(fepese.org.br) dos últimos 12 meses (jul/2025–jul/2026) com prova
discursiva efetivamente realizada e critério de correção detalhado
publicado.

## O que entrou

**1 concurso** (`chapeco-professor-2025.json`): Chapecó/SC, Edital
003/2025, Professor Licenciatura Plena, prova em 26/10/2025. Critério
verificado por mim pessoalmente, direto do PDF do edital (item 12.9,
Tabela 12.1): 3 dimensões — Habilidade de argumentação (0,45), Domínio do
conteúdo (0,60), Adequação linguística e textual (0,45) — total 1,50 ponto
por questão.

## Achado importante: pontuação por NÍVEL DE DESEMPENHO, não por acerto/erro

A FEPESE não pontua por desconto fixo por erro (como IDECAN/IDIB/AOCP) nem
por conceito discreto (como Cebraspe). Usa uma escala de **desempenho
percentual julgado qualitativamente**: 100%/80%/60%/40%/20%/0% do valor
máximo de cada dimensão. Isso está refletido no prompt da banca
(`lib/corretor/bancas/fepese.ts`) — o modelo deve atribuir um nível de
desempenho a cada dimensão, não contar erros individualmente.

## Confirmado: estrutura varia por edital/cliente, mesmo com os mesmos descritores

- Chapecó, Edital 004/2025 (Especialista em Assuntos Educacionais, mesma
  Secretaria de Educação, mesma data de publicação) usa a tabela **idêntica**
  à do Edital 003/2025 — confirma recorrência dentro do mesmo cliente.
- Itajaí/SC, Edital 001/2026 (ainda não aplicado até a data desta pesquisa —
  prova agendada para 06/09/2026) usa os mesmos 3 descritores de critério,
  mas com pontuação totalmente diferente: 5,00/2,50/2,50 = 10,00 pontos, e
  a discursiva pesa só 20% da nota final ("Nota Final = [(0,80 × Prova
  Objetiva) + (0,20 × Prova Discursiva)]"). Não incluído como exame
  qualificado por ainda não ter sido aplicado, mas confirma que a estrutura
  de pontos não é fixa entre clientes diferentes.

## Limite de linhas e zeramento

Confirmado (item 12.7 e 12.8 do edital de Chapecó): quadro de 20 linhas
disponível, mínimo de 10 linhas completas exigido — texto fora da área
delimitada ou no verso é desconsiderado. Zeramento: fuga total ao tema,
plágio (cópia integral/substancial sem citação), identificação do
candidato, texto em branco/só rabiscos, e **uso de linguagem inadequada
(palavras de baixo calão, ofensas, expressões impróprias)** — esta última
regra confirma a SEGUNDA banca do projeto (depois da IDECAN, e agora também
o IDIB) com zeramento explícito por linguagem ofensiva/inadequada.

## Limitação conhecida do motor: nomeação dos itens nem sempre segue as 3 dimensões fixas

Ao testar esta banca (Playwright, respostas reais), percebemos que o
modelo às vezes ignora a instrução de usar sempre os 3 nomes fixos
("Habilidade de argumentação...", "Domínio do conteúdo", "Adequação
linguística e textual") e em vez disso inventa itens nomeados por
sub-tópico do tema (ex: "Diagnóstico do problema", "Estratégias de
intervenção") — um padrão que faz sentido pra praticamente todas as
outras 16 bancas deste projeto (que são baseadas em quesito/tópico), mas
está errado para a FEPESE, que pontua de forma holística dentro de 3
dimensões fixas. Reforçamos a instrução no prompt (`fepese.ts`) várias
vezes, com a regra no topo do prompt e um checklist no final, e isso
reduziu a frequência do problema mas não eliminou 100% — parece ser um
viés forte do modelo (grade a maioria das questões por quesito porque é
o padrão mais comum no motor) que resiste a correção só por instrução de
prompt. A pontuação final e os comentários continuam substantivos e
corretos mesmo quando isso acontece — o que pode variar é só o rótulo dos
itens no array. Se isso for um problema recorrente na prática, vale
revisitar com uma abordagem estrutural diferente (ex: um passo de
verificação/correção automática pós-resposta do modelo, feito em código,
não só em prompt).

## Concursos verificados mas descartados

Prefeitura de Florianópolis (025/2025) e Polícia Científica de SC
(001/2025) — só objetiva + prática/títulos, sem discursiva. Processo
Seletivo Educação São José/SC (004/2025) — sem discursiva. CIDASC
(001/2025) — só um termo de retificação foi acessado, sem seção de
critérios; não permite concluir se há discursiva.
