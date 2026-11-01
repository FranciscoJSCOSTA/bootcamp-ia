import { test } from "node:test";
import assert from "node:assert/strict";
import { comoPapel, criarBancoComMigracoes, criarUsuario } from "./helpers/banco.mjs";
import { correcaoBase, importarStoreIsolado } from "./helpers/store-local.mjs";

const { store } = await importarStoreIsolado();
const { COTA_GRATIS_POR_CONTA } = await import("../lib/cobranca/config.ts");

test("store: 2 correções grátis por conta, no total", async () => {
  const u = "aaaaaaaa-0000-4000-8000-000000000001";
  assert.equal(COTA_GRATIS_POR_CONTA, 2);
  assert.equal(await store.consultarGratisRestantes(u), 2);
  assert.equal((await store.reservarCorrecao(u)).ok, true);
  assert.equal((await store.reservarCorrecao(u)).ok, true);
  const terceira = await store.reservarCorrecao(u);
  assert.deepEqual(terceira, { ok: false, motivo: "sem_cota" });
  assert.equal(await store.consultarGratisRestantes(u), 0);
});

test("store: correção que falha devolve a reserva", async () => {
  const u = "aaaaaaaa-0000-4000-8000-000000000002";
  const r1 = await store.reservarCorrecao(u);
  await store.devolverReserva(r1.reserva); // simulando falha da IA
  assert.equal(await store.consultarGratisRestantes(u), 2);
});

test("store: limites de rajada e teto diário continuam valendo", async () => {
  const u = "aaaaaaaa-0000-4000-8000-000000000003";
  assert.deepEqual(await store.verificarLimite(u), { ok: true });
  await store.registrarCorrecao(correcaoBase(u));
  const limite = await store.verificarLimite(u);
  assert.equal(limite.ok, false);
  assert.equal(limite.motivo, "rajada");
});

test("SQL: reserva atômica respeita o limite e devolve", async () => {
  const db = await criarBancoComMigracoes();
  const u = "bbbbbbbb-0000-4000-8000-000000000001";
  await criarUsuario(db, u);
  const reservar = async () =>
    (await db.query("select reservar_correcao($1, 2) as t", [u])).rows[0].t;

  assert.equal(await reservar(), "gratis");
  assert.equal(await reservar(), "gratis");
  assert.equal(await reservar(), null);
  assert.equal(await reservar(), null);
  const usadas = async () =>
    (await db.query("select gratis_usadas from contas_uso where user_id = $1", [u])).rows[0].gratis_usadas;
  assert.equal(await usadas(), 2);

  await db.query("select devolver_correcao($1, 'gratis')", [u]);
  assert.equal(await usadas(), 1);
  assert.equal(await reservar(), "gratis");

  // devolver nunca deixa negativo
  for (let i = 0; i < 5; i++) await db.query("select devolver_correcao($1, 'gratis')", [u]);
  assert.equal(await usadas(), 0);
  await assert.rejects(db.query("select devolver_correcao($1, 'xyz')", [u]), /desconhecido/);
});

test("SQL: migração conta correções antigas na cota (máx. 2)", async () => {
  const db = await criarBancoComMigracoes();
  // Recria o cenário de produção: correções existentes ANTES da migração.
  await db.exec("delete from contas_uso");
  const antigo = "cccccccc-0000-4000-8000-000000000001";
  const novato = "cccccccc-0000-4000-8000-000000000002";
  await criarUsuario(db, antigo);
  await criarUsuario(db, novato);
  for (let i = 0; i < 5; i++) {
    await db.query(
      `insert into correcoes (id, user_id, banca_id, tema, nota_estimada, nota_maxima, fonte_dos_itens)
       values (gen_random_uuid(), $1, 'cebraspe', 't', 1, 10, 'itens_do_enunciado')`,
      [antigo],
    );
  }
  await db.exec(`
    insert into contas_uso (user_id, gratis_usadas)
    select user_id, least(count(*), 2)::integer from correcoes group by user_id
    on conflict (user_id) do nothing;
  `);
  assert.equal((await db.query("select reservar_correcao($1, 2) as t", [antigo])).rows[0].t, null);
  assert.equal((await db.query("select reservar_correcao($1, 2) as t", [novato])).rows[0].t, "gratis");
});

test("SQL: chave pública (anon/authenticated) não consegue chamar as funções nem ler a tabela", async () => {
  const db = await criarBancoComMigracoes();
  const u = "dddddddd-0000-4000-8000-000000000001";
  await criarUsuario(db, u);
  await db.query("select reservar_correcao($1, 2)", [u]);
  for (const papel of ["anon", "authenticated"]) {
    await comoPapel(db, papel, async () => {
      await assert.rejects(db.query("select devolver_correcao($1, 'gratis')", [u]), /permission denied/);
      await assert.rejects(db.query("select reservar_correcao($1, 2)", [u]), /permission denied/);
      // RLS sem policy: a tabela "existe" pra eles, mas nenhuma linha aparece
      // e nenhuma escrita passa.
      assert.equal((await db.query("select * from contas_uso")).rows.length, 0);
      await db.query("update contas_uso set gratis_usadas = 0");
      await assert.rejects(db.query("insert into contas_uso (user_id) values ($1)", [u]), /row-level security/);
    });
  }
  assert.equal(
    (await db.query("select gratis_usadas from contas_uso where user_id = $1", [u])).rows[0].gratis_usadas,
    1,
  );
  await comoPapel(db, "service_role", async () => {
    assert.equal((await db.query("select reservar_correcao($1, 2) as t", [u])).rows[0].t, "gratis");
  });
});
