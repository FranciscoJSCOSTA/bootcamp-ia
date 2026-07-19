/**
 * Estimativa de linhas manuscritas equivalentes na folha de texto definitivo
 * do Cebraspe, a partir da quantidade de caracteres digitados.
 *
 * O Cebraspe não publica uma especificação oficial de caracteres por linha
 * da folha de texto definitivo — depende do tamanho da letra de cada
 * candidato. Por isso isto é fundamentalmente uma ESTIMATIVA, não um cálculo
 * exato, e precisa ser tratada com transparência (nunca apresentada como
 * precisão que não existe). A constante abaixo é ajustável; recalibrar aqui
 * se surgir um dado melhor no futuro.
 */
export const CARACTERES_POR_LINHA_MANUSCRITA = 85;

export type EstimativaLinhas = {
  linhasEstimadas: number;
  limiteLinhas: number | null;
  ultrapassouLimite: boolean;
  proximoDoLimite: boolean;
  limiteLinhasMinimo: number | null;
  abaixoDoMinimo: boolean;
  proximoDoMinimo: boolean;
  aviso: string | null;
};

// Cada parágrafo começa numa linha nova na folha manuscrita (convenção
// padrão de redação/peça, mesmo sem pular linha em branco entre parágrafos)
// — por isso a estimativa é por parágrafo, não pelo total bruto de
// caracteres do texto inteiro, o que evita subestimar textos com muitos
// parágrafos curtos.
function estimarLinhasPorParagrafo(texto: string): number {
  const paragrafos = texto
    .split(/\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragrafos.length === 0) return 0;

  return paragrafos.reduce(
    (total, paragrafo) =>
      total + Math.max(1, Math.ceil(paragrafo.length / CARACTERES_POR_LINHA_MANUSCRITA)),
    0,
  );
}

/**
 * @param limiteLinhas Limite MÁXIMO de linhas do enunciado (extrapolar por cima
 * é penalizado por praticamente todas as bancas já suportadas).
 * @param limiteLinhasMinimo Limite MÍNIMO de linhas do enunciado (opcional —
 * só algumas bancas penalizam texto CURTO demais, ex: VUNESP em provas de
 * redação dissertativo-argumentativa; a maioria não tem essa regra, por isso
 * é opcional e nunca assumido por padrão). O valor exato vem do edital
 * específico do usuário — o motor não fixa um número por banca porque isso
 * varia por edital e por formato de prova.
 */
export function estimarLinhas(
  texto: string,
  limiteLinhas?: number,
  limiteLinhasMinimo?: number,
): EstimativaLinhas {
  const linhasEstimadas = estimarLinhasPorParagrafo(texto);

  const ultrapassouLimite = limiteLinhas != null && linhasEstimadas > limiteLinhas;
  const proximoDoLimite =
    limiteLinhas != null &&
    Math.abs(linhasEstimadas - limiteLinhas) <= Math.max(2, Math.round(limiteLinhas * 0.1));

  const abaixoDoMinimo = limiteLinhasMinimo != null && linhasEstimadas < limiteLinhasMinimo;
  const proximoDoMinimo =
    limiteLinhasMinimo != null &&
    Math.abs(linhasEstimadas - limiteLinhasMinimo) <= Math.max(2, Math.round(limiteLinhasMinimo * 0.1));

  if (limiteLinhas == null && limiteLinhasMinimo == null) {
    return {
      linhasEstimadas,
      limiteLinhas: null,
      ultrapassouLimite: false,
      proximoDoLimite: false,
      limiteLinhasMinimo: null,
      abaixoDoMinimo: false,
      proximoDoMinimo: false,
      aviso: null,
    };
  }

  let aviso =
    `Estimamos que seu texto ocuparia aproximadamente ${linhasEstimadas} ` +
    `linha${linhasEstimadas === 1 ? "" : "s"} manuscrita${linhasEstimadas === 1 ? "" : "s"} ` +
    `na folha de texto definitivo (baseado em ~${CARACTERES_POR_LINHA_MANUSCRITA} caracteres por linha)` +
    (limiteLinhas != null ? `, considerando o limite máximo de ${limiteLinhas} linhas do enunciado` : "") +
    (limiteLinhasMinimo != null
      ? limiteLinhas != null
        ? ` e o limite mínimo de ${limiteLinhasMinimo} linhas do enunciado`
        : `, considerando o limite mínimo de ${limiteLinhasMinimo} linhas do enunciado`
      : "") +
    `. Essa é uma estimativa — a banca não costuma publicar uma especificação oficial de caracteres ` +
    `por linha da folha, e sua letra pode ocupar mais ou menos espaço que isso.`;

  if (proximoDoLimite) {
    aviso +=
      " Como sua contagem estimada está próxima do limite máximo, vale a pena conferir manualmente — " +
      "a margem de erro dessa estimativa importa mais quando o resultado está no limite.";
  }
  if (proximoDoMinimo && !abaixoDoMinimo) {
    aviso +=
      " Sua contagem estimada está próxima do limite mínimo — se o seu texto real ficar abaixo dele, " +
      "algumas bancas penalizam ou até zeram redações curtas demais.";
  }
  if (abaixoDoMinimo) {
    aviso +=
      " Sua contagem estimada ficou ABAIXO do limite mínimo do enunciado — algumas bancas penalizam " +
      "ou zeram automaticamente redações curtas demais nessa situação; confira a regra exata do seu edital.";
  }

  return {
    linhasEstimadas,
    limiteLinhas: limiteLinhas ?? null,
    ultrapassouLimite,
    proximoDoLimite,
    limiteLinhasMinimo: limiteLinhasMinimo ?? null,
    abaixoDoMinimo,
    proximoDoMinimo,
    aviso,
  };
}
