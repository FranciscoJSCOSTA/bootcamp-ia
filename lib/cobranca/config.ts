// Config única de cobrança — mudar valores aqui muda o app inteiro (textos,
// checagens e chamadas ao banco leem daqui).

// Correções grátis por conta, no total (não por dia). Só correção
// bem-sucedida conta: a reserva é devolvida se a correção falhar.
export const COTA_GRATIS_POR_CONTA = 2;

// Pacotes avulsos de créditos (1 crédito = 1 correção bem-sucedida).
// Créditos não expiram. Preço em centavos pra não ter erro de arredondamento.
export const PACOTES = [
  { id: "pacote-10", creditos: 10, precoCentavos: 1990 },
  { id: "pacote-30", creditos: 30, precoCentavos: 4990 },
] as const;

export type Pacote = (typeof PACOTES)[number];

export function formatarPreco(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Prazo legal de arrependimento (art. 49 do CDC), em dias corridos.
export const PRAZO_ARREPENDIMENTO_DIAS = 7;
