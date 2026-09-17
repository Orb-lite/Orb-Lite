import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { WialonGuard } from '@/components/wialon-guard'
import { WialonUnitDetail } from '@/components/wialon-unit-detail'
import { wialonUnits } from '@/lib/wialon.functions'
import type { WialonSession } from '@/lib/wialon-session'

export const Route = createFileRoute('/wialon/unidades')({
  head: () => ({
    meta: [
      { title: 'Unidades y estado | Plataforma ORB-LITE' },
      { name: 'description', content: 'Estado, velocidad y última señal de cada unidad GPS.' },
      { property: 'og:title', content: 'Unidades y estado | Plataforma ORB-LITE' },
      { property: 'og:description', content: 'Estado, velocidad y última señal de cada unidad GPS.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: () => <WialonGuard>{(session) => <UnidadesView session={session} />}</WialonGuard>,
})

function UnidadesView({ session }: { session: WialonSession }) {
  const fetchUnits = useServerFn(wialonUnits)
  const query = useQuery({
    queryKey: ['wialon-units', session.sid],
    queryFn: () => fetchUnits({ data: { host: session.host, sid: session.sid } }),
    refetchInterval: 30000,
  })

  const units = query.data?.units ?? []
  const online = units.filter((u) => u.online).length

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {units.length} unidades · {online} en línea
        </p>
        <button
          onClick={() => void query.refetch()}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary"
        >
          <RefreshCw className={`size-4 ${query.isFetching ? 'animate-spin' : ''}`} /> Actualizar
        </button>
      </div>

      {query.isError ? (
        <p className="mt-4 text-sm text-destructive">
          {query.error instanceof Error ? query.error.message : 'Error al consultar la plataforma.'}
        </p>
      ) : null}

      <div className="mt-5 overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-card/60 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Unidad</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Velocidad</th>
              <th className="px-4 py-3">Coordenadas</th>
              <th className="px-4 py-3">Última señal</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr key={unit.id} className="border-t border-border/50">
                <td className="px-4 py-3 font-semibold">{unit.name}</td>
                <td className="px-4 py-3">
                  <span className={unit.online ? 'text-primary' : 'text-muted-foreground'}>
                    {unit.online ? 'En línea' : 'Sin señal'}
                  </span>
                </td>
                <td className="px-4 py-3">{unit.speed != null ? `${Math.round(unit.speed)} km/h` : '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {unit.lat != null && unit.lon != null
                    ? `${unit.lat.toFixed(5)}, ${unit.lon.toFixed(5)}`
                    : '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {unit.lastMessage ? new Date(unit.lastMessage * 1000).toLocaleString('es-MX') : '—'}
                </td>
              </tr>
            ))}
            {!query.isLoading && units.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
                  No hay unidades en esta cuenta.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
