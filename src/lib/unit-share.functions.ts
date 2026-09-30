import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  createSharedUnitLink,
  getSharedUnitLinks,
  getSharedUnitByToken,
  recordSharedUnitView,
  revokeSharedUnitLink,
  extendSharedUnitLink,
  deleteSharedUnitLink,
  updateSharedUnitPosition,
  type SharedUnitLink,
} from "./unit-share.server";
import { wialonCall, type WialonHost } from "./wialon.server";

export type { SharedUnitLink };

export type PublicUnitTracking = {
  token: string;
  unitName: string;
  clientName?: string | null;
  notes?: string | null;
  expiresAt: string;
  remainingSeconds: number;
  isExpired: boolean;
  isRevoked: boolean;
  status: "active" | "revoked" | "expired";
  position: {
    lat: number;
    lon: number;
    speed: number;
    course: number;
    time: number;
    address: string;
    isMoving: boolean;
  };
  trail: Array<{ lat: number; lon: number; time: number; speed?: number }>;
  unitsData?: Array<{
    unitId: number;
    unitName: string;
    position?: {
      lat: number;
      lon: number;
      speed?: number;
      course?: number;
      time?: number;
    };
  }>;
};

/** Crea un nuevo enlace temporal para compartir una unidad. */
export const createUnitShare = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        unitId: z.number().int(),
        unitName: z.string().trim().min(1).max(100),
        imei: z.string().trim().optional().nullable(),
        clientName: z.string().trim().max(100).optional().nullable(),
        clientPhone: z.string().trim().max(30).optional().nullable(),
        clientEmail: z
          .string()
          .trim()
          .email()
          .optional()
          .nullable()
          .or(z.literal("")),
        notes: z.string().trim().max(250).optional().nullable(),
        durationHours: z.number().min(0.5).max(876000).default(24),
        host: z.enum(["lite", "full"]).default("lite"),
        sid: z.string().optional().nullable(),
        initialPosition: z
          .object({
            lat: z.number(),
            lon: z.number(),
            speed: z.number().optional(),
            course: z.number().optional(),
            time: z.number().optional(),
            address: z.string().optional(),
          })
          .optional()
          .nullable(),
        unitsData: z
          .array(
            z.object({
              unitId: z.number(),
              unitName: z.string(),
              position: z
                .object({
                  lat: z.number(),
                  lon: z.number(),
                  speed: z.number().optional(),
                  course: z.number().optional(),
                  time: z.number().optional(),
                })
                .optional(),
            })
          )
          .optional(),
      })
      .parse(input)
  )
  .handler(async ({ data }) => {
    const link = await createSharedUnitLink({
      unitId: data.unitId,
      unitName: data.unitName,
      imei: data.imei,
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      clientEmail: data.clientEmail || null,
      notes: data.notes,
      durationHours: data.durationHours,
      host: data.host,
      sid: data.sid,
      initialPosition: data.initialPosition,
      unitsData: data.unitsData,
    });

    return {
      success: true,
      link,
      url: `/rastreo/${link.token}`,
    };
  });

/** Lista todos los enlaces temporales creados. */
export const listUnitShares = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        host: z.enum(["lite", "full"]).optional(),
        sid: z.string().optional(),
      })
      .optional()
      .default({})
      .parse(input)
  )
  .handler(async ({ data }) => {
    const links = await getSharedUnitLinks(data);
    return { links };
  });

/** Revoca / invalida un enlace temporal. */
export const revokeUnitShare = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().min(16) }).parse(input)
  )
  .handler(async ({ data }) => {
    const ok = await revokeSharedUnitLink(data.token);
    return { success: ok };
  });

/** Extiende la duración de un enlace temporal. */
export const extendUnitShare = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        token: z.string().min(16),
        hours: z.number().min(1).max(168),
      })
      .parse(input)
  )
  .handler(async ({ data }) => {
    const updated = await extendSharedUnitLink(data.token, data.hours);
    return { success: Boolean(updated), link: updated };
  });

/** Elimina un enlace temporal del historial. */
export const deleteUnitShare = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().min(16) }).parse(input)
  )
  .handler(async ({ data }) => {
    const ok = await deleteSharedUnitLink(data.token);
    return { success: ok };
  });

/**
 * Consulta pública de rastreo en vivo de una unidad compartida.
 * No requiere inicio de sesión.
 */
export const getPublicUnitTracking = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().min(16) }).parse(input)
  )
  .handler(async ({ data }): Promise<PublicUnitTracking> => {
    const link = await getSharedUnitByToken(data.token);
    if (!link) {
      throw new Error("El enlace de rastreo no existe o fue eliminado.");
    }

    await recordSharedUnitView(data.token);

    const now = Date.now();
    const expiryTime = new Date(link.expiresAt).getTime();
    const remainingSeconds = Math.max(0, Math.floor((expiryTime - now) / 1000));
    const isExpired = remainingSeconds <= 0 || link.status === "expired";
    const isRevoked = link.status === "revoked";

    let currentPos = link.lastPosition ?? {
      lat: 0.0,
      lon: -0.0,
      speed: 0,
      course: 0,
      time: Math.floor(now / 1000),
      address: "",
    };

    if (!isExpired && !isRevoked && link.sid && link.unitId) {
      try {
        const itemRes = await wialonCall<{
          item?: {
            pos?: { y: number; x: number; s: number; c: number; t: number };
          };
        }>(
          link.host as WialonHost,
          "core/search_item",
          { id: link.unitId, flags: 0x401 },
          link.sid
        );

        const pos = itemRes.item?.pos;
        if (pos && typeof pos.y === "number" && typeof pos.x === "number") {
          currentPos = {
            lat: pos.y,
            lon: pos.x,
            speed: Math.round(pos.s ?? 0),
            course: Math.round(pos.c ?? 0),
            time: pos.t ?? Math.floor(now / 1000),
            address: currentPos.address || "En recorrido",
          };
          await updateSharedUnitPosition(data.token, currentPos);
        }
      } catch {
        // Mantiene la última posición conocida en caso de fallo
      }
    }

    return {
      token: link.token,
      unitName: link.unitName,
      clientName: link.clientName,
      notes: link.notes,
      expiresAt: link.expiresAt,
      remainingSeconds,
      isExpired,
      isRevoked,
      status: isRevoked ? "revoked" : isExpired ? "expired" : "active",
      position: {
        lat: currentPos.lat,
        lon: currentPos.lon,
        speed: currentPos.speed,
        course: currentPos.course,
        time: currentPos.time,
        address: currentPos.address || "Coordenadas registradas",
        isMoving: (currentPos.speed ?? 0) > 3,
      },
      trail: link.trail ?? [
        {
          lat: currentPos.lat,
          lon: currentPos.lon,
          time: currentPos.time,
          speed: currentPos.speed,
        },
      ],
      unitsData: link.unitsData,
    };
  });

// Exporta también como alias para resolver cualquier importación legacy
export { getPublicUnitTracking as getPublicUnitShare };
