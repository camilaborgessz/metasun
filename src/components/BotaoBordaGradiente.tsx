import { useEffect, useState, type ReactNode } from "react";
import { IconeSeta } from "./icons";

// Botão com borda em gradiente (efeito "Hover Border Gradient", Aceternity UI), refeito só com
// CSS e um pouco de React (sem o pacote `motion`). Os estilos estão em index.css (.borda-*).
// - Em repouso: um brilho branco dá UMA volta pela borda ao carregar a página (4s) e para no topo.
//   Limitado a 5s pela regra 7 do CLAUDE.md (movimento maior que 5s precisa de botão de pausa).
// - Hover e foco: o brilho some e a borda acende por inteiro.
// - Movimento reduzido: sem volta; o tokens.css também desliga as transições.
// A "face" do botão segue a regra: fundo Sol com texto grafite.

// posições do brilho: topo, esquerda, base, direita (sentido horário = índice - 1)
const POSICOES = [
  { x: 50, y: 0 },
  { x: 0, y: 50 },
  { x: 50, y: 100 },
  { x: 100, y: 50 },
];

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function BotaoBordaGradiente({ href, children, className = "" }: Props) {
  const [posicao, setPosicao] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let passos = 0;
    const id = window.setInterval(() => {
      passos += 1;
      setPosicao((p) => (p + POSICOES.length - 1) % POSICOES.length);
      if (passos >= POSICOES.length) window.clearInterval(id); // 4 passos = 1 volta, termina no topo
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const { x, y } = POSICOES[posicao];

  return (
    <a href={href} className={`borda-botao group ${className}`}>
      <span className="borda-face">
        {children}
        <IconeSeta className="size-5 shrink-0 transition-transform duration-150 group-hover:translate-x-[3px]" />
      </span>
      {/* brilho que corre pela borda (em repouso) */}
      <span
        aria-hidden="true"
        className="borda-luz"
        style={{ "--bx": `${x}%`, "--by": `${y}%` } as React.CSSProperties}
      />
      {/* borda acesa por inteiro (hover e foco) */}
      <span aria-hidden="true" className="borda-acesa" />
    </a>
  );
}
