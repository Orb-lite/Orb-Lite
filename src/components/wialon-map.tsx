import * as React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createDarkLeafletTileLayer } from "@/lib/map-layers";
import { smartGeocode } from "@/lib/geocoding";
import { Search, Loader2, X } from "lucide-react";

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
  id: number | string;
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
  focusGeofenceId?: number | string | null;
  addressPoints?: MapAddressPoint[];
  drawMode?: DrawingMode | null;
  drawingResetKey?: number;
  onDraftChange?: (
    draft: { type: DrawingMode; points: DrawingPoint[] } | null,
  ) => void;
};

// Color satelital unificado ORB-LITE: verde lima (#92d700)
export const ORB_THEME = {
  green: "#92d700",
  greenAura: "rgba(146, 215, 0, 0.45)",
  navyBg: "#04122e",
  white: "#ffffff",
} as const;

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

function bearing(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
) {
  const rad = Math.PI / 180;
  const dLon = (to.lon - from.lon) * rad;
  const y = Math.sin(dLon) * Math.cos(to.lat * rad);
  const x =
    Math.cos(from.lat * rad) * Math.sin(to.lat * rad) -
    Math.sin(from.lat * rad) * Math.cos(to.lat * rad) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Dot representativo de unidad (vehículo) en el mapa */
function unitMarkerHtml(unit: MapUnit, focused: boolean, zoom: number) {
  const isOnline = Boolean(unit.online);
  // Activos online: verde lima (#92d700). Offline: azul marino profundo (#04122e).
  const coreColor = isOnline ? ORB_THEME.green : ORB_THEME.navyBg;
  const auraColor = isOnline ? ORB_THEME.greenAura : "rgba(4, 18, 46, 0.45)";
  const labelBorder = isOnline ? ORB_THEME.green : "#334155";
  const label = escapeHtml(unit.name);

  // Tamaño proporcionado al nivel de zoom para que no tape el mapa
  let dotPx = 11;
  let showLabel = true;
  let labelBottom = 13;

  if (zoom <= 9) {
    dotPx = focused ? 11 : 9;
    showLabel = focused;
    labelBottom = 11;
  } else if (zoom <= 12) {
    dotPx = focused ? 12 : 10;
    showLabel = true;
    labelBottom = 13;
  } else if (zoom <= 15) {
    dotPx = focused ? 14 : 12;
    showLabel = true;
    labelBottom = 15;
  } else {
    dotPx = focused ? 16 : 13;
    showLabel = true;
    labelBottom = 17;
  }

  // Indicador de rumbo satelital cuando la unidad tiene movimiento
  const hasCourse =
    Number.isFinite(unit.course) && (unit.speed == null || unit.speed > 2);
  const headingHtml = hasCourse
    ? `<span style="position:absolute;top:50%;left:50%;width:0;height:0;margin-left:-4px;margin-top:-${Math.round(dotPx / 2) + 7}px;border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:7px solid ${coreColor};transform-origin:4px ${Math.round(dotPx / 2) + 7}px;transform:rotate(${unit.course}deg);pointer-events:none;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5))"></span>`
    : "";

  return `<div style="position:relative;display:grid;place-items:center;transform:translate(-50%,-50%);width:1px;height:1px;cursor:pointer">
    ${showLabel ? `<span style="position:absolute;bottom:${labelBottom}px;left:50%;transform:translateX(-50%);width:max-content;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:1px solid ${labelBorder};border-radius:999px;background:#04122e;padding:2px 7px;color:#f8fafc;font:600 11px/1.2 system-ui,sans-serif;box-shadow:0 2px 5px rgba(0,0,0,0.45);pointer-events:none">${label}</span>` : ""}
    ${headingHtml}
    <span style="position:relative;display:block;width:${dotPx}px;height:${dotPx}px;border-radius:50%;background:${coreColor};border:2px solid #ffffff;box-shadow:0 0 0 ${focused ? 4 : 2.5}px ${auraColor}, 0 2px 4px rgba(0,0,0,0.45)"></span>
  </div>`;
}

/** Puntos de llegada de las rutas: con ese mismo dot solo un poco más pequeño (9px) */
function arrivalDotHtml(badge?: string, isSmaller = true) {
  const badgeHtml = badge
    ? `<span style="position:absolute;bottom:${isSmaller ? 12 : 14}px;left:50%;transform:translateX(-50%);width:max-content;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:1px solid ${ORB_THEME.green};border-radius:999px;background:#04122e;padding:1px 6px;color:#f8fafc;font:600 10px/1.2 system-ui,sans-serif;box-shadow:0 2px 4px rgba(0,0,0,0.5);pointer-events:none">${escapeHtml(badge)}</span>`
    : "";

  const size = isSmaller ? 9 : 11;
  const borderWidth = isSmaller ? 1.5 : 2;
  const auraSpread = isSmaller ? 2 : 2.5;

  return `<div style="position:relative;display:grid;place-items:center;transform:translate(-50%,-50%);width:1px;height:1px;cursor:pointer">
    ${badgeHtml}
    <span style="position:relative;display:block;width:${size}px;height:${size}px;border-radius:50%;background:${ORB_THEME.green};border:${borderWidth}px solid #ffffff;box-shadow:0 0 0 ${auraSpread}px ${ORB_THEME.greenAura}, 0 2px 4px rgba(0,0,0,0.45)"></span>
  </div>`;
}

export default function WialonMap({
  units,
  track,
  focusId,
  geofences = [],
  focusGeofenceId = null,
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
  const [zoom, setZoom] = React.useState(11);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState<{
    label: string;
    lat: number;
    lon: number;
  } | null>(null);
  const searchLayer = React.useRef<L.LayerGroup | null>(null);

  React.useEffect(() => {
    if (!container.current || map.current) return;
    map.current = L.map(container.current, {
      center: [20.6736, -103.344],
      zoom: 11,
    });

    // Layout oscuro exclusivo para todos los mapas
    const darkLayer = createDarkLeafletTileLayer();
    darkLayer.addTo(map.current);

    const onZoom = () => {
      if (map.current) {
        setZoom(map.current.getZoom());
      }
    };
    map.current.on("zoomend", onZoom);

    layer.current = L.layerGroup().addTo(map.current);
    geofenceLayer.current = L.layerGroup().addTo(map.current);
    addressLayer.current = L.layerGroup().addTo(map.current);
    draftLayer.current = L.layerGroup().addTo(map.current);
    searchLayer.current = L.layerGroup().addTo(map.current);

    return () => {
      map.current?.off("zoomend", onZoom);
      map.current?.remove();
      map.current = null;
      layer.current = null;
      geofenceLayer.current = null;
      addressLayer.current = null;
      draftLayer.current = null;
      searchLayer.current = null;
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
          const radius = m.distance(
            [center.lat, center.lon],
            [point.lat, point.lon],
          );
          draftPoints.current = [
            { ...center, radius: Math.max(1, Math.round(radius)) },
          ];
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
    const latLngs = points.map(
      (point) => [point.lat, point.lon] as L.LatLngExpression,
    );
    if (drawMode === "circle") {
      const center = points[0]!;
      L.circle([center.lat, center.lon], {
        radius: center.radius || 40,
        color: ORB_THEME.green,
        fillColor: ORB_THEME.green,
        fillOpacity: 0.18,
        dashArray: "6 5",
      }).addTo(group);
    } else if (drawMode === "line") {
      L.polyline(latLngs, {
        color: ORB_THEME.green,
        weight: 3.5,
        opacity: 0.95,
        dashArray: "6 5",
      }).addTo(group);
      for (let i = 0; i < points.length; i++) {
        const point = points[i]!;
        const tag =
          i === 0
            ? "Salida"
            : i === points.length - 1 && points.length > 1
              ? "Llegada"
              : `Parada ${i}`;
        L.marker([point.lat, point.lon], {
          icon: L.divIcon({
            className: "",
            iconSize: [0, 0],
            iconAnchor: [0, 0],
            html: arrivalDotHtml(tag),
          }),
        }).addTo(group);
      }
    } else {
      L.polygon(latLngs, {
        color: ORB_THEME.green,
        fillColor: ORB_THEME.green,
        fillOpacity: 0.18,
        dashArray: "6 5",
      }).addTo(group);
      for (const point of points) {
        L.circleMarker([point.lat, point.lon], {
          radius: 4,
          color: "#fff",
          weight: 1.5,
          fillColor: ORB_THEME.green,
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
      // Color satelital unificado #92d700
      const color = ORB_THEME.green;
      const positions = fence.points.map(
        (point) => [point.lat, point.lon] as L.LatLngExpression,
      );
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
        // Línea de ruta con el color unificado #92d700
        shape = L.polyline(positions, {
          color: ORB_THEME.green,
          weight: 3.5,
          opacity: 0.95,
        });
        bounds.push(...positions);

        // Puntos de la ruta: Salida, paradas intermedias y Llegada (con ese dot un poco más pequeño)
        if (fence.points.length > 0) {
          fence.points.forEach((point, idx) => {
            const isFirst = idx === 0;
            const isLast =
              idx === fence.points.length - 1 && fence.points.length > 1;
            const isIntermediate = !isFirst && !isLast;
            const tag = isFirst
              ? "Salida"
              : isLast
                ? "Llegada"
                : `Parada ${idx}`;

            const marker = L.marker([point.lat, point.lon], {
              icon: L.divIcon({
                className: "",
                iconSize: [0, 0],
                iconAnchor: [0, 0],
                html: arrivalDotHtml(tag, !isFirst),
              }),
            });
            marker.bindTooltip(
              `<strong>${isLast ? "Punto de llegada" : isFirst ? "Punto de salida" : `Parada ${idx}`}</strong><br/>${escapeHtml(fence.name)}`,
            );
            marker.addTo(group);
          });
        }
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

    if (
      bounds.length > 0 &&
      units.length === 0 &&
      !track?.length &&
      focusGeofenceId == null
    ) {
      map.current?.fitBounds(L.latLngBounds(bounds).pad(0.2), { maxZoom: 15 });
    }
  }, [geofences, units.length, track, focusGeofenceId]);

  React.useEffect(() => {
    if (focusGeofenceId == null || !map.current) return;
    const target = geofences.find((g) => g.id === focusGeofenceId);
    if (!target || target.points.length === 0) return;

    if (target.type === 3) {
      const center = target.points[0]!;
      map.current.setView([center.lat, center.lon], 15, { animate: true });
    } else {
      const pts = target.points.map(
        (p) => [p.lat, p.lon] as L.LatLngExpression,
      );
      map.current.fitBounds(L.latLngBounds(pts).pad(0.35), {
        maxZoom: 16,
        animate: true,
      });
    }
  }, [focusGeofenceId, geofences]);

  React.useEffect(() => {
    const group = addressLayer.current;
    if (!group) return;
    group.clearLayers();
    if (addressPoints.length === 0) return;

    const bounds: L.LatLngExpression[] = [];
    for (const point of addressPoints) {
      // Puntos de llegada de las rutas con ese dot solo un poco más pequeño
      const isOrigin = Boolean(point.isOrigin);
      const tag = isOrigin
        ? "Salida"
        : point.order
          ? `Llegada · ${point.order}`
          : "Llegada";
      const marker = L.marker([point.lat, point.lon], {
        icon: L.divIcon({
          className: "",
          iconSize: [0, 0],
          iconAnchor: [0, 0],
          html: arrivalDotHtml(tag, !isOrigin),
        }),
      });
      marker.bindTooltip(
        `<strong>${point.isOrigin ? "Punto de salida" : `Punto de llegada (${escapeHtml(point.order)})`}</strong><br/>${escapeHtml(point.label)}`,
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
          html: unitMarkerHtml(unit, focusId === unit.id, zoom),
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
      // Recorridos con la línea del color unificado #92d700
      L.polyline(line, {
        color: ORB_THEME.green,
        weight: 3.5,
        opacity: 0.95,
      }).addTo(group);

      // Puntos intermedios del recorrido
      for (let i = 1; i < track.length - 1; i++) {
        const p = track[i]!;
        L.circleMarker([p.lat, p.lon], {
          radius: 2.5,
          color: "#ffffff",
          weight: 1,
          fillColor: ORB_THEME.green,
          fillOpacity: 0.85,
        }).addTo(group);
      }

      // Punto de salida del recorrido
      const first = track[0]!;
      const startMarker = L.marker([first.lat, first.lon], {
        icon: L.divIcon({
          className: "",
          iconSize: [0, 0],
          iconAnchor: [0, 0],
          html: arrivalDotHtml("Salida"),
        }),
      });
      startMarker.bindTooltip("<strong>Inicio del recorrido</strong>");
      startMarker.addTo(group);

      // Punto de llegada / última posición del recorrido
      const last = track[track.length - 1]!;
      const endMarker = L.marker([last.lat, last.lon], {
        icon: L.divIcon({
          className: "",
          iconSize: [0, 0],
          iconAnchor: [0, 0],
          html: arrivalDotHtml("Llegada"),
        }),
      });
      endMarker.bindTooltip(
        "<strong>Punto de llegada / Última posición</strong>",
      );
      endMarker.addTo(group);
      bounds.push(...line);
    }

    if (bounds.length > 0 && geofences.length === 0) {
      m.fitBounds(L.latLngBounds(bounds).pad(0.2), { maxZoom: 15 });
    }
  }, [units, track, focusId, zoom, geofences.length]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    try {
      const result = await smartGeocode(query);
      setSearchResult(result);
      const m = map.current;
      const sGroup = searchLayer.current;
      if (m && sGroup) {
        sGroup.clearLayers();
        const searchIcon = L.divIcon({
          className: "",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:#ef4444;color:#fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #ffffff;box-shadow:0 3px 8px rgba(0,0,0,0.4)"><div style="width:10px;height:10px;background:#fff;border-radius:50%"></div></div>`,
        });
        const marker = L.marker([result.lat, result.lon], {
          icon: searchIcon,
        }).addTo(sGroup);
        marker
          .bindPopup(
            `<div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.4;max-width:220px">` +
              `<strong style="color:#0f172a;display:block;margin-bottom:2px">Ubicación encontrada</strong>` +
              `<span style="color:#475569;display:block;margin-bottom:4px">${escapeHtml(result.label)}</span>` +
              `<span style="display:inline-block;padding:2px 6px;border-radius:4px;background:#f1f5f9;color:#334155;font-size:11px;font-family:monospace">${result.lat.toFixed(5)}, ${result.lon.toFixed(5)}</span>` +
              `</div>`,
          )
          .openPopup();
        m.flyTo([result.lat, result.lon], 16, { duration: 1.2 });
      }
    } catch (err) {
      console.warn("Error buscando dirección:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResult(null);
    searchLayer.current?.clearLayers();
  };

  return (
    <div className="relative isolate z-0 h-[480px] w-full overflow-hidden rounded-lg border border-border/60">
      <div ref={container} className="h-full w-full" />

      {/* Buscador inteligente de direcciones y coordenadas */}
      <div className="absolute left-3 top-3 z-[1000] flex max-w-[280px] sm:max-w-[340px] items-center gap-1.5 rounded-lg border border-border/80 bg-background/95 p-1 text-xs shadow-md backdrop-blur-sm">
        <form
          onSubmit={handleSearch}
          className="flex w-full items-center gap-1.5"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar dirección, lugar o coord..."
              className="w-full rounded-md border border-input bg-background/90 py-1 pl-7 pr-7 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            {searchQuery ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="flex items-center justify-center rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="size-3 animate-spin" /> : "Ir"}
          </button>
        </form>
      </div>

      {drawMode ? (
        <div className="absolute bottom-3 left-3 z-[1000] max-w-[260px] rounded-lg border border-amber-300/60 bg-background/95 px-3 py-2 text-xs shadow-md backdrop-blur-sm">
          <strong className="block text-amber-600">
            Modo de dibujo activo
          </strong>
          <span className="text-muted-foreground">
            {drawMode === "circle"
              ? "Haz clic en el centro y después en el borde."
              : drawMode === "line"
                ? "Haz clic para añadir los puntos de la ruta."
                : "Haz clic para añadir los vértices del polígono."}
          </span>
        </div>
      ) : null}
    </div>
  );
}
