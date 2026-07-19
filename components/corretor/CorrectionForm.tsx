"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { correctEssayAction, type CorrectorState } from "@/app/corretor/actions";
import { CorrectionReport } from "@/components/corretor/CorrectionReport";

const initialState: CorrectorState = { status: "idle" };

const LABEL_DOCUMENTO: Record<string, { label: string; placeholder: string }> = {
  cebraspe: {
    label: "Padrão de resposta oficial (opcional)",
    placeholder:
      "Se você tiver o padrão de resposta oficial da banca, cole aqui para uma avaliação de conteúdo mais precisa...",
  },
  fgv: {
    label: "Espelho de correção oficial (opcional)",
    placeholder:
      "Se você tiver o espelho de correção oficial da banca, cole aqui para uma avaliação de conteúdo mais precisa...",
  },
  fcc: {
    label: "Padrão de resposta / critério de correção oficial (opcional)",
    placeholder:
      "Se você tiver o critério de correção oficial da banca (a FCC raramente publica isso de forma pública), cole aqui para uma avaliação de conteúdo mais precisa...",
  },
  cesgranrio: {
    label: "Padrão de resposta oficial (opcional)",
    placeholder:
      "Se você tiver o padrão de resposta oficial da banca, cole aqui para uma avaliação de conteúdo mais precisa...",
  },
  vunesp: {
    label: "Critério de correção oficial (opcional)",
    placeholder:
      "Se você tiver o critério de correção oficial do edital (ex: os aspectos avaliados e a pontuação de cada um), cole aqui para uma avaliação mais precisa...",
  },
  aocp: {
    label: "Padrão de resposta / espelho de correção oficial (opcional)",
    placeholder:
      "Se você tiver o espelho de correção oficial da AOCP, cole aqui para uma avaliação mais precisa...",
  },
  ibfc: {
    label: "Critério de correção oficial (opcional)",
    placeholder:
      "Se você tiver o critério de correção oficial do edital, cole aqui para uma avaliação mais precisa...",
  },
  idecan: {
    label: "Padrão de resposta / chave de correção oficial (opcional)",
    placeholder:
      "Se você tiver a chave de correção oficial da IDECAN, cole aqui para uma avaliação mais precisa...",
  },
  consulplan: {
    label: "Padrão de resposta oficial (opcional)",
    placeholder:
      "Se você tiver o padrão de resposta oficial da Consulplan, cole aqui para uma avaliação mais precisa...",
  },
  quadrix: {
    label: "Padrão preliminar / definitivo de resposta oficial (opcional)",
    placeholder:
      "Se você tiver o padrão de resposta oficial da Quadrix, cole aqui para uma avaliação mais precisa...",
  },
  iades: {
    label: "Parâmetros de correção oficiais (opcional)",
    placeholder:
      "Se você tiver o documento de parâmetros de correção oficial do IADES, cole aqui para uma avaliação mais precisa...",
  },
  access: {
    label: "Padrão de resposta / resposta-padrão oficial (opcional)",
    placeholder:
      "Se você tiver a resposta-padrão oficial do Instituto ACCESS, cole aqui para uma avaliação mais precisa...",
  },
  fundatec: {
    label: "Padrão de resposta oficial (opcional)",
    placeholder:
      "Se você tiver o padrão de resposta oficial da FUNDATEC, cole aqui para uma avaliação mais precisa...",
  },
  ibade: {
    label: "Chave de correção oficial (opcional)",
    placeholder:
      "Se você tiver a chave de correção oficial da IBADE, cole aqui para uma avaliação mais precisa...",
  },
  fepese: {
    label: "Padrão de resposta oficial (opcional)",
    placeholder:
      "Se você tiver o padrão de resposta oficial da FEPESE, cole aqui para uma avaliação mais precisa...",
  },
  faurgs: {
    label: "Critério de correção oficial (opcional)",
    placeholder:
      "A FAURGS raramente publica critério detalhado — se você tiver o documento oficial do seu edital específico, cole aqui para uma avaliação mais precisa...",
  },
  idib: {
    label: "Padrão de resposta / chave de correção oficial (opcional)",
    placeholder:
      "Se você tiver a chave de correção oficial do IDIB, cole aqui para uma avaliação mais precisa...",
  },
  consulpam: {
    label: "Padrão de resposta oficial (opcional)",
    placeholder:
      "Se você tiver o padrão de resposta oficial da Consulpam, cole aqui para uma avaliação mais precisa...",
  },
  ibam: {
    label: "Critério de correção oficial (opcional)",
    placeholder:
      "Se você tiver o critério de correção oficial do edital do IBAM, cole aqui para uma avaliação mais precisa...",
  },
  nossorumo: {
    label: "Critério de correção oficial (opcional)",
    placeholder:
      "Se você tiver o critério de correção oficial do Instituto Nosso Rumo, cole aqui para uma avaliação mais precisa...",
  },
};

