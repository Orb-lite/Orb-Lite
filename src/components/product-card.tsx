import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MessageCircle, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import {
  ADD_ONS,
  WHATSAPP_NUMBER,
  formatMxn,
  type Product,
} from "@/data/catalog";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [variantId, setVariantId] = useState(product.variants[0]!.id);
  const [addOns, setAddOns] = useState<string[]>([]);

  const variant = product.variants.find((v) => v.id === variantId)!;
  const isRenovation = product.category === "RENOVATION";
  const addOnsTotal = addOns
    .map((id) => ADD_ONS.find((a) => a.id === id)?.price ?? 0)
    .reduce((a, b) => a + b, 0);
  const total = variant.price + addOnsTotal;

  const toggleAddOn = (id: string) =>
    setAddOns((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  const handleAdd = () => {
    addItem({ variant_id: variant.id, quantity: 1, add_ons: addOns });
    toast.success("Agregado al carrito", { description: variant.name });
  };

  const handleWhatsapp = () => {
    const extras = addOns
      .map((id) => ADD_ONS.find((a) => a.id === id))
      .filter(Boolean)
      .map((a) => `\n  + ${a!.name} — ${formatMxn(a!.price)}`)
      .join("");
    const text = `Hola ORB-LITE, me interesa:\n\n*${product.title}*\n· ${variant.name} — ${formatMxn(
      variant.price,
    )}${extras}\n\nTotal estimado: ${formatMxn(total)} MXN`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_8%,transparent)] backdrop-blur transition-shadow hover:border-primary/60 hover:shadow-[0_0_35px_-10px_color-mix(in_oklab,var(--primary)_45%,transparent)]"
    >
      <div className="aspect-[4/3] overflow-hidden bg-secondary/20">
        <img
          src={product.image_url}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <h3 className="font-display text-lg font-bold uppercase italic leading-tight">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>

        <ul className="flex flex-wrap gap-2">
          {product.features.map((f) => (
            <li
              key={f}
              className="rounded-full border border-primary/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary"
            >
              {f}
            </li>
          ))}
        </ul>

        {product.variants.length > 1 && (
          <div className="space-y-2">
            {product.variants.map((v) => {
              const active = v.id === variantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border/60 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{v.name}</p>
                      {v.badge && (
                        <p className="text-[11px] uppercase tracking-wide text-primary">{v.badge}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      {v.original_price && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatMxn(v.original_price)}
                        </p>
                      )}
                      <p className="font-display font-bold text-primary">{formatMxn(v.price)}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.ul
            key={variant.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-1 text-sm text-muted-foreground"
          >
            {variant.includes.map((inc) => (
              <li key={inc} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{inc}</span>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>

        {!isRenovation && (
          <div className="space-y-2 rounded-xl border border-border/60 p-3">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Agregar renovaciones
            </p>
            {ADD_ONS.map((a) => (
              <label key={a.id} className="flex cursor-pointer items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={addOns.includes(a.id)}
                  onChange={() => toggleAddOn(a.id)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
                />
                <span className="min-w-0 flex-1">
                  {a.name}{" "}
                  <span className="font-semibold text-primary">+{formatMxn(a.price)}</span>
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="mt-auto space-y-3 border-t border-border/60 pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Total</span>
            <span className="font-display text-2xl font-bold text-primary">{formatMxn(total)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Precio con IVA incluido. Solicita factura al contactarnos.
          </p>
          <Button onClick={handleAdd} className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Agregar al carrito
          </Button>
          <Button onClick={handleWhatsapp} variant="outline" className="w-full">
            <MessageCircle className="mr-2 h-4 w-4" />
            Comprar por WhatsApp
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
