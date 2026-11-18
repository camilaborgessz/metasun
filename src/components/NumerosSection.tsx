import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { useEntrada } from "../hooks/useEntrada";
import { IconeEquipe, IconeObra, IconePino } from "./icons";
import StatNumber from "./StatNumber";

// Seção de números em areia. Valores e rótulos vieram da Meta Sun (sem linha de fonte, decisão da Camila).
// Cada número é um cartão grafite com ícone Sol, o número contando e um brilho laranja que segue o
// mouse (.tile-numero em index.css); na entrada os cartões aparecem em sequência. Os cartões não são
// links: o brilho é só um efeito de hover.

type Numero = { valor: number; sufixo: string; rotulo: string; icone: ReactNode };

const numeros: Numero[] = [
  { valor: 1300, sufixo: "+", rotulo: "Obras concluídas", icone: <IconeObra /> },
  { valor: 11, sufixo: "", rotulo: "Engenheiros no suporte técnico (elétrica e civil)", icone: <IconeEquipe /> },
  { valor: 2, sufixo: "", rotulo: "Sedes: Porto Velho e Cacoal (RO)", icone: <IconePino /> },
];

function Cartao({ numero, indice }: { numero: Numero; indice: number }) {
  const ref = useRef<HTMLLIElement>(null);
  useEntrada(ref, 0.25);

  // Posição do mouse dentro do cartão: o brilho laranja (::before) segue esse ponto
  const aoMover = (e: MouseEvent<HTMLDivElement>) => {
    const caixa = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - caixa.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - caixa.top}px`);
  };

  return (
    <li ref={ref} data-revelar-bloco>
      {/* wrapper da entrada (fade + sobe), com atraso por cartão */}
      <div className="revelar-bloco h-full" style={{ "--d": `${indice * 120}ms` } as CSSProperties}>
        <div className="tile-numero h-full p-7 min-[700px]:p-8" onMouseMove={aoMover}>
          <div className="relative z-10 flex h-full flex-col gap-8">
            <span aria-hidden="true" className="block size-9 text-sol [&>svg]:size-full">
              {numero.icone}
            </span>
            <StatNumber onDark valor={numero.valor} sufixo={numero.sufixo} rotulo={numero.rotulo} />
          </div>
        </div>
      </div>
    </li>
  );
}

export default function NumerosSection() {
  return (
    <section id="numeros" aria-label="Números da Meta Sun" className="bg-areia py-[var(--section-y)]">
      <div className="container-meta">
        {/* 1ª coluna mais larga: "1.300+" em 112px precisa de mais espaço que "11" e "2" */}
        <ul className="grid gap-5 md:grid-cols-[3fr_2fr_2fr]">
          {numeros.map((n, i) => (
            <Cartao key={n.rotulo} numero={n} indice={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
