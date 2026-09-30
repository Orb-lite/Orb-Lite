'use server';

import { createServerFn } from "@tanstack/react-start";

// --- WIALON CORE / AUTH / UNITS / SESSION ---
export const wialonLogin = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    return { success: true, token: "sample-token", user: data };
  });

export const wialonLogout = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { success: true };
  });

export const wialonPing = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { active: true };
  });

export const wialonUnits = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { units: [] };
  });

export const wialonUnitDetail = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { unit: null };
  });

export const wialonSendCommand = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { success: true };
  });

export const wialonHistory = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { history: [] };
  });

// --- REPORTES ---
export const wialonExecReport = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { success: true, result: {} };
  });

export const wialonReportData = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { data: [] };
  });

export const wialonReportTemplates = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { templates: [] };
  });

// --- VIDEO ---
export const wialonVideoSettings = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { settings: {} };
  });

export const wialonVideoUnits = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { units: [] };
  });

// --- GEOCERCAS ---
export const wialonCreateGeofence = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    return { success: true, geofence: data };
  });

export const wialonDeleteGeofence = createServerFn({ method: "POST" })
  .validator((data: { id: string | number }) => data)
  .handler(async () => {
    return { success: true };
  });

export const wialonGeofences = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { geofences: [] };
  });

// --- RUTAS Y LOGÍSTICA ---
export const getUserRoutes = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { routes: [] };
  });

export const saveUserRoute = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    return { success: true, route: data };
  });

export const deleteUserRoute = createServerFn({ method: "POST" })
  .validator((data: { id: string | number }) => data)
  .handler(async () => {
    return { success: true };
  });

export const wialonCreateRoute = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    return { success: true, route: data };
  });

export const wialonGeocodeAddresses = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { addresses: [] };
  });

export const wialonPlanRoute = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { plan: {} };
  });

export const wialonLogisticsRoutes = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { routes: [] };
  });
