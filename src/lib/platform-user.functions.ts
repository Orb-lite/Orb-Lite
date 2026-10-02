import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "@/integrations/supabase/client.server";
import { wialonCall, type WialonHost } from "@/lib/wialon.server";

export type SubuserInfo = {
  id?: string;
  wialonUserId: number;
  wialonUsername: string;
  role: string;
  permissions: {
    routes: boolean;
    geofences: boolean;
    tracking_links: boolean;
  };
  lastLoginAt?: string | null;
  routesCount?: number;
};

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
  isParent: boolean;
  parentUserId: number | null;
  parentUsername: string | null;
  subusers: SubuserInfo[];
  subuserPermissions: {
    routes: boolean;
    geofences: boolean;
    tracking_links: boolean;
  };
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
  sid: z.string().optional().nullable(),
});

/**
 * Sincroniza la cuenta de Wialon con la base de datos de ORB-LITE:
 * 1. Detecta si la cuenta es padre o subcuenta.
 * 2. Consulta en Wialon si tiene subcuentas asociadas y les crea automáticamente su usuario en Supabase.
 * 3. Habilita visibilidad bidireccional: la cuenta padre ve TODO lo generado por las subcuentas,
 *    y la cuenta padre decide qué compartir (rutas, geocercas, links) con sus subcuentas.
 */
export const syncWialonPlatformUser = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => syncInputSchema.parse(input))
  .handler(async ({ data }): Promise<PlatformUserProfile> => {
    const supabase = getSupabaseServerClient();
    const wialonUserId = data.wialonUserId;
    const wialonUsername = data.wialonUsername;
    const host = data.host;
    const sid = data.sid;

    let customerNumber: number | null = null;
    let fullName = wialonUsername;
    let company: string | null = null;
    let email: string | null = null;
    let phone: string | null = null;
    let billing: Record<string, unknown> | null = null;
    let role = "client";
    let profileId: string | undefined = undefined;
    let isParent = false;
    let parentUserId: number | null = null;
    let parentUsername: string | null = null;
    let subuserPermissions = {
      routes: true,
      geofences: true,
      tracking_links: true,
    };
    const subusers: SubuserInfo[] = [];

    // 1. Consultar usuario actual en platform_users
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
        isParent = Boolean((puData as any).is_parent);
        parentUserId = (puData as any).parent_user_id ? Number((puData as any).parent_user_id) : null;
        if ((puData as any).shared_permissions) {
          subuserPermissions = {
            ...subuserPermissions,
            ...(puData as any).shared_permissions,
          };
        }

        // Actualizar último login
        await supabase
          .from("platform_users" as any)
          .update({ last_login_at: new Date().toISOString(), wialon_username: wialonUsername } as any)
          .eq("wialon_user_id", wialonUserId);
      }
    } catch {
      // Si la tabla no está creada, el fallback continuará
    }

    // 2. Si es subcuenta, buscar información del padre
    if (parentUserId) {
      try {
        const { data: parentData } = await supabase
          .from("platform_users" as any)
          .select("wialon_username, full_name, company")
          .eq("wialon_user_id", parentUserId)
          .maybeSingle();
        if (parentData) {
          parentUsername = (parentData as any).full_name || (parentData as any).wialon_username;
        }
      } catch {}
    }

    // 3. Vincular con clientes en CRM si no se tenía customer_number
    try {
      const { data: allCustomers } = await supabase.from("customers").select("*");
      const matched = (allCustomers || []).find((c: any) => {
        const contact = c.contact || {};
        if (customerNumber && c.customer_number === customerNumber) return true;
        if (contact.wialon_user_id && String(contact.wialon_user_id) === String(wialonUserId)) return true;
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

    // 4. DETECTAR SUBCUENTAS EN WIALON SI HAY SESIÓN ACTIVA
    if (sid) {
      try {
        const wialonUsersRes = await wialonCall<{
          items?: Array<{
            id: number;
            nm: string;
            crt?: number;
            bact?: number;
            fl?: number;
          }>;
        }>(
          host,
          "core/search_items",
          {
            spec: {
              itemsType: "user",
              propName: "sys_name",
              propValueMask: "*",
              sortType: "sys_name",
            },
            force: 1,
            flags: 1,
            from: 0,
            to: 0,
          },
          sid,
        );

        const childUsers = (wialonUsersRes?.items || []).filter(
          (u) => u.id !== wialonUserId,
        );

        if (childUsers.length > 0) {
          isParent = true;
          role = "parent";

          // Asegurar cada subcuenta en Supabase
          for (const child of childUsers) {
            let childDbRecord: any = null;
            try {
              const { data: existingChild } = await supabase
                .from("platform_users" as any)
                .select("*")
                .eq("wialon_user_id", child.id)
                .maybeSingle();

              if (!existingChild) {
                const { data: newChild } = await supabase
                  .from("platform_users" as any)
                  .insert({
                    wialon_user_id: child.id,
                    wialon_username: child.nm,
                    host,
                    customer_number: customerNumber,
                    full_name: child.nm,
                    company,
                    role: "subuser",
                    is_parent: false,
                    parent_user_id: wialonUserId,
                    shared_permissions: { routes: true, geofences: true, tracking_links: true },
                    last_login_at: null,
                  } as any)
                  .select("*")
                  .maybeSingle();
                childDbRecord = newChild;
              } else {
                childDbRecord = existingChild;
                if (!existingChild.parent_user_id) {
                  await supabase
                    .from("platform_users" as any)
                    .update({ parent_user_id: wialonUserId, role: "subuser" } as any)
                    .eq("wialon_user_id", child.id);
                }
              }
            } catch (childErr) {
              console.warn(`[syncWialonPlatformUser] Error al registrar subusuario ${child.nm}:`, childErr);
            }

            subusers.push({
              id: childDbRecord?.id,
              wialonUserId: child.id,
              wialonUsername: child.nm,
              role: "subuser",
              permissions: childDbRecord?.shared_permissions || {
                routes: true,
                geofences: true,
                tracking_links: true,
              },
              lastLoginAt: childDbRecord?.last_login_at,
            });
          }
        }
      } catch (wialonUsersErr) {
        console.warn("[syncWialonPlatformUser] No se pudieron listar usuarios de Wialon:", wialonUsersErr);
      }
    }

    // 5. Si no se tenía subusers por Wialon, consultar si en Supabase tiene subcuentas vinculadas
    if (subusers.length === 0) {
      try {
        const { data: dbSubusers } = await supabase
          .from("platform_users" as any)
          .select("*")
          .eq("parent_user_id", wialonUserId);

        if (dbSubusers && dbSubusers.length > 0) {
          isParent = true;
          for (const s of dbSubusers as any[]) {
            subusers.push({
              id: s.id,
              wialonUserId: Number(s.wialon_user_id),
              wialonUsername: s.wialon_username,
              role: s.role || "subuser",
              permissions: s.shared_permissions || {
                routes: true,
                geofences: true,
                tracking_links: true,
              },
              lastLoginAt: s.last_login_at,
            });
          }
        }
      } catch {}
    }

    // 6. Guardar o actualizar registro del usuario principal
    try {
      const userPayload = {
        wialon_user_id: wialonUserId,
        wialon_username: wialonUsername,
        host,
        customer_number: customerNumber,
        full_name: fullName,
        company,
        email,
        phone,
        role: isParent ? "parent" : role,
        is_parent: isParent,
        parent_user_id: parentUserId,
        shared_permissions: subuserPermissions,
        last_login_at: new Date().toISOString(),
      };

      if (!profileId) {
        const { data: inserted } = await supabase
          .from("platform_users" as any)
          .insert(userPayload as any)
          .select("id")
          .maybeSingle();
        if (inserted) profileId = (inserted as any).id;
      } else {
        await supabase
          .from("platform_users" as any)
          .update(userPayload as any)
          .eq("wialon_user_id", wialonUserId);
      }
    } catch {}

    // 7. Consultar tablas relacionadas: Renovaciones
    let renewals: PlatformUserProfile["renewals"] = [];
    if (customerNumber) {
      try {
        const { data: renData } = await supabase
          .from("renovaciones")
          .select("id, unit_name, platform, renewal_date, status, amount, imei")
          .eq("customer_number", customerNumber);
        renewals = (renData as any) || [];
      } catch {}
    }

    // 8. Consultar tablas relacionadas: Pedidos
    let orders: PlatformUserProfile["orders"] = [];
    if (customerNumber) {
      try {
        const { data: solData } = await supabase
          .from("solicitudes")
          .select("order_id, total, status, created_at")
          .eq("customer_number", customerNumber)
          .order("created_at", { ascending: false });
        orders = (solData as any) || [];
      } catch {}
    }

    // 9. Conteo de rutas (cuenta padre ve sus rutas Y las de todas sus subcuentas)
    let savedRoutesCount = 0;
    try {
      const allUserIds = isParent
        ? [wialonUserId, ...subusers.map((s) => s.wialonUserId)]
        : [wialonUserId];

      const { count } = await supabase
        .from("user_routes" as any)
        .select("*", { count: "exact", head: true })
        .in("user_id", allUserIds);
      savedRoutesCount = count ?? 0;
    } catch {}

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
      role: isParent ? "parent" : role,
      isParent,
      parentUserId,
      parentUsername,
      subusers,
      subuserPermissions,
      billing,
      renewals,
      orders,
      savedRoutesCount,
    };
  });

