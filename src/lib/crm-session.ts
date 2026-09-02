import { supabase } from '@/integrations/supabase/client'

let fresh: Promise<void> | null = null

/**
 * Fuerza que cada carga o recarga de página empiece sin sesión:
 * la primera vez que se ejecuta en el navegador cierra cualquier sesión
 * guardada. Después de eso es un no-op durante la misma carga de página,
 * así el login normal sigue funcionando.
 */
export function ensureFreshSession(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (!fresh) {
    fresh = (async () => {
      try {
        await supabase.auth.signOut({ scope: 'local' })
      } catch {
        // sin sesión previa: nada que cerrar
      }
    })()
  }
  return fresh
}
