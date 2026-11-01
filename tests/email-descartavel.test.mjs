import { test } from "node:test";
import assert from "node:assert/strict";
import { dominioDoEmail, emailDescartavel } from "../lib/anti-abuso/email.ts";

test("bloqueia descartáveis conhecidos, inclusive subdomínio e maiúsculas", () => {
  for (const e of [
    "fulano@mailinator.com",
    "fulano@MAILINATOR.COM",
    "fulano@caixa.mailinator.com",
    "a@10minutemail.com",
    "a@yopmail.com",
    "a@guerrillamail.com",
    "a@mailinator.com.",
  ]) {
    assert.equal(emailDescartavel(e), true, e);
  }
});

test("libera provedores comuns e corporativos", () => {
  for (const e of [
    "fulano@gmail.com",
    "fulano@hotmail.com",
    "fulano@outlook.com",
    "fulano@yahoo.com.br",
    "fulano@uol.com.br",
    "fulano@bol.com.br",
    "fulano@terra.com.br",
    "fulano@icloud.com",
    "fulano@proton.me",
    "servidor@tcu.gov.br",
    "aluno@usp.br",
  ]) {
    assert.equal(emailDescartavel(e), false, e);
  }
});

test("extrai domínio só de e-mails bem formados", () => {
  assert.equal(dominioDoEmail("a@b.com"), "b.com");
  assert.equal(dominioDoEmail("@b.com"), null);
  assert.equal(dominioDoEmail("a@localhost"), null);
  assert.equal(dominioDoEmail("semarroba"), null);
});
