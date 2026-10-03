import { createServerFn } from "@tanstack/react-start";

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

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
  type: number;
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
  driverCount?: number;
  notificationCount?: number;
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
  city?: string;
  state?: string;
  country?: string;
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
  estimatedDistanceMeters?: number;
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

export interface WialonSensor {
  id: number;
  name: string;
  type: string;
  metrics: string;
  value?: string | number;
  unit?: string;
}

export interface WialonUnit {
  id: number;
  name: string;
  uniqueId: string;
  phone?: string;
  model?: string;
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
  sensors?: WialonSensor[];
  customFields?: Record<string, string>;
  mileage?: number;
  engineHours?: number;
}

export interface WialonMessageRaw {
  t: number;
  f: number;
  pos?: {
    y: number;
    x: number;
    z: number;
    s: number;
    c: number;
    sc: number;
  };
  p?: Record<string, unknown>;
}

export interface WialonApiResponse<T = unknown> {
  error?: number;
  reason?: string;
  items?: T[];
  item?: T;
  [key: string]: unknown;
}

// ============================================================================
// CONSTANTES Y CLIENTE HTTP
// ============================================================================

const DEFAULT_TIMEOUT_MS = 25000;
const OSRM_PUBLIC_API = "https://router.project-osrm.org/route/v1/driving";
const NOMINATIM_PUBLIC_API = "https://nominatim.openstreetmap.org/search";

export const WIALON_ITEM_FLAGS = {
  BASE: 1,
  CUSTOM_PROPERTIES: 2,
  BILLING: 4,
  GUID: 8,
  POS: 1024,
  MESSAGES: 2048,
  GEOFENCES: 4096,
  DRIVERS: 8192,
  SENSORS: 4096,
  COUNTERS: 8192,
  COMMANDS: 524288,
  NOTIFICATIONS: 1048576,
};

const WIALON_ERROR_CODES: Record<number, string> = {
  1: "Sesión inválida o expirada en Wialon",
  2: "Servicio no válido",
  3: "Resultado inválido",
  4: "Parámetros no válidos",
  5: "Error en base de datos de Wialon",
  6: "Acceso denegado",
  7: "Servidor no disponible",
  8: "Límite de peticiones alcanzado",
  9: "Límite de sesiones excedido",
  10: "Error en paquete de comandos",
  1001: "Timeout de red",
  1002: "El elemento ya existe",
  1003: "El elemento no existe",
};

const geocodeCache = new Map<string, WialonGeocodedAddress>();
const sessionCache = new Map<string, { sid: string; expiresAt: number }>();

function getWialonBaseUrl(host: string): string {
  if (host === "full") {
    return process.env.WIALON_FULL_HOST || "https://hst-api.wialon.com";
  }
  return process.env.WIALON_LITE_HOST || "https://local.orb-lite.com";
}

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
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = (await response.json()) as WialonApiResponse<T>;

    if (data && typeof data.error === "number" && data.error !== 0) {
      throw new Error(WIALON_ERROR_CODES[data.error] || `Error Wialon ${data.error}`);
    }

    return data as T;
  } finally {
    clearTimeout(timer);
  }
}

function wialonColorToHex(colorNumber: number): string {
  const rgb = colorNumber & 0xffffff;
  return `#${rgb.toString(16).padStart(6, "0")}`;
}

function hexToWialonColor(hex: string): number {
  return Number.parseInt(hex.replace("#", ""), 16);
}

// ============================================================================
// FUNCIONES DE SERVIDOR
// ============================================================================

export const wialonLogin = createServerFn({ method: "POST" })
  .validator((data: { host: string; token: string }) => data)
  .handler(async ({ data }) => {
    const { host, token } = data;
    const cacheKey = `${host}:${token}`;
    const cached = sessionCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return { sid: cached.sid, userName: "Usuario Autenticado", host };
    }

    const res = await callWialonApi<any>(host, "token/login", { token, fl: 1 });
    const sid = res.eid || res.sid;
    sessionCache.set(cacheKey, { sid, expiresAt: Date.now() + 7200000 });

    return {
      sid,
      userName: res.au || "Usuario Wialon",
      userId: res.user?.id || 0,
      host,
    };
  });

