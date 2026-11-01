#!/usr/bin/env node
// Alarme de custo manual do /corretor — soma tokens reais (message.usage) de
// todas as correções e estima o gasto em USD, pra você conferir de vez em
// quando se o custo total está saindo do esperado. Só lê e reporta; nunca
// ajusta limite, prompt ou lógica de correção sozinho.
//
// Uso (modo dev, lê o JSON local): node scripts/analisar-custo.mjs
// Uso (modo produção, lê do Supabase): defina FEEDBACK_REAL_STORE=supabase,
// NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente (ex:
// node --env-file=.env.local scripts/analisar-custo.mjs).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DIR = path.join(REPO_ROOT, "lib", "corretor", "feedback-real", "registros");

// Preço vigente do claude-opus-4-8 (modelo usado pelo motor de correção,
// ver lib/corretor/engine.ts) — USD por token. Atualize se o modelo ou o
// preço mudar.
const PRECO_INPUT_POR_TOKEN = 5 / 1_000_000;
const PRECO_OUTPUT_POR_TOKEN = 25 / 1_000_000;

function carregarUsoLocal() {
  let files = [];
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  return files.map((f) => {
    const r = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf-8"));
    return {
      correcaoId: r.correcaoId,
      criadoEm: r.criadoEm,
      bancaId: r.bancaId,
      inputTokens: r.inputTokens ?? 0,
      outputTokens: r.outputTokens ?? 0,
    };
  });
}

async function carregarUsoSupabase() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "FEEDBACK_REAL_STORE=supabase exige NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.",
    );
  }
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  const { data, error } = await supabaseAdmin
    .from("correcoes")
    .select("id, criado_em, banca_id, input_tokens, output_tokens");
  if (error) throw new Error(`Falha ao ler uso de tokens no Supabase: ${error.message}`);

  return (data ?? []).map((row) => ({
    correcaoId: row.id,
    criadoEm: row.criado_em,
    bancaId: row.banca_id,
    inputTokens: row.input_tokens ?? 0,
    outputTokens: row.output_tokens ?? 0,
  }));
}

function carregarUso() {
  return process.env.FEEDBACK_REAL_STORE === "supabase" ? carregarUsoSupabase() : carregarUsoLocal();
}

function custoUSD(inputTokens, outputTokens) {
  return inputTokens * PRECO_INPUT_POR_TOKEN + outputTokens * PRECO_OUTPUT_POR_TOKEN;
}

function somar(lista, campo) {
  return lista.reduce((soma, r) => soma + r[campo], 0);
}

function relatarPeriodo(titulo, registros) {
  if (registros.length === 0) {
    console.log(`${titulo}: nenhuma correção.`);
    return;
  }
  const inputTokens = somar(registros, "inputTokens");
  const outputTokens = somar(registros, "outputTokens");
  const custo = custoUSD(inputTokens, outputTokens);
  console.log(
    `${titulo}: ${registros.length} correção(ões) — ${inputTokens.toLocaleString("pt-BR")} tokens de entrada, ` +
      `${outputTokens.toLocaleString("pt-BR")} de saída — custo estimado: $${custo.toFixed(2)}`,
  );
}

async function main() {
  const registros = await carregarUso();

  if (registros.length === 0) {
    console.log("Nenhuma correção registrada ainda. Nada a somar.");
    return;
  }

  const agora = Date.now();
  const ultimas24h = registros.filter((r) => agora - new Date(r.criadoEm).getTime() < 24 * 60 * 60 * 1000);
  const ultimos7dias = registros.filter((r) => agora - new Date(r.criadoEm).getTime() < 7 * 24 * 60 * 60 * 1000);

  relatarPeriodo("Últimas 24h", ultimas24h);
  relatarPeriodo("Últimos 7 dias", ultimos7dias);
  relatarPeriodo("Total (todo o histórico)", registros);
  console.log("");

  const porBanca = new Map();
  for (const r of registros) {
    if (!porBanca.has(r.bancaId)) porBanca.set(r.bancaId, []);
    porBanca.get(r.bancaId).push(r);
  }
  console.log("Por banca (histórico total):");
  for (const [bancaId, casos] of porBanca) {
    relatarPeriodo(`  ${bancaId}`, casos);
  }

  console.log(
    "\nLembrete: preço fixo em USD $5/milhão tokens de entrada e $25/milhão de saída (claude-opus-4-8) — " +
      "atualize PRECO_INPUT_POR_TOKEN/PRECO_OUTPUT_POR_TOKEN neste script se o modelo ou o preço mudar. " +
      "Este script só lê e reporta; nenhum limite ou lógica de correção é alterado por ele.",
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
