import * as React from "react";
import L from "leaflet";
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
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

function createVehicleIcon(course = 0, speed = 0) {
  const isMoving = speed > 2;
  const color = isMoving ? "#10b981" : "#06b6d4";
  return L.divIcon({
    className: "route-live-vehicle-marker",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    html: `
      <div style="position:relative; width:38px; height:38px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; width:38px; height:38px; border-radius:50%; background:${color}33; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position:relative; width:28px; height:28px; border-radius:50%; background:#090d16; border:2px solid ${color}; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px ${color};">
          <svg style="transform: rotate(${course}deg); transition: transform 0.5s ease;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 19 21 12 17 5 21 12 2" fill="${color}" fill-opacity="0.4" />
          </svg>
        </div>
        <div style="position:absolute; bottom:-10px; background:#0f172a; color:#fff; font-size:9px; font-weight:800; font-family:monospace; padding:0 4px; border-radius:4px; border:1px solid #334155; white-space:nowrap;">
          ${Math.round(speed)} km/h
        </div>
      </div>
    `,
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
  liveVehicle,
}: {
  path: Pt[];
  stops: Stop[];
  nextIndex: number;
  me: Pt | null;
  liveVehicle?: { lat: number; lon: number; speed?: number; course?: number; unitName?: string } | null;
}) {
  const line = path.length > 1 ? path : stops;
  const center = liveVehicle ? [liveVehicle.lat, liveVehicle.lon] : stops[0] ? [stops[0].lat, stops[0].lon] : [20.67, -103.35];

  const vehicleIcon = React.useMemo(() => {
    if (!liveVehicle) return null;
    return createVehicleIcon(liveVehicle.course ?? 0, liveVehicle.speed ?? 0);
  }, [liveVehicle?.course, liveVehicle?.speed]);

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={13}
      className="h-72 w-full rounded-xl"
      scrollWheelZoom={false}
    >
      <TileLayer {...DARK_BASE_CONFIG} />
      <TileLayer url={DARK_LABELS_CONFIG.url} maxZoom={19} maxNativeZoom={16} />
      <Polyline
        positions={line.map((p) => [p.lat, p.lon] as [number, number])}
        pathOptions={{ color: "#92d700", weight: 4 }}
      />
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

      {/* Live Vehicle on Shared Route */}
      {liveVehicle && vehicleIcon ? (
        <Marker position={[liveVehicle.lat, liveVehicle.lon]} icon={vehicleIcon}>
          <Popup className="dark-popup">
            <div className="p-1 text-slate-100 font-sans text-xs">
              <p className="font-bold text-cyan-400">{liveVehicle.unitName || "Unidad en Vivo"}</p>
              <p className="text-slate-300 mt-0.5">
                Velocidad: {Math.round(liveVehicle.speed ?? 0)} km/h
              </p>
            </div>
          </Popup>
        </Marker>
      ) : null}

      <Fit points={liveVehicle ? [...stops, { lat: liveVehicle.lat, lon: liveVehicle.lon }] : stops} />
    </MapContainer>
  );
}
