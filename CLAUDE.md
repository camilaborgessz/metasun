# Meta Sun · instruções para o agente

Você vai construir o front-end da **Meta Sun**, engenharia de energia de Porto Velho e Cacoal (RO). Slogan: **Engenharia que gera economia.** Peças: site institucional, landing pages por segmento e link tree.
Fonte da verdade visual: `tokens.json`, `tokens.css` e `docs/design-system.md`. Este arquivo traz o resto.

## Quem está pedindo
Camila, front-end e UX/UI, sabe React, TypeScript, Tailwind e Figma. **Não conhece Next.js, Prisma, PostgreSQL nem NextAuth**: não use. Ela vai editar o código depois, então prefira simples e legível, com comentários curtos em português.

## Stack
Vite + React + TypeScript + Tailwind (config em `tailwind.config.ts`). Sem Next.js. Roteamento simples (react-router) só se precisar de mais de uma página. Antes de instalar qualquer dependência extra, pergunte. Extras já autorizados: `@fontsource/montserrat` (fonte local, sem Google Fonts).

## Personalidade
A nerd da energia: jovem, técnica, confiável, criativa, bem-humorada na medida. Explica sem jargão e prova com fatos.
NÃO pode parecer site institucional de 2015 nem loja de energia solar. Proibido: superlativos, estilo de varejo (preço riscado, contagem regressiva), carrossel automático, gradientes e sombras em excesso (elevação é plana, sem box-shadow).

