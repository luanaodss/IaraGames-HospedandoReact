import { useSearchParams } from 'react-router-dom';
import CatalogBrowser from '../components/CatalogBrowser.jsx';
import { categories } from '../data/games.js';
import usePageTitle from '../hooks/usePageTitle.js';

// Página de catálogo (versão React anterior). Os filtros ficam na URL
// (?busca=...&categoria=...&favoritos=1), então a busca do header e o
// "Descobrir jogo" da Home abrem o catálogo já filtrado.
export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  usePageTitle('Catálogo');

  const categoryParam = params.get('categoria');
  const filters = {
    query: params.get('busca') || '',
    category: categories.includes(categoryParam) ? categoryParam : 'Todos',
    onlyFavorites: params.get('favoritos') === '1',
  };

  function handleChange(partial) {
    const next = { ...filters, ...partial };
    const nextParams = new URLSearchParams();
    if (next.query) nextParams.set('busca', next.query);
    if (next.category !== 'Todos') nextParams.set('categoria', next.category);
    if (next.onlyFavorites) nextParams.set('favoritos', '1');
    setParams(nextParams, { replace: true });
  }

  return (
    <main id="conteudo" tabIndex={-1}>
      <section className="catalog-hero">
        <div className="container-fluid section-container">
          <h1>Explore todos os jogos</h1>
          <p>Encontre seu próximo favorito entre títulos brasileiros</p>
        </div>
      </section>

      <section className="section catalog-section catalog-page" aria-label="Catálogo de jogos">
        <div className="container-fluid section-container">
          <h2 className="visually-hidden">Lista de jogos</h2>
          <CatalogBrowser filters={filters} onChange={handleChange} />
        </div>
      </section>
    </main>
  );
}
