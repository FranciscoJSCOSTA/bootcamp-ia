import type { CorrectionView, FonteDosItens } from "../types";

// Snapshot gravado no momento da correção — o suficiente pra, depois, comparar
// contra a nota real da banca sem guardar o texto da resposta do usuário (não
// é necessário pra essa comparação e evita reter dado sensível sem motivo).
export type CorrecaoRegistrada = {
  correcaoId: string;
  criadoEm: string;
  userId: string;
  bancaId: string;
  tema: string;
  notaEstimada: number;
  notaMaxima: number;
  fonteDosItens: FonteDosItens;
  // Uso real de tokens da chamada ao Claude (message.usage) — usado pro
  // alarme de custo manual (scripts/analisar-custo.mjs), não pela correção
  // em si. outputTokens já inclui os tokens de thinking (billing da Anthropic
  // conta thinking como saída).
  inputTokens: number;
  outputTokens: number;
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

// Conteúdo guardado pra "Minhas correções" — gravado pela Server Action logo
// depois de uma correção bem-sucedida, separado do snapshot acima (que o
// motor grava). Apagável pelo usuário a qualquer momento.
export type ConteudoCorrecao = {
  textoResposta: string;
  padraoResposta: string | null;
  relatorio: CorrectionView;
};

// Linha da lista do histórico (sem o texto/relatório, que só a página de
// detalhe carrega).
export type CorrecaoResumo = {
  correcaoId: string;
  criadoEm: string;
  bancaId: string;
  tema: string;
  notaEstimada: number;
  notaMaxima: number;
};

// Correções anteriores ao histórico não têm conteúdo guardado — por isso os
// campos de conteúdo podem ser null.
export type CorrecaoHistorico = CorrecaoResumo & {
  textoResposta: string | null;
  padraoResposta: string | null;
  relatorio: CorrectionView | null;
  feedbackReal: FeedbackReal | null;
};
