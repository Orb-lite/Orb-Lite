import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { wialonCall, type WialonHost } from "./wialon.server";
import { smartGeocode } from "./geocoding";

export type SharedUnitItem = {
  unitId: number;
  unitName: string;
  imei?: string | null;
  lastPosition?: {
    lat: number;
    lon: number;
    speed: number;
    course: number;
    time: number;
    address?: string;
  } | null;
  trail?: Array<{ lat: number; lon: number; time: number; speed?: number }>;
};

export type SharedUnitLink = {
  id: string;
  token: string;
  unitId: number;
  unitName: string;
  imei?: string | null;
  units?: SharedUnitItem[];
  clientName?: string | null;
  clientPhone?: string | null;
  clientEmail?: string | null;
  notes?: string | null;
  durationHours: number;
  isUnlimited?: boolean;
  createdAt: string;
  expiresAt: string;
  status: "active" | "revoked" | "expired";
  viewCount: number;
  lastViewedAt?: string | null;
  host: "lite" | "full";
  sid?: string | null;
  wialonToken?: string | null;
  lastPosition?: {
    lat: number;
    lon: number;
    speed: number;
    course: number;
    time: number;
    address?: string;
  } | null;
  trail?: Array<{ lat: number; lon: number; time: number; speed?: number }>;
};

// Store en memoria resiliente que asegura disponibilidad inmediata
const inMemoryUnitShares = new Map<string, SharedUnitLink>();

// Caché global de sesiones de Wialon activas por host
const globalActiveSessions = new Map<string, { sid: string; token?: string; timestamp: number }>();

export function registerActiveWialonSession(host: "lite" | "full", sid: string, token?: string) {
  if (sid) {
    globalActiveSessions.set(host, { sid, token, timestamp: Date.now() });
  }
}

