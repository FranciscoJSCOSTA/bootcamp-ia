import fs from "node:fs";
import path from "node:path";
import type { CorrecaoRegistrada } from "../types";
import type { FeedbackRealAdapter } from "./types";

// Armazenamento em arquivo (um JSON por correção) — usado em dev. Nunca
// usar em produção: filesystem serverless é efêmero fora de /tmp.
const DIR = path.join(process.cwd(), "lib", "corretor", "feedback-real", "registros");

function ensureDir(): void {
  fs.mkdirSync(DIR, { recursive: true });
}

function filePath(correcaoId: string): string {
  return path.join(DIR, `${correcaoId}.json`);
}

export const localAdapter: FeedbackRealAdapter = {
  async salvar(registro) {
    ensureDir();
    fs.writeFileSync(filePath(registro.correcaoId), JSON.stringify(registro, null, 2));
  },

  async buscar(correcaoId) {
    try {
      const raw = fs.readFileSync(filePath(correcaoId), "utf-8");
      return JSON.parse(raw) as CorrecaoRegistrada;
    } catch {
      return null;
    }
  },

  async atualizarFeedback(registro) {
    fs.writeFileSync(filePath(registro.correcaoId), JSON.stringify(registro, null, 2));
  },

  async listarComFeedback() {
    let files: string[] = [];
    try {
      files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));
    } catch {
      return [];
    }
    return files
      .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf-8")) as CorrecaoRegistrada)
      .filter((r) => r.feedbackReal !== null);
  },

  async listarCriadoEmDesde(userId, desde) {
    const todas = lerTodas();
    return todas
      .filter((r) => r.userId === userId && r.criadoEm >= desde)
      .map((r) => r.criadoEm)
      .sort();
  },

  async listarUsoTokens(desde) {
    return lerTodas()
      .filter((r) => !desde || r.criadoEm >= desde)
      .map((r) => ({
        correcaoId: r.correcaoId,
        criadoEm: r.criadoEm,
        bancaId: r.bancaId,
        inputTokens: r.inputTokens,
        outputTokens: r.outputTokens,
      }));
  },
};

function lerTodas(): CorrecaoRegistrada[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  return files.map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf-8")) as CorrecaoRegistrada);
}
