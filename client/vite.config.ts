import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Tek SPA. Geliştirmede /socket.io istekleri sunucuya (3001) proxy'lenir.
// Üretimde sunucu hem API'yi hem de bu build çıktısını (dist) servis eder.
// GitHub Pages alt-yolu için base (ör. /eslesme-vakti/). Yerelde ve Render'da '/'.
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // LAN'dan telefonların erişebilmesi için 0.0.0.0
    fs: { allow: ['..'] }, // ../shared dosyalarını import edebilmek için
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
