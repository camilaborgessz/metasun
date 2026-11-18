import type { CSSProperties } from "react";

// Etapa numerada. Marcador de 48px com cantos 12 (raio de card).
// Estados do marcador:
//   concluida = Sol com texto grafite
//   atual     = grafite com texto Sol
//   a-fazer   = areia com texto cinza (com borda, para aparecer sobre fundo areia)
// Sem `estado`, usa o visual "atual" e NÃO diz nada ao leitor de tela
// (na Home as quatro etapas são só explicação, não um andamento).
//
// A linha laranja até a próxima etapa é um "trilho" cinza com um "preenchimento" laranja
// que cresce ao rolar (CSS em index.css). No celular a linha é vertical, à esquerda.

export type EstadoStep = "concluida" | "atual" | "a-fazer";

type Props = {
  numero: number;
  titulo: string;
  texto: string;
  estado?: EstadoStep;
  /** última etapa não tem linha para a próxima */
  ultimo?: boolean;
  /** posição na lista, só para escalonar o preenchimento das linhas */
  indice?: number;
};

const marcador: Record<EstadoStep, string> = {
  concluida: "border-sol bg-sol text-grafite",
  atual: "border-grafite bg-grafite text-sol",
  "a-fazer": "border-apoio-escuro bg-areia text-cinza-texto",
};

const falado: Record<EstadoStep, string> = {
  concluida: "Etapa concluída. ",
  atual: "Etapa atual. ",
  "a-fazer": "Etapa a fazer. ",
};

export default function Step({ numero, titulo, texto, estado, ultimo = false, indice = 0 }: Props) {
  return (
    <li className="relative flex gap-4 pb-10 last:pb-0 md:block md:pb-0">
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-card border-2 text-xl font-bold tabular-nums ${
          marcador[estado ?? "atual"]
        }`}
        aria-current={estado === "atual" ? "step" : undefined}
      >
        {numero}
      </span>

      {!ultimo && (
        <span
          aria-hidden="true"
          className="step-trilho absolute left-[23px] top-[60px] bottom-3 w-[2px] bg-apoio-escuro md:bottom-auto md:left-[60px] md:right-[-12px] md:top-[23px] md:h-[2px] md:w-auto"
        >
          <span
            className="step-preenchimento absolute inset-0 origin-top bg-sol md:origin-left"
            style={{ "--i": indice } as CSSProperties}
          />
        </span>
      )}

      <div className="md:mt-4">
        <h3 className="t-h3">
          {estado && <span className="sr-only">{falado[estado]}</span>}
          {titulo}
        </h3>
        <p className="mt-2">{texto}</p>
      </div>
    </li>
  );
}
