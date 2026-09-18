import * as React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapUnit = {
  id: number;
  name: string;
  lat: number | null;
  lon: number | null;
  speed: number | null;
  online: boolean;
};

type Props = {
  units: MapUnit[];
  track?: Array<{ lat: number; lon: number }>;
  focusId?: number | null;
};

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  };
  return value.replace(/[&<>'"]/g, (char) => entities[char] ?? char);
}

export default function WialonMap({ units, track, focusId }: Props) {
  const container = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<L.Map | null>(null);
  const layer = React.useRef<L.LayerGroup | null>(null);

  React.useEffect(() => {
    if (!container.current || map.current) return;
    map.current = L.map(container.current, { center: [20.6736, -103.344], zoom: 11 });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19,
    }).addTo(map.current);
    layer.current = L.layerGroup().addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
      layer.current = null;
    };
  }, []);

  React.useEffect(() => {
    const m = map.current;
    const group = layer.current;
    if (!m || !group) return;
    group.clearLayers();

    const bounds: L.LatLngExpression[] = [];

    for (const unit of units) {
      if (unit.lat == null || unit.lon == null) continue;
      const color = unit.online ? "#a3e635" : "#94a3b8";
      const label = escapeHtml(unit.name);
      const marker = L.marker([unit.lat, unit.lon], {
        icon: L.divIcon({
          className: "",
          iconSize: [0, 0],
          iconAnchor: [0, 0],
          html: `<span style="display:flex;align-items:center;gap:6px;transform:translate(-50%,-120%);width:max-content;border:1px solid ${color};border-radius:999px;background:#0f172a;padding:4px 8px;color:#f8fafc;font:600 12px/1.2 system-ui,sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.35)"><i style="display:block;width:${focusId === unit.id ? 10 : 8}px;height:${focusId === unit.id ? 10 : 8}px;border-radius:999px;background:${color};box-shadow:0 0 0 2px rgba(255,255,255,.3)"></i>${label}</span>`,
        }),
      });
      marker.bindTooltip(
        `<strong>${label}</strong><br/>${unit.online ? "En línea" : "Sin señal reciente"}` +
          (unit.speed != null ? `<br/>${Math.round(unit.speed)} km/h` : ""),
      );
      marker.addTo(group);
      bounds.push([unit.lat, unit.lon]);
    }

    if (track && track.length > 1) {
      const line = track.map((p) => [p.lat, p.lon] as L.LatLngExpression);
      L.polyline(line, { color: "#22d3ee", weight: 3, opacity: 0.9 }).addTo(group);
      bounds.push(...line);
    }

    if (bounds.length > 0) {
      m.fitBounds(L.latLngBounds(bounds).pad(0.2), { maxZoom: 15 });
    }
  }, [units, track, focusId]);

  return <div ref={container} className="h-[480px] w-full rounded-lg border border-border/60" />;
}
