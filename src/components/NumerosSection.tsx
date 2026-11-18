import { useRef, type CSSProperties } from "react";
import { useEntrada } from "../hooks/useEntrada";
import StatNumber from "./StatNumber";

// Seção de números em areia, com o fundo "circuito" (.fundo-circuito em index.css).
// Só os números em laranja e o rótulo com efeito Aurora embaixo (sem cartões e sem ícones, decisão da
// Camila). A contagem é a de mola do StatNumber; na entrada os três aparecem em sequência.
// Valores e rótulos vieram da Meta Sun (sem linha de fonte).

const numeros = [
  { valor: 1300, sufixo: "+", rotulo: "Obras concluídas" },
  { valor: 11, sufixo: "", rotulo: "Engenheiros no suporte técnico" },
  { valor: 2, sufixo: "", rotulo: "Sedes: Porto Velho e Cacoal" },
];

function Item({ numero, indice }: { numero: (typeof numeros)[number]; indice: number }) {
  const ref = useRef<HTMLLIElement>(null);
  useEntrada(ref, 0.25);

  return (
    <li ref={ref} data-revelar-bloco>
      {/* entrada (fade + sobe) com atraso por item; o Aurora do rótulo começa junto */}
      <div className="revelar-bloco" style={{ "--d": `${indice * 120}ms` } as CSSProperties}>
        <StatNumber aurora valor={numero.valor} sufixo={numero.sufixo} rotulo={numero.rotulo} />
      </div>
    </li>
  );
}

export default function NumerosSection() {
  return (
    <section id="numeros" aria-label="Números da Meta Sun" className="fundo-circuito bg-areia py-[var(--section-y)]">
      <div className="container-meta">
        {/* 1ª coluna mais larga: "1.300+" em 112px precisa de mais espaço que "11" e "2" */}
        <ul className="grid gap-12 md:grid-cols-[3fr_2fr_2fr]">
          {numeros.map((n, i) => (
            <Item key={n.rotulo} numero={n} indice={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
