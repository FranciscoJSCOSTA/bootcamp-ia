# Processo de crescimento — FGV e Cesgranrio (assistido por agente)

Diferente do Cebraspe, FGV (`conhecimento.fgv.br`) e Cesgranrio
(`cesgranrio.org.br`) não têm uma API pública de eventos — o site é
navegável por página, não por endpoint estruturado. Checar por novidade
exige navegar e interpretar página por página, o que precisa de um agente
(WebSearch/WebFetch), não é um script determinístico como o do Cebraspe.

Isso não muda as regras de segurança: o agente escreve candidatos em
`_pendente/`, nunca direto na base; nada vira "oficial" sem alguém revisar
e rodar `promover.mjs`.

## Como disparar uma checagem

Peça pra eu rodar (ou rode você mesmo via um agente) uma tarefa com este
formato — é essencialmente o mesmo processo já usado nas coletas originais,
só que perguntando por concursos **desde a última coleta**, não desde
sempre:

```
Verifique se a FGV [ou: a Cesgranrio] publicou algum concurso novo de nível
superior com espelho de correção/padrão de resposta detalhado desde
[data da última coleta] que ainda não esteja na base
(lib/corretor/calibration/{fgv,cesgranrio}/*.json — liste os concursos já
cobertos primeiro lendo os arquivos existentes).

Critério de qualificação (igual sempre foi): nível superior + prova
discursiva efetivamente realizada + documento oficial de padrão de
resposta/espelho de correção com critério detalhado publicado de verdade
— não uma lista de resultado só com nota total.

Não fabrique nem force um candidato sem documento real. Se não achar nada
novo, reporte isso honestamente (já aconteceu antes, é um resultado válido).

Para os que qualificarem, colete o conteúdo completo (mesmo formato dos
arquivos já existentes na base) e salve em
lib/corretor/calibration/{banca}/_pendente/ — NÃO na pasta principal.

Ao final, me reporte: quantos concursos novos verificou, quantos
qualificaram, e liste os arquivos criados em _pendente/.
```

## Depois que o agente termina

Mesmo fluxo do Cebraspe:

```
node scripts/crescimento-base-calibracao/promover.mjs fgv --listar
node scripts/crescimento-base-calibracao/promover.mjs cesgranrio --listar
```

Revisar o conteúdo, só então promover.

## Nota sobre a Cesgranrio especificamente

A Cesgranrio já mostrou (na coleta original) que não tem um modelo de
pontuação fixo — cada edital pode ser diferente (100% conteúdo, 60/40,
50/50+zeramento condicional, etc.). Isso não muda o processo de detecção,
mas vale reforçar pro agente: documentar honestamente o modelo de cada novo
edital encontrado, sem assumir que vai repetir um dos padrões já vistos.
