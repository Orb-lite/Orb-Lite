import * as React from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Clock3,
  ExternalLink,
  Map,
  Navigation,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import WialonMap, {
  type DrawingPoint,
  type MapAddressPoint,
  type MapGeofence,
} from "@/components/wialon-map";
import { WialonGuard } from "@/components/wialon-guard";
import {
  wialonCreateRoute,
  wialonGeocodeAddresses,
  wialonGeofences,
  wialonPlanRoute,
  type WialonGeocodedAddress,
  type WialonPlannedRoutePoint,
  type WialonPlannedRouteStop,
} from "@/lib/wialon.functions";
import type { WialonSession } from "@/lib/wialon-session";

export const Route = createFileRoute("/wialon/rutas")({
  head: () => ({
    meta: [
      { title: "Rutas | Plataforma ORB-LITE" },
      {
        name: "description",
        content: "Crea rutas lineales en Wialon con puntos del mapa o direcciones escritas.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <WialonGuard>{(session) => <RutasView session={session} />}</WialonGuard>,
});

type RouteDraft = { points: DrawingPoint[] };
type RouteInputMode = "addresses" | "map";
type AddressPreviewPoint = WialonGeocodedAddress & { isOrigin: boolean };
type PlannedRoute = {
  points: WialonPlannedRoutePoint[];
  distanceMeters: number;
  durationSeconds: number;
  stops: WialonPlannedRouteStop[];
  returnToOrigin: boolean;
};

const inputClass =
  "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary";

function colorToNumber(value: string) {
  return Number.parseInt(value.replace("#", ""), 16);
}

function formatDistance(meters: number) {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
}

function formatDuration(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours} h ${remaining} min` : `${hours} h`;
}

function stopCoordinates(stop: WialonPlannedRouteStop) {
  return `${stop.lat},${stop.lon}`;
}

function buildGoogleMapsUrls(route: PlannedRoute) {
  const origin = route.stops.find((stop) => stop.isOrigin) ?? route.stops[0];
  const destinations = route.stops.filter((stop) => !stop.isOrigin);
  if (!origin || destinations.length === 0) return [];

  const sequence = route.returnToOrigin
    ? [origin, ...destinations, origin]
    : [origin, ...destinations];
  const urls: string[] = [];
  const maxWaypoints = 9;

  for (let start = 0; start < sequence.length - 1;) {
    const end = Math.min(start + maxWaypoints + 1, sequence.length - 1);
    const params = new URLSearchParams({
      api: "1",
      origin: stopCoordinates(sequence[start]!),
      destination: stopCoordinates(sequence[end]!),
      travelmode: "driving",
    });
    const waypoints = sequence
      .slice(start + 1, end)
      .map((stop) => stopCoordinates(stop))
      .join("|");
    if (waypoints) params.set("waypoints", waypoints);
    urls.push(`https://www.google.com/maps/dir/?${params.toString()}`);
    start = end;
  }

  return urls;
}

function buildWazeUrl(stop: WialonPlannedRouteStop) {
  const params = new URLSearchParams({
    ll: stopCoordinates(stop),
    navigate: "yes",
  });
  return `https://www.waze.com/ul?${params.toString()}`;
}

function RutasView({ session }: { session: WialonSession }) {
  const fetchGeofences = useServerFn(wialonGeofences);
  const createRoute = useServerFn(wialonCreateRoute);
  const geocodeAddresses = useServerFn(wialonGeocodeAddresses);
  const planRoute = useServerFn(wialonPlanRoute);
  const queryClient = useQueryClient();
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("#f59e0b");
  const [resourceId, setResourceId] = React.useState<number | null>(null);
  const [origin, setOrigin] = React.useState("");
  const [addresses, setAddresses] = React.useState([""]);
  const [returnToOrigin, setReturnToOrigin] = React.useState(true);
  const [inputMode, setInputMode] = React.useState<RouteInputMode>("addresses");
  const [geocodedAddresses, setGeocodedAddresses] = React.useState<AddressPreviewPoint[]>([]);
  const [plannedRoute, setPlannedRoute] = React.useState<PlannedRoute | null>(null);
  const [drawing, setDrawing] = React.useState(false);
  const [drawingResetKey, setDrawingResetKey] = React.useState(0);
  const [draft, setDraft] = React.useState<RouteDraft | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [geocoding, setGeocoding] = React.useState(false);
  const [planning, setPlanning] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const query = useQuery({
    queryKey: ["wialon-geofences", session.sid],
    queryFn: () => fetchGeofences({ data: { host: session.host, sid: session.sid } }),
    refetchInterval: 60000,
  });
  const routes = (query.data?.zones ?? []).filter((zone) => zone.type === 1);
  const resources = query.data?.resources ?? [];
  const selectedResourceId = resourceId ?? resources[0]?.id ?? null;
  const mapRoutes: MapGeofence[] = routes.map((route) => ({
    id: route.id,
    name: route.name,
    resource: route.resource,
    type: route.type,
    color: route.color,
    points: route.points,
  }));
  const plannedMapRoute: MapGeofence[] = plannedRoute
    ? [
        {
          id: -1,
          name: "Ruta propuesta",
          resource: "Planificador inteligente",
          type: 1,
          color,
          points: plannedRoute.points.map((point) => ({ ...point, radius: 0 })),
        },
      ]
    : [];
  const addressPoints: MapAddressPoint[] =
    inputMode === "addresses"
      ? geocodedAddresses.map((point, index) => ({
          lat: point.lat,
          lon: point.lon,
          label: point.label,
          order: point.isOrigin ? "S" : String(index),
          isOrigin: point.isOrigin,
        }))
      : [];
  const googleMapsUrls = plannedRoute ? buildGoogleMapsUrls(plannedRoute) : [];
  const nextWazeStop = plannedRoute?.stops.find((stop) => !stop.isOrigin) ?? null;

  function clearPlan() {
    setPlannedRoute(null);
    setDraft(null);
    setMessage(null);
  }

  function updateOrigin(value: string) {
    setOrigin(value);
    setGeocodedAddresses([]);
    clearPlan();
  }

  function updateAddress(index: number, value: string) {
    setAddresses((current) =>
      current.map((address, currentIndex) => (currentIndex === index ? value : address)),
    );
    setGeocodedAddresses([]);
    clearPlan();
  }

  function addAddress() {
    setAddresses((current) => [...current, ""]);
  }

  function removeAddress(index: number) {
    setAddresses((current) => current.filter((_, currentIndex) => currentIndex !== index));
    setGeocodedAddresses([]);
    clearPlan();
  }

  function selectInputMode(mode: RouteInputMode) {
    setInputMode(mode);
    setError(null);
  }

  async function handleGeocodeAddresses() {
    const stops = addresses.map((address) => address.trim()).filter(Boolean);
    if (origin.trim().length < 3) {
      setError("Captura el punto de salida.");
      return;
    }
    if (stops.length === 0) {
      setError("Captura al menos una dirección de destino.");
      return;
    }

    setGeocoding(true);
    setError(null);
    setMessage(null);
    try {
      const result = await geocodeAddresses({
        data: { addresses: [origin.trim(), ...stops] },
      });
      setGeocodedAddresses(
        result.locations.map((location, index) => ({
          ...location,
          isOrigin: index === 0,
        })),
      );
      setMessage(`${result.locations.length} puntos ubicados en el mapa.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron ubicar las direcciones.");
    } finally {
      setGeocoding(false);
    }
  }

  function startDrawing() {
    setError(null);
    setMessage(null);
    setPlannedRoute(null);
    setDraft({ points: [] });
    setDrawing(true);
    setDrawingResetKey((value) => value + 1);
  }

  function resetDrawing() {
    setPlannedRoute(null);
    setDraft(null);
    setDrawing(false);
    setDrawingResetKey((value) => value + 1);
  }

  async function handlePlanRoute() {
    const stops = addresses.map((address) => address.trim()).filter(Boolean);
    if (origin.trim().length < 3) {
      setError("Captura el punto de salida.");
      return;
    }
    if (stops.length === 0) {
      setError("Captura al menos una dirección de destino.");
      return;
    }

    setPlanning(true);
    setError(null);
    setMessage(null);
    try {
      const result = await planRoute({
        data: {
          origin: origin.trim(),
          addresses: stops,
          returnToOrigin,
        },
      });
      setPlannedRoute(result);
      setGeocodedAddresses(
        result.stops.map((stop) => ({
          query: stop.label,
          label: stop.label,
          lat: stop.lat,
          lon: stop.lon,
          isOrigin: stop.isOrigin,
        })),
      );
      setDraft({
        points: result.points.map((point) => ({ ...point, radius: 0 })),
      });
      setDrawing(false);
      setDrawingResetKey((value) => value + 1);
      if (!name.trim()) setName("Ruta optimizada");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo optimizar la ruta.");
    } finally {
      setPlanning(false);
    }
  }

  async function saveRoute(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedResourceId) {
      setError("Selecciona un recurso con permisos para crear rutas.");
      return;
    }
    if (!draft || draft.points.length < 2) {
      setError("Dibuja al menos dos puntos para crear la ruta.");
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const created = await createRoute({
        data: {
          host: session.host,
          sid: session.sid,
          resourceId: selectedResourceId,
          name,
          color: colorToNumber(color),
          points: draft.points,
        },
      });
      setMessage(`Ruta "${created.name}" creada correctamente.`);
      setName("");
      resetDrawing();
      await queryClient.invalidateQueries({
        queryKey: ["wialon-geofences", session.sid],
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo crear la ruta.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Elige entre escribir las direcciones de todos los puntos o marcar cada punto directamente
          sobre el mapa.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.85fr)] xl:grid-cols-[minmax(0,1.45fr)_minmax(420px,0.8fr)]">
        <ClientOnly
          fallback={<div className="h-[560px] rounded-lg border border-border/60 bg-card/40" />}
        >
          <WialonMap
            units={[]}
            geofences={[...mapRoutes, ...plannedMapRoute]}
            addressPoints={addressPoints}
            drawMode={drawing ? "line" : null}
            drawingResetKey={drawingResetKey}
            onDraftChange={(nextDraft) =>
              drawing && nextDraft?.type === "line"
                ? setDraft({ points: nextDraft.points })
                : undefined
            }
          />
        </ClientOnly>

        <form onSubmit={saveRoute} className="min-w-0 rounded-lg border border-border/60 p-5">
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Método de creación
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => selectInputMode("addresses")}
                className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                  inputMode === "addresses"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                Direcciones escritas
              </button>
              <button
                type="button"
                onClick={() => selectInputMode("map")}
                className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                  inputMode === "map"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                Puntos en mapa
              </button>
            </div>
          </div>

          {inputMode === "addresses" ? (
            <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <Navigation className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <h2 className="font-display text-sm font-bold uppercase tracking-widest">
                    Planificador inteligente
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Optimiza el orden de las paradas y calcula la ruta considerando el regreso.
                  </p>
                </div>
              </div>

              <label className="mt-4 block text-sm">
                Punto de salida
                <input
                  value={origin}
                  onChange={(event) => updateOrigin(event.target.value)}
                  className={inputClass}
                  placeholder="Ej. Av. Vallarta 1000, Guadalajara"
                  required
                />
              </label>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm">Direcciones de destino</span>
                  <button
                    type="button"
                    onClick={addAddress}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <Plus className="size-3.5" /> Agregar
                  </button>
                </div>
                {addresses.map((address, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-5 shrink-0 text-center text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                    <input
                      value={address}
                      onChange={(event) => updateAddress(index, event.target.value)}
                      className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder={`Dirección ${index + 1}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeAddress(index)}
                      disabled={addresses.length === 1}
                      className="rounded-md p-2 text-muted-foreground hover:text-destructive disabled:opacity-30"
                      aria-label={`Eliminar dirección ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => void handleGeocodeAddresses()}
                  disabled={geocoding}
                  className="w-full rounded-md border border-primary px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 disabled:cursor-wait disabled:opacity-60"
                >
                  {geocoding ? "Buscando direcciones…" : "Buscar puntos en el mapa"}
                </button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Ubica el origen y cada dirección como un punto numerado antes de optimizar.
                </p>
              </div>

              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={returnToOrigin}
                  onChange={(event) => {
                    setReturnToOrigin(event.target.checked);
                    clearPlan();
                  }}
                  className="size-4 accent-primary"
                />
                Regresar al punto de salida
              </label>

              <button
                type="button"
                onClick={() => void handlePlanRoute()}
                disabled={planning}
                className="mt-4 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:cursor-wait disabled:opacity-60"
              >
                {planning ? "Calculando ruta…" : "Optimizar ruta"}
              </button>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <Map className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <h2 className="font-display text-sm font-bold uppercase tracking-widest">
                    Puntos en mapa
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Haz clic sobre el mapa para agregar los puntos en el orden de la ruta.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={startDrawing}
                className="mt-4 w-full rounded-md border border-primary px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10"
              >
                {drawing ? "Dibujando en el mapa…" : "Comenzar a dibujar"}
              </button>
              <p className="mt-2 text-xs text-muted-foreground">
                Puedes guardar la ruta usando únicamente los puntos que marques en el mapa.
              </p>
            </div>
          )}

          {plannedRoute ? (
            <div className="mt-4 rounded-lg border border-border/60 bg-card/40 p-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Map className="size-4 text-primary" />
                  <span>{formatDistance(plannedRoute.distanceMeters)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock3 className="size-4 text-primary" />
                  <span>{formatDuration(plannedRoute.durationSeconds)}</span>
                </div>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Orden recomendado
              </p>
              <ol className="mt-2 max-h-40 space-y-1 overflow-auto text-xs">
                {plannedRoute.stops.map((stop, index) => (
                  <li key={`${stop.lat}-${stop.lon}-${index}`} className="flex gap-2">
                    <span className="w-5 shrink-0 text-right text-muted-foreground">
                      {stop.isOrigin ? "S" : index}
                    </span>
                    <span className="truncate">
                      {stop.isOrigin ? "Salida · " : ""}
                      {stop.label}
                    </span>
                  </li>
                ))}
              </ol>
              {plannedRoute.returnToOrigin ? (
                <p className="mt-2 text-xs text-primary">La ruta considera el regreso al origen.</p>
              ) : null}
              <div className="mt-4 border-t border-border/60 pt-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Exportar navegación
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {googleMapsUrls.length === 1 ? (
                    <a
                      href={googleMapsUrls[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-primary/50 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10"
                    >
                      <ExternalLink className="size-3.5" /> Abrir en Google Maps
                    </a>
                  ) : (
                    googleMapsUrls.map((url, index) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-primary/50 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10"
                      >
                        <ExternalLink className="size-3.5" /> Google Maps · tramo {index + 1}
                      </a>
                    ))
                  )}
                  {nextWazeStop ? (
                    <a
                      href={buildWazeUrl(nextWazeStop)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary"
                    >
                      <ExternalLink className="size-3.5" /> Abrir siguiente parada en Waze
                    </a>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Waze abre una parada a la vez; usa el enlace Waze de cada parada para seguir el
                  orden recomendado.
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-sm font-bold uppercase tracking-widest">
                Nueva ruta
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {draft?.points.length ?? 0} puntos dibujados
              </p>
            </div>
            <button
              type="button"
              onClick={resetDrawing}
              className="rounded-md border border-border p-2 text-muted-foreground hover:border-primary hover:text-primary"
              aria-label="Borrar ruta actual"
              title="Borrar ruta actual"
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
              placeholder="Ej. Ruta centro - almacén"
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

          <label className="mt-4 flex items-center justify-between gap-3 text-sm">
            Color
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{color}</span>
              <input
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="size-9 cursor-pointer rounded border border-border bg-transparent p-1"
                aria-label="Color de la ruta"
              />
            </span>
          </label>

          {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
          {message ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-primary">
              <Check className="size-4" />
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={
              busy || !name.trim() || !selectedResourceId || !draft || draft.points.length < 2
            }
            className="mt-5 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Guardando…" : "Guardar ruta"}
          </button>
        </form>
      </div>

      <div className="rounded-lg border border-border/60 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest">
            Rutas existentes
          </h2>
          <span className="text-xs text-muted-foreground">{routes.length}</span>
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <li
              key={`${route.resourceId}-${route.id}`}
              className="flex items-center gap-3 rounded-md border border-border/60 px-3 py-2 text-sm"
            >
              <Map className="size-4 shrink-0" style={{ color: route.color }} />
              <span className="min-w-0 flex-1 truncate">{route.name}</span>
            </li>
          ))}
          {!query.isLoading && routes.length === 0 ? (
            <li className="text-sm text-muted-foreground">No hay rutas lineales disponibles.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
