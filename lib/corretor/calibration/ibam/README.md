# Base de calibração IBAM

Instituto Brasileiro de Administração Municipal. Confirmamos que a banca
opera por pelo menos duas infraestruturas distintas sob a mesma marca:
`ibamsp-concursos.org.br` (hospedado em `anexos.cdn.selecao.net.br` —
plataforma "seleção.net.br", concentra concursos de São Paulo) e
`ibam-concursos.org.br` (path estático próprio, concursos de outros
estados — RJ, PE). Tratamos como a mesma organização, mas **os critérios
NÃO se repetem de forma confiável entre operações, nem entre cargos do
mesmo concurso** — ver achados abaixo.

## O que entrou

2 exames do MESMO concurso, MESMA data de prova, cargos diferentes —
escolhidos deliberadamente para mostrar a variação real:

- **`araraquara-coordenador-pedagogico-2025.json`** — Concurso 001/2025,
  Coordenador Pedagógico/Diretor de Escola, prova 24/08/2025. Conteúdo(9)
  + Estrutura(3) + Português(8) = 20/questão × 2 = 40 pontos.
- **`araraquara-analista-procuradoria-2025.json`** — Concurso 002/2025,
  Analista de Procuradoria, mesma prefeitura, mesma data. Aspectos
  jurídicos(15) + Português(5) = 20/questão × 2 = 40 pontos — só 2
  critérios, sem a categoria "Estrutura" do cargo pedagógico.

Ambos verificados por mim pessoalmente, direto dos PDFs dos editais de
abertura (baixados e extraídos com pdftotext).

## Achado central: nada é fixo — nem regra de linha, nem penalidade, nem critério

Confirmamos, em 6+ editais de abertura reais lidos (Araraquara ×2, Franca,
Elias Fausto, Bebedouro, Guarujá, Caruaru/PE):

- **Distribuição de critérios varia por cargo** dentro do mesmo concurso
  (ver acima).
- **Faixa de linhas varia por edital**: 15-20 (Araraquara), 25-30 (Franca/
  Elias Fausto/Bebedouro/Guarujá/Caruaru).
- **Mecanismo de penalização por linha varia**: sem penalidade explícita
  (Araraquara, Bebedouro), desconto fixo de 5 pontos (Franca, Elias
  Fausto), desconto graduado por linha (Guarujá: 1pt/linha faltante,
  0,5pt/linha excedente), ou **zeramento automático** (Caruaru/PE).
- **Total de pontos da prova varia**: 40 (Araraquara, Franca, Elias
  Fausto, Bebedouro), 50 (Guarujá), 40 (Praia Grande, peça+questões).

Por isso o prompt da banca (`lib/corretor/bancas/ibam.ts`) não assume
nenhuma distribuição fixa — sempre prioriza o documento disponível.

## Zeramento (confirmado, texto quase idêntico entre editais de SP)

Não responder à proposta, fugir ao tema/tipologia, texto não articulado
verbalmente ou fora do local apropriado, dados incompatíveis com a
proposta, escrita a lápis, em branco, letra ilegível, espaçamento
excessivo — e, em editais que adotam essa regra (nem todos), identificação
indevida do candidato. Evidência real de zeramento total: candidato
15513 (Araraquara, Coordenador Pedagógico) recebeu 0,00 em ambas as
questões no resultado divulgado.

## Concursos verificados mas descartados

Franca/SP (Procurador, 03/2025) — prova em 18/05/2025, fora da janela de
12 meses. Praia Grande/SP (Procurador, 002/2026) — prova agendada para
22/09/2026, ainda não aplicada. Saquarema/RJ (002/2026) — sem etapa
discursiva. Caruaru/PE (01/2025) — prova em 06/07/2025, cerca de 13 dias
antes do início estrito da janela — critério real confirmado (zeramento
automático por linha, diferente de todos os exemplos de SP) mas não
incluído como exame completo por essa margem de calendário.
