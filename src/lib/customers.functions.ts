import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  fullName: z.string().trim().min(1).max(150),
  phone: z.string().trim().min(1).max(30),
  city: z.string().trim().max(120).optional(),
  state: z.string().trim().max(120).optional(),
  zip: z.string().trim().max(10).optional(),
});

const billingSchema = z.object({
  legalName: z.string().trim().min(1).max(200),
  rfc: z.string().trim().min(1).max(20),
  taxRegime: z.string().trim().min(1).max(200),
  cfdiUse: z.string().trim().min(1).max(200),
  fiscalZip: z.string().trim().min(1).max(10),
  email: z.string().trim().email().max(150),
  phone: z.string().trim().min(1).max(30),
  fiscalAddress: z.string().trim().max(250).optional().or(z.literal("")),
});

export interface CustomerRecord {
  customerNumber: number;
  fullName: string;
  phone: string;
  email: string | null;
  contact: z.infer<typeof contactSchema> | null;
  billing: z.infer<typeof billingSchema> | null;
  ordersCount: number;
}

/** Consulta un cliente por su número para precargar sus datos. */
export const lookupCustomer = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ customerNumber: z.number().int().min(500).max(9_999_999) }).parse(data),
  )
  .handler(async ({ data }): Promise<CustomerRecord | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("customers")
      .select("customer_number, full_name, phone, email, contact, billing, orders_count")
      .eq("customer_number", data.customerNumber)
      .maybeSingle();

    if (error) throw new Error("No se pudo consultar el número de cliente");
    if (!row) return null;

    return {
      customerNumber: row.customer_number,
      fullName: row.full_name,
      phone: row.phone,
      email: row.email ?? null,
      contact: (row.contact as CustomerRecord["contact"]) ?? null,
      billing: (row.billing as CustomerRecord["billing"]) ?? null,
      ordersCount: row.orders_count,
    };
  });

const saveSchema = z.object({
  customerNumber: z.number().int().min(500).max(9_999_999).nullish(),
  fullName: z.string().trim().min(1).max(150),
  phone: z.string().trim().min(1).max(30),
  email: z.string().trim().email().max(150).nullish(),
  contact: contactSchema.nullish(),
  billing: billingSchema.nullish(),
  orderId: z.string().trim().min(1).max(64),
  orderTotal: z.number().min(0).max(10_000_000),
});

function randomCustomerNumber() {
  // 500 en adelante
  return 500 + Math.floor(Math.random() * 99_500);
}

/**
 * Registra la compra en el historial del cliente. Si no llega número de cliente,
 * genera uno aleatorio (500 en adelante) y lo devuelve.
 */
export const saveCustomerOrder = createServerFn({ method: "POST" })
  .inputValidator((data) => saveSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const payload = {
      full_name: data.fullName,
      phone: data.phone,
      email: data.email ?? data.billing?.email ?? null,
      contact: data.contact ?? null,
      billing: data.billing ?? null,
      last_order_id: data.orderId,
    };

    if (data.customerNumber) {
      const { data: existing } = await supabaseAdmin
        .from("customers")
        .select("orders_count, total_spent, billing, contact")
        .eq("customer_number", data.customerNumber)
        .maybeSingle();

      if (existing) {
        const { error } = await supabaseAdmin
          .from("customers")
          .update({
            ...payload,
            contact: payload.contact ?? existing.contact,
            billing: payload.billing ?? existing.billing,
            orders_count: existing.orders_count + 1,
            total_spent: Number(existing.total_spent) + data.orderTotal,
          })
          .eq("customer_number", data.customerNumber);
        if (error) throw new Error("No se pudo actualizar el registro del cliente");
        return { customerNumber: data.customerNumber, isNew: false as const };
      }
    }

    for (let attempt = 0; attempt < 8; attempt++) {
      const candidate = data.customerNumber ?? randomCustomerNumber();
      const { data: inserted, error } = await supabaseAdmin
        .from("customers")
        .insert({
          ...payload,
          customer_number: candidate,
          orders_count: 1,
          total_spent: data.orderTotal,
        })
        .select("customer_number")
        .single();

      if (!error && inserted) {
        return { customerNumber: inserted.customer_number, isNew: true as const };
      }
      if (data.customerNumber) throw new Error("No se pudo registrar el cliente");
    }

    throw new Error("No se pudo generar un número de cliente");
  });
