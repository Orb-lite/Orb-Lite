import { useState } from "react";
import { z } from "zod";
import type { ShippingInfo } from "@/stores/cartStore";

export const shippingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: "Escribe el nombre completo" })
    .max(100, { message: "Máximo 100 caracteres" }),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+-]{10,20}$/, { message: "Teléfono a 10 dígitos" }),
  email: z
    .string()
    .trim()
    .max(150)
    .email({ message: "Escribe un correo válido" }),
  city: z.string().trim().min(3, { message: "Ciudad" }).max(100),
  state: z.string().trim().min(3, { message: "Estado" }).max(100),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, { message: "C.P. de 5 dígitos" }),
});

const FIELDS: Array<{ name: keyof ShippingInfo; label: string; full?: boolean }> = [
  { name: "fullName", label: "Nombre completo", full: true },
  { name: "phone", label: "Teléfono" },
  { name: "email", label: "Correo electrónico", full: true },
  { name: "zip", label: "Código postal" },
  { name: "city", label: "Ciudad" },
  { name: "state", label: "Estado" },
];

const EMPTY: ShippingInfo = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  state: "",
  zip: "",
};

export function ShippingForm({
  value,
  onChange,
  errors,
}: {
  value: ShippingInfo | null;
  onChange: (info: ShippingInfo) => void;
  errors?: Partial<Record<keyof ShippingInfo, string>> | undefined;
}) {
  const [local, setLocal] = useState<ShippingInfo>(value ?? EMPTY);

  const update = (name: keyof ShippingInfo, val: string) => {
    const next = { ...local, [name]: val };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {FIELDS.map((f) => (
        <label key={f.name} className={f.full ? "sm:col-span-2" : undefined}>
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {f.label}
          </span>
          <input
            type="text"
            value={local[f.name] ?? ""}
            onChange={(e) => update(f.name, e.target.value)}
            maxLength={150}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          {errors?.[f.name] && (
            <span className="mt-1 block text-[11px] text-destructive">{errors[f.name]}</span>
          )}
        </label>
      ))}
    </div>
  );
}

export function validateShipping(info: ShippingInfo | null) {
  const result = shippingSchema.safeParse(info ?? EMPTY);
  if (result.success) return { data: result.data as ShippingInfo, errors: null };
  const errors: Partial<Record<keyof ShippingInfo, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ShippingInfo;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { data: null, errors };
}

export function formatShippingInfo(info: ShippingInfo) {
  return (
    `\n\n*Datos de envío*\n${info.fullName}\nTel: ${info.phone}\nCorreo: ${info.email}\n` +
    `${info.city}, ${info.state}, C.P. ${info.zip}`
  );
}
