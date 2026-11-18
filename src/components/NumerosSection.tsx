import StatNumber from "./StatNumber";

// Seção de números em areia. Valores e rótulos vieram da Meta Sun.
// Sem linha de fonte e sem chip "provisório" (decisão da Camila). Para voltar a mostrar a
// fonte, passe `fonte="..."` ao StatNumber.

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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
