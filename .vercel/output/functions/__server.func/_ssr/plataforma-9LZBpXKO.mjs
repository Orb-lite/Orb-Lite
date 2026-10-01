import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useWialonSession } from "./wialon-session-C7Oq2mAo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plataforma-9LZBpXKO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/plataforma.tsx?tsr-split=component";
function PlataformaPage() {
	const navigate = useNavigate();
	const session = useWialonSession();
	import_react.useEffect(() => {
		if (typeof window !== "undefined") {
			const search = new URLSearchParams(window.location.search);
			const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
			if (search.get("access_token") ?? hash.get("access_token")) {
				navigate({ to: "/wialon/callback" });
				return;
			}
		}
		if (session === void 0) return;
		if (session) navigate({ to: "/wialon/mapa" });
		else navigate({ to: "/wialon" });
	}, [session, navigate]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-[60vh] flex-col items-center justify-center p-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 31,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
				className: "mt-4 font-display text-lg font-bold uppercase tracking-wide",
				children: "Cargando plataforma de rastreo…"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 32,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Accediendo a tus unidades satelitales."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 35,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 30,
		columnNumber: 10
	}, this);
}
//#endregion
export { PlataformaPage as component };
