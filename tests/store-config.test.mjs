import { test } from "node:test";
import assert from "node:assert/strict";
import { importarStoreIsolado } from "./helpers/store-local.mjs";

const { store } = await importarStoreIsolado();

test("na Vercel, sem FEEDBACK_REAL_STORE=supabase, falha com mensagem clara", async () => {
  process.env.VERCEL = "1";
  try {
    for (const valor of [undefined, "", "local", "Supabase"]) {
      if (valor === undefined) delete process.env.FEEDBACK_REAL_STORE;
      else process.env.FEEDBACK_REAL_STORE = valor;
      await assert.rejects(store.reservarCorrecao("a@b.com"), /FEEDBACK_REAL_STORE precisa ser "supabase"/);
      await assert.rejects(store.verificarLimite("u"), /FEEDBACK_REAL_STORE/);
    }
  } finally {
    delete process.env.VERCEL;
    delete process.env.FEEDBACK_REAL_STORE;
  }
});

test("fora da Vercel, sem a variável, usa o modo local (dev)", async () => {
  delete process.env.VERCEL;
  delete process.env.FEEDBACK_REAL_STORE;
  assert.equal((await store.reservarCorrecao("dev@exemplo.com")).ok, true);
});
