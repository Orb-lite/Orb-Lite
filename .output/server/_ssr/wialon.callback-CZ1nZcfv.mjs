import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { o as writeSession } from "./wialon-session-C7Oq2mAo.mjs";
import { d as wialonLogin } from "./wialon.functions-B5LcdM8M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.callback-CZ1nZcfv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/wialon.callback.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mx-auto max-w-md rounded-lg border border-border/60 p-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "font-display text-xl font-bold uppercase tracking-wide",
				children: error ? "No pudimos entrar" : "Conectando…"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 59,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: error ?? "Estamos validando tu acceso con la plataforma."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 62,
				columnNumber: 7
			}, this),
			error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				type: "button",
				onClick: () => void navigate({ to: "/wialon" }),
				className: "mt-5 rounded-md bg-primary px-4 py-2 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground",
				children: "Volver a intentar"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 65,
				columnNumber: 16
			}, this) : null
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 58,
		columnNumber: 10
	}, this);
}
//#endregion
export { WialonCallbackPage as component };
