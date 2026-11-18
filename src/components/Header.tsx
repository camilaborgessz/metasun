import { useEffect, useRef, useState } from "react";
import { cta, navItens } from "../content/navegacao";
import Button from "./Button";
import { IconeFechar, IconeMenu } from "./icons";
import Logo from "./Logo";

// Header sticky.
// Modo normal (páginas internas e Header rolado): barra de 80px no topo, 64px rolada, com filete.
//   ≥900px: logo, nav e CTA em linha · <900px: a nav vira menu · <640px: CTA vai para a barra da base.
// Modo sobreFoto (Home, por cima do Hero A): transparente, com logo, pílula de vidro e botão
//   "Fale com a Meta Sun" (como no mockup). Ao rolar vira a barra branca de 64px com o CTA
//   "Solicitar estudo técnico". Quem manda é o scroll (rolado = mais de 8px).

type Props = {
  /** variante sobre fundo escuro (grafite) no modo normal */
  onDark?: boolean;
  /** Home: transparente por cima da foto do Hero até rolar */
  sobreFoto?: boolean;
};

// Itens da pílula de vidro: textos do mockup (com "BESS" corrigido).
// "Sobre" ainda não tem seção de destino.
const itensPilula = [
  { rotulo: "Início", href: "#inicio" },
  { rotulo: "Soluções", href: "#solucoes" },
  { rotulo: "BESS", href: "#bess" },
  { rotulo: "Sobre", href: "#sobre" },
  { rotulo: "Contato", href: "#contato" },
];

