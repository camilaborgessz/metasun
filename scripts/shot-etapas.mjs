// Tira um print de cada etapa do "Como funciona" (viewport 1150x722, card em y=287).
// Uso: npm run build && npx vite preview --port 4173   (outro terminal) e  node scripts/shot-etapas.mjs
// Saída: reference/etapa-1.png ... etapa-4.png (ignorados pelo Git, assim como meu-*.png)
import fs from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4173";
fs.mkdirSync("reference", { recursive: true });

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1150, height: 722 } });
await pagina.goto(BASE, { waitUntil: "networkidle" });
await pagina.evaluate(() => document.fonts.ready);

// posição absoluta sem contar transform (a animação de entrada desloca o slide 24px)
const absoluto = `(el) => { let y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; }`;

for (let n = 1; n <= 4; n++) {
  const topo = await pagina.evaluate(`(${absoluto})(document.querySelector("#step-${n}"))`);
  await pagina.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), topo + 56 - 140);
  await pagina.waitForTimeout(1500); // entrada (0,6s) + carregamento da foto lazy
  await pagina.screenshot({ path: `reference/etapa-${n}.png` });
}
await navegador.close();
console.log("prints salvos em reference/etapa-1..4.png");
