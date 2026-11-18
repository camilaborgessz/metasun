import { useState } from "react";
import { cta } from "../content/navegacao";
import BotaoPreenche from "./BotaoPreenche";
import CanvasText from "./CanvasText";
import { IconePausa, IconePlay } from "./icons";

// Hero (inspirado no site de referência da Camila): foto em cover dentro de um cartão com moldura areia.
// Composição: conteúdo no meio da foto; título em 3 linhas à esquerda, cada linha mais apagada que a
// anterior; à direita, na mesma base, o subtítulo e o botão. A nav é a pílula de vidro do Header (por cima da foto).
// Valores do mockup: moldura 20px (12px abaixo de 900px), cartão com cantos 32px, foto center 30%.
// Os cantos de 32px e as pílulas valem SÓ no Hero e na nav; o resto do site segue os raios 6, 8 e 12.
// Movimento: "horário de ponta" anima sem parar (pedido da Camila); como a regra 7 pede botão de pausa
// para movimento acima de 5s, há um botão discreto no canto inferior direito do cartão.

const FOTO = "/images/hero-painel-solar";
const LARGURAS = [800, 1280, 1920];

export default function Hero() {
  const [pausado, setPausado] = useState(false);

  return (
    <section
      id="inicio"
      data-tema="escuro"
      className="flex min-h-[clamp(600px,92svh,860px)] bg-areia p-3 min-[900px]:p-5"
    >
      {/* hero-cartao: encolhe ao rolar a página (CSS em index.css) */}
      <div className="hero-cartao relative isolate flex flex-1 flex-col justify-center overflow-hidden rounded-[32px] bg-grafite">
        {/* Foto principal da página: carrega primeiro (fetchPriority alta, sem lazy) */}
        <img
          src={`${FOTO}-1280.webp`}
          srcSet={LARGURAS.map((w) => `${FOTO}-${w}.webp ${w}w`).join(", ")}
          sizes="100vw"
          width={2576}
          height={1743}
          fetchPriority="high"
          alt="Painéis solares no telhado de um galpão ao pôr do sol"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_30%]"
        />
        {/* Gradiente por cima da foto: dá contraste ao texto (valores em index.css) */}
        <div aria-hidden="true" className="hero-gradiente absolute inset-0 -z-10" />

        {/* Conteúdo no MEIO da foto (centralizado na vertical): título à esquerda; subtítulo e botão à
            direita. O topo (pt-28) deixa espaço para a nav; o fundo (pb-14) é curto para não sobrar
            foto vazia embaixo do botão no celular. Abaixo de 1100px as duas partes empilham. */}
        <div className="flex flex-col gap-8 px-6 pb-14 pt-28 min-[1100px]:flex-row min-[1100px]:items-end min-[1100px]:justify-between min-[1100px]:gap-12 min-[1100px]:px-[60px] min-[1100px]:pb-20">
          {/* Título em 3 linhas: cada uma mais apagada que a anterior (hierarquia do original).
              "horário de ponta" tem o efeito de linhas nas letras, sempre animado (com botão de pausa). */}
          <h1 className="text-[clamp(32px,6vw,52px)] font-semibold leading-[1.04] tracking-[-0.035em] min-[1100px]:text-[clamp(36px,3.6vw,52px)]">
            <span className="block text-branco">
              Quanto o{" "}
              <CanvasText text="horário de ponta" className="text-sol" cycles={Infinity} animationDuration={6} pausado={pausado} />
            </span>
            <span className="block text-branco/70">pesa no resultado</span>
            <span className="block text-branco/50">da sua empresa?</span>
          </h1>

          <div className="flex flex-col items-start gap-6 min-[1100px]:max-w-[380px]">
            {/* Subtítulo: cinza-areia, peso 400, menor que o título (hierarquia) */}
            <p className="text-[clamp(16px,1.5vw,19px)] font-normal leading-[1.5] text-apoio-escuro">
              Fazemos o estudo do consumo da sua empresa e apresentamos a economia estimada.
            </p>

            {/* Um botão só: miolo branco translúcido; no hover um degradê laranja o preenche */}
            <BotaoPreenche href={cta.href}>{cta.rotulo}</BotaoPreenche>
          </div>
        </div>

        {/* Pausar/retomar a animação do título (regra 7). Some com movimento reduzido: aí não há animação. */}
        <button
          type="button"
          aria-pressed={pausado}
          aria-label={pausado ? "Retomar a animação do título" : "Pausar a animação do título"}
          onClick={() => setPausado((p) => !p)}
          className="absolute bottom-4 right-4 inline-flex size-11 items-center justify-center rounded-full border border-branco/25 bg-grafite/50 text-branco backdrop-blur-md transition-colors duration-150 hover:bg-branco/20 motion-reduce:hidden min-[900px]:bottom-6 min-[900px]:right-6"
        >
          {pausado ? <IconePlay className="size-5" /> : <IconePausa className="size-5" />}
        </button>
      </div>
    </section>
  );
}
