// Gera versões WebP reduzidas de uma foto (para usar com srcset), sem instalar nada além do Playwright.
// Uso:  node scripts/otimizar-foto.mjs <foto.jpg> <public/images/nome> [larguras]
// Ex.:  node scripts/otimizar-foto.mjs ~/foto.jpg public/images/etapa-1 480,960,1280
// Saída: public/images/etapa-1-480.webp, etapa-1-960.webp, etapa-1-1280.webp
// Usa o canvas do Chromium do Playwright para redimensionar e codificar em WebP (qualidade 0,8).
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const [, , entrada, saidaBase, listaLarguras = "480,960,1280"] = process.argv;
if (!entrada || !saidaBase) {
  console.error("Uso: node scripts/otimizar-foto.mjs <foto.jpg> <saida-base> [larguras]");
  process.exit(1);
}
const larguras = listaLarguras.split(",").map(Number);
const tipo = /\.png$/i.test(entrada) ? "image/png" : "image/jpeg";

const navegador = await chromium.launch();
const pagina = await navegador.newPage();

// Serve a foto numa origem http falsa: assim o canvas não fica "contaminado" (como ficaria com file://)
await pagina.route("http://foto.local/**", (rota) => {
  const { pathname } = new URL(rota.request().url());
  if (pathname === "/") return rota.fulfill({ contentType: "text/html", body: "<!doctype html><body></body>" });
  if (pathname === "/foto") return rota.fulfill({ contentType: tipo, body: fs.readFileSync(entrada) });
  return rota.abort();
});
await pagina.goto("http://foto.local/");

const resultado = await pagina.evaluate(async (ls) => {
  const img = new Image();
  img.src = "/foto";
  await img.decode();
  const saida = {};
  for (const w of ls) {
    const h = Math.round((img.naturalHeight * w) / img.naturalWidth);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);
    saida[w] = { h, dados: canvas.toDataURL("image/webp", 0.8) };
  }
  return { largura: img.naturalWidth, altura: img.naturalHeight, saida };
}, larguras);

fs.mkdirSync(path.dirname(saidaBase), { recursive: true });
console.log(`${path.basename(entrada)}: original ${resultado.largura}x${resultado.altura}`);
for (const w of larguras) {
  const { h, dados } = resultado.saida[w];
  const arquivo = `${saidaBase}-${w}.webp`;
  fs.writeFileSync(arquivo, Buffer.from(dados.split(",")[1], "base64"));
  console.log(`  ${arquivo}  ${w}x${h}  ${Math.round(fs.statSync(arquivo).size / 1024)} KB`);
}
await navegador.close();
