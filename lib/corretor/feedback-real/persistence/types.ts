import type { CorrecaoRegistrada } from "../types";

// Contrato comum entre os dois adaptadores de persistência (local.ts e
// supabase.ts). Só operações de I/O — validação e regras de negócio ficam
// em store.ts, escritas uma única vez, não duplicadas por adaptador.
export type FeedbackRealAdapter = {
  salvar(registro: CorrecaoRegistrada): Promise<void>;
  buscar(correcaoId: string): Promise<CorrecaoRegistrada | null>;
  atualizarFeedback(registro: CorrecaoRegistrada): Promise<void>;
  listarComFeedback(): Promise<CorrecaoRegistrada[]>;
  // criadoEm (ISO, ordem crescente) de todas as correções do usuário desde
  // "desde" (ISO, inclusive) — base pra rajada e teto diário (ver
  // verificarLimite em store.ts).
  listarCriadoEmDesde(userId: string, desde: string): Promise<string[]>;
  // Uso de tokens de todas as correções (opcionalmente só a partir de
  // "desde") — base pro alarme de custo manual.
  listarUsoTokens(desde?: string): Promise<UsoTokens[]>;
};

export type UsoTokens = {
  correcaoId: string;
  criadoEm: string;
  bancaId: string;
  inputTokens: number;
  outputTokens: number;
};
