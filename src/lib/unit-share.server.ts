import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type SharedUnitLink = {
  id: string;
  token: string;
  unitId: number;
  unitName: string;
  imei?: string | null;
  clientName?: string | null;
  clientPhone?: string | null;
  clientEmail?: string | null;
  notes?: string | null;
  durationHours: number;
  createdAt: string;
  expiresAt: string;
  status: "active" | "revoked" | "expired";
  viewCount: number;
  lastViewedAt?: string | null;
  host: "lite" | "full";
  sid?: string | null;
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

export async function createSharedUnitLink(params: {
  unitId: number;
  unitName: string;
  imei?: string | null;
  clientName?: string | null;
  clientPhone?: string | null;
  clientEmail?: string | null;
  notes?: string | null;
  durationHours: number;
  host: "lite" | "full";
  sid?: string | null;
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
  const expires = new Date(now.getTime() + params.durationHours * 3600 * 1000);

  const defaultLat = params.initialPosition?.lat ?? 20.6736;
  const defaultLon = params.initialPosition?.lon ?? -103.3440;

  const linkRecord: SharedUnitLink = {
    id,
    token,
    unitId: params.unitId,
    unitName: params.unitName,
    imei: params.imei ?? null,
    clientName: params.clientName?.trim() || null,
    clientPhone: params.clientPhone?.trim() || null,
    clientEmail: params.clientEmail?.trim() || null,
    notes: params.notes?.trim() || null,
    durationHours: params.durationHours,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    status: "active",
    viewCount: 0,
    lastViewedAt: null,
    host: params.host,
    sid: params.sid ?? null,
    lastPosition: {
      lat: defaultLat,
      lon: defaultLon,
      speed: params.initialPosition?.speed ?? 0,
      course: params.initialPosition?.course ?? 0,
      time: params.initialPosition?.time ?? Math.floor(now.getTime() / 1000),
      address: params.initialPosition?.address ?? "Zona Metropolitana de Guadalajara",
    },
    trail: [
      {
        lat: defaultLat,
        lon: defaultLon,
        time: Math.floor(now.getTime() / 1000),
        speed: params.initialPosition?.speed ?? 0,
      },
    ],
  };

  inMemoryUnitShares.set(token, linkRecord);
  inMemoryUnitShares.set(id, linkRecord);

  // Intentar sincronizar en Supabase si está disponible
  try {
    await supabaseAdmin.from("shared_unit_links").insert({
      id: linkRecord.id,
      token: linkRecord.token,
      unit_id: linkRecord.unitId,
      unit_name: linkRecord.unitName,
      imei: linkRecord.imei,
      client_name: linkRecord.clientName,
      client_phone: linkRecord.clientPhone,
      client_email: linkRecord.clientEmail,
      notes: linkRecord.notes,
      duration_hours: linkRecord.durationHours,
      created_at: linkRecord.createdAt,
      expires_at: linkRecord.expiresAt,
      status: linkRecord.status,
      host: linkRecord.host,
      last_position: linkRecord.lastPosition,
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
    if (item.status === "active" && new Date(item.expiresAt).getTime() <= now) {
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
        .from("shared_unit_links")
        .select("*")
        .eq("token", token)
        .maybeSingle();

      if (data) {
        link = {
          id: data.id,
          token: data.token,
          unitId: data.unit_id,
          unitName: data.unit_name,
          imei: data.imei,
          clientName: data.client_name,
          clientPhone: data.client_phone,
          clientEmail: data.client_email,
          notes: data.notes,
          durationHours: data.duration_hours,
          createdAt: data.created_at,
          expiresAt: data.expires_at,
          status: data.status,
          viewCount: data.view_count ?? 0,
          lastViewedAt: data.last_viewed_at,
          host: data.host,
          lastPosition: data.last_position,
        };
        inMemoryUnitShares.set(token, link);
        inMemoryUnitShares.set(link.id, link);
      }
    } catch {
      // Ignorar error de red
    }
  }

  if (link) {
    if (link.status === "active" && new Date(link.expiresAt).getTime() <= Date.now()) {
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
    await supabaseAdmin
      .from("shared_unit_links")
      .update({ status: "revoked" })
      .eq("token", token);
  } catch {
    // Ignorar error de red
  }
  return true;
}

export async function extendSharedUnitLink(token: string, additionalHours: number): Promise<SharedUnitLink | null> {
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
      .from("shared_unit_links")
      .update({
        expires_at: link.expiresAt,
        duration_hours: link.durationHours,
        status: "active",
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
    await supabaseAdmin.from("shared_unit_links").delete().eq("token", token);
  } catch {
    // Ignorar
  }
  return true;
}

export async function updateSharedUnitPosition(
  token: string,
  pos: { lat: number; lon: number; speed: number; course: number; time: number; address?: string },
): Promise<void> {
  const link = await getSharedUnitByToken(token);
  if (!link) return;

  link.lastPosition = pos;
  if (!link.trail) link.trail = [];

  const lastTrail = link.trail[link.trail.length - 1];
  if (!lastTrail || Math.abs(lastTrail.lat - pos.lat) > 0.0001 || Math.abs(lastTrail.lon - pos.lon) > 0.0001) {
    link.trail.push({
      lat: pos.lat,
      lon: pos.lon,
      time: pos.time,
      speed: pos.speed,
    });
    // Limitar el trail a las últimas 150 posiciones
    if (link.trail.length > 150) {
      link.trail = link.trail.slice(-150);
    }
  }
}
