"use client";

import { useActionState } from "react";
import {
  registrarFeedbackRealAction,
  type FeedbackState,
} from "@/app/corretor/feedback/actions";

const initialState: FeedbackState = { status: "idle" };

export function FeedbackForm({ correcaoIdInicial }: { correcaoIdInicial: string }) {
  const [state, formAction, isPending] = useActionState(
    registrarFeedbackRealAction,
    initialState,
  );

  if (state.status === "success") {
    const { registro } = state;
    const diferenca = registro.feedbackReal
      ? registro.feedbackReal.notaReal - registro.notaEstimada
      : 0;
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900 sm:p-8">
        <p className="font-semibold">Nota real registrada. Obrigado!</p>
        <p className="mt-2">
          Estimativa do AvalIA: <strong>{registro.notaEstimada}</strong> / {registro.notaMaxima}
          <br />
          Nota real da banca: <strong>{registro.feedbackReal?.notaReal}</strong> / {registro.notaMaxima}
          <br />
          Diferença: <strong>{diferenca > 0 ? "+" : ""}{diferenca.toFixed(2)}</strong>
        </p>
        <p className="mt-3 text-emerald-800">
          Esse dado fica só acumulado pra análise futura — não muda nada na
          correção automaticamente. Nenhum ajuste de critério acontece sem
          revisão manual.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label htmlFor="correcaoId" className="mb-1 block text-sm font-medium text-slate-700">
          Código da correção
        </label>
        <input
          id="correcaoId"
          name="correcaoId"
          required
          defaultValue={correcaoIdInicial}
          placeholder="Cole aqui o código mostrado no relatório da correção"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div>
        <label htmlFor="notaReal" className="mb-1 block text-sm font-medium text-slate-700">
          Nota real que a banca atribuiu a esta questão
        </label>
        <input
          id="notaReal"
          name="notaReal"
          required
          type="text"
          inputMode="decimal"
          placeholder="Ex: 8.5"
          className="w-full max-w-[160px] rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div>
        <label htmlFor="observacao" className="mb-1 block text-sm font-medium text-slate-700">
          Observação (opcional)
        </label>
        <textarea
          id="observacao"
          name="observacao"
          rows={3}
          placeholder="Algo que ache relevante — ex: 'a banca zerou por fuga ao tema' ou 'divulgação parcial, só a nota final'..."
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-lg disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-md sm:w-auto"
      >
        {isPending ? "Registrando..." : "Registrar nota real"}
      </button>

      {state.status === "error" && (
        <p role="status" className="text-sm font-medium text-red-600">
          {state.message}
        </p>
      )}
    </form>
  );
}
