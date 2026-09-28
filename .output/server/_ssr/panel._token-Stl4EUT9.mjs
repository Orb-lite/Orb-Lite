import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BcZnKulH.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { o as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as SolicitudCard, s as STATUS_LABEL, u as mxn } from "./solicitud-card-6lHnjvU6.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Route } from "./panel._token-Ce22kfYY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/panel._token-Stl4EUT9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	if (query.isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-screen items-center justify-center bg-background p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Enlace no válido o panel no disponible."
		})
	});
	const rows = query.data?.rows ?? [];
	const totalValue = rows.reduce((s, r) => s + Number(r.total ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-background px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.2em] text-primary",
							children: "PANEL PRIVADO"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl text-foreground",
							children: "Solicitudes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Cambia el estado de cada solicitud; los resúmenes diarios solo incluyen las pendientes."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrmPasswordCard, { token }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						"pendiente",
						"vendido",
						"no_vendido",
						"todas"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: filter === s ? "default" : "outline",
						onClick: () => setFilter(s),
						children: s === "todas" ? "Todas" : STATUS_LABEL[s]
					}, s))
				}),
				query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Cargando…"
				}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No hay solicitudes en este filtro."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						rows.length,
						" solicitud(es) · ",
						mxn(totalValue)
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SolicitudCard, {
						row,
						pending: mutation.isPending,
						onSave: (status, notes) => mutation.mutate({
							id: row.id,
							status,
							notes
						})
					}, row.id))
				})] })
			]
		})
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3 rounded-xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base text-foreground",
				children: "Acceso al CRM"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Define aquí la contraseña de ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ventas@orb-lite.com" }),
					" y luego entra al CRM con tu correo y contraseña."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "crm-pwd",
							children: "Nueva contraseña (mín. 8 caracteres)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "crm-pwd",
							type: "password",
							autoComplete: "new-password",
							value: password,
							onChange: (e) => setPwd(e.target.value),
							className: "w-64"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: password.length < 8 || mutation.isPending,
						onClick: () => mutation.mutate(),
						children: "Guardar contraseña"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							children: "Ir al CRM"
						})
					})
				]
			}),
			done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-primary",
				children: "Listo, ya puedes entrar al CRM con ventas@orb-lite.com."
			}) : null
		]
	});
}
//#endregion
export { PanelPage as component };
