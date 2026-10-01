import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as supabase } from "./client-DdsPy57x.mjs";
import { c as crmListCustomers } from "./crm.functions-Bvnaa5DX.mjs";
import { a as mxn, t as BillingRows } from "./solicitud-card-B-7Kfjdk.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clientes-C7q4-__Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-background px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl space-y-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-[0.2em] text-primary",
								children: "CRM ORB-LITE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl text-foreground",
								children: "Panel de clientes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Número de cliente, primera compra, total histórico y solicitudes pendientes."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/crm",
								children: "Ir a solicitudes"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: signOut,
							children: "Salir"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Clientes registrados",
							value: String(rows.length)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Total histórico",
							value: mxn(totalHistorico)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Solicitudes pendientes",
							value: `${totalPendientes} · ${mxn(valorPendiente)}`,
							highlight: true
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Buscar por número, nombre, teléfono, correo o RFC",
						className: "min-w-[240px] flex-1 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
					}), [
						["numero", "Número"],
						["total", "Total histórico"],
						["pendientes", "Pendientes"],
						["primera", "Primera compra"]
					].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: sort === key ? "default" : "outline",
						onClick: () => setSort(key),
						children: label
					}, key))]
				}),
				query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Cargando clientes…"
				}) : query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-destructive",
					children: "No se pudieron cargar los clientes. Inicia sesión con ventas@orb-lite.com."
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Sin clientes para esta búsqueda."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[720px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Cliente"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Contacto"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Primera compra"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Total histórico"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Pendientes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border align-top",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-primary",
										children: ["#", c.customer_number]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-foreground",
										children: c.full_name || "Sin nombre"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: c.phone || "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: c.email || "—" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: formatDate(c.first_order_at ?? c.created_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-foreground",
										children: mxn(Number(c.total_spent ?? 0))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [c.orders_count ?? 0, " compra(s)"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: c.pending_count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-full bg-primary/15 px-2 py-1 text-xs text-primary",
										children: [
											c.pending_count,
											" · ",
											mxn(Number(c.pending_total ?? 0))
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Sin pendientes"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => setExpanded(expanded === c.id ? null : c.id),
										children: expanded === c.id ? "Ocultar" : "Ver datos"
									})
								})
							]
						}), expanded === c.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: "border-t border-border bg-muted/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 6,
								className: "px-4 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-6 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs uppercase tracking-wide text-primary",
											children: "Datos de contacto guardados"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-1 text-sm",
											children: [Object.entries(c.contact && typeof c.contact === "object" ? c.contact : {}).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "flex justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "capitalize text-muted-foreground",
													children: k.replace(/_/g, " ")
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground text-right",
													children: String(v ?? "") || "—"
												})]
											}, k)), !c.contact || Object.keys(c.contact).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: "Sin datos de contacto."
											}) : null]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs uppercase tracking-wide text-primary",
											children: "Datos de facturación guardados"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid gap-2 text-sm",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingRows, {
												billing: c.billing && typeof c.billing === "object" ? c.billing : {},
												emptyText: "Este cliente aún no ha solicitado factura."
											})
										})]
									})]
								})
							})
						}) : null] }, c.id)) })]
					})
				})
			]
		})
	});
}
function Stat({ label, value, highlight }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-xl border p-4 ${highlight ? "border-primary/60 bg-primary/5" : "border-border bg-card"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl text-foreground",
			children: value
		})]
	});
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
