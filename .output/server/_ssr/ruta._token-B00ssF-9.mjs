import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { A as MapPin, C as Navigation, H as Flag, J as Download, P as LoaderCircle, it as Check } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Route } from "./ruta._token-1LytiUWQ.mjs";
import { a as markSharedStopVisited, i as getSharedRoute, n as finishSharedRoute, t as commentSharedStop } from "./route-share.functions-DwDs4Sjb.mjs";
import { t as downloadExcelWorkbook } from "./excel-export-lmFsj8Lg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ruta._token-B00ssF-9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/ruta.$token.tsx?tsr-split=component";
var SharedRouteMap = import_react.lazy(() => import("./SharedRouteMap-C8E_NtwG.mjs"));
function getPosition() {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) return reject(/* @__PURE__ */ new Error("Tu teléfono no permite ubicación."));
		navigator.geolocation.getCurrentPosition((p) => resolve({
			lat: p.coords.latitude,
			lon: p.coords.longitude
		}), () => reject(/* @__PURE__ */ new Error("Activa tu ubicación para marcar la visita.")), {
			enableHighAccuracy: true,
			timeout: 15e3,
			maximumAge: 1e4
		});
	});
}
function wazeUrl(lat, lon) {
	return `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;
}
async function exportVisitReport(routeName, stops) {
	const rows = [[
		"Parada",
		"Ubicación",
		"Latitud",
		"Longitud",
		"Hora de visita",
		"Acercamiento",
		"Nota"
	], ...stops.map((stop, index) => [
		index === 0 ? "Salida" : `Parada ${index}`,
		stop.label,
		stop.lat,
		stop.lon,
		stop.visitedAt ? new Date(stop.visitedAt).toLocaleString("es-MX", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		}) : "Sin visitar",
		stop.contact == null ? "" : stop.contact ? "Sí" : "No",
		stop.comment ?? ""
	])];
	const stamp = (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace(/[:T]/g, "-");
	await downloadExcelWorkbook({
		filename: `reporte-visitas-${routeName.replace(/\s+/g, "-")}-${stamp}.xlsx`,
		sheets: [{
			name: "Reporte de visitas",
			rows
		}]
	});
}
function SharedRoutePage() {
	const { token } = Route.useParams();
	const queryClient = useQueryClient();
	const markVisited = useServerFn(markSharedStopVisited);
	const finishRoute = useServerFn(finishSharedRoute);
	const [busyIndex, setBusyIndex] = import_react.useState(null);
	const [sending, setSending] = import_react.useState(false);
	const [error, setError] = import_react.useState(null);
	const [checking, setChecking] = import_react.useState(null);
	const [me, setMe] = import_react.useState(null);
	const [mounted, setMounted] = import_react.useState(false);
	import_react.useEffect(() => {
		setMounted(true);
		if (!navigator.geolocation) return;
		const id = navigator.geolocation.watchPosition((p) => setMe({
			lat: p.coords.latitude,
			lon: p.coords.longitude
		}), () => void 0, {
			enableHighAccuracy: true,
			maximumAge: 15e3
		});
		return () => navigator.geolocation.clearWatch(id);
	}, []);
	const query = useQuery({
		queryKey: ["shared-route", token],
		queryFn: () => getSharedRoute({ data: { token } }),
		retry: false,
		refetchInterval: 3e4
	});
	const route = query.data;
	const stops = route?.stops ?? [];
	const nextIndex = stops.findIndex((stop) => !stop.visitedAt);
	const doneCount = stops.filter((stop) => stop.visitedAt).length;
	async function toggleStop(index, visited, check) {
		if (visited && !check) {
			setChecking(index);
			return;
		}
		setBusyIndex(index);
		setError(null);
		try {
			const pos = visited ? await getPosition() : void 0;
			await markVisited({ data: {
				token,
				stopIndex: index,
				visited,
				...pos,
				...check
			} });
			setChecking(null);
			await queryClient.invalidateQueries({ queryKey: ["shared-route", token] });
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "No se pudo actualizar la parada.");
		} finally {
			setBusyIndex(null);
		}
	}
	async function sendSummary() {
		setSending(true);
		setError(null);
		try {
			await finishRoute({ data: { token } });
			await queryClient.invalidateQueries({ queryKey: ["shared-route", token] });
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "No se pudo enviar el resumen.");
		} finally {
			setSending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto w-full max-w-xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
					className: "mb-6 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "font-display text-xs font-bold uppercase tracking-[0.3em] text-primary",
						children: "ORB-LITE · Ruta asignada"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 147,
						columnNumber: 11
					}, this), query.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "size-4 animate-spin" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 151,
							columnNumber: 15
						}, this), " Cargando ruta…"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 150,
						columnNumber: 30
					}, this) : query.isError || !route ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-4 text-sm text-destructive",
						children: "Este enlace de ruta no existe o fue eliminado."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 152,
						columnNumber: 46
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "mt-2 font-display text-2xl font-bold",
							children: route.name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 155,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								doneCount,
								" de ",
								stops.length,
								" paradas visitadas"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 156,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mx-auto mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "h-full rounded-full bg-primary transition-all",
								style: { width: `${stops.length ? doneCount / stops.length * 100 : 0}%` }
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 160,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 159,
							columnNumber: 15
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 154,
						columnNumber: 20
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 146,
					columnNumber: 9
				}, this),
				route && nextIndex >= 0 && stops[nextIndex] ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
					href: wazeUrl(stops[nextIndex].lat, stops[nextIndex].lon),
					target: "_blank",
					rel: "noreferrer",
					className: "mb-6 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 font-display text-base font-bold uppercase tracking-widest text-primary-foreground shadow-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Navigation, { className: "size-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 168,
							columnNumber: 13
						}, this),
						"Siguiente parada en Waze: ",
						stops[nextIndex].label
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 167,
					columnNumber: 56
				}, this) : null,
				route && mounted ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mb-6 overflow-hidden rounded-xl border border-border/70",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.Suspense, {
						fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-64 bg-card" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 173,
							columnNumber: 39
						}, this),
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SharedRouteMap, {
							path: route.path,
							stops: stops.map((s) => ({
								...s,
								visited: Boolean(s.visitedAt)
							})),
							nextIndex,
							me
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 174,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 173,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 172,
					columnNumber: 29
				}, this) : null,
				error && checking === null ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mb-4 text-center text-sm text-destructive",
					children: error
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 181,
					columnNumber: 39
				}, this) : null,
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", {
					className: "space-y-3",
					children: stops.map((stop, index) => {
						const visited = Boolean(stop.visitedAt);
						const isNext = index === nextIndex;
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
							className: `flex items-start gap-3 rounded-xl border p-4 transition-colors ${visited ? "border-primary/30 bg-primary/5" : isNext ? "border-primary bg-card shadow-sm" : "border-border/70 bg-card/60"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => toggleStop(index, !visited),
									disabled: busyIndex === index,
									"aria-label": visited ? `Quitar check de ${stop.label}` : `Marcar visita en ${stop.label}`,
									className: `flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${visited ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40 text-transparent hover:border-primary"}`,
									children: busyIndex === index ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "size-4 animate-spin text-muted-foreground" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 189,
										columnNumber: 42
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "size-5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 189,
										columnNumber: 110
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 188,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: `truncate text-sm font-semibold ${visited ? "text-muted-foreground line-through" : ""}`,
											children: [index === 0 ? "Salida: " : `Parada ${index}: `, stop.label]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 193,
											columnNumber: 19
										}, this),
										visited && stop.visitedAt ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												"Visitada",
												" ",
												new Date(stop.visitedAt).toLocaleString("es-MX", {
													day: "2-digit",
													month: "short",
													hour: "2-digit",
													minute: "2-digit"
												})
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 197,
											columnNumber: 48
										}, this) : isNext ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs font-semibold text-primary",
											children: "Siguiente parada"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 205,
											columnNumber: 37
										}, this) : null,
										visited && stop.contact != null ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs text-primary",
											children: stop.contact ? "Con acercamiento" : "Sin acercamiento"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 206,
											columnNumber: 54
										}, this) : null,
										visited ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CommentBox, {
											token,
											index,
											initial: stop.comment ?? ""
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 209,
											columnNumber: 30
										}, this) : null,
										checking === index ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CheckForm, {
											busy: busyIndex === index,
											error,
											onCancel: () => {
												setChecking(null);
												setError(null);
											},
											onConfirm: (check) => void toggleStop(index, true, check)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 210,
											columnNumber: 41
										}, this) : null
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 192,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: wazeUrl(stop.lat, stop.lon),
									target: "_blank",
									rel: "noreferrer",
									"aria-label": `Abrir ${stop.label} en Waze`,
									className: "flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { className: "size-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 217,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 216,
									columnNumber: 17
								}, this)
							]
						}, index, true, {
							fileName: _jsxFileName,
							lineNumber: 187,
							columnNumber: 18
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 183,
					columnNumber: 9
				}, this),
				route && nextIndex === -1 && stops.length > 0 ? route.reportSent ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-4 font-display text-sm font-bold uppercase tracking-widest text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Flag, { className: "size-5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 224,
						columnNumber: 15
					}, this), " Resumen enviado"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 223,
					columnNumber: 77
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => void sendSummary(),
					disabled: sending,
					className: "mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Flag, { className: "size-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 226,
							columnNumber: 15
						}, this),
						" ",
						sending ? "Enviando…" : "Terminar y enviar resumen"
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 225,
					columnNumber: 22
				}, this) : null,
				route && doneCount > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-8 rounded-xl border border-border/70 bg-card/60 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "font-display text-sm font-bold uppercase tracking-widest",
								children: "Reporte de visitas"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 231,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => void exportVisitReport(route.name, stops),
								className: "inline-flex items-center gap-1.5 rounded-md border border-primary/50 px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "size-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 235,
									columnNumber: 17
								}, this), " Excel"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 234,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 230,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
							className: "mt-3 divide-y divide-border/60 text-sm",
							children: stops.map((stop, index) => stop.visitedAt ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
								className: "py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "truncate font-medium",
											children: stop.label
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 241,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "shrink-0 text-xs text-muted-foreground",
											children: new Date(stop.visitedAt).toLocaleTimeString("es-MX", {
												hour: "2-digit",
												minute: "2-digit"
											})
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 242,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 240,
										columnNumber: 21
									}, this),
									stop.contact != null ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-0.5 text-xs text-primary",
										children: stop.contact ? "Con acercamiento" : "Sin acercamiento"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 249,
										columnNumber: 45
									}, this) : null,
									stop.comment ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: stop.comment
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 252,
										columnNumber: 37
									}, this) : null
								]
							}, index, true, {
								fileName: _jsxFileName,
								lineNumber: 239,
								columnNumber: 60
							}, this) : null)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 238,
							columnNumber: 13
						}, this),
						route.reportSent ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-3 text-xs text-primary",
							children: "Reporte enviado."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 255,
							columnNumber: 33
						}, this) : null
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 229,
					columnNumber: 35
				}, this) : null
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 145,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 144,
		columnNumber: 10
	}, this);
}
function CheckForm({ busy, error, onCancel, onConfirm }) {
	const [contact, setContact] = import_react.useState(null);
	const [note, setNote] = import_react.useState("");
	const ready = contact !== null && note.trim().length >= 3;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mt-3 space-y-2 rounded-lg border border-primary/40 bg-background/60 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-xs font-semibold",
				children: "¿Tuviste acercamiento?"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 278,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex gap-2",
				children: [true, false].map((v) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => setContact(v),
					className: `flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold ${contact === v ? "border-primary bg-primary text-primary-foreground" : "border-border"}`,
					children: v ? "Sí" : "No"
				}, String(v), false, {
					fileName: _jsxFileName,
					lineNumber: 280,
					columnNumber: 33
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 279,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
				value: note,
				onChange: (e) => setNote(e.target.value),
				rows: 2,
				maxLength: 1e3,
				placeholder: "Nota de la visita",
				className: "w-full resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 284,
				columnNumber: 7
			}, this),
			error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-xs text-destructive",
				children: error
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 285,
				columnNumber: 16
			}, this) : null,
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: onCancel,
					className: "flex-1 rounded-md border border-border px-2 py-1.5 text-xs",
					children: "Cancelar"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 287,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					disabled: !ready || busy,
					onClick: () => contact !== null && onConfirm({
						contact,
						note: note.trim()
					}),
					className: "flex-1 rounded-md bg-primary px-2 py-1.5 text-xs font-bold text-primary-foreground disabled:opacity-50",
					children: busy ? "Verificando…" : "Confirmar visita"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 290,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 286,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 277,
		columnNumber: 10
	}, this);
}
function CommentBox({ token, index, initial }) {
	const save = useServerFn(commentSharedStop);
	const queryClient = useQueryClient();
	const [value, setValue] = import_react.useState(initial);
	const [state, setState] = import_react.useState("idle");
	import_react.useEffect(() => setValue(initial), [initial]);
	async function commit() {
		if (value.trim() === initial.trim()) return;
		setState("saving");
		try {
			await save({ data: {
				token,
				stopIndex: index,
				comment: value
			} });
			await queryClient.invalidateQueries({ queryKey: ["shared-route", token] });
			setState("saved");
			window.setTimeout(() => setState("idle"), 1500);
		} catch {
			setState("idle");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mt-2",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
			value,
			onChange: (e) => setValue(e.target.value),
			onBlur: commit,
			rows: 1,
			maxLength: 1e3,
			placeholder: "Comentario",
			className: "w-full resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 334,
			columnNumber: 7
		}, this), state !== "idle" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-[10px] text-muted-foreground",
			children: state === "saving" ? "Guardando…" : "Guardado"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 335,
			columnNumber: 27
		}, this) : null]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 333,
		columnNumber: 10
	}, this);
}
//#endregion
export { SharedRoutePage as component };
