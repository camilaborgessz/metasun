import { useEffect, useRef, useState } from "react";
import { cta } from "../content/navegacao";
import { ChipProvisorio } from "./Chip";

// "Como funciona" (fundo areia, id="como-funciona" para a nav).
// Estrutura inspirada na seção "From grid dependent to energy independent" do site de referência
// helios-solar.108.supply: menu lateral sticky por âncoras (#step-1 a #step-4) + pilha de 4 cards com
// foto, parallax na foto, entrada com fade e botão com "label roll". Textos, fotos e cores são da Meta Sun.
//
// Adaptações às regras do projeto (CLAUDE.md):
// - raios dos tokens (card 12, campo 6, botão 8) em vez dos 35/28px do original; peso 600 no lugar
//   do 500 (a fonte só carrega 400/600/700);
// - cores: areia (fundo), branco (card), linha (pílula ativa e botão), grafite (texto) e Sol só em detalhes;
// - fotos: ainda não existem, então entram placeholders hachurados com o chip "provisório";
// - movimento: parallax e entrada só sem prefers-reduced-motion e só no desktop (parallax).

// Link do botão "Solicitar proposta". Trocar pelo WhatsApp/contato real da Meta Sun quando houver.
const LINK_CONTATO = cta.href;

type Imagem = { src: string; alt: string; largura: number; altura: number };

type Etapa = {
  numero: string;
  nome: string;
  texto: string;
  /** mostra o botão "Solicitar proposta" (como no original: só nas etapas 1 e 2) */
  botao: boolean;
  /** foto real, retrato ~454x511 em /public. Sem foto, aparece o placeholder abaixo. */
  imagem?: Imagem;
  /** texto do placeholder enquanto não há foto */
  placeholder: string;
};

// Dados das etapas: para trocar texto ou foto, é só editar aqui.
// Exemplo de foto: imagem: { src: "/images/etapa-1.webp", alt: "...", largura: 454, altura: 511 }
const steps: Etapa[] = [
  {
    numero: "01",
    nome: "Estudo técnico",
    texto: "Análise do consumo, da demanda e dos horários de uso.",
    botao: true,
    placeholder: "[Foto: análise de consumo, fatura ou medição]",
  },
  {
    numero: "02",
    nome: "Proposta consultiva",
    texto: "Economia estimada e facilidade de pagamento.",
    botao: true,
    placeholder: "[Foto: reunião de proposta]",
  },
  {
    numero: "03",
    nome: "Projeto e obra",
    texto: "Executados pela engenharia própria.",
    botao: false,
    placeholder: "[Foto: instalação de painéis]",
  },
  {
    numero: "04",
    nome: "Monitoramento",
    texto: "Acompanhamento e pós-venda por anos.",
    botao: false,
    placeholder: "[Foto: monitoramento no app ou painel]",
  },
];

// Placeholder de foto: hachurado, como no CLAUDE.md ("[Foto real do projeto]")
function FotoPlaceholder({ texto }: { texto: string }) {
  return (
    <div
      role="img"
      aria-label={texto}
      className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center"
      style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--linha) 0 10px, var(--areia) 10px 20px)" }}
    >
      <span className="text-sm font-semibold text-cinza-texto">{texto}</span>
      <ChipProvisorio />
    </div>
  );
}

// Botão com "label roll": dois textos iguais empilhados; no hover/foco o texto sobe e o duplicado entra por baixo.
function BotaoRolar({ href, children }: { href: string; children: string }) {
  const roda =
    "block transition-transform duration-[400ms] ease-out group-hover:-translate-y-full group-focus-visible:-translate-y-full";
  return (
    <a
      href={href}
      className="group inline-flex min-h-11 items-center self-start rounded-botao bg-linha/[.64] px-[18px] text-sm font-semibold text-grafite transition-colors duration-300 hover:bg-linha"
    >
      <span className="relative block overflow-hidden leading-[22px]">
        <span className={roda}>{children}</span>
        <span aria-hidden="true" className={`${roda} absolute left-0 top-full`}>
          {children}
        </span>
      </span>
    </a>
  );
}

