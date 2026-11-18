import type { ReactNode } from "react";
import { navItens } from "../content/navegacao";
import { ehPlaceholder, placeholders } from "../content/placeholders";
import Button from "./Button";
import { Dado } from "./Chip";
import Logo from "./Logo";

// Rodapé grafite. Todos os dados abaixo vêm de placeholders.ts.

type Props = {
  /** abre o CookieNotice (ainda não existe; ligar quando for criado) */
  onAbrirCookies?: () => void;
};

// Item de contato: vira link só quando o dado for real (placeholder fica como texto)
function Contato({ rotulo, valor, href }: { rotulo: string; valor: string; href: string }) {
  return (
    <div>
      <dt className="text-sm text-apoio-escuro">{rotulo}</dt>
      <dd>
        {ehPlaceholder(valor) ? (
          <Dado valor={valor} onDark />
        ) : (
          <Button variant="link" onDark href={href}>
            {valor}
          </Button>
        )}
      </dd>
    </div>
  );
}

function Coluna({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="t-label mb-4 text-sol">{titulo}</h2>
      {children}
    </div>
  );
}

export default function Footer({ onAbrirCookies }: Props) {
  const digitos = (v: string) => v.replace(/\D/g, "");

  return (
    <footer data-tema="escuro" className="bg-grafite text-branco">
      <div className="container-meta py-[var(--section-y)]">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            {/* As letras do logo são pretas e somem no grafite: placa branca (fundo permitido) */}
            <span className="inline-block rounded-botao bg-branco p-3">
              <Logo className="h-10" />
            </span>
            <p className="mt-6 text-lg font-bold">Engenharia que gera economia.</p>
            <p className="mt-2 max-w-[34ch] text-apoio-escuro">
              Engenharia de energia em Porto Velho e Cacoal (RO).
            </p>
          </div>

          <Coluna titulo="Onde estamos">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-apoio-escuro">Porto Velho, RO</dt>
                <dd>
                  <Dado valor={placeholders.enderecoPortoVelho} onDark />
                </dd>
              </div>
              <div>
                <dt className="text-sm text-apoio-escuro">Cacoal, RO</dt>
                <dd>
                  <Dado valor={placeholders.enderecoCacoal} onDark />
                </dd>
              </div>
            </dl>
          </Coluna>

          <Coluna titulo="Navegação">
            <nav aria-label="Rodapé">
              <ul>
                {navItens.map((item) => (
                  <li key={item.href}>
                    <Button variant="link" onDark href={item.href}>
                      {item.rotulo}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </Coluna>

          <Coluna titulo="Contato">
            <dl className="space-y-4">
              <Contato
                rotulo="WhatsApp"
                valor={placeholders.whatsapp}
                href={`https://wa.me/${digitos(placeholders.whatsapp)}`}
              />
              <Contato
                rotulo="Telefone"
                valor={placeholders.telefone}
                href={`tel:+${digitos(placeholders.telefone)}`}
              />
              <Contato
                rotulo="E-mail"
                valor={placeholders.email}
                href={`mailto:${placeholders.email}`}
              />
            </dl>
          </Coluna>
        </div>

        {/* Dados legais, política e cookies */}
        <div className="mt-12 border-t border-linha-escura pt-6">
          <dl className="flex flex-col gap-4 text-sm sm:flex-row sm:gap-10">
            <div>
              <dt className="text-apoio-escuro">CNPJ</dt>
              <dd>
                <Dado valor={placeholders.cnpj} onDark />
              </dd>
            </div>
            <div>
              <dt className="text-apoio-escuro">Responsável técnico</dt>
              <dd>
                <Dado valor={placeholders.responsavelTecnico} onDark />
              </dd>
            </div>
          </dl>

          {/* Abaixo de 640px reserva 72px no fim para a barra fixa de CTA não cobrir o rodapé */}
          <div className="mt-4 flex flex-col gap-x-8 text-sm max-sm:pb-[72px] sm:flex-row sm:items-center">
            <Button variant="link" onDark href={placeholders.urlPoliticaPrivacidade}>
              Política de privacidade
            </Button>
            <Button variant="link" onDark onClick={onAbrirCookies}>
              Preferências de cookies
            </Button>
            <p className="text-apoio-escuro sm:ml-auto">© {new Date().getFullYear()} Meta Sun</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
