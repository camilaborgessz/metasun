import { cta } from "../content/navegacao";
import BotaoBordaGradiente from "./BotaoBordaGradiente";
import CanvasText from "./CanvasText";

// Hero A (imersiva escura): foto em cover dentro de um cartão com moldura areia.
// Valores do mockup docs/reference/hero-a: moldura 20px (12px abaixo de 900px), cartão com cantos 32px,
// foto center 30%, H1 58px peso 600, tag e botões em pílula, vidro com blur.
// As pílulas e os cantos de 32px valem SÓ aqui; o resto do site segue os raios 6, 8 e 12.
// O Header fica por cima da foto (ver Header, prop sobreFoto).

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

        {/* 900px = 780px de conteúdo do mockup + 60px de padding de cada lado (box-sizing) */}
        <div className="flex max-w-[900px] flex-col items-start gap-[22px] px-6 pb-8 pt-32 min-[900px]:px-[60px] min-[900px]:pb-[52px]">


          <h1 className="text-[clamp(34px,5.6vw,58px)] font-semibold leading-[1.08] tracking-[-0.025em] text-branco">
            Quanto o{" "}
            {/* palavras em destaque: linhas onduladas dentro das letras (1 ciclo de 5s, mouse repete) */}
            <CanvasText text="horário de ponta" className="text-sol" />{" "}
            pesa no resultado da sua empresa?
          </h1>

          {/* Subtítulo */}
          <p className="max-w-[52ch] text-[clamp(17px,1.6vw,20px)] leading-[1.55] text-branco">
            Fazemos o estudo do consumo da sua empresa e apresentamos a economia estimada.
          </p>

          <div className="mt-2 flex w-full flex-col gap-3.5 min-[900px]:w-auto min-[900px]:flex-row min-[900px]:items-center">
            {/* Primário: borda em gradiente (brilho que corre pela borda; acende no hover) */}
            <BotaoBordaGradiente href={cta.href} className="w-full min-[900px]:w-auto">
              {cta.rotulo}
            </BotaoBordaGradiente>

            {/* Secundário: vidro com borda branca e brilho no hover (.btn-brilho, em index.css) */}
            <a
              href="#bess"
              className="vidro btn-brilho flex h-[58px] items-center justify-center rounded-full border-[1.5px] border-branco/60 px-7 text-base font-semibold text-branco"
            >
              <span className="relative z-10">Conhecer o BESS</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
