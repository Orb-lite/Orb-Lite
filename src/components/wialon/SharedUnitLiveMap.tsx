import * as React from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DARK_BASE_CONFIG, DARK_LABELS_CONFIG } from "@/lib/map-layers";
import { Crosshair, Layers } from "lucide-react";
import type { PublicTrackedUnit } from "@/lib/unit-share.functions";

type Position = {
  lat: number;
  lon: number;
  speed: number;
  course: number;
  time: number;
  address?: string;
  isMoving?: boolean;
};

type TrailPoint = {
  lat: number;
  lon: number;
  time: number;
  speed?: number;
};

const UNIT_COLORS = ["#06b6d4", "#10b981", "#f59e0b", "#a855f7", "#ec4899", "#3b82f6"];

function createVehicleIcon(
  course: number,
  isMoving: boolean,
  speed: number,
  label?: string,
  customColor?: string,
) {
  const color = customColor || (isMoving ? "#10b981" : "#06b6d4");
  const glow = isMoving ? "rgba(16, 185, 129, 0.6)" : "rgba(6, 182, 212, 0.5)";

  return L.divIcon({
    className: "custom-live-vehicle-marker",
    iconSize: [48, 54],
    iconAnchor: [24, 27],
    html: `
      <div style="position:relative; width:48px; height:54px; display:flex; flex-direction:column; align-items:center; justify-content:center; transition: all 0.8s cubic-bezier(0.2, 0, 0, 1);">
        ${label ? `<div style="position:absolute; top:-10px; background:#0f172a; color:#cbd5e1; font-size:9px; font-weight:700; padding:1px 5px; border-radius:4px; border:1px solid #334155; white-space:nowrap; max-width:80px; overflow:hidden; text-overflow:ellipsis; box-shadow:0 1px 4px rgba(0,0,0,0.8);">${label}</div>` : ""}
        <!-- Pulso de radar en vivo -->
        <div style="position:absolute; width:44px; height:44px; border-radius:50%; background:${glow}; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; opacity:0.35;"></div>
        
        <!-- Aro exterior con brújula -->
        <div style="position:relative; width:34px; height:34px; border-radius:50%; background:#090d16; border:2.5px solid ${color}; display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px ${glow};">
          <svg style="transform: rotate(${course}deg); transition: transform 0.6s ease;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 19 21 12 17 5 21 12 2" fill="${color}" fill-opacity="0.35" />
          </svg>
        </div>

        <!-- Etiqueta de velocidad flotante -->
        <div style="position:absolute; bottom:-7px; background:#0f172a; color:#f8fafc; font-size:9px; font-weight:800; font-family:monospace; padding:1px 5px; border-radius:5px; border:1px solid #334155; white-space:nowrap; box-shadow:0 2px 6px rgba(0,0,0,0.7);">
          ${speed} km/h
        </div>
      </div>
    `,
  });
}

function SmoothCenter({ lat, lon, autoFollow }: { lat: number; lon: number; autoFollow: boolean }) {
  const map = useMap();
  React.useEffect(() => {
    if (autoFollow) {
      map.panTo([lat, lon], { animate: true, duration: 1 });
    }
  }, [map, lat, lon, autoFollow]);
  return null;
}

