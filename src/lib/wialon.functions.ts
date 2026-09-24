import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { wialonCall, isSessionExpired, type WialonHost } from "@/lib/wialon.server";

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
  /** Identificador único del equipo (IMEI) cuando la cuenta tiene permiso de verlo. */
  imei: string | null;
  /** Usuario creador / propietario de la unidad en la plataforma. */
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

export type WialonVideoCamera = {
  index: number;
  name: string;
  active: boolean;
  recording: boolean;
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
  .inputValidator((input: unknown) =>
    z
      .object({
        host: hostSchema,
        token: z.string().trim().min(1, "Captura tu token de acceso."),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;
    const result = await wialonCall<{ eid?: string; user?: { id?: number; nm?: string } }>(
      host,
      "token/login",
      { token: data.token, fl: 1 },
    );

    if (!result?.eid) throw new Error("No se pudo iniciar sesión en la plataforma.");

    return {
      sid: result.eid,
      host: data.host,
      userId: result.user?.id ?? 0,
      userName: result.user?.nm ?? "Usuario",
    };
  });

export const wialonLogout = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
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
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;
    const searchSpec = (itemsType: string) => ({
      itemsType,
      propName: "sys_name",
      propValueMask: "*",
      sortType: "sys_name",
    });

    // 1 = base, 4 = facturación (creador), 256 = propiedades avanzadas (IMEI), 1024 = posición
    const [unitsRes, usersRes] = await Promise.all([
      wialonCall<{ items?: Array<Parameters<typeof normalizeUnit>[0]> }>(
        host,
        "core/search_items",
        { spec: searchSpec("avl_unit"), force: 1, flags: 1 + 4 + 256 + 1024, from: 0, to: 0 },
        data.sid,
      ),
      // Si la cuenta no puede listar usuarios, solo se omite el nombre del creador.
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

    return { units: (unitsRes.items ?? []).map((item) => normalizeUnit(item, userNames)) };
  });

/** Configuración de las cámaras de una unidad en Wialon Hosting (ORB-FULL). */
export const wialonVideoSettings = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.extend({ unitId: z.number().int().positive() }).parse(input))
  .handler(async ({ data }) => {
    if (data.host !== "full") {
      throw new Error("La consulta de video solo está disponible en ORB-FULL.");
    }

    const result = await wialonCall<{
      settings?: Array<{ flags?: number; name?: string }>;
    }>("full", "unit/get_video_settings", { itemId: data.unitId }, data.sid);

    const cameras = (result.settings ?? []).map((camera, index) => {
      const flags = camera.flags ?? 0;
      return {
        index: index + 1,
        name: camera.name?.trim() || `Cámara ${index + 1}`,
        active: (flags & 1) !== 0,
        recording: (flags & 2) !== 0,
      };
    });

    return { cameras };
  });

/** Unidades ORB-FULL que tienen al menos una cámara configurada. */
export const wialonVideoUnits = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.host !== "full") {
      throw new Error("La consulta de video solo está disponible en ORB-FULL.");
    }

    const res = await wialonCall<{ items?: Array<{ id?: number; nm?: string }> }>(
      "full",
      "core/search_items",
      {
        spec: {
          itemsType: "avl_unit",
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

    const items = res.items ?? [];
    const checks = await Promise.all(
      items.map(async (item) => {
        if (item.id == null) return null;
        try {
          const result = await wialonCall<{ settings?: unknown[] }>(
            "full",
            "unit/get_video_settings",
            { itemId: item.id },
            data.sid,
          );
          const cameraCount = result.settings?.length ?? 0;
          if (cameraCount === 0) return null;
          return { id: item.id, name: item.nm ?? `Unidad ${item.id}`, cameraCount };
        } catch {
          // Sin permiso de video sobre esta unidad: se omite de la lista.
          return null;
        }
      }),
    );

    return { units: checks.filter((unit): unit is { id: number; name: string; cameraCount: number } => unit != null) };
  });

/**
 * Solicita a Wialon el inicio de la transmisión/grabación de una cámara y
 * devuelve la URL del reproductor (HLS) que expone el propio Wialon.
 */
export const wialonVideoStream = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    sessionSchema
      .extend({
        unitId: z.number().int().positive(),
        cameraIndex: z.number().int().positive(),
        mode: z.enum(["live", "archive"]).default("live"),
        resolution: z.enum(["240p", "480p", "720p", "1080p"]).default("480p"),
        timeFrom: z.number().int().positive().optional(),
        timeTo: z.number().int().positive().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    if (data.host !== "full") {
      throw new Error("El reproductor de video solo está disponible en ORB-FULL.");
    }

    const height = Number(data.resolution.replace("p", ""));
    const params: Record<string, unknown> = {
      itemId: data.unitId,
      cam: data.cameraIndex,
      video: 1,
      audio: 0,
      height,
      ...(data.mode === "archive" && data.timeFrom && data.timeTo
        ? { timeFrom: data.timeFrom, timeTo: data.timeTo }
        : {}),
    };

    // Wialon expone la petición de video con distintos nombres según la versión
    // del servicio; se intenta en orden y se usa la primera que responda.
    const svcNames = ["unit/request_video", "unit/get_video_url", "unit/request_video_stream"];
    let lastError: unknown = null;

    for (const svc of svcNames) {
      try {
        const res = await wialonCall<{ url?: string; playlist?: string; path?: string }>(
          "full",
          svc,
          params,
          data.sid,
        );
        const raw = res.url ?? res.playlist ?? res.path;
        if (!raw) continue;
        const url = raw.startsWith("http")
          ? raw
          : `https://hst-api.wialon.com${raw.startsWith("/") ? "" : "/"}${raw}`;
        return { url, mode: data.mode, resolution: data.resolution, service: svc };
      } catch (error) {
        if (isSessionExpired(error)) throw error;
        lastError = error;
      }
    }

    throw new Error(
      lastError instanceof Error
        ? `Wialon no entregó la transmisión: ${lastError.message}`
        : "Wialon no entregó una URL de transmisión para esta cámara.",
    );
  });
/** Historial de mensajes/recorrido de una unidad en un intervalo. */
export const wialonHistory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
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
        // El bit 0x01 identifica los mensajes que incluyen posición GPS.
        // Exigirlo evita que la tabla y el mapa reciban telemetrías sin
        // coordenadas (por ejemplo, mensajes de entradas o estado).
        flags: 1,
        flagsMask: 65281, // 0xFF01: mensajes de datos con ubicación
        // Mantener el límite en la solicitud evita cargar intervalos enormes
        // para después recortarlos en el servidor.
        loadCount: MAX_HISTORY_MESSAGES,
      },
      data.sid,
    );

    const count = Math.min(interval.count ?? 0, MAX_HISTORY_MESSAGES);
    let messages: WialonMessage[] = [];

    if (count > 0) {
      const res = await wialonCall<
        Array<{ t?: number; pos?: { y?: number; x?: number; s?: number; c?: number } | null }>
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

    return { total: interval.count ?? 0, messages, maxSpeed, points: withPos.length };
  });

