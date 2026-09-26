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
    comment: string | null;
  }>;
  reportSent: boolean;
};

function toView(route: {
  name: string;
  origin?: string;
  stops?: SharedRouteStop[];
  reportSentAt?: string;
}): SharedRouteView {
  return {
    name: route.name,
    origin: route.origin ?? null,
    stops: (route.stops ?? []).map((stop) => ({
      label: stop.label,
      lat: stop.lat,
      lon: stop.lon,
      visitedAt: stop.visitedAt ?? null,
      comment: stop.comment ?? null,
    })),
    reportSent: Boolean(route.reportSentAt),
  };
}

/** Genera (o reutiliza) el enlace público de una ruta guardada del usuario. */
export const shareUserRoute = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        userId: z.number().int().positive(),
        routeId: z.string().min(1),
        reportEmail: z.string().trim().email().max(255).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { getUserRoutesFromStorage, setRouteShare, rememberReportEmail } =
      await import("./user-routes.server");
    const routes = await getUserRoutesFromStorage(data.userId);
    const route = routes.find((r) => r.id === data.routeId);
    if (!route) throw new Error("Ruta no encontrada.");

    if (data.reportEmail) await rememberReportEmail(data.userId, data.reportEmail);

    const token =
      route.shareToken && route.stops?.length
        ? route.shareToken
        : crypto.randomUUID().replaceAll("-", "");
    if (route.shareToken && route.stops?.length) {
      const saved = await setRouteShare(data.userId, data.routeId, token, route.stops, data.reportEmail);
      if (!saved) throw new Error("No se pudo generar el enlace.");
      return { token };
    }

    const labels = route.addresses ?? [];
    const stops: SharedRouteStop[] = route.points.map((point, index) => ({
      label:
        index === 0
          ? (route.origin ?? labels[0] ?? "Salida")
          : (labels[index] ?? `Parada ${index}`),
      lat: point.lat,
      lon: point.lon,
    }));
    const saved = await setRouteShare(data.userId, data.routeId, token, stops, data.reportEmail);
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
    const finished = await maybeSendReport(data.token);
    return toView(finished ?? route);
  });

/** Guarda el comentario del operador para una parada. */
export const commentSharedStop = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        token: z.string().min(16),
        stopIndex: z.number().int().min(0),
        comment: z.string().max(1000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { updateSharedRoute } = await import("./user-routes.server");
    const route = await updateSharedRoute(data.token, (r) => {
      const stop = r.stops?.[data.stopIndex];
      if (!stop) return false;
      const text = data.comment.trim();
      if (text) stop.comment = text;
      else delete stop.comment;
      return true;
    });
    if (!route) throw new Error("No se pudo guardar el comentario.");
    return toView(route);
  });

/** Correos usados antes por la cuenta para recibir reportes. */
export const getReportEmails = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ userId: z.number().int().positive() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { getSavedReportEmails } = await import("./user-routes.server");
    return { emails: await getSavedReportEmails(data.userId) };
  });

async function maybeSendReport(token: string) {
  const { getRouteByShareToken, updateSharedRoute } = await import(
    "./user-routes.server"
  );
  const route = await getRouteByShareToken(token);
  if (!route?.stops?.length || !route.reportEmail || route.reportSentAt) return null;
  if (!route.stops.every((s) => s.visitedAt)) return null;
  try {
    const { sendTemplateEmail } = await import("./email-templates/send-email");
    await sendTemplateEmail("reporte-visitas", route.reportEmail, {
      templateData: {
        routeName: route.name,
        stops: route.stops.map((s) => ({
          label: s.label,
          visitedAt: s.visitedAt ?? null,
          comment: s.comment ?? null,
        })),
      },
      idempotencyKey: `reporte-visitas-${token}-${route.stops.map((s) => s.visitedAt).join("|").length}-${route.stops[route.stops.length - 1]?.visitedAt ?? ""}`,
    });
    return await updateSharedRoute(token, (r) => {
      r.reportSentAt = new Date().toISOString();
      return true;
    });
  } catch (cause) {
    console.error("reporte-visitas", cause);
    return null;
  }
}
