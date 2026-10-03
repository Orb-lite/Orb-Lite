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
  area?: number;
  perimeter?: number;
}

export interface WialonResource {
  id: number;
  name: string;
  creatorId?: number;
  accessMask?: number;
  geofenceCount?: number;
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

export interface WialonUnit {
  id: number;
  name: string;
  uniqueId: string;
  phone?: string;
  iconUrl?: string;
  lastPosition?: {
    lat: number;
    lon: number;
    speed: number;
    altitude: number;
    course: number;
    timestamp: number;
    satellites: number;
    address?: string;
  };
  sensors?: Array<{
    id: number;
    name: string;
    type: string;
    value: string | number;
    unit: string;
  }>;
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

const DEFAULT_TIMEOUT_MS = 20000;
const OSRM_PUBLIC_API = "https://router.project-osrm.org/route/v1/driving";
const NOMINATIM_PUBLIC_API = "https://nominatim.openstreetmap.org/search";

const WIALON_ERROR_CODES: Record<number, string> = {
  1: "Sesión inválida o expirada en el servidor de Wialon",
  2: "Nombre de servicio (svc) no válido o no soportado",
  3: "Resultado o respuesta inválida del servidor",
  4: "Entrada o parámetros no válidos",
  5: "Error al ejecutar la operación en la base de datos de Wialon",
  6: "Acceso denegado o permisos insuficientes para realizar la acción",
  7: "Servidor o base de datos temporalmente no disponible",
  8: "Límite de peticiones simultáneas alcanzado",
  9: "Límite de sesiones concurrentes excedido",
  10: "Error al ejecutar el paquete de comandos",
  1001: "Mensaje de red o socket no respondido a tiempo",
  1002: "El elemento ya existe en el servidor",
  1003: "El elemento especificado no existe o fue eliminado",
  1004: "Límite de mensajes o elementos alcanzado",
  1005: "Estructura de objeto o parámetro corrupta",
};

// Cache en memoria para sesiones y geocodificación
const geocodeCache = new Map<string, WialonGeocodedAddress>();

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
 * Peticionador HTTP de baja latencia tolerante a fallos
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
      throw new Error(`Tiempo de espera agotado al conectar con Wialon (${timeoutMs}ms).`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function wialonColorToHex(colorNumber: number): string {
  const rgb = colorNumber & 0xffffff;
  return `#${rgb.toString(16).padStart(6, "0")}`;
}

function hexToWialonColor(hex: string): number {
  const cleanHex = hex.replace("#", "");
  return Number.parseInt(cleanHex, 16);
}

/**
 * Mapeo y cálculo de polígonos/áreas
 */
function calculatePolygonAreaAndPerimeter(points: WialonGeofencePoint[]): { area: number; perimeter: number } {
  if (points.length < 3) return { area: 0, perimeter: 0 };
  
  let area = 0;
  let perimeter = 0;
  const R = 6371000; // Radio terrestre en metros

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i]!;
    const p2 = points[(i + 1) % points.length]!;

    const lat1 = (p1.lat * Math.PI) / 180;
    const lat2 = (p2.lat * Math.PI) / 180;
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLon = ((p2.lon - p1.lon) * Math.PI) / 180;

    // Haversine para perímetro
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    perimeter += R * c;

    // Proyección para área aproximada
    area += ((p2.lon - p1.lon) * Math.PI / 180) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = Math.abs((area * R * R) / 2);
  return { area: Math.round(area), perimeter: Math.round(perimeter) };
}

// ==========================================
// 4. SERVER FUNCTIONS EXPORTADAS
// ==========================================

/**
 * Inicia sesión o valida el token remoto en Wialon
 */
export const wialonLogin = createServerFn({ method: "POST" })
  .validator((data: { host: string; token: string }) => data)
  .handler(async ({ data }) => {
    const { host, token } = data;

    const res = await callWialonApi<any>(host, "token/login", {
      token,
      fl: 1,
    });

    return {
      sid: res.eid || res.sid,
      userName: res.au || "Usuario Wialon",
      userId: res.user?.id || 0,
      host,
    };
  });

/**
 * Cierra la sesión activa en el servidor remoto de Wialon
 */
export const wialonLogout = createServerFn({ method: "POST" })
  .validator((data: { host: string; sid: string }) => data)
  .handler(async ({ data }) => {
    const { host, sid } = data;
    try {
      await callWialonApi(host, "core/logout", {}, sid);
      return { success: true };
    } catch {
      return { success: false };
    }
  });

/**
 * Obtiene las geocercas y recursos asociados al cliente en Wialon
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
        flags: 4096, // Banderas e información detallada de geocercas
        from: 0,
        to: 0,
      },
      sid
    );

    const items = searchData.items || [];
    const resources: WialonResource[] = [];
    const zones: WialonGeofence[] = [];

    for (const item of items) {
      let gCount = 0;
      if (item.zl) {
        for (const zoneId in item.zl) {
          gCount++;
          const z = item.zl[zoneId];
          const rawPts = (z.p || []).map((pt: any) => ({
            lat: pt.y,
            lon: pt.x,
            radius: pt.r || 20,
          }));

          const { area, perimeter } = calculatePolygonAreaAndPerimeter(rawPts);

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
            area: z.t === 2 ? area : undefined,
            perimeter: z.t === 2 ? perimeter : undefined,
            points: rawPts,
          });
        }
      }

      resources.push({
        id: item.id,
        name: item.nm,
        creatorId: item.crt,
        accessMask: item.m,
        geofenceCount: gCount,
      });
    }

    return { zones, resources };
  });

/**
 * Crea una ruta o geocerca en Wialon
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
      type?: number;
    }) => data
  )
  .handler(async ({ data }) => {
    const {
      host,
      sid,
      resourceId,
      name,
      points,
      color = "#92d700",
      description = "",
      type = 1,
    } = data;

    if (!points || points.length < 2) {
      throw new Error("Se requieren al menos 2 puntos para definir la forma geométrica en Wialon.");
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
        t: type,
        w: 20,
        c: colorNumber,
        p: formattedPoints,
      },
      sid
    );

    return {
      success: true,
      zoneId: Array.isArray(result) ? result[0] : (result as any).id,
    };
  });

/**
 * Elimina una geocerca o ruta de Wialon
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
 * Modifica una geocerca existente en Wialon
 */
export const wialonUpdateGeofence = createServerFn({ method: "POST" })
  .validator(
    (data: {
      host: string;
      sid: string;
      resourceId: number;
      zoneId: number;
      name: string;
      points: WialonGeofencePoint[];
      color?: string;
      description?: string;
      type?: number;
    }) => data
  )
  .handler(async ({ data }) => {
    const { host, sid, resourceId, zoneId, name, points, color = "#92d700", description = "", type = 1 } = data;

    const colorNumber = hexToWialonColor(color);
    const formattedPoints = points.map((p) => ({
      x: p.lon,
      y: p.lat,
      r: p.radius || 20,
    }));

    await callWialonApi(
      host,
      "resource/update_zone",
      {
        itemId: resourceId,
        id: zoneId,
        callMode: "update",
        n: name,
        d: description,
        t: type,
        w: 20,
        c: colorNumber,
        p: formattedPoints,
      },
      sid
    );

    return { success: true };
  });

/**
 * Geocodificación inteligente con caché local
 */
export const wialonGeocodeAddresses = createServerFn({ method: "POST" })
  .validator((data: { addresses: string[] }) => data)
  .handler(async ({ data }) => {
    const { addresses } = data;
    const locations: WialonGeocodedAddress[] = [];

    for (const query of addresses) {
      const clean = query.trim();
      if (!clean) continue;

      if (geocodeCache.has(clean)) {
        locations.push(geocodeCache.get(clean)!);
        continue;
      }

      // Check Coordenadas "lat, lon"
      const coordMatch = clean.match(/^([+-]?\d+\.?\d*),\s*([+-]?\d+\.?\d*)$/);
      if (coordMatch) {
        const item: WialonGeocodedAddress = {
          query: clean,
          label: `Coordenadas (${coordMatch[1]}, ${coordMatch[2]})`,
          lat: Number.parseFloat(coordMatch[1]!),
          lon: Number.parseFloat(coordMatch[2]!),
          confidence: 1.0,
          type: "coordinates",
        };
        geocodeCache.set(clean, item);
        locations.push(item);
        continue;
      }

      // Consulta OSM Nominatim
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
            const item: WialonGeocodedAddress = {
              query: clean,
              label: match.display_name || clean,
              lat: Number.parseFloat(match.lat),
              lon: Number.parseFloat(match.lon),
              type: match.type || "address",
            };
            geocodeCache.set(clean, item);
            locations.push(item);
            continue;
          }
        }
      } catch {
        // Fallback
      }

