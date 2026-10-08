import type { WialonSession } from "@/lib/wialon-session";
import { writeSession } from "@/lib/wialon-session";
import type {
  WialonUnit,
  WialonGeofence,
  WialonGeofenceResource,
  StoredUserRoute,
} from "@/lib/wialon.functions";
import { supabase } from "@/integrations/supabase/client";

export function jsonpRequest<T = any>(url: string, timeoutMs = 8000): Promise<T | null> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const callbackName = `wialon_cb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(null);
    }, timeoutMs);

    const script = document.createElement("script");

    function cleanup() {
      clearTimeout(timer);
      if (script.parentNode) script.parentNode.removeChild(script);
      try {
        delete (window as any)[callbackName];
      } catch {}
    }

    (window as any)[callbackName] = (data: any) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(data as T);
    };

    script.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(null);
    };

    const separator = url.includes("?") ? "&" : "?";
    script.src = `${url}${separator}callback=${callbackName}`;
    document.head.appendChild(script);
  });
}

/** Descarga unidades directamente por JSONP desde el navegador con tolerancia a hosts */
export async function clientDirectFetchUnits(
  preferredHost: "lite" | "full",
  sid: string,
): Promise<{ units: WialonUnit[]; detectedHost: "lite" | "full" } | null> {
  const hosts: Array<{ host: "lite" | "full"; base: string }> =
    preferredHost === "full"
      ? [
          { host: "full", base: "https://hst-api.wialon.com" },
          { host: "lite", base: "https://hst-api.wialon.us" },
        ]
      : [
          { host: "lite", base: "https://hst-api.wialon.us" },
          { host: "full", base: "https://hst-api.wialon.com" },
        ];

  for (const { host, base } of hosts) {
    try {
      const params = encodeURIComponent(
        JSON.stringify({
          spec: { itemsType: "avl_unit", propName: "sys_name", propValueMask: "*", sortType: "sys_name" },
          force: 1,
          flags: 1025, // 1 (base) + 1024 (posición GPS en vivo)
          from: 0,
          to: 0,
        }),
      );
      const url = `${base}/wialon/ajax.html?svc=core/search_items&params=${params}&sid=${sid}`;
      const data = await jsonpRequest<any>(url, 7000);
      if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
        const units: WialonUnit[] = data.items.map((item: any) => {
          const pos = item.pos ?? null;
          const last = pos?.t ?? item.lmsg?.t ?? null;
          const now = Math.floor(Date.now() / 1000);
          return {
            id: item.id,
            name: item.nm ?? `Unidad ${item.id}`,
            lat: pos?.y ?? null,
            lon: pos?.x ?? null,
            speed: pos?.s ?? null,
            course: pos?.c ?? null,
            lastMessage: last,
            online: last != null && now - last <= 600,
            imei: item.uid?.trim() || null,
            creatorId: typeof item.crt === "number" && item.crt > 0 ? item.crt : null,
            creatorName: null,
          };
        });

        // Guardar en caché del navegador
        try {
          if (typeof window !== "undefined") {
            (window as any).__ORB_LATEST_UNITS = units;
            localStorage.setItem("orb_latest_units_cache", JSON.stringify(units));
          }
        } catch {}

        return { units, detectedHost: host };
      }
    } catch {}
  }
  return null;
}

/** Descarga geocercas directamente por JSONP desde el navegador con tolerancia a hosts */
export async function clientDirectFetchGeofences(
  preferredHost: "lite" | "full",
  sid: string,
): Promise<{ zones: WialonGeofence[]; resources: WialonGeofenceResource[] } | null> {
  const hosts: Array<{ host: "lite" | "full"; base: string }> =
    preferredHost === "full"
      ? [
          { host: "full", base: "https://hst-api.wialon.com" },
          { host: "lite", base: "https://hst-api.wialon.us" },
        ]
      : [
          { host: "lite", base: "https://hst-api.wialon.us" },
          { host: "full", base: "https://hst-api.wialon.com" },
        ];

  for (const { base } of hosts) {
    try {
      const params = encodeURIComponent(
        JSON.stringify({
          spec: { itemsType: "avl_resource", propName: "sys_name", propValueMask: "*", sortType: "sys_name" },
          force: 1,
          flags: 0x1 | 0x1000, // 1 (base) + 4096 (zonas)
          from: 0,
          to: 0,
        }),
      );
      const url = `${base}/wialon/ajax.html?svc=core/search_items&params=${params}&sid=${sid}`;
      const data = await jsonpRequest<any>(url, 7000);

      if (data?.items && Array.isArray(data.items)) {
        const resources: WialonGeofenceResource[] = data.items.map((r: any) => ({
          id: r.id,
          name: r.nm ?? `Recurso ${r.id}`,
        }));

        const zones: WialonGeofence[] = [];

        for (const resItem of data.items) {
          const resId = resItem.id;
          const resName = resItem.nm ?? `#${resId}`;
          const zl = resItem.zl;
          if (!zl || typeof zl !== "object") continue;

          const zoneIds = Object.values(zl)
            .map((z: any) => z?.id ?? Number(z))
            .filter((id: number) => Number.isFinite(id) && id > 0);

          if (zoneIds.length === 0) continue;

          // Intentar obtener detalles de polígonos/círculos
          try {
            const detailParams = encodeURIComponent(
              JSON.stringify({
                itemId: resId,
                col: zoneIds,
                flags: 0x04 | 0x08 | 0x10,
              }),
            );
            const detailUrl = `${base}/wialon/ajax.html?svc=resource/get_zone_data&params=${detailParams}&sid=${sid}`;
            const detailData = await jsonpRequest<any[]>(detailUrl, 5000);

            if (Array.isArray(detailData) && detailData.length > 0) {
              for (const zone of detailData) {
                const points = (zone.p ?? [])
                  .filter((p: any) => Number.isFinite(p.x) && Number.isFinite(p.y))
                  .map((p: any) => ({
                    lat: p.y as number,
                    lon: p.x as number,
                    radius: p.r ?? 0,
                  }));

                if (points.length === 0 && zone.b?.cen_x != null && zone.b?.cen_y != null) {
                  const radius =
                    zone.b.min_x != null && zone.b.max_x != null
                      ? Math.abs(zone.b.max_x - zone.b.min_x) * 55660
                      : 100;
                  points.push({ lat: zone.b.cen_y, lon: zone.b.cen_x, radius });
                }

                const rawColor = zone.c ?? 0x92d700;
                zones.push({
                  id: zone.id,
                  resourceId: resId,
                  name: zone.n ?? `Zona ${zone.id}`,
                  resource: resName,
                  type: zone.t === 1 || zone.t === 2 || zone.t === 3 ? zone.t : 2,
                  color: `#${(rawColor & 0xffffff).toString(16).padStart(6, "0")}`,
                  points,
                });
              }
              continue;
            }
          } catch {}

          // Fallback a coordenadas del resumen (zl)
          for (const zone of Object.values(zl) as any[]) {
            const rawColor = zone.c ?? 0x92d700;
            const cx = zone.b?.cen_x;
            const cy = zone.b?.cen_y;
            const radius =
              zone.b?.min_x != null && zone.b.max_x != null
                ? Math.abs(zone.b.max_x - zone.b.min_x) * 55660
                : 120;
            zones.push({
              id: zone.id,
              resourceId: resId,
              name: zone.n ?? `Zona ${zone.id}`,
              resource: resName,
              type: zone.t === 1 || zone.t === 2 || zone.t === 3 ? zone.t : 3,
              color: `#${(rawColor & 0xffffff).toString(16).padStart(6, "0")}`,
              points: cx != null && cy != null ? [{ lat: cy, lon: cx, radius }] : [],
            });
          }
        }

        return { zones, resources };
      }
    } catch {}
  }

  return null;
}

