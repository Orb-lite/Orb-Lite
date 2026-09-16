import * as React from 'react'

export type WialonSession = {
  sid: string
  host: 'lite' | 'full'
  userId: number
  userName: string
}

const KEY = 'orblite.wialon.session'

export const PLATFORM_LABEL: Record<WialonSession['host'], string> = {
  lite: 'ORB-LITE (Wialon Lite)',
  full: 'ORB-FULL (Wialon Full)',
}

export const PLATFORM_URLS: Record<WialonSession['host'], { app: string; cms: string }> = {
  lite: { app: 'https://lite.wialon.us/', cms: 'https://cms-lite.wialon.us/' },
  full: { app: 'https://hosting.wialon.com/', cms: 'https://cms.wialon.com/' },
}

export function readSession(): WialonSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as WialonSession
    return parsed?.sid && parsed?.host ? parsed : null
  } catch {
    return null
  }
}

export function writeSession(session: WialonSession | null) {
  if (typeof window === 'undefined') return
  if (session) window.sessionStorage.setItem(KEY, JSON.stringify(session))
  else window.sessionStorage.removeItem(KEY)
  window.dispatchEvent(new Event('wialon-session-change'))
}

/** Devuelve la sesión activa; `undefined` mientras hidrata. */
export function useWialonSession(): WialonSession | null | undefined {
  const [session, setSession] = React.useState<WialonSession | null | undefined>(undefined)

  React.useEffect(() => {
    setSession(readSession())
    const onChange = () => setSession(readSession())
    window.addEventListener('wialon-session-change', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('wialon-session-change', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  return session
}

/** Mantiene viva la sesión de Wialon y cierra si la plataforma la invalidó. */
export function useWialonKeepAlive(
  session: WialonSession | null | undefined,
  ping: (args: { data: { host: WialonSession['host']; sid: string } }) => Promise<{ valid: boolean }>,
) {
  React.useEffect(() => {
    if (!session) return
    let cancelled = false

    async function check() {
      try {
        const result = await ping({ data: { host: session!.host, sid: session!.sid } })
        if (!cancelled && !result.valid) writeSession(null)
      } catch {
        // error temporal de red: se reintenta en el siguiente ciclo
      }
    }

    const timer = window.setInterval(check, 4 * 60 * 1000)
    void check()
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [session?.sid, session?.host])
}
