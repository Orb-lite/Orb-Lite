import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, LoaderCircle } from "lucide-react";
import {
  Area,
  AreaChart,
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
import {
  downloadExcelWorkbook,
  type ExcelCell,
  type ExcelChartDefinition,
} from "@/lib/excel-export";

const SERIES_COLORS = [
  "#92d700", // Lima distintivo ORB-LITE
  "#38bdf8", // Azul celeste
  "#f97316", // Naranja
  "#22c55e", // Verde esmeralda
  "#e879f9", // Magenta brillante
  "#facc15", // Amarillo
  "#34d399", // Turquesa
  "#fb7185", // Coral
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
  const [from, setFrom] = React.useState(() =>
    toLocalInput(new Date(Date.now() - 24 * 60 * 60 * 1000)),
  );
  const [to, setTo] = React.useState(() => toLocalInput(new Date()));
  const [templateKey, setTemplateKey] = React.useState("");
  const [range, setRange] = React.useState<{ from: number; to: number } | null>(
    null,
  );
  const [exporting, setExporting] = React.useState(false);
  const [exportError, setExportError] = React.useState<string | null>(null);
  const speedChartRef = React.useRef<HTMLDivElement>(null);
  const sensorChartRef = React.useRef<HTMLDivElement>(null);

  const templatesQuery = useQuery({
    queryKey: ["wialon-report-templates", session.host, session.sid],
    queryFn: () =>
      fetchTemplates({ data: { host: session.host, sid: session.sid } }),
    staleTime: 5 * 60 * 1000,
  });
  const templates = templatesQuery.data?.templates ?? [];

  const reportQuery = useQuery({
    queryKey: [
      "wialon-report",
      session.sid,
      unit?.id,
      range?.from,
      range?.to,
      isFull,
    ],
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
    staleTime: 0,
    gcTime: 0,
  });

  const reportRows = reportQuery.data?.rows;
  const rows = React.useMemo(() => reportRows ?? [], [reportRows]);
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
    if (range && range.from === start && range.to === end) {
      void reportQuery.refetch();
      return;
    }
    setRange({ from: start, to: end });
  }

  async function onExport() {
    if (!unit || !range) return;
    setExporting(true);
    setExportError(null);
    try {
      const positionRows = rows.map((row) => {
        const base: Record<string, ExcelCell> = {
          Hora: formatTime(row.time),
          Latitud: row.lat,
          Longitud: row.lon,
          "Velocidad (km/h)": row.speed,
          "Rumbo (°)": row.course,
        };
        for (const name of sensorNames) base[name] = row.sensors[name] ?? null;
        return base;
      });
      const positionHeader = positionRows.length
        ? Object.keys(positionRows[0]!)
        : ["Hora"];
      const positionData: ExcelCell[][] = [
        positionHeader,
        ...(positionRows.length
          ? positionRows.map((row) =>
              positionHeader.map((header) => row[header] ?? null),
            )
          : [["Sin datos"]]),
      ];
      const sheets = [{ name: "Posiciones", rows: positionData }];

      const selected = templates.find(
        (tpl) => `${tpl.resourceId}:${tpl.templateId}` === templateKey,
      );
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

        sheets.push(
          ...result.tables.map((table, index) => ({
            name: `${index + 1} ${table.label}`,
            rows: [table.header, ...table.rows],
          })),
        );
      }

      const charts: ExcelChartDefinition[] = [];
      const speedColumn = positionHeader.indexOf("Velocidad (km/h)") + 1;
      if (speedColumn > 0) {
        charts.push({
          sheetName: "Posiciones",
          title: "Velocidad por hora",
          series: [{ name: "Velocidad (km/h)", column: speedColumn }],
          dataRows: positionRows.length,
        });
      }
      if (isFull && sensorNames.length > 0) {
        const sensorSeries = sensorNames
          .map((name) => ({
            name,
            column: positionHeader.indexOf(name) + 1,
          }))
          .filter((serie) => serie.column > 0);
        if (sensorSeries.length > 0) {
          charts.push({
            sheetName: "Posiciones",
            title: "Sensores en tiempo de medición",
            series: sensorSeries,
            dataRows: positionRows.length,
          });
        }
      }

      const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
      const baseName = `reporte-${unit.name.replace(/\s+/g, "-")}-${stamp}`;
      await downloadExcelWorkbook({
        filename: `${baseName}.xlsx`,
        sheets,
        ...(charts.length > 0 ? { charts } : {}),
      });
    } catch (error) {
      setExportError(
        error instanceof Error
          ? error.message
          : "No se pudo generar el archivo de Excel.",
      );
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
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Unidad
          </label>
          <UnitSelector session={session} value={unit} onSelectUnit={setUnit} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Desde
          </label>
          <input
            type="datetime-local"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Hasta
          </label>
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
              <option
                key={`${tpl.resourceId}:${tpl.templateId}`}
                value={`${tpl.resourceId}:${tpl.templateId}`}
              >
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
            onClick={() => void onExport()}
            disabled={!unit || !range || reportQuery.isLoading || exporting}
          >
            {exporting ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Download />
            )}{" "}
            Excel
          </Button>
        </div>
      </form>

      <p className="text-sm text-muted-foreground">
        {isFull
          ? "ORB-FULL: reportes de posición y valores de sensores en su tiempo de medición."
          : "ORB-LITE: reportes de posición con ubicación, velocidad y hora."}
      </p>

      {exportError ? (
        <p className="text-sm text-destructive">{exportError}</p>
      ) : null}
      {reportQuery.isError ? (
        <p className="text-sm text-destructive">
          {reportQuery.error instanceof Error
            ? reportQuery.error.message
            : "No se pudo generar el reporte."}
        </p>
      ) : null}

      {reportQuery.isLoading ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" /> Consultando la
          plataforma…
        </p>
      ) : null}

      {chartData.length > 0 ? (
        <div className="space-y-8">
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide">
              Velocidad por hora
            </h2>
            <div ref={speedChartRef} className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="orbSpeedGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#92d700"
                        stopOpacity={0.45}
                      />
                      <stop
                        offset="95%"
                        stopColor="#92d700"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#2c3e57"
                    opacity={0.6}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#a8b2be" }}
                    stroke="#2c3e57"
                    minTickGap={24}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#a8b2be" }}
                    stroke="#2c3e57"
                    unit=" km/h"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0e1f39",
                      borderColor: "#2c3e57",
                      borderRadius: "0.5rem",
                      color: "#f6f9fc",
                      fontSize: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                    }}
                    itemStyle={{ color: "#92d700", fontWeight: "bold" }}
                    labelStyle={{
                      color: "#a8b2be",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="velocidad"
                    name="Velocidad"
                    stroke="#92d700"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#orbSpeedGrad)"
                    dot={{ r: 2.5, fill: "#92d700", strokeWidth: 0 }}
                    activeDot={{
                      r: 5,
                      fill: "#ffffff",
                      stroke: "#92d700",
                      strokeWidth: 2,
                    }}
                    connectNulls
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {isFull && sensorNames.length > 0 ? (
            <div className="rounded-lg border border-border/60 bg-card/40 p-4">
              <h2 className="font-display text-lg font-bold uppercase tracking-wide">
                Sensores en tiempo de medición
              </h2>
              <div ref={sensorChartRef} className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#2c3e57"
                      opacity={0.6}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#a8b2be" }}
                      stroke="#2c3e57"
                      minTickGap={24}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#a8b2be" }}
                      stroke="#2c3e57"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0e1f39",
                        borderColor: "#2c3e57",
                        borderRadius: "0.5rem",
                        color: "#f6f9fc",
                        fontSize: "12px",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                      }}
                      labelStyle={{
                        color: "#a8b2be",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "8px" }} />
                    {sensorNames.map((name, index) => (
                      <Line
                        key={name}
                        type="monotone"
                        dataKey={name}
                        name={name}
                        stroke={
                          SERIES_COLORS[(index + 1) % SERIES_COLORS.length]
                        }
                        dot={{
                          r: 2,
                          fill: SERIES_COLORS[
                            (index + 1) % SERIES_COLORS.length
                          ],
                          strokeWidth: 0,
                        }}
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
                  <tr
                    key={`${row.time}-${index}`}
                    className="border-t border-border/40"
                  >
                    <td className="px-3 py-2">{formatTime(row.time)}</td>
                    <td className="px-3 py-2">{row.lat?.toFixed(5) ?? "—"}</td>
                    <td className="px-3 py-2">{row.lon?.toFixed(5) ?? "—"}</td>
                    <td className="px-3 py-2">
                      {row.speed != null ? `${row.speed} km/h` : "—"}
                    </td>
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
                Se muestran 200 de {rows.length} registros. El archivo de Excel
                incluye todos.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {!reportQuery.isLoading && range && chartData.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay mensajes en el periodo seleccionado.
        </p>
      ) : null}
    </section>
  );
}

export default ReportChart;
