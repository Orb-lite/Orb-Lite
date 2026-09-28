import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C_8gbn0n.mjs";
import { a as numberType, n as booleanType, o as objectType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-share.functions-DwDs4Sjb.js
/** Genera (o reutiliza) el enlace público de una ruta guardada del usuario. */
var shareUserRoute = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	userId: numberType().int().nonnegative(),
	routeId: stringType().min(1),
	reportEmail: stringType().trim().email().max(255)
}).parse(input)).handler(createSsrRpc("a017e41fb4c164c2f49ca0692cfec55d24d8a8f990d971e2e72662d2d3946b60"));
/** Vista pública de una ruta compartida (sin iniciar sesión). */
var getSharedRoute = createServerFn({ method: "GET" }).inputValidator((input) => objectType({ token: stringType().min(16) }).parse(input)).handler(createSsrRpc("ce86aeac9fdea824308d52b2ea4866e574f84e4698e5f094baffe14ded37cfad"));
/** Marca o desmarca el check de visita de una parada (público, con el token). */
var markSharedStopVisited = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	token: stringType().min(16),
	stopIndex: numberType().int().min(0),
	visited: booleanType(),
	lat: numberType().min(-90).max(90).optional(),
	lon: numberType().min(-180).max(180).optional(),
	contact: booleanType().optional(),
	note: stringType().trim().max(1e3).optional()
}).parse(input)).handler(createSsrRpc("3d278d72dafd4b34a41faf460470726bdde667cf41acb15501925a7f377c447a"));
/** El operador envía el resumen después de completar y anotar las visitas. */
var finishSharedRoute = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ token: stringType().min(16) }).parse(input)).handler(createSsrRpc("cf3a65597823edd23327e25c1d93097f6b11eb66660f39f71cab58263d1eae24"));
/** Guarda el comentario del operador para una parada. */
var commentSharedStop = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	token: stringType().min(16),
	stopIndex: numberType().int().min(0),
	comment: stringType().max(1e3)
}).parse(input)).handler(createSsrRpc("02a9c6ca9ff633dddd73db0617992091a5c0a98666f4ea6779aa30e4796d24b1"));
/** Correos usados antes por la cuenta para recibir reportes. */
var getReportEmails = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ userId: numberType().int().nonnegative() }).parse(input)).handler(createSsrRpc("03ffddc0dfe95312fe33950c66cb094a34aae3242746c0073c7b65c62e52c813"));
//#endregion
export { markSharedStopVisited as a, getSharedRoute as i, finishSharedRoute as n, shareUserRoute as o, getReportEmails as r, commentSharedStop as t };
