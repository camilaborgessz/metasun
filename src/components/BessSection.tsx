import { useRef, type ReactNode } from "react";
import { cta } from "../content/navegacao";
import { useScrollProgress } from "../hooks/useScrollProgress";
import Button from "./Button";
import { IconeBess, IconeRaio, IconeSol } from "./icons";

// Seção BESS em destaque: fundo azul-marinho (var(--marinho), PROVISÓRIO: HEX a confirmar) com o
// fundo de pontos (.fundo-pontos). Duas colunas no desktop: cabeçalho FIXO (sticky) à esquerda e, à
// direita, a linha do tempo de 3 passos (gera → guarda → usa no horário de ponta), que preenche
// conforme a pessoa rola (hook useScrollProgress). No celular vira uma coluna: o cabeçalho vem
// primeiro (sem sticky) e a linha fica à esquerda dos cards.
// Textos do briefing da marca (usar como estão). Para ADICIONAR UM 4º PASSO: acrescente um item ao
// array `passos` abaixo (o número, a linha e as bolinhas se ajustam sozinhos).
// Os dois trechos do selo ("Pioneira..." e "Maior projeto...") são afirmações fortes SEM fonte: a regra
// de voz do CLAUDE.md pede número e fonte. Confirmar antes do lançamento.

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

export default function BessSection() {
  const linhaDoTempo = useRef<HTMLDivElement>(null);
  useScrollProgress(linhaDoTempo);

  return (
    <section
      id="bess"
      data-tema="escuro"
      aria-labelledby="titulo-bess"
      className="fundo-pontos relative isolate bg-marinho py-[var(--section-y)] text-branco"
    >
      <div className="container-meta grid gap-14 min-[992px]:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] min-[992px]:gap-16">
        {/* Cabeçalho: fixo (sticky) no desktop com tela de pelo menos 820px de altura; em telas mais
            baixas ele rola junto (senão ficaria maior que a tela e cortaria os botões). CSS em
            .bess-cabecalho (index.css). */}
        <div className="bess-cabecalho">
          <p className="t-label inline-flex rounded-full border border-sol/50 px-3.5 py-1.5 text-sol">
            BESS · Armazenamento de energia
          </p>

          <h2
            id="titulo-bess"
            className="mt-5 max-w-[22ch] text-[clamp(26px,3.3vw,40px)] font-bold leading-[1.1] tracking-[-0.015em]"
          >
            E se a sua empresa usasse energia guardada na hora em que ela fica mais cara?
          </h2>

          <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-branco/80 min-[1200px]:text-[17px]">
            O BESS é o sistema de armazenamento de energia em baterias. Ele guarda a energia que sobra
            durante o dia e a devolve no horário de ponta, o período de maior tarifa para empresas do
            grupo A. Assim, a sua empresa depende menos da rede nos momentos mais caros, mantém a
            demanda sob controle e continua operando mesmo quando a rede falha.
          </p>

          {/* selo discreto */}
          <div className="mt-8">
            <p className="t-label inline-flex rounded-campo border border-sol/60 px-3 py-1.5 text-sol">
              Pioneira em BESS na Região Norte
            </p>
            <p className="mt-2 max-w-[44ch] text-sm text-branco/70">
              Maior projeto BESS da região, com a maior quantidade de equipamentos instalados no Norte.
            </p>
          </div>

          <p className="mt-8 max-w-[48ch] text-sm text-branco/80">
            Quanto isso representa na conta da sua empresa? Depende do seu perfil de consumo, por isso a
            gente começa pelo estudo.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button href={cta.href}>{cta.rotulo}</Button>
            <Button variant="secondary" onDark href="#bess-pagina">
              Conhecer o BESS
            </Button>
          </div>
        </div>

        {/* Linha do tempo: trilho + passos (lista ordenada) */}
        <div ref={linhaDoTempo} className="timeline">
          <span aria-hidden="true" data-trilho className="timeline-trilho">
            <span className="timeline-progresso" />
          </span>

          <ol>
            {passos.map((p) => (
              <li
                key={p.numero}
                data-passo
                className="timeline-passo relative pl-[calc(var(--ponto)+24px)]"
              >
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
