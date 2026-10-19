import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // VITE_ é o padrão do Vite. NEXT_PUBLIC_ é o prefixo que a integração Supabase ↔ Vercel
  // usa para as variáveis públicas (URL e chave anon/publishable). Variáveis sem esses
  // prefixos, como SUPABASE_SERVICE_ROLE_KEY, continuam fora do bundle do navegador.
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
});
