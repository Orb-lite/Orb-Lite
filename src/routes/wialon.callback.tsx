import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { writeSession, type WialonSession } from "@/lib/wialon-session";
import { wialonLogin } from "@/lib/wialon.functions";

export const Route = createFileRoute("/wialon/callback")({
  head: () => ({
    meta: [
      { title: "Conectando con la plataforma | ORB-LITE" },
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
} {
  if (typeof window === "undefined") {
    return { token: null, host: "lite", wialonError: null };
  }
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

  const errorCode =
    search.get("error") ??
    hash.get("error") ??
    search.get("svc_error") ??
    hash.get("svc_error");

  const token =
    search.get("access_token") ??
    hash.get("access_token") ??
    search.get("token") ??
    hash.get("token") ??
    search.get("eid") ??
    hash.get("eid");

  const stored =
    window.sessionStorage.getItem("orblite.wialon.oauth-host") ||
    window.localStorage.getItem("orblite.wialon.oauth-host");
  const host = stored === "full" ? "full" : "lite";

  const wialonError = errorCode
    ? WIALON_ERRORS[errorCode] || `Error de la plataforma Wialon (Código ${errorCode})`
    : null;

  return { token, host, wialonError };
}

async function directClientLogin(
  host: "lite" | "full",
  token: string,
): Promise<WialonSession | null> {
  const hosts: Array<"lite" | "full"> = host === "full" ? ["full", "lite"] : ["lite", "full"];

  for (const h of hosts) {
    const base = h === "full" ? "https://hst-api.wialon.com" : "https://hst-api.wialon.us";
    try {
      const url = `${base}/wialon/ajax.html?svc=token/login`;
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
          host: h,
          userId: data.user?.id ?? 0,
          userName: data.user?.nm ?? "Usuario",
        };
      }
    } catch (e) {
      console.warn(`[Wialon] Direct client login failed on host ${h}:`, e);
    }
  }
  return null;
}

function WialonCallbackPage() {
  const login = useServerFn(wialonLogin);
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      const { token, host, wialonError } = readParams();

      if (wialonError) {
        setError(wialonError);
        return;
      }

      if (!token) {
        setError("La plataforma no devolvió un token de acceso válido. Por favor intenta entrar de nuevo.");
        return;
      }

      try {
        // 1. Intento por función de servidor
        try {
          const result = await login({ data: { host, token } });
          if (cancelled) return;
          writeSession(result);
          localStorage.setItem("wialon_token", token);
          void navigate({ to: "/wialon/mapa" });
          return;
        } catch (serverErr) {
          console.warn("[Wialon Callback] ServerFn falló, probando conexión directa cliente:", serverErr);
        }

        // 2. Respaldo directo en el navegador (en caso de fallo en SSR / Serverless)
        const directResult = await directClientLogin(host, token);
        if (cancelled) return;

        if (directResult) {
          writeSession(directResult);
          localStorage.setItem("wialon_token", token);
          void navigate({ to: "/wialon/mapa" });
          return;
        }

        setError(
          "El token de acceso no fue aceptado por los servidores de Wialon (Wialon Lite ni Wialon Full). Verifica que tu usuario y contraseña pertenezcan a la plataforma seleccionada.",
        );
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo iniciar sesión en la plataforma Wialon.",
          );
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [login, navigate]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-md rounded-xl border border-border/60 bg-card p-8 shadow-sm">
        {error ? (
          <>
            <h1 className="font-display text-xl font-bold uppercase tracking-wide text-destructive">
              Error de conexión
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">{error}</p>
            <button
              type="button"
              onClick={() => void navigate({ to: "/wialon" })}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90"
            >
              Volver a intentar
            </button>
          </>
        ) : (
          <>
            <div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <h1 className="mt-4 font-display text-xl font-bold uppercase tracking-wide text-foreground">
              Conectando con la plataforma…
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Validando credenciales satelitales y preparando tu panel de rastreo.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
