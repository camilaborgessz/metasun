// Prints da seção "As 3 frentes": um no meio da animação das letras e outro com tudo já aparecido.
// Uso: npm run build && npx vite preview --port 4173   (outro terminal) e  node scripts/shot-frentes.mjs
// Saída: reference/frentes-animando.png, reference/frentes-pronto.png (ignorados pelo Git)
import fs from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4173";
fs.mkdirSync("reference", { recursive: true });

// args que gastam menos memória (útil em máquinas com pouca RAM livre)
const navegador = await chromium.launch({ args: ["--disable-gpu", "--disable-dev-shm-usage"] });
const pagina = await navegador.newPage({ viewport: { width: 1280, height: 800 } });
await pagina.goto(BASE, { waitUntil: "networkidle" });
await pagina.evaluate(() => document.fonts.ready);

const topo = await pagina.evaluate(`(() => { let el = document.querySelector("#solucoes"), y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; })()`);
await pagina.evaluate((v) => window.scrollTo({ top: v - 60, behavior: "instant" }), topo);
await pagina.waitForTimeout(350); // meio da animação
await pagina.screenshot({ path: "reference/frentes-animando.png", timeout: 90000 });
await pagina.waitForTimeout(2500); // tudo apareceu
await pagina.screenshot({ path: "reference/frentes-pronto.png", timeout: 90000 });

await navegador.close();
console.log("prints salvos em reference/frentes-*.png");
