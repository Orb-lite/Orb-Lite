import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as require_leaflet_src } from "../_libs/leaflet.mjs";
import { a as CircleMarker, i as MapContainer, n as Polyline, o as useMap, r as Marker, t as TileLayer } from "../_libs/react-leaflet.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SharedRouteMap-CCP85KTN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_leaflet_src = /* @__PURE__ */ __toESM(require_leaflet_src());
var MAP_PROVIDERS = {
	osm: {
		id: "osm",
		name: "OpenStreetMap",
		url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		subdomains: [
			"a",
			"b",
			"c"
		],
		maxZoom: 19,
		attribution: "&copy; OpenStreetMap contributors"
	},
	cartoDark: {
		id: "cartoDark",
		name: "Modo Oscuro",
		url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
		maxZoom: 19,
		attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
	}
};
/**
* Capa oscura gratuita (Esri Dark Gray Canvas).
* Las losetas nativas llegan a zoom 16; Leaflet las escala más allá.
*/
var DARK_BASE_CONFIG = {
	url: MAP_PROVIDERS.cartoDark.url,
	attribution: MAP_PROVIDERS.cartoDark.attribution,
	maxZoom: 19,
	maxNativeZoom: 16
};
/** Rótulos (nombres de calles y lugares) de la misma capa oscura de Esri. */
var DARK_LABELS_CONFIG = {
	url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
	maxZoom: 19,
	maxNativeZoom: 16
};
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
function Fit({ points }) {
	const map = useMap();
	const key = points.length;
	import_react.useEffect(() => {
		if (!points.length) return;
		map.fitBounds(import_leaflet_src.default.latLngBounds(points.map((p) => [p.lat, p.lon])), { padding: [30, 30] });
	}, [map, key]);
	return null;
}
function SharedRouteMap({ path, stops, nextIndex, me }) {
	const line = path.length > 1 ? path : stops;
	const center = stops[0] ?? {
		lat: 20.67,
		lon: -103.35
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MapContainer, {
		center: [center.lat, center.lon],
		zoom: 13,
		className: "h-64 w-full rounded-xl",
		scrollWheelZoom: false,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileLayer, { ...DARK_BASE_CONFIG }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileLayer, {
				url: DARK_LABELS_CONFIG.url,
				maxZoom: 19,
				maxNativeZoom: 16
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
				positions: line.map((p) => [p.lat, p.lon]),
				pathOptions: {
					color: "#92d700",
					weight: 4
				}
			}),
			stops.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marker, {
				position: [s.lat, s.lon],
				icon: stopIcon(i === 0 ? "S" : String(i), s.visited, i === nextIndex)
			}, i)),
			me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
				center: [me.lat, me.lon],
				radius: 7,
				pathOptions: {
					color: "#ffffff",
					fillColor: "#3b82f6",
					fillOpacity: 1,
					weight: 2
				}
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fit, { points: stops })
		]
	});
}
//#endregion
export { SharedRouteMap as default };
