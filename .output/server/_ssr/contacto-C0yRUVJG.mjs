import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as MessageCircle, F as Mail, P as MapPin, T as Phone, at as Clock } from "../_libs/lucide-react.mjs";
import { t as openWhatsApp } from "./whatsapp-k5-h86dD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contacto-C0yRUVJG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-5 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-sm uppercase tracking-[0.3em] text-primary",
				children: "Solicita información hoy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-3 font-display text-4xl font-bold uppercase italic sm:text-5xl",
				children: ["Cotiza tu ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-gradient-lime",
					children: "rastreo GPS"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 max-w-2xl text-lg text-muted-foreground",
				children: [
					"Déjanos tus datos y te compartimos paquetes, planes de servicio y condiciones por volumen, ya sea para un vehículo, para las unidades de tu empresa o para tu negocio. Renovación anual: plataforma ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-primary",
						children: "$160/año"
					}),
					" y SIM",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-primary",
						children: "$590/año"
					}),
					" (IVA incluido)."
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-6xl gap-8 px-5 pb-20 lg:grid-cols-[1.2fr_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "rounded-2xl border border-border/70 bg-card/50 p-7",
			onSubmit: (e) => {
				e.preventDefault();
				openWhatsApp(texto, WHATSAPP);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display uppercase tracking-wide",
							children: "Nombre"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							value: nombre,
							onChange: (e) => setNombre(e.target.value),
							className: "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary",
							placeholder: "Tu nombre completo"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display uppercase tracking-wide",
							children: "Teléfono"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							value: telefono,
							onChange: (e) => setTelefono(e.target.value),
							className: "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary",
							placeholder: "10 dígitos"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display uppercase tracking-wide",
							children: "Empresa o negocio (opcional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: negocio,
							onChange: (e) => setNegocio(e.target.value),
							className: "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary",
							placeholder: "Si aplica"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display uppercase tracking-wide",
							children: "Cantidad estimada"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: cantidad,
							onChange: (e) => setCantidad(e.target.value),
							className: "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary",
							placeholder: "Ej. 1, 5, 20 equipos"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-5 block text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display uppercase tracking-wide",
						children: "Mensaje"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 4,
						value: mensaje,
						onChange: (e) => setMensaje(e.target.value),
						className: "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary",
						placeholder: "Cuéntanos qué necesitas: rastreo para tu auto, control de flota, instalación, condiciones por volumen, etc."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					className: "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground",
					style: { background: "var(--gradient-lime)" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), "Enviar por WhatsApp"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: "Al enviar se abrirá WhatsApp con tus datos listos para mandar."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
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
			].map(({ icon: Icon, title, text, href }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4 rounded-xl border border-border/70 bg-card/50 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mt-1 h-5 w-5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-sm font-bold uppercase tracking-wide",
					children: title
				}), href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href,
					className: "text-muted-foreground hover:text-primary",
					children: text
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: text
				})] })]
			}, title))
		})]
	})] });
}
//#endregion
export { Contacto as component };
