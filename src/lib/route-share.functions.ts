import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SharedRouteStop } from "./user-routes.server";

export type SharedRouteView = {
  name: string;
  origin: string | null;
  stops: Array<{
    label: string;
    lat: number;
    lon: number;
    visitedAt: string | null;
  }>;
};

function toView(route: {
  name: string;
  origin?: string;
  stops?: SharedRouteStop[];
}): SharedRouteView {
  return {
    name: route.name,
    origin: route.origin ?? null,
    stops: (route.stops ?? []).map((stop) => ({
      label: stop.label,
      lat: stop.lat,
      lon: stop.lon,
      visitedAt: stop.visitedAt ?? null,
    })),
  };
}

/** Genera (o reutiliza) el enlace público de una ruta guardada del usuario. */
export const shareUserRoute = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        userId: z.number().int().positive(),
        routeId: z.string().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { getUserRoutesFromStorage, setRouteShare } = await import(
      "./user-routes.server"
    );
    const routes = await getUserRoutesFromStorage(data.userId);
    const route = routes.find((r) => r.id === data.routeId);
    if (!route) throw new Error("Ruta no encontrada.");

    if (route.shareToken && route.stops?.length) {
      return { token: route.shareToken };
    }

    const token = crypto.randomUUID().replaceAll("-", "");
    const labels = route.addresses ?? [];
    const stops: SharedRouteStop[] = route.points.map((point, index) => ({
      label:
        index === 0
          ? (route.origin ?? labels[0] ?? "Salida")
          : (labels[index] ?? `Parada ${index}`),
      lat: point.lat,
      lon: point.lon,
    }));
    const saved = await setRouteShare(data.userId, data.routeId, token, stops);
    if (!saved) throw new Error("No se pudo generar el enlace.");
    return { token };
  });

/** Vista pública de una ruta compartida (sin iniciar sesión). */
export const getSharedRoute = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().min(16) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { getRouteByShareToken } = await import("./user-routes.server");
    const route = await getRouteByShareToken(data.token);
    if (!route || !route.stops?.length) {
      throw new Error("Este enlace de ruta no existe o fue eliminado.");
    }
    return toView(route);
  });

/** Marca o desmarca el check de visita de una parada (público, con el token). */
export const markSharedStopVisited = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        token: z.string().min(16),
        stopIndex: z.number().int().min(0),
        visited: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { markSharedStop } = await import("./user-routes.server");
    const route = await markSharedStop(
      data.token,
      data.stopIndex,
      data.visited,
    );
    if (!route) throw new Error("No se pudo actualizar la parada.");
    return toView(route);
  });
