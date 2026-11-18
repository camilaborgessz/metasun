// Confere a Home em vários tamanhos e tipos de tela: rolagem horizontal, elementos que passam da
// largura da tela e um print do topo (Hero) de cada tamanho.
// Uso: npm run build && npx vite preview --port 4173   (outro terminal) e  node scripts/verificar-telas.mjs
// Saída: reference/telas-<largura>x<altura>.png (ignorados pelo Git) e um resumo no terminal.
import fs from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4173";
fs.mkdirSync("reference", { recursive: true });

// celulares pequenos e grandes, celular deitado, tablets em pé e deitado, notebook, desktop e ultrawide
const TELAS = [
  [320, 568], [360, 640], [390, 844], [430, 932], [844, 390],
  [768, 1024], [1024, 768], [1280, 720], [1440, 900], [1920, 1080], [2560, 1440],
];

const navegador = await chromium.launch({ args: ["--disable-gpu", "--disable-dev-shm-usage"] });
let problemas = 0;

for (const [largura, altura] of TELAS) {
  const pagina = await navegador.newPage({ viewport: { width: largura, height: altura } });
  await pagina.goto(BASE, { waitUntil: "networkidle" });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(900);

  const r = await pagina.evaluate(() => {
    const larguraTela = window.innerWidth;
    const rolagemHorizontal = document.documentElement.scrollWidth - larguraTela;
    // elementos visíveis que passam da largura da tela e não estão dentro de um contêiner que corta/rola
    const passam = [];
    const corta = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const o = getComputedStyle(p);
        if (["hidden", "auto", "scroll", "clip"].includes(o.overflowX)) return true;
      }
      return false;
    };
    document.querySelectorAll("body *").forEach((el) => {
      const s = getComputedStyle(el);
      if (s.position === "fixed" || s.display === "none" || s.visibility === "hidden") return;
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.right <= larguraTela + 1 || corta(el)) return;
      passam.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""} (+${Math.round(b.right - larguraTela)}px)`);
    });
    const hero = document.querySelector("#inicio");
    return { rolagemHorizontal, passam: passam.slice(0, 4), alturaHero: Math.round(hero.getBoundingClientRect().height), alturaTela: window.innerHeight };
  });

  const ok = r.rolagemHorizontal <= 0 && r.passam.length === 0;
  if (!ok) problemas++;
  console.log(
    `${String(largura).padStart(4)}x${String(altura).padEnd(4)} ${ok ? "OK " : "ERRO"}  hero ${r.alturaHero}px (tela ${r.alturaTela}px)` +
      (r.rolagemHorizontal > 0 ? `  rolagem horizontal +${r.rolagemHorizontal}px` : "") +
      (r.passam.length ? `  passam da tela: ${r.passam.join(", ")}` : ""),
  );
  await pagina.screenshot({ path: `reference/telas-${largura}x${altura}.png`, timeout: 90000 });
  await pagina.close();
}
await navegador.close();
console.log(problemas ? `\n${problemas} tamanho(s) com problema.` : "\nTodos os tamanhos sem rolagem horizontal.");
