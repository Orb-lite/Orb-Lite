/** Datos mínimos compatibles con la respuesta cruda de una unidad de Wialon. */
export type WialonRawUnit = {
  nm?: unknown;
  pos?: { s?: unknown; y?: unknown; x?: unknown } | null;
  lmsg?: { p?: Record<string, unknown> } | null;
  sens?: Record<string, { n?: unknown; nm?: unknown; p?: unknown; m?: unknown }> | null;
  sensors?: Array<{ name?: unknown; value?: unknown; metrics?: unknown }>;
};

type WialonPayload = WialonRawUnit | { unit?: WialonRawUnit | null };

const TOKEN_PATTERN = /\[(Unidad|Sensor)\s*:\s*([^\]]+)\]/gi;
const EMPTY_VALUE = "—";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value != null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function getUnit(data: WialonPayload | unknown): WialonRawUnit {
  const payload = asRecord(data);
  const nestedUnit = payload ? asRecord(payload["unit"]) : null;
  return (nestedUnit ?? payload ?? {}) as WialonRawUnit;
}

function text(value: unknown, fallback = EMPTY_VALUE): string {
  if (typeof value === "string") return value.trim() || fallback;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function normalized(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-MX");
}

function speed(unit: WialonRawUnit): string {
  const value = unit.pos?.s;
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    // Wialon Lite puede omitir `pos.s` cuando la unidad está apagada.
    return "0 km/h";
  }
  return `${Math.round(value * 10) / 10} km/h`;
}

function sensorValue(unit: WialonRawUnit, requestedName: string): string {
  const requested = normalized(requestedName);

  // También admite la forma normalizada que devuelve wialonUnitDetail.
  const directSensor = unit.sensors?.find(
    (sensor) => normalized(text(sensor.name, "")) === requested,
  );
  if (directSensor) {
    const value = text(directSensor.value);
    const metrics = text(directSensor.metrics, "");
    return metrics ? `${value} ${metrics}` : value;
  }

  const parameters = unit.lmsg?.p ?? {};
  for (const sensor of Object.values(unit.sens ?? {})) {
    const name = text(sensor.n ?? sensor.nm, "");
    if (normalized(name) !== requested) continue;
    const parameter = typeof sensor.p === "string" ? sensor.p : "";
    const value = parameter ? parameters[parameter] : undefined;
    const metrics = text(sensor.m, "");
    const formatted = text(value);
    return metrics && formatted !== EMPTY_VALUE ? `${formatted} ${metrics}` : formatted;
  }

  return EMPTY_VALUE;
}

function unitValue(unit: WialonRawUnit, requestedName: string): string | null {
  switch (normalized(requestedName)) {
    case "nombre":
    case "name":
      return text(unit.nm, "Unidad sin nombre");
    case "velocidad":
    case "speed":
      return speed(unit);
    case "latitud":
      return text(unit.pos?.y);
    case "longitud":
      return text(unit.pos?.x);
    default:
      return null;
  }
}

/**
 * Reemplaza marcadores soportados de una plantilla sin evaluar expresiones ni
 * interpolar propiedades arbitrarias. Los marcadores desconocidos se conservan
 * para que el editor pueda mostrarlos y corregirlos.
 *
 * Ejemplos: `[Unidad: Nombre]`, `[Unidad: Velocidad]`,
 * `[Sensor: Combustible]`.
 */
export function parseFlyerTokens(template: string, rawData: WialonPayload | unknown): string {
  if (typeof template !== "string" || !template) return template;
  const unit = getUnit(rawData);

  return template.replace(TOKEN_PATTERN, (marker, category: string, token: string) => {
    if (normalized(category) === "unidad") return unitValue(unit, token) ?? marker;
    if (normalized(category) === "sensor") return sensorValue(unit, token);
    return marker;
  });
}

export const parseWialonTokens = parseFlyerTokens;
