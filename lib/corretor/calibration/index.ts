import fs from "node:fs";
import path from "node:path";
import type { CalibrationExam, CalibrationMatch, SinteseGeral } from "./types";

// Provas discursivas reais de cada banca, coletadas de fontes oficiais, usadas
// como referência de calibração quando o usuário não fornece um padrão de
// resposta oficial para o tema avaliado. Ver lib/corretor/calibration/{banca}/.
const examsCache = new Map<string, CalibrationExam[]>();

function loadExams(bancaId: string): CalibrationExam[] {
  const cached = examsCache.get(bancaId);
  if (cached) return cached;

  const dir = path.join(process.cwd(), "lib", "corretor", "calibration", bancaId);
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  } catch {
    examsCache.set(bancaId, []);
    return [];
  }

  // A pasta também guarda arquivos auxiliares (ex: padroes-gerais.json, a
  // síntese agregada) que não são provas individuais — só entram aqui os
  // arquivos com o formato de CalibrationExam (têm um array "questoes").
  //
  // IMPORTANTE — mecanismo de segurança: candidatos novos encontrados pelo
  // processo de crescimento da base (ver scripts/crescimento-base-calibracao/)
  // são salvos em `{banca}/_pendente/`, uma subpasta. `readdirSync` sem
  // `recursive: true` não desce em subpastas, então esses candidatos ficam
  // automaticamente INVISÍVEIS pra correção até serem promovidos manualmente
  // pra este nível (ver scripts/crescimento-base-calibracao/promover.mjs) —
  // isso é intencional, não incidental. Não troque por uma leitura recursiva
  // sem entender essa propriedade.
  const exams = files
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")))
    .filter((data): data is CalibrationExam => Array.isArray(data?.questoes));

  examsCache.set(bancaId, exams);
  return exams;
}

function stripAccents(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Palavras puramente gramaticais, e vocabulário de comando/estrutura de prova
// Cebraspe (ex: "disserte", "redija", "hipotética", "texto motivador") que
// aparece na maioria dos enunciados independente do tema — sem valor
// discriminativo para a busca por semelhança de tema. Entradas acentuadas são
// normalizadas abaixo com o mesmo stripAccents usado em tokenize, já que o
// texto comparado já chega sem acentos.
const STOPWORDS = new Set(
  [
    "para", "como", "pela", "pelo", "pelas", "pelos", "esse", "essa", "esses",
    "essas", "este", "esta", "estes", "estas", "isso", "aquele", "aquela",
    "sobre", "entre", "quando", "onde", "qual", "quais", "porque", "então",
    "mais", "menos", "muito", "muita", "muitos", "muitas", "também", "ainda",
    "após", "antes", "durante", "diante", "seja", "sejam", "sendo", "tendo",
    "deve", "devem", "pode", "podem", "pois", "assim", "cada", "todo", "toda",
    "todos", "todas", "outro", "outra", "outros", "outras", "seu", "sua",
    "seus", "suas", "que", "com", "uma", "das", "dos", "nos", "nas", "por",
    "não", "são", "tem", "sem", "ser", "ter",
    // vocabulário de comando/estrutura de prova — genérico em quase todo
    // enunciado Cebraspe, não indica o tema da redação
    "texto", "disserte", "disse", "valor", "valores", "redija", "redigir",
    "pontos", "ponto", "considerando", "considere", "hipotética", "hipotético",
    "apresente", "apresentar", "situação", "discorra", "partir", "seguinte",
    "seguintes", "aspecto", "aspectos", "questão", "questões", "modelo",
    "seguir", "aborde", "abordar", "aplicável", "candidato", "candidata",
    "pede", "pedia", "acerca", "indique", "motivador", "motivadores",
    "importância", "importante", "brasil", "brasileira", "brasileiro",
    "público", "pública", "públicos", "públicas", "concurso", "concursos",
    "prova", "provas", "discursiva", "discursivas", "cargo", "cargos",
    "elabore", "comando", "dissertativo", "dissertativa",
  ].map(stripAccents),
);

// Stemming ingênuo (trunca em 6 caracteres) só para absorver variações comuns
// de plural/gênero em português (ex: "contratações"/"contratação" -> "contra"),
// suficiente para o propósito de similaridade lexical aproximada desta busca.
function stem(word: string): string {
  return word.length > 6 ? word.slice(0, 6) : word;
}

function tokenize(text: string): string[] {
  return stripAccents(text.toLowerCase())
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w))
    .map(stem);
}

function similarity(temaTokens: Set<string>, candidateText: string): number {
  const candidateTokens = new Set(tokenize(candidateText));
  if (candidateTokens.size === 0 || temaTokens.size === 0) return 0;
  let overlap = 0;
  for (const t of temaTokens) {
    if (candidateTokens.has(t)) overlap += 1;
  }
  return overlap / Math.sqrt(temaTokens.size * candidateTokens.size);
}

