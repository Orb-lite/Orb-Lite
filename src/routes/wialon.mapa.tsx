import * as React from "react";
import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, MapPinned, Search } from "lucide-react";
import { WialonGuard } from "@/components/wialon-guard";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { wialonGeofences, wialonUnits } from "@/lib/wialon.functions";
import { writeSession, type WialonSession } from "@/lib/wialon-session";
import { matchesUnitSearch, selectAllState, useHiddenUnits } from "@/lib/wialon-visibility";

const WialonMap = React.lazy(() => import("@/components/wialon-map"));

export const Route = createFileRoute("/wialon/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa en vivo | Plataforma ORB-LITE" },
      { name: "description", content: "Ubicación en tiempo real de tus unidades GPS." },
      { property: "og:title", content: "Mapa en vivo | Plataforma ORB-LITE" },
      { property: "og:description", content: "Ubicación en tiempo real de tus unidades GPS." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <WialonGuard>{(session) => <MapaView session={session} />}</WialonGuard>,
});

function MapaView({ session }: { session: WialonSession }) {
  const fetchUnits = useServerFn(wialonUnits);
  const fetchGeofences = useServerFn(wialonGeofences);
  const [focusId, setFocusId] = React.useState<number | null>(null);
  const [search, setSearch] = React.useState("");
  const [geofenceMenuOpen, setGeofenceMenuOpen] = React.useState(false);
  const [selectedGeofenceKeys, setSelectedGeofenceKeys] = React.useState<string[] | null>(null);
  const { hidden, setVisible } = useHiddenUnits(session);

  const query = useQuery({
    queryKey: ["wialon-units", session.sid, session.host],
    queryFn: () => {
      const storedToken =
        session.token ||
        (typeof window !== "undefined"
          ? localStorage.getItem("wialon_token") || undefined
          : undefined);
      return fetchUnits({
        data: {
          host: session.host,
          sid: session.sid,
          token: storedToken,
        },
      });
    },
    refetchInterval: 20000,
  });

  const geofencesQuery = useQuery({
    queryKey: ["wialon-geofences", session.sid, session.host],
    queryFn: () => {
      const storedToken =
        session.token ||
        (typeof window !== "undefined"
          ? localStorage.getItem("wialon_token") || undefined
          : undefined);
      return fetchGeofences({
        data: {
          host: session.host,
          sid: session.sid,
          token: storedToken,
        },
      });
    },
    refetchInterval: 60000,
  });

  React.useEffect(() => {
    const refreshed =
      (query.data as any)?.refreshedSid ||
      (geofencesQuery.data as any)?.refreshedSid;
    if (refreshed && refreshed !== session.sid) {
      writeSession({
        ...session,
        sid: refreshed,
      });
    }
  }, [query.data, geofencesQuery.data, session]);

  const units = query.data?.units ?? [];
  const geofences = geofencesQuery.data?.zones ?? [];
  const keyForGeofence = (fence: { resourceId: number; id: number }) =>
    `${fence.resourceId}:${fence.id}`;
  const selectedKeys = selectedGeofenceKeys ?? geofences.map(keyForGeofence);
  const activeGeofences = geofences.filter((f) => selectedKeys.includes(keyForGeofence(f)));
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
        fallback={<div className="h-[480px] rounded-lg border border-border/60 bg-card/40" />}
      >
        <React.Suspense
          fallback={<div className="h-[480px] rounded-lg border border-border/60 bg-card/40" />}
        >
          <WialonMap units={visibleUnits} geofences={activeGeofences} focusId={focusId} />
        </React.Suspense>
      </ClientOnly>

      <div className="rounded-lg border border-border/60 p-4">
        <div className="rounded-lg border border-border/60 bg-card/40 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPinned className="size-4 text-primary" />
              <h2 className="font-display text-sm font-bold uppercase tracking-widest">
                Geocercas
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              {activeGeofences.length}/{geofences.length} activas
            </span>
          </div>
          <div className="relative mt-3">
            <button
              type="button"
              onClick={() => setGeofenceMenuOpen((open) => !open)}
              className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm hover:border-primary"
              aria-expanded={geofenceMenuOpen}
            >
              <span>
                {geofences.length === 0
                  ? "No hay geocercas"
                  : activeGeofences.length === geofences.length
                    ? "Todas las geocercas"
                    : activeGeofences.length === 0
                      ? "Ninguna geocerca"
                      : `${activeGeofences.length} geocercas seleccionadas`}
              </span>
              <ChevronDown
                className={`size-4 transition-transform ${geofenceMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
            {geofenceMenuOpen && geofences.length > 0 ? (
              <div className="absolute inset-x-0 top-full z-[1100] mt-1 max-h-64 overflow-auto rounded-md border border-border bg-background p-2 shadow-xl">
                <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-muted">
                  <Checkbox
                    checked={
                      activeGeofences.length === geofences.length
                        ? true
                        : activeGeofences.length > 0
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={(checked) =>
                      setSelectedGeofenceKeys(checked === true ? geofences.map(keyForGeofence) : [])
                    }
                    aria-label="Activar todas las geocercas"
                  />
                  Todas
                </label>
                <div className="my-1 border-t border-border/60" />
                {geofences.map((fence) => (
                  <label
                    key={`${fence.resourceId}-${fence.id}`}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm hover:bg-muted"
                  >
                    <Checkbox
                      checked={selectedKeys.includes(keyForGeofence(fence))}
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
                      style={{ backgroundColor: fence.color }}
                    />
                    <span className="min-w-0 flex-1 truncate">{fence.name}</span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
          {geofencesQuery.isError ? (
            <p className="mt-2 text-xs text-destructive">
              {geofencesQuery.error instanceof Error
                ? geofencesQuery.error.message
                : "No se pudieron cargar las geocercas."}
            </p>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest">
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
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar unidad, IMEI o usuario…"
            aria-label="Buscar unidades"
            className="pl-9"
          />
        </div>
        {query.isError ? (
          <div className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-foreground space-y-2.5">
            <div className="flex items-center gap-2 text-destructive font-bold uppercase tracking-wider">
              <span>Sesión de Wialon no sincronizada</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {query.error instanceof Error
                ? query.error.message
                : "La sesión satelital expiró o necesita reactivarse para descargar tus unidades."}
            </p>
            <button
              type="button"
              onClick={() => {
                writeSession(null);
                window.location.href = "/wialon";
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 px-3 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground shadow hover:opacity-90 transition-opacity"
            >
              <span>Reconectar / Iniciar Sesión de Nuevo</span>
            </button>
          </div>
        ) : null}
        <ul className="mt-3 max-h-[380px] space-y-2 overflow-auto pr-1 text-sm">
          {filtered.map((unit) => {
            const isVisible = !hidden.has(unit.id);
            return (
              <li
                key={unit.id}
                className={`flex items-start gap-3 rounded-md border px-3 py-2 ${
                  focusId === unit.id ? "border-primary" : "border-border/60"
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
                    <span className="truncate font-semibold">{unit.name}</span>
                    <span
                      className={`shrink-0 text-xs uppercase ${unit.online ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {unit.online ? "En línea" : "Sin señal"}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {unit.imei ? `IMEI ${unit.imei}` : `#${unit.id}`}
                    {unit.creatorName ? ` · ${unit.creatorName}` : ""}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {unit.speed != null ? `${Math.round(unit.speed)} km/h · ` : ""}
                    {unit.lastMessage
                      ? new Date(unit.lastMessage * 1000).toLocaleString("es-MX")
                      : "sin mensajes"}
                  </span>
                </button>
              </li>
            );
          })}
          {!query.isLoading && filtered.length === 0 ? (
            <li className="py-2">
              {units.length === 0 ? (
                <div className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-destructive font-bold text-xs uppercase tracking-wider">
                    <span>Sin unidades conectadas</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    La sesión actual no tiene unidades vinculadas o los permisos de Wialon no se sincronizaron. Pulsa el botón para renovar tu acceso.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      writeSession(null);
                      localStorage.removeItem("wialon_session");
                      localStorage.removeItem("wialon_token");
                      sessionStorage.clear();
                      window.location.href = "/wialon";
                    }}
                    className="w-full rounded-lg bg-primary py-2.5 px-3 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground shadow hover:opacity-90 transition-opacity"
                  >
                    Cerrar Sesión y Entrar de Nuevo
                  </button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Ninguna unidad coincide con la búsqueda.</p>
              )}
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
