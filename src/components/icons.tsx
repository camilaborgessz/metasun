import type { SVGProps } from "react";

// Ícones de linha: grade 24, traço 1,75, cor herdada (currentColor).
// aria-hidden: o sentido vai sempre em texto ao lado.
function Icone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

export const IconeSeta = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icone>
);

// Seta diagonal (botão em pílula do Hero): traço mais grosso que o padrão
export const IconeSetaDiagonal = (p: SVGProps<SVGSVGElement>) => (
  <Icone strokeWidth={2.4} {...p}>
    <path d="M7 17L17 7M8 7h9v9" />
  </Icone>
);

export const IconeAlerta =(p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <path d="M12 3.5 2.5 20h19L12 3.5Z" />
    <path d="M12 10v4.5M12 17.4v.1" />
  </Icone>
);

// Ícones das três frentes (caminhos fornecidos pela Meta Sun)
export const IconeBess = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <rect x="2.5" y="7" width="16" height="10" rx="2" />
    <path d="M21.5 10.5v3" />
    <path d="M11 9.5l-2.5 3h3L9 15" />
  </Icone>
);

export const IconeFotovoltaico = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <path d="M5 5h14l2.5 9h-19z" />
    <path d="M12 5v9M7.8 5l-1.6 9M16.2 5l1.6 9M3.7 9.5h16.6M12 14v5M8 19h8" />
  </Icone>
);

export const IconeMobilidade = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <path d="M3.5 16v-3.5L5.5 8h9.5l2.5 4.5V16z" />
    <circle cx="7.5" cy="17" r="1.8" />
    <circle cx="15.5" cy="17" r="1.8" />
    <path d="M20 9.5l-1.5 3h2.5L19.5 16" />
  </Icone>
);

// Ícones dos números da Home
export const IconeObra = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <path d="M4 20h16" />
    <path d="M6 20V9l6-4 6 4v11" />
    <path d="M10 20v-5h4v5" />
  </Icone>
);

export const IconeEquipe = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    <circle cx="17" cy="9" r="2.4" />
    <path d="M16 14.2c2.6.3 4.5 2 4.5 4.8" />
  </Icone>
);

export const IconePino = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </Icone>
);

// Raio: "usa no horário de ponta" (BessDiagram)
export const IconeRaio = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" />
  </Icone>
);

export const IconePausa = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <path d="M8.5 5v14M15.5 5v14" />
  </Icone>
);

export const IconePlay = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <path d="M7.5 4.5l11 7.5-11 7.5z" />
  </Icone>
);

export const IconeMenu = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icone>
);

export const IconeFechar = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icone>
);
