import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { writeSession, type WialonSession } from "@/lib/wialon-session";
import { syncWialonPlatformUser, type PlatformUserProfile } from "@/lib/platform-user.functions";

export const Route = createFileRoute("/wialon/callback")({
  head: () => ({
    meta: [{ title: "Iniciando sesión | ORB-LITE" }],
  }),
  component: WialonCallbackPage,
});

// Función cliente directa para evitar bloqueos de IP en Vercel Serverless
async function loginWialonDirect(host: "lite" | "full", token: string) {
  const primaryUrl =
    host === "full" ? "https://hst-api.wialon.com" : "https://hst-api.wialon.us";

  const endpoints = Array.from(
    new Set([
      primaryUrl,
      "https://hst-api.wialon.com",
      "https://hst-api.wialon.us",
      "https://hst-api.wialon.eu",
    ])
  );

  let lastError: string | null = null;

  for (const baseUrl of endpoints) {
    try {
      const body = new URLSearchParams({
        params: JSON.stringify({ token, fl: 1 }),
      });

      const response = await fetch(`${baseUrl}/wialon/ajax.html?svc=token/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!response.ok) continue;

      const res = await response.json();

      if (res?.eid || res?.sid) {
        const resolvedHost = baseUrl.includes("wialon.us") ? "lite" : "full";
        return {
          sid: res.eid || res.sid,
          userName: res.au || res.user?.nm || "Usuario Wialon",
          userId: res.user?.id || 0,
          host: resolvedHost,
        };
      }

      if (res?.error) {
        lastError = `Wialon rechazó el token (Código ${res.error})`;
      }
    } catch (err: any) {
      console.warn(`Error de conexión con ${baseUrl}`, err);
    }
  }

  throw new Error(lastError || "No se pudo obtener una sesión válida de Wialon.");
}

function WialonCallbackPage() {
  const syncUser = useServerFn(syncWialonPlatformUser);
  const navigate = useNavigate();

  const [mounted, setMounted] = React.useState(false);
  const [status, setStatus] = React.useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    async function run() {
      // 1. Obtener parámetros de la URL
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const search = new URLSearchParams(window.location.search);

      const token =
        hash.get("access_token") ??
        search.get("access_token") ??
        hash.get("token") ??
        search.get("token");

      const urlHost = search.get("host") ?? hash.get("host");
      const host = urlHost === "full" ? "full" : "lite";

      if (!token) {
        setStatus("error");
        setErrorMessage("No se recibió token de acceso desde Wialon.");
        return;
      }

      try {
        // 2. Autenticar DIRECTAMENTE desde el navegador (evita bloqueo IP de Vercel)
        const wialonRes = await loginWialonDirect(host, token);

        // 3. Sincronizar usuario con el servidor
        let profile: PlatformUserProfile | null = null;
        try {
          profile = (await syncUser({
            data: {
              wialonUserId: wialonRes.userId,
              wialonUsername: wialonRes.userName,
              host: wialonRes.host,
              sid: wialonRes.sid,
            },
          })) as PlatformUserProfile | null;
        } catch (err) {
          console.warn("Fallo sincronización de perfil:", err);
        }

        // 4. Guardar sesión
        const session: WialonSession = {
          sid: wialonRes.sid,
          host: wialonRes.host,
          userId: wialonRes.userId,
          userName: profile?.fullName || wialonRes.userName,
          profile,
        };

        writeSession(session);
        localStorage.setItem("wialon_token", token);
        toast.success(`¡Bienvenido, ${session.userName}!`);

        void navigate({ to: "/wialon/mapa" });
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "Error al autenticar con Wialon.");
      }
    }

    void run();
  }, [mounted, syncUser, navigate]);

  if (!mounted) return null;

  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-md rounded-2xl border border-border/80 bg-card p-8 shadow-xl">
        {status === "loading" ? (
          <>
            <div className="mx-auto size-12 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <h1 className="mt-5 font-display text-xl font-bold uppercase tracking-wide">
              Abriendo tu plataforma...
            </h1>
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
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold uppercase text-primary-foreground shadow"
            >
              Volver a intentar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
