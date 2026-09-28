import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { _ as Link, u as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { I as Layers, M as LogOut, _ as Radio, m as Route, z as History } from "../_libs/lucide-react.mjs";
import { r as setStoredWialonSession } from "./wialon-session-C7Oq2mAo.mjs";
import { p as wialonLogout } from "./wialon.functions-B5LcdM8M.mjs";
require_react();
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/wialon/PlatformHeader.tsx";
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
	const tabs = [
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
		}
	];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col gap-3 rounded-xl border border-border/80 bg-card/80 p-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/wialon",
				className: "mr-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted hover:text-foreground",
				title: "Panel principal de plataforma",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Radio, { className: "size-3.5 text-primary" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 47,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Plataforma" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 48,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 42,
				columnNumber: 9
			}, this), tabs.map((tab) => {
				const Icon = tab.icon;
				const isActive = currentPath.startsWith(tab.to);
				return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: tab.to,
					className: `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider transition ${isActive ? "border border-primary/40 bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "size-3.5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 63,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: tab.label }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 64,
						columnNumber: 15
					}, this)]
				}, tab.to, true, {
					fileName: _jsxFileName,
					lineNumber: 54,
					columnNumber: 13
				}, this);
			})]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 41,
			columnNumber: 7
		}, this), session ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center justify-between gap-3 border-t border-border/50 pt-2 sm:border-0 sm:pt-0",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "relative flex size-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 75,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "relative inline-flex size-2 rounded-full bg-primary" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 76,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 74,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "font-semibold text-foreground",
					children: session.userName
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 78,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 73,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				type: "button",
				onClick: handleLogout,
				className: "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition",
				title: "Cerrar sesión de Wialon",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "size-3.5" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 87,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "hidden sm:inline",
					children: "Salir"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 88,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 81,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 72,
			columnNumber: 9
		}, this) : null]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 39,
		columnNumber: 5
	}, this);
}
//#endregion
export { PlatformHeader as t };
