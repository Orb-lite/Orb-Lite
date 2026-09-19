import * as React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapUnit = {
  id: number;
  name: string;
  lat: number | null;
  lon: number | null;
  speed: number | null;
  course?: number | null;
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

type MarkerStyle = "vehicle" | "dot";

function unitMarkerHtml(unit: MapUnit, focused: boolean, markerStyle: MarkerStyle) {
  const color = unit.online ? "#a3e635" : "#94a3b8";
  const label = escapeHtml(unit.name);
  const rotation = Number.isFinite(unit.course) ? unit.course : 0;
  const vehicle = markerStyle === "vehicle";

  return `<div style="position:relative;display:grid;place-items:center;transform:translate(-50%,-50%);width:1px;height:1px">
    <span style="position:absolute;bottom:${vehicle ? 22 : 14}px;left:50%;transform:translateX(-50%);width:max-content;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:1px solid ${color};border-radius:999px;background:#0f172a;padding:4px 8px;color:#f8fafc;font:600 12px/1.2 system-ui,sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.35)">${label}</span>
    <span style="position:relative;display:grid;place-items:center;width:${focused ? (vehicle ? 34 : 22) : vehicle ? 30 : 18}px;height:${focused ? (vehicle ? 34 : 22) : vehicle ? 30 : 18}px;border:2px solid #0f172a;border-radius:999px;background:${color};box-shadow:0 0 0 ${focused ? 4 : 3}px rgba(15,23,42,.9),0 2px 7px rgba(15,23,42,.45)">
      ${vehicle ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="transform:rotate(${rotation}deg)"><path d="M5 11l1.3-4.1A2 2 0 0 1 8.2 5.5h7.6a2 2 0 0 1 1.9 1.4L19 11v6.5a1 1 0 0 1-1 1h-1.2a1 1 0 0 1-1-1v-1H8.2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V11Z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 11h14M8 13.5h.01M16 13.5h.01" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>` : ""}
      ${vehicle ? "" : `<b style="position:absolute;left:50%;top:calc(100% - 1px);transform:translateX(-50%);width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:10px solid ${color}"></b>`}
    </span>
  </div>`;
}

export default function WialonMap({ units, track, focusId }: Props) {
  const container = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<L.Map | null>(null);
  const layer = React.useRef<L.LayerGroup | null>(null);
  const [markerStyle, setMarkerStyle] = React.useState<MarkerStyle>("vehicle");

  React.useEffect(() => {
    if (!container.current || map.current) return;
    map.current = L.map(container.current, { center: [20.6736, -103.344], zoom: 11 });
    const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    });
    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles &copy; Esri", maxZoom: 19 },
    );
    const dark = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      maxZoom: 20,
    });
    streets.addTo(map.current);
    L.control.layers({ Calles: streets, Satélite: satellite, Oscuro: dark }, undefined, { position: "topright" }).addTo(map.current);
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
      const label = escapeHtml(unit.name);
      const marker = L.marker([unit.lat, unit.lon], {
        icon: L.divIcon({
          className: "",
          iconSize: [0, 0],
          iconAnchor: [0, 0],
          html: unitMarkerHtml(unit, focusId === unit.id, markerStyle),
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
      L.polyline(line, { color: "#a3e635", weight: 3, opacity: 0.9 }).addTo(group);
      bounds.push(...line);
    }

    if (bounds.length > 0) {
      m.fitBounds(L.latLngBounds(bounds).pad(0.2), { maxZoom: 15 });
    }
  }, [units, track, focusId, markerStyle]);

  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-lg border border-border/60">
      <div ref={container} className="h-full w-full" />
      <div className="absolute right-3 top-3 z-[1000] flex items-center gap-2 rounded-lg border border-border/80 bg-background/90 p-1.5 text-xs font-semibold shadow-md backdrop-blur-sm">
        <span className="px-2 text-muted-foreground">Vista</span>
        <button
          type="button"
          onClick={() => setMarkerStyle("vehicle")}
          className={`rounded-md px-3 py-1.5 transition-colors ${markerStyle === "vehicle" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
        >
          Carritos
        </button>
        <button
          type="button"
          onClick={() => setMarkerStyle("dot")}
          className={`rounded-md px-3 py-1.5 transition-colors ${markerStyle === "dot" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
        >
          Puntos
        </button>
      </div>
    </div>
  );
}
