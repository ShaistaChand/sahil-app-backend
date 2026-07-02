import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      //  THE FINISHING OVERRIDE: Forces the builder to skip strict casing checks for the contexts folder!
      external: [
        './contexts/languageContext',
        './Contexts/LanguageContext',
        './contexts/LanguageContext'
      ]
    }
  }
});
