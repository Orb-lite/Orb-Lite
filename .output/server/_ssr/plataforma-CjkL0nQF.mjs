import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useWialonSession } from "./wialon-session-C7Oq2mAo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plataforma-CjkL0nQF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[60vh] flex-col items-center justify-center p-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 font-display text-lg font-bold uppercase tracking-wide",
				children: "Cargando plataforma de rastreo…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Accediendo a tus unidades satelitales."
			})
		]
	});
}
//#endregion
export { PlataformaPage as component };
