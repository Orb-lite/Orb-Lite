import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  wialonCall,
  isSessionExpired,
  WialonError,
  WIALON_HOSTS,
  type WialonHost,
} from "@/lib/wialon.server";
import { smartGeocode } from "@/lib/geocoding";

const hostSchema = z.enum(["lite", "full"]);
const sessionSchema = z.object({ host: hostSchema, sid: z.string().min(1) });

export type WialonUnit = {
  id: number;
  name: string;
  lat: number | null;
  lon: number | null;
  speed: number | null;
  course: number | null;
  lastMessage: number | null;
  online: boolean;
  imei: string | null;
  creatorId: number | null;
  creatorName: string | null;
};

export type WialonMessage = {
  time: number;
  lat: number | null;
  lon: number | null;
  speed: number | null;
  course: number | null;
};

export type WialonGeofencePoint = {
  lat: number;
  lon: number;
  radius: number;
};

export type WialonGeofence = {
  id: number;
  resourceId: number;
  resource: string;
  name: string;
  type: 1 | 2 | 3;
  color: string;
  points: WialonGeofencePoint[];
};

export type WialonGeofenceResource = {
  id: number;
  name: string;
};

const ONLINE_WINDOW = 10 * 60;
const MAX_HISTORY_MESSAGES = 3000;

function normalizeUnit(
  item: {
    id: number;
    nm?: string;
    uid?: string;
    crt?: number;
    pos?: { y?: number; x?: number; s?: number; c?: number; t?: number } | null;
    lmsg?: { t?: number } | null;
  },
  userNames?: Map<number, string>,
): WialonUnit {
  const pos = item.pos ?? null;
  const last = pos?.t ?? item.lmsg?.t ?? null;
  const now = Math.floor(Date.now() / 1000);
  const creatorId = typeof item.crt === "number" && item.crt > 0 ? item.crt : null;
  return {
    id: item.id,
    name: item.nm ?? `Unidad ${item.id}`,
    lat: pos?.y ?? null,
    lon: pos?.x ?? null,
    speed: pos?.s ?? null,
    course: pos?.c ?? null,
    lastMessage: last,
    online: last != null && now - last <= ONLINE_WINDOW,
    imei: item.uid?.trim() || null,
    creatorId,
    creatorName: creatorId != null ? (userNames?.get(creatorId) ?? null) : null,
  };
}

/** Inicia sesión en Wialon exclusivamente con un token generado por su API. */
export const wialonLogin = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        host: hostSchema,
        token: z.string().trim().min(1, "Captura tu token de acceso."),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;
    try {
      const result = await wialonCall<{
        eid?: string;
        user?: { id?: number; nm?: string };
      }>(host, "token/login", { token: data.token, fl: 1 });

      if (result?.eid) {
        return {
          sid: result.eid,
          host: data.host,
          userId: result.user?.id ?? 0,
          userName: result.user?.nm ?? "Usuario",
        };
      }
    } catch (primaryErr) {
      const altHost: WialonHost = host === "lite" ? "full" : "lite";
      try {
        const altResult = await wialonCall<{
          eid?: string;
          user?: { id?: number; nm?: string };
        }>(altHost, "token/login", { token: data.token, fl: 1 });

        if (altResult?.eid) {
          return {
            sid: altResult.eid,
            host: altHost,
            userId: altResult.user?.id ?? 0,
            userName: altResult.user?.nm ?? "Usuario",
          };
        }
      } catch {
        // Ignorar error del alternativo y lanzar el error primario
      }
      throw primaryErr;
    }

    throw new Error("No se pudo iniciar sesión en la plataforma.");
  });

export const wialonLoginWithSid = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        host: hostSchema,
        sid: z.string().trim().min(1),
        userName: z.string().optional(),
        userId: z.number().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;
    try {
      const res = await wialonCall<{ user?: { id?: number; nm?: string } }>(
        host,
        "core/get_account_data",
        {},
        data.sid,
      );
      return {
        sid: data.sid,
        host: data.host,
        userId: res?.user?.id ?? data.userId ?? 0,
        userName: res?.user?.nm ?? data.userName ?? "Usuario",
      };
    } catch {
      return {
        sid: data.sid,
        host: data.host,
        userId: data.userId ?? 0,
        userName: data.userName ?? "Usuario",
      };
    }
  });

