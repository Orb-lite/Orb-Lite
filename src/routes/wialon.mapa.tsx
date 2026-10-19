import * as React from "react";
import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  Car,
  ChevronDown,
  Layers,
  MapPinned,
  RefreshCw,
  Route as RouteIcon,
  Search,
} from "lucide-react";
import { WialonGuard } from "@/components/wialon-guard";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { getUserRoutes, wialonGeofences } from "@/lib/wialon.functions";
import { clientFetchGeofences } from "@/lib/wialon-client-api";
import { writeSession, type WialonSession } from "@/lib/wialon-session";
import { matchesUnitSearch, selectAllState, useHiddenUnits } from "@/lib/wialon-visibility";
import { useWialonUnitsData } from "@/hooks/useWialonUnits";
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
  const fetchGeofences = useServerFn(wialonGeofences);
  const fetchUserRoutes = useServerFn(getUserRoutes);

  const [activeTab, setActiveTab] = React.useState<"unidades" | "geocercas" | "rutas">("unidades");
  const [focusId, setFocusId] = React.useState<number | null>(null);
  const [search, setSearch] = React.useState("");
  const [geofenceSearch, setGeofenceSearch] = React.useState("");
  const [routeSearch, setRouteSearch] = React.useState("");
  const [selectedGeofenceKeys, setSelectedGeofenceKeys] = React.useState<string[] | null>(null);
  const [selectedRouteIds, setSelectedRouteIds] = React.useState<string[] | null>(null);

  const { hidden, setVisible } = useHiddenUnits(session);
  const { units, isLoading: unitsLoading, isFetching: unitsFetching, isError: unitsError, error: unitsErrorObj, refetch: refetchUnits } =
    useWialonUnitsData(session);

  // Consulta de geocercas
  const geofencesQuery = useQuery({
    queryKey: ["wialon-geofences", session.sid, session.host],
    queryFn: async () => {
      try {
        const res = await fetchGeofences({ data: { host: session.host, sid: session.sid } });
        if (res?.zones && res.zones.length > 0) return res;
      } catch (err) {
        console.warn("[MapaView] fetchGeofences server falló, probando cliente directo:", err);
      }
      return await clientFetchGeofences(session.host, session.sid);
    },
    refetchInterval: 60000,
  });

  // Consulta de rutas creadas y vinculadas a la cuenta
  const userRoutesQuery = useQuery({
    queryKey: ["user-routes", session.userId],
    queryFn: async () => {
      try {
        const res = await fetchUserRoutes({
          data: { userId: session.userId, host: session.host, sid: session.sid },
        });
        if (res?.routes && res.routes.length > 0) return res;
      } catch {}
      try {
        const local = localStorage.getItem(`orb_user_routes_${session.userId}`);
        if (local) {
          const routes = JSON.parse(local);
          if (Array.isArray(routes)) return { routes };
        }
      } catch {}
      return { routes: [] };
    },
    staleTime: 30000,
  });

  const geofences = geofencesQuery.data?.zones ?? [];
  const userRoutes = userRoutesQuery.data?.routes ?? [];

  const keyForGeofence = (fence: { resourceId: number; id: number }) =>
    `${fence.resourceId}:${fence.id}`;

  const selectedKeys = selectedGeofenceKeys ?? geofences.map(keyForGeofence);
  const activeGeofences = geofences.filter((f) => selectedKeys.includes(keyForGeofence(f)));

  const activeRoutes = selectedRouteIds == null
    ? userRoutes
    : userRoutes.filter((r: any) => selectedRouteIds.includes(String(r.id)));

  const visibleUnits = React.useMemo(() => units.filter((u) => !hidden.has(u.id)), [units, hidden]);
  const filteredUnits = React.useMemo(
    () => units.filter((unit) => matchesUnitSearch(unit, search)),
    [units, search],
  );
  const filteredUnitIds = filteredUnits.map((u) => u.id);
  const allUnitsState = selectAllState(filteredUnitIds, hidden);

  // Mapear geocercas con puntos geométricos garantizados
  const activeMapGeofences: MapGeofence[] = React.useMemo(() => {
    return activeGeofences.map((zone: any) => {
      const rawPoints = Array.isArray(zone.points) ? zone.points : [];
      let formattedPoints: Array<{ lat: number; lon: number; radius: number }> = rawPoints.map((pt: any) => {
        if (Array.isArray(pt)) {
          return { lat: pt[0], lon: pt[1], radius: zone.radius || 100 };
        }
        return {
          lat: pt.lat ?? pt.y ?? (zone.center ? zone.center[0] : 20.6736),
          lon: pt.lon ?? pt.x ?? (zone.center ? zone.center[1] : -103.344),
          radius: pt.radius ?? pt.r ?? zone.radius ?? 100,
        };
      });

      if (formattedPoints.length === 0) {
        if (zone.type === 3 || zone.radius) {
          const c = zone.center ?? [20.6736, -103.344];
          formattedPoints = [{ lat: c[0], lon: c[1], radius: zone.radius ?? 100 }];
        } else if (zone.min_y != null && zone.min_x != null && zone.max_y != null && zone.max_x != null) {
          formattedPoints = [
            { lat: zone.min_y, lon: zone.min_x, radius: 0 },
            { lat: zone.min_y, lon: zone.max_x, radius: 0 },
            { lat: zone.max_y, lon: zone.max_x, radius: 0 },
            { lat: zone.max_y, lon: zone.min_x, radius: 0 },
          ];
        } else if (zone.center) {
          formattedPoints = [{ lat: zone.center[0], lon: zone.center[1], radius: 100 }];
        }
      }

      return {
        id: zone.id,
        name: zone.name,
        resource: zone.resource,
        type: (zone.type === 1 || zone.type === 2 || zone.type === 3 ? zone.type : 2) as 1 | 2 | 3,
        color: zone.color || "#92d700",
        points: formattedPoints,
      };
    });
  }, [activeGeofences]);

  // Mapear rutas trazadas para dibujarlas en el mapa
  const activeMapRoutes: MapGeofence[] = React.useMemo(() => {
    return activeRoutes.map((r: any, idx: number) => {
      const rawPoints = Array.isArray(r.points) ? r.points : [];
      return {
        id: typeof r.id === "number" ? r.id : -(idx + 500),
        name: r.name,
        resource: "Ruta trazada",
        type: 1 as const,
        color: "#92d700",
        points: rawPoints.map((pt: any) => ({
          lat: pt.lat ?? pt.y,
          lon: pt.lon ?? pt.x,
          radius: 0,
        })),
        markerPoints: r.routeStops?.length
          ? r.routeStops
          : rawPoints.length > 1
            ? [rawPoints[0], rawPoints[rawPoints.length - 1]]
            : rawPoints,
      };
    });
  }, [activeRoutes]);

  // Combinar geocercas y rutas para pasarlas a WialonMap
  const allMapOverlays: MapGeofence[] = React.useMemo(
    () => [...activeMapGeofences, ...activeMapRoutes],
    [activeMapGeofences, activeMapRoutes],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      {/* Contenedor del Mapa */}
      <ClientOnly
        fallback={<div className="h-[520px] rounded-lg border border-border/60 bg-card/40" />}
      >
        <React.Suspense
          fallback={<div className="h-[520px] rounded-lg border border-border/60 bg-card/40" />}
        >
          <WialonMap units={visibleUnits} geofences={allMapOverlays} focusId={focusId} />
        </React.Suspense>
      </ClientOnly>

      {/* Panel lateral con pestañas de Unidades, Geocercas y Rutas */}
      <div className="flex flex-col rounded-xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur">
        {/* Selector de pestañas */}
        <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-background/80 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("unidades")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-bold uppercase transition-all ${
              activeTab === "unidades"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Car className="size-3.5" />
            <span>Unidades ({units.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("geocercas")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-bold uppercase transition-all ${
              activeTab === "geocercas"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPinned className="size-3.5" />
            <span>Geocercas ({geofences.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rutas")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-bold uppercase transition-all ${
              activeTab === "rutas"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <RouteIcon className="size-3.5" />
            <span>Rutas ({userRoutes.length})</span>
          </button>
        </div>

        {/* --- PESTAÑA: UNIDADES --- */}
        {activeTab === "unidades" && (
          <div className="mt-4 flex flex-1 flex-col">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Visibles en mapa: {visibleUnits.length} de {units.length}
              </span>
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                <Checkbox
                  checked={allUnitsState}
                  disabled={filteredUnitIds.length === 0}
                  onCheckedChange={() => setVisible(filteredUnitIds, allUnitsState !== true)}
                  aria-label="Mostrar u ocultar todas las unidades"
                />
                Todas
              </label>
            </div>

            <div className="relative mt-2.5">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar unidad o IMEI…"
                aria-label="Buscar unidades"
                className="pl-9 h-9 text-xs"
              />
            </div>

            {unitsLoading && units.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-center">
                <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-xs text-muted-foreground">Sincronizando unidades de Wialon…</p>
              </div>
            ) : null}

            {unitsError ? (
              <div className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs space-y-2">
                <p className="font-semibold text-destructive">Error al sincronizar unidades</p>
                <p className="text-[11px] text-muted-foreground">
                  {unitsErrorObj instanceof Error ? unitsErrorObj.message : "Reintenta la conexión satelital."}
                </p>
                <button
                  type="button"
                  onClick={() => void refetchUnits()}
                  className="rounded bg-primary/20 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary/30"
                >
                  Reintentar
                </button>
              </div>
            ) : null}

            <ul className="mt-3 max-h-[380px] flex-1 space-y-1.5 overflow-auto pr-1 text-xs">
              {filteredUnits.map((unit) => {
                const isVisible = !hidden.has(unit.id);
                return (
                  <li
                    key={unit.id}
                    className={`flex items-start gap-2.5 rounded-lg border p-2 transition-colors ${
                      focusId === unit.id ? "border-primary bg-primary/5" : "border-border/60 hover:bg-muted/40"
                    } ${isVisible ? "" : "opacity-60"}`}
                  >
                    <Checkbox
                      className="mt-0.5"
                      checked={isVisible}
                      onCheckedChange={(value) => setVisible([unit.id], value === true)}
                      aria-label={`Mostrar ${unit.name} en el mapa`}
                    />
                    <button
                      type="button"
                      onClick={() => setFocusId(unit.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="truncate font-bold text-foreground">{unit.name}</span>
                        <span
                          className={`shrink-0 text-[10px] font-semibold uppercase ${
                            unit.online ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {unit.online ? "En línea" : "Sin señal"}
                        </span>
                      </div>
                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                        {unit.imei ? `IMEI ${unit.imei}` : `#${unit.id}`}
                        {unit.speed != null ? ` · ${Math.round(unit.speed)} km/h` : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
              {!unitsLoading && filteredUnits.length === 0 && (
                <li className="py-4 text-center text-xs text-muted-foreground">
                  {units.length === 0 ? "No hay unidades satelitales en esta cuenta." : "Ninguna unidad coincide con el filtro."}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* --- PESTAÑA: GEOCERCAS --- */}
        {activeTab === "geocercas" && (
          <div className="mt-4 flex flex-1 flex-col">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Mostrando en mapa: {activeGeofences.length} de {geofences.length}
              </span>
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                <Checkbox
                  checked={
                    geofences.length > 0 && activeGeofences.length === geofences.length
                      ? true
                      : activeGeofences.length > 0
                        ? "indeterminate"
                        : false
                  }
                  disabled={geofences.length === 0}
                  onCheckedChange={(checked) =>
                    setSelectedGeofenceKeys(checked === true ? geofences.map(keyForGeofence) : [])
                  }
                  aria-label="Activar todas las geocercas"
                />
                Todas
              </label>
            </div>

            <div className="relative mt-2.5">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={geofenceSearch}
                onChange={(e) => setGeofenceSearch(e.target.value)}
                placeholder="Filtrar geocercas…"
                aria-label="Filtrar geocercas"
                className="pl-9 h-9 text-xs"
              />
            </div>

            <ul className="mt-3 max-h-[380px] flex-1 space-y-1.5 overflow-auto pr-1 text-xs">
              {geofences
                .filter((g) => g.name.toLowerCase().includes(geofenceSearch.toLowerCase()))
                .map((fence) => {
                  const isChecked = selectedKeys.includes(keyForGeofence(fence));
                  return (
                    <li
                      key={`${fence.resourceId}-${fence.id}`}
                      className="flex items-center gap-2.5 rounded-lg border border-border/60 p-2 hover:bg-muted/40 transition-colors"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          setSelectedGeofenceKeys((current) => {
                            const next = new Set(current ?? geofences.map(keyForGeofence));
                            const key = keyForGeofence(fence);
                            if (checked === true) next.add(key);
                            else next.delete(key);
                            return [...next];
                          })
                        }
                        aria-label={`Activar ${fence.name}`}
                      />
                      <span
                        className="size-3 shrink-0 rounded-full border border-border"
                        style={{ backgroundColor: fence.color || "#92d700" }}
                      />
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-foreground">{fence.name}</span>
                        <span className="block truncate text-[10px] text-muted-foreground">
                          {fence.resource || "Recurso Wialon"} · {fence.type === 3 ? "Círculo" : "Polígono"}
                        </span>
                      </div>
                    </li>
                  );
                })}
              {geofences.length === 0 && (
                <li className="py-4 text-center text-xs text-muted-foreground">
                  No se encontraron geocercas registradas en la cuenta.
                </li>
              )}
            </ul>
          </div>
        )}

        {/* --- PESTAÑA: RUTAS --- */}
        {activeTab === "rutas" && (
          <div className="mt-4 flex flex-1 flex-col">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Trazadas en mapa: {activeRoutes.length} de {userRoutes.length}
              </span>
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                <Checkbox
                  checked={
                    userRoutes.length > 0 && activeRoutes.length === userRoutes.length
                      ? true
                      : activeRoutes.length > 0
                        ? "indeterminate"
                        : false
                  }
                  disabled={userRoutes.length === 0}
                  onCheckedChange={(checked) =>
                    setSelectedRouteIds(checked === true ? userRoutes.map((r: any) => String(r.id)) : [])
                  }
                  aria-label="Activar todas las rutas"
                />
                Todas
              </label>
            </div>

            <div className="relative mt-2.5">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={routeSearch}
                onChange={(e) => setRouteSearch(e.target.value)}
                placeholder="Filtrar rutas…"
                aria-label="Filtrar rutas"
                className="pl-9 h-9 text-xs"
              />
            </div>

            <ul className="mt-3 max-h-[380px] flex-1 space-y-1.5 overflow-auto pr-1 text-xs">
              {userRoutes
                .filter((r: any) => r.name.toLowerCase().includes(routeSearch.toLowerCase()))
                .map((route: any) => {
                  const isChecked = selectedRouteIds == null || selectedRouteIds.includes(String(route.id));
                  return (
                    <li
                      key={String(route.id)}
                      className="flex items-center gap-2.5 rounded-lg border border-border/60 p-2 hover:bg-muted/40 transition-colors"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          setSelectedRouteIds((current) => {
                            const next = new Set(current ?? userRoutes.map((r: any) => String(r.id)));
                            const idStr = String(route.id);
                            if (checked === true) next.add(idStr);
                            else next.delete(idStr);
                            return [...next];
                          })
                        }
                        aria-label={`Activar ruta ${route.name}`}
                      />
                      <span className="size-3 shrink-0 rounded-full bg-primary" />
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-foreground">{route.name}</span>
                        <span className="block truncate text-[10px] text-muted-foreground">
                          {route.origin ? `Desde: ${route.origin}` : "Ruta planificada"}
                          {route.routeStops?.length ? ` · ${route.routeStops.length} paradas` : ""}
                        </span>
                      </div>
                    </li>
                  );
                })}
              {userRoutes.length === 0 && (
                <li className="py-4 text-center text-xs text-muted-foreground">
                  No hay rutas trazadas en esta cuenta. Puedes crear una en la pestaña Rutas.
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
