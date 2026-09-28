import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { J as Download, P as LoaderCircle, f as Search, it as Check, tt as ChevronsUpDown } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as downloadExcelWorkbook } from "./excel-export-lmFsj8Lg.mjs";
import { a as useWialonSession } from "./wialon-session-C7Oq2mAo.mjs";
import { _ as wialonReportTemplates, b as wialonUnits, g as wialonReportData, s as wialonExecReport } from "./wialon.functions-B5LcdM8M.mjs";
import { t as WialonGuard } from "./wialon-guard-BAmRBw40.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as Line, r as YAxis, s as CartesianGrid, t as AreaChart, u as Legend } from "../_libs/recharts+[...].mjs";
import { t as _e } from "../_libs/cmdk.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.reportes-Cbv6Piyo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$4 = "/app/applet/src/components/ui/command.tsx";
var Command$1 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 15,
	columnNumber: 3
}, void 0));
Command$1.displayName = _e.displayName;
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 43,
		columnNumber: 5
	}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 44,
		columnNumber: 5
	}, void 0)]
}, void 0, true, {
	fileName: _jsxFileName$4,
	lineNumber: 42,
	columnNumber: 3
}, void 0));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 61,
	columnNumber: 3
}, void 0));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 74,
	columnNumber: 3
}, void 0));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 83,
	columnNumber: 3
}, void 0));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 99,
	columnNumber: 3
}, void 0));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 111,
	columnNumber: 3
}, void 0));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 125,
		columnNumber: 5
	}, void 0);
};
CommandShortcut.displayName = "CommandShortcut";
var _jsxFileName$3 = "/app/applet/src/components/ui/popover.tsx";
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Portal, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$3,
	lineNumber: 17,
	columnNumber: 5
}, void 0) }, void 0, false, {
	fileName: _jsxFileName$3,
	lineNumber: 16,
	columnNumber: 3
}, void 0));
PopoverContent.displayName = Content2.displayName;
var _jsxFileName$2 = "/app/applet/src/components/wialon/UnitSelector.tsx";
/** Selector con búsqueda rápida de las unidades disponibles para el SID actual. */
function UnitSelector({ session: sessionOverride, value = null, onSelectUnit, placeholder = "Selecciona una unidad", disabled = false, className }) {
	const storedSession = useWialonSession();
	const session = sessionOverride ?? storedSession ?? null;
	const fetchUnits = useServerFn(wialonUnits);
	const [open, setOpen] = import_react.useState(false);
	const [search, setSearch] = import_react.useState("");
	const unitsQuery = useQuery({
		queryKey: [
			"wialon-units",
			session?.host,
			session?.sid
		],
		queryFn: () => fetchUnits({ data: {
			host: session.host,
			sid: session.sid
		} }),
		enabled: session != null,
		staleTime: 15e3
	});
	const filteredUnits = import_react.useMemo(() => {
		const needle = search.trim().toLocaleLowerCase("es-MX");
		if (!needle) return unitsQuery.data?.units ?? [];
		return (unitsQuery.data?.units ?? []).filter((unit) => `${unit.name} ${unit.id} ${unit.imei ?? ""} ${unit.creatorName ?? ""}`.toLocaleLowerCase("es-MX").includes(needle));
	}, [search, unitsQuery.data?.units]);
	const selectUnit = import_react.useCallback((unit) => {
		onSelectUnit(unit);
		setOpen(false);
		setSearch("");
	}, [onSelectUnit]);
	const label = value?.name ?? placeholder;
	const unavailable = disabled || session == null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: cn("space-y-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Popover, {
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PopoverTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					type: "button",
					variant: "outline",
					role: "combobox",
					"aria-expanded": open,
					"aria-label": "Seleccionar unidad",
					disabled: unavailable,
					className: "w-full justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "min-w-0 truncate",
						children: label
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 88,
						columnNumber: 13
					}, this), unitsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "animate-spin" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 90,
						columnNumber: 15
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronsUpDown, { className: "opacity-50" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 92,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 79,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 78,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PopoverContent, {
				className: "w-(--radix-popover-trigger-width) p-0",
				align: "start",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Command$1, {
					shouldFilter: false,
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CommandInput, {
						value: search,
						onValueChange: setSearch,
						placeholder: "Buscar por nombre o ID…"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 98,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CommandList, { children: [
						unitsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "flex items-center gap-2 p-4 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "size-4 animate-spin" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 106,
								columnNumber: 19
							}, this), " Cargando unidades…"]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 105,
							columnNumber: 17
						}, this) : null,
						unitsQuery.isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "p-4 text-sm text-destructive",
							children: unitsQuery.error instanceof Error ? unitsQuery.error.message : "No se pudieron cargar las unidades."
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 110,
							columnNumber: 17
						}, this) : null,
						!unitsQuery.isLoading && !unitsQuery.isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CommandEmpty, { children: "No se encontraron unidades." }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 118,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CommandGroup, {
							heading: `${filteredUnits.length} unidad(es)`,
							children: filteredUnits.map((unit) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CommandItem, {
								value: String(unit.id),
								onSelect: () => selectUnit(unit),
								className: "justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "block truncate font-medium",
										children: unit.name
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 128,
										columnNumber: 27
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "block text-xs text-muted-foreground",
										children: [
											"#",
											unit.id,
											" · ",
											unit.online ? "En línea" : "Sin señal",
											unit.speed != null ? ` · ${Math.round(unit.speed)} km/h` : ""
										]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 129,
										columnNumber: 27
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 127,
									columnNumber: 25
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: cn("ml-2 shrink-0", value?.id === unit.id ? "opacity-100" : "opacity-0") }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 134,
									columnNumber: 25
								}, this)]
							}, unit.id, true, {
								fileName: _jsxFileName$2,
								lineNumber: 121,
								columnNumber: 23
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 119,
							columnNumber: 19
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 117,
							columnNumber: 17
						}, this) : null
					] }, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 103,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 97,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 96,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 77,
			columnNumber: 7
		}, this), !session && !disabled ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-xs text-muted-foreground",
			children: "Inicia sesión en Wialon para consultar unidades."
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 150,
			columnNumber: 9
		}, this) : null]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 76,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/wialon/ReportChart.tsx";
