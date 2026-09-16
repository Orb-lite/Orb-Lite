import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { wialonCall, isSessionExpired, type WialonHost } from '@/lib/wialon.server'

const hostSchema = z.enum(['lite', 'full'])
const sessionSchema = z.object({ host: hostSchema, sid: z.string().min(1) })

export type WialonUnit = {
  id: number
  name: string
  lat: number | null
  lon: number | null
  speed: number | null
  course: number | null
  lastMessage: number | null
  online: boolean
}

export type WialonMessage = {
  time: number
  lat: number | null
  lon: number | null
  speed: number | null
  course: number | null
}

const ONLINE_WINDOW = 10 * 60

function normalizeUnit(item: {
  id: number
  nm?: string
  pos?: { y?: number; x?: number; s?: number; c?: number; t?: number } | null
  lmsg?: { t?: number } | null
}): WialonUnit {
  const pos = item.pos ?? null
  const last = pos?.t ?? item.lmsg?.t ?? null
  const now = Math.floor(Date.now() / 1000)
  return {
    id: item.id,
    name: item.nm ?? `Unidad ${item.id}`,
    lat: pos?.y ?? null,
    lon: pos?.x ?? null,
    speed: pos?.s ?? null,
    course: pos?.c ?? null,
    lastMessage: last,
    online: last != null && now - last <= ONLINE_WINDOW,
  }
}

/** Inicia sesión en Wialon con token o con usuario/contraseña del cliente. */
export const wialonLogin = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) =>
    z
      .object({
        host: hostSchema,
        mode: z.enum(['token', 'password']),
        token: z.string().trim().optional(),
        user: z.string().trim().optional(),
        password: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost
    let result: { eid?: string; user?: { id?: number; nm?: string } }

    if (data.mode === 'token') {
      if (!data.token) throw new Error('Captura tu token de acceso.')
      result = await wialonCall(host, 'token/login', { token: data.token, fl: 1 })
    } else {
      if (!data.user || !data.password) throw new Error('Captura tu usuario y contraseña.')
      result = await wialonCall(host, 'core/login', {
        user: data.user,
        password: data.password,
        operateAs: '',
        checkService: '',
      })
    }

    if (!result?.eid) throw new Error('No se pudo iniciar sesión en la plataforma.')

    return {
      sid: result.eid,
      host: data.host,
      userId: result.user?.id ?? 0,
      userName: result.user?.nm ?? data.user ?? 'Usuario',
    }
  })

export const wialonLogout = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      await wialonCall(data.host as WialonHost, 'core/logout', {}, data.sid)
    } catch {
      // sesión ya vencida
    }
    return { ok: true }
  })

/** Lista de unidades con su última posición conocida. */
export const wialonUnits = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const res = await wialonCall<{ items?: Array<Parameters<typeof normalizeUnit>[0]> }>(
      data.host as WialonHost,
      'core/search_items',
      {
        spec: {
          itemsType: 'avl_unit',
          propName: 'sys_name',
          propValueMask: '*',
          sortType: 'sys_name',
        },
        force: 1,
        flags: 1 + 1024,
        from: 0,
        to: 0,
      },
      data.sid,
    )
    return { units: (res.items ?? []).map(normalizeUnit) }
  })

/** Historial de mensajes/recorrido de una unidad en un intervalo. */
export const wialonHistory = createServerFn({ method: 'POST' })
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
    const host = data.host as WialonHost

    await wialonCall(
      host,
      'core/search_item',
      { id: data.unitId, flags: 1 + 1024 },
      data.sid,
    )

    const interval = await wialonCall<{ count?: number }>(
      host,
      'messages/load_interval',
      {
        itemId: data.unitId,
        timeFrom: data.timeFrom,
        timeTo: data.timeTo,
        flags: 0,
        flagsMask: 65281,
        loadCount: 4294967295,
      },
      data.sid,
    )

    const count = Math.min(interval.count ?? 0, 3000)
    let messages: WialonMessage[] = []

    if (count > 0) {
      const res = await wialonCall<
        Array<{ t?: number; pos?: { y?: number; x?: number; s?: number; c?: number } | null }>
      >(host, 'messages/get_messages', { indexFrom: 0, indexTo: count - 1 }, data.sid)

      messages = (Array.isArray(res) ? res : []).map((m) => ({
        time: m.t ?? 0,
        lat: m.pos?.y ?? null,
        lon: m.pos?.x ?? null,
        speed: m.pos?.s ?? null,
        course: m.pos?.c ?? null,
      }))
    }

    try {
      await wialonCall(host, 'messages/unload', {}, data.sid)
    } catch {
      // sin sesión de mensajes activa
    }

    const withPos = messages.filter((m) => m.lat != null && m.lon != null)
    const maxSpeed = withPos.reduce((acc, m) => Math.max(acc, m.speed ?? 0), 0)

    return { total: interval.count ?? 0, messages, maxSpeed, points: withPos.length }
  })

