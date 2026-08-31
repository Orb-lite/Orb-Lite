import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { CatalogGrid } from "@/components/catalog-grid";
import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/renovaciones")({
  head: () => ({
    meta: [
      { title: "Renovaciones Anuales | Plataforma $350 y SIM $500 — ORB-LITE" },
      {
        name: "description",
        content:
          "Renueva tu servicio ORB-LITE: plataforma de monitoreo por 1 año en $350 MXN y SIM 30MB anual en $500 MXN. Activación inmediata.",
      },
      { property: "og:title", content: "Renovaciones Anuales ORB-LITE" },
      {
        property: "og:description",
        content: "Plataforma 1 año $350 MXN · SIM 30MB anual $500 MXN.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RenovacionesPage,
});

function RenovacionesPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pb-8 pt-14 text-center">
        <RefreshCw className="mx-auto mb-4 h-10 w-10 text-primary" />
        <h1 className="font-display text-4xl font-bold uppercase italic sm:text-5xl">
          Renovaciones <span className="text-primary">Anuales</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Mantén activa la plataforma de monitoreo y los datos de tu SIM sin contratos forzosos.
        </p>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <CatalogGrid initialFilter="RENOVATION" showTabs={false} />
      </section>
      <CtaBanner />
    </main>
  );
}
