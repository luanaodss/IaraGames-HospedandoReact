import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bannerLogin from '../assets/images/banner-login.png';
import grafismo from '../assets/images/grafismo.svg';
import { useApp } from '../context/AppContext.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

// Login demonstrativo (login-page.html): não há backend nem validação de senha.
// Qualquer e-mail válido e senha preenchida iniciam a sessão de exemplo.
export default function LoginPage() {
  const { login, showToast } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', senha: '', lembrar: true });
  usePageTitle('Entrar');

  function update(field) {
    return (event) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setForm((current) => ({ ...current, [field]: value }));
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    login(form.lembrar);
    showToast('Login realizado (demonstração). Bem-vinda, Ana Beatriz!');
    navigate('/');
  }

  return (
    <div className="legacy-page">
      <main className="login-page" id="conteudo" tabIndex={-1}>
        <section className="login-section container" aria-labelledby="login-title">
          <div className="login-wrapper">
            <div className="login-grid">
              <div className="login-panel">
                <div className="login-panel-content">
                  <h1 className="login-title" id="login-title">
                    Iniciar Sessão
                  </h1>

                  <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        E-mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="seuemail@iaragames.com"
                        autoComplete="email"
                        required
                        value={form.email}
                        onChange={update('email')}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="senha" className="form-label">
                        Senha
                      </label>
                      <input
                        type="password"
                        id="senha"
                        name="senha"
                        className="form-control"
                        autoComplete="current-password"
                        required
                        value={form.senha}
                        onChange={update('senha')}
                      />
                    </div>

                    <div className="login-form-row">
                      <label className="checkbox-field form-check">
                        <input
                          type="checkbox"
                          name="lembrar"
                          className="form-check-input"
                          checked={form.lembrar}
                          onChange={update('lembrar')}
                        />
                        <span className="form-check-label">Lembrar-me</span>
                      </label>
                      <Link to="/em-construcao" className="form-link">
                        Esqueci a senha
                      </Link>
                    </div>

                    <button type="submit" className="button button-secondary login-submit">
                      <span>Entrar</span>
                    </button>
                  </form>

                  <p className="login-demo-note">
                    Login demonstrativo: não há verificação de senha nem cadastro real.
                  </p>

                  <div className="login-divider"></div>

                  <p className="login-register">
                    Sua primeira vez aqui? <Link to="/em-construcao">Criar conta</Link>
                  </p>
                </div>
              </div>

              <div className="login-banner">
                <img
                  src={bannerLogin}
                  alt="Ilustração da Iara em ambiente de floresta brasileira"
                  className="login-banner-image"
                />
                <img src={grafismo} alt="" className="login-banner-graphic" />
                <div className="login-banner-overlay"></div>
                <p className="login-banner-text">
                  Vem jogar com a gente do <em>jeitinho</em> brasileiro.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
