import { createFileRoute } from "@tanstack/react-router";
import { CatalogGrid } from "@/components/catalog-grid";
import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/usuario-final")({
  head: () => ({
    meta: [
      { title: "GPS Satelital para Usuario Final | Servicio Completo ORB-LITE" },
      {
        name: "description",
        content:
          "Rastreo satelital llave en mano por $2,990 MXN IVA incluido: equipo Teltonika FTC927, plataforma, SIM de datos e instalación profesional en GDL/ZMG.",
      },
      { property: "og:title", content: "GPS Satelital Usuario Final | ORB-LITE" },
      {
        property: "og:description",
        content: "Equipo, plataforma, SIM e instalación profesional para tu auto, camioneta o moto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UsuarioFinalPage,
});

function UsuarioFinalPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pb-8 pt-14 text-center">
        <h1 className="font-display text-4xl font-bold uppercase italic sm:text-5xl">
          Servicio completo <span className="text-primary">Usuario Final</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Monitorea tu vehículo desde la app móvil: equipo, plataforma, SIM de datos e instalación
          profesional incluidos.
        </p>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <CatalogGrid initialFilter="B2C" showTabs={false} />
      </section>
      <CtaBanner />
    </main>
  );
}