/** Datos base del CMS: cuentas/recursos, usuarios y unidades. */
export const wialonCmsOverview = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const host = data.host as WialonHost

    async function search(itemsType: string, flags: number) {
      const res = await wialonCall<{ items?: Array<{ id: number; nm?: string }> }>(
        host,
        'core/search_items',
        {
          spec: { itemsType, propName: 'sys_name', propValueMask: '*', sortType: 'sys_name' },
          force: 1,
          flags,
          from: 0,
          to: 0,
        },
        data.sid,
      )
      return (res.items ?? []).map((i) => ({ id: i.id, name: i.nm ?? `#${i.id}` }))
    }

    const [resources, users, units] = await Promise.all([
      search('avl_resource', 1),
      search('user', 1),
      search('avl_unit', 1),
    ])

    return { resources, users, units }
  })

/** Tipos de equipo disponibles para dar de alta unidades. */
export const wialonHwTypes = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => sessionSchema.extend({ search: z.string().trim().optional() }).parse(input))
  .handler(async ({ data }) => {
    const res = await wialonCall<Array<{ id: number; name: string }>>(
      data.host as WialonHost,
      'core/get_hw_types',
      {
        filterType: 'name',
        filterValue: [data.search ?? ''],
        includeType: true,
        ignoreRename: true,
      },
      data.sid,
    )
    const list = (Array.isArray(res) ? res : []).map((h) => ({ id: h.id, name: h.name }))
    return { types: list.slice(0, 400) }
  })

/** Alta de unidad (CMS). */
export const wialonCreateUnit = createServerFn({ method: 'POST' })
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
    const host = data.host as WialonHost
    const created = await wialonCall<{ item?: { id?: number; nm?: string } }>(
      host,
      'core/create_unit',
      { creatorId: data.creatorId, name: data.name, hwTypeId: data.hwTypeId, dataFlags: 1 },
      data.sid,
    )
    const id = created.item?.id
    if (!id) throw new Error('La unidad no se pudo crear.')

    if (data.uniqueId) {
      await wialonCall(
        host,
        'unit/update_device_type',
        { itemId: id, deviceTypeId: data.hwTypeId, uniqueId: data.uniqueId },
        data.sid,
      )
    }
    if (data.phone) {
      await wialonCall(host, 'unit/update_phone', { itemId: id, phoneNumber: data.phone }, data.sid)
    }

    return { id, name: created.item?.nm ?? data.name }
  })

/** Alta de usuario (CMS). */
export const wialonCreateUser = createServerFn({ method: 'POST' })
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
      'core/create_user',
      {
        creatorId: data.creatorId,
        name: data.name,
        password: data.password,
        dataFlags: 1,
      },
      data.sid,
    )
    const id = created.item?.id
    if (!id) throw new Error('El usuario no se pudo crear.')
    return { id, name: created.item?.nm ?? data.name }
  })

const ACCESS_MASKS = {
  consulta: 0x1 | 0x20,
  completo: 0x1 | 0x2 | 0x4 | 0x20 | 0x40 | 0x100 | 0x200 | 0x400,
} as const

export type WialonAccessLevel = keyof typeof ACCESS_MASKS

