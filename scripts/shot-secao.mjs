// Print de uma seção qualquer da Home.
// Uso: node scripts/shot-secao.mjs <seletor> <arquivo.png> [largura] [altura] [deslocamento]
// Ex.:  node scripts/shot-secao.mjs "#numeros" numeros.png        (salva em reference/numeros.png)
//       node scripts/shot-secao.mjs "#inicio" hero.png 1408 718 0
// Requer o site rodando (npx vite preview --port 4173). Saída ignorada pelo Git? Só reference/meu-*, etapa-*,
// frentes-*: use esses prefixos se não quiser versionar.
import fs from "node:fs";
import { chromium } from "playwright";

const [, , seletor, arquivo, largura = "1280", altura = "800", deslocamento = "60"] = process.argv;
if (!seletor || !arquivo) {
  console.error("Uso: node scripts/shot-secao.mjs <seletor> <arquivo.png> [largura] [altura] [deslocamento]");
  process.exit(1);
}
const BASE = process.env.BASE_URL ?? "http://localhost:4173";
fs.mkdirSync("reference", { recursive: true });

// args que gastam menos memória (útil em máquinas com pouca RAM livre)
const navegador = await chromium.launch({ args: ["--disable-gpu", "--disable-dev-shm-usage"] });
const pagina = await navegador.newPage({ viewport: { width: Number(largura), height: Number(altura) } });
await pagina.goto(BASE, { waitUntil: "networkidle" });
await pagina.evaluate(() => document.fonts.ready);

const topo = await pagina.evaluate(
  `(() => { let el = document.querySelector(${JSON.stringify(seletor)}), y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; })()`,
);
await pagina.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), Math.max(0, topo - Number(deslocamento)));
await pagina.waitForTimeout(2600); // entrada, contagem dos números e carregamento das fotos
await pagina.screenshot({ path: `reference/${arquivo}`, timeout: 90000 });
await navegador.close();
console.log("print salvo em reference/" + arquivo);
