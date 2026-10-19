import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import bannerLogin from '../assets/images/banner-login.png';
import grafismo from '../assets/images/grafismo.svg';
import { useApp } from '../context/AppContext.jsx';
import { authErrorMessage } from '../data/authErrors.js';
import FormAlert from '../components/FormAlert.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Login com Supabase Auth (e-mail e senha). As credenciais são validadas no servidor;
// a sessão é mantida pelo SDK do Supabase.
export default function LoginPage() {
  const { login, showToast, isLogged, authReady, authConfigured } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: location.state?.email || '', senha: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  usePageTitle('Entrar');

  const from = location.state?.from || '/';
  const notice =
    location.state?.message ||
    (params.get('confirmado') ? 'E-mail confirmado. Agora é só entrar com sua senha.' : '');

  if (authReady && isLogged && !loading) return <Navigate to={from} replace />;

  function update(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: '' }));
    };
  }

  function validate() {
    const next = {};
    if (!form.email.trim()) next.email = 'Informe seu e-mail.';
    else if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'Digite um e-mail válido, como nome@exemplo.com.';
    if (!form.senha) next.senha = 'Informe sua senha.';
    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');
    const found = validate();
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    setLoading(true);
    const { error } = await login(form.email.trim(), form.senha);
    setLoading(false);
    if (error) {
      setSubmitError(error.message === 'not-configured' ? 'A autenticação ainda não foi configurada neste ambiente.' : authErrorMessage(error));
      return;
    }
    showToast('Login realizado. Bem-vindo(a) de volta!');
    navigate(from, { replace: true });
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

                  {!authConfigured && (
                    <FormAlert type="error">
                      A autenticação ainda não foi configurada neste ambiente (variáveis do Supabase ausentes).
                    </FormAlert>
                  )}
                  {notice && <FormAlert type="success">{notice}</FormAlert>}
                  {location.state?.from && !notice && (
                    <FormAlert type="info">Entre na sua conta para acessar esta página.</FormAlert>
                  )}

                  <form className="login-form" onSubmit={handleSubmit} noValidate aria-busy={loading}>
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
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'email-erro' : undefined}
                        value={form.email}
                        onChange={update('email')}
                      />
                      {errors.email && (
                        <p className="field-error" id="email-erro">
                          {errors.email}
                        </p>
                      )}
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
                        aria-invalid={Boolean(errors.senha)}
                        aria-describedby={errors.senha ? 'senha-erro' : undefined}
                        value={form.senha}
                        onChange={update('senha')}
                      />
                      {errors.senha && (
                        <p className="field-error" id="senha-erro">
                          {errors.senha}
                        </p>
                      )}
                    </div>

                    <div className="login-form-row login-form-row--end">
                      <Link to="/em-construcao" className="form-link">
                        Esqueci a senha
                      </Link>
                    </div>

                    {submitError && <FormAlert type="error">{submitError}</FormAlert>}

                    <button type="submit" className="button button-secondary login-submit" disabled={loading || !authConfigured}>
                      <span>{loading ? 'Entrando…' : 'Entrar'}</span>
                    </button>
                  </form>

                  <div className="login-divider"></div>

                  <p className="login-register">
                    Sua primeira vez aqui? <Link to="/cadastro">Criar conta</Link>
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
