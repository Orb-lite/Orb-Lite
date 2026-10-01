import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CwLzEEob.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/solicitud-card-B-7Kfjdk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var STATUS_LABEL = {
	pendiente: "Pendiente",
	vendido: "Vendido",
	no_vendido: "No vendido"
};
var mxn = (n) => `$${(n ?? 0).toLocaleString("es-MX", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})}`;
function summarizeItems(items) {
	if (!Array.isArray(items)) return "";
	return items.map((raw) => {
		const it = raw;
		return `${Number(it["quantity"] ?? 1)} × ${String(it["title"] ?? it["variantName"] ?? "Producto")}`;
	}).join(" · ");
}
function SolicitudCard({ row, pending, onSave, onExpand }) {
	const [status, setStatus] = import_react.useState(row.status);
	const [notes, setNotes] = import_react.useState(row.notes ?? "");
	import_react.useEffect(() => {
		setStatus(row.status);
		setNotes(row.notes ?? "");
	}, [row.status, row.notes]);
	const dirty = status !== row.status || notes !== (row.notes ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "space-y-3 rounded-xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-primary",
						children: [
							"Pedido #",
							row.order_id,
							row.customer_number ? ` · Cliente #${row.customer_number}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-base text-foreground",
						children: [
							row.full_name || "Sin nombre",
							" · ",
							row.phone || "Sin teléfono"
						]
					}),
					row.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: row.email
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-semibold text-foreground",
						children: mxn(Number(row.total ?? 0))
					}), onExpand ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: onExpand,
						children: "Ver completo"
					}) : null]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: summarizeItems(row.items)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Entrega: ",
					row.shipping_label || "Entrega local",
					" · Factura:",
					" ",
					row.wants_invoice ? "Sí" : "No",
					" · Recibido:",
					" ",
					new Date(row.created_at).toLocaleString("es-MX", { timeZone: "America/Mexico_City" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					"pendiente",
					"vendido",
					"no_vendido"
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: status === s ? "default" : "outline",
					onClick: () => setStatus(s),
					children: STATUS_LABEL[s]
				}, s))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: notes,
				onChange: (e) => setNotes(e.target.value),
				placeholder: "Notas internas (opcional)",
				rows: 2
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					disabled: !dirty || pending,
					onClick: () => onSave(status, notes),
					children: "Guardar cambios"
				}), !dirty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: ["Estado actual: ", STATUS_LABEL[row.status] ?? row.status]
				}) : null]
			})
		]
	});
}
function SolicitudDetailDialog({ row, open, onOpenChange }) {
	if (!row) return null;
	const items = Array.isArray(row.items) ? row.items : [];
	const contact = typeof row.contact === "object" && row.contact ? row.contact : {};
	const billing = typeof row.billing === "object" && row.billing ? row.billing : {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Pedido #", row.order_id] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: ["Información completa · ", formatDate(row.created_at)] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DetailSection, {
							title: "Estado y totales",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Estado",
									value: STATUS_LABEL[row.status] ?? row.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Total",
									value: mxn(Number(row.total ?? 0))
								}),
								row.customer_number ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Número de cliente",
									value: `#${row.customer_number}`
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DetailSection, {
							title: "Contacto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Nombre",
									value: row.full_name || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Teléfono",
									value: row.phone || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Correo",
									value: row.email || "—"
								}),
								Object.entries(contact).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: k,
									value: String(v ?? "")
								}, k))
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DetailSection, {
							title: "Entrega",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Tipo de entrega",
								value: row.shipping_label || "Entrega local"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Requiere factura",
								value: row.wants_invoice ? "Sí" : "No"
							})]
						}),
						row.wants_invoice || Object.keys(billing).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSection, {
							title: "Datos de facturación (CFDI 4.0)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingRows, { billing })
						}) : null,
						items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSection, {
							title: "Productos",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "list-disc pl-4 space-y-1",
								children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									Number(it.quantity ?? 1),
									" × ",
									String(it.title ?? it.variantName ?? "Producto"),
									it.price ? ` · ${mxn(Number(it.price))}` : "",
									it.renewal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: [
											it.renewal.fullName ? `Titular: ${it.renewal.fullName}` : null,
											it.renewal.unitName ? `Equipo: ${it.renewal.unitName}` : null,
											it.renewal.imei ? `IMEI: ${it.renewal.imei}` : null,
											it.renewal.iccid ? `ICCID: ${it.renewal.iccid}` : null,
											it.renewal.simPhone ? `Tel. chip: ${it.renewal.simPhone}` : null
										].filter(Boolean).join(" · ")
									}) : null
								] }, i))
							})
						}),
						row.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border bg-muted/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wide text-muted-foreground mb-1",
								children: "Notas internas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-foreground whitespace-pre-wrap",
								children: row.notes
							})]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => onOpenChange(false),
					children: "Cerrar"
				}) })
			]
		})
	});
}
function DetailSection({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-wide text-primary",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2",
			children
		})]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap justify-between gap-2 border-b border-border pb-1 last:border-0 last:pb-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground capitalize",
			children: label.replace(/_/g, " ")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-foreground text-right",
			children: value || "—"
		})]
	});
}
function formatDate(iso) {
	return new Date(iso).toLocaleString("es-MX", { timeZone: "America/Mexico_City" });
}
var BILLING_LABELS = {
	legalName: "Razón social / Nombre fiscal",
	rfc: "RFC",
	taxRegime: "Régimen fiscal",
	cfdiUse: "Uso del CFDI",
	fiscalZip: "Código postal fiscal",
	email: "Correo para facturación",
	phone: "Teléfono",
	address: "Dirección fiscal",
	fiscalAddress: "Dirección fiscal",
	constanciaFileName: "Constancia de Situación Fiscal",
	constanciaUrl: "Enlace a la constancia (30 días)"
};
var BILLING_ORDER = [
	"legalName",
	"rfc",
	"taxRegime",
	"cfdiUse",
	"fiscalZip",
	"address",
	"fiscalAddress",
	"email",
	"phone",
	"constanciaFileName",
	"constanciaUrl"
];
function BillingRows({ billing, emptyText = "No se capturaron datos fiscales." }) {
	const keys = Object.keys(billing ?? {});
	if (keys.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: emptyText
	});
	const ordered = [...BILLING_ORDER.filter((k) => keys.includes(k)), ...keys.filter((k) => !BILLING_ORDER.includes(k))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: ordered.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
		label: BILLING_LABELS[k] ?? k,
		value: String(billing[k] ?? "")
	}, k)) });
}
//#endregion
export { mxn as a, SolicitudDetailDialog as i, STATUS_LABEL as n, SolicitudCard as r, BillingRows as t };
