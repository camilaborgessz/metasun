import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Montserrat local (sem Google Fonts): só 400/600/700, subconjunto latino, font-display: swap
import "@fontsource/montserrat/latin-400.css";
import "@fontsource/montserrat/latin-600.css";
import "@fontsource/montserrat/latin-700.css";
import "../tokens.css"; // tokens do design system (fonte da verdade)
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
