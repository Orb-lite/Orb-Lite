/**
 * Utilidades centralizadas para garantizar que todas las fechas y horas se manejen
 * y muestren en español (es-MX / México), normalizando además fechas de calendarios
 * alternativos (p. ej. calendario solar persa / Jalali que a veces devuelven APIs de telemetría)
 * o nombres de meses en inglés a formato estándar en español.
 */

// Mapeo del calendario solar hijri / jalali a mes gregoriano
const JALALI_MONTHS: Record<string, number> = {
  farvardin: 1,
  ordibehesht: 2,
  khordad: 3,
  tir: 4,
  mordad: 5,
  shahrivar: 6,
  mehr: 7,
  aban: 8,
  azar: 9,
  dey: 10,
  bahman: 11,
  esfand: 12,
};

// Conversión algorítmica astronómica precisa de Jalali a Gregoriano
function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  let sal_a: number[];
  let gy: number;
  let gm: number;
  let gd: number;
  let days: number;

  jy += 1595;
  days =
    -355668 +
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);

  gy = 400 * Math.floor(days / 146097);
  days %= 146097;

  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }

  gy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  gd = days + 1;
  sal_a = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  for (gm = 0; gm < 13 && gd > sal_a[gm]!; gm++) {
    gd -= sal_a[gm]!;
  }

  return [gy, gm, gd];
}

const SPANISH_MONTH_SHORT = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const ENGLISH_MONTHS: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

/**
 * Normaliza cualquier texto que contenga fechas exóticas (como Jalali "05 Mehr 1405 17:01:35"
 * o meses en inglés) traduciéndolo y convirtiéndolo al formato estándar en español DD/MM/AAAA HH:mm:ss.
 */
export function normalizeDateToSpanish(text: string): string {
  if (!text || typeof text !== "string") return text;

  // 1. Detectar patrón Jalali tipo: "05 Mehr 1405 17:01:35" o "05 Mehr 1405"
  let result = text.replace(
    /\b(\d{1,2})\s+(Farvardin|Ordibehesht|Khordad|Tir|Mordad|Shahrivar|Mehr|Aban|Azar|Dey|Bahman|Esfand)\s+(\d{4})(?:\s+(\d{1,2}:\d{2}(?::\d{2})?))?\b/gi,
    (match, dayStr, monthName, yearStr, timeStr) => {
      const jMonth = JALALI_MONTHS[monthName.toLowerCase()];
      if (!jMonth) return match;
      const [gy, gm, gd] = jalaliToGregorian(parseInt(yearStr, 10), jMonth, parseInt(dayStr, 10));
      const dd = String(gd).padStart(2, "0");
      const mm = String(gm).padStart(2, "0");
      return timeStr ? `${dd}/${mm}/${gy} ${timeStr}` : `${dd}/${mm}/${gy}`;
    },
  );

  // 2. Detectar fechas con mes en inglés como "Oct 12, 2026" o "12 Oct 2026"
  result = result.replace(
    /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2}),?\s+(\d{4})(?:\s+(\d{1,2}:\d{2}(?::\d{2})?))?\b/gi,
    (match, monthName, dayStr, yearStr, timeStr) => {
      const mNum = ENGLISH_MONTHS[monthName.toLowerCase()];
      if (!mNum) return match;
      const dd = String(dayStr).padStart(2, "0");
      const mm = String(mNum).padStart(2, "0");
      return timeStr ? `${dd}/${mm}/${yearStr} ${timeStr}` : `${dd}/${mm}/${yearStr}`;
    },
  );

  result = result.replace(
    /\b(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{4})(?:\s+(\d{1,2}:\d{2}(?::\d{2})?))?\b/gi,
    (match, dayStr, monthName, yearStr, timeStr) => {
      const mNum = ENGLISH_MONTHS[monthName.toLowerCase()];
      if (!mNum) return match;
      const dd = String(dayStr).padStart(2, "0");
      const mm = String(mNum).padStart(2, "0");
      return timeStr ? `${dd}/${mm}/${yearStr} ${timeStr}` : `${dd}/${mm}/${yearStr}`;
    },
  );

  return result;
}

/**
 * Formatea una fecha numérica o string en español mexicano estándar.
 */
export function formatDateTimeEs(
  dateOrSeconds: number | string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  let date: Date;
  if (typeof dateOrSeconds === "number") {
    // Si viene en segundos unix (< 10000000000) o ms
    date = new Date(dateOrSeconds < 10000000000 ? dateOrSeconds * 1000 : dateOrSeconds);
  } else if (typeof dateOrSeconds === "string") {
    date = new Date(dateOrSeconds);
  } else {
    date = dateOrSeconds;
  }

  if (Number.isNaN(date.getTime())) return String(dateOrSeconds);

  return date.toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    ...options,
  });
}

/**
 * Formatea solo la fecha (día mes año) en español.
 */
export function formatDateEs(
  dateOrSeconds: number | string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  return formatDateTimeEs(dateOrSeconds, {
    hour: undefined,
    minute: undefined,
    second: undefined,
    ...options,
  });
}
