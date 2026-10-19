import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Terminal, Shield, ArrowLeft, ExternalLink, Cpu } from "lucide-react";
import { CrmTelemetryTab } from "@/components/crm-telemetry-tab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/wialon/swarm")({
  head: () => ({
    meta: [
      { title: "Swarm de APIs Wialon · Arquitectura y Esquemas | ORB-LITE" },
      {
        name: "description",
        content:
          "Inspector de arquitectura, especificación de contratos y orquestador serverless de la Remote API de Wialon para integraciones de telemetría.",
      },
      { property: "og:title", content: "Swarm de APIs Wialon · ORB-LITE" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: WialonSwarmPage,
});

function WialonSwarmPage() {
  return (
    <div className="space-y-6">
      {/* Barra de navegación superior rápida */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
        <div className="flex items-center gap-3">
          <Link
            to="/wialon"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a Wialon
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Pestaña Técnica: Swarm de APIs
            </span>
            <Badge variant="outline" className="text-[10px] font-mono bg-primary/10 text-primary border-primary/20">
              Acceso Público (Sin login CRM)
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/wialon/comandos"
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Cpu className="h-3.5 w-3.5" /> Comandos TCP
          </Link>
          <span className="text-muted-foreground/40">·</span>
          <a
            href="https://sdk.wialon.com/wiki/en/sidebar/remoteapi/start"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Docs Oficiales Wialon
          </a>
        </div>
      </div>

      {/* Componente Modular Swarm de APIs Wialon */}
      <CrmTelemetryTab />
    </div>
  );
}
