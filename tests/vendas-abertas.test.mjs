import { test } from "node:test";
import assert from "node:assert/strict";
import { VENDAS_ABERTAS, vendasAbertas } from "../lib/cobranca/config.ts";
import { EMPRESA } from "../lib/empresa.ts";

test("vendas só abrem com CNPJ e endereço preenchidos", () => {
  assert.equal(vendasAbertas({ cnpj: null, endereco: null }), false);
  assert.equal(vendasAbertas({ cnpj: "12.345.678/0001-90", endereco: null }), false);
  assert.equal(vendasAbertas({ cnpj: null, endereco: "Rua X, 1" }), false);
  assert.equal(vendasAbertas({ cnpj: "  ", endereco: "Rua X, 1" }), false);
  assert.equal(vendasAbertas({ cnpj: "12.345.678/0001-90", endereco: "Rua X, 1" }), true);
});

test("estado atual segue lib/empresa.ts", () => {
  assert.equal(VENDAS_ABERTAS, vendasAbertas(EMPRESA));
});
