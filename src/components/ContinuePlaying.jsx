import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { continuePlaying } from '../data/games.js';
import { useApp } from '../context/AppContext.jsx';

// "Continue jogando" (Home logada). Retomar partida é demonstrativo, como no original:
// o botão confirma a ação por alguns segundos e volta ao estado inicial.
export default function ContinuePlaying() {
  const [resumed, setResumed] = useState(null);
  const timer = useRef();
  const { showToast } = useApp();

  useEffect(() => () => clearTimeout(timer.current), []);

  function resume(id) {
    if (resumed === id) return;
    setResumed(id);
    showToast('Partida retomada com sucesso');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setResumed(null), 2200);
  }

  return (
    <section className="section continue-section">
      <div className="container-fluid section-container">
        <div className="section-heading">
          <div>
            <h2>Continue jogando</h2>
            <p>Você possui {continuePlaying.length} jogos em andamento</p>
          </div>
          <Link to="/biblioteca">VER MINHA BIBLIOTECA</Link>
        </div>
        <div className="continue-grid">
          {continuePlaying.map((game) => (
            <article key={game.id} className={`continue-card${game.extra ? ' continue-card-extra' : ''}`}>
              <img src={game.image} alt={game.alt || game.name} />
              <div className="continue-info">
                <strong>{game.name}</strong>
                <small>{game.studio}</small>
                <div className="progress" role="progressbar" aria-valuenow={game.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progresso em ${game.name}`}>
                  <span style={{ width: `${game.progress}%` }}></span>
                </div>
              </div>
              <span className="progress-value">{game.progress}%</span>
              <button
                type="button"
                className="green-button continue-button"
                aria-disabled={resumed === game.id}
                aria-label={`${resumed === game.id ? 'Partida retomada' : 'Retomar partida'}: ${game.name}`}
                onClick={() => resume(game.id)}
              >
                {resumed === game.id ? (
                  <>
                    PARTIDA RETOMADA <span aria-hidden="true">✓</span>
                  </>
                ) : (
                  <>
                    RETOMAR PARTIDA <span aria-hidden="true">▶</span>
                  </>
                )}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
