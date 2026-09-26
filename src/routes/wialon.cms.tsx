import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, ShieldCheck, UserPlus, Truck } from 'lucide-react'
import { WialonGuard } from '@/components/wialon-guard'
import { PLATFORM_URLS, type WialonSession } from '@/lib/wialon-session'

export const Route = createFileRoute('/wialon/cms')({
  head: () => ({
    meta: [
      { title: 'Altas de unidades y usuarios | ORB-LITE' },
      { name: 'description', content: 'Da de alta unidades GPS y usuarios de la plataforma.' },
      { property: 'og:title', content: 'Altas de unidades y usuarios | ORB-LITE' },
      { property: 'og:description', content: 'Da de alta unidades GPS y usuarios de la plataforma.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: () => <WialonGuard>{(session) => <CmsView session={session} />}</WialonGuard>,
})

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-primary-foreground">
        {n}
      </span>
      <span className="text-sm leading-relaxed text-muted-foreground">{children}</span>
    </li>
  )
}

function CmsView({ session }: { session: WialonSession }) {
  const isFull = session.host === 'full'
  const cmsUrl = isFull ? PLATFORM_URLS.full.cms : PLATFORM_URLS.lite.cms
  const platformName = isFull ? 'ORB-FULL' : 'ORB-LITE'

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide">
          Altas de unidades y usuarios
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Las altas se realizan directamente en el panel CMS oficial de {platformName}.
        </p>
        <a
          href={cmsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground"
        >
          <ExternalLink className="size-4" /> Abrir panel CMS de {platformName}
        </a>
      </div>

      <section className="rounded-lg border border-border/60 bg-card/40 p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide">
          <Truck className="size-5 text-primary" /> Dar de alta una unidad
        </h2>
        <ol className="mt-4 space-y-3">
          <Step n={1}>Entra al panel CMS con tu usuario y contraseña de la plataforma.</Step>
          <Step n={2}>Abre la sección <strong className="text-foreground">Unidades</strong> y presiona <strong className="text-foreground">Nueva unidad</strong>.</Step>
          <Step n={3}>Escribe el nombre de la unidad (el mismo que usarás en la plataforma) y selecciona el tipo de dispositivo GPS.</Step>
          <Step n={4}>Captura el <strong className="text-foreground">IMEI</strong> del equipo y, si aplica, el número de teléfono del chip.</Step>
          <Step n={5}>Guarda. La unidad aparecerá en el mapa en cuanto el equipo empiece a transmitir.</Step>
        </ol>
      </section>

      <section className="rounded-lg border border-border/60 bg-card/40 p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide">
          <UserPlus className="size-5 text-primary" /> Dar de alta un usuario
        </h2>
        <ol className="mt-4 space-y-3">
          <Step n={1}>Entra al panel CMS con tu usuario y contraseña de la plataforma.</Step>
          <Step n={2}>Abre la sección <strong className="text-foreground">Usuarios</strong> y presiona <strong className="text-foreground">Nuevo usuario</strong>.</Step>
          <Step n={3}>Escribe el nombre de usuario, la contraseña y los datos de contacto.</Step>
          <Step n={4}>En la pestaña de <strong className="text-foreground">acceso</strong>, asigna las unidades que ese usuario podrá ver y el nivel de permisos sobre cada una.</Step>
          <Step n={5}>Guarda y comparte las credenciales con el usuario.</Step>
        </ol>
      </section>

      <section className="rounded-lg border border-primary/40 bg-primary/5 p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide">
          <ShieldCheck className="size-5 text-primary" /> Permisos necesarios
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Para dar de alta unidades o usuarios, tu cuenta debe tener otorgados los
          permisos de <strong className="text-foreground">creación de unidades</strong> y{' '}
          <strong className="text-foreground">creación de usuarios</strong> sobre la cuenta
          o recurso correspondiente. Estos permisos los otorga el administrador de la
          cuenta (super admin). Si al entrar al panel CMS no ves las opciones de crear
          unidades o usuarios, solicita al administrador que active esos permisos para
          tu usuario.
        </p>
      </section>
    </div>
  )
}
