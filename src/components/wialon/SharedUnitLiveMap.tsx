import * as React from "react";
import L from "leaflet";
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DARK_BASE_CONFIG, DARK_LABELS_CONFIG } from "@/lib/map-layers";

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
    className: "custom-vehicle-marker",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    html: `
      <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; width:44px; height:44px; border-radius:50%; background:${glow}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; opacity:0.4;"></div>
        <div style="position:relative; width:34px; height:34px; border-radius:50%; background:#090d16; border:2px solid ${color}; display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px ${glow};">
          <svg style="transform: rotate(${course}deg); transition: transform 0.5s ease;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 19 21 12 17 5 21 12 2" fill="${color}" fill-opacity="0.3" />
          </svg>
        </div>
        <div style="position:absolute; bottom:-12px; background:#0f172a; color:#f8fafc; font-size:10px; font-weight:700; padding:1px 5px; border-radius:6px; border:1px solid #334155; white-space:nowrap; box-shadow:0 2px 6px rgba(0,0,0,0.6);">
          ${speed} km/h
        </div>
      </div>
    `,
  });
}

function CenterMap({ lat, lon, zoom = 15 }: { lat: number; lon: number; zoom?: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView([lat, lon], zoom, { animate: true });
  }, [map, lat, lon, zoom]);
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
        <CenterMap lat={position.lat} lon={position.lon} />

        {/* Trail / Recorrido reciente */}
        {trailCoords.length > 1 ? (
          <Polyline
            positions={trailCoords}
            pathOptions={{
              color: "#06b6d4",
              weight: 4,
              opacity: 0.8,
              dashArray: "1, 6",
            }}
          />
        ) : null}

        {/* Marcador del vehículo */}
        <Marker position={[position.lat, position.lon]} icon={vehicleIcon}>
          <Popup className="dark-popup">
            <div className="p-2 text-slate-100 font-sans min-w-[200px]">
              <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5">
                <span className="font-bold text-xs uppercase text-cyan-400">{unitName}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isMoving ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-300"}`}>
                  {isMoving ? "En movimiento" : "Detenido"}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                <strong>Velocidad:</strong> {Math.round(position.speed)} km/h
              </p>
              {position.address ? (
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {position.address}
                </p>
              ) : null}
              <p className="text-[10px] text-slate-500 mt-1">
                Coord: {position.lat.toFixed(5)}, {position.lon.toFixed(5)}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
