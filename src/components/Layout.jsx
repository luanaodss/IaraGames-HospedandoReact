import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

// A Home (vídeo no topo) usa o header transparente, como no original;
// as demais usam o header com fundo sólido (como no Login e Suporte originais).
const TRANSPARENT_HEADER_ROUTES = ['/'];

export default function Layout() {
  const { pathname } = useLocation();
  const transparent = TRANSPARENT_HEADER_ROUTES.includes(pathname);

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header solid={!transparent} />
      <Outlet />
      <Footer />
    </>
  );
}
