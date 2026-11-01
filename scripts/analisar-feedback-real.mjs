#!/usr/bin/env node
// Analisa o feedback real acumulado (nota estimada pelo AvalIA vs. nota real
// da banca) e mostra evidência — NUNCA ajusta prompt, calibração ou lógica de
// correção sozinho. Qualquer mudança real de critério, se a evidência
// sugerir, precisa ser decidida por um humano depois de ver este relatório.
//
// Uso (modo dev, lê o JSON local): node scripts/analisar-feedback-real.mjs
// Uso (modo produção, lê do Supabase): defina FEEDBACK_REAL_STORE=supabase,
// NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente (ex:
// node --env-file=.env.local scripts/analisar-feedback-real.mjs, com essas
// três variáveis presentes no .env.local).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DIR = path.join(REPO_ROOT, "lib", "corretor", "feedback-real", "registros");

// A partir de quantos casos (por banca) já dá pra dizer que o padrão de erro
// não é só ruído — número arbitrário, conservador, só pra sinalizar "vale a
// pena olhar", nunca pra disparar ação sozinho.
const LIMIAR_VOLUME_RELEVANTE = 15;

function carregarRegistrosComFeedbackLocal() {
  let files = [];
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf-8")))
    .filter((r) => r.feedbackReal !== null);
}

async function carregarRegistrosComFeedbackSupabase() {
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
    .select("*, feedbacks_reais!inner(nota_real, observacao, registrado_em)");
  if (error) throw new Error(`Falha ao ler feedback real no Supabase: ${error.message}`);

  // feedbacks_reais vem como OBJETO (não array) no embed: correcao_id tem
  // "unique" na tabela, e o PostgREST detecta relação 1-1 a partir disso.
  return (data ?? []).map((row) => ({
    correcaoId: row.id,
    criadoEm: row.criado_em,
    bancaId: row.banca_id,
    tema: row.tema,
    notaEstimada: row.nota_estimada,
    notaMaxima: row.nota_maxima,
    fonteDosItens: row.fonte_dos_itens,
    feedbackReal: {
      notaReal: row.feedbacks_reais.nota_real,
      observacao: row.feedbacks_reais.observacao,
      registradoEm: row.feedbacks_reais.registrado_em,
    },
  }));
}

function carregarRegistrosComFeedback() {
  return process.env.FEEDBACK_REAL_STORE === "supabase"
    ? carregarRegistrosComFeedbackSupabase()
    : carregarRegistrosComFeedbackLocal();
}

function media(nums) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

async function main() {
  const registros = await carregarRegistrosComFeedback();

  if (registros.length === 0) {
    console.log(
      "Nenhum feedback real registrado ainda. Nada a analisar — isso é um resultado válido (ainda não houve retorno de usuário depois de resultados oficiais saírem).",
    );
    return;
  }

  console.log(`${registros.length} caso(s) com feedback real registrado no total.\n`);

  const porBanca = new Map();
  for (const r of registros) {
    if (!porBanca.has(r.bancaId)) porBanca.set(r.bancaId, []);
    porBanca.get(r.bancaId).push(r);
  }

  for (const [bancaId, casos] of porBanca) {
    const diffs = casos.map((c) => c.feedbackReal.notaReal - c.notaEstimada);
    const erroAbsoluto = diffs.map((d) => Math.abs(d));
    const vies = media(diffs);
    const erroMedioAbsoluto = media(erroAbsoluto);

    console.log(`=== ${bancaId.toUpperCase()} — ${casos.length} caso(s) ===`);
    console.log(`  Erro absoluto médio: ${erroMedioAbsoluto.toFixed(2)} pontos`);
    console.log(
      `  Viés médio (nota real - estimada): ${vies > 0 ? "+" : ""}${vies.toFixed(2)} ` +
        `(${vies > 0 ? "AvalIA tende a SUBestimar" : vies < 0 ? "AvalIA tende a SUPERestimar" : "sem viés aparente"})`,
    );

    const porFonte = new Map();
    for (const c of casos) {
      if (!porFonte.has(c.fonteDosItens)) porFonte.set(c.fonteDosItens, []);
      porFonte.get(c.fonteDosItens).push(c.feedbackReal.notaReal - c.notaEstimada);
    }
    console.log("  Por fonte dos itens:");
    for (const [fonte, ds] of porFonte) {
      console.log(
        `    - ${fonte}: ${ds.length} caso(s), erro absoluto médio ${media(ds.map((d) => Math.abs(d))).toFixed(2)}`,
      );
    }

    if (casos.length >= LIMIAR_VOLUME_RELEVANTE) {
      console.log(
        `  >>> VOLUME SUFICIENTE (${casos.length} >= ${LIMIAR_VOLUME_RELEVANTE}) pra considerar revisão manual do critério desta banca. <<<`,
      );
      console.log(
        "      Isso é só um sinal — a decisão de ajustar (ou não) é sua, com base nesta evidência.",
      );
    } else {
      console.log(
        `  Volume ainda baixo (${casos.length} < ${LIMIAR_VOLUME_RELEVANTE}) — não há evidência suficiente pra sugerir ajuste ainda.`,
      );
    }
    console.log("");
  }

  console.log(
    "Lembrete: este script só lê e reporta. Nenhum prompt, arquivo de calibração ou lógica de correção foi tocado.",
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
