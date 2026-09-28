import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as ShieldCheck, i as UserPlus, o as Truck, q as ExternalLink } from "../_libs/lucide-react.mjs";
import { n as PLATFORM_URLS } from "./wialon-session-C7Oq2mAo.mjs";
import { t as WialonGuard } from "./wialon-guard-JCWFzsMD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.cms-BmhJXCHy.js
var import_jsx_runtime = require_jsx_runtime();
function Step({ n, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-6 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-primary-foreground",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm leading-relaxed text-muted-foreground",
			children
		})]
	});
}
function CmsView({ session }) {
	const isFull = session.host === "full";
	const cmsUrl = isFull ? PLATFORM_URLS.full.cms : PLATFORM_URLS.lite.cms;
	const platformName = isFull ? "ORB-FULL" : "ORB-LITE";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold uppercase tracking-wide",
						children: "Altas de unidades y usuarios"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: [
							"Las altas se realizan directamente en el panel CMS oficial de ",
							platformName,
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: cmsUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }),
							" Abrir panel CMS de ",
							platformName
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border/60 bg-card/40 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-5 text-primary" }), " Dar de alta una unidad"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: 1,
							children: "Entra al panel CMS con tu usuario y contraseña de la plataforma."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
							n: 2,
							children: [
								"Abre la sección ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "Unidades"
								}),
								" y presiona",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "Nueva unidad"
								}),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: 3,
							children: "Escribe el nombre de la unidad (el mismo que usarás en la plataforma) y selecciona el tipo de dispositivo GPS."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
							n: 4,
							children: [
								"Captura el ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "IMEI"
								}),
								" del equipo y, si aplica, el número de teléfono del chip."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: 5,
							children: "Guarda. La unidad aparecerá en el mapa en cuanto el equipo empiece a transmitir."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border/60 bg-card/40 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-5 text-primary" }), " Dar de alta un usuario"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: 1,
							children: "Entra al panel CMS con tu usuario y contraseña de la plataforma."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
							n: 2,
							children: [
								"Abre la sección ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "Usuarios"
								}),
								" y presiona",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "Nuevo usuario"
								}),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: 3,
							children: "Escribe el nombre de usuario, la contraseña y los datos de contacto."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
							n: 4,
							children: [
								"En la pestaña de ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "acceso"
								}),
								", asigna las unidades que ese usuario podrá ver y el nivel de permisos sobre cada una."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: 5,
							children: "Guarda y comparte las credenciales con el usuario."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-primary/40 bg-primary/5 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-primary" }), " Permisos necesarios"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted-foreground",
					children: [
						"Para dar de alta unidades o usuarios, tu cuenta debe tener otorgados los permisos de",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: "creación de unidades"
						}),
						" y",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: "creación de usuarios"
						}),
						" sobre la cuenta o recurso correspondiente. Estos permisos los otorga el administrador de la cuenta (super admin). Si al entrar al panel CMS no ves las opciones de crear unidades o usuarios, solicita al administrador que active esos permisos para tu usuario."
					]
				})]
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsView, { session }) });
//#endregion
export { SplitComponent as component };
