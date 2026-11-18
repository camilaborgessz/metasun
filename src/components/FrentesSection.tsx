import { useRef, type CSSProperties, type ReactNode } from "react";
import { useEntrada } from "../hooks/useEntrada";
import Button from "./Button";
import { IconeBess, IconeFotovoltaico, IconeMobilidade } from "./icons";
import TextoRevelando from "./TextoRevelando";

// "As 3 frentes" (fundo grafite, id="solucoes" para a nav).
// Layout inspirado numa referência da Camila: título grande fixo à esquerda (sticky no desktop) e, à
// direita, uma lista de linhas separadas por filetes: número, ícone + título, descrição e "Saber mais".
// Animação ao entrar na tela: as letras do título e das descrições aparecem uma a uma, os filetes se
// desenham e o número e o link surgem depois (ver .revelar-* em index.css). Sem movimento: tudo pronto.
// Os links #fotovoltaico e #mobilidade-eletrica ainda não têm destino (só o #bess é planejado).

type Frente = { icone: ReactNode; titulo: string; texto: string; href: string };

const frentes: Frente[] = [
  {
    icone: <IconeBess />,
    titulo: "BESS",
    texto:
      "BESS é o sistema de armazenamento de energia em baterias: guarda a energia que sobra e entrega quando ela custa mais.",
    href: "#bess",
  },
  {
    icone: <IconeFotovoltaico />,
    titulo: "Fotovoltaico",
    texto:
      "Painéis que transformam a luz do sol em eletricidade para o seu consumo, e reduzem o que você compra da distribuidora.",
    href: "#fotovoltaico",
  },
  {
    icone: <IconeMobilidade />,
    titulo: "Mobilidade elétrica",
    texto:
      "Pontos de recarga para veículos elétricos da sua frota ou do seu estacionamento, ligados à mesma instalação.",
    href: "#mobilidade-eletrica",
  },
];

// Uma linha da lista. O filete, o número e o link entram junto com a linha; as letras têm o próprio gatilho.
function LinhaFrente({ frente, indice }: { frente: Frente; indice: number }) {
  const ref = useRef<HTMLLIElement>(null);
  useEntrada(ref, 0.25);

  return (
    <li ref={ref} data-revelar-bloco className="relative py-10 min-[700px]:py-12">
      {/* filete de cima: se desenha da esquerda para a direita */}
      <span aria-hidden="true" className="revelar-linha absolute left-0 top-0 h-px w-full bg-linha-escura" />

      <div className="grid gap-x-6 gap-y-4 min-[700px]:grid-cols-[56px_1fr]">
        <span className="revelar-bloco text-sm tabular-nums text-apoio-escuro">0{indice + 1}</span>

        <div>
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="revelar-bloco size-8 shrink-0 text-sol [&>svg]:size-full">
              {frente.icone}
            </span>
            <TextoRevelando
              as="h3"
              texto={frente.titulo}
              className="text-[clamp(28px,3.4vw,40px)] font-bold leading-[1.05] tracking-[-0.03em] text-branco"
            />
          </div>

          <TextoRevelando
            texto={frente.texto}
            className="mt-5 max-w-[50ch] text-[17px] leading-[1.7] text-apoio-escuro"
          />

          <div className="revelar-bloco mt-5" style={{ "--d": "700ms" } as CSSProperties}>
            <Button variant="link" onDark href={frente.href} seta aria-label={`Saber mais sobre ${frente.titulo}`}>
              Saber mais
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function FrentesSection() {
  return (
    <section
      id="solucoes"
      data-tema="escuro"
      aria-labelledby="titulo-frentes"
      className="bg-grafite py-[var(--section-y)] text-branco"
    >
      <div className="container-meta grid gap-10 min-[1000px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[1000px]:gap-16">
        {/* título fixo enquanto a lista rola (desktop) */}
        <div className="min-[1000px]:sticky min-[1000px]:top-[120px] min-[1000px]:self-start">
          <TextoRevelando
            as="h2"
            id="titulo-frentes"
            texto="As 3 frentes"
            className="max-w-[8ch] text-[clamp(48px,7vw,92px)] font-bold leading-[0.96] tracking-[-0.04em] text-branco"
          />
        </div>

        <ul className="border-b border-linha-escura">
          {frentes.map((f, i) => (
            <LinhaFrente key={f.titulo} frente={f} indice={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
