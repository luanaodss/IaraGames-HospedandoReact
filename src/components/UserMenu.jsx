import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

// Menu da conta (avatar + nome) com "Meu perfil" e "Sair", como no index.html original.
export default function UserMenu() {
  const { user, logout, showToast } = useApp();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    // Fecha ao clicar fora ou quando o foco do teclado sai do menu.
    function handleOutside(event) {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    }
    function handleKey(event) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('click', handleOutside);
    document.addEventListener('focusin', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('click', handleOutside);
      document.removeEventListener('focusin', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  function handleLogout() {
    setOpen(false);
    logout();
    showToast('Você saiu da sua conta.');
    navigate('/');
  }

  return (
    <div className="user-menu-wrap" ref={wrapRef}>
      <button
        ref={buttonRef}
        className="user-menu"
        type="button"
        aria-label="Menu da conta"
        aria-expanded={open}
        aria-controls="account-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="avatar">{user.initial}</span>
        <span className="user-name">{user.name}</span>
        <span className="chevron" aria-hidden="true"></span>
      </button>
      <div className="account-menu" id="account-menu" hidden={!open}>
        <Link to="/perfil" onClick={() => setOpen(false)}>
          Meu perfil
        </Link>
        <button type="button" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  );
}
