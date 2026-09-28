import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as numberType, i as literalType, n as booleanType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BpbeoxIM.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.functions-BHF_bVXq.js
var STATUSES = [
	"pendiente",
	"vendido",
	"no_vendido"
];
var CRM_EMAIL = "ventas@orb-lite.com";
function assertCrmUser(claims) {
	if (String(claims?.email ?? "").toLowerCase() !== CRM_EMAIL) throw new Error("Acceso restringido");
}
var crmListSolicitudes_createServerFn_handler = createServerRpc({
	id: "36337e2ff83dd9dd28ec84d0f627b2323e0dc3d903b83025c505036555bbe96d",
	name: "crmListSolicitudes",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmListSolicitudes.__executeServer(opts));
var crmListSolicitudes = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ status: enumType(["todas", ...STATUSES]).default("todas") }).parse(data)).handler(crmListSolicitudes_createServerFn_handler, async ({ data, context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	let query = supabaseAdmin.from("solicitudes").select("id, order_id, customer_number, full_name, phone, email, items, shipping_label, wants_invoice, billing, total, status, notes, created_at").order("created_at", { ascending: false }).limit(300);
	if (data.status !== "todas") query = query.eq("status", data.status);
	const { data: rows, error } = await query;
	if (error) throw new Error(error.message);
	return { rows: rows ?? [] };
});
var crmUpdateSolicitud_createServerFn_handler = createServerRpc({
	id: "8cde57323c3e7ec8ae60e6398741c3320f9b3828433f1dfbb16d2e2869a75fee",
	name: "crmUpdateSolicitud",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmUpdateSolicitud.__executeServer(opts));
var crmUpdateSolicitud = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	id: stringType().uuid(),
	status: enumType(STATUSES),
	notes: stringType().max(2e3).nullish()
}).parse(data)).handler(crmUpdateSolicitud_createServerFn_handler, async ({ data, context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { error } = await supabaseAdmin.from("solicitudes").update({
		status: data.status,
		notes: data.notes ?? null,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var crmListCustomers_createServerFn_handler = createServerRpc({
	id: "c473fefcae172c2602d2f1a0e4eb7b9cccc0768670f34cc11a0de11a9314850f",
	name: "crmListCustomers",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmListCustomers.__executeServer(opts));
var crmListCustomers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(crmListCustomers_createServerFn_handler, async ({ context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: rows, error } = await supabaseAdmin.from("customers").select("id, customer_number, full_name, phone, email, contact, billing, orders_count, total_spent, last_order_id, created_at, updated_at").order("customer_number", { ascending: true }).limit(500);
	if (error) throw new Error(error.message);
	const { data: sols, error: solError } = await supabaseAdmin.from("solicitudes").select("customer_number, status, total, created_at").not("customer_number", "is", null).limit(5e3);
	if (solError) throw new Error(solError.message);
	const agg = /* @__PURE__ */ new Map();
	for (const s of sols ?? []) {
		const key = Number(s.customer_number);
		const cur = agg.get(key) ?? {
			first_order_at: null,
			pending: 0,
			pending_total: 0,
			orders: 0,
			total: 0
		};
		cur.orders += 1;
		cur.total += Number(s.total ?? 0);
		if (s.status === "pendiente") {
			cur.pending += 1;
			cur.pending_total += Number(s.total ?? 0);
		}
		if (!cur.first_order_at || new Date(s.created_at) < new Date(cur.first_order_at)) cur.first_order_at = s.created_at;
		agg.set(key, cur);
	}
	return { rows: (rows ?? []).map((r) => {
		const a = agg.get(Number(r.customer_number));
		return {
			...r,
			first_order_at: a?.first_order_at ?? r.created_at,
			pending_count: a?.pending ?? 0,
			pending_total: a?.pending_total ?? 0,
			solicitudes_count: a?.orders ?? 0
		};
	}) };
});
var saleRenewalSchema = objectType({
	fullName: stringType().trim().max(120).optional().or(literalType("")),
	unitName: stringType().trim().max(120).optional().or(literalType("")),
	imei: stringType().trim().max(25).optional().or(literalType("")),
	iccid: stringType().trim().max(25).optional().or(literalType("")),
	simPhone: stringType().trim().max(25).optional().or(literalType(""))
});
var saleItemSchema = objectType({
	variantId: stringType().min(1),
	customName: stringType().trim().max(200).optional().or(literalType("")),
	quantity: numberType().int().min(1).max(100),
	unitPrice: numberType().finite().min(0).max(1e7),
	renewal: saleRenewalSchema.nullish()
});
var manualBillingSchema = objectType({
	legalName: stringType().trim().min(1).max(200),
	rfc: stringType().trim().min(1).max(20),
	taxRegime: stringType().trim().max(200).optional().or(literalType("")),
	cfdiUse: stringType().trim().max(200).optional().or(literalType("")),
	fiscalZip: stringType().trim().max(10).optional().or(literalType("")),
	email: stringType().trim().max(150).optional().or(literalType("")),
	phone: stringType().trim().max(30).optional().or(literalType("")),
	fiscalAddress: stringType().trim().max(250).optional().or(literalType(""))
});
function randomCustomerNumber() {
	return 500 + Math.floor(Math.random() * 99500);
}
async function upsertCustomerRecord(supabaseAdmin, input) {
	const payload = {
		full_name: input.fullName,
		phone: input.phone,
		email: input.email ?? null,
		...input.contact ? { contact: input.contact } : {},
		...input.billing ? { billing: input.billing } : {},
		...input.orderId ? { last_order_id: input.orderId } : {}
	};
	const orderTotal = input.orderTotal ?? 0;
	const counts = input.orderId ? 1 : 0;
	if (input.customerNumber) {
		const { data: existing } = await supabaseAdmin.from("customers").select("orders_count, total_spent, billing, contact").eq("customer_number", input.customerNumber).maybeSingle();
		if (existing) {
			const { error } = await supabaseAdmin.from("customers").update({
				...payload,
				contact: input.contact ?? existing.contact,
				billing: input.billing ?? existing.billing,
				orders_count: Number(existing.orders_count ?? 0) + counts,
				total_spent: Number(existing.total_spent ?? 0) + orderTotal,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("customer_number", input.customerNumber);
			if (error) throw new Error(error.message);
			return {
				customerNumber: input.customerNumber,
				isNew: false
			};
		}
	}
	for (let attempt = 0; attempt < 8; attempt++) {
		const candidate = input.customerNumber ?? randomCustomerNumber();
		const { data: inserted, error } = await supabaseAdmin.from("customers").insert({
			...payload,
			customer_number: candidate,
			orders_count: counts,
			total_spent: orderTotal
		}).select("customer_number").single();
		if (!error && inserted) return {
			customerNumber: inserted.customer_number,
			isNew: true
		};
		if (input.customerNumber) throw new Error("No se pudo registrar el cliente");
	}
	throw new Error("No se pudo generar un número de cliente");
}
/** Registra una venta hecha fuera de la página (WhatsApp, mostrador, teléfono). */
var crmCreateSale_createServerFn_handler = createServerRpc({
	id: "6bb535daab1a9c858483ed524626ddf26bc7dfcf25459abfd16ce214d0c79818",
	name: "crmCreateSale",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmCreateSale.__executeServer(opts));
var crmCreateSale = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	customerNumber: numberType().int().min(500).max(9999999).nullish(),
	fullName: stringType().trim().min(1).max(150),
	phone: stringType().trim().min(1).max(30),
	email: stringType().trim().email().max(150).nullish(),
	city: stringType().trim().max(120).optional().or(literalType("")),
	state: stringType().trim().max(120).optional().or(literalType("")),
	zip: stringType().trim().max(10).optional().or(literalType("")),
	items: arrayType(saleItemSchema).min(1).max(50),
	shippingId: enumType(["local", "national"]),
	wantsInvoice: booleanType().default(false),
	billing: manualBillingSchema.nullish(),
	status: enumType(STATUSES).default("vendido"),
	addIva: booleanType().default(false),
	notes: stringType().trim().max(2e3).nullish(),
	channel: stringType().trim().max(60).optional().or(literalType(""))
}).parse(data)).handler(crmCreateSale_createServerFn_handler, async ({ data, context }) => {
	assertCrmUser(context.claims);
	const { IVA_RATE, SHIPPING_OPTIONS, findVariant } = await import("./catalog-BhuVKh9L.mjs").then((n) => n.o).then((n) => n.o);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const shipping = SHIPPING_OPTIONS.find((s) => s.id === data.shippingId) ?? SHIPPING_OPTIONS[0];
	let productsTotal = 0;
	const lines = data.items.flatMap((item) => {
		const lineTotal = item.unitPrice * item.quantity;
		const isCustom = item.variantId === "__custom__";
		const found = isCustom ? null : findVariant(item.variantId);
		if (!isCustom && !found) return [];
		const customName = (item.customName ?? "").trim();
		if (isCustom && customName.length === 0) return [];
		const r = item.renewal ?? null;
		const renewalEntries = r ? Object.entries(r).filter(([, v]) => typeof v === "string" && v.trim().length > 0) : [];
		const renewalData = !isCustom && found.product.category === "RENOVATION" && renewalEntries.length > 0 ? Object.fromEntries(renewalEntries.map(([k, v]) => [k, String(v).trim()])) : null;
		productsTotal += lineTotal;
		return [{
			variantName: isCustom ? customName : found.variant.name,
			title: isCustom ? "Producto personalizado" : found.product.title,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			lineTotal,
			addOns: [],
			isRenewal: isCustom ? false : found.product.category === "RENOVATION",
			renewal: renewalData
		}];
	});
	if (lines.length === 0) throw new Error("Selecciona al menos un producto válido");
	const subtotal = productsTotal + shipping.price;
	const total = data.addIva ? Math.round(subtotal * (1 + IVA_RATE) * 100) / 100 : subtotal;
	const orderId = `MAN-${Date.now().toString(36).toUpperCase()}`;
	const channel = data.channel && data.channel.length > 0 ? data.channel : "Venta directa";
	const contact = {
		fullName: data.fullName,
		phone: data.phone,
		...data.email ? { email: data.email } : {},
		...data.city ? { city: data.city } : {},
		...data.state ? { state: data.state } : {},
		...data.zip ? { zip: data.zip } : {}
	};
	const { customerNumber, isNew } = await upsertCustomerRecord(supabaseAdmin, {
		customerNumber: data.customerNumber ?? null,
		fullName: data.fullName,
		phone: data.phone,
		email: data.email ?? data.billing?.email ?? null,
		contact,
		billing: data.wantsInvoice && data.billing ? data.billing : null,
		orderId,
		orderTotal: total
	});
	const notes = [
		`Canal: ${channel}`,
		data.addIva ? "IVA agregado (16%)" : "",
		data.notes ?? ""
	].filter(Boolean).join(" · ");
	const { error } = await supabaseAdmin.from("solicitudes").insert({
		order_id: orderId,
		customer_number: customerNumber,
		full_name: data.fullName,
		phone: data.phone,
		email: data.email ?? data.billing?.email ?? null,
		items: lines,
		shipping_label: shipping.label,
		wants_invoice: data.wantsInvoice,
		billing: data.wantsInvoice ? data.billing ?? null : null,
		total,
		status: data.status,
		notes
	});
	if (error) throw new Error(error.message);
	try {
		const { registerRenewals } = await import("./renovaciones.server-BHO4Jh8a.mjs");
		const renewalLines = data.items.flatMap((item) => {
			if (item.variantId === "__custom__") return [];
			const found = findVariant(item.variantId);
			if (!found || found.product.category !== "RENOVATION") return [];
			return [{
				variantId: item.variantId,
				variantName: found.variant.name,
				amount: item.unitPrice * item.quantity,
				renewal: item.renewal ?? null
			}];
		});
		if (renewalLines.length > 0) await registerRenewals(supabaseAdmin, {
			orderId,
			customerNumber,
			customerName: data.fullName,
			customerEmail: data.email ?? data.billing?.email ?? null,
			customerPhone: data.phone
		}, renewalLines);
	} catch (error) {
		console.error("No se pudieron programar los avisos de renovación", error);
	}
	const subtotalWithoutIva = data.addIva ? subtotal : total / (1 + IVA_RATE);
	const iva = total - subtotalWithoutIva;
	const customerEmail = data.email ?? data.billing?.email ?? null;
	try {
		const { sendTemplateEmail } = await import("./send-email-X03Uob1e.mjs").then((n) => n.n);
		const comprobanteData = {
			orderId,
			issuedAt: (/* @__PURE__ */ new Date()).toLocaleString("es-MX", { timeZone: "America/Mexico_City" }),
			channel,
			customerName: data.fullName,
			customerNumber,
			customerEmail,
			customerPhone: data.phone,
			lines,
			shippingLabel: shipping.label,
			shippingPrice: shipping.price,
			productsTotal,
			subtotalWithoutIva,
			iva,
			total,
			wantsInvoice: data.wantsInvoice,
			billingInfo: data.wantsInvoice ? data.billing ?? null : null
		};
		const sends = [sendTemplateEmail("comprobante-venta", "ventas@orb-lite.com", {
			idempotencyKey: `comprobante-${orderId}-ventas`,
			templateData: comprobanteData
		}), sendTemplateEmail("nuevo-pedido", "ventas@orb-lite.com", {
			idempotencyKey: `nuevo-pedido-${orderId}`,
			templateData: {
				orderId,
				customerNumber,
				lines,
				shippingLabel: shipping.label,
				shippingPrice: shipping.price,
				productsTotal,
				subtotalWithoutIva,
				iva,
				total,
				totalItems: data.items.reduce((sum, i) => sum + i.quantity, 0),
				isNational: data.shippingId === "national",
				shippingInfo: null,
				pickupInfo: {
					fullName: data.fullName,
					phone: data.phone
				},
				wantsInvoice: data.wantsInvoice,
				billingInfo: data.wantsInvoice ? data.billing ?? null : null
			}
		})];
		if (customerEmail) sends.push(sendTemplateEmail("comprobante-venta", customerEmail, {
			idempotencyKey: `comprobante-${orderId}-cliente`,
			templateData: comprobanteData
		}), sendTemplateEmail("confirmacion-pedido", customerEmail, {
			idempotencyKey: `confirmacion-${orderId}-cliente`,
			templateData: {
				orderId,
				customerName: data.fullName,
				customerNumber,
				lines,
				shippingLabel: shipping.label,
				shippingPrice: shipping.price,
				productsTotal,
				subtotalWithoutIva,
				iva,
				total,
				isNational: data.shippingId === "national",
				wantsInvoice: data.wantsInvoice
			}
		}));
		const results = await Promise.allSettled(sends);
		for (const r of results) if (r.status === "rejected") console.error("No se pudo enviar correo de la venta", r.reason);
	} catch (sendError) {
		console.error("No se pudieron enviar los correos de la venta", sendError);
	}
	return {
		ok: true,
		orderId,
		customerNumber,
		isNewCustomer: isNew,
		total
	};
});
var crmSaveCustomer_createServerFn_handler = createServerRpc({
	id: "0631d3a4ae62753f84e61bb3e91cba11ff4dc3c9a88a76661cdcff536190fb2e",
	name: "crmSaveCustomer",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmSaveCustomer.__executeServer(opts));
var crmSaveCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	customerNumber: numberType().int().min(500).max(9999999).nullish(),
	fullName: stringType().trim().min(1).max(150),
	phone: stringType().trim().min(1).max(30),
	email: stringType().trim().email().max(150).nullish(),
	city: stringType().trim().max(120).optional().or(literalType("")),
	state: stringType().trim().max(120).optional().or(literalType("")),
	zip: stringType().trim().max(10).optional().or(literalType("")),
	billing: manualBillingSchema.nullish()
}).parse(data)).handler(crmSaveCustomer_createServerFn_handler, async ({ data, context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const contact = {
		fullName: data.fullName,
		phone: data.phone,
		...data.email ? { email: data.email } : {},
		...data.city ? { city: data.city } : {},
		...data.state ? { state: data.state } : {},
		...data.zip ? { zip: data.zip } : {}
	};
	return {
		ok: true,
		...await upsertCustomerRecord(supabaseAdmin, {
			customerNumber: data.customerNumber ?? null,
			fullName: data.fullName,
			phone: data.phone,
			email: data.email ?? data.billing?.email ?? null,
			contact,
			billing: data.billing ?? null
		})
	};
});
var crmUpdateCustomer_createServerFn_handler = createServerRpc({
	id: "e134a6cd1108bf47da1469463e46b01dbf44a7abdd2e45a32d583e3c8d68de32",
	name: "crmUpdateCustomer",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmUpdateCustomer.__executeServer(opts));
var crmUpdateCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	customerNumber: numberType().int().min(500).max(9999999),
	fullName: stringType().trim().min(1).max(150),
	phone: stringType().trim().min(1).max(30),
	email: stringType().trim().email().max(150).nullish(),
	city: stringType().trim().max(120).optional().or(literalType("")),
	state: stringType().trim().max(120).optional().or(literalType("")),
	zip: stringType().trim().max(10).optional().or(literalType("")),
	billing: manualBillingSchema.nullish()
}).parse(data)).handler(crmUpdateCustomer_createServerFn_handler, async ({ data, context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const contact = {
		fullName: data.fullName,
		phone: data.phone,
		...data.email ? { email: data.email } : {},
		...data.city ? { city: data.city } : {},
		...data.state ? { state: data.state } : {},
		...data.zip ? { zip: data.zip } : {}
	};
	const { data: updated, error } = await supabaseAdmin.from("customers").update({
		full_name: data.fullName,
		phone: data.phone,
		email: data.email ?? data.billing?.email ?? null,
		contact,
		billing: data.billing ?? null,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("customer_number", data.customerNumber).select("customer_number").maybeSingle();
	if (error) throw new Error(error.message);
	if (!updated) throw new Error("No se encontró el cliente");
	return {
		ok: true,
		customerNumber: updated.customer_number
	};
});
var crmDeleteCustomer_createServerFn_handler = createServerRpc({
	id: "d5387c203a634071e5b4a937a28304446aeeedc0d5e4876747b2aaeedcf9e012",
	name: "crmDeleteCustomer",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmDeleteCustomer.__executeServer(opts));
var crmDeleteCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ customerNumber: numberType().int().min(500).max(9999999) }).parse(data)).handler(crmDeleteCustomer_createServerFn_handler, async ({ data, context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: existing, error: findError } = await supabaseAdmin.from("customers").select("customer_number").eq("customer_number", data.customerNumber).maybeSingle();
	if (findError) throw new Error(findError.message);
	if (!existing) throw new Error("No se encontró el cliente");
	const { data: deletedSolicitudes, error: solError } = await supabaseAdmin.from("solicitudes").delete().eq("customer_number", data.customerNumber).select("id");
	if (solError) throw new Error(solError.message);
	const { error: delError } = await supabaseAdmin.from("customers").delete().eq("customer_number", data.customerNumber);
	if (delError) throw new Error(delError.message);
	return {
		ok: true,
		customerNumber: data.customerNumber,
		deletedSolicitudes: deletedSolicitudes?.length ?? 0
	};
});
var crmLookupCustomer_createServerFn_handler = createServerRpc({
	id: "c90b2fedc9d790bc621950ee633d1f03862555cdce960e60ecb8b3a705a52f18",
	name: "crmLookupCustomer",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmLookupCustomer.__executeServer(opts));
var crmLookupCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ customerNumber: numberType().int().min(500).max(9999999) }).parse(data)).handler(crmLookupCustomer_createServerFn_handler, async ({ data, context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: row, error } = await supabaseAdmin.from("customers").select("customer_number, full_name, phone, email, contact, billing, orders_count, total_spent").eq("customer_number", data.customerNumber).maybeSingle();
	if (error) throw new Error(error.message);
	return { customer: row ?? null };
});
var renovacionSchema = objectType({
	id: stringType().uuid().nullish(),
	customerNumber: numberType().int().min(500).max(9999999).nullish(),
	customerName: stringType().trim().max(150).nullish(),
	customerEmail: stringType().trim().email().max(150).nullish().or(literalType("")),
	customerPhone: stringType().trim().max(30).nullish(),
	variantId: stringType().trim().min(1).max(80),
	variantName: stringType().trim().min(1).max(150),
	platform: enumType(["ORB-LITE", "ORB-FULL"]).nullish(),
	renewalKind: enumType([
		"platform",
		"sim",
		"both"
	]).default("platform"),
	renewalPeriod: enumType(["monthly", "annual"]).default("annual"),
	unitName: stringType().trim().max(120).nullish(),
	imei: stringType().trim().max(40).nullish(),
	iccid: stringType().trim().max(40).nullish(),
	simPhone: stringType().trim().max(30).nullish(),
	amount: numberType().finite().min(0).max(1e7).default(0),
	renewalDate: stringType().regex(/^\d{4}-\d{2}-\d{2}$/),
	status: enumType([
		"activa",
		"por_vencer",
		"adeudo",
		"cancelada"
	]).default("activa")
});
var nullish = (v) => {
	const s = typeof v === "string" ? v.trim() : "";
	return s.length > 0 ? s : null;
};
/** Lista todas las renovaciones registradas para el panel de control. */
var crmListRenovaciones_createServerFn_handler = createServerRpc({
	id: "8ad68db4a38cd24142f9dada0d94fa4760771006fbe0d3f02bc8169c7a1a1dea",
	name: "crmListRenovaciones",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmListRenovaciones.__executeServer(opts));
var crmListRenovaciones = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(crmListRenovaciones_createServerFn_handler, async ({ context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: rows, error } = await supabaseAdmin.from("renovaciones").select("id, customer_number, customer_name, customer_email, customer_phone, variant_id, variant_name, platform, renewal_kind, renewal_period, unit_name, imei, iccid, sim_phone, amount, renewal_date, last_paid_at, status, last_order_id, created_at").order("renewal_date", { ascending: true }).limit(500);
	if (error) throw new Error(error.message);
	return { rows: rows ?? [] };
});
var crmSaveRenovacion_createServerFn_handler = createServerRpc({
	id: "06ad71c54b2e181b77a38feea9bd2d73c232b094becbb3f9cc25bb31a583099e",
	name: "crmSaveRenovacion",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmSaveRenovacion.__executeServer(opts));
var crmSaveRenovacion = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => renovacionSchema.parse(data)).handler(crmSaveRenovacion_createServerFn_handler, async ({ data, context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const payload = {
		customer_number: data.customerNumber ?? null,
		customer_name: nullish(data.customerName),
		customer_email: nullish(data.customerEmail),
		customer_phone: nullish(data.customerPhone),
		variant_id: data.variantId,
		variant_name: data.variantName,
		platform: data.platform ?? null,
		renewal_kind: data.renewalKind,
		renewal_period: data.renewalPeriod,
		unit_name: nullish(data.unitName),
		imei: nullish(data.imei),
		iccid: nullish(data.iccid),
		sim_phone: nullish(data.simPhone),
		amount: data.amount,
		renewal_date: `${data.renewalDate.slice(0, 7)}-01`,
		status: data.status,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (data.id) {
		const { data: updated, error } = await supabaseAdmin.from("renovaciones").update(payload).eq("id", data.id).select("id").maybeSingle();
		if (error) throw new Error(error.message);
		if (!updated) throw new Error("No se encontró la renovación");
		return {
			ok: true,
			id: updated.id,
			created: false
		};
	}
	const { data: inserted, error } = await supabaseAdmin.from("renovaciones").insert({
		...payload,
		notices: []
	}).select("id").maybeSingle();
	if (error) throw new Error(error.message);
	return {
		ok: true,
		id: inserted?.id ?? null,
		created: true
	};
});
var crmDeleteRenovacion_createServerFn_handler = createServerRpc({
	id: "9de4cb18910819e4b66ef84d150d127da1860a8d4e9bb08aaff954950e54a38f",
	name: "crmDeleteRenovacion",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmDeleteRenovacion.__executeServer(opts));
var crmDeleteRenovacion = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(crmDeleteRenovacion_createServerFn_handler, async ({ data, context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { error } = await supabaseAdmin.from("renovaciones").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var DEMO_PLATFORMS = ["wialon_lite", "wialon_full"];
function slugPart(value) {
	return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}
/** Construye el usuario demo: nombre + apellido, o nombre + empresa/razón social. */
function buildDemoUsername(fullName, company) {
	const words = fullName.trim().split(/\s+/).filter(Boolean);
	return ([slugPart(words[0] ?? ""), (company ? slugPart(company).slice(0, 14) : "") || slugPart(words[1] ?? "")].filter(Boolean).join(".") || "demo").slice(0, 30);
}
var crmListDemoUsers_createServerFn_handler = createServerRpc({
	id: "bf439629abc8e5b49f8a15d432f6b293056fa84fb3100b7cc268395ab9e2bf84",
	name: "crmListDemoUsers",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmListDemoUsers.__executeServer(opts));
var crmListDemoUsers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(crmListDemoUsers_createServerFn_handler, async ({ context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: rows, error } = await supabaseAdmin.from("demo_users").select("id, customer_number, full_name, company, platform, username, password, notes, created_at").order("created_at", { ascending: false }).limit(500);
	if (error) throw new Error(error.message);
	return { rows: rows ?? [] };
});
var crmCreateDemoUser_createServerFn_handler = createServerRpc({
	id: "3788439f9a10e8b48443bb4fac626aca2f96951b4983134e4f8f610d19e72bc1",
	name: "crmCreateDemoUser",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmCreateDemoUser.__executeServer(opts));
var crmCreateDemoUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	customerNumber: numberType().int().min(500).max(9999999).nullish(),
	fullName: stringType().trim().min(2).max(150),
	company: stringType().trim().max(150).nullish(),
	platform: enumType(DEMO_PLATFORMS).default("wialon_lite"),
	notes: stringType().trim().max(500).nullish(),
	email: stringType().trim().email().max(200).nullish()
}).parse(data)).handler(crmCreateDemoUser_createServerFn_handler, async ({ data, context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	if (data.customerNumber) {
		const { data: existing, error: exErr } = await supabaseAdmin.from("demo_users").select("id, username").eq("customer_number", data.customerNumber).maybeSingle();
		if (exErr) throw new Error(exErr.message);
		if (existing) throw new Error(`El cliente #${data.customerNumber} ya tiene un usuario demo: ${existing.username}`);
	}
	const base = buildDemoUsername(data.fullName, data.company);
	let username = base;
	for (let i = 2; i < 50; i += 1) {
		const { data: taken, error } = await supabaseAdmin.from("demo_users").select("id").eq("username", username).maybeSingle();
		if (error) throw new Error(error.message);
		if (!taken) break;
		username = `${base}${i}`;
	}
	const { data: inserted, error } = await supabaseAdmin.from("demo_users").insert({
		customer_number: data.customerNumber ?? null,
		full_name: data.fullName.trim(),
		company: nullish(data.company),
		platform: data.platform,
		username,
		password: "Abc2026+",
		notes: nullish(data.notes)
	}).select("id, username, password, platform").maybeSingle();
	if (error) throw new Error(error.message);
	let emailTo = nullish(data.email);
	if (!emailTo && data.customerNumber) {
		const { data: cust } = await supabaseAdmin.from("customers").select("contact").eq("customer_number", data.customerNumber).maybeSingle();
		const cEmail = (cust?.contact)?.["email"];
		if (typeof cEmail === "string" && cEmail.includes("@")) emailTo = cEmail;
	}
	let emailSent = false;
	let emailReason = null;
	if (emailTo && inserted) try {
		const { sendTemplateEmail } = await import("./send-email-X03Uob1e.mjs").then((n) => n.n);
		const sent = await sendTemplateEmail("demo-wialon", emailTo, {
			templateData: {
				name: data.fullName.trim(),
				username,
				platform: data.platform
			},
			idempotencyKey: `demo-wialon-${inserted.id}`
		});
		emailSent = sent.sent;
		if (!sent.sent) emailReason = sent.reason ?? "no enviado";
	} catch (e) {
		emailReason = e instanceof Error ? e.message : "error de envío";
	}
	return {
		ok: true,
		user: inserted,
		emailTo,
		emailSent,
		emailReason
	};
});
var crmDeleteDemoUser_createServerFn_handler = createServerRpc({
	id: "504f60525e6e5205e2528486cd836559177764d1cd9c89bc49b88c39c704003b",
	name: "crmDeleteDemoUser",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmDeleteDemoUser.__executeServer(opts));
var crmDeleteDemoUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(crmDeleteDemoUser_createServerFn_handler, async ({ data, context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { error } = await supabaseAdmin.from("demo_users").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var crmListDemoRequests_createServerFn_handler = createServerRpc({
	id: "f4a8706dfbbfc5bb64dc2a9d340fa28ce37535022055c01009fa0217fa36a8c4",
	name: "crmListDemoRequests",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmListDemoRequests.__executeServer(opts));
var crmListDemoRequests = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(crmListDemoRequests_createServerFn_handler, async ({ context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: rows, error } = await supabaseAdmin.from("demo_requests").select("id, first_name, last_name, phone, email, company, platform, units, message, status, demo_username, sent_at, notes, created_at").order("created_at", { ascending: false }).limit(300);
	if (error) throw new Error(error.message);
	return { rows: rows ?? [] };
});
var crmSendDemoRequest_createServerFn_handler = createServerRpc({
	id: "23379c20b1fd5562a8151d5d699f8ff14137a7709c16a2762c028488c7ce302d",
	name: "crmSendDemoRequest",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmSendDemoRequest.__executeServer(opts));
var crmSendDemoRequest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	id: stringType().uuid(),
	customerNumber: numberType().int().min(500).max(9999999).nullish(),
	platform: enumType(DEMO_PLATFORMS).nullish()
}).parse(data)).handler(crmSendDemoRequest_createServerFn_handler, async ({ data, context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: req, error: reqErr } = await supabaseAdmin.from("demo_requests").select("id, first_name, last_name, phone, email, company, platform, status, demo_username").eq("id", data.id).maybeSingle();
	if (reqErr) throw new Error(reqErr.message);
	if (!req) throw new Error("Solicitud de demo no encontrada");
	if (req.status === "enviado") throw new Error(`Ya se enviaron los datos (usuario ${req.demo_username ?? "—"})`);
	const platform = data.platform ?? req.platform;
	const fullName = `${req.first_name} ${req.last_name}`.trim();
	const base = buildDemoUsername(fullName, req.company);
	let username = base;
	for (let i = 2; i < 50; i += 1) {
		const { data: taken, error } = await supabaseAdmin.from("demo_users").select("id").eq("username", username).maybeSingle();
		if (error) throw new Error(error.message);
		if (!taken) break;
		username = `${base}${i}`;
	}
	const { data: inserted, error: insErr } = await supabaseAdmin.from("demo_users").insert({
		customer_number: data.customerNumber ?? null,
		full_name: fullName,
		company: nullish(req.company),
		platform,
		username,
		password: "Abc2026+",
		notes: `Demo solicitada en la página · ${req.email} · ${req.phone}`
	}).select("id, username, password, platform").maybeSingle();
	if (insErr) throw new Error(insErr.message);
	let emailSent = false;
	let emailReason = null;
	try {
		const { sendTemplateEmail } = await import("./send-email-X03Uob1e.mjs").then((n) => n.n);
		const sent = await sendTemplateEmail("demo-wialon", req.email, {
			templateData: {
				name: fullName,
				username,
				platform
			},
			idempotencyKey: `demo-request-${req.id}`
		});
		emailSent = sent.sent;
		if (!sent.sent) emailReason = sent.reason ?? "no enviado";
	} catch (e) {
		emailReason = e instanceof Error ? e.message : "error de envío";
	}
	const { error: updErr } = await supabaseAdmin.from("demo_requests").update({
		status: emailSent ? "enviado" : "pendiente",
		demo_user_id: inserted?.id ?? null,
		demo_username: username,
		sent_at: emailSent ? (/* @__PURE__ */ new Date()).toISOString() : null
	}).eq("id", req.id);
	if (updErr) throw new Error(updErr.message);
	return {
		ok: true,
		username,
		password: "Abc2026+",
		emailSent,
		emailReason
	};
});
var crmDeleteDemoRequest_createServerFn_handler = createServerRpc({
	id: "0843a7ba2837195ce3fa110a44a66f2e264396b36c8fa70546179cd44b4642e0",
	name: "crmDeleteDemoRequest",
	filename: "src/lib/crm.functions.ts"
}, (opts) => crmDeleteDemoRequest.__executeServer(opts));
var crmDeleteDemoRequest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(crmDeleteDemoRequest_createServerFn_handler, async ({ data, context }) => {
	assertCrmUser(context.claims);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { error } = await supabaseAdmin.from("demo_requests").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { crmCreateDemoUser_createServerFn_handler, crmCreateSale_createServerFn_handler, crmDeleteCustomer_createServerFn_handler, crmDeleteDemoRequest_createServerFn_handler, crmDeleteDemoUser_createServerFn_handler, crmDeleteRenovacion_createServerFn_handler, crmListCustomers_createServerFn_handler, crmListDemoRequests_createServerFn_handler, crmListDemoUsers_createServerFn_handler, crmListRenovaciones_createServerFn_handler, crmListSolicitudes_createServerFn_handler, crmLookupCustomer_createServerFn_handler, crmSaveCustomer_createServerFn_handler, crmSaveRenovacion_createServerFn_handler, crmSendDemoRequest_createServerFn_handler, crmUpdateCustomer_createServerFn_handler, crmUpdateSolicitud_createServerFn_handler };