/**
 * Permite a la cuenta padre activar o desactivar la visibilidad de rutas, geocercas
 * y links compartidos para una subcuenta específica.
 */
export const updateSubuserPermissions = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        parentUserId: z.number().int(),
        subuserId: z.number().int(),
        permissions: z.object({
          routes: z.boolean(),
          geofences: z.boolean(),
          tracking_links: z.boolean(),
        }),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    try {
      const { error } = await supabase
        .from("platform_users" as any)
        .update({ shared_permissions: data.permissions } as any)
        .eq("wialon_user_id", data.subuserId)
        .eq("parent_user_id", data.parentUserId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      throw new Error(`Error al actualizar permisos: ${err?.message || "fallo"}`);
    }
  });

/**
 * Devuelve todos los IDs de usuario cuyas rutas o links son visibles para la sesión actual.
 * - Cuenta Padre: ve sus propios recursos y los de TODAS sus subcuentas.
 * - Subcuenta: ve sus recursos y los de la cuenta padre (si tiene permiso).
 */
export function getVisibleUserIdsForSession(profile?: PlatformUserProfile | null): number[] {
  if (!profile) return [];
  if (profile.isParent) {
    return [profile.wialonUserId, ...profile.subusers.map((s) => s.wialonUserId)];
  }
  if (profile.parentUserId && profile.subuserPermissions.routes) {
    return [profile.wialonUserId, profile.parentUserId];
  }
  return [profile.wialonUserId];
}
