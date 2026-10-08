import * as React from "react";
import type { PlatformUserProfile } from "@/lib/platform-user.functions";

export type { PlatformUserProfile };

export type WialonSession = {
  sid: string;
  host: "lite" | "full";
  userId: number;
  userName: string;
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

export function clearSession() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem("orblite.wialon.sid");
    window.sessionStorage.removeItem("orblite.wialon.sid");
    window.sessionStorage.removeItem("orblite.wialon.session");
    window.localStorage.removeItem("orblite.wialon.session");
    for (const name of ["orblite.wialon.sid", "orblite.wialon.session", "wialon_session"]) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
  } catch {}
  window.dispatchEvent(new Event("wialon-session-change"));
}

export function readSession(): WialonSession | null {
  if (typeof window === "undefined") return null;
  try {
    // Purgar claves legacy obsoletas que causan sesiones fantasma
    try {
      window.localStorage.removeItem("orblite.wialon.sid");
      window.sessionStorage.removeItem("orblite.wialon.sid");
    } catch {}

    const raw = window.sessionStorage.getItem(KEY) || window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WialonSession;

    // Validación estricta anti-sesión fantasma:
    // Debe tener SID válido, HOST válido, y un NOMBRE DE USUARIO REAL (no vacío, no "undefined", no "null")
    const hasValidSid = typeof parsed?.sid === "string" && parsed.sid.trim().length >= 5;
    const hasValidHost = parsed?.host === "lite" || parsed?.host === "full";
    const rawUserName = typeof parsed?.userName === "string" ? parsed.userName.trim() : "";
    const hasValidUser =
      rawUserName.length > 0 &&
      rawUserName.toLowerCase() !== "undefined" &&
      rawUserName.toLowerCase() !== "null" &&
      rawUserName.toLowerCase() !== "anon" &&
      rawUserName.toLowerCase() !== "desconocido";

    if (!hasValidSid || !hasValidHost || !hasValidUser) {
      console.warn("[wialon-session] Sesión fantasma sin usuario detectada y purgada:", parsed);
      clearSession();
      return null;
    }

    return parsed;
  } catch {
    clearSession();
    return null;
  }
}

export function writeSession(session: WialonSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    const rawUserName = typeof session.userName === "string" ? session.userName.trim() : "";
    if (
      !session.sid ||
      !rawUserName ||
      rawUserName.toLowerCase() === "undefined" ||
      rawUserName.toLowerCase() === "null"
    ) {
      console.warn("[wialon-session] Intento de guardar sesión sin usuario cancelado.");
      clearSession();
      return;
    }
    const payload = JSON.stringify(session);
    window.sessionStorage.setItem(KEY, payload);
    window.localStorage.setItem(KEY, payload);
  } else {
    clearSession();
    return;
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

/**
 * Mantiene viva la sesión de Wialon continuamente (cada 60s y al volver a la pestaña).
 * Wialon invalida los tokens de sesión tras 5 minutos de inactividad. El keep-alive
 * directo desde el navegador envía peticiones JSONP con la IP idéntica del cliente,
 * previniendo desconexiones inesperadas y manteniendo la sesión indefinidamente.
 */
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
      if (cancelled || !session?.sid) return;
      try {
        // 1. Preferir ping directo desde el cliente vía JSONP (misma IP del navegador)
        const base =
          session.host === "full" ? "https://hst-api.wialon.com" : "https://hst-api.wialon.us";
        const cbName = `orb_ping_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const s = document.createElement("script");
        s.src = `${base}/wialon/ajax.html?svc=core/duplicate&params=%7B%7D&sid=${session.sid}&callback=${cbName}`;
        (window as any)[cbName] = (res: any) => {
          delete (window as any)[cbName];
          if (s.parentNode) s.parentNode.removeChild(s);
          if (res?.eid && res.eid !== session.sid) {
            writeSession({ ...session, sid: res.eid });
          }
        };
        document.head.appendChild(s);

        // 2. Comprobación pasiva del servidor (sin expulsar si solo hay mismatch de IP)
        try {
          await ping({ data: { host: session.host, sid: session.sid } });
        } catch {}
      } catch {
        // Error de red temporal: no expulsar al usuario
      }
    }

    // Ping cada 60 segundos (muy por debajo de los 5 minutos de inactividad de Wialon)
    const timer = window.setInterval(check, 60 * 1000);

    // Ping inmediato al volver a enfocar la pestaña tras estar en segundo plano
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void check();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onVisibilityChange);
    };
  }, [session?.sid, session?.host]);
}
