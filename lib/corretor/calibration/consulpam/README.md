# Base de calibração Consulpam

**Atenção de nomenclatura**: Consulpam (consulpam.com.br) é uma banca
DIFERENTE da Consulplan (institutoconsulplan.org.br/consulplan.net), já
modelada em `lib/corretor/calibration/consulplan/`. Nomes parecidos,
organizações diferentes — nenhum dado foi misturado entre as duas.

## O que entrou

2 concursos, mostrando dois modelos genuinamente diferentes da mesma banca:

- **`paracuru-educacao-2026.json`** — Paracuru/CE, Professor, prova
  26/04/2026. Modelo "genérico" (cargos de magistério/administrativo): 4
  competências somando 100 pontos (Argumentação 50 + Estrutura 20 +
  Domínio da língua 20 + Aspectos gráficos 10).
- **`itaitinga-procurador-2025.json`** — Itaitinga/CE, Procurador Jurídico,
  prova 27/07/2025. Modelo técnico-jurídico: peça profissional (30 pts,
  faixas Ruim/Regular/Bom/Muito Bom) + 2 questões discursivas (15 pts cada,
  mesma lógica de faixas), total 60 pontos, aprovação 60% (não 50%).

Ambos os documentos foram lidos por mim pessoalmente, direto dos PDFs
(baixados via curl com header de referer — o servidor da Consulpam retorna
404 sem esse header em alguns casos).

## A inconsistência "19 vs 20 linhas" — resolvida, não é um erro

Conferi os dois trechos do edital de Paracuru pessoalmente:
- Item 12.4: "no mínimo 20 linhas, e no máximo 30 linhas" (requisito de
  elaboração).
- Item 12.15.h (zeramento): "Contiver 19 (dezenove) ou menos linhas
  escritas" → nota zero.

**Não há zona cinzenta.** "19 ou menos" é exatamente o complemento lógico
de "mínimo de 20" — um texto com 19 linhas está, por definição, abaixo do
mínimo de 20, e é zerado; 20 linhas atende ao mínimo e é avaliado
normalmente. Confirmamos essa mesma cláusula, com texto idêntico, no
edital de Itaitinga/CE (Magistério) — é boilerplate padrão da banca para
o modelo genérico, não peculiaridade de um documento isolado.

## Confirmado: mecanismo de penalização por linha varia por modelo

- Modelo genérico (Paracuru): zeramento TOTAL da questão se ficar em 19
  linhas ou menos.
- Modelo técnico-jurídico (Itaitinga Procurador): desconto GRADUADO — 0,5
  ponto por linha abaixo do mínimo (até 4 descontos), 0,5 ponto por linha
  acima do máximo. Não zera por linha insuficiente.

## Confirmado: total de pontos varia até dentro do mesmo modelo

CONAB (Edital 001/2025, cargo Analista, prova 13/07/2025) usa a MESMA
estrutura de 4 competências do modelo genérico, mas somando **60 pontos**
(30/10/10/10), não 100 (50/20/20/10) como em Paracuru/Itaitinga-Magistério.
Não incluído como exame completo nesta rodada (para manter o escopo), mas
confirma que mesmo o "modelo genérico" não tem um total fixo — sempre
confira no documento disponível.

## Zeramento (modelo genérico, confirmado em 2 editais)

Identificação do candidato, texto não articulado verbalmente, escrito a
lápis (parcial ou total), em branco, desenhos/recados/números/assinatura
na folha de resposta, fuga ao tema/tipologia, ilegível ou em idioma
diferente do português, e 19 linhas ou menos.

## Concursos verificados mas descartados

Companhia Docas do Pará (CDP), Edital 002/2026 — critérios de outro
modelo jurídico confirmados (Técnica Profissional 4 + Exposição dos Fatos
3 + Fundamentação Jurídica 6 + Pedidos e Técnica 4 + Estrutura/Linguagem
3 = 20 pontos), mas prova ainda não aplicada até a data desta pesquisa
(inscrições abertas até 13/08/2026). Municípios menores (Banabuiú/CE,
Jaguaruana/CE) apareceram em buscas mas não foram verificados por leitura
direta do PDF — não incluídos.
