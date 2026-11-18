import { useEffect, useRef, useState } from "react";
import { cta } from "../content/navegacao";
import { ChipProvisorio } from "./Chip";

// "Como funciona" (fundo areia, id="como-funciona" para a nav).
// Estrutura inspirada na seção "From grid dependent to energy independent" do site de referência
// helios-solar.108.supply: menu lateral sticky por âncoras (#step-1 a #step-4) + pilha de 4 cards com
// foto, parallax na foto, entrada com fade e botão com "label roll". Textos, fotos e cores são da Meta Sun.
//
// Adaptações às regras do projeto (CLAUDE.md):
// - raios como na referência (card 35px, foto 28px, itens e botão em pílula): EXCEÇÃO só desta seção,
//   pedida pela Camila (o resto do site segue 6/8/12); peso 600 no lugar do 500 (a fonte só carrega
//   400/600/700);
// - cores: areia (fundo), branco (card), linha (pílula ativa e botão), grafite (texto) e Sol só em detalhes;
// - fotos: ainda não existem, então entram placeholders hachurados com o chip "provisório";
// - movimento: parallax e entrada só sem prefers-reduced-motion e só no desktop (parallax).

// Link do botão "Solicitar proposta". Trocar pelo WhatsApp/contato real da Meta Sun quando houver.
const LINK_CONTATO = cta.href;

type Imagem = {
  src: string;
  /** versões em vários tamanhos (srcset), geradas por scripts/otimizar-foto.mjs */
  srcSet: string;
  alt: string;
  largura: number;
  altura: number;
  /** parte da foto que fica visível no recorte retrato (CSS object-position) */
  posicao: string;
  /** crédito da foto (licença Unsplash não exige, mas fica registrado) */
  credito: string;
};

// Monta a foto de uma etapa a partir dos arquivos public/images/etapa-N-{480,960,1280}.webp
function foto(n: number, alt: string, altura: number, posicao: string, credito: string): Imagem {
  const base = `/images/etapa-${n}`;
  return {
    src: `${base}-960.webp`,
    srcSet: `${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-1280.webp 1280w`,
    alt,
    largura: 1280,
    altura,
    posicao,
    credito,
  };
}

type Etapa = {
  numero: string;
  nome: string;
  texto: string;
  /** mostra o botão "Solicitar proposta" (como no original: só nas etapas 1 e 2) */
  botao: boolean;
  /** foto da etapa (em /public/images). Sem foto, aparece o placeholder abaixo. */
  imagem?: Imagem;
  /** texto do placeholder enquanto não há foto */
  placeholder: string;
};

