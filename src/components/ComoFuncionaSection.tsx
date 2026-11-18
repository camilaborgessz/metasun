import { cta } from "../content/navegacao";
import Button from "./Button";
import Step from "./Step";

// "Como funciona" (fundo areia). id="como-funciona" para a nav.
// Etapas enviadas pela Meta Sun ("Como a Meta Sun trabalha").

const etapas = [
  { titulo: "Estudo técnico", texto: "Análise do consumo, da demanda e dos horários de uso." },
  { titulo: "Proposta consultiva", texto: "Economia estimada e facilidade de pagamento." },
  { titulo: "Projeto e obra", texto: "Executados pela engenharia própria." },
  { titulo: "Monitoramento", texto: "Acompanhamento e pós-venda por anos." },
];

export default function ComoFuncionaSection() {
  return (
    <section id="como-funciona" aria-labelledby="titulo-como-funciona" className="bg-areia py-[var(--section-y)]">
      <div className="container-meta">
        <h2 id="titulo-como-funciona" className="t-h2">
          Como funciona
        </h2>

        {/* list-none tira o número da lista: o número fica no marcador de cada etapa */}
        <ol className="mt-12 list-none md:grid md:grid-cols-4 md:gap-6">
          {etapas.map((e, i) => (
            <Step
              key={e.titulo}
              numero={i + 1}
              titulo={e.titulo}
              texto={e.texto}
              indice={i}
              ultimo={i === etapas.length - 1}
            />
          ))}
        </ol>

        <div className="mt-12">
          <Button href={cta.href}>{cta.rotulo}</Button>
        </div>
      </div>
    </section>
  );
}
