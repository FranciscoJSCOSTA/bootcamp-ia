import { test } from "node:test";
import assert from "node:assert/strict";
import { correcaoBase, importarStoreIsolado } from "./helpers/store-local.mjs";

const { store } = await importarStoreIsolado();
const DONO = "11111111-1111-4111-8111-111111111111";
const OUTRO = "22222222-2222-4222-8222-222222222222";

test("dono enxerga e registra nota real da própria correção", async () => {
  const id = await store.registrarCorrecao(correcaoBase(DONO));
  assert.ok(await store.getRegistroDoUsuario(id, DONO));

  const r = await store.registrarFeedbackReal({ correcaoId: id, userId: DONO, notaReal: 8 });
  assert.equal(r.ok, true);
  assert.equal(r.registro.feedbackReal.notaReal, 8);
});

test("outro usuário recebe 'não encontrada' e nada é gravado", async () => {
  const id = await store.registrarCorrecao(correcaoBase(DONO));
  assert.equal(await store.getRegistroDoUsuario(id, OUTRO), null);

  const r = await store.registrarFeedbackReal({ correcaoId: id, userId: OUTRO, notaReal: 3 });
  assert.equal(r.ok, false);
  assert.match(r.error, /não encontrada/);
  assert.equal((await store.getRegistroDoUsuario(id, DONO)).feedbackReal, null);
});

test("mesma mensagem para código inexistente e mal formatado", async () => {
  const inexistente = await store.registrarFeedbackReal({
    correcaoId: "33333333-3333-4333-8333-333333333333",
    userId: DONO,
    notaReal: 5,
  });
  const malFormatado = await store.registrarFeedbackReal({
    correcaoId: "../../etc/passwd",
    userId: DONO,
    notaReal: 5,
  });
  const deOutro = await store.registrarFeedbackReal({
    correcaoId: await store.registrarCorrecao(correcaoBase(OUTRO)),
    userId: DONO,
    notaReal: 5,
  });
  assert.equal(inexistente.error, malFormatado.error);
  assert.equal(inexistente.error, deOutro.error);
});
