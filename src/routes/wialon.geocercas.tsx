import * as React from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Circle, Pentagon, RotateCcw } from "lucide-react";
import WialonMap, {
  type DrawingMode,
  type DrawingPoint,
  type MapGeofence,
} from "@/components/wialon-map";
import { WialonGuard } from "@/components/wialon-guard";
import { wialonCreateGeofence, wialonGeofences } from "@/lib/wialon.functions";
import type { WialonSession } from "@/lib/wialon-session";

export const Route = createFileRoute("/wialon/geocercas")({
  head: () => ({
    meta: [
      { title: "Geocercas | Plataforma ORB-LITE" },
      {
        name: "description",
        content: "Crea geocercas en Wialon y visualízalas en el mapa.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <WialonGuard>{(session) => <GeocercasView session={session} />}</WialonGuard>,
});

type Draft = { type: DrawingMode; points: DrawingPoint[] };

const inputClass =
  "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary";

function colorToNumber(value: string) {
  return Number.parseInt(value.replace("#", ""), 16);
}

function GeocercasView({ session }: { session: WialonSession }) {
  const fetchGeofences = useServerFn(wialonGeofences);
  const createGeofence = useServerFn(wialonCreateGeofence);
  const queryClient = useQueryClient();
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<DrawingMode>("circle");
  const [color, setColor] = React.useState("#38bdf8");
  const [resourceId, setResourceId] = React.useState<number | null>(null);
  const [drawMode, setDrawMode] = React.useState<DrawingMode | null>(null);
  const [drawingResetKey, setDrawingResetKey] = React.useState(0);
  const [draft, setDraft] = React.useState<Draft | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const query = useQuery({
    queryKey: ["wialon-geofences", session.sid],
    queryFn: () => fetchGeofences({ data: { host: session.host, sid: session.sid } }),
    refetchInterval: 60000,
  });
  const zones = query.data?.zones ?? [];
  const resources = query.data?.resources ?? [];
  const selectedResourceId = resourceId ?? resources[0]?.id ?? null;

  const mapGeofences: MapGeofence[] = zones.map((zone) => ({
    id: zone.id,
    name: zone.name,
    resource: zone.resource,
    type: zone.type,
    color: zone.color,
    points: zone.points,
  }));

  function chooseType(nextType: DrawingMode) {
    setType(nextType);
    setDrawMode(null);
    setDraft(null);
    setDrawingResetKey((value) => value + 1);
  }

  function startDrawing() {
    setError(null);
    setMessage(null);
    setDraft({ type, points: [] });
    setDrawMode(type);
    setDrawingResetKey((value) => value + 1);
  }

  function resetDrawing() {
    setDraft(null);
    setDrawMode(null);
    setDrawingResetKey((value) => value + 1);
  }

  async function saveGeofence(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedResourceId) {
      setError("Selecciona un recurso con permisos para crear geocercas.");
      return;
    }
    if (!draft || draft.points.length === 0) {
      setError("Dibuja la geocerca en el mapa antes de guardarla.");
      return;
    }
    if (draft.type === "polygon" && draft.points.length < 3) {
      setError("El polígono necesita al menos tres puntos.");
      return;
    }
    if (draft.type === "circle" && draft.points[0]!.radius < 10) {
      setError("El círculo debe medir al menos 10 metros.");
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const created = await createGeofence({
        data: {
          host: session.host,
          sid: session.sid,
          resourceId: selectedResourceId,
          name,
          type: draft.type,
          color: colorToNumber(color),
          points: draft.points,
        },
      });
      setMessage(`Geocerca "${created.name}" creada correctamente.`);
      setName("");
      resetDrawing();
      await queryClient.invalidateQueries({
        queryKey: ["wialon-geofences", session.sid],
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo crear la geocerca.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Dibuja una zona, asigna un color y guárdala directamente en tu recurso de Wialon.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <ClientOnly
          fallback={<div className="h-[560px] rounded-lg border border-border/60 bg-card/40" />}
        >
          <WialonMap
            units={[]}
            geofences={mapGeofences}
            drawMode={drawMode}
            drawingResetKey={drawingResetKey}
            onDraftChange={setDraft}
          />
        </ClientOnly>

        <form onSubmit={saveGeofence} className="rounded-lg border border-border/60 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-sm font-bold uppercase tracking-widest">
                Nueva geocerca
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {draft?.points.length ?? 0} puntos dibujados
              </p>
            </div>
            <button
              type="button"
              onClick={resetDrawing}
              className="rounded-md border border-border p-2 text-muted-foreground hover:border-primary hover:text-primary"
              aria-label="Borrar dibujo actual"
              title="Borrar dibujo actual"
            >
              <RotateCcw className="size-4" />
            </button>
          </div>

          <label className="mt-5 block text-sm">
            Nombre
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              placeholder="Ej. Centro de distribución"
              required
              minLength={2}
              maxLength={100}
            />
          </label>

          <label className="mt-4 block text-sm">
            Recurso de Wialon
            <select
              className={inputClass}
              value={selectedResourceId ?? ""}
              onChange={(event) => setResourceId(Number(event.target.value))}
              required
            >
              <option value="" disabled>
                Selecciona un recurso
              </option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="mt-4">
            <legend className="text-sm">Tipo de geocerca</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { value: "circle" as const, label: "Círculo", icon: Circle },
                { value: "polygon" as const, label: "Polígono", icon: Pentagon },
              ].map((option) => {
                const Icon = option.icon;
                const selected = type === option.value;
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => chooseType(option.value)}
                    className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary"
                    }`}
                    aria-pressed={selected}
                  >
                    <Icon className="size-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="mt-4 flex items-center justify-between gap-3 text-sm">
            Color
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{color}</span>
              <input
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="size-9 cursor-pointer rounded border border-border bg-transparent p-1"
                aria-label="Color de la geocerca"
              />
            </span>
          </label>

          <button
            type="button"
            onClick={startDrawing}
            className="mt-5 w-full rounded-md border border-primary px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            {drawMode ? "Dibujando en el mapa…" : "Comenzar a dibujar"}
          </button>

          {drawMode === "polygon" ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Haz clic en el mapa para añadir vértices. El polígono se guardará con los puntos
              actuales.
            </p>
          ) : null}
          {drawMode === "circle" ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Haz clic en el centro y luego en el borde para definir el radio.
            </p>
          ) : null}

          {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
          {message ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-primary">
              <Check className="size-4" />
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy || !name.trim() || !selectedResourceId || !draft?.points.length}
            className="mt-5 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Guardando…" : "Guardar geocerca"}
          </button>
        </form>
      </div>

      <div className="rounded-lg border border-border/60 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest">
            Geocercas existentes
          </h2>
          <span className="text-xs text-muted-foreground">{zones.length}</span>
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone) => (
            <li
              key={`${zone.resourceId}-${zone.id}`}
              className="flex items-center gap-3 rounded-md border border-border/60 px-3 py-2 text-sm"
            >
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: zone.color }}
              />
              <span className="min-w-0 flex-1 truncate">{zone.name}</span>
              <span className="text-xs text-muted-foreground">
                {zone.type === 3 ? "Círculo" : "Polígono"}
              </span>
            </li>
          ))}
          {!query.isLoading && zones.length === 0 ? (
            <li className="text-sm text-muted-foreground">
              No hay geocercas en los recursos disponibles.
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