export default function ComoFunciona() {
  const [ativo, setAtivo] = useState(0);
  const listaRef = useRef<HTMLOListElement>(null);
  const slides = useRef<(HTMLElement | null)[]>([]);
  const midias = useRef<(HTMLDivElement | null)[]>([]);

  // 1) Item ativo do menu: o slide que cruza ~45% da altura da tela
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setAtivo(Number((e.target as HTMLElement).dataset.indice));
        }
      },
      { rootMargin: "-45% 0px -55% 0px" },
    );
    slides.current.forEach((s) => s && observador.observe(s));
    return () => observador.disconnect();
  }, []);

  // 2) Menu horizontal (celular): mantém o item ativo visível dentro da barra
  useEffect(() => {
    if (!window.matchMedia("(max-width: 991px)").matches) return;
    const lista = listaRef.current;
    const item = lista?.querySelector<HTMLElement>('[aria-current="step"]');
    if (!lista || !item) return;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    lista.scrollTo({
      left: item.offsetLeft - (lista.clientWidth - item.offsetWidth) / 2,
      behavior: reduzido ? "auto" : "smooth",
    });
  }, [ativo]);

  // 3) Entrada: cada slide abaixo da dobra nasce escondido (fade + 24px) e aparece uma vez ao entrar.
  //    Sem JS, ou com movimento reduzido, o conteúdo já está visível.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const alvos = slides.current.filter((s): s is HTMLElement => !!s);
    for (const s of alvos) {
      if (s.getBoundingClientRect().top > window.innerHeight) s.dataset.oculto = "true";
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).removeAttribute("data-oculto");
          observador.unobserve(e.target);
        }
      },
      { threshold: 0.15 },
    );
    alvos.forEach((s) => observador.observe(s));
    return () => observador.disconnect();
  }, []);

  // 4) Parallax na foto: scale 1.08 e translateY de -4% a +4% conforme o slide atravessa a tela.
  //    Só no desktop e sem movimento reduzido.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const largo = window.matchMedia("(min-width: 992px)");
    const visiveis = new Set<number>();
    let quadro = 0;

    const atualizar = () => {
      quadro = 0;
      visiveis.forEach((i) => {
        const midia = midias.current[i];
        const slide = slides.current[i];
        if (!midia || !slide) return;
        if (!largo.matches) {
          midia.style.transform = "";
          return;
        }
        const r = slide.getBoundingClientRect();
        const progresso = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
        midia.style.transform = `translate3d(0, ${((progresso - 0.5) * 8).toFixed(2)}%, 0) scale(1.08)`;
      });
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const i = Number((e.target as HTMLElement).dataset.indice);
          if (e.isIntersecting) visiveis.add(i);
          else visiveis.delete(i);
        }
        agendar();
      },
      { rootMargin: "20% 0px" },
    );
    slides.current.forEach((s) => s && observador.observe(s));
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);

    return () => {
      observador.disconnect();
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      cancelAnimationFrame(quadro);
    };
  }, []);

  return (
    <section id="como-funciona" aria-labelledby="titulo-como-funciona" className="bg-areia py-[var(--section-y)]">
      <div className="container-meta">
        <h2
          id="titulo-como-funciona"
          className="text-[clamp(28px,4.2vw,42px)] font-semibold leading-[1.12] tracking-[-0.015em] text-grafite"
        >
          Como a Meta Sun trabalha
          {/* segunda linha em cor apagada (fácil de editar) */}
          <span className="block text-grafite/60">da análise ao pós-venda</span>
        </h2>

        <div className="mt-12 grid gap-y-2 min-[992px]:grid-cols-[minmax(200px,260px)_1fr] min-[992px]:gap-x-[42px]">
          {/* Menu: lateral e sticky no desktop; barra horizontal de itens com scroll lateral no celular */}
          <nav
            aria-label="Etapas"
            className="z-30 -mx-[var(--gutter)] bg-areia px-[var(--gutter)] py-2 max-[991px]:sticky max-[991px]:top-[72px] min-[992px]:sticky min-[992px]:top-[105px] min-[992px]:mx-0 min-[992px]:self-start min-[992px]:bg-transparent min-[992px]:p-0"
          >
            <ol
              ref={listaRef}
              className="relative flex gap-2 overflow-x-auto [scrollbar-width:none] min-[992px]:flex-col min-[992px]:gap-1 min-[992px]:overflow-visible"
            >
              {steps.map((e, i) => (
                <li key={e.numero} className="shrink-0">
                  <a
                    href={`#step-${i + 1}`}
                    aria-current={ativo === i ? "step" : undefined}
                    className={`flex items-center gap-3.5 whitespace-nowrap rounded-botao px-5 py-3.5 text-sm font-semibold transition-colors duration-500 ${
                      ativo === i ? "bg-linha text-grafite" : "text-cinza-texto hover:text-grafite"
                    }`}
                  >
                    {/* ponto Sol: marca o item ativo (detalhe de destaque) */}
                    <span
                      aria-hidden="true"
                      className={`size-1.5 shrink-0 rounded-full transition-colors duration-500 ${
                        ativo === i ? "bg-sol" : "bg-transparent"
                      }`}
                    />
                    <span className="tabular-nums">{e.numero}</span>
                    <span>{e.nome}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Pilha de slides */}
          <div>
            {steps.map((e, i) => (
              <article
                key={e.numero}
                id={`step-${i + 1}`}
                data-indice={i}
                aria-labelledby={`step-${i + 1}-titulo`}
                ref={(el) => {
                  slides.current[i] = el;
                }}
                className="passo-revelar pt-8 max-[991px]:scroll-mt-12 min-[992px]:pt-14"
              >
                <div className="grid gap-1.5 rounded-card bg-branco p-1.5 min-[992px]:grid-cols-[3fr_2fr]">
                  {/* mídia: overflow escondido para o parallax; no celular a foto fica em cima (4/3) */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-campo min-[992px]:aspect-auto min-[992px]:min-h-[511px]">
                    <div
                      ref={(el) => {
                        midias.current[i] = el;
                      }}
                      className="absolute inset-0 will-change-transform"
                    >
                      {e.imagem ? (
                        <img
                          src={e.imagem.src}
                          alt={e.imagem.alt}
                          width={e.imagem.largura}
                          height={e.imagem.altura}
                          loading={i === 0 ? "eager" : "lazy"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FotoPlaceholder texto={e.placeholder} />
                      )}
                    </div>
                  </div>

                  {/* conteúdo: texto no topo, botão no fundo */}
                  <div className="flex flex-col justify-between gap-10 p-6 min-[992px]:p-7">
                    <div>
                      <p className="text-[clamp(20px,2vw,24.5px)] font-semibold leading-tight text-grafite/60">
                        Etapa {e.numero}
                      </p>
                      <h3
                        id={`step-${i + 1}-titulo`}
                        className="text-[clamp(20px,2vw,24.5px)] font-semibold leading-tight text-grafite"
                      >
                        {e.nome}
                      </h3>
                      <p className="mt-4 text-sm leading-[21px] text-cinza-texto">{e.texto}</p>
                    </div>
                    {e.botao && <BotaoRolar href={LINK_CONTATO}>Solicitar proposta</BotaoRolar>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
