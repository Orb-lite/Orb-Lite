import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MessageCircle, ShoppingCart, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import {
  SHIPPING_OPTIONS,
  WHATSAPP_NUMBER,
  formatMxn,
  type Product,
} from "@/data/catalog";
import {
  ShippingForm,
  formatShippingInfo,
  validateShipping,
} from "@/components/shipping-form";
import {
  RenewalForm,
  formatRenewalInfo,
  validateRenewal,
} from "@/components/renewal-form";
import type { ShippingInfo, RenewalInfo } from "@/stores/cartStore";

const NATIONAL = SHIPPING_OPTIONS.find((s) => s.id === "national")!;

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const setShipping = useCartStore((s) => s.setShipping);
  const setShippingInfo = useCartStore((s) => s.setShippingInfo);
  const [variantId, setVariantId] = useState(product.variants[0]!.id);
  const [needsShipping, setNeedsShipping] = useState(false);
  const [info, setInfo] = useState<ShippingInfo | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>> | null>(null);
  const [renewal, setRenewal] = useState<RenewalInfo | null>(null);
  const [renewalKey, setRenewalKey] = useState(0);
  const [renewalErrors, setRenewalErrors] = useState<
    Partial<Record<keyof RenewalInfo, string>> | null
  >(null);

  const variant = product.variants.find((v) => v.id === variantId)!;
  const isDigital = product.category === "RENOVATION";
  const total = variant.price + (!isDigital && needsShipping ? NATIONAL.price : 0);

  const commitShipping = (): RenewalInfo | null | false => {
    if (isDigital) {
      setShipping("local");
      setErrors(null);
      const { data, errors: nextErrors } = validateRenewal(renewal);
      if (!data) {
        setRenewalErrors(nextErrors);
        toast.error("Completa los datos de renovación");
        return false;
      }
      setRenewalErrors(null);
      return data;
    }
    if (!needsShipping) {
      setShipping("local");
      setErrors(null);
      return null;
    }
    const { data, errors: nextErrors } = validateShipping(info);
    if (!data) {
      setErrors(nextErrors);
      toast.error("Revisa los datos de envío");
      return false;
    }
    setErrors(null);
    setShipping("national");
    setShippingInfo(data);
    return null;
  };

  const handleAdd = () => {
    const result = commitShipping();
    if (result === false) return;
    addItem({ variant_id: variant.id, quantity: 1, add_ons: [], renewal: result });
    toast.success("Agregado al carrito", {
      description: result ? `${variant.name} · ${result.unitName}` : variant.name,
    });
    if (isDigital) {
      setRenewal(null);
      setRenewalKey((k) => k + 1);
    }
  };


  const handleWhatsapp = () => {
    if (!commitShipping()) return;
    const shippingLine = isDigital
      ? ""
      : needsShipping
        ? `\n+ ${NATIONAL.label} — ${formatMxn(NATIONAL.price)}`
        : `\n+ ${SHIPPING_OPTIONS[0]!.label} — sin costo`;
    const details = isDigital
      ? renewal
        ? formatRenewalInfo(renewal)
        : ""
      : needsShipping && info
        ? formatShippingInfo(info)
        : "";
    const text = `Hola ORB-LITE, me interesa:\n\n*${product.title}*\n· ${variant.name} — ${formatMxn(
      variant.price,
    )}${shippingLine}\n\nTotal estimado: ${formatMxn(total)} MXN${details}`;
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

        {isDigital && (
          <div className="space-y-3 rounded-xl border border-border/60 p-3">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Datos de renovación
            </p>
            <RenewalForm
              value={renewal}
              onChange={setRenewal}
              errors={renewalErrors ?? undefined}
            />
          </div>
        )}

        {!isDigital && (
        <div className="space-y-3 rounded-xl border border-border/60 p-3">
          <label className="flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={needsShipping}
              onChange={(e) => {
                setNeedsShipping(e.target.checked);
                setErrors(null);
                setShipping(e.target.checked ? "national" : "local");
              }}
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 font-semibold">
                <Truck className="h-4 w-4 text-primary" />
                Envío fuera de Guadalajara
              </span>
              <span className="block text-xs text-muted-foreground">
                {NATIONAL.description}{" "}
                <span className="font-semibold text-primary">+{formatMxn(NATIONAL.price)}</span>
              </span>
            </span>
          </label>

          {needsShipping && (
            <ShippingForm
              value={info}
              onChange={setInfo}
              errors={errors ?? undefined}
            />
          )}
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
