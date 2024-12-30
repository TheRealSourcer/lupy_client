import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  base: process.env.ELECTRON=="true" ? './' : '/',
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; frame-src *; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline';"
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
