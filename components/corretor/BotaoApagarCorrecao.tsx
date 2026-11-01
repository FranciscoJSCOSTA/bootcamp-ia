"use client";

import { useFormStatus } from "react-dom";
import { apagarCorrecaoAction } from "@/app/corretor/historico/actions";

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? "Apagando..." : "Apagar esta correção"}
    </button>
  );
}

export function BotaoApagarCorrecao({ correcaoId }: { correcaoId: string }) {
  return (
    <form
      action={apagarCorrecaoAction}
      onSubmit={(e) => {
        if (
          !window.confirm(
            "Apagar esta correção? O texto da sua resposta, o enunciado e o relatório serão apagados de forma definitiva.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="correcaoId" value={correcaoId} />
      <Botao />
    </form>
  );
}
