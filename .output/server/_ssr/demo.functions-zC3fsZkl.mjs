import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { i as literalType, o as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/demo.functions-zC3fsZkl.js
/** Solicitud pública de demo — se guarda para revisarla en el CRM. No envía correo al cliente. */
var createDemoRequest_createServerFn_handler = createServerRpc({
	id: "618788924f8338c298f7afde349474273ad890daa439707988b4ae20dda43a27",
	name: "createDemoRequest",
	filename: "src/lib/demo.functions.ts"
}, (opts) => createDemoRequest.__executeServer(opts));
var createDemoRequest = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	firstName: stringType().trim().min(2).max(80),
	lastName: stringType().trim().min(2).max(80),
	phone: stringType().trim().min(8).max(25),
	email: stringType().trim().email().max(200),
	company: stringType().trim().max(150).optional().or(literalType("")),
	platform: enumType(["wialon_lite", "wialon_full"]).default("wialon_lite"),
	units: stringType().trim().max(30).optional().or(literalType("")),
	message: stringType().trim().max(1e3).optional().or(literalType(""))
}).parse(data)).handler(createDemoRequest_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { error } = await supabaseAdmin.from("demo_requests").insert({
		first_name: data.firstName,
		last_name: data.lastName,
		phone: data.phone,
		email: data.email.toLowerCase(),
		company: data.company?.trim() || null,
		platform: data.platform,
		units: data.units?.trim() || null,
		message: data.message?.trim() || null,
		status: "pendiente"
	});
	if (error) throw new Error("No se pudo registrar la solicitud. Inténtalo de nuevo.");
	return { ok: true };
});
//#endregion
export { createDemoRequest_createServerFn_handler };
