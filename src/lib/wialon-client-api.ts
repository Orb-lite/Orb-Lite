import type { WialonHost } from "./wialon.server";
import type { WialonMessage, WialonUnit, StoredUserRoute } from "./wialon.functions";
import type { WialonSession } from "./wialon-session";

export const WIALON_BASES: Record<WialonHost, string> = {
  lite: "https://hst-api.wialon.us",
  full: "https://hst-api.wialon.com",
};

/**
 * Ejecuta una petición JSONP directamente desde el navegador hacia Wialon.
 * Bypasea 100% cualquier política CORS o bloqueo de servidor intermedio.
 */
export function jsonpRequest<T = any>(url: string, timeoutMs = 8000): Promise<T | null> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const callbackName = `w_api_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
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
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
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

function getHostList(preferred: WialonHost): Array<{ host: WialonHost; base: string }> {
  return preferred === "full"
    ? [
        { host: "full", base: WIALON_BASES.full },
        { host: "lite", base: WIALON_BASES.lite },
      ]
    : [
        { host: "lite", base: WIALON_BASES.lite },
        { host: "full", base: WIALON_BASES.full },
      ];
}

/**
 * Consulta directa de unidades por JSONP
 */
export async function clientFetchUnits(
  host: WialonHost,
  sid: string,
): Promise<{ units: WialonUnit[]; detectedHost: WialonHost }> {
  const hosts = getHostList(host);

  for (const { host: h, base } of hosts) {
    try {
      const params = encodeURIComponent(
        JSON.stringify({
          spec: { itemsType: "avl_unit", propName: "sys_name", propValueMask: "*", sortType: "sys_name" },
          force: 1,
          flags: 1025, // 1 (base) + 1024 (pos GPS en vivo)
          from: 0,
          to: 0,
        }),
      );
      const url = `${base}/wialon/ajax.html?svc=core/search_items&params=${params}&sid=${sid}`;
      const data = await jsonpRequest<any>(url, 7000);

      if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
        const now = Math.floor(Date.now() / 1000);
        const units: WialonUnit[] = data.items.map((item: any) => {
          const pos = item.pos ?? null;
          const last = pos?.t ?? item.lmsg?.t ?? null;
          return {
            id: item.id,
            name: item.nm ?? `Unidad ${item.id}`,
            lat: pos?.y ?? null,
            lon: pos?.x ?? null,
            speed: pos?.s ?? null,
            course: pos?.c ?? null,
            lastMessage: last,
            online: last != null && now - last <= 600,
            imei: item.uid ? String(item.uid).trim() : null,
            creatorId: item.crt ?? null,
            creatorName: null,
          };
        });
        return { units, detectedHost: h };
      }
    } catch (err) {
      console.warn(`[clientFetchUnits] Falló en ${h}:`, err);
    }
  }

  return { units: [], detectedHost: host };
}

export type ClientZone = {
  id: number;
  resourceId: number;
  resource: string;
  name: string;
  type: number; // 1 = ruta lineal, 2 = polígono, 3 = círculo
  color: string;
  center?: [number, number];
  radius?: number;
  points?: Array<[number, number]>;
  min_y?: number;
  min_x?: number;
  max_y?: number;
  max_x?: number;
};

/**
 * Consulta directa de Geocercas y Rutas en Wialon por JSONP
 */
export async function clientFetchGeofences(
  host: WialonHost,
  sid: string,
): Promise<{ zones: ClientZone[]; resources: Array<{ id: number; name: string }>; detectedHost: WialonHost }> {
  const hosts = getHostList(host);

  for (const { host: h, base } of hosts) {
    try {
      const params = encodeURIComponent(
        JSON.stringify({
          spec: { itemsType: "avl_resource", propName: "sys_name", propValueMask: "*", sortType: "sys_name" },
          force: 1,
          flags: 4097, // 0x1 (base) + 0x1000 (zonas/geocercas zl)
          from: 0,
          to: 0,
        }),
      );
      const url = `${base}/wialon/ajax.html?svc=core/search_items&params=${params}&sid=${sid}`;
      const data = await jsonpRequest<any>(url, 8000);

      if (data?.items && Array.isArray(data.items)) {
        const resources: Array<{ id: number; name: string }> = [];
        const zones: ClientZone[] = [];

        for (const item of data.items) {
          resources.push({ id: item.id, name: item.nm || `Recurso ${item.id}` });
          if (item.zl && typeof item.zl === "object") {
            for (const z of Object.values(item.zl) as any[]) {
              if (!z || !z.id) continue;
              const hexColor = z.c ? `#${(z.c & 0xffffff).toString(16).padStart(6, "0")}` : "#92d700";
              const center: [number, number] = [
                z.b?.cen_y ?? z.p?.[0]?.y ?? 20.6736,
                z.b?.cen_x ?? z.p?.[0]?.x ?? -103.344,
              ];
              const radius = z.p?.[0]?.r ?? (z.t === 3 ? 100 : 100);
              let points: Array<[number, number]> = Array.isArray(z.p) && z.p.length > 0
                ? z.p.map((pt: any) => [pt.y ?? pt.lat, pt.x ?? pt.lon] as [number, number])
                : [];

              if (points.length === 0) {
                if (z.t === 3) {
                  points = [[center[0], center[1]]];
                } else if (z.b?.min_y != null && z.b?.min_x != null && z.b?.max_y != null && z.b?.max_x != null) {
                  points = [
                    [z.b.min_y, z.b.min_x],
                    [z.b.min_y, z.b.max_x],
                    [z.b.max_y, z.b.max_x],
                    [z.b.max_y, z.b.min_x],
                  ];
                } else {
                  points = [[center[0], center[1]]];
                }
              }

              zones.push({
                id: z.id,
                resourceId: item.id,
                resource: item.nm || `Recurso ${item.id}`,
                name: z.n || `Zona ${z.id}`,
                type: z.t ?? 2,
                color: hexColor,
                center,
                radius,
                points,
                min_y: z.b?.min_y,
                min_x: z.b?.min_x,
                max_y: z.b?.max_y,
                max_x: z.b?.max_x,
              });
            }
          }
        }

        if (zones.length > 0 || resources.length > 0) {
          return { zones, resources, detectedHost: h };
        }
      }
    } catch (err) {
      console.warn(`[clientFetchGeofences] Falló en ${h}:`, err);
    }
  }

  return { zones: [], resources: [], detectedHost: host };
}

