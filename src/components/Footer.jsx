import { Link } from 'react-router-dom';
import logo from '../assets/logo/logo-iara-games.svg';

// Rodapé da Home original. Links que no original apontavam para "#"
// agora levam à página "Em construção", para que nenhum link fique sem destino.
const columns = [
  {
    title: 'PRODUTO',
    links: [
      { label: 'Loja', to: '/' },
      { label: 'Catálogo', to: '/catalogo' },
      { label: 'Biblioteca', to: '/biblioteca' },
      { label: 'Comunidade', to: '/forum' },
      { label: 'Suporte', to: '/suporte' },
    ],
  },
  {
    title: 'DESENVOLVEDORES',
    links: ['Publicar Jogo', 'Documentação', 'API', 'Ferramentas'].map((label) => ({ label, to: '/em-construcao' })),
  },
  {
    title: 'EMPRESA',
    links: ['Sobre Nós', 'Blog', 'Carreiras', 'Imprensa'].map((label) => ({ label, to: '/em-construcao' })),
  },
  {
    title: 'LEGAL',
    links: ['Termos de Uso', 'Privacidade', 'Cookies', 'Licenças'].map((label) => ({ label, to: '/em-construcao' })),
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-fluid section-container footer-main">
        <div className="footer-brand">
          <img src={logo} alt="Iara Games" />
          <p>
            A plataforma que celebra a<br />
            cultura brasileira. 🇧🇷
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2>{column.title}</h2>
            {column.links.map((link) => (
              <Link key={link.label} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="container-fluid section-container footer-bottom">
        <span>© 2026 Iara Games. Todos os direitos reservados.</span>
        <span>Twitter &nbsp;&nbsp; Discord &nbsp;&nbsp; Instagram</span>
      </div>
    </footer>
  );
}
