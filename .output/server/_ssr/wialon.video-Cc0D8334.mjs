import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { B as HardDrive, R as Info, _ as Radio, d as ShieldCheck, et as CircleCheck, ot as Camera, q as ExternalLink, r as Video } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { S as wialonVideoUnits, x as wialonVideoSettings } from "./wialon.functions-DfBM1Ing.mjs";
import { t as WialonGuard } from "./wialon-guard-JCWFzsMD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.video-Cc0D8334.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border/60 bg-card p-6 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-bold uppercase tracking-wide",
							children: "Cámaras y Video de Unidades"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold uppercase tracking-wider text-primary",
							children: "Consulta oficial de cámaras (unit/get_video_settings)"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: "ORB-LITE consulta de forma oficial las cámaras y estados configurados en tus unidades. La reproducción en vivo, grabaciones y permisos de usuario quedan completamente controlados por Wialon."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: WIALON_VIDEO_URL,
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow transition hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), "Abrir página oficial de Wialon"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border/60 bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-medium",
						children: ["Seleccionar Unidad", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "mt-2 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary",
							value: selectedId ?? "",
							onChange: (event) => setUnitId(Number(event.target.value)),
							disabled: videoUnits.isLoading || !videoUnits.data?.units?.length,
							children: videoUnits.data?.units?.map((unit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: unit.id,
								children: [
									unit.name,
									unit.cameraCount > 0 ? ` · ${unit.cameraCount} cámara${unit.cameraCount === 1 ? "" : "s"}` : "",
									unit.brand ? ` · ${unit.brand}` : ""
								]
							}, unit.id))
						})]
					}),
					videoUnits.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: "Buscando unidades disponibles en Wialon…"
					}) : null,
					videoUnits.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-destructive",
						children: videoUnits.error instanceof Error ? videoUnits.error.message : "No se pudieron consultar las unidades."
					}) : null
				]
			}),
			video.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border/60 bg-card p-8 text-center text-sm text-muted-foreground",
				children: "Consultando cámaras oficiales mediante unit/get_video_settings…"
			}) : null,
			video.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-destructive/40 bg-card p-6 text-sm text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: video.error instanceof Error ? video.error.message : "No se pudo consultar la configuración de video."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: "Verifica que el usuario de Wialon cuente con los permisos necesarios para ver las propiedades detalladas de la unidad."
				})]
			}) : null,
			video.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-bold uppercase tracking-wide",
								children: selectedUnit?.name ?? "Unidad"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full border border-border bg-muted/50 px-3 py-0.5 text-xs font-medium text-foreground",
								children: [video.data.cameras.length, " cámara(s) detectada(s)"]
							}),
							selectedUnit?.brand ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary",
								children: selectedUnit.brand
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: WIALON_VIDEO_URL,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline-offset-4 hover:underline",
						children: ["Ir a Pestaña de Video en Wialon", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
					})]
				}), video.data.cameras.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/60 bg-card p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "mx-auto size-10 text-muted-foreground/50" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "mt-3 font-semibold text-foreground",
							children: "Sin cámaras configuradas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
							children: "Esta unidad no tiene cámaras registradas en Wialon o tu usuario no tiene permisos de video asignados."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: WIALON_VIDEO_URL,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/10",
								children: ["Configurar en Wialon Hosting ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5 md:grid-cols-2",
					children: video.data.cameras.map((camera) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-between overflow-hidden rounded-xl border border-border/60 bg-card p-5 shadow-sm transition hover:border-primary/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded bg-muted px-2 py-0.5 text-xs font-mono font-bold text-foreground",
										children: ["Canal ", camera.index]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-semibold text-foreground",
										children: camera.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: ["Unidad: ", selectedUnit?.name ?? `ID ${selectedId}`]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), "Activa"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-4 aspect-video overflow-hidden rounded-lg border border-border/40 bg-zinc-950 p-4 text-center flex flex-col items-center justify-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute left-3 top-3 flex items-center gap-1.5 rounded bg-black/60 px-2 py-0.5 text-[11px] font-mono text-white/80",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-3 text-red-500 animate-pulse" }),
											"CANAL ",
											camera.index
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-10 text-white/30" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs font-medium text-white/90",
										children: camera.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 max-w-xs text-[11px] text-white/60",
										children: "Reproducción en vivo y grabaciones controladas por Wialon."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: WIALON_VIDEO_URL,
										target: "_blank",
										rel: "noreferrer",
										className: "mt-3 inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-white/20 transition",
										children: ["Abrir pestaña de video ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-2 gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-foreground",
										children: "Grabación"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: camera.recording ? "Habilitada" : "Manual / eventos"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-foreground",
										children: "Permisos"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: "Seguridad Wialon"
									})] })]
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Transmisión en streaming: Oficial Wialon" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: WIALON_VIDEO_URL,
								target: "_blank",
								rel: "noreferrer",
								className: "font-semibold text-primary hover:underline inline-flex items-center gap-1",
								children: ["Abrir Wialon ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
							})]
						})]
					}, camera.index))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-5 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "mt-0.5 size-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-foreground",
						children: "Control de reproducción y permisos en Wialon"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Para garantizar la máxima seguridad y compatibilidad, la transmisión de video en vivo y descarga de grabaciones están centralizadas en la pestaña de video oficial de Wialon Hosting (",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: WIALON_VIDEO_URL,
							target: "_blank",
							rel: "noreferrer",
							className: "text-primary underline",
							children: "https://hosting.wialon.com/"
						}),
						"). ORB-LITE utiliza la consulta oficial",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground",
							children: "unit/get_video_settings"
						}),
						" ",
						"sin recurrir a endpoints no documentados ni intermediarios no autorizados."
					] })]
				})]
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoView, { session }) });
//#endregion
export { SplitComponent as component };
