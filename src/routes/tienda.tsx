import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import { fetchProducts, formatMxn, VOLUME_TIERS } from "@/lib/shopify";
import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/tienda")({
  head: () => ({
    meta: [
      { title: "Tienda ORB-LITE | Equipo GPS con todo incluido $1,450" },
      {
        name: "description",
        content:
          "Compra tu equipo GPS ORB-LITE en $1,450 con instalación, app y 1 año de datos renovable. Precios por lote: 10 equipos a $1,300 y 20+ a $1,200.",
      },
      { property: "og:title", content: "Tienda ORB-LITE | Equipo GPS con todo incluido" },
      {
        property: "og:description",
        content: "Equipo GPS satelital con todo incluido en $1,450 MXN. Descuentos por lote.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TiendaPage,
});

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
          Equipo de rastreo GPS satelital con todo incluido: instalación profesional, app de
          monitoreo 24/7 y <span className="font-bold text-primary">1 año de datos incluido</span>.
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
          A partir del segundo año, renovación del plan de datos: {" "}
          <span className="font-display font-bold uppercase tracking-wide text-primary">$550 MXN/año</span>.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {VOLUME_TIERS.map((tier) => (
            <div
              key={tier.min}
              className="rounded-xl border border-border/60 bg-card p-5 text-center"
            >
              <p className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {tier.label}
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-primary">
                {formatMxn(tier.price)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                por equipo{tier.code ? ` · código ${tier.code} aplicado automáticamente` : ""}
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
