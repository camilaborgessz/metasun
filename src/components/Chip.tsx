import { ehPlaceholder } from "../content/placeholders";

// Chip "provisório": marca todo dado visível que ainda é placeholder.

type ChipProps = {
  /** true quando está sobre fundo grafite ou marinho */
  onDark?: boolean;
  className?: string;
  /** texto do chip. Padrão: "provisório" */
  texto?: string;
};

export function ChipProvisorio({ onDark = false, className = "", texto = "provisório" }: ChipProps) {
  const cor = onDark
    ? "border-sol text-sol"
    : "border-sol-texto bg-provisorio-fundo text-grafite";
  return (
    <span
      className={`t-label inline-flex items-center rounded-campo border px-2 py-0.5 normal-case tracking-wide ${cor} ${className}`}
    >
      {texto}
    </span>
  );
}

// Mostra um dado + chip. O chip some sozinho quando o valor deixa de ser "[...]".
type DadoProps = { valor: string; onDark?: boolean };

export function Dado({ valor, onDark = false }: DadoProps) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      <span>{valor}</span>
      {ehPlaceholder(valor) && <ChipProvisorio onDark={onDark} />}
    </span>
  );
}
