import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { wialonCall, WialonError, type WialonHost } from "@/lib/wialon.server";

const hostSchema = z.enum(["lite", "full"]);

export interface WialonUnitCommand {
  id: number;
  name: string; // n
  type: string; // c ("custom_msg", "output_on", "output_off", etc.)
  linkType: string; // l ("tcp", "udp", "gsm", "auto")
  param: string; // p (e.g. " cpureset", " setdigout 1", etc.)
  description: string; // d
  access?: number; // a
  flags?: number; // f
}

export interface TeltonikaCommandPreset {
  id: string;
  name: string;
  commandType: "custom_msg" | "output_on" | "output_off";
  linkType: "tcp";
  param: string;
  description: string;
  category: "control" | "diagnostics" | "config" | "system";
  isDangerous?: boolean;
}

export interface TcpCommandLogEntry {
  id: string;
  timestamp: string;
  unitId: number;
  unitName: string;
  commandName: string;
  commandType: string;
  linkType: string;
  param: string;
  status: "success" | "error" | "pending";
  resultMessage: string;
}

// Historial en memoria de ejecuciones de comandos TCP
const recentTcpLogs: TcpCommandLogEntry[] = [];

/** Catálogo oficial de comandos TCP preconfigurados para Teltonika (FMB965, FMB920, FMC130, etc.) */
export const TELTONIKA_COMMAND_PRESETS: TeltonikaCommandPreset[] = [
  {
    id: "reboot",
    name: "Reinicio GPS (Reboot)",
    commandType: "custom_msg",
    linkType: "tcp",
    param: " cpureset",
    description: "Reinicia la CPU del Teltonika sin borrar búfer ni configuraciones",
    category: "system",
  },
  {
    id: "corte_motor",
    name: "Paro de Motor (Corte)",
    commandType: "custom_msg",
    linkType: "tcp",
    param: " setdigout 1",
    description: "Activa salida digital 1 (DOUT1) cortando el circuito de encendido",
    category: "control",
    isDangerous: true,
  },
  {
    id: "restaurar_motor",
    name: "Restaurar Motor",
    commandType: "custom_msg",
    linkType: "tcp",
    param: " setdigout 0",
    description: "Desactiva salida digital 1 (DOUT1) permitiendo el encendido normal",
    category: "control",
  },
  {
    id: "ping",
    name: "Ping de Enlace",
    commandType: "custom_msg",
    linkType: "tcp",
    param: " ping",
    description: "Comprueba conectividad y verifica socket TCP activo",
    category: "diagnostics",
  },
  {
    id: "output_on",
    name: "Paro Nativo Wialon (Output 1)",
    commandType: "output_on",
    linkType: "tcp",
    param: "1",
    description: "Comando nativo Wialon para activar salida DOUT1",
    category: "control",
    isDangerous: true,
  },
  {
    id: "output_off",
    name: "Restaurar Nativo Wialon (Output 1)",
    commandType: "output_off",
    linkType: "tcp",
    param: "1",
    description: "Comando nativo Wialon para desactivar salida DOUT1",
    category: "control",
  },
  {
    id: "getstatus",
    name: "Estado General (Status)",
    commandType: "custom_msg",
    linkType: "tcp",
    param: " getstatus",
    description: "Retorna señal GSM, satélites y estado de batería",
    category: "diagnostics",
  },
  {
    id: "getgps",
    name: "Consultar Coordenadas (GPS)",
    commandType: "custom_msg",
    linkType: "tcp",
    param: " getgps",
    description: "Solicita posición actual por satélite y velocidad",
    category: "diagnostics",
  },
  {
    id: "getver",
    name: "Versión Firmware & Módem",
    commandType: "custom_msg",
    linkType: "tcp",
    param: " getver",
    description: "Retorna versión de firmware y módem LTE",
    category: "diagnostics",
  },
  {
    id: "corte_temporal_60",
    name: "Paro Temporal (60s)",
    commandType: "custom_msg",
    linkType: "tcp",
    param: " setdigout 1 60",
    description: "Corta el motor temporalmente por 60 segundos con reactivación automática",
    category: "control",
    isDangerous: true,
  },
  {
    id: "getparam_apn",
    name: "Consultar Parámetro APN",
    commandType: "custom_msg",
    linkType: "tcp",
    param: " getparam 2001",
    description: "Consulta el APN de datos configurado en el equipo Teltonika",
    category: "config",
  },
  {
    id: "setparam_apn",
    name: "Configurar APN Telcel",
    commandType: "custom_msg",
    linkType: "tcp",
    param: " setparam 2001:internet.itelcel.com",
    description: "Configura APN de datos en el parámetro 2001 de Teltonika",
    category: "config",
  },
  {
    id: "dout2_on",
    name: "Activar Salida DOUT2 (Sirena/Alarma)",
    commandType: "custom_msg",
    linkType: "tcp",
    param: " setdigout ? 1",
    description: "Activa salida digital 2 para periféricos secundarios",
    category: "control",
  },
  {
    id: "dout2_off",
    name: "Desactivar Salida DOUT2",
    commandType: "custom_msg",
    linkType: "tcp",
    param: " setdigout ? 0",
    description: "Desactiva salida digital 2",
    category: "control",
  },
];

