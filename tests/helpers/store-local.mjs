import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// O adaptador local grava em <cwd>/lib/corretor/feedback-real/registros —
// cada arquivo de teste roda num processo próprio, então mudar o cwd pra
// uma pasta temporária ANTES de importar o store isola os dados de teste
// dos registros reais de dev.
export async function importarStoreIsolado() {
  delete process.env.FEEDBACK_REAL_STORE;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "avalia-teste-"));
  process.chdir(dir);
  const store = await import("../../lib/corretor/feedback-real/store.ts");
  return { store, dir };
}

export function correcaoBase(userId) {
  return {
    userId,
    bancaId: "cebraspe",
    tema: "Tema de teste",
    notaEstimada: 7,
    notaMaxima: 10,
    fonteDosItens: "itens_do_enunciado",
    inputTokens: 100,
    outputTokens: 200,
  };
}
