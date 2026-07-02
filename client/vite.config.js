import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  base: './', // 🌟 THE FINISHING TOUCH: Forces Render to locate your built styles and scripts relatively without 404 drops!
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: [
        './contexts/languageContext',
        './Contexts/LanguageContext',
        './contexts/LanguageContext'
      ]
    }
  }
});

