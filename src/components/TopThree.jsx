import { Link } from 'react-router-dom';
import controlIcon from '../assets/icons/control.svg';
import { getGame, topThree } from '../data/games.js';
import { formatPrice } from '../data/format.js';

// "Top 3 em alta essa semana". "Descobrir jogo" abre o catálogo já buscando o título.
export default function TopThree() {
  return (
    <section className="section trending-section">
      <div className="container-fluid section-container">
        <div className="section-heading">
          <h2>Top 3 em alta essa semana</h2>
          <Link to="/catalogo">VER TODOS</Link>
        </div>
        <div className="top-five-grid">
          {topThree.map((item, index) => {
            const game = getGame(item.gameId);
            return (
              <article key={item.gameId} className="ranked-game">
                <div className="rank-number">{index + 1}</div>
                <div className="rank-card">
                  <img src={item.banner} alt="" />
                  <div className={`rank-overlay ${item.overlay}`}></div>
                  <div className="rank-content">
                    <h3>{game.name}</h3>
                    <p>{item.subtitle}</p>
                    <div>
                      <del>{formatPrice(game.oldPrice)}</del>
                      <strong>{formatPrice(game.price)}</strong>
                    </div>
                    <Link
                      className="outline-button discover-button"
                      to={`/catalogo?busca=${encodeURIComponent(game.name)}`}
                      aria-label={`Descobrir jogo: ${game.name}`}
                    >
                      <span>DESCOBRIR JOGO</span>
                      <img src={controlIcon} alt="" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