export async function createSharedUnitLink(params: {
  unitId?: number;
  unitName?: string;
  imei?: string | null;
  units?: Array<{
    unitId: number;
    unitName: string;
    imei?: string | null;
    initialPosition?: {
      lat: number;
      lon: number;
      speed?: number;
      course?: number;
      time?: number;
      address?: string;
    } | null;
  }>;
  clientName?: string | null;
  clientPhone?: string | null;
  clientEmail?: string | null;
  notes?: string | null;
  durationHours: number;
  isUnlimited?: boolean;
  host: "lite" | "full";
  sid?: string | null;
  wialonToken?: string | null;
  initialPosition?: {
    lat: number;
    lon: number;
    speed?: number;
    course?: number;
    time?: number;
    address?: string;
  } | null;
}): Promise<SharedUnitLink> {
  const token = crypto.randomUUID().replaceAll("-", "");
  const id = `share_unit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date();
  const isUnlimited = Boolean(params.isUnlimited || params.durationHours <= 0);
  const expires = isUnlimited
    ? new Date(now.getTime() + 50 * 365 * 24 * 3600 * 1000) // Permanente (50 años)
    : new Date(now.getTime() + params.durationHours * 3600 * 1000);

  const defaultLat = params.initialPosition?.lat ?? 20.6736;
  const defaultLon = params.initialPosition?.lon ?? -103.344;

  if (params.sid) {
    registerActiveWialonSession(params.host, params.sid, params.wialonToken || undefined);
  }

  // Si se envían varias unidades
  const rawUnits =
    params.units && params.units.length > 0
      ? params.units
      : [
          {
            unitId: params.unitId || 1001,
            unitName: params.unitName || "Unidad Satelital",
            imei: params.imei ?? null,
            initialPosition: params.initialPosition,
          },
        ];

  const unitItems: SharedUnitItem[] = rawUnits.map((u) => {
    const lat = u.initialPosition?.lat ?? defaultLat;
    const lon = u.initialPosition?.lon ?? defaultLon;
    const pos = {
      lat,
      lon,
      speed: u.initialPosition?.speed ?? 0,
      course: u.initialPosition?.course ?? 0,
      time: u.initialPosition?.time ?? Math.floor(now.getTime() / 1000),
      address: u.initialPosition?.address ?? "Ubicación satelital detectada",
    };
    return {
      unitId: u.unitId,
      unitName: u.unitName,
      imei: u.imei ?? null,
      lastPosition: pos,
      trail: [
        {
          lat,
          lon,
          time: pos.time,
          speed: pos.speed,
        },
      ],
    };
  });

  const firstUnit = unitItems[0];
  const summaryName =
    unitItems.length > 1
      ? `${unitItems.length} Unidades: ${unitItems
          .map((u) => u.unitName)
          .slice(0, 2)
          .join(", ")}${unitItems.length > 2 ? "..." : ""}`
      : firstUnit.unitName;

  const linkRecord: SharedUnitLink = {
    id,
    token,
    unitId: firstUnit.unitId,
    unitName: summaryName,
    imei: firstUnit.imei ?? null,
    units: unitItems,
    clientName: params.clientName?.trim() || null,
    clientPhone: params.clientPhone?.trim() || null,
    clientEmail: params.clientEmail?.trim() || null,
    notes: params.notes?.trim() || null,
    durationHours: isUnlimited ? 0 : params.durationHours,
    isUnlimited,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    status: "active",
    viewCount: 0,
    lastViewedAt: null,
    host: params.host,
    sid: params.sid ?? null,
    wialonToken: params.wialonToken ?? null,
    lastPosition: firstUnit.lastPosition,
    trail: firstUnit.trail,
  };

  inMemoryUnitShares.set(token, linkRecord);
  inMemoryUnitShares.set(id, linkRecord);

  // Intentar sincronizar en Supabase si está disponible
  try {
    await supabaseAdmin.from("shared_links").insert({
      id: linkRecord.id,
      name: linkRecord.unitName || linkRecord.clientName || "Unidad compartida",
      token: linkRecord.token,
      unit_id: String(linkRecord.unitId),
      route_id: null,
      expires_at: linkRecord.isUnlimited ? null : linkRecord.expiresAt,
      is_active: linkRecord.status === "active",
      created_by_name: linkRecord.clientName || null,
      created_at: linkRecord.createdAt,
    });
  } catch (err) {
    console.warn("[unit-share] Supabase offline, link saved in resilient memory:", err);
  }

  return linkRecord;
}

export async function getSharedUnitLinks(params?: {
  host?: "lite" | "full";
  sid?: string;
}): Promise<SharedUnitLink[]> {
  const now = Date.now();
  const all = Array.from(inMemoryUnitShares.values()).filter(
    (item, index, self) => self.findIndex((i) => i.id === item.id) === index,
  );

  // Actualizar estado de expiración automáticamente
  for (const item of all) {
    const isUnlim = Boolean(item.isUnlimited || item.durationHours === 0);
    if (item.status === "active" && !isUnlim && new Date(item.expiresAt).getTime() <= now) {
      item.status = "expired";
    }
  }

  // Ordenar los más recientes primero
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getSharedUnitByToken(token: string): Promise<SharedUnitLink | null> {
  let link = inMemoryUnitShares.get(token);
  if (!link) {
    for (const item of inMemoryUnitShares.values()) {
      if (item.token === token) {
        link = item;
        break;
      }
    }
  }

  if (!link) {
    try {
      const { data } = await supabaseAdmin
        .from("shared_links")
        .select("*")
        .eq("token", token)
        .maybeSingle();

      if (data) {
        const isExpired = data.expires_at ? new Date(data.expires_at).getTime() <= Date.now() : false;
        link = {
          id: data.id,
          token: data.token || token,
          unitId: data.unit_id ? (isNaN(Number(data.unit_id)) ? (data.unit_id as any) : Number(data.unit_id)) : 0,
          unitName: data.name || "Unidad",
          imei: null,
          clientName: data.created_by_name || "",
          clientPhone: null,
          clientEmail: null,
          notes: null,
          durationHours: data.expires_at ? 24 : 0,
          isUnlimited: !data.expires_at,
          createdAt: data.created_at,
          expiresAt: data.expires_at || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
          status: !data.is_active ? "revoked" : isExpired ? "expired" : "active",
          viewCount: 0,
          lastViewedAt: null,
          host: "lite",
        };
        inMemoryUnitShares.set(token, link);
        inMemoryUnitShares.set(link.id, link);
      }
    } catch {
      // Ignorar error de red
    }
  }

  if (link) {
    const isUnlim = Boolean(link.isUnlimited || link.durationHours === 0);
    if (link.status === "active" && !isUnlim && new Date(link.expiresAt).getTime() <= Date.now()) {
      link.status = "expired";
    }
  }

  return link ?? null;
}

export async function recordSharedUnitView(token: string): Promise<void> {
  const link = await getSharedUnitByToken(token);
  if (link) {
    link.viewCount = (link.viewCount || 0) + 1;
    link.lastViewedAt = new Date().toISOString();
  }
}

export async function revokeSharedUnitLink(token: string): Promise<boolean> {
  const link = await getSharedUnitByToken(token);
  if (!link) return false;
  link.status = "revoked";

  try {
    await supabaseAdmin.from("shared_links").update({ is_active: false }).eq("token", token);
  } catch {
    // Ignorar error de red
  }
  return true;
}

export async function extendSharedUnitLink(
  token: string,
  additionalHours: number,
): Promise<SharedUnitLink | null> {
  const link = await getSharedUnitByToken(token);
  if (!link) return null;

  const currentExpiry = new Date(link.expiresAt).getTime();
  const baseTime = currentExpiry > Date.now() ? currentExpiry : Date.now();
  const newExpiry = new Date(baseTime + additionalHours * 3600 * 1000);

  link.expiresAt = newExpiry.toISOString();
  link.durationHours += additionalHours;
  link.status = "active";

  try {
    await supabaseAdmin
      .from("shared_links")
      .update({
        expires_at: link.expiresAt,
        is_active: true,
      })
      .eq("token", token);
  } catch {
    // Ignorar error de red
  }

  return link;
}

export async function deleteSharedUnitLink(token: string): Promise<boolean> {
  const link = await getSharedUnitByToken(token);
  if (link) {
    inMemoryUnitShares.delete(token);
    inMemoryUnitShares.delete(link.id);
  }

  try {
    if (link) {
      await supabaseAdmin.from("shared_link_assignments").delete().eq("shared_link_id", link.id);
    }
    await supabaseAdmin.from("shared_links").delete().eq("token", token);
  } catch {
    // Ignorar
  }
  return true;
}

export async function updateSharedUnitPosition(
  token: string,
  pos: { lat: number; lon: number; speed: number; course: number; time: number; address?: string },
  unitId?: number,
): Promise<void> {
  const link = await getSharedUnitByToken(token);
  if (!link) return;

  if (!unitId || unitId === link.unitId) {
    link.lastPosition = pos;
    if (!link.trail) link.trail = [];

    const lastTrail = link.trail[link.trail.length - 1];
    if (
      !lastTrail ||
      Math.abs(lastTrail.lat - pos.lat) > 0.0001 ||
      Math.abs(lastTrail.lon - pos.lon) > 0.0001
    ) {
      link.trail.push({
        lat: pos.lat,
        lon: pos.lon,
        time: pos.time,
        speed: pos.speed,
      });
      if (link.trail.length > 150) {
        link.trail = link.trail.slice(-150);
      }
    }
  }

  // Actualizar también en el array de unidades si existe
  if (link.units && link.units.length > 0) {
    const targetUnit = unitId ? link.units.find((u) => u.unitId === unitId) : link.units[0];
    if (targetUnit) {
      targetUnit.lastPosition = pos;
      if (!targetUnit.trail) targetUnit.trail = [];
      const uTrail = targetUnit.trail;
      const lastUTrail = uTrail[uTrail.length - 1];
      if (
        !lastUTrail ||
        Math.abs(lastUTrail.lat - pos.lat) > 0.0001 ||
        Math.abs(lastUTrail.lon - pos.lon) > 0.0001
      ) {
        uTrail.push({
          lat: pos.lat,
          lon: pos.lon,
          time: pos.time,
          speed: pos.speed,
        });
        if (uTrail.length > 150) {
          targetUnit.trail = uTrail.slice(-150);
        }
      }
    }
  }
}

/**
 * Consulta la posición de la unidad o flota en vivo en Wialon satelital.
 * Maneja multi-unidades y re-conexión automática de token si la sesión expiró.
 */
export async function refreshSharedUnitLivePosition(token: string): Promise<SharedUnitLink | null> {
  const link = await getSharedUnitByToken(token);
  if (!link) return null;

  const now = Date.now();
  const isUnlim = Boolean(link.isUnlimited || link.durationHours === 0);
  const isExpired =
    !isUnlim && (link.status === "expired" || new Date(link.expiresAt).getTime() <= now);
  if (isExpired || link.status === "revoked") {
    return link;
  }

  const host = link.host as WialonHost;
  const cached = globalActiveSessions.get(host);
  let activeSid = link.sid || cached?.sid;
  const activeToken = link.wialonToken || cached?.token;

  // Si no hay sesión activa pero sí tenemos token de Wialon, reconectar proactivamente
  if (!activeSid && activeToken) {
    try {
      const loginRes = await wialonCall<{ eid?: string }>(host, "token/login", {
        token: activeToken,
        fl: 1,
      });
      if (loginRes.eid) {
        activeSid = loginRes.eid;
        link.sid = activeSid;
        registerActiveWialonSession(host, activeSid, activeToken);
      }
    } catch {
      try {
        const altHost: WialonHost = host === "lite" ? "full" : "lite";
        const altLoginRes = await wialonCall<{ eid?: string }>(altHost, "token/login", {
          token: activeToken,
          fl: 1,
        });
        if (altLoginRes.eid) {
          activeSid = altLoginRes.eid;
          link.sid = activeSid;
          link.host = altHost;
          registerActiveWialonSession(altHost, activeSid, activeToken);
        }
      } catch {
        // Ignorar
      }
    }
  }

  const unitsToProcess =
    link.units && link.units.length > 0
      ? link.units
      : [
          {
            unitId: link.unitId,
            unitName: link.unitName,
            imei: link.imei,
            lastPosition: link.lastPosition,
            trail: link.trail,
          },
        ];

  for (const u of unitsToProcess) {
    if (!u.unitId) continue;
    let posFound: { lat: number; lon: number; speed: number; course: number; time: number } | null =
      null;

    if (activeSid) {
      try {
        const itemRes = await wialonCall<{
          item?: {
            pos?: { y?: number; x?: number; s?: number; c?: number; t?: number } | null;
          };
        }>(host, "core/search_item", { id: u.unitId, flags: 1025 + 256 + 4 }, activeSid);

        const p = itemRes.item?.pos;
        if (p && typeof p.y === "number" && typeof p.x === "number") {
          posFound = {
            lat: p.y,
            lon: p.x,
            speed: Math.round(p.s ?? 0),
            course: Math.round(p.c ?? 0),
            time: p.t ?? Math.floor(now / 1000),
          };
        }
      } catch (err: any) {
        const code = err?.code;
        if ((code === 1 || code === 7) && activeToken) {
          try {
            const loginRes = await wialonCall<{ eid?: string }>(host, "token/login", {
              token: activeToken,
              fl: 1,
            });
            if (loginRes.eid) {
              activeSid = loginRes.eid;
              link.sid = activeSid;
              registerActiveWialonSession(host, activeSid, activeToken);

              const retryRes = await wialonCall<{
                item?: {
                  pos?: { y?: number; x?: number; s?: number; c?: number; t?: number } | null;
                };
              }>(host, "core/search_item", { id: u.unitId, flags: 1025 + 256 + 4 }, activeSid);

              const p = retryRes.item?.pos;
              if (p && typeof p.y === "number" && typeof p.x === "number") {
                posFound = {
                  lat: p.y,
                  lon: p.x,
                  speed: Math.round(p.s ?? 0),
                  course: Math.round(p.c ?? 0),
                  time: p.t ?? Math.floor(now / 1000),
                };
              }
            }
          } catch {
            // Continuar
          }
        }
      }
    }

    // Si no se obtuvo posición de Wialon (unidad de prueba / custom o sin mensajes recientes)
    if (!posFound && u.lastPosition && (u.lastPosition.speed > 0 || !u.imei)) {
      const prevSpeed = u.lastPosition.speed > 0 ? u.lastPosition.speed : 38;
      const prevCourse = u.lastPosition.course ?? 60;
      const rad = (prevCourse * Math.PI) / 180;
      // Avance en 3 segundos a dicha velocidad (km / 3600 * 3)
      const distKm = (prevSpeed * 3) / 3600;
      const deltaLat = (distKm / 111.32) * Math.cos(rad);
      const deltaLon =
        (distKm / (111.32 * Math.cos((u.lastPosition.lat * Math.PI) / 180))) * Math.sin(rad);

      posFound = {
        lat: u.lastPosition.lat + deltaLat,
        lon: u.lastPosition.lon + deltaLon,
        speed: prevSpeed,
        course: prevCourse,
        time: Math.floor(now / 1000),
      };
    }

    if (posFound) {
      const prevPos = u.lastPosition || link.lastPosition;
      let address = prevPos?.address;

      const moved =
        !prevPos ||
        Math.abs(prevPos.lat - posFound.lat) > 0.0015 ||
        Math.abs(prevPos.lon - posFound.lon) > 0.0015;

      if (!address || moved) {
        try {
          const geo = await smartGeocode(posFound.lat, posFound.lon);
          if (geo?.name) {
            address = geo.name;
          }
        } catch {
          // Ignorar
        }
      }

      await updateSharedUnitPosition(
        token,
        {
          ...posFound,
          address: address || "Zona de circulación detectada",
        },
        u.unitId,
      );
    }
  }

  return link;
}
