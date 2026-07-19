import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { FonteDosItens } from "../types";
import type { CorrecaoRegistrada } from "./types";

// Armazenamento simples em arquivo (um JSON por correção), no mesmo espírito
// da base de calibração local. NOTA: em um deploy serverless (ex: Vercel) o
// filesystem é efêmero/somente-leitura fora de /tmp — isso funciona pra rodar
// local agora, mas antes de qualquer deploy real este store precisa migrar
// pra algo persistente (o projeto já tem @supabase/supabase-js instalado e
// configurado em lib/supabase/client.ts pra outros fins — candidato natural).
const DIR = path.join(process.cwd(), "lib", "corretor", "feedback-real", "registros");

function ensureDir(): void {
  fs.mkdirSync(DIR, { recursive: true });
}

function filePath(correcaoId: string): string {
  return path.join(DIR, `${correcaoId}.json`);
}

/**
 * Chamado pelo motor de correção logo após uma correção bem-sucedida. Só
 * grava o snapshot necessário pra comparação futura — nunca lê nem altera
 * critério/lógica de correção. Retorna o correcaoId gerado.
 */
export function registrarCorrecao(input: {
  bancaId: string;
  tema: string;
  notaEstimada: number;
  notaMaxima: number;
  fonteDosItens: FonteDosItens;
}): string {
  ensureDir();
  const correcaoId = crypto.randomUUID();
  const registro: CorrecaoRegistrada = {
    correcaoId,
    criadoEm: new Date().toISOString(),
    bancaId: input.bancaId,
    tema: input.tema,
    notaEstimada: input.notaEstimada,
    notaMaxima: input.notaMaxima,
    fonteDosItens: input.fonteDosItens,
    feedbackReal: null,
  };
  fs.writeFileSync(filePath(correcaoId), JSON.stringify(registro, null, 2));
  return correcaoId;
}

export function getRegistro(correcaoId: string): CorrecaoRegistrada | null {
  try {
    const raw = fs.readFileSync(filePath(correcaoId), "utf-8");
    return JSON.parse(raw) as CorrecaoRegistrada;
  } catch {
    return null;
  }
}

export type RegistrarFeedbackResultado =
  | { ok: true; registro: CorrecaoRegistrada }
  | { ok: false; error: string };

/**
 * Registra a nota real informada pelo usuário pra uma correção já existente.
 * Só acrescenta o dado — nunca recalcula, ajusta ou realimenta o motor. Isso
 * fica só acumulado pro script de análise (scripts/analisar-feedback-real.mjs)
 * ler depois; qualquer ajuste real de critério continua exigindo revisão
 * humana explícita.
 */
export function registrarFeedbackReal(input: {
  correcaoId: string;
  notaReal: number;
  observacao?: string;
}): RegistrarFeedbackResultado {
  const registro = getRegistro(input.correcaoId);
  if (!registro) {
    return { ok: false, error: "Correção não encontrada. Confira o código informado." };
  }
  if (!Number.isFinite(input.notaReal) || input.notaReal < 0 || input.notaReal > registro.notaMaxima) {
    return {
      ok: false,
      error: `Nota real inválida — deve ser um número entre 0 e ${registro.notaMaxima}.`,
    };
  }

  const atualizado: CorrecaoRegistrada = {
    ...registro,
    feedbackReal: {
      notaReal: input.notaReal,
      observacao: input.observacao?.trim() || null,
      registradoEm: new Date().toISOString(),
    },
  };
  fs.writeFileSync(filePath(input.correcaoId), JSON.stringify(atualizado, null, 2));
  return { ok: true, registro: atualizado };
}

/**
 * Lê todos os registros que já têm feedback real associado. Só leitura — usado
 * pelo script de análise, nunca pelo motor de correção em si.
 */
export function listRegistrosComFeedback(): CorrecaoRegistrada[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf-8")) as CorrecaoRegistrada)
    .filter((r) => r.feedbackReal !== null);
}
