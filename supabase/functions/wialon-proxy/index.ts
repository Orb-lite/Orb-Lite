/**
 * Proxy seguro para los endpoints de autenticación de Wialon.
 *
 * Configura el secreto antes de desplegar:
 *   supabase secrets set WIALON_APP_TOKEN=<token-de-aplicacion>
 *
 * El cliente solo puede enviar `target` y `params`; el token de aplicación
 * siempre se toma del entorno y nunca se expone al navegador.
 */
const ALLOWED_HOSTS = new Set([
  "hst-api.wialon.com",
  "hst-api.wialon.us",
  "lite-api.wialon.com",
  "lite-api.wialon.us",
]);

const ALLOWED_SERVICES = new Set(["token/login", "wialon.api.sign_in"]);

const LOCALHOST_ORIGIN = /^https?:\/\/localhost(?::\d+)?$/;
const LOVABLE_ORIGIN =
  /^https:\/\/(?:[a-z0-9-]+\.)?(?:lovable\.app|lovable\.dev|lovableproject\.com)$/i;

type RequestBody = {
  target: string;
  service: "token/login" | "wialon.api.sign_in";
  params?: Record<string, unknown>;
};

function corsHeaders(origin: string | null): HeadersInit {
  const allowedOrigin = origin && (LOCALHOST_ORIGIN.test(origin) || LOVABLE_ORIGIN.test(origin));
  return {
    "Access-Control-Allow-Origin": allowedOrigin ? origin : "null",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, cors: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json; charset=utf-8" },
  });
}

function destination(target: string, service: string): URL {
  const url = new URL(target);
  if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname)) {
    throw new Error("Destino de Wialon no permitido.");
  }
  if (!ALLOWED_SERVICES.has(service)) {
    throw new Error("Servicio de Wialon no permitido.");
  }

  // Siempre usar el endpoint AJAX de Wialon; se ignoran rutas del cliente.
  return new URL("/wialon/ajax.html", url.origin);
}

Deno.serve(async (request) => {
  const cors = corsHeaders(request.headers.get("Origin"));

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST") {
    return json({ error: "Método no permitido." }, 405, cors);
  }

  try {
    const body = (await request.json()) as RequestBody;
    if (
      !body?.target ||
      !body.service ||
      (body.params != null && typeof body.params !== "object")
    ) {
      return json({ error: "Solicitud inválida." }, 400, cors);
    }

    const appToken = Deno.env.get("WIALON_APP_TOKEN");
    if (!appToken) {
      console.error("WIALON_APP_TOKEN no está configurado.");
      return json({ error: "El proxy de Wialon no está configurado." }, 500, cors);
    }

    const url = destination(body.target, body.service);
    url.searchParams.set("svc", body.service);

    const params = { ...(body.params ?? {}) };
    const accessToken = typeof params.access_token === "string" ? params.access_token.trim() : "";
    delete params.access_token;

    // Para token/login se admite un token efímero del flujo de autorización;
    // para cualquier otro caso se inyecta exclusivamente el secreto de la app.
    // Ninguno se registra ni se devuelve por esta función.
    params.token = body.service === "token/login" && accessToken ? accessToken : appToken;
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ params: JSON.stringify(params) }),
    });

    const payload = await upstream.text();
    return new Response(payload, {
      status: upstream.status,
      headers: {
        ...cors,
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo contactar Wialon.";
    return json({ error: message }, 400, cors);
  }
});