export const wialonLogout = createServerFn({ method: "POST" })
  .validator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      await wialonCall(data.host as WialonHost, "core/logout", {}, data.sid);
    } catch {
      // sesión ya vencida
    }
    return { ok: true };
  });

/** Lista de unidades con su última posición, IMEI y usuario creador. */
export const wialonUnits = createServerFn({ method: "POST" })
  .validator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;
    const searchSpec = (itemsType: string) => ({
      itemsType,
      propName: "sys_name",
      propValueMask: "*",
      sortType: "sys_name",
    });

    const [unitsRes, usersRes] = await Promise.all([
      wialonCall<{ items?: Array<Parameters<typeof normalizeUnit>[0]> }>(
        host,
        "core/search_items",
        {
          spec: searchSpec("avl_unit"),
          force: 1,
          flags: 1 + 4 + 256 + 1024,
          from: 0,
          to: 0,
        },
        data.sid,
      ),
      wialonCall<{ items?: Array<{ id: number; nm?: string }> }>(
        host,
        "core/search_items",
        { spec: searchSpec("user"), force: 1, flags: 1, from: 0, to: 0 },
        data.sid,
      ).catch((error) => {
        if (isSessionExpired(error)) throw error;
        return { items: [] as Array<{ id: number; nm?: string }> };
      }),
    ]);

    const userNames = new Map<number, string>();
    for (const user of usersRes.items ?? []) {
      if (user.nm) userNames.set(user.id, user.nm);
    }

    return {
      units: (unitsRes.items ?? []).map((item) => normalizeUnit(item, userNames)),
    };
  });

function detectCameraBrand(...texts: Array<string | undefined | null>): string | null {
  const haystack = texts.filter(Boolean).join(" ").toLowerCase();
  if (!haystack) return null;
  const brands: Array<[RegExp, string]> = [
    [/cmsv6|cmsv7|icarvisions|icar vision/, "CMSV6 (iCarVisions)"],
    [/streamax/, "Streamax"],
    [/howen/, "Howen"],
    [/jimi|concox|jimiilab/, "Jimi/Concox"],
    [/queclink/, "Queclink"],
    [/teltonika/, "Teltonika"],
    [/ruptela/, "Ruptela"],
    [/fifotrack/, "Fifotrack"],
    [/topflytech|topfly/, "Topflytech"],
    [/meitrack/, "Meitrack"],
    [/hikvision/, "Hikvision"],
    [/dahua/, "Dahua"],
    [/mdvr|mobile dvr/, "MDVR genérico"],
    [/adas|dms/, "Cámara ADAS/DMS"],
  ];
  for (const [pattern, brand] of brands) {
    if (pattern.test(haystack)) return brand;
  }
  return null;
}

