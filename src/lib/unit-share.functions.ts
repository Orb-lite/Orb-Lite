'use server';

import { createServerFn } from "@tanstack/react-start";

export interface SharedUnitLink {
  id: string;
  token: string;
  unitName: string;
  clientName?: string | null;
  clientPhone?: string | null;
  notes?: string | null;
  status: "active" | "expired" | "revoked";
  expiresAt: string;
  viewCount?: number;
}

export const createUnitShare = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    return {
      link: {
        id: "1",
        token: "sample-token",
        unitName: (data.unitName as string) || "Unidad",
        status: "active" as const,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      } as SharedUnitLink,
    };
  });

export const listUnitShares = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { links: [] as SharedUnitLink[] };
  });

export const revokeUnitShare = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async () => {
    return { success: true };
  });

export const deleteUnitShare = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async () => {
    return { success: true };
  });

export const extendUnitShare = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { success: true };
  });

export const getPublicUnitTracking = createServerFn({ method: "GET" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    return {
      success: true,
      unit: {
        token: data.token,
        name: "Unidad Demo",
        lat: 0,
        lng: 0,
      },
    };
  });
