/**
 * Sesión del CRM de ORB-LITE.
 * Mantiene la sesión persistente de Supabase sin cerrarla automáticamente.
 */
export function ensureFreshSession(): Promise<void> {
  return Promise.resolve();
}