/** Obtiene la lista completa de comandos registrados en Wialon para un equipo específico */
export const wialonGetUnitCommands = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        host: hostSchema,
        sid: z.string().min(1),
        unitId: z.number().int().positive(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;
    // Flags en Wialon:
    // 1 (base), 256 (propiedades avanzadas), 512 (cmds activos disponibles), 1024 (último mensaje y pos),
    // 524288 (0x00080000: listado completo de definiciones de comandos guardados -> item.cml)
    const res = await wialonCall<{
      item?: {
        id: number;
        nm: string;
        hw?: string | number;
        uid?: string;
        cmds?:
          | Array<{ id?: number; n?: string; c?: string; l?: string; p?: string; d?: string; a?: number; f?: number }>
          | Record<string, { id?: number; n?: string; c?: string; l?: string; p?: string; d?: string; a?: number; f?: number }>;
        cml?: Record<
          string,
          { id: number; n?: string; c?: string; l?: string; p?: string; d?: string; a?: number; f?: number }
        >;
      };
    }>(
      host,
      "core/search_item",
      { id: data.unitId, flags: 1 + 256 + 512 + 1024 + 524288 },
      data.sid,
    );

    const item = res.item;
    if (!item) throw new Error("La unidad no fue encontrada en la plataforma Wialon.");

    const commandMap = new Map<string, WialonUnitCommand>();

    // 1. Mapear comandos guardados permanentemente desde item.cml (Flag 0x80000)
    if (item.cml && typeof item.cml === "object") {
      for (const [key, c] of Object.entries(item.cml)) {
        if (!c) continue;
        const id = Number(c.id || key);
        const name = (c.n || `Comando ${id}`).trim();
        commandMap.set(name.toLowerCase(), {
          id,
          name,
          type: c.c || "custom_msg",
          linkType: c.l || "tcp",
          param: c.p || "",
          description: c.d || "",
          access: c.a ?? 0,
          flags: c.f ?? 0,
        });
      }
    }

    // 2. Mapear comandos activos desde item.cmds (Flag 0x200)
    const rawCmds = item.cmds
      ? Array.isArray(item.cmds)
        ? item.cmds
        : Object.values(item.cmds)
      : [];

    for (const c of rawCmds) {
      if (!c) continue;
      const id = Number(c.id || 0);
      const name = (c.n || `Comando ${id || commandMap.size + 1}`).trim();
      const normName = name.toLowerCase();
      if (!commandMap.has(normName)) {
        commandMap.set(normName, {
          id: id || commandMap.size + 1,
          name,
          type: c.c || "custom_msg",
          linkType: c.l || "tcp",
          param: c.p || "",
          description: c.d || "",
          access: c.a ?? 0,
          flags: c.f ?? 0,
        });
      }
    }

    const commands: WialonUnitCommand[] = Array.from(commandMap.values());

    return {
      unitId: item.id,
      unitName: item.nm,
      hardware: item.hw ? String(item.hw) : null,
      uniqueId: item.uid || null,
      commands,
    };
  });

