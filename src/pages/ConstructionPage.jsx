import { Link } from 'react-router-dom';
import logo from '../assets/logo/logo-iara-games.svg';
import usePageTitle from '../hooks/usePageTitle.js';

// Tela "Em construção" do projeto original. Usada por Biblioteca, Perfil, Fórum,
// pela página genérica de construção e pela página 404.
export default function ConstructionPage({ title, text, pageTitle, badge = 'EM CONSTRUÇÃO' }) {
  usePageTitle(pageTitle || title);

  return (
    <div className="legacy-page construction-page">
      <main className="construction-main" id="conteudo" tabIndex={-1}>
        <div className="construction-card">
          <img src={logo} alt="Logo Iara Games" className="construction-logo img-fluid" />
          <span className="construction-badge">{badge}</span>
          <h1 className="construction-title">{title}</h1>
          <p className="construction-text">{text}</p>
          <Link to="/" className="button button-primary">
            <span>Voltar para a Loja</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
