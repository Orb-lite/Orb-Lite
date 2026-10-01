import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/geocoding-iXk1aMC_.js
var geocoding_iXk1aMC__exports = /* @__PURE__ */ __exportAll({
	n: () => smartGeocode,
	t: () => geocoding_exports
});
var geocoding_exports = /* @__PURE__ */ __exportAll$1({
	extractCoordinatesFromText: () => extractCoordinatesFromText,
	reverseGeocodeCoordinates: () => reverseGeocodeCoordinates,
	smartGeocode: () => smartGeocode
});
/** Intenta extraer coordenadas numéricas directas o contenidas en un enlace de Google Maps */
function extractCoordinatesFromText(input) {
	const text = input.trim();
	const directCoordMatch = text.match(/^([+-]?\d{1,2}(?:\.\d+)?)[,\s]+([+-]?\d{1,3}(?:\.\d+)?)$/);
	if (directCoordMatch) {
		const lat = parseFloat(directCoordMatch[1]);
		const lon = parseFloat(directCoordMatch[2]);
		if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) return {
			lat,
			lon,
			labelHint: `Coordenadas: ${lat.toFixed(5)}, ${lon.toFixed(5)}`
		};
	}
	const atMatch = text.match(/@([+-]?\d{1,2}(?:\.\d+)?),([+-]?\d{1,3}(?:\.\d+)?)/);
	if (atMatch) {
		const lat = parseFloat(atMatch[1]);
		const lon = parseFloat(atMatch[2]);
		if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) return {
			lat,
			lon,
			labelHint: `Punto Google Maps: ${lat.toFixed(5)}, ${lon.toFixed(5)}`
		};
	}
	const qMatch = text.match(/[?&](?:q|query|ll|destination|origin)=([+-]?\d{1,2}(?:\.\d+)?)[,\s]+([+-]?\d{1,3}(?:\.\d+)?)/);
	if (qMatch) {
		const lat = parseFloat(qMatch[1]);
		const lon = parseFloat(qMatch[2]);
		if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) return {
			lat,
			lon,
			labelHint: `Punto Google Maps: ${lat.toFixed(5)}, ${lon.toFixed(5)}`
		};
	}
	return null;
}
/** Geocodificación inversa para obtener el nombre legible de una coordenada */
async function reverseGeocodeCoordinates(lat, lon) {
	try {
		const url = new URL("https://nominatim.openstreetmap.org/reverse");
		url.searchParams.set("format", "jsonv2");
		url.searchParams.set("lat", lat.toString());
		url.searchParams.set("lon", lon.toString());
		url.searchParams.set("zoom", "17");
		url.searchParams.set("addressdetails", "1");
		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
				"User-Agent": "ORB-LITE-App/2.0 (GPS Satelital)"
			},
			signal: AbortSignal.timeout(6e3)
		});
		if (res.ok) {
			const data = await res.json();
			if (data?.display_name) return data.display_name.trim();
		}
	} catch {}
	return null;
}
/** Palabras que no ayudan a distinguir un lugar de otro */
var STOP_WORDS = /* @__PURE__ */ new Set([
	"de",
	"del",
	"la",
	"el",
	"los",
	"las",
	"y",
	"en",
	"a",
	"al",
	"calle",
	"av",
	"av.",
	"avenida",
	"blvd",
	"blvd.",
	"col",
	"col.",
	"colonia",
	"fracc",
	"fracc.",
	"num",
	"num.",
	"no",
	"no.",
	"cp",
	"mexico",
	"méxico",
	"jalisco",
	"guadalajara",
	"zapopan",
	"mx"
]);
/** Normaliza texto para comparar: minúsculas, sin acentos */
function normalizeText(value) {
	return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
/** Tokens significativos de la búsqueda (sin palabras genéricas) */
function queryTokens(query) {
	return normalizeText(query).split(" ").filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}
/**
* Puntúa qué tan bien un resultado corresponde a la búsqueda.
* Cuenta cuántos tokens significativos aparecen en el texto del resultado.
*/
function relevanceScore(query, candidateText) {
	const tokens = queryTokens(query);
	if (tokens.length === 0) return 1;
	const haystack = ` ${normalizeText(candidateText)} `;
	let hits = 0;
	for (const token of tokens) if (haystack.includes(` ${token}`) || haystack.includes(` ${token} `) || haystack.includes(token)) hits += 1;
	return hits / tokens.length;
}
/** Geocodifica una dirección o enlace de Google Maps con múltiples motores libres */
async function smartGeocode(addressInput) {
	const cleanInput = addressInput.trim();
	if (!cleanInput) throw new Error("La dirección no puede estar vacía.");
	const direct = extractCoordinatesFromText(cleanInput);
	if (direct) return {
		query: cleanInput,
		label: await reverseGeocodeCoordinates(direct.lat, direct.lon) || direct.labelHint || `${direct.lat.toFixed(5)}, ${direct.lon.toFixed(5)}`,
		lat: direct.lat,
		lon: direct.lon
	};
	if (cleanInput.startsWith("http://") || cleanInput.startsWith("https://")) try {
		const redirectDirect = extractCoordinatesFromText((await fetch(cleanInput, {
			method: "HEAD",
			redirect: "follow",
			signal: AbortSignal.timeout(6e3)
		})).url || cleanInput);
		if (redirectDirect) return {
			query: cleanInput,
			label: await reverseGeocodeCoordinates(redirectDirect.lat, redirectDirect.lon) || redirectDirect.labelHint || `${redirectDirect.lat.toFixed(5)}, ${redirectDirect.lon.toFixed(5)}`,
			lat: redirectDirect.lat,
			lon: redirectDirect.lon
		};
	} catch {}
	try {
		const photonUrl = new URL("https://photon.komoot.io/api/");
		photonUrl.searchParams.set("q", cleanInput);
		photonUrl.searchParams.set("limit", "10");
		photonUrl.searchParams.set("lat", "20.67");
		photonUrl.searchParams.set("lon", "-103.35");
		const photonRes = await fetch(photonUrl, {
			headers: { Accept: "application/json" },
			signal: AbortSignal.timeout(7e3)
		});
		if (photonRes.ok) {
			const scored = ((await photonRes.json()).features ?? []).map((feature, index) => {
				const props = feature.properties ?? {};
				const text = [
					props.name,
					props.street,
					props.housenumber,
					props.city,
					props.state,
					props.country
				].filter(Boolean).join(", ");
				return {
					feature,
					index,
					isMx: props.countrycode?.toUpperCase() === "MX" || props.country === "México" || props.country === "Mexico",
					score: relevanceScore(cleanInput, text)
				};
			}).filter((entry) => entry.feature.geometry?.coordinates && entry.feature.geometry.coordinates.length >= 2);
			scored.sort((a, b) => {
				if (b.score !== a.score) return b.score - a.score;
				if (a.isMx !== b.isMx) return a.isMx ? -1 : 1;
				return a.index - b.index;
			});
			const best = scored[0];
			if (best && best.score >= .5) {
				const coords = best.feature.geometry.coordinates;
				const lon = Number(coords[0]);
				const lat = Number(coords[1]);
				if (Number.isFinite(lat) && Number.isFinite(lon)) {
					const props = best.feature.properties ?? {};
					const parts = [
						props.name || [props.street, props.housenumber].filter(Boolean).join(" "),
						props.city,
						props.state,
						props.country
					].filter(Boolean);
					return {
						query: cleanInput,
						label: parts.length > 0 ? parts.join(", ") : cleanInput,
						lat,
						lon
					};
				}
			}
		}
	} catch {}
	const nominatimQueries = [cleanInput];
	const shortName = cleanInput.split(",")[0]?.trim();
	if (shortName && shortName.length >= 3 && shortName !== cleanInput) nominatimQueries.push(shortName);
	for (const [i, query] of nominatimQueries.entries()) {
		if (i > 0) await new Promise((r) => setTimeout(r, 1100));
		try {
			const nominatimUrl = new URL("https://nominatim.openstreetmap.org/search");
			nominatimUrl.searchParams.set("format", "jsonv2");
			nominatimUrl.searchParams.set("limit", "5");
			nominatimUrl.searchParams.set("q", query);
			nominatimUrl.searchParams.set("addressdetails", "1");
			const nominatimRes = await fetch(nominatimUrl, {
				headers: {
					Accept: "application/json",
					"User-Agent": "ORB-LITE-App/2.0 (GPS Satelital)"
				},
				signal: AbortSignal.timeout(1e4)
			});
			if (nominatimRes.ok) {
				const match = (await nominatimRes.json()).map((match, index) => ({
					match,
					index,
					score: relevanceScore(query, match.display_name ?? "")
				})).sort((a, b) => b.score - a.score || a.index - b.index)[0]?.match;
				const lat = Number(match?.lat);
				const lon = Number(match?.lon);
				if (match && Number.isFinite(lat) && Number.isFinite(lon)) return {
					query: cleanInput,
					label: match.display_name?.trim() || cleanInput,
					lat,
					lon
				};
			}
		} catch {}
	}
	throw new Error(`No se encontró la dirección "${cleanInput}". Puedes escribir el nombre del lugar, calle y ciudad, o pegar coordenadas directas.`);
}
//#endregion
export { smartGeocode as n, geocoding_iXk1aMC__exports as t };
