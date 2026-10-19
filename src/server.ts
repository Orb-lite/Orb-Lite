import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response, isApiOrFn: boolean): Promise<Response> {
  if (response.status < 500) return response;
  if (isApiOrFn) return response; // Never replace API/serverFn JSON with HTML

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin") || "";
    const isAllowedOrigin =
      !origin ||
      origin.includes("orb-lite.com") ||
      origin.includes("vercel.app") ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1");

    const corsOrigin = isAllowedOrigin ? origin || "*" : "https://www.orb-lite.com";

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": corsOrigin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, x-requested-with, Cookie, x-tsr-csrf",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 1. Direct Edge Endpoint: Wialon Token Exchange (OAuth Callback)
    if (url.pathname === "/api/wialon-token-login" && request.method === "POST") {
      try {
        const body = (await request.json()) as { host?: "lite" | "full"; token?: string };
        const host = body?.host === "full" ? "full" : "lite";
        const token = body?.token;

        if (!token) {
          return new Response(JSON.stringify({ error: "Falta el token de acceso de Wialon." }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": corsOrigin,
              "Access-Control-Allow-Credentials": "true",
            },
          });
        }

        const hosts: Array<"lite" | "full"> = host === "full" ? ["full", "lite"] : ["lite", "full"];
        let authData: { sid: string; host: "lite" | "full"; userId: number; userName: string } | null = null;

        for (const h of hosts) {
          const base = h === "full" ? "https://hst-api.wialon.com" : "https://hst-api.wialon.us";
          try {
            const wialonUrl = `${base}/wialon/ajax.html?svc=token/login`;
            const wRes = await fetch(wialonUrl, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                params: JSON.stringify({ token, fl: 1 }),
              }).toString(),
            });
            const data = (await wRes.json()) as any;
            if (data?.eid) {
              authData = {
                sid: data.eid,
                host: h,
                userId: data.user?.id ?? 0,
                userName: data.user?.nm || data.au || "Usuario",
              };
              break;
            }
          } catch (e) {
            console.warn(`[Cloudflare Worker] Token exchange failed on ${h}:`, e);
          }
        }

        if (authData) {
          return new Response(JSON.stringify(authData), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": corsOrigin,
              "Access-Control-Allow-Credentials": "true",
            },
          });
        } else {
          return new Response(JSON.stringify({ error: "No se pudo validar el token con Wialon." }), {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": corsOrigin,
              "Access-Control-Allow-Credentials": "true",
            },
          });
        }
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err?.message || "Error interno de validación" }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": corsOrigin,
            "Access-Control-Allow-Credentials": "true",
          },
        });
      }
    }

    // 2. Direct Edge Endpoint: Wialon Username + Password Login
    if (url.pathname === "/api/wialon-credentials-login" && request.method === "POST") {
      try {
        const body = (await request.json()) as { host?: "lite" | "full"; user?: string; password?: string };
        const host = body?.host === "full" ? "full" : "lite";
        const { user, password } = body || {};

        if (!user || !password) {
          return new Response(JSON.stringify({ error: "Faltan credenciales." }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": corsOrigin,
              "Access-Control-Allow-Credentials": "true",
            },
          });
        }

        const hosts: Array<"lite" | "full"> = host === "full" ? ["full", "lite"] : ["lite", "full"];
        let authData: { sid: string; host: "lite" | "full"; userId: number; userName: string } | null = null;

        for (const h of hosts) {
          const base = h === "full" ? "https://hst-api.wialon.com" : "https://hst-api.wialon.us";
          try {
            const wialonUrl = `${base}/wialon/ajax.html?svc=core/login`;
            const wRes = await fetch(wialonUrl, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                params: JSON.stringify({ user, password }),
              }).toString(),
            });
            const data = (await wRes.json()) as any;
            if (data?.eid) {
              authData = {
                sid: data.eid,
                host: h,
                userId: data.user?.id ?? 0,
                userName: data.user?.nm || user,
              };
              break;
            }
          } catch (e) {
            console.warn(`[Cloudflare Worker] Credentials login failed on ${h}:`, e);
          }
        }

        if (authData) {
          return new Response(JSON.stringify(authData), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": corsOrigin,
              "Access-Control-Allow-Credentials": "true",
            },
          });
        } else {
          return new Response(JSON.stringify({ error: "Usuario o contraseña de Wialon incorrectos." }), {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": corsOrigin,
              "Access-Control-Allow-Credentials": "true",
            },
          });
        }
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err?.message || "Error interno de validación" }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": corsOrigin,
            "Access-Control-Allow-Credentials": "true",
          },
        });
      }
    }

    // 3. Direct Edge Proxies to Wialon (Bypasses browser CORS completely)
    if (url.pathname.startsWith("/wialon-lite-api") || url.pathname.startsWith("/wialon-api")) {
      const targetUrl = `https://hst-api.wialon.us/wialon/ajax.html${url.search}`;
      try {
        const body = request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : null;
        const wRes = await fetch(targetUrl, {
          method: request.method,
          headers: {
            "Content-Type": request.headers.get("content-type") || "application/x-www-form-urlencoded",
          },
          body,
        });
        const resHeaders = new Headers(wRes.headers);
        resHeaders.set("Access-Control-Allow-Origin", corsOrigin);
        resHeaders.set("Access-Control-Allow-Credentials", "true");
        return new Response(wRes.body, {
          status: wRes.status,
          headers: resHeaders,
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err?.message }), {
          status: 502,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": corsOrigin },
        });
      }
    }

    if (url.pathname.startsWith("/wialon-full-api")) {
      const targetUrl = `https://hst-api.wialon.com/wialon/ajax.html${url.search}`;
      try {
        const body = request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : null;
        const wRes = await fetch(targetUrl, {
          method: request.method,
          headers: {
            "Content-Type": request.headers.get("content-type") || "application/x-www-form-urlencoded",
          },
          body,
        });
        const resHeaders = new Headers(wRes.headers);
        resHeaders.set("Access-Control-Allow-Origin", corsOrigin);
        resHeaders.set("Access-Control-Allow-Credentials", "true");
        return new Response(wRes.body, {
          status: wRes.status,
          headers: resHeaders,
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err?.message }), {
          status: 502,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": corsOrigin },
        });
      }
    }

    // 4. Default: Forward to TanStack Start / Nitro Server
    const isApiOrFn = url.pathname.startsWith("/_server") || url.pathname.startsWith("/api");
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response, isApiOrFn);

      const headers = new Headers(normalized.headers);
      headers.set("Access-Control-Allow-Origin", corsOrigin);
      headers.set("Access-Control-Allow-Credentials", "true");

      return new Response(normalized.body, {
        status: normalized.status,
        statusText: normalized.statusText,
        headers,
      });
    } catch (error: any) {
      console.error(error);
      if (isApiOrFn) {
        return new Response(JSON.stringify({ error: error?.message || "Internal Server Error" }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": corsOrigin,
            "Access-Control-Allow-Credentials": "true",
          },
        });
      }
      return new Response(renderErrorPage(), {
        status: 500,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "Access-Control-Allow-Origin": corsOrigin,
          "Access-Control-Allow-Credentials": "true",
        },
      });
    }
  },
};
