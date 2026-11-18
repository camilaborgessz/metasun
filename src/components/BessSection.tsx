import Button from "./Button";
import BessDiagram from "./BessDiagram";
import StatNumber from "./StatNumber";

// Seção BESS em destaque: fundo azul-marinho (var(--marinho), PROVISÓRIO: HEX a confirmar).
// Duas colunas no desktop (texto + número), empilha no celular. O diagrama ocupa a largura toda.
// O número e a fonte ainda são placeholders: o StatNumber mostra o chip "provisório".

export default function BessSection() {
  return (
    <section
      id="bess"
      data-tema="escuro"
      aria-labelledby="titulo-bess"
      className="bg-marinho py-[var(--section-y)] text-branco"
    >
      <div className="container-meta">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="t-label text-sol">BESS</p>
            <h2 id="titulo-bess" className="t-h2 mt-3 max-w-[22ch]">
              Guarde energia para usar quando ela custa mais.
            </h2>
            <p className="t-lead mt-4 max-w-[56ch] text-apoio-escuro">
              Hoje você compra da distribuidora o dia inteiro e paga mais na ponta. Com o BESS, a
              energia que sobra durante o dia fica guardada em baterias e entra no horário de ponta,
              quando comprar da rede custa mais.
            </p>
            <div className="mt-8">
              <Button href="#bess-pagina">Conhecer o BESS</Button>
            </div>
          </div>

          <StatNumber
            onDark
            valor="[00]%"
            rotulo="[quanto da conta cai na ponta, e o que o BESS muda]"
            fonte="[Fonte: estudo ou projeto de referência]"
          />
        </div>

        <div className="mt-16">
          <BessDiagram />
        </div>
      </div>
    </section>
  );
}
