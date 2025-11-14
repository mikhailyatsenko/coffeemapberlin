import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { runtimeModule: 'react-compiler-runtime' }]],
      },
    }),
    tsconfigPaths(),
    svgr(),
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
        manualChunks(id) {
          if (id.includes('maplibre-gl') || id.includes('react-map-gl/maplibre')) {
            return 'vendor-maplibre';
          }
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom'))
            return 'vendor-react';
          if (id.includes('@apollo/client') || id.includes('graphql') || id.includes('graphql-ws'))
            return 'vendor-apollo';
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('yup'))
            return 'vendor-forms';
          if (id.includes('date-fns') || id.includes('yet-another-react-lightbox')) return 'vendor-utils';
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
