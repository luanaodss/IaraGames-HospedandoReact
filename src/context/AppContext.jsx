import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { readJSON, writeJSON, removeKey } from '../data/storage.js';
import { isSupabaseConfigured, supabase } from '../lib/supabase.js';

// Estado global: sessão real do Supabase Auth, perfil do usuário (tabela profiles),
// favoritos, carrinho demonstrativo e notificações.
const AppContext = createContext(null);

const FAVORITES_KEY = 'iaraFavorites';
const CART_KEY = 'iaraCart';
const LEGACY_AUTH_KEY = 'iaraAuth'; // login demonstrativo da versão anterior

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState(() => readJSON(FAVORITES_KEY, []));
  const [cart, setCart] = useState(() => readJSON(CART_KEY, []));
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();
  const toastCount = useRef(0);

  const authUser = session?.user ?? null;
  const isLogged = Boolean(authUser);

  // A sessão demonstrativa antiga não vale mais: só o Supabase decide quem está logado.
  useEffect(() => removeKey(LEGACY_AUTH_KEY), []);

  // Sessão: leitura inicial + escuta de mudanças (login, logout, renovação do token).
  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadProfile = useCallback(async (userId) => {
    if (!supabase || !userId) return { data: null, error: null };
    const result = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (!result.error) setProfile(result.data);
    return result;
  }, []);

  // Perfil do usuário logado (protegido por RLS: só o próprio usuário consegue ler).
  useEffect(() => {
    if (!authUser) {
      setProfile(null);
      return;
    }
    loadProfile(authUser.id);
  }, [authUser, loadProfile]);

  useEffect(() => writeJSON(FAVORITES_KEY, favorites), [favorites]);
  useEffect(() => writeJSON(CART_KEY, cart), [cart]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    toastCount.current += 1;
    setToast({ id: toastCount.current, message });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const login = useCallback(async (email, password) => {
    if (!supabase) return { error: { message: 'not-configured' } };
    return supabase.auth.signInWithPassword({ email, password });
  }, []);

  const signUp = useCallback(async ({ email, password, metadata }) => {
    if (!supabase) return { data: null, error: { message: 'not-configured' } };
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/login?confirmado=1`,
      },
    });
  }, []);

  const logout = useCallback(async () => {
    if (!supabase) return { error: null };
    const result = await supabase.auth.signOut();
    setProfile(null);
    return result;
  }, []);

  const user = useMemo(() => {
    if (!authUser) return null;
    const name = profile?.full_name || authUser.user_metadata?.full_name || authUser.email;
    return {
      id: authUser.id,
      email: authUser.email,
      name,
      initial: (name || '?').trim().charAt(0).toUpperCase(),
    };
  }, [authUser, profile]);

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
      authConfigured: isSupabaseConfigured,
      authReady,
      isLogged,
      user,
      profile,
      loadProfile,
      login,
      signUp,
      logout,
      favorites,
      toggleFavorite,
      cart,
      addToCart,
      toast,
      showToast,
    }),
    [authReady, isLogged, user, profile, loadProfile, login, signUp, logout, favorites, toggleFavorite, cart, addToCart, toast, showToast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de <AppProvider>');
  return context;
}
