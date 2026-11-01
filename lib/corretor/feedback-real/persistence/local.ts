import crypto from "node:crypto";
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

  // Sem atomicidade de verdade (arquivo JSON) e sem a normalização de
  // apelidos — suficiente pra dev, onde não há requisições paralelas nem
  // abuso. Em produção valem as funções SQL (supabase.ts).
  async reservarCorrecao(email, limiteGratis) {
    const uso = lerUso(email);
    if (uso.gratisUsadas < limiteGratis) {
      gravarUso(email, { ...uso, gratisUsadas: uso.gratisUsadas + 1 });
      return "gratis";
    }
    return null;
  },

  async devolverCorrecao(email, tipo) {
    const uso = lerUso(email);
    if (tipo === "gratis" && uso.gratisUsadas > 0) {
      gravarUso(email, { ...uso, gratisUsadas: uso.gratisUsadas - 1 });
    }
  },

  async consultarGratisUsadas(email) {
    return lerUso(email).gratisUsadas;
  },
};

// Equivalente local da tabela cota_gratis — subpasta, pra não misturar com
// os JSONs de correção que lerTodas() lê. Nome do arquivo = hash do e-mail
// (e-mail não é um nome de arquivo seguro).
const DIR_USO = path.join(DIR, "cota-gratis");
type UsoLocal = { gratisUsadas: number };

function arquivoUso(email: string): string {
  const hash = crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
  return path.join(DIR_USO, `${hash}.json`);
}

function lerUso(email: string): UsoLocal {
  try {
    return JSON.parse(fs.readFileSync(arquivoUso(email), "utf-8")) as UsoLocal;
  } catch {
    return { gratisUsadas: 0 };
  }
}

function gravarUso(email: string, uso: UsoLocal): void {
  fs.mkdirSync(DIR_USO, { recursive: true });
  fs.writeFileSync(arquivoUso(email), JSON.stringify(uso, null, 2));
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
