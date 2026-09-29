import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

// Intercepta módulos de servidor y sustituye async_hooks en el cliente
const tanstackManifestFallback = () => ({
  name: 'tanstack-manifest-fallback',
  resolveId(id: string) {
    if (id.startsWith('tanstack-start-manifest:')) {
      return id
    }
    if (id === 'node:async_hooks' || id === 'async_hooks') {
      return '\0virtual:async_hooks'
    }
  },
  load(id: string) {
    if (id.startsWith('tanstack-start-manifest:')) {
      return 'export default {};'
    }
    if (id === '\0virtual:async_hooks') {
      return `
        export class AsyncLocalStorage {
          disable() {}
          getStore() { return undefined; }
          run(store, callback, ...args) { return callback(...args); }
          exit(callback, ...args) { return callback(...args); }
          enterWith() {}
        }
      `
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
      'async_hooks': '\0virtual:async_hooks',
      'node:async_hooks': '\0virtual:async_hooks',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
})
