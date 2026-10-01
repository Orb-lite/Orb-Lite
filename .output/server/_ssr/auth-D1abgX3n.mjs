import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as supabase } from "./client-DdsPy57x.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as ensureFreshSession } from "./crm-session-MCvBldvh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-D1abgX3n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const navigate = useNavigate();
	const [email, setEmail] = import_react.useState("");
	const [password, setPassword] = import_react.useState("");
	const [error, setError] = import_react.useState(null);
	const [loading, setLoading] = import_react.useState(false);
	import_react.useEffect(() => {
		ensureFreshSession();
	}, []);
	async function onSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		setLoading(false);
		if (signInError) {
			setError("Correo o contraseña incorrectos.");
			return;
		}
		navigate({
			to: "/crm",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-screen items-center justify-center bg-background px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			autoComplete: "off",
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
							children: "Acceso al CRM"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Panel interno de solicitudes."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "email",
						children: "Correo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "email",
						name: "crm-usuario",
						type: "email",
						autoComplete: "off",
						autoCorrect: "off",
						spellCheck: false,
						placeholder: "ventas@orb-lite.com",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "password",
						children: "Contraseña"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "password",
						name: "crm-clave",
						type: "password",
						autoComplete: "new-password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						required: true
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-destructive",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: loading,
					children: loading ? "Entrando…" : "Entrar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					className: "w-full",
					onClick: () => navigate({
						to: "/acceso-crm",
						search: { olvide: false }
					}),
					children: "Crear contraseña"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					className: "w-full",
					onClick: () => navigate({
						to: "/acceso-crm",
						search: { olvide: true }
					}),
					children: "Olvidé mi contraseña"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "¿Primera vez o olvidaste tu contraseña? Pide un código de un solo uso y llegará a ventas@orb-lite.com para crear una nueva."
				})
			]
		})
	});
}
//#endregion
export { AuthPage as component };
