import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type SharedRouteStop = {
  label: string;
  lat: number;
  lon: number;
  visitedAt?: string;
  comment?: string;
  /** Si el operador tuvo acercamiento con el cliente en la visita. */
  contact?: boolean;
  /** Distancia en metros entre el operador y la parada al dar el check. */
  checkDistance?: number;
};

export type StoredUserRoute = {
  id: string;
  userId: number;
  userName?: string;
  name: string;
  color: string;
  points: Array<{ lat: number; lon: number; radius: number }>;
  routeStops?: Array<{ lat: number; lon: number; label: string }>;
  origin?: string;
  addresses?: string[];
  distanceMeters?: number;
  durationSeconds?: number;
  createdAt: string;
  /** Token del enlace público para operadores (sin iniciar sesión). */
  shareToken?: string;
  /** Paradas del enlace público con su check de visita. */
  stops?: SharedRouteStop[];
  /** Correo que recibe el reporte de visitas al terminar la ruta. */
  reportEmail?: string;
  reportSentAt?: string;
};

type RouteRow = {
  id: string;
  user_id: number;
  user_name: string | null;
  name: string;
  color: string;
  points: StoredUserRoute["points"];
  route_stops: StoredUserRoute["routeStops"] | null;
  origin: string | null;
  addresses: string[] | null;
  distance_meters: number | null;
  duration_seconds: number | null;
  share_token: string | null;
  stops: SharedRouteStop[] | null;
  report_email: string | null;
  report_sent_at: string | null;
  created_at: string;
};

function rowToRoute(row: RouteRow): StoredUserRoute {
  return {
    id: row.id,
    userId: row.user_id,
    ...(row.user_name != null && { userName: row.user_name }),
    name: row.name,
    color: row.color,
    points: row.points ?? [],
    ...(row.route_stops != null && { routeStops: row.route_stops }),
    ...(row.origin != null && { origin: row.origin }),
    ...(row.addresses != null && { addresses: row.addresses }),
    ...(row.distance_meters != null && { distanceMeters: row.distance_meters }),
    ...(row.duration_seconds != null && {
      durationSeconds: row.duration_seconds,
    }),
    createdAt: row.created_at,
    ...(row.share_token != null && { shareToken: row.share_token }),
    ...(row.stops != null && { stops: row.stops }),
    ...(row.report_email != null && { reportEmail: row.report_email }),
    ...(row.report_sent_at != null && { reportSentAt: row.report_sent_at }),
  };
}

function routeToRow(route: StoredUserRoute) {
  return {
    id: route.id,
    user_id: route.userId,
    user_name: route.userName ?? null,
    name: route.name,
    color: route.color,
    points: route.points,
    route_stops: route.routeStops ?? null,
    origin: route.origin ?? null,
    addresses: route.addresses ?? null,
    distance_meters: route.distanceMeters ?? null,
    duration_seconds: route.durationSeconds ?? null,
    share_token: route.shareToken ?? null,
    stops: route.stops ?? null,
    report_email: route.reportEmail ?? null,
    report_sent_at: route.reportSentAt ?? null,
    created_at: route.createdAt,
  };
}

// Store en memoria resiliente para garantizar que los enlaces compartidos y rutas
// se registren y consulten siempre de inmediato, con sincronización a Supabase si está disponible.
const inMemoryRoutes = new Map<string, StoredUserRoute>();

