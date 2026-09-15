import { Link } from '@tanstack/react-router'
import { useWialonSession, type WialonSession } from '@/lib/wialon-session'

export function WialonGuard({
  children,
}: {
  children: (session: WialonSession) => React.ReactNode
}) {
  const session = useWialonSession()

  if (session === undefined) {
    return <p className="text-sm text-muted-foreground">Cargando…</p>
  }

  if (!session) {
    return (
      <div className="rounded-lg border border-border/60 p-6">
        <p className="text-sm text-muted-foreground">
          Necesitas iniciar sesión con tu cuenta de la plataforma.
        </p>
        <Link
          to="/wialon"
          className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Iniciar sesión
        </Link>
      </div>
    )
  }

  return <>{children(session)}</>
}
