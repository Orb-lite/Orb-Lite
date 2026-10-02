import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  wialonCall,
  isSessionExpired,
  type WialonHost,
} from "@/lib/wialon.server";

const sessionSchema = z.object({
  sid: z.string(),
  host: z.enum(["lite", "full"]),
});

export type WialonGeofence = {
  id: number;
  resourceId: number;
  name: string;
  resource: string;
  type: number;
  color: string;
  points: Array<{ lat: number; lon: number; radius: number }>;
};

function normalizeUnit(item: any, userNames: Map<number, string>) {
  return {
    id: item.id,
    name: item.nm ?? `Unidad ${item.id}`,
    imei: item.uid ?? "",
    creator: userNames.get(item.crt) ?? "",
    position: item.pos
      ? {
          lat: item.pos.y,
          lon: item.pos.x,
          speed: item.pos.s ?? 0,
          course: item.pos.c ?? 0,
          time: item.pos.t ?? 0,
        }
      : null,
  };
}

export const wialonPing = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      await wialonCall(data.host as WialonHost, "core/get_account_data", {}, data.sid);
      return { valid: true };
    } catch {
      return { valid: false };
    }
  });

export const wialonLogout = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      await wialonCall(data.host as WialonHost, "core/logout", {}, data.sid);
    } catch {}
    return { success: true };
  });

/** Lista de unidades con su última posición, IMEI y usuario creador. */
export const wialonUnits = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    sessionSchema
      .extend({
        token: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    let host = data.host as WialonHost;
    let sid = data.sid;

    // Si sid es un token largo (>= 40 caracteres), auto-obtener un eid fresco
    if (sid.length >= 40) {
      const allBases: WialonHost[] = host === "full" ? ["full", "lite"] : ["lite", "full"];
      for (const h of allBases) {
        try {
          const authRes = await wialonCall<{ eid?: string }>(h, "token/login", { token: sid, fl: 1 });
          if (authRes?.eid) {
            sid = authRes.eid;
            host = h;
            break;
          }
        } catch {
          try {
            const authNoFl = await wialonCall<{ eid?: string }>(h, "token/login", { token: sid });
            if (authNoFl?.eid) {
              sid = authNoFl.eid;
              host = h;
              break;
            }
          } catch {}
        }
      }
    }

    const searchSpec = (itemsType: string) => ({
      itemsType,
      propName: "sys_name",
      propValueMask: "*",
      sortType: "sys_name",
    });

    /**
     * Reglas mínimas reales:
     * - 1 = datos básicos
     * - 1024 = última posición / estado
     * - 256 = IMEI si el usuario tiene permiso
     */
    let unitsRes: { items?: Array<Parameters<typeof normalizeUnit>[0]> } = { items: [] };

    try {
      unitsRes = await wialonCall<{ items?: Array<Parameters<typeof normalizeUnit>[0]> }>(
        host,
        "core/search_items",
        {
          spec: searchSpec("avl_unit"),
          force: 1,
          flags: 1 + 256 + 1024,
          from: 0,
          to: 0,
        },
        sid,
      );
    } catch (e1) {
      try {
        unitsRes = await wialonCall<{ items?: Array<Parameters<typeof normalizeUnit>[0]> }>(
          host,
          "core/search_items",
          {
            spec: searchSpec("avl_unit"),
            force: 1,
            flags: 1 + 1024,
            from: 0,
            to: 0,
          },
          sid,
        );
      } catch (e2) {
        try {
          unitsRes = await wialonCall<{ items?: Array<Parameters<typeof normalizeUnit>[0]> }>(
            host,
            "core/search_items",
            {
              spec: searchSpec("avl_unit"),
              force: 1,
              flags: 1,
              from: 0,
              to: 0,
            },
            sid,
          );
        } catch (finalErr) {
          console.warn("[wialonUnits] Error al obtener unidades:", finalErr);
          if (isSessionExpired(finalErr)) {
            throw new Error(
              "Tu sesión de Wialon ha expirado. Por favor cierra sesión y vuelve a ingresar.",
            );
          }
          return { units: [], sid, host };
        }
      }
    }

    // Si no devolvió unidades directas, buscar si las unidades están asignadas en grupos
    if (!unitsRes.items || unitsRes.items.length === 0) {
      try {
        const groupsRes = await wialonCall<{ items?: Array<{ id: number; nm: string; u?: number[] }> }>(
          host,
          "core/search_items",
          {
            spec: searchSpec("avl_unit_group"),
            force: 1,
            flags: 1 + 256,
            from: 0,
            to: 0,
          },
          sid,
        );

        const unitIds = new Set<number>();
        for (const g of groupsRes.items ?? []) {
          for (const uid of g.u ?? []) {
            unitIds.add(uid);
          }
        }

        if (unitIds.size > 0) {
          const idList = Array.from(unitIds).join(",");
          const byIdsRes = await wialonCall<{ items?: Array<Parameters<typeof normalizeUnit>[0]> }>(
            host,
            "core/search_items",
            {
              spec: {
                itemsType: "avl_unit",
                propName: "sys_id",
                propValueMask: idList,
                sortType: "sys_name",
              },
              force: 1,
              flags: 1 + 256 + 1024,
              from: 0,
              to: 0,
            },
            sid,
          );

          if (byIdsRes.items && byIdsRes.items.length > 0) {
            unitsRes = byIdsRes;
          }
        }
      } catch (gErr) {
        console.warn("[wialonUnits] Búsqueda en grupos omitida:", gErr);
      }
    }

    let userNames = new Map<number, string>();
    try {
      const usersRes = await wialonCall<{ items?: Array<{ id: number; nm?: string }> }>(
        host,
        "core/search_items",
        { spec: searchSpec("user"), force: 1, flags: 1, from: 0, to: 0 },
        sid,
      );
      for (const u of usersRes.items ?? []) {
        if (u.nm) userNames.set(u.id, u.nm);
      }
    } catch {}

    return {
      units: (unitsRes.items ?? []).map((item) => normalizeUnit(item, userNames)),
      sid,
      host,
    };
  });

