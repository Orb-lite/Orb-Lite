import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/config'
import path from 'path'

export default defineConfig({
  plugins: [
    tanstackStart({
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
})
