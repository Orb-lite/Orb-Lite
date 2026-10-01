import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as supabase } from "./client-jASsqEMI.mjs";
import { c as crmListCustomers } from "./crm.functions-BYAuQqRR.mjs";
import { a as mxn, t as BillingRows } from "./solicitud-card-BoTe4yoN.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clientes-9FspIM6A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/clientes.tsx?tsr-split=component";
function ClientesPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const listCustomers = useServerFn(crmListCustomers);
	const [q, setQ] = import_react.useState("");
	const [sort, setSort] = import_react.useState("numero");
	const [expanded, setExpanded] = import_react.useState(null);
	const query = useQuery({
		queryKey: ["crm-customers"],
		queryFn: () => listCustomers({ data: void 0 }),
		refetchInterval: 3e4
	});
	const rows = query.data?.rows ?? [];
	const term = q.trim().toLowerCase();
	const filtered = import_react.useMemo(() => {
		const sorted = [...term ? rows.filter((c) => [
			c.full_name,
			c.phone,
			c.email,
			String(c.customer_number),
			c.billing?.rfc
		].filter(Boolean).some((v) => String(v).toLowerCase().includes(term))) : rows];
		sorted.sort((a, b) => {
			if (sort === "total") return Number(b.total_spent ?? 0) - Number(a.total_spent ?? 0);
			if (sort === "pendientes") return (b.pending_count ?? 0) - (a.pending_count ?? 0);
			if (sort === "primera") return new Date(a.first_order_at).getTime() - new Date(b.first_order_at).getTime();
			return Number(a.customer_number) - Number(b.customer_number);
		});
		return sorted;
	}, [
		rows,
		term,
		sort
	]);
	const totalHistorico = rows.reduce((s, c) => s + Number(c.total_spent ?? 0), 0);
	const totalPendientes = rows.reduce((s, c) => s + Number(c.pending_count ?? 0), 0);
	const valorPendiente = rows.reduce((s, c) => s + Number(c.pending_total ?? 0), 0);
	async function signOut() {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "min-h-screen bg-background px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto max-w-5xl space-y-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs tracking-[0.2em] text-primary",
								children: "CRM ORB-LITE"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 53,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "font-display text-2xl text-foreground",
								children: "Panel de clientes"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 54,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-sm text-muted-foreground",
								children: "Número de cliente, primera compra, total histórico y solicitudes pendientes."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 55,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 52,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/crm",
								children: "Ir a solicitudes"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 61,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 60,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: "outline",
							onClick: signOut,
							children: "Salir"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 63,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 59,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 51,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							label: "Clientes registrados",
							value: String(rows.length)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 70,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							label: "Total histórico",
							value: mxn(totalHistorico)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 71,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							label: "Solicitudes pendientes",
							value: `${totalPendientes} · ${mxn(valorPendiente)}`,
							highlight: true
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 72,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 69,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Buscar por número, nombre, teléfono, correo o RFC",
						className: "min-w-[240px] flex-1 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 76,
						columnNumber: 11
					}, this), [
						["numero", "Número"],
						["total", "Total histórico"],
						["pendientes", "Pendientes"],
						["primera", "Primera compra"]
					].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						variant: sort === key ? "default" : "outline",
						onClick: () => setSort(key),
						children: label
					}, key, false, {
						fileName: _jsxFileName,
						lineNumber: 77,
						columnNumber: 159
					}, this))]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 75,
					columnNumber: 9
				}, this),
				query.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: "Cargando clientes…"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 82,
					columnNumber: 28
				}, this) : query.isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-destructive",
					children: "No se pudieron cargar los clientes. Inicia sesión con ventas@orb-lite.com."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 82,
					columnNumber: 114
				}, this) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: "Sin clientes para esta búsqueda."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 84,
					columnNumber: 42
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "overflow-x-auto rounded-xl border border-border",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
						className: "w-full min-w-[720px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
							className: "bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "px-4 py-3",
									children: "Cliente"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 88,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "px-4 py-3",
									children: "Contacto"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 89,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "px-4 py-3",
									children: "Primera compra"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 90,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "px-4 py-3",
									children: "Total histórico"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 91,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "px-4 py-3",
									children: "Pendientes"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 92,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "px-4 py-3" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 93,
									columnNumber: 19
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 87,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 86,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: filtered.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
							className: "border-t border-border align-top",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-primary",
										children: ["#", c.customer_number]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 100,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-foreground",
										children: c.full_name || "Sin nombre"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 101,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 99,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: c.phone || "—" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 104,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: c.email || "—" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 105,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 103,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: formatDate(c.first_order_at ?? c.created_at)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 107,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-foreground",
										children: mxn(Number(c.total_spent ?? 0))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 111,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-muted-foreground",
										children: [c.orders_count ?? 0, " compra(s)"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 112,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 110,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
									className: "px-4 py-3",
									children: c.pending_count > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "rounded-full bg-primary/15 px-2 py-1 text-xs text-primary",
										children: [
											c.pending_count,
											" · ",
											mxn(Number(c.pending_total ?? 0))
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 117,
										columnNumber: 48
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs text-muted-foreground",
										children: "Sin pendientes"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 119,
										columnNumber: 37
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 116,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
									className: "px-4 py-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => setExpanded(expanded === c.id ? null : c.id),
										children: expanded === c.id ? "Ocultar" : "Ver datos"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 122,
										columnNumber: 25
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 121,
									columnNumber: 23
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 98,
							columnNumber: 21
						}, this), expanded === c.id ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
							className: "border-t border-border bg-muted/20",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								colSpan: 6,
								className: "px-4 py-4",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid gap-6 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs uppercase tracking-wide text-primary",
											children: "Datos de contacto guardados"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 131,
											columnNumber: 31
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid gap-1 text-sm",
											children: [Object.entries(c.contact && typeof c.contact === "object" ? c.contact : {}).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "flex justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "capitalize text-muted-foreground",
													children: k.replace(/_/g, " ")
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 136,
													columnNumber: 37
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-foreground text-right",
													children: String(v ?? "") || "—"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 139,
													columnNumber: 37
												}, this)]
											}, k, true, {
												fileName: _jsxFileName,
												lineNumber: 135,
												columnNumber: 151
											}, this)), !c.contact || Object.keys(c.contact).length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-muted-foreground",
												children: "Sin datos de contacto."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 143,
												columnNumber: 86
											}, this) : null]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 134,
											columnNumber: 31
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 130,
										columnNumber: 29
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs uppercase tracking-wide text-primary",
											children: "Datos de facturación guardados"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 147,
											columnNumber: 31
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid gap-2 text-sm",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BillingRows, {
												billing: c.billing && typeof c.billing === "object" ? c.billing : {},
												emptyText: "Este cliente aún no ha solicitado factura."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 151,
												columnNumber: 33
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 150,
											columnNumber: 31
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 146,
										columnNumber: 29
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 129,
									columnNumber: 27
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 128,
								columnNumber: 25
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 127,
							columnNumber: 42
						}, this) : null] }, c.id, true, {
							fileName: _jsxFileName,
							lineNumber: 97,
							columnNumber: 36
						}, this)) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 96,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 85,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 84,
					columnNumber: 126
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 50,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 49,
		columnNumber: 10
	}, this);
}
function Stat({ label, value, highlight }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `rounded-xl border p-4 ${highlight ? "border-primary/60 bg-primary/5" : "border-border bg-card"}`,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-xs uppercase tracking-wide text-muted-foreground",
			children: label
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 174,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "font-display text-xl text-foreground",
			children: value
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 175,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 173,
		columnNumber: 10
	}, this);
}
function formatDate(iso) {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("es-MX", {
		timeZone: "America/Mexico_City",
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
//#endregion
export { ClientesPage as component };
