import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { b as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { f as Search, k as MapPinned, rt as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { b as wialonUnits, l as wialonGeofences } from "./wialon.functions-B5LcdM8M.mjs";
import { t as WialonGuard } from "./wialon-guard-BAmRBw40.mjs";
import { i as useHiddenUnits, n as matchesUnitSearch, r as selectAllState, t as Checkbox } from "./wialon-visibility-YRme0iUv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.mapa-CCpyM4q_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/wialon.mapa.tsx?tsr-split=component";
function MapaView({ session }) {
	const fetchUnits = useServerFn(wialonUnits);
	const fetchGeofences = useServerFn(wialonGeofences);
	const [focusId, setFocusId] = import_react.useState(null);
	const [search, setSearch] = import_react.useState("");
	const [geofenceMenuOpen, setGeofenceMenuOpen] = import_react.useState(false);
	const [selectedGeofenceKeys, setSelectedGeofenceKeys] = import_react.useState(null);
	const { hidden, setVisible } = useHiddenUnits(session);
	const query = useQuery({
		queryKey: ["wialon-units", session.sid],
		queryFn: () => fetchUnits({ data: {
			host: session.host,
			sid: session.sid
		} }),
		refetchInterval: 2e4
	});
	const geofencesQuery = useQuery({
		queryKey: ["wialon-geofences", session.sid],
		queryFn: () => fetchGeofences({ data: {
			host: session.host,
			sid: session.sid
		} }),
		refetchInterval: 6e4
	});
	const units = query.data?.units ?? [];
	const geofences = geofencesQuery.data?.zones ?? [];
	const keyForGeofence = (fence) => `${fence.resourceId}:${fence.id}`;
	const selectedKeys = selectedGeofenceKeys ?? geofences.map(keyForGeofence);
	const activeGeofences = geofences.filter((f) => selectedKeys.includes(keyForGeofence(f)));
	const visibleUnits = import_react.useMemo(() => units.filter((u) => !hidden.has(u.id)), [units, hidden]);
	const filtered = import_react.useMemo(() => units.filter((unit) => matchesUnitSearch(unit, search)), [units, search]);
	const filteredIds = filtered.map((u) => u.id);
	const allState = selectAllState(filteredIds, hidden);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid gap-6 lg:grid-cols-[2fr_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-[480px] rounded-lg border border-border/60 bg-card/40" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 59,
			columnNumber: 29
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 59,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "rounded-lg border border-border/60 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-lg border border-border/60 bg-card/40 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPinned, { className: "size-4 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 65,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "font-display text-sm font-bold uppercase tracking-widest",
									children: "Geocercas"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 66,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 64,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									activeGeofences.length,
									"/",
									geofences.length,
									" activas"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 70,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 63,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "relative mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setGeofenceMenuOpen((open) => !open),
								className: "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm hover:border-primary",
								"aria-expanded": geofenceMenuOpen,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: geofences.length === 0 ? "No hay geocercas" : activeGeofences.length === geofences.length ? "Todas las geocercas" : activeGeofences.length === 0 ? "Ninguna geocerca" : `${activeGeofences.length} geocercas seleccionadas` }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 76,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { className: `size-4 transition-transform ${geofenceMenuOpen ? "rotate-180" : ""}` }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 79,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 75,
								columnNumber: 13
							}, this), geofenceMenuOpen && geofences.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "absolute inset-x-0 top-full z-[1100] mt-1 max-h-64 overflow-auto rounded-md border border-border bg-background p-2 shadow-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-muted",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Checkbox, {
											checked: activeGeofences.length === geofences.length ? true : activeGeofences.length > 0 ? "indeterminate" : false,
											onCheckedChange: (checked) => setSelectedGeofenceKeys(checked === true ? geofences.map(keyForGeofence) : []),
											"aria-label": "Activar todas las geocercas"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 83,
											columnNumber: 19
										}, this), "Todas"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 82,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "my-1 border-t border-border/60" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 86,
										columnNumber: 17
									}, this),
									geofences.map((fence) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm hover:bg-muted",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Checkbox, {
												checked: selectedKeys.includes(keyForGeofence(fence)),
												onCheckedChange: (checked) => setSelectedGeofenceKeys((current) => {
													const next = new Set(current ?? geofences.map(keyForGeofence));
													const key = keyForGeofence(fence);
													if (checked === true) next.add(key);
													else next.delete(key);
													return [...next];
												}),
												"aria-label": `Activar ${fence.name}`
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 88,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "size-3 shrink-0 rounded-full border border-border",
												style: { backgroundColor: fence.color }
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 94,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "min-w-0 flex-1 truncate",
												children: fence.name
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 97,
												columnNumber: 21
											}, this)
										]
									}, `${fence.resourceId}-${fence.id}`, true, {
										fileName: _jsxFileName,
										lineNumber: 87,
										columnNumber: 41
									}, this))
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 81,
								columnNumber: 57
							}, this) : null]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 74,
							columnNumber: 11
						}, this),
						geofencesQuery.isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-2 text-xs text-destructive",
							children: geofencesQuery.error instanceof Error ? geofencesQuery.error.message : "No se pudieron cargar las geocercas."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 101,
							columnNumber: 37
						}, this) : null
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 62,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "font-display text-sm font-bold uppercase tracking-widest",
						children: [
							"Unidades (",
							visibleUnits.length,
							"/",
							units.length,
							")"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 106,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "flex cursor-pointer items-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Checkbox, {
							checked: allState,
							disabled: filteredIds.length === 0,
							onCheckedChange: () => setVisible(filteredIds, allState !== true),
							"aria-label": "Mostrar u ocultar todas las unidades"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 110,
							columnNumber: 13
						}, this), "Todas"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 109,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 105,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "relative mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 115,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Buscar unidad, IMEI o usuario…",
						"aria-label": "Buscar unidades",
						className: "pl-9"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 116,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 114,
					columnNumber: 9
				}, this),
				query.isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-3 text-sm text-destructive",
					children: query.error instanceof Error ? query.error.message : "Error al consultar la plataforma."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 118,
					columnNumber: 26
				}, this) : null,
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
					className: "mt-3 max-h-[380px] space-y-2 overflow-auto pr-1 text-sm",
					children: [filtered.map((unit) => {
						const isVisible = !hidden.has(unit.id);
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
							className: `flex items-start gap-3 rounded-md border px-3 py-2 ${focusId === unit.id ? "border-primary" : "border-border/60"} ${isVisible ? "" : "opacity-60"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Checkbox, {
								className: "mt-0.5",
								checked: isVisible,
								onCheckedChange: (value) => setVisible([unit.id], value === true),
								"aria-label": `Mostrar ${unit.name} en el mapa`
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 125,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setFocusId(unit.id),
								className: "min-w-0 flex-1 text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "truncate font-semibold",
											children: unit.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 128,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: `shrink-0 text-xs uppercase ${unit.online ? "text-primary" : "text-muted-foreground"}`,
											children: unit.online ? "En línea" : "Sin señal"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 129,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 127,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "mt-1 block truncate text-xs text-muted-foreground",
										children: [unit.imei ? `IMEI ${unit.imei}` : `#${unit.id}`, unit.creatorName ? ` · ${unit.creatorName}` : ""]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 133,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "block text-xs text-muted-foreground",
										children: [unit.speed != null ? `${Math.round(unit.speed)} km/h · ` : "", unit.lastMessage ? (/* @__PURE__ */ new Date(unit.lastMessage * 1e3)).toLocaleString("es-MX") : "sin mensajes"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 137,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 126,
								columnNumber: 17
							}, this)]
						}, unit.id, true, {
							fileName: _jsxFileName,
							lineNumber: 124,
							columnNumber: 18
						}, this);
					}), !query.isLoading && filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
						className: "text-muted-foreground",
						children: units.length === 0 ? "No hay unidades en esta cuenta." : "Ninguna unidad coincide con la búsqueda."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 144,
						columnNumber: 56
					}, this) : null]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 121,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 61,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 58,
		columnNumber: 10
	}, this);
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapaView, { session }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 151,
	columnNumber: 55
}, void 0) }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 151,
	columnNumber: 30
}, void 0);
//#endregion
export { SplitComponent as component };
