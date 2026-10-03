import { createServerFn } from "@tanstack/react-start";

// ==========================================
// 1. TIPOS E INTERFACES TYPESCRIPT COMPLETAS
// ==========================================

export interface WialonGeofencePoint {
  lat: number;
  lon: number;
  radius?: number;
}

export interface WialonGeofence {
  id: number;
  name: string;
  resourceId: number;
  resource: string;
  type: number; // 1 = Línea/Ruta, 2 = Polígono, 3 = Círculo
  color: string;
  points: WialonGeofencePoint[];
  description?: string;
  minScale?: number;
  maxScale?: number;
}

export interface WialonResource {
  id: number;
  name: string;
  creatorId?: number;
  accessMask?: number;
}

export interface WialonGeofencesResponse {
  zones: WialonGeofence[];
  resources: WialonResource[];
}

export interface WialonGeocodedAddress {
  query: string;
  label: string;
  lat: number;
  lon: number;
  confidence?: number;
  type?: string;
}

export interface WialonPlannedRoutePoint {
  lat: number;
  lon: number;
}

export interface WialonPlannedRouteStop {
  id?: string;
  label: string;
  lat: number;
  lon: number;
  isOrigin: boolean;
  order?: number;
  estimatedArrivalSeconds?: number;
}

export interface WialonPlannedRouteResponse {
  points: WialonPlannedRoutePoint[];
  distanceMeters: number;
  durationSeconds: number;
  stops: WialonPlannedRouteStop[];
  returnToOrigin: boolean;
  legs?: Array<{
    distanceMeters: number;
    durationSeconds: number;
    startAddress?: string;
    endAddress?: string;
  }>;
}

export interface WialonLogisticsRoute {
  id: string;
  name: string;
  status?: string;
  driverName?: string;
  unitId?: number;
  points: Array<{ lat: number; lon: number; label?: string }>;
  startTime?: number;
  endTime?: number;
}

