'use server';

import { createServerFn } from "@tanstack/react-start";

export const wialonLogin = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async ({ data }) => {
    const sid = String(data?.sid || data?.token || data?.eid || "demo_sid_12345");
    const host = (data?.host as "lite" | "full") || "full";
    const userId = Number(data?.userId || data?.id || 1);
    const userName = String(data?.userName || data?.user || data?.nm || "Usuario Wialon");

    return {
      success: true,
      authenticated: true,
      sid,
      host,
      userId,
      userName,
      session: { sid, host, userId, userName },
      token: sid,
      access_token: sid,
      eid: sid,
      user: { id: userId, name: userName }
    };
  });

export const wialonLogout = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { success: true };
  });

export const wialonPing = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { active: true, authenticated: true, status: "ok" };
  });

export const wialonUnits = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { units: [], items: [], total: 0 };
  });

export const wialonUnitDetail = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { unit: { id: 0, name: "" } };
  });

export const wialonSendCommand = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { success: true };
  });

export const wialonHistory = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { history: [], items: [], total: 0 };
  });

export const wialonExecReport = createServerFn({ method: "POST" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { success: true, result: {} };
  });

export const wialonReportData = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { data: [], rows: [], total: 0 };
  });

export const wialonReportTemplates = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { templates: [], items: [], total: 0 };
  });

export const wialonVideoSettings = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { settings: {} };
  });

export const wialonVideoUnits = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { units: [], items: [], total: 0 };
  });

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
    return { geofences: [], items: [], total: 0 };
  });

export const getUserRoutes = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => data)
  .handler(async () => {
    return { routes: [], items: [], total: 0 };
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
    return { routes: [], items: [], total: 0 };
  });