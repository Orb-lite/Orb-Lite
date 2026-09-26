import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, MapPin, Navigation, Flag, Loader2, Download } from "lucide-react";
import * as React from "react";
import {
  getSharedRoute,
  markSharedStopVisited,
  commentSharedStop,
  finishSharedRoute,
} from "@/lib/route-share.functions";
import { downloadExcelWorkbook } from "@/lib/excel-export";

const SharedRouteMap = React.lazy(() => import("@/components/wialon/SharedRouteMap"));

function getPosition(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Tu teléfono no permite ubicación."));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => reject(new Error("Activa tu ubicación para marcar la visita.")),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
}

export const Route = createFileRoute("/ruta/$token")({
  head: () => ({
    meta: [
      { title: "Ruta asignada | ORB-LITE" },
      {
        name: "description",
        content: "Consulta tu ruta, marca tus visitas y abre cada parada en Waze.",
      },
      { property: "og:title", content: "Ruta asignada | ORB-LITE" },
      { property: "og:description", content: "Consulta tu ruta y registra las visitas del recorrido." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SharedRoutePage,
});

function wazeUrl(lat: number, lon: number) {
  return `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;
}

type SharedStop = {
  label: string;
  lat: number;
  lon: number;
  visitedAt?: string | null;
  comment?: string | null;
  contact?: boolean | null;
};

async function exportVisitReport(routeName: string, stops: SharedStop[]) {
  const rows = [
    ["Parada", "Ubicación", "Latitud", "Longitud", "Hora de visita", "Acercamiento", "Nota"],
    ...stops.map((stop, index) => [
      index === 0 ? "Salida" : `Parada ${index}`,
      stop.label,
      stop.lat,
      stop.lon,
      stop.visitedAt
        ? new Date(stop.visitedAt).toLocaleString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Sin visitar",
      stop.contact == null ? "" : stop.contact ? "Sí" : "No",
      stop.comment ?? "",
    ]),
  ];
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
  await downloadExcelWorkbook({
    filename: `reporte-visitas-${routeName.replace(/\s+/g, "-")}-${stamp}.xlsx`,
    sheets: [{ name: "Reporte de visitas", rows }],
  });
}

function SharedRoutePage() {
  const { token } = Route.useParams();
  const queryClient = useQueryClient();
  const markVisited = useServerFn(markSharedStopVisited);
  const finishRoute = useServerFn(finishSharedRoute);
  const [busyIndex, setBusyIndex] = React.useState<number | null>(null);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [checking, setChecking] = React.useState<number | null>(null);
  const [me, setMe] = React.useState<{ lat: number; lon: number } | null>(null);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      (p) => setMe({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => undefined,
      { enableHighAccuracy: true, maximumAge: 15000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

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

  async function toggleStop(
    index: number,
    visited: boolean,
    check?: { contact: boolean; note: string },
  ) {
    if (visited && !check) {
      setChecking(index);
      return;
    }
    setBusyIndex(index);
    setError(null);
    try {
      const pos = visited ? await getPosition() : undefined;
      await markVisited({ data: { token, stopIndex: index, visited, ...pos, ...check } });
      setChecking(null);
      await queryClient.invalidateQueries({ queryKey: ["shared-route", token] });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo actualizar la parada.");
    } finally {
      setBusyIndex(null);
    }
  }

  async function sendSummary() {
    setSending(true);
    setError(null);
    try {
      await finishRoute({ data: { token } });
      await queryClient.invalidateQueries({ queryKey: ["shared-route", token] });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo enviar el resumen.");
    } finally {
      setSending(false);
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

        {route && mounted ? (
          <div className="mb-6 overflow-hidden rounded-xl border border-border/70">
            <React.Suspense fallback={<div className="h-64 bg-card" />}>
              <SharedRouteMap
                path={route.path}
                stops={stops.map((s) => ({ ...s, visited: Boolean(s.visitedAt) }))}
                nextIndex={nextIndex}
                me={me}
              />
            </React.Suspense>
          </div>
        ) : null}

        {error && checking === null ? (
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
                  {visited && stop.contact != null ? (
                    <p className="text-xs text-primary">
                      {stop.contact ? "Con acercamiento" : "Sin acercamiento"}
                    </p>
                  ) : null}
                  {visited ? (
                    <CommentBox token={token} index={index} initial={stop.comment ?? ""} />
                  ) : null}
                  {checking === index ? (
                    <CheckForm
                      busy={busyIndex === index}
                      error={error}
                      onCancel={() => {
                        setChecking(null);
                        setError(null);
                      }}
                      onConfirm={(check) => void toggleStop(index, true, check)}
                    />
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

        {route && nextIndex === -1 && stops.length > 0 ? (
          route.reportSent ? (
            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-4 font-display text-sm font-bold uppercase tracking-widest text-primary">
              <Flag className="size-5" /> Resumen enviado
            </div>
          ) : (
            <button type="button" onClick={() => void sendSummary()} disabled={sending} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-50">
              <Flag className="size-5" /> {sending ? "Enviando…" : "Terminar y enviar resumen"}
            </button>
          )
        ) : null}

        {route && doneCount > 0 ? (
          <section className="mt-8 rounded-xl border border-border/70 bg-card/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-sm font-bold uppercase tracking-widest">
                Reporte de visitas
              </h2>
              <button
                type="button"
                onClick={() => void exportVisitReport(route.name, stops)}
                className="inline-flex items-center gap-1.5 rounded-md border border-primary/50 px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                <Download className="size-3.5" /> Excel
              </button>
            </div>
            <ul className="mt-3 divide-y divide-border/60 text-sm">
              {stops.map((stop, index) =>
                stop.visitedAt ? (
                  <li key={index} className="py-2">
                    <div className="flex justify-between gap-3">
                      <span className="truncate font-medium">{stop.label}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {new Date(stop.visitedAt).toLocaleTimeString("es-MX", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {stop.contact != null ? (
                      <p className="mt-0.5 text-xs text-primary">
                        {stop.contact ? "Con acercamiento" : "Sin acercamiento"}
                      </p>
                    ) : null}
                    {stop.comment ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">{stop.comment}</p>
                    ) : null}
                  </li>
                ) : null,
              )}
            </ul>
            {route.reportSent ? (
              <p className="mt-3 text-xs text-primary">Reporte enviado.</p>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}

function CheckForm({
  busy,
  error,
  onCancel,
  onConfirm,
}: {
  busy: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: (check: { contact: boolean; note: string }) => void;
}) {
  const [contact, setContact] = React.useState<boolean | null>(null);
  const [note, setNote] = React.useState("");
  const ready = contact !== null && note.trim().length >= 3;
  return (
    <div className="mt-3 space-y-2 rounded-lg border border-primary/40 bg-background/60 p-3">
      <p className="text-xs font-semibold">¿Tuviste acercamiento?</p>
      <div className="flex gap-2">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => setContact(v)}
            className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold ${
              contact === v ? "border-primary bg-primary text-primary-foreground" : "border-border"
            }`}
          >
            {v ? "Sí" : "No"}
          </button>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        maxLength={1000}
        placeholder="Nota de la visita"
        className="w-full resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 rounded-md border border-border px-2 py-1.5 text-xs">
          Cancelar
        </button>
        <button
          type="button"
          disabled={!ready || busy}
          onClick={() => contact !== null && onConfirm({ contact, note: note.trim() })}
          className="flex-1 rounded-md bg-primary px-2 py-1.5 text-xs font-bold text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Verificando…" : "Confirmar visita"}
        </button>
      </div>
    </div>
  );
}

function CommentBox({ token, index, initial }: { token: string; index: number; initial: string }) {
  const save = useServerFn(commentSharedStop);
  const queryClient = useQueryClient();
  const [value, setValue] = React.useState(initial);
  const [state, setState] = React.useState<"idle" | "saving" | "saved">("idle");
  React.useEffect(() => setValue(initial), [initial]);

  async function commit() {
    if (value.trim() === initial.trim()) return;
    setState("saving");
    try {
      await save({ data: { token, stopIndex: index, comment: value } });
      await queryClient.invalidateQueries({ queryKey: ["shared-route", token] });
      setState("saved");
      window.setTimeout(() => setState("idle"), 1500);
    } catch {
      setState("idle");
    }
  }

  return (
    <div className="mt-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        rows={1}
        maxLength={1000}
        placeholder="Comentario"
        className="w-full resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
      />
      {state !== "idle" ? (
        <p className="text-[10px] text-muted-foreground">
          {state === "saving" ? "Guardando…" : "Guardado"}
        </p>
      ) : null}
    </div>
  );
}
