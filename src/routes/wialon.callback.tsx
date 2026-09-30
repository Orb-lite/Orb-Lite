import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { writeSession, WialonSession } from "@/lib/wialon-session";
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
        const result = await login({ host, token, sid: token });
        if (cancelled) return;

        // Formatear sesión estricta según el tipo WialonSession
        const sessionData: WialonSession = {
          sid: (result as any)?.sid || token,
          host: (result as any)?.host || host,
          userId: Number((result as any)?.userId || 1),
          userName: String((result as any)?.userName || "Usuario Wialon"),
        };

        // Guardar en localStorage / sessionStorage
        writeSession(sessionData);
        localStorage.setItem("wialon_token", token);

        // Forzar redirección al mapa
        window.location.href = "/wialon/mapa";
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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-red-800">Error de Autenticación</h2>
          <p className="mb-4 text-sm text-red-600">{error}</p>
          <a
            href="/"
            className="inline-block rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-4 text-lg font-medium text-slate-700">Conectando con ORB-LITE...</div>
        <div className="text-sm text-slate-500">Iniciando sesión en la plataforma satelital</div>
      </div>
    </div>
  );
}