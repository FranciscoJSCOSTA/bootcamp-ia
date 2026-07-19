import type { CorrectionView, FonteDosItens } from "@/lib/corretor/types";

const LABEL_FONTE: Record<FonteDosItens, string> = {
  padrao_resposta_fornecido: "Padrão de resposta oficial fornecido",
  itens_do_enunciado: "Itens e pontuação extraídos do próprio enunciado",
  prova_semelhante_calibracao: "Calibrado por prova semelhante da banca",
  sintese_geral_calibracao: "Calibrado pela síntese geral de padrões da banca",
  aproximacao_generica: "Aproximação sem padrão de resposta oficial",
};

export function CorrectionReport({ data }: { data: CorrectionView }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-md sm:p-8">
      <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
        {LABEL_FONTE[data.fonteDosItens]}
      </span>

      {data.avaliacaoAproximada && (
        <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Atenção:</strong>{" "}
          {data.avisoTransparencia ??
            "Não há padrão de resposta oficial nem itens de pontuação claros para esta questão, então a avaliação é uma aproximação."}
        </div>
      )}

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-indigo-600 sm:text-5xl">
          {data.notaEstimada}
        </span>
        <span className="text-slate-500">
          / {data.notaMaxima} pontos (nota estimada)
        </span>
      </div>

      <ul className="mt-8 space-y-5">
        {data.itens.map((item, i) => (
          <li key={`${item.chave}-${i}`}>
            <div className="flex items-center justify-between gap-4 text-sm sm:text-base">
              <span className="text-slate-700">
                <span className="font-medium">{item.chave}</span>
                {item.descricao ? (
                  <span className="text-slate-500"> — {item.descricao}</span>
                ) : null}
              </span>
              <span className="whitespace-nowrap font-semibold text-slate-900">
                {item.pontuacao}/{item.pontuacaoMaxima}
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{
                  width: `${(item.pontuacao / item.pontuacaoMaxima) * 100}%`,
                }}
              />
            </div>
            <p className="mt-1 text-sm text-slate-600">{item.comentario}</p>
          </li>
        ))}
      </ul>

      {data.estimativaLinhas && (
        <div
          className={`mt-6 rounded-lg p-4 text-sm ${
            data.estimativaLinhas.ultrapassouLimite ||
            data.estimativaLinhas.proximoDoLimite ||
            data.estimativaLinhas.abaixoDoMinimo ||
            data.estimativaLinhas.proximoDoMinimo
              ? "bg-amber-50 text-amber-800"
              : "bg-slate-50 text-slate-600"
          }`}
        >
          <p className="font-semibold">
            {data.estimativaLinhas.linhasEstimadas} linhas estimadas
            {data.estimativaLinhas.limiteLinhasMinimo != null
              ? ` (mínimo ${data.estimativaLinhas.limiteLinhasMinimo}${
                  data.estimativaLinhas.limiteLinhas != null ? `, máximo ${data.estimativaLinhas.limiteLinhas}` : ""
                })`
              : data.estimativaLinhas.limiteLinhas != null
                ? ` / ${data.estimativaLinhas.limiteLinhas}`
                : ""}
          </p>
          <p className="mt-1">{data.estimativaLinhas.aviso}</p>
        </div>
      )}

      {data.deducoes.length > 0 && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Deduções aplicadas</p>
          <ul className="mt-2 space-y-1">
            {data.deducoes.map((d, i) => (
              <li key={i}>
                {d.motivo} ({d.impactoPontos} pontos)
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-emerald-700">
            Pontos fortes
          </p>
          <ul className="mt-2 space-y-2">
            {data.pontosFortes.map((item, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-slate-700 sm:text-base"
              >
                <span className="text-emerald-600">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-700">
            Pontos de melhoria
          </p>
          <ul className="mt-2 space-y-2">
            {data.pontosMelhoria.map((item, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-slate-700 sm:text-base"
              >
                <span className="text-amber-600">!</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-indigo-50 p-4 text-sm text-indigo-900">
        <p className="font-semibold">Sugestões de próximo passo</p>
        <ul className="mt-2 space-y-1">
          {data.sugestoes.map((item, i) => (
            <li key={i}>→ {item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-700">
          Depois que sair o resultado oficial da banca
        </p>
        <p className="mt-1">
          Você pode voltar aqui e registrar a nota real que recebeu, pra
          comparar com esta estimativa. Isso não muda esta correção — só ajuda
          a medir, com o tempo, se o corretor está calibrado.
        </p>
        <p className="mt-2 font-mono text-xs text-slate-500">
          Código desta correção: {data.correcaoId}
        </p>
        <a
          href={`/corretor/feedback?id=${data.correcaoId}`}
          className="mt-3 inline-block font-medium text-indigo-600 hover:underline"
        >
          Registrar nota real →
        </a>
      </div>
    </div>
  );
}
