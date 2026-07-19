# Base de calibração Consulplan

Pesquisamos concursos de nível superior organizados pela Consulplan
(institutoconsulplan.org.br / consulplan.net) dos últimos 12 meses
(jul/2025–jul/2026) com prova discursiva efetivamente realizada e critério
de correção detalhado publicado.

## Alerta de qualidade de fonte — resolvido, ao contrário do que se temia

Havia um alerta prévio (reclamações públicas sobre "falta de transparência
na correção") que levantava a hipótese de a Consulplan se comportar como a
FCC (sem documento de critério público). **Isso não se confirmou**: a
Consulplan publica sim critério detalhado — a tabela de pontos já sai no
próprio edital, e depois da correção um "Padrão de Resposta" por cargo/tema.
O que não existe é um espelho individualizado por candidato (mostrando
exatamente que trechos do texto de cada um foram penalizados) — isso é uma
inferência da leitura direta dos documentos, não uma política declarada
pela banca.

## O que entrou

2 concursos, mostrando duas variações estruturais reais da mesma banca:

- **`see-mg-peb-2025.json`** — SEE/MG, Professor de Educação Básica, prova
  28/09/2025. Modelo de **desconto por erro**: 6 critérios em 2 blocos
  (Macroestruturais: Conteúdo 4 + Argumentação 4 + Coerência 4 = 12;
  Microestruturais: Sintaxe 1 + Morfossintaxe 3 + Desvios 4 = 8), total 20.
- **`vitoria-es-auditor-2026.json`** — Prefeitura de Vitória/ES, Auditor de
  Atividades Urbanas, prova 26/04/2026. Mesmos 6 critérios, mas os 3
  macroestruturais usam uma **rubrica holística por nível** (Pleno/
  Satisfatório/Regular/Insuficiente/Nulo) em vez de desconto por erro —
  variação estrutural real dentro da mesma banca, confirmada com texto
  literal do Padrão de Resposta.

Um terceiro concurso bem documentado (Prefeitura de Uberlândia/MG, Edital
01/2025, prova em 26/10 e 02/11/2025) não entrou na base por ora — usa a
mesma estrutura de 6 critérios com pesos próprios (total 30 pontos), e o
cargo de Procurador Municipal tem uma peça jurídica real (contestação com
citação de jurisprudência do STJ/STF) como padrão de resposta, o achado
mais detalhado desta pesquisa. Fica documentado aqui para uma futura
expansão, mas não foi incluído agora pra manter o escopo desta rodada.

## Confirmações importantes

- **Linhas mínimas e máximas variam por edital e por tipo de peça**: 15-30
  no SEE/MG, 20-30 em Uberlândia/Vitória, e até 60-120 para peça jurídica de
  Procurador (Uberlândia) — nunca fixo. O motor usa o campo opcional já
  existente, nunca assume um valor padrão.
- **Zeramento é sempre "tudo ou nada"** por violação formal (fuga ao tema,
  identificação, cópia integral dos textos motivadores, linha mínima,
  formas propositais de anulação) — não há regra de "zerar uma competência
  específica" como em outras bancas.

## Concursos verificados mas descartados

TJ-RO (fora da janela), Câmara de Araraquara/SP (fora da janela), ARCE/CE
2025 (prova em 18/05/2025, poucas semanas antes do início da janela —
achado rico, mas descartado pela data), MPMG 2022 (fora da janela), TJ-MS e
Potirendaba/SP (provas ainda não aplicadas até 18/07/2026).

Se surgir um documento de espelho individualizado por candidato, ou
concluirmos que vale incluir o exemplo de Uberlândia, vale revisitar esta
pesquisa.
