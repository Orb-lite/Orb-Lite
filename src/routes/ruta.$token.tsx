import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, MapPin, Navigation, Flag, Loader2 } from "lucide-react";
import * as React from "react";
import {
  getSharedRoute,
  markSharedStopVisited,
} from "@/lib/route-share.functions";

export const Route = createFileRoute("/ruta/$token")({
  head: () => ({
    meta: [
      { title: "Ruta asignada | ORB-LITE" },
      {
        name: "description",
        content: "Consulta tu ruta, marca tus visitas y abre cada parada en Waze.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SharedRoutePage,
});

function wazeUrl(lat: number, lon: number) {
  return `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;
}

function SharedRoutePage() {
  const { token } = Route.useParams();
  const queryClient = useQueryClient();
  const markVisited = useServerFn(markSharedStopVisited);
  const [busyIndex, setBusyIndex] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const query = useQuery({
    queryKey: ["shared-route", token],
    queryFn: () => getSharedRoute({ data: { token } }),
    retry: false,
    refetchInterval: 30000,
  });

  const route = query.data;
  const stops = route?.stops ?? [];
  const nextIndex = stops.findIndex((stop) => !stop.visitedAt);
  const doneCount = stops.filter((stop) => stop.visitedAt).length;

  async function toggleStop(index: number, visited: boolean) {
    setBusyIndex(index);
    setError(null);
    try {
      await markVisited({ data: { token, stopIndex: index, visited } });
      await queryClient.invalidateQueries({ queryKey: ["shared-route", token] });
    } catch {
      setError("No se pudo actualizar la parada. Intenta de nuevo.");
    } finally {
      setBusyIndex(null);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-xl px-4 py-8">
        <header className="mb-6 text-center">
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-primary">
            ORB-LITE · Ruta asignada
          </p>
          {query.isLoading ? (
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Cargando ruta…
            </p>
          ) : query.isError || !route ? (
            <p className="mt-4 text-sm text-destructive">
              Este enlace de ruta no existe o fue eliminado.
            </p>
          ) : (
            <>
              <h1 className="mt-2 font-display text-2xl font-bold">{route.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {doneCount} de {stops.length} paradas visitadas
              </p>
              <div className="mx-auto mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${stops.length ? (doneCount / stops.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </>
          )}
        </header>

        {route && nextIndex >= 0 && stops[nextIndex] ? (
          <a
            href={wazeUrl(stops[nextIndex].lat, stops[nextIndex].lon)}
            target="_blank"
            rel="noreferrer"
            className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 font-display text-base font-bold uppercase tracking-widest text-primary-foreground shadow-lg"
          >
            <Navigation className="size-5" />
            Siguiente parada en Waze: {stops[nextIndex].label}
          </a>
        ) : null}

        {route && nextIndex === -1 && stops.length > 0 ? (
          <div className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-4 font-display text-sm font-bold uppercase tracking-widest text-primary">
            <Flag className="size-5" /> Ruta completada
          </div>
        ) : null}

        {error ? (
          <p className="mb-4 text-center text-sm text-destructive">{error}</p>
        ) : null}

        <ol className="space-y-3">
          {stops.map((stop, index) => {
            const visited = Boolean(stop.visitedAt);
            const isNext = index === nextIndex;
            return (
              <li
                key={index}
                className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                  visited
                    ? "border-primary/30 bg-primary/5"
                    : isNext
                      ? "border-primary bg-card shadow-sm"
                      : "border-border/70 bg-card/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleStop(index, !visited)}
                  disabled={busyIndex === index}
                  aria-label={
                    visited
                      ? `Quitar check de ${stop.label}`
                      : `Marcar visita en ${stop.label}`
                  }
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    visited
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40 text-transparent hover:border-primary"
                  }`}
                >
                  {busyIndex === index ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Check className="size-5" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-semibold ${
                      visited ? "text-muted-foreground line-through" : ""
                    }`}
                  >
                    {index === 0 ? "Salida: " : `Parada ${index}: `}
                    {stop.label}
                  </p>
                  {visited && stop.visitedAt ? (
                    <p className="text-xs text-muted-foreground">
                      Visitada{" "}
                      {new Date(stop.visitedAt).toLocaleString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  ) : isNext ? (
                    <p className="text-xs font-semibold text-primary">
                      Siguiente parada
                    </p>
                  ) : null}
                </div>

                <a
                  href={wazeUrl(stop.lat, stop.lon)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Abrir ${stop.label} en Waze`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <MapPin className="size-4" />
                </a>
              </li>
            );
          })}
        </ol>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          No necesitas iniciar sesión. Marca cada visita con el círculo y abre
          la navegación con el botón de Waze.
        </p>
      </div>
    </div>
  );
}
