import * as React from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { WialonUnit } from "@/lib/wialon.functions";

type StaticRouteMapProps = {
  unit: Pick<WialonUnit, "id" | "name" | "lat" | "lon" | "course" | "speed" | "online">;
  zoom?: number;
  className?: string;
};

function FollowLastPosition({ position }: { position: L.LatLngExpression }) {
  const map = useMap();

  React.useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [map, position]);

  return null;
}

function vehicleIcon(course: number | null, online: boolean) {
  const color = online ? "#a3e635" : "#94a3b8";
  const rotation = Number.isFinite(course) ? course! : 0;

  return L.divIcon({
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    html: `<span style="display:grid;place-items:center;width:36px;height:36px;border:3px solid #0f172a;border-radius:999px;background:${color};box-shadow:0 0 0 3px rgba(15,23,42,.9),0 2px 7px rgba(15,23,42,.45)"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="transform:rotate(${rotation}deg)"><path d="M5 11l1.3-4.1A2 2 0 0 1 8.2 5.5h7.6a2 2 0 0 1 1.9 1.4L19 11v6.5a1 1 0 0 1-1 1h-1.2a1 1 0 0 1-1-1v-1H8.2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V11Z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 11h14M8 13.5h.01M16 13.5h.01" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></span>`,
  });
}

/** Mapa de última posición para una unidad; el marcador gira según su rumbo (`course`). */
export function StaticRouteMap({ unit, zoom = 16, className }: StaticRouteMapProps) {
  if (unit.lat == null || unit.lon == null) {
    return (
      <div
        className={`grid h-72 place-items-center rounded-xl border border-border/60 bg-muted/30 p-4 text-center text-sm text-muted-foreground ${className ?? ""}`}
      >
        La unidad no tiene una posición GPS disponible.
      </div>
    );
  }

  const position: L.LatLngExpression = [unit.lat, unit.lon];
  const icon = vehicleIcon(unit.course, unit.online);

  return (
    <div
      className={`relative isolate z-0 h-72 overflow-hidden rounded-xl border border-border/60 sm:h-96 ${className ?? ""}`}
    >
      <MapContainer center={position} zoom={zoom} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FollowLastPosition position={position} />
        <Marker position={position} icon={icon}>
          <Popup>
            <strong>{unit.name}</strong>
            <br />
            {unit.online ? "En línea" : "Sin señal"}
            {unit.speed != null ? ` · ${Math.round(unit.speed)} km/h` : ""}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
