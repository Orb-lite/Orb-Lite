import { useState } from "react";
import { z } from "zod";
import type { BillingInfo } from "@/stores/cartStore";

export const REGIMENES_FISCALES = [
  "601 — General de Ley Personas Morales",
  "603 — Personas Morales con Fines no Lucrativos",
  "605 — Sueldos y Salarios e Ingresos Asimilados a Salarios",
  "606 — Arrendamiento",
  "607 — Régimen de Enajenación o Adquisición de Bienes",
  "608 — Demás ingresos",
  "610 — Residentes en el Extranjero sin Establecimiento Permanente en México",
  "611 — Ingresos por Dividendos (socios y accionistas)",
  "612 — Personas Físicas con Actividades Empresariales y Profesionales",
  "614 — Ingresos por intereses",
  "615 — Régimen de los ingresos por obtención de premios",
  "616 — Sin obligaciones fiscales",
  "620 — Sociedades Cooperativas de Producción",
  "621 — Incorporación Fiscal",
  "622 — Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras",
  "623 — Opcional para Grupos de Sociedades",
  "624 — Coordinados",
  "625 — Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas",
  "626 — Régimen Simplificado de Confianza (RESICO)",
] as const;

export const USOS_CFDI = [
  "G01 — Adquisición de mercancías",
  "G02 — Devoluciones, descuentos o bonificaciones",
  "G03 — Gastos en general",
  "I01 — Construcciones",
  "I02 — Mobiliario y equipo de oficina por inversiones",
  "I03 — Equipo de transporte",
  "I04 — Equipo de cómputo y accesorios",
  "I08 — Otra maquinaria y equipo",
  "P01 — Por definir",
  "S01 — Sin efectos fiscales",
] as const;

export const billingSchema = z.object({
  legalName: z
    .string()
    .trim()
    .min(3, { message: "Escribe la razón social o nombre fiscal" })
    .max(200, { message: "Máximo 200 caracteres" }),
  rfc: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase())
    .refine((v) => /^([A-ZÑ&]{3,4}\d{6}[A-Z\d]{3})$/.test(v), {
      message: "RFC inválido (ej. XAXX010101000)",
    }),
  taxRegime: z.string().trim().min(3, { message: "Selecciona el régimen fiscal" }),
  cfdiUse: z.string().trim().min(3, { message: "Selecciona el uso del CFDI" }),
  fiscalZip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, { message: "C.P. fiscal de 5 dígitos" }),
  email: z.string().trim().email({ message: "Correo inválido" }).max(150),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+-]{10,20}$/, { message: "Teléfono a 10 dígitos" }),
  fiscalAddress: z.string().trim().max(250).optional().or(z.literal("")),
});

const EMPTY: BillingInfo = {
  legalName: "",
  rfc: "",
  taxRegime: "",
  cfdiUse: "",
  fiscalZip: "",
  email: "",
  phone: "",
  fiscalAddress: "",
};

const inputClass =
  "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary";

interface TextFieldDef {
  name: keyof BillingInfo;
  label: string;
  full?: boolean;
  placeholder?: string;
}

const TEXT_FIELDS: TextFieldDef[] = [
  { name: "legalName", label: "Razón social / nombre fiscal", full: true },
  { name: "rfc", label: "RFC", placeholder: "XAXX010101000" },
  { name: "fiscalZip", label: "C.P. fiscal", placeholder: "44100" },
  { name: "email", label: "Correo para recibir la factura" },
  { name: "phone", label: "Teléfono de contacto" },
  { name: "fiscalAddress", label: "Dirección fiscal (opcional)", full: true },
];

function TextField({
  field,
  local,
  errors,
  update,
}: {
  field: TextFieldDef;
  local: BillingInfo;
  errors?: Partial<Record<keyof BillingInfo, string>> | undefined;
  update: (name: keyof BillingInfo, val: string) => void;
}) {
  return (
    <label className={field.full ? "sm:col-span-2" : undefined}>
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {field.label}
      </span>
      <input
        type="text"
        value={local[field.name] ?? ""}
        placeholder={field.placeholder}
        onChange={(e) => update(field.name, e.target.value)}
        maxLength={250}
        className={inputClass}
      />
      {errors?.[field.name] && (
        <span className="mt-1 block text-[11px] text-destructive">{errors[field.name]}</span>
      )}
    </label>
  );
}

export function BillingForm({
  value,
  onChange,
  errors,
}: {
  value: BillingInfo | null;
  onChange: (info: BillingInfo) => void;
  errors?: Partial<Record<keyof BillingInfo, string>> | undefined;
}) {
  const [local, setLocal] = useState<BillingInfo>(value ?? EMPTY);

  const update = (name: keyof BillingInfo, val: string) => {
    const next = { ...local, [name]: val };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {TEXT_FIELDS.slice(0, 3).map((f) => (
        <TextField key={f.name} field={f} local={local} errors={errors} update={update} />
      ))}

      <label className="sm:col-span-2">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Régimen fiscal
        </span>
        <select
          value={local.taxRegime}
          onChange={(e) => update("taxRegime", e.target.value)}
          className={inputClass}
        >
          <option value="">Selecciona…</option>
          {REGIMENES_FISCALES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors?.taxRegime && (
          <span className="mt-1 block text-[11px] text-destructive">{errors.taxRegime}</span>
        )}
      </label>

      <label className="sm:col-span-2">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Uso del CFDI
        </span>
        <select
          value={local.cfdiUse}
          onChange={(e) => update("cfdiUse", e.target.value)}
          className={inputClass}
        >
          <option value="">Selecciona…</option>
          {USOS_CFDI.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        {errors?.cfdiUse && (
          <span className="mt-1 block text-[11px] text-destructive">{errors.cfdiUse}</span>
        )}
      </label>

      {TEXT_FIELDS.slice(3).map((f) => (
        <TextField key={f.name} field={f} local={local} errors={errors} update={update} />
      ))}
    </div>
  );
}

export function validateBilling(info: BillingInfo | null) {
  const result = billingSchema.safeParse(info ?? EMPTY);
  if (result.success) return { data: result.data as BillingInfo, errors: null };
  const errors: Partial<Record<keyof BillingInfo, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof BillingInfo;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { data: null, errors };
}

export function formatBillingInfo(info: BillingInfo) {
  return (
    `\n\n*Datos de facturación*\n${info.legalName}\nRFC: ${info.rfc}\n` +
    `Régimen: ${info.taxRegime}\nUso CFDI: ${info.cfdiUse}\n` +
    `C.P. fiscal: ${info.fiscalZip}\nCorreo: ${info.email}\nTel: ${info.phone}` +
    (info.fiscalAddress ? `\nDirección fiscal: ${info.fiscalAddress}` : "")
  );
}
