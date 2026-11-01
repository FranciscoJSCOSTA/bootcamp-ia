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

  // Sem atomicidade de verdade (arquivo JSON) — suficiente pra dev, onde não
  // há requisições paralelas. Em produção vale a função SQL (supabase.ts).
  async reservarCorrecao(userId, limiteGratis) {
    const uso = lerUso(userId);
    if (uso.gratisUsadas < limiteGratis) {
      gravarUso(userId, { ...uso, gratisUsadas: uso.gratisUsadas + 1 });
      return "gratis";
    }
    return null;
  },

  async devolverCorrecao(userId, tipo) {
    const uso = lerUso(userId);
    if (tipo === "gratis" && uso.gratisUsadas > 0) {
      gravarUso(userId, { ...uso, gratisUsadas: uso.gratisUsadas - 1 });
    }
  },

  async consultarGratisUsadas(userId) {
    return lerUso(userId).gratisUsadas;
  },
};

// Equivalente local da tabela contas_uso — subpasta, pra não misturar com os
// JSONs de correção que lerTodas() lê.
const DIR_USO = path.join(DIR, "contas-uso");
type UsoLocal = { gratisUsadas: number };

function lerUso(userId: string): UsoLocal {
  try {
    return JSON.parse(fs.readFileSync(path.join(DIR_USO, `${userId}.json`), "utf-8")) as UsoLocal;
  } catch {
    return { gratisUsadas: 0 };
  }
}

function gravarUso(userId: string, uso: UsoLocal): void {
  fs.mkdirSync(DIR_USO, { recursive: true });
  fs.writeFileSync(path.join(DIR_USO, `${userId}.json`), JSON.stringify(uso, null, 2));
}

function lerTodas(): CorrecaoRegistrada[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  return files.map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf-8")) as CorrecaoRegistrada);
}
