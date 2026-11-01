export type BuildPromptContext = {
  temPadraoResposta: boolean;
  referenciaCalibracao?: string | null;
  sinteseGeral?: string | null;
};

export interface BancaConfig {
  id: string;
  nome: string;
  buildSystemPrompt: (ctx: BuildPromptContext) => string;
}

// De onde vieram os itens/pontuações usados na correção, em ordem de
// confiabilidade decrescente. "sintese_geral_calibracao" existe no tipo para
// quando a camada 2 de calibração (padroes-gerais.json) for integrada — por
// enquanto o motor nunca a emite, cai direto em "aproximacao_generica".
export type FonteDosItens =
  | "padrao_resposta_fornecido"
  | "itens_do_enunciado"
  | "prova_semelhante_calibracao"
  | "sintese_geral_calibracao"
  | "aproximacao_generica";

export type ItemAvaliadoView = {
  chave: string;
  descricao: string;
  pontuacao: number;
  pontuacaoMaxima: number;
  comentario: string;
};

export type DeducaoView = {
  motivo: string;
  impactoPontos: number;
};

export type EstimativaLinhasView = {
  linhasEstimadas: number;
  limiteLinhas: number | null;
  ultrapassouLimite: boolean;
  proximoDoLimite: boolean;
  limiteLinhasMinimo: number | null;
  abaixoDoMinimo: boolean;
  proximoDoMinimo: boolean;
  aviso: string;
};

export type CorrectionView = {
  correcaoId: string;
  notaEstimada: number;
  notaMaxima: number;
  fonteDosItens: FonteDosItens;
  itens: ItemAvaliadoView[];
  pontosFortes: string[];
  pontosMelhoria: string[];
  sugestoes: string[];
  deducoes: DeducaoView[];
  avaliacaoAproximada: boolean;
  avisoTransparencia: string | null;
  estimativaLinhas: EstimativaLinhasView | null;
};

export type CorrectEssayInput = {
  bancaId: string;
  tema: string;
  texto: string;
  padraoResposta?: string;
  limiteLinhas?: number;
  limiteLinhasMinimo?: number;
  userId: string;
};

export type CorrectEssayOutcome =
  | { ok: true; data: CorrectionView }
  | { ok: false; error: string };
