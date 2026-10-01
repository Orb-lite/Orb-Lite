import { o as __toESM } from "../_runtime.mjs";
import { t as require_leaflet_src } from "../_libs/leaflet.mjs";
import { n as DARK_LABELS_CONFIG, t as DARK_BASE_CONFIG } from "./map-layers-CZq2RQ-y.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as MapContainer, i as Marker, n as Popup, r as Polyline, s as useMap, t as TileLayer } from "../_libs/react-leaflet.mjs";
import { B as Layers, tt as Crosshair } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SharedUnitLiveMap-W1H3Ke7g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_leaflet_src = /* @__PURE__ */ __toESM(require_leaflet_src());
var UNIT_COLORS = [
	"#06b6d4",
	"#10b981",
	"#f59e0b",
	"#a855f7",
	"#ec4899",
	"#3b82f6"
];
function createVehicleIcon(course, isMoving, speed, label, customColor) {
	const color = customColor || (isMoving ? "#10b981" : "#06b6d4");
	const glow = isMoving ? "rgba(16, 185, 129, 0.6)" : "rgba(6, 182, 212, 0.5)";
	return import_leaflet_src.default.divIcon({
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
    `
	});
}
function SmoothCenter({ lat, lon, autoFollow }) {
	const map = useMap();
	import_react.useEffect(() => {
		if (autoFollow) map.panTo([lat, lon], {
			animate: true,
			duration: 1
		});
	}, [
		map,
		lat,
		lon,
		autoFollow
	]);
	return null;
}
function FitFleetBounds({ units }) {
	const map = useMap();
	import_react.useEffect(() => {
		if (units.length > 1) {
			const validPoints = units.filter((u) => u.position?.lat && u.position?.lon).map((u) => [u.position.lat, u.position.lon]);
			if (validPoints.length > 1) map.fitBounds(import_leaflet_src.default.latLngBounds(validPoints), {
				padding: [50, 50],
				maxZoom: 16
			});
		}
	}, [units.length]);
	return null;
}
function SharedUnitLiveMap({ unitName, position, trail, units, selectedUnitId, onSelectUnit }) {
	const [autoFollow, setAutoFollow] = import_react.useState(true);
	const unitList = import_react.useMemo(() => {
		if (units && units.length > 0) return units;
		return [{
			unitId: 1,
			unitName,
			position: {
				lat: position.lat,
				lon: position.lon,
				speed: position.speed,
				course: position.course,
				time: position.time,
				address: position.address || "Coordenadas satelitales",
				isMoving: Boolean(position.speed && position.speed > 3)
			},
			trail
		}];
	}, [
		units,
		unitName,
		position,
		trail
	]);
	const activeUnit = import_react.useMemo(() => {
		if (selectedUnitId) {
			const found = unitList.find((u) => u.unitId === selectedUnitId);
			if (found) return found;
		}
		return unitList[0];
	}, [unitList, selectedUnitId]);
	const activeTrailCoords = import_react.useMemo(() => {
		return (activeUnit.trail || trail).map((p) => [p.lat, p.lon]);
	}, [activeUnit, trail]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-full w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MapContainer, {
				center: [activeUnit.position.lat, activeUnit.position.lon],
				zoom: unitList.length > 1 ? 13 : 15,
				className: "h-full min-h-[380px] w-full",
				scrollWheelZoom: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileLayer, { ...DARK_BASE_CONFIG }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileLayer, {
						url: DARK_LABELS_CONFIG.url,
						maxZoom: 19,
						maxNativeZoom: 16
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmoothCenter, {
						lat: activeUnit.position.lat,
						lon: activeUnit.position.lon,
						autoFollow
					}),
					unitList.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FitFleetBounds, { units: unitList }) : null,
					activeTrailCoords.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
						positions: activeTrailCoords,
						pathOptions: {
							color: "#06b6d4",
							weight: 4,
							opacity: .85,
							dashArray: "2, 8"
						}
					}) : null,
					unitList.map((unit, index) => {
						const isSelected = unit.unitId === activeUnit.unitId;
						const isMoving = unit.position.isMoving;
						const customColor = UNIT_COLORS[index % UNIT_COLORS.length];
						const icon = createVehicleIcon(unit.position.course, isMoving, Math.round(unit.position.speed), unitList.length > 1 ? unit.unitName : void 0, isSelected ? customColor : void 0);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marker, {
							position: [unit.position.lat, unit.position.lon],
							icon,
							eventHandlers: { click: () => {
								if (onSelectUnit) onSelectUnit(unit.unitId);
							} },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, {
								className: "dark-popup",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 text-slate-100 font-sans min-w-[210px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-xs uppercase text-cyan-400",
												children: unit.unitName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${isMoving ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-700 text-slate-300"}`,
												children: isMoving ? "En movimiento" : "Detenido"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-slate-300",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Velocidad:" }),
												" ",
												Math.round(unit.position.speed),
												" km/h"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-slate-300",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Rumbo:" }),
												" ",
												unit.position.course,
												"°"
											]
										}),
										unit.position.address ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-slate-400 mt-1 line-clamp-2",
											children: unit.position.address
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-slate-500 mt-1 font-mono",
											children: [
												unit.position.lat.toFixed(5),
												", ",
												unit.position.lon.toFixed(5)
											]
										})
									]
								})
							})
						}, unit.unitId);
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-3 right-3 z-[1000] flex items-center gap-2",
				children: [unitList.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs font-semibold uppercase text-cyan-400 backdrop-blur-md shadow-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [unitList.length, " Unidades en Mapa"] })]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setAutoFollow((prev) => !prev),
					className: `flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-lg transition-all ${autoFollow ? "border-emerald-500/50 bg-emerald-950/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "border-slate-700 bg-slate-900/80 text-slate-400 hover:text-slate-200"}`,
					title: autoFollow ? "Seguimiento automático activado" : "Hacer clic para activar auto-seguimiento",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: `size-3.5 ${autoFollow ? "text-emerald-400 animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: autoFollow ? "Siguiendo" : "Centrar" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-3 left-3 z-[1000] flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-1.5 backdrop-blur-md shadow-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "relative flex h-2.5 w-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-bold uppercase tracking-wider text-emerald-400",
					children: "Transmisión Satelital en Vivo"
				})]
			})
		]
	});
}
//#endregion
export { SharedUnitLiveMap as default };