var SERIES_COLORS = [
	"#92d700",
	"#38bdf8",
	"#f97316",
	"#22c55e",
	"#e879f9",
	"#facc15",
	"#34d399",
	"#fb7185"
];
function toLocalInput(date) {
	const pad = (n) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function toUnix(value) {
	const time = new Date(value).getTime();
	return Number.isFinite(time) ? Math.floor(time / 1e3) : 0;
}
function formatTime(seconds) {
	return (/* @__PURE__ */ new Date(seconds * 1e3)).toLocaleString("es-MX", {
		day: "2-digit",
		month: "2-digit",
		hour: "2-digit",
		minute: "2-digit"
	});
}
/**
* Reportes gráficos de la plataforma.
* ORB-LITE: reporte de posición (ubicación, velocidad y hora).
* ORB-FULL: además, valores de sensores en su tiempo de medición.
* En ambos casos se puede exportar a Excel (.xlsx) el resultado tabular,
* incluyendo las tablas de `report/exec_report` cuando se elige una plantilla.
*/
function ReportChart({ session }) {
	const isFull = session.host === "full";
	const fetchReport = useServerFn(wialonReportData);
	const fetchTemplates = useServerFn(wialonReportTemplates);
	const execReport = useServerFn(wialonExecReport);
	const [unit, setUnit] = import_react.useState(null);
	const [from, setFrom] = import_react.useState(() => toLocalInput(/* @__PURE__ */ new Date(Date.now() - 864e5)));
	const [to, setTo] = import_react.useState(() => toLocalInput(/* @__PURE__ */ new Date()));
	const [templateKey, setTemplateKey] = import_react.useState("");
	const [range, setRange] = import_react.useState(null);
	const [exporting, setExporting] = import_react.useState(false);
	const [exportError, setExportError] = import_react.useState(null);
	const speedChartRef = import_react.useRef(null);
	const sensorChartRef = import_react.useRef(null);
	const templates = useQuery({
		queryKey: [
			"wialon-report-templates",
			session.host,
			session.sid
		],
		queryFn: () => fetchTemplates({ data: {
			host: session.host,
			sid: session.sid
		} }),
		staleTime: 3e5
	}).data?.templates ?? [];
	const reportQuery = useQuery({
		queryKey: [
			"wialon-report",
			session.sid,
			unit?.id,
			range?.from,
			range?.to,
			isFull
		],
		queryFn: () => fetchReport({ data: {
			host: session.host,
			sid: session.sid,
			unitId: unit.id,
			timeFrom: range.from,
			timeTo: range.to,
			withSensors: isFull
		} }),
		enabled: unit != null && range != null,
		staleTime: 0,
		gcTime: 0
	});
	const reportRows = reportQuery.data?.rows;
	const rows = import_react.useMemo(() => reportRows ?? [], [reportRows]);
	const sensorNames = reportQuery.data?.sensorNames ?? [];
	const chartData = import_react.useMemo(() => rows.map((row) => ({
		label: formatTime(row.time),
		velocidad: row.speed ?? null,
		...row.sensors
	})), [rows]);
	function onGenerate(event) {
		event.preventDefault();
		setExportError(null);
		const start = toUnix(from);
		const end = toUnix(to);
		if (!unit || !start || !end || end <= start) return;
		if (range && range.from === start && range.to === end) {
			reportQuery.refetch();
			return;
		}
		setRange({
			from: start,
			to: end
		});
	}
	async function onExport() {
		if (!unit || !range) return;
		setExporting(true);
		setExportError(null);
		try {
			const positionRows = rows.map((row) => {
				const base = {
					Hora: formatTime(row.time),
					Latitud: row.lat,
					Longitud: row.lon,
					"Velocidad (km/h)": row.speed,
					"Rumbo (°)": row.course
				};
				for (const name of sensorNames) base[name] = row.sensors[name] ?? null;
				return base;
			});
			const positionHeader = positionRows.length ? Object.keys(positionRows[0]) : ["Hora"];
			const sheets = [{
				name: "Posiciones",
				rows: [positionHeader, ...positionRows.length ? positionRows.map((row) => positionHeader.map((header) => row[header] ?? null)) : [["Sin datos"]]]
			}];
			const selected = templates.find((tpl) => `${tpl.resourceId}:${tpl.templateId}` === templateKey);
			if (selected) {
				const result = await execReport({ data: {
					host: session.host,
					sid: session.sid,
					resourceId: selected.resourceId,
					templateId: selected.templateId,
					unitId: unit.id,
					timeFrom: range.from,
					timeTo: range.to
				} });
				sheets.push(...result.tables.map((table, index) => ({
					name: `${index + 1} ${table.label}`,
					rows: [table.header, ...table.rows]
				})));
			}
			const charts = [];
			const speedColumn = positionHeader.indexOf("Velocidad (km/h)") + 1;
			if (speedColumn > 0) charts.push({
				sheetName: "Posiciones",
				title: "Velocidad por hora",
				series: [{
					name: "Velocidad (km/h)",
					column: speedColumn
				}],
				dataRows: positionRows.length
			});
			if (isFull && sensorNames.length > 0) {
				const sensorSeries = sensorNames.map((name) => ({
					name,
					column: positionHeader.indexOf(name) + 1
				})).filter((serie) => serie.column > 0);
				if (sensorSeries.length > 0) charts.push({
					sheetName: "Posiciones",
					title: "Sensores en tiempo de medición",
					series: sensorSeries,
					dataRows: positionRows.length
				});
			}
			const stamp = (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace(/[:T]/g, "-");
			const baseName = `reporte-${unit.name.replace(/\s+/g, "-")}-${stamp}`;
			await downloadExcelWorkbook({
				filename: `${baseName}.xlsx`,
				sheets,
				...charts.length > 0 ? { charts } : {}
			});
		} catch (error) {
			setExportError(error instanceof Error ? error.message : "No se pudo generar el archivo de Excel.");
		} finally {
			setExporting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
				onSubmit: onGenerate,
				className: "grid gap-4 rounded-lg border border-border/60 bg-card/40 p-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Unidad"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 241,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UnitSelector, {
							session,
							value: unit,
							onSelectUnit: setUnit
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 244,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 240,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Desde"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 247,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
						type: "datetime-local",
						value: from,
						onChange: (event) => setFrom(event.target.value),
						className: "mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 250,
						columnNumber: 11
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 246,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Hasta"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 258,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
						type: "datetime-local",
						value: to,
						onChange: (event) => setTo(event.target.value),
						className: "mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 261,
						columnNumber: 11
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 257,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "md:col-span-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Plantilla de reporte para Excel (opcional)"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 270,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
							value: templateKey,
							onChange: (event) => setTemplateKey(event.target.value),
							className: "mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
								value: "",
								children: "Solo tabla de posiciones y sensores"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 278,
								columnNumber: 13
							}, this), templates.map((tpl) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
								value: `${tpl.resourceId}:${tpl.templateId}`,
								children: [
									tpl.name,
									" · ",
									tpl.resourceName
								]
							}, `${tpl.resourceId}:${tpl.templateId}`, true, {
								fileName: _jsxFileName$1,
								lineNumber: 280,
								columnNumber: 15
							}, this))]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 273,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 269,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							type: "submit",
							disabled: !unit,
							children: "Generar"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 291,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => void onExport(),
							disabled: !unit || !range || reportQuery.isLoading || exporting,
							children: [exporting ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "animate-spin" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 300,
								columnNumber: 26
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, {}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 300,
								columnNumber: 70
							}, this), " Excel"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 294,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 290,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 236,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground",
				children: isFull ? "ORB-FULL: reportes de posición y valores de sensores en su tiempo de medición." : "ORB-LITE: reportes de posición con ubicación, velocidad y hora."
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 305,
				columnNumber: 7
			}, this),
			exportError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-destructive",
				children: exportError
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 311,
				columnNumber: 22
			}, this) : null,
			reportQuery.isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-destructive",
				children: reportQuery.error instanceof Error ? reportQuery.error.message : "No se pudo generar el reporte."
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 313,
				columnNumber: 9
			}, this) : null,
			reportQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "flex items-center gap-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "size-4 animate-spin" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 322,
					columnNumber: 11
				}, this), " Consultando la plataforma…"]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 321,
				columnNumber: 9
			}, this) : null,
			chartData.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border border-border/60 bg-card/40 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-display text-lg font-bold uppercase tracking-wide",
							children: "Velocidad por hora"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 329,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							ref: speedChartRef,
							className: "mt-4 h-72",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AreaChart, {
									data: chartData,
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("defs", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("linearGradient", {
											id: "orbSpeedGrad",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
												offset: "5%",
												stopColor: "#92d700",
												stopOpacity: .45
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 337,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
												offset: "95%",
												stopColor: "#92d700",
												stopOpacity: .02
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 338,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 336,
											columnNumber: 21
										}, this) }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 335,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "#2c3e57",
											opacity: .6
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 341,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(XAxis, {
											dataKey: "label",
											tick: {
												fontSize: 11,
												fill: "#a8b2be"
											},
											stroke: "#2c3e57",
											minTickGap: 24
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 342,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(YAxis, {
											tick: {
												fontSize: 11,
												fill: "#a8b2be"
											},
											stroke: "#2c3e57",
											unit: " km/h"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 348,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tooltip, {
											contentStyle: {
												backgroundColor: "#0e1f39",
												borderColor: "#2c3e57",
												borderRadius: "0.5rem",
												color: "#f6f9fc",
												fontSize: "12px",
												boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
											},
											itemStyle: {
												color: "#92d700",
												fontWeight: "bold"
											},
											labelStyle: {
												color: "#a8b2be",
												fontWeight: 600,
												marginBottom: "4px"
											}
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 349,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Area, {
											type: "monotone",
											dataKey: "velocidad",
											name: "Velocidad",
											stroke: "#92d700",
											strokeWidth: 2.5,
											fillOpacity: 1,
											fill: "url(#orbSpeedGrad)",
											dot: {
												r: 2.5,
												fill: "#92d700",
												strokeWidth: 0
											},
											activeDot: {
												r: 5,
												fill: "#ffffff",
												stroke: "#92d700",
												strokeWidth: 2
											},
											connectNulls: true
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 365,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 334,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 333,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 332,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 328,
						columnNumber: 11
					}, this),
					isFull && sensorNames.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border border-border/60 bg-card/40 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-display text-lg font-bold uppercase tracking-wide",
							children: "Sensores en tiempo de medición"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 389,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							ref: sensorChartRef,
							className: "mt-4 h-80",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LineChart, {
									data: chartData,
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "#2c3e57",
											opacity: .6
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 395,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(XAxis, {
											dataKey: "label",
											tick: {
												fontSize: 11,
												fill: "#a8b2be"
											},
											stroke: "#2c3e57",
											minTickGap: 24
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 396,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(YAxis, {
											tick: {
												fontSize: 11,
												fill: "#a8b2be"
											},
											stroke: "#2c3e57"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 402,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tooltip, {
											contentStyle: {
												backgroundColor: "#0e1f39",
												borderColor: "#2c3e57",
												borderRadius: "0.5rem",
												color: "#f6f9fc",
												fontSize: "12px",
												boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
											},
											labelStyle: {
												color: "#a8b2be",
												fontWeight: 600,
												marginBottom: "4px"
											}
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 403,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Legend, { wrapperStyle: { paddingTop: "8px" } }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 418,
											columnNumber: 21
										}, this),
										sensorNames.map((name, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Line, {
											type: "monotone",
											dataKey: name,
											name,
											stroke: SERIES_COLORS[(index + 1) % SERIES_COLORS.length],
											dot: {
												r: 2,
												fill: SERIES_COLORS[(index + 1) % SERIES_COLORS.length],
												strokeWidth: 0
											},
											strokeWidth: 2,
											connectNulls: true
										}, name, false, {
											fileName: _jsxFileName$1,
											lineNumber: 420,
											columnNumber: 23
										}, this))
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 394,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 393,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 392,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 388,
						columnNumber: 13
					}, this) : null,
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "overflow-x-auto rounded-lg border border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
							className: "w-full text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
								className: "bg-card/60 text-xs uppercase tracking-wide text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-3 py-2",
										children: "Hora"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 445,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-3 py-2",
										children: "Latitud"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 446,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-3 py-2",
										children: "Longitud"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 447,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-3 py-2",
										children: "Velocidad"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 448,
										columnNumber: 19
									}, this),
									sensorNames.map((name) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-3 py-2",
										children: name
									}, name, false, {
										fileName: _jsxFileName$1,
										lineNumber: 450,
										columnNumber: 21
									}, this))
								] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 444,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 443,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: rows.slice(0, 200).map((row, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
								className: "border-t border-border/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "px-3 py-2",
										children: formatTime(row.time)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 459,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "px-3 py-2",
										children: row.lat?.toFixed(5) ?? "—"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 460,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "px-3 py-2",
										children: row.lon?.toFixed(5) ?? "—"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 461,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "px-3 py-2",
										children: row.speed != null ? `${row.speed} km/h` : "—"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 462,
										columnNumber: 21
									}, this),
									sensorNames.map((name) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "px-3 py-2",
										children: row.sensors[name] ?? "—"
									}, name, false, {
										fileName: _jsxFileName$1,
										lineNumber: 464,
										columnNumber: 23
									}, this))
								]
							}, `${row.time}-${index}`, true, {
								fileName: _jsxFileName$1,
								lineNumber: 458,
								columnNumber: 19
							}, this)) }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 456,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 442,
							columnNumber: 13
						}, this), rows.length > 200 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "px-3 py-2 text-xs text-muted-foreground",
							children: [
								"Se muestran 200 de ",
								rows.length,
								" registros. El archivo de Excel incluye todos."
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 473,
							columnNumber: 15
						}, this) : null]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 441,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 327,
				columnNumber: 9
			}, this) : null,
			!reportQuery.isLoading && range && chartData.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground",
				children: "No hay mensajes en el periodo seleccionado."
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 482,
				columnNumber: 9
			}, this) : null
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 235,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/wialon.reportes.tsx?tsr-split=component";
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ReportChart, { session }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 3,
	columnNumber: 55
}, void 0) }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 3,
	columnNumber: 30
}, void 0);
//#endregion
export { SplitComponent as component };
