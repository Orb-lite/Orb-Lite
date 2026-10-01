import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { o as writeSession } from "./wialon-session-C7Oq2mAo.mjs";
import { d as wialonLogin } from "./wialon.functions-Cw4L-t5R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.callback-Dw2mjCSh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/wialon.callback.tsx?tsr-split=component";
function readParams() {
	if (typeof window === "undefined") return {
		token: null,
		host: "lite"
	};
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
				localStorage.setItem("wialon_token", token);
				navigate({ to: "/wialon/mapa" });
			} catch (err) {
				if (!cancelled) setError(err instanceof Error ? err.message : "No se pudo iniciar sesión en la plataforma Wialon.");
			}
		}
		run();
		return () => {
			cancelled = true;
		};
	}, [login, navigate]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-[60vh] flex-col items-center justify-center p-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto max-w-md rounded-xl border border-border/60 bg-card p-8 shadow-sm",
			children: error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "font-display text-xl font-bold uppercase tracking-wide text-destructive",
					children: "Error de conexión"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 72,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: error
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 75,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => void navigate({ to: "/wialon" }),
					className: "mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90",
					children: "Volver a intentar"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 76,
					columnNumber: 13
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 71,
				columnNumber: 18
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 82,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "mt-4 font-display text-xl font-bold uppercase tracking-wide text-foreground",
					children: "Conectando con la plataforma…"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 83,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Validando credenciales satelitales y preparando tu panel de rastreo."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 86,
					columnNumber: 13
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 81,
				columnNumber: 17
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 70,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 69,
		columnNumber: 10
	}, this);
}
//#endregion
export { WialonCallbackPage as component };
