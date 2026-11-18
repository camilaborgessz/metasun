import { cta } from "../content/navegacao";
import BotaoPreenche from "./BotaoPreenche";
import CanvasText from "./CanvasText";

// Hero (inspirado no site de referência da Camila): foto em cover dentro de um cartão com moldura areia.
// Composição: título em 3 linhas embaixo à esquerda, cada linha mais apagada que a anterior;
// à direita, na mesma base, o subtítulo e o botão. A nav é a pílula de vidro do Header (por cima da foto).
// Valores do mockup: moldura 20px (12px abaixo de 900px), cartão com cantos 32px, foto center 30%.
// Os cantos de 32px e as pílulas valem SÓ no Hero e na nav; o resto do site segue os raios 6, 8 e 12.

const FOTO = "/images/hero-painel-solar";
const LARGURAS = [800, 1280, 1920];

export default function Hero() {
  return (
    <section
      id="inicio"
      data-tema="escuro"
      className="flex min-h-[clamp(640px,100svh,860px)] bg-areia p-3 min-[900px]:p-5"
    >
      {/* hero-cartao: encolhe ao rolar a página (CSS em index.css) */}
      <div className="hero-cartao relative isolate flex flex-1 flex-col justify-end overflow-hidden rounded-[32px] bg-grafite">
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

        {/* Base do Hero: título à esquerda; subtítulo e botão à direita (alinhados pela base).
            Abaixo de 1100px as duas partes empilham. */}
        {/* abaixo de 640px reserva espaço para a barra fixa de CTA da base (72px) não cobrir o botão */}
        <div className="flex flex-col gap-8 px-6 pb-10 pt-32 max-sm:pb-24 min-[1100px]:flex-row min-[1100px]:items-end min-[1100px]:justify-between min-[1100px]:gap-12 min-[1100px]:px-[60px] min-[1100px]:pb-[72px]">
          {/* Título em 3 linhas: cada uma mais apagada que a anterior (hierarquia do original).
              "horário de ponta" tem o efeito de linhas nas letras (1 ciclo de 5s; o mouse repete). */}
          <h1 className="text-[clamp(32px,6vw,52px)] font-semibold leading-[1.04] tracking-[-0.035em] min-[1100px]:text-[clamp(36px,3.6vw,52px)]">
            <span className="block text-branco">
              Quanto o <CanvasText text="horário de ponta" className="text-sol" />
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
      </div>
    </section>
  );
}
