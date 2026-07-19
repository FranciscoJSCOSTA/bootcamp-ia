# Base de calibração IDIB

Pesquisamos concursos de nível superior organizados pelo IDIB (Instituto de
Desenvolvimento e Integração Brasileira) dos últimos 12 meses
(jul/2025–jul/2026) com prova discursiva efetivamente realizada e critério
de correção detalhado publicado.

## O que entrou

**1 concurso** (`jequie-professor-2025.json`): Prefeitura de Jequié/BA,
Edital 02/2025, Professor Licenciado em Pedagogia, prova em ~18/01/2026.
Enunciado literal COMPLETO (2 textos motivadores reais — reportagem sobre
violência escolar + referência a campanha de combate à violência — tema
"Caminhos para o combate à violência nas escolas brasileiras", exigindo
proposta de intervenção, formato claramente inspirado no ENEM) e tabela de
critérios completa: Formal(15)+Textual(7,5)+Técnico(7,5)=30, aprovação 50%.
Verificado por mim pessoalmente, direto dos PDFs do edital e do caderno de
prova real aplicado.

## Achado notável: o modelo mudou entre 2023/2024 e 2025/2026

Um edital anterior da mesma banca (IDAF-ES, Espírito Santo, edital de
29/12/2023, prova aplicada 17/03/2024 — fora da janela de 12 meses, usado
só como referência histórica) tinha um modelo BEM diferente: fórmula
`ND = DC − 2×(NE/TL)`, onde DC é a nota de domínio do conteúdo e o desconto
por erro é ponderado por tipo (0,4 convenções da escrita, 0,6
morfossintaxe, 1,0 propriedade vocabular). **Essa fórmula não se repete nos
4 editais de 2025-2026 que verificamos** — o IDIB migrou para um modelo de
desconto direto por módulo (Formal/Textual/Técnico), sem a fórmula
NE/TL. Se aparecer uma referência à fórmula antiga do IDAF-ES em um
documento futuro, não assuma que ela ainda é o padrão — confirme.

## Achado ainda mais notável: template idêntico ao da IDECAN

A tabela de critérios confirmada (Formal 15,0/Textual 7,5/Técnico 7,5,
com os mesmos nomes de subitem e o mesmo desconto de 0,25 por erro) é
**literalmente idêntica**, subitem por subitem, ao modelo já usado pela
banca IDECAN neste projeto (ver `lib/corretor/calibration/idecan/`). Isso
sugere que as duas bancas compartilham infraestrutura/template de correção
— não que sejam a mesma banca (são organizações diferentes, confirmadas
por editais e domínios distintos), mas o "motor" de critério por trás
parece ser o mesmo software/vendor. Documentado aqui para não causar
confusão se alguém notar a coincidência depois.

## Confirmado: distribuição de pontos varia por edital, mesmo dentro do modelo atual

Goianinha/RN (Edital 02/2026) e Sena Madureira/AC (Edital 02/2025) usam a
MESMA estrutura 15/7,5/7,5 do modelo de Jequié — mas não conseguimos o
caderno de prova real com o tema aplicado para nenhum dos dois, só a
confirmação estrutural via edital, por isso não entraram como exames
completos na base. Um edital futuro (Araguaína/TO, ainda não aplicado até
a data desta pesquisa) usa pesos diferentes: 10,0/10,0/10,0 — confirma que
a distribuição de pontos pode variar mesmo dentro do modelo "atual".

## Limite de linhas e zeramento

Confirmado no edital de Jequié (itens 10.2, e zeramento não reproduzido
neste edital específico mas confirmado no IDAF-ES de 2023/2024 com texto
quase idêntico): mínimo 15, máximo 25 linhas. Zeramento (edital IDAF-ES,
usado como referência já que a estrutura de zeramento costuma ser estável
entre editais da mesma banca): identificação do candidato, assinatura em
local indevido, escrita a lápis, letra ilegível, texto não articulado
verbalmente, texto em branco, fuga ao tema/modalidade, linhas
insuficientes, e **"apresentar texto escrito com expressões injuriantes,
discriminatórias ou abusivas"** — confirma a terceira banca do projeto
(depois de IDECAN e FEPESE) com essa regra específica de zeramento por
linguagem ofensiva.

## Sobre o alerta de "falta de transparência" (Reclame Aqui)

Não se confirmou como limitação de disponibilidade de documentos — o IDIB
publica editais, gabaritos e até "padrão de resposta" pós-correção de forma
bastante acessível. A limitação real observada foi outra: mesmo quando
publica um "padrão de resposta" pós-prova, o documento normalmente só
repete a tabela genérica de critérios do edital, sem detalhar o que conta
como "conteúdo pleno" para o tema específico aplicado — isso vale tanto
para o edital antigo (IDAF-ES 2023) quanto para o mais recente (Jequié
2025/2026).

## Concursos verificados mas descartados

Araguaína/TO (Edital 001/2026) — critério real lido, mas prova agendada
para 07/08/2026, ainda não aplicada até a data desta pesquisa. IDAF-ES
(2023/2024) — fora da janela, usado só como referência histórica.
Tibau/RN, Câmara de Rio Verde/GO — pistas de busca não verificadas por
leitura direta do PDF, não incluídas.
