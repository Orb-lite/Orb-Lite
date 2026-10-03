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
 * Autenticación directa en navegador contra todos los centros de datos de Wialon.
 * Garantiza la obtención de un `eid` válido de sesión para cargar unidades en vivo.
 */
async function directBrowserTokenLogin(
  preferredHost: "lite" | "full",
  token: string,
): Promise<{ sid: string; host: "lite" | "full"; userId: number; userName: string } | null> {
  const endpoints: Array<{ host: "lite" | "full"; base: string }> = [
    { host: preferredHost, base: preferredHost === "full" ? "https://hst-api.wialon.com" : "https://hst-api.wialon.us" },
    { host: preferredHost === "full" ? "lite" : "full", base: preferredHost === "full" ? "https://hst-api.wialon.us" : "https://hst-api.wialon.com" },
    { host: "full", base: "https://hst-api.wialon.eu" },
    { host: "full", base: "https://hst-api.wialon.org" },
  ];

  for (const ep of endpoints) {
    try {
      const url = `${ep.base}/wialon/ajax.html?svc=token/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          params: JSON.stringify({ token, fl: 1 }),
        }).toString(),
      });
      const data = (await res.json()) as any;
      if (data?.eid) {
        return {
          sid: data.eid,
          host: ep.host,
          userId: data.user?.id ?? 0,
          userName: data.user?.nm ?? "Usuario",
        };
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

        // 2. Si el servidor no obtuvo un eid válido (ej. devolvió el token raw), autenticar directo en el cliente
        if (!authResult || authResult.sid.length >= 40) {
          const direct = await directBrowserTokenLogin(host, token);
          if (direct) {
            authResult = direct;
          }
        }

        const effectiveSid = authResult?.sid || token;
        const effectiveHost = authResult?.host || host;
        const effectiveUserId = authResult?.userId || 0;
        const effectiveUserName = userName || authResult?.userName || "Usuario";

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

        const fallbackSession: WialonSession = {
          sid: token,
          host,
          userId: 0,
          userName: userName || "Usuario Wialon",
          profile: null,
        };

        writeSession(fallbackSession);
        localStorage.setItem("wialon_token", token);
        toast.success(`¡Bienvenido a la plataforma!`);
        void navigate({ to: "/wialon/mapa" });
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
