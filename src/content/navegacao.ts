// Links de navegação, usados no Header e no Footer.
// As âncoras (#...) apontam para seções que ainda vão ser criadas.

export const navItens = [
  { rotulo: "Soluções", href: "#solucoes" },
  { rotulo: "Como funciona", href: "#como-funciona" },
  { rotulo: "BESS", href: "#bess" },
  { rotulo: "Projetos", href: "#projetos" },
  { rotulo: "Contato", href: "#contato" },
] as const;

// CTA fixo: verbo + objeto
export const cta = {
  rotulo: "Solicitar estudo técnico",
  href: "#contato", // vai apontar para o LeadForm
} as const;
