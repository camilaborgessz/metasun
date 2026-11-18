import { useEffect, useRef, useState } from "react";
import { ehPlaceholder } from "../content/placeholders";
import AuroraText from "./AuroraText";
import { ChipProvisorio } from "./Chip";

// Número grande com label e fonte.
// - valor number  → conta de 0 até o valor com efeito de MOLA (como o NumberTicker do Magic UI, mesmos
//                   valores de rigidez e amortecimento): sobe rápido e assenta devagar. Uma vez, ao entrar
//                   na tela. Termina em até ~4,5s para 1.300 (valores menores terminam antes).
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
  /** rótulo com o efeito Aurora (degradê animado nas letras, cores da marca). Só para fundo claro */
  aurora?: boolean;
};

// Mola do NumberTicker (Magic UI): damping 60, stiffness 100 (massa 1)
const RIGIDEZ = 100;
const AMORTECIMENTO = 60;

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
  aurora = false,
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

        // Mola amortecida puxando o número de 0 até `valor` (posição x, velocidade v)
        let x = 0;
        let v = 0;
        let ultimo = performance.now();
        const tolerancia = 0.5 / 10 ** decimais; // meio dígito: a partir daqui o número não muda mais
        const passo = (agora: number) => {
          const dt = Math.min(Math.max((agora - ultimo) / 1000, 0), 0.05); // trava no máx. 50ms
          ultimo = agora;
          const subpassos = Math.max(1, Math.ceil(dt * 240)); // integração estável (passos de ~4ms)
          const h = dt / subpassos;
          for (let i = 0; i < subpassos; i++) {
            v += (-RIGIDEZ * (x - valor) - AMORTECIMENTO * v) * h;
            x += v * h;
          }
          if (Math.abs(x - valor) < tolerancia && Math.abs(v) < tolerancia * 4) {
            setContagem(null); // assentou: volta ao valor final exato
            return;
          }
          setContagem(formatar(Math.max(0, x), decimais, prefixo, sufixo));
          quadro = requestAnimationFrame(passo);
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

      <p className={`mt-3 font-semibold ${corLabel}`}>{aurora ? <AuroraText>{rotulo}</AuroraText> : rotulo}</p>
      {(emValidacao || fonte) && (
        <p className={`mt-1 text-sm ${corApoio}`}>{emValidacao ? "Dado em validação." : fonte}</p>
      )}

      {provisorio && <ChipProvisorio onDark={onDark} className="mt-3" />}
    </div>
  );
}
