# Auditoria técnica — Iara Games (React)

Data: 17/10/2026 · Versão auditada: `iara-games-plataforma-react` (antes das correções, salva em `iara-games-plataforma-react-pre-auditoria.zip`).

**Como foi feita:**
- Leitura de todos os arquivos de `src/`.
- ESLint com `react`, `react-hooks` e `jsx-a11y`, rodado à parte e sem adicionar dependências ao projeto.
- axe-core (WCAG 2.2 AA) em todas as páginas, como visitante e logado.
- Navegação por teclado e console do React em modo de desenvolvimento.
- Testes automatizados no navegador (Playwright).

## Resumo

- Estrutura de pastas, componentes, Hooks, keys e estado estavam corretos. Não havia mutação de estado ou props, imports sem uso nem `key` por índice.
- Os problemas reais estavam concentrados em **acessibilidade** e em alguns detalhes de Hooks.
- **Depois das correções:**
  - axe-core: **0 violações** em 6 páginas (visitante e logado), incluindo painel de busca, menu da conta e FAQ abertos.
  - ESLint (`react`, `react-hooks`, `jsx-a11y` recomendado): **0 erros**.
  - ESLint `jsx-a11y` estrito: 1 aviso, explicado em "Escolhas válidas".

## Problemas encontrados e corrigidos

Prioridade: **A** = alta, **M** = média, **B** = baixa.

| # | Pri. | Arquivo / componente | Problema | Por que é um problema | Correção aplicada | Afeta visual/comportamento? |
|---|---|---|---|---|---|---|
| 1 | A | `HeaderSearch.jsx` | `aria-expanded`/`aria-controls` em `<input type="search">` | Atributo ARIA não permitido nesse papel (axe: *critical*). Leitores de tela podem anunciar errado | Atributos removidos | Não |
| 2 | A | `styles/app.css` (busca do header e do catálogo) | Campo de busca sem foco visível: o `styles.css` original zera o `outline` do input | Falha WCAG 2.4.7: quem usa teclado não vê onde está o foco | Anel verde com `.search-box:focus-within` | Só aparece ao focar |
| 3 | M | `Layout.jsx` + páginas | Sem forma de pular o header (cerca de 10 controles antes do conteúdo) | WCAG 2.4.1 (Bypass Blocks) | Link "Pular para o conteúdo", visível só ao receber foco; `<main id="conteudo" tabIndex={-1}>` | Só aparece ao usar Tab |
| 4 | M | `Home.jsx` | Página sem `<h1>` | Hierarquia de títulos incompleta; leitores de tela usam o h1 para identificar a página | `<h1>` com a classe `visually-hidden` | Não |
| 5 | M | `CatalogPage.jsx`, `Footer.jsx` | Saltos de título (h1 → h3 nos cards; h3 no rodapé logo após o h1 do Login) | Estrutura de navegação por títulos confusa (axe: *heading-order*) | h2 oculto "Lista de jogos" no catálogo; títulos do rodapé passam a `h2` com o mesmo estilo | Não (estilo idêntico) |
| 6 | M | `HeroCarousel.jsx` | `setTimeout` da troca de destaque nunca era cancelado | Atualização de estado após desmontar o componente e cliques rápidos acumulando timers | Timer guardado em `useRef`, limpo a cada troca e ao desmontar | Não |
| 7 | M | `HeroCarousel.jsx` | Efeito que chamava `video.load()/play()` a cada troca, embora o `<video>` já fosse recriado pela `key` | Efeito desnecessário e manipulação manual do DOM | Efeito e `ref` removidos; o `autoPlay` do novo elemento faz o trabalho | Não |
| 8 | M | `HeroCarousel.jsx` | A troca automática só pausava com o mouse | WCAG 2.2.2: quem navega por teclado não consegue parar o movimento; nada respeitava "reduzir movimento" | Pausa também com o foco dentro do destaque; com `prefers-reduced-motion` não há troca automática nem autoplay do vídeo | Só para quem usa teclado ou tem "reduzir movimento" ligado |
| 9 | M | `ContinuePlaying.jsx` | O botão ficava `disabled` logo após o clique | O foco do teclado se perde (volta para o início da página) | `aria-disabled` + bloqueio no próprio handler | Não (mesmo estilo) |
| 10 | M | `TopThree.jsx` | "Descobrir jogo" era um `<button>` que navegava com `navigate()` | Navegação deve ser link: permite abrir em nova aba e é anunciada corretamente | `<Link>` com as mesmas classes | Não |
| 11 | M | `HeaderSearch.jsx`, `UserMenu.jsx` | Painel de busca e menu da conta não fechavam quando o foco do teclado saía deles; Esc no menu não devolvia o foco | Painel aberto cobrindo conteúdo; foco perdido | Listener `focusin` no mesmo efeito do clique fora; Esc devolve o foco ao botão | Não |
| 12 | M | `styles/app.css` | Contraste abaixo de 4,5:1 em 4 tons pequenos: preço riscado (4,14), selo de desconto (4,37), links (4,29) e copyright do rodapé (3,77) | WCAG 1.4.3 (texto pequeno) | Menor ajuste de tom que atinge 4,6:1: `#727a76→#7a827e`, `#12852e→#0e812a`, `#707975`/`#67706c→#757e7a` | Sim, imperceptível (mesmo matiz, poucos pontos de luminosidade) |
| 13 | M | `CatalogBrowser.jsx` | Mensagem "você ainda não favoritou" contava também os favoritos do destaque (jogos fora do catálogo) | Mensagem errada em "Meus favoritos" | Contagem única `favoriteGameCount`, usada no contador e na mensagem | Só a mensagem fica correta |
| 14 | B | `GameCard.jsx`, `ContinuePlaying.jsx`, `TopThree.jsx` | Vários botões com o mesmo nome ("Adicionar ao carrinho", "Retomar partida", "Descobrir jogo") | Fora de contexto, o leitor de tela não diz de qual jogo é o botão | `aria-label` com o nome do jogo, começando pelo texto visível (WCAG 2.5.3) | Não |
| 15 | B | `Header.jsx` | O número do carrinho não era anunciado (o `aria-label` fixo "Carrinho" sobrepunha o número) | Informação só visual | `aria-label="Carrinho (N itens)"` | Não |
| 16 | B | `GameCard.jsx`, `CatalogBrowser.jsx`, `HeaderSearch.jsx`, `ContinuePlaying.jsx` | Símbolos decorativos (★ ♥ ◷ ▶ ✓) eram lidos em voz alta | Ruído para leitor de tela | `aria-hidden` nos símbolos; "Avaliação" oculto antes da nota | Não |
| 17 | B | `SupportPage.jsx` | `document.getElementById('faq')` para rolar até o FAQ | Acesso manual ao DOM onde um `ref` resolve | `useRef` | Não |
| 18 | B | `styles/app.css` (pontos do carrossel) | Área de toque de 27×2px | WCAG 2.5.8: alvo mínimo de 24px | Área de 27×24px com a mesma linha visível de 2px | Não |
| 19 | B | `main.jsx` | Aviso do React Router sobre `v7_relativeSplatPath` | Ruído no console | Flag ativada (não muda nenhuma rota atual) | Não |
| 20 | B | `AppContext.jsx` | `id` do toast com `Date.now()` | Dois avisos no mesmo milissegundo teriam a mesma `key` | Contador em `useRef` | Não |

