import { getSupabaseServerClient } from "@/integrations/supabase/client.server";
import { wialonCall, type WialonHost } from "@/lib/wialon.server";

/**
 * REGLA DE ORO DE JERARQUÍA DE CUENTAS:
 * "Lo que crean los usuarios se verá por las cuentas superiores, pero no al revés."
 *
 * 1. Cuenta Superior (Padre / Administrador):
 *    - Supervisa TODO lo creado por sí misma Y por todas sus subcuentas (rutas, enlaces, geocercas).
 *    - Retorna [userId, ...subordinateUserIds].
 *
 * 2. Cuenta Subordinada (Subcuenta / Operador):
 *    - Solo ve lo que ella misma crea.
 *    - NUNCA ve lo creado por las cuentas superiores ni por otros subusuarios.
 *    - Retorna estrictamente [userId].
 */
export async function resolveHierarchicalUserIds(
  userId: number,
  host?: WialonHost,
  sid?: string,
): Promise<{ isSuperior: boolean; visibleIds: number[]; subordinateIds: number[] }> {
  const subordinateIds = new Set<number>();
  const supabase = getSupabaseServerClient();
  let isSuperior = false;

  // 1. Consultar base de datos de ORB-LITE (Supabase platform_users)
  try {
    // A) Verificar si el usuario actual es padre o tiene subcuentas vinculadas
    const { data: dbSubusers } = await supabase
      .from("platform_users" as any)
      .select("wialon_user_id, role, is_parent")
      .eq("parent_user_id", userId);

    if (dbSubusers && Array.isArray(dbSubusers) && dbSubusers.length > 0) {
      isSuperior = true;
      for (const row of dbSubusers as any[]) {
        const id = Number(row.wialon_user_id);
        if (Number.isFinite(id) && id > 0 && id !== userId) {
          subordinateIds.add(id);
        }
      }
    }

    // B) Verificar si en la base de datos ya está marcado como is_parent: true
    if (!isSuperior) {
      const { data: currentUserRecord } = await supabase
        .from("platform_users" as any)
        .select("is_parent, role, parent_user_id")
        .eq("wialon_user_id", userId)
        .maybeSingle();

      if (currentUserRecord) {
        if ((currentUserRecord as any).is_parent || (currentUserRecord as any).role === "parent") {
          isSuperior = true;
        }
      }
    }
  } catch (err) {
    console.warn("[hierarchy.server] Supabase check failed, continuing:", err);
  }

  // 2. Si hay sesión activa de Wialon, verificar árbol de creadores (crt) en Wialon
  if (host && sid) {
    try {
      const result = await wialonCall<{
        items?: Array<{ id: number; nm: string; crt?: number; bact?: number }>;
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
          flags: 1 + 4, // 1 = base, 4 = facturación y creador (crt)
          from: 0,
          to: 0,
        },
        sid,
      );

      for (const item of result?.items ?? []) {
        // En Wialon, `crt` es el ID del usuario creador (cuenta superior).
        // Si `crt === userId`, este item es una subcuenta creada por `userId`.
        if (item.id && item.id !== userId) {
          if (item.crt === userId || item.bact === userId) {
            isSuperior = true;
            subordinateIds.add(item.id);
          }
        }
      }
    } catch {
      // Subusuario sin permisos para core/search_items: se mantienen los datos recopilados
    }
  }

  const subArray = Array.from(subordinateIds);
  // Si es cuenta superior: ve lo propio + lo de todas sus subcuentas.
  // Si NO es cuenta superior: solo ve lo propio (estrictamente [userId]).
  const visibleIds = isSuperior ? [userId, ...subArray] : [userId];

  return {
    isSuperior,
    visibleIds,
    subordinateIds: subArray,
  };
}

/**
 * Valida si un usuario tiene permiso para gestionar (editar o eliminar) un recurso.
 * La cuenta superior puede gestionar los recursos de sus subcuentas, pero no al revés.
 */
export async function canUserManageResource(
  currentUserId: number,
  resourceOwnerUserId: number,
  host?: WialonHost,
  sid?: string,
): Promise<boolean> {
  if (currentUserId === resourceOwnerUserId) return true;
  const { isSuperior, subordinateIds } = await resolveHierarchicalUserIds(currentUserId, host, sid);
  return isSuperior && subordinateIds.includes(resourceOwnerUserId);
}
