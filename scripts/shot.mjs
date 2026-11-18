// Tira prints da seção "Como funciona" (e do Hero) para comparar com a referência.
// Uso:  npm run build && npx vite preview --port 4173   (em outro terminal)
//       node scripts/shot.mjs            (BASE_URL=http://localhost:5173 para usar o `npm run dev`)
// Saída: reference/meu-1.png (etapa 01), meu-2.png (etapa 02), meu-3.png (etapa 04), meu-hero.png
import fs from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4173";
const PASTA = "reference";
fs.mkdirSync(PASTA, { recursive: true });

const navegador = await chromium.launch();

async function abrir(largura, altura) {
  const pagina = await navegador.newPage({ viewport: { width: largura, height: altura } });
  await pagina.goto(BASE, { waitUntil: "networkidle" });
  await pagina.evaluate(() => document.fonts.ready);
  return pagina;
}

// Rola (sem animação) e espera a entrada dos slides (0,6s) e o parallax assentarem
async function rolarPara(pagina, y) {
  await pagina.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
  await pagina.waitForTimeout(1200);
}

// --- Como funciona: viewport 1150x722, como nos prints de referência ---
const pagina = await abrir(1150, 722);
// Posição absoluta SEM contar transform (os slides nascem 24px deslocados pela animação de entrada)
const absoluto = `(el) => { let y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; }`;
const topoSecao = await pagina.evaluate(`(${absoluto})(document.querySelector("#como-funciona"))`);
const topoSlide = (n) => pagina.evaluate(`(${absoluto})(document.querySelector("#step-${n}"))`);

// 1) etapa 01: a seção começa ~20px abaixo do topo da tela
await rolarPara(pagina, topoSecao - 20);
await pagina.screenshot({ path: `${PASTA}/meu-1.png` });

// 2) e 3) etapas 02 e 04: o topo do card (slide + 56px de padding) fica em y=287
for (const [arquivo, n] of [["meu-2.png", 2], ["meu-3.png", 4]]) {
  await rolarPara(pagina, (await topoSlide(n)) + 56 - 287);
  await pagina.screenshot({ path: `${PASTA}/${arquivo}` });
}

// Medidas úteis para a comparação (em px, na viewport atual)
const medidas = await pagina.evaluate(() => {
  const r = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
  };
  const slide = document.querySelector("#step-1");
  const card = slide?.firstElementChild;
  return {
    nav: r(document.querySelector('nav[aria-label="Etapas"]')),
    itemNav: r(document.querySelector('nav[aria-label="Etapas"] a')),
    card: r(card),
    foto: r(card?.children[0]),
    conteudo: r(card?.children[1]),
    titulo: r(document.querySelector("#titulo-como-funciona")),
  };
});
console.log("medidas (viewport 1150x722, rolagem da etapa 04):", JSON.stringify(medidas));
await pagina.close();

// --- Hero: viewport 1408x718, como na inspiração ---
const hero = await abrir(1408, 718);
await hero.waitForTimeout(1500);
await hero.screenshot({ path: `${PASTA}/meu-hero.png` });
await hero.close();

// --- Celular (390x844): Hero e menu aberto ---
const celular = await abrir(390, 844);
await celular.waitForTimeout(1500);
await celular.screenshot({ path: `${PASTA}/meu-hero-celular.png` });
await celular.click('button[aria-label="Abrir menu"]');
await celular.waitForTimeout(400);
await celular.screenshot({ path: `${PASTA}/meu-menu-celular.png` });
await celular.close();

await navegador.close();
console.log("prints salvos em", PASTA);
