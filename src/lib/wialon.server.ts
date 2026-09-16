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

/** Error con el código original de Wialon para poder reaccionar (sesión vencida, permisos, etc.). */
export class WialonError extends Error {
  code: number
  constructor(code: number, reason?: string) {
    super(wialonErrorText(code, reason))
    this.name = 'WialonError'
    this.code = code
  }
}

export function isSessionExpired(error: unknown): boolean {
  return error instanceof WialonError && (error.code === 1 || error.code === 7)
}

const TIMEOUT_MS = 20000
const RETRY_CODES = new Set([1003, 1004, 1001])

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function wialonCall<T = unknown>(
  host: WialonHost,
  svc: string,
  params: unknown,
  sid?: string,
  attempt = 0,
): Promise<T> {
  const url = new URL(`${BASES[host]}/wialon/ajax.html`)
  url.searchParams.set('svc', svc)
  if (sid) url.searchParams.set('sid', sid)

  let res: Response
  try {
    res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ params: JSON.stringify(params ?? {}) }).toString(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch {
    if (attempt < 2) {
      await sleep(600 * (attempt + 1))
      return wialonCall<T>(host, svc, params, sid, attempt + 1)
    }
    throw new Error('La plataforma no responde en este momento. Intenta de nuevo.')
  }

  if (!res.ok) {
    if (res.status >= 500 && attempt < 2) {
      await sleep(600 * (attempt + 1))
      return wialonCall<T>(host, svc, params, sid, attempt + 1)
    }
    throw new Error('La plataforma no responde en este momento.')
  }

  const json = (await res.json()) as unknown
  if (json && typeof json === 'object' && 'error' in json) {
    const code = Number((json as { error: unknown }).error)
    if (Number.isFinite(code) && code !== 0) {
      if (RETRY_CODES.has(code) && attempt < 2) {
        await sleep(900 * (attempt + 1))
        return wialonCall<T>(host, svc, params, sid, attempt + 1)
      }
      throw new WialonError(code, (json as { reason?: string }).reason)
    }
  }
  return json as T
}
