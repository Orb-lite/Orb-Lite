import { PWAInstallButton } from "@/components/pwa-install-button";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LogOut } from "lucide-react";
import {
  PLATFORM_LABEL,
  useWialonKeepAlive,
  useWialonSession,
  writeSession,
} from "@/lib/wialon-session";
import { wialonLogout, wialonPing } from "@/lib/wialon.functions";
import orbLiteLogo from "@/assets/orb-lite-logo.png";
import orbFullLogo from "@/assets/orb-full-logo.jpg.asset.json";

export const Route = createFileRoute("/wialon")({
  component: WialonLayout,
});

const tabs = [
  { to: "/wialon/mapa", label: "Mapa", fullOnly: false },
  { to: "/wialon/geocercas", label: "Geocercas", fullOnly: false },
  { to: "/wialon/rutas", label: "Rutas", fullOnly: false },
  { to: "/wialon/compartir", label: "Compartir", fullOnly: false },
  { to: "/wialon/unidades", label: "Unidades", fullOnly: false },
  { to: "/wialon/historial", label: "Historial", fullOnly: false },
  { to: "/wialon/reportes", label: "Reportes", fullOnly: false },
  { to: "/wialon/video", label: "Cámaras", fullOnly: false },
  { to: "/wialon/cms", label: "Altas (CMS)", fullOnly: false },
] as const;

function WialonLayout() {
  const session = useWialonSession();
  const logout = useServerFn(wialonLogout);
  const ping = useServerFn(wialonPing);
  const navigate = useNavigate();

  useWialonKeepAlive(session, ping);

  async function onLogout() {
    if (session) {
      try {
        await logout({ data: { host: session.host, sid: session.sid } });
      } catch {
        // sesión ya cerrada
      }
    }
    writeSession(null);
    void navigate({ to: "/wialon" });
  }

  // Si no hay sesión iniciada, mostrar directamente la pantalla de login limpia y enfocada
  if (!session) {
    return <Outlet />;
  }

  return (
    <main className="mx-auto max-w-6xl px-3 py-4 sm:px-5 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <img
            src={session.host === "full" ? orbFullLogo.url : orbLiteLogo}
            alt={PLATFORM_LABEL[session.host]}
            className="h-10 sm:h-12 w-auto"
          />
          <div>
            <h1 className="font-display text-lg sm:text-2xl font-bold uppercase tracking-wide flex items-center gap-2">
              Plataforma Satelital
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30">
                {PLATFORM_LABEL[session.host]}
              </span>
            </h1>
            <p className="text-xs text-muted-foreground">
              Conectado como <strong className="text-foreground">{session.userName}</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PWAInstallButton variant="header" />
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive transition"
          >
            <LogOut className="size-3.5" /> Salir
          </button>
        </div>
      </div>

      <div className="mt-2 mb-2 sm:hidden">
        <PWAInstallButton variant="mobile-banner" />
      </div>

      <nav className="sticky top-0 z-40 -mx-3 flex snap-x snap-mandatory gap-1.5 overflow-x-auto border-b border-border/60 bg-background/95 px-3 py-2.5 text-xs font-bold uppercase tracking-wider shadow-[0_8px_20px_-18px_var(--primary)] backdrop-blur sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:text-sm">
        {tabs
          .filter((tab) => !tab.fullOnly || session.host === "full")
          .map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className="shrink-0 snap-start whitespace-nowrap rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted/80 hover:text-primary transition"
              activeProps={{ className: "bg-primary/15 text-primary border border-primary/30" }}
            >
              {tab.label}
            </Link>
          ))}
      </nav>

      <div className="mt-4 sm:mt-6">
        <Outlet />
      </div>
    </main>
  );
}
}
