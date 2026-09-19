import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { KeyRound, MapPin, ShieldCheck } from 'lucide-react'
import { PLATFORM_URLS, useWialonSession } from '@/lib/wialon-session'

export const Route = createFileRoute('/wialon/')({
  head: () => ({
    meta: [
      { title: 'Acceso a la plataforma de rastreo | ORB-LITE' },
      {
        name: 'description',
        content:
          'Inicia sesión de forma segura en Wialon para consultar tus unidades en vivo, historial y altas.',
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
  const navigate = useNavigate()
  const session = useWialonSession()

  const [host, setHost] = React.useState<'lite' | 'full'>('lite')

  React.useEffect(() => {
    if (session) void navigate({ to: '/wialon/mapa' })
  }, [session, navigate])

  function startWialonLogin() {
    const base = PLATFORM_URLS[host].app.replace(/\/$/, '')
    window.sessionStorage.setItem('orblite.wialon.oauth-host', host)
    const redirect = `${window.location.origin}/wialon/callback`
    const url = new URL(`${base}/login.html`)
    url.searchParams.set('client_id', 'ORB-LITE')
    url.searchParams.set('access_type', '-1')
    url.searchParams.set('activation_time', '0')
    url.searchParams.set('duration', '604800')
    url.searchParams.set('flags', '0x1')
    url.searchParams.set('lang', 'es')
    url.searchParams.set('redirect_uri', redirect)
    url.searchParams.set('response_type', 'token')
    window.location.assign(url.toString())
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <section className="rounded-lg border border-border/60 p-6">
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

        <button
          type="button"
          onClick={startWialonLogin}
          className="mt-6 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground"
        >
          Iniciar sesión con Wialon
        </button>

        <p className="mt-4 text-xs text-muted-foreground">
          Serás redirigido a la página oficial de Wialon. Al terminar, regresarás automáticamente a
          ORB-LITE con una sesión temporal; nunca vemos ni almacenamos tu contraseña.
        </p>

      </section>

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
