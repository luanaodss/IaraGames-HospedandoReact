import { useCallback, useEffect, useRef, useState } from 'react';
import heartIcon from '../assets/icons/coracao.svg';
import { heroSlides } from '../data/games.js';
import { useApp } from '../context/AppContext.jsx';

const INTERVAL = 7000;

// Carrossel de destaques com vídeo: setas, pontos e troca automática, como no script.js original.
// A troca automática pausa com o mouse ou o foco do teclado sobre o destaque e fica desligada
// para quem pede menos movimento no sistema. A "lista de desejos" usa os favoritos do catálogo.
export default function HeroCarousel() {
  const [current, setCurrent] = useState(heroSlides.length - 1); // original começava em Cururu
  const [changing, setChanging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduceMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  const changeTimer = useRef();
  const { isLogged, favorites, toggleFavorite } = useApp();

  const paused = hovered || focused || reduceMotion;

  const slide = heroSlides[current];
  const inWishlist = isLogged && favorites.includes(slide.id);

  const goTo = useCallback((index) => {
    setChanging(true);
    clearTimeout(changeTimer.current);
    changeTimer.current = setTimeout(() => {
      setCurrent((index + heroSlides.length) % heroSlides.length);
      setChanging(false);
    }, 150);
  }, []);

  // Troca automática; reinicia a contagem a cada mudança de slide.
  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => goTo(current + 1), INTERVAL);
    return () => clearInterval(timer);
  }, [current, paused, goTo]);

  useEffect(() => () => clearTimeout(changeTimer.current), []);

  return (
    <section
      className={`hero${changing ? ' is-changing' : ''}`}
      aria-label="Destaque"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      {/* key: troca o elemento a cada destaque, então o vídeo novo carrega e inicia sozinho */}
      <video className="hero-video" autoPlay={!reduceMotion} muted loop playsInline aria-hidden="true" key={slide.id}>
        <source src={slide.video} type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>

      <button className="hero-arrow hero-arrow-left" type="button" aria-label="Destaque anterior" onClick={() => goTo(current - 1)}>
        ‹
      </button>
      <button className="hero-arrow hero-arrow-right" type="button" aria-label="Próximo destaque" onClick={() => goTo(current + 1)}>
        ›
      </button>

      <div className="container hero-container">
        <div className="hero-content">
          <img className="hero-logo" src={slide.logo} alt={slide.name} />
          <p>{slide.description}</p>
          <div className="hero-actions">
            <button
              className={`outline-button wishlist-button${inWishlist ? ' is-added' : ''}`}
              type="button"
              aria-pressed={inWishlist}
              onClick={() => toggleFavorite(slide.id, slide.name)}
            >
              <span>{inWishlist ? 'Adicionado à lista de desejos' : 'Adicionar à lista de desejos'}</span>
              <img src={heartIcon} alt="" />
            </button>
            <span className="hero-status">{slide.status}</span>
          </div>
        </div>
      </div>

      <div className="hero-dots" role="group" aria-label="Navegação dos destaques">
        {heroSlides.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={index === current ? 'active' : ''}
            aria-label={`Destaque ${index + 1}: ${item.name}`}
            aria-current={index === current}
            onClick={() => goTo(index)}
          ></button>
        ))}
      </div>
    </section>
  );
}