/** Datos base del CMS: cuentas/recursos, usuarios y unidades. */
export const wialonCmsOverview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;

    async function search(itemsType: string, flags: number) {
      const res = await wialonCall<{ items?: Array<{ id: number; nm?: string }> }>(
        host,
        "core/search_items",
        {
          spec: { itemsType, propName: "sys_name", propValueMask: "*", sortType: "sys_name" },
          force: 1,
          flags,
          from: 0,
          to: 0,
        },
        data.sid,
      );
      return (res.items ?? []).map((i) => ({ id: i.id, name: i.nm ?? `#${i.id}` }));
    }

    const [resources, users, units] = await Promise.all([
      search("avl_resource", 1),
      search("user", 1),
      search("avl_unit", 1),
    ]);

    return { resources, users, units };
  });

/** Tipos de equipo disponibles para dar de alta unidades. */
export const wialonHwTypes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.extend({ search: z.string().trim().optional() }).parse(input))
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
    const list = (Array.isArray(res) ? res : []).map((h) => ({ id: h.id, name: h.name }));
    return { types: list.slice(0, 400) };
  });

/** Alta de unidad (CMS). */
export const wialonCreateUnit = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
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
      { creatorId: data.creatorId, name: data.name, hwTypeId: data.hwTypeId, dataFlags: 1 },
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
      await wialonCall(host, "unit/update_phone", { itemId: id, phoneNumber: data.phone }, data.sid);
    }

    return { id, name: created.item?.nm ?? data.name };
  });

