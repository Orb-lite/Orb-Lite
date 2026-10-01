import "../_runtime.mjs";
import { t as require_leaflet_src } from "../_libs/leaflet.mjs";
require_leaflet_src();
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
//#endregion
export { DARK_LABELS_CONFIG as n, DARK_BASE_CONFIG as t };
