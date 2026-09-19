import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import { Button } from "@/components/ui/button";
import { wialonHistory, type WialonMessage } from "@/lib/wialon.functions";
import type { WialonSession } from "@/lib/wialon-session";

type DynamicTrackProps = {
  session: WialonSession;
  unitId: number | null;
  className?: string;
};

type Range = { from: string; to: string };

function toDateTimeLocal(timestamp: number): string {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function defaultRange(): Range {
  const now = Date.now();
  return { from: toDateTimeLocal(now - 60 * 60 * 1000), to: toDateTimeLocal(now) };
}

function toUnix(value: string): number | null {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? Math.floor(timestamp / 1000) : null;
}

function trackPoints(messages: WialonMessage[]): Array<{ point: LatLngExpression; speed: number }> {
  return messages.flatMap((message) =>
    message.lat != null && message.lon != null
      ? [{ point: [message.lat, message.lon] as LatLngExpression, speed: message.speed ?? 0 }]
      : [],
  );
}

function speedColor(speed: number): string {
  if (speed < 5) return "#94a3b8";
  if (speed < 50) return "#a3e635";
  if (speed < 90) return "#facc15";
  return "#f97316";
}

function FitTrack({ points }: { points: LatLngExpression[] }) {
  const map = useMap();
  React.useEffect(() => {
    const first = points.at(0);
    if (!first) return;
    if (points.length > 1) {
      const bounds = L.latLngBounds(first, first);
      for (const point of points.slice(1)) bounds.extend(point);
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 16 });
    } else {
      map.setView(first, 16);
    }
  }, [map, points]);
  return null;
}

/** Análisis de trayecto Wialon Hosting: consulta mensajes y colorea cada segmento según velocidad. */
export function DynamicTrack({ session, unitId, className }: DynamicTrackProps) {
  const history = useServerFn(wialonHistory);
  const initialRange = React.useMemo(defaultRange, []);
  const [draftRange, setDraftRange] = React.useState<Range>(initialRange);
  const [range, setRange] = React.useState<Range>(initialRange);
  const [rangeError, setRangeError] = React.useState<string | null>(null);

  const timeFrom = toUnix(range.from);
  const timeTo = toUnix(range.to);
  const validRange = timeFrom != null && timeTo != null && timeTo > timeFrom;

  const trackQuery = useQuery({
    queryKey: ["wialon-track", session.sid, unitId, timeFrom, timeTo],
    queryFn: () =>
      history({
        data: {
          host: session.host,
          sid: session.sid,
          unitId: unitId!,
          timeFrom: timeFrom!,
          timeTo: timeTo!,
        },
      }),
    enabled: session.host === "full" && unitId != null && validRange,
  });

  const points = React.useMemo(
    () => trackPoints(trackQuery.data?.messages ?? []),
    [trackQuery.data?.messages],
  );
  const positions = React.useMemo(() => points.map(({ point }) => point), [points]);

  function applyRange() {
    const from = toUnix(draftRange.from);
    const to = toUnix(draftRange.to);
    if (from == null || to == null || to <= from) {
      setRangeError("Selecciona un rango de tiempo válido.");
      return;
    }
    setRangeError(null);
    setRange(draftRange);
  }

  if (session.host !== "full") {
    return (
      <div className="rounded-xl border border-border/60 p-5 text-sm text-muted-foreground">
        El análisis dinámico de trayectos está disponible únicamente en ORB-FULL.
      </div>
    );
  }

  if (unitId == null) {
    return (
      <div className="rounded-xl border border-border/60 p-5 text-sm text-muted-foreground">
        Selecciona una unidad para consultar su trayectoria.
      </div>
    );
  }

  return (
    <section
      className={`space-y-4 rounded-xl border border-border/60 bg-card p-4 ${className ?? ""}`}
    >
      <div className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-sm">
          Desde
          <input
            type="datetime-local"
            value={draftRange.from}
            max={draftRange.to}
            onChange={(event) =>
              setDraftRange((current) => ({ ...current, from: event.target.value }))
            }
            className="rounded-md border border-input bg-background px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Hasta
          <input
            type="datetime-local"
            value={draftRange.to}
            min={draftRange.from}
            onChange={(event) =>
              setDraftRange((current) => ({ ...current, to: event.target.value }))
            }
            className="rounded-md border border-input bg-background px-3 py-2"
          />
        </label>
        <Button type="button" onClick={applyRange} disabled={trackQuery.isFetching}>
          {trackQuery.isFetching ? "Consultando…" : "Ver trayecto"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          <i className="mr-1 inline-block size-2 rounded-full bg-slate-400" />
          Detenido
        </span>
        <span>
          <i className="mr-1 inline-block size-2 rounded-full bg-lime-400" />
          0–49 km/h
        </span>
        <span>
          <i className="mr-1 inline-block size-2 rounded-full bg-yellow-400" />
          50–89 km/h
        </span>
        <span>
          <i className="mr-1 inline-block size-2 rounded-full bg-orange-500" />
          90+ km/h
        </span>
      </div>

      {rangeError ? <p className="text-sm text-destructive">{rangeError}</p> : null}
      {trackQuery.isError ? (
        <p className="text-sm text-destructive">
          {trackQuery.error instanceof Error
            ? trackQuery.error.message
            : "No se pudo cargar el trayecto."}
        </p>
      ) : null}

      <div className="h-80 overflow-hidden rounded-lg border border-border/60 sm:h-[460px]">
        <MapContainer
          center={[20.6736, -103.344]}
          zoom={11}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitTrack points={positions} />
          {points.slice(1).map((current, index) => {
            const previous = points[index];
            if (!previous) return null;
            return (
              <Polyline
                key={`${index}-${current.speed}`}
                positions={[previous.point, current.point]}
                pathOptions={{ color: speedColor(current.speed), weight: 4, opacity: 0.9 }}
              />
            );
          })}
        </MapContainer>
      </div>

      {!trackQuery.isLoading && trackQuery.data && points.length < 2 ? (
        <p className="text-sm text-muted-foreground">
          No hay suficientes posiciones GPS para dibujar un trayecto.
        </p>
      ) : null}
    </section>
  );
}
