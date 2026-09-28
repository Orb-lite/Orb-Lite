import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { useWialonSession, type WialonSession } from '@/lib/wialon-session'
import { KeyRound, ShieldAlert } from 'lucide-react'

export function WialonGuard({
  children,
}: {
  children: (session: WialonSession) => React.ReactNode
}) {
  const session = useWialonSession()

  if (session === undefined) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl border border-border/60 p-6 text-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Cargando sesión…</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-border/60 bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <KeyRound className="size-6" />
        </div>
        <h2 className="mt-4 font-display text-lg font-bold uppercase tracking-wide">
          Acceso a la plataforma
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Necesitas iniciar sesión con tu cuenta de Wialon (ORB-LITE u ORB-FULL) para acceder a este módulo.
        </p>
        <Link
          to="/wialon"
          className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90"
        >
          Iniciar sesión con Wialon
        </Link>
      </div>
    )
  }

  return <>{children(session)}</>
}
