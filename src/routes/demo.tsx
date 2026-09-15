import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { CheckCircle2, MonitorSmartphone, ShieldCheck, Clock } from 'lucide-react'
import { createDemoRequest } from '@/lib/demo.functions'

export const Route = createFileRoute('/demo')({
  head: () => ({
    meta: [
      { title: 'Solicitar demo | Plataforma de rastreo GPS ORB-LITE' },
      {
        name: 'description',
        content:
          'Solicita una demo gratuita de la plataforma de rastreo GPS ORB-LITE u ORB-FULL. Déjanos tus datos y te enviamos tus accesos por correo.',
      },
      { property: 'og:title', content: 'Solicitar demo | Plataforma de rastreo GPS ORB-LITE' },
      {
        property: 'og:description',
        content:
          'Prueba la plataforma de rastreo en tiempo real: llena el formulario y recibe tus accesos de demostración.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: DemoPage,
})

const PLATFORMS = [
  { id: 'wialon_lite', label: 'ORB-LITE', text: 'Rastreo esencial en tiempo real' },
  { id: 'wialon_full', label: 'ORB-FULL', text: 'Reportes y control avanzado de flota' },
] as const

function DemoPage() {
  const submit = useServerFn(createDemoRequest)

  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [company, setCompany] = React.useState('')
  const [units, setUnits] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [platform, setPlatform] = React.useState<'wialon_lite' | 'wialon_full'>('wialon_lite')
  const [sending, setSending] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const inputClass =
    'mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      await submit({
        data: { firstName, lastName, phone, email, company, units, message, platform },
      })
      setDone(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? 'No pudimos registrar tu solicitud. Revisa tus datos e inténtalo de nuevo.'
          : 'Ocurrió un error inesperado.',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Prueba sin costo
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase italic sm:text-5xl">
          Solicita tu <span className="text-gradient-lime">demo</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Déjanos tus datos y te asignamos un acceso de demostración a la plataforma de rastreo.
          Recibirás tu usuario y contraseña por correo, junto con los enlaces de acceso web y de la
          app móvil.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-20 lg:grid-cols-[1.2fr_1fr]">
        {done ? (
          <div className="rounded-2xl border border-primary/50 bg-card/60 p-8">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <h2 className="mt-4 font-display text-2xl font-bold uppercase italic">
              Solicitud recibida
            </h2>
            <p className="mt-3 text-muted-foreground">
              Ya tenemos tu solicitud. Nuestro equipo prepara tu acceso de demostración y te envía
              el usuario y la contraseña al correo <strong className="text-primary">{email}</strong>
              . Normalmente respondemos el mismo día hábil.
            </p>
          </div>
        ) : (
          <form className="rounded-2xl border border-border/70 bg-card/50 p-7" onSubmit={onSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm">
                <span className="font-display uppercase tracking-wide">Nombre(s)</span>
                <input
                  required
                  maxLength={80}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                  placeholder="Emiliano"
                />
              </label>
              <label className="text-sm">
                <span className="font-display uppercase tracking-wide">Apellidos</span>
                <input
                  required
                  maxLength={80}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                  placeholder="Gómez Estrada"
                />
              </label>
              <label className="text-sm">
                <span className="font-display uppercase tracking-wide">Teléfono</span>
                <input
                  required
                  inputMode="tel"
                  maxLength={25}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder="10 dígitos"
                />
              </label>
              <label className="text-sm">
                <span className="font-display uppercase tracking-wide">Correo electrónico</span>
                <input
                  required
                  type="email"
                  maxLength={200}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="tucorreo@dominio.com"
                />
              </label>
              <label className="text-sm">
                <span className="font-display uppercase tracking-wide">
                  Empresa o negocio (opcional)
                </span>
                <input
                  maxLength={150}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={inputClass}
                  placeholder="Transportes ABC"
                />
              </label>
              <label className="text-sm">
                <span className="font-display uppercase tracking-wide">
                  Unidades a rastrear (opcional)
                </span>
                <input
                  maxLength={30}
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className={inputClass}
                  placeholder="1, 5, 20…"
                />
              </label>
            </div>

            <fieldset className="mt-6">
              <legend className="font-display text-sm uppercase tracking-wide">
                Plataforma que quieres probar
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id)}
                    className={`rounded-lg border px-4 py-3 text-left ${
                      platform === p.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border/70 bg-background'
                    }`}
                  >
                    <span className="font-display font-bold uppercase tracking-wide text-primary">
                      {p.label}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">{p.text}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="mt-6 block text-sm">
              <span className="font-display uppercase tracking-wide">Mensaje (opcional)</span>
              <textarea
                rows={4}
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={inputClass}
                placeholder="Cuéntanos qué necesitas rastrear"
              />
            </label>

            {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

            <button
              type="submit"
              disabled={sending}
              className="mt-6 w-full rounded-md px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-60"
              style={{ background: 'var(--gradient-lime)' }}
            >
              {sending ? 'Enviando…' : 'Solicitar demo'}
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Usamos tus datos solo para preparar y darte seguimiento a tu demo.
            </p>
          </form>
        )}

        <aside className="space-y-4">
          {[
            {
              icon: MonitorSmartphone,
              title: 'Acceso web y app',
              text: 'Plataforma en navegador y app móvil para iOS, Android y AppGallery.',
            },
            {
              icon: Clock,
              title: 'Respuesta el mismo día',
              text: 'Revisamos cada solicitud y enviamos tus claves de demostración por correo.',
            },
            {
              icon: ShieldCheck,
              title: 'Sin compromiso',
              text: 'Prueba la plataforma antes de contratar equipos o planes de servicio.',
            },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-xl border border-border/70 bg-card/50 p-6">
              <Icon className="h-7 w-7 text-primary" />
              <h2 className="mt-3 font-display font-bold uppercase tracking-wide">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </aside>
      </section>
    </div>
  )
}
