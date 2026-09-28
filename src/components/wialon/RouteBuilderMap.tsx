import * as React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createDarkLeafletTileLayer } from "@/lib/map-layers";

type Point = { lat: number; lon: number };

type Props = {
  points: Point[];
  onAddPoint: (p: Point) => void;
  onMovePoint: (index: number, p: Point) => void;
  color?: string;
  preview?: Point[] | null;
  path?: Point[] | null;
};

export default function RouteBuilderMap({
  points,
  onAddPoint,
  onMovePoint,
  preview,
  path,
}: Props) {
  const container = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<L.Map | null>(null);
  const layer = React.useRef<L.LayerGroup | null>(null);
  const addRef = React.useRef(onAddPoint);
  addRef.current = onAddPoint;
  const moveRef = React.useRef(onMovePoint);
  moveRef.current = onMovePoint;

  React.useEffect(() => {
    if (!container.current || map.current) return;
    const m = L.map(container.current, {
      center: [20.6736, -103.344],
      zoom: 12,
    });
    const darkLayer = createDarkLeafletTileLayer();
    darkLayer.addTo(m);
    layer.current = L.layerGroup().addTo(m);
    m.on("click", (e: L.LeafletMouseEvent) =>
      addRef.current({ lat: e.latlng.lat, lon: e.latlng.lng }),
    );
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
      const line = L.polyline(
        preview.map((p) => [p.lat, p.lon] as L.LatLngExpression),
        {
          color: "#92d700",
          weight: 3.5,
          opacity: 0.9,
          dashArray: "6 6",
        },
      ).addTo(group);
      map.current?.fitBounds(line.getBounds(), { padding: [30, 30] });
    }
    if (path && path.length > 1) {
      L.polyline(
        path.map((p) => [p.lat, p.lon] as L.LatLngExpression),
        { color: "#92d700", weight: 3.5, opacity: 0.95 },
      ).addTo(group);
    } else if (points.length > 1) {
      L.polyline(
        points.map((p) => [p.lat, p.lon] as L.LatLngExpression),
        { color: "#92d700", weight: 3.5, opacity: 0.95 },
      ).addTo(group);
    }
    points.forEach((p, i) => {
      const isArrival = i === points.length - 1 && points.length > 1;
      const tag = i === 0 ? "Salida" : isArrival ? "Llegada" : `Parada ${i}`;
      const dotSize = isArrival ? 9 : i === 0 ? 11 : 9;
      const borderWidth = isArrival ? 1.5 : 2;
      const auraSpread = isArrival ? 2 : 2.5;
      const marker = L.marker([p.lat, p.lon], {
        draggable: true,
        icon: L.divIcon({
          className: "",
          iconSize: [0, 0],
          iconAnchor: [0, 0],
          html: `<div style="position:relative;display:grid;place-items:center;transform:translate(-50%,-50%);width:1px;height:1px;cursor:pointer"><span style="position:absolute;bottom:${isArrival ? 12 : 14}px;left:50%;transform:translateX(-50%);border:1px solid #92d700;border-radius:999px;background:#04122e;padding:1px 6px;color:#f8fafc;font:600 10px/1.2 system-ui,sans-serif;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.5);pointer-events:none">${tag}</span><span style="position:relative;display:block;width:${dotSize}px;height:${dotSize}px;border-radius:50%;background:#92d700;border:${borderWidth}px solid #ffffff;box-shadow:0 0 0 ${auraSpread}px rgba(146,215,0,0.45), 0 2px 4px rgba(0,0,0,0.45)"></span></div>`,
        }),
      });
      marker.on("dragend", () => {
        const ll = marker.getLatLng();
        moveRef.current(i, { lat: ll.lat, lon: ll.lng });
      });
      marker.addTo(group);
    });
  }, [points, preview, path]);

  return (
    <div
      ref={container}
      className="h-[520px] w-full rounded-lg border border-border/60 bg-[#090d16]"
    />
  );
}
