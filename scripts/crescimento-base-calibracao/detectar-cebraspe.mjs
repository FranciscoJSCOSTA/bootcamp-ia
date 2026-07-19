#!/usr/bin/env node
// Detecta concursos Cebraspe de nível superior com padrão de resposta
// discursivo publicado que AINDA NÃO estão na base de calibração local.
//
// 100% determinístico (nenhum LLM envolvido nesta etapa) — usa a API pública
// do próprio Cebraspe (apis.cebraspe.org.br), a mesma usada na pesquisa
// original. Só DETECTA candidatos; não escreve nada na base. A extração de
// conteúdo (ler o PDF e estruturar os quesitos) ainda é um passo à parte,
// feito por um agente (ver README.md desta pasta).
//
// Uso: node scripts/crescimento-base-calibracao/detectar-cebraspe.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const BASE_DIR = path.join(REPO_ROOT, "lib", "corretor", "calibration", "cebraspe");

const superiorKeywords =
  /(analista|especialista|auditor|procurador|delegado|perito|diplomacia|advogado|engenh|m[eé]dico|professor|docente|contador|administrador|promotor|defensor|magistrad|conselheiro|assessor jur|superior|bacharel|arquiteto|psic[oó]log|assistente social|farmac|odont[oó]log|enferm|fiscal|tecnologia da informa|ci[eê]ncia|economista|estat[ií]stico|not[aá]ri|escriv[aã]o de pol[ií]cia federal|agente de pol[ií]cia federal|analista judici[aá]rio|t[eé]cnico federal de controle externo|analista de controle externo)/i;

async function fetchJSON(url) {
  const resp = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} em ${url}`);
  return resp.json();
}

// Deriva o conjunto de slugs de concurso já coletados varrendo as
// fontesOficiais dos arquivos existentes na base (nenhum manifesto separado
// pra manter sincronizado à mão).
function slugsJaColetados() {
  const slugs = new Set();
  const files = fs.readdirSync(BASE_DIR).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(BASE_DIR, file), "utf-8"));
    for (const url of data.fontesOficiais || []) {
      const m = url.match(/\/concursos\/([a-z0-9_]+)\//i);
      if (m) slugs.add(m[1].toLowerCase());
    }
  }
  return slugs;
}

async function main() {
  console.log("Buscando listagem de concursos na API do Cebraspe...");
  const grupos = await fetchJSON("https://apis.cebraspe.org.br/cebraspe/eventos/tipo/concursos");
  const candidatos = grupos.flatMap((g) => g.eventos.map((e) => ({ ...e, fase: g.faseEvento })));
  console.log(`${candidatos.length} concursos listados no total.`);

  const jaColetados = slugsJaColetados();
  console.log(`${jaColetados.size} slugs já presentes na base local (derivados das fontesOficiais).`);

  const novos = candidatos.filter((c) => !jaColetados.has(c.eventoURL.toLowerCase()));
  console.log(`${novos.length} concursos ainda não verificados. Checando cada um...`);

  const qualificados = [];
  const semQualificar = [];
  for (const c of novos) {
    let detalhe;
    try {
      detalhe = await fetchJSON(`https://apis.cebraspe.org.br/cebraspe/eventos/${c.eventoURL}`);
    } catch (e) {
      semQualificar.push({ ...c, motivo: `erro ao buscar detalhe: ${e.message}` });
      continue;
    }
    const edital = detalhe.arquivosEdital || [];
    const gab = detalhe.arquivosGabarito || [];
    const all = [...edital, ...gab];

    const hasDiscursiva = all.some((f) => /prova discursiva/i.test(f.descricaoArquivo || ""));
    const padraoFiles = all.filter((f) => {
      const desc = f.descricaoArquivo || "";
      return /padr/i.test(desc) && /(discursiva|resposta)/i.test(desc);
    });
    const cargos = (detalhe.eventoCargos || []).map((x) => x.area);
    const hasSuperior = cargos.length ? cargos.some((a) => superiorKeywords.test(a)) : null;

    if (hasSuperior && hasDiscursiva && padraoFiles.length > 0) {
      qualificados.push({
        nome: c.eventoNomeAbreviado,
        url: c.eventoURL,
        fase: c.fase,
        ano: c.eventoAno,
        vagas: c.eventoTotalVagas,
        padraoDefinitivo: padraoFiles.some((f) => /definitivo/i.test(f.descricaoArquivo)),
        padraoPreliminar: padraoFiles.some((f) => /preliminar/i.test(f.descricaoArquivo)),
      });
    } else {
      semQualificar.push({
        nome: c.eventoNomeAbreviado,
        url: c.eventoURL,
        motivo: !hasSuperior
          ? "nível superior indeterminado ou não confirmado"
          : !hasDiscursiva
            ? "sem prova discursiva"
            : "sem padrão de resposta publicado",
      });
    }
  }

  console.log(`\n=== RESULTADO ===`);
  console.log(`${qualificados.length} concurso(s) NOVO(S) qualificado(s) (nível superior + discursiva + padrão de resposta):\n`);
  for (const q of qualificados) {
    console.log(`  - ${q.nome} (${q.url}) — ${q.fase}, ${q.ano} — padrão: ${q.padraoDefinitivo ? "definitivo" : ""}${q.padraoDefinitivo && q.padraoPreliminar ? " + " : ""}${q.padraoPreliminar ? "preliminar" : ""}`);
  }

  console.log(`\n${semQualificar.length} concurso(s) verificado(s) e descartado(s) (não qualificam ainda).`);

  const outPath = path.join(__dirname, "candidatos-cebraspe.json");
  fs.writeFileSync(outPath, JSON.stringify({ geradoEm: new Date().toISOString(), qualificados, semQualificar }, null, 2));
  console.log(`\nRelatório completo salvo em ${path.relative(REPO_ROOT, outPath)}`);
  console.log(`Nada foi escrito na base de calibração — isso é só detecção. Para coletar o conteúdo real dos qualificados, use o processo descrito no README.md desta pasta.`);
}

main().catch((e) => {
  console.error("Erro:", e);
  process.exit(1);
});
