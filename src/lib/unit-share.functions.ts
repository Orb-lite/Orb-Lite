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

export type PublicTrackedUnit = {
  unitId: number;
  unitName: string;
  imei?: string | null | undefined;
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

export type PublicUnitTracking = {
  token: string;
  unitName: string;
  units: PublicTrackedUnit[];
  clientName?: string | null | undefined;
  notes?: string | null | undefined;
  expiresAt: string;
  remainingSeconds: number;
  isExpired: boolean;
  isRevoked: boolean;
  isUnlimited: boolean;
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

/** Crea un nuevo enlace temporal para compartir una o varias unidades. */
export const createUnitShare = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        unitId: z.number().int().optional(),
        unitName: z.string().trim().min(1).max(100).optional(),
        imei: z.string().trim().optional().nullable(),
        units: z
          .array(
            z.object({
              unitId: z.number().int(),
              unitName: z.string().trim().min(1),
              imei: z.string().trim().optional().nullable(),
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
            }),
          )
          .optional(),
        clientName: z.string().trim().max(100).optional().nullable(),
        clientPhone: z.string().trim().max(30).optional().nullable(),
        clientEmail: z.string().trim().email().optional().nullable().or(z.literal("")),
        notes: z.string().trim().max(250).optional().nullable(),
        createdByUserId: z.number().int().optional().nullable(),
        createdByUsername: z.string().trim().optional().nullable(),
        durationHours: z.number().min(0).max(999999).default(24),
        isUnlimited: z.boolean().optional().default(false),
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
      units: data.units as any,
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      clientEmail: data.clientEmail || null,
      notes: data.notes,
      createdByUserId: data.createdByUserId ?? undefined,
      createdByUsername: data.createdByUsername ?? undefined,
      durationHours: data.isUnlimited ? 0 : data.durationHours,
      isUnlimited: data.isUnlimited || data.durationHours === 0,
      host: data.host,
      sid: data.sid,
      wialonToken: data.wialonToken,
      initialPosition: data.initialPosition as any,
    });

    return {
      success: true,
      link,
      url: `/rastreo/${link.token}`,
    };
  });

/** Lista todos los enlaces temporales creados según la jerarquía de cuentas. */
export const listUnitShares = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        host: z.enum(["lite", "full"]).optional(),
        sid: z.string().optional(),
        userId: z.number().int().optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const links = await getSharedUnitLinks({
      host: data.host,
      sid: data.sid,
      userId: data.userId,
    });
    return { links };
  });

/** Revoca / invalida un enlace temporal. */
export const revokeUnitShare = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ token: z.string().min(16) }).parse(input))
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
  .inputValidator((input: unknown) => z.object({ token: z.string().min(16) }).parse(input))
  .handler(async ({ data }) => {
    const ok = await deleteSharedUnitLink(data.token);
    return { success: ok };
  });

/**
 * Consulta pública de rastreo en vivo de una unidad compartida.
 * No requiere inicio de sesión.
 */
export const getPublicUnitTracking = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ token: z.string().min(16) }).parse(input))
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
    const isUnlimited = Boolean(link.isUnlimited || link.durationHours === 0);
    const expiryTime = new Date(link.expiresAt).getTime();
    const remainingSeconds = isUnlimited ? -1 : Math.max(0, Math.floor((expiryTime - now) / 1000));
    const isExpired = !isUnlimited && (remainingSeconds <= 0 || link.status === "expired");
    const isRevoked = link.status === "revoked";

    const currentPos = link.lastPosition ?? {
      lat: 20.6736,
      lon: -103.344,
      speed: 0,
      course: 0,
      time: Math.floor(now / 1000),
      address: "Zona Metropolitana de Guadalajara, Jal.",
    };

    const posTimestampMs = currentPos.time > 10000000000 ? currentPos.time : currentPos.time * 1000;
    const lastPingAgoSeconds = Math.max(0, Math.floor((now - posTimestampMs) / 1000));

    const unitsList: PublicTrackedUnit[] = (
      link.units && link.units.length > 0
        ? link.units
        : [
            {
              unitId: link.unitId,
              unitName: link.unitName,
              imei: link.imei,
              lastPosition: link.lastPosition,
              trail: link.trail,
            },
          ]
    ).map((u) => {
      const pos = u.lastPosition ?? currentPos;
      return {
        unitId: u.unitId,
        unitName: u.unitName,
        imei: u.imei,
        position: {
          lat: pos.lat,
          lon: pos.lon,
          speed: pos.speed ?? 0,
          course: pos.course ?? 0,
          time: pos.time ?? Math.floor(now / 1000),
          address: pos.address || "Coordenadas satelitales en vivo",
          isMoving: (pos.speed ?? 0) > 3,
        },
        trail:
          u.trail && u.trail.length > 0
            ? u.trail
            : [{ lat: pos.lat, lon: pos.lon, time: pos.time, speed: pos.speed }],
      };
    });

    const primaryUnit = unitsList[0] ?? {
      unitId: link.unitId,
      unitName: link.unitName,
      position: currentPos,
      trail: [],
    };

    return {
      token: link.token,
      unitName: link.unitName,
      units: unitsList,
      clientName: link.clientName,
      notes: link.notes,
      expiresAt: link.expiresAt,
      remainingSeconds,
      isExpired,
      isRevoked,
      isUnlimited,
      status: isRevoked ? "revoked" : isExpired ? "expired" : "active",
      isLive: !isExpired && !isRevoked,
      lastPingAgoSeconds,
      position: primaryUnit.position,
      trail: primaryUnit.trail,
    };
  });
