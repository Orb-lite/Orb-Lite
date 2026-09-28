import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { n as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/solicitud-card-DcH36p1l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$2 = "/app/applet/src/components/ui/textarea.tsx";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 8,
		columnNumber: 7
	}, void 0);
});
Textarea.displayName = "Textarea";
var _jsxFileName$1 = "/app/applet/src/components/ui/dialog.tsx";
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 21,
	columnNumber: 3
}, void 0));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogOverlay, {}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 37,
	columnNumber: 5
}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 48,
			columnNumber: 9
		}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "sr-only",
			children: "Close"
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 49,
			columnNumber: 9
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 47,
		columnNumber: 7
	}, void 0)]
}, void 0, true, {
	fileName: _jsxFileName$1,
	lineNumber: 38,
	columnNumber: 5
}, void 0)] }, void 0, true, {
	fileName: _jsxFileName$1,
	lineNumber: 36,
	columnNumber: 3
}, void 0));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 57,
	columnNumber: 3
}, void 0);
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 62,
	columnNumber: 3
}, void 0);
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 73,
	columnNumber: 3
}, void 0));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 85,
	columnNumber: 3
}, void 0));
DialogDescription.displayName = DialogDescription$1.displayName;
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
export { DialogHeader as a, SolicitudCard as c, DialogDescription as i, SolicitudDetailDialog as l, Dialog as n, DialogTitle as o, DialogContent as r, STATUS_LABEL as s, BillingRows as t, mxn as u };