/** Alta de usuario (CMS). */
export const wialonCreateUser = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
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

/** Permisos reales del usuario conectado: rol, altas disponibles y límites de la cuenta. */
export const wialonPermissions = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.extend({ userId: z.number().int() }).parse(input))
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
        // 0x04 devuelve la cuenta de facturación (bact); 0x100 devuelve fl.
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
      // Algunas cuentas antiguas exponen la vista propia en core/get_account_data.
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
    // Wialon muestra al administrador superior como gestor aunque no tenga
    // marcado explícitamente el flag "Can create items".
    const canCreateItems = hasCreateItemsFlag || isAdministrator;
    const unitsSvc = serviceEnabled("create_units", "create_unit", "avl_unit");
    const usersSvc = serviceEnabled("create_users", "create_user", "users");
    const planName =
      typeof account.plan === "string" ? account.plan : account.plan?.name ?? null;

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

/** Otorga acceso de un usuario a unidades específicas. */
export const wialonGrantUnits = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
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

/* ------------------------------------------------------------------ */
/* Sesión: verificación y mantenimiento (evita que expire por inactividad) */
/* ------------------------------------------------------------------ */

/** Mantiene viva la sesión y confirma si sigue siendo válida. */
export const wialonPing = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      await wialonCall(data.host as WialonHost, "core/get_account_data", { type: 0 }, data.sid);
      return { valid: true as const };
    } catch (error) {
      if (isSessionExpired(error)) return { valid: false as const };
      throw error;
    }
  });

/* ------------------------------------------------------------------ */
/* Detalle de unidad: sensores, últimos valores y comandos disponibles */
/* ------------------------------------------------------------------ */

export type WialonSensor = { id: number; name: string; type: string; metrics: string; value: string };

/** Detalle completo de una unidad: posición, sensores con su último valor y comandos. */
export const wialonUnitDetail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.extend({ unitId: z.number().int().positive() }).parse(input))
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;

    const res = await wialonCall<{
      item?: {
        id: number;
        nm?: string;
        uid?: string;
        ph?: string;
        hw?: number;
        pos?: { y?: number; x?: number; s?: number; c?: number; t?: number } | null;
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
      params: Object.entries(params).map(([key, value]) => ({ key, value: String(value) })),
    };
  });

/** Ejecuta un comando en la unidad (bloqueo de motor, salidas, etc.). */
export const wialonSendCommand = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
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

/* ------------------------------------------------------------------ */
/* Geocercas y choferes                                               */
/* ------------------------------------------------------------------ */

