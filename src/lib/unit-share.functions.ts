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
  refreshSharedUnitLivePosition,
  type SharedUnitLink,
} from "./unit-share.server";

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
  isLive: boolean;
  lastPingAgoSeconds: number;
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
        clientEmail: z.string().trim().email().optional().nullable().or(z.literal("")),
        notes: z.string().trim().max(250).optional().nullable(),
        durationHours: z.number().min(0.5).max(720).default(24),
        host: z.enum(["lite", "full"]).default("lite"),
        sid: z.string().optional().nullable(),
        wialonToken: z.string().optional().nullable(),
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
      })
      .parse(input),
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
      wialonToken: data.wialonToken,
      initialPosition: data.initialPosition,
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
      .default({}),
  )
  .handler(async ({ data }) => {
    const links = await getSharedUnitLinks(data);
    return { links };
  });

/** Revoca / invalida un enlace temporal. */
export const revokeUnitShare = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().min(16) }).parse(input),
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
      .parse(input),
  )
  .handler(async ({ data }) => {
    const updated = await extendSharedUnitLink(data.token, data.hours);
    return { success: Boolean(updated), link: updated };
  });

/** Elimina un enlace temporal del historial. */
export const deleteUnitShare = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().min(16) }).parse(input),
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
    z.object({ token: z.string().min(16) }).parse(input),
  )
  .handler(async ({ data }): Promise<PublicUnitTracking> => {
    // 1. Refrescar posición en vivo desde Wialon
    const refreshed = await refreshSharedUnitLivePosition(data.token);
    const link = refreshed ?? (await getSharedUnitByToken(data.token));

    if (!link) {
      throw new Error("El enlace de rastreo no existe o fue eliminado.");
    }

    // 2. Registrar visita
    await recordSharedUnitView(data.token);

    const now = Date.now();
    const expiryTime = new Date(link.expiresAt).getTime();
    const remainingSeconds = Math.max(0, Math.floor((expiryTime - now) / 1000));
    const isExpired = remainingSeconds <= 0 || link.status === "expired";
    const isRevoked = link.status === "revoked";

    const currentPos = link.lastPosition ?? {
      lat: 20.6736,
      lon: -103.3440,
      speed: 0,
      course: 0,
      time: Math.floor(now / 1000),
      address: "Zona Metropolitana de Guadalajara, Jal.",
    };

    const posTimestampMs = currentPos.time > 10000000000 ? currentPos.time : currentPos.time * 1000;
    const lastPingAgoSeconds = Math.max(0, Math.floor((now - posTimestampMs) / 1000));

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
      isLive: !isExpired && !isRevoked,
      lastPingAgoSeconds,
      position: {
        lat: currentPos.lat,
        lon: currentPos.lon,
        speed: currentPos.speed,
        course: currentPos.course,
        time: currentPos.time,
        address: currentPos.address || "Coordenadas satelitales en vivo",
        isMoving: (currentPos.speed ?? 0) > 3,
      },
      trail: link.trail && link.trail.length > 0 ? link.trail : [
        {
          lat: currentPos.lat,
          lon: currentPos.lon,
          time: currentPos.time,
          speed: currentPos.speed,
        },
      ],
    };
  });

