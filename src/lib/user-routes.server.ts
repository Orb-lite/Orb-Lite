import fs from "node:fs/promises";
import path from "node:path";

export type SharedRouteStop = {
  label: string;
  lat: number;
  lon: number;
  visitedAt?: string;
  comment?: string;
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

const DATA_FILE = path.resolve(process.cwd(), "data/user_routes.json");

async function ensureFile(): Promise<StoredUserRoute[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as StoredUserRoute[];
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
    return [];
  }
}

export async function getUserRoutesFromStorage(
  userId: number,
): Promise<StoredUserRoute[]> {
  const all = await ensureFile();
  // Solo la cuenta de usuario conectada puede ver las rutas que creó
  return all
    .filter((r) => r.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export async function saveUserRouteToStorage(
  route: Omit<StoredUserRoute, "id" | "createdAt">,
): Promise<StoredUserRoute> {
  const all = await ensureFile();
  const newRoute: StoredUserRoute = {
    ...route,
    id: `route_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  all.push(newRoute);
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
  return newRoute;
}

export async function deleteUserRouteFromStorage(
  userId: number,
  routeId: string,
): Promise<boolean> {
  const all = await ensureFile();
  const next = all.filter((r) => !(r.id === routeId && r.userId === userId));
  await fs.writeFile(DATA_FILE, JSON.stringify(next, null, 2), "utf-8");
  return true;
}

export async function getRouteByShareToken(
  token: string,
): Promise<StoredUserRoute | null> {
  const all = await ensureFile();
  return all.find((r) => r.shareToken === token) ?? null;
}

export async function setRouteShare(
  userId: number,
  routeId: string,
  shareToken: string,
  stops: SharedRouteStop[],
  reportEmail?: string,
): Promise<StoredUserRoute | null> {
  const all = await ensureFile();
  const route = all.find((r) => r.id === routeId && r.userId === userId);
  if (!route) return null;
  const recipientChanged = route.reportEmail !== reportEmail;
  route.shareToken = shareToken;
  route.stops = stops;
  if (reportEmail) route.reportEmail = reportEmail;
  else delete route.reportEmail;
  if (recipientChanged) delete route.reportSentAt;
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
  return route;
}

export async function markSharedStop(
  token: string,
  stopIndex: number,
  visited: boolean,
): Promise<StoredUserRoute | null> {
  const all = await ensureFile();
  const route = all.find((r) => r.shareToken === token);
  if (!route || !route.stops || !route.stops[stopIndex]) return null;
  if (visited) route.stops[stopIndex].visitedAt = new Date().toISOString();
  else delete route.stops[stopIndex].visitedAt;
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
  return route;
}

export async function updateSharedRoute(
  token: string,
  mutate: (route: StoredUserRoute) => boolean,
): Promise<StoredUserRoute | null> {
  const all = await ensureFile();
  const route = all.find((r) => r.shareToken === token);
  if (!route || !mutate(route)) return null;
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
  return route;
}

const EMAILS_FILE = path.resolve(process.cwd(), "data/route_report_emails.json");

async function readEmails(): Promise<Record<string, string[]>> {
  try {
    return JSON.parse(await fs.readFile(EMAILS_FILE, "utf-8")) as Record<string, string[]>;
  } catch {
    return {};
  }
}

export async function getSavedReportEmails(userId: number): Promise<string[]> {
  return (await readEmails())[String(userId)] ?? [];
}

export async function rememberReportEmail(userId: number, email: string) {
  const all = await readEmails();
  const list = (all[String(userId)] ?? []).filter((e) => e !== email);
  all[String(userId)] = [email, ...list].slice(0, 10);
  await fs.mkdir(path.dirname(EMAILS_FILE), { recursive: true });
  await fs.writeFile(EMAILS_FILE, JSON.stringify(all, null, 2), "utf-8");
}
