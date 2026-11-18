import { useEffect, useRef, useState } from "react";
import { ehPlaceholder } from "../content/placeholders";
import { ChipProvisorio } from "./Chip";

// Número grande com label e fonte.
// - valor number  → conta de 0 até o valor em 1600ms, uma vez, ao entrar na tela
// - valor string  → mostra como está (ex.: o placeholder "[00]"), sem contagem
// O valor final já está no HTML; a animação só melhora (e é pulada com movimento reduzido).

type Props = {
  /** número real (anima) ou texto/placeholder, ex.: "[00]" */
  valor: number | string;
  /** label de 1 linha */
  rotulo: string;
  /** fonte do dado, mostrada embaixo (opcional) */
  fonte?: string;
  prefixo?: string;
  sufixo?: string;
  decimais?: number;
  /** true sobre fundo grafite/marinho: muda as cores do rótulo e da fonte (o número é sempre Sol) */
  onDark?: boolean;
  /** estado "dado em validação": mostra "—" e uma frase no lugar da fonte */
  emValidacao?: boolean;
};

const DURACAO_MS = 1600; // = --t-count em tokens.css

function formatar(n: number, decimais: number, prefixo: string, sufixo: string): string {
  const texto = n.toLocaleString("pt-BR", {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  });
  return `${prefixo}${texto}${sufixo}`;
}

export default function StatNumber({
  valor,
  rotulo,
  fonte = "",
  prefixo = "",
  sufixo = "",
  decimais = 0,
  onDark = false,
  emValidacao = false,
}: Props) {
  const raiz = useRef<HTMLDivElement>(null);
  // null = mostrar o valor final (é o que vai no HTML). Só vira texto durante a contagem.
  const [contagem, setContagem] = useState<string | null>(null);

  const final =
    emValidacao ? "—" : typeof valor === "number" ? formatar(valor, decimais, prefixo, sufixo) : valor;

  useEffect(() => {
    if (emValidacao || typeof valor !== "number") return;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elemento = raiz.current;
    if (reduzido || !elemento || !("IntersectionObserver" in window)) return;

    let quadro = 0;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect(); // uma vez só

        const inicio = performance.now();
        const passo = (agora: number) => {
          // o horário do quadro pode vir um pouco antes de `inicio`: trava entre 0 e 1 (sem "-0")
          const t = Math.min(Math.max((agora - inicio) / DURACAO_MS, 0), 1);
          const suave = 1 - Math.pow(1 - t, 3); // começa rápido, termina devagar
          if (t < 1) {
            setContagem(formatar(valor * suave, decimais, prefixo, sufixo));
            quadro = requestAnimationFrame(passo);
          } else {
            setContagem(null); // terminou: volta ao valor final exato
          }
        };
        quadro = requestAnimationFrame(passo);
      },
      { threshold: 0.4 },
    );
    observador.observe(elemento);

    return () => {
      observador.disconnect();
      cancelAnimationFrame(quadro);
    };
  }, [valor, decimais, prefixo, sufixo, emValidacao]);

  // Número sempre em Laranja Sol (pedido da Meta Sun). Sobre claro isso dá só ~2,1:1 de contraste;
  // a regra 3 do CLAUDE.md pede sol-texto (#A65800) nesse caso. Para voltar: trocar por
  // onDark ? "text-sol" : "text-sol-texto".
  const corNumero = "text-sol";
  const corLabel = onDark ? "text-branco" : "text-grafite";
  const corApoio = onDark ? "text-apoio-escuro" : "text-cinza-texto";

  // chip "provisório" quando qualquer parte visível ainda é placeholder
  const provisorio = [typeof valor === "string" ? valor : "", rotulo, fonte].some(
    (texto) => texto && ehPlaceholder(texto),
  );

  return (
    <div ref={raiz}>
      {/* Leitor de tela lê só o valor final, nunca os números passando */}
      <p className={`t-number ${corNumero}`}>
        <span aria-hidden="true">{contagem ?? final}</span>
        <span className="sr-only">{final}</span>
      </p>

      <p className={`mt-3 font-semibold ${corLabel}`}>{rotulo}</p>
      {(emValidacao || fonte) && (
        <p className={`mt-1 text-sm ${corApoio}`}>{emValidacao ? "Dado em validação." : fonte}</p>
      )}

      {provisorio && <ChipProvisorio onDark={onDark} className="mt-3" />}
    </div>
  );
}
