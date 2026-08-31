import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ADD_ONS,
  IVA_RATE,
  SHIPPING_OPTIONS,
  findVariant,
  type ShippingOption,
} from "@/data/catalog";

export interface ShippingInfo {
  fullName: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
}

export interface RenewalInfo {
  fullName: string;
  unitName: string;
}

export interface CartItem {
  variant_id: string;
  quantity: number;
  add_ons?: string[];
}

interface CartStore {
  items: CartItem[];
  shippingId: ShippingOption["id"];
  shippingInfo: ShippingInfo | null;
  renewalInfo: RenewalInfo | null;
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  setShipping: (id: ShippingOption["id"]) => void;
  setShippingInfo: (info: ShippingInfo | null) => void;
  setRenewalInfo: (info: RenewalInfo | null) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      shippingId: "local",
      shippingInfo: null,
      renewalInfo: null,

      addItem: ({ variant_id, quantity, add_ons }) => {
        const items = get().items;
        const existing = items.find((i) => i.variant_id === variant_id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.variant_id === variant_id
                ? {
                    ...i,
                    quantity: i.quantity + quantity,
                    add_ons: Array.from(new Set([...(i.add_ons ?? []), ...(add_ons ?? [])])),
                  }
                : i,
            ),
          });
          return;
        }
        set({ items: [...items, { variant_id, quantity, add_ons: add_ons ?? [] }] });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.variant_id === variantId ? { ...i, quantity } : i,
          ),
        });
      },

      removeItem: (variantId) =>
        set({ items: get().items.filter((i) => i.variant_id !== variantId) }),

      setShipping: (id) =>
        set(id === "local" ? { shippingId: id, shippingInfo: null } : { shippingId: id }),
      setShippingInfo: (info) => set({ shippingInfo: info }),
      setRenewalInfo: (info) => set({ renewalInfo: info }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "orb-lite-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        shippingId: state.shippingId,
        shippingInfo: state.shippingInfo,
        renewalInfo: state.renewalInfo,
      }),
    },
  ),
);

export function addOnById(id: string) {
  return ADD_ONS.find((a) => a.id === id);
}

export interface CartTotals {
  lines: Array<{
    variantId: string;
    title: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
    addOns: Array<{ name: string; price: number }>;
    lineTotal: number;
  }>;
  productsTotal: number;
  addOnsTotal: number;
  shipping: ShippingOption;
  total: number;
  subtotalWithoutIva: number;
  iva: number;
  totalItems: number;
}

export function computeTotals(items: CartItem[], shippingId: ShippingOption["id"]): CartTotals {
  const shipping = SHIPPING_OPTIONS.find((s) => s.id === shippingId) ?? SHIPPING_OPTIONS[0]!;

  let productsTotal = 0;
  let addOnsTotal = 0;

  const lines = items.flatMap((item) => {
    const found = findVariant(item.variant_id);
    if (!found) return [];
    const addOns = (item.add_ons ?? [])
      .map((id) => addOnById(id))
      .filter((a): a is NonNullable<typeof a> => Boolean(a))
      .map((a) => ({ name: a.name, price: a.price }));

    const productAmount = found.variant.price * item.quantity;
    const addOnAmount = addOns.reduce((sum, a) => sum + a.price, 0) * item.quantity;
    productsTotal += productAmount;
    addOnsTotal += addOnAmount;

    return [
      {
        variantId: item.variant_id,
        title: found.product.title,
        variantName: found.variant.name,
        quantity: item.quantity,
        unitPrice: found.variant.price,
        addOns,
        lineTotal: productAmount + addOnAmount,
      },
    ];
  });

  const total = productsTotal + addOnsTotal + shipping.price;
  const subtotalWithoutIva = total / (1 + IVA_RATE);

  return {
    lines,
    productsTotal,
    addOnsTotal,
    shipping,
    total,
    subtotalWithoutIva,
    iva: total - subtotalWithoutIva,
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}
