import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { I as LogOut } from "../_libs/lucide-react.mjs";
import { _ as Link, p as Outlet, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as useWialonSession, i as useWialonKeepAlive, o as writeSession, t as PLATFORM_LABEL } from "./wialon-session-C7Oq2mAo.mjs";
import { t as orb_lite_logo_default } from "./orb-lite-logo-CEgq-Hxq.mjs";
import { m as wialonPing, p as wialonLogout } from "./wialon.functions-Cw4L-t5R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon-H5ArqrrL.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var orb_full_logo_jpg_asset_default = {
	version: 1,
	asset_id: "c676c2bf-f2ba-4641-bafa-32966b513a2f",
	project_id: "10f76478-fa8c-4683-b688-ea8db9a49f72",
	url: "/__l5e/assets-v1/c676c2bf-f2ba-4641-bafa-32966b513a2f/orb-full-logo.jpg",
	r2_key: "a/v1/10f76478-fa8c-4683-b688-ea8db9a49f72/c676c2bf-f2ba-4641-bafa-32966b513a2f/orb-full-logo.jpg",
	original_filename: "orb-full-logo.jpg",
	size: 26432,
	content_type: "image/jpeg",
	created_at: "2026-09-15T05:33:21Z"
};
var _jsxFileName = "/app/applet/src/routes/wialon.tsx?tsr-split=component";
var tabs = [
	{
		to: "/wialon/mapa",
		label: "Mapa",
		fullOnly: false
	},
	{
		to: "/wialon/geocercas",
		label: "Geocercas",
		fullOnly: false
	},
	{
		to: "/wialon/rutas",
		label: "Rutas",
		fullOnly: false
	},
	{
		to: "/wialon/compartir",
		label: "Compartir",
		fullOnly: false
	},
	{
		to: "/wialon/unidades",
		label: "Unidades",
		fullOnly: false
	},
	{
		to: "/wialon/historial",
		label: "Historial",
		fullOnly: false
	},
	{
		to: "/wialon/reportes",
		label: "Reportes",
		fullOnly: false
	},
	{
		to: "/wialon/video",
		label: "Cámaras",
		fullOnly: false
	},
	{
		to: "/wialon/cms",
		label: "Altas (CMS)",
		fullOnly: false
	}
];
function WialonLayout() {
	const session = useWialonSession();
	const logout = useServerFn(wialonLogout);
	const ping = useServerFn(wialonPing);
	const navigate = useNavigate();
	useWialonKeepAlive(session, ping);
	async function onLogout() {
		if (session) try {
			await logout({ data: {
				host: session.host,
				sid: session.sid
			} });
		} catch {}
		writeSession(null);
		navigate({ to: "/wialon" });
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
						src: session?.host === "full" ? orb_full_logo_jpg_asset_default.url : orb_lite_logo_default,
						alt: session ? PLATFORM_LABEL[session.host] : "ORB-LITE",
						className: "h-14 w-auto"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 72,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "font-display text-3xl font-bold uppercase tracking-wide",
						children: "Plataforma de rastreo"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 74,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: session ? `${session.userName} · ${PLATFORM_LABEL[session.host]}` : "Entra con tu cuenta para ver tus unidades en tiempo real."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 77,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 73,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 71,
					columnNumber: 9
				}, this), session ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: onLogout,
					className: "inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "size-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 83,
						columnNumber: 13
					}, this), " Salir"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 82,
					columnNumber: 20
				}, this) : null]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 70,
				columnNumber: 7
			}, this),
			session ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
				className: "sticky top-[8rem] z-40 -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto border-b border-border/60 bg-background/95 px-4 py-3 text-sm font-semibold uppercase tracking-wide shadow-[0_8px_20px_-18px_var(--primary)] backdrop-blur sm:top-24 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0",
				children: tabs.filter((tab) => !tab.fullOnly || session.host === "full").map((tab) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: tab.to,
					className: "shrink-0 snap-start whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground hover:text-primary",
					activeProps: { className: "bg-primary/10 text-primary" },
					children: tab.label
				}, tab.to, false, {
					fileName: _jsxFileName,
					lineNumber: 88,
					columnNumber: 84
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 87,
				columnNumber: 18
			}, this) : null,
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 96,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 95,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 69,
		columnNumber: 10
	}, this);
}
//#endregion
export { WialonLayout as component };
