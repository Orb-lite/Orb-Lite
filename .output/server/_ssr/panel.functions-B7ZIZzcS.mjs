import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { i as enumType, l as stringType, s as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/panel.functions-B7ZIZzcS.js
var STATUSES = [
	"pendiente",
	"vendido",
	"no_vendido"
];
function assertToken(token) {
	const expected = processModule.env["ADMIN_PANEL_TOKEN"];
	if (!expected) throw new Error("Panel no configurado");
	if (token !== expected) throw new Error("No autorizado");
}
var listSolicitudes_createServerFn_handler = createServerRpc({
	id: "2c2a2b41a2e18ad9332a41ab7e76e5b4ca9f44f2ec81e6eae1a97bb0aef9dd19",
	name: "listSolicitudes",
	filename: "src/lib/panel.functions.ts"
}, (opts) => listSolicitudes.__executeServer(opts));
var listSolicitudes = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: stringType().min(8),
	status: enumType(["todas", ...STATUSES]).default("todas")
}).parse(data)).handler(listSolicitudes_createServerFn_handler, async ({ data }) => {
	assertToken(data.token);
	const { supabaseAdmin } = await import("./client.server-CFLkNUaG.mjs").then((n) => n.t).then((n) => n.t);
	let query = supabaseAdmin.from("solicitudes").select("id, order_id, customer_number, full_name, phone, email, items, shipping_label, wants_invoice, total, status, notes, created_at").order("created_at", { ascending: false }).limit(300);
	if (data.status !== "todas") query = query.eq("status", data.status);
	const { data: rows, error } = await query;
	if (error) throw new Error(error.message);
	return { rows: rows ?? [] };
});
var updateSolicitudStatus_createServerFn_handler = createServerRpc({
	id: "ddb6b935ede199b55f33bdbf8ee7e197e4001cd13875e7a645c5501cccf00bfd",
	name: "updateSolicitudStatus",
	filename: "src/lib/panel.functions.ts"
}, (opts) => updateSolicitudStatus.__executeServer(opts));
var updateSolicitudStatus = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: stringType().min(8),
	id: stringType().uuid(),
	status: enumType(STATUSES),
	notes: stringType().max(2e3).nullish()
}).parse(data)).handler(updateSolicitudStatus_createServerFn_handler, async ({ data }) => {
	assertToken(data.token);
	const { supabaseAdmin } = await import("./client.server-CFLkNUaG.mjs").then((n) => n.t).then((n) => n.t);
	const { error } = await supabaseAdmin.from("solicitudes").update({
		status: data.status,
		notes: data.notes ?? null,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var setCrmPassword_createServerFn_handler = createServerRpc({
	id: "a93689bdc94046f106d015e830faac2b62667ca616fcc9111cb6111f642f1e33",
	name: "setCrmPassword",
	filename: "src/lib/panel.functions.ts"
}, (opts) => setCrmPassword.__executeServer(opts));
var setCrmPassword = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: stringType().min(8),
	password: stringType().min(8).max(72)
}).parse(data)).handler(setCrmPassword_createServerFn_handler, async ({ data }) => {
	assertToken(data.token);
	const email = "ventas@orb-lite.com";
	const { supabaseAdmin } = await import("./client.server-CFLkNUaG.mjs").then((n) => n.t).then((n) => n.t);
	const { data: listed, error: listError } = await supabaseAdmin.auth.admin.listUsers({
		page: 1,
		perPage: 200
	});
	if (listError) throw new Error(listError.message);
	const existing = listed.users.find((u) => (u.email ?? "").toLowerCase() === email);
	if (existing) {
		const { error } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
			password: data.password,
			email_confirm: true
		});
		if (error) throw new Error(error.message);
		return {
			ok: true,
			created: false
		};
	}
	const { error } = await supabaseAdmin.auth.admin.createUser({
		email,
		password: data.password,
		email_confirm: true
	});
	if (error) throw new Error(error.message);
	return {
		ok: true,
		created: true
	};
});
//#endregion
export { listSolicitudes_createServerFn_handler, setCrmPassword_createServerFn_handler, updateSolicitudStatus_createServerFn_handler };
