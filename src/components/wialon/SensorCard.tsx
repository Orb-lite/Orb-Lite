import { Activity, Gauge, Radio, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

export type WialonRawSensor = {
  id: number;
  n?: string;
  t?: string;
  m?: string;
  p?: string;
};

export type WialonTelemetry = {
  pos?: { s?: number | null; t?: number | null } | null;
  lmsg?: { t?: number | null; p?: Record<string, unknown> } | null;
};

type SensorCardProps = {
  sens?: Record<string, WialonRawSensor> | WialonRawSensor[] | null;
  telemetry?: WialonTelemetry | null;
  title?: string;
  className?: string;
};

function sensorList(sens: SensorCardProps["sens"]): WialonRawSensor[] {
  if (Array.isArray(sens)) return sens;
  return Object.values(sens ?? {});
}

function displayValue(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value))
    return String(Math.round(value * 100) / 100);
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "boolean") return value ? "Activo" : "Inactivo";
  return "—";
}

function sensorIcon(type?: string) {
  const normalized = type?.toLowerCase() ?? "";
  if (normalized.includes("temp")) return Thermometer;
  if (normalized.includes("fuel") || normalized.includes("nivel")) return Gauge;
  return Activity;
}

/** Presenta los sensores crudos (`sens`) y la telemetría del último mensaje de Wialon. */
export function SensorCard({
  sens,
  telemetry,
  title = "Sensores y telemetría",
  className,
}: SensorCardProps) {
  const sensors = sensorList(sens);
  const parameters = telemetry?.lmsg?.p ?? {};
  const speed = telemetry?.pos?.s;
  const timestamp = telemetry?.pos?.t ?? telemetry?.lmsg?.t ?? null;

  return (
    <section className={cn("rounded-xl border border-border/60 bg-card p-4 shadow-sm", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {timestamp
              ? `Actualizado ${new Date(timestamp * 1000).toLocaleString("es-MX")}`
              : "Sin telemetría reciente"}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-semibold">
          <Radio className="size-4 text-primary" />
          {typeof speed === "number" && Number.isFinite(speed)
            ? `${Math.round(speed)} km/h`
            : "0 km/h"}
        </div>
      </div>

      {sensors.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">
          Esta unidad no tiene sensores configurados.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sensors.map((sensor, index) => {
            const Icon = sensorIcon(sensor.t);
            const rawValue = sensor.p ? parameters[sensor.p] : undefined;
            const value = displayValue(rawValue);
            const name = sensor.n?.trim() || `Sensor ${sensor.id || index + 1}`;

            return (
              <li
                key={sensor.id || `${name}-${index}`}
                className="rounded-lg border border-border/60 p-3"
              >
                <div className="flex items-start gap-2">
                  <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{name}</p>
                    <p className="mt-1 text-lg font-bold tabular-nums">
                      {value}
                      {sensor.m && value !== "—" ? (
                        <span className="ml-1 text-xs font-medium text-muted-foreground">
                          {sensor.m}
                        </span>
                      ) : null}
                    </p>
                    {sensor.t ? (
                      <p className="mt-1 truncate text-xs text-muted-foreground">{sensor.t}</p>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
