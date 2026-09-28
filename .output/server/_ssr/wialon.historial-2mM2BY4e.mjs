import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { b as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { J as Download, P as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as renderTrackMapImage, t as downloadExcelWorkbook } from "./excel-export-lmFsj8Lg.mjs";
import { b as wialonUnits, u as wialonHistory } from "./wialon.functions-B5LcdM8M.mjs";
import { t as WialonGuard } from "./wialon-guard-BAmRBw40.mjs";
import { t as PlatformHeader } from "./PlatformHeader-B5tIht-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.historial-2mM2BY4e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/wialon.historial.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PlatformHeader, { session }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 118,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
				onSubmit: onSearch,
				className: "grid gap-4 rounded-lg border border-border/60 p-5 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "text-sm sm:col-span-2",
						children: ["Unidad", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
							className: inputClass,
							value: selected ?? "",
							onChange: (e) => setUnitId(Number(e.target.value)),
							children: units.map((unit) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
								value: unit.id,
								children: unit.name
							}, unit.id, false, {
								fileName: _jsxFileName,
								lineNumber: 124,
								columnNumber: 32
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 123,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 121,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "text-sm",
						children: ["Desde", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							type: "datetime-local",
							className: inputClass,
							value: from,
							onChange: (e) => setFrom(e.target.value)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 131,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 129,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "text-sm",
						children: ["Hasta", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							type: "datetime-local",
							className: inputClass,
							value: to,
							onChange: (e) => setTo(e.target.value)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 135,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 133,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "submit",
						disabled: busy || !selected,
						className: "rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-60 sm:col-span-4",
						children: busy ? "Consultando…" : "Ver recorrido"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 137,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 120,
				columnNumber: 7
			}, this),
			error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-destructive",
				children: error
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 142,
				columnNumber: 16
			}, this) : null,
			result ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
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
					].map((stat) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border border-border/60 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs uppercase tracking-widest text-muted-foreground",
							children: stat.label
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 156,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-1 font-display text-2xl font-bold",
							children: stat.value
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 159,
							columnNumber: 17
						}, this)]
					}, stat.label, true, {
						fileName: _jsxFileName,
						lineNumber: 155,
						columnNumber: 24
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 145,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-[480px] rounded-lg border border-border/60 bg-card/40" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 163,
					columnNumber: 33
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 163,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-muted-foreground",
						children: "Se muestran los primeros 200 registros. El Excel incluye todos los mensajes y el mapa."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 166,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-2",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => void onExport(),
							disabled: exporting,
							className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:cursor-wait disabled:opacity-60",
							children: [exporting ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "size-4 animate-spin" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 171,
								columnNumber: 30
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 171,
								columnNumber: 81
							}, this), exporting ? "Generando…" : "Excel"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 170,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 169,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 165,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "overflow-x-auto rounded-lg border border-border/60",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
						className: "w-full min-w-[560px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
							className: "bg-card/60 text-left text-xs uppercase tracking-widest text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "px-4 py-3",
									children: "Fecha"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 181,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "px-4 py-3",
									children: "Coordenadas"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 182,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "px-4 py-3",
									children: "Velocidad"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 183,
									columnNumber: 19
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 180,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 179,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: result.messages.slice(0, 200).map((m, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
							className: "border-t border-border/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
									className: "px-4 py-2",
									children: (/* @__PURE__ */ new Date(m.time * 1e3)).toLocaleString("es-MX")
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 188,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
									className: "px-4 py-2 text-muted-foreground",
									children: m.lat != null && m.lon != null ? `${m.lat.toFixed(5)}, ${m.lon.toFixed(5)}` : "—"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 189,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
									className: "px-4 py-2",
									children: m.speed != null ? `${Math.round(m.speed)} km/h` : "—"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 192,
									columnNumber: 21
								}, this)
							]
						}, `${m.time}-${i}`, true, {
							fileName: _jsxFileName,
							lineNumber: 187,
							columnNumber: 62
						}, this)) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 186,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 178,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 177,
					columnNumber: 11
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 144,
				columnNumber: 17
			}, this) : null
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 117,
		columnNumber: 10
	}, this);
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HistorialView, { session }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 202,
	columnNumber: 55
}, void 0) }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 202,
	columnNumber: 30
}, void 0);
//#endregion
export { SplitComponent as component };
