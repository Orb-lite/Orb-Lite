import { createServerFn } from "@tanstack/react-start";
import type { StoredUserRoute } from "./wialon.functions";

export interface SharedRouteData extends StoredUserRoute {
  token?: string;
  visitedStops?: string[];
  comments?: Record<string, string>;
  isFinished?: boolean;
}

const userRouteStore = new Map<string, StoredUserRoute>();
const sharedRouteStore = new Map<string, SharedRouteData>();

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
    const token = `token_${data.routeId}_${Date.now()}`;
    const sharedData: SharedRouteData = {
      ...route,
      token,
      visitedStops: [],
      comments: {},
      isFinished: false,
    };
    sharedRouteStore.set(token, sharedData);
    return { success: true, sharedWith: data.recipientEmail, token };
  });

export const getReportEmails = createServerFn({ method: "POST" })
  .validator((data: { routeId: string }) => data)
  .handler(async () => {
    return { emails: ["notificaciones@orb-lite.com"] };
  });

export const getSharedRoute = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const route = sharedRouteStore.get(data.token);
    if (!route) {
      throw new Error("Ruta compartida no encontrada o expirada");
    }
    return { route };
  });

export const markSharedStopVisited = createServerFn({ method: "POST" })
  .validator((data: { token: string; stopId: string }) => data)
  .handler(async ({ data }) => {
    const route = sharedRouteStore.get(data.token);
    if (!route) {
      throw new Error("Ruta no encontrada");
    }
    const visited = route.visitedStops || [];
    if (!visited.includes(data.stopId)) {
      visited.push(data.stopId);
    }
    route.visitedStops = visited;
    sharedRouteStore.set(data.token, route);
    return { success: true, visitedStops: route.visitedStops };
  });

export const commentSharedStop = createServerFn({ method: "POST" })
  .validator((data: { token: string; stopId: string; comment: string }) => data)
  .handler(async ({ data }) => {
    const route = sharedRouteStore.get(data.token);
    if (!route) {
      throw new Error("Ruta no encontrada");
    }
    route.comments = route.comments || {};
    route.comments[data.stopId] = data.comment;
    sharedRouteStore.set(data.token, route);
    return { success: true, comments: route.comments };
  });

export const finishSharedRoute = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const route = sharedRouteStore.get(data.token);
    if (!route) {
      throw new Error("Ruta no encontrada");
    }
    route.isFinished = true;
    sharedRouteStore.set(data.token, route);
    return { success: true, isFinished: true };
  });
