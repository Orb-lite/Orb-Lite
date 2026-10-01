import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound, MapPin, ShieldCheck, Video, ExternalLink } from "lucide-react";
import { PLATFORM_URLS, useWialonSession } from "@/lib/wialon-session";
import orbLiteLogo from "@/assets/orb-lite-logo.png";
import { PWAInstallButton } from "@/components/pwa-install-button";

export const Route = createFileRoute("/wialon/")({
  head: () => ({
    meta: [
      { title: "Acceso a la plataforma de rastreo | ORB-LITE" },
      {
        name: "description",
        content:
          "Inicia sesión de forma segura en Wialon para consultar tus unidades en vivo, historial y altas.",
      },
      {
        property: "og:title",
        content: "Acceso a la plataforma de rastreo | ORB-LITE",
      },
      {
        property: "og:description",
        content: "Mapa en vivo, unidades, historial y altas de equipos en un solo panel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WialonLoginPage,
});

function WialonLoginPage() {
  const navigate = useNavigate();
  const session = useWialonSession();
  const [host, setHost] = React.useState<"lite" | "full">("lite");

  React.useEffect(() => {
    // Si viene con un access_token directamente en el hash o query, enviar a callback
    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const token = search.get("access_token") ?? hash.get("access_token");
      if (token) {
        void navigate({ to: "/wialon/callback" });
        return;
      }
    }
    if (session) void navigate({ to: "/wialon/mapa" });
  }, [session, navigate]);

  function startWialonLogin() {
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
    <div className="flex min-h-[85vh] flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Logo oficial y título */}
        <div className="text-center mb-6">
          <img
            src={orbLiteLogo}
            alt="ORB-LITE"
            className="h-16 sm:h-20 w-auto mx-auto drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]"
          />
          <h1 className="mt-4 font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground">
            Plataforma Satelital
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
            Monitoreo, telemetría y rastreo satelital en tiempo real.
          </p>
        </div>

        {/* Tarjeta de Inicio de Sesión */}
        <section className="rounded-2xl border border-border/80 bg-card/90 p-5 sm:p-6 shadow-xl backdrop-blur">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Selecciona tu versión
          </label>
          <div className="flex gap-2">
            {(["lite", "full"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setHost(option)}
                className={`flex-1 rounded-xl border py-2.5 px-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${
                  host === option
                    ? "border-primary bg-primary/15 text-primary shadow-sm"
                    : "border-border/80 text-muted-foreground hover:bg-muted"
                }`}
              >
                {option === "lite" ? "ORB-LITE" : "ORB-FULL"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={startWialonLogin}
            className="mt-5 w-full rounded-xl bg-primary px-4 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Iniciar sesión con Wialon
          </button>

          {/* Banner de instalación PWA en celular */}
          <div className="mt-4 pt-4 border-t border-border/60">
            <PWAInstallButton variant="mobile-banner" />
          </div>
        </section>

        {/* Enlace para volver a la página web corporativa */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            ¿Deseas ver la página web, productos o servicios?{" "}
            <a
              href="https://orb-lite.com"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <span>Ir a orb-lite.com</span>
              <ExternalLink className="size-3" />
            </a>
          </p>
        </div>
      </div>

      {/* Características principales */}
      <div className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            icon: MapPin,
            title: "Mapa en vivo",
            text: "Ubicación satelital y velocidad en tiempo real.",
          },
          {
            icon: ShieldCheck,
            title: "Historial",
            text: "Recorridos, paradas y velocidades registradas.",
          },
          {
            icon: Video,
            title: "Cámaras",
            text: "Video en vivo y visualización de cabina.",
          },
          {
            icon: KeyRound,
            title: "Altas y CMS",
            text: "Gestión de unidades, usuarios y accesos.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-border/60 bg-card/40 p-3.5 text-center"
          >
            <div className="mx-auto flex size-8 sm:size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <item.icon className="size-4 sm:size-4.5" />
            </div>
            <h2 className="mt-2 font-display text-xs sm:text-sm font-bold uppercase tracking-wide text-foreground">
              {item.title}
            </h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight hidden sm:block">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
