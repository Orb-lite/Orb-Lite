import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { d as ShieldCheck, i as UserPlus, o as Truck, q as ExternalLink } from "../_libs/lucide-react.mjs";
import { n as PLATFORM_URLS } from "./wialon-session-C7Oq2mAo.mjs";
import { t as WialonGuard } from "./wialon-guard-BAmRBw40.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.cms-Clb94wRB.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/wialon.cms.tsx?tsr-split=component";
function Step({ n, children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "flex size-6 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-primary-foreground",
			children: n
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 12,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-sm leading-relaxed text-muted-foreground",
			children
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 15,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 11,
		columnNumber: 10
	}, this);
}
function CmsView({ session }) {
	const isFull = session.host === "full";
	const cmsUrl = isFull ? PLATFORM_URLS.full.cms : PLATFORM_URLS.lite.cms;
	const platformName = isFull ? "ORB-FULL" : "ORB-LITE";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mx-auto max-w-3xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "font-display text-2xl font-bold uppercase tracking-wide",
						children: "Altas de unidades y usuarios"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 28,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: [
							"Las altas se realizan directamente en el panel CMS oficial de ",
							platformName,
							"."
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 31,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: cmsUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 35,
								columnNumber: 11
							}, this),
							" Abrir panel CMS de ",
							platformName
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 34,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 27,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "rounded-lg border border-border/60 bg-card/40 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Truck, { className: "size-5 text-primary" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 41,
						columnNumber: 11
					}, this), " Dar de alta una unidad"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 40,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Step, {
							n: 1,
							children: "Entra al panel CMS con tu usuario y contraseña de la plataforma."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 44,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Step, {
							n: 2,
							children: [
								"Abre la sección ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-foreground",
									children: "Unidades"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 46,
									columnNumber: 29
								}, this),
								" y presiona",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-foreground",
									children: "Nueva unidad"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 47,
									columnNumber: 13
								}, this),
								"."
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 45,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Step, {
							n: 3,
							children: "Escribe el nombre de la unidad (el mismo que usarás en la plataforma) y selecciona el tipo de dispositivo GPS."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 49,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Step, {
							n: 4,
							children: [
								"Captura el ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-foreground",
									children: "IMEI"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 54,
									columnNumber: 24
								}, this),
								" del equipo y, si aplica, el número de teléfono del chip."
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 53,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Step, {
							n: 5,
							children: "Guarda. La unidad aparecerá en el mapa en cuanto el equipo empiece a transmitir."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 57,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 43,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 39,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "rounded-lg border border-border/60 bg-card/40 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserPlus, { className: "size-5 text-primary" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 65,
						columnNumber: 11
					}, this), " Dar de alta un usuario"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 64,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Step, {
							n: 1,
							children: "Entra al panel CMS con tu usuario y contraseña de la plataforma."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 68,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Step, {
							n: 2,
							children: [
								"Abre la sección ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-foreground",
									children: "Usuarios"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 70,
									columnNumber: 29
								}, this),
								" y presiona",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-foreground",
									children: "Nuevo usuario"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 71,
									columnNumber: 13
								}, this),
								"."
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Step, {
							n: 3,
							children: "Escribe el nombre de usuario, la contraseña y los datos de contacto."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 73,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Step, {
							n: 4,
							children: [
								"En la pestaña de ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-foreground",
									children: "acceso"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 75,
									columnNumber: 30
								}, this),
								", asigna las unidades que ese usuario podrá ver y el nivel de permisos sobre cada una."
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 74,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Step, {
							n: 5,
							children: "Guarda y comparte las credenciales con el usuario."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 78,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 67,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 63,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "rounded-lg border border-primary/40 bg-primary/5 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "size-5 text-primary" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 84,
						columnNumber: 11
					}, this), " Permisos necesarios"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 83,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted-foreground",
					children: [
						"Para dar de alta unidades o usuarios, tu cuenta debe tener otorgados los permisos de",
						" ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
							className: "text-foreground",
							children: "creación de unidades"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 11
						}, this),
						" y",
						" ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
							className: "text-foreground",
							children: "creación de usuarios"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 89,
							columnNumber: 11
						}, this),
						" sobre la cuenta o recurso correspondiente. Estos permisos los otorga el administrador de la cuenta (super admin). Si al entrar al panel CMS no ves las opciones de crear unidades o usuarios, solicita al administrador que active esos permisos para tu usuario."
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 86,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 82,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 26,
		columnNumber: 10
	}, this);
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CmsView, { session }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 97,
	columnNumber: 55
}, void 0) }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 97,
	columnNumber: 30
}, void 0);
//#endregion
export { SplitComponent as component };
