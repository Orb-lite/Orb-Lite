import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { P as MapPin, V as KeyRound, p as ShieldCheck, r as Video } from "../_libs/lucide-react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useWialonSession, n as PLATFORM_URLS } from "./wialon-session-C7Oq2mAo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.index-CHq1v2B3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/wialon.index.tsx?tsr-split=component";
function WialonLoginPage() {
	const navigate = useNavigate();
	const session = useWialonSession();
	const [host, setHost] = import_react.useState("lite");
	import_react.useEffect(() => {
		if (typeof window !== "undefined") {
			const search = new URLSearchParams(window.location.search);
			const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
			if (search.get("access_token") ?? hash.get("access_token")) {
				navigate({ to: "/wialon/callback" });
				return;
			}
		}
		if (session) navigate({ to: "/wialon/mapa" });
	}, [session, navigate]);
	function startWialonLogin() {
		const base = PLATFORM_URLS[host].app.replace(/\/$/, "");
		window.sessionStorage.setItem("orblite.wialon.oauth-host", host);
		const redirect = `${window.location.origin}/wialon/callback`;
		const url = new URL(`${base}/login.html`);
		url.searchParams.set("client_id", "ORB-LITE");
		url.searchParams.set("access_type", "-1");
		url.searchParams.set("activation_time", "0");
		url.searchParams.set("duration", "604800");
		url.searchParams.set("flags", "0x1");
		url.searchParams.set("lang", "es");
		url.searchParams.set("redirect_uri", redirect);
		url.searchParams.set("response_type", "token");
		window.location.assign(url.toString());
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-[60vh] flex-col items-center justify-center py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "w-full max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "text-center font-display text-2xl font-bold uppercase tracking-wide",
						children: "Acceso a la plataforma"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 43,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 text-center text-sm text-muted-foreground",
						children: "Elige tu versión y entra con tu cuenta de Wialon."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 46,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "mt-8 rounded-xl border border-border/60 bg-card p-6 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex gap-2",
							children: ["lite", "full"].map((option) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setHost(option),
								className: `flex-1 rounded-md border px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${host === option ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"}`,
								children: option === "lite" ? "ORB-LITE" : "ORB-FULL"
							}, option, false, {
								fileName: _jsxFileName,
								lineNumber: 52,
								columnNumber: 56
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 51,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: startWialonLogin,
							className: "mt-6 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90",
							children: "Iniciar sesión con Wialon"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 57,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 50,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 42,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-12 grid w-full max-w-4xl gap-4 sm:grid-cols-4",
				children: [
					{
						icon: MapPin,
						title: "Mapa en vivo",
						text: "Ubicación, velocidad y estado de cada unidad de tu cuenta."
					},
					{
						icon: ShieldCheck,
						title: "Historial y recorridos",
						text: "Consulta los recorridos por fecha y la velocidad máxima registrada."
					},
					{
						icon: Video,
						title: "Cámaras y Video",
						text: "Consulta oficial de cámaras y estados con visor oficial en Wialon."
					},
					{
						icon: KeyRound,
						title: "Altas de unidades y usuarios",
						text: "Da de alta equipos y accesos igual que en el gestor oficial."
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-lg border border-border/60 p-5 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mx-flex mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(item.icon, { className: "size-5 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 82,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 81,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "mt-3 font-display text-lg font-bold uppercase tracking-wide",
							children: item.title
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 84,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: item.text
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 87,
							columnNumber: 13
						}, this)
					]
				}, item.title, true, {
					fileName: _jsxFileName,
					lineNumber: 80,
					columnNumber: 22
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 63,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-8 max-w-md text-center text-xs text-muted-foreground",
				children: [
					"También puedes entrar al gestor oficial:",
					" ",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						className: "text-primary hover:underline",
						href: PLATFORM_URLS[host].app,
						target: "_blank",
						rel: "noreferrer",
						children: PLATFORM_URLS[host].app
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 93,
						columnNumber: 9
					}, this),
					" ",
					"·",
					" ",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						className: "text-primary hover:underline",
						href: PLATFORM_URLS[host].cms,
						target: "_blank",
						rel: "noreferrer",
						children: PLATFORM_URLS[host].cms
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 97,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 91,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 41,
		columnNumber: 10
	}, this);
}
//#endregion
export { WialonLoginPage as component };
