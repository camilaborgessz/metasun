import { useRef, type ReactNode } from "react";
import { useEntrada } from "../hooks/useEntrada";
import { useScrollProgress } from "../hooks/useScrollProgress";
import AuroraText from "./AuroraText";
import { IconeBess, IconeRaio, IconeSol } from "./icons";

// Seção BESS em destaque: fundo azul-marinho (var(--marinho), PROVISÓRIO: HEX a confirmar) com o
// fundo "circuito" escuro (.fundo-circuito-escuro, grade suave). Duas colunas no desktop: cabeçalho
// FIXO (sticky) à esquerda e, à direita, a linha do tempo de 3 passos (gera → guarda → usa no horário
// de ponta), que preenche conforme a pessoa rola (hook useScrollProgress). No celular vira uma coluna.
// Cabeçalho: eyebrow, pergunta (com "energia guardada" em Aurora), explicação e a faixa que repete
// "Pioneira em BESS na Região Norte" (decisão da Camila: sem linha de apoio, sem chamada e sem botões).
// Para ADICIONAR UM 4º PASSO: acrescente um item ao array `passos` (número, linha e bolinhas se ajustam).
// ATENÇÃO: "Pioneira em BESS na Região Norte" é uma afirmação forte SEM fonte (regra de voz do
// CLAUDE.md: número e fonte). Confirmar antes do lançamento.
// Movimento: a faixa anda sem parar (pedido da Camila), pausa com o mouse em cima e fica parada com
// movimento reduzido; a regra 7 pediria um botão de pausa.

type Passo = { numero: string; titulo: string; texto: string; icone: ReactNode };

const passos: Passo[] = [
  {
    numero: "01",
    titulo: "Gera",
    texto: "O sistema fotovoltaico (geração de energia a partir da luz do sol) produz energia durante o dia.",
    icone: <IconeSol />,
  },
  {
    numero: "02",
    titulo: "Guarda",
    texto: "As baterias armazenam o que a sua empresa não está usando naquele momento.",
    icone: <IconeBess />,
  },
  {
    numero: "03",
    titulo: "Usa no horário de ponta",
    texto: "Quando a tarifa sobe, a empresa usa a energia guardada em vez de comprar da rede.",
    icone: <IconeRaio />,
  },
];

// Aurora para FUNDO ESCURO: Sol, âmbar claro e branco (todas passam de 7:1 sobre o azul-marinho)
const AURORA_NO_ESCURO = ["#F7A21B", "#FFD27A", "#FFFFFF", "#F7A21B"];

const SELO = "Pioneira em BESS na Região Norte";

// A mesma frase repetida, com um ponto Sol entre as cópias. Duas cópias do grupo formam o trilho.
function GrupoDaFaixa() {
  return (
    <div className="flex shrink-0 items-center">
      {[0, 1, 2, 3].map((n) => (
        <span key={n} className="flex items-center">
          <span className="t-label whitespace-nowrap text-sol">{SELO}</span>
          <span aria-hidden="true" className="mx-8 size-1.5 rounded-full bg-sol/60" />
        </span>
      ))}
    </div>
  );
}

export default function BessSection() {
  const linhaDoTempo = useRef<HTMLDivElement>(null);
  useScrollProgress(linhaDoTempo);

  // O Aurora do título só começa a dar a volta quando o título aparece na tela
  const titulo = useRef<HTMLHeadingElement>(null);
  useEntrada(titulo, 0.5);

  return (
    <section
      id="bess"
      data-tema="escuro"
      aria-labelledby="titulo-bess"
      className="fundo-circuito-escuro relative isolate bg-marinho py-[var(--section-y)] text-branco"
    >
      {/* No celular a coluna é minmax(0,1fr): sem isso a faixa larga esticava a coluna e cortava o texto. */}
      <div className="container-meta grid grid-cols-[minmax(0,1fr)] gap-14 min-[992px]:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] min-[992px]:gap-16">
        {/* Cabeçalho: fixo (sticky) no desktop com tela de pelo menos 820px de altura; em telas mais
            baixas ele rola junto (senão ficaria maior que a tela). CSS em .bess-cabecalho (index.css). */}
        <div className="bess-cabecalho">
          <p className="t-label inline-flex rounded-full border border-sol/50 px-3.5 py-1.5 text-sol">
            BESS · Armazenamento de energia
          </p>

          <h2
            ref={titulo}
            data-revelar-bloco
            id="titulo-bess"
            className="mt-5 max-w-[22ch] text-[clamp(26px,3.3vw,40px)] font-bold leading-[1.1] tracking-[-0.015em]"
          >
            E se a sua empresa usasse{" "}
            <AuroraText emLinha colors={AURORA_NO_ESCURO}>
              energia guardada
            </AuroraText>{" "}
            na hora em que ela fica mais cara?
          </h2>

          <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-branco/80 min-[1200px]:text-[17px]">
            O BESS é o sistema de armazenamento de energia em baterias. Ele guarda a energia que sobra
            durante o dia e a devolve no horário de ponta, o período de maior tarifa para empresas do
            grupo A. Assim, a sua empresa depende menos da rede nos momentos mais caros, mantém a
            demanda sob controle e continua operando mesmo quando a rede falha.
          </p>

          {/* Faixa que passa: a frase se repete, transparente nas pontas e clara no meio */}
          <div className="mt-8 max-w-[560px]">
            <p className="sr-only">{SELO}</p>
            <div aria-hidden="true" className="faixa-bess border-y border-branco/15 py-3">
              <div className="faixa-bess-trilho">
                <GrupoDaFaixa />
                <GrupoDaFaixa />
              </div>
            </div>
          </div>
        </div>

        {/* Linha do tempo: trilho + passos (lista ordenada) */}
        <div ref={linhaDoTempo} className="timeline">
          <span aria-hidden="true" data-trilho className="timeline-trilho">
            <span className="timeline-progresso" />
          </span>

          <ol>
            {passos.map((p) => (
              <li key={p.numero} data-passo className="timeline-passo relative pl-[calc(var(--ponto)+24px)]">
                <span aria-hidden="true" data-ponto className="timeline-ponto" />

                <div className="timeline-cartao rounded-card bg-branco/[.06] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[clamp(40px,4.5vw,56px)] font-bold leading-none tabular-nums text-sol">
                      {p.numero}
                    </span>
                    <span aria-hidden="true" className="size-8 shrink-0 text-sol [&>svg]:size-full">
                      {p.icone}
                    </span>
                  </div>
                  <h3 className="t-h3 mt-6 uppercase tracking-wide">{p.titulo}</h3>
                  <p className="mt-2 text-branco/80">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
