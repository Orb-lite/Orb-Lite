import fs from "node:fs/promises";
import path from "node:path";

export type SharedRouteStop = {
  label: string;
  lat: number;
  lon: number;
  visitedAt?: string;
};

export type StoredUserRoute = {
  id: string;
  userId: number;
  userName?: string;
  name: string;
  color: string;
  points: Array<{ lat: number; lon: number; radius: number }>;
  origin?: string;
  addresses?: string[];
  distanceMeters?: number;
  durationSeconds?: number;
  createdAt: string;
  /** Token del enlace público para operadores (sin iniciar sesión). */
  shareToken?: string;
  /** Paradas del enlace público con su check de visita. */
  stops?: SharedRouteStop[];
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
