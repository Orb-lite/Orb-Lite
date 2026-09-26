import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Info, Loader2, Play, Square } from "lucide-react";
import { wialonVideoStream } from "@/lib/wialon.functions";
import type { WialonSession } from "@/lib/wialon-session";

export const VIDEO_RESOLUTIONS = ["240p", "480p", "720p", "1080p"] as const;
export type VideoResolution = (typeof VIDEO_RESOLUTIONS)[number];

/** Bitrate promedio (kbps) que consume cada resolución en cámaras Wialon. */
const BITRATE_KBPS: Record<VideoResolution, number> = {
  "240p": 300,
  "480p": 800,
  "720p": 1500,
  "1080p": 3000,
};

/** Consumo aproximado por hora de transmisión continua. */
export function dataPerHour(resolution: VideoResolution) {
  const megabytesPerHour = (BITRATE_KBPS[resolution] * 3600) / 8 / 1000;
  return {
    megabytesPerHour,
    label:
      megabytesPerHour >= 1000
        ? `${(megabytesPerHour / 1000).toFixed(2)} GB/h`
        : `${Math.round(megabytesPerHour)} MB/h`,
  };
}

export function VideoPlayer({
  session,
  unitId,
  unitName,
  cameraIndex,
  cameraName,
}: {
  session: WialonSession;
  unitId: number;
  unitName: string;
  cameraIndex: number;
  cameraName: string;
}) {
  const streamFn = useServerFn(wialonVideoStream);
  const [resolution, setResolution] = React.useState<VideoResolution>("480p");
  const [url, setUrl] = React.useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const request = useMutation({
    mutationFn: () =>
      streamFn({
        data: {
          host: session.host,
          sid: session.sid,
          unitId,
          cameraIndex,
          mode: "live" as const,
          resolution,
        },
      }),
    onSuccess: (result) => setUrl(result.url),
  });

  // Reproduce la URL entregada por Wialon (HLS) en el elemento <video>.
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;
    let destroyed = false;
    let hls: { destroy: () => void } | null = null;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      void video.play().catch(() => undefined);
      return () => {
        video.removeAttribute("src");
        video.load();
      };
    }

    void import("hls.js").then(({ default: Hls }) => {
      if (destroyed || !Hls.isSupported()) return;
      const instance = new Hls({ lowLatencyMode: true });
      instance.loadSource(url);
      instance.attachMedia(video);
      instance.on(
        Hls.Events.MANIFEST_PARSED,
        () => void video.play().catch(() => undefined),
      );
      hls = instance;
    });

    return () => {
      destroyed = true;
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [url]);

  const consumption = dataPerHour(resolution);

  return (
    <div className="rounded-md border border-border/60 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-semibold">{cameraName}</p>
          <p className="text-xs text-muted-foreground">{unitName}</p>
        </div>
        <div className="flex items-end gap-2">
          <label className="text-xs text-muted-foreground">
            Resolución
            <select
              className="mt-1 block rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
              value={resolution}
              onChange={(event) => {
                setResolution(event.target.value as VideoResolution);
                setUrl(null);
              }}
            >
              {VIDEO_RESOLUTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          {url ? (
            <button
              type="button"
              onClick={() => setUrl(null)}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              <Square className="size-4" /> Detener
            </button>
          ) : (
            <button
              type="button"
              onClick={() => request.mutate()}
              disabled={request.isPending}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {request.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Play className="size-4" />
              )}
              Empezar a grabar
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 aspect-video overflow-hidden rounded-md bg-black/80">
        {url ? (
          <video
            ref={videoRef}
            controls
            playsInline
            muted
            className="size-full object-contain"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-center text-xs text-muted-foreground">
            {request.isPending
              ? "Solicitando video a la plataforma…"
              : "Presiona “Empezar a grabar” para solicitar la transmisión a la plataforma."}
          </div>
        )}
      </div>

      {request.isError ? (
        <p className="mt-2 text-sm text-destructive">
          {request.error instanceof Error
            ? request.error.message
            : "No se pudo iniciar la transmisión."}
        </p>
      ) : null}

      <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        <span>
          En {resolution} el video consume aproximadamente{" "}
          <strong>{consumption.label}</strong> de datos por hora de transmisión.
          Cada solicitud de grabación genera consumo en el plan de datos de la
          unidad; a mayor resolución, mayor costo.
        </span>
      </p>
    </div>
  );
}
