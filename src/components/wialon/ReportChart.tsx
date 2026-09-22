import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, LoaderCircle } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { UnitSelector } from "@/components/wialon/UnitSelector";
import {
  wialonExecReport,
  wialonReportData,
  wialonReportTemplates,
  type WialonUnit,
} from "@/lib/wialon.functions";
import type { WialonSession } from "@/lib/wialon-session";

const SERIES_COLORS = [
  "hsl(var(--primary))",
  "#38bdf8",
  "#f97316",
  "#a3e635",
  "#e879f9",
  "#facc15",
  "#34d399",
  "#fb7185",
];

function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
}

function toUnix(value: string) {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? Math.floor(time / 1000) : 0;
}

function formatTime(seconds: number) {
  return new Date(seconds * 1000).toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Reportes gráficos de la plataforma.
 * ORB-LITE: reporte de posición (ubicación, velocidad y hora).
 * ORB-FULL: además, valores de sensores en su tiempo de medición.
 * En ambos casos se puede exportar a Excel (.xlsx) el resultado tabular,
 * incluyendo las tablas de `report/exec_report` cuando se elige una plantilla.
 */
export function ReportChart({ session }: { session: WialonSession }) {
  const isFull = session.host === "full";

  const fetchReport = useServerFn(wialonReportData);
  const fetchTemplates = useServerFn(wialonReportTemplates);
  const execReport = useServerFn(wialonExecReport);

  const [unit, setUnit] = React.useState<WialonUnit | null>(null);
  const [from, setFrom] = React.useState(() => toLocalInput(new Date(Date.now() - 24 * 60 * 60 * 1000)));
  const [to, setTo] = React.useState(() => toLocalInput(new Date()));
  const [templateKey, setTemplateKey] = React.useState("");
  const [range, setRange] = React.useState<{ from: number; to: number } | null>(null);
  const [exporting, setExporting] = React.useState(false);
  const [exportError, setExportError] = React.useState<string | null>(null);

  const templatesQuery = useQuery({
    queryKey: ["wialon-report-templates", session.host, session.sid],
    queryFn: () => fetchTemplates({ data: { host: session.host, sid: session.sid } }),
    staleTime: 5 * 60 * 1000,
  });
  const templates = templatesQuery.data?.templates ?? [];

  const reportQuery = useQuery({
    queryKey: ["wialon-report", session.sid, unit?.id, range?.from, range?.to, isFull],
    queryFn: () =>
      fetchReport({
        data: {
          host: session.host,
          sid: session.sid,
          unitId: unit!.id,
          timeFrom: range!.from,
          timeTo: range!.to,
          withSensors: isFull,
        },
      }),
    enabled: unit != null && range != null,
  });

  const rows = reportQuery.data?.rows ?? [];
  const sensorNames = reportQuery.data?.sensorNames ?? [];

  const chartData = React.useMemo(
    () =>
      rows.map((row) => ({
        label: formatTime(row.time),
        velocidad: row.speed ?? null,
        ...row.sensors,
      })),
    [rows],
  );

  function onGenerate(event: React.FormEvent) {
    event.preventDefault();
    setExportError(null);
    const start = toUnix(from);
    const end = toUnix(to);
    if (!unit || !start || !end || end <= start) return;
    setRange({ from: start, to: end });
  }

  async function onExport() {
    if (!unit || !range) return;
    setExporting(true);
    setExportError(null);
    try {
      const XLSX = await import("xlsx");
      const book = XLSX.utils.book_new();

      const positionRows = rows.map((row) => {
        const base: Record<string, string | number | null> = {
          Hora: formatTime(row.time),
          Latitud: row.lat,
          Longitud: row.lon,
          "Velocidad (km/h)": row.speed,
          "Rumbo (°)": row.course,
        };
        for (const name of sensorNames) base[name] = row.sensors[name] ?? null;
        return base;
      });

      XLSX.utils.book_append_sheet(
        book,
        XLSX.utils.json_to_sheet(positionRows.length ? positionRows : [{ Hora: "Sin datos" }]),
        "Posiciones",
      );

      const selected = templates.find((tpl) => `${tpl.resourceId}:${tpl.templateId}` === templateKey);
      if (selected) {
        const result = await execReport({
          data: {
            host: session.host,
            sid: session.sid,
            resourceId: selected.resourceId,
            templateId: selected.templateId,
            unitId: unit.id,
            timeFrom: range.from,
            timeTo: range.to,
          },
        });

        result.tables.forEach((table, index) => {
          const sheet = XLSX.utils.aoa_to_sheet([table.header, ...table.rows]);
          const name = `${index + 1} ${table.label}`.slice(0, 31).replace(/[\\/?*[\]:]/g, " ");
          XLSX.utils.book_append_sheet(book, sheet, name);
        });
      }

      const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
      XLSX.writeFile(book, `reporte-${unit.name.replace(/\s+/g, "-")}-${stamp}.xlsx`);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "No se pudo generar el archivo de Excel.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <section className="space-y-6">
      <form
        onSubmit={onGenerate}
        className="grid gap-4 rounded-lg border border-border/60 bg-card/40 p-4 md:grid-cols-4"
      >
        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Unidad</label>
          <UnitSelector session={session} value={unit} onSelectUnit={setUnit} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Desde</label>
          <input
            type="datetime-local"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hasta</label>
          <input
            type="datetime-local"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="md:col-span-3">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Plantilla de reporte para Excel (opcional)
          </label>
          <select
            value={templateKey}
            onChange={(event) => setTemplateKey(event.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Solo tabla de posiciones y sensores</option>
            {templates.map((tpl) => (
              <option key={`${tpl.resourceId}:${tpl.templateId}`} value={`${tpl.resourceId}:${tpl.templateId}`}>
                {tpl.name} · {tpl.resourceName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <Button type="submit" disabled={!unit}>
            Generar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onExport}
            disabled={!unit || !range || reportQuery.isLoading || exporting}
          >
            {exporting ? <LoaderCircle className="animate-spin" /> : <Download />} Exportar XLSX
          </Button>
        </div>
      </form>

      <p className="text-sm text-muted-foreground">
        {isFull
          ? "ORB-FULL: reportes de posición y valores de sensores en su tiempo de medición."
          : "ORB-LITE: reportes de posición con ubicación, velocidad y hora."}
      </p>

      {exportError ? <p className="text-sm text-destructive">{exportError}</p> : null}
      {reportQuery.isError ? (
        <p className="text-sm text-destructive">
          {reportQuery.error instanceof Error ? reportQuery.error.message : "No se pudo generar el reporte."}
        </p>
      ) : null}

      {reportQuery.isLoading ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" /> Consultando la plataforma…
        </p>
      ) : null}

      {chartData.length > 0 ? (
        <div className="space-y-8">
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide">Velocidad por hora</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={24} />
                  <YAxis tick={{ fontSize: 11 }} unit=" km/h" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="velocidad"
                    name="Velocidad"
                    stroke={SERIES_COLORS[0]}
                    dot={false}
                    strokeWidth={2}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {isFull && sensorNames.length > 0 ? (
            <div className="rounded-lg border border-border/60 bg-card/40 p-4">
              <h2 className="font-display text-lg font-bold uppercase tracking-wide">
                Sensores en tiempo de medición
              </h2>
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={24} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    {sensorNames.map((name, index) => (
                      <Line
                        key={name}
                        type="monotone"
                        dataKey={name}
                        name={name}
                        stroke={SERIES_COLORS[(index + 1) % SERIES_COLORS.length]}
                        dot={false}
                        strokeWidth={2}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}

          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-left text-sm">
              <thead className="bg-card/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Hora</th>
                  <th className="px-3 py-2">Latitud</th>
                  <th className="px-3 py-2">Longitud</th>
                  <th className="px-3 py-2">Velocidad</th>
                  {sensorNames.map((name) => (
                    <th key={name} className="px-3 py-2">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 200).map((row, index) => (
                  <tr key={`${row.time}-${index}`} className="border-t border-border/40">
                    <td className="px-3 py-2">{formatTime(row.time)}</td>
                    <td className="px-3 py-2">{row.lat?.toFixed(5) ?? "—"}</td>
                    <td className="px-3 py-2">{row.lon?.toFixed(5) ?? "—"}</td>
                    <td className="px-3 py-2">{row.speed != null ? `${row.speed} km/h` : "—"}</td>
                    {sensorNames.map((name) => (
                      <td key={name} className="px-3 py-2">
                        {row.sensors[name] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 200 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                Se muestran 200 de {rows.length} registros. El archivo de Excel incluye todos.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {!reportQuery.isLoading && range && chartData.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay mensajes en el periodo seleccionado.</p>
      ) : null}
    </section>
  );
}

export default ReportChart;
