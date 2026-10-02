import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, MapPin, Video, KeyRound, ArrowRight, User, Lock } from "lucide-react";
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
          "Inicia sesión con tu cuenta de Wialon para acceder a tu plataforma de rastreo satelital ORB-LITE: mapa en vivo, historial, sensores y unidades.",
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
      // continuar
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
  const [activeTab, setActiveTab] = React.useState<"wialon-oauth" | "direct" | "token">("wialon-oauth");
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [token, setToken] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Si viene con un access_token en el hash o query, enviar inmediatamente a callback
    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const queryToken = search.get("access_token") ?? hash.get("access_token");
      if (queryToken) {
        void navigate({ to: "/wialon/callback" });
        return;
      }
    }
    if (session) {
      void navigate({ to: "/wialon/mapa" });
    }
  }, [session, navigate]);

  function startWialonOAuthLogin() {
    const base = PLATFORM_URLS[host].app.replace(/\/$/, "");
    window.sessionStorage.setItem("orblite.wialon.oauth-host", host);
    window.localStorage.setItem("orblite.wialon.oauth-host", host);
    const redirect = `${window.location.origin}/wialon/callback?host=${host}`;
    const url = new URL(`${base}/login.html`);
    url.searchParams.set("client_id", "ORB-LITE");
    url.searchParams.set("activation_time", "0");
    url.searchParams.set("duration", "2592000"); // 30 días
    url.searchParams.set("flags", "1");
    url.searchParams.set("lang", "es");
    url.searchParams.set("redirect_uri", redirect);
    url.searchParams.set("response_type", "token");
    window.location.assign(url.toString());
  }

  async function handleDirectCredentialsLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!user.trim()) {
      setError("Por favor escribe tu usuario de Wialon.");
      return;
    }
    if (!password) {
      setError("Por favor escribe tu contraseña.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let sess: WialonSession | null = null;
      try {
        const res = await loginCredentials({
          data: { host, user: user.trim(), password },
        });
        if (res?.sid) sess = res;
      } catch (serverErr) {
        sess = await directClientLoginWithCredentials(host, user.trim(), password);
        if (!sess) throw serverErr;
      }

      if (sess) {
        writeSession(sess);
        toast.success(`¡Bienvenido, ${sess.userName || user}!`);
        void navigate({ to: "/wialon/mapa" });
        return;
      }

      setError("Usuario o contraseña de Wialon incorrectos.");
    } catch (err: any) {
      const msg = err?.message || "Error al iniciar sesión.";
      if (msg.includes("8") || msg.toLowerCase().includes("incorrect")) {
        setError("Usuario o contraseña de Wialon incorrectos. Verifica si tu cuenta es ORB-LITE o ORB-FULL.");
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
      setError("Por favor escribe tu token.");
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

  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Rastreo Satelital ORB-LITE
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-wide text-foreground sm:text-3xl">
            Acceso a la plataforma
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Inicia sesión con tu cuenta de Wialon para abrir tu panel de rastreo.
          </p>
        </div>

        <section className="mt-6 rounded-2xl border border-border/80 bg-card p-6 shadow-xl">
          {/* Selector de versión */}
          <div className="mb-5 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Selecciona tu versión
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
                  className={`rounded-xl border px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    host === option
                      ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/40"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {option === "lite" ? "ORB-LITE (Lite)" : "ORB-FULL (Full)"}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de modo */}
          <div className="mb-5 flex rounded-lg bg-muted/40 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab("wialon-oauth");
                setError(null);
              }}
              className={`flex-1 rounded-md py-2 transition-all ${
                activeTab === "wialon-oauth"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Página de Wialon
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("direct");
                setError(null);
              }}
              className={`flex-1 rounded-md py-2 transition-all ${
                activeTab === "direct"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Usuario y Contraseña
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("token");
                setError(null);
              }}
              className={`flex-1 rounded-md py-2 transition-all ${
                activeTab === "token"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Token
            </button>
          </div>

          {/* Opción 1: Login por la página de Wialon */}
          {activeTab === "wialon-oauth" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Inicia sesión en la página oficial de Wialon. Una vez autenticado, se abrirá automáticamente tu sesión dentro de la plataforma ORB-LITE con tu mapa y unidades.
              </p>

              <button
                type="button"
                onClick={startWialonOAuthLogin}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg hover:opacity-90 active:scale-[0.99] transition-all"
              >
                <span>Entrar por la página de Wialon</span>
                <ArrowRight className="size-4" />
              </button>

              <p className="text-[11px] text-center text-muted-foreground">
                Servidor: <span className="font-mono text-primary font-semibold">{host === "lite" ? "lite.wialon.us" : "hosting.wialon.com"}</span>
              </p>
            </div>
          )}

          {/* Opción 2: Formulario directo Usuario y Contraseña */}
          {activeTab === "direct" && (
            <form onSubmit={handleDirectCredentialsLogin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    autoComplete="username"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Usuario en Wialon"
                    className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-primary py-3 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? "Iniciando sesión…" : "Abrir mi plataforma"}
              </button>
            </form>
          )}

          {/* Opción 3: Token */}
          {activeTab === "token" && (
            <form onSubmit={handleTokenLogin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Token de acceso</label>
                <textarea
                  rows={2}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Pega aquí tu token de Wialon…"
                  className="w-full rounded-lg border border-border bg-background p-2.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-primary py-3 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? "Validando…" : "Abrir con token"}
              </button>
            </form>
          )}
        </section>
      </div>

      {/* Grid de módulos en la plataforma ORB-LITE */}
      <div className="mt-12 grid w-full max-w-4xl gap-4 sm:grid-cols-4">
        {[
          {
            icon: MapPin,
            title: "Mapa en vivo",
            text: "Ubicación satelital en tiempo real, velocidad y sensores de tus unidades.",
          },
          {
            icon: ShieldCheck,
            title: "Historial y rutas",
            text: "Recorridos, paradas, kilometraje y velocidad máxima registrada.",
          },
          {
            icon: Video,
            title: "Cámaras y video",
            text: "Monitoreo en vivo de cámaras y video telemetría satelital.",
          },
          {
            icon: KeyRound,
            title: "Altas y gestión",
            text: "Gestión de unidades, geocercas y usuarios con permisos.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-border/60 bg-card/40 p-4 text-center">
            <div className="mx-auto flex size-9 items-center justify-center rounded-full bg-primary/10">
              <item.icon className="size-4.5 text-primary" />
            </div>
            <h3 className="mt-2.5 font-display text-sm font-bold uppercase tracking-wide text-foreground">
              {item.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
