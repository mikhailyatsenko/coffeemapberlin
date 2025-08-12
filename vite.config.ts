import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
dotenv.config();

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  define: {
    'process.env': { ...process.env, VITE_ENV: process.env.VITE_ENV ?? 'development' },
  },
  base: './',
  build: {
    minify: 'terser',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-apollo': ['@apollo/client', 'graphql'],
          'vendor-forms': ['react-hook-form', 'yup'],
          'vendor-ui': ['react-hot-toast', 'clsx', 'zustand'],
        },
      },
      treeshake: {
        moduleSideEffects: false,
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