// Dados das etapas: para trocar texto ou foto, é só editar aqui.
// As fotos abaixo são do banco Unsplash (enviadas pela Camila), não fotos de obras da Meta Sun:
// trocar por fotos reais quando houver. Para otimizar uma foto nova:
//   node scripts/otimizar-foto.mjs minha-foto.jpg public/images/etapa-1
const steps: Etapa[] = [
  {
    numero: "01",
    nome: "Estudo técnico",
    texto: "Analisamos o consumo da sua empresa, a demanda e os horários de uso. É aqui que aparece o peso do horário de ponta, o período em que a tarifa é maior para empresas do grupo A. Esse levantamento é a base de todo o projeto.",
    botao: true,
    imagem: foto(1, "Eletricista de capacete amarelo no painel", 854, "40% 50%", "Emmanuel Ikwuegbu, Unsplash"),
    placeholder: "[Foto: análise de consumo, fatura ou medição]",
  },
  {
    numero: "02",
    nome: "Proposta consultiva",
    texto: "Com o estudo pronto, apresentamos a economia estimada em números, antes de você decidir qualquer coisa. A proposta indica a solução para a sua realidade e traz as condições de pagamento facilitado.",
    botao: true,
    imagem: foto(2, "Dois colegas discutindo ideias no quadro", 854, "54% 50%", "ThisisEngineering, Unsplash"),
    placeholder: "[Foto: reunião de proposta]",
  },
  {
    numero: "03",
    nome: "Projeto e obra",
    texto: "O projeto e a obra são executados pela engenharia própria da Meta Sun, a mesma que fez o seu estudo. É o trabalho de mais de 1.300 obras concluídas em Rondônia e na Região Norte.",
    botao: false,
    imagem: foto(3, "Instalador colocando painel solar no telhado", 720, "64% 50%", "Raze Solar, Unsplash"),
    placeholder: "[Foto: instalação de painéis]",
  },
  {
    numero: "04",
    nome: "Monitoramento",
    texto: "Depois da instalação, seguimos acompanhando o sistema para que o resultado se mantenha com o passar dos anos. Você acompanha esse resultado na sua conta de energia, e o suporte técnico conta com 11 engenheiros.",
    botao: false,
    imagem: foto(4, "Engenheiro de colete e capacete na usina solar", 853, "75% 50%", "Steve Scarter, Unsplash"),
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
      className="group inline-flex min-h-11 items-center self-start rounded-full bg-linha/[.64] px-[18px] text-sm font-semibold text-grafite transition-colors duration-300 hover:bg-linha"
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
      {/* margem lateral de 28px e largura de até 1240px, como na referência (o resto do site usa o container de 1120px) */}
      <div className="mx-auto w-[min(100%-40px,1240px)] min-[640px]:w-[min(100%-56px,1240px)]">
        <h2
          id="titulo-como-funciona"
          className="text-[clamp(28px,4.2vw,42px)] font-semibold leading-[1.1] tracking-[-0.03em] text-grafite"
        >
          Como a Meta Sun trabalha
          {/* segunda linha em cor apagada (fácil de editar) */}
          <span className="block text-grafite/55">da análise ao pós-venda</span>
        </h2>

        {/* menu de 259px + 42px de vão + card (1fr), como na referência */}
        <div className="mt-14 grid gap-y-2 min-[992px]:grid-cols-[259px_minmax(0,1fr)] min-[992px]:gap-x-[42px]">
          {/* Menu: lateral e sticky no desktop; barra horizontal de itens com scroll lateral no celular */}
          <nav
            aria-label="Etapas"
            className="z-30 -mx-[var(--gutter)] bg-areia px-[var(--gutter)] py-2 max-[991px]:sticky max-[991px]:top-[84px] min-[992px]:sticky min-[992px]:top-[105px] min-[992px]:mx-0 min-[992px]:self-start min-[992px]:bg-transparent min-[992px]:p-0"
          >
            <ol
              ref={listaRef}
              className="relative flex gap-2 overflow-x-auto [scrollbar-width:none] min-[992px]:flex-col min-[992px]:gap-[3px] min-[992px]:overflow-visible"
            >
              {steps.map((e, i) => (
                <li key={e.numero} className="shrink-0">
                  <a
                    href={`#step-${i + 1}`}
                    aria-current={ativo === i ? "step" : undefined}
                    className={`relative flex items-center gap-3.5 whitespace-nowrap rounded-full px-[21px] py-3.5 text-sm font-semibold leading-[21.5px] transition-colors duration-500 ${
                      ativo === i
                        ? "bg-linha text-grafite" /* ativo: neutro mais forte, texto cheio */
                        : "text-cinza-texto hover:bg-linha/50 hover:text-grafite" /* inativo: transparente; hover: neutro suave */
                    }`}
                  >
                    {/* ponto Sol: marca o item ativo (detalhe de destaque). Fica fora do fluxo para o
                        texto continuar no mesmo lugar da referência (número em x=21px, nome em x=51px). */}
                    <span
                      aria-hidden="true"
                      className={`absolute left-2.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full transition-colors duration-500 ${
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

          {/* Pilha de slides. A margem negativa (-56px) compensa o padding-top do 1º slide e faz o
              primeiro card alinhar com o topo do menu (desktop). */}
          <div className="min-[992px]:-mt-14">
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
                {/* card: padding e vão de 7px, ~600px de altura no desktop (foto 586px + 2×7) */}
                <div className="grid gap-[7px] rounded-[28px] bg-branco p-[7px] min-[992px]:grid-cols-[3fr_2fr] min-[992px]:rounded-[35px]">
                  {/* mídia: ~60% da largura, encosta nas bordas do card (raio 28px, um pouco menor que o
                      do card); overflow escondido para o parallax; no celular a foto fica em cima (4/3) */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] min-[992px]:aspect-auto min-[992px]:min-h-[586px] min-[992px]:rounded-[28px]">
                    <div
                      ref={(el) => {
                        midias.current[i] = el;
                      }}
                      className="absolute inset-0 will-change-transform min-[992px]:motion-safe:scale-[1.08]"
                    >
                      {e.imagem ? (
                        <img
                          src={e.imagem.src}
                          srcSet={e.imagem.srcSet}
                          sizes="(min-width: 992px) 1100px, 100vw" /* a foto paisagem é cortada na altura: renderiza com ~1000px de largura */
                          alt={e.imagem.alt}
                          width={e.imagem.largura}
                          height={e.imagem.altura}
                          loading={i === 0 ? "eager" : "lazy"}
                          decoding="async"
                          style={{ objectPosition: e.imagem.posicao }}
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
                      {/* "Etapa 01" e o título bem juntos, no topo */}
                      <p className="text-[clamp(20px,2vw,24.5px)] font-semibold leading-[1.1] tracking-[-0.02em] text-grafite/55">
                        Etapa {e.numero}
                      </p>
                      <h3
                        id={`step-${i + 1}-titulo`}
                        className="text-[clamp(20px,2vw,24.5px)] font-semibold leading-[1.1] tracking-[-0.02em] text-grafite"
                      >
                        {e.nome}
                      </h3>
                      <p className="mt-[22px] text-sm leading-[21px] text-cinza-texto">{e.texto}</p>
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