## Regras inegociáveis
1. **Não invente** número, logo, depoimento, foto, endereço, telefone nem selo. Tudo que depende de dado real vem de `src/content/placeholders.ts` como `[00]`, `[WHATSAPP]` etc., e mostra o chip "provisório" quando for visível.
2. **Logo:** só arquivo oficial, sem alterar, em fundo branco, areia ou grafite. Vale o **SVG enviado pela Camila** (`src/assets/logo-meta-sun.svg`, fundo transparente, só com a `viewBox` recortada), usado pelo componente `<Logo />`. Sobre fundo escuro (Footer e Header sobre a foto) usa `<Logo negativo />`, **sem placa branca**: é `src/assets/logo-meta-sun-negativo.svg`, cópia do mesmo SVG em que só as letras (META e SUN) passam de preto para branco. **Provisório:** trocar pelo arquivo da versão negativa oficial quando chegar. Nunca desenhe nem vetorize o logo por conta própria (a vetorização automática antiga fica só como reserva em `docs/reserva/` e não é importada).
3. **Cor:** proporção 60% branco/areia, 25% grafite (marinho nos destaques), 15% laranja. Alterne fundos entre seções.
   - Botão laranja leva texto **grafite** (branco sobre laranja dá 2,1:1).
   - Laranja Sol (#F7A21B) nunca é texto sobre branco/areia. Texto laranja e números grandes sobre claro: `sol-texto` (#A65800). Sobre escuro, números em Laranja Sol.
   - **Exceção decidida pela Camila:** os números do StatNumber usam Laranja Sol também sobre claro (areia), mesmo com só ~2,1:1 de contraste. Para voltar à regra, é uma linha em `StatNumber.tsx` (`corNumero`).
   - Azul-marinho #14284B é **provisório** (HEX a confirmar): use só via variável `--marinho`.
4. **Tipografia:** Montserrat 700 títulos, 600 rótulos em caixa alta (12px, tracking .12em), 400 texto. Fallback Arial. Carregar só 400/600/700 (via `@fontsource/montserrat`, subconjunto latino), `font-display: swap`.
5. **Forma:** cantos 6 (campo), 8 (botão), 12 (card). **Exceção só no Hero A:** pílulas (999px), cartão de 32px e moldura areia de 20px (12px abaixo de 900px). Ícones de linha laranja, traço 1,75, grade 24, `aria-hidden` (o sentido vai em texto). Grafismos: linhas de cota, linhas finas laranja. O arco do sol **saiu do Hero** (decisão da Camila) e só volta se ela pedir; nunca imita o logo.
6. **Acessibilidade:** contraste (texto 4,5:1), foco visível (anel 3px, grafite no claro, laranja no escuro), alvos ≥44px (botões 48px), alt em foto real e `alt=""` em decoração, um H1 por página, `lang="pt-BR"`, funciona só com teclado, erro nunca só por cor.
7. **Movimento:** sutil e com propósito. O HTML já traz o conteúdo final; animação só melhora. Respeitar `prefers-reduced-motion` (estado final direto). Sem carrossel automático. Movimento >5s tem botão de pausa.
8. **LGPD:** aceite desmarcado com link da política; coletar só o necessário; cookies de medição/marketing só após escolha; "Recusar" com o mesmo peso de "Aceitar"; link "Preferências de cookies" no rodapé.
9. **Leve e mobile first:** SVG inline para ícones, sem biblioteca de carrossel, imagens com largura/altura e lazy abaixo da dobra. O Hero A tem uma foto em tela cheia: é a imagem principal, então `fetchPriority="high"`, sem lazy, WebP com `srcset` (800/1280/1920w em `public/images/`), `width`/`height` e `alt`. Texto sobre a foto precisa de ≥4,5:1 no pixel mais claro (por isso o gradiente de `.hero-gradiente` em `index.css` é mais forte que o do mockup). Vidro (`backdrop-filter`) sempre com fundo de reserva mais opaco. Metas: LCP ≤2,5s, INP ≤200ms, CLS ≤0,1.

## Voz (para todo texto)
- "Nós" (a engenharia) falando com "você" e com a empresa dele. Começar pela necessidade do cliente.
- Estrutura do bloco: problema → consequência → solução → racional.
- Todo termo técnico explicado na mesma frase (BESS = sistema de armazenamento de energia em baterias; horário de ponta = faixa do dia em que a distribuidora cobra mais; kWp = quilowatt-pico).
- Toda afirmação forte leva número **e fonte** (ou fica como `[00%]` placeholder).
- Humor: no máximo uma tirada por seção, nunca em formulário, erro ou aviso legal.
- Botões: verbo + objeto ("Solicitar estudo técnico").

## Componentes (todos com estados: padrão, hover, foco, ativo, desabilitado, erro, quando se aplica)
- **Button** `variant: primary | secondary | link`, `onDark?`. Primário: fundo Sol, texto grafite, hover `sol-hover`, ativo `sol-ativo` + 1px abaixo, seta anda 3px no hover. Secundário: borda 2px grafite (branca no escuro), hover inverte. Link: texto grafite, sublinhado laranja 2px (4px no hover). Erro: ícone de alerta + "Não enviou. Tentar de novo". Desabilitado: fundo `desabilitado`, texto cinza.
- **WhatsAppFloat** canto inferior direito, 16px das bordas, 56px, fundo Sol, borda 2px grafite (sem sombra), texto "Falar no WhatsApp" no desktop e só ícone com `aria-label` no celular. Ícone genérico de conversa (não usar o logo do app). Some com o aviso de cookies aberto; sobe 72px quando a barra de CTA mobile aparece.
- **Header** sticky, 80px (64px rolado, com filete). Logo, nav (Soluções, Como funciona, BESS, Projetos, Contato), CTA fixo "Solicitar estudo técnico". Abaixo de 900px a nav vira menu; abaixo de 640px o CTA vai para uma barra fixa na base. Variante sobre fundo escuro. **Modo `sobreFoto` (Home):** por cima do Hero A é transparente (texto e logo brancos); ao rolar mais de 8px vira a barra branca de 64px. **O layout e o conteúdo são os mesmos nos dois estados** (logo, nav Soluções · Como funciona · BESS · Projetos · Contato, CTA "Solicitar estudo técnico"); só a cor muda. Nav sem item marcado: só aparece o sublinhado laranja no hover. CTA do Header: `BotaoPreenche` compacto (miolo grafite, borda cinza-escura quase invisível, degradê laranja no hover), igual nos dois estados.
- **Hero (A, imersiva escura)** foto em tela cheia numa moldura areia, gradiente por cima, H1 "Quanto o **horário de ponta** pesa no resultado da sua empresa?" (58px, peso 600, termo em Sol) , subtítulo "Fazemos o estudo do consumo da sua empresa e apresentamos a economia estimada." (cinza-areia `apoio-escuro`, peso 400 e menor que o título, para dar hierarquia) e **um botão só**: "Solicitar estudo técnico" (`BotaoPreenche`, efeito Uiverse xueyuantan adaptado: miolo **grafite**, texto branco em negrito e borda cinza-escura quase invisível (`#2c2c2c`), **sem borda laranja** em repouso; no hover um degradê laranja varre o botão da esquerda para a direita, a borda fica laranja e o texto vira grafite; sem box-shadow). Decisão da Camila: não gostou do miolo laranja nem do branco. O "Conhecer o BESS" foi removido do Hero. "horário de ponta" usa o `CanvasText` (linhas onduladas dentro das letras, 1 ciclo de 5s, o mouse repete). O cartão da foto encolhe de 100% para 72% ao rolar (`.hero-cartao`, `animation-timeline: scroll()`). **Sem tag, sem linha de apoio longa, sem arco do sol e sem lead** (decisão da Camila). **Regra 7:** os efeitos do Hero ficam limitados a 5s de movimento automático; para animar sem parar é preciso criar um botão de pausa. Atenção: sem uma explicação curta, o termo "horário de ponta" fica sem definição na primeira dobra, contra a regra de voz. Referência: pasta `A · Imersiva escura-html/` (mockup só para consultar valores, não copiar o HTML).
- **StatNumber** número 64–112px Bold, tabular, label, fonte embaixo (opcional), **sem filete laranja**. Conta de 0 ao valor em 1600ms, uma vez, ao entrar na tela (IntersectionObserver). Valor final já no HTML. Número sempre em Laranja Sol (ver exceção na regra 3). Estado "dado em validação": "—" + frase.
- **SolutionCard** (BESS, Fotovoltaico, Mobilidade elétrica): ícone de linha, título, 1 frase que explica o termo, link "Saber mais". Hover: sobe 3px (só sem movimento reduzido), linha laranja do topo cresce (250ms), seta anda 4px; **a borda não fica preta** (só escurece para cinza de apoio, 1px). Sem sombra. Estados extras: desabilitado (tracejado, "Em breve [confirmar]") e erro (borda de erro + alerta + "Não carregou. Tentar de novo").
- **Step** (etapa numerada): marcador 48px cantos 12 (concluída = Sol/grafite, atual = grafite/Sol, a fazer = areia/cinza). A linha laranja entre etapas preenche ao rolar (CSS `animation-timeline: view()` com fallback já cheia). No celular a linha é vertical.
- **AuthoritySeal** selo de registro/fonte: ícone escudo + 2 linhas. Só com selo real; senão placeholder.
- **BessDiagram** gera → guarda → usa no horário de ponta: 3 blocos e 2 linhas de fluxo (traços que correm, 1s/ciclo) sobre azul-marinho, mais barra de 24h com a faixa de ponta `[00h às 00h]` (provisória). Botão de pausa. Vertical no celular. Montar com divs, não um SVG único.
- **SegmentCard** e **ProjectCard**: mesmo padrão do SolutionCard. Projeto: foto (placeholder hachurado "[Foto real do projeto]"), tag, nome, 2 dados `[00]`, link.
- **LogoStrip** grade estática de logos de clientes (placeholders), sem carrossel; fallback em texto se a imagem falhar.
- **LeadForm** (estudo técnico): Nome, WhatsApp com DDD, Cidade (Porto Velho, Cacoal, Outra), Segmento (opcional), Valor médio da conta (opcional) + aceite LGPD desmarcado + botão "Solicitar estudo técnico". Rótulo sempre visível, erro junto do campo com ícone, resumo no topo, validar ao enviar (sem botão desabilitado). Campo: borda 2px cinza-texto, foco com anel grafite. Backend: por enquanto só um `onSubmit` com `console.log` e uma função `sendLead()` a implementar; pergunte para onde enviar.
- **Faq** acordeão com `<details>/<summary>`, 4 itens de exemplo.
- **Footer** grafite: logo (versão negativa, sem placa), Porto Velho e Cacoal (endereços placeholder), navegação, contatos, CNPJ e responsável técnico placeholders, política de privacidade, preferências de cookies.
- **CookieNotice** base da tela, "Recusar não essenciais" e "Aceitar todos" lado a lado com o mesmo estilo, "Escolher quais cookies" abre categorias (essenciais travado, medição e marketing desligados).

## Home, nesta ordem
0 Header (sobre a foto) · 1 Hero A (foto em tela cheia, H1 e 2 botões; sem tag, sem linha de apoio, sem arco e sem lead) · 2 Números em areia, **reais**: 1.300+ obras concluídas, 11 engenheiros no suporte técnico (elétrica e civil), 2 sedes (Porto Velho e Cacoal, RO), sem linha de fonte e sem chip "provisório" (decisão da Camila) · 3 "As 3 frentes" em branco (3 SolutionCard) · 4 Como funciona em areia (Estudo técnico, Proposta consultiva, Projeto e obra, Monitoramento) · 5 BESS em destaque em azul-marinho (texto + número `[00]%` + BessDiagram) · Footer.
Landing por segmento: Header, Hero, Números, Projeto de referência, Como funciona, BESS/solução, Form + FAQ, Footer. Link tree: coluna única 390–480px, logo, frase, botões empilhados (1 primário), selo, política.

## Como trabalhar
1. Configure o projeto, importe `tokens.css`, crie `src/content/placeholders.ts` e os componentes base (Button, Logo, Chip provisório). *(feito)*
2. Construa uma etapa por vez, nesta ordem: Header+Footer → Hero → StatNumber → SolutionCard → Step → BessDiagram *(feitos até aqui)* → LeadForm/Faq/CookieNotice → WhatsAppFloat → Link tree. Componentes em teste ficam na rota `/dev` (só com `npm run dev`, nunca na Home).
3. Depois de cada etapa, rode build e lint e me diga o que ficou como placeholder.
4. Se algo conflitar com as regras acima, pare e pergunte em vez de decidir sozinho.