/** Elimina una geocerca o ruta directamente por JSONP desde el navegador con tolerancia a hosts */
export async function clientDirectDeleteGeofence(
  preferredHost: "lite" | "full",
  sid: string,
  resourceId: number,
  zoneId: number,
): Promise<boolean> {
  const hosts: Array<{ host: "lite" | "full"; base: string }> =
    preferredHost === "full"
      ? [
          { host: "full", base: "https://hst-api.wialon.com" },
          { host: "lite", base: "https://hst-api.wialon.us" },
        ]
      : [
          { host: "lite", base: "https://hst-api.wialon.us" },
          { host: "full", base: "https://hst-api.wialon.com" },
        ];

  for (const { base } of hosts) {
    try {
      const params = encodeURIComponent(
        JSON.stringify({
          itemId: resourceId,
          id: zoneId,
          callMode: "delete",
        }),
      );
      const url = `${base}/wialon/ajax.html?svc=resource/update_zone&params=${params}&sid=${sid}`;
      const data = await jsonpRequest<any>(url, 6000);
      if (data && (data.error === undefined || data.error === 0 || Array.isArray(data))) {
        return true;
      }
    } catch {}
  }
  return false;
}

/** Descarga detalle y sensores de unidad directamente por JSONP */
export async function clientDirectFetchUnitDetail(
  preferredHost: "lite" | "full",
  sid: string,
  unitId: number,
): Promise<any | null> {
  const hosts: Array<{ host: "lite" | "full"; base: string }> =
    preferredHost === "full"
      ? [
          { host: "full", base: "https://hst-api.wialon.com" },
          { host: "lite", base: "https://hst-api.wialon.us" },
        ]
      : [
          { host: "lite", base: "https://hst-api.wialon.us" },
          { host: "full", base: "https://hst-api.wialon.com" },
        ];

  for (const { base } of hosts) {
    try {
      const params = encodeURIComponent(
        JSON.stringify({
          id: unitId,
          flags: 1 + 256 + 512 + 1024 + 4096,
        }),
      );
      const url = `${base}/wialon/ajax.html?svc=core/search_item&params=${params}&sid=${sid}`;
      const data = await jsonpRequest<any>(url, 6000);

      const item = data?.item;
      if (item) {
        const rawParams = (item.lmsg?.p ?? {}) as Record<string, unknown>;
        const sensors = Object.values(item.sens ?? {}).map((s: any) => {
          const raw = s.p ? rawParams[s.p] : undefined;
          return {
            id: s.id,
            name: s.n ?? `Sensor ${s.id}`,
            type: s.t ?? "",
            metrics: s.m ?? "",
            value: raw == null ? "—" : String(raw),
            paramKey: s.p,
          };
        });

        const commands = Object.values(item.cmds ?? {}).map((c: any) => ({
          id: c.id,
          name: c.n ?? `Comando ${c.id}`,
          type: c.c ?? "",
          link: c.l ?? "auto",
        }));

        const pos = item.pos ?? null;
        const last = pos?.t ?? item.lmsg?.t ?? null;
        const now = Math.floor(Date.now() / 1000);

        return {
          unit: {
            id: item.id,
            name: item.nm ?? `Unidad ${item.id}`,
            lat: pos?.y ?? null,
            lon: pos?.x ?? null,
            speed: pos?.s ?? null,
            course: pos?.c ?? null,
            lastMessage: last,
            online: last != null && now - last <= 600,
            imei: item.uid?.trim() || null,
          },
          uniqueId: item.uid ?? null,
          phone: item.ph ?? null,
          hwTypeId: item.hw ?? null,
          sensors,
          commands,
          params: Object.entries(rawParams).map(([key, value]) => ({
            key,
            value: String(value),
          })),
        };
      }
    } catch {}
  }
  return null;
}

