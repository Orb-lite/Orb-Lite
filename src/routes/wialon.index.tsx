import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { KeyRound, MapPin, ShieldCheck, Video, User, Lock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { PLATFORM_URLS, useWialonSession, writeSession, type WialonSession } from "@/lib/wialon-session";
import { wialonLogin, wialonLoginWithCredentials } from "@/lib/wialon.functions";

export const Route = createFileRoute("/wialon/")({
  head: () => ({
    meta: [
      { title: "Acceso a la plataforma de rastreo | ORB-LITE" },
      {
        name: "description",
        content:
          "Inicia sesión de forma segura en la plataforma de rastreo satelital para consultar tus unidades en vivo, historial y recorridos.",
      },
      { property: "og:title", content: "Acceso a la plataforma de rastreo | ORB-LITE" },
      {
        property: "og:description",
        content: "Mapa en vivo, unidades, historial y alertas de equipos en un solo panel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WialonLoginPage,
});

async function directClientLoginWithCredentials(
  host: "lite" | "full",
  user: string,
  pass: string,
): Promise<WialonSession | null> {
  const hosts: Array<"lite" | "full"> = host === "full" ? ["full", "lite"] : ["lite", "full"];
  for (const h of hosts) {
    const base = h === "full" ? "https://hst-api.wialon.com" : "https://hst-api.wialon.us";
    try {
      const url = `${base}/wialon/ajax.html?svc=core/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          params: JSON.stringify({ user, password: pass }),
        }).toString(),
      });
      const data = (await res.json()) as any;
      if (data?.eid) {
        return {
          sid: data.eid,
          host: h,
          userId: data.user?.id ?? 0,
          userName: data.user?.nm ?? user,
        };
      }
    } catch {
      // Ignorar fallo puntual
    }
  }
  return null;
}

function WialonLoginPage() {
  const navigate = useNavigate();
  const session = useWialonSession();
  const loginCredentials = useServerFn(wialonLoginWithCredentials);
  const loginToken = useServerFn(wialonLogin);

  const [host, setHost] = React.useState<"lite" | "full">("lite");
  const [method, setMethod] = React.useState<"credentials" | "token">("credentials");
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [token, setToken] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Si viene con un access_token directamente en el hash o query, enviar a callback
    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const queryToken = search.get("access_token") ?? hash.get("access_token");
      if (queryToken) {
        void navigate({ to: "/wialon/callback" });
        return;
      }
    }
    if (session) void navigate({ to: "/wialon/mapa" });
  }, [session, navigate]);

  async function handleCredentialsLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!user.trim()) {
      setError("Por favor escribe tu nombre de usuario.");
      return;
    }
    if (!password) {
      setError("Por favor escribe tu contraseña.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Intento por función de servidor
      let sess: WialonSession | null = null;
      try {
        const res = await loginCredentials({
          data: { host, user: user.trim(), password },
        });
        if (res?.sid) {
          sess = res;
        }
      } catch (err: any) {
        // 2. Respaldo directo en el navegador hacia la API de Wialon
        sess = await directClientLoginWithCredentials(host, user.trim(), password);
        if (!sess) {
          throw err;
        }
      }

      if (sess) {
        writeSession(sess);
        toast.success(`¡Bienvenido, ${sess.userName || user}!`);
        void navigate({ to: "/wialon/mapa" });
        return;
      }

      setError("Usuario o contraseña de Wialon incorrectos. Verifica si tu cuenta pertenece a ORB-LITE o ORB-FULL.");
    } catch (err: any) {
      const msg = err?.message || "No se pudo iniciar sesión en la plataforma.";
      if (msg.includes("8") || msg.toLowerCase().includes("incorrect")) {
        setError("Usuario o contraseña incorrectos. Revisa que estén bien escritos.");
      } else if (msg.includes("1002") || msg.toLowerCase().includes("bloqueada")) {
        setError("La cuenta se encuentra temporalmente bloqueada en Wialon.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleTokenLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) {
      setError("Por favor escribe tu token de acceso.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await loginToken({
        data: { host, token: token.trim() },
      });
      if (res?.sid) {
        writeSession(res);
        localStorage.setItem("wialon_token", token.trim());
        toast.success(`¡Sesión iniciada con éxito!`);
        void navigate({ to: "/wialon/mapa" });
        return;
      }
      setError("Token inválido o expirado.");
    } catch (err: any) {
      setError(err?.message || "No se pudo iniciar sesión con este token.");
    } finally {
      setLoading(false);
    }
  }

  function startWialonOAuth() {
    const base = PLATFORM_URLS[host].app.replace(/\/$/, "");
    window.sessionStorage.setItem("orblite.wialon.oauth-host", host);
    const redirect = `${window.location.origin}/wialon/callback`;
    const url = new URL(`${base}/login.html`);
    url.searchParams.set("client_id", "ORB-LITE");
    url.searchParams.set("access_type", "-1");
    url.searchParams.set("activation_time", "0");
    url.searchParams.set("duration", "604800");
    url.searchParams.set("flags", "0x1");
    url.searchParams.set("lang", "es");
    url.searchParams.set("redirect_uri", redirect);
    url.searchParams.set("response_type", "token");
    window.location.assign(url.toString());
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary">ORB-LITE RASTREO</p>
          <h1 className="mt-1 font-display text-2xl font-bold uppercase tracking-wide text-foreground">
            Acceso a la plataforma
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entra con tu cuenta satelital de Wialon.
          </p>
        </div>

        <section className="mt-6 rounded-2xl border border-border/80 bg-card p-6 shadow-xl">
          {/* Selector de versión */}
          <div className="mb-5 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Plataforma asignada
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["lite", "full"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setHost(option);
                    setError(null);
                  }}
                  className={`rounded-lg border px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    host === option
                      ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/40"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {option === "lite" ? "ORB-LITE" : "ORB-FULL"}
                </button>
              ))}
            </div>
          </div>

          {/* Pestañas de método de acceso */}
          <div className="mb-5 flex rounded-lg bg-muted/40 p-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setMethod("credentials");
                setError(null);
              }}
              className={`flex-1 rounded-md py-1.5 font-medium transition-all ${
                method === "credentials"
                  ? "bg-card text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Usuario y Contraseña
            </button>
            <button
              type="button"
              onClick={() => {
                setMethod("token");
                setError(null);
              }}
              className={`flex-1 rounded-md py-1.5 font-medium transition-all ${
                method === "token"
                  ? "bg-card text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Token API
            </button>
          </div>

          {/* Formulario de usuario y contraseña */}
          {method === "credentials" ? (
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Usuario en Wialon</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    autoComplete="username"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Ej: mi_empresa_gps"
                    className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-lg bg-primary py-3 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Entrando a la plataforma…" : "Entrar al rastreo"}
              </button>
            </form>
          ) : (
            /* Formulario por Token */
            <form onSubmit={handleTokenLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Token de acceso Wialon</label>
                <textarea
                  rows={3}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Pega aquí tu token generado en Wialon…"
                  className="w-full rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-lg bg-primary py-3 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Validando token…" : "Entrar con token"}
              </button>
            </form>
          )}

          {/* Separador o enlace alternativo */}
          <div className="mt-5 border-t border-border/60 pt-4 text-center">
            <button
              type="button"
              onClick={startWialonOAuth}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <span>O entrar vía portal web oficial de Wialon</span>
              <ExternalLink className="size-3" />
            </button>
          </div>
        </section>
      </div>

      {/* Características del panel */}
      <div className="mt-12 grid w-full max-w-4xl gap-4 sm:grid-cols-4">
        {[
          {
            icon: MapPin,
            title: "Mapa en vivo",
            text: "Ubicación satelital, velocidad y estado de cada unidad de tu cuenta.",
          },
          {
            icon: ShieldCheck,
            title: "Historial y recorridos",
            text: "Consulta recorridos por fecha, paradas y velocidad máxima.",
          },
          {
            icon: Video,
            title: "Cámaras y Video",
            text: "Consulta oficial de cámaras, transmisiones y alertas en video.",
          },
          {
            icon: KeyRound,
            title: "Altas y gestión",
            text: "Gestión de unidades, usuarios y geocercas satelitales.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-border/60 bg-card/40 p-5 text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10">
              <item.icon className="size-5 text-primary" />
            </div>
            <h2 className="mt-3 font-display text-base font-bold uppercase tracking-wide text-foreground">
              {item.title}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 max-w-md text-center text-xs text-muted-foreground">
        Accesos directos al gestor oficial externo:{" "}
        <a
          className="text-primary hover:underline"
          href={PLATFORM_URLS[host].app}
          target="_blank"
          rel="noreferrer"
        >
          {PLATFORM_URLS[host].app}
        </a>{" "}
        ·{" "}
        <a
          className="text-primary hover:underline"
          href={PLATFORM_URLS[host].cms}
          target="_blank"
          rel="noreferrer"
        >
          {PLATFORM_URLS[host].cms}
        </a>
      </p>
    </div>
  );
}
