export type WialonHost = 'lite' | 'full'

const BASES: Record<WialonHost, string> = {
  lite: 'https://lite.wialon.us',
  full: 'https://hosting.wialon.com',
}

export const CMS_URLS: Record<WialonHost, string> = {
  lite: 'https://cms-lite.wialon.us/',
  full: 'https://cms.wialon.com/',
}

const ERRORS: Record<number, string> = {
  1: 'Sesión inválida o expirada. Vuelve a iniciar sesión.',
  2: 'Servicio no válido.',
  3: 'Sin derechos para esta operación.',
  4: 'Datos inválidos o parámetros incorrectos.',
  5: 'Error al ejecutar la petición en la plataforma.',
  6: 'Operación desconocida.',
  7: 'Acceso denegado.',
  8: 'Usuario o contraseña incorrectos.',
  9: 'Servicio de autorización no disponible.',
  10: 'No se completó la operación.',
  11: 'Error de XML.',
  14: 'Límite de la cuenta alcanzado.',
  1001: 'No se puede ejecutar en este momento.',
  1002: 'La cuenta está bloqueada.',
  1003: 'Solo se permite una petición a la vez.',
  1004: 'Límite de peticiones alcanzado, intenta de nuevo.',
  2014: 'Faltan características habilitadas en la cuenta.',
}

export function wialonErrorText(code: number, reason?: string): string {
  return ERRORS[code] ?? `Error de la plataforma (${code})${reason ? `: ${reason}` : ''}`
}

export async function wialonCall<T = unknown>(
  host: WialonHost,
  svc: string,
  params: unknown,
  sid?: string,
): Promise<T> {
  const url = new URL(`${BASES[host]}/wialon/ajax.html`)
  url.searchParams.set('svc', svc)
  if (sid) url.searchParams.set('sid', sid)

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ params: JSON.stringify(params ?? {}) }).toString(),
  })

  if (!res.ok) throw new Error('La plataforma no responde en este momento.')

  const json = (await res.json()) as unknown
  if (json && typeof json === 'object' && 'error' in json) {
    const code = Number((json as { error: unknown }).error)
    if (Number.isFinite(code) && code !== 0) {
      throw new Error(wialonErrorText(code, (json as { reason?: string }).reason))
    }
  }
  return json as T
}
