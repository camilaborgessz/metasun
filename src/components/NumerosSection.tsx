import { placeholders } from "../content/placeholders";
import StatNumber from "./StatNumber";

// Seção de números em areia. Valores e rótulos vieram da Meta Sun.
// Fonte: registro interno da própria empresa. O PERÍODO ainda é placeholder (chip "provisório").

const numeros = [
  { valor: 1300, sufixo: "+", rotulo: "Obras concluídas" },
  { valor: 11, sufixo: "", rotulo: "Engenheiros no suporte técnico (elétrica e civil)" },
  { valor: 2, sufixo: "", rotulo: "Sedes: Porto Velho e Cacoal (RO)" },
];

export default function NumerosSection() {
  return (
    <section id="numeros" aria-label="Números da Meta Sun" className="bg-areia py-[var(--section-y)]">
      <div className="container-meta">
        <div className="grid gap-12 md:grid-cols-[3fr_2fr_2fr]">
          {numeros.map((n) => (
            <StatNumber
              key={n.rotulo}
              valor={n.valor}
              sufixo={n.sufixo}
              rotulo={n.rotulo}
              fonte={placeholders.fonteNumerosHome}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
