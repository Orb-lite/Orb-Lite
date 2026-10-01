import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { wialonLogout, wialonPing } from "@/lib/wialon.functions";

export type WialonHost = "lite" | "full";

type StoredSession = {
  sid: string;
  host: WialonHost;
  userId: number;
  userName: string;
};

type ProxyLoginResponse = {
  eid?: string;
  sid?: string;
  user?: { id?: number; nm?: string };
  error?: number;
  reason?: string;
};

const STORAGE_KEY = "orblite.wialon.sid";
const LEGACY_SESSION_KEY = "orblite.wialon.session";
const PING_INTERVAL_MS = 4 * 60 * 1000;

const TARGETS: Record<WialonHost, string> = {
  lite: "https://hst-api.wialon.us",
  full: "https://hst-api.wialon.com",
};

function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as StoredSession;
    return parsed.sid && (parsed.host === "lite" || parsed.host === "full") ? parsed : null;
  } catch {
    return null;
  }
}

function clearWialonBrowserState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(LEGACY_SESSION_KEY);

  // Solo se pueden borrar cookies de este dominio. Las cookies HttpOnly o de
  // wialon.com las administra Wialon en su propio dominio.
  for (const name of ["orblite.wialon.sid", "orblite.wialon.session"]) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
  }
  window.dispatchEvent(new Event("wialon-session-change"));
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

/**
 * Administra una sesión persistente de Wialon iniciada a través de la Edge
 * Function `wialon-proxy`. El token solo viaja al proxy para obtener el SID;
 * nunca se guarda en el navegador.
 */
export function useWialonSession() {
  const pingServer = useServerFn(wialonPing);
  const logoutServer = useServerFn(wialonLogout);
  const [session, setSession] = React.useState<StoredSession | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const persist = React.useCallback((next: StoredSession | null) => {
    if (typeof window === "undefined") return;
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else clearWialonBrowserState();
    setSession(next);
    window.dispatchEvent(new Event("wialon-session-change"));
  }, []);

  React.useEffect(() => {
    const updateFromStorage = () => setSession(readStoredSession());
    updateFromStorage();
    setIsLoading(false);
    window.addEventListener("storage", updateFromStorage);
    window.addEventListener("wialon-session-change", updateFromStorage);
    return () => {
      window.removeEventListener("storage", updateFromStorage);
      window.removeEventListener("wialon-session-change", updateFromStorage);
    };
  }, []);

  const ping = React.useCallback(async () => {
    if (!session) return false;
    try {
      const result = await pingServer({ data: { host: session.host, sid: session.sid } });
      if (!result.valid) {
        persist(null);
        setError("La sesión de Wialon expiró. Inicia sesión de nuevo.");
      }
      return result.valid;
    } catch (cause) {
      // Una falla temporal de red no invalida una sesión persistida.
      setError(errorMessage(cause, "No se pudo verificar la sesión de Wialon."));
      return false;
    }
  }, [persist, pingServer, session]);

  React.useEffect(() => {
    if (!session) return;
    const interval = window.setInterval(() => void ping(), PING_INTERVAL_MS);
    void ping();
    return () => window.clearInterval(interval);
  }, [ping, session]);

  const signInWithToken = React.useCallback(
    async (accessToken: string, host: WialonHost = "lite") => {
      const token = accessToken.trim();
      if (!token) {
        const message = "Captura un token de acceso de Wialon.";
        setError(message);
        throw new Error(message);
      }

      setIsLoading(true);
      setError(null);
      try {
        const { data, error: invokeError } = await supabase.functions.invoke<ProxyLoginResponse>(
          "wialon-proxy",
          {
            body: {
              target: TARGETS[host],
              service: "token/login",
              // El proxy controla el token de aplicación. El token de acceso
              // se entrega solo para la autenticación y no se persiste.
              params: { access_token: token },
            },
          },
        );
        if (invokeError) throw invokeError;

        const sid = data?.eid ?? data?.sid;
        if (!sid) throw new Error(data?.reason ?? "Wialon no devolvió un SID válido.");

        const next: StoredSession = {
          sid,
          host,
          userId: data?.user?.id ?? 0,
          userName: data?.user?.nm ?? "Usuario",
        };
        persist(next);
        return next;
      } catch (cause) {
        const message = errorMessage(cause, "No se pudo iniciar sesión con Wialon.");
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [persist],
  );

  const signOut = React.useCallback(async () => {
    const current = session;
    persist(null);
    setError(null);
    if (!current) return;
    try {
      await logoutServer({ data: { host: current.host, sid: current.sid } });
    } catch {
      // El estado local ya se limpió aunque la sesión remota haya expirado.
    }
  }, [logoutServer, persist, session]);

  return {
    isAuthenticated: session != null,
    sid: session?.sid ?? null,
    host: session?.host ?? null,
    userId: session?.userId ?? null,
    userName: session?.userName ?? null,
    isLoading,
    error,
    signInWithToken,
    signOut,
    ping,
  };
}
