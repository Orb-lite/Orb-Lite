import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "@/integrations/supabase/client.server";

export type PlatformUserProfile = {
  id?: string;
  wialonUserId: number;
  wialonUsername: string;
  host: "lite" | "full";
  customerNumber: number | null;
  fullName: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  billing?: Record<string, unknown> | null;
  renewals: Array<{
    id: string;
    unit_name: string | null;
    platform: string | null;
    renewal_date: string | null;
    status: string | null;
    amount: number | null;
    imei: string | null;
  }>;
  orders: Array<{
    order_id: string;
    total: number;
    status: string;
    created_at: string;
  }>;
  savedRoutesCount: number;
};

const syncInputSchema = z.object({
  wialonUserId: z.number().int(),
  wialonUsername: z.string().trim().min(1),
  host: z.enum(["lite", "full"]).default("lite"),
});

/**
 * Verifica si existe un usuario con el ID de Wialon en la base de datos de ORB-LITE.
 * Si no existe, lo crea.
 * Si existe, carga su información registrada y todas sus tablas relacionadas (renovaciones, solicitudes, rutas).
 */
export const syncWialonPlatformUser = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => syncInputSchema.parse(input))
  .handler(async ({ data }): Promise<PlatformUserProfile> => {
    const supabase = getSupabaseServerClient();
    const wialonUserId = data.wialonUserId;
    const wialonUsername = data.wialonUsername;
    const host = data.host;

    let customerNumber: number | null = null;
    let fullName = wialonUsername;
    let company: string | null = null;
    let email: string | null = null;
    let phone: string | null = null;
    let billing: Record<string, unknown> | null = null;
    let role = "client";
    let profileId: string | undefined = undefined;

    // 1. Intentar consultar en la tabla especializada platform_users
    try {
      const { data: puData, error: puErr } = await supabase
        .from("platform_users" as any)
        .select("*")
        .eq("wialon_user_id", wialonUserId)
        .maybeSingle();

      if (!puErr && puData) {
        profileId = (puData as any).id;
        customerNumber = (puData as any).customer_number ?? null;
        fullName = (puData as any).full_name || wialonUsername;
        company = (puData as any).company ?? null;
        email = (puData as any).email ?? null;
        phone = (puData as any).phone ?? null;
        role = (puData as any).role || "client";

        // Actualizar último login
        await supabase
          .from("platform_users" as any)
          .update({ last_login_at: new Date().toISOString(), wialon_username: wialonUsername } as any)
          .eq("wialon_user_id", wialonUserId);
      }
    } catch {
      // Si la tabla platform_users aún no ha sido migrada, se continuará con customers
    }

    // 2. Si no se tenía customer_number o el usuario es nuevo, vincular con la tabla customers
    try {
      const { data: allCustomers } = await supabase.from("customers").select("*");
      const matched = (allCustomers || []).find((c: any) => {
        const contact = c.contact || {};
        if (customerNumber && c.customer_number === customerNumber) return true;
        if (contact.wialon_user_id && String(contact.wialon_user_id) === String(wialonUserId)) return true;
        // Búsqueda por coincidencia de nombre o razón social
        const lowerUser = wialonUsername.toLowerCase();
        if (c.full_name?.toLowerCase().includes(lowerUser)) return true;
        if (contact.fullName?.toLowerCase().includes(lowerUser)) return true;
        if (contact.businessName?.toLowerCase().includes(lowerUser)) return true;
        return false;
      });

      if (matched) {
        customerNumber = matched.customer_number;
        fullName = matched.full_name || fullName;
        email = matched.email || email;
        phone = matched.phone || phone;
        company = (matched.contact as any)?.businessName || company;
        billing = matched.billing as Record<string, unknown> | null;

        // Actualizar el contact del cliente para recordar este ID de Wialon
        const currentContact = (matched.contact as Record<string, unknown>) || {};
        if (String(currentContact.wialon_user_id) !== String(wialonUserId)) {
          await supabase
            .from("customers")
            .update({
              contact: {
                ...currentContact,
                wialon_user_id: wialonUserId,
                wialon_username: wialonUsername,
                last_wialon_login: new Date().toISOString(),
              },
            })
            .eq("customer_number", matched.customer_number);
        }
      }
    } catch (custErr) {
      console.warn("[syncWialonPlatformUser] Error al consultar customers:", custErr);
    }

    // 3. Si el usuario no existía en platform_users, registrarlo automáticamente
    if (!profileId) {
      try {
        const newRecord = {
          wialon_user_id: wialonUserId,
          wialon_username: wialonUsername,
          host,
          customer_number: customerNumber,
          full_name: fullName,
          company,
          email,
          phone,
          role,
          last_login_at: new Date().toISOString(),
        };

        const { data: inserted } = await supabase
          .from("platform_users" as any)
          .insert(newRecord as any)
          .select("id")
          .maybeSingle();

        if (inserted) {
          profileId = (inserted as any).id;
        }
      } catch {
        // En caso de que la tabla aún no esté creada en la base de datos
      }
    }

    // 4. Consultar tablas relacionadas: Renovaciones
    let renewals: PlatformUserProfile["renewals"] = [];
    if (customerNumber) {
      try {
        const { data: renData } = await supabase
          .from("renovaciones")
          .select("id, unit_name, platform, renewal_date, status, amount, imei")
          .eq("customer_number", customerNumber);
        renewals = (renData as any) || [];
      } catch (rErr) {
        console.warn("[syncWialonPlatformUser] Error al obtener renovaciones:", rErr);
      }
    }

    // 5. Consultar tablas relacionadas: Solicitudes / Pedidos
    let orders: PlatformUserProfile["orders"] = [];
    if (customerNumber) {
      try {
        const { data: solData } = await supabase
          .from("solicitudes")
          .select("order_id, total, status, created_at")
          .eq("customer_number", customerNumber)
          .order("created_at", { ascending: false });
        orders = (solData as any) || [];
      } catch (sErr) {
        console.warn("[syncWialonPlatformUser] Error al obtener solicitudes:", sErr);
      }
    }

    // 6. Consultar tablas relacionadas: Rutas guardadas
    let savedRoutesCount = 0;
    try {
      const { count } = await supabase
        .from("user_routes" as any)
        .select("*", { count: "exact", head: true })
        .eq("user_id", wialonUserId);
      savedRoutesCount = count ?? 0;
    } catch {
      // ignorar si no hay rutas
    }

    return {
      id: profileId,
      wialonUserId,
      wialonUsername,
      host,
      customerNumber,
      fullName,
      company,
      email,
      phone,
      role,
      billing,
      renewals,
      orders,
      savedRoutesCount,
    };
  });
