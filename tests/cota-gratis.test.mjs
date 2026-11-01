import { test } from "node:test";
import assert from "node:assert/strict";
import { comoPapel, criarBancoComMigracoes, criarUsuario } from "./helpers/banco.mjs";
import { correcaoBase, importarStoreIsolado } from "./helpers/store-local.mjs";

const { store } = await importarStoreIsolado();
const { COTA_GRATIS_POR_CONTA } = await import("../lib/cobranca/config.ts");

test("store: 2 correções grátis por conta, no total", async () => {
  const email = "um@exemplo.com";
  assert.equal(COTA_GRATIS_POR_CONTA, 2);
  assert.equal(await store.consultarGratisRestantes(email), 2);
  assert.equal((await store.reservarCorrecao(email)).ok, true);
  assert.equal((await store.reservarCorrecao(email)).ok, true);
  assert.deepEqual(await store.reservarCorrecao(email), { ok: false, motivo: "sem_cota" });
  assert.equal(await store.consultarGratisRestantes(email), 0);
});

test("store: correção que falha devolve a reserva", async () => {
  const email = "dois@exemplo.com";
  const r1 = await store.reservarCorrecao(email);
  await store.devolverReserva(r1.reserva); // simulando falha da IA
  assert.equal(await store.consultarGratisRestantes(email), 2);
});

test("store: limites de rajada e teto diário continuam valendo", async () => {
  const u = "aaaaaaaa-0000-4000-8000-000000000003";
  assert.deepEqual(await store.verificarLimite(u), { ok: true });
  await store.registrarCorrecao(correcaoBase(u));
  const limite = await store.verificarLimite(u);
  assert.equal(limite.ok, false);
  assert.equal(limite.motivo, "rajada");
});

const reservar = async (db, email) =>
  (await db.query("select reservar_correcao($1, 2) as t", [email])).rows[0].t;
const usadas = async (db, email) =>
  (await db.query("select consultar_gratis_usadas($1) as n", [email])).rows[0].n;

test("SQL: normalização de e-mail para a cota", async () => {
  const db = await criarBancoComMigracoes();
  const casos = {
    "Fulano.Silva+concurso@Gmail.com": "fulanosilva@gmail.com",
    "f.u.l.a.n.o.silva@googlemail.com": "fulanosilva@gmail.com",
    "fulanosilva@gmail.com.": "fulanosilva@gmail.com",
    "  FULANOSILVA@GMAIL.COM ": "fulanosilva@gmail.com",
    "fulano.silva+x@outlook.com": "fulano.silva@outlook.com",
    "fulano.silva@outlook.com": "fulano.silva@outlook.com",
    "a.b+c+d@uol.com.br": "a.b@uol.com.br",
    "servidor@tcu.gov.br": "servidor@tcu.gov.br",
  };
  for (const [entrada, esperado] of Object.entries(casos)) {
    const { rows } = await db.query("select normalizar_email_cota($1) as e", [entrada]);
    assert.equal(rows[0].e, esperado, entrada);
  }
});

test("SQL: apelidos do mesmo e-mail dividem a mesma cota", async () => {
  const db = await criarBancoComMigracoes();
  assert.equal(await reservar(db, "fulano@gmail.com"), "gratis");
  assert.equal(await reservar(db, "fulano+2@gmail.com"), "gratis");
  assert.equal(await reservar(db, "f.u.l.a.n.o@gmail.com"), null);
  assert.equal(await reservar(db, "fulano+99@googlemail.com"), null);
  assert.equal(await usadas(db, "FULANO@gmail.com"), 2);
  // Outro e-mail de verdade continua com cota própria; no Outlook o ponto conta.
  assert.equal(await reservar(db, "ful.ano@outlook.com"), "gratis");
  assert.equal(await reservar(db, "fulano@outlook.com"), "gratis");
});

