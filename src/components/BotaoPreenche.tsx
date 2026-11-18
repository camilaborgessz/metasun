import type { ReactNode } from "react";
import { IconeSeta } from "./icons";

// Botão com preenchimento no hover (Uiverse, xueyuantan), adaptado à Meta Sun. Estilos em index.css
// (.btn-varredura). Em repouso: miolo grafite, texto branco e borda cinza-escura quase invisível
// (sem laranja). No hover/foco um degradê laranja varre o botão da esquerda para a direita e o
// texto vira grafite. Sem movimento automático (só no hover).
// Movimento reduzido: o tokens.css desliga a transição e o estado final aparece direto.

type Props = {
  href: string;
  children: ReactNode;
  /** compacto = 48px (Header); normal = 58px (Hero) */
  tamanho?: "normal" | "compacto";
  /** seta no fim do texto (anda 3px no hover) */
  seta?: boolean;
  className?: string;
};

export default function BotaoPreenche({ href, children, tamanho = "normal", seta = true, className = "" }: Props) {
  return (
    <a href={href} data-tamanho={tamanho} className={`btn-varredura group ${className}`}>
      {children}
      {seta && (
        <IconeSeta className="size-5 shrink-0 transition-transform duration-150 group-hover:translate-x-[3px]" />
      )}
    </a>
  );
}