export const wialonVideoSettings = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    sessionSchema
      .extend({
        unitId: z.number().int().positive(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;
    let cameras: Array<{
      index: number;
      name: string;
      active: boolean;
      recording: boolean;
      flags: number;
    }> = [];

    try {
      const result = await wialonCall<{
        settings?: Array<{ flags?: number; name?: string }>;
      }>(host, "unit/get_video_settings", { itemId: data.unitId }, data.sid);

      cameras = (result.settings ?? []).map((camera, index) => {
        const flags = camera.flags ?? 0;
        return {
          index: index + 1,
          name: camera.name?.trim() || `Cámara ${index + 1}`,
          active: true,
          recording: (flags & 2) !== 0,
          flags,
        };
      });
    } catch (error) {
      console.error("[video] get_video_settings error:", error);
    }

    return { cameras };
  });

export const wialonVideoUnits = createServerFn({ method: "POST" })
  .validator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;

    const hwNames = new Map<number, string>();
    try {
      const hwRes = await wialonCall<{ items?: Array<{ id?: number; nm?: string }> }>(
        host,
        "core/search_items",
        {
          spec: {
            itemsType: "avl_hw",
            propName: "sys_name",
            propValueMask: "*",
            sortType: "sys_name",
          },
          force: 1,
          flags: 1,
          from: 0,
          to: 0,
        },
        data.sid,
      );
      for (const hw of hwRes.items ?? []) {
        if (hw.id != null && hw.nm) hwNames.set(hw.id, hw.nm);
      }
    } catch (reason) {
      console.error("[video] search avl_hw error:", reason);
    }

    const specs = [
      { itemsType: "avl_unit", propName: "sys_name", propValueMask: "*", sortType: "sys_name" },
      {
        itemsType: "avl_unit",
        propName: "rel_user_creator_name",
        propValueMask: "*",
        sortType: "sys_name",
        propType: "creatortree",
      },
      {
        itemsType: "avl_unit",
        propName: "rel_account_name",
        propValueMask: "*",
        sortType: "sys_name",
        propType: "accounttree",
      },
    ];

    const byId = new Map<number, { id: number; nm?: string; hw?: number }>();
    for (const spec of specs) {
      try {
        const res = await wialonCall<{ items?: Array<{ id?: number; nm?: string; hw?: number }> }>(
          host,
          "core/search_items",
          { spec, force: 1, flags: 1 | 0x2000, from: 0, to: 0 },
          data.sid,
        );
        for (const item of res.items ?? []) {
          if (item.id != null) {
            byId.set(item.id, {
              id: item.id,
              ...(item.nm != null ? { nm: item.nm } : {}),
              ...(item.hw != null ? { hw: item.hw } : {}),
            });
          }
        }
      } catch (reason) {
        console.error("[video] search_items error:", reason);
      }
    }

    const items = [...byId.values()];
    const units: Array<{ id: number; name: string; cameraCount: number; brand: string | null }> =
      [];

    for (let i = 0; i < items.length; i += 40) {
      const chunk = items.slice(i, i + 40);
      let answers: unknown[] = [];
      try {
        const r = await wialonCall<unknown[]>(
          host,
          "core/batch",
          {
            params: chunk.map((item) => ({
              svc: "unit/get_video_settings",
              params: { itemId: item.id },
            })),
            flags: 0,
          },
          data.sid,
        );
        answers = Array.isArray(r) ? r : [];
      } catch (reason) {
        console.error("[video] batch get_video_settings error:", reason);
        answers = [];
      }

      for (let j = 0; j < chunk.length; j++) {
        const item = chunk[j]!;
        const answer = answers[j];
        const settings =
          answer != null && typeof answer === "object" && !Array.isArray(answer)
            ? (answer as { settings?: Array<{ name?: string }> }).settings
            : undefined;
        const cameraCount = settings?.length ?? 0;
        const hwName = item.hw != null ? hwNames.get(item.hw) : undefined;
        const cameraNames = (settings ?? []).map((c) => c?.name).filter(Boolean) as string[];

        units.push({
          id: item.id,
          name: item.nm ?? `Unidad ${item.id}`,
          cameraCount,
          brand: detectCameraBrand(hwName, ...cameraNames, item.nm),
        });
      }
    }

    return { units };
  });

