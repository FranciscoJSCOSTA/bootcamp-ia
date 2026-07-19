# Base de calibração FCC — vazia por design, não por bug

Pesquisamos 21 concursos reais da FCC (Fundação Carlos Chagas) de nível
superior dos últimos 12 meses, com prova discursiva efetivamente realizada,
e nenhum tinha um documento oficial de padrão de resposta/critério de
correção com quesitos detalhados publicado de forma pública.

O que a FCC publica, na prática:
- Na maioria dos casos, só listas de candidatos com nota total por etapa
  (sem quebra por item/quesito).
- Em pelo menos um caso (PGE-GO), existe algo chamado "Critérios de
  Correção" com estrutura real, mas fica atrás de um portal de acesso
  pessoal do candidato (número de inscrição + código de acesso) — não é
  um documento público, então não foi coletado.

Por isso esta pasta não tem arquivos `.json` de prova — `loadExams()` em
`lib/corretor/calibration/index.ts` já trata uma pasta vazia/inexistente
sem erro, então o motor da FCC sempre cai direto de "itens do enunciado"
pra "aproximação genérica" (nunca tem "prova_semelhante_calibracao" como
fonte, porque não há nada aqui pra encontrar).

Se surgir uma fonte pública real (ex: um edital específico que publique o
critério, ou alguém com acesso ao portal do candidato compartilhar um
critério de correção real), revisitar esta pesquisa faz sentido.
