import { Link } from 'react-router-dom';
import GameCard from './GameCard.jsx';
import { getGame } from '../data/games.js';

// Seção de cards da Home ("Recomendados para você" / "Mais Bem Avaliados").
export default function GameSection({ id, className = '', title, subtitle, gameIds }) {
  return (
    <section className={`section ${className}`} id={id}>
      <div className="container-fluid section-container">
        <div className={`section-heading${subtitle ? ' compact' : ''}`}>
          {subtitle ? (
            <div>
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>
          ) : (
            <h2>{title}</h2>
          )}
          <Link to="/catalogo">VER TODOS</Link>
        </div>
        <div className="recommendation-grid">
          {gameIds.map((gameId) => (
            <GameCard key={gameId} game={getGame(gameId)} />
          ))}
        </div>
      </div>
    </section>
  );
}
