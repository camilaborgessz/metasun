import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { IconeAlerta, IconeSeta } from "./icons";

// Botão da Meta Sun. Três variantes: primary | secondary | link.
// Com `href` vira <a>; sem `href` vira <button>.
// Estados: padrão, hover, foco (anel global em index.css), ativo, desabilitado, erro.

type Variante = "primary" | "secondary" | "link";

type Comum = {
  variant?: Variante;
  /** true quando o botão está sobre fundo grafite ou marinho */
  onDark?: boolean;
  /** seta que anda 3px no hover. Padrão: só no primário */
  seta?: boolean;
  /** estado de erro: troca o texto por ícone de alerta + "Não enviou. Tentar de novo" */
  erro?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

type ComoLink = Comum &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Comum> & { href: string };
type ComoBotao = Comum &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Comum> & { href?: undefined };

export type ButtonProps = ComoLink | ComoBotao;

const base =
  "group inline-flex items-center justify-center gap-2 text-base font-semibold leading-none " +
  "transition-[background-color,color,border-color,transform] duration-150";

// Formato do botão (primário e secundário têm 48px de altura)
const caixa = "min-h-12 px-6 rounded-botao";

function classesDaVariante(variant: Variante, onDark: boolean, disabled: boolean): string {
  if (disabled) {
    // desabilitado: fundo `desabilitado`, texto cinza
    return variant === "link"
      ? "min-h-11 text-cinza-texto cursor-not-allowed"
      : `${caixa} bg-desabilitado text-cinza-texto cursor-not-allowed`;
  }
  switch (variant) {
    case "primary":
      // Sol com texto grafite (branco sobre laranja só dá 2,1:1)
      return `${caixa} bg-sol text-grafite hover:bg-sol-hover active:bg-sol-ativo active:translate-y-px`;
    case "secondary":
      return onDark
        ? `${caixa} border-2 border-branco text-branco hover:bg-branco hover:text-grafite`
        : `${caixa} border-2 border-grafite text-grafite hover:bg-grafite hover:text-branco`;
    case "link":
      // texto grafite (branco no escuro), sublinhado laranja 2px → 4px no hover
      return (
        "min-h-11 underline decoration-sol decoration-2 underline-offset-4 hover:decoration-4 " +
        (onDark ? "text-branco" : "text-grafite")
      );
  }
}

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    onDark = false,
    seta = variant === "primary",
    erro = false,
    disabled = false,
    className = "",
    children,
    ...resto
  } = props;

  const classes = `${base} ${classesDaVariante(variant, onDark, disabled)} ${className}`;

  const conteudo = erro ? (
    <>
      <IconeAlerta className="size-5 shrink-0" />
      Não enviou. Tentar de novo
    </>
  ) : (
    <>
      {children}
      {seta && (
        <IconeSeta className="size-5 shrink-0 transition-transform duration-150 group-hover:translate-x-[3px]" />
      )}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...restoLink } = resto as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Comum>;
    // Link desabilitado: sai da ordem de tabulação e avisa o leitor de tela
    return (
      <a
        {...restoLink}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        className={classes}
      >
        {conteudo}
      </a>
    );
  }

  const restoBotao = resto as Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Comum>;
  return (
    <button type="button" {...restoBotao} disabled={disabled} className={classes}>
      {conteudo}
    </button>
  );
}
