import { Link } from 'react-router-dom';
import SearchBar from './SearchBar.jsx';
import CategoryFilter from './CategoryFilter.jsx';
import GameCard from './GameCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { categories, games } from '../data/games.js';
import { normalize } from '../data/format.js';

// Catálogo reaproveitado da versão React anterior: busca + categoria + favoritos.
// É "controlado": quem usa decide onde guardar os filtros (estado local na Home, URL no Catálogo).
export default function CatalogBrowser({ filters, onChange, showSearch = true }) {
  const { isLogged, favorites, showToast } = useApp();
  const { query = '', category = 'Todos', onlyFavorites = false } = filters;

  const term = normalize(query);
  const visibleGames = games.filter((game) => {
    const haystack = normalize([game.name, game.studio, ...game.categories].join(' '));
    const matchesSearch = !term || haystack.includes(term);
    const matchesCategory = category === 'Todos' || game.categories.includes(category);
    const matchesFavorites = !onlyFavorites || favorites.includes(game.id);
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const favoriteGameCount = games.filter((game) => favorites.includes(game.id)).length;
  const hasFilters = query !== '' || category !== 'Todos' || onlyFavorites;
  const clear = () => onChange({ query: '', category: 'Todos', onlyFavorites: false });

  function toggleOnlyFavorites() {
    if (!isLogged) {
      showToast('Faça login para ver seus favoritos.');
      return;
    }
    onChange({ onlyFavorites: !onlyFavorites });
  }

  return (
    <div className="catalog-browser">
      {showSearch && <SearchBar value={query} onChange={(value) => onChange({ query: value })} />}

      <CategoryFilter
        categories={categories}
        activeCategory={category}
        onSelect={(value) => onChange({ category: value })}
      />

      <div className="catalog-toolbar">
        <span aria-live="polite">
          Mostrando <b>{visibleGames.length}</b> de {games.length} jogos
          {category !== 'Todos' && <> › <span className="toolbar-tag">{category}</span></>}
          {query && <> › <span className="toolbar-tag">Busca: {query}</span></>}
          {onlyFavorites && <> › <span className="toolbar-tag">Favoritos</span></>}
        </span>
        <div className="toolbar-actions">
          {hasFilters && (
            <button type="button" className="text-button" onClick={clear}>
              Limpar filtros
            </button>
          )}
          <button
            type="button"
            className={`outline-button favorites-toggle${onlyFavorites ? ' is-added' : ''}`}
            aria-pressed={onlyFavorites}
            onClick={toggleOnlyFavorites}
          >
            <span aria-hidden="true">♥</span> Meus favoritos
            {isLogged && <span className="favorites-count">{favoriteGameCount}</span>}
          </button>
        </div>
      </div>

      {visibleGames.length === 0 ? (
        <div className="catalog-empty">
          <p>
            {onlyFavorites && favoriteGameCount === 0
              ? 'Você ainda não favoritou nenhum jogo.'
              : 'Nenhum jogo encontrado com esses filtros.'}
          </p>
          <button type="button" className="green-button" onClick={clear}>
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="game-grid">
          {visibleGames.map((game) => (
            <GameCard key={game.id} game={game} showDetails />
          ))}
        </div>
      )}

      {!showSearch && (
        <p className="catalog-more">
          <Link to="/catalogo">Abrir catálogo completo</Link>
        </p>
      )}
    </div>
  );
}