function FitFleetBounds({ units }: { units: PublicTrackedUnit[] }) {
  const map = useMap();
  React.useEffect(() => {
    if (units.length > 1) {
      const validPoints = units
        .filter((u) => u.position?.lat && u.position?.lon)
        .map((u) => [u.position.lat, u.position.lon] as [number, number]);
      if (validPoints.length > 1) {
        map.fitBounds(L.latLngBounds(validPoints), { padding: [50, 50], maxZoom: 16 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units.length]);
  return null;
}

export default function SharedUnitLiveMap({
  unitName,
  position,
  trail,
  units,
  selectedUnitId,
  onSelectUnit,
}: {
  unitName: string;
  position: Position;
  trail: TrailPoint[];
  units?: PublicTrackedUnit[];
  selectedUnitId?: number;
  onSelectUnit?: (unitId: number) => void;
}) {
  const [autoFollow, setAutoFollow] = React.useState(true);

  // Determinar unidades a renderizar (soporte multi-unidad o individual)
  const unitList: PublicTrackedUnit[] = React.useMemo(() => {
    if (units && units.length > 0) return units;
    return [
      {
        unitId: 1,
        unitName,
        position: {
          lat: position.lat,
          lon: position.lon,
          speed: position.speed,
          course: position.course,
          time: position.time,
          address: position.address || "Coordenadas satelitales",
          isMoving: Boolean(position.speed && position.speed > 3),
        },
        trail,
      },
    ];
  }, [units, unitName, position, trail]);

  const activeUnit = React.useMemo(() => {
    if (selectedUnitId) {
      const found = unitList.find((u) => u.unitId === selectedUnitId);
      if (found) return found;
    }
    return unitList[0];
  }, [unitList, selectedUnitId]);

  const activeTrailCoords = React.useMemo(() => {
    const targetTrail = activeUnit.trail || trail;
    return targetTrail.map((p) => [p.lat, p.lon] as [number, number]);
  }, [activeUnit, trail]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
      <MapContainer
        center={[activeUnit.position.lat, activeUnit.position.lon]}
        zoom={unitList.length > 1 ? 13 : 15}
        className="h-full min-h-[380px] w-full"
        scrollWheelZoom={true}
      >
        <TileLayer {...DARK_BASE_CONFIG} />
        <TileLayer url={DARK_LABELS_CONFIG.url} maxZoom={19} maxNativeZoom={16} />
        <SmoothCenter
          lat={activeUnit.position.lat}
          lon={activeUnit.position.lon}
          autoFollow={autoFollow}
        />
        {unitList.length > 1 ? <FitFleetBounds units={unitList} /> : null}

        {/* Trail de la unidad activa */}
        {activeTrailCoords.length > 1 ? (
          <Polyline
            positions={activeTrailCoords}
            pathOptions={{
              color: "#06b6d4",
              weight: 4,
              opacity: 0.85,
              dashArray: "2, 8",
            }}
          />
        ) : null}

        {/* Marcadores de todas las unidades compartidas */}
        {unitList.map((unit, index) => {
          const isSelected = unit.unitId === activeUnit.unitId;
          const isMoving = unit.position.isMoving;
          const customColor = UNIT_COLORS[index % UNIT_COLORS.length];
          const icon = createVehicleIcon(
            unit.position.course,
            isMoving,
            Math.round(unit.position.speed),
            unitList.length > 1 ? unit.unitName : undefined,
            isSelected ? customColor : undefined,
          );

          return (
            <Marker
              key={unit.unitId}
              position={[unit.position.lat, unit.position.lon]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onSelectUnit) onSelectUnit(unit.unitId);
                },
              }}
            >
              <Popup className="dark-popup">
                <div className="p-2 text-slate-100 font-sans min-w-[210px]">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5">
                    <span className="font-bold text-xs uppercase text-cyan-400">
                      {unit.unitName}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isMoving
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {isMoving ? "En movimiento" : "Detenido"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Velocidad:</strong> {Math.round(unit.position.speed)} km/h
                  </p>
                  <p className="text-xs text-slate-300">
                    <strong>Rumbo:</strong> {unit.position.course}°
                  </p>
                  {unit.position.address ? (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {unit.position.address}
                    </p>
                  ) : null}
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    {unit.position.lat.toFixed(5)}, {unit.position.lon.toFixed(5)}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Control flotante superior: Auto-seguir y contador de flota */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
        {unitList.length > 1 ? (
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs font-semibold uppercase text-cyan-400 backdrop-blur-md shadow-lg">
            <Layers className="size-3.5" />
            <span>{unitList.length} Unidades en Mapa</span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setAutoFollow((prev) => !prev)}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-lg transition-all ${
            autoFollow
              ? "border-emerald-500/50 bg-emerald-950/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              : "border-slate-700 bg-slate-900/80 text-slate-400 hover:text-slate-200"
          }`}
          title={
            autoFollow
              ? "Seguimiento automático activado"
              : "Hacer clic para activar auto-seguimiento"
          }
        >
          <Crosshair className={`size-3.5 ${autoFollow ? "text-emerald-400 animate-spin" : ""}`} />
          <span>{autoFollow ? "Siguiendo" : "Centrar"}</span>
        </button>
      </div>

      {/* Indicador inferior de transmisión satelital en vivo */}
      <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-1.5 backdrop-blur-md shadow-md">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
          Transmisión Satelital en Vivo
        </span>
      </div>
    </div>
  );
}
