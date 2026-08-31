import { useState } from "react";
import { z } from "zod";
import type { RenewalInfo } from "@/stores/cartStore";

export const renewalSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: "Escribe el nombre completo" })
    .max(100, { message: "Máximo 100 caracteres" }),
  unitName: z
    .string()
    .trim()
    .min(2, { message: "Escribe el nombre de la unidad en plataforma" })
    .max(100, { message: "Máximo 100 caracteres" }),
});

const FIELDS: Array<{ name: keyof RenewalInfo; label: string }> = [
  { name: "fullName", label: "Nombre completo" },
  { name: "unitName", label: "Nombre de la unidad en plataforma" },
];

const EMPTY: RenewalInfo = { fullName: "", unitName: "" };

export function RenewalForm({
  value,
  onChange,
  errors,
}: {
  value: RenewalInfo | null;
  onChange: (info: RenewalInfo) => void;
  errors?: Partial<Record<keyof RenewalInfo, string>> | undefined;
}) {
  const [local, setLocal] = useState<RenewalInfo>(value ?? EMPTY);

  const update = (name: keyof RenewalInfo, val: string) => {
    const next = { ...local, [name]: val };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {FIELDS.map((f) => (
        <label key={f.name}>
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {f.label}
          </span>
          <input
            type="text"
            value={local[f.name] ?? ""}
            onChange={(e) => update(f.name, e.target.value)}
            maxLength={100}
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

export function validateRenewal(info: RenewalInfo | null) {
  const result = renewalSchema.safeParse(info ?? EMPTY);
  if (result.success) return { data: result.data as RenewalInfo, errors: null };
  const errors: Partial<Record<keyof RenewalInfo, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof RenewalInfo;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { data: null, errors };
}

export function formatRenewalInfo(info: RenewalInfo) {
  return `\n\n*Datos de renovación*\n${info.fullName}\nUnidad en plataforma: ${info.unitName}`;
}
