// Gera lib/anti-abuso/dominios-descartaveis.ts a partir da lista pública
// disposable-email-domains (licença CC0):
// https://github.com/disposable-email-domains/disposable-email-domains
//
// Uso:
//   node scripts/atualizar-dominios-descartaveis.mjs            (baixa a lista)
//   node scripts/atualizar-dominios-descartaveis.mjs lista.conf (arquivo local)
//
// Só aceita linhas que parecem domínio — qualquer outra coisa é descartada,
// já que o conteúdo vem de fora do projeto e vira código TypeScript.
import fs from "node:fs";
import path from "node:path";

const URL_LISTA =
  "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf";
const DESTINO = path.join(import.meta.dirname, "..", "lib", "anti-abuso", "dominios-descartaveis.ts");
const DOMINIO = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;

// Provedores comuns que nunca podem entrar, mesmo que a lista mude por engano.
const NUNCA_BLOQUEAR = new Set([
  "gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.com", "msn.com",
  "yahoo.com", "yahoo.com.br", "icloud.com", "me.com", "uol.com.br", "bol.com.br",
  "terra.com.br", "ig.com.br", "globo.com", "r7.com", "proton.me", "protonmail.com",
]);

const arquivo = process.argv[2];
const bruto = arquivo
  ? fs.readFileSync(arquivo, "utf-8")
  : await (await fetch(URL_LISTA)).text();

const dominios = [...new Set(
  bruto
    .split(/\r?\n/)
    .map((l) => l.trim().toLowerCase())
    .filter((l) => DOMINIO.test(l) && !NUNCA_BLOQUEAR.has(l)),
)].sort();

if (dominios.length < 1000) {
  throw new Error(`Lista suspeita: só ${dominios.length} domínios válidos. Nada foi gravado.`);
}

const conteudo = `// GERADO por scripts/atualizar-dominios-descartaveis.mjs — não editar à mão.
// Fonte: disposable-email-domains (CC0), ${dominios.length} domínios, ${new Date().toISOString().slice(0, 10)}.
export const DOMINIOS_DESCARTAVEIS: readonly string[] = [
${dominios.map((d) => `  "${d}",`).join("\n")}
];
`;

fs.mkdirSync(path.dirname(DESTINO), { recursive: true });
fs.writeFileSync(DESTINO, conteudo);
console.log(`${dominios.length} domínios gravados em ${path.relative(process.cwd(), DESTINO)}`);
