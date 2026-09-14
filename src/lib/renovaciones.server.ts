/**
 * Bitácora de renovaciones programadas.
 * Cada venta de una renovación deja registrada la próxima fecha de corte
 * (siempre el día primero del mes de renovación) para que el cron diario
 * envíe los avisos 10, 5, 3 y 1 día antes, y las alertas de adeudo.
 */
import { renewalMeta } from "@/data/catalog";

export type RenewalPeriodo = "monthly" | "annual";

/** Próxima fecha de renovación: día 1 del mes siguiente al periodo pagado. */
export function nextRenewalDate(period: RenewalPeriodo, from: Date = new Date()): string {
  const y = from.getUTCFullYear();
  const m = from.getUTCMonth();
  const next =
    period === "monthly" ? new Date(Date.UTC(y, m + 1, 1)) : new Date(Date.UTC(y + 1, m, 1));
  return next.toISOString().slice(0, 10);
}

export interface RenewalSaleLine {
  variantId: string;
  variantName: string;
  amount: number;
  renewal?: Record<string, string | null | undefined> | null;
}

export interface RenewalCustomer {
  orderId: string;
  customerNumber?: number | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
}

/** Registra o actualiza las renovaciones de una venta (tienda o CRM). */
export async function registerRenewals(
  supabaseAdmin: any,
  customer: RenewalCustomer,
  lines: RenewalSaleLine[],
): Promise<void> {
  for (const line of lines) {
    const meta = renewalMeta(line.variantId);
    if (!meta) continue;
    const r = line.renewal ?? {};
    const clean = (v: unknown) => {
      const s = typeof v === "string" ? v.trim() : "";
      return s.length > 0 ? s : null;
    };
    const imei = clean(r["imei"]);
    const iccid = clean(r["iccid"]);
    const renewalDate = nextRenewalDate(meta.period as RenewalPeriodo);

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
      last_paid_at: new Date().toISOString(),
      status: "activa",
      last_order_id: customer.orderId,
      notices: [],
    };

    try {
      // Si ya existe una renovación para el mismo equipo/chip, se actualiza.
      let existingId: string | null = null;
      const match = supabaseAdmin.from("renovaciones").select("id").limit(1);
      if (imei) {
        const { data } = await match.eq("imei", imei).eq("variant_id", line.variantId);
        existingId = data?.[0]?.id ?? null;
      } else if (iccid) {
        const { data } = await match.eq("iccid", iccid).eq("variant_id", line.variantId);
        existingId = data?.[0]?.id ?? null;
      }

      if (existingId) {
        await supabaseAdmin.from("renovaciones").update(payload).eq("id", existingId);
      } else {
        await supabaseAdmin.from("renovaciones").insert(payload);
      }
    } catch (error) {
      console.error("No se pudo registrar la renovación", error);
    }
  }
}
