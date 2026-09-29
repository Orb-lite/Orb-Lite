import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import lovableTanstack from '@lovable.dev/vite-tanstack-config'
import path from 'path'

export default defineConfig({
  plugins: [
    lovableTanstack(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import lovableTanstack from '@lovable.dev/vite-tanstack-config'
import path from 'path'

export default defineConfig({
  plugins: [
    lovableTanstack(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
