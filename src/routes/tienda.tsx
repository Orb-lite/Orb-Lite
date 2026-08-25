import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import { fetchProducts, formatMxn } from "@/lib/shopify";
import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/tienda")({
  head: () => ({
    meta: [
      { title: "Tienda ORB-LITE | Equipo GPS con todo incluido" },
      {
        name: "description",
        content:
          "Compra tu equipo GPS ORB-LITE. Elige paquete con SIM global M2M + 1 año de plataforma a $1,500 MXN, o sin SIM + 1 año de plataforma a $1,350 MXN.",
      },
      { property: "og:title", content: "Tienda ORB-LITE | Equipo GPS con todo incluido" },
      {
        property: "og:description",
        content: "Equipo GPS satelital con instalación profesional, app de monitoreo 24/7 y 1 año de plataforma incluido.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TiendaPage,
});

const PACKAGES = [
  {
    label: "Con SIM global M2M",
    sublabel: "Equipo + 1 año de plataforma",
    price: 1500,
  },
  {
    label: "Sin SIM",
    sublabel: "Equipo + 1 año de plataforma",
    price: 1350,
  },
];

function TiendaPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["shopify-products"],
    queryFn: () => fetchProducts(20),
  });

  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 text-center">
        <h1 className="font-display text-4xl font-bold uppercase italic sm:text-5xl">
          Tienda <span className="text-primary">ORB-LITE</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Equipo de rastreo GPS satelital OL-01 para que lo instales en tu negocio de alarmas, app de
          monitoreo 24/7 y <span className="font-bold text-primary">1 año de plataforma incluido</span>.
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
          Renovación anual:{" "}
          <span className="font-display font-bold uppercase tracking-wide text-primary">plataforma $350 MXN/año</span>{" "}
          y <span className="font-display font-bold uppercase tracking-wide text-primary">SIM $550 MXN/año</span>.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.label}
              className="rounded-xl border border-border/60 bg-card p-5 text-center"
            >
              <p className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {pkg.label}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{pkg.sublabel}</p>
              <p className="mt-2 font-display text-3xl font-bold text-primary">
                {formatMxn(pkg.price)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Precio más IVA en caso de requerir factura.{" "}
                <Link to="/contacto" className="underline hover:text-primary">
                  Contáctanos para generarla.
                </Link>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Cargando productos…</p>
        ) : products && products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No hay productos disponibles.</p>
        )}
      </section>

      <CtaBanner />
    </main>
  );
}
