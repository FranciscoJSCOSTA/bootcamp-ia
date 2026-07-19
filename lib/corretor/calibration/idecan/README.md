# Base de calibração IDECAN

Pesquisamos concursos de nível superior organizados pela IDECAN (Instituto
de Desenvolvimento Educacional, Cultural e Assistencial Nacional) dos
últimos 12 meses (jul/2025–jul/2026) com prova discursiva efetivamente
realizada e critério de correção detalhado publicado.

## O que entrou

2 concursos, os dois com enunciado literal real da questão aplicada (melhor
cobertura que conseguimos em VUNESP/AOCP/IBFC, onde só tínhamos a estrutura
de pontuação, sem o enunciado completo):

- **`degase-rj-bibliotecario-2025.json`** — DEGASE-RJ, Bibliotecário, prova
  aplicada 11/10/2025, dentro da janela.
- **`sesap-rn-assistente-social-2025.json`** — SESAP-RN, Assistente Social,
  prova aplicada 26/05/2025 (antes da janela), mas resultado definitivo
  divulgado 02/09/2025 (dentro da janela) — incluído com essa ressalva,
  mesmo critério já usado pro TRE-TO na coleta da AOCP.

## Critérios reais confirmados (idênticos nos dois editais)

Verifiquei pessoalmente, direto do PDF de cada edital: 3 módulos — **Formal**
(15 pontos: 6 subitens de domínio da norma culta/ortografia/concordância/
regência/colocação pronominal/estrutura sintática, com desconto de 0,25 por
erro em cada), **Textual** (7,5 pontos: 5 subitens sobre tipologia/sequência
lógica/conectivos/estrutura sintático-semântica/coesão-coerência), **Técnico**
(7,5 pontos: 5 subitens sobre compreensão da proposta/argumentação/
progressão temática/conhecimento do tema/senso crítico). Total 30 pontos.

O texto de cada subitem é **literalmente idêntico** entre os dois editais
(órgãos diferentes, mesmo ano) — confirma que é um template fixo da banca,
não coincidência.

## Duas variações administrativas (mesma tabela de pontos)

- **SESAP-RN** ("Prova Discursiva"): 1 tema único definido pela banca,
  aprovação com 60% do total (18/30 pontos).
- **DEGASE-RJ** ("Prova de Redação"): 2 temas propostos, candidato escolhe 1,
  aprovação com pontuação fixa de 15 pontos (=50%).

Não é um critério de correção diferente — é a mesma tabela de pontos, só
variando quantos temas são oferecidos e o limiar de aprovação. O prompt da
banca (`lib/corretor/bancas/idecan.ts`) trata isso como uma variação
administrativa, não dois formatos de correção distintos (diferente do que
vimos na AOCP, onde os dois formatos têm tabelas de critérios genuinamente
diferentes).

## Zeramento — achado mais importante desta pesquisa

Confirmado, texto idêntico nos dois editais (item 14.2.12 / 9.16): 10 motivos
de nota zero — não seguir as orientações do caderno, linhas abaixo do
mínimo, identificação do candidato, texto não articulado verbalmente (só
desenhos/números/versos), em branco, fuga total ao tema/tipologia,
qualquer marca de identificação, escrita a lápis, letra ilegível, e um
motivo que nenhuma outra banca já modelada neste projeto tinha: **"apresentar
texto escrito com expressões injuriantes, discriminatórias e/ou abusivas."**

## Limite de linhas — confirma o padrão "não fixo" já visto em VUNESP/IBFC

- SESAP-RN: 15 mín. / 20 máx., sem diferenciar por nível de escolaridade.
- DEGASE-RJ: diferencia por nível — 30 mín. / 40 máx. para cargos de nível
  superior, 20 mín. / 30 máx. para nível médio/técnico.
- **Discrepância real e não resolvida**, documentada no arquivo do DEGASE-RJ:
  o enunciado realmente aplicado ao cargo de Bibliotecário (nível superior)
  usa 20-30 linhas — o limite de nível MÉDIO do mesmo edital, não o de nível
  superior (30-40) que o próprio edital declara. Não achamos retificação que
  explique isso. Reportado como fato observado, não resolvido.

Por isso, igual VUNESP e IBFC, o motor nunca assume um valor fixo — é um
campo opcional preenchido pelo usuário com o número do próprio edital.

## O que ficou de fora (e por quê)

- **"Espelho de correção da prova discursiva — critérios que zeram a
  redação"** (documento específico mencionado na tarefa, em
  concurso.idecan.org.br) — bloqueado por proteção Cloudflare em todas as
  tentativas (curl, WebFetch, Wayback Machine). O conteúdo dessa regra,
  porém, está confirmado via os dois editais que conseguimos ler
  diretamente (mesmo texto, ver seção "Zeramento" acima) — a lacuna é só na
  fonte específica, não no conteúdo.
- Um terceiro formato ("questão prática, estudo de caso") foi mencionado em
  buscas sobre o Concurso Unificado SEAD-PI 2026, mas a prova está agendada
  para set/2026 — ainda não aplicada, e não verificado por documento
  primário. Não incluído.
- ALECE 2026 — discursiva agendada, ainda não aplicada.
- UERN (associado incorretamente à IDECAN em buscas) — na verdade organizado
  pela COMPERVE/UFRN, banca errada, descartado.
- Não localizamos um "padrão de resposta" (chave de correção com o conteúdo
  esperado) publicamente acessível para nenhum dos dois concursos incluídos
  — por isso os itens `gabarito` seguem `disponivel: false` nos dois
  arquivos.

Se o bloqueio de acesso a concurso.idecan.org.br for contornado no futuro,
ou aparecer um terceiro concurso qualificado, vale revisitar esta pesquisa.
