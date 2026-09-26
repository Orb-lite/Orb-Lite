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

export async function getUserRoutesFromStorage(
  userId: number,
): Promise<StoredUserRoute[]> {
  const { data, error } = await supabaseAdmin
    .from("user_routes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as RouteRow[]).map(rowToRoute);
}

export async function saveUserRouteToStorage(
  route: Omit<StoredUserRoute, "id" | "createdAt">,
): Promise<StoredUserRoute> {
  const newRoute: StoredUserRoute = {
    ...route,
    id: `route_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const { error } = await supabaseAdmin
    .from("user_routes")
    .insert(routeToRow(newRoute));
  if (error) throw new Error(error.message);
  return newRoute;
}

export async function deleteUserRouteFromStorage(
  userId: number,
  routeId: string,
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("user_routes")
    .delete()
    .eq("id", routeId)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return true;
}

export async function getRouteByShareToken(
  token: string,
): Promise<StoredUserRoute | null> {
  const { data, error } = await supabaseAdmin
    .from("user_routes")
    .select("*")
    .eq("share_token", token)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToRoute(data as RouteRow) : null;
}

export async function setRouteShare(
  userId: number,
  routeId: string,
  shareToken: string,
  stops: SharedRouteStop[],
  reportEmail?: string,
): Promise<StoredUserRoute | null> {
  const { data, error } = await supabaseAdmin
    .from("user_routes")
    .select("*")
    .eq("id", routeId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const route = rowToRoute(data as RouteRow);
  const recipientChanged = route.reportEmail !== reportEmail;
  route.shareToken = shareToken;
  route.stops = stops;
  if (reportEmail) route.reportEmail = reportEmail;
  else delete route.reportEmail;
  if (recipientChanged) delete route.reportSentAt;
  const { error: updateError } = await supabaseAdmin
    .from("user_routes")
    .update(routeToRow(route))
    .eq("id", route.id);
  if (updateError) throw new Error(updateError.message);
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
  const { error } = await supabaseAdmin
    .from("user_routes")
    .update({ stops: route.stops })
    .eq("id", route.id);
  if (error) throw new Error(error.message);
  return route;
}

export async function updateSharedRoute(
  token: string,
  mutate: (route: StoredUserRoute) => boolean,
): Promise<StoredUserRoute | null> {
  const route = await getRouteByShareToken(token);
  if (!route || !mutate(route)) return null;
  const { error } = await supabaseAdmin
    .from("user_routes")
    .update(routeToRow(route))
    .eq("id", route.id);
  if (error) throw new Error(error.message);
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
