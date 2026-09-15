import * as React from 'react'
import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'
import { WialonGuard } from '@/components/wialon-guard'
import { wialonUnits } from '@/lib/wialon.functions'
import type { WialonSession } from '@/lib/wialon-session'

const WialonMap = React.lazy(() => import('@/components/wialon-map'))

export const Route = createFileRoute('/wialon/mapa')({
  head: () => ({
    meta: [
      { title: 'Mapa en vivo | Plataforma ORB-LITE' },
      { name: 'description', content: 'Ubicación en tiempo real de tus unidades GPS.' },
      { property: 'og:title', content: 'Mapa en vivo | Plataforma ORB-LITE' },
      { property: 'og:description', content: 'Ubicación en tiempo real de tus unidades GPS.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: () => <WialonGuard>{(session) => <MapaView session={session} />}</WialonGuard>,
})

function MapaView({ session }: { session: WialonSession }) {
  const fetchUnits = useServerFn(wialonUnits)
  const [focusId, setFocusId] = React.useState<number | null>(null)

  const query = useQuery({
    queryKey: ['wialon-units', session.sid],
    queryFn: () => fetchUnits({ data: { host: session.host, sid: session.sid } }),
    refetchInterval: 20000,
  })

  const units = query.data?.units ?? []

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <ClientOnly
        fallback={<div className="h-[480px] rounded-lg border border-border/60 bg-card/40" />}
      >
        <React.Suspense
          fallback={<div className="h-[480px] rounded-lg border border-border/60 bg-card/40" />}
        >
          <WialonMap units={units} focusId={focusId} />
        </React.Suspense>
      </ClientOnly>

      <div className="rounded-lg border border-border/60 p-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-widest">
          Unidades ({units.length})
        </h2>
        {query.isError ? (
          <p className="mt-3 text-sm text-destructive">
            {query.error instanceof Error ? query.error.message : 'Error al consultar la plataforma.'}
          </p>
        ) : null}
        <ul className="mt-3 max-h-[420px] space-y-2 overflow-auto pr-1 text-sm">
          {units.map((unit) => (
            <li key={unit.id}>
              <button
                onClick={() => setFocusId(unit.id)}
                className={`w-full rounded-md border px-3 py-2 text-left ${
                  focusId === unit.id ? 'border-primary' : 'border-border/60'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{unit.name}</span>
                  <span
                    className={`text-xs uppercase ${unit.online ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {unit.online ? 'En línea' : 'Sin señal'}
                  </span>
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {unit.speed != null ? `${Math.round(unit.speed)} km/h · ` : ''}
                  {unit.lastMessage
                    ? new Date(unit.lastMessage * 1000).toLocaleString('es-MX')
                    : 'sin mensajes'}
                </span>
              </button>
            </li>
          ))}
          {!query.isLoading && units.length === 0 ? (
            <li className="text-muted-foreground">No hay unidades en esta cuenta.</li>
          ) : null}
        </ul>
      </div>
    </div>
  )
}
