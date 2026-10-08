import * as React from "react";
import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, MapPinned, Search, Route as RouteIcon, Car, Layers } from "lucide-react";
import { WialonGuard } from "@/components/wialon-guard";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { wialonGeofences, wialonUnits, getUserRoutes } from "@/lib/wialon.functions";
import { writeSession, type WialonSession } from "@/lib/wialon-session";
import { matchesUnitSearch, selectAllState, useHiddenUnits } from "@/lib/wialon-visibility";
import {
  fetchReliableUnits,
  fetchReliableGeofences,
  fetchReliableUserRoutes,
} from "@/lib/wialon-client-api";
import type { MapGeofence } from "@/components/wialon-map";

const WialonMap = React.lazy(() => import("@/components/wialon-map"));

export const Route = createFileRoute("/wialon/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa en vivo | Plataforma ORB-LITE" },
      { name: "description", content: "Ubicación en tiempo real de tus unidades GPS, geocercas y rutas." },
      { property: "og:title", content: "Mapa en vivo | Plataforma ORB-LITE" },
      { property: "og:description", content: "Ubicación en tiempo real de tus unidades GPS, geocercas y rutas." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <WialonGuard>{(session) => <MapaView session={session} />}</WialonGuard>,
});

function MapaView({ session }: { session: WialonSession }) {
  const fetchUnits = useServerFn(wialonUnits);
  const fetchGeofences = useServerFn(wialonGeofences);
  const fetchUserRoutes = useServerFn(getUserRoutes);

  const [focusId, setFocusId] = React.useState<number | null>(null);
  const [search, setSearch] = React.useState("");
  const [geofenceMenuOpen, setGeofenceMenuOpen] = React.useState(false);
  const [routesMenuOpen, setRoutesMenuOpen] = React.useState(false);
  const [selectedGeofenceKeys, setSelectedGeofenceKeys] = React.useState<string[] | null>(null);
  const [selectedRouteIds, setSelectedRouteIds] = React.useState<string[] | null>(null);
  const { hidden, setVisible } = useHiddenUnits(session);

  // 1. Unidades en tiempo real con fallback resiliente server + JSONP + caché
  const query = useQuery({
    queryKey: ["wialon-units", session.sid, session.host],
    queryFn: async () => {
      return await fetchReliableUnits({ session, fetchUnitsServerFn: fetchUnits });
    },
    refetchInterval: 15000,
  });

  // 2. Geocercas con fallback resiliente server + JSONP
  const geofencesQuery = useQuery({
    queryKey: ["wialon-geofences", session.sid, session.host],
    queryFn: async () => {
      return await fetchReliableGeofences({ session, fetchGeofencesServerFn: fetchGeofences });
    },
    refetchInterval: 60000,
  });

  // 3. Rutas creadas por el usuario / Supabase
  const userRoutesQuery = useQuery({
    queryKey: ["user-routes", session.userId],
    queryFn: async () => {
      return await fetchReliableUserRoutes({ session, fetchUserRoutesServerFn: fetchUserRoutes });
    },
    refetchInterval: 60000,
  });

  const units = query.data?.units ?? [];
  const rawGeofences = geofencesQuery.data?.zones ?? [];
  const userRoutes = userRoutesQuery.data?.routes ?? [];

  // Separar Geocercas (polígonos tipo 2, círculos tipo 3 o por defecto) de Rutas de Wialon (tipo 1)
  const pureGeofences = React.useMemo(
    () => rawGeofences.filter((z) => z.type !== 1),
    [rawGeofences],
  );
  const wialonType1Routes = React.useMemo(
    () => rawGeofences.filter((z) => z.type === 1),
    [rawGeofences],
  );

  // Rutas unificadas: rutas guardadas en cuenta/Supabase + rutas tipo 1 de Wialon
  const combinedRoutes = React.useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      resource?: string;
      color: string;
      points: Array<{ lat: number; lon: number; radius: number }>;
      markerPoints?: Array<{ lat: number; lon: number }>;
      distanceMeters?: number;
    }> = [];

    // Rutas creadas por el usuario
    for (const ur of userRoutes) {
      list.push({
        id: `user-${ur.id}`,
        name: ur.name,
        resource: ur.userName ? `Usuario: ${ur.userName}` : "Mi cuenta",
        color: ur.color || "#92d700",
        points: ur.points,
        markerPoints: ur.routeStops?.map((s) => ({ lat: s.lat, lon: s.lon })),
        distanceMeters: ur.distanceMeters,
      });
    }

    // Rutas lineales de Wialon
    for (const wr of wialonType1Routes) {
      list.push({
        id: `wialon-${wr.resourceId}-${wr.id}`,
        name: wr.name,
        resource: wr.resource,
        color: wr.color || "#92d700",
        points: wr.points,
      });
    }

    return list;
  }, [userRoutes, wialonType1Routes]);

  // Manejo de Geocercas seleccionadas
  const keyForGeofence = (fence: { resourceId: number; id: number }) =>
    `${fence.resourceId}:${fence.id}`;
  const selectedGeofenceList = selectedGeofenceKeys ?? pureGeofences.map(keyForGeofence);
  const activeGeofences = React.useMemo(
    () => pureGeofences.filter((f) => selectedGeofenceList.includes(keyForGeofence(f))),
    [pureGeofences, selectedGeofenceList],
  );

  // Manejo de Rutas seleccionadas (por defecto todas activas si hay rutas)
  const selectedRouteIdList = selectedRouteIds ?? combinedRoutes.map((r) => r.id);
  const activeRoutes = React.useMemo(
    () => combinedRoutes.filter((r) => selectedRouteIdList.includes(r.id)),
    [combinedRoutes, selectedRouteIdList],
  );

  // Capa unificada que se envía a WialonMap (geocercas polígonos/círculos + rutas lineales)
  const mapLayers: MapGeofence[] = React.useMemo(() => {
    const layers: MapGeofence[] = [...activeGeofences];
    for (const r of activeRoutes) {
      layers.push({
        id: r.id,
        name: r.name,
        resource: r.resource,
        type: 1, // Polilínea de ruta
        color: r.color,
        points: r.points,
        markerPoints: r.markerPoints,
      });
    }
    return layers;
  }, [activeGeofences, activeRoutes]);

  const visibleUnits = React.useMemo(() => units.filter((u) => !hidden.has(u.id)), [units, hidden]);
  const filtered = React.useMemo(
    () => units.filter((unit) => matchesUnitSearch(unit, search)),
    [units, search],
  );
  const filteredIds = filtered.map((u) => u.id);
  const allState = selectAllState(filteredIds, hidden);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <ClientOnly
        fallback={<div className="h-[520px] rounded-lg border border-border/60 bg-card/40" />}
      >
        <React.Suspense
          fallback={<div className="h-[520px] rounded-lg border border-border/60 bg-card/40" />}
        >
          <WialonMap units={visibleUnits} geofences={mapLayers} focusId={focusId} />
        </React.Suspense>
      </ClientOnly>

      <div className="rounded-lg border border-border/60 p-4 space-y-4">
        {/* PANEL DE CONTROL DE CAPAS: GEOCERCAS Y RUTAS */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* 1. CONTROL DE GEOCERCAS */}
          <div className="rounded-lg border border-border/60 bg-card/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <MapPinned className="size-4 text-primary" />
                <h2 className="font-display text-xs font-bold uppercase tracking-wider">
                  Geocercas
                </h2>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {activeGeofences.length}/{pureGeofences.length} activas
              </span>
            </div>
            <div className="relative mt-2">
              <button
                type="button"
                onClick={() => setGeofenceMenuOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-md border border-input bg-background px-2.5 py-1.5 text-left text-xs hover:border-primary"
                aria-expanded={geofenceMenuOpen}
              >
                <span className="truncate">
                  {pureGeofences.length === 0
                    ? "Sin geocercas"
                    : activeGeofences.length === pureGeofences.length
                      ? "Todas visibles"
                      : activeGeofences.length === 0
                        ? "Ocultas"
                        : `${activeGeofences.length} activas`}
                </span>
                <ChevronDown
                  className={`size-3.5 transition-transform ${geofenceMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              {geofenceMenuOpen && pureGeofences.length > 0 ? (
                <div className="absolute inset-x-0 top-full z-[1100] mt-1 max-h-56 overflow-auto rounded-md border border-border bg-background p-2 shadow-xl">
                  <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs font-semibold uppercase hover:bg-muted">
                    <Checkbox
                      checked={
                        activeGeofences.length === pureGeofences.length
                          ? true
                          : activeGeofences.length > 0
                            ? "indeterminate"
                            : false
                      }
                      onCheckedChange={(checked) =>
                        setSelectedGeofenceKeys(
                          checked === true ? pureGeofences.map(keyForGeofence) : [],
                        )
                      }
                    />
                    Todas
                  </label>
                  <div className="my-1 border-t border-border/60" />
                  {pureGeofences.map((fence) => (
                    <label
                      key={`${fence.resourceId}-${fence.id}`}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs hover:bg-muted"
                    >
                      <Checkbox
                        checked={selectedGeofenceList.includes(keyForGeofence(fence))}
                        onCheckedChange={(checked) =>
                          setSelectedGeofenceKeys((current) => {
                            const next = new Set(current ?? pureGeofences.map(keyForGeofence));
                            const key = keyForGeofence(fence);
                            if (checked === true) next.add(key);
                            else next.delete(key);
                            return [...next];
                          })
                        }
                      />
                      <span
                        className="size-2.5 shrink-0 rounded-full border border-border"
                        style={{ backgroundColor: fence.color || "#92d700" }}
                      />
                      <span className="min-w-0 flex-1 truncate">{fence.name}</span>
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* 2. CONTROL DE RUTAS */}
          <div className="rounded-lg border border-border/60 bg-card/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <RouteIcon className="size-4 text-primary" />
                <h2 className="font-display text-xs font-bold uppercase tracking-wider">
                  Rutas
                </h2>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {activeRoutes.length}/{combinedRoutes.length} activas
              </span>
            </div>
            <div className="relative mt-2">
              <button
                type="button"
                onClick={() => setRoutesMenuOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-md border border-input bg-background px-2.5 py-1.5 text-left text-xs hover:border-primary"
                aria-expanded={routesMenuOpen}
              >
                <span className="truncate">
                  {combinedRoutes.length === 0
                    ? "Sin rutas"
                    : activeRoutes.length === combinedRoutes.length
                      ? "Todas visibles"
                      : activeRoutes.length === 0
                        ? "Ocultas"
                        : `${activeRoutes.length} activas`}
                </span>
                <ChevronDown
                  className={`size-3.5 transition-transform ${routesMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              {routesMenuOpen && combinedRoutes.length > 0 ? (
                <div className="absolute inset-x-0 top-full z-[1100] mt-1 max-h-56 overflow-auto rounded-md border border-border bg-background p-2 shadow-xl">
                  <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs font-semibold uppercase hover:bg-muted">
                    <Checkbox
                      checked={
                        activeRoutes.length === combinedRoutes.length
                          ? true
                          : activeRoutes.length > 0
                            ? "indeterminate"
                            : false
                      }
                      onCheckedChange={(checked) =>
                        setSelectedRouteIds(checked === true ? combinedRoutes.map((r) => r.id) : [])
                      }
                    />
                    Todas
                  </label>
                  <div className="my-1 border-t border-border/60" />
                  {combinedRoutes.map((route) => (
                    <label
                      key={route.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs hover:bg-muted"
                    >
                      <Checkbox
                        checked={selectedRouteIdList.includes(route.id)}
                        onCheckedChange={(checked) =>
                          setSelectedRouteIds((current) => {
                            const next = new Set(current ?? combinedRoutes.map((r) => r.id));
                            if (checked === true) next.add(route.id);
                            else next.delete(route.id);
                            return [...next];
                          })
                        }
                      />
                      <span
                        className="size-2.5 shrink-0 rounded-full border border-border"
                        style={{ backgroundColor: route.color || "#92d700" }}
                      />
                      <span className="min-w-0 flex-1 truncate">{route.name}</span>
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* 3. LISTA DE UNIDADES CON BÚSQUEDA Y SELECCIÓN */}
        <div>
          <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider">
              Unidades ({visibleUnits.length}/{units.length})
            </h2>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <Checkbox
                checked={allState}
                disabled={filteredIds.length === 0}
                onCheckedChange={() => setVisible(filteredIds, allState !== true)}
                aria-label="Mostrar u ocultar todas las unidades"
              />
              Todas
            </label>
          </div>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar unidad, IMEI o usuario…"
              aria-label="Buscar unidades"
              className="pl-9 h-9 text-xs"
            />
          </div>

          {query.isLoading && units.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-muted-foreground">Sincronizando unidades satelitales…</p>
            </div>
          ) : null}

          {!query.isLoading && units.length === 0 ? (
            <div className="mt-4 rounded-xl border border-border/80 bg-card/60 p-4 text-center space-y-3">
              <p className="text-xs font-semibold text-foreground">
                No se detectaron unidades en servidor{" "}
                <span className="font-mono text-primary font-bold">
                  {session.host === "lite" ? "ORB-LITE (US)" : "ORB-FULL (Global)"}
                </span>
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const altHost = session.host === "lite" ? "full" : "lite";
                    writeSession({ ...session, host: altHost });
                    void query.refetch();
                  }}
                  className="rounded-lg bg-primary/10 border border-primary/30 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                >
                  Alternar a Servidor {session.host === "lite" ? "ORB-FULL (Hosting)" : "ORB-LITE (US)"}
                </button>
                <button
                  type="button"
                  onClick={() => void query.refetch()}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
                >
                  Reintentar descarga de unidades
                </button>
              </div>
            </div>
          ) : null}

          <ul className="mt-3 max-h-[360px] space-y-2 overflow-auto pr-1 text-sm">
            {filtered.map((unit) => {
              const isVisible = !hidden.has(unit.id);
              return (
                <li
                  key={unit.id}
                  className={`flex items-start gap-3 rounded-md border px-3 py-2 transition-colors ${
                    focusId === unit.id ? "border-primary bg-primary/5" : "border-border/60 bg-card/20"
                  } ${isVisible ? "" : "opacity-60"}`}
                >
                  <Checkbox
                    className="mt-0.5"
                    checked={isVisible}
                    onCheckedChange={(value) => setVisible([unit.id], value === true)}
                    aria-label={`Mostrar ${unit.name} en el mapa`}
                  />
                  <button onClick={() => setFocusId(unit.id)} className="min-w-0 flex-1 text-left">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate font-semibold text-xs sm:text-sm">{unit.name}</span>
                      <span
                        className={`shrink-0 text-[11px] font-bold uppercase ${
                          unit.online ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {unit.online ? "En línea" : "Sin señal"}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                      {unit.imei ? `IMEI: ${unit.imei}` : `#${unit.id}`}
                      {unit.creatorName ? ` · ${unit.creatorName}` : ""}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      {unit.speed != null ? `${Math.round(unit.speed)} km/h · ` : ""}
                      {unit.lastMessage
                        ? new Date(unit.lastMessage * 1000).toLocaleString("es-MX")
                        : "sin mensajes"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
