import { cta } from "../content/navegacao";
import { IconeSetaDiagonal } from "./icons";

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
      <div className="relative isolate flex flex-1 flex-col justify-end overflow-hidden rounded-[32px] bg-grafite">
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
          <p className="vidro flex items-center gap-2.5 rounded-full border border-branco/30 px-4 py-[9px] text-[13px] font-semibold tracking-[0.04em] text-branco">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-sol" />
            Nós vendemos soluções energéticas e consultorias de economia
          </p>

          <h1 className="text-[clamp(34px,5.6vw,58px)] font-semibold leading-[1.08] tracking-[-0.025em] text-branco">
            Quanto o <span className="text-sol">horário de ponta</span> pesa no resultado da sua
            empresa?
          </h1>

          {/* Linha de apoio: explica o termo técnico na própria dobra */}
          <p className="max-w-[52ch] text-[clamp(16px,1.5vw,18px)] leading-relaxed text-branco">
            É a faixa do dia em que a distribuidora cobra mais pela energia.
          </p>

          <div className="mt-2 flex w-full flex-col gap-3.5 min-[900px]:w-auto min-[900px]:flex-row min-[900px]:items-center">
            {/* Primário: pílula Sol com círculo grafite e seta */}
            <a
              href={cta.href}
              className="flex h-[58px] items-center justify-between gap-3.5 rounded-full bg-sol pl-7 pr-2 text-base font-bold text-grafite transition-opacity hover:opacity-[.88] min-[900px]:justify-start"
            >
              {cta.rotulo}
              <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-grafite text-sol">
                <IconeSetaDiagonal className="size-[18px]" />
              </span>
            </a>

            {/* Secundário: vidro com borda branca */}
            <a
              href="#bess"
              className="vidro flex h-[58px] items-center justify-center rounded-full border-[1.5px] border-branco/60 px-7 text-base font-semibold text-branco transition-opacity hover:opacity-[.88]"
            >
              Conhecer o BESS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
