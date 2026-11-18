import { useEffect, useRef, useState } from "react";

// Texto com linhas onduladas animadas dentro das letras (efeito "Canvas Text", Aceternity UI),
// reescrito sem dependências (sem clsx/tailwind-merge) e com as regras da Meta Sun:
// - Movimento: anima UM ciclo (padrão 5s) e para, no mesmo desenho do início. Passar o mouse
//   repete. Isso respeita a regra 7 do CLAUDE.md (movimento acima de 5s precisa de botão de
//   pausa). Para animar sem parar use cycles={Infinity}, mas aí é preciso criar o botão de pausa.
// - Movimento reduzido: desenha um quadro parado, sem animar.
// - O texto real aparece desde o início; o canvas só entra por cima quando está pronto.

type Props = {
  text: string;
  /** classes do texto (ex.: "text-sol"): a cor aqui vale até o canvas ficar pronto */
  className?: string;
  /** cor base das letras (o canvas não lê classes) */
  baseColor?: string;
  /** cores das linhas, repetidas em sequência */
  colors?: string[];
  /** duração de um ciclo da onda, em segundos */
  animationDuration?: number;
  /** quantos ciclos animar. Infinity = sem parar */
  cycles?: number;
  lineWidth?: number;
  lineGap?: number;
  curveIntensity?: number;
};

const CORES_PADRAO = ["#FFD08A", "#F7A21B", "#E8910B", "#FFB84D", "#F7A21B", "#D17F00", "#FFC266"];

export default function CanvasText({
  text,
  className = "",
  baseColor = "#F7A21B",
  colors = CORES_PADRAO,
  animationDuration = 5,
  cycles = 1,
  lineWidth = 2,
  lineGap = 5,
  curveIntensity = 40,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textoRef = useRef<HTMLSpanElement>(null);
  const rodando = useRef(false);
  const [medidas, setMedidas] = useState({ largura: 0, altura: 0, fonte: "", espacamento: "0px" });
  const [pronto, setPronto] = useState(false);
  const [rodada, setRodada] = useState(0);
  const chaveCores = colors.join("|");

  // Mede o texto (e mede de novo se a fonte carregar depois ou a tela mudar de tamanho)
  useEffect(() => {
    const el = textoRef.current;
    if (!el) return;
    const medir = () => {
      const caixa = el.getBoundingClientRect();
      const css = window.getComputedStyle(el);
      setMedidas({
        largura: Math.ceil(caixa.width),
        altura: Math.ceil(caixa.height),
        fonte: `${css.fontWeight} ${css.fontSize} ${css.fontFamily}`,
        espacamento: css.letterSpacing === "normal" ? "0px" : css.letterSpacing,
      });
    };
    const observador = new ResizeObserver(medir); // dispara logo ao observar
    observador.observe(el);
    return () => observador.disconnect();
  }, [text, className]);

  // Desenha (e anima por `cycles` ciclos)
  useEffect(() => {
    const canvas = canvasRef.current;
    const { largura, altura, fonte, espacamento } = medidas;
    if (!canvas || largura === 0 || !fonte) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = largura * dpr;
    canvas.height = altura * dpr;
    ctx.font = fonte;
    // o CSS aplica letter-spacing no texto; o canvas precisa do mesmo valor para não cortar a ponta
    if ("letterSpacing" in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = espacamento;
    const m = ctx.measureText(text);
    const baseY = (altura + m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
    const cores = chaveCores.split("|");
    const nLinhas = Math.floor(altura / lineGap) + 10;

    const desenhar = (fase: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, largura, altura);
      // 1) letras, 2) pinta as letras com a cor base, 3) linhas só por dentro das letras
      ctx.globalCompositeOperation = "source-over";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#000";
      ctx.fillText(text, 0, baseY);
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, largura, altura);
      ctx.globalCompositeOperation = "source-atop";
      const curva1 = Math.sin(fase) * curveIntensity;
      const curva2 = Math.sin(fase + 0.5) * curveIntensity * 0.6;
      for (let i = 0; i < nLinhas; i++) {
        const y = i * lineGap;
        ctx.strokeStyle = cores[i % cores.length];
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(largura * 0.33, y + curva1, largura * 0.66, y + curva2, largura, y);
        ctx.stroke();
      }
    };

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = animationDuration * cycles * 1000;
    const inicio = performance.now();
    let quadro = 0;
    rodando.current = !reduzido;

    const passo = (agora: number) => {
      const decorrido = reduzido ? 0 : Math.min(agora - inicio, total);
      desenhar((decorrido / 1000 / animationDuration) * Math.PI * 2);
      setPronto(true);
      if (!reduzido && decorrido < total) quadro = requestAnimationFrame(passo);
      else rodando.current = false;
    };
    quadro = requestAnimationFrame(passo);

    return () => {
      cancelAnimationFrame(quadro);
      rodando.current = false;
    };
  }, [text, medidas, chaveCores, baseColor, animationDuration, cycles, lineWidth, lineGap, curveIntensity, rodada]);

  // Passar o mouse repete a animação (se não estiver rodando)
  const repetir = () => {
    if (!rodando.current) setRodada((r) => r + 1);
  };

  return (
    <span className={`relative inline-block ${className}`} onMouseEnter={repetir}>
      {/* texto real: visível até o canvas ficar pronto; depois só ocupa o espaço */}
      <span ref={textoRef} aria-hidden="true" className={pronto ? "invisible inline-block" : "inline-block"}>
        {text}
      </span>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={text}
        className="pointer-events-none absolute left-0 top-0"
        style={{ width: medidas.largura || "auto", height: medidas.altura || "auto" }}
      />
    </span>
  );
}