export const wialonGeofences = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;

    const resources = await wialonCall<{ items?: Array<{ id: number; nm?: string }> }>(
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
        flags: 1,
        from: 0,
        to: 0,
      },
      data.sid,
    );

    const zones: WialonGeofence[] = [];
    for (const resource of resources.items ?? []) {
      try {
        const res = await wialonCall<
          Array<{
            id: number;
            n?: string;
            t?: number;
            c?: number;
            p?: Array<{ x?: number; y?: number; r?: number }>;
            b?: { cen_x?: number; cen_y?: number };
          }>
        >(
          host,
          "resource/get_zone_data",
          { itemId: resource.id, col: [], flags: 0x04 | 0x08 | 0x10 },
          data.sid,
        );
        for (const zone of Array.isArray(res) ? res : []) {
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
        // recurso sin geocercas o sin permisos de lectura
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

export const wialonCreateGeofence = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    sessionSchema
      .extend({
        resourceId: z.number().int().positive(),
        name: z.string().trim().min(2, "Captura un nombre para la geocerca.").max(100),
        type: z.enum(["circle", "polygon"]),
        color: z.number().int().min(0).max(0xffffff),
        points: z
          .array(
            z.object({
              lat: z.number().finite(),
              lon: z.number().finite(),
              radius: z.number().finite().nonnegative().max(1000000),
            }),
          )
          .min(1)
          .max(1000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    if (data.type === "circle" && data.points.length !== 1) {
      throw new Error("Un círculo necesita centro y radio.");
    }
    if (data.type === "circle" && (data.points[0]?.radius ?? 0) < 10) {
      throw new Error("El círculo debe medir al menos 10 metros.");
    }
    if (data.type === "polygon" && data.points.length < 3) {
      throw new Error("El polígono necesita al menos tres puntos.");
    }

    const result = await wialonCall<Array<number | Record<string, unknown> | null>>(
      data.host as WialonHost,
      "resource/update_zone",
      {
        itemId: data.resourceId,
        id: 0,
        callMode: "create",
        n: data.name,
        d: "",
        t: data.type === "circle" ? 3 : 2,
        w: 3,
        f: 0x20,
        c: data.color,
        tc: 0xffffff,
        ts: 12,
        p: data.points.map((point) => ({ x: point.lon, y: point.lat, r: point.radius })),
      },
      data.sid,
    );

    const id = Array.isArray(result) && typeof result[0] === "number" ? result[0] : null;
    if (!id) throw new Error("La geocerca no se pudo crear.");
    return { id, name: data.name };
  });

export const wialonCreateRoute = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    sessionSchema
      .extend({
        resourceId: z.number().int().positive(),
        name: z.string().trim().min(2, "Captura un nombre para la ruta.").max(100),
        color: z.number().int().min(0).max(0xffffff),
        points: z
          .array(
            z.object({
              lat: z.number().finite(),
              lon: z.number().finite(),
              radius: z.number().finite().nonnegative().max(1000000),
            }),
          )
          .min(2, "Una ruta necesita al menos dos puntos.")
          .max(1000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const result = await wialonCall<Array<number | Record<string, unknown> | null>>(
      data.host as WialonHost,
      "resource/update_zone",
      {
        itemId: data.resourceId,
        id: 0,
        callMode: "create",
        n: data.name,
        d: "",
        t: 1,
        w: 4,
        f: 0x20,
        c: data.color,
        tc: 0xffffff,
        ts: 12,
        p: data.points.map((point) => ({ x: point.lon, y: point.lat, r: 0 })),
      },
      data.sid,
    );

    const id = Array.isArray(result) && typeof result[0] === "number" ? result[0] : null;
    if (!id) throw new Error("La ruta no se pudo crear.");
    return { id, name: data.name };
  });

export type WialonPlannedRoutePoint = {
  lat: number;
  lon: number;
};

export type WialonPlannedRouteStop = {
  label: string;
  lat: number;
  lon: number;
  isOrigin: boolean;
};

export type WialonGeocodedAddress = {
  query: string;
  label: string;
  lat: number;
  lon: number;
};

type GeocodeMatch = { lat?: string; lon?: string; display_name?: string };

async function geocodeAddress(address: string): Promise<WialonGeocodedAddress> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", address);
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "ORB-LITE route planner",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error("El servicio de direcciones no está disponible.");
  }

  const matches = (await response.json()) as GeocodeMatch[];
  const match = matches[0];
  const lat = Number(match?.lat);
  const lon = Number(match?.lon);
  if (!match || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error(`No se encontró la dirección: ${address}`);
  }
  return {
    query: address,
    label: match.display_name?.trim() || address,
    lat,
    lon,
  };
}

/** Busca las direcciones escritas para mostrar sus puntos en el mapa antes de crear la ruta. */
export const wialonGeocodeAddresses = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        addresses: z
          .array(z.string().trim().min(3, "Cada punto necesita una dirección."))
          .min(1, "Captura al menos una dirección.")
          .max(31, "Puedes ubicar hasta 31 puntos a la vez."),
      })
      .parse(input),
  )
  .handler(async ({ data }) => ({
    locations: await Promise.all(data.addresses.map((address) => geocodeAddress(address))),
  }));

