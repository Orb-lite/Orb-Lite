import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-BhuVKh9L.js
var catalog_BhuVKh9L_exports = /* @__PURE__ */ __exportAll({
	a: () => WHATSAPP_NUMBER,
	c: () => formatMxn,
	i: () => SHIPPING_OPTIONS,
	l: () => renewalMeta,
	n: () => IVA_RATE,
	o: () => catalog_exports,
	r: () => PRODUCTS,
	s: () => findVariant,
	t: () => ADD_ONS
});
var equipo_gps_sim_default = "/assets/equipo-gps-sim-D9xGk7K_.jpg";
var equipo_gps_nosim_default = "/assets/equipo-gps-nosim-C31ZHkY7.jpg";
var equipo_gps_default = "/assets/equipo-gps-BlFdWJpM.jpg";
var catalog_exports = /* @__PURE__ */ __exportAll$1({
	ADD_ONS: () => ADD_ONS,
	IVA_RATE: () => IVA_RATE,
	PRODUCTS: () => PRODUCTS,
	SHIPPING_OPTIONS: () => SHIPPING_OPTIONS,
	WHATSAPP_NUMBER: () => WHATSAPP_NUMBER,
	findVariant: () => findVariant,
	formatMxn: () => formatMxn,
	renewalMeta: () => renewalMeta
});
var IVA_RATE = .16;
var SHIPPING_OPTIONS = [{
	id: "local",
	label: "Entrega / Instalación en Guadalajara (ZMG)",
	price: 0,
	description: "Entrega física o instalación directa incluida en la zona metropolitana de Guadalajara."
}, {
	id: "national",
	label: "Envío Foráneo (Resto de la República Mexicana)",
	price: 450,
	description: "Envío rápido asegurado por paquetería express a cualquier ciudad de México."
}];
var ADD_ONS = [{
	id: "renov-plataforma",
	name: "Renovación de Plataforma ORB-LITE (1 año)",
	price: 160,
	description: "Acceso a la plataforma y app de monitoreo por 12 meses."
}, {
	id: "renov-sim",
	name: "Renovación Anual SIM 30MB",
	price: 590,
	description: "SIM 30MB mensuales por 1 año. Datos M2M multi carrier."
}];
var PRODUCTS = [
	{
		id: "kit-instaladores",
		title: "Kit GPS Profesional para Instaladores — Teltonika FTC927 (4G LTE CAT 1)",
		slug: "kit-gps-instaladores",
		category: "B2B",
		description: "Rastreador GPS profesional ideal para flotillas, autos, motos y maquinaria pesada. Elige el plan que mejor se adapte a tu operación.",
		image_url: equipo_gps_sim_default,
		features: [
			"4G LTE confiable",
			"Rastreo en tiempo real",
			"Sistema seguro",
			"Fácil instalación"
		],
		variants: [
			{
				id: "kit-op1",
				product_id: "kit-instaladores",
				name: "Opción 1: ¿Ya tienes plataforma?",
				price: 1750,
				badge: "Conéctalo a tu propia plataforma",
				includes: ["Equipo Teltonika FTC927", "SIM 30MB mensuales por 1 año"]
			},
			{
				id: "kit-op2",
				product_id: "kit-instaladores",
				name: "Opción 2: Kit Completo ORB-LITE (Promoción)",
				price: 1900,
				original_price: 1950,
				badge: "¡Ahorra hoy! · Recomendado",
				includes: [
					"Equipo Teltonika FTC927",
					"SIM 30MB mensuales por 1 año",
					"Plataforma ORB-LITE por 1 año"
				]
			},
			{
				id: "kit-op3",
				product_id: "kit-instaladores",
				name: "Opción 3: Solo Equipo FTC927",
				price: 1160,
				badge: "Ideal si ya tienes SIM y plataforma",
				includes: ["Hardware Teltonika FTC927"]
			}
		]
	},
	{
		id: "usuario-final",
		title: "GPS Satelital ORB-LITE — Servicio Completo Usuario Final",
		slug: "gps-usuario-final",
		category: "B2C",
		description: "Solución llave en mano de rastreo satelital con monitoreo en app móvil para autos particulares, camionetas o motocicletas.",
		image_url: equipo_gps_nosim_default,
		features: [
			"Instalación profesional",
			"App móvil de monitoreo",
			"SIM 30MB mensuales por 1 año",
			"Soporte técnico"
		],
		variants: [{
			id: "b2c-full",
			product_id: "usuario-final",
			name: "Servicio Completo Usuario Final",
			price: 2490,
			original_price: 2500,
			badge: "Todo incluido · Con instalación",
			includes: [
				"Equipo Teltonika FTC927",
				"Servicio de plataforma",
				"SIM 30MB mensuales por 1 año",
				"Instalación profesional"
			]
		}]
	},
	{
		id: "renovaciones",
		title: "Renovaciones ORB-LITE y ORB-FULL",
		slug: "renovaciones-anuales",
		category: "RENOVATION",
		description: "Mantén activo tu servicio: renueva la plataforma ORB-LITE (anual) o ORB-FULL (mensual o anual) y los datos de tu chip.",
		image_url: equipo_gps_default,
		features: [
			"Sin contratos forzosos",
			"Activación inmediata",
			"Soporte incluido"
		],
		variants: [
			{
				id: "renov-plataforma",
				product_id: "renovaciones",
				name: "Renovación de Plataforma ORB-LITE (anual)",
				price: 160,
				badge: "12 meses de plataforma",
				includes: ["Acceso a plataforma web y app por 1 año"],
				renewal_kind: "platform",
				renewal_period: "annual",
				platform: "ORB-LITE"
			},
			{
				id: "renov-orbfull-mensual",
				product_id: "renovaciones",
				name: "Renovación de Plataforma ORB-FULL (mensual)",
				price: 290,
				badge: "Pago mes a mes",
				includes: ["Acceso a plataforma ORB-FULL por 1 mes"],
				renewal_kind: "platform",
				renewal_period: "monthly",
				platform: "ORB-FULL"
			},
			{
				id: "renov-orbfull-anual",
				product_id: "renovaciones",
				name: "Renovación de Plataforma ORB-FULL (anual)",
				price: 3450,
				original_price: 3480,
				badge: "12 meses de plataforma ORB-FULL",
				includes: ["Acceso a plataforma ORB-FULL por 1 año"],
				renewal_kind: "platform",
				renewal_period: "annual",
				platform: "ORB-FULL"
			},
			{
				id: "renov-sim",
				product_id: "renovaciones",
				name: "Renovación Anual de Chip / SIM 30MB",
				price: 590,
				badge: "12 meses de datos",
				includes: ["SIM 30MB mensuales por 1 año (M2M)"],
				renewal_kind: "sim",
				renewal_period: "annual"
			},
			{
				id: "renov-completa",
				product_id: "renovaciones",
				name: "Renovación Completa ORB-LITE (Plataforma + Chip)",
				price: 750,
				badge: "Recomendado · Ahorra en el paquete",
				includes: ["Acceso a plataforma web y app por 1 año", "SIM 30MB mensuales por 1 año (M2M)"],
				renewal_kind: "both",
				renewal_period: "annual",
				platform: "ORB-LITE"
			},
			{
				id: "renov-orbfull-mensual-chip",
				product_id: "renovaciones",
				name: "Paquete ORB-FULL Mensual + Chip Anual",
				price: 870,
				original_price: 880,
				badge: "Ahorra en el paquete",
				includes: ["Acceso a plataforma ORB-FULL por 1 mes", "SIM 30MB mensuales por 1 año (M2M)"],
				renewal_kind: "both",
				renewal_period: "monthly",
				platform: "ORB-FULL"
			},
			{
				id: "renov-orbfull-anual-chip",
				product_id: "renovaciones",
				name: "Paquete ORB-FULL Anual + Chip Anual",
				price: 4020,
				original_price: 4070,
				badge: "Ahorra $50 en el paquete",
				includes: ["Acceso a plataforma ORB-FULL por 1 año", "SIM 30MB mensuales por 1 año (M2M)"],
				renewal_kind: "both",
				renewal_period: "annual",
				platform: "ORB-FULL"
			}
		]
	}
];
function renewalMeta(variantId) {
	const found = findVariant(variantId);
	if (!found || found.product.category !== "RENOVATION") return null;
	const v = found.variant;
	return {
		kind: v.renewal_kind ?? "platform",
		period: v.renewal_period ?? "annual",
		platform: v.platform ?? "ORB-LITE"
	};
}
var WHATSAPP_NUMBER = "523318359421";
function formatMxn(amount) {
	return new Intl.NumberFormat("es-MX", {
		style: "currency",
		currency: "MXN",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(amount);
}
function findVariant(variantId) {
	for (const product of PRODUCTS) {
		const variant = product.variants.find((v) => v.id === variantId);
		if (variant) return {
			product,
			variant
		};
	}
	return null;
}
//#endregion
export { WHATSAPP_NUMBER as a, formatMxn as c, SHIPPING_OPTIONS as i, renewalMeta as l, IVA_RATE as n, catalog_BhuVKh9L_exports as o, PRODUCTS as r, findVariant as s, ADD_ONS as t };
