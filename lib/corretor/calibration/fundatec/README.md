# Base de calibração FUNDATEC — fina por design, e com uma correção importante

## Correção crítica: o exemplo original não era da FUNDATEC

A pesquisa que embasou este pedido citava um "espelho de correção" da
Prefeitura de Formoso do Araguaia/TO (modelo "citação de princípios", 3,0
pontos por princípio citado e discutido, máximo 5 por questão) como sendo da
FUNDATEC. **Não é.** Abrimos o documento pessoalmente: ele diz literalmente
"a FUNATEC divulga" e é assinado "Equipe Funatec", hospedado em
`funatec.org.br`. **FUNATEC** (Fundação de Apoio Tecnológico, Teresina-PI) e
**FUNDATEC** (Fundação Universidade Empresa de Tecnologia e Ciências, Porto
Alegre-RS, a banca real que organiza os concursos deste projeto) são duas
instituições diferentes, com nomes muito parecidos. Nenhum dado desse
concurso entrou nesta base.

## O que entrou

**1 concurso** (`dpe-sc-defensor-publico-2026.json`): DPE/SC, Defensor
Público Substituto, Edital 01/2026, prova em 30-31/05/2026 (Peça Processual,
30-120 linhas; 4 Questões Discursivas, 15-30 linhas cada). Critério real
confirmado no próprio edital (item 8.5.3, lido por mim direto do PDF):
avaliação qualitativa por "adequação ao problema apresentado, domínio do
raciocínio jurídico, fundamentação e sua consistência, capacidade de
interpretação e exposição, técnica profissional demonstrada" + uso do
padrão culto da língua. **Sem tabela de pontos pública** — o "padrão de
resposta da prova" com pontuação exata por quesito existe (citado no
próprio edital) mas não é público; só vimos fragmentos dele em julgamentos
de recursos.

## Por que a base ficou fina

A FUNDATEC real tem um documento de 2022 (PGE/RS, Analista Jurídico,
concurso código 626) extremamente completo — enunciado real + padrão de
resposta com pontuação exata por quesito (escala "abordou plenamente/
parcialmente/não abordou") — mas está fora da janela de 12 meses pedida, e
por isso não entrou na base "ativa" (fica só documentado aqui como
referência histórica de como a banca estrutura esse tipo de questão quando
o documento é público).

Dentro da janela, verificamos 3 concursos reais e distintos (DPE/SC, CRP/RS,
PC-RS) mas nenhum tinha uma tabela de pontos completa e pública — só regras
de linha/zeramento no edital (confirmadas) e, no máximo, fragmentos de
recurso mostrando pontuação de um quesito isolado.

## Achado importante: limite de linhas

**Não é fixo entre editais, e a regra de zeramento por linha MÍNIMA varia**:

- **DPE/SC** (usado na base): Peça Processual 30-120 linhas, Questões
  Discursivas 15-30 linhas cada. O edital diz "qualquer texto além desta
  extensão será desconsiderado" (8.5.1) — cobre excesso, mas não vimos uma
  cláusula explícita de zeramento por ficar ABAIXO do mínimo.
- **CRP/RS** (Concurso 01/2026, cargo Assessor Técnico de Políticas
  Públicas, Ensino Superior + Mestrado) — confirmamos, direto do edital
  (item 9.10.l): *"For redigida em texto inferior ao número de linhas
  estipuladas"* → nota ZERO. Aqui SIM existe zeramento por linha mínima
  (15-30 linhas). Não incluímos este concurso como exame completo por não
  termos achado o padrão de resposta/conteúdo (protegido por WAF da AWS),
  mas a regra de linha e zeramento (item 9.10, a-m) foi lida e confirmada
  por mim, direto do PDF.

Conclusão: a hipótese original ("FUNDATEC só usa limite MÁXIMO, nunca
mínimo") **não se confirmou como regra geral** — pelo menos um edital real
(CRP/RS) zera por ficar abaixo do mínimo. Como sempre, o motor não assume
nenhum valor fixo — usa o campo opcional já existente.

## Zeramento (confirmado, quase idêntico em DPE/SC, CRP/RS e PC-RS)

Fuga ao tema/gênero, identificação indevida, texto em branco, texto não
articulado verbalmente, língua estrangeira, letra ilegível, texto fora do
espaço reservado, cópia predominante da coletânea, espaçamento excessivo,
formas propositais de anulação, não devolução da folha definitiva. O CRP/RS
acrescenta a regra de linha mínima (ver acima).

## Concursos verificados mas descartados

PC-RS (Delegado de Polícia, Edital 04/2025) — regras de linha confirmadas,
notas reais por candidato encontradas, mas o texto qualitativo do espelho
ficou atrás de um WAF que não conseguimos acessar. PGE/ES (Residência
Jurídica) — tem prova discursiva real e bem documentada, mas é processo
seletivo de residência (bolsa), não provimento de cargo efetivo — natureza
diferente de concurso público. PGM Porto Alegre e PGE/SP (Procurador) —
banca real é Cebraspe, não FUNDATEC (confusão em buscas). Concurso 872
(Procurador de Assembleia Legislativa) — espelho real, mas divulgado em
2024, fora da janela.
