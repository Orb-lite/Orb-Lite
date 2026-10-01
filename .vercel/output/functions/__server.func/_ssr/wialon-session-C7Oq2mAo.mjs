import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon-session-C7Oq2mAo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var KEY = "orblite.wialon.session";
var PLATFORM_LABEL = {
	lite: "ORB-LITE (Wialon Lite)",
	full: "ORB-FULL (Wialon Full)"
};
var PLATFORM_URLS = {
	lite: {
		app: "https://lite.wialon.us/",
		cms: "https://cms-lite.wialon.us/"
	},
	full: {
		app: "https://hosting.wialon.com/",
		cms: "https://cms.wialon.com/"
	}
};
function readSession() {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.sessionStorage.getItem(KEY) || window.localStorage.getItem(KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		return parsed?.sid && parsed?.host ? parsed : null;
	} catch {
		return null;
	}
}
function writeSession(session) {
	if (typeof window === "undefined") return;
	if (session) {
		window.sessionStorage.setItem(KEY, JSON.stringify(session));
		window.localStorage.setItem(KEY, JSON.stringify(session));
	} else {
		window.sessionStorage.removeItem(KEY);
		window.localStorage.removeItem(KEY);
	}
	window.dispatchEvent(new Event("wialon-session-change"));
}
var setStoredWialonSession = writeSession;
/** Devuelve la sesión activa; `undefined` mientras hidrata. */
function useWialonSession() {
	const [session, setSession] = import_react.useState(void 0);
	import_react.useEffect(() => {
		setSession(readSession());
		const onChange = () => setSession(readSession());
		window.addEventListener("wialon-session-change", onChange);
		window.addEventListener("storage", onChange);
		return () => {
			window.removeEventListener("wialon-session-change", onChange);
			window.removeEventListener("storage", onChange);
		};
	}, []);
	return session;
}
/** Mantiene viva la sesión de Wialon y cierra si la plataforma la invalidó. */
function useWialonKeepAlive(session, ping) {
	import_react.useEffect(() => {
		if (!session) return;
		let cancelled = false;
		async function check() {
			try {
				const result = await ping({ data: {
					host: session.host,
					sid: session.sid
				} });
				if (!cancelled && !result.valid) writeSession(null);
			} catch {}
		}
		const timer = window.setInterval(check, 24e4);
		check();
		return () => {
			cancelled = true;
			window.clearInterval(timer);
		};
	}, [session?.sid, session?.host]);
}
//#endregion
export { useWialonSession as a, useWialonKeepAlive as i, PLATFORM_URLS as n, writeSession as o, setStoredWialonSession as r, PLATFORM_LABEL as t };
