import { useRef, type CSSProperties, type ElementType } from "react";
import { useEntrada } from "../hooks/useEntrada";

// Texto cujas letras aparecem uma a uma (fade + sobe um pouco) quando ele entra na tela.
// A animação dura ~0,9s no total, qualquer que seja o tamanho do texto (textos longos aparecem mais
// rápido por letra). O estilo está em index.css (.revelar-letra).
// Acessibilidade: o leitor de tela lê o texto inteiro (sr-only); as letras separadas são aria-hidden.

type Props = {
  texto: string;
  /** tag HTML do texto */
  as?: ElementType;
  id?: string;
  className?: string;
};

export default function TextoRevelando({ texto, as: Tag = "p", id, className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEntrada(ref, 0.5);

  const palavras = texto.split(" ").map((p) => [...p]);
  const total = palavras.reduce((soma, p) => soma + p.length, 0);
  const passo = Math.min(45, Math.max(8, 900 / total)); // ms entre uma letra e a próxima
  // índice da primeira letra de cada palavra (para o atraso de cada letra)
  const inicios = palavras.reduce<number[]>((lista, _palavra, i) => {
    lista.push(i === 0 ? 0 : lista[i - 1] + palavras[i - 1].length);
    return lista;
  }, []);

  return (
    <Tag ref={ref} id={id} data-revelar-texto className={className}>
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true">
        {palavras.map((letras, p) => (
          <span key={p}>
            {/* a palavra não quebra no meio; o espaço entre palavras fica fora para a linha poder quebrar */}
            <span className="inline-block whitespace-nowrap">
              {letras.map((letra, i) => (
                <span
                  key={i}
                  className="revelar-letra"
                  style={{ "--d": `${Math.round((inicios[p] + i) * passo)}ms` } as CSSProperties}
                >
                  {letra}
                </span>
              ))}
            </span>
            {p < palavras.length - 1 && " "}
          </span>
        ))}
      </span>
    </Tag>
  );
}
