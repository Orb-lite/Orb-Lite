import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as numberType, i as literalType, o as objectType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers.functions-BKpiDukp.js
var contactSchema = objectType({
	fullName: stringType().trim().min(1).max(150),
	phone: stringType().trim().min(1).max(30),
	email: stringType().trim().email().max(150).optional(),
	city: stringType().trim().max(120).optional(),
	state: stringType().trim().max(120).optional(),
	zip: stringType().trim().max(10).optional()
});
var billingSchema = objectType({
	legalName: stringType().trim().min(1).max(200),
	rfc: stringType().trim().min(1).max(20),
	taxRegime: stringType().trim().min(1).max(200),
	cfdiUse: stringType().trim().min(1).max(200),
	fiscalZip: stringType().trim().min(1).max(10),
	email: stringType().trim().email().max(150),
	phone: stringType().trim().min(1).max(30),
	fiscalAddress: stringType().trim().max(250).optional().or(literalType(""))
});
/**
* Subconjunto público y no sensible de un cliente.
* Los datos de contacto, facturación y constancias NO se exponen por número
* de cliente (son fácilmente enumerables); solo se muestran en el CRM
* autenticado o se capturan de nuevo en el checkout.
*/
var lookupCustomer_createServerFn_handler = createServerRpc({
	id: "f6bbcb4ef56e357fba101e5fcf0aad904becee992aea4aa321f9424f69d3cb92",
	name: "lookupCustomer",
	filename: "src/lib/customers.functions.ts"
}, (opts) => lookupCustomer.__executeServer(opts));
var lookupCustomer = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ customerNumber: numberType().int().min(500).max(9999999) }).parse(data)).handler(lookupCustomer_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: row, error } = await supabaseAdmin.from("customers").select("customer_number, full_name, orders_count").eq("customer_number", data.customerNumber).maybeSingle();
	if (error) throw new Error("No se pudo consultar el número de cliente");
	if (!row) return null;
	return {
		customerNumber: row.customer_number,
		firstName: row.full_name.split(" ")[0] ?? row.full_name,
		ordersCount: row.orders_count
	};
});
var saveSchema = objectType({
	customerNumber: numberType().int().min(500).max(9999999).nullish(),
	fullName: stringType().trim().min(1).max(150),
	phone: stringType().trim().min(1).max(30),
	email: stringType().trim().email().max(150).nullish(),
	contact: contactSchema.nullish(),
	billing: billingSchema.nullish(),
	orderId: stringType().trim().min(1).max(64),
	orderTotal: numberType().min(0).max(1e7),
	constancia: objectType({
		path: stringType().trim().min(1).max(400),
		fileName: stringType().trim().min(1).max(200),
		signedUrl: stringType().trim().max(2e3).nullish(),
		uploadedAt: stringType().trim().max(40).nullish()
	}).nullish()
});
function randomCustomerNumber() {
	return 500 + Math.floor(Math.random() * 99500);
}
/**
* Registra la compra en el historial del cliente. Si no llega número de cliente,
* genera uno aleatorio (500 en adelante) y lo devuelve.
*/
var saveCustomerOrder_createServerFn_handler = createServerRpc({
	id: "1b68ef96144dde910f0882847a1c83d5bd507e9297356fd9e7093ad05ccd9fbf",
	name: "saveCustomerOrder",
	filename: "src/lib/customers.functions.ts"
}, (opts) => saveCustomerOrder.__executeServer(opts));
var saveCustomerOrder = createServerFn({ method: "POST" }).inputValidator((data) => saveSchema.parse(data)).handler(saveCustomerOrder_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const payload = {
		full_name: data.fullName,
		phone: data.phone,
		email: data.email ?? data.billing?.email ?? null,
		contact: data.contact ?? null,
		billing: data.billing ?? null,
		last_order_id: data.orderId,
		...data.constancia ? {
			constancia_path: data.constancia.path,
			constancia_file_name: data.constancia.fileName,
			constancia_url: data.constancia.signedUrl ?? null,
			constancia_uploaded_at: data.constancia.uploadedAt ?? (/* @__PURE__ */ new Date()).toISOString()
		} : {}
	};
	if (data.customerNumber) {
		const { data: existing } = await supabaseAdmin.from("customers").select("orders_count, total_spent, billing, contact").eq("customer_number", data.customerNumber).maybeSingle();
		if (existing) {
			const { error } = await supabaseAdmin.from("customers").update({
				...payload,
				contact: payload.contact ?? existing.contact,
				billing: payload.billing ?? existing.billing,
				orders_count: existing.orders_count + 1,
				total_spent: Number(existing.total_spent) + data.orderTotal
			}).eq("customer_number", data.customerNumber);
			if (error) throw new Error("No se pudo actualizar el registro del cliente");
			return {
				customerNumber: data.customerNumber,
				isNew: false
			};
		}
	}
	for (let attempt = 0; attempt < 8; attempt++) {
		const candidate = data.customerNumber ?? randomCustomerNumber();
		const { data: inserted, error } = await supabaseAdmin.from("customers").insert({
			...payload,
			customer_number: candidate,
			orders_count: 1,
			total_spent: data.orderTotal
		}).select("customer_number").single();
		if (!error && inserted) return {
			customerNumber: inserted.customer_number,
			isNew: true
		};
		if (data.customerNumber) throw new Error("No se pudo registrar el cliente");
	}
	throw new Error("No se pudo generar un número de cliente");
});
//#endregion
export { lookupCustomer_createServerFn_handler, saveCustomerOrder_createServerFn_handler };
