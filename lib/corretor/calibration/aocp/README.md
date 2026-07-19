# Base de calibração Instituto AOCP

Pesquisamos concursos de nível superior organizados pelo Instituto AOCP dos
últimos 12 meses (jul/2025–jul/2026) com prova discursiva efetivamente
realizada e critério de correção detalhado publicado.

## O que entrou

3 concursos, cobrindo os dois formatos reais que a AOCP usa:

- **`uenf-tecnicos-administrativos-2025.json`** e
  **`tre-to-analista-judiciario-2025.json`** — formato **"Questão
  Discursiva"**: **2 critérios** ("Conhecimento técnico sobre a matéria" +
  "Utilização adequada da Língua Portuguesa", com zeramento em cascata).
  O texto de cada critério é **literalmente idêntico** nos dois editais
  (órgãos diferentes, mesmo período) — confirma que é um template fixo da
  banca, não coincidência.
- **`seduc-rs-professor-2025.json`** — formato **"Redação"**: **4
  critérios** de peso igual (tema/argumentação, coesão/coerência,
  estrutura textual, modalidade gramatical) — molde clássico de
  dissertação-argumentativa, bem diferente do formato acima.

## Correção da hipótese preliminar (5 critérios / 4 critérios)

A pesquisa inicial (antes de checar documentos reais) supunha Redação=5
critérios e Questão Discursiva=4 critérios. **Isso corresponde a um modelo
mais antigo (2022–2023)** — confirmado em editais anteriores (PCGO 2022,
PMDF 2023, SEDUC-RS 2023) que também pesquisamos, mas que ficaram de fora
da base por estarem fora da janela de 12 meses. Nos editais de 2025 a AOCP
está usando um modelo simplificado: **2 critérios** pra Questão Discursiva,
**4 critérios** pra Redação. Se a base precisar cobrir concursos mais
antigos no futuro, o modelo antigo (4/5 critérios) precisa ser tratado como
uma versão diferente, não uma correção do atual.

## Achado importante: o rótulo da seção do edital não é confiável

Um dos editais verificados (TJ-PR, Técnico Judiciário — nível médio, por
isso não entrou na base) chama sua seção de "DA PROVA DISCURSIVA", mas a
estrutura interna é de uma Redação dissertativa-argumentativa (4 critérios,
tipologia textual, etc.) — a própria tabela do edital diz "TOTAL MÁXIMO DE
PONTOS DA PROVA DE REDAÇÃO". Ou seja, **o motor de correção não pode
confiar no nome da seção do edital pra decidir o formato** — precisa olhar
a estrutura dos critérios (2 aspectos genéricos → Questão Discursiva; 4
aspectos de dissertação → Redação). Isso está refletido no prompt da banca
(`lib/corretor/bancas/aocp.ts`).

## O que ficou de fora (e por quê)

- **MP-GO (Edital 2026, Analista em Educação / Engenharia Ambiental e
  Sanitária)** — prova já aplicada (12/07/2026), critério de pontuação já
  público no edital (mesmo template de 2 critérios), mas o documento
  pós-correção com resposta-padrão só sai em agosto/2026. Sem esse
  documento, não há conteúdo específico pra agregar além do que UENF/TRE-TO
  já cobrem — revisitar quando sair.
- **PCGO (2022), PMDF (2023), SEDUC-RS (2023), FCRB (2013)** — todos com
  espelho de correção real e detalhado, mas fora da janela de 12 meses.
  Úteis como referência histórica se um dia quisermos documentar a evolução
  do critério da banca, mas não entraram na base "ativa".
- **PM/PR Soldado, PM/SC, PM/PE, PMDF Oficial 2026** — banca errada (IBFC,
  Cebraspe) ou edital ainda não publicado.
- **TJ-PR Técnico Judiciário (2025)** — critério real e detalhado, mas o
  cargo exige apenas Ensino Médio, fora do escopo de nível superior.

## Sem síntese de padrões gerais (camada 2) ainda

Só 3 provas coletadas — pouco pra uma síntese estatística confiável, e um
dos dois formatos (Redação) tem só 1 exemplar. Igual combinado, não
geramos `padroes-gerais.json` nesta rodada.