export const wialonGeofences = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;

    type ZoneResource = {
      id: number;
      nm?: string;
      zl?: Record<
        string,
        {
          id: number;
          n?: string;
          t?: number;
          c?: number;
          b?: { cen_x?: number; cen_y?: number; min_x?: number; max_x?: number };
        }
      >;
    };

    const specs = [
      { itemsType: "avl_resource", propName: "sys_name", propValueMask: "*", sortType: "sys_name" },
      {
        itemsType: "avl_resource",
        propName: "rel_user_creator_name",
        propValueMask: "*",
        sortType: "sys_name",
        propType: "creatortree",
      },
      {
        itemsType: "avl_resource",
        propName: "rel_account_name",
        propValueMask: "*",
        sortType: "sys_name",
        propType: "accounttree",
      },
    ];

    const byId = new Map<number, ZoneResource>();
    const results: PromiseSettledResult<{ items?: ZoneResource[] }>[] = [];

    for (const spec of specs) {
      try {
        const value = await wialonCall<{ items?: ZoneResource[] }>(
          host,
          "core/search_items",
          { spec, force: 1, flags: 0x1 | 0x1000, from: 0, to: 0 },
          data.sid,
        );
        results.push({ status: "fulfilled", value });
      } catch (reason) {
        console.error("[geocercas] search_items", spec.propType ?? "direct", reason);
        results.push({ status: "rejected", reason });
      }
    }

    const failedSessionError = results.find(
      (r) => r.status === "rejected" && isSessionExpired(r.reason),
    ) as PromiseRejectedResult | undefined;

    if (failedSessionError) {
      throw failedSessionError.reason;
    }

    for (const r of results) {
      if (r.status !== "fulfilled") continue;
      for (const item of r.value.items ?? []) {
        const prev = byId.get(item.id);
        byId.set(item.id, { ...prev, ...item, zl: { ...(prev?.zl ?? {}), ...(item.zl ?? {}) } });
      }
    }

    if (byId.size === 0) {
      return { zones: [] };
    }

    const resources = { items: [...byId.values()] };
    const zones: WialonGeofence[] = [];

    type ZoneData = Array<{
      id: number;
      n?: string;
      t?: number;
      c?: number;
      p?: Array<{ x?: number; y?: number; r?: number }>;
      b?: { cen_x?: number; cen_y?: number };
    }>;

    const loadResource = async (resource: ZoneResource, res: unknown) => {
      try {
        if (!Array.isArray(res)) throw new Error("sin datos");
        for (const zone of res as ZoneData) {
          const points = (zone.p ?? [])
            .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
            .map((point) => ({
              lat: point.y as number,
              lon: point.x as number,
              radius: point.r ?? 0,
            }));

          if (points.length === 0 && zone.b?.cen_x != null && zone.b.cen_y != null) {
            points.push({ lat: zone.b.cen_y, lon: zone.b.cen_x, radius: 0 });
          }

          const rawColor = zone.c ?? 0x38bdf8;
          zones.push({
            id: zone.id,
            resourceId: resource.id,
            name: zone.n ?? `Zona ${zone.id}`,
            resource: resource.nm ?? `#${resource.id}`,
            type: zone.t === 1 || zone.t === 2 || zone.t === 3 ? zone.t : 2,
            color: `#${(rawColor & 0xffffff).toString(16).padStart(6, "0")}`,
            points,
          });
        }
      } catch {
        for (const zone of Object.values(resource.zl ?? {})) {
          const rawColor = zone.c ?? 0x38bdf8;
          const cx = zone.b?.cen_x;
          const cy = zone.b?.cen_y;
          const radius =
            zone.b?.min_x != null && zone.b.max_x != null
              ? Math.abs(zone.b.max_x - zone.b.min_x) * 55660
              : 100;

          zones.push({
            id: zone.id,
            resourceId: resource.id,
            name: zone.n ?? `Zona ${zone.id}`,
            resource: resource.nm ?? `#${resource.id}`,
            type: zone.t === 1 || zone.t === 2 || zone.t === 3 ? zone.t : 3,
            color: `#${(rawColor & 0xffffff).toString(16).padStart(6, "0")}`,
            points: cx != null && cy != null ? [{ lat: cy, lon: cx, radius }] : [],
          });
        }
      }
    };

    const list = resources.items;
    for (let i = 0; i < list.length; i += 40) {
      const chunk = list.slice(i, i + 40);
      let answers: unknown[] = [];
      try {
        const r = await wialonCall<unknown[]>(
          host,
          "core/batch",
          {
            params: chunk.map((resource) => ({
              svc: "resource/get_zone_data",
              params: {
                itemId: resource.id,
                col: Object.keys(resource.zl ?? {}).map(Number),
                flags: 0x04 | 0x08 | 0x10,
              },
            })),
            flags: 0,
          },
          data.sid,
        );
        answers = Array.isArray(r) ? r : [];
      } catch (reason) {
        console.error("[geocercas] batch get_zone_data", reason);
        answers = [];
      }

      for (let j = 0; j < chunk.length; j++) {
        const answer = answers[j];
        if (answer != null && !Array.isArray(answer)) {
          console.error(
            "[geocercas] get_zone_data recurso",
            chunk[j]!.id,
            JSON.stringify(answer).slice(0, 200),
          );
        }
        await loadResource(chunk[j]!, answer);
      }
    }

    return {
      zones,
      resources: (resources.items ?? []).map((resource) => ({
        id: resource.id,
        name: resource.nm ?? `#${resource.id}`,
      })),
    };
  });
