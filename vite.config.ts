import { seoPlugin } from './scripts/seoConfig';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), seoPlugin()],
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
