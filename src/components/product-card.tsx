import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { formatMxn, type ShopifyProduct } from "@/lib/shopify";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;

  const minPrice = parseFloat(product.node.priceRange.minVariantPrice.amount);
  const maxPrice = parseFloat(product.node.priceRange.maxVariantPrice.amount);
  const priceLabel = minPrice === maxPrice ? formatMxn(minPrice) : `${formatMxn(minPrice)} – ${formatMxn(maxPrice)}`;

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <Link
        to="/product/$handle"
        params={{ handle: product.node.handle }}
        className="block aspect-square overflow-hidden bg-secondary/20"
      >
        {image && (
          <img
            src={image.url}
            alt={image.altText ?? product.node.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        )}
      </Link>
      <div className="space-y-3 p-5">
        <Link to="/product/$handle" params={{ handle: product.node.handle }}>
          <h3 className="font-display text-xl font-bold uppercase italic">{product.node.title}</h3>
        </Link>
        <p className="line-clamp-3 text-sm text-muted-foreground">{product.node.description}</p>
        <p className="font-display text-2xl font-bold text-primary">{priceLabel}</p>
        <Button onClick={handleAddToCart} disabled={isLoading || !variant} className="w-full">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Agregar al carrito"}
        </Button>
      </div>
    </article>
  );
}