export const wialonPlanRoute = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        origin: z.string().trim().min(3, "Captura el punto de salida."),
        addresses: z
          .array(z.string().trim().min(3, "Cada parada necesita una dirección."))
          .min(1, "Captura al menos una dirección.")
          .max(30, "Puedes planificar hasta 30 paradas por ruta."),
        returnToOrigin: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    type TripResponse = {
      code?: string;
      trips?: Array<{
        distance?: number;
        duration?: number;
        geometry?: { coordinates?: Array<[number, number]> };
      }>;
      waypoints?: Array<{ waypoint_index?: number }>;
    };

    const locations = [
      await geocodeAddress(data.origin),
      ...(await Promise.all(data.addresses.map((address) => geocodeAddress(address)))),
    ];
    const coordinates = locations.map((location) => `${location.lon},${location.lat}`).join(";");
    const routeUrl = new URL(`https://router.project-osrm.org/trip/v1/driving/${coordinates}`);
    routeUrl.searchParams.set("overview", "full");
    routeUrl.searchParams.set("geometries", "geojson");
    routeUrl.searchParams.set("source", "first");
    routeUrl.searchParams.set("roundtrip", data.returnToOrigin ? "true" : "false");

    const routeResponse = await fetch(routeUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(20000),
    });
    if (!routeResponse.ok) {
      throw new Error("El servicio de optimización de rutas no está disponible.");
    }

    const trip = (await routeResponse.json()) as TripResponse;
    const selectedTrip = trip.trips?.[0];
    const coordinatesForMap = selectedTrip?.geometry?.coordinates ?? [];
    if (trip.code !== "Ok" || !selectedTrip || coordinatesForMap.length < 2) {
      throw new Error("No se pudo encontrar una ruta entre las direcciones indicadas.");
    }
    const samplingStep = Math.max(1, Math.ceil(coordinatesForMap.length / 900));
    const sampledCoordinates = coordinatesForMap.filter(
      (_, index) => index % samplingStep === 0 || index === coordinatesForMap.length - 1,
    );

    const orderedIndexes = (trip.waypoints ?? [])
      .map((waypoint, index) => ({
        index,
        order: waypoint.waypoint_index ?? index,
      }))
      .sort((left, right) => left.order - right.order);

    return {
      points: sampledCoordinates.map(([lon, lat]) => ({ lat, lon })),
      distanceMeters: Math.round(selectedTrip.distance ?? 0),
      durationSeconds: Math.round(selectedTrip.duration ?? 0),
      stops: orderedIndexes.map(({ index }) => {
        const location = locations[index]!;
        return {
          label: location.label,
          lat: location.lat,
          lon: location.lon,
          isOrigin: index === 0,
        };
      }),
      returnToOrigin: data.returnToOrigin,
    };
  });

export const wialonDrivers = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;

    const resources = await wialonCall<{
      items?: Array<{
        id: number;
        nm?: string;
        drvrs?: Record<string, { id: number; n?: string; ds?: string; p?: string }>;
      }>;
    }>(
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
        flags: 1 + 256,
        from: 0,
        to: 0,
      },
      data.sid,
    );

    const drivers: Array<{ id: number; name: string; phone: string | null; resource: string }> = [];
    for (const resource of resources.items ?? []) {
      for (const driver of Object.values(resource.drvrs ?? {})) {
        drivers.push({
          id: driver.id,
          name: driver.n ?? `Chofer ${driver.id}`,
          phone: driver.p ?? null,
          resource: resource.nm ?? `#${resource.id}`,
        });
      }
    }

    return { drivers };
  });