test("SQL: reserva atômica respeita o limite e devolve", async () => {
  const db = await criarBancoComMigracoes();
  const e = "beltrano@exemplo.com";
  assert.equal(await reservar(db, e), "gratis");
  assert.equal(await reservar(db, e), "gratis");
  assert.equal(await reservar(db, e), null);
  assert.equal(await usadas(db, e), 2);

  await db.query("select devolver_correcao($1, 'gratis')", ["beltrano+x@exemplo.com"]);
  assert.equal(await usadas(db, e), 1);
  assert.equal(await reservar(db, e), "gratis");

  // devolver nunca deixa negativo
  for (let i = 0; i < 5; i++) await db.query("select devolver_correcao($1, 'gratis')", [e]);
  assert.equal(await usadas(db, e), 0);
  await assert.rejects(db.query("select devolver_correcao($1, 'xyz')", [e]), /desconhecido/);
});

test("SQL: migração conta correções antigas na cota (máx. 2), juntando apelidos", async () => {
  const db = await criarBancoComMigracoes();
  // Recria o cenário de produção: correções existentes ANTES da migração.
  await db.exec("delete from cota_gratis");
  const contas = {
    "cccccccc-0000-4000-8000-000000000001": "antigo@gmail.com",
    "cccccccc-0000-4000-8000-000000000002": "antigo+alt@gmail.com",
    "cccccccc-0000-4000-8000-000000000003": "novato@gmail.com",
  };
  for (const [id, email] of Object.entries(contas)) {
    await db.query("insert into auth.users (id, email) values ($1, $2)", [id, email]);
  }
  // 1 correção em cada apelido do "antigo" = 2 no total; "novato" nenhuma.
  for (const id of Object.keys(contas).slice(0, 2)) {
    await db.query(
      `insert into correcoes (id, user_id, banca_id, tema, nota_estimada, nota_maxima, fonte_dos_itens)
       values (gen_random_uuid(), $1, 'cebraspe', 't', 1, 10, 'itens_do_enunciado')`,
      [id],
    );
  }
  const sql = (await import("node:fs")).readFileSync(
    new URL("../supabase/migrations/20261101120000_cota_gratis.sql", import.meta.url),
    "utf-8",
  );
  const backfill = sql.slice(sql.indexOf("insert into cota_gratis"), sql.indexOf("on conflict (email_normalizado) do nothing;") + 43);
  await db.exec(backfill);

  assert.equal(await usadas(db, "antigo@gmail.com"), 2);
  assert.equal(await reservar(db, "antigo@gmail.com"), null);
  assert.equal(await reservar(db, "novato@gmail.com"), "gratis");
});

test("SQL: chave pública (anon/authenticated) não consegue chamar as funções nem mexer na tabela", async () => {
  const db = await criarBancoComMigracoes();
  const e = "ciclano@exemplo.com";
  await criarUsuario(db, "dddddddd-0000-4000-8000-000000000001");
  await reservar(db, e);
  for (const papel of ["anon", "authenticated"]) {
    await comoPapel(db, papel, async () => {
      for (const chamada of [
        "select devolver_correcao($1, 'gratis')",
        "select reservar_correcao($1, 2)",
        "select consultar_gratis_usadas($1)",
        "select normalizar_email_cota($1)",
      ]) {
        await assert.rejects(db.query(chamada, [e]), /permission denied/, `${papel}: ${chamada}`);
      }
      // RLS sem policy: a tabela "existe" pra eles, mas nenhuma linha aparece
      // e nenhuma escrita passa.
      assert.equal((await db.query("select * from cota_gratis")).rows.length, 0);
      await db.query("update cota_gratis set usadas = 0");
      await assert.rejects(
        db.query("insert into cota_gratis (email_normalizado) values ('x@y.com')"),
        /row-level security/,
      );
    });
  }
  assert.equal(await usadas(db, e), 1);
  await comoPapel(db, "service_role", async () => {
    assert.equal(await reservar(db, e), "gratis");
  });
});
