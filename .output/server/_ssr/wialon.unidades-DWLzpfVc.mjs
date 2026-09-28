import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { f as Search, g as RefreshCw, n as X } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { b as wialonUnits, v as wialonSendCommand, y as wialonUnitDetail } from "./wialon.functions-CrsvbLcr.mjs";
import { t as WialonGuard } from "./wialon-guard-JCWFzsMD.mjs";
import { i as useHiddenUnits, n as matchesUnitSearch, r as selectAllState, t as Checkbox } from "./wialon-visibility-CGREBqIB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.unidades-DWLzpfVc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-background/80 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-2xl rounded-lg border border-border/60 bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-bold uppercase tracking-wide",
						children: data?.unit.name ?? "Detalle de unidad"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onClose,
						className: "inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), " Cerrar"]
					})]
				}),
				detail.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "Cargando…"
				}) : null,
				detail.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-destructive",
					children: detail.error instanceof Error ? detail.error.message : "Error al consultar la unidad."
				}) : null,
				data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-6 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "IMEI / ID único",
									value: data.uniqueId ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Teléfono",
									value: data.phone ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Estado",
									value: data.unit.online ? "En línea" : "Sin señal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Última señal",
									value: data.unit.lastMessage ? (/* @__PURE__ */ new Date(data.unit.lastMessage * 1e3)).toLocaleString("es-MX") : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Coordenadas",
									value: data.unit.lat != null && data.unit.lon != null ? `${data.unit.lat.toFixed(5)}, ${data.unit.lon.toFixed(5)}` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Velocidad",
									value: data.unit.speed != null ? `${Math.round(data.unit.speed)} km/h` : "—"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
							children: [
								"Sensores (",
								data.sensors.length,
								")"
							]
						}), data.sensors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-muted-foreground",
							children: "Esta unidad no tiene sensores configurados."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1",
							children: data.sensors.map((sensor, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between gap-3 border-b border-border/40 py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sensor.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold",
									children: [
										sensor.value,
										" ",
										sensor.metrics
									]
								})]
							}, `${sensor.id}-${index}`))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
								children: [
									"Comandos (",
									data.commands.length,
									")"
								]
							}),
							data.commands.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-muted-foreground",
								children: "No hay comandos configurados para esta unidad."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: data.commands.map((command, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: busy === command.name,
									onClick: () => void runCommand(command.name, command.link),
									className: "rounded-md border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary disabled:opacity-60",
									children: busy === command.name ? "Enviando…" : command.name
								}, `${command.id}-${index}`))
							}),
							feedback ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-primary",
								children: feedback
							}) : null
						] }),
						data.params.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
							children: "Último mensaje"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 grid gap-1 sm:grid-cols-2",
							children: data.params.map((param, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-foreground",
										children: [param.key, ":"]
									}),
									" ",
									param.value
								]
							}, `${param.key}-${index}`))
						})] }) : null
					]
				}) : null
			]
		})
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs uppercase tracking-widest text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 font-semibold",
		children: value
	})] });
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					units.length,
					" unidades · ",
					online,
					" en línea · ",
					shown,
					" visibles en el mapa"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-wrap items-center justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Buscar unidad, IMEI o usuario…",
						"aria-label": "Buscar unidades",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void query.refetch(),
					className: "inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-4 ${query.isFetching ? "animate-spin" : ""}` }), " Actualizar"]
				})]
			})]
		}),
		query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-destructive",
			children: query.error instanceof Error ? query.error.message : "Error al consultar la plataforma."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 overflow-x-auto rounded-lg border border-border/60",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[820px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-card/60 text-left text-xs uppercase tracking-widest text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "w-10 px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: allState,
								disabled: filteredIds.length === 0,
								onCheckedChange: () => setVisible(filteredIds, allState !== true),
								"aria-label": "Mostrar u ocultar todas las unidades"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Unidad"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "IMEI"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Usuario"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Estado"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Velocidad"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Última señal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right",
							children: "Detalle"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((unit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: !hidden.has(unit.id),
								onCheckedChange: (value) => setVisible([unit.id], value === true),
								"aria-label": `Mostrar ${unit.name} en el mapa`
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-semibold",
							children: unit.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-mono text-xs text-muted-foreground",
							children: unit.imei ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: unit.creatorName ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: unit.online ? "text-primary" : "text-muted-foreground",
								children: unit.online ? "En línea" : "Sin señal"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: unit.speed != null ? `${Math.round(unit.speed)} km/h` : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: unit.lastMessage ? (/* @__PURE__ */ new Date(unit.lastMessage * 1e3)).toLocaleString("es-MX") : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDetailId(unit.id),
								className: "rounded-md border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-primary hover:text-primary",
								children: "Ver detalle"
							})
						})
					]
				}, unit.id)), !query.isLoading && filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-4 py-6 text-muted-foreground",
					colSpan: 8,
					children: units.length === 0 ? "No hay unidades en esta cuenta." : "Ninguna unidad coincide con la búsqueda."
				}) }) : null] })]
			})
		}),
		detailId != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WialonUnitDetail, {
			session,
			unitId: detailId,
			onClose: () => setDetailId(null)
		}) : null
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnidadesView, { session }) });
//#endregion
export { SplitComponent as component };