export const wialonHistory = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    sessionSchema
      .extend({
        unitId: z.number().int().positive(),
        timeFrom: z.number().int().positive(),
        timeTo: z.number().int().positive(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;

    await wialonCall(host, "core/search_item", { id: data.unitId, flags: 1 + 1024 }, data.sid);

    const interval = await wialonCall<{ count?: number }>(
      host,
      "messages/load_interval",
      {
        itemId: data.unitId,
        timeFrom: data.timeFrom,
        timeTo: data.timeTo,
        flags: 1,
        flagsMask: 65281,
        loadCount: MAX_HISTORY_MESSAGES,
      },
      data.sid,
    );

    const count = Math.min(interval.count ?? 0, MAX_HISTORY_MESSAGES);
    let messages: WialonMessage[] = [];

    if (count > 0) {
      const res = await wialonCall<
        Array<{
          t?: number;
          pos?: { y?: number; x?: number; s?: number; c?: number } | null;
        }>
      >(host, "messages/get_messages", { indexFrom: 0, indexTo: count - 1 }, data.sid);

      messages = (Array.isArray(res) ? res : []).map((m) => ({
        time: m.t ?? 0,
        lat: m.pos?.y ?? null,
        lon: m.pos?.x ?? null,
        speed: m.pos?.s ?? null,
        course: m.pos?.c ?? null,
      }));
    }

    try {
      await wialonCall(host, "messages/unload", {}, data.sid);
    } catch {
      // sin sesión de mensajes activa
    }

    const withPos = messages.filter((m) => m.lat != null && m.lon != null);
    const maxSpeed = withPos.reduce((acc, m) => Math.max(acc, m.speed ?? 0), 0);

    return {
      total: interval.count ?? 0,
      messages,
      maxSpeed,
      points: withPos.length,
    };
  });

export const wialonCmsOverview = createServerFn({ method: "POST" })
  .validator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;

    async function search(itemsType: string, flags: number) {
      const res = await wialonCall<{
        items?: Array<{ id: number; nm?: string }>;
      }>(
        host,
        "core/search_items",
        {
          spec: {
            itemsType,
            propName: "sys_name",
            propValueMask: "*",
            sortType: "sys_name",
          },
          force: 1,
          flags,
          from: 0,
          to: 0,
        },
        data.sid,
      );
      return (res.items ?? []).map((i) => ({
        id: i.id,
        name: i.nm ?? `#${i.id}`,
      }));
    }

    const [resources, users, units] = await Promise.all([
      search("avl_resource", 1),
      search("user", 1),
      search("avl_unit", 1),
    ]);

    return { resources, users, units };
  });

export const wialonHwTypes = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    sessionSchema.extend({ search: z.string().trim().optional() }).parse(input),
  )
  .handler(async ({ data }) => {
    const res = await wialonCall<Array<{ id: number; name: string }>>(
      data.host as WialonHost,
      "core/get_hw_types",
      {
        filterType: "name",
        filterValue: [data.search ?? ""],
        includeType: true,
        ignoreRename: true,
      },
      data.sid,
    );
    const list = (Array.isArray(res) ? res : []).map((h) => ({
      id: h.id,
      name: h.name,
    }));
    return { types: list.slice(0, 400) };
  });

export const wialonCreateUnit = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    sessionSchema
      .extend({
        creatorId: z.number().int().positive(),
        name: z.string().trim().min(4).max(60),
        hwTypeId: z.number().int().positive(),
        uniqueId: z.string().trim().max(60).optional(),
        phone: z.string().trim().max(30).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;
    const created = await wialonCall<{ item?: { id?: number; nm?: string } }>(
      host,
      "core/create_unit",
      {
        creatorId: data.creatorId,
        name: data.name,
        hwTypeId: data.hwTypeId,
        dataFlags: 1,
      },
      data.sid,
    );
    const id = created.item?.id;
    if (!id) throw new Error("La unidad no se pudo crear.");

    if (data.uniqueId) {
      await wialonCall(
        host,
        "unit/update_device_type",
        { itemId: id, deviceTypeId: data.hwTypeId, uniqueId: data.uniqueId },
        data.sid,
      );
    }
    if (data.phone) {
      await wialonCall(
        host,
        "unit/update_phone",
        { itemId: id, phoneNumber: data.phone },
        data.sid,
      );
    }

    return { id, name: created.item?.nm ?? data.name };
  });

export const wialonCreateUser = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    sessionSchema
      .extend({
        creatorId: z.number().int().positive(),
        name: z.string().trim().min(4).max(60),
        password: z.string().min(6).max(64),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const created = await wialonCall<{ item?: { id?: number; nm?: string } }>(
      data.host as WialonHost,
      "core/create_user",
      {
        creatorId: data.creatorId,
        name: data.name,
        password: data.password,
        dataFlags: 1,
      },
      data.sid,
    );
    const id = created.item?.id;
    if (!id) throw new Error("El usuario no se pudo crear.");
    return { id, name: created.item?.nm ?? data.name };
  });

