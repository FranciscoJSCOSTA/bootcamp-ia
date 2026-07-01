"use client";

import { useActionState } from "react";
import { subscribeToWaitlist, type WaitlistState } from "@/app/actions";

const initialState: WaitlistState = { status: "idle" };

export function WaitlistForm() {
  const [state, formAction, isPending] = useActionState(
    subscribeToWaitlist,
    initialState,
  );

  return (
    <form action={formAction} className="w-full max-w-md space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          Seu e-mail
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

      <div>
        <label
          htmlFor="concursoBanca"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Para qual concurso/banca você estuda?
        </label>
        <input
          id="concursoBanca"
          name="concursoBanca"
          type="text"
          required
          placeholder="Ex: PRF - Cebraspe"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-lg disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-md"
      >
        {isPending ? "Enviando..." : "Quero garantir minha vaga"}
      </button>

      {state.status !== "idle" && state.message && (
        <p
          role="status"
          className={
            state.status === "success"
              ? "text-sm font-medium text-emerald-600"
              : "text-sm font-medium text-red-600"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
