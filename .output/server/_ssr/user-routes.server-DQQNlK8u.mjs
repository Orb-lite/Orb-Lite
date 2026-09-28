import { supabaseAdmin } from "./client.server-KzwUIAkW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/user-routes.server-DQQNlK8u.js
function rowToRoute(row) {
	return {
		id: row.id,
		userId: row.user_id,
		...row.user_name != null && { userName: row.user_name },
		name: row.name,
		color: row.color,
		points: row.points ?? [],
		...row.route_stops != null && { routeStops: row.route_stops },
		...row.origin != null && { origin: row.origin },
		...row.addresses != null && { addresses: row.addresses },
		...row.distance_meters != null && { distanceMeters: row.distance_meters },
		...row.duration_seconds != null && { durationSeconds: row.duration_seconds },
		createdAt: row.created_at,
		...row.share_token != null && { shareToken: row.share_token },
		...row.stops != null && { stops: row.stops },
		...row.report_email != null && { reportEmail: row.report_email },
		...row.report_sent_at != null && { reportSentAt: row.report_sent_at }
	};
}
function routeToRow(route) {
	return {
		id: route.id,
		user_id: route.userId,
		user_name: route.userName ?? null,
		name: route.name,
		color: route.color,
		points: route.points,
		route_stops: route.routeStops ?? null,
		origin: route.origin ?? null,
		addresses: route.addresses ?? null,
		distance_meters: route.distanceMeters ?? null,
		duration_seconds: route.durationSeconds ?? null,
		share_token: route.shareToken ?? null,
		stops: route.stops ?? null,
		report_email: route.reportEmail ?? null,
		report_sent_at: route.reportSentAt ?? null,
		created_at: route.createdAt
	};
}
async function getUserRoutesFromStorage(userIds) {
	const ids = Array.isArray(userIds) ? userIds : [userIds];
	if (ids.length === 0) return [];
	const { data, error } = await supabaseAdmin.from("user_routes").select("*").in("user_id", ids).order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data.map(rowToRoute);
}
async function saveUserRouteToStorage(route) {
	const newRoute = {
		...route,
		id: `route_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const { error } = await supabaseAdmin.from("user_routes").insert(routeToRow(newRoute));
	if (error) throw new Error(error.message);
	return newRoute;
}
async function deleteUserRouteFromStorage(userId, routeId) {
	const { error } = await supabaseAdmin.from("user_routes").delete().eq("id", routeId).eq("user_id", userId);
	if (error) throw new Error(error.message);
	return true;
}
async function getRouteByShareToken(token) {
	const { data, error } = await supabaseAdmin.from("user_routes").select("*").eq("share_token", token).maybeSingle();
	if (error) throw new Error(error.message);
	return data ? rowToRoute(data) : null;
}
async function setRouteShare(userId, routeId, shareToken, stops, reportEmail) {
	const { data, error } = await supabaseAdmin.from("user_routes").select("*").eq("id", routeId).eq("user_id", userId).maybeSingle();
	if (error) throw new Error(error.message);
	if (!data) return null;
	const route = rowToRoute(data);
	const recipientChanged = route.reportEmail !== reportEmail;
	route.shareToken = shareToken;
	route.stops = stops;
	if (reportEmail) route.reportEmail = reportEmail;
	else delete route.reportEmail;
	if (recipientChanged) delete route.reportSentAt;
	const { error: updateError } = await supabaseAdmin.from("user_routes").update(routeToRow(route)).eq("id", route.id);
	if (updateError) throw new Error(updateError.message);
	return route;
}
async function markSharedStop(token, stopIndex, visited, check) {
	const route = await getRouteByShareToken(token);
	if (!route || !route.stops || !route.stops[stopIndex]) return null;
	const stop = route.stops[stopIndex];
	if (visited) {
		stop.visitedAt = (/* @__PURE__ */ new Date()).toISOString();
		if (check) {
			stop.contact = check.contact;
			stop.comment = check.note;
			stop.checkDistance = Math.round(check.distance);
		}
	} else {
		delete stop.visitedAt;
		delete stop.contact;
		delete stop.checkDistance;
	}
	const { error } = await supabaseAdmin.from("user_routes").update({ stops: route.stops }).eq("id", route.id);
	if (error) throw new Error(error.message);
	return route;
}
async function updateSharedRoute(token, mutate) {
	const route = await getRouteByShareToken(token);
	if (!route || !mutate(route)) return null;
	const { error } = await supabaseAdmin.from("user_routes").update(routeToRow(route)).eq("id", route.id);
	if (error) throw new Error(error.message);
	return route;
}
async function getSavedReportEmails(userId) {
	const { data, error } = await supabaseAdmin.from("user_routes").select("report_email").eq("user_id", userId).not("report_email", "is", null).order("created_at", { ascending: false }).limit(50);
	if (error) throw new Error(error.message);
	const seen = /* @__PURE__ */ new Set();
	const emails = [];
	for (const row of data) {
		const email = row.report_email;
		if (email && !seen.has(email)) {
			seen.add(email);
			emails.push(email);
			if (emails.length >= 10) break;
		}
	}
	return emails;
}
async function rememberReportEmail(_userId, _email) {}
//#endregion
export { deleteUserRouteFromStorage, getRouteByShareToken, getSavedReportEmails, getUserRoutesFromStorage, markSharedStop, rememberReportEmail, saveUserRouteToStorage, setRouteShare, updateSharedRoute };