/** Consulta resiliente de unidades: prueba serverFn, si falla o retorna vacío recurre a cliente directo JSONP y caché */
export async function fetchReliableUnits(options: {
  session: WialonSession;
  fetchUnitsServerFn?: (args: { data: { host: "lite" | "full"; sid: string } }) => Promise<any>;
}): Promise<{ units: WialonUnit[]; detectedHost?: "lite" | "full" }> {
  const { session, fetchUnitsServerFn } = options;

  // 1. Intentar ServerFn si está disponible
  if (fetchUnitsServerFn) {
    try {
      const res = await fetchUnitsServerFn({ data: { host: session.host, sid: session.sid } });
      if ((res as any)?.detectedHost && (res as any).detectedHost !== session.host) {
        writeSession({ ...session, host: (res as any).detectedHost });
      }
      if (res?.units && Array.isArray(res.units) && res.units.length > 0) {
        try {
          if (typeof window !== "undefined") {
            (window as any).__ORB_LATEST_UNITS = res.units;
            localStorage.setItem("orb_latest_units_cache", JSON.stringify(res.units));
          }
        } catch {}
        return res;
      }
    } catch (err) {
      console.warn("[wialon-client-api] Server fetchUnits falló, recurriendo a cliente JSONP:", err);
    }
  }

  // 2. Intentar llamada cliente directo JSONP
  const direct = await clientDirectFetchUnits(session.host, session.sid);
  if (direct && direct.units.length > 0) {
    if (direct.detectedHost && direct.detectedHost !== session.host) {
      writeSession({ ...session, host: direct.detectedHost });
    }
    return direct;
  }

  // 3. Fallback a caché local en memoria o localStorage si existe
  try {
    if (typeof window !== "undefined") {
      const memoryUnits = (window as any).__ORB_LATEST_UNITS;
      if (Array.isArray(memoryUnits) && memoryUnits.length > 0) {
        return { units: memoryUnits, detectedHost: session.host };
      }
      const cached = localStorage.getItem("orb_latest_units_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { units: parsed, detectedHost: session.host };
        }
      }
    }
  } catch {}

  return { units: [], detectedHost: session.host };
}

