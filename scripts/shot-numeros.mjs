// Prints da seção de números: no meio da contagem e com tudo já assentado.
// Uso: node scripts/shot-numeros.mjs   (com o site em http://localhost:4173, via npx vite preview)
// Saída: reference/frentes-numeros-meio.png e reference/frentes-numeros-fim.png
import fs from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4173";
fs.mkdirSync("reference", { recursive: true });

const navegador = await chromium.launch({ args: ["--disable-gpu", "--disable-dev-shm-usage"] });
const pagina = await navegador.newPage({ viewport: { width: 1280, height: 800 } });
await pagina.goto(BASE, { waitUntil: "networkidle" });
await pagina.evaluate(() => document.fonts.ready);

const topo = await pagina.evaluate(
  `(() => { let el = document.querySelector("#numeros"), y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; })()`,
);
await pagina.evaluate((v) => window.scrollTo({ top: v - 60, behavior: "instant" }), topo);
await pagina.waitForTimeout(700); // meio da contagem
await pagina.screenshot({ path: "reference/frentes-numeros-meio.png", timeout: 90000 });
await pagina.waitForTimeout(5500); // mola assentou
await pagina.screenshot({ path: "reference/frentes-numeros-fim.png", timeout: 90000 });
await navegador.close();
console.log("prints salvos");
