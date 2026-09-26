import * as React from "react";
import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Download, LoaderCircle } from "lucide-react";
import { WialonGuard } from "@/components/wialon-guard";
import { PlatformHeader } from "@/components/wialon/PlatformHeader";
import {
  wialonHistory,
  wialonUnits,
  type WialonMessage,
} from "@/lib/wialon.functions";
import type { WialonSession } from "@/lib/wialon-session";
import {
  downloadExcelWorkbook,
  downloadPdfReport,
  renderTrackMapImage,
} from "@/lib/excel-export";

const WialonMap = React.lazy(() => import("@/components/wialon-map"));

export const Route = createFileRoute("/wialon/historial")({
  head: () => ({
    meta: [
      { title: "Historial y recorridos | Plataforma ORB-LITE" },
      {
        name: "description",
        content: "Consulta recorridos y mensajes por fecha de cada unidad.",
      },
      {
        property: "og:title",
        content: "Historial y recorridos | Plataforma ORB-LITE",
      },
      {
        property: "og:description",
        content: "Consulta recorridos y mensajes por fecha.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <WialonGuard>
      {(session) => <HistorialView session={session} />}
    </WialonGuard>
  ),
});

function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function HistorialView({ session }: { session: WialonSession }) {
  const fetchUnits = useServerFn(wialonUnits);
  const fetchHistory = useServerFn(wialonHistory);

  const unitsQuery = useQuery({
    queryKey: ["wialon-units", session.sid],
    queryFn: () =>
      fetchUnits({ data: { host: session.host, sid: session.sid } }),
  });
  const units = unitsQuery.data?.units ?? [];

  const [unitId, setUnitId] = React.useState<number | null>(null);
  const [from, setFrom] = React.useState(() =>
    toLocalInput(new Date(Date.now() - 86400000)),
  );
  const [to, setTo] = React.useState(() => toLocalInput(new Date()));
  const [busy, setBusy] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{
    messages: WialonMessage[];
    total: number;
    maxSpeed: number;
    points: number;
  } | null>(null);

  const selected = unitId ?? units[0]?.id ?? null;

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setError(null);
    setBusy(true);
    try {
      const data = await fetchHistory({
        data: {
          host: session.host,
          sid: session.sid,
          unitId: selected,
          timeFrom: Math.floor(new Date(from).getTime() / 1000),
          timeTo: Math.floor(new Date(to).getTime() / 1000),
        },
      });
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo consultar el historial.",
      );
    } finally {
      setBusy(false);
    }
  }

  const track = (result?.messages ?? [])
    .filter((m) => m.lat != null && m.lon != null)
    .map((m) => ({ lat: m.lat as number, lon: m.lon as number }));

  async function buildExport() {
    if (!result) return null;
    const mapDataUrl = track.length > 0 ? await renderTrackMapImage(track) : null;
    const selectedUnit = units.find((unit) => unit.id === selected);
    const historyRows: Array<Array<string | number | null>> = [
      ["Fecha", "Latitud", "Longitud", "Velocidad (km/h)", "Rumbo (°)"],
      ...result.messages.map((message) => [
        new Date(message.time * 1000).toLocaleString("es-MX"),
        message.lat,
        message.lon,
        message.speed,
        message.course,
      ]),
    ];
    const summaryRows: Array<Array<string | number | null>> = [
      ["Campo", "Valor"],
      ["Unidad", selectedUnit?.name ?? `Unidad ${selected ?? ""}`],
      ["Desde", new Date(from).toLocaleString("es-MX")],
      ["Hasta", new Date(to).toLocaleString("es-MX")],
      ["Mensajes", result.total],
      ["Puntos con ubicación", result.points],
      ["Velocidad máxima (km/h)", Math.round(result.maxSpeed)],
    ];
    const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
    const baseName = `historial-${(selectedUnit?.name ?? "unidad").replace(/\s+/g, "-")}-${stamp}`;
    return { mapDataUrl, historyRows, summaryRows, baseName, selectedUnit };
  }

  async function onExport(format: "xlsx" | "pdf") {
    setExporting(true);
    setError(null);
    try {
      const data = await buildExport();
      if (!data) return;
      const sheets = [
        { name: "Recorrido", rows: data.historyRows },
        { name: "Resumen", rows: data.summaryRows },
      ];
      if (format === "xlsx") {
        await downloadExcelWorkbook({
          filename: `${data.baseName}.xlsx`,
          sheets,
          ...(data.mapDataUrl
            ? {
                map: {
                  sheetName: "Recorrido",
                  title: "Mapa del recorrido",
                  dataUrl: data.mapDataUrl,
                },
              }
            : {}),
        });
      } else {
        await downloadPdfReport({
          filename: `${data.baseName}.pdf`,
          title: `Historial · ${data.selectedUnit?.name ?? "Unidad"}`,
          sheets,
          ...(data.mapDataUrl
            ? { images: [{ title: "Mapa del recorrido", dataUrl: data.mapDataUrl }] }
            : {}),
        });
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo generar el archivo.",
      );
    } finally {
      setExporting(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary";

  return (
    <div className="space-y-6">
      <PlatformHeader session={session} />

      <form
        onSubmit={onSearch}
        className="grid gap-4 rounded-lg border border-border/60 p-5 sm:grid-cols-4"
      >
        <label className="text-sm sm:col-span-2">
          Unidad
          <select
            className={inputClass}
            value={selected ?? ""}
            onChange={(e) => setUnitId(Number(e.target.value))}
          >
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Desde
          <input
            type="datetime-local"
            className={inputClass}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <label className="text-sm">
          Hasta
          <input
            type="datetime-local"
            className={inputClass}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={busy || !selected}
          className="rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-60 sm:col-span-4"
        >
          {busy ? "Consultando…" : "Ver recorrido"}
        </button>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {result ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Mensajes",
                value: result.total.toLocaleString("es-MX"),
              },
              {
                label: "Puntos con ubicación",
                value: result.points.toLocaleString("es-MX"),
              },
              {
                label: "Velocidad máxima",
                value: `${Math.round(result.maxSpeed)} km/h`,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border/60 p-4"
              >
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-1 font-display text-2xl font-bold">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <ClientOnly
            fallback={
              <div className="h-[480px] rounded-lg border border-border/60 bg-card/40" />
            }
          >
            <React.Suspense
              fallback={
                <div className="h-[480px] rounded-lg border border-border/60 bg-card/40" />
              }
            >
              <WialonMap units={[]} track={track} />
            </React.Suspense>
          </ClientOnly>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Se muestran los primeros 200 registros. El Excel incluye todos los
              mensajes y el mapa.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void onExport("xlsx")}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:cursor-wait disabled:opacity-60"
              >
                {exporting ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
                {exporting ? "Generando…" : "Excel"}
              </button>
              <button
                type="button"
                onClick={() => void onExport("pdf")}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-primary disabled:cursor-wait disabled:opacity-60"
              >
                <Download className="size-4" />
                PDF
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-card/60 text-left text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Coordenadas</th>
                  <th className="px-4 py-3">Velocidad</th>
                </tr>
              </thead>
              <tbody>
                {result.messages.slice(0, 200).map((m, i) => (
                  <tr
                    key={`${m.time}-${i}`}
                    className="border-t border-border/50"
                  >
                    <td className="px-4 py-2">
                      {new Date(m.time * 1000).toLocaleString("es-MX")}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {m.lat != null && m.lon != null
                        ? `${m.lat.toFixed(5)}, ${m.lon.toFixed(5)}`
                        : "—"}
                    </td>
                    <td className="px-4 py-2">
                      {m.speed != null ? `${Math.round(m.speed)} km/h` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
