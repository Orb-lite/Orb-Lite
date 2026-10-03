import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  Navigation,
  MapPin,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Share2,
  RefreshCw,
  ExternalLink,
  Car,
  Compass,
  Gauge,
  Infinity as InfinityIcon,
  Layers,
} from "lucide-react";
import { getPublicUnitTracking } from "@/lib/unit-share.functions";
import orbLiteLogo from "@/assets/orb-lite-logo.png";

const SharedUnitLiveMap = React.lazy(() => import("@/components/wialon/SharedUnitLiveMap"));

export const Route = createFileRoute("/rastreo/$token")({
  head: () => ({
    meta: [
      { title: "Rastreo Satelital en Vivo | ORB-LITE" },
      {
        name: "description",
        content: "Monitoreo satelital temporal en vivo con mapa interactivo y navegación Waze.",
      },
      { property: "og:title", content: "Rastreo Satelital en Vivo | ORB-LITE" },
      {
        property: "og:description",
        content: "Consulta la ubicación en tiempo real de la unidad asignada.",
      },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PublicUnitTrackingPage,
});

function formatRemainingTime(seconds: number): string {
  if (seconds <= 0) return "00h 00m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
  }
  return `${minutes}m ${secs.toString().padStart(2, "0")}s`;
}

function PublicUnitTrackingPage() {
  const { token } = Route.useParams();
  const fetchTracking = useServerFn(getPublicUnitTracking);
  const [copied, setCopied] = React.useState(false);
  const [countdown, setCountdown] = React.useState<number | null>(null);
  const [selectedUnitId, setSelectedUnitId] = React.useState<number | null>(null);

  const query = useQuery({
    queryKey: ["public-unit-tracking", token],
    queryFn: () => fetchTracking({ data: { token } }),
    refetchInterval: 3000, // Refrescar cada 3 segundos en vivo
    staleTime: 1500,
  });

  const data = query.data;

  // Actualizar temporizador cada segundo (solo si no es ilimitado)
  React.useEffect(() => {
    if (!data?.isUnlimited && data?.remainingSeconds !== undefined && data.remainingSeconds > 0) {
      setCountdown(data.remainingSeconds);
    }
  }, [data?.remainingSeconds, data?.isUnlimited]);

  React.useEffect(() => {
    if (data?.isUnlimited || countdown === null || countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown, data?.isUnlimited]);

  // Selección de unidad activa (para multi-unit)
  const unitList = data?.units && data.units.length > 0 ? data.units : [];
  const activeUnit = React.useMemo(() => {
    if (selectedUnitId && unitList.length > 0) {
      const found = unitList.find((u) => u.unitId === selectedUnitId);
      if (found) return found;
    }
    const first = unitList[0];
    if (first) return first;
    return {
      unitId: 1,
      unitName: data?.unitName || "Unidad",
      position: data?.position || {
        lat: 20.6736,
        lon: -103.344,
        speed: 0,
        course: 0,
        time: 0,
        address: "Coordenadas satelitales",
        isMoving: false,
      },
      trail: data?.trail || [],
    };
  }, [unitList, selectedUnitId, data]);

  const activePos = activeUnit.position;
  const lat = activePos.lat ?? 20.6736;
  const lon = activePos.lon ?? -103.344;
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Sigue la ubicación en tiempo real de ${activeUnit.unitName}: ${typeof window !== "undefined" ? window.location.href : ""}`,
  )}`;

  function handleCopy() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  if (query.isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
        <div className="size-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        <p className="mt-4 text-sm font-medium tracking-wide text-slate-400">
          Cargando rastreo en tiempo real...
        </p>
      </div>
    );
  }

  if (query.isError || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
          <ShieldAlert className="size-8" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold uppercase tracking-wider text-slate-100">
          Enlace no disponible
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          {query.error instanceof Error
            ? query.error.message
            : "Este enlace de rastreo no existe, fue cancelado o ha sido revocado por el administrador."}
        </p>
        <a
          href="/"
          className="mt-6 rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-200 transition-colors hover:bg-slate-700"
        >
          Volver a ORB-LITE
        </a>
      </div>
    );
  }

  const isExpired = !data.isUnlimited && (data.isExpired || (countdown !== null && countdown <= 0));
  const isRevoked = data.isRevoked;

  if (isRevoked || isExpired) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <Clock className="size-8" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold uppercase tracking-wider text-slate-100">
          {isRevoked ? "Enlace Cancelado" : "Enlace Expirado"}
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          {isRevoked
            ? "El acceso temporal a esta unidad fue revocado por el supervisor de la cuenta."
            : `El periodo de vigencia para el seguimiento de "${data.unitName}" ha concluido por políticas de seguridad.`}
        </p>
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300 max-w-md text-left">
          <p className="font-semibold text-slate-200">Unidad: {data.unitName}</p>
          {data.clientName ? (
            <p className="mt-1 text-slate-400">Destinatario: {data.clientName}</p>
          ) : null}
          <p className="mt-1 text-slate-400">
            Venció el:{" "}
            {new Date(data.expiresAt).toLocaleString("es-MX", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <p className="mt-6 text-xs text-slate-500">
          Si requieres continuar el seguimiento, solicita un nuevo enlace a tu contacto de ORB-LITE.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-4 py-3 sm:px-6 sticky top-0 z-40">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={orbLiteLogo} alt="ORB-LITE" className="h-9 w-auto" />
            <div className="border-l border-slate-700 pl-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Rastreo en Vivo
                </span>
                <span className="hidden sm:inline-block rounded bg-slate-800/90 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-700">
                  {data.lastPingAgoSeconds < 5
                    ? "Transmisión en directo"
                    : `Último ping: hace ${data.lastPingAgoSeconds}s`}
                </span>
              </div>
              <h1 className="text-sm font-semibold tracking-tight text-slate-200 truncate max-w-[200px] sm:max-w-md">
                {data.unitName}
              </h1>
            </div>
          </div>

          {/* Vigencia / Countdown timer pill */}
          {data.isUnlimited ? (
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3.5 py-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300/80">
                  Vigencia
                </p>
                <p className="font-display text-xs font-bold text-emerald-300 flex items-center gap-1 justify-end">
                  <InfinityIcon className="size-3.5" />
                  <span>Sin límite de tiempo</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Clock className="size-4 text-cyan-400 shrink-0" />
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300/80">
                  Vigencia Restante
                </p>
                <p className="font-mono text-xs font-bold text-cyan-300">
                  {countdown !== null ? formatRemainingTime(countdown) : "--:--"}
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl w-full flex-1 p-4 sm:p-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Map Panel */}
        <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4 backdrop-blur-sm min-h-[420px] lg:min-h-[580px]">
          {/* Multi-unit selector tab bar */}
          {unitList.length > 1 ? (
            <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800/80">
              <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
                <Layers className="size-3.5 text-cyan-400" />
                <span>Flota:</span>
              </div>
              {unitList.map((u) => {
                const isSelected = u.unitId === activeUnit.unitId;
                return (
                  <button
                    key={u.unitId}
                    type="button"
                    onClick={() => setSelectedUnitId(u.unitId)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm"
                        : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/60"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        u.position.isMoving ? "bg-emerald-400 animate-pulse" : "bg-cyan-400"
                      }`}
                    />
                    <span>{u.unitName}</span>
                    <span className="font-mono text-[10px] opacity-75">
                      {Math.round(u.position.speed)} km/h
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3 mb-3 px-1">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Ubicación Satelital:{" "}
                <strong className="text-cyan-400">{activeUnit.unitName}</strong>
              </span>
            </div>
            <button
              onClick={() => query.refetch()}
              disabled={query.isFetching}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
              title="Actualizar posición ahora"
            >
              <RefreshCw
                className={`size-3.5 ${query.isFetching ? "animate-spin text-cyan-400" : ""}`}
              />
              <span className="hidden sm:inline">Refrescar</span>
            </button>
          </div>

          <div className="flex-1 w-full relative min-h-[380px]">
            <React.Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-950/60">
                  <div className="size-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                </div>
              }
            >
              <SharedUnitLiveMap
                unitName={activeUnit.unitName}
                position={activeUnit.position}
                trail={activeUnit.trail}
                units={unitList.length > 1 ? unitList : undefined}
                selectedUnitId={activeUnit.unitId}
                onSelectUnit={(id) => setSelectedUnitId(id)}
              />
            </React.Suspense>
          </div>

          {/* Quick Action Navigation Buttons for Active Unit */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <a
              href={wazeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs py-3 px-3 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-98"
            >
              <Navigation className="size-4 shrink-0" />
              <span>Navegar en Waze ({activeUnit.unitName})</span>
            </a>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-3 px-3 transition-all active:scale-98"
            >
              <ExternalLink className="size-4 shrink-0 text-emerald-400" />
              <span>Google Maps</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-xs py-3 px-3 transition-all active:scale-98"
            >
              <Share2 className="size-4 shrink-0" />
              <span>Compartir</span>
            </a>
          </div>
        </section>

        {/* Info & Telemetry Sidebar */}
        <aside className="space-y-4">
          {/* Unit Status Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {unitList.length > 1 ? "Unidad Seleccionada" : "Vehículo Monitoreado"}
                </p>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                  <Car className="size-5 text-cyan-400" />
                  {activeUnit.unitName}
                </h2>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${
                  activePos.isMoving
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}
              >
                {activePos.isMoving ? "En movimiento" : "Detenido"}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Gauge className="size-4 text-cyan-400" />
                  <span>Velocidad</span>
                </div>
                <p className="mt-1 font-mono text-xl font-bold text-slate-100">
                  {Math.round(activePos.speed)}{" "}
                  <span className="text-xs font-normal text-slate-400">km/h</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Compass className="size-4 text-cyan-400" />
                  <span>Rumbo</span>
                </div>
                <p className="mt-1 font-mono text-xl font-bold text-slate-100">
                  {activePos.course}°
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="size-3.5 text-cyan-400" />
                Ubicación Detectada
              </p>
              <p className="mt-1 text-xs font-medium text-slate-200 leading-relaxed">
                {activePos.address || "Coordenadas satelitales en tiempo real"}
              </p>
              <p className="mt-2 text-[10px] text-slate-500 font-mono">
                Lat: {activePos.lat.toFixed(6)}, Lon: {activePos.lon.toFixed(6)}
              </p>
            </div>

            {/* Extra Info: Client & Notes */}
            {data.clientName || data.notes ? (
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                {data.clientName ? (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Asignado para:
                    </p>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">{data.clientName}</p>
                  </div>
                ) : null}
                {data.notes ? (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Instrucción / Motivo:
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5 italic">{data.notes}</p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Multi-unit Fleet Card (if > 1) */}
          {unitList.length > 1 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-3">
                <Layers className="size-4" />
                <span>Flota Compartida ({unitList.length} Unidades)</span>
              </p>
              <div className="space-y-2">
                {unitList.map((u) => {
                  const isSelected = u.unitId === activeUnit.unitId;
                  return (
                    <button
                      key={u.unitId}
                      type="button"
                      onClick={() => setSelectedUnitId(u.unitId)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-cyan-500/60 bg-cyan-950/40 text-cyan-200"
                          : "border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-xs truncate">{u.unitName}</p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {u.position.address || "En ruta"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                            u.position.isMoving
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {Math.round(u.position.speed)} km/h
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Security Notice Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-semibold text-slate-300 mb-1.5">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>
                {data.isUnlimited ? "Enlace Seguro Permanente" : "Enlace Seguro y Privado"}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {data.isUnlimited
                ? "Este enlace no tiene límite de vigencia y transmite la telemetría satelital continua de la flota autorizada."
                : "Este enlace expira automáticamente por seguridad. La ubicación se actualiza en vivo mediante telemetría satelital directa."}
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] text-slate-500">
              <span>
                {data.isUnlimited
                  ? "Vigencia: Sin límite"
                  : `Expira: ${new Date(data.expiresAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`}
              </span>
              <button onClick={handleCopy} className="text-cyan-400 hover:underline font-semibold">
                {copied ? "¡Enlace Copiado!" : "Copiar Enlace"}
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500 mt-auto">
        <p>ORB-LITE · Monitoreo Satelital GPS · Enlace de Seguimiento en Vivo</p>
      </footer>
    </div>
  );
}
