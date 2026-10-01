import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { B as Layers, I as LogOut, W as History, h as Share2, v as Route, x as Radio } from "../_libs/lucide-react.mjs";
import { _ as Link, u as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as setStoredWialonSession } from "./wialon-session-C7Oq2mAo.mjs";
import { p as wialonLogout } from "./wialon.functions-C37hcc8N.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function PlatformHeader({ session }) {
	const currentPath = useRouterState().location.pathname;
	const logoutFn = useServerFn(wialonLogout);
	const handleLogout = async () => {
		if (!session) return;
		try {
			await logoutFn({ data: {
				sid: session.sid,
				host: session.host
			} });
		} catch {}
		setStoredWialonSession(null);
		toast.info("Sesión cerrada");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3 rounded-xl border border-border/80 bg-card/80 p-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/wialon",
				className: "mr-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted hover:text-foreground",
				title: "Panel principal de plataforma",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Plataforma" })]
			}), [
				{
					to: "/wialon/rutas",
					label: "Rutas",
					icon: Route
				},
				{
					to: "/wialon/geocercas",
					label: "Geocercas",
					icon: Layers
				},
				{
					to: "/wialon/historial",
					label: "Historial",
					icon: History
				},
				{
					to: "/wialon/compartir",
					label: "Compartir",
					icon: Share2
				}
			].map((tab) => {
				const Icon = tab.icon;
				const isActive = currentPath.startsWith(tab.to);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: tab.to,
					className: `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider transition ${isActive ? "border border-primary/40 bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label })]
				}, tab.to);
			})]
		}), session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 border-t border-border/50 pt-2 sm:border-0 sm:pt-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "relative flex size-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex size-2 rounded-full bg-primary" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-foreground",
					children: session.userName
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: handleLogout,
				className: "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition",
				title: "Cerrar sesión de Wialon",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: "Salir"
				})]
			})]
		}) : null]
	});
}
//#endregion
export { PlatformHeader as t };
