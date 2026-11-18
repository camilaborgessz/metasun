import type { CSSProperties } from "react";

// Raios de luz vindos de cima (efeito "Light Rays", Magic UI), refeito só com CSS (sem `motion`).
// Cada raio é uma faixa com degradê Sol → transparente, desfocada, que oscila de ângulo e de brilho.
// Cor: laranja Sol (a luz do "sol" sobre o azul-marinho). O brilho é baixo de propósito: o texto cinza
// (#BDB9B0) precisa continuar com ≥4,5:1 por cima dos raios (ver medição em CLAUDE.md).
// Movimento: infinito, então precisa de botão de pausa: a BessSection liga a classe .bess-pausado,
// que congela os raios (e o fluxo do diagrama) no mesmo botão. Com movimento reduzido ficam parados.
// Fica atrás do conteúdo (-z-10): a seção que usa precisa de `relative isolate overflow-hidden`.

type Raio = {
  /** posição horizontal do topo do raio */
  l: string;
  /** ângulo médio, em graus (o raio balança 4° para cada lado) */
  r: number;
  /** largura em px */
  w: number;
  /** duração de um vai-e-vem, em segundos */
  t: number;
  /** atraso negativo: o raio já começa em outro ponto do movimento */
  d: number;
  /** brilho máximo (0 a 1) */
  i: number;
  /** esconde no celular (menos camadas desfocadas = mais leve) */
  soDesktop?: boolean;
};

const RAIOS: Raio[] = [
  { l: "6%", r: -16, w: 120, t: 13, d: 0, i: 0.34 },
  { l: "20%", r: -9, w: 70, t: 17, d: -4, i: 0.26, soDesktop: true },
  { l: "34%", r: -3, w: 150, t: 15, d: -9, i: 0.3 },
  { l: "52%", r: 4, w: 90, t: 12, d: -2, i: 0.27, soDesktop: true },
  { l: "68%", r: 10, w: 140, t: 16, d: -7, i: 0.3 },
  { l: "82%", r: 16, w: 80, t: 14, d: -11, i: 0.26, soDesktop: true },
  { l: "94%", r: 22, w: 110, t: 18, d: -5, i: 0.34 },
];

export default function RaiosDeLuz() {
  return (
    <div aria-hidden="true" className="raios-luz pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {RAIOS.map((raio) => (
        <span
          key={raio.l}
          className={`raio-luz ${raio.soDesktop ? "max-sm:hidden" : ""}`}
          style={
            {
              "--l": raio.l,
              "--r": `${raio.r}deg`,
              "--w": `${raio.w}px`,
              "--t": `${raio.t}s`,
              "--d": `${raio.d}s`,
              "--i": raio.i,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
