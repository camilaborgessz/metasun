import logoUrl from "../assets/logo-meta-sun.svg";

// Logo da Meta Sun: SVG enviado pela Camila (src/assets/logo-meta-sun.svg), fundo transparente.
// Só a viewBox foi recortada (o arquivo original é um quadrado de 1080px com a logo no meio);
// as formas e as cores não foram alteradas.
// Regras: usar só em fundo branco, areia ou grafite. As letras são pretas e somem no grafite:
// sobre fundo escuro (Footer, Header sobre a foto) o logo vai numa placa branca, até chegar
// a versão negativa.

type Props = {
  /** `className` define a altura (ex.: "h-14"). Sem ela, 48px. */
  className?: string;
};

export default function Logo({ className = "h-12" }: Props) {
  return (
    // 934×340 = proporção da viewBox recortada; a largura acompanha a altura
    <img src={logoUrl} alt="Meta Sun" width={934} height={340} className={`w-auto ${className}`} />
  );
}
