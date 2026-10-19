import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { authErrorMessage } from '../data/authErrors.js';
import { CepError, fetchCep, formatCep, normalizeCep } from '../data/viacep.js';
import { UFS, getCurrentPosition, osmEmbed, osmLink, reverseGeocode } from '../data/geo.js';
import FormAlert from '../components/FormAlert.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY = {
  nome: '',
  email: '',
  senha: '',
  confirmar: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
};

const ADDRESS_FIELDS = ['logradouro', 'bairro', 'cidade', 'estado'];

function validate(form) {
  const e = {};
  const nome = form.nome.trim();
  if (!nome) e.nome = 'Informe seu nome completo.';
  else if (nome.split(/\s+/).length < 2) e.nome = 'Informe nome e sobrenome.';

  if (!form.email.trim()) e.email = 'Informe seu e-mail.';
  else if (!EMAIL_PATTERN.test(form.email.trim())) e.email = 'Digite um e-mail válido, como nome@exemplo.com.';

  if (!form.senha) e.senha = 'Crie uma senha.';
  else if (form.senha.length < 8 || !/[A-Za-z]/.test(form.senha) || !/\d/.test(form.senha))
    e.senha = 'A senha precisa ter pelo menos 8 caracteres, com letras e números.';

  if (!form.confirmar) e.confirmar = 'Repita a senha.';
  else if (form.confirmar !== form.senha) e.confirmar = 'As senhas não são iguais.';

  if (!normalizeCep(form.cep)) e.cep = 'Informe o CEP.';
  else if (normalizeCep(form.cep).length !== 8) e.cep = 'O CEP precisa ter 8 dígitos.';

  if (!form.logradouro.trim()) e.logradouro = 'Informe a rua, avenida ou logradouro.';
  if (!form.numero.trim()) e.numero = 'Informe o número (ou "s/n").';
  if (!form.bairro.trim()) e.bairro = 'Informe o bairro.';
  if (!form.cidade.trim()) e.cidade = 'Informe a cidade.';
  if (!UFS.includes(form.estado)) e.estado = 'Selecione o estado.';
  if (form.complemento.length > 80) e.complemento = 'Use no máximo 80 caracteres.';
  return e;
}

