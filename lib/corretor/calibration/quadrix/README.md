# Base de calibração Quadrix

A própria central de ajuda oficial da Quadrix (ajuda.quadrix.org.br) afirma
que os critérios de avaliação da prova discursiva são definidos edital a
edital — não existe um critério fixo geral da banca. Isso é verdade em
teoria, mas na prática, dentro da amostra que conseguimos verificar (5
concursos de conselhos profissionais, 2025-2026), a banca reusa o mesmo
template quase sem alteração.

## O que entrou

2 concursos, ambos usando o mesmo template real e confirmado:

- **`coren-ac-enfermeiro-fiscal-2026.json`** — COREN-AC, Enfermeiro Fiscal,
  prova 15/03/2026. Único com trecho literal do tema real capturado
  ("canetas emagrecedoras"/Ozempic/Wegovy/Conitec).
- **`crefito13-agente-fiscal-2025.json`** — CREFITO-13/MS, Agente Fiscal,
  prova 19/10/2025. Verifiquei este edital pessoalmente, direto do PDF
  (baixado e extraído com pdftotext) — confirma que a estrutura é
  literalmente idêntica à do COREN-AC, mesmo sendo órgãos diferentes.

## O modelo confirmado (texto idêntico em 5 editais de 2025-2026)

- **Aspectos Formais e Linguísticos (AFL)** = Apresentação(2,0) +
  Coerência(2,0) + Coesão(2,0) + Tipo Textual(2,0) + Linguagem(2,0) = até 10.
- **Aspectos Técnicos (AT)** = Tema (TM), até 5,0.
- **Nota final: NPD = [AFL + (AT × 4)] ÷ 3** — uma fórmula ponderada, não
  soma simples. O peso de TM (conteúdo/tema) é efetivamente 4x maior que
  cada ponto de AFL antes da divisão final. Isso está documentado no prompt
  da banca (`lib/corretor/bancas/quadrix.ts`) para não ser confundido com
  uma soma direta.
- Limite de linhas: 20 mínimo / 30 máximo, idêntico nos 5 editais.
- Zeramento (idêntico nos 5 editais): fuga ao tema, tipologia errada,
  lápis/cor errada, folha em branco, menos de 20 linhas, língua estrangeira,
  letra ilegível, espaçamento excessivo, **expressões injuriantes/
  discriminatórias/abusivas** (mesma regra específica vista na IDECAN),
  identificação indevida, texto não articulado verbalmente.

## Limitação real

Esse template só foi confirmado dentro de uma família específica de
editais (conselhos profissionais de fiscalização — CREFITO, CRP, COREN,
CRB). Um edital de outro tipo (SEDES/DF 2026, ainda não aplicado até esta
pesquisa) usa uma estrutura de pontuação totalmente diferente (100 pontos,
50% da nota) — confirma que a banca de fato varia por edital, como a
própria central de ajuda da Quadrix diz. Trate o modelo acima como o mais
recorrente confirmado nesta família, não como universal.

## Concursos verificados mas descartados

CRP-15/AL, CRMV/MG, XIV Concurso Título de Especialistas, CRM/MG (fora da
janela, 2023-2024); CFP (prova em 03/12/2024, antes da janela); CRF-MS,
CFBio, CORE-BA (provas em abril-maio/2025, poucas semanas antes do início
da janela); CREFITO-6 (banca correta é IBADE, não Quadrix — confusão de
busca); vários concursos ainda em fase de inscrição/objetiva, sem
discursiva aplicada até 18/07/2026 (SEDES/DF, CREF-PI, CREF-MA, CREA-RO,
CRQ-RS, CONTER, CRQ-MS, CRT-SP, Faculdade de Medicina de Jundiaí,
Prefeitura de Cristalina/GO).
