# Cesgranrio — variabilidade confirmada (não é uma síntese numérica)

Diferente do Cebraspe e da FGV, a Cesgranrio **não tem um modelo de pontuação
fixo o bastante para sintetizar estatisticamente**. A base de calibração é
pequena (4 provas, 8 questões) e mostra três modelos genuinamente diferentes,
todos confirmados em documentos oficiais recentes:

| Concurso | Data | Modelo confirmado |
|---|---|---|
| CAIXA Edital 01/2025/NS | fev/2026 | 100% conteúdo técnico — qualidade textual só qualitativa, sem peso próprio |
| BNDES Edital 01/2024 | out/2024 | 60% conteúdo / 40% idioma (só na questão comum de Conhecimentos Transversais); zeramento da questão inteira por fuga ao tema/lápis/ilegibilidade — não por dependência conteúdo→gramática |
| CNU 2024, Bloco 7 (banca Cesgranrio) | mai/2024 | 50% conteúdo / 50% idioma, com zeramento condicional explícito no edital: "Caso a questão receba nota zero quanto aos Conhecimentos Específicos, não será avaliada quanto ao uso do idioma" |

**Por isso, esta pasta não tem um `padroes-gerais.json`** (o formato usado por
Cebraspe/FGV para estimar estrutura/pontuação quando não há prova semelhante
na base). Forçar uma média estatística sobre 3 modelos tão diferentes
fingiria uma regularidade que não existe e calibraria mal qualquer questão
real.

## Como isso é usado (orientação, não fonte de fallback numérico)

A variabilidade confirmada acima já está documentada diretamente no prompt
da banca (`lib/corretor/bancas/cesgranrio.ts`), reforçando ao modelo que:

1. Não deve assumir nenhuma das três divisões (100/0, 60/40, 50/50+zeramento)
   como padrão — sempre extrair a divisão real do padrão de resposta
   fornecido ou do próprio enunciado da questão.
2. Na aproximação genérica (quando nenhuma fonte real está disponível), não
   inventar uma divisão conteúdo/idioma nem uma regra de zeramento condicional
   — tratar qualidade textual só nos comentários/pontos de melhoria.

`getSinteseGeral()` (camada 2 de calibração) procura especificamente por
`padroes-gerais.json` — como esse arquivo não existe aqui, a Cesgranrio nunca
usa a camada 4 (síntese geral). O fluxo para a Cesgranrio é sempre: padrão
fornecido → itens do enunciado → prova semelhante (só 4 disponíveis) →
aproximação genérica cautelosa.
