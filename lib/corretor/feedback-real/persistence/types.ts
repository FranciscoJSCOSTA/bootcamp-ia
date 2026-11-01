import type {
  ConteudoCorrecao,
  CorrecaoHistorico,
  CorrecaoRegistrada,
  CorrecaoResumo,
} from "../types";

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
  // Reserva atômica de 1 correção antes de chamar a IA (ver migração
  // cota_gratis). null = sem cota. A reserva é devolvida se a correção falhar.
  // A cota grátis é por e-mail normalizado (sem "+apelido", sem pontos no
  // Gmail) — por isso recebe o e-mail da sessão, não o user_id.
  reservarCorrecao(email: string, limiteGratis: number): Promise<TipoReserva | null>;
  devolverCorrecao(email: string, tipo: TipoReserva): Promise<void>;
  consultarGratisUsadas(email: string): Promise<number>;
  // "Minhas correções" (ver migração historico_correcoes). Tudo filtrado por
  // userId E por apagado_em nulo — correção de outro usuário ou apagada
  // simplesmente não existe pra estas funções.
  salvarConteudo(correcaoId: string, userId: string, conteudo: ConteudoCorrecao): Promise<void>;
  listarHistorico(userId: string): Promise<CorrecaoResumo[]>;
  buscarHistorico(correcaoId: string, userId: string): Promise<CorrecaoHistorico | null>;
  // true se apagou; false se não achou (inexistente, de outro usuário ou já apagada).
  apagarConteudo(correcaoId: string, userId: string): Promise<boolean>;
};

export type TipoReserva = "gratis";

export type UsoTokens = {
  correcaoId: string;
  criadoEm: string;
  bancaId: string;
  inputTokens: number;
  outputTokens: number;
};
