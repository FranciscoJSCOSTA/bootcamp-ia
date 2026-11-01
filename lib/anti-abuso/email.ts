import { DOMINIOS_DESCARTAVEIS } from "./dominios-descartaveis";

// Anti-abuso da cota grátis: e-mail descartável (mailinator, 10minutemail
// etc.) permite criar conta nova a cada minuto e zerar a cota de novo.
// Lista em dominios-descartaveis.ts (gerada por
// scripts/atualizar-dominios-descartaveis.mjs).
const BLOQUEADOS = new Set(DOMINIOS_DESCARTAVEIS);

export function dominioDoEmail(email: string): string | null {
  const arroba = email.lastIndexOf("@");
  if (arroba <= 0) return null;
  const dominio = email.slice(arroba + 1).trim().toLowerCase().replace(/\.$/, "");
  return dominio.includes(".") ? dominio : null;
}

/**
 * true se o domínio (ou qualquer domínio pai dele — "x.mailinator.com" cai
 * em "mailinator.com") estiver na lista de descartáveis.
 */
export function emailDescartavel(email: string): boolean {
  const dominio = dominioDoEmail(email);
  if (!dominio) return false;
  const partes = dominio.split(".");
  for (let i = 0; i < partes.length - 1; i++) {
    if (BLOQUEADOS.has(partes.slice(i).join("."))) return true;
  }
  return false;
}

export const MENSAGEM_EMAIL_DESCARTAVEL =
  "Endereços de e-mail temporários não são aceitos. Use seu e-mail pessoal ou de trabalho.";
