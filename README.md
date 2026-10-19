# Iara Games — Hospedando React

Projeto acadêmico da disciplina **Design de Interação**.

| | |
|---|---|
| **Repositório** | <https://github.com/luanaodss/IaraGames-HospedandoReact> |
| **Aplicação publicada** | <https://iara-games-hospedando-react.vercel.app/> |

## Contexto

A Iara Games é uma plataforma de jogos que celebra a cultura brasileira. Este projeto é a terceira etapa do trabalho:

1. **Redesign de interação:** análise dos problemas de hierarquia, busca, esforço cognitivo e feedback da plataforma, e proposta de uma nova interface.
2. **Interatividade em Ação:** implementação do protótipo em HTML, CSS e JavaScript, com busca interativa, filtro do catálogo, feedback de carrinho e favoritos e a seção "Continue jogando".
3. **Hospedando React:** migração da plataforma para uma aplicação React com Vite e publicação em hospedagem web.
4. **Fase 07 — Cadastro, geolocalização e autenticação (esta etapa):** cadastro e login reais com Supabase Auth, perfil protegido por RLS, preenchimento de endereço pelo ViaCEP e localização opcional pelo navegador.

## Objetivo

Transformar a plataforma, antes formada por páginas HTML independentes, em uma aplicação React com componentes reutilizáveis, estado gerenciado pelo React e navegação entre páginas sem recarregar o navegador. A identidade visual e as interações das etapas anteriores foram mantidas.

## Páginas

| Rota | Página | Situação |
|---|---|---|
| `/` | Home | Implementada. Mostra uma versão para visitante e outra para usuário logado |
| `/catalogo` | Catálogo de jogos | Implementada |
| `/login` | Login | Implementada (Supabase Auth) |
| `/cadastro` | Criar conta | Implementada (Supabase Auth + ViaCEP + geolocalização) |
| `/suporte` | Central de Suporte | Implementada |
| `/perfil` | Meu perfil | Implementada. Rota protegida: mostra os dados da tabela `profiles` |
| `/biblioteca` | Biblioteca | Rota protegida. Conteúdo ainda em construção |
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
- **Cadastro real (`/cadastro`):** nome, e-mail, senha e confirmação, CEP e endereço completo. Cria o usuário no Supabase Auth; o perfil e o endereço são gravados na tabela `profiles`, ligada ao id do usuário.
- **Senha:** tratada apenas pelo Supabase Auth. Nunca é gravada em tabela própria nem no `localStorage`.
- **ViaCEP:** o botão **Buscar CEP** (ou Enter no campo) consulta `viacep.com.br`, preenche logradouro, bairro, cidade e estado e deixa tudo editável. Trata CEP vazio, incompleto ou inexistente, falha de conexão e resposta inesperada.
- **Geolocalização opcional:** o botão **Usar minha localização** pede permissão só quando clicado, mostra latitude, longitude e um mapa do OpenStreetMap, e sugere o endereço (Nominatim). Negar a permissão não bloqueia o cadastro, e as coordenadas não são salvas.
- **Login real (`/login`):** e-mail e senha validados pelo Supabase Auth, com mensagens de erro claras. A sessão é mantida pelo SDK e sobrevive ao recarregar a página.
- **Rotas protegidas:** `/perfil` e `/biblioteca` exigem sessão; sem ela, o usuário vai para o login e depois volta à página pedida. **Sair** encerra a sessão no Supabase.
- O header, as seções da Home e as permissões mudam conforme a sessão. Visitantes recebem um aviso para entrar antes de favoritar ou usar o carrinho.

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
IaraGames-HospedandoReact/
├── index.html               # Página base carregada pelo Vite
├── package.json             # Dependências e scripts
├── vite.config.js           # Configuração do Vite
├── vercel.json              # Faz as rotas funcionarem na Vercel
├── AUDITORIA.md             # Relatório da auditoria técnica
├── .env.example             # Modelo das variáveis do Supabase (sem segredos)
├── supabase/schema.sql      # Tabela profiles, políticas RLS e gatilho de cadastro
├── favicon.svg              # Ícone da aba
├── trailer-*.mp4            # Trailers do destaque da Home (importados em src/data/games.js)
└── src/
    ├── main.jsx             # Ponto de entrada: router, contexto global e estilos
    ├── App.jsx              # Definição das rotas
    ├── context/
    │   └── AppContext.jsx   # Sessão do Supabase, perfil, favoritos, carrinho e notificações
    ├── lib/
    │   └── supabase.js      # Cliente Supabase (lê as variáveis VITE_)
    ├── pages/               # Uma página por rota
    ├── components/          # Componentes reutilizáveis
    ├── data/                # Jogos, suporte, ViaCEP, geolocalização, mensagens de erro e armazenamento local
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
| `RequireAuth` | Protege rotas privadas: sem sessão, redireciona para o login |
| `FormAlert` | Mensagens de erro, sucesso e aviso dos formulários |
| `Toast` | Notificações de confirmação |
| `ScrollToTop` | Volta ao topo a cada troca de página |

