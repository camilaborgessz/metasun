import { useState, type ReactNode } from "react";
import { placeholders } from "../content/placeholders";
import Button from "./Button";
import { ChipProvisorio } from "./Chip";
import { IconeBess, IconeFotovoltaico, IconePausa, IconePlay, IconeRaio } from "./icons";

// Diagrama do BESS: gera → guarda → usa no horário de ponta.
// Montado com divs (não é um SVG único): 3 blocos e 2 linhas de fluxo, mais uma barra de 24h.
// Feito para fundo azul-marinho (texto branco e apoio #BDB9B0).
// Desktop: 5 colunas (1fr 72px 1fr 72px 1fr). Celular: vertical, o fluxo desce.
// Movimento: as linhas correm por mais de 5s, então há botão "Pausar animação".
// Com prefers-reduced-motion as linhas ficam paradas e o botão some.

type Bloco = { icone: ReactNode; rotulo: string; titulo: string; texto: string };

const blocos: Bloco[] = [
  {
    icone: <IconeFotovoltaico />,
    rotulo: "1 · Gera",
    titulo: "Painéis solares",
    texto: "Produzem eletricidade enquanto há sol.",
  },
  {
    icone: <IconeBess />,
    rotulo: "2 · Guarda",
    titulo: "Baterias (BESS)",
    texto: "Guardam o que a sua empresa não consome na hora.",
  },
  {
    icone: <IconeRaio />,
    rotulo: "3 · Usa",
    titulo: "No horário de ponta",
    texto: "Entrega a energia guardada quando comprar da rede custa mais.",
  },
];

function BlocoDoFluxo({ icone, rotulo, titulo, texto }: Bloco) {
  return (
    <div className="rounded-card border border-branco/[.28] p-6">
      <span className="block size-8 text-sol [&>svg]:size-full">{icone}</span>
      <p className="t-label mt-4 text-apoio-escuro">{rotulo}</p>
      <h3 className="t-h3 mt-1 text-branco">{titulo}</h3>
      <p className="mt-2 text-apoio-escuro">{texto}</p>
    </div>
  );
}

// Linha de fluxo de 2px com ponta de seta (chevron) no fim. Decorativa.
function Fluxo() {
  return (
    <div aria-hidden="true" className="flex h-[72px] justify-center md:h-auto md:items-center">
      <div className="relative h-full w-[2px] md:h-[2px] md:w-full">
        <div className="fluxo-linha absolute inset-0" />
        {/* chevron para baixo (celular) */}
        <span className="absolute bottom-[2px] left-1/2 size-2.5 -translate-x-1/2 rotate-[135deg] border-r-2 border-t-2 border-sol md:hidden" />
        {/* chevron para a direita (desktop) */}
        <span className="absolute right-[2px] top-1/2 hidden size-2.5 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-sol md:block" />
      </div>
    </div>
  );
}

type Props = {
  /** pausa controlada de fora (a BessSection usa o mesmo botão para o diagrama e os raios de luz) */
  pausado?: boolean;
  aoAlternar?: () => void;
};

export default function BessDiagram({ pausado: pausadoFora, aoAlternar }: Props) {
  // Sem props (ex.: na rota /dev) o diagrama cuida da própria pausa
  const [pausadoLocal, setPausadoLocal] = useState(false);
  const controlado = pausadoFora !== undefined;
  const pausado = controlado ? pausadoFora : pausadoLocal;
  const alternar = () => (controlado ? aoAlternar?.() : setPausadoLocal((p) => !p));

  return (
    <div
      role="group"
      aria-label="Diagrama do BESS: os painéis geram, as baterias guardam e a energia é usada no horário de ponta"
      className={pausado ? "bess-pausado" : ""}
    >
      {/* Pausar: some com movimento reduzido (aí as linhas já ficam paradas) */}
      <div className="mb-4 flex justify-end motion-reduce:hidden">
        <Button
          variant="secondary"
          onDark
          seta={false}
          aria-pressed={pausado}
          onClick={alternar}
          className="aria-pressed:bg-branco aria-pressed:text-grafite"
        >
          {pausado ? <IconePlay className="size-5" /> : <IconePausa className="size-5" />}
          Pausar animação
        </Button>
      </div>

      <div className="grid md:grid-cols-[1fr_72px_1fr_72px_1fr]">
        <BlocoDoFluxo {...blocos[0]} />
        <Fluxo />
        <BlocoDoFluxo {...blocos[1]} />
        <Fluxo />
        <BlocoDoFluxo {...blocos[2]} />
      </div>

      <BarraDe24h />
    </div>
  );
}

// Barra de 24h com a faixa de ponta. A janela é PROVISÓRIA: posição de exemplo (72%, largura 16%).
function BarraDe24h() {
  const faixa = placeholders.faixaDePonta;
  return (
    <div className="mt-10">
      <div
        role="img"
        aria-label={`Barra de 24 horas com a faixa de ponta destacada em laranja: ${faixa} (posição de exemplo)`}
        className="relative h-7 overflow-hidden rounded-campo border border-branco/[.28]"
      >
        <div className="absolute inset-y-0 left-[72%] flex w-[16%] items-center justify-center bg-sol text-xs font-semibold text-grafite">
          {/* Em telas estreitas a faixa é pequena demais para o texto: ele vai para a legenda */}
          <span className="hidden whitespace-nowrap sm:inline">{faixa}</span>
        </div>
      </div>

      <div aria-hidden="true" className="mt-2 flex justify-between text-xs text-apoio-escuro">
        <span>0h</span>
        <span>6h</span>
        <span>12h</span>
        <span>18h</span>
        <span>24h</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-sm text-apoio-escuro">
          A faixa de ponta depende da distribuidora e da tarifa do cliente.
          <span className="sm:hidden"> Faixa de exemplo: {faixa}.</span>
        </p>
        <ChipProvisorio onDark texto="confirmar janela" />
      </div>
    </div>
  );
}
