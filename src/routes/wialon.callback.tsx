import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { writeSession } from "@/lib/wialon-session";
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

function readParams(): { token: string | null; host: "lite" | "full" } {
  if (typeof window === "undefined") {
    return { token: null, host: "lite" };
  }
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const token =
    search.get("access_token") ??
    hash.get("access_token") ??
    search.get("token") ??
    hash.get("token") ??
    search.get("eid") ??
    hash.get("eid");
  const stored = window.sessionStorage.getItem("orblite.wialon.oauth-host");
  const host = stored === "full" ? "full" : "lite";
  return { token, host };
}

function WialonCallbackPage() {
  const login = useServerFn(wialonLogin);
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      const { token, host } = readParams();
      if (!token) {
        setError("La plataforma no devolvió un acceso válido. Intenta entrar de nuevo.");
        return;
      }

      try {
        const result = await login({ data: { host, token } });
        if (cancelled) return;

        // Guarda la sesión en el almacenamiento local y de sesión
        writeSession(result);
        localStorage.setItem("wialon_token", token);

        // Redirige directamente al mapa en vivo de la plataforma
        void navigate({ to: "/wialon/mapa" });
      } catch (err) {
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
