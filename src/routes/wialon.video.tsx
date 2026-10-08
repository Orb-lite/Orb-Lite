import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Camera,
  CheckCircle2,
  ExternalLink,
  HardDrive,
  Info,
  Radio,
  ShieldCheck,
  Video,
} from "lucide-react";
import { WialonGuard } from "@/components/wialon-guard";
import { wialonVideoSettings, wialonVideoUnits, wialonUnits } from "@/lib/wialon.functions";
import type { WialonSession } from "@/lib/wialon-session";

export const Route = createFileRoute("/wialon/video")({
  head: () => ({
    meta: [
      { title: "Cámaras y Video de Unidades | ORB-LITE" },
      {
        name: "description",
        content:
          "Consulta oficial de cámaras configuradas y sus estados mediante unit/get_video_settings.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <WialonGuard>{(session) => <VideoView session={session} />}</WialonGuard>,
});

const WIALON_VIDEO_URL = "https://hosting.wialon.com/";

function VideoView({ session }: { session: WialonSession }) {
  const videoUnitsFn = useServerFn(wialonVideoUnits);
  const videoSettingsFn = useServerFn(wialonVideoSettings);
  const allUnitsFn = useServerFn(wialonUnits);
  const [unitId, setUnitId] = React.useState<number | null>(null);

  const videoUnits = useQuery({
    queryKey: ["wialon-video-units", session.sid, session.host],
    queryFn: () => videoUnitsFn({ data: { host: session.host, sid: session.sid } }),
  });

  const allUnitsQuery = useQuery({
    queryKey: ["wialon-units", session.sid, session.host],
    queryFn: () => allUnitsFn({ data: { host: session.host, sid: session.sid } }),
  });

  const unitsList = React.useMemo(() => {
    const list = videoUnits.data?.units ?? [];
    if (list.length > 0) return list;
    return (allUnitsQuery.data?.units ?? []).map((u) => ({
      id: u.id,
      name: u.name,
      cameraCount: 0,
      brand: null,
    }));
  }, [videoUnits.data?.units, allUnitsQuery.data?.units]);

  const selectedId = unitId ?? unitsList[0]?.id ?? null;
  const selectedUnit = unitsList.find((unit) => unit.id === selectedId);

  const video = useQuery({
    queryKey: ["wialon-video-settings", session.sid, selectedId, session.host],
    queryFn: () =>
      videoSettingsFn({
        data: { host: session.host, sid: session.sid, unitId: selectedId! },
      }),
    enabled: selectedId != null,
  });

  return (
    <div className="space-y-6">
      {/* Encabezado y botón principal hacia la pestaña de video en Wialon */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Video className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-wide">
                Cámaras y Video de Unidades
              </h2>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Consulta oficial de cámaras (unit/get_video_settings)
              </span>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            ORB-LITE consulta de forma oficial las cámaras y estados configurados en tus unidades.
            La reproducción en vivo, grabaciones y permisos de usuario quedan completamente
            controlados por Wialon.
          </p>
        </div>

        <a
          href={WIALON_VIDEO_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow transition hover:bg-primary/90"
        >
          <ExternalLink className="size-4" />
          Abrir página oficial de Wialon
        </a>
      </div>

      {/* Selector de unidad */}
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <label className="block text-sm font-medium">
          Seleccionar Unidad
          <select
            className="mt-2 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            value={selectedId ?? ""}
            onChange={(event) => setUnitId(Number(event.target.value))}
            disabled={unitsList.length === 0}
          >
            {unitsList.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
                {unit.cameraCount > 0
                  ? ` · ${unit.cameraCount} cámara${unit.cameraCount === 1 ? "" : "s"}`
                  : ""}
                {unit.brand ? ` · ${unit.brand}` : ""}
              </option>
            ))}
          </select>
        </label>

        {videoUnits.isLoading && unitsList.length === 0 ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Buscando unidades disponibles en Wialon…
          </p>
        ) : null}

        {videoUnits.isError ? (
          <p className="mt-3 text-xs text-destructive">
            {videoUnits.error instanceof Error
              ? videoUnits.error.message
              : "No se pudieron consultar las unidades."}
          </p>
        ) : null}
      </div>

      {/* Detalle de cámaras y estados de la unidad seleccionada */}
      {video.isLoading ? (
        <div className="rounded-xl border border-border/60 bg-card p-8 text-center text-sm text-muted-foreground">
          Consultando cámaras oficiales mediante unit/get_video_settings…
        </div>
      ) : null}

      {video.isError ? (
        <div className="rounded-xl border border-destructive/40 bg-card p-6 text-sm text-destructive">
          <p className="font-semibold">
            {video.error instanceof Error
              ? video.error.message
              : "No se pudo consultar la configuración de video."}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Verifica que el usuario de Wialon cuente con los permisos necesarios para ver las
            propiedades detalladas de la unidad.
          </p>
        </div>
      ) : null}

      {video.data ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                {selectedUnit?.name ?? "Unidad"}
              </h3>
              <span className="rounded-full border border-border bg-muted/50 px-3 py-0.5 text-xs font-medium text-foreground">
                {video.data.cameras.length} cámara(s) detectada(s)
              </span>
              {selectedUnit?.brand ? (
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                  {selectedUnit.brand}
                </span>
              ) : null}
            </div>

            <a
              href={WIALON_VIDEO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline-offset-4 hover:underline"
            >
              Ir a Pestaña de Video en Wialon
              <ExternalLink className="size-3.5" />
            </a>
          </div>

          {video.data.cameras.length === 0 ? (
            <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
              <Camera className="mx-auto size-10 text-muted-foreground/50" />
              <h4 className="mt-3 font-semibold text-foreground">Sin cámaras configuradas</h4>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Esta unidad no tiene cámaras registradas en Wialon o tu usuario no tiene permisos de
                video asignados.
              </p>
              <div className="mt-5">
                <a
                  href={WIALON_VIDEO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/10"
                >
                  Configurar en Wialon Hosting <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {video.data.cameras.map((camera) => (
                <div
                  key={camera.index}
                  className="flex flex-col justify-between overflow-hidden rounded-xl border border-border/60 bg-card p-5 shadow-sm transition hover:border-primary/40"
                >
                  <div>
                    {/* Encabezado de la cámara */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono font-bold text-foreground">
                            Canal {camera.index}
                          </span>
                          <h4 className="font-semibold text-foreground">{camera.name}</h4>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Unidad: {selectedUnit?.name ?? `ID ${selectedId}`}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                        <CheckCircle2 className="size-3" />
                        Activa
                      </span>
                    </div>

                    {/* Visor representativo y estados */}
                    <div className="relative mt-4 aspect-video overflow-hidden rounded-lg border border-border/40 bg-zinc-950 p-4 text-center flex flex-col items-center justify-center">
                      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-black/60 px-2 py-0.5 text-[11px] font-mono text-white/80">
                        <Radio className="size-3 text-red-500 animate-pulse" />
                        CANAL {camera.index}
                      </div>

                      <Camera className="size-10 text-white/30" />
                      <p className="mt-2 text-xs font-medium text-white/90">{camera.name}</p>
                      <p className="mt-1 max-w-xs text-[11px] text-white/60">
                        Reproducción en vivo y grabaciones controladas por Wialon.
                      </p>

                      <a
                        href={WIALON_VIDEO_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-white/20 transition"
                      >
                        Abrir pestaña de video <ExternalLink className="size-3" />
                      </a>
                    </div>

                    {/* Estados detallados */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 p-2.5">
                        <HardDrive className="size-4 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">Grabación</p>
                          <p className="text-muted-foreground">
                            {camera.recording ? "Habilitada" : "Manual / eventos"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 p-2.5">
                        <ShieldCheck className="size-4 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">Permisos</p>
                          <p className="text-muted-foreground">Seguridad Wialon</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Transmisión en streaming: Oficial Wialon</span>
                    <a
                      href={WIALON_VIDEO_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Abrir Wialon <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {/* Nota informativa sobre control de reproducción y permisos */}
      <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-5 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            Control de reproducción y permisos en Wialon
          </p>
          <p>
            Para garantizar la máxima seguridad y compatibilidad, la transmisión de video en vivo y
            descarga de grabaciones están centralizadas en la pestaña de video oficial de Wialon
            Hosting (
            <a
              href={WIALON_VIDEO_URL}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              https://hosting.wialon.com/
            </a>
            ). ORB-LITE utiliza la consulta oficial{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
              unit/get_video_settings
            </code>{" "}
            sin recurrir a endpoints no documentados ni intermediarios no autorizados.
          </p>
        </div>
      </div>
    </div>
  );
}