/**
 * Consulta de historial y mensajes de una unidad por JSONP
 */
export async function clientFetchHistory(
  host: WialonHost,
  sid: string,
  unitId: number,
  timeFrom: number,
  timeTo: number,
): Promise<{ messages: WialonMessage[]; total: number; maxSpeed: number; points: number }> {
  const hosts = getHostList(host);

  for (const { host: h, base } of hosts) {
    try {
      // 1. Cargar intervalo de mensajes
      const loadParams = encodeURIComponent(
        JSON.stringify({
          itemId: unitId,
          timeFrom,
          timeTo,
          flags: 1, // posición
          flagsMask: 65281, // 0xFF01
          loadCount: 1500,
        }),
      );
      const loadUrl = `${base}/wialon/ajax.html?svc=messages/load_interval&params=${loadParams}&sid=${sid}`;
      const intervalRes = await jsonpRequest<any>(loadUrl, 10000);

      const count = intervalRes?.count ?? 0;
      if (!count || count === 0) {
        // Reintentar sin máscara
        const retryParams = encodeURIComponent(
          JSON.stringify({
            itemId: unitId,
            timeFrom,
            timeTo,
            flags: 0,
            flagsMask: 0,
            loadCount: 1500,
          }),
        );
        const retryUrl = `${base}/wialon/ajax.html?svc=messages/load_interval&params=${retryParams}&sid=${sid}`;
        const retryRes = await jsonpRequest<any>(retryUrl, 8000);
        if (!retryRes?.count) {
          continue;
        }
      }

      // 2. Obtener los mensajes del intervalo cargado
      const getParams = encodeURIComponent(
        JSON.stringify({
          indexFrom: 0,
          indexTo: 1499,
        }),
      );
      const getUrl = `${base}/wialon/ajax.html?svc=messages/get_messages&params=${getParams}&sid=${sid}`;
      const msgsRes = await jsonpRequest<any>(getUrl, 12000);

      const rawMessages: any[] = msgsRes?.messages ?? msgsRes ?? [];
      if (Array.isArray(rawMessages) && rawMessages.length > 0) {
        let maxSpeed = 0;
        let points = 0;
        const messages: WialonMessage[] = rawMessages.map((m: any) => {
          const lat = m.pos?.y ?? null;
          const lon = m.pos?.x ?? null;
          const speed = m.pos?.s ?? 0;
          const course = m.pos?.c ?? 0;
          if (lat != null && lon != null) points++;
          if (speed > maxSpeed) maxSpeed = speed;

          return {
            time: m.t ?? 0,
            lat,
            lon,
            speed,
            course,
            altitude: m.pos?.z ?? 0,
            satellites: m.pos?.sc ?? 0,
            params: m.p ?? {},
          };
        });

        return {
          messages,
          total: messages.length,
          maxSpeed,
          points,
        };
      }
    } catch (err) {
      console.warn(`[clientFetchHistory] Error en ${h}:`, err);
    }
  }

  return { messages: [], total: 0, maxSpeed: 0, points: 0 };
}

