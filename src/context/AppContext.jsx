import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { readJSON, writeJSON, removeKey } from '../data/storage.js';

// Estado global demonstrativo (sem backend): sessão, favoritos, carrinho e notificações.
// Equivale ao que o script.js original fazia com localStorage e manipulação do DOM.
const AppContext = createContext(null);

const AUTH_KEY = 'iaraAuth';
const FAVORITES_KEY = 'iaraFavorites';
const CART_KEY = 'iaraCart';

const DEMO_USER = { name: 'Ana Beatriz', initial: 'A' };

function loadAuth() {
  return readJSON(AUTH_KEY, null) || readJSON(AUTH_KEY, null, 'session') || 'guest';
}

export function AppProvider({ children }) {
  const [auth, setAuth] = useState(loadAuth);
  const [favorites, setFavorites] = useState(() => readJSON(FAVORITES_KEY, []));
  const [cart, setCart] = useState(() => readJSON(CART_KEY, []));
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();
  const toastCount = useRef(0);

  const isLogged = auth === 'logged';

  useEffect(() => writeJSON(FAVORITES_KEY, favorites), [favorites]);
  useEffect(() => writeJSON(CART_KEY, cart), [cart]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    toastCount.current += 1;
    setToast({ id: toastCount.current, message });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  // "Lembrar-me" marcado: sessão fica salva no navegador; desmarcado: só até fechar a aba.
  const login = useCallback((remember) => {
    removeKey(AUTH_KEY);
    writeJSON(AUTH_KEY, 'logged', remember ? 'local' : 'session');
    setAuth('logged');
  }, []);

  const logout = useCallback(() => {
    removeKey(AUTH_KEY);
    setAuth('guest');
  }, []);

  const toggleFavorite = useCallback(
    (id, name) => {
      if (!isLogged) {
        showToast('Faça login para adicionar jogos aos favoritos.');
        return;
      }
      const isFavorite = favorites.includes(id);
      setFavorites((current) => (isFavorite ? current.filter((item) => item !== id) : [...current, id]));
      showToast(isFavorite ? `${name} removido dos favoritos` : `${name} adicionado aos favoritos`);
    },
    [favorites, isLogged, showToast]
  );

  const addToCart = useCallback(
    (id) => {
      if (!isLogged) {
        showToast('Faça login para adicionar itens ao carrinho.');
        return;
      }
      if (cart.includes(id)) {
        showToast('Este item já está no carrinho.');
        return;
      }
      setCart((current) => [...current, id]);
      showToast('Adicionado ao carrinho com sucesso');
    },
    [cart, isLogged, showToast]
  );

  const value = useMemo(
    () => ({
      isLogged,
      user: isLogged ? DEMO_USER : null,
      login,
      logout,
      favorites,
      toggleFavorite,
      cart,
      addToCart,
      toast,
      showToast,
    }),
    [isLogged, login, logout, favorites, toggleFavorite, cart, addToCart, toast, showToast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de <AppProvider>');
  return context;
}
