import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as numberType, n as booleanType, o as objectType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-share.functions-CfSL0XNj.js
var CHECK_RADIUS_METERS = 300;
function distanceMeters(aLat, aLon, bLat, bLon) {
	const r = 6371e3;
	const toRad = (d) => d * Math.PI / 180;
	const dLat = toRad(bLat - aLat);
	const dLon = toRad(bLon - aLon);
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
	return 2 * r * Math.asin(Math.sqrt(h));
}
function toView(route) {
	return {
		name: route.name,
		origin: route.origin ?? null,
		stops: (route.stops ?? []).map((stop) => ({
			label: stop.label,
			lat: stop.lat,
			lon: stop.lon,
			visitedAt: stop.visitedAt ?? null,
			comment: stop.comment ?? null,
			contact: stop.contact ?? null,
			checkDistance: stop.checkDistance ?? null
		})),
		path: (route.points ?? []).map((p) => ({
			lat: p.lat,
			lon: p.lon
		})),
		reportSent: Boolean(route.reportSentAt)
	};
}
/** Genera (o reutiliza) el enlace público de una ruta guardada del usuario. */
var shareUserRoute_createServerFn_handler = createServerRpc({
	id: "a017e41fb4c164c2f49ca0692cfec55d24d8a8f990d971e2e72662d2d3946b60",
	name: "shareUserRoute",
	filename: "src/lib/route-share.functions.ts"
}, (opts) => shareUserRoute.__executeServer(opts));
var shareUserRoute = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	userId: numberType().int().nonnegative(),
	routeId: stringType().min(1),
	reportEmail: stringType().trim().email().max(255)
}).parse(input)).handler(shareUserRoute_createServerFn_handler, async ({ data }) => {
	const { getUserRoutesFromStorage, setRouteShare, rememberReportEmail } = await import("./user-routes.server-DQQNlK8u.mjs");
	const route = (await getUserRoutesFromStorage(data.userId)).find((r) => r.id === data.routeId);
	if (!route) throw new Error("Ruta no encontrada.");
	await rememberReportEmail(data.userId, data.reportEmail);
	const hasCorrectStops = Boolean(route.stops?.length) && (!route.routeStops?.length || route.stops?.length === route.routeStops.length) && (!route.addresses?.length || route.routeStops?.length || route.stops?.length === route.addresses.length + 1);
	const token = route.shareToken && hasCorrectStops ? route.shareToken : crypto.randomUUID().replaceAll("-", "");
	if (route.shareToken && hasCorrectStops && route.stops) {
		if (!await setRouteShare(data.userId, data.routeId, token, route.stops, data.reportEmail)) throw new Error("No se pudo generar el enlace.");
		return { token };
	}
	const labels = route.addresses ?? [];
	let visitPoints = route.routeStops?.length ? route.routeStops : route.points;
	if (!route.routeStops?.length && labels.length > 0) {
		const { smartGeocode } = await import("./geocoding-BHqbBiax.mjs");
		const places = [route.origin ?? "", ...labels];
		visitPoints = [];
		for (const place of places) try {
			const location = await smartGeocode(place);
			visitPoints.push({
				lat: location.lat,
				lon: location.lon,
				label: place
			});
		} catch {
			throw new Error(`No se pudo ubicar "${place}". Actualiza la ruta antes de compartirla.`);
		}
	}
	const stops = visitPoints.map((point, index) => ({
		label: index === 0 ? route.origin ?? labels[0] ?? "Salida" : route.routeStops?.[index]?.label ?? labels[index - 1] ?? `Parada ${index}`,
		lat: point.lat,
		lon: point.lon
	}));
	if (!await setRouteShare(data.userId, data.routeId, token, stops, data.reportEmail)) throw new Error("No se pudo generar el enlace.");
	return { token };
});
var getSharedRoute_createServerFn_handler = createServerRpc({
	id: "ce86aeac9fdea824308d52b2ea4866e574f84e4698e5f094baffe14ded37cfad",
	name: "getSharedRoute",
	filename: "src/lib/route-share.functions.ts"
}, (opts) => getSharedRoute.__executeServer(opts));
var getSharedRoute = createServerFn({ method: "GET" }).inputValidator((input) => objectType({ token: stringType().min(16) }).parse(input)).handler(getSharedRoute_createServerFn_handler, async ({ data }) => {
	const { getRouteByShareToken } = await import("./user-routes.server-DQQNlK8u.mjs");
	const route = await getRouteByShareToken(data.token);
	if (!route || !route.stops?.length) throw new Error("Este enlace de ruta no existe o fue eliminado.");
	return toView(route);
});
var markSharedStopVisited_createServerFn_handler = createServerRpc({
	id: "3d278d72dafd4b34a41faf460470726bdde667cf41acb15501925a7f377c447a",
	name: "markSharedStopVisited",
	filename: "src/lib/route-share.functions.ts"
}, (opts) => markSharedStopVisited.__executeServer(opts));
var markSharedStopVisited = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	token: stringType().min(16),
	stopIndex: numberType().int().min(0),
	visited: booleanType(),
	lat: numberType().min(-90).max(90).optional(),
	lon: numberType().min(-180).max(180).optional(),
	contact: booleanType().optional(),
	note: stringType().trim().max(1e3).optional()
}).parse(input)).handler(markSharedStopVisited_createServerFn_handler, async ({ data }) => {
	const { markSharedStop, getRouteByShareToken } = await import("./user-routes.server-DQQNlK8u.mjs");
	let check;
	if (data.visited) {
		if (data.lat == null || data.lon == null) throw new Error("Activa tu ubicación para marcar la visita.");
		if (data.contact == null || !data.note || data.note.length < 3) throw new Error("Escribe una nota de la visita.");
		const stop = (await getRouteByShareToken(data.token))?.stops?.[data.stopIndex];
		if (!stop) throw new Error("No se pudo actualizar la parada.");
		const distance = distanceMeters(data.lat, data.lon, stop.lat, stop.lon);
		if (distance > CHECK_RADIUS_METERS) {
			const km = distance >= 1e3 ? `${(distance / 1e3).toFixed(1)} km` : `${Math.round(distance)} m`;
			throw new Error(`Estás a ${km} de la parada. Acércate para marcarla.`);
		}
		check = {
			contact: data.contact,
			note: data.note,
			distance
		};
	}
	const route = await markSharedStop(data.token, data.stopIndex, data.visited, check);
	if (!route) throw new Error("No se pudo actualizar la parada.");
	return toView(route);
});
var finishSharedRoute_createServerFn_handler = createServerRpc({
	id: "cf3a65597823edd23327e25c1d93097f6b11eb66660f39f71cab58263d1eae24",
	name: "finishSharedRoute",
	filename: "src/lib/route-share.functions.ts"
}, (opts) => finishSharedRoute.__executeServer(opts));
var finishSharedRoute = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ token: stringType().min(16) }).parse(input)).handler(finishSharedRoute_createServerFn_handler, async ({ data }) => {
	const { getRouteByShareToken } = await import("./user-routes.server-DQQNlK8u.mjs");
	const route = await getRouteByShareToken(data.token);
	if (!route?.stops?.length || !route.stops.every((stop) => stop.visitedAt)) throw new Error("Completa todas las visitas antes de enviar el resumen.");
	if (!route.reportEmail) throw new Error("La ruta no tiene un correo de destino.");
	if (route.reportSentAt) return toView(route);
	const sent = await maybeSendReport(data.token);
	if (!sent?.reportSentAt) throw new Error("No se pudo enviar el resumen. Intenta de nuevo.");
	return toView(sent);
});
var commentSharedStop_createServerFn_handler = createServerRpc({
	id: "02a9c6ca9ff633dddd73db0617992091a5c0a98666f4ea6779aa30e4796d24b1",
	name: "commentSharedStop",
	filename: "src/lib/route-share.functions.ts"
}, (opts) => commentSharedStop.__executeServer(opts));
var commentSharedStop = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	token: stringType().min(16),
	stopIndex: numberType().int().min(0),
	comment: stringType().max(1e3)
}).parse(input)).handler(commentSharedStop_createServerFn_handler, async ({ data }) => {
	const { updateSharedRoute } = await import("./user-routes.server-DQQNlK8u.mjs");
	const route = await updateSharedRoute(data.token, (r) => {
		const stop = r.stops?.[data.stopIndex];
		if (!stop) return false;
		const text = data.comment.trim();
		if (text) stop.comment = text;
		else delete stop.comment;
		return true;
	});
	if (!route) throw new Error("No se pudo guardar el comentario.");
	return toView(route);
});
var getReportEmails_createServerFn_handler = createServerRpc({
	id: "03ffddc0dfe95312fe33950c66cb094a34aae3242746c0073c7b65c62e52c813",
	name: "getReportEmails",
	filename: "src/lib/route-share.functions.ts"
}, (opts) => getReportEmails.__executeServer(opts));
var getReportEmails = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ userId: numberType().int().nonnegative() }).parse(input)).handler(getReportEmails_createServerFn_handler, async ({ data }) => {
	const { getSavedReportEmails } = await import("./user-routes.server-DQQNlK8u.mjs");
	return { emails: await getSavedReportEmails(data.userId) };
});
async function maybeSendReport(token) {
	const { getRouteByShareToken, updateSharedRoute } = await import("./user-routes.server-DQQNlK8u.mjs");
	const route = await getRouteByShareToken(token);
	if (!route?.stops?.length || !route.reportEmail || route.reportSentAt) return null;
	if (!route.stops.every((s) => s.visitedAt)) return null;
	try {
		const { sendTemplateEmail } = await import("./send-email-CKArGOSn.mjs").then((n) => n.n);
		if (!(await sendTemplateEmail("reporte-visitas", route.reportEmail, {
			templateData: {
				routeName: route.name,
				stops: route.stops.map((s) => ({
					label: s.label,
					visitedAt: s.visitedAt ?? null,
					comment: s.contact == null ? s.comment ?? null : `${s.contact ? "Con acercamiento" : "Sin acercamiento"}${s.comment ? ` · ${s.comment}` : ""}`
				}))
			},
			idempotencyKey: `reporte-visitas-${token}-${route.stops.map((s) => s.visitedAt).join("|").length}-${route.stops[route.stops.length - 1]?.visitedAt ?? ""}`
		})).sent) return null;
		return await updateSharedRoute(token, (r) => {
			r.reportSentAt = (/* @__PURE__ */ new Date()).toISOString();
			return true;
		});
	} catch (cause) {
		console.error("reporte-visitas", cause);
		return null;
	}
}
//#endregion
export { commentSharedStop_createServerFn_handler, finishSharedRoute_createServerFn_handler, getReportEmails_createServerFn_handler, getSharedRoute_createServerFn_handler, markSharedStopVisited_createServerFn_handler, shareUserRoute_createServerFn_handler };
