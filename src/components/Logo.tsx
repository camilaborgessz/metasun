import logoUrl from "../assets/logo-meta-sun.png";

// Logo da Meta Sun: PNG original (só com as margens brancas recortadas), sem alterar cores.
// Fica assim até chegarem o SVG oficial e a versão negativa (para fundo escuro).
// Regras: usar só em fundo branco, areia ou grafite. O PNG tem fundo branco e letras pretas:
// sobre fundo escuro ele aparece como uma placa branca (cantos arredondados).
// Reserva fora da produção: docs/reserva/logo-meta-sun-vetorizado.svg (traçado automático, não usar).

type Props = {
  /** `className` define a altura (ex.: "h-14"). Sem ela, 48px. */
  className?: string;
};

export default function Logo({ className = "h-12" }: Props) {
  return (
    // 958×365 = proporção do arquivo; a largura acompanha a altura
    <img
      src={logoUrl}
      alt="Meta Sun"
      width={958}
      height={365}
      className={`w-auto rounded-botao ${className}`}
    />
  );
}
