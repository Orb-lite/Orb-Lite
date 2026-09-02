import { useState } from "react";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  MessageCircle,
  Truck,
  MapPin,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useCartStore,
  computeTotals,
  type ShippingInfo,
  type RenewalInfo,
  type BillingInfo,
  type PickupInfo,
} from "@/stores/cartStore";
import { PickupForm, formatPickupInfo, validatePickup } from "@/components/pickup-form";
import { BillingForm, formatBillingInfo, validateBilling } from "@/components/billing-form";
import { RenewalForm, formatRenewalInfo, validateRenewal } from "@/components/renewal-form";
import { ShippingForm, formatShippingInfo, validateShipping } from "@/components/shipping-form";
import { toast } from "sonner";
import { SHIPPING_OPTIONS, formatMxn } from "@/data/catalog";
import { openWhatsApp } from "@/lib/whatsapp";
import { notifyNewOrder } from "@/lib/order.functions";
import { saveCustomerOrder } from "@/lib/customers.functions";
import { CustomerBlock } from "@/components/customer-block";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    items,
    shippingId,
    shippingInfo,
    pickupInfo,
    setPickupInfo,
    updateQuantity,
    updateRenewal,
    removeItem,
    setShipping,
    setShippingInfo,
    wantsInvoice,
    billingInfo,
    setWantsInvoice,
    setBillingInfo,
    customerNumber,
    setCustomerNumber,
    setIsFirstPurchase,
  } = useCartStore();
  const [billingErrors, setBillingErrors] = useState<
    Partial<Record<keyof BillingInfo, string>> | null
  >(null);
  const [renewalErrors, setRenewalErrors] = useState<
    Record<string, Partial<Record<keyof RenewalInfo, string>>>
  >({});
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>> | null>(null);
  const [pickupErrors, setPickupErrors] = useState<
    Partial<Record<keyof PickupInfo, string>> | null
  >(null);
  const totals = computeTotals(items, shippingId);

  const handleWhatsappCheckout = async () => {
    let details = "";
    const renewalLines = totals.lines.filter((l) => l.isRenewal);
    if (renewalLines.length > 0) {
      const nextErrors: Record<string, Partial<Record<keyof RenewalInfo, string>>> = {};
      for (const line of renewalLines) {
        const { data, errors: lineErrors } = validateRenewal(line.renewal);
        if (!data) {
          nextErrors[line.id] = lineErrors;
        } else {
          updateRenewal(line.id, data);
        }
      }
      if (Object.keys(nextErrors).length > 0) {
        setRenewalErrors(nextErrors);
        toast.error("Completa los datos de renovación de cada equipo");
        return;
      }
      setRenewalErrors({});
      details += renewalLines
        .map((l) => (l.renewal ? formatRenewalInfo(l.renewal) : ""))
        .join("");
    }
    if (shippingId === "national") {
      const { data, errors: nextErrors } = validateShipping(shippingInfo);
      if (!data) {
        setErrors(nextErrors);
        toast.error("Completa los datos de envío");
        return;
      }
      setErrors(null);
      setShippingInfo(data);
      details += formatShippingInfo(data);
    } else if (totals.lines.some((l) => !l.isRenewal)) {
      const { data, errors: nextErrors } = validatePickup(pickupInfo);
      if (!data) {
        setPickupErrors(nextErrors);
        toast.error("Déjanos tu nombre y teléfono para coordinar la entrega");
        return;
      }
      setPickupErrors(null);
      setPickupInfo(data);
      details += formatPickupInfo(data);
    }
    if (wantsInvoice) {
      const { data, errors: nextErrors } = validateBilling(billingInfo);
      if (!data) {
        setBillingErrors(nextErrors);
        toast.error("Completa los datos de facturación");
        return;
      }
      setBillingErrors(null);
      setBillingInfo(data);
      details += formatBillingInfo(data);
    }

    const orderId = `${Date.now().toString(36).toUpperCase()}`;

    // Registro de cliente: asigna número nuevo o acumula la compra en el existente
    let assignedNumber: number | null = customerNumber;
    const contactName = shippingInfo?.fullName ?? pickupInfo?.fullName ?? billingInfo?.legalName;
    const contactPhone = shippingInfo?.phone ?? pickupInfo?.phone ?? billingInfo?.phone;
    if (contactName && contactPhone) {
      try {
        const result = await saveCustomerOrder({
          data: {
            customerNumber: customerNumber ?? null,
            fullName: contactName,
            phone: contactPhone,
            email: billingInfo?.email ?? null,
            contact: shippingInfo
              ? {
                  fullName: shippingInfo.fullName,
                  phone: shippingInfo.phone,
                  city: shippingInfo.city,
                  state: shippingInfo.state,
                  zip: shippingInfo.zip,
                }
              : pickupInfo
                ? { fullName: pickupInfo.fullName, phone: pickupInfo.phone }
                : null,
            billing: wantsInvoice ? billingInfo : null,
            orderId,
            orderTotal: totals.total,
          },
        });
        assignedNumber = result.customerNumber;
        setCustomerNumber(result.customerNumber);
        setIsFirstPurchase(false);
        toast.success(
          result.isNew
            ? `Tu número de cliente es #${result.customerNumber}. Guárdalo para acumular compras y acceder a promociones.`
            : `Compra acumulada al cliente #${result.customerNumber}.`,
        );
      } catch (error) {
        console.error("No se pudo registrar el cliente", error);
      }
    }
    if (assignedNumber) {
      details = `\n\n*Cliente ORB-LITE:* #${assignedNumber}` + details;
    }

    const lines = totals.lines
      .map(
        (l) =>
          `• ${l.variantName} x${l.quantity} — ${formatMxn(l.unitPrice * l.quantity)}` +
          (l.renewal ? `\n   Unidad: ${l.renewal.unitName} (${l.renewal.fullName})` : "") +
          l.addOns.map((a) => `\n   + ${a.name} — ${formatMxn(a.price * l.quantity)}`).join(""),
      )
      .join("\n");

    const text =
      `Hola ORB-LITE, quiero finalizar este pedido:\n\n${lines}\n\n` +
      `Entrega: ${totals.shipping.label} (${formatMxn(totals.shipping.price)})\n` +
      `Subtotal sin IVA: ${formatMxn(totals.subtotalWithoutIva)}\n` +
      `IVA (16%): ${formatMxn(totals.iva)}\n` +
      `*TOTAL: ${formatMxn(totals.total)} MXN*${details}`;

    // Registra el pedido por correo (bitácora de ventas). Si el correo falla,
    // el pedido por WhatsApp continúa de todas formas.
    try {
      await notifyNewOrder({
        data: {
          orderId,
          items: items.map((i) => ({
            id: i.id,
            variant_id: i.variant_id,
            quantity: i.quantity,
            add_ons: i.add_ons ?? [],
            renewal: i.renewal ?? null,
          })),
          shippingId,
          shippingInfo: shippingId === "national" ? shippingInfo : null,
          pickupInfo: shippingId === "local" ? pickupInfo : null,
          wantsInvoice,
          billingInfo: wantsInvoice ? billingInfo : null,
        },
      });
      toast.success("Pedido registrado, lo recibirás por WhatsApp");
    } catch (error) {
      console.error("No se pudo enviar el correo de pedido", error);
    }

    openWhatsApp(text);
    setIsOpen(false);
  };


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totals.totalItems > 0 && (
            <Badge className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full p-0 text-xs">
              {totals.totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col sm:max-w-lg">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Tu carrito</SheetTitle>
          <SheetDescription>
            {totals.totalItems === 0
              ? "Tu carrito está vacío"
              : `${totals.totalItems} artículo${totals.totalItems !== 1 ? "s" : ""} · ${formatMxn(totals.total)}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col pt-4">
          {totals.lines.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-center">
              <div>
                <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Agrega un kit para comenzar</p>
              </div>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
                {totals.lines.map((line) => (
                  <motion.div
                    key={line.id}
                    layout
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl border border-border/60 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{line.variantName}</p>
                        <p className="truncate text-xs text-muted-foreground">{line.title}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => removeItem(line.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {line.addOns.length > 0 && (
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        {line.addOns.map((a) => (
                          <li key={a.name}>
                            + {a.name} — {formatMxn(a.price)}
                          </li>
                        ))}
                      </ul>
                    )}

                    {line.isRenewal && (
                      <div className="mt-3 space-y-2 rounded-lg border border-border/60 p-3">
                        <p className="font-display text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                          Datos del equipo
                        </p>
                        <RenewalForm
                          value={line.renewal}
                          onChange={(info) => updateRenewal(line.id, info)}
                          errors={renewalErrors[line.id]}
                        />
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{line.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-display font-bold text-primary">
                        {formatMxn(line.lineTotal)}
                      </span>
                    </div>
                  </motion.div>
                ))}

                <CustomerBlock />

                <div className="space-y-2">

                  <p className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Método de entrega
                  </p>
                  {SHIPPING_OPTIONS.map((opt) => {
                    const active = opt.id === shippingId;
                    const Icon = opt.id === "local" ? MapPin : Truck;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setShipping(opt.id)}
                        className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                          active ? "border-primary bg-primary/10" : "border-border/60"
                        }`}
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold">{opt.label}</span>
                          <span className="block text-xs text-muted-foreground">
                            {opt.description}
                          </span>
                        </span>
                        <span className="shrink-0 font-display font-bold text-primary">
                          {opt.price === 0 ? "$0" : `+${formatMxn(opt.price)}`}
                        </span>
                      </button>
                    );
                  })}

                  {shippingId === "local" && totals.lines.some((l) => !l.isRenewal) && (
                    <div className="space-y-3 rounded-xl border border-border/60 p-3">
                      <p className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Datos de contacto para la entrega
                      </p>
                      <PickupForm
                        value={pickupInfo}
                        onChange={setPickupInfo}
                        errors={pickupErrors ?? undefined}
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Te contactamos para coordinar la entrega.
                      </p>
                    </div>
                  )}

                  {shippingId === "national" && (
                    <div className="space-y-3 rounded-xl border border-border/60 p-3">
                      <p className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Datos de envío
                      </p>
                      <ShippingForm
                        value={shippingInfo}
                        onChange={setShippingInfo}
                        errors={errors ?? undefined}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3 rounded-xl border border-border/60 p-3">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={wantsInvoice}
                      onChange={(e) => setWantsInvoice(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <FileText className="h-4 w-4 text-primary" />
                        Requiero factura (CFDI 4.0)
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Captura tus datos fiscales para emitirla al registrar tu compra.
                      </span>
                    </span>
                  </label>

                  {wantsInvoice && (
                    <div className="space-y-3 border-t border-border/60 pt-3">
                      <p className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Datos de facturación
                      </p>
                      <BillingForm
                        value={billingInfo}
                        onChange={setBillingInfo}
                        errors={billingErrors ?? undefined}
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Necesitamos razón social, RFC, régimen fiscal, uso de CFDI, C.P. fiscal y
                        correo para emitir tu factura.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 space-y-2 border-t border-border/60 bg-background pt-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Productos</span>
                  <span>{formatMxn(totals.productsTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Envío</span>
                  <span>{formatMxn(totals.shipping.price)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal sin IVA</span>
                  <span>{formatMxn(totals.subtotalWithoutIva)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>IVA (16%)</span>
                  <span>{formatMxn(totals.iva)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-2">
                  <span className="font-display text-lg font-bold uppercase">Total</span>
                  <span className="font-display text-2xl font-bold text-primary">
                    {formatMxn(totals.total)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Precios en MXN: todos los paquetes ya incluyen el 16% de IVA y la factura se
                  incluye al registrar la compra en sistema. Al realizar tu pedido aceptas el uso de
                  datos y condiciones del sitio.
                </p>

                <Button onClick={handleWhatsappCheckout} className="w-full" size="lg">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Realizar solicitud
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
