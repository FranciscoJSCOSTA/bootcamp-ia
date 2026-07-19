import type { FonteDosItens } from "../types";

// Snapshot gravado no momento da correção — o suficiente pra, depois, comparar
// contra a nota real da banca sem guardar o texto da resposta do usuário (não
// é necessário pra essa comparação e evita reter dado sensível sem motivo).
export type CorrecaoRegistrada = {
  correcaoId: string;
  criadoEm: string;
  bancaId: string;
  tema: string;
  notaEstimada: number;
  notaMaxima: number;
  fonteDosItens: FonteDosItens;
  feedbackReal: FeedbackReal | null;
};

// Preenchido só quando o usuário volta, depois do resultado oficial sair, e
// registra a nota real que a banca deu. É a única fonte de "gabarito"
// verdadeiro que existe — nunca gerado nem inferido pelo motor.
export type FeedbackReal = {
  notaReal: number;
  observacao: string | null;
  registradoEm: string;
};
