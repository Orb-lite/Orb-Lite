import { r as __exportAll } from "../_runtime.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/client.server-CFLkNUaG.js
var client_server_CFLkNUaG_exports = /* @__PURE__ */ __exportAll({
	n: () => supabaseAdmin,
	t: () => client_server_exports
});
var client_server_exports = /* @__PURE__ */ __exportAll$1({ supabaseAdmin: () => supabaseAdmin });
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
function createFallbackAdminClient() {
	const queryBuilder = {
		select: () => queryBuilder,
		insert: () => queryBuilder,
		update: () => queryBuilder,
		delete: () => queryBuilder,
		eq: () => queryBuilder,
		neq: () => queryBuilder,
		in: () => queryBuilder,
		not: () => queryBuilder,
		order: () => queryBuilder,
		limit: () => queryBuilder,
		single: () => Promise.resolve({
			data: null,
			error: null
		}),
		maybeSingle: () => Promise.resolve({
			data: null,
			error: null
		}),
		then: (resolve) => Promise.resolve({
			data: [],
			error: null
		}).then(resolve)
	};
	return {
		from: () => queryBuilder,
		auth: { admin: {
			listUsers: () => Promise.resolve({
				data: { users: [] },
				error: null
			}),
			createUser: () => Promise.resolve({
				data: { user: null },
				error: null
			}),
			updateUserById: () => Promise.resolve({
				data: { user: null },
				error: null
			}),
			deleteUser: () => Promise.resolve({
				data: {},
				error: null
			})
		} }
	};
}
function createSupabaseAdminClient() {
	const SUPABASE_URL = processModule.env["SUPABASE_URL"];
	const SUPABASE_SERVICE_ROLE_KEY = processModule.env["SUPABASE_SERVICE_ROLE_KEY"] || processModule.env["SUPABASE_SECRET_KEY"];
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || SUPABASE_URL.includes("false123.com")) {
		console.warn("[Supabase] Running server in resilient fallback mode (Supabase not configured)");
		return createFallbackAdminClient();
	}
	try {
		return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
			global: { fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY) },
			auth: {
				storage: void 0,
				persistSession: false,
				autoRefreshToken: false
			}
		});
	} catch (err) {
		console.warn("[Supabase] Error initializing admin client, using fallback:", err);
		return createFallbackAdminClient();
	}
}
var _supabaseAdmin;
var supabaseAdmin = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
	return Reflect.get(_supabaseAdmin, prop, receiver);
} });
//#endregion
export { supabaseAdmin as n, client_server_CFLkNUaG_exports as t };