/**
 * Busca, na base de calibração local, questões discursivas reais com tema
 * lexicalmente semelhante ao tema informado — só considera questões cujo
 * padrão de resposta oficial esteja disponível (são as únicas úteis como
 * referência de calibração).
 */
export function findSimilarExams(
  bancaId: string,
  tema: string,
  { limit = 2, minScore = 0.15 }: { limit?: number; minScore?: number } = {},
): CalibrationMatch[] {
  const exams = loadExams(bancaId);
  const temaTokens = new Set(tokenize(tema));
  if (temaTokens.size === 0) return [];

  const matches: CalibrationMatch[] = [];
  for (const exam of exams) {
    for (const questao of exam.questoes) {
      if (!questao.padraoResposta.disponivel) continue;
      const corpus = `${exam.areaTema} ${questao.enunciado}`;
      const score = similarity(temaTokens, corpus);
      if (score >= minScore) {
        matches.push({ exam, questao, score });
      }
    }
  }

  return matches.sort((a, b) => b.score - a.score).slice(0, limit);
}

function formatMatch({ exam, questao }: CalibrationMatch, index: number): string {
  const itens = questao.padraoResposta.itens
    .map((item) =>
      item.pontuacao != null
        ? `  - ${item.descricao} [peso: ${item.pontuacao} pontos]`
        : `  - ${item.descricao} [peso não informado no documento oficial]`,
    )
    .join("\n");

  return `Referência de calibração ${index + 1} — ${exam.concurso}, cargo "${exam.cargo}" (prova em ${exam.dataProva}):
Tema real da questão (NÃO é o tema desta redação, apenas uma referência estrutural): "${questao.enunciado}"
Estrutura real de avaliação usada nesta prova (padrão de resposta oficial, fonte: ${questao.padraoResposta.fonte}):
${itens}`;
}

/**
 * Monta o bloco de texto com referências de calibração para injetar no
 * prompt, ou null se nenhuma prova semelhante foi encontrada na base local.
 */
export function getCalibrationReference(bancaId: string, tema: string): string | null {
  const matches = findSimilarExams(bancaId, tema);
  if (matches.length === 0) return null;
  return matches.map(formatMatch).join("\n\n");
}

const sinteseCache = new Map<string, string | null>();

function formatSinteseGeral(s: SinteseGeral): string {
  const et = s.estruturaTipica;
  const linhas = [
    `Síntese de padrões gerais da banca (agregação estatística/qualitativa de ${s.baseadoEm.concursosDistintos} concursos reais e ${s.baseadoEm.questoesDiscursivasTotais} questões discursivas coletadas, não uma prova específica; coletado em ${s.baseadoEm.coletadoEm}):`,
    `- Itens por questão: ${et.itensPorQuestao.faixaTypica}`,
    `- Distribuição de peso entre itens: ${et.distribuicaoDePeso.faixaTypica}${
      et.distribuicaoDePeso.posicaoDoQuesitoDominante ? `. ${et.distribuicaoDePeso.posicaoDoQuesitoDominante}` : ""
    }`,
    `- Convenção de linguagem/estrutura usada nos critérios: ${et.linguagemEEstrutura.convencaoDominante}`,
    et.linguagemEEstrutura.exemploDeFormatoTipico
      ? `- Exemplo de formato típico de um item: ${et.linguagemEEstrutura.exemploDeFormatoTipico}`
      : null,
    et.linguagemEEstrutura.pecasProfissionaisVsQuestoesDissertativas
      ? `- Sobre peças profissionais/técnicas: ${et.linguagemEEstrutura.pecasProfissionaisVsQuestoesDissertativas}`
      : null,
    s.conteudoVsCorrecaoGramatical
      ? `- Conteúdo vs. correção gramatical: ${s.conteudoVsCorrecaoGramatical.achadoPrincipal} ${s.conteudoVsCorrecaoGramatical.implicacao}`
      : null,
  ].filter((l): l is string => Boolean(l));

  return linhas.join("\n");
}

/**
 * Carrega e formata a síntese de padrões gerais da banca (camada 2 de
 * calibração), ou null se a banca não tiver esse arquivo — o que é o caso
 * esperado pra bancas sem estrutura numérica consistente o bastante pra
 * sintetizar (ex: Cesgranrio) ou sem nenhuma prova real coletada (ex: FCC).
 */
export function getSinteseGeral(bancaId: string): string | null {
  const cached = sinteseCache.get(bancaId);
  if (cached !== undefined) return cached;

  const filePath = path.join(
    process.cwd(), "lib", "corretor", "calibration", bancaId, "padroes-gerais.json",
  );
  let sintese: SinteseGeral;
  try {
    sintese = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    sinteseCache.set(bancaId, null);
    return null;
  }

  const texto = formatSinteseGeral(sintese);
  sinteseCache.set(bancaId, texto);
  return texto;
}
