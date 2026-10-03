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
  Building2,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Link2,
  Layers,
  Route as RouteIcon,
} from "lucide-react";
import { WialonGuard } from "@/components/wialon-guard";
import { PlatformHeader } from "@/components/wialon/PlatformHeader";
import type { DrawingPoint, MapAddressPoint, MapGeofence } from "@/components/wialon-map";

const WialonMap = React.lazy(() => import("@/components/wialon-map"));

// Módulo de funciones de rutas compartidas
import {
  shareUserRoute,
  getReportEmails,
  getUserRoutes,
  saveUserRoute,
  deleteUserRoute,
} from "@/lib/route-share.functions";

// Módulo de funciones de Wialon
import {
  wialonCreateRoute,
  wialonDeleteGeofence,
  wialonGeocodeAddresses,
  wialonGeofences,
  wialonPlanRoute,
  wialonLogisticsRoutes,
  type WialonLogisticsRoute,
  type WialonGeocodedAddress,
  type WialonPlannedRoutePoint,
  type WialonPlannedRouteStop,
  type StoredUserRoute,
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
      { property: "og:title", content: "Rutas | Plataforma ORB-LITE" },
      { property: "og:description", content: "Planifica y consulta rutas de ORB-LITE y ORB-FULL." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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

  for (let start = 0; start < sequence.length - 1; ) {
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

function buildGoogleMapsUrlForPoints(points: Array<{ lat: number; lon: number }>) {
  if (points.length < 2) return null;
  const origin = `${points[0]!.lat},${points[0]!.lon}`;
  const dest = `${points[points.length - 1]!.lat},${points[points.length - 1]!.lon}`;
  const intermediate = points.slice(1, -1).slice(0, 8);
  const waypoints = intermediate.map((p) => `${p.lat},${p.lon}`).join("|");
  const params = new URLSearchParams({
    api: "1",
    origin,
    destination: dest,
    travelmode: "driving",
  });
  if (waypoints) params.set("waypoints", waypoints);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
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
  const deleteRoute = useServerFn(wialonDeleteGeofence);
  const geocodeAddresses = useServerFn(wialonGeocodeAddresses);
  const planRoute = useServerFn(wialonPlanRoute);
  const fetchUserRoutes = useServerFn(getUserRoutes);
  const saveUserRouteFn = useServerFn(saveUserRoute);
  const deleteUserRouteFn = useServerFn(deleteUserRoute);
  const queryClient = useQueryClient();

  const [name, setName] = React.useState("");
  const ROUTE_COLOR = "#92d700";
  const [filterResourceId, setFilterResourceId] = React.useState<number | "all">("all");
  const [resourceId, setResourceId] = React.useState<number | null>(null);
  const [focusedRouteId, setFocusedRouteId] = React.useState<number | null>(null);
  const [focusedUserRouteId, setFocusedUserRouteId] = React.useState<string | null>(null);
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
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [deletingUserRouteId, setDeletingUserRouteId] = React.useState<string | null>(null);
  const [sharingUserRouteId, setSharingUserRouteId] = React.useState<string | null>(null);
  const [copiedUserRouteId, setCopiedUserRouteId] = React.useState<string | null>(null);
  const [confirmDeleteUserRouteId, setConfirmDeleteUserRouteId] = React.useState<string | null>(null);
  const [confirmDeleteWialonRouteId, setConfirmDeleteWialonRouteId] = React.useState<number | null>(null);
  const [syncToWialon, setSyncToWialon] = React.useState(false);
  const [geocoding, setGeocoding] = React.useState(false);
  const [planning, setPlanning] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const userRoutesQuery = useQuery({
    queryKey: ["user-routes", session.userId],
    queryFn: () =>
      fetchUserRoutes({
        data: { userId: session.userId, host: session.host, sid: session.sid },
      }),
  });
  const userRoutes = userRoutesQuery.data?.routes ?? [];

  const query = useQuery({
    queryKey: ["wialon-geofences", session.sid],
    queryFn: () => fetchGeofences({ data: { host: session.host, sid: session.sid } }),
    refetchInterval: 60000,
  });
  const allRoutes = (query.data?.zones ?? []).filter((zone) => zone.type === 1);
  const resources = query.data?.resources ?? [];

  const logisticsQuery = useQuery({
    queryKey: ["wialon-logistics-routes", session.sid],
    queryFn: () => wialonLogisticsRoutes({ data: { host: session.host, sid: session.sid } }),
    enabled: session.host === "full",
    refetchInterval: 60000,
    retry: false,
  });
  const logisticsRoutes = logisticsQuery.data?.routes ?? [];
  const [shownLogisticsIds, setShownLogisticsIds] = React.useState<ReadonlySet<string>>(new Set());

  function toggleLogisticsRoute(id: string) {
    setShownLogisticsIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const visibleRoutes =
    filterResourceId === "all"
      ? allRoutes
      : allRoutes.filter((r) => r.resourceId === filterResourceId);

  const selectedResourceId =
    resourceId ?? (filterResourceId !== "all" ? filterResourceId : (resources[0]?.id ?? null));

  const userMapRoutes: MapGeofence[] = userRoutes.map((route) => ({
    id: route.id,
    name: route.name,
    resource: `Mi cuenta (${session.userName || "Privada"})`,
    type: 1,
    color: ROUTE_COLOR,
    points: route.points,
    ...(route.routeStops?.length ? { markerPoints: route.routeStops } : {}),
  }));

  const mapRoutes: MapGeofence[] = visibleRoutes.map((route) => ({
    id: route.id,
    name: route.name,
    resource: route.resource,
    type: route.type,
    color: ROUTE_COLOR,
    points: route.points,
  }));
  const plannedMapRoute: MapGeofence[] = plannedRoute
    ? [
        {
          id: -1,
          name: "Ruta propuesta",
          resource: "Planificador inteligente",
          type: 1,
          color: ROUTE_COLOR,
          points: plannedRoute.points.map((point) => ({ ...point, radius: 0 })),
          markerPoints: [],
        },
      ]
    : [];
  const logisticsMapRoutes: MapGeofence[] = logisticsRoutes
    .filter((route) => shownLogisticsIds.has(route.id) && route.points.length > 0)
    .map((route, index) => ({
      id: -(index + 10),
      name: route.name,
      resource: "Wialon Logistics",
      type: 1 as const,
      color: ROUTE_COLOR,
      points: route.points.map((point) => ({ ...point, radius: 0 })),
      markerPoints: route.points,
    }));
  const addressPoints: MapAddressPoint[] =
    inputMode === "addresses" || plannedRoute
      ? geocodedAddresses.map((point, index) => ({
          lat: point.lat,
          lon: point.lon,
          label: point.label,
          order: point.isOrigin ? "S" : String(index),
          isOrigin: point.isOrigin,
        }))
      : [];

  function clearPlan(clearDraft = true) {
    setPlannedRoute(null);
    setGeocodedAddresses([]);
    if (clearDraft) setDraft(null);
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
        (result?.locations ?? []).map((location: WialonGeocodedAddress, index: number) => ({
          ...location,
          isOrigin: index === 0,
        })),
      );
      setMessage(`${result?.locations?.length ?? 0} puntos ubicados en el mapa.`);
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
    setGeocodedAddresses([]);
    setDraft(null);
    setDrawing(false);
    setDrawingResetKey((value) => value + 1);
  }

  async function handlePlanRoute() {
    const drawnPoints = draft?.points ?? [];
    const isMapPlan = inputMode === "map";
    const stops = isMapPlan
      ? drawnPoints.slice(1).map((_, index) => `Punto ${index + 2}`)
      : addresses.map((address) => address.trim()).filter(Boolean);
    const planOrigin = isMapPlan ? "Punto 1" : origin.trim();
    const mapLocations: WialonGeocodedAddress[] = isMapPlan
      ? drawnPoints.map((point, index) => ({
          query: `Punto ${index + 1}`,
          label: `Punto ${index + 1}`,
          lat: point.lat,
          lon: point.lon,
        }))
      : [];

    if (!isMapPlan && planOrigin.length < 3) {
      setError("Captura el punto de salida.");
      return;
    }
    if (stops.length === 0) {
      setError(
        isMapPlan
          ? "Dibuja al menos dos puntos en el mapa."
          : "Captura al menos una dirección de destino.",
      );
      return;
    }

    setPlanning(true);
    setError(null);
    setMessage(null);
    try {
      const cachedLocations =
        !isMapPlan &&
        geocodedAddresses.length === stops.length + 1 &&
        geocodedAddresses[0]?.query === planOrigin &&
        geocodedAddresses.slice(1).every((location, index) => location.query === stops[index]);
      const result = await planRoute({
        data: {
          origin: planOrigin,
          addresses: stops,
          returnToOrigin,
          ...(isMapPlan
            ? { locations: mapLocations }
            : cachedLocations
              ? { locations: geocodedAddresses }
              : {}),
        },
      });
      if (result) {
        setPlannedRoute(result);
        setGeocodedAddresses(
          (result.stops ?? []).map((stop: WialonPlannedRouteStop) => ({
            query: stop.label,
            label: stop.label,
            lat: stop.lat,
            lon: stop.lon,
            isOrigin: stop.isOrigin,
          })),
        );
        setDraft({
          points: (result.points ?? []).map((point: WialonPlannedRoutePoint) => ({
            ...point,
            radius: 0,
          })),
        });
      }
      setDrawing(false);
      setDrawingResetKey((value) => value + 1);
      if (!name.trim()) setName("Ruta optimizada");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo optimizar la ruta.");
    } finally {
      setPlanning(false);
    }
  }

  const handleDraftChange = React.useCallback(
    (
      nextDraft: {
        type: "circle" | "polygon" | "line";
        points: DrawingPoint[];
      } | null,
    ) => {
      if (drawing && nextDraft?.type === "line") {
        setDraft({ points: nextDraft.points });
      }
    },
    [drawing],
  );

  async function saveRoute(event: React.FormEvent) {
    event.preventDefault();
    if (!draft || draft.points.length < 2) {
      setError("Dibuja al menos dos puntos o genera una ruta antes de guardar.");
      return;
    }
    if (syncToWialon && !selectedResourceId) {
      setError("Selecciona un recurso de Wialon para sincronizar la ruta.");
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const isMapPlan = inputMode === "map";
      const originStr = isMapPlan ? "Punto 1 (Mapa)" : origin.trim();
      const stopsArr = isMapPlan ? [] : addresses.map((a) => a.trim()).filter(Boolean);

      const MAX_ROUTE_POINTS = 250;
      let routePoints = draft.points;
      if (routePoints.length > MAX_ROUTE_POINTS) {
        const step = (routePoints.length - 1) / (MAX_ROUTE_POINTS - 1);
        const sampled: DrawingPoint[] = [];
        for (let i = 0; i < MAX_ROUTE_POINTS; i++) {
          sampled.push(routePoints[Math.round(i * step)]!);
        }
        routePoints = sampled;
      }

      const res = await saveUserRouteFn({
        data: {
          userId: session.userId,
          userName: session.userName,
          name: name.trim(),
          color: ROUTE_COLOR,
          points: routePoints,
          routeStops:
            plannedRoute?.stops.map((stop) => ({
              lat: stop.lat,
              lon: stop.lon,
              label: stop.label,
            })) ??
            (isMapPlan
              ? draft.points.map((point, index) => ({
                  lat: point.lat,
                  lon: point.lon,
                  label: index === 0 ? "Salida" : `Parada ${index}`,
                }))
              : undefined),
          origin: originStr || undefined,
          addresses: stopsArr.length > 0 ? stopsArr : undefined,
          distanceMeters: plannedRoute?.distanceMeters,
          durationSeconds: plannedRoute?.durationSeconds,
          syncToWialon,
          host: session.host,
          sid: session.sid,
          resourceId: syncToWialon && selectedResourceId ? selectedResourceId : undefined,
        },
      });

      setMessage(
        syncToWialon && res?.wialonId
          ? `Ruta "${res.route?.name ?? name}" guardada en tu cuenta y sincronizada en Wialon (#${res.wialonId}).`
          : `Ruta "${res?.route?.name ?? name}" guardada exitosamente en tu cuenta de usuario (privada).`,
      );
      setName("");
      resetDrawing();
      clearPlan();
      await queryClient.invalidateQueries({
        queryKey: ["user-routes", session.userId],
      });
      if (syncToWialon) {
        await queryClient.invalidateQueries({
          queryKey: ["wialon-geofences", session.sid],
        });
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo guardar la ruta.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRefresh() {
    setError(null);
    setMessage(null);
    await Promise.all([userRoutesQuery.refetch(), query.refetch()]);
    setMessage("Rutas sincronizadas.");
    setTimeout(() => setMessage(null), 3000);
  }

  const [shareFormRouteId, setShareFormRouteId] = React.useState<string | null>(null);
  const [shareEmail, setShareEmail] = React.useState("");
  const reportEmailsQuery = useQuery({
    queryKey: ["route-report-emails", session.userId],
    queryFn: () => getReportEmails({ data: { userId: session.userId } }),
    enabled: shareFormRouteId !== null,
  });

  function openShareForm(route: StoredUserRoute) {
    setShareFormRouteId((current) => (current === route.id ? null : route.id));
    setShareEmail(route.reportEmail ?? "");
  }

  async function handleShareUserRoute(route: StoredUserRoute) {
    const email = shareEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Escribe el correo que recibirá el resumen del viaje.");
      return;
    }
    setSharingUserRouteId(route.id);
    setError(null);
    setMessage(null);
    try {
      const result = await shareUserRoute({
        data: {
          userId: session.userId,
          routeId: route.id,
          reportEmail: email,
        },
      });
      setShareFormRouteId(null);
      void reportEmailsQuery.refetch();
      void userRoutesQuery.refetch();
      const url = `${window.location.origin}/ruta/${result.token}`;
      try {
        await navigator.clipboard.writeText(url);
        setMessage(
          `Enlace de "${route.name}" copiado. Los operadores no necesitan iniciar sesión.`,
        );
      } catch {
        window.prompt("Copia el enlace de la ruta:", url);
      }
      setCopiedUserRouteId(route.id);
      window.setTimeout(() => setCopiedUserRouteId(null), 4000);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo generar el enlace de la ruta.");
    } finally {
      setSharingUserRouteId(null);
    }
  }

  async function handleDeleteUserRoute(route: StoredUserRoute) {
    if (confirmDeleteUserRouteId !== route.id) {
      setConfirmDeleteUserRouteId(route.id);
      return;
    }

    setDeletingUserRouteId(route.id);
    setConfirmDeleteUserRouteId(null);
    setError(null);
    setMessage(null);
    try {
      await deleteUserRouteFn({
        data: {
          userId: session.userId,
          routeId: route.id,
        },
      });
      setMessage(`Ruta "${route.name}" eliminada de tu cuenta.`);
      if (focusedUserRouteId === route.id) setFocusedUserRouteId(null);
      await queryClient.invalidateQueries({
        queryKey: ["user-routes", session.userId],
      });
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "No se pudo eliminar la ruta de tu cuenta.",
      );
    } finally {
      setDeletingUserRouteId(null);
    }
  }

  async function handleDeleteWialonRoute(route: { id: number; resourceId: number; name: string }) {
    if (confirmDeleteWialonRouteId !== route.id) {
      setConfirmDeleteWialonRouteId(route.id);
      return;
    }

    setDeletingId(route.id);
    setConfirmDeleteWialonRouteId(null);
    setError(null);
    setMessage(null);
    try {
      await deleteRoute({
        data: {
          host: session.host,
          sid: session.sid,
          resourceId: route.resourceId,
          zoneId: route.id,
        },
      });
      setMessage(`Ruta "${route.name}" eliminada de Wialon.`);
      if (focusedRouteId === route.id) setFocusedRouteId(null);
      await queryClient.invalidateQueries({
        queryKey: ["wialon-geofences", session.sid],
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo eliminar la ruta de Wialon.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PlatformHeader session={session} />

      {/* Barra de control superior */}
      <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card/60 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Rutas por Cliente / Recurso
            </h2>
            <p className="text-xs text-muted-foreground">
              {resources.length} recurso{resources.length !== 1 ? "s" : ""} disponible
              {resources.length !== 1 ? "s" : ""} en Wialon
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="route-client-filter" className="sr-only">
            Filtrar por cliente o recurso
          </label>
          <select
            id="route-client-filter"
            className="rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary sm:text-sm"
            value={filterResourceId}
            onChange={(e) => {
              const val = e.target.value;
              setFilterResourceId(val === "all" ? "all" : Number(val));
              setFocusedRouteId(null);
            }}
          >
            <option value="all">🌐 Todos los clientes ({allRoutes.length} rutas)</option>
            {resources.map((res) => {
              const count = allRoutes.filter((r) => r.resourceId === res.id).length;
              return (
                <option key={res.id} value={res.id}>
                  👤 {res.name} ({count} ruta{count !== 1 ? "s" : ""})
                </option>
              );
            })}
          </select>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={query.isFetching}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
            title="Sincronizar y recargar rutas desde Wialon"
          >
            <RefreshCw
              className={`size-3.5 ${query.isFetching ? "animate-spin text-primary" : ""}`}
            />
            <span>{query.isFetching ? "Cargando…" : "Sincronizar"}</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.85fr)] xl:grid-cols-[minmax(0,1.45fr)_minmax(420px,0.8fr)]">
        {/* Mapa */}
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/50 bg-background/50 px-4 py-2 text-xs text-muted-foreground">
            <span>
              Mostrando {userMapRoutes.length + mapRoutes.length} ruta
              {userMapRoutes.length + mapRoutes.length !== 1 ? "s" : ""} en el mapa
              {userMapRoutes.length > 0 ? ` (${userMapRoutes.length} en tu cuenta)` : ""}
            </span>
            {focusedRouteId || focusedUserRouteId ? (
              <button
                type="button"
                onClick={() => {
                  setFocusedRouteId(null);
                  setFocusedUserRouteId(null);
                }}
                className="text-primary hover:underline"
              >
                Restablecer vista general
              </button>
            ) : null}
          </div>
          <ClientOnly
            fallback={<div className="h-[560px] rounded-lg border border-border/60 bg-card/40" />}
          >
            <React.Suspense
              fallback={<div className="h-[560px] rounded-lg border border-border/60 bg-card/40" />}
            >
              <WialonMap
                units={[]}
                geofences={[
                  ...userMapRoutes,
                  ...mapRoutes,
                  ...plannedMapRoute,
                  ...logisticsMapRoutes,
                ]}
                focusGeofenceId={focusedUserRouteId ?? focusedRouteId}
                addressPoints={addressPoints}
                drawMode={drawing ? "line" : null}
                drawingResetKey={drawingResetKey}
                onDraftChange={handleDraftChange}
              />
            </React.Suspense>
          </ClientOnly>
        </div>

        {/* Formulario de creación */}
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
                </div>
              </div>

              <label className="mt-4 block text-sm">
                Punto de salida
                <input
                  value={origin}
                  onChange={(event) => updateOrigin(event.target.value)}
                  className={inputClass}
                  placeholder="Ej. Av. Vallarta 1000, Guadalajara o coordenadas (20.67, -103.34)"
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
                      placeholder={`Dirección ${index + 1}, lugar o link Google Maps`}
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
                  {geocoding ? "Ubicando puntos..." : "Ubicar puntos en el mapa"}
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={returnToOrigin}
                    onChange={(e) => setReturnToOrigin(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  Regresar al origen
                </label>
                <button
                  type="button"
                  onClick={() => void handlePlanRoute()}
                  disabled={planning}
                  className="w-full rounded-md bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                >
                  {planning ? "Optimizando ruta..." : "Calcular y optimizar ruta"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-border/60 bg-card/40 p-4">
              <p className="text-xs text-muted-foreground">
                Haz clic en el mapa para ir marcando cada uno de los puntos que componen la ruta.
              </p>
              <div className="mt-3 flex gap-2">
                {!drawing ? (
                  <button
                    type="button"
                    onClick={startDrawing}
                    className="flex-1 rounded-md border border-primary bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/20"
                  >
                    Empezar a trazar en mapa
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetDrawing}
                    className="flex-1 rounded-md border border-destructive bg-destructive/10 px-4 py-2.5 text-xs font-bold text-destructive hover:bg-destructive/20"
                  >
                    Cancelar trazo
                  </button>
                )}
              </div>
              {draft && draft.points.length > 0 && (
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{draft.points.length} puntos trazados</span>
                  <button
                    type="button"
                    onClick={() => void handlePlanRoute()}
                    disabled={planning || draft.points.length < 2}
                    className="underline hover:text-primary/80 disabled:opacity-50"
                  >
                    {planning ? "Optimizando..." : "Optimizar trazo por calles"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Nombre y opciones de guardado */}
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="route-name" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nombre de la ruta
              </label>
              <input
                id="route-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Ruta de Entrega Zona Norte"
                className={inputClass}
                required
              />
            </div>

            <div className="rounded-lg border border-border/60 bg-card/30 p-3">
              <label className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncToWialon}
                  onChange={(e) => setSyncToWialon(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                Sincronizar también con Wialon
              </label>
              {syncToWialon && (
                <div className="mt-2.5">
                  <label htmlFor="route-resource-select" className="block text-[11px] text-muted-foreground">
                    Selecciona el recurso de destino en Wialon
                  </label>
                  <select
                    id="route-resource-select"
                    value={selectedResourceId ?? ""}
                    onChange={(e) => setResourceId(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                  >
                    {resources.map((res) => (
                      <option key={res.id} value={res.id}>
                        {res.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs font-medium text-destructive">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-md border border-primary/50 bg-primary/10 p-3 text-xs font-medium text-primary">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={busy || !draft || draft.points.length < 2 || !name.trim()}
              className="w-full rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground shadow transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Guardando..." : "Guardar ruta"}
            </button>
          </div>
        </form>
      </div>

      {/* Listado de rutas guardadas */}
      <div className="space-y-4">
        <h3 className="font-display text-base font-bold uppercase tracking-wider text-foreground">
          Rutas Disponibles
        </h3>

        {/* Mis rutas guardadas */}
        {userRoutes.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card/40 p-4 shadow-sm">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
              🔒 Rutas en mi cuenta ({userRoutes.length})
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {userRoutes.map((route) => {
                const isFocused = focusedUserRouteId === route.id;
                const isDeleting = deletingUserRouteId === route.id;
                const isConfirming = confirmDeleteUserRouteId === route.id;
                const isSharing = sharingUserRouteId === route.id;

                return (
                  <div
                    key={route.id}
                    className={`flex flex-col justify-between rounded-lg border p-3.5 transition-all ${
                      isFocused
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border/60 bg-card/60 hover:border-border"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h5 className="truncate text-sm font-bold text-foreground">
                            {route.name}
                          </h5>
                          {route.origin && (
                            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                              📍 {route.origin}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                          {route.points.length} pts
                        </span>
                      </div>

                      {(route.distanceMeters || route.durationSeconds) && (
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          {route.distanceMeters ? (
                            <span>{formatDistance(route.distanceMeters)}</span>
                          ) : null}
                          {route.durationSeconds ? (
                            <span>{formatDuration(route.durationSeconds)}</span>
                          ) : null}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/40 pt-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          setFocusedUserRouteId(isFocused ? null : route.id)
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        {isFocused ? (
                          <>
                            <EyeOff className="size-3.5" /> Ocultar
                          </>
                        ) : (
                          <>
                            <Eye className="size-3.5" /> Ver mapa
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openShareForm(route)}
                          className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                          title="Compartir ruta"
                        >
                          <Link2 className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteUserRoute(route)}
                          disabled={isDeleting}
                          className={`rounded p-1.5 text-xs font-semibold transition-colors ${
                            isConfirming
                              ? "bg-destructive text-destructive-foreground"
                              : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          }`}
                          title={isConfirming ? "Haz clic de nuevo para confirmar" : "Eliminar ruta"}
                        >
                          {isConfirming ? "Confirmar" : <Trash2 className="size-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Formulario rápido para compartir */}
                    {shareFormRouteId === route.id && (
                      <div className="mt-3 rounded-md border border-border/80 bg-background/80 p-2.5">
                        <label className="block text-[11px] font-medium text-muted-foreground">
                          Correo del operador o supervisor:
                        </label>
                        <input
                          type="email"
                          value={shareEmail}
                          onChange={(e) => setShareEmail(e.target.value)}
                          placeholder="correo@ejemplo.com"
                          className="mt-1 w-full rounded border border-input bg-background px-2 py-1 text-xs outline-none focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => void handleShareUserRoute(route)}
                          disabled={isSharing}
                          className="mt-2 w-full rounded bg-primary py-1 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                        >
                          {isSharing ? "Generando..." : "Copiar enlace público"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rutas globales de Wialon */}
        <div className="rounded-xl border border-border/60 bg-card/40 p-4 shadow-sm">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            🌐 Rutas globales en Wialon ({visibleRoutes.length})
          </h4>

          {visibleRoutes.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">
              No hay rutas registradas en el recurso seleccionado.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleRoutes.map((route) => {
                const isFocused = focusedRouteId === route.id;
                const isDeleting = deletingId === route.id;
                const isConfirming = confirmDeleteWialonRouteId === route.id;

                return (
                  <div
                    key={route.id}
                    className={`flex flex-col justify-between rounded-lg border p-3.5 transition-all ${
                      isFocused
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border/60 bg-card/60 hover:border-border"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="truncate text-sm font-bold text-foreground">
                          {route.name}
                        </h5>
                        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {route.points.length} pts
                        </span>
                      </div>
                      <p className="mt-1 truncate text-[11px] text-muted-foreground">
                        🏢 {route.resource}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/40 pt-2.5">
                      <button
                        type="button"
                        onClick={() => setFocusedRouteId(isFocused ? null : route.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        {isFocused ? (
                          <>
                            <EyeOff className="size-3.5" /> Ocultar
                          </>
                        ) : (
                          <>
                            <Eye className="size-3.5" /> Ver mapa
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDeleteWialonRoute(route)}
                        disabled={isDeleting}
                        className={`rounded p-1.5 text-xs font-semibold transition-colors ${
                          isConfirming
                            ? "bg-destructive text-destructive-foreground"
                            : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        }`}
                        title={isConfirming ? "Haz clic de nuevo para confirmar" : "Eliminar de Wialon"}
                      >
                        {isConfirming ? "Confirmar" : <Trash2 className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
