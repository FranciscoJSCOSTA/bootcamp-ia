# Base de calibração FAURGS — vazia por design, não por bug

Pesquisamos concursos organizados pela FAURGS (Fundação de Apoio da
Universidade Federal do Rio Grande do Sul) dos últimos 12 meses
(jul/2025–jul/2026) e a conclusão é diferente de todas as outras bancas já
pesquisadas neste projeto: **não é falta de divulgação de critério — é que
a etapa discursiva praticamente não existe nos concursos atuais da banca.**

## O que a pesquisa confirmou

A FAURGS tem, sim, know-how real de prova discursiva — confirmamos dois
editais reais e detalhados (Edital 61/2019, TJRS Juiz de Direito Substituto,
e Edital 11/2012, TJRS Taquígrafo Forense), com critérios sofisticados
(dupla correção independente, desidentificação do candidato, nota mínima
de aprovação, desconto por erro). Mas isso está restrito a nichos muito
específicos — magistratura e taquigrafia forense do TJRS — não é a
estrutura padrão dos concursos que a banca roda hoje.

Verificamos 9 editais reais da FAURGS (lidos diretamente, não por resumo de
busca): UFRGS técnico-administrativo, HCPA (múltiplos processos
seletivos), TelessaúdeRS-UFRGS (múltiplos PSS). **Só 2 desses 9 tinham
alguma forma de discursiva** (o TJRS Taquígrafo, e um PSS antigo de
Assistente Técnico de Comunicação da TelessaúdeRS, edital de 2024) — todos
os demais (a grande maioria, incluindo todos os processos de 2025-2026)
eram só prova objetiva + títulos/currículo.

## Por que a base ficou vazia

O cliente que historicamente gerava os exemplos mais ricos de discursiva
FAURGS — o TJRS, para o concurso de Juiz de Direito — **migrou para a banca
FGV a partir de 2025**. Não encontramos, portanto, nenhum concurso real com
discursiva efetivamente aplicada pela FAURGS dentro da janela de 12 meses
(jul/2025–jul/2026). O único candidato futuro identificado (IFSC, com
discursiva prevista de até 15 linhas para cargos docentes) ainda não teve
edital de abertura publicado até a data desta pesquisa.

## O que isso significa para o motor

A banca FAURGS está registrada no seletor da aplicação (para o caso de o
usuário ter um documento real e específico do próprio edital dele em mãos,
que pode ser colado como "padrão de resposta" na correção), mas:
- Não há `.json` de prova nesta pasta — `loadExams()` trata isso sem erro,
  igual já acontecia com a FCC.
- O prompt da banca (`lib/corretor/bancas/faurgs.ts`) não assume nenhuma
  estrutura fixa de critério — cai quase sempre em "aproximação genérica",
  deixando isso explícito no aviso de transparência ao usuário.

Se a FAURGS voltar a aplicar discursiva com regularidade (ex: se o TJRS
voltar pra essa banca, ou o IFSC publicar edital com a discursiva
prevista), vale revisitar esta pesquisa.
