"use client";

import { useActionState } from "react";
import { enviarMagicLinkAction, type EntrarState } from "@/app/entrar/actions";

const initialState: EntrarState = { status: "idle" };

export function EntrarForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, isPending] = useActionState(enviarMagicLinkAction, initialState);

  if (state.status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900 sm:p-8">
        <p className="font-semibold">Link enviado!</p>
        <p className="mt-2">
          Confira a caixa de entrada (e o spam) de <strong>{state.email}</strong> e clique no
          link pra entrar. Pode fechar esta aba.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <input type="hidden" name="next" value={nextPath} />
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="voce@email.com"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-lg disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-md"
      >
        {isPending ? "Enviando..." : "Enviar link de acesso"}
      </button>

      {state.status === "error" && (
        <p role="status" className="text-sm font-medium text-red-600">
          {state.message}
        </p>
      )}
    </form>
  );
}
