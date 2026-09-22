import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { ExternalLink, Video } from 'lucide-react'
import { WialonGuard } from '@/components/wialon-guard'
import { wialonVideoSettings, wialonVideoUnits } from '@/lib/wialon.functions'
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
  const videoUnitsFn = useServerFn(wialonVideoUnits)
  const videoFn = useServerFn(wialonVideoSettings)
  const [unitId, setUnitId] = React.useState<number | null>(null)

  const videoUnits = useQuery({
    queryKey: ['wialon-video-units', session.sid],
    queryFn: () => videoUnitsFn({ data: { host: session.host, sid: session.sid } }),
  })
  const selectedId = unitId ?? videoUnits.data?.units[0]?.id ?? null
  const selectedUnit = videoUnits.data?.units.find((unit) => unit.id === selectedId)

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
          disabled={videoUnits.isLoading || videoUnits.data?.units.length === 0}
        >
          {videoUnits.data?.units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name} · {unit.cameraCount} cámara{unit.cameraCount === 1 ? '' : 's'}
            </option>
          ))}
        </select>
      </label>

      {videoUnits.isLoading ? <p className="text-sm text-muted-foreground">Buscando unidades con video…</p> : null}
      {videoUnits.isError ? (
        <p className="text-sm text-destructive">
          {videoUnits.error instanceof Error
            ? videoUnits.error.message
            : 'No se pudieron consultar las unidades con video.'}
        </p>
      ) : null}
      {videoUnits.data && videoUnits.data.units.length === 0 ? (
        <div className="rounded-lg border border-border/60 p-5 text-sm text-muted-foreground">
          No hay unidades con cámaras configuradas o tu token no tiene el permiso “Ver propiedades detalladas del elemento”.
        </div>
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
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {video.data.cameras.map((camera) => (
                <div key={camera.index} className="space-y-2">
                  <VideoPlayer
                    session={session}
                    unitId={selectedId!}
                    unitName={selectedUnit?.name ?? 'Unidad'}
                    cameraIndex={camera.index}
                    cameraName={camera.name}
                  />
                  <p className="px-1 text-xs text-muted-foreground">
                    {camera.active ? 'Cámara activa' : 'Cámara inactiva'} ·{' '}
                    {camera.recording ? 'Grabación habilitada' : 'Sin grabación configurada'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  )
}
