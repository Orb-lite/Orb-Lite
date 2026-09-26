import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Route as RouteIcon,
  Layers,
  History,
  LogOut,
  Radio,
} from "lucide-react";
import {
  setStoredWialonSession,
  type WialonSession,
} from "@/lib/wialon-session";
import { useServerFn } from "@tanstack/react-start";
import { wialonLogout } from "@/lib/wialon.functions";
import { toast } from "sonner";

interface PlatformHeaderProps {
  session?: WialonSession | null;
}

export function PlatformHeader({ session }: PlatformHeaderProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const logoutFn = useServerFn(wialonLogout);

  const handleLogout = async () => {
    if (!session) return;
    try {
      await logoutFn({
        data: {
          sid: session.sid,
          host: session.host as any,
        },
      });
    } catch {}
    setStoredWialonSession(null);
    toast.info("Sesión cerrada");
  };

  const tabs = [
    { to: "/wialon/rutas", label: "Rutas", icon: RouteIcon },
    { to: "/wialon/geocercas", label: "Geocercas", icon: Layers },
    { to: "/wialon/historial", label: "Historial", icon: History },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-card/80 p-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      {/* Pestañas de navegación de plataforma */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        <Link
          to="/wialon"
          className="mr-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Panel principal de plataforma"
        >
          <Radio className="size-3.5 text-primary" />
          <span>Plataforma</span>
        </Link>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath.startsWith(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider transition ${
                isActive
                  ? "border border-primary/40 bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Sesión actual y logout */}
      {session ? (
        <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-2 sm:border-0 sm:pt-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="font-semibold text-foreground">
              {session.userName}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
            title="Cerrar sesión de Wialon"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
