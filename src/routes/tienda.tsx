import { createFileRoute } from "@tanstack/react-router";
import { Cpu, MapPin, Satellite, ShieldCheck } from "lucide-react";
import { CatalogGrid } from "@/components/catalog-grid";
import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/tienda")({
  head: () => ({
    meta: [
      { title: "Tienda ORB-LITE | Kits GPS Teltonika FTC927 4G LTE" },
      {
        name: "description",
        content:
          "Compra kits GPS profesionales Teltonika FTC927 4G LTE, servicio completo para usuario final y renovaciones anuales de plataforma y SIM. Entrega incluida en GDL/ZMG.",
      },
      { property: "og:title", content: "Tienda ORB-LITE | Kits GPS Teltonika FTC927" },
      {
        property: "og:description",
        content:
          "Kits para instaladores y flotillas, servicio llave en mano para usuario final y renovaciones anuales.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TiendaPage,
});

const BADGES = [
  { icon: Satellite, label: "4G LTE confiable" },
  { icon: MapPin, label: "Tiempo real" },
  { icon: ShieldCheck, label: "Seguro" },
  { icon: Cpu, label: "Fácil instalación" },
];

function TiendaPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 text-center">
        <h1 className="font-display text-4xl font-bold uppercase italic sm:text-5xl">
          Tienda <span className="text-primary">ORB-LITE</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Kits para instaladores y flotillas, servicio llave en mano para usuario final y
          renovaciones anuales — todo en un solo lugar. Teltonika FTC927 4G LTE CAT 1.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {BADGES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary"
            >
              <Icon className="h-4 w-4" />
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <CatalogGrid />
      </section>

      <CtaBanner />
    </main>
  );
}
