import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BtKrwu2q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/solicitud-card-BoTe4yoN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/ui/textarea.tsx";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 8,
		columnNumber: 7
	}, void 0);
});
Textarea.displayName = "Textarea";
var _jsxFileName = "/app/applet/src/components/solicitud-card.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
		className: "space-y-3 rounded-xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-primary",
						children: [
							"Pedido #",
							row.order_id,
							row.customer_number ? ` · Cliente #${row.customer_number}` : ""
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 61,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-base text-foreground",
						children: [
							row.full_name || "Sin nombre",
							" · ",
							row.phone || "Sin teléfono"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 65,
						columnNumber: 11
					}, this),
					row.email ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-muted-foreground",
						children: row.email
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 68,
						columnNumber: 24
					}, this) : null
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 60,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-base font-semibold text-foreground",
						children: mxn(Number(row.total ?? 0))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 71,
						columnNumber: 11
					}, this), onExpand ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						variant: "outline",
						onClick: onExpand,
						children: "Ver completo"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 73,
						columnNumber: 13
					}, this) : null]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 70,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 59,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground",
				children: summarizeItems(row.items)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 80,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
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
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 81,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					"pendiente",
					"vendido",
					"no_vendido"
				].map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					size: "sm",
					variant: status === s ? "default" : "outline",
					onClick: () => setStatus(s),
					children: STATUS_LABEL[s]
				}, s, false, {
					fileName: _jsxFileName,
					lineNumber: 89,
					columnNumber: 11
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 87,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
				value: notes,
				onChange: (e) => setNotes(e.target.value),
				placeholder: "Notas internas (opcional)",
				rows: 2
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 100,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					size: "sm",
					disabled: !dirty || pending,
					onClick: () => onSave(status, notes),
					children: "Guardar cambios"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 108,
					columnNumber: 9
				}, this), !dirty ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-xs text-muted-foreground",
					children: ["Estado actual: ", STATUS_LABEL[row.status] ?? row.status]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 112,
					columnNumber: 11
				}, this) : null]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 107,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 58,
		columnNumber: 5
	}, this);
}
function SolicitudDetailDialog({ row, open, onOpenChange }) {
	if (!row) return null;
	const items = Array.isArray(row.items) ? row.items : [];
	const contact = typeof row.contact === "object" && row.contact ? row.contact : {};
	const billing = typeof row.billing === "object" && row.billing ? row.billing : {};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
			className: "max-w-2xl max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: ["Pedido #", row.order_id] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 140,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: ["Información completa · ", formatDate(row.created_at)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 141,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 139,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DetailSection, {
							title: "Estado y totales",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
									label: "Estado",
									value: STATUS_LABEL[row.status] ?? row.status
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 146,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
									label: "Total",
									value: mxn(Number(row.total ?? 0))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 147,
									columnNumber: 13
								}, this),
								row.customer_number ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
									label: "Número de cliente",
									value: `#${row.customer_number}`
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 149,
									columnNumber: 15
								}, this) : null
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 145,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DetailSection, {
							title: "Contacto",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
									label: "Nombre",
									value: row.full_name || "—"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 154,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
									label: "Teléfono",
									value: row.phone || "—"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 155,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
									label: "Correo",
									value: row.email || "—"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 156,
									columnNumber: 13
								}, this),
								Object.entries(contact).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
									label: k,
									value: String(v ?? "")
								}, k, false, {
									fileName: _jsxFileName,
									lineNumber: 158,
									columnNumber: 15
								}, this))
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 153,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DetailSection, {
							title: "Entrega",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
								label: "Tipo de entrega",
								value: row.shipping_label || "Entrega local"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 163,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
								label: "Requiere factura",
								value: row.wants_invoice ? "Sí" : "No"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 164,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 162,
							columnNumber: 11
						}, this),
						row.wants_invoice || Object.keys(billing).length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DetailSection, {
							title: "Datos de facturación (CFDI 4.0)",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BillingRows, { billing }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 169,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 168,
							columnNumber: 13
						}, this) : null,
						items.length > 0 && /* @__PURE__ */ (void 0)(DetailSection, {
							title: "Productos",
							children: /* @__PURE__ */ (void 0)("ul", {
								className: "list-disc pl-4 space-y-1",
								children: items.map((it, i) => /* @__PURE__ */ (void 0)("li", { children: [
									Number(it.quantity ?? 1),
									" × ",
									String(it.title ?? it.variantName ?? "Producto"),
									it.price ? ` · ${mxn(Number(it.price))}` : "",
									it.renewal ? /* @__PURE__ */ (void 0)("span", {
										className: "block text-xs text-muted-foreground",
										children: [
											it.renewal.fullName ? `Titular: ${it.renewal.fullName}` : null,
											it.renewal.unitName ? `Equipo: ${it.renewal.unitName}` : null,
											it.renewal.imei ? `IMEI: ${it.renewal.imei}` : null,
											it.renewal.iccid ? `ICCID: ${it.renewal.iccid}` : null,
											it.renewal.simPhone ? `Tel. chip: ${it.renewal.simPhone}` : null
										].filter(Boolean).join(" · ")
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 181,
										columnNumber: 23
									}, this) : null
								] }, i, true, {
									fileName: _jsxFileName,
									lineNumber: 177,
									columnNumber: 19
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 175,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 174,
							columnNumber: 13
						}, this),
						row.notes ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-md border border-border bg-muted/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs uppercase tracking-wide text-muted-foreground mb-1",
								children: "Notas internas"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 201,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-foreground whitespace-pre-wrap",
								children: row.notes
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 204,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 200,
							columnNumber: 13
						}, this) : null
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 144,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					onClick: () => onOpenChange(false),
					children: "Cerrar"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 210,
					columnNumber: 11
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 209,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 138,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 137,
		columnNumber: 5
	}, this);
}
function DetailSection({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-xs uppercase tracking-wide text-primary",
			children: title
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 220,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-2",
			children
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 221,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 219,
		columnNumber: 5
	}, this);
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-wrap justify-between gap-2 border-b border-border pb-1 last:border-0 last:pb-0",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-muted-foreground capitalize",
			children: label.replace(/_/g, " ")
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 229,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-foreground text-right",
			children: value || "—"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 230,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 228,
		columnNumber: 5
	}, this);
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
	if (keys.length === 0) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
		className: "text-sm text-muted-foreground",
		children: emptyText
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 276,
		columnNumber: 12
	}, this);
	const ordered = [...BILLING_ORDER.filter((k) => keys.includes(k)), ...keys.filter((k) => !BILLING_ORDER.includes(k))];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: ordered.map((k) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
		label: BILLING_LABELS[k] ?? k,
		value: String(billing[k] ?? "")
	}, k, false, {
		fileName: _jsxFileName,
		lineNumber: 285,
		columnNumber: 9
	}, this)) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 283,
		columnNumber: 5
	}, this);
}
//#endregion
export { mxn as a, SolicitudDetailDialog as i, STATUS_LABEL as n, SolicitudCard as r, BillingRows as t };
