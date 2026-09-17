import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { writeSession } from '@/lib/wialon-session'
import { wialonLogin } from '@/lib/wialon.functions'

export const Route = createFileRoute('/wialon/callback')({
  head: () => ({
    meta: [
      { title: 'Conectando con la plataforma | ORB-LITE' },
      {
        name: 'description',
        content: 'Estamos validando tu acceso a la plataforma de rastreo ORB-LITE u ORB-FULL.',
      },
      { property: 'og:title', content: 'Conectando con la plataforma | ORB-LITE' },
      {
        property: 'og:description',
        content: 'Validación de acceso a la plataforma de rastreo ORB-LITE.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: WialonCallbackPage,
})

function readParams(): { token: string | null; host: 'lite' | 'full' } {
  const search = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const token = search.get('access_token') ?? hash.get('access_token')
  const stored = window.sessionStorage.getItem('orblite.wialon.oauth-host')
  const host = stored === 'full' ? 'full' : 'lite'
  return { token, host }
}

function WialonCallbackPage() {
  const login = useServerFn(wialonLogin)
  const navigate = useNavigate()
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    async function run() {
      const { token, host } = readParams()
      if (!token) {
        setError('La plataforma no devolvió un acceso válido. Intenta entrar de nuevo.')
        return
      }
      try {
        const result = await login({ data: { host, mode: 'token', token } })
        if (cancelled) return
        writeSession(result)
        void navigate({ to: '/wialon/mapa' })
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.')
        }
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [login, navigate])

  return (
    <div className="mx-auto max-w-md rounded-lg border border-border/60 p-6 text-center">
      <h1 className="font-display text-xl font-bold uppercase tracking-wide">
        {error ? 'No pudimos entrar' : 'Conectando…'}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {error ?? 'Estamos validando tu acceso con la plataforma.'}
      </p>
      {error ? (
        <button
          type="button"
          onClick={() => void navigate({ to: '/wialon' })}
          className="mt-5 rounded-md bg-primary px-4 py-2 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground"
        >
          Volver a intentar
        </button>
      ) : null}
    </div>
  )
}
