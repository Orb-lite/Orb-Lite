import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as supabase } from "./client-jASsqEMI.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as formatMxn, i as SHIPPING_OPTIONS, l as renewalMeta, n as IVA_RATE, r as PRODUCTS, s as findVariant } from "./catalog-BhuVKh9L.mjs";
import { _ as crmUpdateCustomer, a as crmDeleteDemoRequest, c as crmListCustomers, f as crmListSolicitudes, g as crmSendDemoRequest, i as crmDeleteCustomer, l as crmListDemoRequests, m as crmSaveCustomer, n as crmCreateDemoUser, o as crmDeleteDemoUser, p as crmLookupCustomer, r as crmCreateSale, t as buildDemoUsername, u as crmListDemoUsers, v as crmUpdateSolicitud } from "./crm.functions-BYAuQqRR.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BtKrwu2q.mjs";
import { a as mxn, i as SolicitudDetailDialog, n as STATUS_LABEL, r as SolicitudCard, t as BillingRows } from "./solicitud-card-BoTe4yoN.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm-Cn32gIyA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$3 = "/app/applet/src/components/crm-manual-forms.tsx";
var CHANNELS = [
	"WhatsApp",
	"Teléfono",
	"Mostrador",
	"Visita",
	"Referido",
	"Otro"
];
var EMPTY_RENEWAL = {
	fullName: "",
	unitName: "",
	imei: "",
	iccid: "",
	simPhone: ""
};
/** Campos que pide cada tipo de renovación. */
function renewalFieldsFor(variantId) {
	const meta = renewalMeta(variantId);
	if (!meta) return [];
	if (meta.kind === "sim") return [
		"fullName",
		"iccid",
		"simPhone"
	];
	if (meta.kind === "both") return [
		"fullName",
		"unitName",
		"imei",
		"iccid",
		"simPhone"
	];
	return [
		"fullName",
		"unitName",
		"imei"
	];
}
var RENEWAL_LABELS = {
	fullName: "Nombre del titular",
	unitName: "Nombre del equipo en plataforma",
	imei: "IMEI del equipo",
	iccid: "ICCID del chip",
	simPhone: "Teléfono del chip"
};
var CUSTOM_ID = "__custom__";
var DEFAULT_VARIANT = PRODUCTS[0]?.variants[0];
var EMPTY_CLIENTE = {
	customerNumber: "",
	fullName: "",
	phone: "",
	email: "",
	city: "",
	state: "",
	zip: ""
};
var EMPTY_BILLING = {
	legalName: "",
	rfc: "",
	taxRegime: "",
	cfdiUse: "",
	fiscalZip: "",
	email: "",
	phone: "",
	fiscalAddress: ""
};
function Field({ id, label, value, onChange, type = "text", placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
			htmlFor: id,
			className: "text-xs text-muted-foreground",
			children: label
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 136,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
			id,
			type,
			value,
			placeholder,
			autoComplete: "off",
			onChange: (e) => onChange(e.target.value)
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 139,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 135,
		columnNumber: 5
	}, this);
}
function ClienteFieldsGrid({ prefix, value, onChange }) {
	const set = (k) => (v) => onChange({
		...value,
		[k]: v
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				id: `${prefix}-name`,
				label: "Nombre completo",
				value: value.fullName,
				onChange: set("fullName")
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 163,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				id: `${prefix}-phone`,
				label: "Teléfono",
				value: value.phone,
				onChange: set("phone")
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 169,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				id: `${prefix}-email`,
				label: "Correo (opcional)",
				type: "email",
				value: value.email,
				onChange: set("email")
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 170,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				id: `${prefix}-city`,
				label: "Ciudad (opcional)",
				value: value.city,
				onChange: set("city")
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 177,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				id: `${prefix}-state`,
				label: "Estado (opcional)",
				value: value.state,
				onChange: set("state")
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 183,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				id: `${prefix}-zip`,
				label: "Código postal (opcional)",
				value: value.zip,
				onChange: set("zip")
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 189,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 162,
		columnNumber: 5
	}, this);
}
function BillingFieldsGrid({ prefix, value, onChange }) {
	const set = (k) => (v) => onChange({
		...value,
		[k]: v
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				id: `${prefix}-legal`,
				label: "Razón social",
				value: value.legalName,
				onChange: set("legalName")
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 211,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				id: `${prefix}-rfc`,
				label: "RFC",
				value: value.rfc,
				onChange: set("rfc")
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 217,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				id: `${prefix}-regime`,
				label: "Régimen fiscal",
				value: value.taxRegime,
				onChange: set("taxRegime")
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 218,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				id: `${prefix}-cfdi`,
				label: "Uso de CFDI",
				value: value.cfdiUse,
				onChange: set("cfdiUse")
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 224,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				id: `${prefix}-zip`,
				label: "CP fiscal",
				value: value.fiscalZip,
				onChange: set("fiscalZip")
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 230,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				id: `${prefix}-bemail`,
				label: "Correo de facturación",
				type: "email",
				value: value.email,
				onChange: set("email")
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 236,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				id: `${prefix}-bphone`,
				label: "Teléfono de facturación",
				value: value.phone,
				onChange: set("phone")
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 243,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				id: `${prefix}-address`,
				label: "Dirección fiscal",
				value: value.fiscalAddress,
				onChange: set("fiscalAddress")
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 249,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 210,
		columnNumber: 5
	}, this);
}
function buildBilling(b) {
	return {
		legalName: b.legalName.trim(),
		rfc: b.rfc.trim(),
		taxRegime: b.taxRegime.trim(),
		cfdiUse: b.cfdiUse.trim(),
		fiscalZip: b.fiscalZip.trim(),
		email: b.email.trim(),
		phone: b.phone.trim(),
		fiscalAddress: b.fiscalAddress.trim()
	};
}
/** Generador de ventas hechas fuera de la página. */
function NuevaVentaSection() {
	const createSale = useServerFn(crmCreateSale);
	const lookup = useServerFn(crmLookupCustomer);
	const queryClient = useQueryClient();
	const [cliente, setCliente] = import_react.useState(EMPTY_CLIENTE);
	const [lines, setLines] = import_react.useState([{
		variantId: DEFAULT_VARIANT?.id ?? "",
		customName: "",
		quantity: 1,
		unitPrice: DEFAULT_VARIANT?.price ?? 0,
		renewal: { ...EMPTY_RENEWAL }
	}]);
	const [shippingId, setShippingId] = import_react.useState("local");
	const [channel, setChannel] = import_react.useState("WhatsApp");
	const [status, setStatus] = import_react.useState("vendido");
	const [notes, setNotes] = import_react.useState("");
	const [wantsInvoice, setWantsInvoice] = import_react.useState(false);
	const [addIva, setAddIva] = import_react.useState(false);
	const [billing, setBilling] = import_react.useState(EMPTY_BILLING);
	const [result, setResult] = import_react.useState(null);
	const shipping = SHIPPING_OPTIONS.find((s) => s.id === shippingId);
	const productsTotal = lines.reduce((sum, l) => {
		return sum + l.unitPrice * l.quantity;
	}, 0);
	const subtotal = productsTotal + shipping.price;
	const iva = addIva ? Math.round(subtotal * IVA_RATE * 100) / 100 : 0;
	const total = subtotal + iva;
	const lookupMutation = useMutation({
		mutationFn: (n) => lookup({ data: { customerNumber: n } }),
		onSuccess: (res) => {
			const c = res.customer;
			if (!c) {
				toast.info("No existe ese número; se creará un cliente nuevo.");
				return;
			}
			setCliente({
				customerNumber: String(c.customer_number),
				fullName: c.full_name ?? "",
				phone: c.phone ?? "",
				email: c.email ?? c.contact?.email ?? "",
				city: c.contact?.city ?? "",
				state: c.contact?.state ?? "",
				zip: c.contact?.zip ?? ""
			});
			if (c.billing) setBilling({
				...EMPTY_BILLING,
				...c.billing
			});
			toast.success(`Cliente #${c.customer_number} cargado`);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo consultar el cliente")
	});
	const mutation = useMutation({
		mutationFn: () => createSale({ data: {
			customerNumber: cliente.customerNumber ? Number(cliente.customerNumber) : null,
			fullName: cliente.fullName.trim(),
			phone: cliente.phone.trim(),
			email: cliente.email.trim() ? cliente.email.trim() : null,
			city: cliente.city.trim(),
			state: cliente.state.trim(),
			zip: cliente.zip.trim(),
			items: lines.map((l) => ({
				variantId: l.variantId,
				customName: l.customName,
				quantity: l.quantity,
				unitPrice: l.unitPrice,
				renewal: renewalFieldsFor(l.variantId).length > 0 ? l.renewal : null
			})),
			shippingId,
			wantsInvoice,
			billing: wantsInvoice ? buildBilling(billing) : null,
			status,
			addIva,
			notes: notes.trim() ? notes.trim() : null,
			channel
		} }),
		onSuccess: (res) => {
			setResult({
				orderId: res.orderId,
				customerNumber: res.customerNumber
			});
			toast.success(`Venta registrada · cliente #${res.customerNumber}`);
			setCliente(EMPTY_CLIENTE);
			setBilling(EMPTY_BILLING);
			setWantsInvoice(false);
			setAddIva(false);
			setNotes("");
			setLines([{
				variantId: DEFAULT_VARIANT?.id ?? "",
				customName: "",
				quantity: 1,
				unitPrice: DEFAULT_VARIANT?.price ?? 0,
				renewal: { ...EMPTY_RENEWAL }
			}]);
			queryClient.invalidateQueries({ queryKey: ["crm-solicitudes"] });
			queryClient.invalidateQueries({ queryKey: ["crm-customers"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo registrar la venta")
	});
	const canSubmit = cliente.fullName.trim().length > 1 && cliente.phone.trim().length > 6 && lines.length > 0 && lines.every((l) => l.variantId !== CUSTOM_ID || l.customName.trim().length > 1) && (!wantsInvoice || billing.legalName.trim() && billing.rfc.trim()) && !mutation.isPending;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "space-y-4 rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "text-base text-foreground",
						children: "Registrar venta fuera de la página"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 396,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-muted-foreground",
						children: "Captura ventas hechas por WhatsApp, teléfono o mostrador; se guardan en la bitácora y en el historial del cliente."
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 397,
						columnNumber: 11
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 395,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
								htmlFor: "venta-num",
								className: "text-xs text-muted-foreground",
								children: "Número de cliente (opcional)"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 405,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "venta-num",
									value: cliente.customerNumber,
									autoComplete: "off",
									placeholder: "Ej. 1024",
									onChange: (e) => setCliente({
										...cliente,
										customerNumber: e.target.value.replace(/\D/g, "")
									})
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 409,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "button",
									variant: "outline",
									disabled: !cliente.customerNumber || lookupMutation.isPending,
									onClick: () => lookupMutation.mutate(Number(cliente.customerNumber)),
									children: "Cargar"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 418,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 408,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 404,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
								className: "text-xs text-muted-foreground",
								children: "Canal de la venta"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 429,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-wrap gap-2",
								children: CHANNELS.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "button",
									size: "sm",
									variant: channel === c ? "default" : "outline",
									onClick: () => setChannel(c),
									children: c
								}, c, false, {
									fileName: _jsxFileName$3,
									lineNumber: 432,
									columnNumber: 17
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 430,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 428,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 403,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ClienteFieldsGrid, {
						prefix: "venta",
						value: cliente,
						onChange: setCliente
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 446,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 394,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "space-y-4 rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
						className: "text-sm uppercase tracking-wide text-primary",
						children: "Productos"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 450,
						columnNumber: 9
					}, this),
					lines.map((line, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px_100px_auto] sm:items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs text-muted-foreground",
										children: "Producto"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 457,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
										value: line.variantId,
										onChange: (e) => {
											const selected = findVariant(e.target.value);
											setLines(lines.map((l, i) => i === index ? {
												...l,
												variantId: e.target.value,
												unitPrice: e.target.value === CUSTOM_ID ? l.unitPrice : selected?.variant.price ?? l.unitPrice
											} : l));
										},
										className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground",
										children: [PRODUCTS.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("optgroup", {
											label: p.title,
											children: p.variants.map((v) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
												value: v.id,
												children: [
													v.name,
													" — ",
													formatMxn(v.price)
												]
											}, v.id, true, {
												fileName: _jsxFileName$3,
												lineNumber: 482,
												columnNumber: 23
											}, this))
										}, p.id, false, {
											fileName: _jsxFileName$3,
											lineNumber: 480,
											columnNumber: 19
										}, this)), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: CUSTOM_ID,
											children: "Producto personalizado (nombre e importe libres)"
										}, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 488,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 458,
										columnNumber: 15
									}, this),
									line.variantId === CUSTOM_ID && /* @__PURE__ */ (void 0)(Input, {
										className: "mt-2",
										autoComplete: "off",
										placeholder: "Nombre del producto o servicio",
										value: line.customName,
										onChange: (e) => setLines(lines.map((l, i) => i === index ? {
											...l,
											customName: e.target.value
										} : l))
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 491,
										columnNumber: 17
									}, this),
									renewalFieldsFor(line.variantId).length > 0 && /* @__PURE__ */ (void 0)("div", {
										className: "mt-2 space-y-2 rounded-md border border-border/60 bg-muted/30 p-3",
										children: [/* @__PURE__ */ (void 0)("p", {
											className: "text-[11px] uppercase tracking-wide text-muted-foreground",
											children: [
												"Datos de la renovación (",
												renewalMeta(line.variantId)?.platform,
												" ·",
												" ",
												renewalMeta(line.variantId)?.period === "monthly" ? "mensual" : "anual",
												")"
											]
										}, void 0, true, {
											fileName: _jsxFileName$3,
											lineNumber: 505,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "grid gap-2 sm:grid-cols-2",
											children: renewalFieldsFor(line.variantId).map((field) => /* @__PURE__ */ (void 0)(Field, {
												id: `venta-renov-${index}-${field}`,
												label: RENEWAL_LABELS[field],
												value: line.renewal[field],
												onChange: (v) => setLines(lines.map((l, i) => i === index ? {
													...l,
													renewal: {
														...l.renewal,
														[field]: v
													}
												} : l))
											}, field, false, {
												fileName: _jsxFileName$3,
												lineNumber: 511,
												columnNumber: 23
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 509,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 504,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 456,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Precio unitario"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 530,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									type: "number",
									min: 0,
									max: 1e7,
									step: "0.01",
									value: line.unitPrice,
									onChange: (e) => setLines(lines.map((l, i) => i === index ? {
										...l,
										unitPrice: Math.max(0, Math.min(1e7, Number(e.target.value) || 0))
									} : l))
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 531,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 529,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Cantidad"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 555,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									type: "number",
									min: 1,
									max: 100,
									value: line.quantity,
									onChange: (e) => setLines(lines.map((l, i) => i === index ? {
										...l,
										quantity: Math.max(1, Math.min(100, Number(e.target.value) || 1))
									} : l))
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 556,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 554,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "button",
								variant: "outline",
								disabled: lines.length === 1,
								onClick: () => setLines(lines.filter((_, i) => i !== index)),
								children: "Quitar"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 575,
								columnNumber: 13
							}, this)
						]
					}, index, true, {
						fileName: _jsxFileName$3,
						lineNumber: 452,
						columnNumber: 11
					}, this)),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						onClick: () => setLines([...lines, {
							variantId: DEFAULT_VARIANT?.id ?? "",
							customName: "",
							quantity: 1,
							unitPrice: DEFAULT_VARIANT?.price ?? 0,
							renewal: { ...EMPTY_RENEWAL }
						}]),
						children: "Agregar producto"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 585,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							className: "text-xs text-muted-foreground",
							children: "Entrega"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 606,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap gap-2",
							children: SHIPPING_OPTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "button",
								size: "sm",
								variant: shippingId === s.id ? "default" : "outline",
								onClick: () => setShippingId(s.id),
								children: [
									s.label,
									" ",
									s.price > 0 ? `(+${formatMxn(s.price)})` : ""
								]
							}, s.id, true, {
								fileName: _jsxFileName$3,
								lineNumber: 609,
								columnNumber: 15
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 607,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 605,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border border-primary/40 bg-primary/5 p-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "flex justify-between text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Productos" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 624,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-foreground",
									children: formatMxn(productsTotal)
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 625,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 623,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "flex justify-between text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Entrega" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 628,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-foreground",
									children: formatMxn(shipping.price)
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 629,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 627,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "flex items-center gap-2 pt-1 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									type: "checkbox",
									checked: addIva,
									onChange: (e) => setAddIva(e.target.checked),
									className: "h-4 w-4 accent-primary"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 632,
									columnNumber: 13
								}, this), "Agregar IVA (16%)"]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 631,
								columnNumber: 11
							}, this),
							addIva ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "flex justify-between text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "IVA" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 642,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-foreground",
									children: formatMxn(iva)
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 643,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 641,
								columnNumber: 13
							}, this) : null,
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-2 flex justify-between border-t border-border pt-2 text-base",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-foreground",
									children: addIva ? "Total con IVA" : "Total (IVA incluido)"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 647,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-semibold text-foreground",
									children: formatMxn(total)
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 650,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 646,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 622,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 449,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "space-y-4 rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "flex items-center gap-3 text-sm text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							type: "checkbox",
							checked: wantsInvoice,
							onChange: (e) => setWantsInvoice(e.target.checked),
							className: "h-4 w-4 accent-primary"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 657,
							columnNumber: 11
						}, this), "El cliente pidió factura"]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 656,
						columnNumber: 9
					}, this),
					wantsInvoice ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BillingFieldsGrid, {
						prefix: "venta",
						value: billing,
						onChange: setBilling
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 666,
						columnNumber: 11
					}, this) : null,
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							className: "text-xs text-muted-foreground",
							children: "Estado de la venta"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 670,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								"vendido",
								"pendiente",
								"no_vendido"
							].map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "button",
								size: "sm",
								variant: status === s ? "default" : "outline",
								onClick: () => setStatus(s),
								children: s === "no_vendido" ? "No vendido" : s === "vendido" ? "Vendido" : "Pendiente"
							}, s, false, {
								fileName: _jsxFileName$3,
								lineNumber: 673,
								columnNumber: 15
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 671,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 669,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "venta-notes",
							className: "text-xs text-muted-foreground",
							children: "Notas internas"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 687,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
							id: "venta-notes",
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							rows: 3,
							className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground",
							placeholder: "Forma de pago, fecha de instalación, acuerdos…"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 690,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 686,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						disabled: !canSubmit,
						onClick: () => mutation.mutate(),
						children: mutation.isPending ? "Guardando…" : "Registrar venta"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 700,
						columnNumber: 9
					}, this),
					result ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-primary",
						children: [
							"Venta ",
							result.orderId,
							" registrada para el cliente #",
							result.customerNumber,
							"."
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 705,
						columnNumber: 11
					}, this) : null
				]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 655,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 393,
		columnNumber: 5
	}, this);
}
/** Registro manual de clientes sin venta asociada. */
function RegistrarClienteSection() {
	const saveCustomer = useServerFn(crmSaveCustomer);
	const lookup = useServerFn(crmLookupCustomer);
	const queryClient = useQueryClient();
	const [cliente, setCliente] = import_react.useState(EMPTY_CLIENTE);
	const [withBilling, setWithBilling] = import_react.useState(false);
	const [billing, setBilling] = import_react.useState(EMPTY_BILLING);
	const [created, setCreated] = import_react.useState(null);
	const lookupMutation = useMutation({
		mutationFn: (n) => lookup({ data: { customerNumber: n } }),
		onSuccess: (res) => {
			const c = res.customer;
			if (!c) {
				toast.info("No existe ese número; se creará como nuevo.");
				return;
			}
			setCliente({
				customerNumber: String(c.customer_number),
				fullName: c.full_name ?? "",
				phone: c.phone ?? "",
				email: c.email ?? c.contact?.email ?? "",
				city: c.contact?.city ?? "",
				state: c.contact?.state ?? "",
				zip: c.contact?.zip ?? ""
			});
			if (c.billing) {
				setBilling({
					...EMPTY_BILLING,
					...c.billing
				});
				setWithBilling(true);
			}
			toast.success(`Cliente #${c.customer_number} cargado`);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo consultar el cliente")
	});
	const mutation = useMutation({
		mutationFn: () => saveCustomer({ data: {
			customerNumber: cliente.customerNumber ? Number(cliente.customerNumber) : null,
			fullName: cliente.fullName.trim(),
			phone: cliente.phone.trim(),
			email: cliente.email.trim() ? cliente.email.trim() : null,
			city: cliente.city.trim(),
			state: cliente.state.trim(),
			zip: cliente.zip.trim(),
			billing: withBilling ? buildBilling(billing) : null
		} }),
		onSuccess: (res) => {
			setCreated({
				customerNumber: res.customerNumber,
				isNew: res.isNew
			});
			toast.success(res.isNew ? `Cliente #${res.customerNumber} registrado` : `Cliente #${res.customerNumber} actualizado`);
			setCliente(EMPTY_CLIENTE);
			setBilling(EMPTY_BILLING);
			setWithBilling(false);
			queryClient.invalidateQueries({ queryKey: ["crm-customers"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo guardar el cliente")
	});
	const canSubmit = cliente.fullName.trim().length > 1 && cliente.phone.trim().length > 6 && (!withBilling || billing.legalName.trim() && billing.rfc.trim()) && !mutation.isPending;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "space-y-4 rounded-xl border border-border bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "text-base text-foreground",
					children: "Registrar cliente"
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 794,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: "Da de alta un cliente sin venta. Si dejas el número vacío se genera uno automáticamente."
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 795,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 793,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-1.5 sm:max-w-xs",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
						htmlFor: "cli-num",
						className: "text-xs text-muted-foreground",
						children: "Número de cliente (opcional)"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 801,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							id: "cli-num",
							value: cliente.customerNumber,
							autoComplete: "off",
							placeholder: "Ej. 1024",
							onChange: (e) => setCliente({
								...cliente,
								customerNumber: e.target.value.replace(/\D/g, "")
							})
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 805,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							type: "button",
							variant: "outline",
							disabled: !cliente.customerNumber || lookupMutation.isPending,
							onClick: () => lookupMutation.mutate(Number(cliente.customerNumber)),
							children: "Cargar"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 814,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 804,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 800,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ClienteFieldsGrid, {
					prefix: "cli",
					value: cliente,
					onChange: setCliente
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 825,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
					className: "flex items-center gap-3 text-sm text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
						type: "checkbox",
						checked: withBilling,
						onChange: (e) => setWithBilling(e.target.checked),
						className: "h-4 w-4 accent-primary"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 828,
						columnNumber: 11
					}, this), "Guardar datos de facturación"]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 827,
					columnNumber: 9
				}, this),
				withBilling ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BillingFieldsGrid, {
					prefix: "cli",
					value: billing,
					onChange: setBilling
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 837,
					columnNumber: 11
				}, this) : null,
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					disabled: !canSubmit,
					onClick: () => mutation.mutate(),
					children: mutation.isPending ? "Guardando…" : "Guardar cliente"
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 840,
					columnNumber: 9
				}, this),
				created ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-primary",
					children: [
						created.isNew ? "Alta creada" : "Datos actualizados",
						" · cliente #",
						created.customerNumber
					]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 845,
					columnNumber: 11
				}, this) : null
			]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 792,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 791,
		columnNumber: 5
	}, this);
}
/** Editor de datos de un cliente existente. */
function EditarClienteDialog({ customer, open, onOpenChange }) {
	const updateCustomer = useServerFn(crmUpdateCustomer);
	const queryClient = useQueryClient();
	const [cliente, setCliente] = import_react.useState(EMPTY_CLIENTE);
	const [withBilling, setWithBilling] = import_react.useState(false);
	const [billing, setBilling] = import_react.useState(EMPTY_BILLING);
	import_react.useEffect(() => {
		if (!customer) return;
		const contact = customer.contact ?? {};
		setCliente({
			customerNumber: String(customer.customer_number ?? ""),
			fullName: customer.full_name ?? "",
			phone: customer.phone ?? "",
			email: customer.email ?? contact["email"] ?? "",
			city: contact["city"] ?? "",
			state: contact["state"] ?? "",
			zip: contact["zip"] ?? ""
		});
		const hasBilling = customer.billing && Object.keys(customer.billing).length > 0;
		setBilling(hasBilling ? {
			...EMPTY_BILLING,
			...customer.billing
		} : EMPTY_BILLING);
		setWithBilling(Boolean(hasBilling));
	}, [customer]);
	const mutation = useMutation({
		mutationFn: () => updateCustomer({ data: {
			customerNumber: Number(cliente.customerNumber),
			fullName: cliente.fullName.trim(),
			phone: cliente.phone.trim(),
			email: cliente.email.trim() ? cliente.email.trim() : null,
			city: cliente.city.trim(),
			state: cliente.state.trim(),
			zip: cliente.zip.trim(),
			billing: withBilling ? buildBilling(billing) : null
		} }),
		onSuccess: (res) => {
			toast.success(`Cliente #${res.customerNumber} actualizado`);
			queryClient.invalidateQueries({ queryKey: ["crm-customers"] });
			queryClient.invalidateQueries({ queryKey: ["crm-clientes"] });
			onOpenChange(false);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo actualizar el cliente")
	});
	const canSubmit = cliente.fullName.trim().length > 1 && cliente.phone.trim().length > 6 && (!withBilling || billing.legalName.trim() && billing.rfc.trim()) && !mutation.isPending;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
			className: "max-h-[85vh] max-w-2xl overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: ["Editar cliente #", cliente.customerNumber] }, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 923,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: "Actualiza contacto y facturación. El historial de compras no se modifica." }, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 924,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 922,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ClienteFieldsGrid, {
						prefix: "edit",
						value: cliente,
						onChange: setCliente
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 930,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "flex items-center gap-3 text-sm text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							type: "checkbox",
							checked: withBilling,
							onChange: (e) => setWithBilling(e.target.checked),
							className: "h-4 w-4 accent-primary"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 933,
							columnNumber: 13
						}, this), "Guardar datos de facturación"]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 932,
						columnNumber: 11
					}, this),
					withBilling ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BillingFieldsGrid, {
						prefix: "edit",
						value: billing,
						onChange: setBilling
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 942,
						columnNumber: 13
					}, this) : null,
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex justify-end gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => onOpenChange(false),
							children: "Cancelar"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 946,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							disabled: !canSubmit,
							onClick: () => mutation.mutate(),
							children: mutation.isPending ? "Guardando…" : "Guardar cambios"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 949,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 945,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 929,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 921,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 920,
		columnNumber: 5
	}, this);
}
var _jsxFileName$2 = "/app/applet/src/components/crm-demo-users.tsx";
var DEMO_PASSWORD = "Abc2026+";
var PLATFORM_LABEL$1 = {
	wialon_lite: "Wialon Lite (ORB-LITE)",
	wialon_full: "Wialon Full (ORB-FULL)"
};
function UsuariosDemoSection() {
	const queryClient = useQueryClient();
	const list = useServerFn(crmListDemoUsers);
	const create = useServerFn(crmCreateDemoUser);
	const remove = useServerFn(crmDeleteDemoUser);
	const [customerNumber, setCustomerNumber] = import_react.useState("");
	const [fullName, setFullName] = import_react.useState("");
	const [company, setCompany] = import_react.useState("");
	const [platform, setPlatform] = import_react.useState("wialon_lite");
	const [notes, setNotes] = import_react.useState("");
	const [email, setEmail] = import_react.useState("");
	const query = useQuery({
		queryKey: ["crm-demo-users"],
		queryFn: () => list()
	});
	const creation = useMutation({
		mutationFn: () => create({ data: {
			customerNumber: customerNumber.trim() ? Number(customerNumber) : null,
			fullName,
			company: company.trim() || null,
			platform,
			notes: notes.trim() || null,
			email: email.trim() || null
		} }),
		onSuccess: (res) => {
			toast.success(`Usuario demo creado: ${res?.user?.username} · ${DEMO_PASSWORD}`);
			if (res?.emailSent) toast.success(`Folleto de acceso enviado a ${res.emailTo}`);
			else if (res?.emailReason) toast.warning(`Correo no enviado: ${res.emailReason}`);
			else if (!res?.emailTo) toast.info("Sin correo del cliente: no se envió el folleto");
			setCustomerNumber("");
			setFullName("");
			setCompany("");
			setNotes("");
			setEmail("");
			queryClient.invalidateQueries({ queryKey: ["crm-demo-users"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo crear el usuario demo")
	});
	const deletion = useMutation({
		mutationFn: (id) => remove({ data: { id } }),
		onSuccess: () => {
			toast.success("Usuario demo borrado");
			queryClient.invalidateQueries({ queryKey: ["crm-demo-users"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo borrar el usuario demo")
	});
	const preview = fullName.trim() ? buildDemoUsername(fullName, company || null) : "";
	const rows = query.data?.rows ?? [];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "font-display text-xl text-foreground",
					children: "Usuarios demo Wialon"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 84,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Genera el usuario para crear la cuenta demo en Wialon Lite o Wialon Full. Uno por cliente; la contraseña siempre es ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-mono",
							children: DEMO_PASSWORD
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 87,
							columnNumber: 36
						}, this),
						"."
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 85,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 83,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
				className: "space-y-4 rounded-2xl border border-border bg-card p-5",
				onSubmit: (e) => {
					e.preventDefault();
					creation.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "demo-nombre",
									children: "Nombre y apellido del cliente"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 100,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "demo-nombre",
									value: fullName,
									onChange: (e) => setFullName(e.target.value),
									placeholder: "John Doe",
									required: true
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 101,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 99,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "demo-empresa",
									children: "Empresa o razón social (opcional)"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 110,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "demo-empresa",
									value: company,
									onChange: (e) => setCompany(e.target.value),
									placeholder: "Transportes ABC"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 111,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 109,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "demo-cliente",
									children: "Número de cliente (opcional)"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 119,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "demo-cliente",
									inputMode: "numeric",
									value: customerNumber,
									onChange: (e) => setCustomerNumber(e.target.value.replace(/[^0-9]/g, "")),
									placeholder: "500"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 120,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 118,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Plataforma solicitada" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 129,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex gap-2",
									children: ["wialon_lite", "wialon_full"].map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										type: "button",
										size: "sm",
										variant: platform === p ? "default" : "outline",
										onClick: () => setPlatform(p),
										children: PLATFORM_LABEL$1[p]
									}, p, false, {
										fileName: _jsxFileName$2,
										lineNumber: 132,
										columnNumber: 17
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 130,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 128,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "demo-email",
									children: "Correo del cliente (para enviar el folleto de acceso)"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 145,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "demo-email",
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "john.doe@example.com — si lo dejas vacío se usa el del cliente registrado"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 148,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 144,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "demo-notas",
									children: "Notas internas (opcional)"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 157,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "demo-notas",
									value: notes,
									onChange: (e) => setNotes(e.target.value),
									placeholder: "Demo por 7 días, 1 unidad"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 158,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 156,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 98,
						columnNumber: 9
					}, this),
					preview ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"Usuario propuesto: ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-mono text-foreground",
								children: preview
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 169,
								columnNumber: 32
							}, this),
							" · contraseña ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-mono text-foreground",
								children: DEMO_PASSWORD
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 170,
								columnNumber: 24
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 168,
						columnNumber: 11
					}, this) : null,
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						type: "submit",
						disabled: creation.isPending,
						children: creation.isPending ? "Generando…" : "Generar usuario demo"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 174,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 91,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
					className: "text-sm font-medium text-foreground",
					children: "Usuarios demo generados"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 180,
					columnNumber: 9
				}, this), query.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: "Cargando…"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 182,
					columnNumber: 11
				}, this) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: "Aún no hay usuarios demo."
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 184,
					columnNumber: 11
				}, this) : rows.map((row) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-mono text-foreground",
								children: [
									row.username,
									" · ",
									row.password
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 192,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-muted-foreground",
								children: [
									row.full_name,
									row.company ? ` · ${row.company}` : "",
									row.customer_number ? ` · Cliente #${row.customer_number}` : ""
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 195,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: [PLATFORM_LABEL$1[row.platform] ?? row.platform, row.notes ? ` · ${row.notes}` : ""]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 200,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 191,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => {
								navigator.clipboard?.writeText(`${row.username} / ${row.password}`);
								toast.success("Usuario copiado");
							},
							children: "Copiar"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 206,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: "destructive",
							onClick: () => deletion.mutate(row.id),
							disabled: deletion.isPending,
							children: "Borrar"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 216,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 205,
						columnNumber: 15
					}, this)]
				}, row.id, true, {
					fileName: _jsxFileName$2,
					lineNumber: 187,
					columnNumber: 13
				}, this))]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 179,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 82,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/crm-demo-requests.tsx";