/**
 * Consulta de subcuentas y usuarios de la cuenta por JSONP
 */
export async function clientFetchSubaccounts(
  host: WialonHost,
  sid: string,
  currentUserId: number,
  currentUsername: string,
): Promise<{
  subusers: Array<{
    wialonUserId: number;
    wialonUsername: string;
    role: string;
    permissions: { routes: boolean; geofences: boolean; tracking_links: boolean };
    lastLoginAt?: string | null;
  }>;
  isParent: boolean;
  detectedHost: WialonHost;
}> {
  const hosts = getHostList(host);

  for (const { host: h, base } of hosts) {
    try {
      const params = encodeURIComponent(
        JSON.stringify({
          spec: { itemsType: "user", propName: "sys_name", propValueMask: "*", sortType: "sys_name" },
          force: 1,
          flags: 5, // 1 (base) + 4 (crt, bact)
          from: 0,
          to: 0,
        }),
      );
      const url = `${base}/wialon/ajax.html?svc=core/search_items&params=${params}&sid=${sid}`;
      const data = await jsonpRequest<any>(url, 8000);

      if (data?.items && Array.isArray(data.items)) {
        const items: any[] = data.items;
        const me = items.find(
          (u) =>
            (currentUserId > 0 && u.id === currentUserId) ||
            (currentUsername && u.nm?.toLowerCase() === currentUsername.toLowerCase()),
        );

        const myId = me?.id ?? currentUserId;
        const childUsers = items.filter(
          (u) =>
            u.id !== myId &&
            (u.crt === myId || (me && me.crt === 0 && u.bact === me.bact && u.id !== me.id)),
        );

        const subusers = childUsers.map((u) => ({
          wialonUserId: u.id,
          wialonUsername: u.nm,
          role: "subuser",
          permissions: {
            routes: true,
            geofences: true,
            tracking_links: true,
          },
          lastLoginAt: null,
        }));

        return {
          subusers,
          isParent: childUsers.length > 0,
          detectedHost: h,
        };
      }
    } catch (err) {
      console.warn(`[clientFetchSubaccounts] Error en ${h}:`, err);
    }
  }

  return { subusers: [], isParent: false, detectedHost: host };
}

/**
 * Consulta de configuración y canales de video/cámaras por JSONP
 */
