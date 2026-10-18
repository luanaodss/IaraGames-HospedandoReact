import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../assets/icons/busca.svg';
import { categories, defaultRecentSearches, getGame, searchSuggestions } from '../data/games.js';
import { readJSON, writeJSON } from '../data/storage.js';
import { useApp } from '../context/AppContext.jsx';

const RECENT_KEY = 'iaraRecentSearches';
const popularCategories = categories.filter((category) => category !== 'Todos').slice(0, 5);

// Busca do header com painel (pesquisas recentes, categorias populares e sugestões),
// como no projeto original. Aplicar uma busca leva ao catálogo com o filtro já ativo.
export default function HeaderSearch() {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState(() => readJSON(RECENT_KEY, defaultRecentSearches));
  const wrapRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useApp();

  useEffect(() => {
    if (!open) return undefined;
    // Fecha ao clicar fora ou quando o foco do teclado sai da área de busca.
    function handleOutside(event) {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('click', handleOutside);
    document.addEventListener('focusin', handleOutside);
    return () => {
      document.removeEventListener('click', handleOutside);
      document.removeEventListener('focusin', handleOutside);
    };
  }, [open]);

  function saveRecent(term) {
    const next = [term, ...recent.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, 4);
    setRecent(next);
    writeJSON(RECENT_KEY, next);
  }

  function applySearch(term) {
    const clean = term.trim();
    if (!clean) return;
    setValue(clean);
    saveRecent(clean);
    setOpen(false);
    navigate(`/catalogo?busca=${encodeURIComponent(clean)}`);
    showToast(`Busca aplicada: ${clean}`);
  }

  function applyCategory(category) {
    setOpen(false);
    navigate(`/catalogo?categoria=${encodeURIComponent(category)}`);
    showToast(`Filtro aplicado: ${category}`);
  }

  return (
    <div className="search-wrap" ref={wrapRef}>
      <label className="search-box" htmlFor="game-search">
        <input
          id="game-search"
          type="search"
          autoComplete="off"
          placeholder="Busque por jogos, estúdios ou categoria"
          aria-label="Buscar jogos"
          value={value}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onChange={(event) => {
            setValue(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              applySearch(value);
            }
            if (event.key === 'Escape') {
              setOpen(false);
              event.currentTarget.blur();
            }
          }}
        />
        <img src={searchIcon} alt="" />
      </label>

      <div className={`search-panel${open ? ' open' : ''}`} id="search-panel">
        {recent.length > 0 && (
          <>
            <p className="search-label">Pesquisas recentes...</p>
            {recent.map((term) => (
              <button key={term} className="search-history" type="button" onClick={() => applySearch(term)}>
                <span aria-hidden="true">◷</span> {term}
              </button>
            ))}
            <hr />
          </>
        )}

        <p className="search-label">Categorias Populares</p>
        <div className="search-categories">
          {popularCategories.map((category) => (
            <button key={category} type="button" onClick={() => applyCategory(category)}>
              {category}
            </button>
          ))}
        </div>

        <p className="search-label search-you-like">Você pode gostar...</p>
        {searchSuggestions.map((id) => {
          const game = getGame(id);
          return (
            <button key={id} className="search-recommendation" type="button" onClick={() => applySearch(game.name)}>
              <img src={game.image} alt="" />
              <span>
                <strong>{game.name}</strong>
                <small>{game.studio}</small>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
