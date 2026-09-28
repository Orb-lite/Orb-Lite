import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { wialonSendCommand, wialonUnitDetail } from "@/lib/wialon.functions";
import type { WialonSession } from "@/lib/wialon-session";

export function WialonUnitDetail({
  session,
  unitId,
  onClose,
}: {
  session: WialonSession;
  unitId: number;
  onClose: () => void;
}) {
  const detailFn = useServerFn(wialonUnitDetail);
  const commandFn = useServerFn(wialonSendCommand);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);

  const detail = useQuery({
    queryKey: ["wialon-unit-detail", session.sid, unitId],
    queryFn: () =>
      detailFn({ data: { host: session.host, sid: session.sid, unitId } }),
  });

  async function runCommand(name: string, link: string) {
    setFeedback(null);
    setBusy(name);
    try {
      await commandFn({
        data: {
          host: session.host,
          sid: session.sid,
          unitId,
          commandName: name,
          linkType: link,
        },
      });
      setFeedback(`Comando "${name}" enviado a la unidad.`);
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "No se pudo enviar el comando.",
      );
    } finally {
      setBusy(null);
    }
  }

  const data = detail.data;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-background/80 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-border/60 bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide">
            {data?.unit.name ?? "Detalle de unidad"}
          </h2>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
          >
            <X className="size-4" /> Cerrar
          </button>
        </div>

        {detail.isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Cargando…</p>
        ) : null}
        {detail.isError ? (
          <p className="mt-4 text-sm text-destructive">
            {detail.error instanceof Error
              ? detail.error.message
              : "Error al consultar la unidad."}
          </p>
        ) : null}

        {data ? (
          <div className="mt-5 space-y-6 text-sm">
            <dl className="grid gap-3 sm:grid-cols-2">
              <Row label="IMEI / ID único" value={data.uniqueId ?? "—"} />
              <Row label="Teléfono" value={data.phone ?? "—"} />
              <Row
                label="Estado"
                value={data.unit.online ? "En línea" : "Sin señal"}
              />
              <Row
                label="Última señal"
                value={
                  data.unit.lastMessage
                    ? new Date(data.unit.lastMessage * 1000).toLocaleString(
                        "es-MX",
                      )
                    : "—"
                }
              />
              <Row
                label="Coordenadas"
                value={
                  data.unit.lat != null && data.unit.lon != null
                    ? `${data.unit.lat.toFixed(5)}, ${data.unit.lon.toFixed(5)}`
                    : "—"
                }
              />
              <Row
                label="Velocidad"
                value={
                  data.unit.speed != null
                    ? `${Math.round(data.unit.speed)} km/h`
                    : "—"
                }
              />
            </dl>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Sensores ({data.sensors.length})
              </h3>
              {data.sensors.length === 0 ? (
                <p className="mt-2 text-muted-foreground">
                  Esta unidad no tiene sensores configurados.
                </p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {data.sensors.map((sensor) => (
                    <li
                      key={sensor.id}
                      className="flex justify-between gap-3 border-b border-border/40 py-1"
                    >
                      <span>{sensor.name}</span>
                      <span className="font-semibold">
                        {sensor.value} {sensor.metrics}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Comandos ({data.commands.length})
              </h3>
              {data.commands.length === 0 ? (
                <p className="mt-2 text-muted-foreground">
                  No hay comandos configurados para esta unidad.
                </p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.commands.map((command) => (
                    <button
                      key={command.id}
                      disabled={busy === command.name}
                      onClick={() =>
                        void runCommand(command.name, command.link)
                      }
                      className="rounded-md border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary disabled:opacity-60"
                    >
                      {busy === command.name ? "Enviando…" : command.name}
                    </button>
                  ))}
                </div>
              )}
              {feedback ? (
                <p className="mt-3 text-sm text-primary">{feedback}</p>
              ) : null}
            </section>

            {data.params.length > 0 ? (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Último mensaje
                </h3>
                <div className="mt-2 grid gap-1 sm:grid-cols-2">
                  {data.params.map((param) => (
                    <p key={param.key} className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {param.key}:
                      </span>{" "}
                      {param.value}
                    </p>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
