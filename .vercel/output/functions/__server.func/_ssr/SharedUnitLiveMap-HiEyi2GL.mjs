import { o as __toESM } from "../_runtime.mjs";
import { t as require_leaflet_src } from "../_libs/leaflet.mjs";
import { n as DARK_LABELS_CONFIG, t as DARK_BASE_CONFIG } from "./map-layers-CZq2RQ-y.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as MapContainer, i as Marker, n as Popup, r as Polyline, s as useMap, t as TileLayer } from "../_libs/react-leaflet.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { B as Layers, tt as Crosshair } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SharedUnitLiveMap-HiEyi2GL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_leaflet_src = /* @__PURE__ */ __toESM(require_leaflet_src());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/wialon/SharedUnitLiveMap.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative h-full w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapContainer, {
				center: [activeUnit.position.lat, activeUnit.position.lon],
				zoom: unitList.length > 1 ? 13 : 15,
				className: "h-full min-h-[380px] w-full",
				scrollWheelZoom: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TileLayer, { ...DARK_BASE_CONFIG }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 149,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TileLayer, {
						url: DARK_LABELS_CONFIG.url,
						maxZoom: 19,
						maxNativeZoom: 16
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 150,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SmoothCenter, {
						lat: activeUnit.position.lat,
						lon: activeUnit.position.lon,
						autoFollow
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 151,
						columnNumber: 9
					}, this),
					unitList.length > 1 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FitFleetBounds, { units: unitList }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 156,
						columnNumber: 32
					}, this) : null,
					activeTrailCoords.length > 1 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Polyline, {
						positions: activeTrailCoords,
						pathOptions: {
							color: "#06b6d4",
							weight: 4,
							opacity: .85,
							dashArray: "2, 8"
						}
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 160,
						columnNumber: 11
					}, this) : null,
					unitList.map((unit, index) => {
						const isSelected = unit.unitId === activeUnit.unitId;
						const isMoving = unit.position.isMoving;
						const customColor = UNIT_COLORS[index % UNIT_COLORS.length];
						const icon = createVehicleIcon(unit.position.course, isMoving, Math.round(unit.position.speed), unitList.length > 1 ? unit.unitName : void 0, isSelected ? customColor : void 0);
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Marker, {
							position: [unit.position.lat, unit.position.lon],
							icon,
							eventHandlers: { click: () => {
								if (onSelectUnit) onSelectUnit(unit.unitId);
							} },
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Popup, {
								className: "dark-popup",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "p-2 text-slate-100 font-sans min-w-[210px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-bold text-xs uppercase text-cyan-400",
												children: unit.unitName
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 198,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${isMoving ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-700 text-slate-300"}`,
												children: isMoving ? "En movimiento" : "Detenido"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 201,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 197,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs text-slate-300",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Velocidad:" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 212,
													columnNumber: 21
												}, this),
												" ",
												Math.round(unit.position.speed),
												" km/h"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 211,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs text-slate-300",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Rumbo:" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 215,
													columnNumber: 21
												}, this),
												" ",
												unit.position.course,
												"°"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 214,
											columnNumber: 19
										}, this),
										unit.position.address ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-[11px] text-slate-400 mt-1 line-clamp-2",
											children: unit.position.address
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 218,
											columnNumber: 21
										}, this) : null,
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-[10px] text-slate-500 mt-1 font-mono",
											children: [
												unit.position.lat.toFixed(5),
												", ",
												unit.position.lon.toFixed(5)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 222,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 196,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 195,
								columnNumber: 15
							}, this)
						}, unit.unitId, false, {
							fileName: _jsxFileName,
							lineNumber: 185,
							columnNumber: 13
						}, this);
					})
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 143,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute top-3 right-3 z-[1000] flex items-center gap-2",
				children: [unitList.length > 1 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs font-semibold uppercase text-cyan-400 backdrop-blur-md shadow-lg",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layers, { className: "size-3.5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 236,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [unitList.length, " Unidades en Mapa"] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 237,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 235,
					columnNumber: 11
				}, this) : null, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => setAutoFollow((prev) => !prev),
					className: `flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-lg transition-all ${autoFollow ? "border-emerald-500/50 bg-emerald-950/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "border-slate-700 bg-slate-900/80 text-slate-400 hover:text-slate-200"}`,
					title: autoFollow ? "Seguimiento automático activado" : "Hacer clic para activar auto-seguimiento",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Crosshair, { className: `size-3.5 ${autoFollow ? "text-emerald-400 animate-spin" : ""}` }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 255,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: autoFollow ? "Siguiendo" : "Centrar" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 256,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 241,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 233,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute bottom-3 left-3 z-[1000] flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-1.5 backdrop-blur-md shadow-md",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "relative flex h-2.5 w-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 263,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 264,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 262,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-[11px] font-bold uppercase tracking-wider text-emerald-400",
					children: "Transmisión Satelital en Vivo"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 266,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 261,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 142,
		columnNumber: 5
	}, this);
}
//#endregion
export { SharedUnitLiveMap as default };
