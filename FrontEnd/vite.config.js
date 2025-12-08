import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { webcrypto } from 'crypto'

// Polyfill crypto.getRandomValues for Node.js 16
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = webcrypto;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://electro-433v.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});