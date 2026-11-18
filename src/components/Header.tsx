import { useEffect, useRef, useState } from "react";
import { cta, navItens } from "../content/navegacao";
import BotaoPreenche from "./BotaoPreenche";
import { IconeFechar, IconeMenu, IconeSeta } from "./icons";
import Logo from "./Logo";

// Header sticky em PÍLULA de vidro (inspirado no site de referência da Camila): logo, nav e CTA
// dentro de uma barra arredondada com desfoque, a 16px do topo. O layout é o mesmo em qualquer estado;
// só muda a cor:
//   - sobreFoto (Home) no topo: pílula escura translúcida por cima da foto, texto e logo brancos
//   - rolado (mais de 8px) ou nas outras páginas: pílula areia translúcida, texto grafite
//   ≥900px: logo, nav (à esquerda) e CTA (à direita) · <900px: a nav vira menu · <640px: o CTA sai da pílula e vira um botão pequeno flutuante (BotaoCtaMobile).
// A pílula vale como exceção de forma (como o Hero): o resto do site segue os raios 6, 8 e 12.

type Props = {
  /** variante sobre fundo escuro (grafite) */
  onDark?: boolean;
  /** Home: por cima da foto do Hero até rolar */
  sobreFoto?: boolean;
};

export default function Header({ onDark = false, sobreFoto = false }: Props) {
  const [rolado, setRolado] = useState(() => window.scrollY > 8);
  const [menuAberto, setMenuAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const aoRolar = () => setRolado(window.scrollY > 8);
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Esc fecha o menu e devolve o foco ao botão
  useEffect(() => {
    if (!menuAberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuAberto(false);
        botaoMenu.current?.focus();
      }
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [menuAberto]);

  const transparente = sobreFoto && !rolado;
  const escuro = onDark || transparente; // texto e logo claros

  const pilula = transparente
    ? "border-branco/20 bg-grafite/45 text-branco"
    : onDark
      ? "border-linha-escura bg-grafite/90 text-branco"
      : "border-linha bg-linha/80 text-grafite";
  const hoverItem = escuro ? "hover:bg-branco/15 focus-visible:bg-branco/15" : "hover:bg-branco/60 focus-visible:bg-branco/60";
  const hoverIcone = escuro ? "hover:bg-branco/15" : "hover:bg-branco/60";
  const listaMobile = transparente
    ? "border-branco/20 bg-grafite/90 text-branco backdrop-blur-md"
    : onDark
      ? "border-linha-escura bg-grafite text-branco"
      : "border-linha bg-areia text-grafite";

  // Por cima da foto a pílula desce para dentro do cartão do Hero (moldura areia de 12px/20px)
  const posicao = transparente ? "translate-y-3 min-[900px]:translate-y-5" : "translate-y-0";

  return (
    <>
      {/* O <header> mantém sempre o mesmo espaço no fluxo: 80px nas páginas internas e 0 por cima
          da foto. Assim o conteúdo abaixo não pula quando a barra muda (evita CLS). */}
      <header
        data-tema={escuro ? "escuro" : undefined}
        className={`pointer-events-none sticky top-0 z-40 ${sobreFoto ? "h-0" : "h-20"}`}
      >
        <div className={`pointer-events-auto relative pt-4 transition-transform duration-[250ms] ${posicao}`}>
          <div className="container-meta">
            <div
              className={`relative flex h-14 items-center gap-3 rounded-full border pl-5 pr-2 backdrop-blur-md transition-colors duration-300 ${pilula}`}
            >
              <a href="/" aria-label="Meta Sun, página inicial" className="shrink-0 rounded-botao">
                <Logo negativo={escuro} className="h-9" />
              </a>

              <nav aria-label="Principal" className="menu:ml-4 menu:flex-1">
                {/* Celular: lista que abre abaixo da pílula. Desktop: linha, alinhada à esquerda. */}
                <ul
                  id="menu-principal"
                  className={`${menuAberto ? "block" : "hidden"} absolute inset-x-0 top-full mt-2 rounded-3xl border p-2 ${listaMobile} menu:static menu:mt-0 menu:flex menu:justify-start menu:gap-1 menu:rounded-none menu:border-0 menu:bg-transparent menu:p-0 menu:backdrop-blur-none`}
                >
                  {navItens.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={() => setMenuAberto(false)}
                        className={`inline-flex min-h-12 w-full items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors duration-200 menu:min-h-10 menu:w-auto ${hoverItem}`}
                      >
                        {item.rotulo}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="ml-auto flex items-center gap-2 menu:ml-0">
                {/* O CTA só aparece a partir de 640px; abaixo disso vai para a barra da base.
                    Miolo branco translúcido sobre a foto e grafite na pílula clara. */}
                <div className="hidden sm:block">
                  <BotaoPreenche
                    href={cta.href}
                    face={escuro ? "branco" : "grafite"}
                    tamanho="compacto"
                    seta={false}
                  >
                    {cta.rotulo}
                  </BotaoPreenche>
                </div>

                <button
                  ref={botaoMenu}
                  type="button"
                  aria-expanded={menuAberto}
                  aria-controls="menu-principal"
                  aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
                  onClick={() => setMenuAberto((aberto) => !aberto)}
                  className={`inline-flex size-11 items-center justify-center rounded-full transition-colors duration-150 menu:hidden ${hoverIcone}`}
                >
                  {menuAberto ? <IconeFechar /> : <IconeMenu />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <BotaoCtaMobile />
    </>
  );
}

// Aparece só depois de passar do Hero (que já tem o próprio botão) e some quando o rodapé entra na tela.
function deveMostrarCtaMobile(): boolean {
  const passouDoHero = window.scrollY > window.innerHeight * 0.7;
  const rodape = document.querySelector("footer");
  const noRodape = rodape ? rodape.getBoundingClientRect().top < window.innerHeight - 40 : false;
  return passouDoHero && !noRodape;
}

// CTA do celular (<640px): botão pequeno e discreto, flutuando no centro da base, no lugar da barra
// larga de antes. Pílula branca com borda fina (aparece bem em seção clara e escura), 44px de altura.
// Altura + margem = 60px (o WhatsAppFloat vai subir ~64px quando ele existir).
function BotaoCtaMobile() {
  const [visivel, setVisivel] = useState(deveMostrarCtaMobile);

  useEffect(() => {
    const atualizar = () => setVisivel(deveMostrarCtaMobile());
    window.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);
    return () => {
      window.removeEventListener("scroll", atualizar);
      window.removeEventListener("resize", atualizar);
    };
  }, []);

  return (
    <div
      // inert: escondido não recebe foco nem clique
      inert={!visivel}
      className={`fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2 transition-[opacity,transform] duration-300 sm:hidden ${
        visivel ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <a
        href={cta.href}
        className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-linha bg-branco px-5 text-sm font-semibold text-grafite transition-colors duration-150 hover:bg-areia active:bg-linha"
      >
        {cta.rotulo}
        <IconeSeta className="size-4" />
      </a>
    </div>
  );
}
