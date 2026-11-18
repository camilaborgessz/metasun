import { useEffect, type RefObject } from "react";

// Liga a LINHA DO TEMPO ao scroll (usada na seção BESS). Não usa React state: mexe direto no DOM
// com requestAnimationFrame (só `transform` e `opacity` mudam via CSS), então rolar a página não
// re-renderiza nada.
//
// O que ele faz, a cada rolagem:
//   1. calcula quanto da linha já foi "alcançada" e grava em --progresso (0 a 1) na linha de progresso;
//   2. grava em --fim a altura do trilho (do centro da 1ª bolinha ao centro da última);
//   3. marca data-ativo="true" em cada passo cuja bolinha a linha já alcançou.
// O CSS (.timeline-*, em index.css) usa essas marcas para pintar a linha, acender as bolinhas
// e mostrar os cards. Sem JS, ou com movimento reduzido, o CSS já mostra tudo no estado final.
//
// Marcas esperadas dentro do elemento `lista`:
//   [data-passo]   cada passo (o <li>)
//   [data-ponto]   a bolinha dentro de cada passo
//   [data-trilho]  o trilho vertical (a linha-base); a linha de progresso é filha dele
//
// Para ajustar: `ancora` é a altura da tela (0 a 1) em que a linha "está". 0.55 = um pouco abaixo
// do meio. Menor = os passos acendem mais cedo; maior = mais tarde.
export function useScrollProgress(lista: RefObject<HTMLElement | null>, ancora = 0.55) {
  useEffect(() => {
    const raiz = lista.current;
    if (!raiz) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // o CSS mostra tudo pronto

    const passos = Array.from(raiz.querySelectorAll<HTMLElement>("[data-passo]"));
    const pontos = passos.map((p) => p.querySelector<HTMLElement>("[data-ponto]"));
    const trilho = raiz.querySelector<HTMLElement>("[data-trilho]");
    let quadro = 0;

    const atualizar = () => {
      quadro = 0;
      const alvo = window.innerHeight * ancora; // altura (em px da tela) onde a linha "está"
      const topoLista = raiz.getBoundingClientRect().top;

      // centro de cada bolinha, medido a partir do topo da lista
      const centros = pontos.map((p) => {
        if (!p) return 0;
        const r = p.getBoundingClientRect();
        return r.top - topoLista + r.height / 2;
      });
      const primeiro = centros[0] ?? 0;
      const ultimo = centros[centros.length - 1] ?? 0;
      const trilhoAltura = Math.max(ultimo - primeiro, 1);

      if (trilho) {
        raiz.style.setProperty("--fim", `${trilhoAltura}px`);
        const preenchido = Math.min(Math.max(alvo - topoLista - primeiro, 0), trilhoAltura);
        raiz.style.setProperty("--progresso", String(preenchido / trilhoAltura));
      }

      passos.forEach((passo, i) => {
        const ativo = topoLista + centros[i] <= alvo;
        if ((passo.dataset.ativo === "true") !== ativo) passo.dataset.ativo = String(ativo);
      });
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };

    raiz.setAttribute("data-pronto", "true"); // a partir daqui o CSS pode esmaecer os passos ainda não alcançados
    atualizar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);

    return () => {
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      cancelAnimationFrame(quadro);
      raiz.removeAttribute("data-pronto");
    };
  }, [lista, ancora]);
}
