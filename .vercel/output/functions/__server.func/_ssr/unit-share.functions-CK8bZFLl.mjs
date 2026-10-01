import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as literalType, i as enumType, l as stringType, n as arrayType, o as numberType, r as booleanType, s as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { createSharedUnitLink, deleteSharedUnitLink, extendSharedUnitLink, getSharedUnitByToken, getSharedUnitLinks, recordSharedUnitView, refreshSharedUnitLivePosition, revokeSharedUnitLink } from "./unit-share.server-CQH7UbHI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/unit-share.functions-CK8bZFLl.js
var createUnitShare_createServerFn_handler = createServerRpc({
	id: "4b294df1e6e0a32813b556058283bf6a68e19fb7ab5e5d8d6accc2c96196d3e9",
	name: "createUnitShare",
	filename: "src/lib/unit-share.functions.ts"
}, (opts) => createUnitShare.__executeServer(opts));
var createUnitShare = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	unitId: numberType().int().optional(),
	unitName: stringType().trim().min(1).max(100).optional(),
	imei: stringType().trim().optional().nullable(),
	units: arrayType(objectType({
		unitId: numberType().int(),
		unitName: stringType().trim().min(1),
		imei: stringType().trim().optional().nullable(),
		initialPosition: objectType({
			lat: numberType(),
			lon: numberType(),
			speed: numberType().optional(),
			course: numberType().optional(),
			time: numberType().optional(),
			address: stringType().optional()
		}).optional().nullable()
	})).optional(),
	clientName: stringType().trim().max(100).optional().nullable(),
	clientPhone: stringType().trim().max(30).optional().nullable(),
	clientEmail: stringType().trim().email().optional().nullable().or(literalType("")),
	notes: stringType().trim().max(250).optional().nullable(),
	durationHours: numberType().min(0).max(999999).default(24),
	isUnlimited: booleanType().optional().default(false),
	host: enumType(["lite", "full"]).default("lite"),
	sid: stringType().optional().nullable(),
	wialonToken: stringType().optional().nullable(),
	initialPosition: objectType({
		lat: numberType(),
		lon: numberType(),
		speed: numberType().optional(),
		course: numberType().optional(),
		time: numberType().optional(),
		address: stringType().optional()
	}).optional().nullable()
}).parse(input)).handler(createUnitShare_createServerFn_handler, async ({ data }) => {
	const link = await createSharedUnitLink({
		unitId: data.unitId,
		unitName: data.unitName,
		imei: data.imei,
		units: data.units,
		clientName: data.clientName,
		clientPhone: data.clientPhone,
		clientEmail: data.clientEmail || null,
		notes: data.notes,
		durationHours: data.isUnlimited ? 0 : data.durationHours,
		isUnlimited: data.isUnlimited || data.durationHours === 0,
		host: data.host,
		sid: data.sid,
		wialonToken: data.wialonToken,
		initialPosition: data.initialPosition
	});
	return {
		success: true,
		link,
		url: `/rastreo/${link.token}`
	};
});
var listUnitShares_createServerFn_handler = createServerRpc({
	id: "bc997bc5f9774309d6207b86453fd5081c8c5be49e665a5939c57b638fa439a4",
	name: "listUnitShares",
	filename: "src/lib/unit-share.functions.ts"
}, (opts) => listUnitShares.__executeServer(opts));
var listUnitShares = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	host: enumType(["lite", "full"]).optional(),
	sid: stringType().optional()
}).optional().default({})).handler(listUnitShares_createServerFn_handler, async ({ data }) => {
	return { links: await getSharedUnitLinks(data) };
});
var revokeUnitShare_createServerFn_handler = createServerRpc({
	id: "aa239466b5759eff5ba68135a45b1859ca1a16b3f4554dd9923ab13fd0402d19",
	name: "revokeUnitShare",
	filename: "src/lib/unit-share.functions.ts"
}, (opts) => revokeUnitShare.__executeServer(opts));
var revokeUnitShare = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ token: stringType().min(16) }).parse(input)).handler(revokeUnitShare_createServerFn_handler, async ({ data }) => {
	return { success: await revokeSharedUnitLink(data.token) };
});
var extendUnitShare_createServerFn_handler = createServerRpc({
	id: "8477b5d621f2e47712afed911aef93e0e3d5dfa295f67d2348dc1ec05932e41c",
	name: "extendUnitShare",
	filename: "src/lib/unit-share.functions.ts"
}, (opts) => extendUnitShare.__executeServer(opts));
var extendUnitShare = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	token: stringType().min(16),
	hours: numberType().min(1).max(168)
}).parse(input)).handler(extendUnitShare_createServerFn_handler, async ({ data }) => {
	const updated = await extendSharedUnitLink(data.token, data.hours);
	return {
		success: Boolean(updated),
		link: updated
	};
});
var deleteUnitShare_createServerFn_handler = createServerRpc({
	id: "e9f3f39e790b66e4f678f1c63d1f05eeeb783b97fae1e2e777daa04dc1a44c84",
	name: "deleteUnitShare",
	filename: "src/lib/unit-share.functions.ts"
}, (opts) => deleteUnitShare.__executeServer(opts));
var deleteUnitShare = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ token: stringType().min(16) }).parse(input)).handler(deleteUnitShare_createServerFn_handler, async ({ data }) => {
	return { success: await deleteSharedUnitLink(data.token) };
});
var getPublicUnitTracking_createServerFn_handler = createServerRpc({
	id: "78322077373cfd98d895ad3458c2613e6de212a615bea1c67ecb526327902d5c",
	name: "getPublicUnitTracking",
	filename: "src/lib/unit-share.functions.ts"
}, (opts) => getPublicUnitTracking.__executeServer(opts));
var getPublicUnitTracking = createServerFn({ method: "GET" }).inputValidator((input) => objectType({ token: stringType().min(16) }).parse(input)).handler(getPublicUnitTracking_createServerFn_handler, async ({ data }) => {
	const link = await refreshSharedUnitLivePosition(data.token) ?? await getSharedUnitByToken(data.token);
	if (!link) throw new Error("El enlace de rastreo no existe o fue eliminado.");
	await recordSharedUnitView(data.token);
	const now = Date.now();
	const isUnlimited = Boolean(link.isUnlimited || link.durationHours === 0);
	const expiryTime = new Date(link.expiresAt).getTime();
	const remainingSeconds = isUnlimited ? -1 : Math.max(0, Math.floor((expiryTime - now) / 1e3));
	const isExpired = !isUnlimited && (remainingSeconds <= 0 || link.status === "expired");
	const isRevoked = link.status === "revoked";
	const currentPos = link.lastPosition ?? {
		lat: 20.6736,
		lon: -103.344,
		speed: 0,
		course: 0,
		time: Math.floor(now / 1e3),
		address: "Zona Metropolitana de Guadalajara, Jal."
	};
	const posTimestampMs = currentPos.time > 1e10 ? currentPos.time : currentPos.time * 1e3;
	const lastPingAgoSeconds = Math.max(0, Math.floor((now - posTimestampMs) / 1e3));
	const unitsList = (link.units && link.units.length > 0 ? link.units : [{
		unitId: link.unitId,
		unitName: link.unitName,
		imei: link.imei,
		lastPosition: link.lastPosition,
		trail: link.trail
	}]).map((u) => {
		const pos = u.lastPosition ?? currentPos;
		return {
			unitId: u.unitId,
			unitName: u.unitName,
			imei: u.imei,
			position: {
				lat: pos.lat,
				lon: pos.lon,
				speed: pos.speed ?? 0,
				course: pos.course ?? 0,
				time: pos.time ?? Math.floor(now / 1e3),
				address: pos.address || "Coordenadas satelitales en vivo",
				isMoving: (pos.speed ?? 0) > 3
			},
			trail: u.trail && u.trail.length > 0 ? u.trail : [{
				lat: pos.lat,
				lon: pos.lon,
				time: pos.time,
				speed: pos.speed
			}]
		};
	});
	const primaryUnit = unitsList[0];
	return {
		token: link.token,
		unitName: link.unitName,
		units: unitsList,
		clientName: link.clientName,
		notes: link.notes,
		expiresAt: link.expiresAt,
		remainingSeconds,
		isExpired,
		isRevoked,
		isUnlimited,
		status: isRevoked ? "revoked" : isExpired ? "expired" : "active",
		isLive: !isExpired && !isRevoked,
		lastPingAgoSeconds,
		position: primaryUnit.position,
		trail: primaryUnit.trail
	};
});
//#endregion
export { createUnitShare_createServerFn_handler, deleteUnitShare_createServerFn_handler, extendUnitShare_createServerFn_handler, getPublicUnitTracking_createServerFn_handler, listUnitShares_createServerFn_handler, revokeUnitShare_createServerFn_handler };
