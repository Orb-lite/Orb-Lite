import { useState } from "react";
import { z } from "zod";
import { renewalMeta } from "@/data/catalog";
import type { RenewalInfo } from "@/stores/cartStore";

const baseSchema = {
  fullName: z
    .string()
    .trim()
    .min(3, { message: "Escribe el nombre completo" })
    .max(100, { message: "Máximo 100 caracteres" }),
};

const platformSchema = {
  unitName: z
    .string()
    .trim()
    .min(2, { message: "Escribe el nombre del equipo en plataforma" })
    .max(100, { message: "Máximo 100 caracteres" }),
  imei: z
    .string()
    .trim()
    .regex(/^\d{14,17}$/, { message: "El IMEI debe tener entre 14 y 17 dígitos" }),
};

const simSchema = {
  iccid: z
    .string()
    .trim()
    .regex(/^\d{18,22}$/, { message: "El ICCID debe tener entre 18 y 22 dígitos" }),
  simPhone: z
    .string()
    .trim()
    .regex(/^[\d\s+()-]{10,20}$/, { message: "Escribe el número de teléfono del chip" }),
};

type FieldName = keyof RenewalInfo;

const LABELS: Record<FieldName, string> = {
  fullName: "Nombre completo del titular",
  unitName: "Nombre del equipo en plataforma",
  imei: "IMEI del equipo",
  iccid: "ICCID del chip",
  simPhone: "Número de teléfono del chip",
};

export function renewalFields(variantId: string): FieldName[] {
  const meta = renewalMeta(variantId);
  const kind = meta?.kind ?? "platform";
  if (kind === "sim") return ["fullName", "iccid", "simPhone"];
  if (kind === "both") return ["fullName", "unitName", "imei", "iccid", "simPhone"];
  return ["fullName", "unitName", "imei"];
}

export function renewalSchemaFor(variantId: string) {
  const fields = renewalFields(variantId);
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    const def = { ...baseSchema, ...platformSchema, ...simSchema }[f];
    if (def) shape[f] = def;
  }
  return z.object(shape);
}

const EMPTY: RenewalInfo = { fullName: "", unitName: "" };

export function RenewalForm({
  variantId,
  value,
  onChange,
  errors,
}: {
  variantId: string;
  value: RenewalInfo | null;
  onChange: (info: RenewalInfo) => void;
  errors?: Partial<Record<FieldName, string>> | undefined;
}) {
  const [local, setLocal] = useState<RenewalInfo>(value ?? EMPTY);
  const fields = renewalFields(variantId);
  const meta = renewalMeta(variantId);

  const update = (name: FieldName, val: string) => {
    const next = { ...local, [name]: val };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {meta && (
        <p className="text-[11px] text-muted-foreground">
          Plataforma {meta.platform} ·{" "}
          {meta.period === "monthly" ? "Renovación mensual" : "Renovación anual"}
        </p>
      )}
      {fields.map((name) => (
        <label key={name}>
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {LABELS[name]}
          </span>
          <input
            type="text"
            inputMode={name === "imei" || name === "iccid" ? "numeric" : "text"}
            value={local[name] ?? ""}
            onChange={(e) => update(name, e.target.value)}
            maxLength={100}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          {errors?.[name] && (
            <span className="mt-1 block text-[11px] text-destructive">{errors[name]}</span>
          )}
        </label>
      ))}
    </div>
  );
}

export function validateRenewal(variantId: string, info: RenewalInfo | null) {
  const result = renewalSchemaFor(variantId).safeParse(info ?? EMPTY);
  if (result.success) return { data: result.data as RenewalInfo, errors: null };
  const errors: Partial<Record<FieldName, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as FieldName;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { data: null, errors };
}

export function formatRenewalInfo(info: RenewalInfo, variantName?: string) {
  const parts = [`\n\n*Datos de renovación${variantName ? ` — ${variantName}` : ""}*`, info.fullName];
  if (info.unitName) parts.push(`Equipo en plataforma: ${info.unitName}`);
  if (info.imei) parts.push(`IMEI: ${info.imei}`);
  if (info.iccid) parts.push(`ICCID: ${info.iccid}`);
  if (info.simPhone) parts.push(`Teléfono del chip: ${info.simPhone}`);
  return parts.join("\n");
}
