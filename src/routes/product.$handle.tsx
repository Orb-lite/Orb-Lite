import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { fetchProductByHandle, formatMxn } from "@/lib/shopify";

export const Route = createFileRoute("/product/$handle")({
  head: () => ({
    meta: [
      { title: "Equipo GPS ORB-LITE | Detalle del producto" },
      {
        name: "description",
        content:
          "Equipo GPS ORB-LITE OL-01 para negocios de alarmas: monitoreo 24/7, paro de motor y 1 año de plataforma incluido, renovable.",
      },
      { property: "og:title", content: "Equipo GPS ORB-LITE" },
      {
        property: "og:description",
        content: "Equipo GPS OL-01 para instalar en tu negocio de alarmas con plataforma y monitoreo incluidos.",
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

  const variants = useMemo(
    () => product?.node.variants.edges.map((e) => e.node) ?? [],
    [product],
  );

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) ?? variants[0] ?? null,
    [variants, selectedVariantId],
  );

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

  const image = product.node.images.edges[0]?.node;

  const handleAdd = async () => {
    if (!selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
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
            {selectedVariant
              ? formatMxn(parseFloat(selectedVariant.price.amount))
              : formatMxn(parseFloat(product.node.priceRange.minVariantPrice.amount))}
          </p>
          <p className="whitespace-pre-line text-muted-foreground">{product.node.description}</p>

          <div className="rounded-xl border border-border/60 p-4 text-sm">
            <p className="font-display font-bold uppercase tracking-widest">Plataforma y SIM</p>
            <p className="mt-1 text-muted-foreground">
              <span className="font-bold text-primary">1 año incluido</span> con la compra del equipo;
              renovación anual de plataforma{" "}
              <span className="font-bold text-primary">$350 MXN/año</span> y SIM{" "}
              <span className="font-bold text-primary">$550 MXN/año</span>.
            </p>
          </div>

          {variants.length > 1 && (
            <div className="space-y-3 rounded-xl border border-border/60 p-4">
              <p className="font-display text-sm font-bold uppercase tracking-widest">Elige tu paquete</p>
              <div className="flex flex-wrap gap-3">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`rounded-lg border px-4 py-2 text-left text-sm transition-colors ${
                      selectedVariant?.id === variant.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 bg-background hover:border-primary/50"
                    }`}
                  >
                    <span className="block font-semibold">{variant.title}</span>
                    <span className="block text-muted-foreground">{formatMxn(parseFloat(variant.price.amount))}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

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

          <Button onClick={handleAdd} disabled={isLoading || !selectedVariant} size="lg" className="w-full">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Agregar al carrito"}
          </Button>
        </div>
      </div>
    </main>
  );
}