export async function getUserRoutesFromStorage(
  userIds: number | number[],
): Promise<StoredUserRoute[]> {
  const ids = Array.isArray(userIds) ? userIds : [userIds];
  if (ids.length === 0) return [];
  try {
    const { data, error } = await supabaseAdmin
      .from("user_routes")
      .select("*")
      .in("user_id", ids)
      .order("created_at", { ascending: false });
    if (!error && data) {
      const dbRoutes = (data as RouteRow[]).map(rowToRoute);
      for (const r of dbRoutes) {
        inMemoryRoutes.set(r.id, r);
        if (r.shareToken) inMemoryRoutes.set(r.shareToken, r);
      }
      return dbRoutes;
    }
  } catch (err) {
    console.warn("[user-routes] Supabase offline, using in-memory store:", err);
  }

  // Fallback en memoria
  return Array.from(inMemoryRoutes.values())
    .filter((r) => ids.includes(r.userId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveUserRouteToStorage(
  route: Omit<StoredUserRoute, "id" | "createdAt">,
): Promise<StoredUserRoute> {
  const newRoute: StoredUserRoute = {
    ...route,
    id: `route_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  // Guardar en memoria inmediatamente
  inMemoryRoutes.set(newRoute.id, newRoute);
  if (newRoute.shareToken) {
    inMemoryRoutes.set(newRoute.shareToken, newRoute);
  }

  try {
    await supabaseAdmin.from("user_routes").insert(routeToRow(newRoute));
  } catch (err) {
    console.warn("[user-routes] Could not sync insert to Supabase, persisted in memory:", err);
  }

  return newRoute;
}

export async function deleteUserRouteFromStorage(
  userId: number,
  routeId: string,
  allowedUserIds?: number[],
): Promise<boolean> {
  const existing = inMemoryRoutes.get(routeId);
  if (existing?.shareToken) {
    inMemoryRoutes.delete(existing.shareToken);
  }
  inMemoryRoutes.delete(routeId);

  for (const [key, val] of inMemoryRoutes.entries()) {
    if (val.id === routeId) {
      inMemoryRoutes.delete(key);
    }
  }

  try {
    await supabaseAdmin.from("user_route_assignments").delete().eq("route_id", routeId);
    await supabaseAdmin.from("shared_links").delete().eq("route_id", routeId);
    if (allowedUserIds && allowedUserIds.length > 0) {
      await supabaseAdmin
        .from("user_routes")
        .delete()
        .eq("id", routeId)
        .in("user_id", allowedUserIds);
    } else {
      await supabaseAdmin.from("user_routes").delete().eq("id", routeId);
    }
  } catch (err) {
    console.warn("[user-routes] Could not sync delete to Supabase:", err);
  }
  return true;
}

export async function getRouteByShareToken(token: string): Promise<StoredUserRoute | null> {
  // 1. Revisar caché en memoria
  const memoryHit = inMemoryRoutes.get(token);
  if (memoryHit && memoryHit.stops?.length) return memoryHit;

  for (const r of inMemoryRoutes.values()) {
    if (r.shareToken === token && r.stops?.length) return r;
  }

  // 2. Revisar Supabase
  try {
    const { data, error } = await supabaseAdmin
      .from("user_routes")
      .select("*")
      .eq("share_token", token)
      .maybeSingle();
    if (!error && data) {
      const found = rowToRoute(data as RouteRow);
      inMemoryRoutes.set(token, found);
      inMemoryRoutes.set(found.id, found);
      return found;
    }
  } catch (err) {
    console.warn("[user-routes] Supabase token query failed, relying on memory:", err);
  }

  return memoryHit ?? null;
}

export async function setRouteShare(
  userId: number,
  routeId: string,
  shareToken: string,
  stops: SharedRouteStop[],
  reportEmail?: string,
): Promise<StoredUserRoute | null> {
  let route = inMemoryRoutes.get(routeId);

  if (!route) {
    try {
      const { data } = await supabaseAdmin
        .from("user_routes")
        .select("*")
        .eq("id", routeId)
        .eq("user_id", userId)
        .maybeSingle();
      if (data) {
        route = rowToRoute(data as RouteRow);
      }
    } catch {
      // Ignorar error de red
    }
  }

  if (!route) return null;

  const recipientChanged = route.reportEmail !== reportEmail;
  route.shareToken = shareToken;
  route.stops = stops;
  if (reportEmail) route.reportEmail = reportEmail;
  else delete route.reportEmail;
  if (recipientChanged) delete route.reportSentAt;

  // Actualizar en memoria
  inMemoryRoutes.set(route.id, route);
  inMemoryRoutes.set(shareToken, route);

  try {
    await supabaseAdmin.from("user_routes").update(routeToRow(route)).eq("id", route.id);
    await supabaseAdmin.from("shared_links").upsert(
      {
        name: route.name,
        token: shareToken,
        route_id: route.id,
        is_active: true,
        created_by_id: String(userId),
        created_by_name: route.userName || null,
      },
      { onConflict: "token" },
    );
  } catch (err) {
    console.warn("[user-routes] Could not sync share update to Supabase:", err);
  }

  return route;
}

export async function markSharedStop(
  token: string,
  stopIndex: number,
  visited: boolean,
  check?: { contact: boolean; note: string; distance: number },
): Promise<StoredUserRoute | null> {
  const route = await getRouteByShareToken(token);
  if (!route || !route.stops || !route.stops[stopIndex]) return null;
  const stop = route.stops[stopIndex];
  if (visited) {
    stop.visitedAt = new Date().toISOString();
    if (check) {
      stop.contact = check.contact;
      stop.comment = check.note;
      stop.checkDistance = Math.round(check.distance);
    }
  } else {
    delete stop.visitedAt;
    delete stop.contact;
    delete stop.checkDistance;
  }
  inMemoryRoutes.set(route.id, route);
  if (route.shareToken) inMemoryRoutes.set(route.shareToken, route);

  try {
    await supabaseAdmin.from("user_routes").update({ stops: route.stops }).eq("id", route.id);
  } catch (err) {
    console.warn("[user-routes] Could not sync stop update to Supabase:", err);
  }
  return route;
}

export async function updateSharedRoute(
  token: string,
  mutate: (route: StoredUserRoute) => boolean,
): Promise<StoredUserRoute | null> {
  const route = await getRouteByShareToken(token);
  if (!route || !mutate(route)) return null;

  inMemoryRoutes.set(route.id, route);
  if (route.shareToken) inMemoryRoutes.set(route.shareToken, route);

  try {
    await supabaseAdmin.from("user_routes").update(routeToRow(route)).eq("id", route.id);
  } catch (err) {
    console.warn("[user-routes] Could not sync route update to Supabase:", err);
  }
  return route;
}

export async function getSavedReportEmails(userId: number): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("user_routes")
    .select("report_email")
    .eq("user_id", userId)
    .not("report_email", "is", null)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  const seen = new Set<string>();
  const emails: string[] = [];
  for (const row of data as Array<{ report_email: string | null }>) {
    const email = row.report_email;
    if (email && !seen.has(email)) {
      seen.add(email);
      emails.push(email);
      if (emails.length >= 10) break;
    }
  }
  return emails;
}

export async function rememberReportEmail(_userId: number, _email: string) {
  // Los correos se derivan de las rutas guardadas (getSavedReportEmails);
  // no hace falta un almacenamiento aparte.
}

/** Asigna una ruta a un usuario operativo o chofer en user_route_assignments */
export async function assignRouteToUser(
  routeId: string,
  assignedUserId: string,
): Promise<{ ok: boolean; id?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from("user_route_assignments")
      .insert({
        route_id: routeId,
        assigned_user_id: assignedUserId,
      })
      .select("id")
      .single();

    if (error) {
      console.warn("[user-routes] Error assigning route to user:", error);
      return { ok: false };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    console.warn("[user-routes] Exception assigning route:", err);
    return { ok: false };
  }
}

/** Desvincula la asignación de una ruta para un usuario */
export async function unassignRouteFromUser(
  routeId: string,
  assignedUserId: string,
): Promise<{ ok: boolean }> {
  try {
    const { error } = await supabaseAdmin
      .from("user_route_assignments")
      .delete()
      .eq("route_id", routeId)
      .eq("assigned_user_id", assignedUserId);

    if (error) {
      console.warn("[user-routes] Error unassigning route:", error);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.warn("[user-routes] Exception unassigning route:", err);
    return { ok: false };
  }
}

/** Obtiene las asignaciones de una ruta */
export async function getRouteAssignments(routeId: string): Promise<string[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("user_route_assignments")
      .select("assigned_user_id")
      .eq("route_id", routeId);

    if (error || !data) return [];
    return data.map((r: any) => r.assigned_user_id);
  } catch {
    return [];
  }
}

