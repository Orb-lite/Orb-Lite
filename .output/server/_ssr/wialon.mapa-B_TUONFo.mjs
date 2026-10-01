import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { N as MapPinned, g as Search, pt as ChevronDown } from "../_libs/lucide-react.mjs";
import { b as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { b as wialonUnits, l as wialonGeofences } from "./wialon.functions-C37hcc8N.mjs";
import { t as WialonGuard } from "./wialon-guard-JCWFzsMD.mjs";
import { i as useHiddenUnits, n as matchesUnitSearch, r as selectAllState, t as Checkbox } from "./wialon-visibility-CGREBqIB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.mapa-B_TUONFo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[2fr_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[480px] rounded-lg border border-border/60 bg-card/40" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border/60 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border/60 bg-card/40 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPinned, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-sm font-bold uppercase tracking-widest",
									children: "Geocercas"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									activeGeofences.length,
									"/",
									geofences.length,
									" activas"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setGeofenceMenuOpen((open) => !open),
								className: "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm hover:border-primary",
								"aria-expanded": geofenceMenuOpen,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: geofences.length === 0 ? "No hay geocercas" : activeGeofences.length === geofences.length ? "Todas las geocercas" : activeGeofences.length === 0 ? "Ninguna geocerca" : `${activeGeofences.length} geocercas seleccionadas` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `size-4 transition-transform ${geofenceMenuOpen ? "rotate-180" : ""}` })]
							}), geofenceMenuOpen && geofences.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-x-0 top-full z-[1100] mt-1 max-h-64 overflow-auto rounded-md border border-border bg-background p-2 shadow-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: activeGeofences.length === geofences.length ? true : activeGeofences.length > 0 ? "indeterminate" : false,
											onCheckedChange: (checked) => setSelectedGeofenceKeys(checked === true ? geofences.map(keyForGeofence) : []),
											"aria-label": "Activar todas las geocercas"
										}), "Todas"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-1 border-t border-border/60" }),
									geofences.map((fence) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm hover:bg-muted",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												checked: selectedKeys.includes(keyForGeofence(fence)),
												onCheckedChange: (checked) => setSelectedGeofenceKeys((current) => {
													const next = new Set(current ?? geofences.map(keyForGeofence));
													const key = keyForGeofence(fence);
													if (checked === true) next.add(key);
													else next.delete(key);
													return [...next];
												}),
												"aria-label": `Activar ${fence.name}`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "size-3 shrink-0 rounded-full border border-border",
												style: { backgroundColor: fence.color }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "min-w-0 flex-1 truncate",
												children: fence.name
											})
										]
									}, `${fence.resourceId}-${fence.id}`))
								]
							}) : null]
						}),
						geofencesQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-destructive",
							children: geofencesQuery.error instanceof Error ? geofencesQuery.error.message : "No se pudieron cargar las geocercas."
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-sm font-bold uppercase tracking-widest",
						children: [
							"Unidades (",
							visibleUnits.length,
							"/",
							units.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex cursor-pointer items-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: allState,
							disabled: filteredIds.length === 0,
							onCheckedChange: () => setVisible(filteredIds, allState !== true),
							"aria-label": "Mostrar u ocultar todas las unidades"
						}), "Todas"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Buscar unidad, IMEI o usuario…",
						"aria-label": "Buscar unidades",
						className: "pl-9"
					})]
				}),
				query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-destructive",
					children: query.error instanceof Error ? query.error.message : "Error al consultar la plataforma."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 max-h-[380px] space-y-2 overflow-auto pr-1 text-sm",
					children: [filtered.map((unit) => {
						const isVisible = !hidden.has(unit.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: `flex items-start gap-3 rounded-md border px-3 py-2 ${focusId === unit.id ? "border-primary" : "border-border/60"} ${isVisible ? "" : "opacity-60"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								className: "mt-0.5",
								checked: isVisible,
								onCheckedChange: (value) => setVisible([unit.id], value === true),
								"aria-label": `Mostrar ${unit.name} en el mapa`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFocusId(unit.id),
								className: "min-w-0 flex-1 text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate font-semibold",
											children: unit.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `shrink-0 text-xs uppercase ${unit.online ? "text-primary" : "text-muted-foreground"}`,
											children: unit.online ? "En línea" : "Sin señal"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-1 block truncate text-xs text-muted-foreground",
										children: [unit.imei ? `IMEI ${unit.imei}` : `#${unit.id}`, unit.creatorName ? ` · ${unit.creatorName}` : ""]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-xs text-muted-foreground",
										children: [unit.speed != null ? `${Math.round(unit.speed)} km/h · ` : "", unit.lastMessage ? (/* @__PURE__ */ new Date(unit.lastMessage * 1e3)).toLocaleString("es-MX") : "sin mensajes"]
									})
								]
							})]
						}, unit.id);
					}), !query.isLoading && filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-muted-foreground",
						children: units.length === 0 ? "No hay unidades en esta cuenta." : "Ninguna unidad coincide con la búsqueda."
					}) : null]
				})
			]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapaView, { session }) });
//#endregion
export { SplitComponent as component };
