import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { b as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { G as Eye, Q as Circle, S as Pentagon, ct as Building2, g as RefreshCw, h as RotateCcw, it as Check, s as Trash2 } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as wialonCreateGeofence, l as wialonGeofences, o as wialonDeleteGeofence } from "./wialon.functions-B5LcdM8M.mjs";
import { t as WialonGuard } from "./wialon-guard-BAmRBw40.mjs";
import { t as PlatformHeader } from "./PlatformHeader-B5tIht-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.geocercas-1RfUHCA4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/wialon.geocercas.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PlatformHeader, { session }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 176,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col gap-4 rounded-xl border border-border/70 bg-card/60 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Building2, { className: "size-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 182,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 181,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "font-display text-sm font-bold uppercase tracking-wider text-foreground",
						children: "Geocercas por Cliente / Recurso"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 185,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							resources.length,
							" recurso",
							resources.length !== 1 ? "s" : "",
							" disponible",
							resources.length !== 1 ? "s" : "",
							" en Wialon"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 188,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 184,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 180,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							htmlFor: "client-filter-select",
							className: "sr-only",
							children: "Filtrar por cliente o recurso"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 196,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
							id: "client-filter-select",
							className: "rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary sm:text-sm",
							value: filterResourceId,
							onChange: (e) => {
								const val = e.target.value;
								setFilterResourceId(val === "all" ? "all" : Number(val));
								setFocusedGeofenceId(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
								value: "all",
								children: [
									"🌐 Todos los clientes (",
									polygonOrCircleZones.length,
									" geocercas)"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 204,
								columnNumber: 13
							}, this), resources.map((res) => {
								const count = polygonOrCircleZones.filter((z) => z.resourceId === res.id).length;
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
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
								}, res.id, true, {
									fileName: _jsxFileName,
									lineNumber: 209,
									columnNumber: 20
								}, this);
							})]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 199,
							columnNumber: 11
						}, this),
						query.isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-destructive",
							children: query.error?.message ?? "No se pudieron cargar las geocercas."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 214,
							columnNumber: 28
						}, this) : query.isFetching && allZones.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "Cargando…"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 216,
							columnNumber: 64
						}, this) : null,
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: handleRefresh,
							disabled: query.isFetching,
							className: "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50",
							title: "Sincronizar y recargar geocercas desde Wialon",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: `size-3.5 ${query.isFetching ? "animate-spin text-primary" : ""}` }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 219,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: query.isFetching ? "Cargando…" : "Sincronizar" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 220,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 218,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 195,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 179,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "overflow-hidden rounded-xl border border-border/60 bg-card/40 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between border-b border-border/50 bg-background/50 px-4 py-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
							"Mostrando ",
							mapGeofences.length,
							" geocerca",
							mapGeofences.length !== 1 ? "s" : "",
							" en el mapa"
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 229,
							columnNumber: 13
						}, this), focusedGeofenceId ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => setFocusedGeofenceId(null),
							className: "text-primary hover:underline",
							children: "Restablecer vista general"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 233,
							columnNumber: 34
						}, this) : null]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 228,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-[580px] bg-muted/20" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 237,
						columnNumber: 33
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 237,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 227,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
					onSubmit: saveGeofence,
					className: "flex flex-col rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "font-display text-sm font-bold uppercase tracking-widest text-foreground",
								children: "Nueva Geocerca"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 244,
								columnNumber: 15
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 243,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: resetDrawing,
								className: "rounded-md border border-border p-2 text-muted-foreground hover:border-primary hover:text-primary",
								"aria-label": "Borrar dibujo actual",
								title: "Borrar dibujo actual",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RotateCcw, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 249,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 248,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 242,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: ["Nombre de la geocerca", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								value: name,
								onChange: (event) => setName(event.target.value),
								className: inputClass,
								placeholder: "Ej. Bodega Guadalajara / Cliente Norte",
								required: true,
								minLength: 2,
								maxLength: 100
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 255,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 253,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "mt-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: ["Guardar en Cliente / Recurso de Wialon", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								className: inputClass,
								value: targetResourceId ?? "",
								onChange: (event) => setCreateResourceId(Number(event.target.value)),
								required: true,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
									value: "",
									disabled: true,
									children: "Selecciona un cliente / recurso"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 261,
									columnNumber: 15
								}, this), resources.map((resource) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
									value: resource.id,
									children: resource.name
								}, resource.id, false, {
									fileName: _jsxFileName,
									lineNumber: 264,
									columnNumber: 42
								}, this))]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 260,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 258,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("fieldset", {
							className: "mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("legend", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Forma de geocerca"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 271,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
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
									return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => chooseType(option.value),
										className: `flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${selected ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary"}`,
										"aria-pressed": selected,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "size-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 287,
											columnNumber: 21
										}, this), option.label]
									}, option.value, true, {
										fileName: _jsxFileName,
										lineNumber: 286,
										columnNumber: 22
									}, this);
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 274,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 270,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: startDrawing,
							className: `mt-4 w-full rounded-md border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${drawMode ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-primary bg-primary/5 text-primary hover:bg-primary/15"}`,
							children: drawMode ? "✏️ Dibujando en el mapa…" : "1. Trazar en el mapa"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 294,
							columnNumber: 11
						}, this),
						drawMode === "polygon" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-2 text-xs text-amber-400/90",
							children: "Haz clic en el mapa para marcar cada vértice del polígono (mínimo 3)."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 298,
							columnNumber: 37
						}, this) : null,
						drawMode === "circle" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-2 text-xs text-amber-400/90",
							children: "Haz clic en el centro y arrastra o haz clic en el borde para el radio."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 301,
							columnNumber: 36
						}, this) : null,
						draft?.points.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
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
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 305,
							columnNumber: 35
						}, this) : null,
						error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-3 text-xs text-destructive",
							children: error
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 312,
							columnNumber: 20
						}, this) : null,
						message ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-3 flex items-center gap-1.5 text-xs text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "size-4 shrink-0" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 314,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: message }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 315,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 313,
							columnNumber: 22
						}, this) : null,
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "submit",
							disabled: busy || !name.trim() || !targetResourceId || !draft?.points.length,
							className: "mt-4 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
							children: busy ? "Guardando en Wialon…" : "2. Guardar en Wialon"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 318,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 241,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 225,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-xl border border-border/60 bg-card/50 p-5 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "font-display text-base font-bold uppercase tracking-wide text-foreground",
						children: "Geocercas guardadas en Wialon"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 328,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-muted-foreground",
						children: filterResourceId === "all" ? `Mostrando todas las geocercas (${visibleZones.length})` : `Geocercas de ${resources.find((r) => r.id === filterResourceId)?.name ?? "cliente"} (${visibleZones.length})`
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 331,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 327,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary",
						children: [visibleZones.length, " activas"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 335,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 326,
					columnNumber: 9
				}, this), visibleZones.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "py-12 text-center text-sm text-muted-foreground",
					children: query.isLoading ? "Cargando geocercas de Wialon…" : filterResourceId === "all" ? "No se encontraron geocercas en los recursos de Wialon." : "Este cliente no tiene geocercas guardadas en Wialon aún. Puedes crear una arriba."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 340,
					columnNumber: 38
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: visibleZones.map((zone) => {
						const isCircle = zone.type === 3;
						const radius = isCircle && zone.points[0]?.radius ? Math.round(zone.points[0].radius) : null;
						const isDeleting = deletingId === zone.id;
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col justify-between rounded-lg border border-border/70 bg-background/60 p-3.5 transition-colors hover:border-primary/50",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "size-3.5 shrink-0 rounded-full border border-white/40 shadow-sm",
										style: { backgroundColor: GEOFENCE_COLOR }
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 350,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
											className: "truncate font-semibold text-sm text-foreground",
											title: zone.name,
											children: zone.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 354,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "truncate text-xs text-muted-foreground",
											title: zone.resource,
											children: ["👤 ", zone.resource]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 357,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 353,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 349,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "shrink-0 rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: isCircle ? "Círculo" : "Polígono"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 363,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 348,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-3 flex items-center justify-between border-t border-border/40 pt-2.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: isCircle ? radius ? `${radius} m` : "Circular" : `${zone.points.length} vértices` }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 369,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => setFocusedGeofenceId(zone.id),
										className: "inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-primary hover:bg-primary/10 transition-colors",
										title: "Ver en el mapa",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "size-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 375,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Ver" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 376,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 374,
										columnNumber: 23
									}, this), confirmDeleteId === zone.id ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => handleDelete(zone),
											disabled: isDeleting,
											className: "inline-flex items-center gap-1 rounded bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50",
											title: "Confirmar eliminación",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: isDeleting ? "…" : "¿Confirmar?" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 381,
												columnNumber: 29
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 380,
											columnNumber: 27
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => setConfirmDeleteId(null),
											className: "rounded px-1.5 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors",
											title: "Cancelar",
											children: "✕"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 383,
											columnNumber: 27
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 379,
										columnNumber: 54
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => handleDelete(zone),
										disabled: isDeleting,
										className: "inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50",
										title: "Eliminar de Wialon",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "size-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 387,
											columnNumber: 27
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Borrar" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 388,
											columnNumber: 27
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 386,
										columnNumber: 34
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 373,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 368,
								columnNumber: 19
							}, this)]
						}, `${zone.resourceId}-${zone.id}`, true, {
							fileName: _jsxFileName,
							lineNumber: 347,
							columnNumber: 18
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 342,
					columnNumber: 20
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 325,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 175,
		columnNumber: 10
	}, this);
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GeocercasView, { session }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 398,
	columnNumber: 55
}, void 0) }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 398,
	columnNumber: 30
}, void 0);
//#endregion
export { SplitComponent as component };
