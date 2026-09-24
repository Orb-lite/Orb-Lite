import * as React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Point = { lat: number; lon: number };

type Props = {
  points: Point[];
  onAddPoint: (p: Point) => void;
  onMovePoint: (index: number, p: Point) => void;
  color: string;
  preview?: Point[] | null;
  path?: Point[] | null;
};

export default function RouteBuilderMap({ points, onAddPoint, onMovePoint, color, preview, path }: Props) {
  const container = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<L.Map | null>(null);
  const layer = React.useRef<L.LayerGroup | null>(null);
  const addRef = React.useRef(onAddPoint);
  addRef.current = onAddPoint;
  const moveRef = React.useRef(onMovePoint);
  moveRef.current = onMovePoint;

  React.useEffect(() => {
    if (!container.current || map.current) return;
    const m = L.map(container.current, { center: [20.6736, -103.344], zoom: 12 });
    const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(m);
    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles &copy; Esri", maxZoom: 19 },
    );
    L.control.layers({ Calles: streets, Satélite: satellite }, undefined, { position: "topright" }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    m.on("click", (e: L.LeafletMouseEvent) => addRef.current({ lat: e.latlng.lat, lon: e.latlng.lng }));
    map.current = m;
    return () => {
      m.remove();
      map.current = null;
      layer.current = null;
    };
  }, []);

  React.useEffect(() => {
    const group = layer.current;
    if (!group) return;
    group.clearLayers();
    if (preview && preview.length > 1) {
      const line = L.polyline(preview.map((p) => [p.lat, p.lon] as L.LatLngExpression), {
        color: "#38bdf8",
        weight: 4,
        dashArray: "6 6",
      }).addTo(group);
      map.current?.fitBounds(line.getBounds(), { padding: [30, 30] });
    }
    if (path && path.length > 1) {
      L.polyline(path.map((p) => [p.lat, p.lon] as L.LatLngExpression), { color, weight: 5 }).addTo(group);
    } else if (points.length > 1) {
      L.polyline(points.map((p) => [p.lat, p.lon] as L.LatLngExpression), { color, weight: 5 }).addTo(group);
    }
    points.forEach((p, i) => {
      const marker = L.marker([p.lat, p.lon], {
        draggable: true,
        icon: L.divIcon({
          className: "",
          iconSize: [0, 0],
          html: `<div style="transform:translate(-50%,-50%);width:22px;height:22px;border-radius:999px;background:${color};border:2px solid #0f172a;display:grid;place-items:center;font:700 11px system-ui;color:#0f172a">${i === 0 ? "S" : i + 1}</div>`,
        }),
      });
      marker.on("dragend", () => {
        const ll = marker.getLatLng();
        moveRef.current(i, { lat: ll.lat, lon: ll.lng });
      });
      marker.addTo(group);
    });
  }, [points, color, preview, path]);

  return <div ref={container} className="h-[520px] w-full rounded-lg border border-border/60" />;
}
