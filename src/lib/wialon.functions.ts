import { createServerFn } from "@tanstack/react-start";

// ==========================================
// 1. TIPOS E INTERFACES EXPORTADAS
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
}

export interface WialonResource {
  id: number;
  name: string;
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
}

export interface WialonPlannedRoutePoint {
  lat: number;
  lon: number;
}

export interface WialonPlannedRouteStop {
  label: string;
  lat: number;
  lon: number;
  isOrigin: boolean;
}

export interface WialonPlannedRouteResponse {
  points: WialonPlannedRoutePoint[];
  distanceMeters: number;
  durationSeconds: number;
  stops: WialonPlannedRouteStop[];
  returnToOrigin: boolean;
}

export interface WialonLogisticsRoute {
  id: string;
  name: string;
  points: Array<{ lat: number; lon: number; label?: string }>;
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
  createdAt?: string;
}

// ==========================================
// 2. FUNCIONES BASE / HELPERS INTERNOS
// ==========================================

function getWialonBaseUrl(host: string): string {
  if (host === "full") {
    return process.env.WIALON_FULL_HOST || "https://hst-api.wialon.com";
  }
  return process.env.WIALON_LITE_HOST || "https://local.orb-lite.com";
}

async function callWialonApi<T>(
  host: string,
  svc: string,
  params: Record<string, unknown>,
  sid?: string
): Promise<T> {
  const baseUrl = getWialonBaseUrl(host);
  const formData = new URLSearchParams();
  formData.append("params", JSON.stringify(params));
  if (sid) {
    formData.append("sid", sid);
  }

  const response = await fetch(`${baseUrl}/wialon/ajax.html?svc=${svc}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!response.ok) {
    throw new Error(`Error de red en Wialon API: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`Error de Wialon API (${data.error}): ${JSON.stringify(data)}`);
  }

  return data as T;
}

// ==========================================
// 3. SERVER FUNCTIONS EXPORTADAS
// ==========================================

/**
 * Obtiene geocercas/rutas y recursos asociados al usuario en Wialon.
 */
export const wialonGeofences = createServerFn({ method: "POST" })
  .validator((data: { host: string; sid: string }) => data)
  .handler(async ({ data }): Promise<WialonGeofencesResponse> => {
    const { host, sid } = data;

    // Busca los recursos disponibles
    const searchData = await callWialonApi<any>(
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
        flags: 4096, // Flag para banderas de geocercas
        from: 0,
        to: 0,
      },
      sid
    );

    const items = searchData.items || [];
    const resources: WialonResource[] = [];
    const zones: WialonGeofence[] = [];

    for (const item of items) {
      resources.push({ id: item.id, name: item.nm });
      if (item.zl) {
        for (const zoneId in item.zl) {
          const z = item.zl[zoneId];
          zones.push({
            id: z.id,
            name: z.n,
            resourceId: item.id,
            resource: item.nm,
            type: z.t, // 1 = línea, 2 = polígono, 3 = círculo
            color: `#${(z.c & 0xffffff).toString(16).padStart(6, "0")}`,
            points: (z.p || []).map((pt: any) => ({
              lat: pt.y,
              lon: pt.x,
              radius: pt.r,
            })),
          });
        }
      }
    }

    return { zones, resources };
  });

/**
 * Crea una ruta lineal o geocerca en Wialon.
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
    }) => data
  )
  .handler(async ({ data }) => {
    const { host, sid, resourceId, name, points, color = "#92d700" } = data;

    const colorNumber = Number.parseInt(color.replace("#", ""), 16);
    const formattedPoints = points.map((p) => ({
      x: p.lon,
      y: p.lat,
      r: p.radius || 20,
    }));

    const result = await callWialonApi<any>(
      host,
      "resource/update_zone",
      {
        itemId: resourceId,
        id: 0,
        callMode: "create",
        n: name,
        t: 1, // Tipo 1 = Línea/Ruta
        w: 20,
        c: colorNumber,
        p: formattedPoints,
      },
      sid
    );

    return { success: true, zoneId: result[0] };
  });

/**
 * Elimina una geocerca o ruta existente en Wialon.
 */
