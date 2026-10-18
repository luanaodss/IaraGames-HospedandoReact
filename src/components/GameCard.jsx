import heartIcon from '../assets/icons/coracao.svg';
import cartIcon from '../assets/icons/carrinho.svg';
import { useApp } from '../context/AppContext.jsx';
import { formatPrice } from '../data/format.js';

// Card de jogo compartilhado (Home e Catálogo): carrinho e favoritos com retorno visual imediato.
export default function GameCard({ game, showDetails = false }) {
  const { isLogged, favorites, toggleFavorite, cart, addToCart } = useApp();
  const isFavorite = isLogged && favorites.includes(game.id);
  const inCart = isLogged && cart.includes(game.id);
  const discount = Math.round((1 - game.price / game.oldPrice) * 100);

  return (
    <article className={`game-card${isFavorite ? ' is-favorite' : ''}`}>
      <div className="game-media">
        <img src={game.image} alt={game.name} loading="lazy" />
        <span className="rating">
          <span aria-hidden="true">★</span>
          <span className="visually-hidden">Avaliação</span> {game.rating.toFixed(1)}
        </span>
        <div className="tags">
          {game.categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>
      </div>

      <div className="game-body">
        <h3>{game.name}</h3>
        {showDetails && <small className="game-studio">{game.studio}</small>}
        {showDetails && game.tagline && <p className="game-tagline">{game.tagline}</p>}

        <div className="game-price">
          {showDetails && <span className="discount">-{discount}%</span>}
          <del>{formatPrice(game.oldPrice)}</del>
          <strong>{formatPrice(game.price)}</strong>
        </div>

        <div className="game-actions">
          <button
            type="button"
            className={`outline-button card-button${inCart ? ' is-added' : ''}`}
            aria-label={`${inCart ? 'Adicionado ao carrinho' : 'Adicionar ao carrinho'}: ${game.name}`}
            onClick={() => addToCart(game.id)}
          >
            <span>{inCart ? 'Adicionado ao carrinho' : 'Adicionar ao carrinho'}</span>
            <img src={cartIcon} alt="" />
          </button>
          <button
            type="button"
            className={`outline-button favorite-button${isFavorite ? ' is-added' : ''}`}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `Remover ${game.name} dos favoritos` : `Favoritar ${game.name}`}
            title={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
            onClick={() => toggleFavorite(game.id, game.name)}
          >
            <img src={heartIcon} alt="" />
          </button>
        </div>
      </div>
    </article>
  );
}