export interface StoredUserRoute {
  id: string;
  userId: string;
  userName?: string;
  name: string;
  color?: string;
  points: WialonGeofencePoint[];
  routeStops?: Array<{ lat: number; lon: number; label: string }>;
  origin?: string;
  addresses?: string[];
  distanceMeters?: number;
  durationSeconds?: number;
  reportEmail?: string;
  wialonId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WialonApiResponse<T = unknown> {
  error?: number;
  reason?: string;
  items?: T[];
  item?: T;
  [key: string]: unknown;
}

// ==========================================
// 2. CONSTANTES Y CONFIGURACIÓN DEL ENGINE
// ==========================================

const DEFAULT_TIMEOUT_MS = 15000;
const OSRM_PUBLIC_API = "https://router.project-osrm.org/route/v1/driving";
const NOMINATIM_PUBLIC_API = "https://nominatim.openstreetmap.org/search";

// Mapeo de códigos de error estándar de Wialon API
const WIALON_ERROR_CODES: Record<number, string> = {
  1: "Sesión inválida o expirada",
  2: "Nombre de servicio no válido",
  3: "Resultado o respuesta inválida",
  4: "Entrada o parámetros no válidos",
  5: "Error al ejecutar la operación",
  6: "Acceso denegado o permisos insuficientes",
  7: "Servidor o base de datos no disponible",
  8: "Límite de peticiones alcanzado",
  1001: "Mensaje de red o socket no respondido",
  1002: "El elemento ya existe",
  1003: "El elemento no existe o fue eliminado",
};

// ==========================================
// 3. HELPERS INTERNOS Y CORE DE COMUNICACIÓN
// ==========================================

function getWialonBaseUrl(host: string): string {
  if (host === "full") {
    return process.env.WIALON_FULL_HOST || "https://hst-api.wialon.com";
  }
  return process.env.WIALON_LITE_HOST || "https://local.orb-lite.com";
}

function parseWialonErrorMessage(code: number): string {
  return WIALON_ERROR_CODES[code] || `Error interno de Wialon Remote API (Código ${code})`;
}

/**
 * Peticionador HTTP tolerante a fallos para conectores de Wialon Remote API
 */
async function callWialonApi<T = Record<string, unknown>>(
  host: string,
  svc: string,
  params: Record<string, unknown>,
  sid?: string,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const baseUrl = getWialonBaseUrl(host);
  const formData = new URLSearchParams();
  formData.append("params", JSON.stringify(params));
  if (sid) {
    formData.append("sid", sid);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/wialon/ajax.html?svc=${svc}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: formData.toString(),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as WialonApiResponse<T>;

    if (data && typeof data.error === "number" && data.error !== 0) {
      const errDetail = parseWialonErrorMessage(data.error);
      throw new Error(errDetail);
    }

    return data as T;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`Tiempo de espera agotado al conectar con el servidor Wialon (${timeoutMs}ms).`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Decodificador de geocercas en formato BGR a Hexadecimal CSS (#RRGGBB)
 */
function wialonColorToHex(colorNumber: number): string {
  const rgb = colorNumber & 0xffffff;
  return `#${rgb.toString(16).padStart(6, "0")}`;
}

/**
 * Conversor de Hexadecimal CSS a formato decimal de color Wialon
 */
function hexToWialonColor(hex: string): number {
  const cleanHex = hex.replace("#", "");
  return Number.parseInt(cleanHex, 16);
}

// ==========================================
// 4. SERVER FUNCTIONS IMPLEMENTADAS
// ==========================================

/**
 * Consulta recursos y geocercas/rutas del usuario en Wialon
 */
export const wialonGeofences = createServerFn({ method: "POST" })
  .validator((data: { host: string; sid: string }) => data)
  .handler(async ({ data }): Promise<WialonGeofencesResponse> => {
    const { host, sid } = data;

    const searchData = await callWialonApi<{ items: Array<any> }>(
      host,
      "core/search_items",
      {
        spec: {
          itemsType: "avl_resource",
          propName: "sys_name",
          propValueMask: "*",
          sortType: "sys_name",
        },
        force: 1,
        flags: 4096, // Flag 0x1000: Banderas e información de geocercas
        from: 0,
        to: 0,
      },
      sid
    );

    const items = searchData.items || [];
    const resources: WialonResource[] = [];
    const zones: WialonGeofence[] = [];

    for (const item of items) {
      resources.push({
        id: item.id,
        name: item.nm,
        creatorId: item.crt,
        accessMask: item.m,
      });

      if (item.zl) {
        for (const zoneId in item.zl) {
          const z = item.zl[zoneId];
          zones.push({
            id: z.id,
            name: z.n,
            resourceId: item.id,
            resource: item.nm,
            type: z.t, // 1 = línea, 2 = polígono, 3 = círculo
            color: wialonColorToHex(z.c),
            description: z.d || "",
            minScale: z.min,
            maxScale: z.max,
            points: (z.p || []).map((pt: any) => ({
              lat: pt.y,
              lon: pt.x,
              radius: pt.r || 20,
            })),
          });
        }
      }
    }

    return { zones, resources };
  });

/**
 * Registra o actualiza una geocerca o ruta de tipo línea en el catálogo de Wialon
 */
export const wialonCreateRoute = createServerFn({ method: "POST" })
  .validator(
    (data: {
      host: string;
      sid: string;
      resourceId: number;
      name: string;
      points: WialonGeofencePoint[];
      color?: string;
      description?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    const { host, sid, resourceId, name, points, color = "#92d700", description = "" } = data;

    if (!points || points.length < 2) {
      throw new Error("Se requieren al menos 2 puntos para generar una ruta lineal en Wialon.");
    }

    const colorNumber = hexToWialonColor(color);
    const formattedPoints = points.map((p) => ({
      x: p.lon,
      y: p.lat,
      r: p.radius || 20,
    }));

    const result = await callWialonApi<[number, any]>(
      host,
      "resource/update_zone",
      {
        itemId: resourceId,
        id: 0,
        callMode: "create",
        n: name,
        d: description,
        t: 1, // Tipo 1 = Línea/Ruta
        w: 20,
        c: colorNumber,
        p: formattedPoints,
      },
      sid
    );

    return { success: true, zoneId: Array.isArray(result) ? result[0] : (result as any).id };
  });

/**
 * Elimina una geocerca/ruta existente del recurso en Wialon
 */
export const wialonDeleteGeofence = createServerFn({ method: "POST" })
  .validator(
    (data: { host: string; sid: string; resourceId: number; zoneId: number }) => data
  )
  .handler(async ({ data }) => {
    const { host, sid, resourceId, zoneId } = data;

    await callWialonApi(
      host,
      "resource/update_zone",
      {
        itemId: resourceId,
        id: zoneId,
        callMode: "delete",
      },
      sid
    );

    return { success: true };
  });

/**
 * Motor de Geocodificación y parseo de entradas de direcciones
 */
export const wialonGeocodeAddresses = createServerFn({ method: "POST" })
  .validator((data: { addresses: string[] }) => data)
  .handler(async ({ data }) => {
    const { addresses } = data;
    const locations: WialonGeocodedAddress[] = [];

    for (const query of addresses) {
      const clean = query.trim();
      if (!clean) continue;

      // 1. Detección de Coordenadas Directas "lat, lon"
      const coordMatch = clean.match(/^([+-]?\d+\.?\d*),\s*([+-]?\d+\.?\d*)$/);
      if (coordMatch) {
        locations.push({
          query: clean,
          label: `Coordenadas (${coordMatch[1]}, ${coordMatch[2]})`,
          lat: Number.parseFloat(coordMatch[1]!),
          lon: Number.parseFloat(coordMatch[2]!),
          confidence: 1.0,
          type: "coordinates",
        });
        continue;
      }

      // 2. Búsqueda por servicio geográfico OSM Nominatim
      try {
        const response = await fetch(
          `${NOMINATIM_PUBLIC_API}?format=json&q=${encodeURIComponent(clean)}&limit=1`,
          {
            headers: { "User-Agent": "ORBLite_Route_Engine/2.0" },
          }
        );

        if (response.ok) {
          const results = await response.json();
          if (Array.isArray(results) && results.length > 0) {
            const match = results[0];
            locations.push({
              query: clean,
              label: match.display_name || clean,
              lat: Number.parseFloat(match.lat),
              lon: Number.parseFloat(match.lon),
              type: match.type || "address",
            });
            continue;
          }
        }
      } catch (e) {
        // Fallback
      }

      // 3. Fallback de cortesía si falla la consulta externa
      locations.push({
        query: clean,
        label: clean,
        lat: 20.6736,
        lon: -103.344,
        confidence: 0,
        type: "unknown",
      });
    }

    return { locations };
  });

/**
 * Calculador de rutas viales y optimizador de recorrido (OSRM + Nominatim)
 */
export const wialonPlanRoute = createServerFn({ method: "POST" })
  .validator(
    (data: {
      origin: string;
      addresses: string[];
      returnToOrigin?: boolean;
      locations?: WialonGeocodedAddress[];
    }) => data
  )
  .handler(async ({ data }): Promise<WialonPlannedRouteResponse> => {
    const { origin, addresses, returnToOrigin = false, locations } = data;

    let pointsToRoute: WialonGeocodedAddress[] = locations || [];

    if (pointsToRoute.length === 0) {
      const geocodeRes = await wialonGeocodeAddresses({
        data: { addresses: [origin, ...addresses] },
      });
      pointsToRoute = geocodeRes.locations;
    }

    if (pointsToRoute.length < 2) {
      throw new Error("Se requieren al menos 2 puntos válidos para calcular la ruta.");
    }

    if (returnToOrigin && pointsToRoute.length > 0) {
      const originPt = pointsToRoute[0]!;
      pointsToRoute = [
        ...pointsToRoute,
        {
          query: `${originPt.query} (Regreso)`,
          label: `${originPt.label} (Regreso)`,
          lat: originPt.lat,
          lon: originPt.lon,
        },
      ];
    }

    const stops: WialonPlannedRouteStop[] = pointsToRoute.map((pt, i) => ({
      id: `stop-${i}`,
      label: pt.label,
      lat: pt.lat,
      lon: pt.lon,
      isOrigin: i === 0 || (returnToOrigin && i === pointsToRoute.length - 1),
      order: i + 1,
    }));

    const coordsStr = pointsToRoute.map((p) => `${p.lon},${p.lat}`).join(";");
    const osrmUrl = `${OSRM_PUBLIC_API}/${coordsStr}?overview=full&geometries=geojson&steps=false`;

    const osrmRes = await fetch(osrmUrl);
    if (!osrmRes.ok) {
      throw new Error("No se pudo conectar con el motor de enrutamiento vial.");
    }

    const osrmData = await osrmRes.json();
    const route = osrmData.routes?.[0];

    if (!route) {
      throw new Error("No se pudo encontrar una trayectoria vial navegable.");
    }

    const routePoints: WialonPlannedRoutePoint[] = route.geometry.coordinates.map(
      (c: [number, number]) => ({
        lat: c[1],
        lon: c[0],
      })
    );

    const legs = (route.legs || []).map((leg: any) => ({
      distanceMeters: leg.distance || 0,
      durationSeconds: leg.duration || 0,
      startAddress: leg.summary || "",
      endAddress: "",
    }));

    return {
      points: routePoints,
      distanceMeters: route.distance || 0,
      durationSeconds: route.duration || 0,
      stops,
      returnToOrigin,
      legs,
    };
  });

/**
 * Consulta rutas activas y planificadas en el módulo Wialon Logistics
 */
export const wialonLogisticsRoutes = createServerFn({ method: "POST" })
  .validator((data: { host: string; sid: string }) => data)
  .handler(async ({ data }) => {
    const { host, sid } = data;

    try {
      const res = await callWialonApi<{ routes?: Array<any> }>(
        host,
        "logistic/get_routes",
        {
          flags: 1,
        },
        sid
      );

      const routes: WialonLogisticsRoute[] = (res.routes || []).map((r: any) => ({
        id: String(r.id),
        name: r.n || `Ruta Logística #${r.id}`,
        status: r.st || "pending",
        driverName: r.dn || undefined,
        unitId: r.u || undefined,
        startTime: r.st_tm || undefined,
        endTime: r.end_tm || undefined,
        points: (r.p || []).map((pt: any) => ({
          lat: pt.y,
          lon: pt.x,
          label: pt.n || `Punto ${pt.i || ""}`,
        })),
      }));

      return { routes };
    } catch {
      // Retorna arreglo vacío si el módulo no está disponible en la cuenta
      return { routes: [] };
    }
  });
