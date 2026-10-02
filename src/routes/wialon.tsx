import * as React from "react";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, User, Calendar, ShieldCheck, FileText, ChevronDown, ChevronUp } from "lucide-react";
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
  const [showAccountDetails, setShowAccountDetails] = React.useState(false);

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

  const profile = session?.profile;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={session?.host === "full" ? orbFullLogo.url : orbLiteLogo}
            alt={session ? PLATFORM_LABEL[session.host] : "ORB-LITE"}
            className="h-14 w-auto"
          />
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide">
              Plataforma de rastreo
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {session ? (
                <>
                  <span className="font-semibold text-foreground">
                    {profile?.fullName || session.userName}
                  </span>
                  {profile?.customerNumber && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-mono font-bold text-primary">
                      Cliente #{profile.customerNumber}
                    </span>
                  )}
                  {profile?.company && (
                    <span className="text-xs text-muted-foreground">({profile.company})</span>
                  )}
                  <span>·</span>
                  <span className="text-xs">{PLATFORM_LABEL[session.host]}</span>
                </>
              ) : (
                <span>Entra con tu cuenta para ver tus unidades en tiempo real.</span>
              )}
            </div>
          </div>
        </div>

        {session ? (
          <div className="flex items-center gap-2">
            {profile && (
              <button
                type="button"
                onClick={() => setShowAccountDetails((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <User className="size-3.5 text-primary" />
                <span>Mi Cuenta</span>
                {showAccountDetails ? (
                  <ChevronUp className="size-3 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-3 text-muted-foreground" />
                )}
              </button>
            )}

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-bold uppercase text-muted-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="size-3.5" /> Salir
            </button>
          </div>
        ) : null}
      </div>

      {/* Panel desplegable con datos registrados y tablas vinculadas al usuario */}
      {session && profile && showAccountDetails && (
        <section className="mt-4 rounded-xl border border-primary/30 bg-card/95 p-4 shadow-md backdrop-blur">
          <div className="flex flex-wrap items-center justify-between border-b border-border/60 pb-3">
            <div>
              <p className="text-xs font-mono text-primary font-semibold">
                USUARIO VERIFICADO EN SISTEMA
              </p>
              <h2 className="text-sm font-bold text-foreground sm:text-base">
                {profile.fullName} {profile.company ? `· ${profile.company}` : ""}
              </h2>
            </div>
            {profile.customerNumber && (
              <div className="text-right">
                <span className="text-xs text-muted-foreground">ID CRM:</span>{" "}
                <span className="font-mono font-bold text-primary">#{profile.customerNumber}</span>
              </div>
            )}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-2.5">
              <span className="text-muted-foreground">Wialon User ID:</span>
              <p className="font-mono font-semibold text-foreground">{profile.wialonUserId}</p>
              <span className="mt-1 block text-muted-foreground">Usuario satelital:</span>
              <p className="font-mono text-foreground">{profile.wialonUsername}</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-2.5">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3 text-primary" />
                Renovaciones activas:
              </span>
              <p className="font-semibold text-foreground">
                {profile.renewals.length > 0
                  ? `${profile.renewals.length} unidad(es) registrada(s)`
                  : "Sin renovaciones pendientes"}
              </p>
              {profile.renewals.slice(0, 2).map((r) => (
                <p key={r.id} className="mt-0.5 text-[11px] text-muted-foreground truncate">
                  • {r.unit_name || "Equipo"}: vence {r.renewal_date || "N/A"}
                </p>
              ))}
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-2.5">
              <span className="text-muted-foreground flex items-center gap-1">
                <FileText className="size-3 text-primary" />
                Historial de compras:
              </span>
              <p className="font-semibold text-foreground">
                {profile.orders.length > 0
                  ? `${profile.orders.length} pedido(s) en CRM`
                  : "Cuenta sin compras directas"}
              </p>
              {profile.orders.slice(0, 1).map((o) => (
                <p key={o.order_id} className="mt-0.5 text-[11px] text-muted-foreground truncate">
                  Último: {o.order_id} (${o.total} MXN)
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {session ? (
        <nav className="sticky top-[8rem] z-40 -mx-4 mt-6 flex snap-x snap-mandatory gap-2 overflow-x-auto border-b border-border/60 bg-background/95 px-4 py-3 text-sm font-semibold uppercase tracking-wide shadow-[0_8px_20px_-18px_var(--primary)] backdrop-blur sm:top-24 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {tabs
            .filter((tab) => !tab.fullOnly || session.host === "full")
            .map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                className="shrink-0 snap-start whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground hover:text-primary"
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
