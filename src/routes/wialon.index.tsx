import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, MapPin, ShieldCheck, Video, KeyRound, Radio, ArrowRight, User, Lock, ChevronDown, ChevronUp } from "lucide-react";
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
          "Accede directamente a la plataforma satelital Wialon (ORB-LITE y ORB-FULL) para monitorear tus vehículos y flotas en tiempo real.",
      },
      { property: "og:title", content: "Acceso a la plataforma de rastreo | ORB-LITE" },
      {
        property: "og:description",
        content: "Acceso a Wialon Lite y Wialon Full para rastreo GPS en vivo, historial y reportes.",
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

  const [showEmbedded, setShowEmbedded] = React.useState(false);
  const [embedHost, setEmbedHost] = React.useState<"lite" | "full">("lite");
  const [method, setMethod] = React.useState<"credentials" | "token">("credentials");
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [token, setToken] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (session) void navigate({ to: "/wialon/mapa" });
  }, [session, navigate]);

  async function handleCredentialsLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!user.trim() || !password) {
      setError("Completa tu usuario y contraseña.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let sess: WialonSession | null = null;
      try {
        const res = await loginCredentials({
          data: { host: embedHost, user: user.trim(), password },
        });
        if (res?.sid) sess = res;
      } catch (err) {
        sess = await directClientLoginWithCredentials(embedHost, user.trim(), password);
        if (!sess) throw err;
      }

      if (sess) {
        writeSession(sess);
        toast.success(`¡Bienvenido, ${sess.userName || user}!`);
        void navigate({ to: "/wialon/mapa" });
        return;
      }

      setError("Usuario o contraseña incorrectos.");
    } catch (err: any) {
      setError(err?.message || "No se pudo iniciar sesión en Wialon.");
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
      const res = await loginToken({ data: { host: embedHost, token: token.trim() } });
      if (res?.sid) {
        writeSession(res);
        localStorage.setItem("wialon_token", token.trim());
        toast.success("¡Sesión iniciada con éxito!");
        void navigate({ to: "/wialon/mapa" });
        return;
      }
      setError("Token inválido.");
    } catch (err: any) {
      setError(err?.message || "Error al validar token.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <Radio className="size-3.5 animate-pulse" />
          <span>Acceso Directo Oficial</span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-wide text-foreground sm:text-4xl">
          Plataforma de Rastreo
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
          Ingresa a la página oficial de Wialon correspondiente a tu cuenta para monitorear tus vehículos en vivo.
        </p>

        {/* Tarjetas de acceso directo a la página de Wialon */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 text-left">
          {/* Opción 1: ORB-LITE (Wialon Lite) */}
          <div className="group relative flex flex-col justify-between rounded-2xl border-2 border-primary/40 bg-card p-6 shadow-xl transition-all hover:border-primary hover:shadow-2xl">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-primary/20 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-primary">
                  Versión Lite
                </span>
                <span className="text-xs text-muted-foreground font-mono">lite.wialon.us</span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-wide text-foreground">
                ORB-LITE
              </h2>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Portal oficial para cuentas estándar de rastreo satelital, monitoreo en tiempo real y paro de motor.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60">
              <a
                href="https://lite.wialon.us/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg transition-transform group-hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Entrar a Wialon Lite</span>
                <ExternalLink className="size-4" />
              </a>
              <div className="mt-2 text-center">
                <a
                  href="https://cms-lite.wialon.us/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-muted-foreground hover:text-primary transition-colors underline"
                >
                  Gestor de Altas (CMS Lite)
                </a>
              </div>
            </div>
          </div>

          {/* Opción 2: ORB-FULL (Wialon Full) */}
          <div className="group relative flex flex-col justify-between rounded-2xl border-2 border-border/80 bg-card p-6 shadow-xl transition-all hover:border-amber-400 hover:shadow-2xl">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-amber-500/20 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                  Versión Full
                </span>
                <span className="text-xs text-muted-foreground font-mono">hosting.wialon.com</span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-wide text-foreground">
                ORB-FULL
              </h2>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Portal oficial Wialon Hosting para telemetría avanzada, sensores de combustible, cámaras y logística.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60">
              <a
                href="https://hosting.wialon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 py-3 font-display text-sm font-bold uppercase tracking-wider text-black shadow-lg transition-transform group-hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Entrar a Wialon Full</span>
                <ExternalLink className="size-4" />
              </a>
              <div className="mt-2 text-center">
                <a
                  href="https://cms.wialon.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-muted-foreground hover:text-amber-400 transition-colors underline"
                >
                  Gestor de Altas (CMS Full)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Sección desplegable opcional para ver el mapa dentro de la web */}
        <div className="mt-8 border-t border-border/60 pt-6">
          <button
            type="button"
            onClick={() => setShowEmbedded((prev) => !prev)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{showEmbedded ? "Ocultar acceso integrado" : "¿Deseas ver el mapa dentro de este sitio web?"}</span>
            {showEmbedded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>

          {showEmbedded && (
            <div className="mx-auto mt-4 max-w-md rounded-2xl border border-border bg-card p-6 text-left shadow-lg">
              <div className="mb-4 flex gap-2">
                {(["lite", "full"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setEmbedHost(opt)}
                    className={`flex-1 rounded-lg border py-2 text-xs font-bold uppercase ${
                      embedHost === opt ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                    }`}
                  >
                    {opt === "lite" ? "ORB-LITE" : "ORB-FULL"}
                  </button>
                ))}
              </div>

              <div className="mb-4 flex rounded-lg bg-muted/40 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setMethod("credentials")}
                  className={`flex-1 rounded-md py-1.5 font-medium ${method === "credentials" ? "bg-card text-foreground shadow" : "text-muted-foreground"}`}
                >
                  Usuario y Contraseña
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("token")}
                  className={`flex-1 rounded-md py-1.5 font-medium ${method === "token" ? "bg-card text-foreground shadow" : "text-muted-foreground"}`}
                >
                  Token
                </button>
              </div>

              {method === "credentials" ? (
                <form onSubmit={handleCredentialsLogin} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Usuario</label>
                    <input
                      type="text"
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                  {error && <p className="text-xs text-destructive">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-primary py-2.5 font-display text-xs font-bold uppercase text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "Entrando…" : "Ver mapa en este sitio"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleTokenLogin} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Token Wialon</label>
                    <textarea
                      rows={2}
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-background p-2 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                  {error && <p className="text-xs text-destructive">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-primary py-2.5 font-display text-xs font-bold uppercase text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "Validando…" : "Ver mapa con token"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid de módulos Wialon */}
      <div className="mt-14 grid w-full max-w-4xl gap-4 sm:grid-cols-4">
        {[
          {
            icon: MapPin,
            title: "Mapa en vivo",
            text: "Ubicación en tiempo real, velocidad y sensores de tus unidades.",
          },
          {
            icon: ShieldCheck,
            title: "Historial de rutas",
            text: "Consulta de recorridos por fechas, paradas y kilometraje.",
          },
          {
            icon: Video,
            title: "Cámaras y Video",
            text: "Transmisiones en vivo y descarga de eventos de video satelital.",
          },
          {
            icon: KeyRound,
            title: "Altas y usuarios",
            text: "Creación de geocercas, alertas y gestión de usuarios vía CMS.",
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
