import { z } from "zod";

const FONTES_ITENS = [
  "padrao_resposta_fornecido",
  "itens_do_enunciado",
  "prova_semelhante_calibracao",
  "sintese_geral_calibracao",
  "aproximacao_generica",
] as const;

const itemAvaliadoSchema = z.object({
  chave: z.string().min(1).max(150),
  descricao: z.string().min(1),
  pontuacaoMaxima: z.number().positive(),
  pontuacao: z.number().min(0),
  comentario: z.string().min(1),
});

/**
 * Schema de saída estruturada para a correção de uma questão discursiva.
 * Os itens avaliados são dinâmicos (número e rótulos variam por questão) em
 * vez de um conjunto fixo de competências — reflete como o Cebraspe de fato
 * pontua: por itens/quesitos definidos no enunciado ou no padrão de
 * resposta, não por categorias genéricas fixas.
 */
export function buildCorrectionResultSchema() {
  return z.object({
    fonteDosItens: z.enum(FONTES_ITENS),
    itens: z.array(itemAvaliadoSchema).min(1).max(10),
    pontosFortes: z.array(z.string().min(1)).min(1).max(6),
    pontosMelhoria: z.array(z.string().min(1)).min(1).max(6),
    sugestoes: z.array(z.string().min(1)).min(1).max(5),
    deducoes: z.array(
      z.object({
        motivo: z.string().min(1),
        impactoPontos: z.number().max(0),
      }),
    ),
    avaliacaoAproximada: z.boolean(),
    avisoTransparencia: z.string().nullable(),
  });
}