const ACCESS_MASKS = {
  consulta: 0x1 | 0x20,
  completo: 0x1 | 0x2 | 0x4 | 0x20 | 0x40 | 0x100 | 0x200 | 0x400,
} as const;

export type WialonAccessLevel = keyof typeof ACCESS_MASKS;

export const wialonPermissions = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    sessionSchema.extend({ userId: z.number().int() }).parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;

    type AccountService = {
      type?: number;
      val?: number | string;
      value?: number | string;
      enabled?: boolean;
      max?: number | string;
    };
    type Account = {
      plan?: string | { name?: string; services?: Record<string, AccountService> };
      enabled?: number;
      services?: Record<string, AccountService>;
    };

    let userFlags = 0;
    let accountId: number | null = null;
    try {
      const me = await wialonCall<{ item?: { fl?: number; bact?: number } }>(
        host,
        "core/search_item",
        { id: data.userId, flags: 1 + 4 + 256 },
        data.sid,
      );
      userFlags = me.item?.fl ?? 0;
      accountId = me.item?.bact ?? null;
    } catch {
      userFlags = 0;
    }

    let account: Account = {};
    try {
      account = await wialonCall<Account>(
        host,
        "account/get_account_data",
        { itemId: accountId ?? data.userId, type: 1 },
        data.sid,
      );
    } catch {
      try {
        account = await wialonCall<Account>(host, "core/get_account_data", { type: 1 }, data.sid);
      } catch {
        account = {};
      }
    }

    const planServices =
      typeof account.plan === "object" && account.plan !== null ? account.plan.services : undefined;
    const services = { ...(planServices ?? {}), ...(account.services ?? {}) };
    const findService = (...names: string[]) => {
      const service = names.map((name) => services[name]).find(Boolean);
      return service ?? null;
    };
    const serviceEnabled = (...names: string[]) => {
      const service = findService(...names);
      if (!service) return null;
      const raw = service.val ?? service.value ?? service.enabled;
      if (raw == null) return true;
      return typeof raw === "boolean" ? raw : Number(raw) !== 0;
    };
    const serviceLimit = (...names: string[]) => {
      const service = findService(...names);
      if (service?.max == null) return null;
      const limit = Number(service.max);
      return Number.isFinite(limit) ? limit : null;
    };

    const hasCreateItemsFlag = (userFlags & 0x04) !== 0;
    const isAdministrator = (userFlags & 0x40) !== 0;
    const canCreateItems = hasCreateItemsFlag || isAdministrator;
    const unitsSvc = serviceEnabled("create_units", "create_unit", "avl_unit");
    const usersSvc = serviceEnabled("create_users", "create_user", "users");
    const planName = typeof account.plan === "string" ? account.plan : (account.plan?.name ?? null);

    return {
      plan: planName,
      accountEnabled: (account.enabled ?? 1) !== 0,
      accountId,
      isAdministrator,
      canCreateItems,
      canCreateUnits: canCreateItems && unitsSvc !== false,
      canCreateUsers: canCreateItems && usersSvc !== false,
      limits: {
        units: serviceLimit("create_units", "create_unit", "avl_unit"),
        users: serviceLimit("create_users", "create_user", "users"),
      },
    };
  });

export const wialonGrantUnits = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    sessionSchema
      .extend({
        userId: z.number().int().positive(),
        unitIds: z.array(z.number().int().positive()).max(200),
        level: z.enum(["consulta", "completo"]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;
    const mask = ACCESS_MASKS[data.level as WialonAccessLevel];
    for (const unitId of data.unitIds) {
      await wialonCall(
        host,
        "user/update_item_access",
        { userId: data.userId, itemId: unitId, accessMask: mask },
        data.sid,
      );
    }
    return { granted: data.unitIds.length };
  });

export const wialonPing = createServerFn({ method: "POST" })
  .validator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      await wialonCall(data.host as WialonHost, "core/get_account_data", { type: 0 }, data.sid);
      return { valid: true as const };
    } catch (error) {
      if (isSessionExpired(error)) return { valid: false as const };
      throw error;
    }
  });

