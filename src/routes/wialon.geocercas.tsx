import * as React from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Circle,
  Pentagon,
  RefreshCw,
  RotateCcw,
  Trash2,
  Eye,
  MapPin,
  Building2,
} from "lucide-react";
import { WialonGuard } from "@/components/wialon-guard";
import { PlatformHeader } from "@/components/wialon/PlatformHeader";
import type {
  DrawingMode,
  DrawingPoint,
  MapGeofence,
} from "@/components/wialon-map";

const WialonMap = React.lazy(() => import("@/components/wialon-map"));
import {
  wialonCreateGeofence,
  wialonDeleteGeofence,
  wialonGeofences,
} from "@/lib/wialon.functions";
import type { WialonSession } from "@/lib/wialon-session";

export const Route = createFileRoute("/wialon/geocercas")({
  head: () => ({
    meta: [
      { title: "Geocercas | Plataforma ORB-LITE" },
      {
        name: "description",
        content:
          "Crea y administra geocercas en Wialon de cada cliente y visualízalas en el mapa.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <WialonGuard>
      {(session) => <GeocercasView session={session} />}
    </WialonGuard>
  ),
});

type Draft = { type: DrawingMode; points: DrawingPoint[] };

const inputClass =
  "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary text-sm";

function colorToNumber(value: string) {
  return Number.parseInt(value.replace("#", ""), 16);
}

function GeocercasView({ session }: { session: WialonSession }) {
  const fetchGeofences = useServerFn(wialonGeofences);
  const createGeofence = useServerFn(wialonCreateGeofence);
  const deleteGeofence = useServerFn(wialonDeleteGeofence);
  const queryClient = useQueryClient();

  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<DrawingMode>("circle");
  const GEOFENCE_COLOR = "#92d700";
  const [filterResourceId, setFilterResourceId] = React.useState<
    number | "all"
  >("all");
  const [createResourceId, setCreateResourceId] = React.useState<number | null>(
    null,
  );
  const [focusedGeofenceId, setFocusedGeofenceId] = React.useState<
    number | null
  >(null);
  const [drawMode, setDrawMode] = React.useState<DrawingMode | null>(null);
  const [drawingResetKey, setDrawingResetKey] = React.useState(0);
  const [draft, setDraft] = React.useState<Draft | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(
    null,
  );
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const query = useQuery({
    queryKey: ["wialon-geofences", session.sid],
    queryFn: () =>
      fetchGeofences({ data: { host: session.host, sid: session.sid } }),
    refetchInterval: 60000,
  });

  const allZones = query.data?.zones ?? [];
  const resources = query.data?.resources ?? [];

  // Filtrar geocercas que no son rutas lineales (tipo 2 = polígono, tipo 3 = círculo)
  const polygonOrCircleZones = allZones.filter(
    (z) => z.type === 2 || z.type === 3,
  );

  // Filtrar por el cliente/recurso seleccionado
  const visibleZones =
    filterResourceId === "all"
      ? polygonOrCircleZones
      : polygonOrCircleZones.filter((z) => z.resourceId === filterResourceId);

  // Recurso seleccionado para crear
  const targetResourceId =
    createResourceId ??
    (filterResourceId !== "all"
      ? filterResourceId
      : (resources[0]?.id ?? null));

  const mapGeofences: MapGeofence[] = visibleZones.map((zone) => ({
    id: zone.id,
    name: zone.name,
    resource: zone.resource,
    type: zone.type,
    color: GEOFENCE_COLOR,
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

  async function handleRefresh() {
    setError(null);
    setMessage(null);
    await query.refetch();
    setMessage("Geocercas sincronizadas con Wialon.");
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleDelete(zone: {
    id: number;
    resourceId: number;
    name: string;
  }) {
    if (confirmDeleteId !== zone.id) {
      setConfirmDeleteId(zone.id);
      return;
    }

    setDeletingId(zone.id);
    setConfirmDeleteId(null);
    setError(null);
    setMessage(null);
    try {
      await deleteGeofence({
        data: {
          host: session.host,
          sid: session.sid,
          resourceId: zone.resourceId,
          zoneId: zone.id,
        },
      });
      setMessage(`Geocerca "${zone.name}" eliminada de Wialon.`);
      if (focusedGeofenceId === zone.id) setFocusedGeofenceId(null);
      await queryClient.invalidateQueries({
        queryKey: ["wialon-geofences", session.sid],
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo eliminar la geocerca de Wialon.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function saveGeofence(event: React.FormEvent) {
    event.preventDefault();
    if (!targetResourceId) {
      setError(
        "Selecciona el cliente / recurso de Wialon donde guardar la geocerca.",
      );
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
          resourceId: targetResourceId,
          name,
          type: draft.type,
          color: colorToNumber(GEOFENCE_COLOR),
          points: draft.points,
        },
      });
      setMessage(`Geocerca "${created.name}" guardada exitosamente en Wialon.`);
      setName("");
      resetDrawing();
      await queryClient.invalidateQueries({
        queryKey: ["wialon-geofences", session.sid],
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo crear la geocerca en Wialon.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PlatformHeader session={session} />

      {/* Barra de control superior: selección de cliente y sincronización */}
      <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card/60 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Geocercas por Cliente / Recurso
            </h2>
            <p className="text-xs text-muted-foreground">
              {resources.length} recurso{resources.length !== 1 ? "s" : ""}{" "}
              disponible{resources.length !== 1 ? "s" : ""} en Wialon
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="client-filter-select" className="sr-only">
            Filtrar por cliente o recurso
          </label>
          <select
            id="client-filter-select"
            className="rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary sm:text-sm"
            value={filterResourceId}
            onChange={(e) => {
              const val = e.target.value;
              setFilterResourceId(val === "all" ? "all" : Number(val));
              setFocusedGeofenceId(null);
            }}
          >
            <option value="all">
              🌐 Todos los clientes ({polygonOrCircleZones.length} geocercas)
            </option>
            {resources.map((res) => {
              const count = polygonOrCircleZones.filter(
                (z) => z.resourceId === res.id,
              ).length;
              return (
                <option key={res.id} value={res.id}>
                  👤 {res.name} ({count} geocerca{count !== 1 ? "s" : ""})
                </option>
              );
            })}
          </select>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={query.isFetching}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
            title="Sincronizar y recargar geocercas desde Wialon"
          >
            <RefreshCw
              className={`size-3.5 ${query.isFetching ? "animate-spin text-primary" : ""}`}
            />
            <span>{query.isFetching ? "Cargando…" : "Sincronizar"}</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Mapa con geocercas cargadas de Wialon */}
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/50 bg-background/50 px-4 py-2 text-xs text-muted-foreground">
            <span>
              Mostrando {mapGeofences.length} geocerca
              {mapGeofences.length !== 1 ? "s" : ""} en el mapa
            </span>
            {focusedGeofenceId ? (
              <button
                type="button"
                onClick={() => setFocusedGeofenceId(null)}
                className="text-primary hover:underline"
              >
                Restablecer vista general
              </button>
            ) : null}
          </div>
          <ClientOnly fallback={<div className="h-[580px] bg-muted/20" />}>
            <React.Suspense
              fallback={<div className="h-[580px] bg-muted/20" />}
            >
              <WialonMap
                units={[]}
                geofences={mapGeofences}
                focusGeofenceId={focusedGeofenceId}
                drawMode={drawMode}
                drawingResetKey={drawingResetKey}
                onDraftChange={setDraft}
              />
            </React.Suspense>
          </ClientOnly>
        </div>

        {/* Panel lateral: Nueva geocerca para Wialon */}
        <form
          onSubmit={saveGeofence}
          className="flex flex-col rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
                Nueva Geocerca
              </h2>
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

          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Nombre de la geocerca
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              placeholder="Ej. Bodega Guadalajara / Cliente Norte"
              required
              minLength={2}
              maxLength={100}
            />
          </label>

          <label className="mt-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Guardar en Cliente / Recurso de Wialon
            <select
              className={inputClass}
              value={targetResourceId ?? ""}
              onChange={(event) =>
                setCreateResourceId(Number(event.target.value))
              }
              required
            >
              <option value="" disabled>
                Selecciona un cliente / recurso
              </option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="mt-3">
            <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Forma de geocerca
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { value: "circle" as const, label: "Círculo", icon: Circle },
                {
                  value: "polygon" as const,
                  label: "Polígono",
                  icon: Pentagon,
                },
              ].map((option) => {
                const Icon = option.icon;
                const selected = type === option.value;
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => chooseType(option.value)}
                    className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
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

          <button
            type="button"
            onClick={startDrawing}
            className={`mt-4 w-full rounded-md border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              drawMode
                ? "border-amber-500 bg-amber-500/10 text-amber-400"
                : "border-primary bg-primary/5 text-primary hover:bg-primary/15"
            }`}
          >
            {drawMode ? "✏️ Dibujando en el mapa…" : "1. Trazar en el mapa"}
          </button>

          {drawMode === "polygon" ? (
            <p className="mt-2 text-xs text-amber-400/90">
              Haz clic en el mapa para marcar cada vértice del polígono (mínimo
              3).
            </p>
          ) : null}
          {drawMode === "circle" ? (
            <p className="mt-2 text-xs text-amber-400/90">
              Haz clic en el centro y arrastra o haz clic en el borde para el
              radio.
            </p>
          ) : null}

          {draft?.points.length ? (
            <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-2.5 text-xs text-primary">
              ✓ {draft.points.length} punto
              {draft.points.length !== 1 ? "s" : ""} trazado
              {draft.points.length !== 1 ? "s" : ""}
              {draft.type === "circle" && draft.points[0]?.radius
                ? ` · Radio: ${Math.round(draft.points[0].radius)} metros`
                : ""}
            </div>
          ) : null}

          {error ? (
            <p className="mt-3 text-xs text-destructive">{error}</p>
          ) : null}
          {message ? (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-primary">
              <Check className="size-4 shrink-0" />
              <span>{message}</span>
            </p>
          ) : null}

          <button
            type="submit"
            disabled={
              busy || !name.trim() || !targetResourceId || !draft?.points.length
            }
            className="mt-4 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Guardando en Wialon…" : "2. Guardar en Wialon"}
          </button>
        </form>
      </div>

      {/* Geocercas existentes en Wialon para el cliente */}
      <div className="rounded-xl border border-border/60 bg-card/50 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div>
            <h2 className="font-display text-base font-bold uppercase tracking-wide text-foreground">
              Geocercas guardadas en Wialon
            </h2>
            <p className="text-xs text-muted-foreground">
              {filterResourceId === "all"
                ? `Mostrando todas las geocercas (${visibleZones.length})`
                : `Geocercas de ${resources.find((r) => r.id === filterResourceId)?.name ?? "cliente"} (${visibleZones.length})`}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary">
            {visibleZones.length} activas
          </span>
        </div>

        {visibleZones.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            {query.isLoading
              ? "Cargando geocercas de Wialon…"
              : filterResourceId === "all"
                ? "No se encontraron geocercas en los recursos de Wialon."
                : "Este cliente no tiene geocercas guardadas en Wialon aún. Puedes crear una arriba."}
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleZones.map((zone) => {
              const isCircle = zone.type === 3;
              const radius =
                isCircle && zone.points[0]?.radius
                  ? Math.round(zone.points[0].radius)
                  : null;
              const isDeleting = deletingId === zone.id;

              return (
                <div
                  key={`${zone.resourceId}-${zone.id}`}
                  className="flex flex-col justify-between rounded-lg border border-border/70 bg-background/60 p-3.5 transition-colors hover:border-primary/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="size-3.5 shrink-0 rounded-full border border-white/40 shadow-sm"
                        style={{ backgroundColor: GEOFENCE_COLOR }}
                      />
                      <div className="min-w-0">
                        <h3
                          className="truncate font-semibold text-sm text-foreground"
                          title={zone.name}
                        >
                          {zone.name}
                        </h3>
                        <p
                          className="truncate text-xs text-muted-foreground"
                          title={zone.resource}
                        >
                          👤 {zone.resource}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {isCircle ? "Círculo" : "Polígono"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5 text-xs text-muted-foreground">
                    <span>
                      {isCircle
                        ? radius
                          ? `${radius} m`
                          : "Circular"
                        : `${zone.points.length} vértices`}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setFocusedGeofenceId(zone.id)}
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-primary hover:bg-primary/10 transition-colors"
                        title="Ver en el mapa"
                      >
                        <Eye className="size-3.5" />
                        <span>Ver</span>
                      </button>

                      {confirmDeleteId === zone.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDelete(zone)}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-1 rounded bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
                            title="Confirmar eliminación"
                          >
                            <span>{isDeleting ? "…" : "¿Confirmar?"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded px-1.5 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors"
                            title="Cancelar"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDelete(zone)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          title="Eliminar de Wialon"
                        >
                          <Trash2 className="size-3.5" />
                          <span>Borrar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
