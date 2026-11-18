import type { ReactNode } from "react";
import { IconeSeta } from "./icons";

// Botão com preenchimento no hover (Uiverse, xueyuantan), adaptado à Meta Sun. Estilos em index.css
// (.btn-varredura). Em repouso: miolo branco (padrão) ou grafite, borda discreta, sem laranja.
// No hover/foco um degradê laranja varre o botão da esquerda para a direita. Sem movimento
// automático (só no hover). Movimento reduzido: o tokens.css desliga a transição e o estado final
// aparece direto.

type Props = {
  href: string;
  children: ReactNode;
  /** cor do miolo em repouso: branco (para fundo escuro) ou grafite (para fundo claro) */
  face?: "branco" | "grafite";
  /** compacto = 48px (Header); normal = 58px (Hero) */
  tamanho?: "normal" | "compacto";
  /** seta no fim do texto (anda 3px no hover) */
  seta?: boolean;
  className?: string;
};

export default function BotaoPreenche({
  href,
  children,
  face = "branco",
  tamanho = "normal",
  seta = true,
  className = "",
}: Props) {
  return (
    <a href={href} data-face={face} data-tamanho={tamanho} className={`btn-varredura group ${className}`}>
      {children}
      {seta && (
        <IconeSeta className="size-5 shrink-0 transition-transform duration-150 group-hover:translate-x-[3px]" />
      )}
    </a>
  );
}
