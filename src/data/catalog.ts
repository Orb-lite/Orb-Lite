import equipoSim from "@/assets/equipo-gps-sim.jpg";
import equipoNoSim from "@/assets/equipo-gps-nosim.jpg";
import equipoGps from "@/assets/equipo-gps.jpg";

export type ProductCategory = "B2B" | "B2C" | "RENOVATION";

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price: number;
  original_price?: number;
  badge?: string;
  includes: string[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: ProductCategory;
  description: string;
  image_url: string;
  features: string[];
  variants: ProductVariant[];
}

export interface ShippingOption {
  id: "local" | "national";
  label: string;
  price: number;
  description: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const IVA_RATE = 0.16;

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "local",
    label: "Entrega / Instalación en Guadalajara (ZMG)",
    price: 0,
    description:
      "Entrega física o instalación directa incluida en la zona metropolitana de Guadalajara.",
  },
  {
    id: "national",
    label: "Envío Foráneo (Resto de la República Mexicana)",
    price: 450,
    description:
      "Envío rápido asegurado por paquetería express a cualquier ciudad de México.",
  },
];

export const ADD_ONS: AddOn[] = [
  {
    id: "renov-plataforma",
    name: "Renovación de Plataforma ORB-LITE (1 año)",
    price: 350,
    description: "Acceso a la plataforma y app de monitoreo por 12 meses.",
  },
  {
    id: "renov-sim",
    name: "Renovación Anual SIM 30MB",
    price: 500,
    description: "Datos M2M multi carrier por 12 meses.",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "kit-instaladores",
    title: "Kit GPS Profesional para Instaladores — Teltonika FTC927 (4G LTE CAT 1)",
    slug: "kit-gps-instaladores",
    category: "B2B",
    description:
      "Rastreador GPS profesional ideal para flotillas, autos, motos y maquinaria pesada. Elige el plan que mejor se adapte a tu operación.",
    image_url: equipoSim,
    features: [
      "4G LTE confiable",
      "Rastreo en tiempo real",
      "Sistema seguro",
      "Fácil instalación",
    ],
    variants: [
      {
        id: "kit-op1",
        product_id: "kit-instaladores",
        name: "Opción 1: ¿Ya tienes plataforma?",
        price: 1508,
        badge: "Conéctalo a tu propia plataforma",
        includes: ["Equipo Teltonika FTC927", "SIM 30MB"],
      },
      {
        id: "kit-op2",
        product_id: "kit-instaladores",
        name: "Opción 2: Kit Completo ORB-LITE (Promoción)",
        price: 1682,
        original_price: 1740,
        badge: "¡Ahorra hoy! · Recomendado",
        includes: [
          "Equipo Teltonika FTC927",
          "SIM 30MB",
          "Plataforma ORB-LITE por 1 año",
        ],
      },
      {
        id: "kit-op3",
        product_id: "kit-instaladores",
        name: "Opción 3: Solo Equipo FTC927",
        price: 1160,
        badge: "Ideal si ya tienes SIM y plataforma",
        includes: ["Hardware Teltonika FTC927"],
      },
    ],
  },
  {
    id: "usuario-final",
    title: "GPS Satelital ORB-LITE — Servicio Completo Usuario Final",
    slug: "gps-usuario-final",
    category: "B2C",
    description:
      "Solución llave en mano de rastreo satelital con monitoreo en app móvil para autos particulares, camionetas o motocicletas.",
    image_url: equipoNoSim,
    features: [
      "Instalación profesional",
      "App móvil de monitoreo",
      "SIM de datos incluida",
      "Soporte técnico",
    ],
    variants: [
      {
        id: "b2c-full",
        product_id: "usuario-final",
        name: "Servicio Completo Usuario Final",
        price: 2990,
        badge: "Todo incluido",
        includes: [
          "Equipo Teltonika FTC927",
          "Servicio de plataforma",
          "SIM de datos",
          "Instalación profesional",
        ],
      },
    ],
  },
  {
    id: "renovaciones",
    title: "Renovaciones Anuales ORB-LITE",
    slug: "renovaciones-anuales",
    category: "RENOVATION",
    description:
      "Mantén activo tu servicio: renueva la plataforma de monitoreo y los datos de tu SIM cada año.",
    image_url: equipoGps,
    features: ["Sin contratos forzosos", "Activación inmediata", "Soporte incluido"],
    variants: [
      {
        id: "renov-plataforma",
        product_id: "renovaciones",
        name: "Renovación de Plataforma ORB-LITE (1 año)",
        price: 350,
        badge: "12 meses de plataforma",
        includes: ["Acceso a plataforma web y app por 1 año"],
      },
      {
        id: "renov-sim",
        product_id: "renovaciones",
        name: "Renovación Anual SIM 30MB",
        price: 500,
        badge: "12 meses de datos",
        includes: ["SIM 30MB M2M activa por 1 año"],
      },
    ],
  },
];

export const WHATSAPP_NUMBER = "523318359421";

export function formatMxn(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function findVariant(variantId: string) {
  for (const product of PRODUCTS) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}
