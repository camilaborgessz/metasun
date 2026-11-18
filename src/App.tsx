import { lazy, Suspense } from "react";
import Home from "./pages/Home";

// Rota /dev: só existe com `npm run dev`. Em produção `import.meta.env.DEV` é false,
// então a página de testes nem entra no build. (Sem react-router: só uma página extra.)
const Dev = import.meta.env.DEV ? lazy(() => import("./pages/Dev")) : null;

export default function App() {
  const caminho = window.location.pathname.replace(/\/$/, "");

  if (Dev && caminho === "/dev") {
    return (
      <Suspense fallback={null}>
        <Dev />
      </Suspense>
    );
  }
  return <Home />;
}
