import { useEffect, useRef, useState } from "react";
import { cta, navItens } from "../content/navegacao";
import BotaoPreenche from "./BotaoPreenche";
import Button from "./Button";
import { IconeFechar, IconeMenu } from "./icons";
import Logo from "./Logo";

// Header sticky. UM layout só, em qualquer estado: logo · nav · CTA (e botão de menu no celular).
//   ≥900px: logo, nav e CTA em linha · <900px: a nav vira menu · <640px: CTA vai para a barra da base.
// O que muda entre os estados é só a cor:
//   - sobreFoto (Home) no topo: transparente por cima da foto do Hero, texto e logo brancos
//   - rolado (mais de 8px) ou nas outras páginas: barra branca (64px rolada) com filete, texto grafite
// A altura vai de 80px para 64px ao rolar. Os itens da nav e o CTA são os mesmos nos dois estados.

type Props = {
  /** variante sobre fundo escuro (grafite) */
  onDark?: boolean;
  /** Home: transparente por cima da foto do Hero até rolar */
  sobreFoto?: boolean;
};

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
  const escuro = onDark || transparente; // texto e logo claros

  const fundo = transparente
    ? "bg-transparent text-branco"
    : onDark
      ? "bg-grafite text-branco"
      : "bg-branco text-grafite";
  const filete = rolado ? (onDark ? "border-linha-escura" : "border-linha") : "border-transparent";
  const hoverIcone = escuro ? "hover:bg-branco/15" : "hover:bg-areia";
  const listaMobile = transparente
    ? "vidro-menu border-branco/30 text-branco"
    : `${fundo} ${onDark ? "border-linha-escura" : "border-linha"}`;

  // Por cima da foto, a barra desce para dentro do cartão (moldura areia de 12px/20px + folga)
  const posicao = transparente ? "translate-y-5 min-[900px]:translate-y-9" : "translate-y-0";

  return (
    <>
      {/* O <header> mantém sempre o mesmo espaço no fluxo: 80px nas páginas internas e 0 por cima
          da foto. Assim o conteúdo abaixo não pula quando a barra muda (evita CLS). */}
      <header
        data-tema={escuro ? "escuro" : undefined}
        className={`pointer-events-none sticky top-0 z-40 ${sobreFoto ? "h-0" : "h-20"}`}
      >
        <div
          className={`pointer-events-auto relative border-b transition-[height,transform] duration-[250ms] ${fundo} ${filete} ${posicao} ${
            rolado ? "h-16" : "h-20"
          }`}
        >
          <div className="container-meta flex h-full items-center gap-4 lg:gap-6">
            <a href="/" aria-label="Meta Sun, página inicial" className="shrink-0 rounded-botao">
              {/* 56px no topo, 44px com o header rolado (64px). Fundo escuro: letras brancas. */}
              <Logo negativo={escuro} className={rolado ? "h-11" : "h-14"} />
            </a>

            <nav aria-label="Principal" className="menu:flex-1">
              {/* Celular: lista que abre abaixo do header. Desktop: linha. */}
              <ul
                id="menu-principal"
                className={`${menuAberto ? "block" : "hidden"} absolute inset-x-0 top-full border-b px-[var(--gutter)] pb-3 ${listaMobile} menu:static menu:flex menu:justify-center menu:gap-3 menu:border-0 menu:bg-transparent menu:p-0 lg:gap-7`}
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
                  Escuro com borda quase invisível nos dois estados (igual ao botão do Hero). */}
              <div className="hidden sm:block">
                <BotaoPreenche href={cta.href} tamanho="compacto" seta={false}>
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
                className={`inline-flex size-12 items-center justify-center rounded-botao transition-colors duration-150 menu:hidden ${hoverIcone}`}
              >
                {menuAberto ? <IconeFechar /> : <IconeMenu />}
              </button>
            </div>
          </div>
        </div>
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