/** Registra o actualiza un comando custom via TCP directamente en Wialon (item.cmds) */
export const wialonSaveUnitCommand = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        host: hostSchema,
        sid: z.string().min(1),
        unitId: z.number().int().positive(),
        commandId: z.number().int().optional().default(0), // 0 crea nuevo, >0 actualiza existente
        name: z.string().trim().min(1, "El nombre del comando es obligatorio").max(100),
        commandType: z.string().trim().default("custom_msg"),
        linkType: z.string().trim().default("tcp"),
        param: z.string().default(""),
        description: z.string().trim().max(300).optional().default(""),
        access: z.number().int().optional().default(0),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;
    const isUpdate = Boolean(data.commandId && data.commandId > 0);
    const callMode = isUpdate ? "update" : "create";

    // Si es Teltonika y el comando es custom_msg de texto y no tiene espacio inicial ni password,
    // Teltonika en Wialon requiere que inicie con espacio si no tiene password de comando
    let finalParam = data.param;
    if (
      data.commandType === "custom_msg" &&
      finalParam.length > 0 &&
      !finalParam.startsWith(" ") &&
      !finalParam.includes("=") &&
      (finalParam.startsWith("setdigout") ||
        finalParam.startsWith("cpureset") ||
        finalParam.startsWith("getstatus") ||
        finalParam.startsWith("getgps") ||
        finalParam.startsWith("getver") ||
        finalParam.startsWith("ping") ||
        finalParam.startsWith("getparam") ||
        finalParam.startsWith("setparam"))
    ) {
      finalParam = ` ${finalParam}`;
    }

    const payload = {
      itemId: data.unitId,
      id: isUpdate ? data.commandId : 0,
      n: data.name.trim(),
      c: data.commandType,
      l: data.linkType || "tcp",
      p: finalParam,
      a: data.access ?? 0,
      f: 0,
      callMode,
    };

    let res: any;
    try {
      res = await wialonCall<any>(
        host,
        "unit/update_command_definition",
        payload,
        data.sid,
      );
    } catch (err: any) {
      // Si el equipo o protocolo rechaza "tcp" explícito (error 4), intentar con canal automático ("")
      if (err instanceof WialonError && err.code === 4 && payload.l !== "") {
        payload.l = "";
        res = await wialonCall<any>(
          host,
          "unit/update_command_definition",
          payload,
          data.sid,
        );
      } else {
        throw err;
      }
    }

    const createdId = Array.isArray(res)
      ? typeof res[0] === "object" && res[0] !== null
        ? res[0].id
        : typeof res[0] === "number"
          ? res[0]
          : typeof res[1] === "object" && res[1] !== null
            ? res[1].id
            : data.commandId || 1
      : res?.id || data.commandId || 1;

    return {
      success: true,
      mode: callMode,
      result: res,
      command: {
        id: createdId,
        name: data.name,
        type: data.commandType,
        linkType: data.linkType || "tcp",
        param: finalParam,
        description: data.description,
      },
    };
  });

/** Elimina un comando registrado en Wialon */
export const wialonDeleteUnitCommand = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        host: hostSchema,
        sid: z.string().min(1),
        unitId: z.number().int().positive(),
        commandId: z.number().int().positive(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;
    await wialonCall(
      host,
      "unit/update_command_definition",
      {
        itemId: data.unitId,
        id: data.commandId,
        callMode: "delete",
      },
      data.sid,
    );

    return { success: true };
  });