## Escolhas válidas (não alteradas)

- **`HeroCarousel` com `onMouseEnter`/`onFocus` na `<section>`:** o ESLint estrito marca o padrão, mas esses eventos só pausam a troca automática; não são uma interação que exija papel de botão. O ESLint recomendado não acusa nada.
- **Listeners de `click`/`focusin` no `document`** (busca e menu): é o padrão usual para "fechar ao clicar fora". Eles são registrados só com o painel aberto e removidos no cleanup.
- **`useEffect` que grava favoritos e carrinho no `localStorage`:** é sincronização com um sistema externo, o uso indicado para efeitos.
- **Filtros do catálogo na URL** (`useSearchParams`) e em estado local na Home: não há estado duplicado. Cada página tem uma única fonte.
- **`ScrollToTop` usa `getElementById` para âncoras:** é genérico para qualquer `#hash`, e um `ref` não se aplica.
- **Imagem do card com `alt` = nome do jogo**, repetindo o h3: aceitável para miniatura. No Top 3, o banner passou a `alt=""` porque o título já está no h3 ao lado.
- **Os avisos do toast** usam uma região `aria-live="polite"`, que é adequada.

## Pontos que ainda precisam de atenção

1. **Botão visível de pausar o vídeo do destaque:** o vídeo de fundo roda em loop. A pausa por foco e o "reduzir movimento" atendem parte da WCAG 2.2.2, mas o ideal é um botão de pausar/reproduzir. Ficou para decisão de design, porque altera o layout aprovado.
2. **Aviso do React Router sobre `v7_startTransition`** (só em desenvolvimento): a flag foi testada e **revertida**. Com ela, o campo de busca do catálogo, controlado pela URL, perdia caracteres nos testes. Isso só precisa ser tratado numa futura migração para o React Router v7.
3. **Foco ao trocar de página:** a rolagem volta ao topo, mas o foco do teclado não é movido para o novo conteúdo. Fica como melhoria futura.
4. **Ícones sem uso** em `src/assets/icons` (`money.svg`, `star.svg`, `chevron-right.svg`): não entram no build. Podem ser apagados.
5. **Não há script de lint no `package.json`:** a análise foi feita à parte para não adicionar dependências. Se o professor exigir, dá para incluir `eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-jsx-a11y`.

## Testes executados

| Teste | Resultado |
|---|---|
| `npm run build` | OK, sem erros nem avisos |
| ESLint (`react`, `react-hooks`, `jsx-a11y` recomendado) | 0 erros |
| axe-core WCAG 2.2 AA + boas práticas: 6 páginas × visitante/logado + estados abertos | 0 violações |
| Console no build de produção (5 páginas) | Sem avisos nem erros |
| Console em desenvolvimento (StrictMode) | Só o aviso do item 2 acima |
| Suíte funcional (navegação, busca, filtros, favoritos, carrinho, login, logout, FAQ, links, 404, mobile e tablet) | 99/99, executada 3 vezes seguidas |
| Teclado e acessibilidade (link de pular, foco visível, Esc, fechamento por foco, carrossel com foco e com "reduzir movimento", rótulos) | 22/22 |
| Responsividade com a fonte Geist real: 7 páginas × 16 larguras (320–1920px) × visitante/logado | 0 problemas |
| Comparação visual antes/depois (pixel a pixel, 15 telas) | Diferenças só nos tons do item 12 |

**Não executados:**
- Teste com leitor de tela real (NVDA/VoiceOver).
- Testes em Safari e Firefox (só Chromium).
- Teste em celular físico (feito com viewport emulado).
- Publicação na Vercel.
