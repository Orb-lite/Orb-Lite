/**
 * La Constancia de Situación Fiscal queda ligada al cliente y es válida por
 * un mes (30 días). Si entre una compra y otra pasó más de un mes, el cliente
 * debe subir una constancia actualizada.
 */
export const CONSTANCIA_DIAS_VIGENCIA = 30;

const MS_DIA = 24 * 60 * 60 * 1000;

export function constanciaVigente(uploadedAt: string | null | undefined): boolean {
  if (!uploadedAt) return false;
  const ts = new Date(uploadedAt).getTime();
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < CONSTANCIA_DIAS_VIGENCIA * MS_DIA;
}

export function constanciaVenceEl(uploadedAt: string | null | undefined): string | null {
  if (!uploadedAt) return null;
  const ts = new Date(uploadedAt).getTime();
  if (Number.isNaN(ts)) return null;
  return new Date(ts + CONSTANCIA_DIAS_VIGENCIA * MS_DIA).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Antigüedad máxima permitida en la fecha de emisión de la constancia. */
export const CONSTANCIA_DIAS_EMISION = 30;

export function parseFechaEmision(fecha: string | null | undefined): Date | null {
  if (!fecha) return null;
  const iso = fecha.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const d = new Date(`${iso[1]}-${iso[2]}-${iso[3]}T12:00:00Z`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const dmy = fecha.trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (dmy) {
    const d = new Date(
      `${dmy[3]}-${String(dmy[2]).padStart(2, "0")}-${String(dmy[1]).padStart(2, "0")}T12:00:00Z`,
    );
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const fallback = new Date(fecha);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

/**
 * Revisa la fecha de emisión impresa en la constancia: debe ser legible, no
 * futura y con menos de un mes de antigüedad.
 */
export function revisarFechaEmision(fecha: string | null | undefined): {
  ok: boolean;
  motivo?: string;
  fechaISO?: string;
} {
  const d = parseFechaEmision(fecha);
  if (!d) {
    return {
      ok: false,
      motivo:
        "No pudimos leer la fecha de emisión de la constancia. Sube el documento completo y legible.",
    };
  }
  const ahora = Date.now();
  if (d.getTime() - ahora > MS_DIA) {
    return { ok: false, motivo: "La fecha de emisión de la constancia es futura, verifica el documento." };
  }
  const dias = Math.floor((ahora - d.getTime()) / MS_DIA);
  if (dias > CONSTANCIA_DIAS_EMISION) {
    return {
      ok: false,
      motivo: `La constancia fue emitida hace ${dias} días. Descarga una nueva en el portal del SAT (máximo ${CONSTANCIA_DIAS_EMISION} días de antigüedad).`,
    };
  }
  return { ok: true, fechaISO: d.toISOString().slice(0, 10) };
}

export function formatFechaEmision(fecha: string | null | undefined): string | null {
  const d = parseFechaEmision(fecha);
  if (!d) return null;
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
}
