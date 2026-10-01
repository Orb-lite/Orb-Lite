import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { $ as ExternalLink, B as Layers, D as Navigation, P as MapPin, U as Infinity$1, at as Clock, b as RefreshCw, h as Share2, ht as Car, it as Compass, m as ShieldAlert, p as ShieldCheck, q as Gauge } from "../_libs/lucide-react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as orb_lite_logo_default } from "./orb-lite-logo-CEgq-Hxq.mjs";
import { t as Route } from "./rastreo._token-CdKS-YZI.mjs";
import { i as getPublicUnitTracking } from "./unit-share.functions-C6x0SiHr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rastreo._token-COksmEnA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/rastreo.$token.tsx?tsr-split=component";
var SharedUnitLiveMap = import_react.lazy(() => import("./SharedUnitLiveMap-HiEyi2GL.mjs"));
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
	if (query.isLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-slate-100",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "size-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 92,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "mt-4 text-sm font-medium tracking-wide text-slate-400",
			children: "Cargando rastreo en tiempo real..."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 93,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 91,
		columnNumber: 12
	}, this);
	if (query.isError || !data) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mx-auto flex size-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldAlert, { className: "size-8" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 101,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 100,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "mt-5 font-display text-2xl font-bold uppercase tracking-wider text-slate-100",
				children: "Enlace no disponible"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 103,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-2 max-w-md text-sm text-slate-400",
				children: query.error instanceof Error ? query.error.message : "Este enlace de rastreo no existe, fue cancelado o ha sido revocado por el administrador."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 106,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
				href: "/",
				className: "mt-6 rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-200 transition-colors hover:bg-slate-700",
				children: "Volver a ORB-LITE"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 109,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 99,
		columnNumber: 12
	}, this);
	const isExpired = !data.isUnlimited && (data.isExpired || countdown !== null && countdown <= 0);
	const isRevoked = data.isRevoked;
	if (isRevoked || isExpired) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mx-auto flex size-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock, { className: "size-8" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 119,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 118,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "mt-5 font-display text-2xl font-bold uppercase tracking-wider text-slate-100",
				children: isRevoked ? "Enlace Cancelado" : "Enlace Expirado"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 121,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-2 max-w-md text-sm text-slate-400",
				children: isRevoked ? "El acceso temporal a esta unidad fue revocado por el supervisor de la cuenta." : `El periodo de vigencia para el seguimiento de "${data.unitName}" ha concluido por políticas de seguridad.`
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 124,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300 max-w-md text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "font-semibold text-slate-200",
						children: ["Unidad: ", data.unitName]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 128,
						columnNumber: 11
					}, this),
					data.clientName ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-1 text-slate-400",
						children: ["Destinatario: ", data.clientName]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 129,
						columnNumber: 30
					}, this) : null,
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-1 text-slate-400",
						children: [
							"Venció el:",
							" ",
							new Date(data.expiresAt).toLocaleString("es-MX", {
								dateStyle: "medium",
								timeStyle: "short"
							})
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 130,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 127,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-6 text-xs text-slate-500",
				children: "Si requieres continuar el seguimiento, solicita un nuevo enlace a tu contacto de ORB-LITE."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 138,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 117,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-slate-950 text-slate-100 flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-4 py-3 sm:px-6 sticky top-0 z-40",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mx-auto max-w-6xl flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
							src: orb_lite_logo_default,
							alt: "ORB-LITE",
							className: "h-9 w-auto"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 148,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "border-l border-slate-700 pl-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "relative flex h-2.5 w-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 152,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 153,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 151,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs font-bold uppercase tracking-wider text-emerald-400",
										children: "Rastreo en Vivo"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 155,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "hidden sm:inline-block rounded bg-slate-800/90 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-700",
										children: data.lastPingAgoSeconds < 5 ? "Transmisión en directo" : `Último ping: hace ${data.lastPingAgoSeconds}s`
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 158,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 150,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "text-sm font-semibold tracking-tight text-slate-200 truncate max-w-[200px] sm:max-w-md",
								children: data.unitName
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 162,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 149,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 147,
						columnNumber: 11
					}, this), data.isUnlimited ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3.5 py-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "size-4 text-emerald-400 shrink-0" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 170,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-[10px] font-semibold uppercase tracking-wider text-emerald-300/80",
								children: "Vigencia"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 172,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-display text-xs font-bold text-emerald-300 flex items-center gap-1 justify-end",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Infinity$1, { className: "size-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 176,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Sin límite de tiempo" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 177,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 175,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 171,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 169,
						columnNumber: 31
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock, { className: "size-4 text-cyan-400 shrink-0" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 181,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-[10px] font-semibold uppercase tracking-wider text-cyan-300/80",
								children: "Vigencia Restante"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 183,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-mono text-xs font-bold text-cyan-300",
								children: countdown !== null ? formatRemainingTime(countdown) : "--:--"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 186,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 182,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 180,
						columnNumber: 22
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 146,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 145,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "mx-auto max-w-6xl w-full flex-1 p-4 sm:p-6 grid gap-6 lg:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4 backdrop-blur-sm min-h-[420px] lg:min-h-[580px]",
					children: [
						unitList.length > 1 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mb-3 flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800/80",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layers, { className: "size-3.5 text-cyan-400" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 201,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Flota:" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 202,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 200,
								columnNumber: 15
							}, this), unitList.map((u) => {
								const isSelected = u.unitId === activeUnit.unitId;
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => setSelectedUnitId(u.unitId),
									className: `flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${isSelected ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm" : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/60"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `size-1.5 rounded-full ${u.position.isMoving ? "bg-emerald-400 animate-pulse" : "bg-cyan-400"}` }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 207,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: u.unitName }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 208,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-mono text-[10px] opacity-75",
											children: [Math.round(u.position.speed), " km/h"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 209,
											columnNumber: 21
										}, this)
									]
								}, u.unitId, true, {
									fileName: _jsxFileName,
									lineNumber: 206,
									columnNumber: 20
								}, this);
							})]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 199,
							columnNumber: 34
						}, this) : null,
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between gap-3 mb-3 px-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { className: "size-4 text-cyan-400" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 218,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-300",
									children: [
										"Ubicación Satelital:",
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
											className: "text-cyan-400",
											children: activeUnit.unitName
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 221,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 219,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 217,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => query.refetch(),
								disabled: query.isFetching,
								className: "flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors",
								title: "Actualizar posición ahora",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: `size-3.5 ${query.isFetching ? "animate-spin text-cyan-400" : ""}` }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 225,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "hidden sm:inline",
									children: "Refrescar"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 226,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 224,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 216,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex-1 w-full relative min-h-[380px]",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.Suspense, {
								fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex h-full w-full items-center justify-center rounded-xl bg-slate-950/60",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "size-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 232,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 231,
									columnNumber: 39
								}, this),
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SharedUnitLiveMap, {
									unitName: activeUnit.unitName,
									position: activeUnit.position,
									trail: activeUnit.trail,
									units: unitList.length > 1 ? unitList : void 0,
									selectedUnitId: activeUnit.unitId,
									onSelectUnit: (id) => setSelectedUnitId(id)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 234,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 231,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 230,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: wazeUrl,
									target: "_blank",
									rel: "noreferrer",
									className: "flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs py-3 px-3 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-98",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Navigation, { className: "size-4 shrink-0" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 241,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
										"Navegar en Waze (",
										activeUnit.unitName,
										")"
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 242,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 240,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: googleMapsUrl,
									target: "_blank",
									rel: "noreferrer",
									className: "flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-3 px-3 transition-all active:scale-98",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "size-4 shrink-0 text-emerald-400" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 245,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Google Maps" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 246,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 244,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: whatsappUrl,
									target: "_blank",
									rel: "noreferrer",
									className: "col-span-2 sm:col-span-1 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-xs py-3 px-3 transition-all active:scale-98",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Share2, { className: "size-4 shrink-0" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 249,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Compartir" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 250,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 248,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 239,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 197,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm shadow-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between border-b border-slate-800 pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-slate-400",
										children: unitList.length > 1 ? "Unidad Seleccionada" : "Vehículo Monitoreado"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 261,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
										className: "text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Car, { className: "size-5 text-cyan-400" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 265,
											columnNumber: 19
										}, this), activeUnit.unitName]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 264,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 260,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: `rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${activePos.isMoving ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-slate-800 text-slate-300 border border-slate-700"}`,
										children: activePos.isMoving ? "En movimiento" : "Detenido"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 269,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 259,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3 mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "rounded-xl border border-slate-800/80 bg-slate-950/50 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-1.5 text-slate-400 text-xs font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Gauge, { className: "size-4 text-cyan-400" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 278,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Velocidad" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 279,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 277,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "mt-1 font-mono text-xl font-bold text-slate-100",
											children: [
												Math.round(activePos.speed),
												" ",
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-xs font-normal text-slate-400",
													children: "km/h"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 283,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 281,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 276,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "rounded-xl border border-slate-800/80 bg-slate-950/50 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-1.5 text-slate-400 text-xs font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Compass, { className: "size-4 text-cyan-400" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 289,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Rumbo" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 290,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 288,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "mt-1 font-mono text-xl font-bold text-slate-100",
											children: [activePos.course, "°"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 292,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 287,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 275,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { className: "size-3.5 text-cyan-400" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 301,
												columnNumber: 17
											}, this), "Ubicación Detectada"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 300,
											columnNumber: 15
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "mt-1 text-xs font-medium text-slate-200 leading-relaxed",
											children: activePos.address || "Coordenadas satelitales en tiempo real"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 304,
											columnNumber: 15
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "mt-2 text-[10px] text-slate-500 font-mono",
											children: [
												"Lat: ",
												activePos.lat.toFixed(6),
												", Lon: ",
												activePos.lon.toFixed(6)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 307,
											columnNumber: 15
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 299,
									columnNumber: 13
								}, this),
								data.clientName || data.notes ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4 pt-3 border-t border-slate-800/80 space-y-2",
									children: [data.clientName ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400",
										children: "Asignado para:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 315,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs font-semibold text-slate-200 mt-0.5",
										children: data.clientName
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 318,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 314,
										columnNumber: 36
									}, this) : null, data.notes ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400",
										children: "Instrucción / Motivo:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 321,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-slate-300 mt-0.5 italic",
										children: data.notes
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 324,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 320,
										columnNumber: 31
									}, this) : null]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 313,
									columnNumber: 46
								}, this) : null
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 258,
							columnNumber: 11
						}, this),
						unitList.length > 1 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layers, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 332,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
									"Flota Compartida (",
									unitList.length,
									" Unidades)"
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 333,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 331,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: unitList.map((u) => {
									const isSelected = u.unitId === activeUnit.unitId;
									return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => setSelectedUnitId(u.unitId),
										className: `w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${isSelected ? "border-cyan-500/60 bg-cyan-950/40 text-cyan-200" : "border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900"}`,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "min-w-0 pr-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "font-semibold text-xs truncate",
												children: u.unitName
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 340,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-[10px] text-slate-400 truncate",
												children: u.position.address || "En ruta"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 341,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 339,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-right shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: `text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${u.position.isMoving ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`,
												children: [Math.round(u.position.speed), " km/h"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 346,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 345,
											columnNumber: 23
										}, this)]
									}, u.unitId, true, {
										fileName: _jsxFileName,
										lineNumber: 338,
										columnNumber: 22
									}, this);
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 335,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 330,
							columnNumber: 34
						}, this) : null,
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 font-semibold text-slate-300 mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "size-4 text-emerald-400" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 358,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: data.isUnlimited ? "Enlace Seguro Permanente" : "Enlace Seguro y Privado" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 359,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 357,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[11px] leading-relaxed",
									children: data.isUnlimited ? "Este enlace no tiene límite de vigencia y transmite la telemetría satelital continua de la flota autorizada." : "Este enlace expira automáticamente por seguridad. La ubicación se actualiza en vivo mediante telemetría satelital directa."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 363,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-3 flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] text-slate-500",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: data.isUnlimited ? "Vigencia: Sin límite" : `Expira: ${new Date(data.expiresAt).toLocaleTimeString("es-MX", {
										hour: "2-digit",
										minute: "2-digit"
									})}` }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 367,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										onClick: handleCopy,
										className: "text-cyan-400 hover:underline font-semibold",
										children: copied ? "¡Enlace Copiado!" : "Copiar Enlace"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 373,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 366,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 356,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 256,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 195,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
				className: "border-t border-slate-800/60 py-4 text-center text-xs text-slate-500 mt-auto",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "ORB-LITE · Monitoreo Satelital GPS · Enlace de Seguimiento en Vivo" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 383,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 382,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 143,
		columnNumber: 10
	}, this);
}
//#endregion
export { PublicUnitTrackingPage as component };
