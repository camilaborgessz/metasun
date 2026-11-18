import { useEffect, type RefObject } from "react";

// Esconde o elemento (data-oculto) se ele ainda está abaixo da dobra e tira a marca quando ele
// entra na tela: o CSS (.revelar-*, em index.css) faz o resto. Roda uma vez por elemento.
// O conteúdo final já está no HTML: sem JS, ou com movimento reduzido, nada é escondido.
export function useEntrada(ref: RefObject<HTMLElement | null>, limiar = 0.3) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return; // já na tela: não esconde

    el.dataset.oculto = "true";
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        el.removeAttribute("data-oculto");
        observador.disconnect();
      },
      { threshold: limiar },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, [ref, limiar]);
}