| Página | Arquivo |
|---|---|
| Home | `pages/Home.jsx` |
| Catálogo | `pages/CatalogPage.jsx` |
| Login | `pages/LoginPage.jsx` |
| Criar conta | `pages/SignupPage.jsx` |
| Meu perfil | `pages/ProfilePage.jsx` |
| Suporte | `pages/SupportPage.jsx` |
| Em construção e 404 | `pages/ConstructionPage.jsx` |

## Como executar localmente

Pré-requisito: [Node.js](https://nodejs.org/) 18 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

Sem o arquivo `.env`, o site funciona, mas cadastro e login mostram o aviso "autenticação ainda não configurada".

## Configuração do Supabase

1. Crie um projeto em <https://supabase.com/dashboard>.
2. No **SQL Editor**, execute o arquivo [`supabase/schema.sql`](supabase/schema.sql). Ele cria a tabela `profiles`, ativa o RLS com as políticas "ler/inserir/atualizar o próprio perfil" e cria o gatilho que gera o perfil a cada novo cadastro.
3. Em **Authentication → Sign In / Providers → Email**, mantenha o provedor de e-mail ativo e a opção **Confirm email** ligada.
4. Em **Authentication → URL Configuration**:
   - **Site URL:** `https://iara-games-hospedando-react.vercel.app`
   - **Redirect URLs:** `https://iara-games-hospedando-react.vercel.app/**` e `http://localhost:5173/**`
5. Em **Project Settings → API** (ou no botão **Connect**), copie a **Project URL** e a chave pública (**publishable** ou **anon**).
6. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.

> Nunca use a chave `service_role`/secret no frontend: tudo que começa com `VITE_` vai para o navegador. A chave pública é segura porque o acesso aos dados é limitado pelo RLS.

**Confirmação de e-mail:** com "Confirm email" ligado, o cadastro mostra "Confirme seu e-mail". O login só funciona depois de clicar no link recebido, que volta para `/login?confirmado=1`. O e-mail padrão do Supabase tem limite baixo de envios por hora; para muitos testes, configure um SMTP próprio em **Authentication → Emails**.

## Build e publicação

```bash
npm run build     # gera a versão de produção na pasta dist/
npm run preview   # serve a pasta dist/ localmente para conferência
```

**Publicação na Vercel:**
1. Envie o projeto para um repositório no GitHub.
2. Em <https://vercel.com>, escolha **Add New… → Project** e importe o repositório.
3. Mantenha o preset **Vite** (build `npm run build`, saída `dist`).
4. Em **Settings → Environment Variables**, cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` (ambiente **Production**, e **Preview** se quiser).
5. Clique em **Deploy** (ou **Redeploy** depois de mudar as variáveis: elas entram no build).

O arquivo `vercel.json` redireciona todas as rotas para o `index.html`. Assim, endereços como `/catalogo` e `/suporte` funcionam mesmo quando abertos diretamente.

## Integrantes

- Beatriz Fonseca — RM572180
- Luana Oliveira — RM571273

## Observações e limitações

- **Backend:** apenas o Supabase (Auth e tabela `profiles`). Não há recuperação de senha nem login social; "Esqueci a senha" leva à página em construção.
- **Perfil:** somente leitura nesta etapa (a política de atualização já existe no banco).
- **Armazenamento local:** favoritos, carrinho e pesquisas recentes ficam salvos apenas no navegador. A sessão é guardada pelo SDK do Supabase (token, nunca a senha).
- **Serviços externos:** ViaCEP e Nominatim (OpenStreetMap) são consultados direto do navegador, só quando o usuário pede.
- **Carrinho:** não há página de carrinho nem fluxo de compra; o botão apenas registra o item e mostra a quantidade.
- **"Retomar partida":** mostra uma confirmação visual, mas não abre nenhum jogo.
- **Páginas em construção:** Biblioteca (agora protegida por login) e Fórum, assim como no projeto original.
- **Dados dos jogos:** preços, estúdios e avaliações seguem o protótipo original e não representam dados reais.
