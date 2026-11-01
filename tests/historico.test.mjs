import { test } from "node:test";
import assert from "node:assert/strict";
import { comoPapel, criarBancoComMigracoes, criarUsuario } from "./helpers/banco.mjs";
import { correcaoBase, importarStoreIsolado } from "./helpers/store-local.mjs";

const { store } = await importarStoreIsolado();
const DONO = "11111111-1111-4111-8111-111111111111";
const OUTRO = "22222222-2222-4222-8222-222222222222";

const relatorio = (correcaoId) => ({
  correcaoId,
  notaEstimada: 7,
  notaMaxima: 10,
  fonteDosItens: "itens_do_enunciado",
  itens: [],
  pontosFortes: ["ok"],
  pontosMelhoria: [],
  sugestoes: [],
  deducoes: [],
  avaliacaoAproximada: false,
  avisoTransparencia: null,
  estimativaLinhas: null,
});

async function novaCorrecaoComConteudo(userId, tema = "Tema de teste") {
  const id = await store.registrarCorrecao({ ...correcaoBase(userId), tema });
  await store.salvarConteudoCorrecao(id, userId, {
    textoResposta: "Minha resposta",
    padraoResposta: null,
    relatorio: relatorio(id),
  });
  return id;
}

test("histórico: dono vê lista e relatório completo", async () => {
  const id = await novaCorrecaoComConteudo(DONO, "Tema A");
  const lista = await store.listarMinhasCorrecoes(DONO);
  assert.ok(lista.some((c) => c.correcaoId === id && c.tema === "Tema A"));
  assert.equal("textoResposta" in lista[0], false, "lista não carrega o texto");

  const c = await store.getMinhaCorrecao(id, DONO);
  assert.equal(c.textoResposta, "Minha resposta");
  assert.equal(c.relatorio.correcaoId, id);
});

test("histórico: outro usuário não vê, não grava conteúdo e não apaga", async () => {
  const id = await novaCorrecaoComConteudo(DONO);
  assert.equal(await store.getMinhaCorrecao(id, OUTRO), null);
  assert.ok(!(await store.listarMinhasCorrecoes(OUTRO)).some((c) => c.correcaoId === id));

  await store.salvarConteudoCorrecao(id, OUTRO, {
    textoResposta: "sobrescrito",
    padraoResposta: null,
    relatorio: relatorio(id),
  });
  assert.equal((await store.getMinhaCorrecao(id, DONO)).textoResposta, "Minha resposta");

  assert.equal(await store.apagarMinhaCorrecao(id, OUTRO), false);
  assert.ok(await store.getMinhaCorrecao(id, DONO));
});

test("histórico: apagar remove o conteúdo e tira da lista, mantendo o limite de uso", async () => {
  const id = await novaCorrecaoComConteudo(DONO);
  await store.registrarFeedbackReal({ correcaoId: id, userId: DONO, notaReal: 8, observacao: "texto pessoal" });

  assert.equal(await store.apagarMinhaCorrecao(id, DONO), true);
  assert.equal(await store.getMinhaCorrecao(id, DONO), null);
  assert.ok(!(await store.listarMinhasCorrecoes(DONO)).some((c) => c.correcaoId === id));
  assert.equal(await store.apagarMinhaCorrecao(id, DONO), false, "apagar de novo não faz nada");

  // O que sobra: só números (sem tema, resposta, relatório nem observação).
  const resto = await store.getRegistroDoUsuario(id, DONO);
  assert.equal(resto.tema, "");
  assert.equal(resto.textoResposta, null);
  assert.equal(resto.relatorio, null);
  assert.equal(resto.feedbackReal.observacao, null);
  assert.equal(resto.feedbackReal.notaReal, 8);

  // Apagar não "zera" a rajada: a linha continua contando pros limites.
  assert.equal((await store.verificarLimite(DONO)).ok, false);
});

test("histórico: id mal formatado volta como não encontrado", async () => {
  assert.equal(await store.getMinhaCorrecao("../../etc/passwd", DONO), null);
  assert.equal(await store.apagarMinhaCorrecao("nao-e-uuid", DONO), false);
});

test("SQL: colunas do histórico existem e a chave pública não lê o conteúdo", async () => {
  const db = await criarBancoComMigracoes();
  await criarUsuario(db, DONO);
  await db.query(
    `insert into correcoes (id, user_id, banca_id, tema, nota_estimada, nota_maxima, fonte_dos_itens,
                            texto_resposta, relatorio)
     values (gen_random_uuid(), $1, 'cebraspe', 't', 1, 10, 'itens_do_enunciado', 'resposta', '{"a":1}')`,
    [DONO],
  );
  for (const papel of ["anon", "authenticated"]) {
    await comoPapel(db, papel, async () => {
      assert.equal((await db.query("select texto_resposta from correcoes")).rows.length, 0);
    });
  }
  const { rows } = await db.query("select texto_resposta, relatorio, apagado_em from correcoes");
  assert.equal(rows[0].texto_resposta, "resposta");
  assert.deepEqual(rows[0].relatorio, { a: 1 });
  assert.equal(rows[0].apagado_em, null);
});