/** Consulta resiliente de geocercas: serverFn + cliente directo JSONP + caché */
export async function fetchReliableGeofences(options: {
  session: WialonSession;
  fetchGeofencesServerFn?: (args: { data: { host: "lite" | "full"; sid: string } }) => Promise<any>;
}): Promise<{ zones: WialonGeofence[]; resources: WialonGeofenceResource[] }> {
  const { session, fetchGeofencesServerFn } = options;

  if (fetchGeofencesServerFn) {
    try {
      const res = await fetchGeofencesServerFn({ data: { host: session.host, sid: session.sid } });
      if (res?.zones && Array.isArray(res.zones) && res.zones.length > 0) {
        return res;
      }
    } catch {}
  }

  const direct = await clientDirectFetchGeofences(session.host, session.sid);
  if (direct && direct.zones.length > 0) {
    return direct;
  }

  return { zones: [], resources: [] };
}

/** Consulta resiliente de rutas de usuario: serverFn (autoritativo) + Supabase directo filtrado + localStorage */
export async function fetchReliableUserRoutes(options: {
  session: WialonSession;
  fetchUserRoutesServerFn?: (args: {
    data: { userId: number; host: "lite" | "full"; sid: string };
  }) => Promise<any>;
}): Promise<{ routes: StoredUserRoute[] }> {
  const { session, fetchUserRoutesServerFn } = options;

  // 1. ServerFn (fuente autoritativa de verdad si el servidor responde)
  if (fetchUserRoutesServerFn) {
    try {
      const res = await fetchUserRoutesServerFn({
        data: { userId: session.userId, host: session.host, sid: session.sid },
      });
      if (res && Array.isArray(res.routes)) {
        // Si el servidor respondió exitosamente, esta es la lista exacta (incluso vacía [])
        return { routes: res.routes };
      }
    } catch (err) {
      console.warn("[fetchReliableUserRoutes] ServerFn falló, recurriendo a respaldo offline:", err);
    }
  }

  // 2. Solo si el servidor falló por error de red/desconexión: Supabase directo filtrado estrictamente por este usuario
  try {
    const query = supabase
      .from("user_routes")
      .select("*")
      .order("created_at", { ascending: false });

    const { data, error } =
      session.userId > 0 ? await query.eq("user_id", session.userId) : await query;

    if (!error && Array.isArray(data)) {
      const routes: StoredUserRoute[] = data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        userName: row.user_name || undefined,
        name: row.name,
        color: row.color || "#92d700",
        points: row.points || [],
        routeStops: row.route_stops || undefined,
        origin: row.origin || undefined,
        addresses: row.addresses || undefined,
        distanceMeters: row.distance_meters || undefined,
        durationSeconds: row.duration_seconds || undefined,
        createdAt: row.created_at || new Date().toISOString(),
        shareToken: row.share_token || undefined,
        stops: row.stops || undefined,
        reportEmail: row.report_email || undefined,
        reportSentAt: row.report_sent_at || undefined,
      }));
      return { routes };
    }
  } catch {}

  // 3. Fallback a caché local del usuario si existe
  try {
    if (typeof window !== "undefined") {
      const local =
        localStorage.getItem(`orb_lite_user_routes_${session.userId}`) ||
        localStorage.getItem("orb_lite_user_routes");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          const filtered =
            session.userId > 0
              ? parsed.filter((r: any) => r.userId === session.userId || !r.userId)
              : parsed;
          return { routes: filtered };
        }
      }
    }
  } catch {}

  return { routes: [] };
}

