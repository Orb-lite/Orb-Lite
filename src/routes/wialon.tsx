import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LogOut } from "lucide-react";
import { PLATFORM_LABEL, useWialonKeepAlive, useWialonSession, writeSession } from "@/lib/wialon-session";
import { wialonLogout, wialonPing } from "@/lib/wialon.functions";
import orbLiteLogo from "@/assets/orb-lite-logo.png";
import orbFullLogo from "@/assets/orb-full-logo.jpg.asset.json";

export const Route = createFileRoute("/wialon")({
  component: WialonLayout,
});

const tabs = [
  { to: "/wialon/mapa", label: "Mapa", fullOnly: false },
  { to: "/wialon/unidades", label: "Unidades", fullOnly: false },
  { to: "/wialon/historial", label: "Historial", fullOnly: false },
  { to: "/wialon/video", label: "Video", fullOnly: true },
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

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={session?.host === "full" ? orbFullLogo.url : orbLiteLogo.url}
            alt={session ? PLATFORM_LABEL[session.host] : "ORB-LITE"}
            className="h-14 w-auto"
          />
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide">Plataforma de rastreo</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {session
                ? `${session.userName} · ${PLATFORM_LABEL[session.host]}`
                : "Entra con tu cuenta para ver tus unidades en tiempo real."}
            </p>
          </div>
        </div>
        {session ? (
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary"
          >
            <LogOut className="size-4" /> Salir
          </button>
        ) : null}
      </div>

      {session ? (
        <nav className="mt-6 flex flex-wrap gap-2 border-b border-border/60 pb-3 text-sm font-semibold uppercase tracking-wide">
          {tabs
            .filter((tab) => !tab.fullOnly || session.host === "full")
            .map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                className="rounded-md px-3 py-2 text-muted-foreground hover:text-primary"
                activeProps={{ className: "bg-primary/10 text-primary" }}
              >
                {tab.label}
              </Link>
            ))}
        </nav>
      ) : null}

      <div className="mt-8">
        <Outlet />
      </div>
    </main>
  );
}
