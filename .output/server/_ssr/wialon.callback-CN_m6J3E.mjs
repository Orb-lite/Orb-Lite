import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { o as writeSession } from "./wialon-session-C7Oq2mAo.mjs";
import { d as wialonLogin } from "./wialon.functions-CrsvbLcr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.callback-CN_m6J3E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function readParams() {
	const search = new URLSearchParams(window.location.search);
	const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
	return {
		token: search.get("access_token") ?? hash.get("access_token") ?? search.get("token") ?? hash.get("token") ?? search.get("eid") ?? hash.get("eid"),
		host: window.sessionStorage.getItem("orblite.wialon.oauth-host") === "full" ? "full" : "lite"
	};
}
function WialonCallbackPage() {
	const login = useServerFn(wialonLogin);
	const navigate = useNavigate();
	const [error, setError] = import_react.useState(null);
	import_react.useEffect(() => {
		let cancelled = false;
		async function run() {
			const { token, host } = readParams();
			if (!token) {
				setError("La plataforma no devolvió un acceso válido. Intenta entrar de nuevo.");
				return;
			}
			try {
				const result = await login({ data: {
					host,
					token
				} });
				if (cancelled) return;
				writeSession(result);
				navigate({ to: "/wialon/mapa" });
			} catch (err) {
				if (!cancelled) setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
			}
		}
		run();
		return () => {
			cancelled = true;
		};
	}, [login, navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md rounded-lg border border-border/60 p-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-xl font-bold uppercase tracking-wide",
				children: error ? "No pudimos entrar" : "Conectando…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: error ?? "Estamos validando tu acceso con la plataforma."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void navigate({ to: "/wialon" }),
				className: "mt-5 rounded-md bg-primary px-4 py-2 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground",
				children: "Volver a intentar"
			}) : null
		]
	});
}
//#endregion
export { WialonCallbackPage as component };
