import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/crm-access.functions-B8dCEmcg.js
var CRM_EMAIL = "ventas@orb-lite.com";
var CODE_TTL_MINUTES = 20;
async function sha256(value) {
	const bytes = new TextEncoder().encode(value);
	const digest = await crypto.subtle.digest("SHA-256", bytes);
	return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function randomCode() {
	const buf = /* @__PURE__ */ new Uint32Array(1);
	crypto.getRandomValues(buf);
	return String(1e5 + buf[0] % 9e5);
}
/**
* Lógica compartida para solicitar un código.
*/
async function triggerCodeRequest() {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: recent } = await supabaseAdmin.from("crm_access_codes").select("created_at").eq("email", CRM_EMAIL).order("created_at", { ascending: false }).limit(1);
	const last = recent?.[0]?.created_at;
	if (last && Date.now() - new Date(last).getTime() < 6e4) return {
		ok: false,
		reason: "espera"
	};
	const code = randomCode();
	const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 6e4).toISOString();
	const { error } = await supabaseAdmin.from("crm_access_codes").insert({
		email: CRM_EMAIL,
		code_hash: await sha256(code),
		expires_at: expiresAt
	});
	if (error) throw new Error(error.message);
	const { sendTemplateEmail } = await import("./send-email-C5luKd1M.mjs").then((n) => n.n);
	await sendTemplateEmail("codigo-acceso-crm", CRM_EMAIL, { templateData: {
		code,
		minutes: CODE_TTL_MINUTES,
		url: `${processModule.env["SITE_URL"] ?? "https://orb-lite.com"}/acceso-crm`
	} });
	return { ok: true };
}
var requestCrmAccessCode_createServerFn_handler = createServerRpc({
	id: "8d67c31c490e062f5e67e0aab136b7a2e6c20f0c45aace7b03232eb57e32ed20",
	name: "requestCrmAccessCode",
	filename: "src/lib/crm-access.functions.ts"
}, (opts) => requestCrmAccessCode.__executeServer(opts));
var requestCrmAccessCode = createServerFn({ method: "POST" }).handler(requestCrmAccessCode_createServerFn_handler, async () => {
	return await triggerCodeRequest();
});
var requestCrmAccessCodeGet_createServerFn_handler = createServerRpc({
	id: "913c9d39d7718198d1fe3b1a99bafcedc2964d3eb11f99f010451fd6eecfd8f7",
	name: "requestCrmAccessCodeGet",
	filename: "src/lib/crm-access.functions.ts"
}, (opts) => requestCrmAccessCodeGet.__executeServer(opts));
var requestCrmAccessCodeGet = createServerFn({ method: "GET" }).handler(requestCrmAccessCodeGet_createServerFn_handler, async () => {
	return await triggerCodeRequest();
});
var redeemCrmAccessCode_createServerFn_handler = createServerRpc({
	id: "ccd89f6097645989bcca7fb9ab8b89542b6ba273fd32e6aba42dc6037eb8b23a",
	name: "redeemCrmAccessCode",
	filename: "src/lib/crm-access.functions.ts"
}, (opts) => redeemCrmAccessCode.__executeServer(opts));
var redeemCrmAccessCode = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	code: stringType().trim().regex(/^\d{6}$/),
	password: stringType().min(8).max(72)
}).parse(data)).handler(redeemCrmAccessCode_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const hash = await sha256(data.code);
	const { data: rows, error: readError } = await supabaseAdmin.from("crm_access_codes").select("id, expires_at, used_at").eq("email", CRM_EMAIL).eq("code_hash", hash).limit(1);
	if (readError) throw new Error(readError.message);
	const row = rows?.[0];
	if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) throw new Error("Código inválido o vencido");
	const { data: listed, error: listError } = await supabaseAdmin.auth.admin.listUsers({
		page: 1,
		perPage: 200
	});
	if (listError) throw new Error(listError.message);
	const existing = listed.users.find((u) => (u.email ?? "").toLowerCase() === CRM_EMAIL);
	if (existing) {
		const { error } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
			password: data.password,
			email_confirm: true
		});
		if (error) throw new Error(error.message);
	} else {
		const { error } = await supabaseAdmin.auth.admin.createUser({
			email: CRM_EMAIL,
			password: data.password,
			email_confirm: true
		});
		if (error) throw new Error(error.message);
	}
	await supabaseAdmin.from("crm_access_codes").update({ used_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", row.id);
	return {
		ok: true,
		email: CRM_EMAIL
	};
});
//#endregion
export { redeemCrmAccessCode_createServerFn_handler, requestCrmAccessCodeGet_createServerFn_handler, requestCrmAccessCode_createServerFn_handler };
