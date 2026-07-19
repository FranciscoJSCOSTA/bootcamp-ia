#!/usr/bin/env node
// Promove arquivos de calibração de `_pendente/` pra base oficial da banca —
// o único passo que faz um candidato novo passar a valer pra correção real
// (camada 1). Rode isso só depois de revisar o conteúdo em _pendente/.
//
// Uso:
//   node scripts/crescimento-base-calibracao/promover.mjs cebraspe --all
//   node scripts/crescimento-base-calibracao/promover.mjs cebraspe arquivo1.json arquivo2.json
//   node scripts/crescimento-base-calibracao/promover.mjs cebraspe --listar   (só lista o que está pendente, não move nada)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");

const [banca, ...args] = process.argv.slice(2);

if (!banca) {
  console.error("Uso: node promover.mjs <banca> [--all | --listar | arquivo1.json arquivo2.json ...]");
  process.exit(1);
}

const pendenteDir = path.join(REPO_ROOT, "lib", "corretor", "calibration", banca, "_pendente");
const destinoDir = path.join(REPO_ROOT, "lib", "corretor", "calibration", banca);

if (!fs.existsSync(pendenteDir)) {
  console.log(`Nenhuma pasta _pendente/ para a banca "${banca}" — nada a promover.`);
  process.exit(0);
}

const pendentes = fs.readdirSync(pendenteDir).filter((f) => f.endsWith(".json"));

if (pendentes.length === 0) {
  console.log(`_pendente/ da banca "${banca}" está vazia — nada a promover.`);
  process.exit(0);
}

if (args[0] === "--listar" || args.length === 0) {
  console.log(`${pendentes.length} arquivo(s) pendente(s) para "${banca}":`);
  for (const f of pendentes) {
    const conteudo = JSON.parse(fs.readFileSync(path.join(pendenteDir, f), "utf-8"));
    console.log(`  - ${f} — ${conteudo.concurso} (${conteudo.cargo}), ${conteudo.questoes?.length ?? 0} questão(ões)`);
  }
  console.log("\nPra promover: node promover.mjs " + banca + " --all   (ou liste arquivos específicos)");
  process.exit(0);
}

const aPromover = args[0] === "--all" ? pendentes : args;

let promovidos = 0;
for (const f of aPromover) {
  const origem = path.join(pendenteDir, f);
  const destino = path.join(destinoDir, f);

  if (!fs.existsSync(origem)) {
    console.warn(`  ! ${f} não existe em _pendente/, pulando.`);
    continue;
  }
  if (fs.existsSync(destino)) {
    console.warn(`  ! ${f} já existe na base oficial — pulando pra não sobrescrever. Renomeie manualmente se for intencional.`);
    continue;
  }

  fs.renameSync(origem, destino);
  console.log(`  ✓ promovido: ${f}`);
  promovidos++;
}

console.log(`\n${promovidos} arquivo(s) promovido(s) de _pendente/ para a base oficial de "${banca}".`);
if (promovidos > 0) {
  console.log("Esses candidatos agora valem pra camada 1 (busca por tema semelhante) do motor de correção.");
}
