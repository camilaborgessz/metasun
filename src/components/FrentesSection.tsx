import { IconeBess, IconeFotovoltaico, IconeMobilidade } from "./icons";
import SolutionCard from "./SolutionCard";

// "As três frentes" (fundo branco). id="solucoes" para a nav.
// Os links #fotovoltaico e #mobilidade-eletrica ainda não têm destino (só o #bess é planejado).

const frentes = [
  {
    icone: <IconeBess />,
    titulo: "BESS",
    texto:
      "BESS é o sistema de armazenamento de energia em baterias: guarda a energia que sobra e entrega quando ela custa mais.",
    rotulo: "Saber mais",
    href: "#bess",
  },
  {
    icone: <IconeFotovoltaico />,
    titulo: "Fotovoltaico",
    texto:
      "Painéis que transformam a luz do sol em eletricidade para o seu consumo, e reduzem o que você compra da distribuidora.",
    rotulo: "Saber mais",
    href: "#fotovoltaico",
  },
  {
    icone: <IconeMobilidade />,
    titulo: "Mobilidade elétrica",
    texto:
      "Pontos de recarga para veículos elétricos da sua frota ou do seu estacionamento, ligados à mesma instalação.",
    rotulo: "Saber mais",
    href: "#mobilidade-eletrica",
  },
];

export default function FrentesSection() {
  return (
    <section id="solucoes" aria-labelledby="titulo-frentes" className="bg-branco py-[var(--section-y)]">
      <div className="container-meta">
        <h2 id="titulo-frentes" className="t-h2">
          As 3 frentes
        </h2>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {frentes.map((f) => (
            <li key={f.titulo}>
              <SolutionCard {...f} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
