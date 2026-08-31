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

export interface PickupInfo {
  fullName: string;
  phone: string;
}

export interface RenewalInfo {
  fullName: string;
  unitName: string;
}

export interface BillingInfo {
  legalName: string;
  rfc: string;
  taxRegime: string;
  cfdiUse: string;
  fiscalZip: string;
  email: string;
  phone: string;
  fiscalAddress?: string;
}

export interface CartItem {
  id: string;
  variant_id: string;
  quantity: number;
  add_ons?: string[];
  renewal?: RenewalInfo | null;
}

export type NewCartItem = Omit<CartItem, "id"> & { id?: string };

interface CartStore {
  items: CartItem[];
  shippingId: ShippingOption["id"];
  shippingInfo: ShippingInfo | null;
  pickupInfo: PickupInfo | null;
  wantsInvoice: boolean;
  billingInfo: BillingInfo | null;
  addItem: (item: NewCartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateRenewal: (id: string, info: RenewalInfo) => void;
  removeItem: (id: string) => void;
  setShipping: (id: ShippingOption["id"]) => void;
  setShippingInfo: (info: ShippingInfo | null) => void;
  setPickupInfo: (info: PickupInfo | null) => void;
  setWantsInvoice: (value: boolean) => void;
  setBillingInfo: (info: BillingInfo | null) => void;
  clearCart: () => void;
}

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      shippingId: "local",
      shippingInfo: null,
      pickupInfo: null,
      wantsInvoice: false,
      billingInfo: null,

      addItem: ({ variant_id, quantity, add_ons, renewal }) => {
        const items = get().items;
        // Cada renovación es una línea independiente porque lleva los datos de su propio equipo
        if (!renewal) {
          const existing = items.find((i) => i.variant_id === variant_id && !i.renewal);
          if (existing) {
            set({
              items: items.map((i) =>
                i.id === existing.id
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
        }
        set({
          items: [
            ...items,
            {
              id: newId(),
              variant_id,
              quantity,
              add_ons: add_ons ?? [],
              renewal: renewal ?? null,
            },
          ],
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },

      updateRenewal: (id, info) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, renewal: info } : i)),
        }),

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      setShipping: (id) =>
        set(id === "local" ? { shippingId: id, shippingInfo: null } : { shippingId: id }),
      setShippingInfo: (info) => set({ shippingInfo: info }),
      setPickupInfo: (info) => set({ pickupInfo: info }),
      setWantsInvoice: (value) => set({ wantsInvoice: value }),
      setBillingInfo: (info) => set({ billingInfo: info }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "orb-lite-cart",
      version: 2,
      migrate: (state) => {
        const s = state as { items?: Array<Partial<CartItem>> } | undefined;
        return {
          ...(state as object),
          items: (s?.items ?? []).map((i) => ({
            id: i.id ?? newId(),
            variant_id: i.variant_id!,
            quantity: i.quantity ?? 1,
            add_ons: i.add_ons ?? [],
            renewal: i.renewal ?? null,
          })),
        } as CartStore;
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        shippingId: state.shippingId,
        shippingInfo: state.shippingInfo,
        pickupInfo: state.pickupInfo,
        wantsInvoice: state.wantsInvoice,
        billingInfo: state.billingInfo,
      }),
    },
  ),
);

export function addOnById(id: string) {
  return ADD_ONS.find((a) => a.id === id);
}

export interface CartTotals {
  lines: Array<{
    id: string;
    variantId: string;
    title: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
    addOns: Array<{ name: string; price: number }>;
    lineTotal: number;
    isRenewal: boolean;
    renewal: RenewalInfo | null;
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
        id: item.id,
        variantId: item.variant_id,
        title: found.product.title,
        variantName: found.variant.name,
        quantity: item.quantity,
        unitPrice: found.variant.price,
        addOns,
        lineTotal: productAmount + addOnAmount,
        isRenewal: found.product.category === "RENOVATION",
        renewal: item.renewal ?? null,
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
