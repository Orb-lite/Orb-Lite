import * as React from "react";
import L from "leaflet";
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DARK_BASE_CONFIG, DARK_LABELS_CONFIG } from "@/lib/map-layers";

type Pt = { lat: number; lon: number };
type Stop = Pt & { label: string; visited: boolean };

function stopIcon(n: string, visited: boolean, next: boolean) {
  const bg = visited ? "#92d700" : next ? "#ffffff" : "#17233d";
  const fg = visited || next ? "#17233d" : "#c9d1dc";
  return L.divIcon({
    className: "",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    html: `<div style="width:26px;height:26px;border-radius:50%;background:${bg};color:${fg};border:2px solid #92d700;display:grid;place-items:center;font:700 12px sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.5)">${n}</div>`,
  });
}

function Fit({ points }: { points: Pt[] }) {
  const map = useMap();
  const key = points.length;
  React.useEffect(() => {
    if (!points.length) return;
    map.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lon])), { padding: [30, 30] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key]);
  return null;
}

export default function SharedRouteMap({
  path,
  stops,
  nextIndex,
  me,
}: {
  path: Pt[];
  stops: Stop[];
  nextIndex: number;
  me: Pt | null;
}) {
  const line = path.length > 1 ? path : stops;
  const center = stops[0] ?? { lat: 20.67, lon: -103.35 };
  return (
    <MapContainer
      center={[center.lat, center.lon]}
      zoom={13}
      className="h-64 w-full rounded-xl"
      scrollWheelZoom={false}
    >
      <TileLayer {...DARK_BASE_CONFIG} />
      <TileLayer url={DARK_LABELS_CONFIG.url} maxZoom={19} maxNativeZoom={16} />
      <Polyline positions={line.map((p) => [p.lat, p.lon])} pathOptions={{ color: "#92d700", weight: 4 }} />
      {stops.map((s, i) => (
        <Marker
          key={i}
          position={[s.lat, s.lon]}
          icon={stopIcon(i === 0 ? "S" : String(i), s.visited, i === nextIndex)}
        />
      ))}
      {me ? (
        <CircleMarker
          center={[me.lat, me.lon]}
          radius={7}
          pathOptions={{ color: "#ffffff", fillColor: "#3b82f6", fillOpacity: 1, weight: 2 }}
        />
      ) : null}
      <Fit points={stops} />
    </MapContainer>
  );
}
