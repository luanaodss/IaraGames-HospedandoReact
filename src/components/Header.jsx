import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo/logo-iara-games.svg';
import cartIcon from '../assets/icons/carrinho.svg';
import { useApp } from '../context/AppContext.jsx';
import HeaderSearch from './HeaderSearch.jsx';
import UserMenu from './UserMenu.jsx';

const navItems = [
  { label: 'Loja', to: '/', end: true },
  { label: 'Catálogo', to: '/catalogo' },
  { label: 'Biblioteca', to: '/biblioteca' },
  { label: 'Fórum', to: '/forum' },
  { label: 'Suporte', to: '/suporte' },
];

export default function Header({ solid = false }) {
  const { isLogged, cart, showToast } = useApp();

  // Carrinho demonstrativo: não há página de checkout no projeto original.
  function handleCartClick() {
    if (!isLogged) {
      showToast('Faça login para adicionar itens ao carrinho.');
      return;
    }
    showToast(
      cart.length === 0
        ? 'Seu carrinho está vazio.'
        : `Você tem ${cart.length} ${cart.length === 1 ? 'item' : 'itens'} no carrinho.`
    );
  }

  return (
    <header className={`site-header${solid ? ' site-header--solid' : ''}`}>
      <div className="container-fluid header-inner">
        <Link className="brand" to="/" aria-label="Iara Games - início">
          <img src={logo} alt="Iara Games" />
        </Link>

        <nav className="main-nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <HeaderSearch />

          <button className="icon-button cart-button" type="button" aria-label={isLogged && cart.length > 0 ? `Carrinho (${cart.length} ${cart.length === 1 ? 'item' : 'itens'})` : 'Carrinho'}
            onClick={handleCartClick}>
            <img src={cartIcon} alt="" />
            {isLogged && cart.length > 0 && (
              <span className="cart-count" aria-hidden="true">
                {cart.length}
              </span>
            )}
          </button>

          {isLogged ? (
            <UserMenu />
          ) : (
            <Link className="login-entry" to="/login">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
