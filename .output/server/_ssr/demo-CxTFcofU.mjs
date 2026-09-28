import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DqD-MaFI.mjs";
import { i as literalType, o as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { X as Clock, d as ShieldCheck, et as CircleCheck, w as MonitorSmartphone } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/demo-CxTFcofU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-5 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-sm uppercase tracking-[0.3em] text-primary",
				children: "Prueba sin costo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-3 font-display text-4xl font-bold uppercase italic sm:text-5xl",
				children: ["Solicita tu ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-gradient-lime",
					children: "demo"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-lg text-muted-foreground",
				children: "Déjanos tus datos y te asignamos un acceso de demostración a la plataforma de rastreo. Recibirás tu usuario y contraseña por correo, junto con los enlaces de acceso web y de la app móvil."
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-6xl gap-8 px-5 pb-20 lg:grid-cols-[1.2fr_1fr]",
		children: [done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-primary/50 bg-card/60 p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-10 w-10 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-2xl font-bold uppercase italic",
					children: "Solicitud recibida"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-muted-foreground",
					children: [
						"Ya tenemos tu solicitud. Nuestro equipo prepara tu acceso de demostración y te envía el usuario y la contraseña al correo ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-primary",
							children: email
						}),
						". Normalmente respondemos el mismo día hábil."
					]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "rounded-2xl border border-border/70 bg-card/50 p-7",
			onSubmit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display uppercase tracking-wide",
								children: "Nombre(s)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								maxLength: 80,
								value: firstName,
								onChange: (e) => setFirstName(e.target.value),
								className: inputClass,
								placeholder: "Emiliano"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display uppercase tracking-wide",
								children: "Apellidos"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								maxLength: 80,
								value: lastName,
								onChange: (e) => setLastName(e.target.value),
								className: inputClass,
								placeholder: "Gómez Estrada"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display uppercase tracking-wide",
								children: "Teléfono"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								inputMode: "tel",
								maxLength: 25,
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								className: inputClass,
								placeholder: "10 dígitos"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display uppercase tracking-wide",
								children: "Correo electrónico"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "email",
								maxLength: 200,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: inputClass,
								placeholder: "tucorreo@dominio.com"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display uppercase tracking-wide",
								children: "Empresa o negocio (opcional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								maxLength: 150,
								value: company,
								onChange: (e) => setCompany(e.target.value),
								className: inputClass,
								placeholder: "Transportes ABC"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display uppercase tracking-wide",
								children: "Unidades a rastrear (opcional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								maxLength: 30,
								value: units,
								onChange: (e) => setUnits(e.target.value),
								className: inputClass,
								placeholder: "1, 5, 20…"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "font-display text-sm uppercase tracking-wide",
						children: "Plataforma que quieres probar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setPlatform(p.id),
							className: `rounded-lg border px-4 py-3 text-left ${platform === p.id ? "border-primary bg-primary/10" : "border-border/70 bg-background"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display font-bold uppercase tracking-wide text-primary",
								children: p.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs text-muted-foreground",
								children: p.text
							})]
						}, p.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-6 block text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display uppercase tracking-wide",
						children: "Mensaje (opcional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 4,
						maxLength: 1e3,
						value: message,
						onChange: (e) => setMessage(e.target.value),
						className: inputClass,
						placeholder: "Cuéntanos qué necesitas rastrear"
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-destructive",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: sending,
					className: "mt-6 w-full rounded-md px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-60",
					style: { background: "var(--gradient-lime)" },
					children: sending ? "Enviando…" : "Solicitar demo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: "Usamos tus datos solo para preparar y darte seguimiento a tu demo."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
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
			].map(({ icon: Icon, title, text }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl border border-border/70 bg-card/50 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-7 w-7 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display font-bold uppercase tracking-wide",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: text
					})
				]
			}, title))
		})]
	})] });
}
//#endregion
export { DemoPage as component };
