import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ADD_ONS, IVA_RATE, SHIPPING_OPTIONS, findVariant } from "@/data/catalog";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";

const renewalSchema = z.object({
  fullName: z.string().min(1),
  unitName: z.string().min(1),
});

const shippingInfoSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
});

const pickupInfoSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
});

const billingInfoSchema = z.object({
  legalName: z.string().min(1),
  rfc: z.string().min(1),
  taxRegime: z.string().min(1),
  cfdiUse: z.string().min(1),
  fiscalZip: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
});

const orderSchema = z.object({
  orderId: z.string().min(1).max(64),
  customerNumber: z.number().int().min(500).max(9_999_999).nullish(),
  items: z
    .array(
      z.object({
        id: z.string(),
        variant_id: z.string(),
        quantity: z.number().int().min(1).max(100),
        add_ons: z.array(z.string()).optional(),
        renewal: renewalSchema.nullish(),
      }),
    )
    .min(1)
    .max(50),
  shippingId: z.enum(["local", "national"]),
  shippingInfo: shippingInfoSchema.nullish(),
  pickupInfo: pickupInfoSchema.nullish(),
  wantsInvoice: z.boolean(),
  billingInfo: billingInfoSchema.nullish(),
});

export const notifyNewOrder = createServerFn({ method: "POST" })
  .inputValidator((data) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const shipping =
      SHIPPING_OPTIONS.find((s) => s.id === data.shippingId) ?? SHIPPING_OPTIONS[0]!;

    let productsTotal = 0;
    const lines = data.items.flatMap((item) => {
      const found = findVariant(item.variant_id);
      if (!found) return [];
      const addOns = (item.add_ons ?? [])
        .map((id) => ADD_ONS.find((a) => a.id === id))
        .filter((a): a is NonNullable<typeof a> => Boolean(a))
        .map((a) => ({ name: a.name, price: a.price }));
      const productAmount = found.variant.price * item.quantity;
      const addOnAmount = addOns.reduce((sum, a) => sum + a.price, 0) * item.quantity;
      productsTotal += productAmount + addOnAmount;
      return [
        {
          variantName: found.variant.name,
          title: found.product.title,
          quantity: item.quantity,
          unitPrice: found.variant.price,
          lineTotal: productAmount + addOnAmount,
          addOns,
          isRenewal: found.product.category === "RENOVATION",
          renewal: item.renewal ?? null,
        },
      ];
    });

    if (lines.length === 0) {
      throw new Error("El pedido no contiene productos válidos");
    }

    const total = productsTotal + shipping.price;
    const subtotalWithoutIva = total / (1 + IVA_RATE);
    const isNational = data.shippingId === "national";

    await sendTemplateEmail("nuevo-pedido", "ventas@orb-lite.com", {
      idempotencyKey: `nuevo-pedido-${data.orderId}`,
      templateData: {
        orderId: data.orderId,
        lines,
        shippingLabel: shipping.label,
        shippingPrice: shipping.price,
        productsTotal,
        subtotalWithoutIva,
        iva: total - subtotalWithoutIva,
        total,
        totalItems: data.items.reduce((sum, i) => sum + i.quantity, 0),
        isNational,
        shippingInfo: isNational ? (data.shippingInfo ?? null) : null,
        pickupInfo: !isNational ? (data.pickupInfo ?? null) : null,
        wantsInvoice: data.wantsInvoice,
        billingInfo: data.wantsInvoice ? (data.billingInfo ?? null) : null,
      },
    });

    return { ok: true as const };
  });
