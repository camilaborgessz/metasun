import { useState } from "react";
import BessDiagram from "../components/BessDiagram";
import Button from "../components/Button";
import { ChipProvisorio } from "../components/Chip";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { IconeBess, IconeFotovoltaico, IconeMobilidade } from "../components/icons";
import Logo from "../components/Logo";
import SolutionCard from "../components/SolutionCard";
import StatNumber from "../components/StatNumber";
import Step from "../components/Step";

// PÁGINA DE DESENVOLVIMENTO (rota /dev). Só existe com `npm run dev`:
// o App.tsx não inclui esta página no build de produção.
// Os números abaixo são FICTÍCIOS, só para testar a contagem. Nunca copiar para a Home.
export default function Dev() {
  // Demonstra o botão "Tentar de novo" do SolutionCard em erro
  const [tentativas, setTentativas] = useState(0);

  return (
    <>
      <Header />

      <main>
        <section className="py-[var(--section-y)]">
          <div className="container-meta">
            <p className="t-label text-sol-texto">Só em desenvolvimento</p>
            <h1 className="t-display mt-3 max-w-[18ch]">Vitrine de componentes</h1>
            <p className="t-lead mt-4 max-w-[60ch]">
              Passe o mouse, use Tab e clique e segure nos cards para ver hover, foco e ativo. Role
              até o fim para ver a contagem do StatNumber (recarregue para repetir).
            </p>

            <h2 className="t-h3 mt-12">Botões</h2>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button href="#contato">Solicitar estudo técnico</Button>
              <Button variant="secondary" href="#solucoes">
                Conhecer as soluções
              </Button>
              <Button variant="link" href="#como-funciona">
                Ver como funciona
              </Button>
              <Button disabled>Desabilitado</Button>
              <Button erro>Enviar</Button>
            </div>

            <h2 className="t-h3 mt-12">Logo e chip</h2>
            <div className="mt-4 flex flex-wrap items-center gap-6">
              <Logo />
              <ChipProvisorio />
              <ChipProvisorio texto="texto de exemplo, confirmar com a engenharia" />
            </div>
          </div>
        </section>

        <section className="bg-areia py-[var(--section-y)]">
          <div className="container-meta">
            <h2 className="t-h3">SolutionCard: todos os estados</h2>
            <p className="mt-2 max-w-[60ch]">
              Da esquerda para a direita: padrão (teste hover, foco e ativo nele), desabilitado e
              erro.
            </p>
            <ul className="mt-8 grid gap-6 lg:grid-cols-3">
              <li>
                <SolutionCard
                  icone={<IconeBess />}
                  titulo="Padrão"
                  texto="Passe o mouse: o card sobe 3px, a borda fica grafite e a linha laranja do topo cresce."
                  rotulo="Conhecer o BESS"
                  href="#bess"
                />
              </li>
              <li>
                <SolutionCard
                  desabilitado
                  icone={<IconeFotovoltaico />}
                  titulo="Desabilitado"
                  texto="Borda tracejada e fundo areia. Não recebe foco nem clique."
                  rotulo="Conhecer o fotovoltaico"
                  href="#fotovoltaico"
                />
              </li>
              <li>
                <SolutionCard
                  erro
                  aoTentar={() => setTentativas((n) => n + 1)}
                  icone={<IconeMobilidade />}
                  titulo="Erro"
                  texto={`Borda de erro, ícone de alerta e texto. Tentativas: ${tentativas}.`}
                  rotulo="Conhecer a mobilidade elétrica"
                  href="#mobilidade-eletrica"
                />
              </li>
            </ul>

            <h2 className="t-h3 mt-16">Step: concluída, atual e a fazer</h2>
            <ol className="mt-8 list-none md:grid md:grid-cols-4 md:gap-6">
              <Step numero={1} estado="concluida" titulo="Concluída" texto="Marcador Sol com número grafite." indice={0} />
              <Step numero={2} estado="atual" titulo="Atual" texto="Marcador grafite com número Sol." indice={1} />
              <Step numero={3} estado="a-fazer" titulo="A fazer" texto="Marcador areia com número cinza e borda." indice={2} />
              <Step numero={4} estado="a-fazer" titulo="A fazer" texto="Última etapa: sem linha para a próxima." ultimo />
            </ol>
          </div>
        </section>

        {/* BessDiagram sobre o azul-marinho (provisório) */}
        <section data-tema="escuro" className="bg-marinho py-[var(--section-y)] text-branco">
          <div className="container-meta">
            <h2 className="t-h3 mb-8">BessDiagram</h2>
            <BessDiagram />
          </div>
        </section>

        {/* Espaço para a contagem só disparar ao rolar */}
        <div aria-hidden="true" className="h-[60vh]" />

        <section className="bg-areia py-[var(--section-y)]">
          <div className="container-meta">
            <h2 className="t-h3 mb-12">StatNumber sobre claro (valores fictícios)</h2>
            <div className="grid gap-12 md:grid-cols-3">
              <StatNumber valor={12345} rotulo="Número inteiro de teste" fonte="Fonte: demonstração" />
              <StatNumber
                valor={87.5}
                decimais={1}
                sufixo="%"
                rotulo="Percentual de teste"
                fonte="Fonte: demonstração"
              />
              <StatNumber valor="—" rotulo="Dado em validação" fonte="" emValidacao />
            </div>
          </div>
        </section>

        <section data-tema="escuro" className="bg-grafite py-[var(--section-y)] text-branco">
          <div className="container-meta">
            <h2 className="t-h3 mb-12">StatNumber sobre escuro (valores fictícios)</h2>
            <div className="grid gap-12 md:grid-cols-3">
              <StatNumber onDark valor={12345} rotulo="Número inteiro de teste" fonte="Fonte: demonstração" />
              <StatNumber
                onDark
                valor={87.5}
                decimais={1}
                sufixo="%"
                rotulo="Percentual de teste"
                fonte="Fonte: demonstração"
              />
              <StatNumber onDark valor="[00]" rotulo="[Rótulo]" fonte="[Fonte: nome, ano]" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
