import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { $ as ExternalLink, B as Layers, D as Navigation, P as MapPin, U as Infinity$1, at as Clock, b as RefreshCw, h as Share2, ht as Car, it as Compass, m as ShieldAlert, p as ShieldCheck, q as Gauge } from "../_libs/lucide-react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as orb_lite_logo_default } from "./orb-lite-logo-CEgq-Hxq.mjs";
import { t as Route } from "./rastreo._token-D4s8hl6n.mjs";
import { i as getPublicUnitTracking } from "./unit-share.functions-DUfawtKU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rastreo._token-4qan52DS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SharedUnitLiveMap = import_react.lazy(() => import("./SharedUnitLiveMap-W1H3Ke7g.mjs"));
function formatRemainingTime(seconds) {
	if (seconds <= 0) return "00h 00m";
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor(seconds % 3600 / 60);
	const secs = seconds % 60;
	if (hours > 0) return `${hours}h ${minutes.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
	return `${minutes}m ${secs.toString().padStart(2, "0")}s`;
}
function PublicUnitTrackingPage() {
	const { token } = Route.useParams();
	const fetchTracking = useServerFn(getPublicUnitTracking);
	const [copied, setCopied] = import_react.useState(false);
	const [countdown, setCountdown] = import_react.useState(null);
	const [selectedUnitId, setSelectedUnitId] = import_react.useState(null);
	const query = useQuery({
		queryKey: ["public-unit-tracking", token],
		queryFn: () => fetchTracking({ data: { token } }),
		refetchInterval: 3e3,
		staleTime: 1500
	});
	const data = query.data;
	import_react.useEffect(() => {
		if (!data?.isUnlimited && data?.remainingSeconds !== void 0 && data.remainingSeconds > 0) setCountdown(data.remainingSeconds);
	}, [data?.remainingSeconds, data?.isUnlimited]);
	import_react.useEffect(() => {
		if (data?.isUnlimited || countdown === null || countdown <= 0) return;
		const interval = setInterval(() => {
			setCountdown((prev) => prev && prev > 0 ? prev - 1 : 0);
		}, 1e3);
		return () => clearInterval(interval);
	}, [countdown, data?.isUnlimited]);
	const unitList = data?.units && data.units.length > 0 ? data.units : [];
	const activeUnit = import_react.useMemo(() => {
		if (selectedUnitId && unitList.length > 0) {
			const found = unitList.find((u) => u.unitId === selectedUnitId);
			if (found) return found;
		}
		if (unitList.length > 0) return unitList[0];
		return {
			unitId: 1,
			unitName: data?.unitName || "Unidad",
			position: data?.position || {
				lat: 20.6736,
				lon: -103.344,
				speed: 0,
				course: 0,
				time: 0,
				address: "Coordenadas satelitales",
				isMoving: false
			},
			trail: data?.trail || []
		};
	}, [
		unitList,
		selectedUnitId,
		data
	]);
	const activePos = activeUnit.position;
	const lat = activePos.lat ?? 20.6736;
	const lon = activePos.lon ?? -103.344;
	const wazeUrl = `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;
	const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
	const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Sigue la ubicación en tiempo real de ${activeUnit.unitName}: ${typeof window !== "undefined" ? window.location.href : ""}`)}`;
	function handleCopy() {
		if (typeof window !== "undefined") {
			navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 3e3);
		}
	}
	if (query.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-slate-100",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm font-medium tracking-wide text-slate-400",
			children: "Cargando rastreo en tiempo real..."
		})]
	});
	if (query.isError || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex size-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-5 font-display text-2xl font-bold uppercase tracking-wider text-slate-100",
				children: "Enlace no disponible"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-md text-sm text-slate-400",
				children: query.error instanceof Error ? query.error.message : "Este enlace de rastreo no existe, fue cancelado o ha sido revocado por el administrador."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/",
				className: "mt-6 rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-200 transition-colors hover:bg-slate-700",
				children: "Volver a ORB-LITE"
			})
		]
	});
	const isExpired = !data.isUnlimited && (data.isExpired || countdown !== null && countdown <= 0);
	const isRevoked = data.isRevoked;
	if (isRevoked || isExpired) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex size-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-5 font-display text-2xl font-bold uppercase tracking-wider text-slate-100",
				children: isRevoked ? "Enlace Cancelado" : "Enlace Expirado"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-md text-sm text-slate-400",
				children: isRevoked ? "El acceso temporal a esta unidad fue revocado por el supervisor de la cuenta." : `El periodo de vigencia para el seguimiento de "${data.unitName}" ha concluido por políticas de seguridad.`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300 max-w-md text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-semibold text-slate-200",
						children: ["Unidad: ", data.unitName]
					}),
					data.clientName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-slate-400",
						children: ["Destinatario: ", data.clientName]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-slate-400",
						children: [
							"Venció el:",
							" ",
							new Date(data.expiresAt).toLocaleString("es-MX", {
								dateStyle: "medium",
								timeStyle: "short"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-xs text-slate-500",
				children: "Si requieres continuar el seguimiento, solicita un nuevo enlace a tu contacto de ORB-LITE."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-950 text-slate-100 flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-4 py-3 sm:px-6 sticky top-0 z-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: orb_lite_logo_default,
							alt: "ORB-LITE",
							className: "h-9 w-auto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-l border-slate-700 pl-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "relative flex h-2.5 w-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold uppercase tracking-wider text-emerald-400",
										children: "Rastreo en Vivo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline-block rounded bg-slate-800/90 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-700",
										children: data.lastPingAgoSeconds < 5 ? "Transmisión en directo" : `Último ping: hace ${data.lastPingAgoSeconds}s`
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-sm font-semibold tracking-tight text-slate-200 truncate max-w-[200px] sm:max-w-md",
								children: data.unitName
							})]
						})]
					}), data.isUnlimited ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3.5 py-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-semibold uppercase tracking-wider text-emerald-300/80",
								children: "Vigencia"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display text-xs font-bold text-emerald-300 flex items-center gap-1 justify-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Infinity$1, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sin límite de tiempo" })]
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4 text-cyan-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-semibold uppercase tracking-wider text-cyan-300/80",
								children: "Vigencia Restante"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs font-bold text-cyan-300",
								children: countdown !== null ? formatRemainingTime(countdown) : "--:--"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl w-full flex-1 p-4 sm:p-6 grid gap-6 lg:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4 backdrop-blur-sm min-h-[420px] lg:min-h-[580px]",
					children: [
						unitList.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3.5 text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Flota:" })]
							}), unitList.map((u) => {
								const isSelected = u.unitId === activeUnit.unitId;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSelectedUnitId(u.unitId),
									className: `flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${isSelected ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm" : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/60"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-1.5 rounded-full ${u.position.isMoving ? "bg-emerald-400 animate-pulse" : "bg-cyan-400"}` }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: u.unitName }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-[10px] opacity-75",
											children: [Math.round(u.position.speed), " km/h"]
										})
									]
								}, u.unitId);
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 mb-3 px-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-300",
									children: [
										"Ubicación Satelital:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-cyan-400",
											children: activeUnit.unitName
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => query.refetch(),
								disabled: query.isFetching,
								className: "flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors",
								title: "Actualizar posición ahora",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-3.5 ${query.isFetching ? "animate-spin text-cyan-400" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Refrescar"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 w-full relative min-h-[380px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-full w-full items-center justify-center rounded-xl bg-slate-950/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" })
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SharedUnitLiveMap, {
									unitName: activeUnit.unitName,
									position: activeUnit.position,
									trail: activeUnit.trail,
									units: unitList.length > 1 ? unitList : void 0,
									selectedUnitId: activeUnit.unitId,
									onSelectUnit: (id) => setSelectedUnitId(id)
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: wazeUrl,
									target: "_blank",
									rel: "noreferrer",
									className: "flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs py-3 px-3 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-98",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Navegar en Waze (",
										activeUnit.unitName,
										")"
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: googleMapsUrl,
									target: "_blank",
									rel: "noreferrer",
									className: "flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-3 px-3 transition-all active:scale-98",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4 shrink-0 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Google Maps" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: whatsappUrl,
									target: "_blank",
									rel: "noreferrer",
									className: "col-span-2 sm:col-span-1 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-xs py-3 px-3 transition-all active:scale-98",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Compartir" })]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm shadow-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-slate-800 pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-slate-400",
										children: unitList.length > 1 ? "Unidad Seleccionada" : "Vehículo Monitoreado"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { className: "size-5 text-cyan-400" }), activeUnit.unitName]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${activePos.isMoving ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-slate-800 text-slate-300 border border-slate-700"}`,
										children: activePos.isMoving ? "En movimiento" : "Detenido"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3 mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-slate-800/80 bg-slate-950/50 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-slate-400 text-xs font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "size-4 text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Velocidad" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 font-mono text-xl font-bold text-slate-100",
											children: [
												Math.round(activePos.speed),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-normal text-slate-400",
													children: "km/h"
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-slate-800/80 bg-slate-950/50 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-slate-400 text-xs font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-4 text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rumbo" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 font-mono text-xl font-bold text-slate-100",
											children: [activePos.course, "°"]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-cyan-400" }), "Ubicación Detectada"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs font-medium text-slate-200 leading-relaxed",
											children: activePos.address || "Coordenadas satelitales en tiempo real"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 text-[10px] text-slate-500 font-mono",
											children: [
												"Lat: ",
												activePos.lat.toFixed(6),
												", Lon: ",
												activePos.lon.toFixed(6)
											]
										})
									]
								}),
								data.clientName || data.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 pt-3 border-t border-slate-800/80 space-y-2",
									children: [data.clientName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400",
										children: "Asignado para:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-slate-200 mt-0.5",
										children: data.clientName
									})] }) : null, data.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400",
										children: "Instrucción / Motivo:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-300 mt-0.5 italic",
										children: data.notes
									})] }) : null]
								}) : null
							]
						}),
						unitList.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Flota Compartida (",
									unitList.length,
									" Unidades)"
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: unitList.map((u) => {
									const isSelected = u.unitId === activeUnit.unitId;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setSelectedUnitId(u.unitId),
										className: `w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${isSelected ? "border-cyan-500/60 bg-cyan-950/40 text-cyan-200" : "border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 pr-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-xs truncate",
												children: u.unitName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-slate-400 truncate",
												children: u.position.address || "En ruta"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-right shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${u.position.isMoving ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`,
												children: [Math.round(u.position.speed), " km/h"]
											})
										})]
									}, u.unitId);
								})
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 font-semibold text-slate-300 mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: data.isUnlimited ? "Enlace Seguro Permanente" : "Enlace Seguro y Privado" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] leading-relaxed",
									children: data.isUnlimited ? "Este enlace no tiene límite de vigencia y transmite la telemetría satelital continua de la flota autorizada." : "Este enlace expira automáticamente por seguridad. La ubicación se actualiza en vivo mediante telemetría satelital directa."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] text-slate-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: data.isUnlimited ? "Vigencia: Sin límite" : `Expira: ${new Date(data.expiresAt).toLocaleTimeString("es-MX", {
										hour: "2-digit",
										minute: "2-digit"
									})}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handleCopy,
										className: "text-cyan-400 hover:underline font-semibold",
										children: copied ? "¡Enlace Copiado!" : "Copiar Enlace"
									})]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-slate-800/60 py-4 text-center text-xs text-slate-500 mt-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ORB-LITE · Monitoreo Satelital GPS · Enlace de Seguimiento en Vivo" })
			})
		]
	});
}
//#endregion
export { PublicUnitTrackingPage as component };
