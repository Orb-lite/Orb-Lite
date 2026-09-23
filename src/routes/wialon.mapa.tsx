import * as React from 'react'
import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { WialonGuard } from '@/components/wialon-guard'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { wialonUnits } from '@/lib/wialon.functions'
import type { WialonSession } from '@/lib/wialon-session'
import { matchesUnitSearch, selectAllState, useHiddenUnits } from '@/lib/wialon-visibility'

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
  const [search, setSearch] = React.useState('')
  const { hidden, setVisible } = useHiddenUnits(session)

  const query = useQuery({
    queryKey: ['wialon-units', session.sid],
    queryFn: () => fetchUnits({ data: { host: session.host, sid: session.sid } }),
    refetchInterval: 20000,
  })

  const units = query.data?.units ?? []
  const visibleUnits = React.useMemo(() => units.filter((u) => !hidden.has(u.id)), [units, hidden])
  const filtered = React.useMemo(
    () => units.filter((unit) => matchesUnitSearch(unit, search)),
    [units, search],
  )
  const filteredIds = filtered.map((u) => u.id)
  const allState = selectAllState(filteredIds, hidden)

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <ClientOnly
        fallback={<div className="h-[480px] rounded-lg border border-border/60 bg-card/40" />}
      >
        <React.Suspense
          fallback={<div className="h-[480px] rounded-lg border border-border/60 bg-card/40" />}
        >
          <WialonMap units={visibleUnits} focusId={focusId} />
        </React.Suspense>
      </ClientOnly>

      <div className="rounded-lg border border-border/60 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest">
            Unidades ({visibleUnits.length}/{units.length})
          </h2>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
            <Checkbox
              checked={allState}
              disabled={filteredIds.length === 0}
              onCheckedChange={() => setVisible(filteredIds, allState !== true)}
              aria-label="Mostrar u ocultar todas las unidades"
            />
            Todas
          </label>
        </div>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar unidad, IMEI o usuario…"
            aria-label="Buscar unidades"
            className="pl-9"
          />
        </div>
        {query.isError ? (
          <p className="mt-3 text-sm text-destructive">
            {query.error instanceof Error ? query.error.message : 'Error al consultar la plataforma.'}
          </p>
        ) : null}
        <ul className="mt-3 max-h-[380px] space-y-2 overflow-auto pr-1 text-sm">
          {filtered.map((unit) => {
            const isVisible = !hidden.has(unit.id)
            return (
              <li
                key={unit.id}
                className={`flex items-start gap-3 rounded-md border px-3 py-2 ${
                  focusId === unit.id ? 'border-primary' : 'border-border/60'
                } ${isVisible ? '' : 'opacity-60'}`}
              >
                <Checkbox
                  className="mt-0.5"
                  checked={isVisible}
                  onCheckedChange={(value) => setVisible([unit.id], value === true)}
                  aria-label={`Mostrar ${unit.name} en el mapa`}
                />
                <button onClick={() => setFocusId(unit.id)} className="min-w-0 flex-1 text-left">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold">{unit.name}</span>
                    <span
                      className={`shrink-0 text-xs uppercase ${unit.online ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      {unit.online ? 'En línea' : 'Sin señal'}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {unit.imei ? `IMEI ${unit.imei}` : `#${unit.id}`}
                    {unit.creatorName ? ` · ${unit.creatorName}` : ''}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {unit.speed != null ? `${Math.round(unit.speed)} km/h · ` : ''}
                    {unit.lastMessage
                      ? new Date(unit.lastMessage * 1000).toLocaleString('es-MX')
                      : 'sin mensajes'}
                  </span>
                </button>
              </li>
            )
          })}
          {!query.isLoading && filtered.length === 0 ? (
            <li className="text-muted-foreground">
              {units.length === 0 ? 'No hay unidades en esta cuenta.' : 'Ninguna unidad coincide con la búsqueda.'}
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  )
}