export const wialonLoginWithCredentials = createServerFn({ method: "POST" })
  .validator((data: { host: string; user: string; pass: string }) => data)
  .handler(async ({ data }) => {
    const { host, user, pass } = data;
    const res = await callWialonApi<any>(host, "core/login", { user, password: pass });
    const sid = res.eid || res.sid;
    return {
      sid,
      userName: res.au || user,
      userId: res.user?.id || 0,
      host,
    };
  });

export const wialonLogout = createServerFn({ method: "POST" })
  .validator((data: { host: string; sid: string }) => data)
  .handler(async ({ data }) => {
    try {
      await callWialonApi(data.host, "core/logout", {}, data.sid);
      return { success: true };
    } catch {
      return { success: false };
    }
  });

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
        flags:
          WIALON_ITEM_FLAGS.BASE |
          WIALON_ITEM_FLAGS.POS |
          WIALON_ITEM_FLAGS.SENSORS |
          WIALON_ITEM_FLAGS.COUNTERS,
        from: 0,
        to: 0,
      },
      sid
    );

    const units: WialonUnit[] = (res.items || []).map((u: any) => ({
      id: u.id,
      name: u.nm,
      uniqueId: u.uid || "",
      phone: u.ph || "",
      model: u.hw || "",
      iconUrl: u.uri ? `${getWialonBaseUrl(host)}/items/${u.id}/${u.uri}` : undefined,
      mileage: u.cnm ? Math.round(u.cnm / 1000) : undefined,
      engineHours: u.cnh ? Math.round(u.cnh / 3600) : undefined,
      lastPosition: u.pos
        ? {
            lat: u.pos.y,
            lon: u.pos.x,
            speed: u.pos.s || 0,
            altitude: u.pos.z || 0,
            course: u.pos.c || 0,
            timestamp: u.pos.t || 0,
            satellites: u.pos.sc || 0,
          }
        : undefined,
    }));

    return { units };
  });

export const wialonUnits = wialonGetUnits;

export const wialonGetUnitMessages = createServerFn({ method: "POST" })
  .validator(
    (data: {
      host: string;
      sid: string;
      unitId: number;
      fromUnix: number;
      toUnix: number;
      flags?: number;
    }) => data
  )
  .handler(async ({ data }) => {
    const { host, sid, unitId, fromUnix, toUnix, flags = 0 } = data;

    await callWialonApi(
      host,
      "messages/load_interval",
      {
        itemId: unitId,
        timeFrom: fromUnix,
        timeTo: toUnix,
        flags: flags,
        flagsMask: 0,
        loadCount: 10000,
      },
      sid
    );

    const res = await callWialonApi<{ messages: WialonMessageRaw[] }>(
      host,
      "messages/get_messages",
      { indexFrom: 0, indexTo: 9999 },
      sid
    );

    return { messages: res.messages || [] };
  });

export const wialonHistory = wialonGetUnitMessages;

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
        flags: WIALON_ITEM_FLAGS.BASE | WIALON_ITEM_FLAGS.GEOFENCES | WIALON_ITEM_FLAGS.DRIVERS,
        from: 0,
        to: 0,
      },
      sid
    );

    const items = searchData.items || [];
    const resources: WialonResource[] = [];
    const zones: WialonGeofence[] = [];

    for (const item of items) {
      if (item.zl) {
        for (const zoneId in item.zl) {
          const z = item.zl[zoneId];
          zones.push({
            id: z.id,
            name: z.n,
            resourceId: item.id,
            resource: item.nm,
            type: z.t,
            color: wialonColorToHex(z.c),
            description: z.d || "",
            points: (z.p || []).map((pt: any) => ({
              lat: pt.y,
              lon: pt.x,
              radius: pt.r || 20,
            })),
          });
        }
      }

      resources.push({
        id: item.id,
        name: item.nm,
        creatorId: item.crt,
        accessMask: item.m,
        geofenceCount: item.zl ? Object.keys(item.zl).length : 0,
        driverCount: item.drivers ? Object.keys(item.drivers).length : 0,
      });
    }

    return { zones, resources };
  });

