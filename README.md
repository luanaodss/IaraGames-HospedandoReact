# Iara Games — Hospedando React

Projeto acadêmico da disciplina **Design de Interação**.

| | |
|---|---|
| **Repositório** | ⚠️ _Pendente: será preenchido após a publicação no GitHub_ |
| **Aplicação publicada** | ⚠️ _Pendente: será preenchido após o deploy na Vercel_ |

## Contexto

A Iara Games é uma plataforma de jogos que celebra a cultura brasileira. Este projeto é a terceira etapa do trabalho:

1. **Redesign de interação:** análise dos problemas de hierarquia, busca, esforço cognitivo e feedback da plataforma, e proposta de uma nova interface.
2. **Interatividade em Ação:** implementação do protótipo em HTML, CSS e JavaScript, com busca interativa, filtro do catálogo, feedback de carrinho e favoritos e a seção "Continue jogando".
3. **Hospedando React (esta etapa):** migração da plataforma para uma aplicação React com Vite e publicação em hospedagem web.

## Objetivo

Transformar a plataforma, antes formada por páginas HTML independentes, em uma aplicação React com componentes reutilizáveis, estado gerenciado pelo React e navegação entre páginas sem recarregar o navegador. A identidade visual e as interações das etapas anteriores foram mantidas.

## Páginas

| Rota | Página | Situação |
|---|---|---|
| `/` | Home | Implementada. Mostra uma versão para visitante e outra para usuário logado |
| `/catalogo` | Catálogo de jogos | Implementada |
| `/login` | Login | Implementada (demonstrativa) |
| `/suporte` | Central de Suporte | Implementada |
| `/biblioteca` | Biblioteca | Em construção (já era assim no projeto original) |
| `/perfil` | Meu perfil | Em construção (já era assim no projeto original) |
| `/forum` | Fórum | Em construção (já era assim no projeto original) |
| `/em-construcao` | Página genérica | Destino dos links sem conteúdo real (ex.: "Esqueci a senha", links institucionais do rodapé) |
| outras | Página não encontrada | Aviso de erro 404 no mesmo estilo visual |

## Funcionalidades

**Home**
- **Destaque com vídeo:** carrossel de três trailers com setas, pontos de navegação e troca automática a cada 7 segundos. A troca pausa com o mouse ou o foco do teclado sobre o destaque e fica desligada quando o sistema pede "reduzir movimento".
- **Seções por perfil:**
  - Usuário logado: "Continue jogando" (com barra de progresso) e "Recomendados para você".
  - Visitante: "Mais bem avaliados" e um convite para criar conta.
  - Ambos: "Top 3 em alta" e "Explore todos os jogos".

**Busca e catálogo**
- **Busca no header:** painel com pesquisas recentes (salvas no navegador), categorias populares e sugestões. Aplicar uma busca abre o catálogo já filtrado.
- **Busca no catálogo:** por nome, estúdio ou categoria, ignorando acentos e maiúsculas.
- **Filtros:** por categoria, com contador de resultados, opção "Limpar filtros" e mensagem quando nada é encontrado.
- **Filtros na URL:** os filtros ficam no endereço (por exemplo, `/catalogo?busca=lendas`), o que permite compartilhar ou recarregar a página sem perdê-los.

**Favoritos e carrinho**
- **Favoritar e desfavoritar** jogos nos cards e no destaque ("lista de desejos"), com mudança visual imediata, notificação e filtro "Meus favoritos".
- **Carrinho demonstrativo:** marca o jogo como adicionado e mostra a quantidade no ícone do header.

**Conta**
- **Login e logout demonstrativos:** o header, as seções da Home e as permissões mudam conforme o estado. Visitantes recebem um aviso para entrar antes de favoritar ou usar o carrinho.

**Suporte**
- Seis categorias de atendimento.
- Perguntas frequentes em acordeão.
- Campo de busca que filtra as perguntas.

**Acessibilidade e responsividade**
- **Navegação por teclado:** link "Pular para o conteúdo", foco visível e menus que fecham com Esc ou quando o foco sai deles.
- **Leitores de tela:** textos alternativos e nomes acessíveis nos controles.
- **Contraste:** ajustado para o nível AA da WCAG.
- **Responsividade:** layout para celular, tablet e desktop.

O relatório completo da auditoria de código e acessibilidade está em [`AUDITORIA.md`](AUDITORIA.md).

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18.3 | Interface em componentes, estado com Hooks e Context API |
| React Router DOM | 6.30 | Navegação entre páginas e filtros na URL |
| Vite | 5.4 | Servidor de desenvolvimento e build de produção |
| Bootstrap | 5.3.3 | Grid e componentes base, herdados do projeto original |
| Bootstrap Icons | 1.11.3 | Ícones da Central de Suporte |
| Google Fonts (Geist) | — | Tipografia da identidade visual |
| Vercel | — | Hospedagem da aplicação |

