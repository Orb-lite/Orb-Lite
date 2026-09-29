import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackConfig } from '@lovable.dev/vite-tanstack-config'
import path from 'path'

export default defineConfig({
  plugins: [
    tanstackConfig(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
