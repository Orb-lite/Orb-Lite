import { useState } from "react";
import { z } from "zod";
import type { PickupInfo } from "@/stores/cartStore";

export const pickupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: "Escribe el nombre completo" })
    .max(100, { message: "Máximo 100 caracteres" }),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+-]{10,20}$/, { message: "Teléfono a 10 dígitos" }),
});

const EMPTY: PickupInfo = { fullName: "", phone: "" };

const FIELDS: Array<{ name: keyof PickupInfo; label: string; full?: boolean }> = [
  { name: "fullName", label: "Nombre completo", full: true },
  { name: "phone", label: "Teléfono de contacto" },
];

export function PickupForm({
  value,
  onChange,
  errors,
}: {
  value: PickupInfo | null;
  onChange: (info: PickupInfo) => void;
  errors?: Partial<Record<keyof PickupInfo, string>> | undefined;
}) {
  const [local, setLocal] = useState<PickupInfo>(value ?? EMPTY);

  const update = (name: keyof PickupInfo, val: string) => {
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

export function validatePickup(info: PickupInfo | null) {
  const result = pickupSchema.safeParse(info ?? EMPTY);
  if (result.success) return { data: result.data as PickupInfo, errors: null };
  const errors: Partial<Record<keyof PickupInfo, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof PickupInfo;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { data: null, errors };
}

export function formatPickupInfo(info: PickupInfo) {
  return `\n\n*Datos de contacto para entrega*\n${info.fullName}\nTel: ${info.phone}`;
}
