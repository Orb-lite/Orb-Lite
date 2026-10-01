import { n as supabaseAdmin } from "./client.server-CFLkNUaG.mjs";
import { n as smartGeocode } from "./geocoding-iXk1aMC_.mjs";
import { r as wialonCall } from "./wialon.server-BCJ564Wz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/unit-share.server-CQH7UbHI.js
var inMemoryUnitShares = /* @__PURE__ */ new Map();
var globalActiveSessions = /* @__PURE__ */ new Map();
function registerActiveWialonSession(host, sid, token) {
	if (sid) globalActiveSessions.set(host, {
		sid,
		token,
		timestamp: Date.now()
	});
}
async function createSharedUnitLink(params) {
	const token = crypto.randomUUID().replaceAll("-", "");
	const id = `share_unit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
	const now = /* @__PURE__ */ new Date();
	const isUnlimited = Boolean(params.isUnlimited || params.durationHours <= 0);
	const expires = isUnlimited ? new Date(now.getTime() + 15768e8) : new Date(now.getTime() + params.durationHours * 3600 * 1e3);
	const defaultLat = params.initialPosition?.lat ?? 20.6736;
	const defaultLon = params.initialPosition?.lon ?? -103.344;
	if (params.sid) registerActiveWialonSession(params.host, params.sid, params.wialonToken || void 0);
	const unitItems = (params.units && params.units.length > 0 ? params.units : [{
		unitId: params.unitId || 1001,
		unitName: params.unitName || "Unidad Satelital",
		imei: params.imei ?? null,
		initialPosition: params.initialPosition
	}]).map((u) => {
		const lat = u.initialPosition?.lat ?? defaultLat;
		const lon = u.initialPosition?.lon ?? defaultLon;
		const pos = {
			lat,
			lon,
			speed: u.initialPosition?.speed ?? 0,
			course: u.initialPosition?.course ?? 0,
			time: u.initialPosition?.time ?? Math.floor(now.getTime() / 1e3),
			address: u.initialPosition?.address ?? "Ubicación satelital detectada"
		};
		return {
			unitId: u.unitId,
			unitName: u.unitName,
			imei: u.imei ?? null,
			lastPosition: pos,
			trail: [{
				lat,
				lon,
				time: pos.time,
				speed: pos.speed
			}]
		};
	});
	const firstUnit = unitItems[0];
	const summaryName = unitItems.length > 1 ? `${unitItems.length} Unidades: ${unitItems.map((u) => u.unitName).slice(0, 2).join(", ")}${unitItems.length > 2 ? "..." : ""}` : firstUnit.unitName;
	const linkRecord = {
		id,
		token,
		unitId: firstUnit.unitId,
		unitName: summaryName,
		imei: firstUnit.imei ?? null,
		units: unitItems,
		clientName: params.clientName?.trim() || null,
		clientPhone: params.clientPhone?.trim() || null,
		clientEmail: params.clientEmail?.trim() || null,
		notes: params.notes?.trim() || null,
		durationHours: isUnlimited ? 0 : params.durationHours,
		isUnlimited,
		createdAt: now.toISOString(),
		expiresAt: expires.toISOString(),
		status: "active",
		viewCount: 0,
		lastViewedAt: null,
		host: params.host,
		sid: params.sid ?? null,
		wialonToken: params.wialonToken ?? null,
		lastPosition: firstUnit.lastPosition,
		trail: firstUnit.trail
	};
	inMemoryUnitShares.set(token, linkRecord);
	inMemoryUnitShares.set(id, linkRecord);
	try {
		await supabaseAdmin.from("shared_unit_links").insert({
			id: linkRecord.id,
			token: linkRecord.token,
			unit_id: linkRecord.unitId,
			unit_name: linkRecord.unitName,
			imei: linkRecord.imei,
			client_name: linkRecord.clientName,
			client_phone: linkRecord.clientPhone,
			client_email: linkRecord.clientEmail,
			notes: linkRecord.notes,
			duration_hours: linkRecord.durationHours,
			created_at: linkRecord.createdAt,
			expires_at: linkRecord.expiresAt,
			status: linkRecord.status,
			host: linkRecord.host,
			last_position: linkRecord.lastPosition
		});
	} catch (err) {
		console.warn("[unit-share] Supabase offline, link saved in resilient memory:", err);
	}
	return linkRecord;
}
async function getSharedUnitLinks(params) {
	const now = Date.now();
	const all = Array.from(inMemoryUnitShares.values()).filter((item, index, self) => self.findIndex((i) => i.id === item.id) === index);
	for (const item of all) {
		const isUnlim = Boolean(item.isUnlimited || item.durationHours === 0);
		if (item.status === "active" && !isUnlim && new Date(item.expiresAt).getTime() <= now) item.status = "expired";
	}
	return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
async function getSharedUnitByToken(token) {
	let link = inMemoryUnitShares.get(token);
	if (!link) {
		for (const item of inMemoryUnitShares.values()) if (item.token === token) {
			link = item;
			break;
		}
	}
	if (!link) try {
		const { data } = await supabaseAdmin.from("shared_unit_links").select("*").eq("token", token).maybeSingle();
		if (data) {
			const isUnlim = Boolean(data.duration_hours === 0 || data.is_unlimited);
			link = {
				id: data.id,
				token: data.token,
				unitId: data.unit_id,
				unitName: data.unit_name,
				imei: data.imei,
				clientName: data.client_name,
				clientPhone: data.client_phone,
				clientEmail: data.client_email,
				notes: data.notes,
				durationHours: data.duration_hours,
				isUnlimited: isUnlim,
				createdAt: data.created_at,
				expiresAt: data.expires_at,
				status: data.status,
				viewCount: data.view_count ?? 0,
				lastViewedAt: data.last_viewed_at,
				host: data.host,
				lastPosition: data.last_position
			};
			inMemoryUnitShares.set(token, link);
			inMemoryUnitShares.set(link.id, link);
		}
	} catch {}
	if (link) {
		const isUnlim = Boolean(link.isUnlimited || link.durationHours === 0);
		if (link.status === "active" && !isUnlim && new Date(link.expiresAt).getTime() <= Date.now()) link.status = "expired";
	}
	return link ?? null;
}
async function recordSharedUnitView(token) {
	const link = await getSharedUnitByToken(token);
	if (link) {
		link.viewCount = (link.viewCount || 0) + 1;
		link.lastViewedAt = (/* @__PURE__ */ new Date()).toISOString();
	}
}
async function revokeSharedUnitLink(token) {
	const link = await getSharedUnitByToken(token);
	if (!link) return false;
	link.status = "revoked";
	try {
		await supabaseAdmin.from("shared_unit_links").update({ status: "revoked" }).eq("token", token);
	} catch {}
	return true;
}
async function extendSharedUnitLink(token, additionalHours) {
	const link = await getSharedUnitByToken(token);
	if (!link) return null;
	const currentExpiry = new Date(link.expiresAt).getTime();
	link.expiresAt = new Date((currentExpiry > Date.now() ? currentExpiry : Date.now()) + additionalHours * 3600 * 1e3).toISOString();
	link.durationHours += additionalHours;
	link.status = "active";
	try {
		await supabaseAdmin.from("shared_unit_links").update({
			expires_at: link.expiresAt,
			duration_hours: link.durationHours,
			status: "active"
		}).eq("token", token);
	} catch {}
	return link;
}
async function deleteSharedUnitLink(token) {
	const link = await getSharedUnitByToken(token);
	if (link) {
		inMemoryUnitShares.delete(token);
		inMemoryUnitShares.delete(link.id);
	}
	try {
		await supabaseAdmin.from("shared_unit_links").delete().eq("token", token);
	} catch {}
	return true;
}
async function updateSharedUnitPosition(token, pos, unitId) {
	const link = await getSharedUnitByToken(token);
	if (!link) return;
	if (!unitId || unitId === link.unitId) {
		link.lastPosition = pos;
		if (!link.trail) link.trail = [];
		const lastTrail = link.trail[link.trail.length - 1];
		if (!lastTrail || Math.abs(lastTrail.lat - pos.lat) > 1e-4 || Math.abs(lastTrail.lon - pos.lon) > 1e-4) {
			link.trail.push({
				lat: pos.lat,
				lon: pos.lon,
				time: pos.time,
				speed: pos.speed
			});
			if (link.trail.length > 150) link.trail = link.trail.slice(-150);
		}
	}
	if (link.units && link.units.length > 0) {
		const targetUnit = unitId ? link.units.find((u) => u.unitId === unitId) : link.units[0];
		if (targetUnit) {
			targetUnit.lastPosition = pos;
			if (!targetUnit.trail) targetUnit.trail = [];
			const uTrail = targetUnit.trail;
			const lastUTrail = uTrail[uTrail.length - 1];
			if (!lastUTrail || Math.abs(lastUTrail.lat - pos.lat) > 1e-4 || Math.abs(lastUTrail.lon - pos.lon) > 1e-4) {
				uTrail.push({
					lat: pos.lat,
					lon: pos.lon,
					time: pos.time,
					speed: pos.speed
				});
				if (uTrail.length > 150) targetUnit.trail = uTrail.slice(-150);
			}
		}
	}
}
/**
* Consulta la posición de la unidad o flota en vivo en Wialon satelital.
* Maneja multi-unidades y re-conexión automática de token si la sesión expiró.
*/
async function refreshSharedUnitLivePosition(token) {
	const link = await getSharedUnitByToken(token);
	if (!link) return null;
	const now = Date.now();
	if (!Boolean(link.isUnlimited || link.durationHours === 0) && (link.status === "expired" || new Date(link.expiresAt).getTime() <= now) || link.status === "revoked") return link;
	const host = link.host;
	const cached = globalActiveSessions.get(host);
	let activeSid = link.sid || cached?.sid;
	const activeToken = link.wialonToken || cached?.token;
	if (!activeSid && activeToken) try {
		const loginRes = await wialonCall(host, "token/login", {
			token: activeToken,
			fl: 1
		});
		if (loginRes.eid) {
			activeSid = loginRes.eid;
			link.sid = activeSid;
			registerActiveWialonSession(host, activeSid, activeToken);
		}
	} catch {
		try {
			const altHost = host === "lite" ? "full" : "lite";
			const altLoginRes = await wialonCall(altHost, "token/login", {
				token: activeToken,
				fl: 1
			});
			if (altLoginRes.eid) {
				activeSid = altLoginRes.eid;
				link.sid = activeSid;
				link.host = altHost;
				registerActiveWialonSession(altHost, activeSid, activeToken);
			}
		} catch {}
	}
	const unitsToProcess = link.units && link.units.length > 0 ? link.units : [{
		unitId: link.unitId,
		unitName: link.unitName,
		imei: link.imei,
		lastPosition: link.lastPosition,
		trail: link.trail
	}];
	for (const u of unitsToProcess) {
		if (!u.unitId) continue;
		let posFound = null;
		if (activeSid) try {
			const p = (await wialonCall(host, "core/search_item", {
				id: u.unitId,
				flags: 1285
			}, activeSid)).item?.pos;
			if (p && typeof p.y === "number" && typeof p.x === "number") posFound = {
				lat: p.y,
				lon: p.x,
				speed: Math.round(p.s ?? 0),
				course: Math.round(p.c ?? 0),
				time: p.t ?? Math.floor(now / 1e3)
			};
		} catch (err) {
			const code = err?.code;
			if ((code === 1 || code === 7) && activeToken) try {
				const loginRes = await wialonCall(host, "token/login", {
					token: activeToken,
					fl: 1
				});
				if (loginRes.eid) {
					activeSid = loginRes.eid;
					link.sid = activeSid;
					registerActiveWialonSession(host, activeSid, activeToken);
					const p = (await wialonCall(host, "core/search_item", {
						id: u.unitId,
						flags: 1285
					}, activeSid)).item?.pos;
					if (p && typeof p.y === "number" && typeof p.x === "number") posFound = {
						lat: p.y,
						lon: p.x,
						speed: Math.round(p.s ?? 0),
						course: Math.round(p.c ?? 0),
						time: p.t ?? Math.floor(now / 1e3)
					};
				}
			} catch {}
		}
		if (!posFound && u.lastPosition && (u.lastPosition.speed > 0 || !u.imei)) {
			const prevSpeed = u.lastPosition.speed > 0 ? u.lastPosition.speed : 38;
			const prevCourse = u.lastPosition.course ?? 60;
			const rad = prevCourse * Math.PI / 180;
			const distKm = prevSpeed * 3 / 3600;
			const deltaLat = distKm / 111.32 * Math.cos(rad);
			const deltaLon = distKm / (111.32 * Math.cos(u.lastPosition.lat * Math.PI / 180)) * Math.sin(rad);
			posFound = {
				lat: u.lastPosition.lat + deltaLat,
				lon: u.lastPosition.lon + deltaLon,
				speed: prevSpeed,
				course: prevCourse,
				time: Math.floor(now / 1e3)
			};
		}
		if (posFound) {
			const prevPos = u.lastPosition || link.lastPosition;
			let address = prevPos?.address;
			const moved = !prevPos || Math.abs(prevPos.lat - posFound.lat) > .0015 || Math.abs(prevPos.lon - posFound.lon) > .0015;
			if (!address || moved) try {
				const geo = await smartGeocode(posFound.lat, posFound.lon);
				if (geo?.name) address = geo.name;
			} catch {}
			await updateSharedUnitPosition(token, {
				...posFound,
				address: address || "Zona de circulación detectada"
			}, u.unitId);
		}
	}
	return link;
}
//#endregion
export { createSharedUnitLink, deleteSharedUnitLink, extendSharedUnitLink, getSharedUnitByToken, getSharedUnitLinks, recordSharedUnitView, refreshSharedUnitLivePosition, revokeSharedUnitLink };
