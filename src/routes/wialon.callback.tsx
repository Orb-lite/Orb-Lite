import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { writeSession, type WialonSession } from "@/lib/wialon-session";
import { wialonLogin } from "@/lib/wialon.functions";
import { syncWialonPlatformUser, type PlatformUserProfile } from "@/lib/platform-user.functions";

export const Route = createFileRoute("/wialon/callback")({
  head: () => ({
    meta: [
      { title: "Iniciando sesión en la plataforma | ORB-LITE" },
      {
        name: "description",
        content: "Validando tu acceso a la plataforma de rastreo satelital ORB-LITE.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WialonCallbackPage,
});

const WIALON_ERRORS: Record<string, string> = {
  "1": "Sesión inválida o expirada. Vuelve a iniciar sesión.",
  "2": "Servicio no disponible temporalmente en Wialon.",
  "3": "Sin permisos suficientes para acceder a la cuenta.",
  "4": "Parámetros o credenciales inválidas.",
  "7": "Acceso denegado. Revisa que tu usuario y contraseña sean correctos.",
  "8": "Usuario o contraseña de Wialon incorrectos.",
  "1002": "La cuenta de Wialon se encuentra suspendida o bloqueada.",
};

function readParams(): {
  token: string | null;
  host: "lite" | "full";
  wialonError: string | null;
  userName: string | null;
} {
  if (typeof window === "undefined") {
    return { token: null, host: "lite", wialonError: null, userName: null };
  }

  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

  const rawError =
    search.get("error") ??
    hash.get("error") ??
    search.get("svc_error") ??
    hash.get("svc_error");

  const errorCode =
    rawError &&
    rawError !== "0" &&
    rawError !== "none" &&
    rawError !== "null" &&
    rawError !== "undefined"
      ? rawError
      : null;

  const token =
    hash.get("access_token") ??
    search.get("access_token") ??
    hash.get("token") ??
    search.get("token") ??
    hash.get("eid") ??
    search.get("eid");

  const userName =
    hash.get("user_name") ??
    search.get("user_name") ??
    hash.get("user") ??
    search.get("user") ??
    null;

  const urlHost = search.get("host") ?? hash.get("host");
  const storedHost =
    window.sessionStorage.getItem("orblite.wialon.oauth-host") ||
    window.localStorage.getItem("orblite.wialon.oauth-host");
  
  const host: "lite" | "full" =
    urlHost === "full" || storedHost === "full" ? "full" : "lite";

  const wialonError = errorCode
    ? WIALON_ERRORS[errorCode] || `Error de la plataforma Wialon (Código ${errorCode})`
    : null;

  return { token, host, wialonError, userName };
}

/**
 * Ejecuta una petición JSONP nativa creando un tag <script>.
 * Bypassea completamente las restricciones CORS del navegador comunicándose
 * directamente con los centros de datos oficiales de Wialon.
 */
function jsonpRequest<T = any>(url: string, timeoutMs = 7000): Promise<T | null> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const callbackName = `wialon_jsonp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(null);
    }, timeoutMs);

    const script = document.createElement("script");

    function cleanup() {
      clearTimeout(timer);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      try {
        delete (window as any)[callbackName];
      } catch {}
    }

    (window as any)[callbackName] = (data: any) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(data as T);
    };

    script.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(null);
    };

    const separator = url.includes("?") ? "&" : "?";
    script.src = `${url}${separator}callback=${callbackName}`;
    document.head.appendChild(script);
  });
}

/**
 * Autenticación directa en navegador contra los centros de datos de Wialon.
 * 1. Usa JSONP (cero CORS) directo a hst-api.wialon.us y hst-api.wialon.com.
 * 2. Si no, usa proxies locales o fetch directo.
 */
async function directBrowserTokenLogin(
  preferredHost: "lite" | "full",
  token: string,
): Promise<{ sid: string; host: "lite" | "full"; userId: number; userName: string } | null> {
  const hostsToTry: Array<{ host: "lite" | "full"; base: string }> =
    preferredHost === "full"
      ? [
          { host: "full", base: "https://hst-api.wialon.com" },
          { host: "lite", base: "https://hst-api.wialon.us" },
        ]
      : [
          { host: "lite", base: "https://hst-api.wialon.us" },
          { host: "full", base: "https://hst-api.wialon.com" },
        ];

  // 1. Probar JSONP directo a Wialon (bypassea CORS 100%)
  for (const { host, base } of hostsToTry) {
    try {
      const params = encodeURIComponent(JSON.stringify({ token, fl: 1 }));
      const jsonpUrl = `${base}/wialon/ajax.html?svc=token/login&params=${params}`;
      const data = await jsonpRequest<any>(jsonpUrl, 6000);
      if (data?.eid) {
        const uObj = data.u || data.user;
        return {
          sid: data.eid,
          host,
          userId: uObj?.id ?? 0,
          userName: uObj?.nm || data.au || "Usuario",
        };
      }

      // Si el token es de 32 caracteres (ya es un eid/sid activo), probar validez
      if (token.length === 32) {
        const checkUrl = `${base}/wialon/ajax.html?svc=core/get_account_data&params=%7B%7D&sid=${token}`;
        const checkData = await jsonpRequest<any>(checkUrl, 5000);
        if (checkData && !checkData.error) {
          const uObj = checkData.u || checkData.user;
          return {
            sid: token,
            host,
            userId: uObj?.id ?? 0,
            userName: uObj?.nm || checkData.au || "Usuario",
          };
        }
      }
    } catch (e) {
      console.warn(`[JSONP Wialon] Fallo en ${base}:`, e);
    }
  }

  // 2. Probar proxies locales
  const proxies: Array<{ host: "lite" | "full"; url: string }> = [
    {
      host: preferredHost,
      url: preferredHost === "full" ? "/wialon-full-api/?svc=token/login" : "/wialon-lite-api/?svc=token/login",
    },
    {
      host: preferredHost === "full" ? "lite" : "full",
      url: preferredHost === "full" ? "/wialon-lite-api/?svc=token/login" : "/wialon-full-api/?svc=token/login",
    },
  ];

  for (const p of proxies) {
    try {
      const res = await fetch(p.url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          params: JSON.stringify({ token, fl: 1 }),
        }).toString(),
      });
      if (res.ok) {
        const data = (await res.json()) as any;
        if (data?.eid) {
          const uObj = data.u || data.user;
          return {
            sid: data.eid,
            host: p.host,
            userId: uObj?.id ?? 0,
            userName: uObj?.nm || data.au || "Usuario",
          };
        }
      }
    } catch {}
  }

  return null;
}

function WialonCallbackPage() {
  const login = useServerFn(wialonLogin);
  const syncUser = useServerFn(syncWialonPlatformUser);
  const navigate = useNavigate();
  const [status, setStatus] = React.useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      const { token, host, wialonError, userName } = readParams();

      if (wialonError) {
        setStatus("error");
        setErrorMessage(wialonError);
        return;
      }

      if (!token) {
        setStatus("error");
        setErrorMessage("No se detectó un token de acceso de Wialon. Por favor intenta entrar de nuevo.");
        return;
      }

      try {
        let authResult: { sid: string; host: "lite" | "full"; userId: number; userName: string } | null = null;

        // 1. Probar en servidor
        try {
          const res = await login({ data: { host, token } });
          if (res?.sid) {
            authResult = res as any;
          }
        } catch (serverErr) {
          console.warn("[Wialon Callback] Server login falló, probando en navegador directo:", serverErr);
        }

        // 2. Si el servidor no obtuvo sesión válida, intentar directo en navegador
        if (!authResult?.sid) {
          const direct = await directBrowserTokenLogin(host, token);
          if (direct?.sid) {
            authResult = direct;
          }
        }

        if (!authResult?.sid) {
          setStatus("error");
          setErrorMessage(
            "No se pudo canjear el token de Wialon por una sesión activa. Por favor verifica tus credenciales o intenta iniciar sesión directamente con usuario y contraseña.",
          );
          return;
        }

        const effectiveSid = authResult.sid;
        const effectiveHost = authResult.host || host;
        const effectiveUserId = authResult.userId || 0;
        const effectiveUserName = userName || authResult.userName || "Usuario";

        // 3. Sincronizar usuario y jerarquía en base de datos de ORB-LITE (sin pasar login por Supabase)
        let profile: PlatformUserProfile | null = null;
        try {
          profile = (await syncUser({
            data: {
              wialonUserId: effectiveUserId,
              wialonUsername: effectiveUserName,
              host: effectiveHost,
              sid: effectiveSid,
            },
          })) as PlatformUserProfile | null;
        } catch (syncErr) {
          console.warn("[Wialon Callback] Error al sincronizar datos de usuario:", syncErr);
        }

        const session: WialonSession = {
          sid: effectiveSid,
          host: effectiveHost,
          userId: effectiveUserId,
          userName: profile?.fullName || effectiveUserName,
          profile,
        };

        writeSession(session);
        localStorage.setItem("wialon_token", token);
        toast.success(`¡Bienvenido a la plataforma, ${session.userName}!`);
        void navigate({ to: "/wialon/mapa" });
      } catch (err: any) {
        if (cancelled) return;
        console.warn("[Wialon Callback] Fallo total de resolución:", err);
        setStatus("error");
        setErrorMessage(
          err?.message || "Ocurrió un error al validar tu acceso en la plataforma Wialon. Intenta iniciar sesión de nuevo.",
        );
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [login, syncUser, navigate]);

  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-md rounded-2xl border border-border/80 bg-card p-8 shadow-xl">
        {status === "loading" ? (
          <>
            <div className="mx-auto size-12 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <h1 className="mt-5 font-display text-xl font-bold uppercase tracking-wide text-foreground">
              Abriendo tu plataforma de rastreo…
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Cargando unidades satelitales, sensores y mapa en tiempo real.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-xl font-bold uppercase tracking-wide text-destructive">
              Error de conexión
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">{errorMessage}</p>

            <button
              type="button"
              onClick={() => void navigate({ to: "/wialon" })}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow hover:opacity-90 transition-opacity"
            >
              Volver a la pantalla de acceso
            </button>
          </>
        )}
      </div>
    </div>
  );
}
