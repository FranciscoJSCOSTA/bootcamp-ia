// Identificação de quem opera o site — usada no rodapé, na Política de
// Privacidade e nos Termos de Uso. Quando o MEI sair, preencha cnpj e
// endereco: as três páginas passam a mostrar os dados sozinhas.
//
// CPF não entra aqui de propósito (decisão do responsável). O Decreto
// 7.962/2013 pede CPF ou CNPJ e endereço para quem vende pela internet —
// o CNPJ do MEI resolve isso sem expor o CPF.
export const EMPRESA: {
  nome: string;
  email: string;
  cnpj: string | null;
  endereco: string | null;
} = {
  nome: "Francisco Costa",
  email: "contato@avaliadiscursiva.com.br",
  cnpj: null,
  endereco: null,
};

// Data mostrada como "última atualização" em Privacidade e Termos — mude
// junto com qualquer mudança no texto dessas páginas.
export const ATUALIZACAO_DOCUMENTOS_LEGAIS = "01/11/2026";