/** Datos de la cuenta conectada: plan, servicios y saldo de días. */
export const wialonAccount = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const account = await wialonCall<{
      plan?: string;
      enabled?: number;
      balance?: string;
      daysCounter?: number;
      created?: number;
      services?: Record<string, { val?: number; max?: number }>;
    }>(data.host as WialonHost, "core/get_account_data", { type: 1 }, data.sid);

    return {
      plan: account.plan ?? null,
      enabled: (account.enabled ?? 1) !== 0,
      balance: account.balance ?? null,
      daysLeft: account.daysCounter ?? null,
      createdAt: account.created ?? null,
    };
  });

/** Renombra una unidad existente. */
export const wialonRenameUnit = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    sessionSchema.extend({ unitId: z.number().int().positive(), name: z.string().trim().min(4).max(60) }).parse(input),
  )
  .handler(async ({ data }) => {
    await wialonCall(data.host as WialonHost, "item/update_name", { itemId: data.unitId, name: data.name }, data.sid);
    return { ok: true as const };
  });

/** Fila de reporte de posición (y sensores en ORB-FULL). */
export type WialonReportRow = {
  time: number;
  lat: number | null;
  lon: number | null;
  speed: number | null;
  course: number | null;
  sensors: Record<string, number>;
};

type RawMessage = {
  t?: number;
  pos?: { y?: number; x?: number; s?: number; c?: number } | null;
  p?: Record<string, unknown> | null;
};

type RawSensor = { id: number; n?: string; t?: string; p?: string; m?: string };

function numeric(value: unknown): number | null {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

/**
 * Reporte de posición por unidad. En ORB-FULL agrega el valor de cada sensor
 * en su tiempo de medición (se toma el parámetro configurado del sensor).
 */
export const wialonReportData = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    sessionSchema
      .extend({
        unitId: z.number().int().positive(),
        timeFrom: z.number().int().positive(),
        timeTo: z.number().int().positive(),
        withSensors: z.boolean().default(false),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;
    const withSensors = data.withSensors && host === "full";

    const unit = await wialonCall<{
      item?: { nm?: string; sens?: Record<string, RawSensor> };
    }>(host, "core/search_item", { id: data.unitId, flags: 1 + 1024 + (withSensors ? 4096 : 0) }, data.sid);

    const sensors = Object.values(unit.item?.sens ?? {}).filter((s) => s && s.n && s.p);

    const interval = await wialonCall<{ count?: number }>(
      host,
      "messages/load_interval",
      {
        itemId: data.unitId,
        timeFrom: data.timeFrom,
        timeTo: data.timeTo,
        // Solo mensajes de datos con posición GPS: de lo contrario llegan
        // telemetrías sin velocidad y la gráfica queda plana en cero.
        flags: 1,
        flagsMask: 65281, // 0xFF01
        loadCount: MAX_HISTORY_MESSAGES,
      },
      data.sid,
    );

    const count = Math.min(interval.count ?? 0, MAX_HISTORY_MESSAGES);
    let rows: WialonReportRow[] = [];

    if (count > 0) {
      const res = await wialonCall<RawMessage[]>(
        host,
        "messages/get_messages",
        { indexFrom: 0, indexTo: count - 1 },
        data.sid,
      );

      rows = (Array.isArray(res) ? res : [])
        .filter((m) => m && m.pos && m.pos.y != null && m.pos.x != null)
        .sort((a, b) => (a.t ?? 0) - (b.t ?? 0))
        .map((m) => {
        const params = m.p ?? {};
        const values: Record<string, number> = {};

        if (withSensors) {
          for (const sensor of sensors) {
            const raw = numeric(params[sensor.p as string]);
            if (raw != null) values[sensor.n as string] = raw;
          }
          if (sensors.length === 0) {
            for (const [key, value] of Object.entries(params)) {
              const raw = numeric(value);
              if (raw != null) values[key] = raw;
            }
          }
        }

        return {
          time: m.t ?? 0,
          lat: m.pos?.y ?? null,
          lon: m.pos?.x ?? null,
          speed: m.pos?.s ?? null,
          course: m.pos?.c ?? null,
          sensors: values,
        };
      });
    }

    try {
      await wialonCall(host, "messages/unload", {}, data.sid);
    } catch {
      // sin sesión de mensajes activa
    }

    const sensorNames = withSensors
      ? Array.from(new Set(rows.flatMap((row) => Object.keys(row.sensors)))).slice(0, 8)
      : [];

    return {
      unitName: unit.item?.nm ?? `Unidad ${data.unitId}`,
      rows,
      sensorNames,
      sensorUnits: Object.fromEntries(
        sensors.filter((s) => s.n).map((s) => [s.n as string, s.m ?? ""]),
      ) as Record<string, string>,
      total: interval.count ?? 0,
    };
  });

/** Plantillas de reporte disponibles en los recursos de la cuenta. */
export const wialonReportTemplates = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const res = await wialonCall<{
      items?: Array<{ id: number; nm?: string; rep?: Record<string, { id: number; n?: string; ct?: string }> }>;
    }>(
      data.host as WialonHost,
      "core/search_items",
      {
        spec: { itemsType: "avl_resource", propName: "sys_name", propValueMask: "*", sortType: "sys_name" },
        force: 1,
        flags: 1 + 8192,
        from: 0,
        to: 200,
      },
      data.sid,
    );

    const templates = (res.items ?? []).flatMap((resource) =>
      Object.values(resource.rep ?? {}).map((tpl) => ({
        resourceId: resource.id,
        resourceName: resource.nm ?? `Recurso ${resource.id}`,
        templateId: tpl.id,
        name: tpl.n ?? `Reporte ${tpl.id}`,
        objectType: tpl.ct ?? "avl_unit",
      })),
    );

    return { templates: templates.filter((tpl) => tpl.objectType === "avl_unit") };
  });