export const wialonCreateGeofence = createServerFn({ method: "POST" })
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
    const { host, sid, resourceId, name, points, color = "#92d700", description = "", type = 1 } = data;
    const formattedPoints = points.map((p) => ({ x: p.lon, y: p.lat, r: p.radius || 20 }));

    const result = await callWialonApi<any>(
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
        c: hexToWialonColor(color),
        p: formattedPoints,
      },
      sid
    );

    return { success: true, zoneId: Array.isArray(result) ? result[0] : result?.id };
  });

export const wialonDeleteGeofence = createServerFn({ method: "POST" })
  .validator((data: { host: string; sid: string; resourceId: number; zoneId: number }) => data)
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

export const wialonCreateRoute = wialonCreateGeofence;

export const wialonVideoUnits = createServerFn({ method: "POST" })
  .validator((data: { host: string; sid: string }) => data)
  .handler(async ({ data }) => {
    const { units } = await wialonGetUnits({ data });
    return { units };
  });

export const wialonVideoSettings = createServerFn({ method: "POST" })
  .validator((data: { host: string; sid: string }) => data)
  .handler(async () => {
    return { settings: { streamQuality: "hd", autoPlay: true } };
  });

export const wialonGeocodeAddresses = createServerFn({ method: "POST" })
  .validator((data: { addresses: string[] }) => data)
  .handler(async ({ data }) => {
    const locations: WialonGeocodedAddress[] = [];

    for (const query of data.addresses) {
      const clean = query.trim();
      if (!clean) continue;

      if (geocodeCache.has(clean)) {
        locations.push(geocodeCache.get(clean)!);
        continue;
      }

      const coordMatch = clean.match(/^([+-]?\d+\.?\d*),\s*([+-]?\d+\.?\d*)$/);
      if (coordMatch) {
        const item = {
          query: clean,
          label: `Coordenadas (${coordMatch[1]}, ${coordMatch[2]})`,
          lat: Number.parseFloat(coordMatch[1]!),
          lon: Number.parseFloat(coordMatch[2]!),
        };
        geocodeCache.set(clean, item);
        locations.push(item);
        continue;
      }

      try {
        const res = await fetch(`${NOMINATIM_PUBLIC_API}?format=json&q=${encodeURIComponent(clean)}&limit=1`, {
          headers: { "User-Agent": "ORBLite_Route_Engine/2.0" },
        });
        if (res.ok) {
          const results = await res.json();
          if (results.length > 0) {
            const item = {
              query: clean,
              label: results[0].display_name,
              lat: Number.parseFloat(results[0].lat),
              lon: Number.parseFloat(results[0].lon),
            };
            geocodeCache.set(clean, item);
            locations.push(item);
            continue;
          }
        }
      } catch {
        // Fallback
      }

      locations.push({ query: clean, label: clean, lat: 20.6736, lon: -103.344 });
    }

    return { locations };
  });

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
      const geocodeRes = await wialonGeocodeAddresses({ data: { addresses: [origin, ...addresses] } });
      pointsToRoute = geocodeRes.locations;
    }

    const stops: WialonPlannedRouteStop[] = pointsToRoute.map((pt, i) => ({
      id: `stop-${i}`,
      label: pt.label,
      lat: pt.lat,
      lon: pt.lon,
      isOrigin: i === 0,
      order: i + 1,
    }));

    const coordsStr = pointsToRoute.map((p) => `${p.lon},${p.lat}`).join(";");
    const osrmRes = await fetch(`${OSRM_PUBLIC_API}/${coordsStr}?overview=full&geometries=geojson`);
    const osrmData = await osrmRes.json();
    const route = osrmData.routes?.[0];

    return {
      points: (route?.geometry?.coordinates || []).map((c: [number, number]) => ({ lat: c[1], lon: c[0] })),
      distanceMeters: route?.distance || 0,
      durationSeconds: route?.duration || 0,
      stops,
      returnToOrigin,
    };
  });
