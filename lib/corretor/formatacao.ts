import { BANCAS_DISPONIVEIS } from "@/lib/corretor/bancas";

export function nomeDaBanca(bancaId: string): string {
  return BANCAS_DISPONIVEIS.find((b) => b.id === bancaId)?.nome ?? bancaId;
}

export function formatarData(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
