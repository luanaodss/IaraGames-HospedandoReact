// Leitura/escrita segura no navegador: se o armazenamento estiver bloqueado,
// a aplicação continua funcionando apenas durante a sessão.
export function readJSON(key, fallback, storage = 'local') {
  try {
    const store = storage === 'session' ? window.sessionStorage : window.localStorage;
    const raw = store.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value, storage = 'local') {
  try {
    const store = storage === 'session' ? window.sessionStorage : window.localStorage;
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* armazenamento indisponível */
  }
}

export function removeKey(key) {
  try {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  } catch {
    /* armazenamento indisponível */
  }
}
