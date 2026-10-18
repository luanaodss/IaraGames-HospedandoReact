import { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel.jsx';
import ContinuePlaying from '../components/ContinuePlaying.jsx';
import TopThree from '../components/TopThree.jsx';
import GameSection from '../components/GameSection.jsx';
import CatalogBrowser from '../components/CatalogBrowser.jsx';
import { useApp } from '../context/AppContext.jsx';
import { recommendedIds, topRatedIds } from '../data/games.js';
import usePageTitle from '../hooks/usePageTitle.js';

// Home única: as seções mudam conforme o usuário está logado (index.html)
// ou é visitante (index-visitante.html).
export default function Home() {
  const { isLogged } = useApp();
  const [filters, setFilters] = useState({ query: '', category: 'Todos', onlyFavorites: false });
  usePageTitle(null);

  return (
    <main id="conteudo" tabIndex={-1}>
      <h1 className="visually-hidden">Iara Games — Loja de jogos brasileiros</h1>
      <HeroCarousel />

      {isLogged && <ContinuePlaying />}
      {isLogged && (
        <GameSection
          id="recommendations"
          className="recommendations-section"
          title="Recomendados para você"
          subtitle="Baseado na sua lista de desejos e biblioteca"
          gameIds={recommendedIds}
        />
      )}

      <TopThree />

      <section className="section catalog-section" id="catalogo">
        <div className="container-fluid section-container">
          <div className="catalog-heading">
            <h2>Explore todos os jogos</h2>
            <p>Encontre seu próximo favorito entre títulos brasileiros</p>
          </div>
          <CatalogBrowser
            filters={filters}
            onChange={(partial) => setFilters((current) => ({ ...current, ...partial }))}
            showSearch={false}
          />
        </div>
      </section>

      {!isLogged && (
        <GameSection className="rated-section" title="Mais Bem Avaliados" gameIds={topRatedIds} />
      )}

      <section className="cta-section">
        <div className="container-fluid section-container">
          {isLogged ? (
            <div className="cta">
              <div>
                <h2>Menos procura, mais diversão</h2>
                <p>Retome seus jogos, descubra novas experiências e encontre rapidamente o que combina com você.</p>
              </div>
              <div className="cta-actions">
                <Link className="green-button button-link" to="/biblioteca">
                  Continuar Jogando
                </Link>
                <a className="outline-button button-link" href="#recommendations">
                  Explorar Recomendações
                </a>
              </div>
            </div>
          ) : (
            <div className="cta guest-cta">
              <div>
                <h2>Descubra o universo dos jogos brasileiros</h2>
                <p>
                  Explore histórias, culturas e talentos únicos.
                  <br />
                  Apoie desenvolvedores independentes e comece sua jornada.
                </p>
              </div>
              <div className="cta-actions">
                <Link className="green-button button-link" to="/login">
                  Criar conta
                </Link>
                <Link className="outline-button button-link" to="/catalogo">
                  Explorar Jogos
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
