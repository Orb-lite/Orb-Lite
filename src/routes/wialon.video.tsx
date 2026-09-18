import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { ExternalLink, Video } from 'lucide-react'
import { WialonGuard } from '@/components/wialon-guard'
import { wialonUnits, wialonVideoSettings } from '@/lib/wialon.functions'
import { PLATFORM_URLS, type WialonSession } from '@/lib/wialon-session'

export const Route = createFileRoute('/wialon/video')({
  head: () => ({
    meta: [
      { title: 'Video de unidades | ORB-FULL' },
      { name: 'description', content: 'Consulta las cámaras configuradas de tus unidades ORB-FULL.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: () => <WialonGuard>{(session) => <VideoView session={session} />}</WialonGuard>,
})

function VideoView({ session }: { session: WialonSession }) {
  if (session.host !== 'full') {
    return (
      <div className="rounded-lg border border-border/60 p-6 text-sm text-muted-foreground">
        El video está disponible únicamente para cuentas ORB-FULL.
      </div>
    )
  }

  return <FullVideoView session={session} />
}

function FullVideoView({ session }: { session: WialonSession }) {
  const unitsFn = useServerFn(wialonUnits)
  const videoFn = useServerFn(wialonVideoSettings)
  const [unitId, setUnitId] = React.useState<number | null>(null)

  const units = useQuery({
    queryKey: ['wialon-units', session.sid],
    queryFn: () => unitsFn({ data: { host: session.host, sid: session.sid } }),
  })
  const selectedId = unitId ?? units.data?.units[0]?.id ?? null
  const selectedUnit = units.data?.units.find((unit) => unit.id === selectedId)

  const video = useQuery({
    queryKey: ['wialon-video-settings', session.sid, selectedId],
    queryFn: () => videoFn({ data: { host: session.host, sid: session.sid, unitId: selectedId! } }),
    enabled: selectedId != null,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border/60 p-5">
        <div>
          <div className="flex items-center gap-2">
            <Video className="size-5 text-primary" />
            <h2 className="font-display text-lg font-bold uppercase tracking-wide">Video de unidades</h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Consulta las cámaras registradas y su estado. El visor oficial de Wialon reproduce el video en vivo y las grabaciones de forma segura.
          </p>
        </div>
        <a
          href={PLATFORM_URLS.full.app}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
        >
          Abrir visor oficial <ExternalLink className="size-4" />
        </a>
      </div>

      <label className="block max-w-xl text-sm">
        Unidad
        <select
          className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary"
          value={selectedId ?? ''}
          onChange={(event) => setUnitId(Number(event.target.value))}
          disabled={units.isLoading || units.data?.units.length === 0}
        >
          {units.data?.units.map((unit) => (
            <option key={unit.id} value={unit.id}>{unit.name}</option>
          ))}
        </select>
      </label>

      {units.isError ? (
        <p className="text-sm text-destructive">
          {units.error instanceof Error ? units.error.message : 'No se pudieron consultar las unidades.'}
        </p>
      ) : null}

      {video.isLoading ? <p className="text-sm text-muted-foreground">Consultando cámaras…</p> : null}
      {video.isError ? (
        <div className="rounded-lg border border-destructive/40 p-5 text-sm text-destructive">
          {video.error instanceof Error ? video.error.message : 'No se pudo consultar la configuración de video.'}
          <p className="mt-2 text-muted-foreground">
            Tu usuario necesita permisos para ver propiedades detalladas de la unidad y el servicio de video debe estar habilitado.
          </p>
        </div>
      ) : null}

      {video.data ? (
        <section className="rounded-lg border border-border/60 p-5">
          <h3 className="font-display text-base font-bold uppercase tracking-wide">
            {selectedUnit?.name ?? 'Unidad'} · {video.data.cameras.length} cámara(s)
          </h3>
          {video.data.cameras.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Esta unidad no tiene cámaras configuradas o no tienes permiso para consultarlas.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {video.data.cameras.map((camera) => (
                <article key={camera.index} className="rounded-md border border-border/60 p-4">
                  <p className="font-semibold">{camera.name}</p>
                  <p className={camera.active ? 'mt-2 text-sm text-primary' : 'mt-2 text-sm text-muted-foreground'}>
                    {camera.active ? 'Cámara activa' : 'Cámara inactiva'}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {camera.recording ? 'Grabación habilitada' : 'Sin grabación configurada'}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  )
}
