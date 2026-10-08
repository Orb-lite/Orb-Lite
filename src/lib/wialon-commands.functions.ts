import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { wialonCall, type WialonHost } from "@/lib/wialon.server";

const hostSchema = z.enum(["lite", "full"]);

export type WialonCommandLogEntry = {
  id: string;
  timestamp: string;
  unitId: number;
  unitName: string;
  brand: string;
  model: string;
  commandType: string;
  commandText: string;
  channel: "wialon_api" | "sms" | "gprs";
  status: "success" | "pending" | "sent_to_wialon" | "copied";
  resultMessage?: string;
};

// Log en memoria para el servidor
const commandLogs: WialonCommandLogEntry[] = [];

/** Envía un comando a la unidad utilizando el API remoto de Wialon */
export const wialonExecuteUnitCommand = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        host: hostSchema,
        sid: z.string().min(1),
        unitId: z.number().int().positive(),
        unitName: z.string(),
        brand: z.string(),
        model: z.string(),
        commandType: z.string(),
        commandText: z.string().min(1),
        linkType: z.enum(["", "tcp", "udp", "gsm"]).default(""),
        param: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const host = data.host as WialonHost;
    let wialonResponse: unknown = null;
    let success = false;
    let resultMessage = "";

    try {
      // Intento 1: Ejecutar comando directo via Wialon unit/exec_cmd
      wialonResponse = await wialonCall(
        host,
        "unit/exec_cmd",
        {
          itemId: data.unitId,
          commandName: "custom_msg",
          linkType: data.linkType || "",
          param: data.param || data.commandText,
          timeout: 45,
        },
        data.sid,
      );
      success = true;
      resultMessage = "Comando despachado con éxito a través del protocolo Wialon.";
    } catch (err: any) {
      // Si la unidad no tiene 'custom_msg' preconfigurado en Wialon, intentar con 'send_command' o enviar mensaje
      try {
        wialonResponse = await wialonCall(
          host,
          "unit/exec_cmd",
          {
            itemId: data.unitId,
            commandName: data.commandType,
            linkType: data.linkType || "",
            param: data.param || data.commandText,
            timeout: 45,
          },
          data.sid,
        );
        success = true;
        resultMessage = "Comando ejecutado exitosamente en Wialon.";
      } catch (err2: any) {
        // Guardamos el detalle del resultado
        const msg = err2?.message || err?.message || "No se pudo despachar por API de Wialon";
        resultMessage = `${msg}. Puedes enviar este comando por SMS directamente al número de la SIM.`;
        success = false;
      }
    }

    const logEntry: WialonCommandLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      unitId: data.unitId,
      unitName: data.unitName,
      brand: data.brand,
      model: data.model,
      commandType: data.commandType,
      commandText: data.commandText,
      channel: "wialon_api",
      status: success ? "sent_to_wialon" : "pending",
      resultMessage,
    };

    commandLogs.unshift(logEntry);
    if (commandLogs.length > 50) commandLogs.pop();

    return {
      success,
      resultMessage,
      logEntry,
      wialonResponse,
    };
  });

/** Obtiene el historial reciente de comandos enviados en el CRM */
export const getCrmCommandHistory = createServerFn({ method: "GET" }).handler(async () => {
  return { logs: commandLogs };
});

/** Registra una acción de copiado o despacho manual por SMS */
export const logManualCommandDispatch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        unitId: z.number().int().positive(),
        unitName: z.string(),
        brand: z.string(),
        model: z.string(),
        commandType: z.string(),
        commandText: z.string(),
        channel: z.enum(["sms", "gprs"]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const logEntry: WialonCommandLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      unitId: data.unitId,
      unitName: data.unitName,
      brand: data.brand,
      model: data.model,
      commandType: data.commandType,
      commandText: data.commandText,
      channel: data.channel,
      status: "copied",
      resultMessage: `Comando copiado para envío vía ${data.channel.toUpperCase()}.`,
    };

    commandLogs.unshift(logEntry);
    if (commandLogs.length > 50) commandLogs.pop();

    return { ok: true, logEntry };
  });
