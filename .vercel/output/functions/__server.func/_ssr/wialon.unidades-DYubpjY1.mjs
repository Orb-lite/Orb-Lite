import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { b as RefreshCw, g as Search, n as X } from "../_libs/lucide-react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { b as wialonUnits, v as wialonSendCommand, y as wialonUnitDetail } from "./wialon.functions-Cw4L-t5R.mjs";
import { t as WialonGuard } from "./wialon-guard-BAmRBw40.mjs";
import { i as useHiddenUnits, n as matchesUnitSearch, r as selectAllState, t as Checkbox } from "./wialon-visibility-YRme0iUv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.unidades-DYubpjY1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/wialon-unit-detail.tsx";
function WialonUnitDetail({ session, unitId, onClose }) {
	const detailFn = useServerFn(wialonUnitDetail);
	const commandFn = useServerFn(wialonSendCommand);
	const [feedback, setFeedback] = import_react.useState(null);
	const [busy, setBusy] = import_react.useState(null);
	const detail = useQuery({
		queryKey: [
			"wialon-unit-detail",
			session.sid,
			unitId
		],
		queryFn: () => detailFn({ data: {
			host: session.host,
			sid: session.sid,
			unitId
		} })
	});
	async function runCommand(name, link) {
		setFeedback(null);
		setBusy(name);
		try {
			await commandFn({ data: {
				host: session.host,
				sid: session.sid,
				unitId,
				commandName: name,
				linkType: link
			} });
			setFeedback(`Comando "${name}" enviado a la unidad.`);
		} catch (error) {
			setFeedback(error instanceof Error ? error.message : "No se pudo enviar el comando.");
		} finally {
			setBusy(null);
		}
	}
	const data = detail.data;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-background/80 p-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "w-full max-w-2xl rounded-lg border border-border/60 bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "font-display text-lg font-bold uppercase tracking-wide",
						children: data?.unit.name ?? "Detalle de unidad"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 54,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: onClose,
						className: "inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "size-4" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 61,
							columnNumber: 13
						}, this), " Cerrar"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 57,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 53,
					columnNumber: 9
				}, this),
				detail.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "Cargando…"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 65,
					columnNumber: 29
				}, this) : null,
				detail.isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-4 text-sm text-destructive",
					children: detail.error instanceof Error ? detail.error.message : "Error al consultar la unidad."
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 67,
					columnNumber: 11
				}, this) : null,
				data ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-5 space-y-6 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dl", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
									label: "IMEI / ID único",
									value: data.uniqueId ?? "—"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 75,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
									label: "Teléfono",
									value: data.phone ?? "—"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 76,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
									label: "Estado",
									value: data.unit.online ? "En línea" : "Sin señal"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 77,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
									label: "Última señal",
									value: data.unit.lastMessage ? (/* @__PURE__ */ new Date(data.unit.lastMessage * 1e3)).toLocaleString("es-MX") : "—"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 78,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
									label: "Coordenadas",
									value: data.unit.lat != null && data.unit.lon != null ? `${data.unit.lat.toFixed(5)}, ${data.unit.lon.toFixed(5)}` : "—"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 86,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
									label: "Velocidad",
									value: data.unit.speed != null ? `${Math.round(data.unit.speed)} km/h` : "—"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 94,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 74,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
							children: [
								"Sensores (",
								data.sensors.length,
								")"
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 101,
							columnNumber: 15
						}, this), data.sensors.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-2 text-muted-foreground",
							children: "Esta unidad no tiene sensores configurados."
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 105,
							columnNumber: 17
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
							className: "mt-2 space-y-1",
							children: data.sensors.map((sensor, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
								className: "flex justify-between gap-3 border-b border-border/40 py-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: sensor.name }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 115,
									columnNumber: 23
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-semibold",
									children: [
										sensor.value,
										" ",
										sensor.metrics
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 116,
									columnNumber: 23
								}, this)]
							}, `${sensor.id}-${index}`, true, {
								fileName: _jsxFileName$1,
								lineNumber: 111,
								columnNumber: 21
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 109,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 100,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
								children: [
									"Comandos (",
									data.commands.length,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 126,
								columnNumber: 15
							}, this),
							data.commands.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-2 text-muted-foreground",
								children: "No hay comandos configurados para esta unidad."
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 130,
								columnNumber: 17
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: data.commands.map((command, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									disabled: busy === command.name,
									onClick: () => void runCommand(command.name, command.link),
									className: "rounded-md border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary disabled:opacity-60",
									children: busy === command.name ? "Enviando…" : command.name
								}, `${command.id}-${index}`, false, {
									fileName: _jsxFileName$1,
									lineNumber: 136,
									columnNumber: 21
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 134,
								columnNumber: 17
							}, this),
							feedback ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-3 text-sm text-primary",
								children: feedback
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 147,
								columnNumber: 27
							}, this) : null
						] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 125,
							columnNumber: 13
						}, this),
						data.params.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
							children: "Último mensaje"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 152,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-2 grid gap-1 sm:grid-cols-2",
							children: data.params.map((param, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-semibold text-foreground",
										children: [param.key, ":"]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 158,
										columnNumber: 23
									}, this),
									" ",
									param.value
								]
							}, `${param.key}-${index}`, true, {
								fileName: _jsxFileName$1,
								lineNumber: 157,
								columnNumber: 21
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 155,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 151,
							columnNumber: 15
						}, this) : null
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 73,
					columnNumber: 11
				}, this) : null
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 52,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 51,
		columnNumber: 5
	}, this);
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
		className: "text-xs uppercase tracking-widest text-muted-foreground",
		children: label
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 175,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
		className: "mt-1 font-semibold",
		children: value
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 176,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 174,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/wialon.unidades.tsx?tsr-split=component";
function UnidadesView({ session }) {
	const fetchUnits = useServerFn(wialonUnits);
	const [detailId, setDetailId] = import_react.useState(null);
	const [search, setSearch] = import_react.useState("");
	const { hidden, setVisible } = useHiddenUnits(session);
	const query = useQuery({
		queryKey: ["wialon-units", session.sid],
		queryFn: () => fetchUnits({ data: {
			host: session.host,
			sid: session.sid
		} }),
		refetchInterval: 3e4
	});
	const units = query.data?.units ?? [];
	const online = units.filter((u) => u.online).length;
	const filtered = import_react.useMemo(() => units.filter((unit) => matchesUnitSearch(unit, search)), [units, search]);
	const filteredIds = filtered.map((u) => u.id);
	const allState = selectAllState(filteredIds, hidden);
	const shown = units.filter((u) => !hidden.has(u.id)).length;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					units.length,
					" unidades · ",
					online,
					" en línea · ",
					shown,
					" visibles en el mapa"
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 41,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-1 flex-wrap items-center justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "relative w-full max-w-xs",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 46,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Buscar unidad, IMEI o usuario…",
						"aria-label": "Buscar unidades",
						className: "pl-9"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 47,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 45,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: () => void query.refetch(),
					className: "inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: `size-4 ${query.isFetching ? "animate-spin" : ""}` }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 50,
						columnNumber: 13
					}, this), " Actualizar"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 49,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 44,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 40,
			columnNumber: 7
		}, this),
		query.isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "mt-4 text-sm text-destructive",
			children: query.error instanceof Error ? query.error.message : "Error al consultar la plataforma."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 55,
			columnNumber: 24
		}, this) : null,
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mt-5 overflow-x-auto rounded-lg border border-border/60",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
				className: "w-full min-w-[820px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
					className: "bg-card/60 text-left text-xs uppercase tracking-widest text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "w-10 px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Checkbox, {
								checked: allState,
								disabled: filteredIds.length === 0,
								onCheckedChange: () => setVisible(filteredIds, allState !== true),
								"aria-label": "Mostrar u ocultar todas las unidades"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 64,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 63,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "px-4 py-3",
							children: "Unidad"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 66,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "px-4 py-3",
							children: "IMEI"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 67,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "px-4 py-3",
							children: "Usuario"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 68,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "px-4 py-3",
							children: "Estado"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "px-4 py-3",
							children: "Velocidad"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 70,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "px-4 py-3",
							children: "Última señal"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 71,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "px-4 py-3 text-right",
							children: "Detalle"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 72,
							columnNumber: 15
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 62,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 61,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: [filtered.map((unit) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
					className: "border-t border-border/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Checkbox, {
								checked: !hidden.has(unit.id),
								onCheckedChange: (value) => setVisible([unit.id], value === true),
								"aria-label": `Mostrar ${unit.name} en el mapa`
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 78,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 77,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
							className: "px-4 py-3 font-semibold",
							children: unit.name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 80,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
							className: "px-4 py-3 font-mono text-xs text-muted-foreground",
							children: unit.imei ?? "—"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 81,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: unit.creatorName ?? "—"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 84,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: unit.online ? "text-primary" : "text-muted-foreground",
								children: unit.online ? "En línea" : "Sin señal"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 86,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 85,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
							className: "px-4 py-3",
							children: unit.speed != null ? `${Math.round(unit.speed)} km/h` : "—"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 90,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: unit.lastMessage ? (/* @__PURE__ */ new Date(unit.lastMessage * 1e3)).toLocaleString("es-MX") : "—"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 93,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
							className: "px-4 py-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setDetailId(unit.id),
								className: "rounded-md border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-primary hover:text-primary",
								children: "Ver detalle"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 97,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 96,
							columnNumber: 17
						}, this)
					]
				}, unit.id, true, {
					fileName: _jsxFileName,
					lineNumber: 76,
					columnNumber: 35
				}, this)), !query.isLoading && filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
					className: "px-4 py-6 text-muted-foreground",
					colSpan: 8,
					children: units.length === 0 ? "No hay unidades en esta cuenta." : "Ninguna unidad coincide con la búsqueda."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 103,
					columnNumber: 17
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 102,
					columnNumber: 58
				}, this) : null] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 75,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 60,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 59,
			columnNumber: 7
		}, this),
		detailId != null ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(WialonUnitDetail, {
			session,
			unitId: detailId,
			onClose: () => setDetailId(null)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 111,
			columnNumber: 27
		}, this) : null
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 39,
		columnNumber: 10
	}, this);
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UnidadesView, { session }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 114,
	columnNumber: 55
}, void 0) }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 114,
	columnNumber: 30
}, void 0);
//#endregion
export { SplitComponent as component };
