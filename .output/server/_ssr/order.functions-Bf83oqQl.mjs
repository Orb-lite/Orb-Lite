import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as numberType, n as booleanType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { i as SHIPPING_OPTIONS, n as IVA_RATE, s as findVariant, t as ADD_ONS } from "./catalog-BhuVKh9L.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { t as sendTemplateEmail } from "./send-email-X03Uob1e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order.functions-Bf83oqQl.js
var renewalSchema = objectType({
	fullName: stringType().min(1),
	unitName: stringType().max(100).optional().nullable(),
	imei: stringType().max(20).optional().nullable(),
	iccid: stringType().max(25).optional().nullable(),
	simPhone: stringType().max(25).optional().nullable()
});
var shippingInfoSchema = objectType({
	fullName: stringType().min(1),
	phone: stringType().min(1),
	email: stringType().email().nullish(),
	city: stringType().min(1),
	state: stringType().min(1),
	zip: stringType().min(1)
});
var pickupInfoSchema = objectType({
	fullName: stringType().min(1),
	phone: stringType().min(1),
	email: stringType().email().nullish()
});
var billingInfoSchema = objectType({
	legalName: stringType().min(1),
	rfc: stringType().min(1),
	taxRegime: stringType().min(1),
	cfdiUse: stringType().min(1),
	fiscalZip: stringType().min(1),
	email: stringType().email(),
	phone: stringType().min(1),
	fiscalAddress: stringType().optional().nullable(),
	constanciaFileName: stringType().max(200).nullish(),
	constanciaUrl: stringType().url().nullish()
});
var orderSchema = objectType({
	orderId: stringType().min(1).max(64),
	customerNumber: numberType().int().min(500).max(9999999).nullish(),
	items: arrayType(objectType({
		id: stringType(),
		variant_id: stringType(),
		quantity: numberType().int().min(1).max(100),
		add_ons: arrayType(stringType()).optional(),
		renewal: renewalSchema.nullish()
	})).min(1).max(50),
	shippingId: enumType(["local", "national"]),
	shippingInfo: shippingInfoSchema.nullish(),
	pickupInfo: pickupInfoSchema.nullish(),
	wantsInvoice: booleanType(),
	billingInfo: billingInfoSchema.nullish()
});
var notifyNewOrder_createServerFn_handler = createServerRpc({
	id: "6a2310f3ff7ea5842dae69205e66caaf7ec11d5c49c4b8794d7041a99fe89d4f",
	name: "notifyNewOrder",
	filename: "src/lib/order.functions.ts"
}, (opts) => notifyNewOrder.__executeServer(opts));
var notifyNewOrder = createServerFn({ method: "POST" }).inputValidator((data) => orderSchema.parse(data)).handler(notifyNewOrder_createServerFn_handler, async ({ data }) => {
	const shipping = SHIPPING_OPTIONS.find((s) => s.id === data.shippingId) ?? SHIPPING_OPTIONS[0];
	let productsTotal = 0;
	const lines = data.items.flatMap((item) => {
		const found = findVariant(item.variant_id);
		if (!found) return [];
		const addOns = (item.add_ons ?? []).map((id) => ADD_ONS.find((a) => a.id === id)).filter((a) => Boolean(a)).map((a) => ({
			name: a.name,
			price: a.price
		}));
		const productAmount = found.variant.price * item.quantity;
		const addOnAmount = addOns.reduce((sum, a) => sum + a.price, 0) * item.quantity;
		productsTotal += productAmount + addOnAmount;
		return [{
			variantName: found.variant.name,
			title: found.product.title,
			quantity: item.quantity,
			unitPrice: found.variant.price,
			lineTotal: productAmount + addOnAmount,
			addOns,
			isRenewal: found.product.category === "RENOVATION",
			renewal: item.renewal ?? null
		}];
	});
	if (lines.length === 0) throw new Error("El pedido no contiene productos válidos");
	const total = productsTotal + shipping.price;
	const subtotalWithoutIva = total / (1 + IVA_RATE);
	const isNational = data.shippingId === "national";
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		const contact = isNational ? data.shippingInfo : data.pickupInfo;
		const { error } = await supabaseAdmin.from("solicitudes").insert({
			order_id: data.orderId,
			customer_number: data.customerNumber ?? null,
			full_name: contact?.fullName ?? data.billingInfo?.legalName ?? null,
			phone: contact?.phone ?? data.billingInfo?.phone ?? null,
			email: data.billingInfo?.email ?? null,
			items: lines,
			shipping_label: shipping.label,
			wants_invoice: data.wantsInvoice,
			billing: data.wantsInvoice ? data.billingInfo ?? null : null,
			total,
			status: "pendiente"
		});
		if (error) console.error("No se pudo registrar la solicitud en BD", error);
	} catch (error) {
		console.error("No se pudo registrar la solicitud en BD", error);
	}
	let ordersCount = null;
	let totalSpent = null;
	if (data.customerNumber) try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		const { data: customer } = await supabaseAdmin.from("customers").select("orders_count, total_spent").eq("customer_number", data.customerNumber).maybeSingle();
		if (customer) {
			ordersCount = customer.orders_count;
			totalSpent = Number(customer.total_spent);
		}
	} catch (error) {
		console.error("No se pudo consultar el historial del cliente", error);
	}
	const isFirstPurchase = ordersCount !== null ? ordersCount <= 1 : null;
	await sendTemplateEmail("nuevo-pedido", "ventas@orb-lite.com", {
		idempotencyKey: `nuevo-pedido-${data.orderId}`,
		templateData: {
			orderId: data.orderId,
			customerNumber: data.customerNumber ?? null,
			ordersCount,
			totalSpent,
			isFirstPurchase,
			lines,
			shippingLabel: shipping.label,
			shippingPrice: shipping.price,
			productsTotal,
			subtotalWithoutIva,
			iva: total - subtotalWithoutIva,
			total,
			totalItems: data.items.reduce((sum, i) => sum + i.quantity, 0),
			isNational,
			shippingInfo: isNational ? data.shippingInfo ?? null : null,
			pickupInfo: !isNational ? data.pickupInfo ?? null : null,
			wantsInvoice: data.wantsInvoice,
			billingInfo: data.wantsInvoice ? data.billingInfo ?? null : null
		}
	});
	const contact = isNational ? data.shippingInfo : data.pickupInfo;
	const customerEmail = contact?.email ?? data.billingInfo?.email ?? null;
	if (customerEmail) try {
		await sendTemplateEmail("confirmacion-pedido", customerEmail, {
			idempotencyKey: `confirmacion-pedido-${data.orderId}`,
			templateData: {
				orderId: data.orderId,
				customerName: contact?.fullName ?? data.billingInfo?.legalName ?? null,
				customerNumber: data.customerNumber ?? null,
				ordersCount,
				lines,
				shippingLabel: shipping.label,
				shippingPrice: shipping.price,
				productsTotal,
				subtotalWithoutIva,
				iva: total - subtotalWithoutIva,
				total,
				isNational,
				wantsInvoice: data.wantsInvoice
			}
		});
	} catch (error) {
		console.error("No se pudo enviar la confirmación al cliente", error);
	}
	const comprobanteData = {
		orderId: data.orderId,
		issuedAt: (/* @__PURE__ */ new Date()).toLocaleString("es-MX", { timeZone: "America/Mexico_City" }),
		channel: "Tienda en línea",
		customerName: contact?.fullName ?? data.billingInfo?.legalName ?? null,
		customerNumber: data.customerNumber ?? null,
		customerEmail,
		customerPhone: contact?.phone ?? data.billingInfo?.phone ?? null,
		lines,
		shippingLabel: shipping.label,
		shippingPrice: shipping.price,
		productsTotal,
		subtotalWithoutIva,
		iva: total - subtotalWithoutIva,
		total,
		wantsInvoice: data.wantsInvoice,
		billingInfo: data.wantsInvoice ? data.billingInfo ?? null : null
	};
	const comprobanteTargets = [{
		to: "ventas@orb-lite.com",
		key: `comprobante-${data.orderId}-ventas`
	}, ...customerEmail ? [{
		to: customerEmail,
		key: `comprobante-${data.orderId}-cliente`
	}] : []];
	for (const target of comprobanteTargets) try {
		await sendTemplateEmail("comprobante-venta", target.to, {
			idempotencyKey: target.key,
			templateData: comprobanteData
		});
	} catch (error) {
		console.error("No se pudo enviar el comprobante de venta", error);
	}
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		const { registerRenewals } = await import("./renovaciones.server-BHO4Jh8a.mjs");
		const renewalLines = data.items.flatMap((item) => {
			const found = findVariant(item.variant_id);
			if (!found || found.product.category !== "RENOVATION") return [];
			return [{
				variantId: item.variant_id,
				variantName: found.variant.name,
				amount: found.variant.price * item.quantity,
				renewal: item.renewal ?? null
			}];
		});
		if (renewalLines.length > 0) await registerRenewals(supabaseAdmin, {
			orderId: data.orderId,
			customerNumber: data.customerNumber ?? null,
			customerName: contact?.fullName ?? data.billingInfo?.legalName ?? null,
			customerEmail,
			customerPhone: contact?.phone ?? data.billingInfo?.phone ?? null
		}, renewalLines);
	} catch (error) {
		console.error("No se pudieron programar los avisos de renovación", error);
	}
	return { ok: true };
});
//#endregion
export { notifyNewOrder_createServerFn_handler };
