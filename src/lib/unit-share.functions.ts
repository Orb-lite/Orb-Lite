import { createServerFn } from "@tanstack/react-start";

export interface SharedUnitLink {
  id: string;
  token: string;
  unitName: string;
  clientName?: string | null;
  clientPhone?: string | null;
  notes?: string | null;
  status: "active" | "expired" | "revoked";
  expiresAt: string;
  viewCount?: number;
}

type UnitPosition = {
  lat: number;
  lon: number;
  speed: number;
  course: number;
  time: number;
  address?: string;
};

type SharedUnitData = {
  unitId: number;
  unitName: string;
  imei?: string | null;
  position?: UnitPosition | null;
};

// Datos de unidades por enlace (multi-mapa). Se conservan en memoria del
// servidor; el registro persistente guarda la unidad principal.
const linkUnitsData = new Map<string, SharedUnitData[]>();

const WIALON_BASE: Record<string, string> = {
  lite: "https://hst-api.wialon.com",
  full: "https://hst-api.wialon.com",
};

async function fetchLivePositions(
  host: string,
  sid: string,
  unitIds: number[],
): Promise<Map<number, UnitPosition>> {
  const positions = new Map<number, UnitPosition>();
  if (!sid || unitIds.length === 0) return positions;
  const base = WIALON_BASE[host] ?? WIALON_BASE.lite;
  try {
    const params = {
      spec: {
        itemsType: "avl_unit",
        propName: "sys_id",
        propValueMask: unitIds.join(","),
        sortType: "sys_id",
        propType: "list",
      },
      force: 1,
      flags: 0x00000400 | 0x00000001, // último mensaje + base
      from: 0,
      to: 0,
    };
    const res = await fetch(
      `${base}/wialon/ajax.html?svc=core/search_items&sid=${encodeURIComponent(sid)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `params=${encodeURIComponent(JSON.stringify(params))}`,
      },
    );
    const json = await res.json();
    const items = Array.isArray(json?.items) ? json.items : [];
    for (const item of items) {
      const pos = item?.pos;
      if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
        positions.set(Number(item.id), {
          lat: pos.y,
          lon: pos.x,
          speed: Number(pos.s ?? 0),
          course: Number(pos.c ?? 0),
          time: Number(pos.t ?? 0),
        });
      }
    }
  } catch {
    // Sin posición en vivo: se devuelve la última conocida.
  }
  return positions;
}

export const createUnitShare = createServerFn({ method: "POST" })
  .inputValidator((data: Record<string, unknown>) => data as {
    unitId: number;
    unitName: string;
    unitIds?: number[];
    unitsData?: SharedUnitData[];
    imei?: string | null;
    clientName?: string | null;
    clientPhone?: string | null;
    clientEmail?: string | null;
    notes?: string | null;
    durationHours: number;
    host: "lite" | "full";
    sid?: string | null;
    initialPosition?: UnitPosition | null;
  })
  .handler(async ({ data }) => {
    const { createSharedUnitLink } = await import("./unit-share.server");
    const link = await createSharedUnitLink({
      unitId: data.unitId,
      unitName: data.unitName,
      imei: data.imei ?? null,
      clientName: data.clientName ?? null,
      clientPhone: data.clientPhone ?? null,
      clientEmail: data.clientEmail ?? null,
      notes: data.notes ?? null,
      durationHours: data.durationHours,
      host: data.host,
      sid: data.sid ?? null,
      initialPosition: data.initialPosition ?? null,
    });

    const unitsData: SharedUnitData[] =
      data.unitsData && data.unitsData.length > 0
        ? data.unitsData.map((u) => ({
            unitId: u.unitId,
            unitName: u.unitName,
            imei: u.imei ?? null,
            position: u.position ?? null,
          }))
        : [
            {
              unitId: data.unitId,
              unitName: data.unitName,
              imei: data.imei ?? null,
              position: data.initialPosition ?? null,
            },
          ];
    linkUnitsData.set(link.token, unitsData);

    return { link: link as unknown as SharedUnitLink };
  });

export const listUnitShares = createServerFn({ method: "GET" })
  .inputValidator((data: Record<string, unknown>) => data as { host?: "lite" | "full"; sid?: string })
  .handler(async ({ data }) => {
    const { getSharedUnitLinks } = await import("./unit-share.server");
    const links = await getSharedUnitLinks({ host: data.host, sid: data.sid });
    return { links: links as unknown as SharedUnitLink[] };
  });

export const revokeUnitShare = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const { revokeSharedUnitLink } = await import("./unit-share.server");
    const ok = await revokeSharedUnitLink(data.token);
    if (!ok) throw new Error("No se encontró el enlace.");
    return { success: true };
  });

export const deleteUnitShare = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const { deleteSharedUnitLink } = await import("./unit-share.server");
    linkUnitsData.delete(data.token);
    await deleteSharedUnitLink(data.token);
    return { success: true };
  });

export const extendUnitShare = createServerFn({ method: "POST" })
  .inputValidator((data: Record<string, unknown>) => data as { token: string; additionalHours?: number })
  .handler(async ({ data }) => {
    const { extendSharedUnitLink } = await import("./unit-share.server");
    const link = await extendSharedUnitLink(data.token, data.additionalHours ?? 24);
    if (!link) throw new Error("No se encontró el enlace.");
    return { success: true };
  });

export const getPublicUnitTracking = createServerFn({ method: "GET" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const { getSharedUnitByToken, recordSharedUnitView, updateSharedUnitPosition } =
      await import("./unit-share.server");
    const link = await getSharedUnitByToken(data.token);

    if (!link) throw new Error("Este enlace de rastreo no existe o fue eliminado.");
    if (link.status === "revoked") return { isRevoked: true };
    if (link.status === "expired" || new Date(link.expiresAt).getTime() <= Date.now()) {
      return { isExpired: true };
    }

    await recordSharedUnitView(data.token);

    // Unidades del enlace (multi-mapa) o la unidad principal.
    let unitsData = linkUnitsData.get(data.token);
    if (!unitsData || unitsData.length === 0) {
      unitsData = [
        {
          unitId: link.unitId,
          unitName: link.unitName,
          imei: link.imei ?? null,
          position: link.lastPosition ?? null,
        },
      ];
    }

    // Intentar refrescar posiciones en vivo desde Wialon con la sesión guardada.
    if (link.sid) {
      const live = await fetchLivePositions(
        link.host,
        link.sid,
        unitsData.map((u) => u.unitId),
      );
      for (const unit of unitsData) {
        const pos = live.get(unit.unitId);
        if (pos) unit.position = pos;
      }
      const primary = live.get(link.unitId);
      if (primary) await updateSharedUnitPosition(data.token, primary);
    } else {
      for (const unit of unitsData) {
        if (!unit.position && unit.unitId === link.unitId) {
          unit.position = link.lastPosition ?? null;
        }
      }
    }

    return {
      token: link.token,
      unitId: link.unitId,
      unitName: link.unitName,
      clientName: link.clientName ?? null,
      expiresAt: link.expiresAt,
      position: link.lastPosition ?? null,
      trail: link.trail ?? [],
      unitsData,
    };
  });
