import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C6PhiXEn.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { i as enumType, l as stringType, s as objectType } from "../_libs/zod.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as mxn, n as STATUS_LABEL, r as SolicitudCard } from "./solicitud-card-BoTe4yoN.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Route } from "./panel._token-BWQDN2RQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/panel._token-LE3hfEGs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var STATUSES = [
	"pendiente",
	"vendido",
	"no_vendido"
];
var listSolicitudes = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: stringType().min(8),
	status: enumType(["todas", ...STATUSES]).default("todas")
}).parse(data)).handler(createSsrRpc("2c2a2b41a2e18ad9332a41ab7e76e5b4ca9f44f2ec81e6eae1a97bb0aef9dd19"));
var updateSolicitudStatus = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: stringType().min(8),
	id: stringType().uuid(),
	status: enumType(STATUSES),
	notes: stringType().max(2e3).nullish()
}).parse(data)).handler(createSsrRpc("ddb6b935ede199b55f33bdbf8ee7e197e4001cd13875e7a645c5501cccf00bfd"));
/** Define (o restablece) la contraseña del CRM para ventas@orb-lite.com. */
var setCrmPassword = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: stringType().min(8),
	password: stringType().min(8).max(72)
}).parse(data)).handler(createSsrRpc("a93689bdc94046f106d015e830faac2b62667ca616fcc9111cb6111f642f1e33"));
var _jsxFileName = "/app/applet/src/routes/panel.$token.tsx?tsr-split=component";
function PanelPage() {
	const { token } = Route.useParams();
	const [filter, setFilter] = import_react.useState("pendiente");
	const list = useServerFn(listSolicitudes);
	const update = useServerFn(updateSolicitudStatus);
	const queryClient = useQueryClient();
	const query = useQuery({
		queryKey: [
			"panel-solicitudes",
			token,
			filter
		],
		queryFn: () => list({ data: {
			token,
			status: filter
		} }),
		refetchInterval: 15e3
	});
	const mutation = useMutation({
		mutationFn: (vars) => update({ data: {
			token,
			...vars
		} }),
		onSuccess: () => {
			toast.success("Solicitud actualizada");
			queryClient.invalidateQueries({ queryKey: ["panel-solicitudes"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Error al actualizar")
	});
	if (query.isError) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "flex min-h-screen items-center justify-center bg-background p-6",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-muted-foreground",
			children: "Enlace no válido o panel no disponible."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 51,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 50,
		columnNumber: 12
	}, this);
	const rows = query.data?.rows ?? [];
	const totalValue = rows.reduce((s, r) => s + Number(r.total ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "min-h-screen bg-background px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto max-w-4xl space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs tracking-[0.2em] text-primary",
							children: "PANEL PRIVADO"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 59,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "font-display text-2xl text-foreground",
							children: "Solicitudes"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 60,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-sm text-muted-foreground",
							children: "Cambia el estado de cada solicitud; los resúmenes diarios solo incluyen las pendientes."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 61,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 58,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CrmPasswordCard, { token }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 66,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						"pendiente",
						"vendido",
						"no_vendido",
						"todas"
					].map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						variant: filter === s ? "default" : "outline",
						onClick: () => setFilter(s),
						children: s === "todas" ? "Todas" : STATUS_LABEL[s]
					}, s, false, {
						fileName: _jsxFileName,
						lineNumber: 69,
						columnNumber: 80
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 68,
					columnNumber: 9
				}, this),
				query.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: "Cargando…"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 74,
					columnNumber: 28
				}, this) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: "No hay solicitudes en este filtro."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 74,
					columnNumber: 109
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						rows.length,
						" solicitud(es) · ",
						mxn(totalValue)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 75,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-4",
					children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SolicitudCard, {
						row,
						pending: mutation.isPending,
						onSave: (status, notes) => mutation.mutate({
							id: row.id,
							status,
							notes
						})
					}, row.id, false, {
						fileName: _jsxFileName,
						lineNumber: 79,
						columnNumber: 32
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 78,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 74,
					columnNumber: 195
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 57,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 56,
		columnNumber: 10
	}, this);
}
function CrmPasswordCard({ token }) {
	const setPassword = useServerFn(setCrmPassword);
	const [password, setPwd] = import_react.useState("");
	const [done, setDone] = import_react.useState(false);
	const mutation = useMutation({
		mutationFn: () => setPassword({ data: {
			token,
			password
		} }),
		onSuccess: () => {
			setDone(true);
			setPwd("");
			toast.success("Contraseña guardada para ventas@orb-lite.com");
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo guardar la contraseña")
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "space-y-3 rounded-xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
				className: "text-base text-foreground",
				children: "Acceso al CRM"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 113,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Define aquí la contraseña de ",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "ventas@orb-lite.com" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 115,
						columnNumber: 40
					}, this),
					" y luego entra al CRM con tu correo y contraseña."
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 114,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 112,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-end gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "crm-pwd",
							children: "Nueva contraseña (mín. 8 caracteres)"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 121,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							id: "crm-pwd",
							type: "password",
							autoComplete: "new-password",
							value: password,
							onChange: (e) => setPwd(e.target.value),
							className: "w-64"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 122,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 120,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						disabled: password.length < 8 || mutation.isPending,
						onClick: () => mutation.mutate(),
						children: "Guardar contraseña"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 124,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/auth",
							children: "Ir al CRM"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 128,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 127,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 119,
				columnNumber: 7
			}, this),
			done ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-primary",
				children: "Listo, ya puedes entrar al CRM con ventas@orb-lite.com."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 131,
				columnNumber: 15
			}, this) : null
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 111,
		columnNumber: 10
	}, this);
}
//#endregion
export { PanelPage as component };
