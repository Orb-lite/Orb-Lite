import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackStartVite } from '@tanstack/start/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackStartVite(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  nitro: {
    preset: 'vercel',
  },
})
