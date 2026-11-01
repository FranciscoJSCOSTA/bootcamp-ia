import { test } from "node:test";
import assert from "node:assert/strict";
import { caminhoInterno } from "../lib/caminho-interno.ts";

test("aceita caminhos internos", () => {
  assert.equal(caminhoInterno("/corretor"), "/corretor");
  assert.equal(caminhoInterno("/corretor/feedback?id=abc"), "/corretor/feedback?id=abc");
  assert.equal(caminhoInterno("/"), "/");
});

test("usa o fallback quando vazio", () => {
  assert.equal(caminhoInterno(null), "/corretor");
  assert.equal(caminhoInterno(undefined), "/corretor");
  assert.equal(caminhoInterno(""), "/corretor");
  assert.equal(caminhoInterno("", "/x"), "/x");
});

test("recusa destinos externos", () => {
  for (const ruim of [
    "https://site-falso.com",
    "http://site-falso.com/corretor",
    "//site-falso.com",
    "///site-falso.com",
    "/\\site-falso.com",
    "\\\\site-falso.com",
    "/\tsite-falso.com",
    "/\n/site-falso.com",
    "javascript:alert(1)",
    "corretor",
  ]) {
    assert.equal(caminhoInterno(ruim), "/corretor", ruim);
  }
});

test("resultado nunca sai da origem quando resolvido como URL", () => {
  const origem = "https://www.avaliadiscursiva.com.br";
  for (const entrada of ["//evil.com", "/\\evil.com", "https://evil.com", "/ok", "/%2F%2Fevil.com"]) {
    assert.equal(new URL(caminhoInterno(entrada), origem).origin, origem, entrada);
  }
});
