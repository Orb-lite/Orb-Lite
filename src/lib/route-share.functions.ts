import { createServerFn } from "@tanstack/react-start";
import type { StoredUserRoute } from "./wialon.functions";

const userRouteStore = new Map<string, StoredUserRoute>();

export const getUserRoutes = createServerFn({ method: "POST" })
  .validator((data: { userId?: string }) => data)
  .handler(async ({ data }) => {
    const routes = Array.from(userRouteStore.values()).filter(
      (r) => !data.userId || r.userId === data.userId
    );
    return { routes };
  });

export const saveUserRoute = createServerFn({ method: "POST" })
  .validator((data: Omit<StoredUserRoute, "id" | "createdAt"> & { id?: string }) => data)
  .handler(async ({ data }) => {
    const id = data.id || `route_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newRoute: StoredUserRoute = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    userRouteStore.set(id, newRoute);
    return { success: true, route: newRoute };
  });

export const deleteUserRoute = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const deleted = userRouteStore.delete(data.id);
    return { success: deleted };
  });

export const shareUserRoute = createServerFn({ method: "POST" })
  .validator((data: { routeId: string; recipientEmail: string }) => data)
  .handler(async ({ data }) => {
    const route = userRouteStore.get(data.routeId);
    if (!route) {
      throw new Error("La ruta no existe");
    }
    return { success: true, sharedWith: data.recipientEmail };
  });

export const getReportEmails = createServerFn({ method: "POST" })
  .validator((data: { routeId: string }) => data)
  .handler(async () => {
    return { emails: ["notificaciones@orb-lite.com"] };
  });
