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
      address?: string;
      isMoving?: boolean;
    };
  }>;
};

/** Consulta pública con soporte para MULTI-UNIDAD en vivo */
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

    // 1. Preparar lista de unidades (Soporta enlace multi-unidad o unidad única)
    let rawUnits = link.unitsData && link.unitsData.length > 0
      ? link.unitsData
      : [
          {
            unitId: link.unitId,
            unitName: link.unitName,
            position: link.lastPosition ?? undefined,
          },
        ];

    // 2. Si el enlace está activo y hay sesión Wialon, consultar EN VIVO todas las unidades
    if (!isExpired && !isRevoked && link.sid) {
      rawUnits = await Promise.all(
        rawUnits.map(async (u) => {
          if (!u.unitId) return u;
          try {
            const itemRes = await wialonCall<{
              item?: {
                pos?: { y: number; x: number; s: number; c: number; t: number };
              };
            }>(
              link.host as WialonHost,
              "core/search_item",
              { id: u.unitId, flags: 0x401 },
              link.sid
            );

            const pos = itemRes.item?.pos;
            if (pos && typeof pos.y === "number" && typeof pos.x === "number") {
              const livePos = {
                lat: pos.y,
                lon: pos.x,
                speed: Math.round(pos.s ?? 0),
                course: Math.round(pos.c ?? 0),
                time: pos.t ?? Math.floor(now / 1000),
                address: u.position?.address || "En recorrido",
                isMoving: (pos.s ?? 0) > 3,
              };
              return { ...u, position: livePos };
            }
          } catch {
            // Si Wialon falla para esta unidad, conserva su última posición conocida
          }
          return u;
        })
      );

      // Guardar última posición conocida de la unidad principal en BD
      if (rawUnits[0]?.position) {
        await updateSharedUnitPosition(data.token, rawUnits[0].position);
      }
    }

    const mainPos = rawUnits[0]?.position ?? {
      lat: 0,
      lon: 0,
      speed: 0,
      course: 0,
      time: Math.floor(now / 1000),
      address: "Sin datos",
      isMoving: false,
    };

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
        lat: mainPos.lat,
        lon: mainPos.lon,
        speed: mainPos.speed ?? 0,
        course: mainPos.course ?? 0,
        time: mainPos.time ?? Math.floor(now / 1000),
        address: mainPos.address || "Coordenadas registradas",
        isMoving: (mainPos.speed ?? 0) > 3,
      },
      trail: link.trail ?? [
        {
          lat: mainPos.lat,
          lon: mainPos.lon,
          time: mainPos.time,
          speed: mainPos.speed,
        },
      ],
      unitsData: rawUnits,
    };
  });

export { getPublicUnitTracking as getPublicUnitShare };
