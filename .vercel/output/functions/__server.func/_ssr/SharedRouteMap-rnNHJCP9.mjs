import { o as __toESM } from "../_runtime.mjs";
import { t as require_leaflet_src } from "../_libs/leaflet.mjs";
import { n as DARK_LABELS_CONFIG, t as DARK_BASE_CONFIG } from "./map-layers-CZq2RQ-y.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as MapContainer, i as Marker, n as Popup, o as CircleMarker, r as Polyline, s as useMap, t as TileLayer } from "../_libs/react-leaflet.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SharedRouteMap-rnNHJCP9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_leaflet_src = /* @__PURE__ */ __toESM(require_leaflet_src());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/wialon/SharedRouteMap.tsx";
function stopIcon(n, visited, next) {
	const bg = visited ? "#92d700" : next ? "#ffffff" : "#17233d";
	const fg = visited || next ? "#17233d" : "#c9d1dc";
	return import_leaflet_src.default.divIcon({
		className: "",
		iconSize: [26, 26],
		iconAnchor: [13, 13],
		html: `<div style="width:26px;height:26px;border-radius:50%;background:${bg};color:${fg};border:2px solid #92d700;display:grid;place-items:center;font:700 12px sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.5)">${n}</div>`
	});
}
function createVehicleIcon(course = 0, speed = 0) {
	const color = speed > 2 ? "#10b981" : "#06b6d4";
	return import_leaflet_src.default.divIcon({
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
    `
	});
}
function Fit({ points }) {
	const map = useMap();
	const key = points.length;
	import_react.useEffect(() => {
		if (!points.length) return;
		map.fitBounds(import_leaflet_src.default.latLngBounds(points.map((p) => [p.lat, p.lon])), { padding: [30, 30] });
	}, [map, key]);
	return null;
}
function SharedRouteMap({ path, stops, nextIndex, me, liveVehicle }) {
	const line = path.length > 1 ? path : stops;
	const center = liveVehicle ? [liveVehicle.lat, liveVehicle.lon] : stops[0] ? [stops[0].lat, stops[0].lon] : [20.67, -103.35];
	const vehicleIcon = import_react.useMemo(() => {
		if (!liveVehicle) return null;
		return createVehicleIcon(liveVehicle.course ?? 0, liveVehicle.speed ?? 0);
	}, [liveVehicle?.course, liveVehicle?.speed]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapContainer, {
		center,
		zoom: 13,
		className: "h-72 w-full rounded-xl",
		scrollWheelZoom: false,
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TileLayer, { ...DARK_BASE_CONFIG }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 101,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TileLayer, {
				url: DARK_LABELS_CONFIG.url,
				maxZoom: 19,
				maxNativeZoom: 16
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 102,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Polyline, {
				positions: line.map((p) => [p.lat, p.lon]),
				pathOptions: {
					color: "#92d700",
					weight: 4
				}
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 103,
				columnNumber: 7
			}, this),
			stops.map((s, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Marker, {
				position: [s.lat, s.lon],
				icon: stopIcon(i === 0 ? "S" : String(i), s.visited, i === nextIndex)
			}, i, false, {
				fileName: _jsxFileName,
				lineNumber: 108,
				columnNumber: 9
			}, this)),
			me ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleMarker, {
				center: [me.lat, me.lon],
				radius: 7,
				pathOptions: {
					color: "#ffffff",
					fillColor: "#3b82f6",
					fillOpacity: 1,
					weight: 2
				}
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 115,
				columnNumber: 9
			}, this) : null,
			liveVehicle && vehicleIcon ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Marker, {
				position: [liveVehicle.lat, liveVehicle.lon],
				icon: vehicleIcon,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Popup, {
					className: "dark-popup",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "p-1 text-slate-100 font-sans text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "font-bold text-cyan-400",
							children: liveVehicle.unitName || "Unidad en Vivo"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 127,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-slate-300 mt-0.5",
							children: [
								"Velocidad: ",
								Math.round(liveVehicle.speed ?? 0),
								" km/h"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 128,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 126,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 125,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 124,
				columnNumber: 9
			}, this) : null,
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Fit, { points: liveVehicle ? [...stops, {
				lat: liveVehicle.lat,
				lon: liveVehicle.lon
			}] : stops }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 136,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 95,
		columnNumber: 5
	}, this);
}
//#endregion
export { SharedRouteMap as default };
