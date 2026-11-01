// Carregado via `node --import` (ver script "test" no package.json). Ensina o
// Node a resolver os imports do jeito que o Next/TypeScript resolvem: o alias
// "@/..." (tsconfig paths) e caminhos sem extensão apontando pra .ts/.tsx.
// Só a API nativa do Node (module.registerHooks) — sem dependência nova.
import { registerHooks } from "node:module";

const ROOT = new URL("../../", import.meta.url);
const SEM_EXTENSAO = /\/[^./]+$/;

registerHooks({
  resolve(specifier, context, nextResolve) {
    let spec = specifier;
    if (spec.startsWith("@/")) spec = new URL(spec.slice(2), ROOT).href;

    const local = spec.startsWith(".") || spec.startsWith("file:");
    if (local && SEM_EXTENSAO.test(spec)) {
      for (const sufixo of [".ts", ".tsx", "/index.ts"]) {
        try {
          return nextResolve(spec + sufixo, context);
        } catch {
          // tenta o próximo
        }
      }
    }
    return nextResolve(spec, context);
  },
});
