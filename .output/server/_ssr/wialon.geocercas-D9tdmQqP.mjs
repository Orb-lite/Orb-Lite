import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { b as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { G as Eye, Q as Circle, S as Pentagon, ct as Building2, g as RefreshCw, h as RotateCcw, it as Check, s as Trash2 } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as wialonCreateGeofence, l as wialonGeofences, o as wialonDeleteGeofence } from "./wialon.functions-DfBM1Ing.mjs";
import { t as WialonGuard } from "./wialon-guard-JCWFzsMD.mjs";
import { t as PlatformHeader } from "./PlatformHeader-CBUvky1i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.geocercas-D9tdmQqP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inputClass = "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary text-sm";
function colorToNumber(value) {
	return Number.parseInt(value.replace("#", ""), 16);
}
function GeocercasView({ session }) {
	const fetchGeofences = useServerFn(wialonGeofences);
	const createGeofence = useServerFn(wialonCreateGeofence);
	const deleteGeofence = useServerFn(wialonDeleteGeofence);
	const queryClient = useQueryClient();
	const [name, setName] = import_react.useState("");
	const [type, setType] = import_react.useState("circle");
	const GEOFENCE_COLOR = "#92d700";
	const [filterResourceId, setFilterResourceId] = import_react.useState("all");
	const [createResourceId, setCreateResourceId] = import_react.useState(null);
	const [focusedGeofenceId, setFocusedGeofenceId] = import_react.useState(null);
	const [drawMode, setDrawMode] = import_react.useState(null);
	const [, setDrawingResetKey] = import_react.useState(0);
	const [draft, setDraft] = import_react.useState(null);
	const [busy, setBusy] = import_react.useState(false);
	const [deletingId, setDeletingId] = import_react.useState(null);
	const [confirmDeleteId, setConfirmDeleteId] = import_react.useState(null);
	const [message, setMessage] = import_react.useState(null);
	const [error, setError] = import_react.useState(null);
	const query = useQuery({
		queryKey: ["wialon-geofences", session.sid],
		queryFn: () => fetchGeofences({ data: {
			host: session.host,
			sid: session.sid
		} }),
		refetchInterval: 6e4
	});
	const allZones = query.data?.zones ?? [];
	const resources = query.data?.resources ?? [];
	const polygonOrCircleZones = allZones.filter((z) => z.type === 2 || z.type === 3);
	const visibleZones = filterResourceId === "all" ? polygonOrCircleZones : polygonOrCircleZones.filter((z) => z.resourceId === filterResourceId);
	const targetResourceId = createResourceId ?? (filterResourceId !== "all" ? filterResourceId : resources[0]?.id ?? null);
	const mapGeofences = visibleZones.map((zone) => ({
		id: zone.id,
		name: zone.name,
		resource: zone.resource,
		type: zone.type,
		color: GEOFENCE_COLOR,
		points: zone.points
	}));
	function chooseType(nextType) {
		setType(nextType);
		setDrawMode(null);
		setDraft(null);
		setDrawingResetKey((value) => value + 1);
	}
	function startDrawing() {
		setError(null);
		setMessage(null);
		setDraft({
			type,
			points: []
		});
		setDrawMode(type);
		setDrawingResetKey((value) => value + 1);
	}
	function resetDrawing() {
		setDraft(null);
		setDrawMode(null);
		setDrawingResetKey((value) => value + 1);
	}
	async function handleRefresh() {
		setError(null);
		setMessage(null);
		await query.refetch();
		setMessage("Geocercas sincronizadas con Wialon.");
		setTimeout(() => setMessage(null), 3e3);
	}
	async function handleDelete(zone) {
		if (confirmDeleteId !== zone.id) {
			setConfirmDeleteId(zone.id);
			return;
		}
		setDeletingId(zone.id);
		setConfirmDeleteId(null);
		setError(null);
		setMessage(null);
		try {
			await deleteGeofence({ data: {
				host: session.host,
				sid: session.sid,
				resourceId: zone.resourceId,
				zoneId: zone.id
			} });
			setMessage(`Geocerca "${zone.name}" eliminada de Wialon.`);
			if (focusedGeofenceId === zone.id) setFocusedGeofenceId(null);
			await queryClient.invalidateQueries({ queryKey: ["wialon-geofences", session.sid] });
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "No se pudo eliminar la geocerca de Wialon.");
		} finally {
			setDeletingId(null);
		}
	}
	async function saveGeofence(event) {
		event.preventDefault();
		if (!targetResourceId) {
			setError("Selecciona el cliente / recurso de Wialon donde guardar la geocerca.");
			return;
		}
		if (!draft || draft.points.length === 0) {
			setError("Dibuja la geocerca en el mapa antes de guardarla.");
			return;
		}
		if (draft.type === "polygon" && draft.points.length < 3) {
			setError("El polígono necesita al menos tres puntos.");
			return;
		}
		if (draft.type === "circle" && draft.points[0].radius < 10) {
			setError("El círculo debe medir al menos 10 metros.");
			return;
		}
		setBusy(true);
		setError(null);
		setMessage(null);
		try {
			const created = await createGeofence({ data: {
				host: session.host,
				sid: session.sid,
				resourceId: targetResourceId,
				name,
				type: draft.type,
				color: colorToNumber(GEOFENCE_COLOR),
				points: draft.points
			} });
			setMessage(`Geocerca "${created.name}" guardada exitosamente en Wialon.`);
			setName("");
			resetDrawing();
			await queryClient.invalidateQueries({ queryKey: ["wialon-geofences", session.sid] });
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "No se pudo crear la geocerca en Wialon.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformHeader, { session }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 rounded-xl border border-border/70 bg-card/60 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-sm font-bold uppercase tracking-wider text-foreground",
						children: "Geocercas por Cliente / Recurso"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							resources.length,
							" recurso",
							resources.length !== 1 ? "s" : "",
							" disponible",
							resources.length !== 1 ? "s" : "",
							" en Wialon"
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "client-filter-select",
							className: "sr-only",
							children: "Filtrar por cliente o recurso"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "client-filter-select",
							className: "rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary sm:text-sm",
							value: filterResourceId,
							onChange: (e) => {
								const val = e.target.value;
								setFilterResourceId(val === "all" ? "all" : Number(val));
								setFocusedGeofenceId(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: "all",
								children: [
									"🌐 Todos los clientes (",
									polygonOrCircleZones.length,
									" geocercas)"
								]
							}), resources.map((res) => {
								const count = polygonOrCircleZones.filter((z) => z.resourceId === res.id).length;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: res.id,
									children: [
										"👤 ",
										res.name,
										" (",
										count,
										" geocerca",
										count !== 1 ? "s" : "",
										")"
									]
								}, res.id);
							})]
						}),
						query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: query.error?.message ?? "No se pudieron cargar las geocercas."
						}) : query.isFetching && allZones.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Cargando…"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleRefresh,
							disabled: query.isFetching,
							className: "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50",
							title: "Sincronizar y recargar geocercas desde Wialon",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-3.5 ${query.isFetching ? "animate-spin text-primary" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: query.isFetching ? "Cargando…" : "Sincronizar" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-xl border border-border/60 bg-card/40 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border/50 bg-background/50 px-4 py-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Mostrando ",
							mapGeofences.length,
							" geocerca",
							mapGeofences.length !== 1 ? "s" : "",
							" en el mapa"
						] }), focusedGeofenceId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFocusedGeofenceId(null),
							className: "text-primary hover:underline",
							children: "Restablecer vista general"
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[580px] bg-muted/20" }) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: saveGeofence,
					className: "flex flex-col rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-sm font-bold uppercase tracking-widest text-foreground",
								children: "Nueva Geocerca"
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: resetDrawing,
								className: "rounded-md border border-border p-2 text-muted-foreground hover:border-primary hover:text-primary",
								"aria-label": "Borrar dibujo actual",
								title: "Borrar dibujo actual",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: ["Nombre de la geocerca", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (event) => setName(event.target.value),
								className: inputClass,
								placeholder: "Ej. Bodega Guadalajara / Cliente Norte",
								required: true,
								minLength: 2,
								maxLength: 100
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: ["Guardar en Cliente / Recurso de Wialon", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: inputClass,
								value: targetResourceId ?? "",
								onChange: (event) => setCreateResourceId(Number(event.target.value)),
								required: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									disabled: true,
									children: "Selecciona un cliente / recurso"
								}), resources.map((resource) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: resource.id,
									children: resource.name
								}, resource.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Forma de geocerca"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 grid grid-cols-2 gap-2",
								children: [{
									value: "circle",
									label: "Círculo",
									icon: Circle
								}, {
									value: "polygon",
									label: "Polígono",
									icon: Pentagon
								}].map((option) => {
									const Icon = option.icon;
									const selected = type === option.value;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => chooseType(option.value),
										className: `flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${selected ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary"}`,
										"aria-pressed": selected,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), option.label]
									}, option.value);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: startDrawing,
							className: `mt-4 w-full rounded-md border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${drawMode ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-primary bg-primary/5 text-primary hover:bg-primary/15"}`,
							children: drawMode ? "✏️ Dibujando en el mapa…" : "1. Trazar en el mapa"
						}),
						drawMode === "polygon" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-amber-400/90",
							children: "Haz clic en el mapa para marcar cada vértice del polígono (mínimo 3)."
						}) : null,
						drawMode === "circle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-amber-400/90",
							children: "Haz clic en el centro y arrastra o haz clic en el borde para el radio."
						}) : null,
						draft?.points.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-lg border border-primary/30 bg-primary/5 p-2.5 text-xs text-primary",
							children: [
								"✓ ",
								draft.points.length,
								" punto",
								draft.points.length !== 1 ? "s" : "",
								" trazado",
								draft.points.length !== 1 ? "s" : "",
								draft.type === "circle" && draft.points[0]?.radius ? ` · Radio: ${Math.round(draft.points[0].radius)} metros` : ""
							]
						}) : null,
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-destructive",
							children: error
						}) : null,
						message ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 flex items-center gap-1.5 text-xs text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: message })]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy || !name.trim() || !targetResourceId || !draft?.points.length,
							className: "mt-4 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
							children: busy ? "Guardando en Wialon…" : "2. Guardar en Wialon"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border/60 bg-card/50 p-5 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-base font-bold uppercase tracking-wide text-foreground",
						children: "Geocercas guardadas en Wialon"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: filterResourceId === "all" ? `Mostrando todas las geocercas (${visibleZones.length})` : `Geocercas de ${resources.find((r) => r.id === filterResourceId)?.name ?? "cliente"} (${visibleZones.length})`
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary",
						children: [visibleZones.length, " activas"]
					})]
				}), visibleZones.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-12 text-center text-sm text-muted-foreground",
					children: query.isLoading ? "Cargando geocercas de Wialon…" : filterResourceId === "all" ? "No se encontraron geocercas en los recursos de Wialon." : "Este cliente no tiene geocercas guardadas en Wialon aún. Puedes crear una arriba."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: visibleZones.map((zone) => {
						const isCircle = zone.type === 3;
						const radius = isCircle && zone.points[0]?.radius ? Math.round(zone.points[0].radius) : null;
						const isDeleting = deletingId === zone.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col justify-between rounded-lg border border-border/70 bg-background/60 p-3.5 transition-colors hover:border-primary/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-3.5 shrink-0 rounded-full border border-white/40 shadow-sm",
										style: { backgroundColor: GEOFENCE_COLOR }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "truncate font-semibold text-sm text-foreground",
											title: zone.name,
											children: zone.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-xs text-muted-foreground",
											title: zone.resource,
											children: ["👤 ", zone.resource]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: isCircle ? "Círculo" : "Polígono"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between border-t border-border/40 pt-2.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isCircle ? radius ? `${radius} m` : "Circular" : `${zone.points.length} vértices` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setFocusedGeofenceId(zone.id),
										className: "inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-primary hover:bg-primary/10 transition-colors",
										title: "Ver en el mapa",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ver" })]
									}), confirmDeleteId === zone.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleDelete(zone),
											disabled: isDeleting,
											className: "inline-flex items-center gap-1 rounded bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50",
											title: "Confirmar eliminación",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isDeleting ? "…" : "¿Confirmar?" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setConfirmDeleteId(null),
											className: "rounded px-1.5 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors",
											title: "Cancelar",
											children: "✕"
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => handleDelete(zone),
										disabled: isDeleting,
										className: "inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50",
										title: "Eliminar de Wialon",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Borrar" })]
									})]
								})]
							})]
						}, `${zone.resourceId}-${zone.id}`);
					})
				})]
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeocercasView, { session }) });
//#endregion
export { SplitComponent as component };
