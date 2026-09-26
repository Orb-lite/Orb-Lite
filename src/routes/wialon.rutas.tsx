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
  ShieldCheck,
  Layers,
  Route as RouteIcon,
} from "lucide-react";
import { WialonGuard } from "@/components/wialon-guard";
import { PlatformHeader } from "@/components/wialon/PlatformHeader";
import type {
  DrawingPoint,
  MapAddressPoint,
  MapGeofence,
} from "@/components/wialon-map";

const WialonMap = React.lazy(() => import("@/components/wialon-map"));
import { shareUserRoute, getReportEmails } from "@/lib/route-share.functions";
import {
  getUserRoutes,
  saveUserRoute,
  deleteUserRoute,
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
        content:
          "Crea rutas lineales en Wialon con puntos del mapa o direcciones escritas.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <WialonGuard>{(session) => <RutasView session={session} />}</WialonGuard>
  ),
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
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.round(meters)} m`;
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

function buildGoogleMapsUrlForPoints(
  points: Array<{ lat: number; lon: number }>,
) {
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
  // Color satelital unificado ORB-LITE: verde lima (#92d700) para todas las rutas y recorridos
  const ROUTE_COLOR = "#92d700";
  const [filterResourceId, setFilterResourceId] = React.useState<
    number | "all"
  >("all");
  const [resourceId, setResourceId] = React.useState<number | null>(null);
  const [focusedRouteId, setFocusedRouteId] = React.useState<number | null>(
    null,
  );
  const [focusedUserRouteId, setFocusedUserRouteId] = React.useState<
    string | null
  >(null);
  const [origin, setOrigin] = React.useState("");
  const [addresses, setAddresses] = React.useState([""]);
  const [returnToOrigin, setReturnToOrigin] = React.useState(true);
  const [inputMode, setInputMode] = React.useState<RouteInputMode>("addresses");
  const [geocodedAddresses, setGeocodedAddresses] = React.useState<
    AddressPreviewPoint[]
  >([]);
  const [plannedRoute, setPlannedRoute] = React.useState<PlannedRoute | null>(
    null,
  );
  const [drawing, setDrawing] = React.useState(false);
  const [drawingResetKey, setDrawingResetKey] = React.useState(0);
  const [draft, setDraft] = React.useState<RouteDraft | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [deletingUserRouteId, setDeletingUserRouteId] = React.useState<
    string | null
  >(null);
  const [sharingUserRouteId, setSharingUserRouteId] = React.useState<
    string | null
  >(null);
  const [copiedUserRouteId, setCopiedUserRouteId] = React.useState<
    string | null
  >(null);
  const [confirmDeleteUserRouteId, setConfirmDeleteUserRouteId] =
    React.useState<string | null>(null);
  const [confirmDeleteWialonRouteId, setConfirmDeleteWialonRouteId] =
    React.useState<number | null>(null);
  const [syncToWialon, setSyncToWialon] = React.useState(false);
  const [geocoding, setGeocoding] = React.useState(false);
  const [planning, setPlanning] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Rutas privadas de la cuenta de usuario (guardadas en nuestro servidor)
  const userRoutesQuery = useQuery({
    queryKey: ["user-routes", session.userId],
    queryFn: () => fetchUserRoutes({ data: { userId: session.userId } }),
  });
  const userRoutes = userRoutesQuery.data?.routes ?? [];

  // Rutas en Wialon
  const query = useQuery({
    queryKey: ["wialon-geofences", session.sid],
    queryFn: () =>
      fetchGeofences({ data: { host: session.host, sid: session.sid } }),
    refetchInterval: 60000,
  });
  const allRoutes = (query.data?.zones ?? []).filter((zone) => zone.type === 1);
  const resources = query.data?.resources ?? [];

  // Rutas creadas en Wialon Logistics (solo ORB-FULL)
  const logisticsQuery = useQuery({
    queryKey: ["wialon-logistics-routes", session.sid],
    queryFn: () =>
      wialonLogisticsRoutes({ data: { host: session.host, sid: session.sid } }),
    enabled: session.host === "full",
    refetchInterval: 60000,
    retry: false,
  });
  const logisticsRoutes = logisticsQuery.data?.routes ?? [];
  const [shownLogisticsIds, setShownLogisticsIds] = React.useState<
    ReadonlySet<string>
  >(new Set());

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
    resourceId ??
    (filterResourceId !== "all"
      ? filterResourceId
      : (resources[0]?.id ?? null));

  const userMapRoutes: MapGeofence[] = userRoutes.map((route) => ({
    id: route.id,
    name: route.name,
    resource: `Mi cuenta (${session.userName || "Privada"})`,
    type: 1,
    color: ROUTE_COLOR,
    points: route.points,
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
    }));
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
  const nextWazeStop =
    plannedRoute?.stops.find((stop) => !stop.isOrigin) ?? null;

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
      current.map((address, currentIndex) =>
        currentIndex === index ? value : address,
      ),
    );
    setGeocodedAddresses([]);
    clearPlan();
  }

  function addAddress() {
    setAddresses((current) => [...current, ""]);
  }

  function removeAddress(index: number) {
    setAddresses((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
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
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudieron ubicar las direcciones.",
      );
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
        geocodedAddresses
          .slice(1)
          .every((location, index) => location.query === stops[index]);
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
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo optimizar la ruta.",
      );
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
      setError(
        "Dibuja al menos dos puntos o genera una ruta antes de guardar.",
      );
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
      const stopsArr = isMapPlan
        ? []
        : addresses.map((a) => a.trim()).filter(Boolean);

      const res = await saveUserRouteFn({
        data: {
          userId: session.userId,
          userName: session.userName,
          name: name.trim(),
          color: ROUTE_COLOR,
          points: draft.points,
          origin: originStr || undefined,
          addresses: stopsArr.length > 0 ? stopsArr : undefined,
          distanceMeters: plannedRoute?.distanceMeters,
          durationSeconds: plannedRoute?.durationSeconds,
          syncToWialon,
          host: session.host,
          sid: session.sid,
          resourceId:
            syncToWialon && selectedResourceId ? selectedResourceId : undefined,
        },
      });

      setMessage(
        syncToWialon && res.wialonId
          ? `Ruta "${res.route.name}" guardada en tu cuenta y sincronizada en Wialon (#${res.wialonId}).`
          : `Ruta "${res.route.name}" guardada exitosamente en tu cuenta de usuario (privada).`,
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
      setError(
        cause instanceof Error ? cause.message : "No se pudo guardar la ruta.",
      );
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
  const savedReportEmails = reportEmailsQuery.data?.emails ?? [];

  function openShareForm(route: StoredUserRoute) {
    setShareFormRouteId((current) => (current === route.id ? null : route.id));
    setShareEmail(route.reportEmail ?? "");
  }

  async function handleShareUserRoute(route: StoredUserRoute) {
    const email = shareEmail.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Correo no válido.");
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
          ...(email ? { reportEmail: email } : {}),
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
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo generar el enlace de la ruta.",
      );
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
        cause instanceof Error
          ? cause.message
          : "No se pudo eliminar la ruta de tu cuenta.",
      );
    } finally {
      setDeletingUserRouteId(null);
    }
  }

  async function handleDeleteWialonRoute(route: {
    id: number;
    resourceId: number;
    name: string;
  }) {
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
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo eliminar la ruta de Wialon.",
      );
    } finally {
      setDeletingId(null);
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
              Rutas por Cliente / Recurso
            </h2>
            <p className="text-xs text-muted-foreground">
              {resources.length} recurso{resources.length !== 1 ? "s" : ""}{" "}
              disponible{resources.length !== 1 ? "s" : ""} en Wialon
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
            <option value="all">
              🌐 Todos los clientes ({allRoutes.length} rutas)
            </option>
            {resources.map((res) => {
              const count = allRoutes.filter(
                (r) => r.resourceId === res.id,
              ).length;
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
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/50 bg-background/50 px-4 py-2 text-xs text-muted-foreground">
            <span>
              Mostrando {userMapRoutes.length + mapRoutes.length} ruta
              {userMapRoutes.length + mapRoutes.length !== 1 ? "s" : ""} en el
              mapa
              {userMapRoutes.length > 0
                ? ` (${userMapRoutes.length} en tu cuenta)`
                : ""}
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
            fallback={
              <div className="h-[560px] rounded-lg border border-border/60 bg-card/40" />
            }
          >
            <React.Suspense
              fallback={
                <div className="h-[560px] rounded-lg border border-border/60 bg-card/40" />
              }
            >
              <WialonMap
                units={[]}
                geofences={[...userMapRoutes, ...mapRoutes, ...plannedMapRoute, ...logisticsMapRoutes]}
                focusGeofenceId={focusedUserRouteId ?? focusedRouteId}
                addressPoints={addressPoints}
                drawMode={drawing ? "line" : null}
                drawingResetKey={drawingResetKey}
                onDraftChange={handleDraftChange}
              />
            </React.Suspense>
          </ClientOnly>
        </div>

        <form
          onSubmit={saveRoute}
          className="min-w-0 rounded-lg border border-border/60 p-5"
        >
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
                    Optimiza el orden de las paradas. Puedes escribir calles,
                    lugares, coordenadas o enlaces de Google Maps.
                  </p>
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
                      onChange={(event) =>
                        updateAddress(index, event.target.value)
                      }
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
                  {geocoding
                    ? "Buscando direcciones…"
                    : "Buscar puntos en el mapa"}
                </button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Ubica el origen y cada dirección como un punto numerado antes
                  de optimizar.
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
                    Haz clic sobre el mapa para agregar los puntos en el orden
                    de la ruta.
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
                Marca al menos dos puntos. El primero será la salida y los demás
                serán paradas.
              </p>
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={returnToOrigin}
                  onChange={(event) => {
                    setReturnToOrigin(event.target.checked);
                    clearPlan(false);
                  }}
                  className="size-4 accent-primary"
                />
                Regresar al punto de salida
              </label>
              <button
                type="button"
                onClick={() => void handlePlanRoute()}
                disabled={planning || (draft?.points.length ?? 0) < 2}
                className="mt-4 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {planning ? "Calculando ruta…" : "Optimizar ruta"}
              </button>
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
                  <li
                    key={`${stop.lat}-${stop.lon}-${index}`}
                    className="flex gap-2"
                  >
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
                <p className="mt-2 text-xs text-primary">
                  La ruta considera el regreso al origen.
                </p>
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
                        <ExternalLink className="size-3.5" /> Google Maps ·
                        tramo {index + 1}
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
                      <ExternalLink className="size-3.5" /> Abrir siguiente
                      parada en Waze
                    </a>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Waze abre una parada a la vez; usa el enlace Waze de cada
                  parada para seguir el orden recomendado.
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

          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={syncToWialon}
              onChange={(e) => setSyncToWialon(e.target.checked)}
              className="size-4 rounded border-border accent-primary"
            />
            <span>Sincronizar también en Wialon (recurso del cliente)</span>
          </label>

          {syncToWialon ? (
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
          ) : (
            <div className="mt-3 flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">
              <Lock className="size-3.5 shrink-0" />
              <span>
                Se guardará exclusivamente en tu cuenta de usuario (privada en
                nuestro servidor).
              </span>
            </div>
          )}

          {error ? (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          ) : null}
          {message ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-primary">
              <Check className="size-4" />
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={
              busy ||
              !name.trim() ||
              (syncToWialon && !selectedResourceId) ||
              !draft ||
              draft.points.length < 2
            }
            className="mt-5 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy
              ? "Guardando…"
              : syncToWialon
                ? "Guardar en cuenta y Wialon"
                : "Guardar en mi cuenta"}
          </button>
        </form>
      </div>

      {/* Rutas de Wialon Logistics (solo ORB-FULL) */}
      {session.host === "full" ? (
        <div className="rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <RouteIcon className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold uppercase tracking-wide text-foreground">
                  Rutas de Wialon Logistics
                </h2>
                <p className="text-xs text-muted-foreground">
                  Rutas creadas en la aplicación Logistics de tu cuenta ORB-FULL.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary">
              {logisticsRoutes.length} ruta{logisticsRoutes.length !== 1 ? "s" : ""}
            </span>
          </div>

          {logisticsQuery.isLoading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Cargando rutas de Logistics…
            </div>
          ) : logisticsQuery.isError ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No se pudieron leer las rutas de Logistics. Verifica que tu
              cuenta tenga acceso a la aplicación Logistics.
            </div>
          ) : logisticsRoutes.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No hay rutas creadas en Wialon Logistics para esta cuenta.
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {logisticsRoutes.map((route) => {
                const isShown = shownLogisticsIds.has(route.id);
                return (
                  <div
                    key={route.id}
                    className={`flex flex-col justify-between rounded-lg border bg-background/60 p-3.5 transition-colors ${
                      isShown
                        ? "border-primary ring-1 ring-primary/40 shadow-sm"
                        : "border-border/70 hover:border-primary/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex size-3.5 shrink-0 items-center justify-center">
                          <span className="size-2.5 rounded-full border border-white bg-[#92d700] shadow-[0_0_6px_rgba(146,215,0,0.6)]" />
                        </span>
                        <h3
                          className="truncate font-semibold text-sm text-foreground"
                          title={route.name}
                        >
                          {route.name}
                        </h3>
                      </div>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="rounded bg-muted/50 px-1.5 py-0.5 font-mono">
                          {route.points.length} punto{route.points.length !== 1 ? "s" : ""}
                        </span>
                        {route.ordersCount > 0 ? (
                          <span className="rounded bg-muted/50 px-1.5 py-0.5 font-mono">
                            {route.ordersCount} pedido{route.ordersCount !== 1 ? "s" : ""}
                          </span>
                        ) : null}
                        {route.status ? (
                          <span className="rounded bg-muted/50 px-1.5 py-0.5">
                            {route.status}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-end border-t border-border/40 pt-2.5">
                      <button
                        type="button"
                        onClick={() => toggleLogisticsRoute(route.id)}
                        disabled={route.points.length === 0}
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                          isShown
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-primary hover:bg-primary/10"
                        }`}
                        title={
                          route.points.length === 0
                            ? "Esta ruta no tiene puntos para dibujar"
                            : isShown
                              ? "Quitar del mapa"
                              : "Ver en el mapa"
                        }
                      >
                        {isShown ? (
                          <EyeOff className="size-3.5" />
                        ) : (
                          <Eye className="size-3.5" />
                        )}
                        <span>{isShown ? "En el mapa" : "Ver en mapa"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {/* Sección 1: Mis Rutas Guardadas (En tu cuenta de servidor fuera de Wialon) */}
      <div className="rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Lock className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-bold uppercase tracking-wide text-foreground">
                  Mis Rutas Guardadas
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  <ShieldCheck className="size-3" /> Exclusivo de tu cuenta
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Guardadas en nuestro servidor fuera de Wialon. Solo visibles
                cuando inicia sesión tu cuenta (
                {session.userName || `ID ${session.userId}`}).
              </p>
            </div>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary">
            {userRoutes.length} ruta{userRoutes.length !== 1 ? "s" : ""}
          </span>
        </div>

        {userRoutes.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            {userRoutesQuery.isLoading
              ? "Cargando tus rutas privadas…"
              : "Aún no tienes rutas guardadas en tu cuenta. Traza o genera una arriba y haz clic en 'Guardar en mi cuenta'."}
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {userRoutes.map((route) => {
              const isDeleting = deletingUserRouteId === route.id;
              const isFocused = focusedUserRouteId === route.id;
              const isConfirming = confirmDeleteUserRouteId === route.id;
              const gmapsUrl = buildGoogleMapsUrlForPoints(route.points);

              return (
                <div
                  key={route.id}
                  className={`flex flex-col justify-between rounded-lg border bg-background/60 p-3.5 transition-colors ${
                    isFocused
                      ? "border-primary ring-1 ring-primary/40 shadow-sm"
                      : "border-border/70 hover:border-primary/50"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Dot representativo verde satelital */}
                        <span className="flex size-3.5 shrink-0 items-center justify-center">
                          <span className="size-2.5 rounded-full border border-white bg-[#92d700] shadow-[0_0_6px_rgba(146,215,0,0.6)]" />
                        </span>
                        <div className="min-w-0">
                          <h3
                            className="truncate font-semibold text-sm text-foreground"
                            title={route.name}
                          >
                            {route.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(route.createdAt).toLocaleDateString(
                              "es-MX",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                            {route.distanceMeters
                              ? ` · ${formatDistance(route.distanceMeters)}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="rounded bg-muted/50 px-1.5 py-0.5 font-mono">
                        {route.points.length} puntos
                      </span>
                      {route.origin ? (
                        <span
                          className="truncate max-w-[200px]"
                          title={route.origin}
                        >
                          📍 {route.origin}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setFocusedRouteId(null);
                          setFocusedUserRouteId(route.id);
                        }}
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                          isFocused
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-primary hover:bg-primary/10"
                        }`}
                        title="Ver trazo en el mapa"
                      >
                        <Eye className="size-3.5" />
                        <span>{isFocused ? "Viendo" : "Ver"}</span>
                      </button>

                      {gmapsUrl ? (
                        <a
                          href={gmapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Abrir en Google Maps"
                        >
                          <ExternalLink className="size-3" />
                        </a>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => openShareForm(route)}
                        disabled={sharingUserRouteId === route.id}
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors disabled:opacity-50 ${
                          copiedUserRouteId === route.id
                            ? "bg-primary/15 text-primary font-semibold"
                            : "text-primary hover:bg-primary/10"
                        }`}
                      >
                        <Link2 className="size-3.5" />
                        <span>
                          {sharingUserRouteId === route.id
                            ? "…"
                            : copiedUserRouteId === route.id
                              ? "¡Copiado!"
                              : "Enlace"}
                        </span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteUserRoute(route)}
                      disabled={isDeleting}
                      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                        isConfirming
                          ? "bg-destructive text-destructive-foreground font-bold"
                          : "text-destructive hover:bg-destructive/10"
                      } disabled:opacity-50`}
                      title={
                        isConfirming
                          ? "Confirmar eliminación"
                          : "Eliminar de tu cuenta"
                      }
                    >
                      <Trash2 className="size-3.5" />
                      <span>
                        {isDeleting
                          ? "…"
                          : isConfirming
                            ? "¿Seguro?"
                            : "Borrar"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sección 2: Rutas guardadas en Wialon */}
      <div className="rounded-xl border border-border/60 bg-card/50 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div>
            <h2 className="font-display text-base font-bold uppercase tracking-wide text-foreground">
              Rutas guardadas en Wialon
            </h2>
            <p className="text-xs text-muted-foreground">
              {filterResourceId === "all"
                ? `Mostrando todas las rutas (${visibleRoutes.length})`
                : `Rutas de ${resources.find((r) => r.id === filterResourceId)?.name ?? "cliente"} (${visibleRoutes.length})`}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary">
            {visibleRoutes.length} guardadas
          </span>
        </div>

        {visibleRoutes.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            {query.isLoading
              ? "Cargando rutas de Wialon…"
              : filterResourceId === "all"
                ? "No se encontraron rutas lineales en los recursos de Wialon."
                : "Este cliente no tiene rutas guardadas en Wialon todavía. Traza o genera una arriba."}
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleRoutes.map((route) => {
              const isDeleting = deletingId === route.id;
              const isFocused = focusedRouteId === route.id;
              const isConfirming = confirmDeleteWialonRouteId === route.id;

              return (
                <div
                  key={`${route.resourceId}-${route.id}`}
                  className={`flex flex-col justify-between rounded-lg border bg-background/60 p-3.5 transition-colors ${
                    isFocused
                      ? "border-primary ring-1 ring-primary/40 shadow-sm"
                      : "border-border/70 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex size-3.5 shrink-0 items-center justify-center">
                        <span className="size-2.5 rounded-full border border-white bg-[#92d700] shadow-[0_0_6px_rgba(146,215,0,0.6)]" />
                      </span>
                      <div className="min-w-0">
                        <h3
                          className="truncate font-semibold text-sm text-foreground"
                          title={route.name}
                        >
                          {route.name}
                        </h3>
                        <p
                          className="truncate text-xs text-muted-foreground"
                          title={route.resource}
                        >
                          👤 {route.resource}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5 text-xs text-muted-foreground">
                    <span>{route.points.length} puntos</span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setFocusedUserRouteId(null);
                          setFocusedRouteId(route.id);
                        }}
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                          isFocused
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-primary hover:bg-primary/10"
                        }`}
                        title="Ver trazo en el mapa"
                      >
                        <Eye className="size-3.5" />
                        <span>{isFocused ? "Viendo" : "Ver"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteWialonRoute(route)}
                        disabled={isDeleting}
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                          isConfirming
                            ? "bg-destructive text-destructive-foreground font-bold"
                            : "text-destructive hover:bg-destructive/10"
                        } disabled:opacity-50`}
                        title={
                          isConfirming
                            ? "Confirmar eliminación en Wialon"
                            : "Eliminar de Wialon"
                        }
                      >
                        <Trash2 className="size-3.5" />
                        <span>
                          {isDeleting
                            ? "…"
                            : isConfirming
                              ? "¿Seguro?"
                              : "Borrar"}
                        </span>
                      </button>
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