export type WialonReportTable = { label: string; header: string[]; rows: string[][] };

/** Ejecuta report/exec_report y devuelve las tablas tabulares para exportar. */
export const wialonExecReport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    sessionSchema
      .extend({
        resourceId: z.number().int().positive(),
        templateId: z.number().int().positive(),
        unitId: z.number().int().positive(),
        timeFrom: z.number().int().positive(),
        timeTo: z.number().int().positive(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;

    try {
      await wialonCall(host, "report/cleanup_result", {}, data.sid);
    } catch {
      // no había resultado previo
    }

    const exec = await wialonCall<{
      reportResult?: {
        tables?: Array<{ name?: string; label?: string; rows?: number; header?: string[] }>;
      };
    }>(
      host,
      "report/exec_report",
      {
        reportResourceId: data.resourceId,
        reportTemplateId: data.templateId,
        reportObjectId: data.unitId,
        reportObjectSecId: 0,
        interval: { from: data.timeFrom, to: data.timeTo, flags: 0 },
      },
      data.sid,
    );

    const rawTables = exec.reportResult?.tables ?? [];
    const tables: WialonReportTable[] = [];

    for (let index = 0; index < rawTables.length; index += 1) {
      const table = rawTables[index]!;
      const rowCount = Math.min(table.rows ?? 0, 2000);
      let rows: string[][] = [];

      if (rowCount > 0) {
        const result = await wialonCall<Array<{ c?: unknown[] }>>(
          host,
          "report/select_result_rows",
          { tableIndex: index, config: { type: "range", data: { from: 0, to: rowCount - 1, level: 0 } } },
          data.sid,
        );

        rows = (Array.isArray(result) ? result : []).map((row) =>
          (row.c ?? []).map((cell) => {
            if (cell == null) return "";
            if (typeof cell === "object" && "t" in (cell as Record<string, unknown>)) {
              return String((cell as { t?: unknown }).t ?? "");
            }
            return String(cell);
          }),
        );
      }

      tables.push({
        label: table.label ?? table.name ?? `Tabla ${index + 1}`,
        header: table.header ?? [],
        rows,
      });
    }

    try {
      await wialonCall(host, "report/cleanup_result", {}, data.sid);
    } catch {
      // resultado ya liberado
    }

    return { tables };
  });
