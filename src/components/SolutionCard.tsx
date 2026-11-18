import type { ReactNode } from "react";
import { IconeAlerta, IconeSeta } from "./icons";

// Card de solução (BESS, Fotovoltaico, Mobilidade elétrica). Sem sombra: elevação é plana.
// Estados:
//  padrão       borda linha, fundo branco, linha laranja curta no topo
//  hover        sobe 3px, a linha laranja do topo cresce (250ms), seta anda 4px
//               (a borda só escurece um pouco: sem borda preta grossa)
//  foco         anel grafite 3px (global, em index.css)
//  ativo        fundo areia
//  desabilitado borda tracejada, fundo areia, texto "Em breve [confirmar]"
//  erro         borda erro + ícone de alerta + "Não carregou. Tentar de novo" (nunca só cor)
// Com movimento reduzido: sem transição e sem subir (motion-safe só liga o movimento
// para quem não pediu redução).

type Props = {
  icone: ReactNode;
  titulo: string;
  /** 1 frase que explica o termo */
  texto: string;
  /** texto do link, ex.: "Conhecer o BESS" */
  rotulo: string;
  href: string;
  desabilitado?: boolean;
  erro?: boolean;
  /** chamado pelo botão "Não carregou. Tentar de novo" */
  aoTentar?: () => void;
};

const caixa =
  "relative flex h-full flex-col overflow-hidden rounded-card text-left " +
  "transition-[transform,border-color,background-color] duration-[250ms] ease-[var(--ease)]";

// Borda fina (1px) no normal. Desabilitado e erro usam 2px para a borda aparecer
// (tracejado e cor de erro); o padding encolhe 1px para o card não mudar de tamanho.
const bordaFina = "border p-6";
const bordaGrossa = "border-2 p-[23px]";

export default function SolutionCard({
  icone,
  titulo,
  texto,
  rotulo,
  href,
  desabilitado = false,
  erro = false,
  aoTentar,
}: Props) {
  // Linha laranja do topo: curta no padrão, cresce até a largura toda no hover
  const linhaTopo = (
    <span
      aria-hidden="true"
      className={`absolute left-0 top-0 h-[3px] transition-[width] duration-[250ms] ease-[var(--ease)] ${
        desabilitado ? "w-10 bg-apoio-escuro" : erro ? "w-10 bg-erro" : "w-10 bg-sol group-hover:w-full"
      }`}
    />
  );

  const corpo = (
    <>
      {linhaTopo}
      {/* ícone de linha laranja: enfeite, o sentido está no título */}
      <span className={`block size-8 [&>svg]:size-full ${desabilitado ? "text-cinza-texto" : "text-sol"}`}>
        {icone}
      </span>
      <h3 className="t-h3 mt-4">{titulo}</h3>
      <p className="mt-2">{texto}</p>
    </>
  );

  if (desabilitado) {
    return (
      // link sem href = não navega; aria-disabled avisa o leitor de tela
      <a
        role="link"
        aria-disabled="true"
        className={`${caixa} ${bordaGrossa} cursor-not-allowed border-dashed border-apoio-escuro bg-areia`}
      >
        {corpo}
        <span className="mt-auto pt-6 font-semibold text-cinza-texto">Em breve [confirmar]</span>
      </a>
    );
  }

  if (erro) {
    return (
      <div className={`${caixa} ${bordaGrossa} border-erro bg-branco`}>
        {corpo}
        <button
          type="button"
          onClick={aoTentar}
          className="mt-6 inline-flex min-h-11 items-center gap-2 self-start rounded-campo font-semibold text-erro underline decoration-erro decoration-2 underline-offset-4 hover:decoration-4"
        >
          <IconeAlerta className="size-5 shrink-0" />
          Não carregou. Tentar de novo
        </button>
      </div>
    );
  }

  return (
    <a
      href={href}
      className={`${caixa} ${bordaFina} group border-linha bg-branco hover:border-apoio-escuro active:bg-areia motion-safe:hover:-translate-y-[3px]`}
    >
      {corpo}
      <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 font-semibold">
        <span className="underline decoration-sol decoration-2 underline-offset-4 transition-[text-decoration-thickness] duration-150 group-hover:decoration-4">
          {rotulo}
        </span>
        <IconeSeta className="size-5 shrink-0 transition-transform duration-[250ms] ease-[var(--ease)] motion-safe:group-hover:translate-x-1" />
      </span>
    </a>
  );
}