export async function clientFetchVideoSettings(
  host: WialonHost,
  sid: string,
  unitId: number,
): Promise<any> {
  const hosts = getHostList(host);

  for (const { host: h, base } of hosts) {
    try {
      const params = encodeURIComponent(JSON.stringify({ unitId }));
      const url = `${base}/wialon/ajax.html?svc=unit/get_video_settings&params=${params}&sid=${sid}`;
      const data = await jsonpRequest<any>(url, 6000);
      if (data && !data.error) {
        return data;
      }
    } catch {}
  }
}

/**
 * Consulta resiliente de unidades con fallback inmediato cliente/JSONP
 */
export async function fetchReliableUnits({
  session,
  fetchUnitsServerFn,
}: {
  session: WialonSession;
  fetchUnitsServerFn: (args: {
    data: { host: WialonHost; sid: string; userId?: number };
  }) => Promise<{ units: WialonUnit[] }>;
}): Promise<{ units: WialonUnit[] }> {
  try {
    const res = await fetchUnitsServerFn({
      data: {
        host: session.host,
        sid: session.sid,
        userId: session.userId,
      },
    });
    if (res?.units && res.units.length > 0) {
      return res;
    }
  } catch (err) {
    console.warn("[fetchReliableUnits] Server function falló, intentando JSONP directo:", err);
  }

  // Fallback directo por JSONP en el browser
  try {
    const clientRes = await clientFetchUnits(session.host, session.sid);
    if (clientRes?.units && clientRes.units.length > 0) {
      return { units: clientRes.units };
    }
  } catch (clientErr) {
    console.error("[fetchReliableUnits] Fallback directo JSONP falló:", clientErr);
  }

  return { units: [] };
}

/**
 * Consulta resiliente de rutas de usuario
 */
export async function fetchReliableUserRoutes({
  session,
  fetchUserRoutesServerFn,
}: {
  session: WialonSession;
  fetchUserRoutesServerFn: (args: {
    data: { userId: number; host: WialonHost; sid: string };
  }) => Promise<{ routes: StoredUserRoute[] }>;
}): Promise<{ routes: StoredUserRoute[] }> {
  try {
    const res = await fetchUserRoutesServerFn({
      data: {
        userId: session.userId,
        host: session.host,
        sid: session.sid,
      },
    });
    if (res?.routes) {
      return res;
    }
  } catch (err) {
    console.warn("[fetchReliableUserRoutes] Server function falló:", err);
  }

  return { routes: [] };
}

/**
 * Consulta resiliente de geocercas y rutas Wialon
 */
export async function fetchReliableGeofences({
  session,
  fetchGeofencesServerFn,
}: {
  session: WialonSession;
  fetchGeofencesServerFn: (args: {
    data: { host: WialonHost; sid: string };
  }) => Promise<{ zones: any[]; resources: Array<{ id: number; name: string }> }>;
}): Promise<{ zones: any[]; resources: Array<{ id: number; name: string }> }> {
  try {
    const res = await fetchGeofencesServerFn({
      data: {
        host: session.host,
        sid: session.sid,
      },
    });
    if (res?.zones) {
      return res;
    }
  } catch (err) {
    console.warn("[fetchReliableGeofences] Server function falló, probando JSONP:", err);
  }

  try {
    const clientRes = await clientFetchGeofences(session.host, session.sid);
    if (clientRes) {
      return { zones: clientRes.zones, resources: clientRes.resources };
    }
  } catch (clientErr) {
    console.error("[fetchReliableGeofences] Fallback JSONP falló:", clientErr);
  }

  return { zones: [], resources: [] };
}

/**
 * Eliminación directa de geocerca en Wialon vía JSONP
 */
export async function clientDirectDeleteGeofence(
  host: WialonHost,
  sid: string,
  resourceId: number,
  zoneId: number,
): Promise<boolean> {
  const hosts = getHostList(host);

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
      if (data && !data.error) {
        return true;
      }
    } catch {}
  }
  return false;
}
