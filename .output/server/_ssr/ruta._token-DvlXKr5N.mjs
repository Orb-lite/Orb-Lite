import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { A as MapPin, C as Navigation, H as Flag, J as Download, P as LoaderCircle, it as Check } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Route } from "./ruta._token-D2xgqtiX.mjs";
import { a as markSharedStopVisited, i as getSharedRoute, n as finishSharedRoute, t as commentSharedStop } from "./route-share.functions-DexH2wwA.mjs";
import { t as downloadExcelWorkbook } from "./excel-export-lmFsj8Lg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ruta._token-DvlXKr5N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SharedRouteMap = import_react.lazy(() => import("./SharedRouteMap-CCP85KTN.mjs"));
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-6 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs font-bold uppercase tracking-[0.3em] text-primary",
						children: "ORB-LITE · Ruta asignada"
					}), query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Cargando ruta…"]
					}) : query.isError || !route ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-destructive",
						children: "Este enlace de ruta no existe o fue eliminado."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-2xl font-bold",
							children: route.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								doneCount,
								" de ",
								stops.length,
								" paradas visitadas"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-primary transition-all",
								style: { width: `${stops.length ? doneCount / stops.length * 100 : 0}%` }
							})
						})
					] })]
				}),
				route && nextIndex >= 0 && stops[nextIndex] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: wazeUrl(stops[nextIndex].lat, stops[nextIndex].lon),
					target: "_blank",
					rel: "noreferrer",
					className: "mb-6 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 font-display text-base font-bold uppercase tracking-widest text-primary-foreground shadow-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "size-5" }),
						"Siguiente parada en Waze: ",
						stops[nextIndex].label
					]
				}) : null,
				route && mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 overflow-hidden rounded-xl border border-border/70",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 bg-card" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SharedRouteMap, {
							path: route.path,
							stops: stops.map((s) => ({
								...s,
								visited: Boolean(s.visitedAt)
							})),
							nextIndex,
							me
						})
					})
				}) : null,
				error && checking === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-center text-sm text-destructive",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-3",
					children: stops.map((stop, index) => {
						const visited = Boolean(stop.visitedAt);
						const isNext = index === nextIndex;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: `flex items-start gap-3 rounded-xl border p-4 transition-colors ${visited ? "border-primary/30 bg-primary/5" : isNext ? "border-primary bg-card shadow-sm" : "border-border/70 bg-card/60"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => toggleStop(index, !visited),
									disabled: busyIndex === index,
									"aria-label": visited ? `Quitar check de ${stop.label}` : `Marcar visita en ${stop.label}`,
									className: `flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${visited ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40 text-transparent hover:border-primary"}`,
									children: busyIndex === index ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: `truncate text-sm font-semibold ${visited ? "text-muted-foreground line-through" : ""}`,
											children: [index === 0 ? "Salida: " : `Parada ${index}: `, stop.label]
										}),
										visited && stop.visitedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
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
										}) : isNext ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-primary",
											children: "Siguiente parada"
										}) : null,
										visited && stop.contact != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-primary",
											children: stop.contact ? "Con acercamiento" : "Sin acercamiento"
										}) : null,
										visited ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentBox, {
											token,
											index,
											initial: stop.comment ?? ""
										}) : null,
										checking === index ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckForm, {
											busy: busyIndex === index,
											error,
											onCancel: () => {
												setChecking(null);
												setError(null);
											},
											onConfirm: (check) => void toggleStop(index, true, check)
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: wazeUrl(stop.lat, stop.lon),
									target: "_blank",
									rel: "noreferrer",
									"aria-label": `Abrir ${stop.label} en Waze`,
									className: "flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" })
								})
							]
						}, index);
					})
				}),
				route && nextIndex === -1 && stops.length > 0 ? route.reportSent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-4 font-display text-sm font-bold uppercase tracking-widest text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "size-5" }), " Resumen enviado"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void sendSummary(),
					disabled: sending,
					className: "mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "size-5" }),
						" ",
						sending ? "Enviando…" : "Terminar y enviar resumen"
					]
				}) : null,
				route && doneCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 rounded-xl border border-border/70 bg-card/60 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-sm font-bold uppercase tracking-widest",
								children: "Reporte de visitas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => void exportVisitReport(route.name, stops),
								className: "inline-flex items-center gap-1.5 rounded-md border border-primary/50 px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Excel"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 divide-y divide-border/60 text-sm",
							children: stops.map((stop, index) => stop.visitedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate font-medium",
											children: stop.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "shrink-0 text-xs text-muted-foreground",
											children: new Date(stop.visitedAt).toLocaleTimeString("es-MX", {
												hour: "2-digit",
												minute: "2-digit"
											})
										})]
									}),
									stop.contact != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-xs text-primary",
										children: stop.contact ? "Con acercamiento" : "Sin acercamiento"
									}) : null,
									stop.comment ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: stop.comment
									}) : null
								]
							}, index) : null)
						}),
						route.reportSent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-primary",
							children: "Reporte enviado."
						}) : null
					]
				}) : null
			]
		})
	});
}
function CheckForm({ busy, error, onCancel, onConfirm }) {
	const [contact, setContact] = import_react.useState(null);
	const [note, setNote] = import_react.useState("");
	const ready = contact !== null && note.trim().length >= 3;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 space-y-2 rounded-lg border border-primary/40 bg-background/60 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold",
				children: "¿Tuviste acercamiento?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: [true, false].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setContact(v),
					className: `flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold ${contact === v ? "border-primary bg-primary text-primary-foreground" : "border-border"}`,
					children: v ? "Sí" : "No"
				}, String(v)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: note,
				onChange: (e) => setNote(e.target.value),
				rows: 2,
				maxLength: 1e3,
				placeholder: "Nota de la visita",
				className: "w-full resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-destructive",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onCancel,
					className: "flex-1 rounded-md border border-border px-2 py-1.5 text-xs",
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !ready || busy,
					onClick: () => contact !== null && onConfirm({
						contact,
						note: note.trim()
					}),
					className: "flex-1 rounded-md bg-primary px-2 py-1.5 text-xs font-bold text-primary-foreground disabled:opacity-50",
					children: busy ? "Verificando…" : "Confirmar visita"
				})]
			})
		]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value,
			onChange: (e) => setValue(e.target.value),
			onBlur: commit,
			rows: 1,
			maxLength: 1e3,
			placeholder: "Comentario",
			className: "w-full resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
		}), state !== "idle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] text-muted-foreground",
			children: state === "saving" ? "Guardando…" : "Guardado"
		}) : null]
	});
}
//#endregion
export { SharedRoutePage as component };
