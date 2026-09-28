import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C_8gbn0n.mjs";
import { i as literalType, o as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { X as Clock, d as ShieldCheck, et as CircleCheck, w as MonitorSmartphone } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/demo-B6A_S3qQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
/** Solicitud pública de demo — se guarda para revisarla en el CRM. No envía correo al cliente. */
var createDemoRequest = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	firstName: stringType().trim().min(2).max(80),
	lastName: stringType().trim().min(2).max(80),
	phone: stringType().trim().min(8).max(25),
	email: stringType().trim().email().max(200),
	company: stringType().trim().max(150).optional().or(literalType("")),
	platform: enumType(["wialon_lite", "wialon_full"]).default("wialon_lite"),
	units: stringType().trim().max(30).optional().or(literalType("")),
	message: stringType().trim().max(1e3).optional().or(literalType(""))
}).parse(data)).handler(createSsrRpc("618788924f8338c298f7afde349474273ad890daa439707988b4ae20dda43a27"));
var _jsxFileName = "/app/applet/src/routes/demo.tsx?tsr-split=component";
var PLATFORMS = [{
	id: "wialon_lite",
	label: "ORB-LITE",
	text: "Rastreo esencial en tiempo real"
}, {
	id: "wialon_full",
	label: "ORB-FULL",
	text: "Reportes y control avanzado de flota"
}];
function DemoPage() {
	const submit = useServerFn(createDemoRequest);
	const [firstName, setFirstName] = import_react.useState("");
	const [lastName, setLastName] = import_react.useState("");
	const [phone, setPhone] = import_react.useState("");
	const [email, setEmail] = import_react.useState("");
	const [company, setCompany] = import_react.useState("");
	const [units, setUnits] = import_react.useState("");
	const [message, setMessage] = import_react.useState("");
	const [platform, setPlatform] = import_react.useState("wialon_lite");
	const [sending, setSending] = import_react.useState(false);
	const [done, setDone] = import_react.useState(false);
	const [error, setError] = import_react.useState(null);
	const inputClass = "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary";
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setSending(true);
		try {
			await submit({ data: {
				firstName,
				lastName,
				phone,
				email,
				company,
				units,
				message,
				platform
			} });
			setDone(true);
		} catch (err) {
			setError(err instanceof Error ? "No pudimos registrar tu solicitud. Revisa tus datos e inténtalo de nuevo." : "Ocurrió un error inesperado.");
		} finally {
			setSending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "mx-auto max-w-6xl px-5 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "font-display text-sm uppercase tracking-[0.3em] text-primary",
				children: "Prueba sin costo"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 54,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "mt-3 font-display text-4xl font-bold uppercase italic sm:text-5xl",
				children: ["Solicita tu ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-gradient-lime",
					children: "demo"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 58,
					columnNumber: 23
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 57,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-4 max-w-2xl text-lg text-muted-foreground",
				children: "Déjanos tus datos y te asignamos un acceso de demostración a la plataforma de rastreo. Recibirás tu usuario y contraseña por correo, junto con los enlaces de acceso web y de la app móvil."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 60,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 53,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "mx-auto grid max-w-6xl gap-8 px-5 pb-20 lg:grid-cols-[1.2fr_1fr]",
		children: [done ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "rounded-2xl border border-primary/50 bg-card/60 p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-10 w-10 text-primary" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 69,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-4 font-display text-2xl font-bold uppercase italic",
					children: "Solicitud recibida"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 70,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-3 text-muted-foreground",
					children: [
						"Ya tenemos tu solicitud. Nuestro equipo prepara tu acceso de demostración y te envía el usuario y la contraseña al correo ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
							className: "text-primary",
							children: email
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 75,
							columnNumber: 52
						}, this),
						". Normalmente respondemos el mismo día hábil."
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 73,
					columnNumber: 13
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 68,
			columnNumber: 17
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
			className: "rounded-2xl border border-border/70 bg-card/50 p-7",
			onSubmit,
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid gap-5 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-display uppercase tracking-wide",
								children: "Nombre(s)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 81,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								required: true,
								maxLength: 80,
								value: firstName,
								onChange: (e) => setFirstName(e.target.value),
								className: inputClass,
								placeholder: "Emiliano"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 82,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 80,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-display uppercase tracking-wide",
								children: "Apellidos"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 85,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								required: true,
								maxLength: 80,
								value: lastName,
								onChange: (e) => setLastName(e.target.value),
								className: inputClass,
								placeholder: "Gómez Estrada"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 86,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 84,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-display uppercase tracking-wide",
								children: "Teléfono"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 89,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								required: true,
								inputMode: "tel",
								maxLength: 25,
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								className: inputClass,
								placeholder: "10 dígitos"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 90,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-display uppercase tracking-wide",
								children: "Correo electrónico"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 93,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								required: true,
								type: "email",
								maxLength: 200,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: inputClass,
								placeholder: "tucorreo@dominio.com"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 94,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 92,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-display uppercase tracking-wide",
								children: "Empresa o negocio (opcional)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 97,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								maxLength: 150,
								value: company,
								onChange: (e) => setCompany(e.target.value),
								className: inputClass,
								placeholder: "Transportes ABC"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 100,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 96,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-display uppercase tracking-wide",
								children: "Unidades a rastrear (opcional)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 103,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								maxLength: 30,
								value: units,
								onChange: (e) => setUnits(e.target.value),
								className: inputClass,
								placeholder: "1, 5, 20…"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 106,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 102,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 79,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("fieldset", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("legend", {
						className: "font-display text-sm uppercase tracking-wide",
						children: "Plataforma que quieres probar"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 111,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => setPlatform(p.id),
							className: `rounded-lg border px-4 py-3 text-left ${platform === p.id ? "border-primary bg-primary/10" : "border-border/70 bg-background"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-display font-bold uppercase tracking-wide text-primary",
								children: p.label
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 116,
								columnNumber: 21
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "mt-1 block text-xs text-muted-foreground",
								children: p.text
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 119,
								columnNumber: 21
							}, this)]
						}, p.id, true, {
							fileName: _jsxFileName,
							lineNumber: 115,
							columnNumber: 37
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 114,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 110,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
					className: "mt-6 block text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-display uppercase tracking-wide",
						children: "Mensaje (opcional)"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 125,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
						rows: 4,
						maxLength: 1e3,
						value: message,
						onChange: (e) => setMessage(e.target.value),
						className: inputClass,
						placeholder: "Cuéntanos qué necesitas rastrear"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 126,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 124,
					columnNumber: 13
				}, this),
				error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-4 text-sm text-destructive",
					children: error
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 129,
					columnNumber: 22
				}, this) : null,
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "submit",
					disabled: sending,
					className: "mt-6 w-full rounded-md px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-60",
					style: { background: "var(--gradient-lime)" },
					children: sending ? "Enviando…" : "Solicitar demo"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 131,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: "Usamos tus datos solo para preparar y darte seguimiento a tu demo."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 136,
					columnNumber: 13
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 78,
			columnNumber: 20
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
			className: "space-y-4",
			children: [
				{
					icon: MonitorSmartphone,
					title: "Acceso web y app",
					text: "Plataforma en navegador y app móvil para iOS, Android y AppGallery."
				},
				{
					icon: Clock,
					title: "Respuesta el mismo día",
					text: "Revisamos cada solicitud y enviamos tus claves de demostración por correo."
				},
				{
					icon: ShieldCheck,
					title: "Sin compromiso",
					text: "Prueba la plataforma antes de contratar equipos o planes de servicio."
				}
			].map(({ icon: Icon, title, text }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
				className: "rounded-xl border border-border/70 bg-card/50 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-7 w-7 text-primary" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 159,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "mt-3 font-display font-bold uppercase tracking-wide",
						children: title
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 160,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: text
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 161,
						columnNumber: 15
					}, this)
				]
			}, title, true, {
				fileName: _jsxFileName,
				lineNumber: 158,
				columnNumber: 15
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 141,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 67,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 52,
		columnNumber: 10
	}, this);
}
//#endregion
export { DemoPage as component };
