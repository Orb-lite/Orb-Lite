import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useWialonSession } from "@/lib/wialon-session";

export const Route = createFileRoute("/plataforma")({
  head: () => ({
    meta: [
      { title: "Plataforma de Rastreo Satelital | ORB-LITE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PlataformaPage,
});

function PlataformaPage() {
  const navigate = useNavigate();
  const session = useWialonSession();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const token = search.get("access_token") ?? hash.get("access_token");
      if (token) {
        void navigate({ to: "/wialon/callback" });
        return;
      }
    }

    if (session === undefined) return;
    if (session) {
      void navigate({ to: "/wialon/mapa" });
    } else {
      void navigate({ to: "/wialon" });
    }
  }, [session, navigate]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <h2 className="mt-4 font-display text-lg font-bold uppercase tracking-wide">
        Cargando plataforma de rastreo…
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Accediendo a tus unidades satelitales.</p>
    </div>
  );
}
