# Base de calibração VUNESP — fina por design, não por bug

Pesquisamos concursos de nível superior organizados pela Fundação VUNESP dos
últimos 12 meses (jul/2025–jul/2026) com prova discursiva efetivamente
realizada e critério de correção detalhado publicado. O resultado ficou bem
mais magro que Cebraspe/FGV — 1 concurso qualificado, com ressalva — e isso é
esperado, não uma falha de busca: verificamos ~15 concursos reais de nível
superior da VUNESP nesse período e a maioria não tinha discursiva, era de
nível médio, ficava fora da janela de 12 meses, ou não publicava critério.

## O que entrou (`mp-sp-analista-juridico-2025.json`)

MP-SP, Concurso 01/2025, Analista Jurídico do MP — prova aplicada em
30/11/2025. Estrutura de pontuação real e oficial (edital, itens
4.42–4.44), verificada diretamente no PDF do Diário Oficial do Estado de
SP (não só relatada por terceiros): split 50/50 entre "conhecimento
específico" e "estrutura e conteúdo", separado por redação (0–25 pontos)
e questão discursiva (0–10 pontos).

**Limitação real, documentada no próprio arquivo**: não existe enunciado
literal público da questão nem um padrão de resposta com o conteúdo
jurídico esperado para o tema específico sorteado — isso fica atrás da
área do candidato (grade de correção individualizada, acessível só até o
fim do prazo de recurso). Por isso o "enunciado" no arquivo é a área
temática geral declarada no edital, não a pergunta completa — mais parecido
com o que documentamos pra Cesgranrio (estrutura real, sem conteúdo
temático específico) do que com Cebraspe/FGV (que têm padrão de resposta
completo com quesitos de conteúdo).

## O que ficou de fora (e por quê)

- **Procurador do Município de Campinas (Edital 02/2025)** — tem prova
  discursiva real, de nível superior, dentro da janela, e até uma quebra
  de nota por quesito (peça processual, parecer, 8 questões). Mas não
  encontramos nenhum texto oficial descrevendo o que cada quesito avalia
  — só um boletim de notas por candidato, sem critério. Sem isso, incluir
  significaria inventar o que cada quesito mede — não fazemos isso.
- Outros ~13 concursos verificados (TJ-SP Escrevente, GCM-SP, TCE-SP,
  Assembleia Legislativa/SP, PGE-SP, Auditor Fiscal SP, SPTrans, Itatiba,
  Osasco, entre outros) — descartados por serem nível médio, prova ainda
  não realizada, fora da janela de 12 meses, ou sem critério publicado.

## Sobre a regra de limite MÍNIMO de linhas

A hipótese original (7 linhas = zero; 15 linhas = penalização) é **real**,
mas **não universal**. Confirmamos os números exatos, direto do PDF oficial
de um edital de 2026 (Guarda Civil Metropolitana de São Paulo — GCM-SP):

> "estiver com 7 (sete) linhas ou menos" → nota zero
> "textos muito curtos, com 15 (quinze) linhas ou menos, perderão um ponto
> nos critérios C e D"
> "Redações com 20 (vinte) linhas ou menos não poderão alcançar a nota
> máxima nos critérios C e D"

Só que esse edital é de **nível médio** (Guarda Civil), e essa regra é do
formato "redação dissertativo-argumentativa genérica" da VUNESP — não do
formato "questão discursiva técnico-jurídica" usado no MP-SP. Conferimos
pessoalmente o edital inteiro do MP-SP (nível superior, o único concurso
qualificado na base) e **não existe nenhuma regra de linha mínima nele** —
os motivos de nota zero (itens 4.45/4.46) cobrem identificação do
candidato, letra ilegível, fuga ao tema, cópia da proposta, etc., mas nunca
contagem de linhas.

Conclusão: a VUNESP usa a regra de linha mínima em pelo menos um dos seus
formatos de prova, mas não achamos (ainda) um edital de nível superior que
confirme os números exatos para esse formato. Por isso o motor NÃO assume
7/15/20 como padrão fixo — ver `lib/corretor/linhas.ts` e
`lib/corretor/bancas/vunesp.ts`: o limite mínimo é um campo opcional que o
usuário preenche com o valor do próprio edital dele, exatamente como já
funciona o limite máximo.

Se aparecer uma prova de nível superior da VUNESP com regra de linha
mínima confirmada, ou um documento de critério real do Procurador de
Campinas, vale revisitar esta pesquisa.