/** Permisos reales del usuario conectado: qué puede crear y cuánto le queda. */
export const wialonPermissions = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => sessionSchema.extend({ userId: z.number().int() }).parse(input))
  .handler(async ({ data }) => {
    const host = data.host as WialonHost

    let userFlags = 0
    try {
      const me = await wialonCall<{ item?: { fl?: number } }>(
        host,
        'core/search_item',
        { id: data.userId, flags: 1 },
        data.sid,
      )
      userFlags = me.item?.fl ?? 0
    } catch {
      userFlags = 0
    }

    type Account = {
      plan?: string
      enabled?: number
      services?: Record<string, { type?: number; val?: number; max?: number }>
    }

    let account: Account = {}
    try {
      account = await wialonCall<Account>(host, 'core/get_account_data', { type: 1 }, data.sid)
    } catch {
      account = {}
    }

    const services = account.services ?? {}
    const svcEnabled = (name: string) => {
      const svc = services[name]
      if (!svc) return null
      return (svc.val ?? 0) !== 0
    }

    const canCreateItems = (userFlags & 0x10) !== 0
    const unitsSvc = svcEnabled('create_unit')
    const usersSvc = svcEnabled('create_user')

    return {
      plan: account.plan ?? null,
      accountEnabled: (account.enabled ?? 1) !== 0,
      canCreateUnits: canCreateItems && unitsSvc !== false,
      canCreateUsers: canCreateItems && usersSvc !== false,
      canCreateItems,
      limits: {
        units: services['create_unit']?.max ?? null,
        users: services['create_user']?.max ?? null,
      },
    }
  })

/** Otorga acceso de un usuario a unidades específicas. */
export const wialonGrantUnits = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) =>
    sessionSchema
      .extend({
        userId: z.number().int().positive(),
        unitIds: z.array(z.number().int().positive()).max(200),
        level: z.enum(['consulta', 'completo']),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost
    const mask = ACCESS_MASKS[data.level as WialonAccessLevel]
    for (const unitId of data.unitIds) {
      await wialonCall(
        host,
        'user/update_item_access',
        { userId: data.userId, itemId: unitId, accessMask: mask },
        data.sid,
      )
    }
    return { granted: data.unitIds.length }
  })

/* ------------------------------------------------------------------ */
/* Sesión: verificación y mantenimiento (evita que expire por inactividad) */
/* ------------------------------------------------------------------ */

/** Mantiene viva la sesión y confirma si sigue siendo válida. */
export const wialonPing = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      await wialonCall(data.host as WialonHost, 'core/get_account_data', { type: 0 }, data.sid)
      return { valid: true as const }
    } catch (error) {
      if (isSessionExpired(error)) return { valid: false as const }
      throw error
    }
  })

/* ------------------------------------------------------------------ */
/* Detalle de unidad: sensores, últimos valores y comandos disponibles */
/* ------------------------------------------------------------------ */

export type WialonSensor = { id: number; name: string; type: string; metrics: string; value: string }

/** Detalle completo de una unidad: posición, sensores con su último valor y comandos. */
export const wialonUnitDetail = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) =>
    sessionSchema.extend({ unitId: z.number().int().positive() }).parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost

    const res = await wialonCall<{
      item?: {
        id: number
        nm?: string
        uid?: string
        ph?: string
        hw?: number
        pos?: { y?: number; x?: number; s?: number; c?: number; t?: number } | null
        lmsg?: { t?: number; p?: Record<string, unknown> } | null
        sens?: Record<string, { id: number; n?: string; t?: string; m?: string; p?: string }>
        cmds?: Record<string, { id: number; n?: string; c?: string; l?: string; p?: string }>
      }
    }>(
      host,
      'core/search_item',
      { id: data.unitId, flags: 1 + 256 + 512 + 1024 + 4096 },
      data.sid,
    )

    const item = res.item
    if (!item) throw new Error('La unidad no está disponible en tu cuenta.')

    const params = (item.lmsg?.p ?? {}) as Record<string, unknown>
    const sensors: WialonSensor[] = Object.values(item.sens ?? {}).map((s) => {
      const raw = s.p ? params[s.p] : undefined
      return {
        id: s.id,
        name: s.n ?? `Sensor ${s.id}`,
        type: s.t ?? '',
        metrics: s.m ?? '',
        value: raw == null ? '—' : String(raw),
      }
    })

    const commands = Object.values(item.cmds ?? {}).map((c) => ({
      id: c.id,
      name: c.n ?? `Comando ${c.id}`,
      type: c.c ?? '',
      link: c.l ?? 'auto',
    }))

    return {
      unit: normalizeUnit(item),
      uniqueId: item.uid ?? null,
      phone: item.ph ?? null,
      hwTypeId: item.hw ?? null,
      sensors,
      commands,
      params: Object.entries(params).map(([key, value]) => ({ key, value: String(value) })),
    }
  })

