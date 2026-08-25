import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { fetchProductByHandle, formatMxn, VOLUME_TIERS } from "@/lib/shopify";

export const Route = createFileRoute("/product/$handle")({
  head: () => ({
    meta: [
      { title: "Equipo GPS ORB-LITE | Detalle del producto" },
      {
        name: "description",
        content:
          "Detalle del equipo GPS ORB-LITE: instalación profesional, monitoreo 24/7, paro de motor y 1 año de datos incluidos renovable.",
      },
      { property: "og:title", content: "Equipo GPS ORB-LITE" },
      {
        property: "og:description",
        content: "Kit completo de rastreo GPS satelital con instalación y datos incluidos.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const { data: product, isLoading: isFetching } = useQuery({
    queryKey: ["shopify-product", handle],
    queryFn: () => fetchProductByHandle(handle),
  });

  if (isFetching) {
    return <main className="mx-auto max-w-6xl px-5 py-20 text-muted-foreground">Cargando…</main>;
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="text-muted-foreground">Producto no encontrado.</p>
        <Link to="/tienda" className="mt-4 inline-block text-primary underline">
          Volver a la tienda
        </Link>
      </main>
    );
  }

  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || [],
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-secondary/20">
          {image && (
            <img
              src={image.url}
              alt={image.altText ?? product.node.title}
              className="h-full w-full object-cover"
              width={1024}
              height={1024}
            />
          )}
        </div>

        <div className="space-y-6">
          <h1 className="font-display text-3xl font-bold uppercase italic sm:text-4xl">
            {product.node.title}
          </h1>
          <p className="font-display text-4xl font-bold text-primary">
            {formatMxn(parseFloat(product.node.priceRange.minVariantPrice.amount))}
          </p>
          <p className="whitespace-pre-line text-muted-foreground">{product.node.description}</p>

          <div className="rounded-xl border border-border/60 p-4 text-sm">
            <p className="font-display font-bold uppercase tracking-widest">Precios por lote</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              {VOLUME_TIERS.map((tier) => (
                <li key={tier.min}>
                  {tier.label}: <span className="text-primary">{formatMxn(tier.price)}</span> c/u
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="qty" className="text-sm text-muted-foreground">
              Cantidad
            </label>
            <input
              id="qty"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="w-24 rounded-md border border-input bg-background px-3 py-2"
            />
          </div>

          <Button onClick={handleAdd} disabled={isLoading || !variant} size="lg" className="w-full">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Agregar al carrito"}
          </Button>
        </div>
      </div>
    </main>
  );
}