export default function Header({ onDark = false, sobreFoto = false }: Props) {
  const [rolado, setRolado] = useState(() => window.scrollY > 8);
  const [menuAberto, setMenuAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);

  // Encolhe o header (80 → 64px) depois de rolar um pouco
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
  const escuro = onDark || transparente;

  const fundo = onDark ? "bg-grafite text-branco" : "bg-branco text-grafite";
  const filete = rolado ? (onDark ? "border-linha-escura" : "border-linha") : "border-transparent";
  const hoverIcone = onDark ? "hover:bg-linha-escura" : "hover:bg-areia";
  const divisoria = onDark ? "border-linha-escura" : "border-linha";

  return (
    <>
      {/* O <header> mantém sempre o mesmo espaço no fluxo: 80px no modo normal e 0 por cima da
          foto. Assim o conteúdo abaixo não pula quando a barra muda (evita CLS). */}
      <header
        data-tema={escuro ? "escuro" : undefined}
        className={`pointer-events-none sticky top-0 z-40 ${sobreFoto ? "h-0" : "h-20"}`}
      >
        {transparente ? (
          // ---------- Por cima da foto: logo · pílula de vidro · botão ----------
          <div className="pointer-events-auto absolute inset-x-0 top-8 px-8 min-[900px]:top-[52px] min-[900px]:px-16">
            <div className="relative flex h-[60px] items-center justify-between gap-4">
              <a href="/" aria-label="Meta Sun, página inicial" className="shrink-0 rounded-botao">
                {/* Sobre a foto escura: versão com letras brancas, sem fundo */}
                <Logo negativo className="h-12 min-[900px]:h-14" />
              </a>

              <nav aria-label="Principal">
                {/* ≥900px: texto branco, sem pílula e sem item marcado. Só aparece um fundo
                    leve no hover/foco; o item atual (aria-current) tem uma marca bem sutil. */}
                <ul className="hidden items-center gap-1 min-[900px]:flex">
                  {itensPilula.map((item, i) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        aria-current={i === 0 ? "page" : undefined}
                        className="flex min-h-11 items-center rounded-full px-5 text-[15px] font-medium text-branco transition-colors duration-200 hover:bg-branco/15 focus-visible:bg-branco/15 aria-[current=page]:bg-branco/[.08]"
                      >
                        {item.rotulo}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* <900px: o botão de menu abre esta lista */}
                <ul
                  id="menu-principal"
                  className={`${menuAberto ? "block" : "hidden"} vidro-menu absolute inset-x-0 top-full mt-3 rounded-card border border-branco/30 p-2 min-[900px]:hidden`}
                >
                  {itensPilula.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={() => setMenuAberto(false)}
                        className="flex min-h-12 items-center rounded-campo px-4 font-medium text-branco"
                      >
                        {item.rotulo}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="flex items-center gap-3">
                {/* Abaixo de 640px o CTA vai para a barra fixa da base */}
                <a
                  href={cta.href}
                  className="hidden h-12 shrink-0 items-center whitespace-nowrap rounded-full bg-branco px-6 text-[15px] font-semibold text-grafite transition-opacity hover:opacity-[.88] sm:flex"
                >
                  Fale com a Meta Sun
                </a>

                <button
                  ref={botaoMenu}
                  type="button"
                  aria-expanded={menuAberto}
                  aria-controls="menu-principal"
                  aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
                  onClick={() => setMenuAberto((aberto) => !aberto)}
                  className="vidro-menu inline-flex size-12 items-center justify-center rounded-full border border-branco/30 text-branco min-[900px]:hidden"
                >
                  {menuAberto ? <IconeFechar /> : <IconeMenu />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          // ---------- Barra sólida: 80px no topo, 64px rolada ----------
          <div
            className={`pointer-events-auto relative border-b transition-[height] duration-[250ms] ${fundo} ${filete} ${
              rolado ? "h-16" : "h-20"
            }`}
          >
            <div className="container-meta flex h-full items-center gap-4 lg:gap-6">
              <a href="/" aria-label="Meta Sun, página inicial" className="shrink-0 rounded-botao">
                {/* 56px no topo, 44px com o header rolado (64px) */}
                <Logo className={rolado ? "h-11" : "h-14"} />
              </a>

              <nav aria-label="Principal" className="menu:flex-1">
                {/* Celular: lista que abre abaixo do header. Desktop: linha. */}
                <ul
                  id="menu-principal"
                  className={`${menuAberto ? "block" : "hidden"} absolute inset-x-0 top-full border-b px-[var(--gutter)] pb-3 ${fundo} ${divisoria} menu:static menu:flex menu:justify-center menu:gap-3 menu:border-0 menu:bg-transparent menu:p-0 lg:gap-7`}
                >
                  {navItens.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={() => setMenuAberto(false)}
                        className="inline-flex min-h-12 w-full items-center whitespace-nowrap rounded-campo text-sm font-semibold underline decoration-transparent decoration-2 underline-offset-8 transition-[text-decoration-color] duration-150 hover:decoration-sol menu:min-h-11 menu:w-auto"
                      >
                        {item.rotulo}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="ml-auto flex items-center gap-3 menu:ml-0">
                {/* O CTA só aparece a partir de 640px; abaixo disso vai para a barra da base.
                    Abaixo de 1024px a seta some para caber tudo na linha. */}
                <Button
                  href={cta.href}
                  onDark={onDark}
                  className="hidden shrink-0 whitespace-nowrap sm:inline-flex max-lg:[&>svg]:hidden"
                >
                  {cta.rotulo}
                </Button>

                <button
                  ref={botaoMenu}
                  type="button"
                  aria-expanded={menuAberto}
                  aria-controls="menu-principal"
                  aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
                  onClick={() => setMenuAberto((aberto) => !aberto)}
                  className={`inline-flex size-12 items-center justify-center rounded-botao transition-colors duration-150 menu:hidden ${hoverIcone}`}
                >
                  {menuAberto ? <IconeFechar /> : <IconeMenu />}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <BarraCtaMobile />
    </>
  );
}

// Barra fixa na base, só abaixo de 640px. Mantida clara em qualquer seção.
// Altura: 12 + 48 + 12 = 72px (o WhatsAppFloat vai subir 72px quando ela existir).
function BarraCtaMobile() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-linha bg-branco px-3 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:hidden">
      <Button href={cta.href} className="w-full">
        {cta.rotulo}
      </Button>
    </div>
  );
}