/** Ejecuta un comando en la unidad (bloqueo de motor, salidas, etc.). */
export const wialonSendCommand = createServerFn({ method: 'POST' })
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
      'unit/exec_cmd',
      {
        itemId: data.unitId,
        commandName: data.commandName,
        linkType: data.linkType ?? '',
        param: data.param ?? '',
        timeout: 60,
        flags: 0,
      },
      data.sid,
    )
    return { sent: true as const }
  })

/* ------------------------------------------------------------------ */
/* Geocercas y choferes                                               */
/* ------------------------------------------------------------------ */

export const wialonGeofences = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const host = data.host as WialonHost

    const resources = await wialonCall<{ items?: Array<{ id: number; nm?: string }> }>(
      host,
      'core/search_items',
      {
        spec: {
          itemsType: 'avl_resource',
          propName: 'sys_name',
          propValueMask: '*',
          sortType: 'sys_name',
        },
        force: 1,
        flags: 1 + 4096,
        from: 0,
        to: 0,
      },
      data.sid,
    )

    const zones: Array<{ id: number; name: string; resource: string; type: number }> = []
    for (const resource of resources.items ?? []) {
      try {
        const res = await wialonCall<Array<{ id: number; n?: string; t?: number }>>(
          host,
          'resource/get_zone_data',
          { itemId: resource.id, col: [], flags: 1 },
          data.sid,
        )
        for (const zone of Array.isArray(res) ? res : []) {
          zones.push({
            id: zone.id,
            name: zone.n ?? `Zona ${zone.id}`,
            resource: resource.nm ?? `#${resource.id}`,
            type: zone.t ?? 0,
          })
        }
      } catch {
        // recurso sin geocercas o sin permisos de lectura
      }
    }

    return { zones }
  })

export const wialonDrivers = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const host = data.host as WialonHost

    const resources = await wialonCall<{
      items?: Array<{
        id: number
        nm?: string
        drvrs?: Record<string, { id: number; n?: string; ds?: string; p?: string }>
      }>
    }>(
      host,
      'core/search_items',
      {
        spec: {
          itemsType: 'avl_resource',
          propName: 'sys_name',
          propValueMask: '*',
          sortType: 'sys_name',
        },
        force: 1,
        flags: 1 + 256,
        from: 0,
        to: 0,
      },
      data.sid,
    )

    const drivers: Array<{ id: number; name: string; phone: string | null; resource: string }> = []
    for (const resource of resources.items ?? []) {
      for (const driver of Object.values(resource.drvrs ?? {})) {
        drivers.push({
          id: driver.id,
          name: driver.n ?? `Chofer ${driver.id}`,
          phone: driver.p ?? null,
          resource: resource.nm ?? `#${resource.id}`,
        })
      }
    }

    return { drivers }
  })

/** Datos de la cuenta conectada: plan, servicios y saldo de días. */
export const wialonAccount = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const account = await wialonCall<{
      plan?: string
      enabled?: number
      balance?: string
      daysCounter?: number
      created?: number
      services?: Record<string, { val?: number; max?: number }>
    }>(data.host as WialonHost, 'core/get_account_data', { type: 1 }, data.sid)

    return {
      plan: account.plan ?? null,
      enabled: (account.enabled ?? 1) !== 0,
      balance: account.balance ?? null,
      daysLeft: account.daysCounter ?? null,
      createdAt: account.created ?? null,
    }
  })

/** Renombra una unidad existente. */
export const wialonRenameUnit = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) =>
    sessionSchema
      .extend({ unitId: z.number().int().positive(), name: z.string().trim().min(4).max(60) })
      .parse(input),
  )
  .handler(async ({ data }) => {
    await wialonCall(
      data.host as WialonHost,
      'item/update_name',
      { itemId: data.unitId, name: data.name },
      data.sid,
    )
    return { ok: true as const }
  })
