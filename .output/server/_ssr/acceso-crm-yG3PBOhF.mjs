import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DBzhw_Ly.mjs";
import { t as supabase } from "./client-DdsPy57x.mjs";
import { t as Route } from "./acceso-crm-CvDq4TY-.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { l as stringType, s as objectType } from "../_libs/zod.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/acceso-crm-yG3PBOhF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Lógica compartida para solicitar un código.
*/
var requestCrmAccessCode = createServerFn({ method: "POST" }).handler(createSsrRpc("8d67c31c490e062f5e67e0aab136b7a2e6c20f0c45aace7b03232eb57e32ed20"));
createServerFn({ method: "GET" }).handler(createSsrRpc("913c9d39d7718198d1fe3b1a99bafcedc2964d3eb11f99f010451fd6eecfd8f7"));
/** Valida el código de un solo uso y define la contraseña del CRM. */
var redeemCrmAccessCode = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	code: stringType().trim().regex(/^\d{6}$/),
	password: stringType().min(8).max(72)
}).parse(data)).handler(createSsrRpc("ccd89f6097645989bcca7fb9ab8b89542b6ba273fd32e6aba42dc6037eb8b23a"));
function AccesoCrmPage() {
	const navigate = useNavigate();
	const { olvide } = Route.useSearch();
	const request = useServerFn(requestCrmAccessCode);
	const redeem = useServerFn(redeemCrmAccessCode);
	const [code, setCode] = import_react.useState("");
	const [password, setPassword] = import_react.useState("");
	const [confirm, setConfirm] = import_react.useState("");
	const [sending, setSending] = import_react.useState(false);
	const [saving, setSaving] = import_react.useState(false);
	const autoSent = import_react.useRef(false);
	import_react.useEffect(() => {
		if (olvide && !autoSent.current) {
			autoSent.current = true;
			sendCode();
		}
	}, [olvide]);
	async function sendCode() {
		setSending(true);
		try {
			if ((await request()).ok) toast.success("Código enviado a ventas@orb-lite.com");
			else toast.error("Espera un minuto antes de pedir otro código");
		} catch (e) {
			console.error("Error al enviar código:", e);
			toast.error(`No se pudo enviar el código: ${e instanceof Error ? e.message : "Error desconocido"}`);
		}
		setSending(false);
	}
	async function onSubmit(e) {
		e.preventDefault();
		if (password !== confirm) {
			toast.error("Las contraseñas no coinciden");
			return;
		}
		setSaving(true);
		try {
			await redeem({ data: {
				code: code.trim(),
				password
			} });
			await supabase.auth.signInWithPassword({
				email: "ventas@orb-lite.com",
				password
			});
			toast.success("Contraseña creada. Entrando al CRM…");
			navigate({
				to: "/crm",
				replace: true
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Código inválido o vencido");
		}
		setSaving(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-screen items-center justify-center bg-background px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.2em] text-primary",
							children: "ORB-LITE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl text-foreground",
							children: olvide ? "Restablecer contraseña" : "Crear contraseña del CRM"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: olvide ? "Ya te enviamos un código de un solo uso a ventas@orb-lite.com para restablecer tu contraseña." : "Te enviamos un código de un solo uso a ventas@orb-lite.com."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					className: "w-full",
					onClick: sendCode,
					disabled: sending,
					children: sending ? "Enviando…" : olvide ? "Reenviar el código por correo" : "Enviarme el código por correo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "code",
						children: "Código de 6 dígitos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "code",
						inputMode: "numeric",
						maxLength: 6,
						value: code,
						onChange: (e) => setCode(e.target.value.replace(/\D/g, "")),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "password",
						children: "Nueva contraseña"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "password",
						type: "password",
						autoComplete: "new-password",
						minLength: 8,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "confirm",
						children: "Confirmar contraseña"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "confirm",
						type: "password",
						autoComplete: "new-password",
						minLength: 8,
						value: confirm,
						onChange: (e) => setConfirm(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: saving,
					children: saving ? "Guardando…" : olvide ? "Restablecer contraseña y entrar" : "Crear contraseña y entrar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					className: "w-full",
					onClick: () => navigate({ to: "/auth" }),
					children: "Volver a iniciar sesión"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "El código vence en 20 minutos y solo funciona una vez."
				})
			]
		})
	});
}
//#endregion
export { AccesoCrmPage as component };
