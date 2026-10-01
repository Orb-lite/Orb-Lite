import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { R as LoaderCircle, et as Download } from "../_libs/lucide-react.mjs";
import { b as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as renderTrackMapImage, t as downloadExcelWorkbook } from "./excel-export-BCRQisTV.mjs";
import { b as wialonUnits, u as wialonHistory } from "./wialon.functions-C37hcc8N.mjs";
import { t as WialonGuard } from "./wialon-guard-JCWFzsMD.mjs";
import { t as PlatformHeader } from "./PlatformHeader-BPTsTd-2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.historial-Cc_TnsrL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function toLocalInput(date) {
	const pad = (n) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function HistorialView({ session }) {
	const fetchUnits = useServerFn(wialonUnits);
	const fetchHistory = useServerFn(wialonHistory);
	const units = useQuery({
		queryKey: ["wialon-units", session.sid],
		queryFn: () => fetchUnits({ data: {
			host: session.host,
			sid: session.sid
		} })
	}).data?.units ?? [];
	const [unitId, setUnitId] = import_react.useState(null);
	const [from, setFrom] = import_react.useState(() => toLocalInput(/* @__PURE__ */ new Date(Date.now() - 864e5)));
	const [to, setTo] = import_react.useState(() => toLocalInput(/* @__PURE__ */ new Date()));
	const [busy, setBusy] = import_react.useState(false);
	const [exporting, setExporting] = import_react.useState(false);
	const [error, setError] = import_react.useState(null);
	const [result, setResult] = import_react.useState(null);
	const selected = unitId ?? units[0]?.id ?? null;
	async function onSearch(e) {
		e.preventDefault();
		if (!selected) return;
		setError(null);
		setBusy(true);
		try {
			const data = await fetchHistory({ data: {
				host: session.host,
				sid: session.sid,
				unitId: selected,
				timeFrom: Math.floor(new Date(from).getTime() / 1e3),
				timeTo: Math.floor(new Date(to).getTime() / 1e3)
			} });
			setResult(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo consultar el historial.");
		} finally {
			setBusy(false);
		}
	}
	const track = (result?.messages ?? []).filter((m) => m.lat != null && m.lon != null).map((m) => ({
		lat: m.lat,
		lon: m.lon
	}));
	async function buildExport() {
		if (!result) return null;
		const mapDataUrl = track.length > 0 ? await renderTrackMapImage(track) : null;
		const selectedUnit = units.find((unit) => unit.id === selected);
		const historyRows = [[
			"Fecha",
			"Latitud",
			"Longitud",
			"Velocidad (km/h)",
			"Rumbo (°)"
		], ...result.messages.map((message) => [
			(/* @__PURE__ */ new Date(message.time * 1e3)).toLocaleString("es-MX"),
			message.lat,
			message.lon,
			message.speed,
			message.course
		])];
		const summaryRows = [
			["Campo", "Valor"],
			["Unidad", selectedUnit?.name ?? `Unidad ${selected ?? ""}`],
			["Desde", new Date(from).toLocaleString("es-MX")],
			["Hasta", new Date(to).toLocaleString("es-MX")],
			["Mensajes", result.total],
			["Puntos con ubicación", result.points],
			["Velocidad máxima (km/h)", Math.round(result.maxSpeed)]
		];
		const stamp = (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace(/[:T]/g, "-");
		return {
			mapDataUrl,
			historyRows,
			summaryRows,
			baseName: `historial-${(selectedUnit?.name ?? "unidad").replace(/\s+/g, "-")}-${stamp}`,
			selectedUnit
		};
	}
	async function onExport() {
		setExporting(true);
		setError(null);
		try {
			const data = await buildExport();
			if (!data) return;
			await downloadExcelWorkbook({
				filename: `${data.baseName}.xlsx`,
				sheets: [{
					name: "Recorrido",
					rows: data.historyRows
				}, {
					name: "Resumen",
					rows: data.summaryRows
				}],
				...data.mapDataUrl ? { map: {
					sheetName: "Recorrido",
					title: "Mapa del recorrido",
					dataUrl: data.mapDataUrl,
					cell: "G6"
				} } : {}
			});
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "No se pudo generar el archivo.");
		} finally {
			setExporting(false);
		}
	}
	const inputClass = "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformHeader, { session }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: onSearch,
				className: "grid gap-4 rounded-lg border border-border/60 p-5 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm sm:col-span-2",
						children: ["Unidad", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: inputClass,
							value: selected ?? "",
							onChange: (e) => setUnitId(Number(e.target.value)),
							children: units.map((unit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: unit.id,
								children: unit.name
							}, unit.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: ["Desde", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							className: inputClass,
							value: from,
							onChange: (e) => setFrom(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: ["Hasta", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							className: inputClass,
							value: to,
							onChange: (e) => setTo(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy || !selected,
						className: "rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-60 sm:col-span-4",
						children: busy ? "Consultando…" : "Ver recorrido"
					})
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: error
			}) : null,
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						{
							label: "Mensajes",
							value: result.total.toLocaleString("es-MX")
						},
						{
							label: "Puntos con ubicación",
							value: result.points.toLocaleString("es-MX")
						},
						{
							label: "Velocidad máxima",
							value: `${Math.round(result.maxSpeed)} km/h`
						}
					].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border/60 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-widest text-muted-foreground",
							children: stat.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl font-bold",
							children: stat.value
						})]
					}, stat.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[480px] rounded-lg border border-border/60 bg-card/40" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Se muestran los primeros 200 registros. El Excel incluye todos los mensajes y el mapa."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void onExport(),
							disabled: exporting,
							className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:cursor-wait disabled:opacity-60",
							children: [exporting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), exporting ? "Generando…" : "Excel"]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-lg border border-border/60",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[560px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-card/60 text-left text-xs uppercase tracking-widest text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Fecha"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Coordenadas"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Velocidad"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: result.messages.slice(0, 200).map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2",
									children: (/* @__PURE__ */ new Date(m.time * 1e3)).toLocaleString("es-MX")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2 text-muted-foreground",
									children: m.lat != null && m.lon != null ? `${m.lat.toFixed(5)}, ${m.lon.toFixed(5)}` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2",
									children: m.speed != null ? `${Math.round(m.speed)} km/h` : "—"
								})
							]
						}, `${m.time}-${i}`)) })]
					})
				})
			] }) : null
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistorialView, { session }) });
//#endregion
export { SplitComponent as component };