/** Registra en lote los comandos estándar de Teltonika en la unidad en Wialon */
export const wialonBatchAddTeltonikaCommands = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        host: hostSchema,
        sid: z.string().min(1),
        unitId: z.number().int().positive(),
        presetIds: z.array(z.string()).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;

    // 1. Consultar comandos existentes para no duplicar por nombre
    const searchRes = await wialonCall<{
      item?: {
        cmds?:
          | Array<{ id?: number; n?: string }>
          | Record<string, { id?: number; n?: string }>;
        cml?: Record<string, { id?: number; n?: string }>;
      };
    }>(host, "core/search_item", { id: data.unitId, flags: 1 + 512 + 524288 }, data.sid);

    const existingNames = new Set<string>();
    if (searchRes.item?.cml && typeof searchRes.item.cml === "object") {
      for (const c of Object.values(searchRes.item.cml)) {
        if (c?.n) existingNames.add(c.n.trim().toLowerCase());
      }
    }
    const rawExistingCmds = searchRes.item?.cmds
      ? Array.isArray(searchRes.item.cmds)
        ? searchRes.item.cmds
        : Object.values(searchRes.item.cmds)
      : [];
    for (const c of rawExistingCmds) {
      if (c?.n) existingNames.add(c.n.trim().toLowerCase());
    }

    const presetsToApply = data.presetIds && data.presetIds.length > 0
      ? TELTONIKA_COMMAND_PRESETS.filter((p) => data.presetIds!.includes(p.id))
      : TELTONIKA_COMMAND_PRESETS;

    let addedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    for (const preset of presetsToApply) {
      if (existingNames.has(preset.name.trim().toLowerCase())) {
        skippedCount++;
        continue;
      }

      try {
        const cmdPayload = {
          itemId: data.unitId,
          id: 0,
          n: preset.name,
          c: preset.commandType,
          l: preset.linkType,
          p: preset.param,
          a: 0,
          f: 0,
          callMode: "create",
        };
        try {
          await wialonCall(host, "unit/update_command_definition", cmdPayload, data.sid);
        } catch (callErr: any) {
          if (callErr instanceof WialonError && callErr.code === 4) {
            cmdPayload.l = "";
            await wialonCall(host, "unit/update_command_definition", cmdPayload, data.sid);
          } else {
            throw callErr;
          }
        }
        addedCount++;
        existingNames.add(preset.name.trim().toLowerCase());
      } catch (err: any) {
        errors.push(`${preset.name}: ${err?.message || "Error al registrar"}`);
      }
    }

    return {
      success: true,
      addedCount,
      skippedCount,
      totalProcessed: presetsToApply.length,
      errors,
    };
  });

/** Ejecuta un comando en la unidad vía canal TCP utilizando unit/exec_cmd */
export const wialonSendTcpCommand = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        host: hostSchema,
        sid: z.string().min(1),
        unitId: z.number().int().positive(),
        unitName: z.string().optional().default("Unidad"),
        commandName: z.string().trim().min(1),
        commandType: z.string().optional().default("custom_msg"),
        linkType: z.string().optional().default("tcp"),
        param: z.string().optional().default(""),
        timeout: z.number().int().min(5).max(300).optional().default(60),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;
    let success = false;
    let resultMessage = "";
    let rawResponse: unknown = null;

    try {
      // Despacho primario vía linkType TCP especificado
      rawResponse = await wialonCall(
        host,
        "unit/exec_cmd",
        {
          itemId: data.unitId,
          commandName: data.commandName,
          linkType: data.linkType || "tcp",
          param: data.param ?? "",
          timeout: data.timeout ?? 60,
          flags: 0,
        },
        data.sid,
      );
      success = true;
      resultMessage = `Comando "${data.commandName}" enviado con éxito vía TCP al equipo.`;
    } catch (err: any) {
      // Si falla con el nombre custom, intentar fallback con "custom_msg" si aplica
      try {
        rawResponse = await wialonCall(
          host,
          "unit/exec_cmd",
          {
            itemId: data.unitId,
            commandName: "custom_msg",
            linkType: data.linkType || "tcp",
            param: data.param ?? "",
            timeout: data.timeout ?? 60,
            flags: 0,
          },
          data.sid,
        );
        success = true;
        resultMessage = `Comando ejecutado vía TCP como custom_msg (${data.commandName}).`;
      } catch (err2: any) {
        success = false;
        resultMessage =
          err?.message || err2?.message || "Error al enviar comando por TCP a la unidad.";
      }
    }

    const logEntry: TcpCommandLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      unitId: data.unitId,
      unitName: data.unitName,
      commandName: data.commandName,
      commandType: data.commandType,
      linkType: data.linkType || "tcp",
      param: data.param || "—",
      status: success ? "success" : "error",
      resultMessage,
    };

    recentTcpLogs.unshift(logEntry);
    if (recentTcpLogs.length > 50) recentTcpLogs.pop();

    return {
      success,
      resultMessage,
      logEntry,
      rawResponse,
    };
  });

/** Consulta el historial reciente de comandos TCP despachados */
export const wialonGetRecentTcpLogs = createServerFn({ method: "GET" }).handler(async () => {
  return { logs: recentTcpLogs };
});
