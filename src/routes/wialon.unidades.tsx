import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'
import { RefreshCw, Search } from 'lucide-react'
import { WialonGuard } from '@/components/wialon-guard'
import { WialonUnitDetail } from '@/components/wialon-unit-detail'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { wialonUnits } from '@/lib/wialon.functions'
import type { WialonSession } from '@/lib/wialon-session'
import { matchesUnitSearch, selectAllState, useHiddenUnits } from '@/lib/wialon-visibility'

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
  const [detailId, setDetailId] = React.useState<number | null>(null)
  const [search, setSearch] = React.useState('')
  const { hidden, setVisible } = useHiddenUnits(session)
  const query = useQuery({
    queryKey: ['wialon-units', session.sid],
    queryFn: () => fetchUnits({ data: { host: session.host, sid: session.sid } }),
    refetchInterval: 30000,
  })

  const units = query.data?.units ?? []
  const online = units.filter((u) => u.online).length
  const filtered = React.useMemo(
    () => units.filter((unit) => matchesUnitSearch(unit, search)),
    [units, search],
  )
  const filteredIds = filtered.map((u) => u.id)
  const allState = selectAllState(filteredIds, hidden)
  const shown = units.filter((u) => !hidden.has(u.id)).length

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {units.length} unidades · {online} en línea · {shown} visibles en el mapa
        </p>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar unidad, IMEI o usuario…"
              aria-label="Buscar unidades"
              className="pl-9"
            />
          </div>
          <button
            onClick={() => void query.refetch()}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary"
          >
            <RefreshCw className={`size-4 ${query.isFetching ? 'animate-spin' : ''}`} /> Actualizar
          </button>
        </div>
      </div>

      {query.isError ? (
        <p className="mt-4 text-sm text-destructive">
          {query.error instanceof Error ? query.error.message : 'Error al consultar la plataforma.'}
        </p>
      ) : null}

      <div className="mt-5 overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-card/60 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={allState}
                  disabled={filteredIds.length === 0}
                  onCheckedChange={() => setVisible(filteredIds, allState !== true)}
                  aria-label="Mostrar u ocultar todas las unidades"
                />
              </th>
              <th className="px-4 py-3">Unidad</th>
              <th className="px-4 py-3">IMEI</th>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Velocidad</th>
              <th className="px-4 py-3">Última señal</th>
              <th className="px-4 py-3 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((unit) => (
              <tr key={unit.id} className="border-t border-border/50">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={!hidden.has(unit.id)}
                    onCheckedChange={(value) => setVisible([unit.id], value === true)}
                    aria-label={`Mostrar ${unit.name} en el mapa`}
                  />
                </td>
                <td className="px-4 py-3 font-semibold">{unit.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{unit.imei ?? '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{unit.creatorName ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={unit.online ? 'text-primary' : 'text-muted-foreground'}>
                    {unit.online ? 'En línea' : 'Sin señal'}
                  </span>
                </td>
                <td className="px-4 py-3">{unit.speed != null ? `${Math.round(unit.speed)} km/h` : '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {unit.lastMessage ? new Date(unit.lastMessage * 1000).toLocaleString('es-MX') : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setDetailId(unit.id)}
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-primary hover:text-primary"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
            {!query.isLoading && filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={8}>
                  {units.length === 0 ? 'No hay unidades en esta cuenta.' : 'Ninguna unidad coincide con la búsqueda.'}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {detailId != null ? (
        <WialonUnitDetail session={session} unitId={detailId} onClose={() => setDetailId(null)} />
      ) : null}
    </div>
  )
}
