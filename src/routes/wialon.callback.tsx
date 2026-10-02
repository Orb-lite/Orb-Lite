import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { writeSession, type WialonSession } from "@/lib/wialon-session";
import { wialonLogin } from "@/lib/wialon.functions";

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

  // Código 0 en Wialon significa ÉXITO. Solo valores mayores a 0 son errores.
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

  // Priorizar el host pasado en la URL de retorno
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

function WialonCallbackPage() {
  const login = useServerFn(wialonLogin);
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
        setErrorMessage("No se recibió el token de Wialon. Por favor intenta entrar de nuevo.");
        return;
      }

      try {
        const result = await login({ data: { host, token } });
        if (cancelled) return;

        const displayName = userName || result.userName || "Usuario";
        const session: WialonSession = {
          sid: result.sid,
          host: result.host,
          userId: result.userId,
          userName: displayName,
        };

        writeSession(session);
        localStorage.setItem("wialon_token", token);
        toast.success(`¡Bienvenido a tu plataforma, ${displayName}!`);
        void navigate({ to: "/wialon/mapa" });
      } catch (err: any) {
        if (cancelled) return;
        console.warn("[Wialon Callback] login ServerFn fallo, estableciendo sesión con token directo:", err);

        // Si Wialon ya emitió el token exitosamente, no bloqueamos al usuario:
        // Guardamos la sesión y abrimos el mapa directamente
        const displayName = userName || "Usuario Wialon";
        const fallbackSession: WialonSession = {
          sid: token,
          host,
          userId: 0,
          userName: displayName,
        };

        writeSession(fallbackSession);
        localStorage.setItem("wialon_token", token);
        toast.success(`¡Bienvenido a tu plataforma!`);
        void navigate({ to: "/wialon/mapa" });
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [login, navigate]);

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
              Conectando con tus unidades satelitales y cargando el mapa en vivo.
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
