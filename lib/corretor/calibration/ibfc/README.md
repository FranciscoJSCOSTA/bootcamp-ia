# Base de calibração IBFC — fina por design, não por bug

Pesquisamos concursos de nível superior organizados pelo IBFC (Instituto
Brasileiro de Formação e Capacitação) dos últimos 12 meses (jul/2025–jul/2026)
com prova discursiva efetivamente realizada e critério de correção detalhado
publicado. Resultado: **1 concurso qualificado**, com a mesma limitação já
vista em VUNESP/AOCP (estrutura de pontuação real, sem conteúdo temático
específico público).

## O que entrou (`tjpe-analista-judiciario-2025.json`)

TJPE, Edital 01/2025, Analista Judiciário — prova aplicada em 28/09/2025.
Li o edital inteiro pessoalmente (baixado e extraído com `pdftotext`, não só
relatado por pesquisa). Critérios reais: Estrutura (3 pts), Conteúdo (5 pts),
Expressão (2 pts), total 10, aprovação com 6+. Limite de linhas: 20 mín. / 30
máx. neste edital específico. Zeramento (item 9.2.15): em branco, fuga ao
tema, fuga à tipologia/proposta, ilegível/desenhos/idioma diferente do
português, caneta de cor errada (não aplicável ao formato digital), marca de
identificação, abaixo do mínimo de linhas.

**Limitação real**: não há enunciado literal da questão aplicada (o Anexo III
do edital só lista áreas de conhecimento) nem um padrão de resposta com o
conteúdo esperado — isso fica atrás de um portal de login exclusivo pra
candidatos, disponível só durante o prazo recursal. Confirmamos isso
tentando acessar a página de resultado do TJPE: é uma tela de login, não
conteúdo público.

## Por que só 1 concurso

Pesquisamos ~20 concursos IBFC de nível superior no período (TJMG, EBSERH,
TRF5, Correios, Secretaria de Educação da Bahia, IBGE, entre outros) — a
maioria não tinha discursiva aplicada dentro da janela, ou a prova ainda não
tinha sido aplicada (IBGE 2026), ou não tinha discursiva (concursos só
objetiva+títulos). Um espelho de correção já conhecido antes desta pesquisa
(DETRAN/DF, Edital 01/2022) ficou de fora por estar fora da janela de 12
meses — mas foi útil pra confirmar que o modelo de zeramento é estável desde
2017.

## Sobre o modelo de critérios (Estrutura/Conteúdo/Expressão)

Confirmamos esse modelo de 3 critérios no edital mais recente (TJPE 2025,
dentro da janela). Mas editais IBFC mais antigos usados como referência
histórica (EMBASA 2017, IDAM-AM 2018, Sergipe/SEPLAG 2018) mostraram modelos
bem diferentes — 5 a 6 critérios, tabelas separadas de "correção formal" e
"correção de conteúdo", ou avaliação por faixas qualitativas (Ruim/Regular/
Bom/Muito Bom) em vez de pontos fixos, às vezes variando por cargo dentro do
mesmo edital. **O modelo de 3 critérios não é necessariamente universal** —
é o confirmado mais recente, não uma regra fixa da banca. O prompt da banca
(`lib/corretor/bancas/ibfc.ts`) reflete isso: usa o modelo de 3 critérios como
referência default, mas prioriza sempre o que o padrão de resposta ou
enunciado da questão específica disser.

## Sobre o limite mínimo de linhas

Confirmado como uma regra real e recorrente da IBFC (zeramento por "extensão
inferior ao mínimo de linhas estabelecido", item 9.2.15.g do TJPE, com texto
quase idêntico em editais de 2017 a 2025), mas **o número exato não é fixo**:
20-30 é o padrão mais comum (6 editais confirmados), mas achamos uma exceção
real (IDAM-AM 2018: 10-20). Por isso, igual VUNESP, o motor nunca assume um
valor padrão — é um campo opcional que o usuário preenche com o número do
próprio edital.

Se surgir um espelho de correção preenchido (com questão real + padrão de
resposta) publicamente acessível pra algum concurso dentro da janela, ou um
segundo concurso qualificado, vale revisitar esta pesquisa.
