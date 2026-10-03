import * as React from "react";
import type { PlatformUserProfile } from "@/lib/platform-user.functions";

export type { PlatformUserProfile };

export type WialonSession = {
  sid: string;
  host: "lite" | "full";
  userId: number;
  userName: string;
  token?: string;
  profile?: PlatformUserProfile | null;
};

const KEY = "orblite.wialon.session";

export const PLATFORM_LABEL: Record<WialonSession["host"], string> = {
  lite: "ORB-LITE (Wialon Lite)",
  full: "ORB-FULL (Wialon Full)",
};

export const PLATFORM_URLS: Record<WialonSession["host"], { app: string; cms: string }> = {
  lite: { app: "https://lite.wialon.us/", cms: "https://cms-lite.wialon.us/" },
  full: { app: "https://hosting.wialon.com/", cms: "https://cms.wialon.com/" },
};

export function readSession(): WialonSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY) || window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WialonSession;
    if (!parsed?.sid || !parsed?.host) return null;
    if (!parsed.token) {
      const storedToken =
        window.localStorage.getItem("wialon_token") ||
        window.sessionStorage.getItem("wialon_token");
      if (storedToken) parsed.token = storedToken;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeSession(session: WialonSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    window.sessionStorage.setItem(KEY, JSON.stringify(session));
    window.localStorage.setItem(KEY, JSON.stringify(session));
    if (session.token) {
      window.localStorage.setItem("wialon_token", session.token);
      window.sessionStorage.setItem("wialon_token", session.token);
    }
  } else {
    window.sessionStorage.removeItem(KEY);
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem("wialon_token");
    window.sessionStorage.removeItem("wialon_token");
  }
  window.dispatchEvent(new Event("wialon-session-change"));
}

export const getStoredWialonSession = readSession;
export const setStoredWialonSession = writeSession;

/** Devuelve la sesión activa; `undefined` mientras hidrata. */
export function useWialonSession(): WialonSession | null | undefined {
  const [session, setSession] = React.useState<WialonSession | null | undefined>(undefined);

  React.useEffect(() => {
    setSession(readSession());
    const onChange = () => setSession(readSession());
    window.addEventListener("wialon-session-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("wialon-session-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return session;
}

/** Mantiene viva la sesión de Wialon periódicamente y cierra si la plataforma la invalidó. */
export function useWialonKeepAlive(
  session: WialonSession | null | undefined,
  ping: (args: {
    data: { host: WialonSession["host"]; sid: string };
  }) => Promise<{ valid: boolean }>,
) {
  React.useEffect(() => {
    if (!session || !session.sid) return;
    let cancelled = false;

    async function check() {
      try {
        const result = await ping({ data: { host: session!.host, sid: session!.sid } });
        if (!cancelled && result && result.valid === false) {
          console.warn("[useWialonKeepAlive] Sesión invalidada por la plataforma Wialon.");
          writeSession(null);
        }
      } catch {
        // error temporal de red: se reintenta en el siguiente ciclo sin expulsar al usuario
      }
    }

    // Intervalo de keepalive cada 4 minutos para mantener el socket/sesión de Wialon activo
    const timer = window.setInterval(check, 4 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [session?.sid, session?.host]);
}
