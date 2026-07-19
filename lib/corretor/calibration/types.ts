export type CalibrationScoringItem = {
  descricao: string;
  // null quando o documento oficial só descreve o critério por faixas de
  // conceito (ex: "Conceito 0 a 3"), sem atribuir peso numérico ao quesito.
  pontuacao: number | null;
};

export type CalibrationPadraoResposta = {
  disponivel: boolean;
  itens: CalibrationScoringItem[];
  fonte: string;
  observacoes: string;
};

export type CalibrationGabaritoVersao = {
  disponivel: boolean;
  conteudo: string;
  fonte: string;
};

export type CalibrationQuestao = {
  numero: number;
  enunciado: string;
  padraoResposta: CalibrationPadraoResposta;
  gabarito: {
    preliminar: CalibrationGabaritoVersao;
    definitivo: CalibrationGabaritoVersao;
  };
};

export type CalibrationExam = {
  concurso: string;
  orgao: string;
  cargo: string;
  dataProva: string;
  areaTema: string;
  questoes: CalibrationQuestao[];
  fontesOficiais: string[];
  coletadoEm: string;
};

export type CalibrationMatch = {
  exam: CalibrationExam;
  questao: CalibrationQuestao;
  score: number;
};

// Síntese agregada dos padrões gerais de uma banca (camada 2 de calibração),
// extraída estatisticamente/qualitativamente do conjunto de provas reais da
// base — não é uma prova específica. Ver lib/corretor/calibration/{banca}/padroes-gerais.json.
// Bancas sem uma estrutura numérica consistente (ex: Cesgranrio) não têm
// esse arquivo — a variabilidade delas é documentada diretamente no prompt
// da banca, não como uma fonte de calibração de fallback.
export type SinteseGeral = {
  banca: string;
  descricao: string;
  baseadoEm: {
    concursosDistintos: number;
    arquivosDeProva: number;
    questoesDiscursivasTotais: number;
    questoesComPontuacaoNumericaCompleta: number;
    coletadoEm: string;
  };
  estruturaTipica: {
    itensPorQuestao: {
      min: number;
      max: number;
      mediana: number;
      media: number;
      faixaTypica: string;
    };
    distribuicaoDePeso: {
      pesosIguaisEntreQuesitos?: string;
      quesitoDominanteShareMediana?: string;
      quesitoDominanteShareMedia?: string;
      faixaTypica: string;
      posicaoDoQuesitoDominante?: string;
    };
    linguagemEEstrutura: {
      convencaoDominante: string;
      vocabularioComum?: string;
      exemploDeFormatoTipico?: string;
      pecasProfissionaisVsQuestoesDissertativas?: string;
    };
  };
  // Campo opcional — bancas onde a divisão conteúdo/gramática varia ou foi
  // investigada especificamente (ex: FGV) documentam o achado aqui.
  conteudoVsCorrecaoGramatical?: {
    achadoPrincipal: string;
    implicacao: string;
  };
};
