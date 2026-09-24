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

export type MapGeofence = {
  id: number;
  name: string;
  resource?: string;
  type: 1 | 2 | 3;
  color: string;
  points: Array<{ lat: number; lon: number; radius: number }>;
};

export type DrawingMode = "circle" | "polygon" | "line";
export type DrawingPoint = { lat: number; lon: number; radius: number };
export type MapAddressPoint = {
  lat: number;
  lon: number;
  label: string;
  order: string;
  isOrigin?: boolean;
};

type Props = {
  units: MapUnit[];
  track?: Array<{ lat: number; lon: number }>;
  focusId?: number | null;
  geofences?: MapGeofence[];
  addressPoints?: MapAddressPoint[];
  drawMode?: DrawingMode | null;
  drawingResetKey?: number;
  onDraftChange?: (draft: { type: DrawingMode; points: DrawingPoint[] } | null) => void;
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

function bearing(from: { lat: number; lon: number }, to: { lat: number; lon: number }) {
  const rad = Math.PI / 180;
  const dLon = (to.lon - from.lon) * rad;
  const y = Math.sin(dLon) * Math.cos(to.lat * rad);
  const x =
    Math.cos(from.lat * rad) * Math.sin(to.lat * rad) -
    Math.sin(from.lat * rad) * Math.cos(to.lat * rad) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function unitMarkerHtml(unit: MapUnit, focused: boolean, markerStyle: MarkerStyle) {
  const color = unit.online ? "#a3e635" : "#94a3b8";
  const label = escapeHtml(unit.name);
  // La imagen base apunta hacia la izquierda; se corrige 90° para que 0° sea norte.
  const rotation = (Number.isFinite(unit.course) ? unit.course! : 0) + 90;
  const vehicle = markerStyle === "vehicle";

  return `<div style="position:relative;display:grid;place-items:center;transform:translate(-50%,-50%);width:1px;height:1px">
    <span style="position:absolute;bottom:${vehicle ? 24 : 14}px;left:50%;transform:translateX(-50%);width:max-content;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:1px solid ${color};border-radius:999px;background:#0f172a;padding:4px 8px;color:#f8fafc;font:600 12px/1.2 system-ui,sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.35)">${label}</span>
    ${vehicle ? `<span style="display:block;width:${focused ? 44 : 40}px;height:${focused ? 31 : 28}px;background:${color};-webkit-mask:url('/images/wialon-car.webp') center/contain no-repeat;mask:url('/images/wialon-car.webp') center/contain no-repeat;filter:drop-shadow(0 0 0 #0f172a) drop-shadow(0 0 3px #0f172a);transform:rotate(${rotation}deg);transform-origin:center"></span>` : `<span style="position:relative;display:grid;place-items:center;width:${focused ? 22 : 18}px;height:${focused ? 22 : 18}px;border:2px solid #0f172a;border-radius:999px;background:${color};box-shadow:0 0 0 ${focused ? 4 : 3}px rgba(15,23,42,.9),0 2px 7px rgba(15,23,42,.45)"><b style="position:absolute;left:50%;top:calc(100% - 1px);transform:translateX(-50%);width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:10px solid ${color}"></b></span>`}
  </div>`;
}

function addressMarkerHtml(point: MapAddressPoint) {
  const color = point.isOrigin ? "#38bdf8" : "#f59e0b";
  return `<div style="display:grid;place-items:center;transform:translate(-50%,-50%);width:26px;height:26px;border:2px solid #0f172a;border-radius:999px;background:${color};box-shadow:0 2px 7px rgba(15,23,42,.45);color:#0f172a;font:800 12px/1 system-ui,sans-serif">${escapeHtml(point.order)}</div>`;
}

export default function WialonMap({
  units,
  track,
  focusId,
  geofences = [],
  addressPoints = [],
  drawMode = null,
  drawingResetKey = 0,
  onDraftChange,
}: Props) {
  const container = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<L.Map | null>(null);
  const layer = React.useRef<L.LayerGroup | null>(null);
  const geofenceLayer = React.useRef<L.LayerGroup | null>(null);
  const addressLayer = React.useRef<L.LayerGroup | null>(null);
  const draftLayer = React.useRef<L.LayerGroup | null>(null);
  const draftPoints = React.useRef<DrawingPoint[]>([]);
  const [draftVersion, setDraftVersion] = React.useState(0);
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
    L.control
      .layers({ Calles: streets, Satélite: satellite, Oscuro: dark }, undefined, {
        position: "topright",
      })
      .addTo(map.current);
    layer.current = L.layerGroup().addTo(map.current);
    geofenceLayer.current = L.layerGroup().addTo(map.current);
    addressLayer.current = L.layerGroup().addTo(map.current);
    draftLayer.current = L.layerGroup().addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
      layer.current = null;
      geofenceLayer.current = null;
      addressLayer.current = null;
      draftLayer.current = null;
    };
  }, []);

  React.useEffect(() => {
    draftPoints.current = [];
    draftLayer.current?.clearLayers();
    onDraftChange?.(drawMode ? { type: drawMode, points: [] } : null);
  }, [drawMode, drawingResetKey, onDraftChange]);

  React.useEffect(() => {
    const m = map.current;
    if (!m) return;

    const onClick = (event: L.LeafletMouseEvent) => {
      if (!drawMode) return;
      const point = { lat: event.latlng.lat, lon: event.latlng.lng, radius: 0 };
      if (drawMode === "circle") {
        if (draftPoints.current.length === 0) {
          draftPoints.current = [point];
        } else {
          const center = draftPoints.current[0]!;
          const radius = m.distance([center.lat, center.lon], [point.lat, point.lon]);
          draftPoints.current = [{ ...center, radius: Math.max(1, Math.round(radius)) }];
        }
      } else {
        draftPoints.current = [...draftPoints.current, point];
      }
      setDraftVersion((version) => version + 1);
      onDraftChange?.({ type: drawMode, points: [...draftPoints.current] });
    };

    m.on("click", onClick);
    return () => {
      m.off("click", onClick);
    };
  }, [drawMode, onDraftChange]);

  React.useEffect(() => {
    const group = draftLayer.current;
    if (!group) return;
    group.clearLayers();
    const points = draftPoints.current;
    if (points.length === 0) return;
    const latLngs = points.map((point) => [point.lat, point.lon] as L.LatLngExpression);
    if (drawMode === "circle") {
      const center = points[0]!;
      L.circle([center.lat, center.lon], {
        radius: center.radius || 40,
        color: "#f59e0b",
        fillColor: "#f59e0b",
        fillOpacity: 0.18,
        dashArray: "6 5",
      }).addTo(group);
    } else if (drawMode === "line") {
      L.polyline(latLngs, {
        color: "#f59e0b",
        weight: 4,
        opacity: 0.85,
        dashArray: "8 6",
      }).addTo(group);
      for (const point of points) {
        L.circleMarker([point.lat, point.lon], {
          radius: 5,
          color: "#fff",
          weight: 2,
          fillColor: "#f59e0b",
          fillOpacity: 1,
        }).addTo(group);
      }
    } else {
      L.polygon(latLngs, {
        color: "#f59e0b",
        fillColor: "#f59e0b",
        fillOpacity: 0.18,
        dashArray: "6 5",
      }).addTo(group);
      for (const point of points) {
        L.circleMarker([point.lat, point.lon], {
          radius: 5,
          color: "#fff",
          weight: 2,
          fillColor: "#f59e0b",
          fillOpacity: 1,
        }).addTo(group);
      }
    }
  }, [drawMode, drawingResetKey, draftVersion]);

  React.useEffect(() => {
    const group = geofenceLayer.current;
    if (!group) return;
    group.clearLayers();
    const bounds: L.LatLngExpression[] = [];

    for (const fence of geofences) {
      if (fence.points.length === 0) continue;
      const color = fence.color || "#38bdf8";
      const positions = fence.points.map((point) => [point.lat, point.lon] as L.LatLngExpression);
      let shape: L.Layer;
      if (fence.type === 3) {
        const center = fence.points[0]!;
        shape = L.circle([center.lat, center.lon], {
          radius: Math.max(center.radius, 1),
          color,
          fillColor: color,
          fillOpacity: 0.2,
          weight: 2,
        });
        bounds.push([center.lat, center.lon]);
      } else if (fence.type === 1) {
        shape = L.polyline(positions, { color, weight: 4, opacity: 0.8 });
        bounds.push(...positions);
      } else {
        shape = L.polygon(positions, {
          color,
          fillColor: color,
          fillOpacity: 0.2,
          weight: 2,
        });
        bounds.push(...positions);
      }
      shape.bindTooltip(
        `<strong>${escapeHtml(fence.name)}</strong>${fence.resource ? `<br/>${escapeHtml(fence.resource)}` : ""}`,
      );
      shape.addTo(group);
    }

    if (bounds.length > 0 && units.length === 0 && !track?.length) {
      map.current?.fitBounds(L.latLngBounds(bounds).pad(0.2), { maxZoom: 15 });
    }
  }, [geofences, units.length, track]);

  React.useEffect(() => {
    const group = addressLayer.current;
    if (!group) return;
    group.clearLayers();
    if (addressPoints.length === 0) return;

    const bounds: L.LatLngExpression[] = [];
    for (const point of addressPoints) {
      const marker = L.marker([point.lat, point.lon], {
        icon: L.divIcon({
          className: "wialon-address-marker",
          html: addressMarkerHtml(point),
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        }),
      });
      marker.bindTooltip(
        `<strong>${escapeHtml(point.order)} · ${escapeHtml(point.label)}</strong>`,
      );
      marker.addTo(group);
      bounds.push([point.lat, point.lon]);
    }

    if (units.length === 0 && !track?.length) {
      map.current?.fitBounds(L.latLngBounds(bounds).pad(0.2), { maxZoom: 16 });
    }
  }, [addressPoints, units.length, track]);

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
      for (const p of track) {
        L.circleMarker([p.lat, p.lon], {
          radius: 3,
          color: "#0f172a",
          weight: 1,
          fillColor: "#a3e635",
          fillOpacity: 1,
        }).addTo(group);
      }
      const last = track[track.length - 1]!;
      const prev = track[track.length - 2]!;
      const lastUnit: MapUnit = {
        id: -1,
        name: "Última posición",
        lat: last.lat,
        lon: last.lon,
        speed: null,
        course: bearing(prev, last),
        online: true,
      };
      const endMarker = L.marker([last.lat, last.lon], {
        icon: L.divIcon({
          className: "",
          iconSize: [0, 0],
          iconAnchor: [0, 0],
          html: unitMarkerHtml(lastUnit, false, markerStyle),
        }),
      });
      endMarker.bindTooltip("<strong>Última posición</strong>");
      endMarker.addTo(group);
      bounds.push(...line);
    }

    if (bounds.length > 0 && geofences.length === 0) {
      m.fitBounds(L.latLngBounds(bounds).pad(0.2), { maxZoom: 15 });
    }
  }, [units, track, focusId, markerStyle, geofences.length]);

  return (
    <div className="relative isolate z-0 h-[480px] w-full overflow-hidden rounded-lg border border-border/60">
      <div ref={container} className="h-full w-full" />
      {drawMode ? (
        <div className="absolute bottom-3 left-3 z-[1000] max-w-[260px] rounded-lg border border-amber-300/60 bg-background/95 px-3 py-2 text-xs shadow-md backdrop-blur-sm">
          <strong className="block text-amber-600">Modo de dibujo activo</strong>
          <span className="text-muted-foreground">
            {drawMode === "circle"
              ? "Haz clic en el centro y después en el borde."
              : drawMode === "line"
                ? "Haz clic para añadir los puntos de la ruta."
                : "Haz clic para añadir los vértices del polígono."}
          </span>
        </div>
      ) : null}
      <div className="absolute left-1/2 top-3 z-[1000] -translate-x-1/2 flex items-center gap-2 rounded-lg border border-border/80 bg-background/90 p-1.5 text-xs font-semibold shadow-md backdrop-blur-sm">
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
