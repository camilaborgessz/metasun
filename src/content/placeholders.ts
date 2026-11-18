// Tudo que depende de dado real fica aqui, como "[...]".
// Quando o dado real chegar, troque o valor: o chip "provisório" some sozinho
// (ele aparece enquanto houver um trecho entre colchetes, ver ehPlaceholder).

export const placeholders = {
  // Contato
  whatsapp: "[WHATSAPP]",
  telefone: "[TELEFONE]",
  email: "[E-MAIL]",

  // Endereços (Porto Velho e Cacoal, RO)
  enderecoPortoVelho: "[ENDEREÇO PORTO VELHO]",
  enderecoCacoal: "[ENDEREÇO CACOAL]",

  // Dados da empresa
  cnpj: "[CNPJ]",
  responsavelTecnico: "[RESPONSÁVEL TÉCNICO]",

  // Números de exemplo (StatNumber, ProjectCard...)
  numero: "[00]",
  percentual: "[00%]",
  faixaDePonta: "[00h às 00h]",

  // Fonte dos números da Home (dados da própria empresa). Confirmar o período, ex.: "desde 20XX"
  fonteNumerosHome: "Fonte: registro interno da Meta Sun, [período]",

  // Páginas que ainda não existem
  urlPoliticaPrivacidade: "#politica-de-privacidade",
} as const;

/** true quando o texto tem algum trecho ainda em placeholder, ex.: "[CNPJ]" ou "Fonte: registro interno, [período]" */
export function ehPlaceholder(valor: string): boolean {
  return /\[[^\]]+\]/.test(valor);
}
