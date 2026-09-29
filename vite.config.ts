import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as lovableConfig from '@lovable.dev/vite-tanstack-config'
import path from 'path'

// Resuelve dinámicamente la función del plugin sin importar la variante de exportación del paquete
const tanstackPlugin = (
  typeof lovableConfig === 'function'
    ? lovableConfig
    : (lovableConfig as any).default || 
      (lovableConfig as any).tanstackConfig || 
      Object.values(lovableConfig)[0]
) as () => any

export default defineConfig({
  plugins: [
    tanstackPlugin(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