## Organização do projeto

```text
iara-games-react/
├── index.html               # Página base carregada pelo Vite
├── package.json             # Dependências e scripts
├── vite.config.js           # Configuração do Vite
├── vercel.json              # Faz as rotas funcionarem na Vercel
├── AUDITORIA.md             # Relatório da auditoria técnica
├── public/
│   ├── favicon.svg
│   └── videos/              # Trailers do destaque da Home
└── src/
    ├── main.jsx             # Ponto de entrada: router, contexto global e estilos
    ├── App.jsx              # Definição das rotas
    ├── context/
    │   └── AppContext.jsx   # Sessão, favoritos, carrinho e notificações
    ├── pages/               # Uma página por rota
    ├── components/          # Componentes reutilizáveis
    ├── data/                # Jogos, suporte, formatação e armazenamento local
    ├── hooks/
    │   └── usePageTitle.js  # Título da aba por página
    ├── styles/              # CSS do projeto original e ajustes da versão React
    └── assets/              # Imagens, ícones e logo
```

### Principais componentes

| Componente | Responsabilidade |
|---|---|
| `Layout` | Estrutura comum (header, conteúdo e rodapé) e link "Pular para o conteúdo" |
| `Header` | Logo, menu principal, busca, carrinho e acesso à conta |
| `HeaderSearch` | Campo de busca do header e painel de sugestões |
| `UserMenu` | Menu da conta com "Meu perfil" e "Sair" |
| `Footer` | Rodapé com links de navegação |
| `HeroCarousel` | Destaque com vídeos da Home |
| `ContinuePlaying` | Jogos em andamento (usuário logado) |
| `TopThree` | Ranking "Top 3 em alta" |
| `GameSection` | Seções de cards da Home |
| `CatalogBrowser` | Busca, filtros e grade de jogos (usado na Home e no Catálogo) |
| `GameCard` | Card de jogo com carrinho e favorito |
| `SearchBar`, `CategoryFilter` | Campo de busca e chips de categoria do catálogo |
| `Toast` | Notificações de confirmação |
| `ScrollToTop` | Volta ao topo a cada troca de página |

| Página | Arquivo |
|---|---|
| Home | `pages/Home.jsx` |
| Catálogo | `pages/CatalogPage.jsx` |
| Login | `pages/LoginPage.jsx` |
| Suporte | `pages/SupportPage.jsx` |
| Em construção e 404 | `pages/ConstructionPage.jsx` |

## Como executar localmente

Pré-requisito: [Node.js](https://nodejs.org/) 18 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

Sugestão de roteiro: comece como visitante, clique em **Entrar**, use qualquer e-mail válido e uma senha qualquer, e veja a Home logada. Use **Sair**, no menu da conta, para voltar ao modo visitante.

## Build e publicação

```bash
npm run build     # gera a versão de produção na pasta dist/
npm run preview   # serve a pasta dist/ localmente para conferência
```

**Publicação na Vercel:**
1. Envie o projeto para um repositório no GitHub.
2. Em <https://vercel.com>, escolha **Add New… → Project** e importe o repositório.
3. Mantenha o preset **Vite** (build `npm run build`, saída `dist`).
4. Clique em **Deploy**.

O arquivo `vercel.json` redireciona todas as rotas para o `index.html`. Assim, endereços como `/catalogo` e `/suporte` funcionam mesmo quando abertos diretamente.

## Integrantes

> ⚠️ **Preencher com os nomes reais do grupo, em ordem alfabética.**

- _Nome do integrante 1_
- _Nome do integrante 2_
- _Nome do integrante 3_

## Observações e limitações

- **Sem backend:** este é um protótipo acadêmico, sem banco de dados nem autenticação real.
- **Login:** é demonstrativo. Qualquer e-mail válido com uma senha preenchida entra com a usuária de exemplo "Ana Beatriz", e não há cadastro real.
- **Armazenamento local:** sessão, favoritos, carrinho e pesquisas recentes ficam salvos apenas no navegador (`localStorage`/`sessionStorage`).
- **Carrinho:** não há página de carrinho nem fluxo de compra; o botão apenas registra o item e mostra a quantidade.
- **"Retomar partida":** mostra uma confirmação visual, mas não abre nenhum jogo.
- **Páginas em construção:** Biblioteca, Meu perfil e Fórum, assim como no projeto original.
- **Dados dos jogos:** preços, estúdios e avaliações seguem o protótipo original e não representam dados reais.
