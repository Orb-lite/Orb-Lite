import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { A as MapPin, E as MessageCircle, X as Clock, j as Mail, x as Phone } from "../_libs/lucide-react.mjs";
import { t as openWhatsApp } from "./whatsapp-k5-h86dD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contacto-5qds8GDo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/contacto.tsx?tsr-split=component";
var WHATSAPP = "523318359421";
var TEL = "3318359421";
var EMAIL = "ventas@orb-lite.com";
function Contacto() {
	const [nombre, setNombre] = (0, import_react.useState)("");
	const [negocio, setNegocio] = (0, import_react.useState)("");
	const [telefono, setTelefono] = (0, import_react.useState)("");
	const [cantidad, setCantidad] = (0, import_react.useState)("");
	const [mensaje, setMensaje] = (0, import_react.useState)("");
	const texto = `Hola, soy ${nombre || "(nombre)"}${negocio ? ` de ${negocio}` : ""}. Tel: ${telefono || "(teléfono)"}. Equipos estimados: ${cantidad || "(cantidad)"}. ${mensaje}`;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "mx-auto max-w-6xl px-5 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "font-display text-sm uppercase tracking-[0.3em] text-primary",
				children: "Solicita información hoy"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 16,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "mt-3 font-display text-4xl font-bold uppercase italic sm:text-5xl",
				children: ["Cotiza tu ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-gradient-lime",
					children: "rastreo GPS"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 20,
					columnNumber: 21
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 19,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-4 max-w-2xl text-lg text-muted-foreground",
				children: [
					"Déjanos tus datos y te compartimos paquetes, planes de servicio y condiciones por volumen, ya sea para un vehículo, para las unidades de tu empresa o para tu negocio. Renovación anual: plataforma ",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-bold text-primary",
						children: "$160/año"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 25,
						columnNumber: 29
					}, this),
					" y SIM",
					" ",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-bold text-primary",
						children: "$590/año"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 26,
						columnNumber: 11
					}, this),
					" (IVA incluido)."
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 22,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 15,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "mx-auto grid max-w-6xl gap-8 px-5 pb-20 lg:grid-cols-[1.2fr_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
			className: "rounded-2xl border border-border/70 bg-card/50 p-7",
			onSubmit: (e) => {
				e.preventDefault();
				openWhatsApp(texto, WHATSAPP);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid gap-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-display uppercase tracking-wide",
							children: "Nombre"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 37,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							required: true,
							value: nombre,
							onChange: (e) => setNombre(e.target.value),
							className: "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary",
							placeholder: "Tu nombre completo"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 38,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 36,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-display uppercase tracking-wide",
							children: "Teléfono"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 41,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							required: true,
							value: telefono,
							onChange: (e) => setTelefono(e.target.value),
							className: "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary",
							placeholder: "10 dígitos"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 42,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 40,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 35,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-5 grid gap-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-display uppercase tracking-wide",
							children: "Empresa o negocio (opcional)"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 48,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							value: negocio,
							onChange: (e) => setNegocio(e.target.value),
							className: "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary",
							placeholder: "Si aplica"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 51,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 47,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-display uppercase tracking-wide",
							children: "Cantidad estimada"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 54,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							value: cantidad,
							onChange: (e) => setCantidad(e.target.value),
							className: "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary",
							placeholder: "Ej. 1, 5, 20 equipos"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 55,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 53,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 46,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
					className: "mt-5 block text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-display uppercase tracking-wide",
						children: "Mensaje"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 60,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
						rows: 4,
						value: mensaje,
						onChange: (e) => setMensaje(e.target.value),
						className: "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary",
						placeholder: "Cuéntanos qué necesitas: rastreo para tu auto, control de flota, instalación, condiciones por volumen, etc."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 61,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 59,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "submit",
					className: "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground",
					style: { background: "var(--gradient-lime)" },
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 67,
						columnNumber: 13
					}, this), "Enviar por WhatsApp"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 64,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: "Al enviar se abrirá WhatsApp con tus datos listos para mandar."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 70,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 31,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
			className: "space-y-4",
			children: [
				{
					icon: Phone,
					title: "Teléfono",
					text: TEL,
					href: `tel:+52${TEL}`
				},
				{
					icon: MessageCircle,
					title: "WhatsApp",
					text: TEL,
					href: `https://api.whatsapp.com/send?phone=${WHATSAPP}`
				},
				{
					icon: Mail,
					title: "Correo",
					text: EMAIL,
					href: `mailto:${EMAIL}`
				},
				{
					icon: MapPin,
					title: "Cobertura",
					text: "Todo el territorio nacional",
					href: null
				},
				{
					icon: Clock,
					title: "Horario",
					text: "Lunes a sábado, 9:00 a 19:00 h",
					href: null
				}
			].map(({ icon: Icon, title, text, href }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex gap-4 rounded-xl border border-border/70 bg-card/50 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "mt-1 h-5 w-5 shrink-0 text-primary" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 107,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "font-display text-sm font-bold uppercase tracking-wide",
					children: title
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 109,
					columnNumber: 17
				}, this), href ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
					href,
					className: "text-muted-foreground hover:text-primary",
					children: text
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 110,
					columnNumber: 25
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-muted-foreground",
					children: text
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 112,
					columnNumber: 26
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 108,
					columnNumber: 15
				}, this)]
			}, title, true, {
				fileName: _jsxFileName,
				lineNumber: 106,
				columnNumber: 15
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 75,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 30,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 14,
		columnNumber: 10
	}, this);
}
//#endregion
export { Contacto as component };
