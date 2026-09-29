import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

// Plugin para simular los manifiestos virtuales de TanStack Start en compilación cliente
const tanstackManifestFallback = () => ({
  name: 'tanstack-manifest-fallback',
  resolveId(id: string) {
    if (id.startsWith('tanstack-start-manifest:')) {
      return id
    }
  },
  load(id: string) {
    if (id.startsWith('tanstack-start-manifest:')) {
      return 'export default {};'
    }
  },
})

export default defineConfig({
  plugins: [
    tanstackManifestFallback(),
    TanStackRouterVite(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '#tanstack-start-entry': path.resolve(__dirname, './src/main.tsx'),
      '#tanstack-router-entry': path.resolve(__dirname, './src/main.tsx'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
})
