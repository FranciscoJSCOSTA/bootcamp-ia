# Base de calibração IBADE

Pesquisamos concursos de nível superior organizados pela IBADE (domínio
atual: portal.ibade.selecao.site — o domínio antigo antigo.ibade.org.br
tem certificado SSL expirado e não deve ser usado) dos últimos 12 meses
(jul/2025–jul/2026) com prova discursiva efetivamente realizada e
"chave de correção" (terminologia própria da banca) publicada.

## O que entrou

2 concursos, mostrando dois formatos reais confirmados:

- **`castelo-es-procurador-2025.json`** — Prefeitura de Castelo/ES,
  Procurador Municipal, prova 30/11/2025. Formato **Peça Processual**
  (Mandado de Segurança), 30-50 linhas. Dado mais completo já coletado
  neste projeto para essa banca: caso concreto real, gabarito comentado
  completo, e tabela de pontos que verificamos somar exatamente 20,00 (LP
  Formal+Textual=10, Peça/estrutura=3, Mérito técnico=7).
- **`cro-ma-advogado-2026.json`** — CRO-MA, Advogado, prova 15/03/2026.
  Formato **Redação dissertativa** (não peça), 20-30 linhas. Tabela: Aspecto
  Formal(6)+Textual(6)+Técnico(8)=20.

Os dois documentos foram lidos por mim pessoalmente, direto dos PDFs
(hospedados em S3 — baixados via `curl`, já que o WebFetch recusa esse
tipo de link binário diretamente).

## Confirmado: "filosofia de 2 domínios", formato concreto varia

A IBADE reutiliza uma estrutura de raciocínio comum entre editais — sempre
um bloco de "língua portuguesa" (formal+textual) e um bloco de "conteúdo/
técnica" — mas o FORMATO CONCRETO da prova varia por cargo/cliente: peça
processual (Procurador de prefeitura), redação dissertativa genérica
(Advogado de conselho de classe), ou (confirmado como referência histórica,
não incluído na base) uma bateria de 10 questões discursivas técnicas
específicas (Oficial da Brigada Militar/RS, formato bem diferente dos
outros dois). O motor não deve assumir "peça processual" como formato
universal só porque foi o primeiro exemplo encontrado.

## Limite de linhas — confirma variação mesmo dentro da mesma banca

Castelo/ES (peça processual): 30-50 linhas. CRO-MA (redação): 20-30 linhas.
Já é o suficiente pra confirmar que não há um número fixo — depende do
formato da prova.

## Zeramento (confirmado em 2 editais lidos, texto quase idêntico)

Identificação indevida no espaço de transcrição do texto definitivo; não
atender à proposta da prova (tema ou estrutura); texto absolutamente
ilegível; eliminação automática se a prova discursiva não for corrigida.

## Concursos verificados mas descartados

UNIVESP (Advogado) — formato interessante (2 questões + Parecer Técnico de
60 pts), mas prova aplicada em 07/05/2025, antes do início da janela.
IPSMETOPO/RO e Câmara de Ouro Preto do Oeste/RO — chaves de correção reais
de peça processual, mas datadas de 26/11/2024, fora da janela. TJ/ES
(Residência Jurídica 2022) — muito antigo. PGE/BA (estágio de
pós-graduação) — seleção de bolsista, não cargo efetivo, e sem chave de
correção publicada ainda. Vários concursos (Polícia Civil ES, SES/MG,
COREN-AM, CRO-MA Agente Administrativo, Alto Alegre dos Parecis/RO) — sem
prova discursiva, só objetiva.
