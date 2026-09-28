import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { J as Download, P as LoaderCircle, f as Search, it as Check, tt as ChevronsUpDown } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as downloadExcelWorkbook } from "./excel-export-lmFsj8Lg.mjs";
import { a as useWialonSession } from "./wialon-session-C7Oq2mAo.mjs";
import { _ as wialonReportTemplates, b as wialonUnits, g as wialonReportData, s as wialonExecReport } from "./wialon.functions-DfSWfIYa.mjs";
import { t as WialonGuard } from "./wialon-guard-JCWFzsMD.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as Line, r as YAxis, s as CartesianGrid, t as AreaChart, u as Legend } from "../_libs/recharts+[...].mjs";
import { t as _e } from "../_libs/cmdk.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.reportes-CAdb3e0N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Command$1 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$1.displayName = _e.displayName;
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("space-y-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					role: "combobox",
					"aria-expanded": open,
					"aria-label": "Seleccionar unidad",
					disabled: unavailable,
					className: "w-full justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 truncate",
						children: label
					}), unitsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "opacity-50" })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
				className: "w-(--radix-popover-trigger-width) p-0",
				align: "start",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Command$1, {
					shouldFilter: false,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, {
						value: search,
						onValueChange: setSearch,
						placeholder: "Buscar por nombre o ID…"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, { children: [
						unitsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 p-4 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Cargando unidades…"]
						}) : null,
						unitsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "p-4 text-sm text-destructive",
							children: unitsQuery.error instanceof Error ? unitsQuery.error.message : "No se pudieron cargar las unidades."
						}) : null,
						!unitsQuery.isLoading && !unitsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, { children: "No se encontraron unidades." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
							heading: `${filteredUnits.length} unidad(es)`,
							children: filteredUnits.map((unit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
								value: String(unit.id),
								onSelect: () => selectUnit(unit),
								className: "justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate font-medium",
										children: unit.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-xs text-muted-foreground",
										children: [
											"#",
											unit.id,
											" ·",
											" ",
											unit.online ? "En línea" : "Sin señal",
											unit.speed != null ? ` · ${Math.round(unit.speed)} km/h` : ""
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("ml-2 shrink-0", value?.id === unit.id ? "opacity-100" : "opacity-0") })]
							}, unit.id))
						})] }) : null
					] })]
				})
			})]
		}), !session && !disabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "Inicia sesión en Wialon para consultar unidades."
		}) : null]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: onGenerate,
				className: "grid gap-4 rounded-lg border border-border/60 bg-card/40 p-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Unidad"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitSelector, {
							session,
							value: unit,
							onSelectUnit: setUnit
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Desde"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "datetime-local",
						value: from,
						onChange: (event) => setFrom(event.target.value),
						className: "mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Hasta"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "datetime-local",
						value: to,
						onChange: (event) => setTo(event.target.value),
						className: "mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Plantilla de reporte para Excel (opcional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: templateKey,
							onChange: (event) => setTemplateKey(event.target.value),
							className: "mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Solo tabla de posiciones y sensores"
							}), templates.map((tpl) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: `${tpl.resourceId}:${tpl.templateId}`,
								children: [
									tpl.name,
									" · ",
									tpl.resourceName
								]
							}, `${tpl.resourceId}:${tpl.templateId}`))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: !unit,
							children: "Generar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => void onExport(),
							disabled: !unit || !range || reportQuery.isLoading || exporting,
							children: [
								exporting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}),
								" ",
								"Excel"
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: isFull ? "ORB-FULL: reportes de posición y valores de sensores en su tiempo de medición." : "ORB-LITE: reportes de posición con ubicación, velocidad y hora."
			}),
			exportError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: exportError
			}) : null,
			reportQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: reportQuery.error instanceof Error ? reportQuery.error.message : "No se pudo generar el reporte."
			}) : null,
			reportQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Consultando la plataforma…"]
			}) : null,
			chartData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border/60 bg-card/40 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold uppercase tracking-wide",
							children: "Velocidad por hora"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: speedChartRef,
							className: "mt-4 h-72",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: chartData,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "orbSpeedGrad",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "5%",
												stopColor: "#92d700",
												stopOpacity: .45
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "95%",
												stopColor: "#92d700",
												stopOpacity: .02
											})]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "#2c3e57",
											opacity: .6
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "label",
											tick: {
												fontSize: 11,
												fill: "#a8b2be"
											},
											stroke: "#2c3e57",
											minTickGap: 24
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tick: {
												fontSize: 11,
												fill: "#a8b2be"
											},
											stroke: "#2c3e57",
											unit: " km/h"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
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
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
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
										})
									]
								})
							})
						})]
					}),
					isFull && sensorNames.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border/60 bg-card/40 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold uppercase tracking-wide",
							children: "Sensores en tiempo de medición"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: sensorChartRef,
							className: "mt-4 h-80",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: chartData,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "#2c3e57",
											opacity: .6
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "label",
											tick: {
												fontSize: 11,
												fill: "#a8b2be"
											},
											stroke: "#2c3e57",
											minTickGap: 24
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tick: {
												fontSize: 11,
												fill: "#a8b2be"
											},
											stroke: "#2c3e57"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
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
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { paddingTop: "8px" } }),
										sensorNames.map((name, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
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
										}, name))
									]
								})
							})
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-x-auto rounded-lg border border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-card/60 text-xs uppercase tracking-wide text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "Hora"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "Latitud"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "Longitud"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "Velocidad"
									}),
									sensorNames.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: name
									}, name))
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.slice(0, 200).map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: formatTime(row.time)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: row.lat?.toFixed(5) ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: row.lon?.toFixed(5) ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: row.speed != null ? `${row.speed} km/h` : "—"
									}),
									sensorNames.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: row.sensors[name] ?? "—"
									}, name))
								]
							}, `${row.time}-${index}`)) })]
						}), rows.length > 200 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "px-3 py-2 text-xs text-muted-foreground",
							children: [
								"Se muestran 200 de ",
								rows.length,
								" registros. El archivo de Excel incluye todos."
							]
						}) : null]
					})
				]
			}) : null,
			!reportQuery.isLoading && range && chartData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No hay mensajes en el periodo seleccionado."
			}) : null
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportChart, { session }) });
//#endregion
export { SplitComponent as component };
