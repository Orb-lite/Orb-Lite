import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C6PhiXEn.mjs";
import { a as literalType, i as enumType, l as stringType, n as arrayType, o as numberType, r as booleanType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/unit-share.functions-C6x0SiHr.js
/** Crea un nuevo enlace temporal para compartir una o varias unidades. */
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
}).parse(input)).handler(createSsrRpc("4b294df1e6e0a32813b556058283bf6a68e19fb7ab5e5d8d6accc2c96196d3e9"));
/** Lista todos los enlaces temporales creados. */
var listUnitShares = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	host: enumType(["lite", "full"]).optional(),
	sid: stringType().optional()
}).optional().default({})).handler(createSsrRpc("bc997bc5f9774309d6207b86453fd5081c8c5be49e665a5939c57b638fa439a4"));
/** Revoca / invalida un enlace temporal. */
var revokeUnitShare = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ token: stringType().min(16) }).parse(input)).handler(createSsrRpc("aa239466b5759eff5ba68135a45b1859ca1a16b3f4554dd9923ab13fd0402d19"));
/** Extiende la duración de un enlace temporal. */
var extendUnitShare = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	token: stringType().min(16),
	hours: numberType().min(1).max(168)
}).parse(input)).handler(createSsrRpc("8477b5d621f2e47712afed911aef93e0e3d5dfa295f67d2348dc1ec05932e41c"));
/** Elimina un enlace temporal del historial. */
var deleteUnitShare = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ token: stringType().min(16) }).parse(input)).handler(createSsrRpc("e9f3f39e790b66e4f678f1c63d1f05eeeb783b97fae1e2e777daa04dc1a44c84"));
/**
* Consulta pública de rastreo en vivo de una unidad compartida.
* No requiere inicio de sesión.
*/
var getPublicUnitTracking = createServerFn({ method: "GET" }).inputValidator((input) => objectType({ token: stringType().min(16) }).parse(input)).handler(createSsrRpc("78322077373cfd98d895ad3458c2613e6de212a615bea1c67ecb526327902d5c"));
//#endregion
export { listUnitShares as a, getPublicUnitTracking as i, deleteUnitShare as n, revokeUnitShare as o, extendUnitShare as r, createUnitShare as t };
