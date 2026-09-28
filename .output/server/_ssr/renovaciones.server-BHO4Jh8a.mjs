import { l as renewalMeta } from "./catalog-BhuVKh9L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/renovaciones.server-BHO4Jh8a.js
/**
* Bitácora de renovaciones programadas.
* Cada venta de una renovación deja registrada la próxima fecha de corte
* (siempre el día primero del mes de renovación) para que el cron diario
* envíe los avisos 10, 5, 3 y 1 día antes, y las alertas de adeudo.
*/
/** Próxima fecha de renovación: día 1 del mes siguiente al periodo pagado. */
function nextRenewalDate(period, from = /* @__PURE__ */ new Date()) {
	const y = from.getUTCFullYear();
	const m = from.getUTCMonth();
	return (period === "monthly" ? new Date(Date.UTC(y, m + 1, 1)) : new Date(Date.UTC(y + 1, m, 1))).toISOString().slice(0, 10);
}
/** Registra o actualiza las renovaciones de una venta (tienda o CRM). */
async function registerRenewals(supabaseAdmin, customer, lines) {
	for (const line of lines) {
		const meta = renewalMeta(line.variantId);
		if (!meta) continue;
		const r = line.renewal ?? {};
		const clean = (v) => {
			const s = typeof v === "string" ? v.trim() : "";
			return s.length > 0 ? s : null;
		};
		const imei = clean(r["imei"]);
		const iccid = clean(r["iccid"]);
		const renewalDate = nextRenewalDate(meta.period);
		const payload = {
			customer_number: customer.customerNumber ?? null,
			customer_name: customer.customerName ?? null,
			customer_email: customer.customerEmail ?? null,
			customer_phone: customer.customerPhone ?? null,
			variant_id: line.variantId,
			variant_name: line.variantName,
			platform: meta.platform ?? null,
			renewal_kind: meta.kind,
			renewal_period: meta.period,
			unit_name: clean(r["unitName"]),
			imei,
			iccid,
			sim_phone: clean(r["simPhone"]),
			amount: line.amount,
			renewal_date: renewalDate,
			last_paid_at: (/* @__PURE__ */ new Date()).toISOString(),
			status: "activa",
			last_order_id: customer.orderId,
			notices: []
		};
		try {
			let existingId = null;
			const match = supabaseAdmin.from("renovaciones").select("id").limit(1);
			if (imei) {
				const { data } = await match.eq("imei", imei).eq("variant_id", line.variantId);
				existingId = data?.[0]?.id ?? null;
			} else if (iccid) {
				const { data } = await match.eq("iccid", iccid).eq("variant_id", line.variantId);
				existingId = data?.[0]?.id ?? null;
			}
			if (existingId) await supabaseAdmin.from("renovaciones").update(payload).eq("id", existingId);
			else await supabaseAdmin.from("renovaciones").insert(payload);
		} catch (error) {
			console.error("No se pudo registrar la renovación", error);
		}
	}
}
//#endregion
export { registerRenewals };