      const fallbackItem: WialonGeocodedAddress = {
        query: clean,
        label: clean,
        lat: 20.6736,
        lon: -103.344,
        confidence: 0,
        type: "unknown",
      };
      locations.push(fallbackItem);
    }

    return { locations };
  });

/**
 * Planificador y optimizador de rutas viales (OSRM)
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
 * Consulta del módulo Wialon Logistics
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
      return { routes: [] };
    }
  });

/**
 * Consulta de listado de unidades GPS en tiempo real
 */
export const wialonGetUnits = createServerFn({ method: "POST" })
  .validator((data: { host: string; sid: string }) => data)
  .handler(async ({ data }) => {
    const { host, sid } = data;

    const res = await callWialonApi<{ items: Array<any> }>(
      host,
      "core/search_items",
      {
        spec: {
          itemsType: "avl_unit",
          propName: "sys_name",
          propValueMask: "*",
          sortType: "sys_name",
        },
        force: 1,
        flags: 41473, // Flags: Nombre, Posición, Sensores, Parámetros
        from: 0,
        to: 0,
      },
      sid
    );

    const units: WialonUnit[] = (res.items || []).map((u: any) => {
      const pos = u.pos;
      return {
        id: u.id,
        name: u.nm,
        uniqueId: u.uid || "",
        phone: u.ph || "",
        iconUrl: u.uri ? `${getWialonBaseUrl(host)}/items/${u.id}/${u.uri}` : undefined,
        lastPosition: pos
          ? {
              lat: pos.y,
              lon: pos.x,
              speed: pos.s || 0,
              altitude: pos.z || 0,
              course: pos.c || 0,
              timestamp: pos.t || 0,
              satellites: pos.sc || 0,
            }
          : undefined,
      };
    });

    return { units };
  });

/**
 * Geocodificación inversa (Convierte Coordenadas lat,lon en Dirección)
 */
export const wialonReverseGeocode = createServerFn({ method: "POST" })
  .validator((data: { lat: number; lon: number }) => data)
  .handler(async ({ data }) => {
    const { lat, lon } = data;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        {
          headers: { "User-Agent": "ORBLite_Route_Engine/2.0" },
        }
      );

      if (response.ok) {
        const json = await response.json();
        return { address: json.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}` };
      }
    } catch {
      // Fallback
    }

    return { address: `${lat.toFixed(5)}, ${lon.toFixed(5)}` };
  });
