import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Toast from './components/Toast.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SupportPage from './pages/SupportPage.jsx';
import ConstructionPage from './pages/ConstructionPage.jsx';

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Páginas com Header e Footer compartilhados */}
        <Route element={<Layout />}>
          {/* "/" mostra a Home de visitante ou a Home logada, conforme a sessão */}
          <Route index element={<Home />} />
          <Route path="catalogo" element={<CatalogPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="suporte" element={<SupportPage />} />
        </Route>

        {/* Páginas que no original eram apenas "Em construção" (tela isolada, sem header/rodapé) */}
        <Route
          path="biblioteca"
          element={<ConstructionPage title="Biblioteca" text="Sua biblioteca está sendo preparada." />}
        />
        <Route
          path="perfil"
          element={<ConstructionPage title="Meu perfil" text="A área de perfil está sendo preparada." />}
        />
        <Route
          path="forum"
          element={<ConstructionPage title="Fórum" text="A comunidade Iara Games estará disponível em breve." />}
        />
        <Route
          path="em-construcao"
          element={
            <ConstructionPage
              pageTitle="Em construção"
              title="Essa página ainda está sendo desenvolvida"
              text="Estamos trabalhando para disponibilizar essa funcionalidade em breve."
            />
          }
        />

        {/* Endereços antigos (.html) redirecionam para as novas rotas */}
        <Route path="index.html" element={<Navigate to="/" replace />} />
        <Route path="index-visitante.html" element={<Navigate to="/" replace />} />
        <Route path="login-page.html" element={<Navigate to="/login" replace />} />
        <Route path="suporte.html" element={<Navigate to="/suporte" replace />} />
        <Route path="biblioteca-usuario.html" element={<Navigate to="/biblioteca" replace />} />
        <Route path="perfil-usuario.html" element={<Navigate to="/perfil" replace />} />
        <Route path="forum.html" element={<Navigate to="/forum" replace />} />
        <Route path="em-construcao.html" element={<Navigate to="/em-construcao" replace />} />

        <Route
          path="*"
          element={
            <ConstructionPage
              badge="ERRO 404"
              pageTitle="Página não encontrada"
              title="Página não encontrada"
              text="O endereço acessado não existe na plataforma."
            />
          }
        />
      </Routes>

      <Toast />
    </>
  );
}
