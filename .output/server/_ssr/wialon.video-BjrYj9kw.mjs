import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { B as HardDrive, R as Info, _ as Radio, d as ShieldCheck, et as CircleCheck, ot as Camera, q as ExternalLink, r as Video } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { S as wialonVideoUnits, x as wialonVideoSettings } from "./wialon.functions-B5LcdM8M.mjs";
import { t as WialonGuard } from "./wialon-guard-BAmRBw40.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.video-BjrYj9kw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/wialon.video.tsx?tsr-split=component";
var WIALON_VIDEO_URL = "https://hosting.wialon.com/";
function VideoView({ session }) {
	const videoUnitsFn = useServerFn(wialonVideoUnits);
	const videoSettingsFn = useServerFn(wialonVideoSettings);
	const [unitId, setUnitId] = import_react.useState(null);
	const videoUnits = useQuery({
		queryKey: [
			"wialon-video-units",
			session.sid,
			session.host
		],
		queryFn: () => videoUnitsFn({ data: {
			host: session.host,
			sid: session.sid
		} })
	});
	const selectedId = unitId ?? videoUnits.data?.units[0]?.id ?? null;
	const selectedUnit = videoUnits.data?.units.find((unit) => unit.id === selectedId);
	const video = useQuery({
		queryKey: [
			"wialon-video-settings",
			session.sid,
			selectedId,
			session.host
		],
		queryFn: () => videoSettingsFn({ data: {
			host: session.host,
			sid: session.sid,
			unitId: selectedId
		} }),
		enabled: selectedId != null
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border/60 bg-card p-6 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-w-3xl",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Video, { className: "size-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 44,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 43,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-display text-xl font-bold uppercase tracking-wide",
							children: "Cámaras y Video de Unidades"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 47,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-xs font-semibold uppercase tracking-wider text-primary",
							children: "Consulta oficial de cámaras (unit/get_video_settings)"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 50,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 46,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 42,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: "ORB-LITE consulta de forma oficial las cámaras y estados configurados en tus unidades. La reproducción en vivo, grabaciones y permisos de usuario quedan completamente controlados por Wialon."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 55,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 41,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
					href: WIALON_VIDEO_URL,
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow transition hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "size-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 63,
						columnNumber: 11
					}, this), "Abrir página oficial de Wialon"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 62,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 40,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-xl border border-border/60 bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "block text-sm font-medium",
						children: ["Seleccionar Unidad", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
							className: "mt-2 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary",
							value: selectedId ?? "",
							onChange: (event) => setUnitId(Number(event.target.value)),
							disabled: videoUnits.isLoading || !videoUnits.data?.units?.length,
							children: videoUnits.data?.units?.map((unit) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
								value: unit.id,
								children: [
									unit.name,
									unit.cameraCount > 0 ? ` · ${unit.cameraCount} cámara${unit.cameraCount === 1 ? "" : "s"}` : "",
									unit.brand ? ` · ${unit.brand}` : ""
								]
							}, unit.id, true, {
								fileName: _jsxFileName,
								lineNumber: 73,
								columnNumber: 50
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 72,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 70,
						columnNumber: 9
					}, this),
					videoUnits.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: "Buscando unidades disponibles en Wialon…"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 81,
						columnNumber: 33
					}, this) : null,
					videoUnits.isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-3 text-xs text-destructive",
						children: videoUnits.error instanceof Error ? videoUnits.error.message : "No se pudieron consultar las unidades."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 85,
						columnNumber: 31
					}, this) : null
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 69,
				columnNumber: 7
			}, this),
			video.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-xl border border-border/60 bg-card p-8 text-center text-sm text-muted-foreground",
				children: "Consultando cámaras oficiales mediante unit/get_video_settings…"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 91,
				columnNumber: 26
			}, this) : null,
			video.isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-xl border border-destructive/40 bg-card p-6 text-sm text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "font-semibold",
					children: video.error instanceof Error ? video.error.message : "No se pudo consultar la configuración de video."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 96,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: "Verifica que el usuario de Wialon cuente con los permisos necesarios para ver las propiedades detalladas de la unidad."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 99,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 95,
				columnNumber: 24
			}, this) : null,
			video.data ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "font-display text-lg font-bold uppercase tracking-wide",
								children: selectedUnit?.name ?? "Unidad"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 108,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "rounded-full border border-border bg-muted/50 px-3 py-0.5 text-xs font-medium text-foreground",
								children: [video.data.cameras.length, " cámara(s) detectada(s)"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 111,
								columnNumber: 15
							}, this),
							selectedUnit?.brand ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary",
								children: selectedUnit.brand
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 114,
								columnNumber: 38
							}, this) : null
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 107,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: WIALON_VIDEO_URL,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline-offset-4 hover:underline",
						children: ["Ir a Pestaña de Video en Wialon", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "size-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 121,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 119,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 106,
					columnNumber: 11
				}, this), video.data.cameras.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-xl border border-border/60 bg-card p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Camera, { className: "mx-auto size-10 text-muted-foreground/50" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 126,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
							className: "mt-3 font-semibold text-foreground",
							children: "Sin cámaras configuradas"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 127,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
							children: "Esta unidad no tiene cámaras registradas en Wialon o tu usuario no tiene permisos de video asignados."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 128,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-5",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
								href: WIALON_VIDEO_URL,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/10",
								children: ["Configurar en Wialon Hosting ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "size-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 134,
									columnNumber: 48
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 133,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 132,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 125,
					columnNumber: 46
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid gap-5 md:grid-cols-2",
					children: video.data.cameras.map((camera) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col justify-between overflow-hidden rounded-xl border border-border/60 bg-card p-5 shadow-sm transition hover:border-primary/40",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "rounded bg-muted px-2 py-0.5 text-xs font-mono font-bold text-foreground",
										children: ["Canal ", camera.index]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 144,
										columnNumber: 27
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
										className: "font-semibold text-foreground",
										children: camera.name
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 147,
										columnNumber: 27
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 143,
									columnNumber: 25
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: ["Unidad: ", selectedUnit?.name ?? `ID ${selectedId}`]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 149,
									columnNumber: 25
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 142,
									columnNumber: 23
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "size-3" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 155,
										columnNumber: 25
									}, this), "Activa"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 154,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 141,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative mt-4 aspect-video overflow-hidden rounded-lg border border-border/40 bg-zinc-950 p-4 text-center flex flex-col items-center justify-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "absolute left-3 top-3 flex items-center gap-1.5 rounded bg-black/60 px-2 py-0.5 text-[11px] font-mono text-white/80",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Radio, { className: "size-3 text-red-500 animate-pulse" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 163,
												columnNumber: 25
											}, this),
											"CANAL ",
											camera.index
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 162,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Camera, { className: "size-10 text-white/30" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 167,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-2 text-xs font-medium text-white/90",
										children: camera.name
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 168,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-1 max-w-xs text-[11px] text-white/60",
										children: "Reproducción en vivo y grabaciones controladas por Wialon."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 169,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
										href: WIALON_VIDEO_URL,
										target: "_blank",
										rel: "noreferrer",
										className: "mt-3 inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-white/20 transition",
										children: ["Abrir pestaña de video ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "size-3" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 174,
											columnNumber: 48
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 173,
										columnNumber: 23
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 161,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-4 grid grid-cols-2 gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HardDrive, { className: "size-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 181,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "font-semibold text-foreground",
										children: "Grabación"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 183,
										columnNumber: 27
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-muted-foreground",
										children: camera.recording ? "Habilitada" : "Manual / eventos"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 184,
										columnNumber: 27
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 182,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 180,
									columnNumber: 23
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "size-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 191,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "font-semibold text-foreground",
										children: "Permisos"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 193,
										columnNumber: 27
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-muted-foreground",
										children: "Seguridad Wialon"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 194,
										columnNumber: 27
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 192,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 190,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 179,
								columnNumber: 21
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 139,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Transmisión en streaming: Oficial Wialon" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 201,
								columnNumber: 21
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
								href: WIALON_VIDEO_URL,
								target: "_blank",
								rel: "noreferrer",
								className: "font-semibold text-primary hover:underline inline-flex items-center gap-1",
								children: ["Abrir Wialon ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "size-3" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 203,
									columnNumber: 36
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 202,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 200,
							columnNumber: 19
						}, this)]
					}, camera.index, true, {
						fileName: _jsxFileName,
						lineNumber: 138,
						columnNumber: 49
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 137,
					columnNumber: 22
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 105,
				columnNumber: 21
			}, this) : null,
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-5 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Info, { className: "mt-0.5 size-4 shrink-0 text-primary" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 212,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "font-semibold text-foreground",
						children: "Control de reproducción y permisos en Wialon"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 214,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
						"Para garantizar la máxima seguridad y compatibilidad, la transmisión de video en vivo y descarga de grabaciones están centralizadas en la pestaña de video oficial de Wialon Hosting (",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
							href: WIALON_VIDEO_URL,
							target: "_blank",
							rel: "noreferrer",
							className: "text-primary underline",
							children: "https://hosting.wialon.com/"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 221,
							columnNumber: 13
						}, this),
						"). ORB-LITE utiliza la consulta oficial",
						" ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
							className: "rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground",
							children: "unit/get_video_settings"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 225,
							columnNumber: 13
						}, this),
						" ",
						"sin recurrir a endpoints no documentados ni intermediarios no autorizados."
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 217,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 213,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 211,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 38,
		columnNumber: 10
	}, this);
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(VideoView, { session }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 234,
	columnNumber: 55
}, void 0) }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 234,
	columnNumber: 30
}, void 0);
//#endregion
export { SplitComponent as component };
