# Base de calibração IADES

Pesquisamos concursos de nível superior organizados pela IADES
(iades.com.br) dos últimos 12 meses (jul/2025–jul/2026) com prova
discursiva efetivamente realizada e "parâmetros de correção" publicados.

## Os 2 exemplos mais completos já coletados neste projeto

- **`ses-go-fiscal-saude-2026.json`** — SES/GO, Fiscal de Saúde Pública,
  prova 10/05/2026. Enunciado literal COMPLETO (2 textos motivadores + tema
  + 3 tópicos com pontuação) e o conteúdo esperado detalhado por tópico.
- **`crn3-advogado-2026.json`** — CRN-3, Advogado, prova 26/04/2026. Mesmo
  nível de detalhe, com o achado mais granular do projeto: um dos tópicos é
  subdividido em frações de pontos (0,7+0,6+0,7=2,0) dentro do próprio
  padrão de resposta.

Ao contrário de VUNESP/IBFC/AOCP (onde só tínhamos a estrutura de
pontuação, sem o conteúdo esperado), aqui temos o pacote completo: pergunta
real + o que a banca espera como resposta, tópico por tópico.

## Matemática confirmada (resolve a inconsistência da leitura preliminar)

**Parâmetros Linguísticos** — sempre 5 subitens (Texto/Tema/Coerência/
Coesão/Erros), cada um valendo o mesmo "valor-base" dentro do mesmo edital
(2,00 no CRN-3, 3,00 no SES/GO — **o valor-base varia por edital**, sempre
confira no documento específico). 4 dos 5 subitens são pontuados por
FAIXAS qualitativas (ex: 0,00 / 0,00-1,50 / 1,50-3,00), mas o 5º (**Erros**)
usa uma **fórmula contínua**: `ER = valor-base − ((NE/TL) × fator)`, onde
NE = número de erros e TL = total de linhas escritas. Isso explica por que
a leitura preliminar achou que "a soma não batia": a nota nominal de um
candidato real quase nunca fecha em número redondo (por causa do ER
fracionário), mesmo o teto teórico da tabela sendo limpo. Confirmei a
fórmula batendo contra uma nota real de candidato no SES/GO (NE=4, TL=39 →
ER=2,79, exatamente o valor publicado no resultado oficial).

**Parâmetros Técnicos (Argumentação)** = soma dos tópicos do enunciado —
**o número de tópicos varia por edital** (3 no SES/GO e CRN-3, 4 em outros
editais verificados como referência histórica — CFMV, CRMV-PI). Sempre o
mesmo teto do bloco linguístico (10+10, ou 15+15).

## Confirmado: modelo estável desde 2024

Testamos 6 documentos "Prova Discursiva — Parâmetros de Correção" de
editais/cargos diferentes (2024 a 2026) — a estrutura (títulos dos
subitens, faixas de pontuação) é idêntica palavra por palavra entre eles,
só variando valor-base, número de tópicos técnicos, e se os dois blocos
vêm num único PDF ou separados por cargo.

## Limite de linhas — a única banca com número FIXO até agora

Diferente de VUNESP, IBFC e Consulplan (onde o número mínimo varia por
edital), a IADES usa **"menos de 20 linhas anula a prova"** como boilerplate
fixo, confirmado sem alteração em 6 documentos de 2024 a 2026. Ainda assim,
o motor trata isso como campo opcional (não hardcoded) — se um edital
futuro usar um número diferente, o usuário informa o valor real do próprio
edital.

## Concursos verificados mas descartados

CNEN (prova 04/05/2025, antes da janela — mas usado como referência
histórica pra confirmar o modelo desde 2024); MTE e Prefeitura de Couto
Magalhães (ainda sem prova discursiva aplicada/documentada). CFMV e
CRMV-PI (dentro da janela, mesma estrutura confirmada, mas não incluídos
como arquivo — usados só como referência de variação de nº de tópicos, 4
em vez de 3) e CAU-RJ (idem) ficaram de fora para manter o escopo desta
rodada; documentados aqui como candidatos a uma expansão futura.