function Field({ id, label, error, hint, optional, children }) {
  const describedBy = [hint && `${id}-dica`, error && `${id}-erro`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`form-group signup-field signup-field--${id}`}>
      <label htmlFor={id} className="form-label">
        {label} {optional && <span className="field-optional">(opcional)</span>}
      </label>
      {children({ 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      {hint && (
        <p className="field-hint" id={`${id}-dica`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field-error" id={`${id}-erro`}>
          {error}
        </p>
      )}
    </div>
  );
}

// Cadastro com Supabase Auth + endereço (ViaCEP) + localização opcional (Geolocation API e Nominatim).
export default function SignupPage() {
  const { signUp, showToast, isLogged, authReady, authConfigured } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSentTo, setConfirmationSentTo] = useState('');
  const [cepStatus, setCepStatus] = useState({ state: 'idle', message: '' });
  const [geo, setGeo] = useState({ state: 'idle', message: '', coords: null });
  const [reverse, setReverse] = useState({ state: 'idle', message: '', address: null });
  const cepRequest = useRef(null);
  const reverseRequest = useRef(null);
  usePageTitle('Criar conta');

  useEffect(
    () => () => {
      cepRequest.current?.abort();
      reverseRequest.current?.abort();
    },
    []
  );

  if (authReady && isLogged && !submitting && !confirmationSentTo) return <Navigate to="/perfil" replace />;

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => (current[field] ? { ...current, [field]: '' } : current));
  }

  function update(field) {
    return (event) => setField(field, event.target.value);
  }

  async function handleCepLookup() {
    cepRequest.current?.abort();
    const controller = new AbortController();
    cepRequest.current = controller;
    setCepStatus({ state: 'loading', message: 'Buscando endereço…' });
    try {
      const address = await fetchCep(form.cep, { signal: controller.signal });
      setForm((current) => ({
        ...current,
        cep: formatCep(address.cep),
        logradouro: address.logradouro || current.logradouro,
        bairro: address.bairro || current.bairro,
        cidade: address.cidade,
        estado: address.estado,
      }));
      setErrors((current) => {
        const next = { ...current, cep: '' };
        ADDRESS_FIELDS.forEach((f) => (next[f] = ''));
        return next;
      });
      const partial = !address.logradouro || !address.bairro;
      setCepStatus({
        state: 'ok',
        message: partial
          ? 'Cidade e estado preenchidos. Este CEP é geral: complete rua e bairro.'
          : 'Endereço encontrado. Confira os dados e informe o número.',
      });
    } catch (error) {
      if (error.name === 'AbortError') return;
      const message = error instanceof CepError ? error.message : 'Não foi possível consultar o CEP. Preencha o endereço manualmente.';
      setCepStatus({ state: 'error', message });
      if (error instanceof CepError && ['vazio', 'incompleto', 'nao-encontrado'].includes(error.code)) {
        setErrors((current) => ({ ...current, cep: message }));
      }
    }
  }

  async function handleLocate() {
    setGeo({ state: 'loading', message: 'Aguardando a permissão e a localização do navegador…', coords: null });
    setReverse({ state: 'idle', message: '', address: null });
    try {
      const coords = await getCurrentPosition();
      setGeo({ state: 'ok', message: 'Localização obtida.', coords });
      reverseRequest.current?.abort();
      const controller = new AbortController();
      reverseRequest.current = controller;
      setReverse({ state: 'loading', message: 'Buscando um endereço aproximado…', address: null });
      try {
        const address = await reverseGeocode(coords, { signal: controller.signal });
        setReverse({ state: 'ok', message: '', address });
      } catch (error) {
        if (error.name === 'AbortError') return;
        setReverse({
          state: 'error',
          message: 'Não foi possível converter a localização em endereço. Continue pelo CEP normalmente.',
          address: null,
        });
      }
    } catch (error) {
      setGeo({ state: 'error', message: error.message, coords: null });
    }
  }

  function applyReverseAddress() {
    const a = reverse.address;
    if (!a) return;
    setForm((current) => ({
      ...current,
      cep: a.cep ? formatCep(a.cep) : current.cep,
      logradouro: a.logradouro || current.logradouro,
      bairro: a.bairro || current.bairro,
      cidade: a.cidade || current.cidade,
      estado: UFS.includes(a.estado) ? a.estado : current.estado,
    }));
    setErrors({});
    setCepStatus({ state: 'ok', message: 'Endereço sugerido pela localização. Confira os campos e informe o número.' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');
    const found = validate(form);
    setErrors(found);
    const firstInvalid = Object.keys(found).find((key) => found[key]);
    if (firstInvalid) {
      setSubmitError('Confira os campos destacados antes de continuar.');
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);
    const email = form.email.trim().toLowerCase();
    // Dados de perfil e endereço vão como metadados do cadastro; um gatilho no banco
    // cria a linha em public.profiles vinculada ao id do novo usuário. A senha fica
    // apenas no Supabase Auth (armazenada com hash pelo serviço).
    const { data, error } = await signUp({
      email,
      password: form.senha,
      metadata: {
        full_name: form.nome.trim().replace(/\s+/g, ' '),
        cep: normalizeCep(form.cep),
        logradouro: form.logradouro.trim(),
        numero: form.numero.trim(),
        complemento: form.complemento.trim(),
        bairro: form.bairro.trim(),
        cidade: form.cidade.trim(),
        estado: form.estado,
      },
    });
    setSubmitting(false);

    if (error) {
      const message = error.message === 'not-configured' ? 'A autenticação ainda não foi configurada neste ambiente.' : authErrorMessage(error);
      setSubmitError(message);
      if (/já está cadastrado/.test(message)) {
        setErrors((current) => ({ ...current, email: message }));
        document.getElementById('email')?.focus();
      }
      return;
    }

    // Com confirmação de e-mail ativa, o Supabase não informa erro para e-mails já
    // existentes: devolve um usuário sem identidades.
    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      const message = 'Este e-mail já está cadastrado. Entre com sua senha ou use outro e-mail.';
      setSubmitError(message);
      setErrors((current) => ({ ...current, email: message }));
      document.getElementById('email')?.focus();
      return;
    }

    setForm((current) => ({ ...current, senha: '', confirmar: '' }));
    if (data?.session) {
      showToast('Conta criada! Você já está conectado(a).');
      navigate('/perfil', { replace: true });
    } else {
      setConfirmationSentTo(email);
    }
  }

  if (confirmationSentTo) {
    return (
      <div className="legacy-page">
        <main className="login-page" id="conteudo" tabIndex={-1}>
          <section className="container signup-done" aria-labelledby="signup-done-title">
            <div className="login-wrapper signup-wrapper">
              <h1 className="login-title" id="signup-done-title">
                Confirme seu e-mail
              </h1>
              <FormAlert type="success">
                Conta criada para <strong>{confirmationSentTo}</strong>. Enviamos um link de confirmação para esse e-mail.
              </FormAlert>
              <p className="signup-intro">
                Abra a mensagem, clique no link e depois entre com o e-mail e a senha cadastrados. Se não encontrar, confira a
                caixa de spam.
              </p>
              <Link to="/login" state={{ email: confirmationSentTo }} className="button button-primary">
                <span>Ir para o login</span>
              </Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const busy = submitting;

  return (
    <div className="legacy-page">
      <main className="login-page" id="conteudo" tabIndex={-1}>
        <section className="container" aria-labelledby="signup-title">
          <div className="login-wrapper signup-wrapper">
            <h1 className="login-title" id="signup-title">
              Criar conta
            </h1>
            <p className="signup-intro">
              Todos os campos são obrigatórios, exceto os marcados como opcionais. Já tem conta? <Link to="/login">Entrar</Link>
            </p>

            {!authConfigured && (
              <FormAlert type="error">A autenticação ainda não foi configurada neste ambiente (variáveis do Supabase ausentes).</FormAlert>
            )}

            <form className="signup-form" onSubmit={handleSubmit} noValidate aria-busy={busy}>
              <fieldset className="signup-section">
                <legend>Dados de acesso</legend>
                <div className="signup-grid">
                  <Field id="nome" label="Nome completo" error={errors.nome}>
                    {(a11y) => (
                      <input id="nome" className="form-control" autoComplete="name" value={form.nome} onChange={update('nome')} {...a11y} />
                    )}
                  </Field>
                  <Field id="email" label="E-mail" error={errors.email}>
                    {(a11y) => (
                      <input id="email" type="email" className="form-control" autoComplete="email" placeholder="seuemail@exemplo.com" value={form.email} onChange={update('email')} {...a11y} />
                    )}
                  </Field>
                  <Field id="senha" label="Senha" error={errors.senha} hint="Mínimo de 8 caracteres, com letras e números.">
                    {(a11y) => (
                      <input id="senha" type="password" className="form-control" autoComplete="new-password" value={form.senha} onChange={update('senha')} {...a11y} />
                    )}
                  </Field>
                  <Field id="confirmar" label="Confirmar senha" error={errors.confirmar}>
                    {(a11y) => (
                      <input id="confirmar" type="password" className="form-control" autoComplete="new-password" value={form.confirmar} onChange={update('confirmar')} {...a11y} />
                    )}
                  </Field>
                </div>
              </fieldset>

              <fieldset className="signup-section">
                <legend>Endereço</legend>
                <div className="signup-grid">
                  <div className="signup-cep">
                    <Field id="cep" label="CEP" error={errors.cep} hint="Digite o CEP e clique em Buscar CEP para preencher o endereço.">
                      {(a11y) => (
                        <div className="cep-row">
                          <input
                            id="cep"
                            className="form-control"
                            inputMode="numeric"
                            autoComplete="postal-code"
                            placeholder="00000-000"
                            maxLength={9}
                            value={form.cep}
                            onChange={(event) => setField('cep', formatCep(event.target.value))}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                event.preventDefault();
                                handleCepLookup();
                              }
                            }}
                            {...a11y}
                          />
                          <button type="button" className="button button-primary cep-button" onClick={handleCepLookup} disabled={cepStatus.state === 'loading'}>
                            <span>{cepStatus.state === 'loading' ? 'Buscando…' : 'Buscar CEP'}</span>
                          </button>
                        </div>
                      )}
                    </Field>
                    <div aria-live="polite">
                      {cepStatus.message && cepStatus.state !== 'error' && (
                        <p className={`lookup-status lookup-status--${cepStatus.state}`}>{cepStatus.message}</p>
                      )}
                      {cepStatus.state === 'error' && !errors.cep && <p className="lookup-status lookup-status--error">{cepStatus.message}</p>}
                    </div>
                  </div>

                  <Field id="logradouro" label="Logradouro" error={errors.logradouro}>
                    {(a11y) => (
                      <input id="logradouro" className="form-control" autoComplete="address-line1" value={form.logradouro} onChange={update('logradouro')} {...a11y} />
                    )}
                  </Field>
                  <Field id="numero" label="Número" error={errors.numero}>
                    {(a11y) => <input id="numero" className="form-control" value={form.numero} onChange={update('numero')} {...a11y} />}
                  </Field>
                  <Field id="complemento" label="Complemento" optional error={errors.complemento}>
                    {(a11y) => (
                      <input id="complemento" className="form-control" autoComplete="address-line2" placeholder="Apto, bloco, referência" value={form.complemento} onChange={update('complemento')} {...a11y} />
                    )}
                  </Field>
                  <Field id="bairro" label="Bairro" error={errors.bairro}>
                    {(a11y) => <input id="bairro" className="form-control" value={form.bairro} onChange={update('bairro')} {...a11y} />}
                  </Field>
                  <Field id="cidade" label="Cidade" error={errors.cidade}>
                    {(a11y) => <input id="cidade" className="form-control" autoComplete="address-level2" value={form.cidade} onChange={update('cidade')} {...a11y} />}
                  </Field>
                  <Field id="estado" label="Estado (UF)" error={errors.estado}>
                    {(a11y) => (
                      <select id="estado" className="form-control form-select-dark" autoComplete="address-level1" value={form.estado} onChange={update('estado')} {...a11y}>
                        <option value="">Selecione</option>
                        {UFS.map((uf) => (
                          <option key={uf} value={uf}>
                            {uf}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                </div>
              </fieldset>

              <fieldset className="signup-section">
                <legend>
                  Localização <span className="field-optional">(opcional)</span>
                </legend>
                <p className="field-hint">
                  Se preferir, use a localização do dispositivo para sugerir o endereço. O navegador só pede permissão quando você
                  clica no botão. As coordenadas servem apenas para essa sugestão e não são salvas na sua conta.
                </p>
                <button type="button" className="button button-secondary geo-button" onClick={handleLocate} disabled={geo.state === 'loading'}>
                  <i className="bi bi-geo-alt" aria-hidden="true"></i>
                  <span>{geo.state === 'loading' ? 'Obtendo localização…' : 'Usar minha localização'}</span>
                </button>

                <div aria-live="polite" className="geo-result">
                  {geo.state === 'loading' && <p className="lookup-status lookup-status--loading">{geo.message}</p>}
                  {geo.state === 'error' && <p className="lookup-status lookup-status--error">{geo.message}</p>}
                  {geo.state === 'ok' && geo.coords && (
                    <div className="geo-card">
                      <p className="lookup-status lookup-status--ok">
                        Localização obtida: {geo.coords.latitude.toFixed(5)}, {geo.coords.longitude.toFixed(5)}
                        {geo.coords.accuracy ? ` (precisão de cerca de ${Math.round(geo.coords.accuracy)} m)` : ''}.
                      </p>
                      <iframe
                        className="geo-map"
                        title="Mapa com a sua localização aproximada (OpenStreetMap)"
                        src={osmEmbed(geo.coords)}
                        loading="lazy"
                      ></iframe>
                      <a className="form-link" href={osmLink(geo.coords)} target="_blank" rel="noopener noreferrer">
                        Abrir no OpenStreetMap <span className="visually-hidden">(abre em nova aba)</span>
                      </a>
                      {reverse.state === 'loading' && <p className="lookup-status lookup-status--loading">{reverse.message}</p>}
                      {reverse.state === 'error' && <p className="lookup-status lookup-status--error">{reverse.message}</p>}
                      {reverse.state === 'ok' && reverse.address && (
                        <div className="geo-suggestion">
                          <p>
                            <strong>Endereço aproximado:</strong> {reverse.address.descricao}
                          </p>
                          <button type="button" className="button button-secondary" onClick={applyReverseAddress}>
                            <span>Usar este endereço no formulário</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </fieldset>

              {submitError && <FormAlert type="error">{submitError}</FormAlert>}

              <button type="submit" className="button button-primary signup-submit" disabled={busy || !authConfigured}>
                <span>{busy ? 'Criando conta…' : 'Criar conta'}</span>
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
