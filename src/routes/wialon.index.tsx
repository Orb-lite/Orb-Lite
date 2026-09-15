import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { KeyRound, MapPin, ShieldCheck } from 'lucide-react'
import { PLATFORM_URLS, useWialonSession, writeSession } from '@/lib/wialon-session'
import { wialonLogin } from '@/lib/wialon.functions'

export const Route = createFileRoute('/wialon/')({
  head: () => ({
    meta: [
      { title: 'Acceso a la plataforma de rastreo | ORB-LITE' },
      {
        name: 'description',
        content:
          'Entra a la plataforma de rastreo GPS ORB-LITE u ORB-FULL con tu usuario o token y consulta tus unidades en vivo, historial y altas.',
      },
      { property: 'og:title', content: 'Acceso a la plataforma de rastreo | ORB-LITE' },
      {
        property: 'og:description',
        content: 'Mapa en vivo, unidades, historial y altas de equipos en un solo panel.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: WialonLoginPage,
})

function WialonLoginPage() {
  const login = useServerFn(wialonLogin)
  const navigate = useNavigate()
  const session = useWialonSession()

  const [host, setHost] = React.useState<'lite' | 'full'>('lite')
  const [mode, setMode] = React.useState<'password' | 'token'>('password')
  const [user, setUser] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [token, setToken] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (session) void navigate({ to: '/wialon/mapa' })
  }, [session, navigate])

  const inputClass =
    'mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const result = await login({
        data: { host, mode, user, password, token },
      })
      writeSession(result)
      void navigate({ to: '/wialon/mapa' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <form onSubmit={onSubmit} className="rounded-lg border border-border/60 p-6">
        <div className="flex gap-2">
          {(['lite', 'full'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setHost(option)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold uppercase tracking-wide ${
                host === option
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground'
              }`}
            >
              {option === 'lite' ? 'ORB-LITE' : 'ORB-FULL'}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2 text-sm">
          {(['password', 'token'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={`rounded-full border px-3 py-1 ${
                mode === option ? 'border-primary text-primary' : 'border-border text-muted-foreground'
              }`}
            >
              {option === 'password' ? 'Usuario y contraseña' : 'Token de acceso'}
            </button>
          ))}
        </div>

        {mode === 'password' ? (
          <>
            <label className="mt-5 block text-sm">
              Usuario
              <input
                className={inputClass}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="off"
                required
              />
            </label>
            <label className="mt-4 block text-sm">
              Contraseña
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </label>
          </>
        ) : (
          <label className="mt-5 block text-sm">
            Token de acceso
            <input
              className={inputClass}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoComplete="off"
              placeholder="Token generado en tu cuenta"
              required
            />
          </label>
        )}

        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-60"
        >
          {busy ? 'Conectando…' : 'Entrar'}
        </button>

        <p className="mt-4 text-xs text-muted-foreground">
          Tus datos viajan directo a la plataforma. No guardamos tu contraseña; la sesión se cierra
          al salir del navegador.
        </p>
      </form>

      <div className="space-y-4">
        {[
          {
            icon: MapPin,
            title: 'Mapa en vivo',
            text: 'Ubicación, velocidad y estado de cada unidad de tu cuenta.',
          },
          {
            icon: ShieldCheck,
            title: 'Historial y recorridos',
            text: 'Consulta los recorridos por fecha y la velocidad máxima registrada.',
          },
          {
            icon: KeyRound,
            title: 'Altas de unidades y usuarios',
            text: 'Da de alta equipos y accesos igual que en el gestor oficial.',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-border/60 p-5">
            <item.icon className="size-5 text-primary" />
            <h2 className="mt-3 font-display text-lg font-bold uppercase tracking-wide">
              {item.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
          </div>
        ))}

        <p className="text-xs text-muted-foreground">
          También puedes entrar al gestor oficial:{' '}
          <a className="text-primary" href={PLATFORM_URLS[host].app} target="_blank" rel="noreferrer">
            {PLATFORM_URLS[host].app}
          </a>{' '}
          ·{' '}
          <a className="text-primary" href={PLATFORM_URLS[host].cms} target="_blank" rel="noreferrer">
            {PLATFORM_URLS[host].cms}
          </a>
        </p>
      </div>
    </div>
  )
}
