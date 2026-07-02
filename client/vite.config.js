import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  base: './', //  THE FINAL TOUCH: Changes from './' to '/' so Render maps JavaScript scripts correctly with zero MIME type conflicts!
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
