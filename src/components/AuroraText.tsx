import type { ReactNode } from "react";

// Texto com degradê animado nas letras (efeito "Aurora Text", Magic UI), sem dependências.
// As cores padrão são da Meta Sun e ficam todas escuras o bastante para o texto passar de 4,5:1
// sobre o areia: sol-texto (#A65800, o laranja para texto sobre claro) e tons de grafite/marrom.
// O Laranja Sol puro (#F7A21B) NÃO serve aqui: sobre areia dá só 2,1:1.
// Movimento: o degradê dá UMA volta de 5s e para (regra 7 do CLAUDE.md: movimento acima de 5s
// precisa de botão de pausa); com movimento reduzido fica parado. Estilo em index.css (.aurora-texto).
// Se o navegador não suporta texto com degradê, aparece em sol-texto liso.

const CORES_PADRAO = ["#A65800", "#1C1C1C", "#8F4B00", "#A65800"];

type Props = {
  children: ReactNode;
  className?: string;
  /** cores do degradê (a primeira se repete no fim para o laço ser contínuo) */
  colors?: string[];
  /** 1 = volta de 5s; 2 = 2,5s */
  velocidade?: number;
};

export default function AuroraText({ children, className = "", colors = CORES_PADRAO, velocidade = 1 }: Props) {
  const gradiente = `linear-gradient(135deg, ${colors.join(", ")}, ${colors[0]})`;
  return (
    <span className={`relative inline-block ${className}`}>
      {/* o leitor de tela lê o texto normal; o texto com degradê é só visual */}
      <span className="sr-only">{children}</span>
      <span
        aria-hidden="true"
        className="aurora-texto"
        style={{ backgroundImage: gradiente, animationDuration: `${5 / velocidade}s` }}
      >
        {children}
      </span>
    </span>
  );
}