var PLATFORM_LABEL = {
	wialon_lite: "ORB-LITE (Wialon Lite)",
	wialon_full: "ORB-FULL (Wialon Full)"
};
function fecha(v) {
	if (!v) return "—";
	return new Date(v).toLocaleString("es-MX", {
		dateStyle: "medium",
		timeStyle: "short"
	});
}
function SolicitudesDemoSection() {
	const queryClient = useQueryClient();
	const list = useServerFn(crmListDemoRequests);
	const send = useServerFn(crmSendDemoRequest);
	const remove = useServerFn(crmDeleteDemoRequest);
	const [filter, setFilter] = import_react.useState("pendiente");
	const [customerNumbers, setCustomerNumbers] = import_react.useState({});
	const query = useQuery({
		queryKey: ["crm-demo-requests"],
		queryFn: () => list(),
		refetchInterval: 3e4
	});
	const sending = useMutation({
		mutationFn: (vars) => send({ data: {
			id: vars.id,
			customerNumber: vars.customerNumber,
			platform: vars.platform
		} }),
		onSuccess: (res) => {
			if (res?.emailSent) toast.success(`Datos enviados · usuario ${res.username}`);
			else toast.warning(`Usuario ${res?.username} creado, correo no enviado: ${res?.emailReason}`);
			queryClient.invalidateQueries({ queryKey: ["crm-demo-requests"] });
			queryClient.invalidateQueries({ queryKey: ["crm-demo-users"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudieron enviar los datos")
	});
	const deletion = useMutation({
		mutationFn: (id) => remove({ data: { id } }),
		onSuccess: () => {
			toast.success("Solicitud de demo borrada");
			queryClient.invalidateQueries({ queryKey: ["crm-demo-requests"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo borrar")
	});
	const rows = query.data?.rows ?? [];
	const pendientes = rows.filter((r) => r.status === "pendiente").length;
	const visible = filter === "todas" ? rows : rows.filter((r) => r.status === filter);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "font-display text-xl text-foreground",
					children: "Solicitudes de demo"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 69,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: ["Llegan desde la página. El correo con usuario y contraseña se envía solo cuando presionas “Enviar datos”. Pendientes: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
						className: "text-foreground",
						children: pendientes
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 72,
						columnNumber: 39
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 70,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 68,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex gap-2",
				children: [
					"pendiente",
					"enviado",
					"todas"
				].map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					size: "sm",
					variant: filter === f ? "default" : "outline",
					onClick: () => setFilter(f),
					children: f === "pendiente" ? "Pendientes" : f === "enviado" ? "Enviadas" : "Todas"
				}, f, false, {
					fileName: _jsxFileName$1,
					lineNumber: 78,
					columnNumber: 11
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 76,
				columnNumber: 7
			}, this),
			query.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground",
				children: "Cargando…"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 90,
				columnNumber: 9
			}, this) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground",
				children: "No hay solicitudes en este filtro."
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 92,
				columnNumber: 9
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-3",
				children: visible.map((row) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
					className: "space-y-3 rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "font-medium text-foreground",
									children: [
										row.first_name,
										" ",
										row.last_name,
										row.company ? ` · ${row.company}` : ""
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 99,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-muted-foreground",
									children: [
										row.phone,
										" · ",
										row.email
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 103,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										PLATFORM_LABEL[row.platform] ?? row.platform,
										row.units ? ` · ${row.units} unidades` : "",
										" · ",
										fecha(row.created_at)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 106,
									columnNumber: 19
								}, this),
								row.message ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"“",
										row.message,
										"”"
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 111,
									columnNumber: 21
								}, this) : null
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 98,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: `rounded-full px-3 py-1 text-xs uppercase tracking-wide ${row.status === "enviado" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`,
							children: row.status === "enviado" ? "Datos enviados" : "Pendiente"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 114,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 97,
						columnNumber: 15
					}, this), row.status === "enviado" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"Usuario ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-mono text-foreground",
								children: row.demo_username
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 127,
								columnNumber: 27
							}, this),
							" · contraseña ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-mono text-foreground",
								children: "Abc2026+"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 128,
								columnNumber: 30
							}, this),
							" · enviado",
							" ",
							fecha(row.sent_at)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 126,
						columnNumber: 17
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap items-end gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-xs text-muted-foreground",
								children: ["Número de cliente (opcional)", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									className: "mt-1 w-40",
									inputMode: "numeric",
									value: customerNumbers[row.id] ?? "",
									onChange: (e) => setCustomerNumbers((prev) => ({
										...prev,
										[row.id]: e.target.value.replace(/[^0-9]/g, "")
									})),
									placeholder: "500"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 135,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 133,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								disabled: sending.isPending,
								onClick: () => sending.mutate({
									id: row.id,
									customerNumber: customerNumbers[row.id] ? Number(customerNumbers[row.id]) : null,
									platform: row.platform
								}),
								children: sending.isPending ? "Enviando…" : "Enviar datos"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 148,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								variant: "destructive",
								disabled: deletion.isPending,
								onClick: () => {
									if (confirm("¿Borrar esta solicitud de demo?")) deletion.mutate(row.id);
								},
								children: "Borrar"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 163,
								columnNumber: 19
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 132,
						columnNumber: 17
					}, this)]
				}, row.id, true, {
					fileName: _jsxFileName$1,
					lineNumber: 96,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 94,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 67,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/_authenticated/crm.tsx?tsr-split=component";
function CrmPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const list = useServerFn(crmListSolicitudes);
	const update = useServerFn(crmUpdateSolicitud);
	const [filter, setFilter] = import_react.useState("pendiente");
	const [page, setPage] = import_react.useState(1);
	const [selectedRow, setSelectedRow] = import_react.useState(null);
	const [tab, setTab] = import_react.useState("solicitudes");
	const PAGE_SIZE = 10;
	import_react.useEffect(() => {
		setPage(1);
	}, [filter]);
	const query = useQuery({
		queryKey: ["crm-solicitudes"],
		queryFn: () => list({ data: { status: "todas" } }),
		refetchInterval: 15e3
	});
	const mutation = useMutation({
		mutationFn: (vars) => update({ data: vars }),
		onSuccess: () => {
			toast.success("Solicitud actualizada");
			queryClient.invalidateQueries({ queryKey: ["crm-solicitudes"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Error al actualizar")
	});
	const rows = query.data?.rows ?? [];
	const stats = import_react.useMemo(() => {
		const base = {
			pendiente: {
				count: 0,
				total: 0
			},
			vendido: {
				count: 0,
				total: 0
			},
			no_vendido: {
				count: 0,
				total: 0
			}
		};
		for (const r of rows) {
			const key = r.status ?? "pendiente";
			if (!base[key]) continue;
			base[key].count += 1;
			base[key].total += Number(r.total ?? 0);
		}
		return base;
	}, [rows]);
	const totalCount = rows.length;
	const totalValue = rows.reduce((s, r) => s + Number(r.total ?? 0), 0);
	const visible = filter === "todas" ? rows : rows.filter((r) => r.status === filter);
	const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);
	const paginated = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
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
			className: "mx-auto max-w-4xl space-y-7",
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
								lineNumber: 98,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "font-display text-2xl text-foreground",
								children: "Solicitudes"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 99,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-sm text-muted-foreground",
								children: "Resumen y control de estado de todos los pedidos solicitados."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 100,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 97,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/clientes",
									children: "Panel de clientes"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 106,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 105,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/renovaciones",
									children: "Renovaciones"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 109,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 108,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								variant: "outline",
								onClick: signOut,
								children: "Salir"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 111,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 104,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 96,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap gap-2 border-b border-border pb-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: tab === "solicitudes" ? "default" : "ghost",
							onClick: () => setTab("solicitudes"),
							children: "Solicitudes"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 118,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: tab === "clientes" ? "default" : "ghost",
							onClick: () => setTab("clientes"),
							children: "Clientes"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 121,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: tab === "nueva-venta" ? "default" : "ghost",
							onClick: () => setTab("nueva-venta"),
							children: "Nueva venta"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 124,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: tab === "registrar-cliente" ? "default" : "ghost",
							onClick: () => setTab("registrar-cliente"),
							children: "Registrar cliente"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 127,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: tab === "solicitudes-demo" ? "default" : "ghost",
							onClick: () => setTab("solicitudes-demo"),
							children: "Solicitudes demo"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: tab === "usuarios-demo" ? "default" : "ghost",
							onClick: () => setTab("usuarios-demo"),
							children: "Usuarios demo"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 133,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 117,
					columnNumber: 9
				}, this),
				tab === "solicitudes" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
								label: "Pendientes",
								count: stats.pendiente.count,
								total: stats.pendiente.total,
								highlight: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 140,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
								label: "Vendidos",
								count: stats.vendido.count,
								total: stats.vendido.total
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 141,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
								label: "No vendidos",
								count: stats.no_vendido.count,
								total: stats.no_vendido.total
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 142,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
								label: "Total de pedidos",
								count: totalCount,
								total: totalValue
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 143,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 139,
						columnNumber: 13
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
							children: s === "todas" ? `Todas (${totalCount})` : `${STATUS_LABEL[s]} (${stats[s].count})`
						}, s, false, {
							fileName: _jsxFileName,
							lineNumber: 147,
							columnNumber: 84
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 146,
						columnNumber: 13
					}, this),
					query.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-muted-foreground",
						children: "Cargando…"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 152,
						columnNumber: 32
					}, this) : query.isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-destructive",
						children: "No se pudieron cargar las solicitudes. Verifica que iniciaste sesión con ventas@orb-lite.com."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 152,
						columnNumber: 109
					}, this) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-muted-foreground",
						children: "No hay solicitudes en este filtro."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 155,
						columnNumber: 45
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-4",
						children: [
							paginated.map((row) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SolicitudCard, {
								row,
								pending: mutation.isPending,
								onSave: (status, notes) => mutation.mutate({
									id: row.id,
									status,
									notes
								}),
								onExpand: () => setSelectedRow(row)
							}, row.id, false, {
								fileName: _jsxFileName,
								lineNumber: 156,
								columnNumber: 39
							}, this)),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SolicitudDetailDialog, {
								row: selectedRow,
								open: !!selectedRow,
								onOpenChange: (open) => {
									if (!open) setSelectedRow(null);
								}
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 161,
								columnNumber: 17
							}, this),
							visible.length > PAGE_SIZE && /* @__PURE__ */ (void 0)("nav", {
								className: "flex flex-wrap items-center justify-between gap-3 pt-2",
								children: [/* @__PURE__ */ (void 0)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Mostrando ",
										paginated.length,
										" de ",
										visible.length
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 165,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (void 0)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => setPage((p) => Math.max(1, p - 1)),
											disabled: safePage <= 1,
											children: "Anterior"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 169,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)("span", {
											className: "px-2 text-sm text-muted-foreground",
											children: [
												"Página ",
												safePage,
												" de ",
												totalPages
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 172,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
											disabled: safePage >= totalPages,
											children: "Siguiente"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 175,
											columnNumber: 23
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 168,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 164,
								columnNumber: 48
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 155,
						columnNumber: 131
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 138,
					columnNumber: 34
				}, this) : tab === "clientes" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CustomersSection, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 181,
					columnNumber: 38
				}, this) : tab === "nueva-venta" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(NuevaVentaSection, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 181,
					columnNumber: 85
				}, this) : tab === "solicitudes-demo" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SolicitudesDemoSection, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 181,
					columnNumber: 138
				}, this) : tab === "usuarios-demo" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UsuariosDemoSection, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 181,
					columnNumber: 193
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RegistrarClienteSection, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 181,
					columnNumber: 219
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 95,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 94,
		columnNumber: 10
	}, this);
}
function StatCard({ label, count, total, highlight }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `rounded-xl border p-4 ${highlight ? "border-primary/60 bg-primary/5" : "border-border bg-card"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-xs uppercase tracking-wide text-muted-foreground",
				children: label
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 197,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "font-display text-2xl text-foreground",
				children: count
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 198,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground",
				children: mxn(total)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 199,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 196,
		columnNumber: 10
	}, this);
}
function CustomersSection() {
	const listCustomers = useServerFn(crmListCustomers);
	const [q, setQ] = import_react.useState("");
	const query = useQuery({
		queryKey: ["crm-customers"],
		queryFn: () => listCustomers({ data: void 0 })
	});
	const rows = query.data?.rows ?? [];
	const term = q.trim().toLowerCase();
	const filtered = term ? rows.filter((c) => [
		c.full_name,
		c.phone,
		c.email,
		String(c.customer_number),
		c.billing?.rfc
	].filter(Boolean).some((v) => String(v).toLowerCase().includes(term))) : rows;
	const totalSpent = rows.reduce((s, c) => s + Number(c.total_spent ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
					label: "Clientes registrados",
					count: rows.length,
					total: totalSpent
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 217,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatCard, {
					label: "Con datos de facturación",
					count: rows.filter((c) => c.billing && Object.keys(c.billing).length > 0).length,
					total: 0
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 218,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 216,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Buscar por nombre, número de cliente, teléfono, correo o RFC",
				className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 221,
				columnNumber: 7
			}, this),
			query.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground",
				children: "Cargando clientes…"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 223,
				columnNumber: 26
			}, this) : query.isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-destructive",
				children: "No se pudieron cargar los clientes."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 223,
				columnNumber: 112
			}, this) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground",
				children: "Sin clientes para esta búsqueda."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 223,
				columnNumber: 218
			}, this) : filtered.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CustomerCard, { customer: c }, c.id, false, {
				fileName: _jsxFileName,
				lineNumber: 223,
				columnNumber: 327
			}, this))
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 215,
		columnNumber: 10
	}, this);
}
function CustomerCard({ customer }) {
	const billing = customer.billing && typeof customer.billing === "object" ? customer.billing : {};
	const contact = customer.contact && typeof customer.contact === "object" ? customer.contact : {};
	const [editing, setEditing] = import_react.useState(false);
	const [confirmDelete, setConfirmDelete] = import_react.useState(false);
	const queryClient = useQueryClient();
	const deleteCustomer = useServerFn(crmDeleteCustomer);
	const removal = useMutation({
		mutationFn: () => deleteCustomer({ data: { customerNumber: customer.customer_number } }),
		onSuccess: (res) => {
			toast.success(`Cliente #${customer.customer_number} eliminado · ${res?.deletedSolicitudes ?? 0} solicitud(es) borrada(s)`);
			setConfirmDelete(false);
			queryClient.invalidateQueries({ queryKey: ["crm-customers"] });
			queryClient.invalidateQueries({ queryKey: ["crm-solicitudes"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo eliminar el cliente")
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
		className: "space-y-3 rounded-xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-primary",
						children: ["Cliente #", customer.customer_number]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 258,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-base text-foreground",
						children: customer.full_name || "Sin nombre"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 259,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-muted-foreground",
						children: [customer.phone || "Sin teléfono", customer.email ? ` · ${customer.email}` : ""]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 260,
						columnNumber: 11
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 257,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-base font-semibold text-foreground",
							children: mxn(Number(customer.total_spent ?? 0))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 267,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: [customer.orders_count ?? 0, " pedido(s)"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 270,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 266,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setEditing(true),
							children: "Editar"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 273,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: "destructive",
							onClick: () => setConfirmDelete(true),
							disabled: removal.isPending,
							children: "Borrar"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 276,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 272,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 265,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 256,
				columnNumber: 7
			}, this),
			confirmDelete ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-2 rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-foreground",
					children: [
						"¿Borrar al cliente #",
						customer.customer_number,
						"? También se borrarán todas sus solicitudes. Esta acción no se puede deshacer."
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 284,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						variant: "destructive",
						onClick: () => removal.mutate(),
						disabled: removal.isPending,
						children: removal.isPending ? "Borrando…" : "Sí, borrar todo"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 289,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setConfirmDelete(false),
						disabled: removal.isPending,
						children: "Cancelar"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 292,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 288,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 283,
				columnNumber: 24
			}, this) : null,
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EditarClienteDialog, {
				customer,
				open: editing,
				onOpenChange: setEditing
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 298,
				columnNumber: 7
			}, this),
			Object.keys(contact).length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-1 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs uppercase tracking-wide text-primary",
					children: "Datos de contacto"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 301,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid gap-1",
					children: Object.entries(contact).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "flex flex-wrap justify-between gap-2 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "capitalize",
							children: k.replace(/_/g, " ")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 304,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-foreground text-right",
							children: String(v ?? "") || "—"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 305,
							columnNumber: 17
						}, this)]
					}, k, true, {
						fileName: _jsxFileName,
						lineNumber: 303,
						columnNumber: 54
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 302,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 300,
				columnNumber: 42
			}, this) : null,
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs uppercase tracking-wide text-primary",
					children: "Datos de facturación"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 311,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid gap-2",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BillingRows, { billing }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 313,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 312,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 310,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Alta:",
					" ",
					new Date(customer.created_at).toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" }),
					customer.last_order_id ? ` · Último pedido #${customer.last_order_id}` : ""
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 317,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 255,
		columnNumber: 10
	}, this);
}
//#endregion
export { CrmPage as component };
