import * as React from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { WialonUnit } from "@/lib/wialon.functions";
import { DARK_BASE_CONFIG, DARK_LABELS_CONFIG } from "@/lib/map-layers";

type StaticRouteMapProps = {
  unit: Pick<
    WialonUnit,
    "id" | "name" | "lat" | "lon" | "course" | "speed" | "online"
  >;
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
  const color = online ? "#92d700" : "#04122e";
  const aura = online ? "rgba(146, 215, 0, 0.45)" : "rgba(4, 18, 46, 0.45)";
  const hasCourse = Number.isFinite(course);
  const headingHtml = hasCourse
    ? `<span style="position:absolute;top:50%;left:50%;width:0;height:0;margin-left:-4px;margin-top:-14px;border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:7px solid ${color};transform-origin:4px 14px;transform:rotate(${course}deg);pointer-events:none;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5))"></span>`
    : "";

  return L.divIcon({
    className: "",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `<div style="position:relative;display:grid;place-items:center;transform:translate(-50%,-50%);width:1px;height:1px;cursor:pointer">
      ${headingHtml}
      <span style="position:relative;display:block;width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #ffffff;box-shadow:0 0 0 3px ${aura}, 0 2px 4px rgba(0,0,0,0.45)"></span>
    </div>`,
  });
}

/** Mapa de última posición para una unidad; el marcador gira según su rumbo (`course`). */
export function StaticRouteMap({
  unit,
  zoom = 16,
  className,
}: StaticRouteMapProps) {
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
      className={`relative isolate z-0 h-72 overflow-hidden rounded-xl border border-border/60 bg-[#090d16] sm:h-96 ${className ?? ""}`}
    >
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full"
      >
          <TileLayer
            attribution={DARK_BASE_CONFIG.attribution}
            url={DARK_BASE_CONFIG.url}
            maxZoom={DARK_BASE_CONFIG.maxZoom}
            maxNativeZoom={DARK_BASE_CONFIG.maxNativeZoom}
          />
          <TileLayer
            url={DARK_LABELS_CONFIG.url}
            maxZoom={DARK_LABELS_CONFIG.maxZoom}
            maxNativeZoom={DARK_LABELS_CONFIG.maxNativeZoom}
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
