import { useRef, useState } from 'react';
import { faqs, supportCategories } from '../data/support.js';
import { normalize } from '../data/format.js';
import usePageTitle from '../hooks/usePageTitle.js';

// Central de Suporte (suporte.html). O acordeão do FAQ, que no original usava o JS do
// Bootstrap, agora é controlado por estado React. A busca filtra as perguntas frequentes.
export default function SupportPage() {
  const [openId, setOpenId] = useState(null);
  const [query, setQuery] = useState('');
  const faqRef = useRef(null);
  usePageTitle('Suporte');

  const term = normalize(query);
  const visibleFaqs = faqs.filter(
    (faq) => !term || normalize(`${faq.question} ${faq.answer}`).includes(term)
  );

  function handleSearch(event) {
    event.preventDefault();
    faqRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="legacy-page support-page-body">
      <main id="conteudo" tabIndex={-1}>
        <section className="support-hero">
          <div className="container">
            <h1 className="support-hero-title">Central de Suporte</h1>
            <p className="support-hero-subtitle">Procure por ajuda ou busque assuntos que possam sanar dúvidas</p>
            <form className="support-search-wrapper" role="search" onSubmit={handleSearch}>
              <label className="support-search-bar" htmlFor="support-search-input">
                <input
                  type="search"
                  id="support-search-input"
                  className="support-search-input"
                  placeholder="O que você está procurando?"
                  aria-label="Pesquisar nas perguntas frequentes"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <button className="support-search-btn" type="submit" aria-label="Pesquisar">
                  <i className="bi bi-search" aria-hidden="true"></i>
                </button>
              </label>
            </form>
          </div>
        </section>

        <section className="section support-categories" aria-label="Categorias de suporte">
          <div className="container">
            <div className="row g-4">
              {supportCategories.map((category) => (
                <div key={category.title} className="col-12 col-md-6 col-lg-4">
                  <article className="support-card">
                    <i className={`bi ${category.icon} support-card-icon`} aria-hidden="true"></i>
                    <h2 className="support-card-title">{category.title}</h2>
                    <p className="support-card-text">{category.text}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section support-faq" id="faq" ref={faqRef}>
          <div className="container">
            <div className="section-header section-header--between">
              <h2 className="section-title">Perguntas Frequentes</h2>
            </div>

            {visibleFaqs.length === 0 ? (
              <p className="faq-empty">
                Nenhuma pergunta encontrada para “{query}”.{' '}
                <button type="button" className="text-button" onClick={() => setQuery('')}>
                  Limpar busca
                </button>
              </p>
            ) : (
              <div className="accordion faq-accordion">
                {visibleFaqs.map((faq) => {
                  const isOpen = openId === faq.id;
                  return (
                    <div key={faq.id} className="faq-item accordion-item">
                      <h3 className="accordion-header">
                        <button
                          className={`faq-question accordion-button${isOpen ? '' : ' collapsed'}`}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={faq.id}
                          onClick={() => setOpenId(isOpen ? null : faq.id)}
                        >
                          {faq.question}
                        </button>
                      </h3>
                      <div id={faq.id} className={`accordion-collapse collapse${isOpen ? ' show' : ''}`}>
                        <div className="accordion-body faq-answer">{faq.answer}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="section support-contact-cta">
          <div className="container">
            <div className="support-cta-banner">
              <i className="bi bi-envelope support-cta-icon" aria-hidden="true"></i>
              <div className="support-cta-text">
                <h2 className="support-cta-title">Ainda Precisa de Ajuda?</h2>
                <p className="support-cta-desc">Entre em contato ou fale diretamente com o nosso suporte</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