export type WialonSensor = {
  id: number;
  name: string;
  type: string;
  metrics: string;
  value: string;
};

export const wialonUnitDetail = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    sessionSchema.extend({ unitId: z.number().int().positive() }).parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;

    const res = await wialonCall<{
      item?: {
        id: number;
        nm?: string;
        uid?: string;
        ph?: string;
        hw?: number;
        pos?: {
          y?: number;
          x?: number;
          s?: number;
          c?: number;
          t?: number;
        } | null;
        lmsg?: { t?: number; p?: Record<string, unknown> } | null;
        sens?: Record<string, { id: number; n?: string; t?: string; m?: string; p?: string }>;
        cmds?: Record<string, { id: number; n?: string; c?: string; l?: string; p?: string }>;
      };
    }>(host, "core/search_item", { id: data.unitId, flags: 1 + 256 + 512 + 1024 + 4096 }, data.sid);

    const item = res.item;
    if (!item) throw new Error("La unidad no está disponible en tu cuenta.");

    const params = (item.lmsg?.p ?? {}) as Record<string, unknown>;
    const sensors: WialonSensor[] = Object.values(item.sens ?? {}).map((s) => {
      const raw = s.p ? params[s.p] : undefined;
      return {
        id: s.id,
        name: s.n ?? `Sensor ${s.id}`,
        type: s.t ?? "",
        metrics: s.m ?? "",
        value: raw == null ? "—" : String(raw),
      };
    });

    const commands = Object.values(item.cmds ?? {}).map((c) => ({
      id: c.id,
      name: c.n ?? `Comando ${c.id}`,
      type: c.c ?? "",
      link: c.l ?? "auto",
    }));

    return {
      unit: normalizeUnit(item),
      uniqueId: item.uid ?? null,
      phone: item.ph ?? null,
      hwTypeId: item.hw ?? null,
      sensors,
      commands,
      params: Object.entries(params).map(([key, value]) => ({
        key,
        value: String(value),
      })),
    };
  });

export const wialonSendCommand = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    sessionSchema
      .extend({
        unitId: z.number().int().positive(),
        commandName: z.string().trim().min(1).max(80),
        linkType: z.string().trim().max(20).optional(),
        param: z.string().trim().max(200).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    await wialonCall(
      data.host as WialonHost,
      "unit/exec_cmd",
      {
        itemId: data.unitId,
        commandName: data.commandName,
        linkType: data.linkType ?? "",
        param: data.param ?? "",
        timeout: 60,
        flags: 0,
      },
      data.sid,
    );
    return { sent: true as const };
  });

export const wialonGeofences = createServerFn({ method: "POST" })
  .validator((input: unknown) => sessionSchema.parse(input))
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
    for (const r of results) {
      if (r.status !== "fulfilled") continue;
      for (const item of r.value.items ?? []) {
        const prev = byId.get(item.id);
        byId.set(item.id, { ...prev, ...item, zl: { ...(prev?.zl ?? {}), ...(item.zl ?? {}) } });
      }
    }
    if (byId.size === 0) {
      const failed = results.find((r) => r.status === "rejected") as
        | PromiseRejectedResult
        | undefined;
      if (failed) throw failed.reason;
    }
    const resources = { items: [...byId.values()] };

    const zones: WialonGeofence[] = [];

    for (const resource of resources.items) {
      for (const zone of Object.values(resource.zl ?? {})) {
        const rawColor = zone.c ?? 0x38bdf8;
        const cx = zone.b?.cen_x;
        const cy = zone.b?.cen_y;
        const radius =
          zone.b?.min_x != null && zone.b.max_x != null
            ? Math.abs(zone.b.max_x - zone.b.min_x) * 55660
            : 100;

        const points: WialonGeofencePoint[] = [];
        if (cx != null && cy != null) {
          points.push({ lat: cy, lon: cx, radius });
        }

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
    }

    return { zones };
  });
