import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

// Protege rotas privadas: sem sessão válida no Supabase, o usuário vai para o login
// e, depois de entrar, volta para a página que tentou abrir.
export default function RequireAuth({ children }) {
  const { authReady, isLogged } = useApp();
  const location = useLocation();

  if (!authReady) {
    return (
      <div className="legacy-page auth-loading" role="status" aria-live="polite">
        <p>Verificando sua sessão…</p>
      </div>
    );
  }
  if (!isLogged) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
}
