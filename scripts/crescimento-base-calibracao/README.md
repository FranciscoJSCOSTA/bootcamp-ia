# Crescimento controlado da base de calibração

Mecanismo pra base de calibração (camada 1 do motor de correção) crescer com
o tempo, sem nunca mudar o comportamento do motor sem revisão humana. Duas
regras que não podem ser quebradas:

1. **Nunca fabricar dado.** Só entra candidato com documento oficial de
   padrão de resposta/espelho de correção real, verificável, publicado pela
   própria banca (ou por fonte que reproduza o documento oficial, indicado
   como tal).
2. **Nunca ficar "oficialmente" na base sem revisão.** Candidatos novos são
   escritos em `lib/corretor/calibration/{banca}/_pendente/`, uma subpasta
   que o motor **não enxerga** (`loadExams()` só lê arquivos direto na pasta
   da banca, não desce em subpastas — ver comentário em
   `lib/corretor/calibration/index.ts`). Um candidato só passa a valer pra
   correção real depois de rodar `promover.mjs`, e isso só deve acontecer
   depois de alguém revisar o conteúdo.

## Bancas cobertas

- **Cebraspe** — tem API pública (`apis.cebraspe.org.br`), então a etapa de
  *detecção* é 100% automatizável (`detectar-cebraspe.mjs`, sem LLM).
- **FGV** e **Cesgranrio** — não têm API pública equivalente; a detecção
  exige navegar o site e interpretar página por página, o que precisa de um
  agente (ver `PROCESSO-FGV-CESGRANRIO.md`).
- **FCC** — de propósito, fora deste processo. Já confirmamos (pesquisa
  anterior, 21 concursos verificados) que a FCC não publica padrão de
  resposta detalhado publicamente — não há o que detectar até isso mudar.

## Fluxo completo

1. **Detectar** candidatos novos (concursos com padrão de resposta publicado
   que ainda não estão na base):
   ```
   node scripts/crescimento-base-calibracao/detectar-cebraspe.mjs
   ```
   Gera `candidatos-cebraspe.json` com a lista de qualificados/descartados.
   Pra FGV/Cesgranrio, seguir `PROCESSO-FGV-CESGRANRIO.md` (via agente).

2. **Coletar** o conteúdo dos candidatos qualificados (ler o PDF/documento
   oficial, extrair enunciado + itens + pontuação) e salvar em
   `lib/corretor/calibration/{banca}/_pendente/{arquivo}.json`, no mesmo
   formato já usado na base (ver qualquer arquivo existente como referência).
   Essa etapa ainda depende de um agente (leitura/interpretação de PDF) —
   não é determinística como a detecção.

3. **Revisar** o que caiu em `_pendente/`:
   ```
   node scripts/crescimento-base-calibracao/promover.mjs <banca> --listar
   ```
   Mostra o que está pendente sem mover nada. Ler o conteúdo de cada arquivo
   antes de promover (igual já se fazia antes de cada rodada de coleta virar
   "oficial").

4. **Promover** (só depois de revisar) — só então o candidato passa a valer
   pra correção real:
   ```
   node scripts/crescimento-base-calibracao/promover.mjs <banca> --all
   # ou, seletivamente:
   node scripts/crescimento-base-calibracao/promover.mjs <banca> arquivo1.json arquivo2.json
   ```

## Sobre rodar isso periodicamente

Não há cron configurado ainda, de propósito (conforme pedido). O jeito atual
de usar é rodar `detectar-cebraspe.mjs` manualmente quando quiser checar por
novidade, ou pedir pra eu rodar através da rotina de FGV/Cesgranrio. Se algum
dia fizer sentido automatizar (ex: rodar semanalmente e só notificar se
achar candidato novo, sem nunca promover sozinho), isso é um passo separado
a decidir depois — o mecanismo de `_pendente/` já deixa isso seguro de fazer
no futuro, porque promoção continua sendo manual independentemente de quem
dispara a detecção.
