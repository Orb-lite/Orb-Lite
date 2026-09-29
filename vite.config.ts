import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackStartVite } from '@tanstack/start-plugin'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackStartVite({
      deployment: {
        preset: 'vercel',
      },
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  nitro: {
    preset: 'vercel',
    output: {
      publicDir: '.vercel/output/static',
    },
  },
})