export function CorrectionForm({
  bancas,
}: {
  bancas: { id: string; nome: string }[];
}) {
  const [state, formAction, isPending] = useActionState(
    correctEssayAction,
    initialState,
  );
  const [banca, setBanca] = useState(bancas[0]?.id ?? "cebraspe");
  const documento = LABEL_DOCUMENTO[banca] ?? LABEL_DOCUMENTO.cebraspe;
  const bancaSelectRef = useRef<HTMLSelectElement>(null);

  // Depois que uma Server Action de formulário conclui, o React 19 reseta os
  // campos nativos do <form> (chama form.reset() no DOM) — isso reverte o
  // <select> pra primeira opção visualmente e no DOM, mesmo com o estado
  // React "banca" intacto, dessincronizando os dois. Sem isso, uma segunda
  // correção sem reabrir o dropdown enviaria a banca errada (a primeira da
  // lista) mesmo com a UI parecendo mostrar a banca certa antes do reset.
  useEffect(() => {
    if (bancaSelectRef.current) bancaSelectRef.current.value = banca;
  }, [state, banca]);

  return (
    <div className="space-y-8">
      <form
        action={formAction}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <label
            htmlFor="banca"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Banca
          </label>
          <select
            id="banca"
            name="banca"
            ref={bancaSelectRef}
            value={banca}
            onChange={(e) => setBanca(e.target.value)}
            className="w-full max-w-[220px] rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            {bancas.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="tema"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Enunciado da questão discursiva
          </label>
          <textarea
            id="tema"
            name="tema"
            required
            rows={3}
            placeholder="Cole aqui o enunciado completo proposto pela banca (se ele já listar os itens avaliados e a pontuação de cada um, cole também)..."
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label
            htmlFor="texto"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Texto da resposta
          </label>
          <textarea
            id="texto"
            name="texto"
            required
            rows={14}
            placeholder="Cole aqui o texto completo da sua resposta..."
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label
            htmlFor="padraoResposta"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            {documento.label}
          </label>
          <textarea
            id="padraoResposta"
            name="padraoResposta"
            rows={6}
            placeholder={documento.placeholder}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="flex flex-wrap gap-5">
          <div>
            <label
              htmlFor="limiteLinhas"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Limite máximo de linhas do enunciado (opcional)
            </label>
            <input
              id="limiteLinhas"
              name="limiteLinhas"
              type="number"
              min={1}
              placeholder="Ex: 30"
              className="w-full max-w-[160px] rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label
              htmlFor="limiteLinhasMinimo"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Limite mínimo de linhas (opcional — várias bancas penalizam texto curto demais)
            </label>
            <input
              id="limiteLinhasMinimo"
              name="limiteLinhasMinimo"
              type="number"
              min={1}
              placeholder="Ex: 7"
              className="w-full max-w-[160px] rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-lg disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-md sm:w-auto"
        >
          {isPending ? "Corrigindo... (pode levar até 1 minuto)" : "Corrigir questão discursiva"}
        </button>

        {state.status === "error" && (
          <p role="status" className="text-sm font-medium text-red-600">
            {state.message}
          </p>
        )}
      </form>

      {state.status === "success" && <CorrectionReport data={state.data} />}
    </div>
  );
}
