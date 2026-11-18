import logoUrl from "../assets/logo-meta-sun.svg";
import logoNegativoUrl from "../assets/logo-meta-sun-negativo.svg";

// Logo da Meta Sun, SVG enviado pela Camila (src/assets/logo-meta-sun.svg), fundo transparente.
// Só a viewBox foi recortada (o arquivo original é um quadrado de 1080px com a logo no meio).
//
// `negativo`: para fundo escuro (Footer, Header sobre a foto). É uma cópia do mesmo SVG em que
// SÓ as letras (META e SUN) passam de preto para branco; o laranja e as formas são idênticos.
// PROVISÓRIO: quando chegar a versão negativa oficial, trocar o arquivo
// src/assets/logo-meta-sun-negativo.svg por ela.

type Props = {
  /** versão com letras brancas, para fundo grafite ou foto escura */
  negativo?: boolean;
  /** `className` define a altura (ex.: "h-14"). Sem ela, 48px. */
  className?: string;
};

export default function Logo({ negativo = false, className = "h-12" }: Props) {
  return (
    // 934×340 = proporção da viewBox recortada; a largura acompanha a altura
    <img
      src={negativo ? logoNegativoUrl : logoUrl}
      alt="Meta Sun"
      width={934}
      height={340}
      className={`w-auto ${className}`}
    />
  );
}
