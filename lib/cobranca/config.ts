// Config única de cobrança — mudar valores aqui muda o app inteiro (textos,
// checagens e chamadas ao banco leem daqui).
import { EMPRESA } from "@/lib/empresa";

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

// Venda de créditos só abre com CNPJ e endereço preenchidos em
// lib/empresa.ts (Decreto 7.962/2013: quem vende pela internet tem que se
// identificar no site). Enquanto fechada, o site funciona só com as
// correções grátis e não mostra preço de algo que não dá pra comprar.
export const VENDAS_ABERTAS = vendasAbertas(EMPRESA);

export function vendasAbertas(empresa: { cnpj: string | null; endereco: string | null }): boolean {
  return Boolean(empresa.cnpj?.trim() && empresa.endereco?.trim());
}