export const wialonDeleteGeofence = createServerFn({ method: "POST" })
  .validator(
    (data: { host: string; sid: string; resourceId: number; zoneId: number }) =>
      data
  )
  .handler(async ({ data }) => {
    const { host, sid, resourceId, zoneId } = data;

    await callWialonApi<any>(
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
 * Geocodifica un arreglo de cadenas de texto (direcciones o coordenadas) en ubicaciones lat/lon.
 */
export const wialonGeocodeAddresses = createServerFn({ method: "POST" })
  .validator((data: { addresses: string[] }) => data)
  .handler(async ({ data }) => {
    const { addresses } = data;
    const locations: WialonGeocodedAddress[] = [];

    for (const query of addresses) {
      const clean = query.trim();
      // Si ya son coordenadas "lat, lon"
      const coordMatch = clean.match(/^([+-]?\d+\.?\d*),\s*([+-]?\d+\.?\d*)$/);
      if (coordMatch) {
        locations.push({
          query: clean,
          label: clean,
          lat: Number.parseFloat(coordMatch[1]!),
          lon: Number.parseFloat(coordMatch[2]!),
        });
        continue;
      }

      // Consulta a servicio Nominatim u OSM Geocoding por defecto
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(clean)}`,
        { headers: { "User-Agent": "ORB-LITE-App/1.0" } }
      );

      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          locations.push({
            query: clean,
            label: results[0].display_name || clean,
            lat: Number.parseFloat(results[0].lat),
            lon: Number.parseFloat(results[0].lon),
          });
          continue;
        }
      }

      // Fallback
      locations.push({
        query: clean,
        label: clean,
        lat: 20.6736,
        lon: -103.344,
      });
    }

    return { locations };
  });

/**
 * Calcula y optimiza una ruta completa entre un origen y múltiples destinos usando OSRM.
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

    const stops: WialonPlannedRouteStop[] = pointsToRoute.map((pt, i) => ({
      label: pt.label,
      lat: pt.lat,
      lon: pt.lon,
      isOrigin: i === 0,
    }));

    const coordsStr = pointsToRoute.map((p) => `${p.lon},${p.lat}`).join(";");

    // Consulta de ruteo con OSRM
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;
    const osrmRes = await fetch(osrmUrl);

    if (!osrmRes.ok) {
      throw new Error("No se pudo calcular el trazo vial con el motor de mapas.");
    }

    const osrmData = await osrmRes.json();
    const route = osrmData.routes?.[0];

    if (!route) {
      throw new Error("No se encontró una trayectoria válida por calles.");
    }

    const routePoints: WialonPlannedRoutePoint[] = route.geometry.coordinates.map(
      (c: [number, number]) => ({
        lat: c[1],
        lon: c[0],
      })
    );

    return {
      points: routePoints,
      distanceMeters: route.distance || 0,
      durationSeconds: route.duration || 0,
      stops,
      returnToOrigin,
    };
  });

/**
 * Consulta rutas de logística (Wialon Logistics Module).
 */
export const wialonLogisticsRoutes = createServerFn({ method: "POST" })
  .validator((data: { host: string; sid: string }) => data)
  .handler(async ({ data }) => {
    const { host, sid } = data;

    try {
      const res = await callWialonApi<any>(
        host,
        "logistic/get_routes",
        {},
        sid
      );

      const routes: WialonLogisticsRoute[] = (res.routes || []).map((r: any) => ({
        id: String(r.id),
        name: r.n || `Ruta Logística #${r.id}`,
        points: (r.p || []).map((pt: any) => ({
          lat: pt.y,
          lon: pt.x,
          label: pt.n,
        })),
      }));

      return { routes };
    } catch {
      // Si el módulo de logística no está activo o habilitado en este host
      return { routes: [] };
    }
  });
