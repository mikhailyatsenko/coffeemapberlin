import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import type { PluginOption } from 'vite';
import purgeCss from 'vite-plugin-purgecss';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    purgeCss({
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      // Safelist для динамических классов, SVG, CSS-модулей и сторонних библиотек
      safelist: {
        greedy: [/^.*$/], // оставляем всё CSS на время теста
      },
      defaultExtractor: (content) => {
        // Ищем все className="..." и className={styles.xxx} в JSX
        return content.match(/[\w-/:]+(?<!:)/g) || [];
      },
    }) as PluginOption,
  ],
  define: {
    'process.env': { ...process.env, VITE_ENV: process.env.VITE_ENV ?? 'development' },
  },
  base: '/',
  build: {
    minify: 'terser',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-apollo': ['@apollo/client', 'graphql', 'graphql-ws'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'yup'],
          'vendor-utils': ['date-fns', 'yet-another-react-lightbox'],
          'vendor-maplibre': ['maplibre-gl', 'react-map-gl/maplibre'],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
