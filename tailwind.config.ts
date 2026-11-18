import type { Config } from "tailwindcss";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sol: { DEFAULT: "#F7A21B", hover: "#E8910B", ativo: "#D17F00", texto: "#A65800" },
        grafite: "#1C1C1C", branco: "#FFFFFF", areia: "#F5F3EF",
        marinho: "var(--marinho)", /* provisório: HEX a confirmar, só via variável (tokens.css) */
        cinza: { texto: "#6B6B6B" }, linha: "#E3DFD6", erro: "#B3261E",
        /* tokens derivados de tokens.css que faltavam aqui */
        desabilitado: "#E9E6DF", "apoio-escuro": "#BDB9B0",
        "linha-escura": "#3A3A3A", "erro-escuro": "#FFB4AB",
        "provisorio-fundo": "#FFF4DF",
      },
      /* menu da nav: abaixo de 900px vira menu (tokens: md = 900px) */
      screens: { menu: "900px" },
      fontFamily: { sans: ["Montserrat", "Arial", "sans-serif"] },
      borderRadius: { campo: "6px", botao: "8px", card: "12px" },
      boxShadow: { none: "none" },
      maxWidth: { container: "1120px" },
    },
  },
} satisfies Config;
