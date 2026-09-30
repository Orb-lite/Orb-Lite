'use server';

import { createServerFn } from "@tanstack/react-start";

// Tipos requeridos por la vista y las respuestas del servidor
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

// 1. Exportar createUnitShare
export const createUnitShare = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    // Lógica para crear el share
    return {
      link: {
        id: "1",
        token: "sample-token",
        unitName: (data.unitName as string) || "Unidad Desconocida",
        clientName: (data.clientName as string) || null,
        clientPhone: (data.clientPhone as string) || null,
        notes: (data.notes as string) || null,
        status: "active" as const,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        viewCount: 0,
      } as SharedUnitLink,
    };
  });

// 2. Exportar listUnitShares
export const listUnitShares = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    // Lógica para listar los shares
    return { links: [] as SharedUnitLink[] };
  });

// 3. Exportar revokeUnitShare
export const revokeUnitShare = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    // Lógica para revocar
    return { success: true };
  });

// 4. Exportar deleteUnitShare
export const deleteUnitShare = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    // Lógica para eliminar
    return { success: true };
  });

// 5. Exportar extendUnitShare
export const extendUnitShare = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    // Lógica para extender la vigencia
    return { success: true };
  });
