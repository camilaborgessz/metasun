import type { ReactNode } from "react";

// Botão primário com a animação do Uiverse (gharsh11032000/loud-chicken-53), adaptado à Meta Sun.
// Hover/foco: um círculo grafite cresce do centro e preenche o botão, o texto vira laranja,
// a seta sai pela direita e outra entra pela esquerda, e os cantos passam de pílula para 12px.
// Ativo: encolhe para 95%. Os estilos estão em index.css (.btn-animado).
// Com movimento reduzido o tokens.css desliga a transição: o estado final aparece direto.

const caminhoSeta =
  "M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z";

function Seta({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d={caminhoSeta} />
    </svg>
  );
}

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function BotaoAnimado({ href, children, className = "" }: Props) {
  return (
    <a href={href} className={`btn-animado ${className}`}>
      <Seta className="seta-2" />
      <span className="texto">{children}</span>
      <span aria-hidden="true" className="circulo" />
      <Seta className="seta-1" />
    </a>
  );
}
