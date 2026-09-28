import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { N as redirect, _ as Link, c as Scripts, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, l as HeadContent, m as lazyRouteComponent, p as Outlet, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CTQv3F-F.mjs";
import { t as Route$27 } from "./acceso-crm-DEPPu5fu.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as ensureFreshSession } from "./crm-session-BNA9ahII.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as render } from "../_libs/@react-email/render+[...].mjs";
import { r as TEMPLATES, t as sendTemplateEmail } from "./send-email-CKArGOSn.mjs";
import { t as Route$28 } from "./panel._token-Bd9qvVxD.mjs";
import { n as getLogs } from "./ssr.mjs";
import { a as SiteFooter, o as SiteHeader } from "./site-chrome-DLgFUEGX.mjs";
import { t as Route$29 } from "./ruta._token-1LytiUWQ.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/router-D2WiVxaQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var styles_default = "/assets/styles-2PMQNZmU.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var _jsxFileName$1 = "/app/applet/src/components/ui/sonner.tsx";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 7,
		columnNumber: 5
	}, void 0);
};
var _jsxFileName = "/app/applet/src/routes/__root.tsx";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 21,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Página no encontrada"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 22,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "La página que buscas no existe o fue movida."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 23,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Ir al inicio"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 27,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 26,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 20,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 19,
		columnNumber: 5
	}, this);
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Esta página no se pudo cargar"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 49,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Ocurrió un error de nuestro lado. Puedes intentar de nuevo o volver al inicio."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 52,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Intentar de nuevo"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 56,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Ir al inicio"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 65,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 55,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 48,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 47,
		columnNumber: 5
	}, this);
}
var Route$26 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ORB-LITE | Rastreo GPS Satelital" },
			{
				name: "description",
				content: "Rastreo GPS satelital en tiempo real para tu vehículo o flota."
			},
			{
				name: "author",
				content: "ORB-LITE"
			},
			{
				property: "og:title",
				content: "ORB-LITE | Rastreo GPS Satelital"
			},
			{
				property: "og:description",
				content: "Rastreo GPS satelital en tiempo real para tu vehículo o flota."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,600;0,700;1,700&family=Barlow:ital,wght@0,400;0,500;0,600;1,400&display=swap"
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
		lang: "es",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeadContent, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 121,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 120,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 125,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 123,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 119,
		columnNumber: 5
	}, this);
}
function RootComponent() {
	const { queryClient } = Route$26.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "min-h-screen surface-deep",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SiteHeader, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 138,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 139,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SiteFooter, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 140,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster$1, { position: "top-center" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 141,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 137,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 135,
		columnNumber: 5
	}, this);
}
var $$splitComponentImporter$21 = () => import("./routes-Is6oBLV8.mjs");
var Route$25 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "ORB-LITE | Rastreo GPS Satelital en Tiempo Real para Autos, Flotas y Negocios" },
		{
			name: "description",
			content: "Descubre las bondades de la plataforma ORB-LITE: rastreo satelital en vivo, paro de motor remoto, optimización de rutas para Google Maps y Waze, alertas inmediatas y chip multi-carrier con 1 año de datos incluido."
		},
		{
			property: "og:title",
			content: "ORB-LITE | Rastreo GPS Satelital en Tiempo Real para Autos, Flotas y Negocios"
		},
		{
			property: "og:description",
			content: "Protege tu vehículo, optimiza la logística de tu flota y ahorra combustible con la plataforma de rastreo GPS satelital más confiable de México."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
/** Las 6 bondades clave de la plataforma ORB-LITE */
/** Segmentos de clientes parafraseados con claridad */
/** Pilares tecnológicos */
var $$splitComponentImporter$20 = () => import("./route-CRRSyPUS.mjs");
var Route$24 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		await ensureFreshSession();
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./auth-9BcZYwWu.mjs");
var Route$23 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Acceso CRM · ORB-LITE" },
		{
			name: "robots",
			content: "noindex, nofollow"
		},
		{
			name: "description",
			content: "Acceso privado al CRM de solicitudes de ORB-LITE Rastreo GPS Satelital."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./contacto-5qds8GDo.mjs");
var Route$22 = createFileRoute("/contacto")({
	head: () => ({ meta: [
		{ title: "Contacto | ORB-LITE Rastreo GPS Satelital" },
		{
			name: "description",
			content: "Solicita información y cotización de equipos GPS ORB-LITE: uso personal, flotas de empresa, negocios y precios por volumen."
		},
		{
			property: "og:title",
			content: "Contacto | ORB-LITE Rastreo GPS Satelital"
		},
		{
			property: "og:description",
			content: "Escríbenos por WhatsApp o envía tu solicitud para cotizar equipos GPS y planes de servicio."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./demo-B6A_S3qQ.mjs");
var Route$21 = createFileRoute("/demo")({
	head: () => ({ meta: [
		{ title: "Solicitar demo | Plataforma de rastreo GPS ORB-LITE" },
		{
			name: "description",
			content: "Solicita una demo gratuita de la plataforma de rastreo GPS ORB-LITE u ORB-FULL. Déjanos tus datos y te enviamos tus accesos por correo."
		},
		{
			property: "og:title",
			content: "Solicitar demo | Plataforma de rastreo GPS ORB-LITE"
		},
		{
			property: "og:description",
			content: "Prueba la plataforma de rastreo en tiempo real: llena el formulario y recibe tus accesos de demostración."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./servicios-CRl1XIY0.mjs");
var Route$20 = createFileRoute("/servicios")({
	head: () => ({ meta: [
		{ title: "Servicios de Rastreo GPS y Telemetría Satelital | ORB-LITE México" },
		{
			name: "description",
			content: "Conoce a detalle las bondades y servicios de la plataforma ORB-LITE: rastreo satelital 4G en tiempo real, apagado de motor remoto, optimización de rutas para Google Maps y Waze, historial de viajes, geocercas, reportes en Excel y conectividad multi-carrier sin recargas."
		},
		{
			property: "og:title",
			content: "Servicios de Rastreo GPS y Telemetría Satelital | ORB-LITE México"
		},
		{
			property: "og:description",
			content: "Solución telemática integral con hardware Teltonika 4G, plataforma en la nube y 1 año de datos incluido para particulares, flotas y empresas en todo México."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
/** Las 8 bondades técnicas y operativas detalladas de la plataforma */
/** Especificaciones del Hardware Teltonika FTC927 */
/** Planes y perfiles de cliente */
/** Beneficios del esquema de datos */
/** Preguntas frecuentes bien parafraseadas */
var $$splitComponentImporter$15 = () => import("./terminos-BKdo2_ER.mjs");
var Route$19 = createFileRoute("/terminos")({
	head: () => ({ meta: [
		{ title: "Uso de datos y condiciones | ORB-LITE" },
		{
			name: "description",
			content: "Conoce cómo ORB-LITE utiliza tus datos personales y las condiciones de uso de nuestros equipos y servicios de rastreo GPS."
		},
		{
			property: "og:title",
			content: "Uso de datos y condiciones | ORB-LITE"
		},
		{
			property: "og:description",
			content: "Conoce cómo ORB-LITE utiliza tus datos personales y las condiciones de uso de nuestros equipos y servicios de rastreo GPS."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./tienda-CR8dhYnG.mjs");
var Route$18 = createFileRoute("/tienda")({
	head: () => ({ meta: [
		{ title: "Tienda ORB-LITE | Kits GPS Teltonika FTC927 4G LTE" },
		{
			name: "description",
			content: "Compra kits GPS profesionales Teltonika FTC927 4G LTE, servicio completo para usuario final y renovaciones anuales de plataforma y SIM. Entrega incluida en GDL/ZMG."
		},
		{
			property: "og:title",
			content: "Tienda ORB-LITE | Kits GPS Teltonika FTC927"
		},
		{
			property: "og:description",
			content: "Kits para instaladores y flotillas, servicio llave en mano para usuario final y renovaciones anuales."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./wialon-B4EzqjBT.mjs");
var Route$17 = createFileRoute("/wialon")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./clientes-B4ldSHlG.mjs");
var Route$16 = createFileRoute("/_authenticated/clientes")({
	head: () => ({ meta: [
		{ title: "Panel de clientes · ORB-LITE" },
		{
			name: "robots",
			content: "noindex, nofollow"
		},
		{
			name: "description",
			content: "Panel interno de clientes ORB-LITE: número de cliente, primera compra, total histórico y solicitudes pendientes."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./crm-WkE8NEjf.mjs");
var Route$15 = createFileRoute("/_authenticated/crm")({
	head: () => ({ meta: [
		{ title: "CRM de solicitudes · ORB-LITE" },
		{
			name: "robots",
			content: "noindex, nofollow"
		},
		{
			name: "description",
			content: "CRM interno de ORB-LITE: solicitudes pendientes, vendidas y no vendidas."
		},
		{
			property: "og:title",
			content: "CRM de solicitudes · ORB-LITE"
		},
		{
			property: "og:description",
			content: "CRM interno de ORB-LITE para ventas, solicitudes y clientes."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./renovaciones-D4to3Ycj.mjs");
var Route$14 = createFileRoute("/_authenticated/renovaciones")({
	head: () => ({ meta: [
		{ title: "Panel de renovaciones · ORB-LITE" },
		{
			name: "robots",
			content: "noindex, nofollow"
		},
		{
			name: "description",
			content: "Panel interno de renovaciones ORB-LITE y ORB-FULL: plataforma, IMEI, ICCID, teléfono y fecha de renovación."
		},
		{
			property: "og:title",
			content: "Panel de renovaciones · ORB-LITE"
		},
		{
			property: "og:description",
			content: "Control de renovaciones mensuales y anuales de plataforma y chip."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
async function handle$2() {
	const logs = getLogs();
	return new Response(JSON.stringify(logs), { headers: { "content-type": "application/json" } });
}
var Route$13 = createFileRoute("/api/logs")({ server: { handlers: { GET: () => handle$2() } } });
var $$splitComponentImporter$9 = () => import("./wialon.index-CHq1v2B3.mjs");
var Route$12 = createFileRoute("/wialon/")({
	head: () => ({ meta: [
		{ title: "Acceso a la plataforma de rastreo | ORB-LITE" },
		{
			name: "description",
			content: "Inicia sesión de forma segura en Wialon para consultar tus unidades en vivo, historial y altas."
		},
		{
			property: "og:title",
			content: "Acceso a la plataforma de rastreo | ORB-LITE"
		},
		{
			property: "og:description",
			content: "Mapa en vivo, unidades, historial y altas de equipos en un solo panel."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./wialon.callback-CZ1nZcfv.mjs");
var Route$11 = createFileRoute("/wialon/callback")({
	head: () => ({ meta: [
		{ title: "Conectando con la plataforma | ORB-LITE" },
		{
			name: "description",
			content: "Estamos validando tu acceso a la plataforma de rastreo ORB-LITE u ORB-FULL."
		},
		{
			property: "og:title",
			content: "Conectando con la plataforma | ORB-LITE"
		},
		{
			property: "og:description",
			content: "Validación de acceso a la plataforma de rastreo ORB-LITE."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./wialon.cms-Clb94wRB.mjs");
var Route$10 = createFileRoute("/wialon/cms")({
	head: () => ({ meta: [
		{ title: "Altas de unidades y usuarios | ORB-LITE" },
		{
			name: "description",
			content: "Da de alta unidades GPS y usuarios de la plataforma."
		},
		{
			property: "og:title",
			content: "Altas de unidades y usuarios | ORB-LITE"
		},
		{
			property: "og:description",
			content: "Da de alta unidades GPS y usuarios de la plataforma."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./wialon.geocercas-1RfUHCA4.mjs");
var Route$9 = createFileRoute("/wialon/geocercas")({
	head: () => ({ meta: [
		{ title: "Geocercas | Plataforma ORB-LITE" },
		{
			name: "description",
			content: "Crea y administra geocercas en Wialon de cada cliente y visualízalas en el mapa."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./wialon.historial-2mM2BY4e.mjs");
var Route$8 = createFileRoute("/wialon/historial")({
	head: () => ({ meta: [
		{ title: "Historial y recorridos | Plataforma ORB-LITE" },
		{
			name: "description",
			content: "Consulta recorridos y mensajes por fecha de cada unidad."
		},
		{
			property: "og:title",
			content: "Historial y recorridos | Plataforma ORB-LITE"
		},
		{
			property: "og:description",
			content: "Consulta recorridos y mensajes por fecha."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./wialon.mapa-CCpyM4q_.mjs");
var Route$7 = createFileRoute("/wialon/mapa")({
	head: () => ({ meta: [
		{ title: "Mapa en vivo | Plataforma ORB-LITE" },
		{
			name: "description",
			content: "Ubicación en tiempo real de tus unidades GPS."
		},
		{
			property: "og:title",
			content: "Mapa en vivo | Plataforma ORB-LITE"
		},
		{
			property: "og:description",
			content: "Ubicación en tiempo real de tus unidades GPS."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./wialon.reportes-Cbv6Piyo.mjs");
var Route$6 = createFileRoute("/wialon/reportes")({
	head: () => ({ meta: [
		{ title: "Reportes y gráficas | Plataforma ORB-LITE" },
		{
			name: "description",
			content: "Gráficas de posición y sensores por unidad, con exportación a Excel para análisis administrativo."
		},
		{
			property: "og:title",
			content: "Reportes y gráficas | Plataforma ORB-LITE"
		},
		{
			property: "og:description",
			content: "Gráficas de posición y sensores con exportación a Excel."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./wialon.rutas-CkjW-2-c.mjs");
var Route$5 = createFileRoute("/wialon/rutas")({
	head: () => ({ meta: [
		{ title: "Rutas | Plataforma ORB-LITE" },
		{
			name: "description",
			content: "Crea rutas lineales en Wialon con puntos del mapa o direcciones escritas."
		},
		{
			property: "og:title",
			content: "Rutas | Plataforma ORB-LITE"
		},
		{
			property: "og:description",
			content: "Planifica y consulta rutas de ORB-LITE y ORB-FULL."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./wialon.unidades-BHgZs6PZ.mjs");
var Route$4 = createFileRoute("/wialon/unidades")({
	head: () => ({ meta: [
		{ title: "Unidades y estado | Plataforma ORB-LITE" },
		{
			name: "description",
			content: "Estado, velocidad y última señal de cada unidad GPS."
		},
		{
			property: "og:title",
			content: "Unidades y estado | Plataforma ORB-LITE"
		},
		{
			property: "og:description",
			content: "Estado, velocidad y última señal de cada unidad GPS."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./wialon.video-BjrYj9kw.mjs");
var Route$3 = createFileRoute("/wialon/video")({
	head: () => ({ meta: [
		{ title: "Cámaras y Video de Unidades | ORB-LITE" },
		{
			name: "description",
			content: "Consulta oficial de cámaras configuradas y sus estados mediante unit/get_video_settings."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var VENTAS = "ventas@orb-lite.com";
var REMINDER_DAYS = [
	10,
	5,
	3,
	1
];
function daysBetween(from, to) {
	const a = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
	const b = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());
	return Math.round((b - a) / 864e5);
}
async function handle$1(request) {
	const secret = processModule.env["CRON_RESUMEN_SECRET"] ?? processModule.env["LOVABLE_CRON_SECRET"];
	const provided = request.headers.get("x-cron-secret") ?? (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
	if (!secret || !provided || provided !== secret) return new Response("Unauthorized", { status: 401 });
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data, error } = await supabaseAdmin.from("renovaciones").select("*").neq("status", "baja");
	if (error) return new Response(JSON.stringify({
		ok: false,
		error: error.message
	}), {
		status: 500,
		headers: { "content-type": "application/json" }
	});
	const today = /* @__PURE__ */ new Date();
	const sent = [];
	const skipped = [];
	for (const row of data ?? []) {
		const diff = daysBetween(today, /* @__PURE__ */ new Date(`${row.renewal_date}T00:00:00Z`));
		const overdue = -diff;
		const base = {
			customerName: row.customer_name,
			customerNumber: row.customer_number,
			variantName: row.variant_name,
			platform: row.platform,
			period: row.renewal_period,
			renewalDate: row.renewal_date,
			amount: Number(row.amount ?? 0),
			unitName: row.unit_name,
			imei: row.imei,
			iccid: row.iccid,
			simPhone: row.sim_phone
		};
		let templateName = null;
		let noticeKey = "";
		let templateData = {};
		let newStatus = null;
		if (diff > 0 && REMINDER_DAYS.includes(diff)) {
			templateName = "aviso-renovacion";
			noticeKey = `prev-${row.renewal_date}-${diff}`;
			templateData = {
				...base,
				daysLeft: diff
			};
		} else if (overdue >= 60) {
			templateName = "aviso-adeudo";
			noticeKey = `baja-${row.renewal_date}`;
			templateData = {
				...base,
				stage: "baja",
				daysOverdue: overdue
			};
			newStatus = "baja";
		} else if (overdue >= 30) {
			templateName = "aviso-adeudo";
			noticeKey = `segundo-mes-${row.renewal_date}`;
			templateData = {
				...base,
				stage: "segundo-mes",
				daysOverdue: overdue
			};
			newStatus = "cancelacion";
		} else if (overdue >= 20) {
			templateName = "aviso-adeudo";
			noticeKey = `bloqueo-${row.renewal_date}`;
			templateData = {
				...base,
				stage: "bloqueo",
				daysOverdue: overdue
			};
			newStatus = "adeudo";
		}
		if (!templateName) continue;
		const notices = Array.isArray(row.notices) ? row.notices : [];
		if (notices.includes(noticeKey)) {
			skipped.push(`${row.id}:${noticeKey}`);
			continue;
		}
		const targets = [{
			to: VENTAS,
			internal: true
		}, ...row.customer_email ? [{
			to: row.customer_email,
			internal: false
		}] : []];
		for (const target of targets) try {
			await sendTemplateEmail(templateName, target.to, {
				idempotencyKey: `${templateName}-${row.id}-${noticeKey}-${target.internal ? "ventas" : "cliente"}`,
				templateData: {
					...templateData,
					isInternal: target.internal
				}
			});
			sent.push(`${target.to}:${noticeKey}`);
		} catch (err) {
			console.error("No se pudo enviar el aviso de renovación", err);
		}
		await supabaseAdmin.from("renovaciones").update({
			notices: [...notices, noticeKey],
			...newStatus ? { status: newStatus } : {}
		}).eq("id", row.id);
	}
	return new Response(JSON.stringify({
		ok: true,
		sent,
		skipped,
		reviewed: (data ?? []).length
	}), { headers: { "content-type": "application/json" } });
}
var Route$2 = createFileRoute("/api/public/cron/avisos-renovacion")({ server: { handlers: {
	POST: ({ request }) => handle$1(request),
	GET: ({ request }) => handle$1(request)
} } });
var fmt = (iso) => new Date(iso).toLocaleString("es-MX", {
	timeZone: "America/Mexico_City",
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit"
});
function summarizeItems(items) {
	if (!Array.isArray(items)) return "";
	return items.map((raw) => {
		const it = raw;
		return `${Number(it["quantity"] ?? 1)} × ${String(it["title"] ?? it["variantName"] ?? "Producto")}`;
	}).join(" · ");
}
async function handle(request) {
	const secret = processModule.env["CRON_RESUMEN_SECRET"] ?? processModule.env["LOVABLE_CRON_SECRET"];
	const provided = request.headers.get("x-cron-secret") ?? (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
	if (!secret || !provided || provided !== secret) return new Response("Unauthorized", { status: 401 });
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data, error } = await supabaseAdmin.from("solicitudes").select("order_id, customer_number, full_name, phone, email, items, shipping_label, wants_invoice, total, status, created_at").eq("status", "pendiente").order("created_at", { ascending: true });
	if (error) return new Response(JSON.stringify({
		ok: false,
		error: error.message
	}), {
		status: 500,
		headers: { "content-type": "application/json" }
	});
	const orders = (data ?? []).map((r) => ({
		orderId: r.order_id,
		createdAt: fmt(r.created_at),
		customerNumber: r.customer_number,
		fullName: r.full_name,
		phone: r.phone,
		email: r.email,
		total: Number(r.total ?? 0),
		shippingLabel: r.shipping_label,
		wantsInvoice: r.wants_invoice,
		itemsSummary: summarizeItems(r.items),
		status: r.status
	}));
	const totalPending = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);
	const now = /* @__PURE__ */ new Date();
	const dateKey = now.toISOString().slice(0, 10);
	const panelToken = processModule.env["ADMIN_PANEL_TOKEN"];
	const siteUrl = processModule.env["PUBLIC_SITE_URL"] ?? "https://orb-lite.com";
	const panelUrl = panelToken ? `${siteUrl}/panel/${panelToken}` : "";
	const result = await sendTemplateEmail("resumen-pendientes", "ventas@orb-lite.com", {
		idempotencyKey: `resumen-pendientes-${dateKey}-${now.getUTCHours()}`,
		templateData: {
			panelUrl,
			date: now.toLocaleDateString("es-MX", {
				timeZone: "America/Mexico_City",
				dateStyle: "full"
			}),
			count: orders.length,
			totalPending,
			orders
		}
	});
	return new Response(JSON.stringify({
		ok: true,
		count: orders.length,
		...result
	}), { headers: { "content-type": "application/json" } });
}
var Route$1 = createFileRoute("/api/public/cron/resumen-pendientes")({ server: { handlers: {
	POST: async ({ request }) => handle(request),
	GET: async ({ request }) => handle(request)
} } });
var Route = createFileRoute("/lovable/email/transactional/preview")({ server: { handlers: { POST: async ({ request }) => {
	const apiKey = processModule.env["LOVABLE_API_KEY"];
	if (!apiKey) return Response.json({ error: "Server configuration error" }, { status: 500 });
	if (request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") !== apiKey) return Response.json({ error: "Unauthorized" }, { status: 401 });
	const templateNames = Object.keys(TEMPLATES);
	const results = [];
	for (const name of templateNames) {
		const entry = TEMPLATES[name];
		if (!entry) continue;
		const displayName = entry.displayName || name;
		if (!entry.previewData) {
			results.push({
				templateName: name,
				displayName,
				subject: "",
				html: "",
				status: "preview_data_required"
			});
			continue;
		}
		try {
			const html = await render(import_react.createElement(entry.component, entry.previewData));
			const resolvedSubject = typeof entry.subject === "function" ? entry.subject(entry.previewData) : entry.subject;
			results.push({
				templateName: name,
				displayName,
				subject: resolvedSubject,
				html,
				status: "ready"
			});
		} catch (err) {
			console.error("Failed to render template for preview", {
				template: name,
				error: err
			});
			results.push({
				templateName: name,
				displayName,
				subject: "",
				html: "",
				status: "render_failed",
				errorMessage: err instanceof Error ? err.message : String(err)
			});
		}
	}
	return Response.json({ templates: results });
} } } });
var IndexRoute = Route$25.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$26
});
var AuthenticatedRouteRoute = Route$24.update({
	id: "/_authenticated",
	getParentRoute: () => Route$26
});
var AccesoCrmRoute = Route$27.update({
	id: "/acceso-crm",
	path: "/acceso-crm",
	getParentRoute: () => Route$26
});
var AuthRoute = Route$23.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$26
});
var ContactoRoute = Route$22.update({
	id: "/contacto",
	path: "/contacto",
	getParentRoute: () => Route$26
});
var DemoRoute = Route$21.update({
	id: "/demo",
	path: "/demo",
	getParentRoute: () => Route$26
});
var ServiciosRoute = Route$20.update({
	id: "/servicios",
	path: "/servicios",
	getParentRoute: () => Route$26
});
var TerminosRoute = Route$19.update({
	id: "/terminos",
	path: "/terminos",
	getParentRoute: () => Route$26
});
var TiendaRoute = Route$18.update({
	id: "/tienda",
	path: "/tienda",
	getParentRoute: () => Route$26
});
var WialonRoute = Route$17.update({
	id: "/wialon",
	path: "/wialon",
	getParentRoute: () => Route$26
});
var AuthenticatedClientesRoute = Route$16.update({
	id: "/clientes",
	path: "/clientes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCrmRoute = Route$15.update({
	id: "/crm",
	path: "/crm",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRenovacionesRoute = Route$14.update({
	id: "/renovaciones",
	path: "/renovaciones",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiLogsRoute = Route$13.update({
	id: "/api/logs",
	path: "/api/logs",
	getParentRoute: () => Route$26
});
var PanelTokenRoute = Route$28.update({
	id: "/panel/$token",
	path: "/panel/$token",
	getParentRoute: () => Route$26
});
var RutaTokenRoute = Route$29.update({
	id: "/ruta/$token",
	path: "/ruta/$token",
	getParentRoute: () => Route$26
});
var WialonIndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => WialonRoute
});
var WialonCallbackRoute = Route$11.update({
	id: "/callback",
	path: "/callback",
	getParentRoute: () => WialonRoute
});
var WialonCmsRoute = Route$10.update({
	id: "/cms",
	path: "/cms",
	getParentRoute: () => WialonRoute
});
var WialonGeocercasRoute = Route$9.update({
	id: "/geocercas",
	path: "/geocercas",
	getParentRoute: () => WialonRoute
});
var WialonHistorialRoute = Route$8.update({
	id: "/historial",
	path: "/historial",
	getParentRoute: () => WialonRoute
});
var WialonMapaRoute = Route$7.update({
	id: "/mapa",
	path: "/mapa",
	getParentRoute: () => WialonRoute
});
var WialonReportesRoute = Route$6.update({
	id: "/reportes",
	path: "/reportes",
	getParentRoute: () => WialonRoute
});
var WialonRutasRoute = Route$5.update({
	id: "/rutas",
	path: "/rutas",
	getParentRoute: () => WialonRoute
});
var WialonUnidadesRoute = Route$4.update({
	id: "/unidades",
	path: "/unidades",
	getParentRoute: () => WialonRoute
});
var WialonVideoRoute = Route$3.update({
	id: "/video",
	path: "/video",
	getParentRoute: () => WialonRoute
});
var ApiPublicCronAvisosRenovacionRoute = Route$2.update({
	id: "/api/public/cron/avisos-renovacion",
	path: "/api/public/cron/avisos-renovacion",
	getParentRoute: () => Route$26
});
var ApiPublicCronResumenPendientesRoute = Route$1.update({
	id: "/api/public/cron/resumen-pendientes",
	path: "/api/public/cron/resumen-pendientes",
	getParentRoute: () => Route$26
});
var LovableEmailTransactionalPreviewRoute = Route.update({
	id: "/lovable/email/transactional/preview",
	path: "/lovable/email/transactional/preview",
	getParentRoute: () => Route$26
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedClientesRoute,
	AuthenticatedCrmRoute,
	AuthenticatedRenovacionesRoute
};
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var WialonRouteChildren = {
	WialonCallbackRoute,
	WialonCmsRoute,
	WialonGeocercasRoute,
	WialonHistorialRoute,
	WialonMapaRoute,
	WialonReportesRoute,
	WialonRutasRoute,
	WialonUnidadesRoute,
	WialonVideoRoute,
	WialonIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	AccesoCrmRoute,
	AuthRoute,
	ContactoRoute,
	DemoRoute,
	ServiciosRoute,
	TerminosRoute,
	TiendaRoute,
	WialonRoute: WialonRoute._addFileChildren(WialonRouteChildren),
	ApiLogsRoute,
	PanelTokenRoute,
	RutaTokenRoute,
	ApiPublicCronAvisosRenovacionRoute,
	ApiPublicCronResumenPendientesRoute,
	LovableEmailTransactionalPreviewRoute
};
var routeTree = Route$26._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
