import { createFileRoute } from "@tanstack/react-router";
import { CatalogGrid } from "@/components/catalog-grid";
import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/kit-instaladores")({
  head: () => ({
    meta: [
      { title: "Kit GPS para Instaladores | Teltonika FTC927 4G LTE — ORB-LITE" },
      {
        name: "description",
        content:
          "Kit GPS profesional Teltonika FTC927 4G LTE CAT 1 para instaladores y flotillas. Desde $1,160 MXN IVA incluido, con SIM 30MB y plataforma ORB-LITE opcional.",
      },
      { property: "og:title", content: "Kit GPS para Instaladores | ORB-LITE" },
      {
        property: "og:description",
        content: "Equipo, SIM 30MB y plataforma ORB-LITE por 1 año. Precios de mayoreo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KitPage,
});

function KitPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pb-8 pt-14 text-center">
        <h1 className="font-display text-4xl font-bold uppercase italic sm:text-5xl">
          Kit para <span className="text-primary">Instaladores y Flotillas</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Elige el plan que se adapta a tu operación: solo equipo, equipo con SIM o kit completo con
          plataforma ORB-LITE por 1 año.
        </p>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <CatalogGrid initialFilter="B2B" showTabs={false} />
      </section>
      <CtaBanner />
    </main>
  );
}
