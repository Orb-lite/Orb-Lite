// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Configuración de variables de entorno para Supabase y la app
  runtimeConfig: {
    // Variables privadas (solo accesibles desde el servidor/Nitro)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

    // Variables públicas (accesibles en el frontend y backend)
    public: {
      supabaseUrl: process.env.SUPABASE_URL 
        || process.env.NEXT_PUBLIC_SUPABASE_URL 
        || process.env.VITE_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY 
        || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
        || process.env.SUPABASE_PUBLISHABLE_KEY 
        || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    }
  }
})