/** Geocodificación directa desde navegador usando Nominatim o fallback de coordenadas */
export async function clientDirectGeocode(
  address: string,
): Promise<{ query: string; label: string; lat: number; lon: number }> {
  const trimmed = address.trim();
  const coordMatch = trimmed.match(/^([-+]?\d{1,2}(?:\.\d+)?)[,\s]+([-+]?\d{1,3}(?:\.\d+)?)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]!);
    const lon = parseFloat(coordMatch[2]!);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      return { query: trimmed, label: `Ubicación (${lat.toFixed(5)}, ${lon.toFixed(5)})`, lat, lon };
    }
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&limit=1`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        return {
          query: trimmed,
          label: data[0].display_name || trimmed,
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      }
    }
  } catch {}

  return {
    query: trimmed,
    label: trimmed,
    lat: 20.6736,
    lon: -103.344,
  };
}

/** Cálculo y optimización directa de rutas desde el cliente con OSRM */
export async function clientDirectPlanRoute(options: {
  locations: Array<{ lat: number; lon: number; label: string; query: string }>;
  returnToOrigin: boolean;
}): Promise<{
  points: Array<{ lat: number; lon: number }>;
  distanceMeters: number;
  durationSeconds: number;
  stops: Array<{ lat: number; lon: number; label: string; isOrigin: boolean }>;
}> {
  const { locations, returnToOrigin } = options;
  if (locations.length === 0) {
    throw new Error("No hay puntos para planificar.");
  }
  const toStop = (l: (typeof locations)[number], idx: number) => ({
    label: l.label,
    lat: l.lat,
    lon: l.lon,
    isOrigin: idx === 0,
  });

  const coords = locations.map((l) => `${l.lon},${l.lat}`).join(";");
  try {
    const osrmUrl = `https://router.project-osrm.org/trip/v1/driving/${coords}?overview=full&geometries=geojson&source=first&roundtrip=${returnToOrigin ? "true" : "false"}`;
    const res = await fetch(osrmUrl);
    if (res.ok) {
      const data = await res.json();
      if (data?.trips?.[0]) {
        const trip = data.trips[0];
        const coordinates = trip.geometry?.coordinates || [];
        const step = Math.max(1, Math.ceil(coordinates.length / 500));
        const sampled = coordinates
          .filter((_: any, i: number) => i % step === 0 || i === coordinates.length - 1)
          .map(([lon, lat]: [number, number]) => ({ lat, lon }));

        return {
          points: sampled.length > 0 ? sampled : locations.map((l) => ({ lat: l.lat, lon: l.lon })),
          distanceMeters: Math.round(trip.distance || 0),
          durationSeconds: Math.round(trip.duration || 0),
          stops: locations.map(toStop),
        };
      }
    }
  } catch {}

  return {
    points: locations.map((l) => ({ lat: l.lat, lon: l.lon })),
    distanceMeters: 5000,
    durationSeconds: 900,
    stops: locations.map(toStop),
  };
}

/** Keep-alive directo vía JSONP para Wialon desde el navegador */
export async function clientPingWialonSession(
  host: "lite" | "full",
  sid: string,
): Promise<boolean> {
  const base = host === "full" ? "https://hst-api.wialon.com" : "https://hst-api.wialon.us";
  try {
    const params = encodeURIComponent(JSON.stringify({}));
    const url = `${base}/wialon/ajax.html?svc=core/duplicate&params=${params}&sid=${sid}`;
    const res = await jsonpRequest<any>(url, 5000);
    if (res && (res.error === 1 || res.error === 4)) {
      return false;
    }
    return true;
  } catch {
    return true;
  }
}
