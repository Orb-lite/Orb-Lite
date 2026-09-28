import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { T as Minus, it as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon-visibility-CGREBqIB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, checked: controlledChecked, defaultChecked = false, onCheckedChange, disabled, ...props }, ref) => {
	const isControlled = controlledChecked !== void 0;
	const [uncontrolledChecked, setUncontrolledChecked] = import_react.useState(defaultChecked);
	const checked = isControlled ? controlledChecked : uncontrolledChecked;
	const handleClick = (e) => {
		if (disabled) return;
		props.onClick?.(e);
		if (e.defaultPrevented) return;
		const nextChecked = checked === true ? false : true;
		if (!isControlled) setUncontrolledChecked(nextChecked);
		onCheckedChange?.(nextChecked);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "checkbox",
		"aria-checked": checked === "indeterminate" ? "mixed" : checked,
		"data-state": checked === "indeterminate" ? "indeterminate" : checked ? "checked" : "unchecked",
		disabled,
		ref,
		onClick: handleClick,
		className: cn("peer relative grid size-4 shrink-0 place-content-center rounded-sm border border-primary shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", checked ? "bg-primary text-primary-foreground" : "bg-background text-transparent hover:bg-muted/50", className),
		...props,
		children: checked === "indeterminate" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3 text-current stroke-[3]" }) : checked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-current stroke-[3]" }) : null
	});
});
Checkbox.displayName = "Checkbox";
var EVENT = "wialon-visibility-change";
function storageKey(session) {
	return `orblite.wialon.hidden.${session.host}.${session.userId}`;
}
function readHidden(key) {
	if (typeof window === "undefined") return /* @__PURE__ */ new Set();
	try {
		const raw = window.localStorage.getItem(key);
		const parsed = raw ? JSON.parse(raw) : [];
		return new Set(Array.isArray(parsed) ? parsed.filter((v) => typeof v === "number") : []);
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
/**
* Unidades ocultas en el mapa (check desactivado). Se comparte entre la
* pestaña Unidades y el Mapa, y se recuerda por cuenta en este navegador.
*/
function useHiddenUnits(session) {
	const key = storageKey(session);
	const [hidden, setHidden] = import_react.useState(() => /* @__PURE__ */ new Set());
	import_react.useEffect(() => {
		const sync = () => setHidden(readHidden(key));
		sync();
		window.addEventListener(EVENT, sync);
		window.addEventListener("storage", sync);
		return () => {
			window.removeEventListener(EVENT, sync);
			window.removeEventListener("storage", sync);
		};
	}, [key]);
	const update = import_react.useCallback((fn) => {
		const next = fn(readHidden(key));
		window.localStorage.setItem(key, JSON.stringify([...next]));
		setHidden(next);
		window.dispatchEvent(new Event(EVENT));
	}, [key]);
	return {
		hidden,
		setVisible: import_react.useCallback((ids, visible) => update((current) => {
			const next = new Set(current);
			for (const id of ids) if (visible) next.delete(id);
			else next.add(id);
			return next;
		}), [update])
	};
}
/** Estado del check general: todas, ninguna o algunas visibles. */
function selectAllState(ids, hidden) {
	if (ids.length === 0) return false;
	const visible = ids.filter((id) => !hidden.has(id)).length;
	if (visible === ids.length) return true;
	if (visible === 0) return false;
	return "indeterminate";
}
/** Filtra por nombre de unidad, IMEI o usuario creador. */
function matchesUnitSearch(unit, search) {
	const needle = search.trim().toLocaleLowerCase("es-MX");
	if (!needle) return true;
	return [
		unit.name,
		unit.imei,
		unit.creatorName,
		String(unit.id)
	].filter(Boolean).some((value) => value.toLocaleLowerCase("es-MX").includes(needle));
}
//#endregion
export { useHiddenUnits as i, matchesUnitSearch as n, selectAllState as r, Checkbox as t };
