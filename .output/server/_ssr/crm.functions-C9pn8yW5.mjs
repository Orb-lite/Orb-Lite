import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BcZnKulH.mjs";
import { a as numberType, i as literalType, n as booleanType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BpbeoxIM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.functions-C9pn8yW5.js
var STATUSES = [
	"pendiente",
	"vendido",
	"no_vendido"
];
var crmListSolicitudes = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ status: enumType(["todas", ...STATUSES]).default("todas") }).parse(data)).handler(createSsrRpc("36337e2ff83dd9dd28ec84d0f627b2323e0dc3d903b83025c505036555bbe96d"));
var crmUpdateSolicitud = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	id: stringType().uuid(),
	status: enumType(STATUSES),
	notes: stringType().max(2e3).nullish()
}).parse(data)).handler(createSsrRpc("8cde57323c3e7ec8ae60e6398741c3320f9b3828433f1dfbb16d2e2869a75fee"));
var crmListCustomers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c473fefcae172c2602d2f1a0e4eb7b9cccc0768670f34cc11a0de11a9314850f"));
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
/** Registra una venta hecha fuera de la página (WhatsApp, mostrador, teléfono). */
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
}).parse(data)).handler(createSsrRpc("6bb535daab1a9c858483ed524626ddf26bc7dfcf25459abfd16ce214d0c79818"));
/** Registra o actualiza un cliente sin generar una venta. */
var crmSaveCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	customerNumber: numberType().int().min(500).max(9999999).nullish(),
	fullName: stringType().trim().min(1).max(150),
	phone: stringType().trim().min(1).max(30),
	email: stringType().trim().email().max(150).nullish(),
	city: stringType().trim().max(120).optional().or(literalType("")),
	state: stringType().trim().max(120).optional().or(literalType("")),
	zip: stringType().trim().max(10).optional().or(literalType("")),
	billing: manualBillingSchema.nullish()
}).parse(data)).handler(createSsrRpc("0631d3a4ae62753f84e61bb3e91cba11ff4dc3c9a88a76661cdcff536190fb2e"));
/** Edita los datos de un cliente existente sin tocar su historial de compras. */
var crmUpdateCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	customerNumber: numberType().int().min(500).max(9999999),
	fullName: stringType().trim().min(1).max(150),
	phone: stringType().trim().min(1).max(30),
	email: stringType().trim().email().max(150).nullish(),
	city: stringType().trim().max(120).optional().or(literalType("")),
	state: stringType().trim().max(120).optional().or(literalType("")),
	zip: stringType().trim().max(10).optional().or(literalType("")),
	billing: manualBillingSchema.nullish()
}).parse(data)).handler(createSsrRpc("e134a6cd1108bf47da1469463e46b01dbf44a7abdd2e45a32d583e3c8d68de32"));
/** Borra un cliente y todas sus solicitudes asociadas. */
var crmDeleteCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ customerNumber: numberType().int().min(500).max(9999999) }).parse(data)).handler(createSsrRpc("d5387c203a634071e5b4a937a28304446aeeedc0d5e4876747b2aaeedcf9e012"));
/** Consulta un cliente por número para precargar los formularios del CRM. */
var crmLookupCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ customerNumber: numberType().int().min(500).max(9999999) }).parse(data)).handler(createSsrRpc("c90b2fedc9d790bc621950ee633d1f03862555cdce960e60ecb8b3a705a52f18"));
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
/** Lista todas las renovaciones registradas para el panel de control. */
var crmListRenovaciones = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("8ad68db4a38cd24142f9dada0d94fa4760771006fbe0d3f02bc8169c7a1a1dea"));
/** Crea o edita una renovación desde el panel de control. */
var crmSaveRenovacion = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => renovacionSchema.parse(data)).handler(createSsrRpc("06ad71c54b2e181b77a38feea9bd2d73c232b094becbb3f9cc25bb31a583099e"));
/** Borra una renovación del panel de control. */
var crmDeleteRenovacion = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("9de4cb18910819e4b66ef84d150d127da1860a8d4e9bb08aaff954950e54a38f"));
var DEMO_PLATFORMS = ["wialon_lite", "wialon_full"];
function slugPart(value) {
	return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}
/** Construye el usuario demo: nombre + apellido, o nombre + empresa/razón social. */
function buildDemoUsername(fullName, company) {
	const words = fullName.trim().split(/\s+/).filter(Boolean);
	return ([slugPart(words[0] ?? ""), (company ? slugPart(company).slice(0, 14) : "") || slugPart(words[1] ?? "")].filter(Boolean).join(".") || "demo").slice(0, 30);
}
/** Lista los usuarios demo generados. */
var crmListDemoUsers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("bf439629abc8e5b49f8a15d432f6b293056fa84fb3100b7cc268395ab9e2bf84"));
/** Genera un usuario demo (uno por cliente) con contraseña fija Abc2026+. */
var crmCreateDemoUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	customerNumber: numberType().int().min(500).max(9999999).nullish(),
	fullName: stringType().trim().min(2).max(150),
	company: stringType().trim().max(150).nullish(),
	platform: enumType(DEMO_PLATFORMS).default("wialon_lite"),
	notes: stringType().trim().max(500).nullish(),
	email: stringType().trim().email().max(200).nullish()
}).parse(data)).handler(createSsrRpc("3788439f9a10e8b48443bb4fac626aca2f96951b4983134e4f8f610d19e72bc1"));
/** Borra un usuario demo. */
var crmDeleteDemoUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("504f60525e6e5205e2528486cd836559177764d1cd9c89bc49b88c39c704003b"));
/** Lista las solicitudes de demo recibidas desde la página. */
var crmListDemoRequests = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("f4a8706dfbbfc5bb64dc2a9d340fa28ce37535022055c01009fa0217fa36a8c4"));
/**
* Genera el usuario demo de una solicitud y envía el folleto de acceso al
* correo del solicitante. Solo se ejecuta cuando el CRM lo confirma.
*/
var crmSendDemoRequest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	id: stringType().uuid(),
	customerNumber: numberType().int().min(500).max(9999999).nullish(),
	platform: enumType(DEMO_PLATFORMS).nullish()
}).parse(data)).handler(createSsrRpc("23379c20b1fd5562a8151d5d699f8ff14137a7709c16a2762c028488c7ce302d"));
/** Borra una solicitud de demo. */
var crmDeleteDemoRequest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("0843a7ba2837195ce3fa110a44a66f2e264396b36c8fa70546179cd44b4642e0"));
//#endregion
export { crmUpdateCustomer as _, crmDeleteDemoRequest as a, crmListCustomers as c, crmListRenovaciones as d, crmListSolicitudes as f, crmSendDemoRequest as g, crmSaveRenovacion as h, crmDeleteCustomer as i, crmListDemoRequests as l, crmSaveCustomer as m, crmCreateDemoUser as n, crmDeleteDemoUser as o, crmLookupCustomer as p, crmCreateSale as r, crmDeleteRenovacion as s, buildDemoUsername as t, crmListDemoUsers as u, crmUpdateSolicitud as v };
