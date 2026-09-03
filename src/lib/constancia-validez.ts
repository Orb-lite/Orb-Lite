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
