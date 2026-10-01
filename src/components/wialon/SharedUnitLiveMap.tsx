import * as React from "react";
import L from "leaflet";
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DARK_BASE_CONFIG, DARK_LABELS_CONFIG } from "@/lib/map-layers";
import { Navigation2, Crosshair } from "lucide-react";

type Position = {
  lat: number;
  lon: number;
  speed: number;
  course: number;
  time: number;
  address?: string;
  isMoving?: boolean;
};

type TrailPoint = {
  lat: number;
  lon: number;
  time: number;
  speed?: number;
};

function createVehicleIcon(course: number, isMoving: boolean, speed: number) {
  const color = isMoving ? "#10b981" : "#06b6d4";
  const glow = isMoving ? "rgba(16, 185, 129, 0.6)" : "rgba(6, 182, 212, 0.5)";

  return L.divIcon({
    className: "custom-live-vehicle-marker",
    iconSize: [46, 46],
    iconAnchor: [23, 23],
    html: `
      <div style="position:relative; width:46px; height:46px; display:flex; align-items:center; justify-content:center; transition: all 0.8s cubic-bezier(0.2, 0, 0, 1);">
        <!-- Pulso de radar en vivo -->
        <div style="position:absolute; width:46px; height:46px; border-radius:50%; background:${glow}; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; opacity:0.35;"></div>
        
        <!-- Aro exterior con brújula -->
        <div style="position:relative; width:36px; height:36px; border-radius:50%; background:#090d16; border:2.5px solid ${color}; display:flex; align-items:center; justify-content:center; box-shadow:0 0 18px ${glow};">
          <svg style="transform: rotate(${course}deg); transition: transform 0.6s ease;" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 19 21 12 17 5 21 12 2" fill="${color}" fill-opacity="0.35" />
          </svg>
        </div>

        <!-- Etiqueta de velocidad flotante -->
        <div style="position:absolute; bottom:-13px; background:#0f172a; color:#f8fafc; font-size:10px; font-weight:800; font-family:monospace; padding:1px 6px; border-radius:6px; border:1px solid #334155; white-space:nowrap; box-shadow:0 2px 6px rgba(0,0,0,0.7); letter-spacing:0.02em;">
          ${speed} km/h
        </div>
      </div>
    `,
  });
}

function SmoothCenter({
  lat,
  lon,
  autoFollow,
}: {
  lat: number;
  lon: number;
  autoFollow: boolean;
}) {
  const map = useMap();
  React.useEffect(() => {
    if (autoFollow) {
      map.panTo([lat, lon], { animate: true, duration: 1 });
    }
  }, [map, lat, lon, autoFollow]);
  return null;
}

export default function SharedUnitLiveMap({
  unitName,
  position,
  trail,
}: {
  unitName: string;
  position: Position;
  trail: TrailPoint[];
}) {
  const [autoFollow, setAutoFollow] = React.useState(true);
  const isMoving = Boolean(position.speed && position.speed > 3);

  const vehicleIcon = React.useMemo(
    () => createVehicleIcon(position.course, isMoving, Math.round(position.speed)),
    [position.course, isMoving, position.speed],
  );

  const trailCoords = React.useMemo(
    () => trail.map((p) => [p.lat, p.lon] as [number, number]),
    [trail],
  );

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
      <MapContainer
        center={[position.lat, position.lon]}
        zoom={15}
        className="h-full min-h-[380px] w-full"
        scrollWheelZoom={true}
      >
        <TileLayer {...DARK_BASE_CONFIG} />
        <TileLayer url={DARK_LABELS_CONFIG.url} maxZoom={19} maxNativeZoom={16} />
        <SmoothCenter lat={position.lat} lon={position.lon} autoFollow={autoFollow} />

        {/* Trail / Recorrido con gradiente visual */}
        {trailCoords.length > 1 ? (
          <Polyline
            positions={trailCoords}
            pathOptions={{
              color: "#06b6d4",
              weight: 4,
              opacity: 0.85,
              dashArray: "2, 8",
            }}
          />
        ) : null}

        {/* Marcador del vehículo */}
        <Marker position={[position.lat, position.lon]} icon={vehicleIcon}>
          <Popup className="dark-popup">
            <div className="p-2 text-slate-100 font-sans min-w-[210px]">
              <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5">
                <span className="font-bold text-xs uppercase text-cyan-400">{unitName}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isMoving
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {isMoving ? "En movimiento" : "Detenido"}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                <strong>Velocidad:</strong> {Math.round(position.speed)} km/h
              </p>
              <p className="text-xs text-slate-300">
                <strong>Rumbo:</strong> {position.course}°
              </p>
              {position.address ? (
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {position.address}
                </p>
              ) : null}
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                {position.lat.toFixed(5)}, {position.lon.toFixed(5)}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Control flotante: Auto-seguir / Centrar en vehículo */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setAutoFollow((prev) => !prev)}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-lg transition-all ${
            autoFollow
              ? "border-emerald-500/50 bg-emerald-950/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              : "border-slate-700 bg-slate-900/80 text-slate-400 hover:text-slate-200"
          }`}
          title={autoFollow ? "Seguimiento automático activado" : "Hacer clic para activar auto-seguimiento"}
        >
          <Crosshair className={`size-3.5 ${autoFollow ? "text-emerald-400 animate-spin" : ""}`} />
          <span>{autoFollow ? "Siguiendo Unidad" : "Centrar Unidad"}</span>
        </button>
      </div>

      {/* Indicador de transmisión satelital en vivo */}
      <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-1.5 backdrop-blur-md shadow-md">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
          Transmisión Satelital en Vivo
        </span>
      </div>
    </div>
  );
}
