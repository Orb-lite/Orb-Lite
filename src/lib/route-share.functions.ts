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
    contact: boolean | null;
    checkDistance: number | null;
  }>;
  path: Array<{ lat: number; lon: number }>;
  reportSent: boolean;
};

/** Distancia máxima (m) para aceptar el check de una parada. */
export const CHECK_RADIUS_METERS = 300;

function distanceMeters(aLat: number, aLon: number, bLat: number, bLon: number) {
  const r = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(h));
}

function toView(route: {
  name: string;
  points?: Array<{ lat: number; lon: number }>;
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
      contact: stop.contact ?? null,
      checkDistance: stop.checkDistance ?? null,
    })),
    path: (route.points ?? []).map((p) => ({ lat: p.lat, lon: p.lon })),
    reportSent: Boolean(route.reportSentAt),
  };
}

/** Genera (o reutiliza) el enlace público de una ruta guardada del usuario. */
export const shareUserRoute = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        userId: z.number().int().nonnegative(),
        routeId: z.string().min(1),
        reportEmail: z.string().trim().email().max(255),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { getUserRoutesFromStorage, setRouteShare, rememberReportEmail } =
      await import("./user-routes.server");
    const routes = await getUserRoutesFromStorage(data.userId);
    const route = routes.find((r) => r.id === data.routeId);
    if (!route) throw new Error("Ruta no encontrada.");

    await rememberReportEmail(data.userId, data.reportEmail);

    const hasCorrectStops = Boolean(route.stops?.length) &&
      (!route.routeStops?.length || route.stops?.length === route.routeStops.length) &&
      (!route.addresses?.length || route.routeStops?.length || route.stops?.length === route.addresses.length + 1);
    const token =
      route.shareToken && hasCorrectStops
        ? route.shareToken
        : crypto.randomUUID().replaceAll("-", "");
    if (route.shareToken && hasCorrectStops && route.stops) {
      const saved = await setRouteShare(data.userId, data.routeId, token, route.stops, data.reportEmail);
      if (!saved) throw new Error("No se pudo generar el enlace.");
      return { token };
    }

    const labels = route.addresses ?? [];
    let visitPoints: Array<{ lat: number; lon: number; label?: string }> =
      route.routeStops?.length ? route.routeStops : route.points;
    // Rutas anteriores guardaban cientos de vértices sin separar las visitas.
    // Recuperar las direcciones para no crear un check por cada vértice.
    if (!route.routeStops?.length && labels.length > 0) {
      const { smartGeocode } = await import("./geocoding");
      const places = [route.origin ?? "", ...labels];
      visitPoints = [];
      for (const place of places) {
        try {
          const location = await smartGeocode(place);
          visitPoints.push({ lat: location.lat, lon: location.lon, label: place });
        } catch {
          throw new Error(`No se pudo ubicar "${place}". Actualiza la ruta antes de compartirla.`);
        }
      }
    }
    const stops: SharedRouteStop[] = visitPoints.map((point, index) => ({
      label:
        index === 0
          ? (route.origin ?? labels[0] ?? "Salida")
          : (route.routeStops?.[index]?.label ?? labels[index - 1] ?? `Parada ${index}`),
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
        lat: z.number().min(-90).max(90).optional(),
        lon: z.number().min(-180).max(180).optional(),
        contact: z.boolean().optional(),
        note: z.string().trim().max(1000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { markSharedStop, getRouteByShareToken } = await import("./user-routes.server");
    let check: { contact: boolean; note: string; distance: number } | undefined;
    if (data.visited) {
      if (data.lat == null || data.lon == null) {
        throw new Error("Activa tu ubicación para marcar la visita.");
      }
      if (data.contact == null || !data.note || data.note.length < 3) {
        throw new Error("Escribe una nota de la visita.");
      }
      const current = await getRouteByShareToken(data.token);
      const stop = current?.stops?.[data.stopIndex];
      if (!stop) throw new Error("No se pudo actualizar la parada.");
      const distance = distanceMeters(data.lat, data.lon, stop.lat, stop.lon);
      if (distance > CHECK_RADIUS_METERS) {
        const km = distance >= 1000 ? `${(distance / 1000).toFixed(1)} km` : `${Math.round(distance)} m`;
        throw new Error(`Estás a ${km} de la parada. Acércate para marcarla.`);
      }
      check = { contact: data.contact, note: data.note, distance };
    }
    const route = await markSharedStop(
      data.token,
      data.stopIndex,
      data.visited,
      check,
    );
    if (!route) throw new Error("No se pudo actualizar la parada.");
    return toView(route);
  });

/** El operador envía el resumen después de completar y anotar las visitas. */
export const finishSharedRoute = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().min(16) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { getRouteByShareToken } = await import("./user-routes.server");
    const route = await getRouteByShareToken(data.token);
    if (!route?.stops?.length || !route.stops.every((stop) => stop.visitedAt)) {
      throw new Error("Completa todas las visitas antes de enviar el resumen.");
    }
    if (!route.reportEmail) throw new Error("La ruta no tiene un correo de destino.");
    if (route.reportSentAt) return toView(route);
    const sent = await maybeSendReport(data.token);
    if (!sent?.reportSentAt) throw new Error("No se pudo enviar el resumen. Intenta de nuevo.");
    return toView(sent);
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
    z.object({ userId: z.number().int().nonnegative() }).parse(input),
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
    const result = await sendTemplateEmail("reporte-visitas", route.reportEmail, {
      templateData: {
        routeName: route.name,
        stops: route.stops.map((s) => ({
          label: s.label,
          visitedAt: s.visitedAt ?? null,
          comment:
            s.contact == null
              ? (s.comment ?? null)
              : `${s.contact ? "Con acercamiento" : "Sin acercamiento"}${s.comment ? ` · ${s.comment}` : ""}`,
        })),
      },
      idempotencyKey: `reporte-visitas-${token}-${route.stops.map((s) => s.visitedAt).join("|").length}-${route.stops[route.stops.length - 1]?.visitedAt ?? ""}`,
    });
    if (!result.sent) return null;
    return await updateSharedRoute(token, (r) => {
      r.reportSentAt = new Date().toISOString();
      return true;
    });
  } catch (cause) {
    console.error("reporte-visitas", cause);
    return null;
  }
}
