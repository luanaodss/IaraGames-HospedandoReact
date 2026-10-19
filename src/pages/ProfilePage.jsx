import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatCep } from '../data/viacep.js';
import FormAlert from '../components/FormAlert.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

// Área logada: mostra os dados do perfil lidos da tabela "profiles" do Supabase.
// A política RLS garante que cada usuário só consegue ler a própria linha.
export default function ProfilePage() {
  const { user, profile, loadProfile } = useApp();
  const [status, setStatus] = useState({ state: 'loading', message: '' });
  const userId = user?.id;
  usePageTitle('Meu perfil');

  const refresh = useCallback(async () => {
    if (!userId) return;
    setStatus({ state: 'loading', message: '' });
    const { data, error } = await loadProfile(userId);
    if (error) setStatus({ state: 'error', message: 'Não foi possível carregar seu perfil agora. Tente novamente.' });
    else if (!data) setStatus({ state: 'empty', message: 'Seu perfil ainda não foi encontrado no banco de dados.' });
    else setStatus({ state: 'ok', message: '' });
  }, [userId, loadProfile]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const address = profile
    ? [
        [profile.logradouro, profile.numero].filter(Boolean).join(', '),
        profile.complemento,
        profile.bairro,
        [profile.cidade, profile.estado].filter(Boolean).join(' / '),
        profile.cep ? `CEP ${formatCep(profile.cep)}` : '',
      ].filter(Boolean)
    : [];

  return (
    <div className="legacy-page">
      <main className="login-page" id="conteudo" tabIndex={-1}>
        <section className="container" aria-labelledby="perfil-title">
          <div className="login-wrapper signup-wrapper">
            <h1 className="login-title" id="perfil-title">
              Meu perfil
            </h1>

            {status.state === 'loading' && (
              <p className="lookup-status lookup-status--loading" role="status">
                Carregando seu perfil…
              </p>
            )}
            {status.state === 'error' && (
              <FormAlert type="error">
                {status.message}{' '}
                <button type="button" className="link-button" onClick={refresh}>
                  Tentar de novo
                </button>
              </FormAlert>
            )}
            {status.state === 'empty' && <FormAlert type="info">{status.message}</FormAlert>}

            <dl className="profile-list">
              <div>
                <dt>Nome</dt>
                <dd>{profile?.full_name || user?.name}</dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>{user?.email}</dd>
              </div>
              {address.length > 0 && (
                <div>
                  <dt>Endereço</dt>
                  <dd>
                    {address.map((line) => (
                      <span key={line} className="d-block">
                        {line}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            <p className="field-hint profile-note">
              Seus dados ficam vinculados à sua conta e só podem ser lidos ou alterados por você. Sua senha é
              gerenciada pelo sistema de autenticação e nunca é exibida ou armazenada nesta página.
            </p>

            <Link to="/catalogo" className="button button-primary">
              <span>Explorar o catálogo</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
