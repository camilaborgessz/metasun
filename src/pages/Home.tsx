import BessSection from "../components/BessSection";
import ComoFunciona from "../components/ComoFunciona";
// import Footer from "../components/Footer"; // FOOTER COMENTADO: a Camila vai arrumar. Para voltar, descomente esta linha e o <Footer /> abaixo.
import FrentesSection from "../components/FrentesSection";
import Header from "../components/Header";
import Hero from "../components/Hero";
import NumerosSection from "../components/NumerosSection";

// Home. Ordem: Header · Hero (grafite) · Números (areia) · Três frentes (branco) ·
// Como funciona (areia) · BESS (marinho) · Footer (COMENTADO por enquanto, ver abaixo).
export default function Home() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-botao bg-grafite px-4 py-3 text-branco focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>

      <Header sobreFoto />

      <main id="conteudo">
        <Hero />
        <NumerosSection />
        <FrentesSection />
        <ComoFunciona />
        <BessSection />
      </main>

      {/* <Footer /> */}
    </>
  );
}
