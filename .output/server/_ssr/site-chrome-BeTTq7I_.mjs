import { o as __toESM } from "../_runtime.mjs";
import { t as motion } from "../_libs/framer-motion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as MessageCircle, K as Gift, P as MapPin, R as LoaderCircle, Y as FileText, a as Upload, bt as BadgeCheck, f as ShoppingCart, g as Search, j as Menu, k as Minus, lt as CircleCheck, n as X, o as Truck, s as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as DialogOverlay, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DBzhw_Ly.mjs";
import { a as literalType, i as enumType, l as stringType, n as arrayType, o as numberType, r as booleanType, s as objectType } from "../_libs/zod.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as formatMxn, i as SHIPPING_OPTIONS, l as renewalMeta, n as IVA_RATE, s as findVariant, t as ADD_ONS } from "./catalog-BhuVKh9L.mjs";
import { i as formatFechaEmision, n as constanciaVigente, t as constanciaVenceEl } from "./constancia-validez-DGGWBZS_.mjs";
import { t as openWhatsApp } from "./whatsapp-k5-h86dD.mjs";
import { t as orb_lite_logo_default } from "./orb-lite-logo-CEgq-Hxq.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-chrome-BeTTq7I_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
function newId() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
var useCartStore = create()(persist((set, get) => ({
	items: [],
	shippingId: "local",
	shippingInfo: null,
	pickupInfo: null,
	wantsInvoice: false,
	billingInfo: null,
	constancia: null,
	isFirstPurchase: true,
	customerNumber: null,
	addItem: ({ variant_id, quantity, add_ons, renewal }) => {
		const items = get().items;
		if (!renewal) {
			const existing = items.find((i) => i.variant_id === variant_id && !i.renewal);
			if (existing) {
				set({ items: items.map((i) => i.id === existing.id ? {
					...i,
					quantity: i.quantity + quantity,
					add_ons: Array.from(/* @__PURE__ */ new Set([...i.add_ons ?? [], ...add_ons ?? []]))
				} : i) });
				return;
			}
		}
		set({ items: [...items, {
			id: newId(),
			variant_id,
			quantity,
			add_ons: add_ons ?? [],
			renewal: renewal ?? null
		}] });
	},
	updateQuantity: (id, quantity) => {
		if (quantity <= 0) {
			get().removeItem(id);
			return;
		}
		set({ items: get().items.map((i) => i.id === id ? {
			...i,
			quantity
		} : i) });
	},
	updateRenewal: (id, info) => set({ items: get().items.map((i) => i.id === id ? {
		...i,
		renewal: info
	} : i) }),
	removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
	setShipping: (id) => set(id === "local" ? {
		shippingId: id,
		shippingInfo: null
	} : { shippingId: id }),
	setShippingInfo: (info) => set({ shippingInfo: info }),
	setPickupInfo: (info) => set({ pickupInfo: info }),
	setWantsInvoice: (value) => set({ wantsInvoice: value }),
	setBillingInfo: (info) => set({ billingInfo: info }),
	setConstancia: (file) => set({ constancia: file }),
	setIsFirstPurchase: (value) => set(value ? {
		isFirstPurchase: true,
		customerNumber: null
	} : { isFirstPurchase: false }),
	setCustomerNumber: (value) => set({ customerNumber: value }),
	clearCart: () => set({ items: [] })
}), {
	name: "orb-lite-cart",
	version: 2,
	migrate: (state) => {
		const s = state;
		return {
			...state,
			items: (s?.items ?? []).map((i) => ({
				id: i.id ?? newId(),
				variant_id: i.variant_id,
				quantity: i.quantity ?? 1,
				add_ons: i.add_ons ?? [],
				renewal: i.renewal ?? null
			}))
		};
	},
	storage: createJSONStorage(() => localStorage),
	partialize: (state) => ({
		items: state.items,
		shippingId: state.shippingId,
		shippingInfo: state.shippingInfo,
		pickupInfo: state.pickupInfo,
		wantsInvoice: state.wantsInvoice,
		billingInfo: state.billingInfo,
		constancia: state.constancia,
		isFirstPurchase: state.isFirstPurchase,
		customerNumber: state.customerNumber
	})
}));
function addOnById(id) {
	return ADD_ONS.find((a) => a.id === id);
}
function computeTotals(items, shippingId) {
	const shipping = SHIPPING_OPTIONS.find((s) => s.id === shippingId) ?? SHIPPING_OPTIONS[0];
	let productsTotal = 0;
	let addOnsTotal = 0;
	const lines = items.flatMap((item) => {
		const found = findVariant(item.variant_id);
		if (!found) return [];
		const addOns = (item.add_ons ?? []).map((id) => addOnById(id)).filter((a) => Boolean(a)).map((a) => ({
			name: a.name,
			price: a.price
		}));
		const productAmount = found.variant.price * item.quantity;
		const addOnAmount = addOns.reduce((sum, a) => sum + a.price, 0) * item.quantity;
		productsTotal += productAmount;
		addOnsTotal += addOnAmount;
		return [{
			id: item.id,
			variantId: item.variant_id,
			title: found.product.title,
			variantName: found.variant.name,
			quantity: item.quantity,
			unitPrice: found.variant.price,
			addOns,
			lineTotal: productAmount + addOnAmount,
			isRenewal: found.product.category === "RENOVATION",
			renewal: item.renewal ?? null
		}];
	});
	const total = productsTotal + addOnsTotal + shipping.price;
	const subtotalWithoutIva = total / (1 + IVA_RATE);
	return {
		lines,
		productsTotal,
		addOnsTotal,
		shipping,
		total,
		subtotalWithoutIva,
		iva: total - subtotalWithoutIva,
		totalItems: items.reduce((sum, i) => sum + i.quantity, 0)
	};
}
var pickupSchema = objectType({
	fullName: stringType().trim().min(3, { message: "Escribe el nombre completo" }).max(100, { message: "Máximo 100 caracteres" }),
	phone: stringType().trim().regex(/^[\d\s()+-]{10,20}$/, { message: "Teléfono a 10 dígitos" }),
	email: stringType().trim().max(150).email({ message: "Escribe un correo válido" })
});
var EMPTY$3 = {
	fullName: "",
	phone: "",
	email: ""
};
var FIELDS$1 = [
	{
		name: "fullName",
		label: "Nombre completo",
		full: true
	},
	{
		name: "phone",
		label: "Teléfono de contacto"
	},
	{
		name: "email",
		label: "Correo electrónico",
		full: true
	}
];
function PickupForm({ value, onChange, errors }) {
	const [local, setLocal] = (0, import_react.useState)(value ?? EMPTY$3);
	const update = (name, val) => {
		const next = {
			...local,
			[name]: val
		};
		setLocal(next);
		onChange(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
		children: FIELDS$1.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: f.full ? "sm:col-span-2" : void 0,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
					children: f.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: local[f.name] ?? "",
					onChange: (e) => update(f.name, e.target.value),
					maxLength: 150,
					className: "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
				}),
				errors?.[f.name] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-[11px] text-destructive",
					children: errors[f.name]
				})
			]
		}, f.name))
	});
}
function validatePickup(info) {
	const result = pickupSchema.safeParse(info ?? EMPTY$3);
	if (result.success) return {
		data: result.data,
		errors: null
	};
	const errors = {};
	for (const issue of result.error.issues) {
		const key = issue.path[0];
		if (!errors[key]) errors[key] = issue.message;
	}
	return {
		data: null,
		errors
	};
}
function formatPickupInfo(info) {
	return `\n\n*Datos de contacto para entrega*\n${info.fullName}\nTel: ${info.phone}\nCorreo: ${info.email}`;
}
var REGIMENES_FISCALES = [
	"601 — General de Ley Personas Morales",
	"603 — Personas Morales con Fines no Lucrativos",
	"605 — Sueldos y Salarios e Ingresos Asimilados a Salarios",
	"606 — Arrendamiento",
	"607 — Régimen de Enajenación o Adquisición de Bienes",
	"608 — Demás ingresos",
	"610 — Residentes en el Extranjero sin Establecimiento Permanente en México",
	"611 — Ingresos por Dividendos (socios y accionistas)",
	"612 — Personas Físicas con Actividades Empresariales y Profesionales",
	"614 — Ingresos por intereses",
	"615 — Régimen de los ingresos por obtención de premios",
	"616 — Sin obligaciones fiscales",
	"620 — Sociedades Cooperativas de Producción",
	"621 — Incorporación Fiscal",
	"622 — Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras",
	"623 — Opcional para Grupos de Sociedades",
	"624 — Coordinados",
	"625 — Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas",
	"626 — Régimen Simplificado de Confianza (RESICO)"
];
var USOS_CFDI = [
	"G01 — Adquisición de mercancías",
	"G02 — Devoluciones, descuentos o bonificaciones",
	"G03 — Gastos en general",
	"I01 — Construcciones",
	"I02 — Mobiliario y equipo de oficina por inversiones",
	"I03 — Equipo de transporte",
	"I04 — Equipo de cómputo y accesorios",
	"I08 — Otra maquinaria y equipo",
	"P01 — Por definir",
	"S01 — Sin efectos fiscales"
];
var billingSchema$1 = objectType({
	legalName: stringType().trim().min(3, { message: "Escribe la razón social o nombre fiscal" }).max(200, { message: "Máximo 200 caracteres" }),
	rfc: stringType().trim().transform((v) => v.toUpperCase()).refine((v) => /^([A-ZÑ&]{3,4}\d{6}[A-Z\d]{3})$/.test(v), { message: "RFC inválido (ej. XAXX010101000)" }),
	taxRegime: stringType().trim().min(3, { message: "Selecciona el régimen fiscal" }),
	cfdiUse: stringType().trim().min(3, { message: "Selecciona el uso del CFDI" }),
	fiscalZip: stringType().trim().regex(/^\d{5}$/, { message: "C.P. fiscal de 5 dígitos" }),
	email: stringType().trim().email({ message: "Correo inválido" }).max(150),
	phone: stringType().trim().regex(/^[\d\s()+-]{10,20}$/, { message: "Teléfono a 10 dígitos" }),
	fiscalAddress: stringType().trim().max(250).optional().or(literalType(""))
});
var EMPTY$2 = {
	legalName: "",
	rfc: "",
	taxRegime: "",
	cfdiUse: "",
	fiscalZip: "",
	email: "",
	phone: "",
	fiscalAddress: ""
};
var inputClass$1 = "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary";
var TEXT_FIELDS = [
	{
		name: "legalName",
		label: "Razón social / nombre fiscal",
		full: true
	},
	{
		name: "rfc",
		label: "RFC",
		placeholder: "XAXX010101000"
	},
	{
		name: "fiscalZip",
		label: "C.P. fiscal",
		placeholder: "44100"
	},
	{
		name: "email",
		label: "Correo para recibir la factura"
	},
	{
		name: "phone",
		label: "Teléfono de contacto"
	},
	{
		name: "fiscalAddress",
		label: "Dirección fiscal (opcional)",
		full: true
	}
];
function TextField({ field, local, errors, update }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: field.full ? "sm:col-span-2" : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
				children: field.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				value: local[field.name] ?? "",
				placeholder: field.placeholder,
				onChange: (e) => update(field.name, e.target.value),
				maxLength: 250,
				className: inputClass$1
			}),
			errors?.[field.name] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-[11px] text-destructive",
				children: errors[field.name]
			})
		]
	});
}
function BillingForm({ value, onChange, errors }) {
	const [local, setLocal] = (0, import_react.useState)(value ?? EMPTY$2);
	const update = (name, val) => {
		const next = {
			...local,
			[name]: val
		};
		setLocal(next);
		onChange(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
		children: [
			TEXT_FIELDS.slice(0, 3).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				field: f,
				local,
				errors,
				update
			}, f.name)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "sm:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Régimen fiscal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: local.taxRegime,
						onChange: (e) => update("taxRegime", e.target.value),
						className: inputClass$1,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Selecciona…"
						}), REGIMENES_FISCALES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: r,
							children: r
						}, r))]
					}),
					errors?.taxRegime && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-[11px] text-destructive",
						children: errors.taxRegime
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "sm:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Uso del CFDI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: local.cfdiUse,
						onChange: (e) => update("cfdiUse", e.target.value),
						className: inputClass$1,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Selecciona…"
						}), USOS_CFDI.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: u,
							children: u
						}, u))]
					}),
					errors?.cfdiUse && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-[11px] text-destructive",
						children: errors.cfdiUse
					})
				]
			}),
			TEXT_FIELDS.slice(3).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				field: f,
				local,
				errors,
				update
			}, f.name))
		]
	});
}
function validateBilling(info) {
	const result = billingSchema$1.safeParse(info ?? EMPTY$2);
	if (result.success) return {
		data: result.data,
		errors: null
	};
	const errors = {};
	for (const issue of result.error.issues) {
		const key = issue.path[0];
		if (!errors[key]) errors[key] = issue.message;
	}
	return {
		data: null,
		errors
	};
}
function formatBillingInfo(info) {
	return `\n\n*Datos de facturación*\n${info.legalName}\nRFC: ${info.rfc}\nRégimen: ${info.taxRegime}\nUso CFDI: ${info.cfdiUse}\nC.P. fiscal: ${info.fiscalZip}\nCorreo: ${info.email}\nTel: ${info.phone}` + (info.fiscalAddress ? `\nDirección fiscal: ${info.fiscalAddress}` : "");
}
var baseSchema = { fullName: stringType().trim().min(3, { message: "Escribe el nombre completo" }).max(100, { message: "Máximo 100 caracteres" }) };
var platformSchema = {
	unitName: stringType().trim().min(2, { message: "Escribe el nombre del equipo en plataforma" }).max(100, { message: "Máximo 100 caracteres" }),
	imei: stringType().trim().regex(/^\d{14,17}$/, { message: "El IMEI debe tener entre 14 y 17 dígitos" })
};
var simSchema = {
	iccid: stringType().trim().regex(/^\d{18,22}$/, { message: "El ICCID debe tener entre 18 y 22 dígitos" }),
	simPhone: stringType().trim().regex(/^[\d\s+()-]{10,20}$/, { message: "Escribe el número de teléfono del chip" })
};
var LABELS = {
	fullName: "Nombre completo del titular",
	unitName: "Nombre del equipo en plataforma",
	imei: "IMEI del equipo",
	iccid: "ICCID del chip",
	simPhone: "Número de teléfono del chip"
};
function renewalFields(variantId) {
	const kind = renewalMeta(variantId)?.kind ?? "platform";
	if (kind === "sim") return [
		"fullName",
		"iccid",
		"simPhone"
	];
	if (kind === "both") return [
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
function renewalSchemaFor(variantId) {
	const fields = renewalFields(variantId);
	const shape = {};
	for (const f of fields) {
		const def = {
			...baseSchema,
			...platformSchema,
			...simSchema
		}[f];
		if (def) shape[f] = def;
	}
	return objectType(shape);
}
var EMPTY$1 = {
	fullName: "",
	unitName: ""
};
function RenewalForm({ variantId, value, onChange, errors }) {
	const [local, setLocal] = (0, import_react.useState)(value ?? EMPTY$1);
	const fields = renewalFields(variantId);
	const meta = renewalMeta(variantId);
	const update = (name, val) => {
		const next = {
			...local,
			[name]: val
		};
		setLocal(next);
		onChange(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-3",
		children: [meta && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-[11px] text-muted-foreground",
			children: [
				"Plataforma ",
				meta.platform,
				" ·",
				" ",
				meta.period === "monthly" ? "Renovación mensual" : "Renovación anual"
			]
		}), fields.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
				children: LABELS[name]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				inputMode: name === "imei" || name === "iccid" ? "numeric" : "text",
				value: local[name] ?? "",
				onChange: (e) => update(name, e.target.value),
				maxLength: 100,
				className: "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
			}),
			errors?.[name] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-[11px] text-destructive",
				children: errors[name]
			})
		] }, name))]
	});
}
function validateRenewal(variantId, info) {
	const result = renewalSchemaFor(variantId).safeParse(info ?? EMPTY$1);
	if (result.success) return {
		data: result.data,
		errors: null
	};
	const errors = {};
	for (const issue of result.error.issues) {
		const key = issue.path[0];
		if (!errors[key]) errors[key] = issue.message;
	}
	return {
		data: null,
		errors
	};
}
function formatRenewalInfo(info, variantName) {
	const parts = [`\n\n*Datos de renovación${variantName ? ` — ${variantName}` : ""}*`, info.fullName];
	if (info.unitName) parts.push(`Equipo en plataforma: ${info.unitName}`);
	if (info.imei) parts.push(`IMEI: ${info.imei}`);
	if (info.iccid) parts.push(`ICCID: ${info.iccid}`);
	if (info.simPhone) parts.push(`Teléfono del chip: ${info.simPhone}`);
	return parts.join("\n");
}
var shippingSchema = objectType({
	fullName: stringType().trim().min(3, { message: "Escribe el nombre completo" }).max(100, { message: "Máximo 100 caracteres" }),
	phone: stringType().trim().regex(/^[\d\s()+-]{10,20}$/, { message: "Teléfono a 10 dígitos" }),
	email: stringType().trim().max(150).email({ message: "Escribe un correo válido" }),
	city: stringType().trim().min(3, { message: "Ciudad" }).max(100),
	state: stringType().trim().min(3, { message: "Estado" }).max(100),
	zip: stringType().trim().regex(/^\d{5}$/, { message: "C.P. de 5 dígitos" })
});
var FIELDS = [
	{
		name: "fullName",
		label: "Nombre completo",
		full: true
	},
	{
		name: "phone",
		label: "Teléfono"
	},
	{
		name: "email",
		label: "Correo electrónico",
		full: true
	},
	{
		name: "zip",
		label: "Código postal"
	},
	{
		name: "city",
		label: "Ciudad"
	},
	{
		name: "state",
		label: "Estado"
	}
];
var EMPTY = {
	fullName: "",
	phone: "",
	email: "",
	city: "",
	state: "",
	zip: ""
};
function ShippingForm({ value, onChange, errors }) {
	const [local, setLocal] = (0, import_react.useState)(value ?? EMPTY);
	const update = (name, val) => {
		const next = {
			...local,
			[name]: val
		};
		setLocal(next);
		onChange(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
		children: FIELDS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: f.full ? "sm:col-span-2" : void 0,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
					children: f.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: local[f.name] ?? "",
					onChange: (e) => update(f.name, e.target.value),
					maxLength: 150,
					className: "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
				}),
				errors?.[f.name] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-[11px] text-destructive",
					children: errors[f.name]
				})
			]
		}, f.name))
	});
}
function validateShipping(info) {
	const result = shippingSchema.safeParse(info ?? EMPTY);
	if (result.success) return {
		data: result.data,
		errors: null
	};
	const errors = {};
	for (const issue of result.error.issues) {
		const key = issue.path[0];
		if (!errors[key]) errors[key] = issue.message;
	}
	return {
		data: null,
		errors
	};
}
function formatShippingInfo(info) {
	return `\n\n*Datos de envío*\n${info.fullName}\nTel: ${info.phone}\nCorreo: ${info.email}\n${info.city}, ${info.state}, C.P. ${info.zip}`;
}
var renewalSchema = objectType({
	fullName: stringType().min(1),
	unitName: stringType().max(100).optional().nullable(),
	imei: stringType().max(20).optional().nullable(),
	iccid: stringType().max(25).optional().nullable(),
	simPhone: stringType().max(25).optional().nullable()
});
var shippingInfoSchema = objectType({
	fullName: stringType().min(1),
	phone: stringType().min(1),
	email: stringType().email().nullish(),
	city: stringType().min(1),
	state: stringType().min(1),
	zip: stringType().min(1)
});
var pickupInfoSchema = objectType({
	fullName: stringType().min(1),
	phone: stringType().min(1),
	email: stringType().email().nullish()
});
var billingInfoSchema = objectType({
	legalName: stringType().min(1),
	rfc: stringType().min(1),
	taxRegime: stringType().min(1),
	cfdiUse: stringType().min(1),
	fiscalZip: stringType().min(1),
	email: stringType().email(),
	phone: stringType().min(1),
	fiscalAddress: stringType().optional().nullable(),
	constanciaFileName: stringType().max(200).nullish(),
	constanciaUrl: stringType().url().nullish()
});
var orderSchema = objectType({
	orderId: stringType().min(1).max(64),
	customerNumber: numberType().int().min(500).max(9999999).nullish(),
	items: arrayType(objectType({
		id: stringType(),
		variant_id: stringType(),
		quantity: numberType().int().min(1).max(100),
		add_ons: arrayType(stringType()).optional(),
		renewal: renewalSchema.nullish()
	})).min(1).max(50),
	shippingId: enumType(["local", "national"]),
	shippingInfo: shippingInfoSchema.nullish(),
	pickupInfo: pickupInfoSchema.nullish(),
	wantsInvoice: booleanType(),
	billingInfo: billingInfoSchema.nullish()
});
var notifyNewOrder = createServerFn({ method: "POST" }).inputValidator((data) => orderSchema.parse(data)).handler(createSsrRpc("6a2310f3ff7ea5842dae69205e66caaf7ec11d5c49c4b8794d7041a99fe89d4f"));
var contactSchema = objectType({
	fullName: stringType().trim().min(1).max(150),
	phone: stringType().trim().min(1).max(30),
	email: stringType().trim().email().max(150).optional(),
	city: stringType().trim().max(120).optional(),
	state: stringType().trim().max(120).optional(),
	zip: stringType().trim().max(10).optional()
});
var billingSchema = objectType({
	legalName: stringType().trim().min(1).max(200),
	rfc: stringType().trim().min(1).max(20),
	taxRegime: stringType().trim().min(1).max(200),
	cfdiUse: stringType().trim().min(1).max(200),
	fiscalZip: stringType().trim().min(1).max(10),
	email: stringType().trim().email().max(150),
	phone: stringType().trim().min(1).max(30),
	fiscalAddress: stringType().trim().max(250).optional().or(literalType(""))
});
/**
* Subconjunto público y no sensible de un cliente.
* Los datos de contacto, facturación y constancias NO se exponen por número
* de cliente (son fácilmente enumerables); solo se muestran en el CRM
* autenticado o se capturan de nuevo en el checkout.
*/
/** Confirma que un número de cliente existe y saluda por su primer nombre. */
var lookupCustomer = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ customerNumber: numberType().int().min(500).max(9999999) }).parse(data)).handler(createSsrRpc("f6bbcb4ef56e357fba101e5fcf0aad904becee992aea4aa321f9424f69d3cb92"));
var saveSchema = objectType({
	customerNumber: numberType().int().min(500).max(9999999).nullish(),
	fullName: stringType().trim().min(1).max(150),
	phone: stringType().trim().min(1).max(30),
	email: stringType().trim().email().max(150).nullish(),
	contact: contactSchema.nullish(),
	billing: billingSchema.nullish(),
	orderId: stringType().trim().min(1).max(64),
	orderTotal: numberType().min(0).max(1e7),
	constancia: objectType({
		path: stringType().trim().min(1).max(400),
		fileName: stringType().trim().min(1).max(200),
		signedUrl: stringType().trim().max(2e3).nullish(),
		uploadedAt: stringType().trim().max(40).nullish()
	}).nullish()
});
/**
* Registra la compra en el historial del cliente. Si no llega número de cliente,
* genera uno aleatorio (500 en adelante) y lo devuelve.
*/
var saveCustomerOrder = createServerFn({ method: "POST" }).inputValidator((data) => saveSchema.parse(data)).handler(createSsrRpc("1b68ef96144dde910f0882847a1c83d5bd507e9297356fd9e7093ad05ccd9fbf"));
var inputClass = "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary";
function CustomerBlock() {
	const { isFirstPurchase, customerNumber, setIsFirstPurchase, setCustomerNumber } = useCartStore();
	const [input, setInput] = (0, import_react.useState)(customerNumber ? String(customerNumber) : "");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleLookup = async () => {
		const num = Number(input.trim());
		if (!Number.isInteger(num) || num < 500) {
			toast.error("Escribe tu número de cliente (500 en adelante)");
			return;
		}
		setLoading(true);
		try {
			const record = await lookupCustomer({ data: { customerNumber: num } });
			if (!record) {
				toast.error("No encontramos ese número de cliente");
				return;
			}
			setCustomerNumber(record.customerNumber);
			toast.success(`¡Hola de nuevo, ${record.firstName}! (${record.ordersCount} compra${record.ordersCount !== 1 ? "s" : ""} acumulada${record.ordersCount !== 1 ? "s" : ""})`, { description: "Por tu seguridad, confirma tus datos de envío y facturación en este pedido." });
		} catch (error) {
			console.error(error);
			toast.error("No pudimos consultar tu número de cliente");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 rounded-xl border border-border/60 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xs font-bold uppercase tracking-widest text-muted-foreground",
				children: "Cliente ORB-LITE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: isFirstPurchase,
					onChange: (e) => setIsFirstPurchase(e.target.checked),
					className: "mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-4 w-4 text-primary" }), "Es mi primera compra"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs text-muted-foreground",
						children: "Te asignamos un número de cliente al finalizar tu solicitud."
					})]
				})]
			}),
			!isFirstPurchase && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 border-t border-border/60 pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Tu número de cliente"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							inputMode: "numeric",
							value: input,
							placeholder: "Ej. 1043",
							onChange: (e) => setInput(e.target.value.replace(/\D/g, "").slice(0, 7)),
							className: inputClass
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							onClick: handleLookup,
							disabled: loading,
							className: "shrink-0",
							children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2",
								children: "Cargar datos"
							})]
						})]
					}),
					customerNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] font-semibold text-primary",
						children: [
							"Cliente #",
							customerNumber,
							" identificado."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-start gap-2 rounded-lg bg-primary/10 p-2 text-[11px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Usa siempre el mismo número de cliente: acumulando compras eres acreedor a promociones, mejores precios y prioridad en soporte." })]
			})
		]
	});
}
var schema = objectType({
	fileName: stringType().trim().min(1).max(160),
	contentType: enumType([
		"application/pdf",
		"image/jpeg",
		"image/png",
		"image/webp"
	]),
	/** Contenido del archivo en base64 (sin prefijo data:). */
	base64: stringType().min(10),
	rfc: stringType().trim().max(20).optional()
});
/**
* Sube la Constancia de Situación Fiscal a un bucket privado y devuelve
* la ruta interna más un enlace firmado (30 días) para el equipo de ventas.
*/
var uploadConstanciaFiscal = createServerFn({ method: "POST" }).inputValidator((data) => schema.parse(data)).handler(createSsrRpc("a8f0f685d1e724fbbc17b224d341d9fa0477c2f386a9269b483b843b14752253"));
var ALLOWED = [
	"application/pdf",
	"image/jpeg",
	"image/png",
	"image/webp"
];
var MAX_BYTES = 10485760;
function toBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = String(reader.result);
			resolve(result.slice(result.indexOf(",") + 1));
		};
		reader.onerror = () => reject(/* @__PURE__ */ new Error("No se pudo leer el archivo"));
		reader.readAsDataURL(file);
	});
}
function ConstanciaUpload({ value, rfc, onChange, error }) {
	const inputRef = (0, import_react.useRef)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [detected, setDetected] = (0, import_react.useState)(null);
	const vigente = value ? constanciaVigente(value.uploadedAt) : false;
	const vence = value ? constanciaVenceEl(value.uploadedAt) : null;
	const handleFile = async (file) => {
		if (!ALLOWED.includes(file.type)) {
			toast.error("Sube tu constancia en PDF, JPG, PNG o WEBP");
			return;
		}
		if (file.size > MAX_BYTES) {
			toast.error("El archivo supera 10 MB");
			return;
		}
		setLoading(true);
		try {
			const base64 = await toBase64(file);
			const result = await uploadConstanciaFiscal({ data: {
				fileName: file.name.slice(0, 160),
				contentType: file.type,
				base64,
				...rfc ? { rfc } : {}
			} });
			onChange({
				path: result.path,
				fileName: result.fileName,
				signedUrl: result.signedUrl,
				uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			setDetected({
				rfc: result.rfc ?? null,
				razonSocial: result.razonSocial ?? null,
				fechaEmision: formatFechaEmision(result.fechaEmision)
			});
			toast.success("Constancia de situación fiscal validada", { description: result.rfc ? `RFC detectado: ${result.rfc}` : void 0 });
		} catch (err) {
			console.error("No se pudo subir la constancia", err);
			setDetected(null);
			const msg = err instanceof Error && err.message && !/fetch|network/i.test(err.message) ? err.message : "No se pudo subir la constancia, intenta de nuevo";
			toast.error("Documento no aceptado", { description: msg });
		} finally {
			setLoading(false);
			if (inputRef.current) inputRef.current.value = "";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 rounded-lg border border-border/60 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
				children: "Constancia de Situación Fiscal (obligatoria)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				accept: ".pdf,image/jpeg,image/png,image/webp",
				className: "hidden",
				onChange: (e) => {
					const file = e.target.files?.[0];
					if (file) handleFile(file);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: loading,
				onClick: () => inputRef.current?.click(),
				className: "flex w-full items-center justify-center gap-2 rounded-lg border border-primary/50 px-3 py-2 text-sm font-semibold text-primary disabled:opacity-60",
				children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : vigente ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), loading ? "Revisando documento…" : vigente ? "Reemplazar archivo" : value ? "Actualizar constancia (venció)" : "Subir constancia (PDF o imagen)"]
			}),
			value && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "truncate text-[11px] text-muted-foreground",
				children: ["Archivo: ", value.fileName]
			}),
			value && detected && (detected.rfc || detected.razonSocial) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] text-muted-foreground",
				children: [
					"Datos leídos:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: [detected.razonSocial, detected.rfc].filter(Boolean).join(" · ")
					})
				]
			}),
			value && detected?.fechaEmision && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] text-muted-foreground",
				children: ["Emitida el ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-foreground",
					children: detected.fechaEmision
				})]
			}),
			value && vigente && vence && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] text-primary",
				children: [
					"Validada. Vigente hasta el ",
					vence,
					"."
				]
			}),
			value && !vigente && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-destructive",
				children: "Tu constancia tiene más de un mes. Sube una actualizada para facturar esta compra."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground",
				children: "Debe estar emitida en los últimos 30 días. Queda ligada a tu número de cliente y es válida por un mes: si entre compras pasa más de un mes, te pediremos una constancia actualizada. Se guarda de forma privada y solo la usamos para emitir tu CFDI. Máximo 10 MB."
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-destructive",
				children: error
			})
		]
	});
}
function CartDrawer() {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const { items, shippingId, shippingInfo, pickupInfo, setPickupInfo, updateQuantity, updateRenewal, removeItem, setShipping, setShippingInfo, wantsInvoice, billingInfo, setWantsInvoice, setBillingInfo, constancia, setConstancia, customerNumber, setCustomerNumber, setIsFirstPurchase } = useCartStore();
	const [constanciaError, setConstanciaError] = (0, import_react.useState)(null);
	const [billingErrors, setBillingErrors] = (0, import_react.useState)(null);
	const [renewalErrors, setRenewalErrors] = (0, import_react.useState)({});
	const [errors, setErrors] = (0, import_react.useState)(null);
	const [pickupErrors, setPickupErrors] = (0, import_react.useState)(null);
	const totals = computeTotals(items, shippingId);
	const handleWhatsappCheckout = async () => {
		let details = "";
		const renewalLines = totals.lines.filter((l) => l.isRenewal);
		if (renewalLines.length > 0) {
			const nextErrors = {};
			for (const line of renewalLines) {
				const { data, errors: lineErrors } = validateRenewal(line.variantId, line.renewal);
				if (!data) nextErrors[line.id] = lineErrors;
				else updateRenewal(line.id, data);
			}
			if (Object.keys(nextErrors).length > 0) {
				setRenewalErrors(nextErrors);
				toast.error("Completa los datos de renovación de cada equipo");
				return;
			}
			setRenewalErrors({});
			details += renewalLines.map((l) => l.renewal ? formatRenewalInfo(l.renewal, l.variantName) : "").join("");
		}
		if (shippingId === "national") {
			const { data, errors: nextErrors } = validateShipping(shippingInfo);
			if (!data) {
				setErrors(nextErrors);
				toast.error("Completa los datos de envío");
				return;
			}
			setErrors(null);
			setShippingInfo(data);
			details += formatShippingInfo(data);
		} else if (totals.lines.some((l) => !l.isRenewal)) {
			const { data, errors: nextErrors } = validatePickup(pickupInfo);
			if (!data) {
				setPickupErrors(nextErrors);
				toast.error("Déjanos tu nombre y teléfono para coordinar la entrega");
				return;
			}
			setPickupErrors(null);
			setPickupInfo(data);
			details += formatPickupInfo(data);
		}
		if (wantsInvoice) {
			const { data, errors: nextErrors } = validateBilling(billingInfo);
			if (!data) {
				setBillingErrors(nextErrors);
				toast.error("Completa los datos de facturación");
				return;
			}
			if (!constancia || !constanciaVigente(constancia.uploadedAt)) {
				setConstanciaError(constancia ? "Tu constancia tiene más de un mes, sube una actualizada" : "Sube tu Constancia de Situación Fiscal para poder facturar");
				toast.error(constancia ? "Tu Constancia de Situación Fiscal ya venció (un mes)" : "Sube tu Constancia de Situación Fiscal");
				return;
			}
			setConstanciaError(null);
			setBillingErrors(null);
			setBillingInfo(data);
			details += formatBillingInfo(data);
			details += `\nConstancia fiscal: ${constancia.fileName}`;
		}
		const orderId = `${Date.now().toString(36).toUpperCase()}`;
		let assignedNumber = customerNumber;
		const contactName = shippingInfo?.fullName ?? pickupInfo?.fullName ?? billingInfo?.legalName;
		const contactPhone = shippingInfo?.phone ?? pickupInfo?.phone ?? billingInfo?.phone;
		if (contactName && contactPhone) try {
			const result = await saveCustomerOrder({ data: {
				customerNumber: customerNumber ?? null,
				fullName: contactName,
				phone: contactPhone,
				email: shippingInfo?.email ?? pickupInfo?.email ?? billingInfo?.email ?? null,
				contact: shippingInfo ? {
					fullName: shippingInfo.fullName,
					phone: shippingInfo.phone,
					...shippingInfo.email ? { email: shippingInfo.email } : {},
					city: shippingInfo.city,
					state: shippingInfo.state,
					zip: shippingInfo.zip
				} : pickupInfo ? {
					fullName: pickupInfo.fullName,
					phone: pickupInfo.phone,
					...pickupInfo.email ? { email: pickupInfo.email } : {}
				} : null,
				billing: wantsInvoice && billingInfo ? {
					...billingInfo,
					constanciaFileName: constancia?.fileName ?? null,
					constanciaUrl: constancia?.signedUrl ?? null
				} : null,
				orderId,
				orderTotal: totals.total,
				constancia: wantsInvoice && constancia ? constancia : null
			} });
			assignedNumber = result.customerNumber;
			setCustomerNumber(result.customerNumber);
			setIsFirstPurchase(false);
			toast.success(result.isNew ? `Tu número de cliente es #${result.customerNumber}. Guárdalo para acumular compras y acceder a promociones.` : `Compra acumulada al cliente #${result.customerNumber}.`);
		} catch (error) {
			console.error("No se pudo registrar el cliente", error);
		}
		if (assignedNumber) details = `\n\n*Cliente ORB-LITE:* #${assignedNumber}` + details;
		const text = `Hola ORB-LITE, quiero finalizar este pedido:\n\n${totals.lines.map((l) => `• ${l.variantName} x${l.quantity} — ${formatMxn(l.unitPrice * l.quantity)}` + (l.renewal ? `\n   Titular: ${l.renewal.fullName}` + (l.renewal.unitName ? `\n   Equipo en plataforma: ${l.renewal.unitName}` : "") + (l.renewal.imei ? `\n   IMEI: ${l.renewal.imei}` : "") + (l.renewal.iccid ? `\n   ICCID: ${l.renewal.iccid}` : "") + (l.renewal.simPhone ? `\n   Tel. del chip: ${l.renewal.simPhone}` : "") : "") + l.addOns.map((a) => `\n   + ${a.name} — ${formatMxn(a.price * l.quantity)}`).join("")).join("\n")}\n\nEntrega: ${totals.shipping.label} (${formatMxn(totals.shipping.price)})\nSubtotal sin IVA: ${formatMxn(totals.subtotalWithoutIva)}\nIVA (16%): ${formatMxn(totals.iva)}\n*TOTAL: ${formatMxn(totals.total)} MXN*${details}`;
		try {
			await notifyNewOrder({ data: {
				orderId,
				customerNumber: assignedNumber ?? null,
				items: items.map((i) => ({
					id: i.id,
					variant_id: i.variant_id,
					quantity: i.quantity,
					add_ons: i.add_ons ?? [],
					renewal: i.renewal ?? null
				})),
				shippingId,
				shippingInfo: shippingId === "national" ? shippingInfo : null,
				pickupInfo: shippingId === "local" ? pickupInfo : null,
				wantsInvoice,
				billingInfo: wantsInvoice && billingInfo ? {
					...billingInfo,
					constanciaFileName: constancia?.fileName ?? null,
					constanciaUrl: constancia?.signedUrl ?? null
				} : null
			} });
			toast.success("Pedido registrado, lo recibirás por WhatsApp");
		} catch (error) {
			console.error("No se pudo enviar el correo de pedido", error);
		}
		openWhatsApp(text);
		setIsOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		open: isOpen,
		onOpenChange: setIsOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "icon",
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-5 w-5" }), totals.totalItems > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full p-0 text-xs",
					children: totals.totalItems
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "flex h-full w-full flex-col sm:max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
				className: "flex-shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Tu carrito" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: totals.totalItems === 0 ? "Tu carrito está vacío" : `${totals.totalItems} artículo${totals.totalItems !== 1 ? "s" : ""} · ${formatMxn(totals.total)}` })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0 flex-1 flex-col pt-4",
				children: totals.lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-1 items-center justify-center text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "mx-auto mb-4 h-12 w-12 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "Agrega un kit para comenzar"
					})] })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 space-y-4 overflow-y-auto pr-2",
					children: [
						totals.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							layout: true,
							initial: {
								opacity: 0,
								x: 12
							},
							animate: {
								opacity: 1,
								x: 0
							},
							className: "rounded-xl border border-border/60 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: line.variantName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: line.title
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-6 w-6 shrink-0",
										onClick: () => removeItem(line.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
									})]
								}),
								line.addOns.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 space-y-1 text-xs text-muted-foreground",
									children: line.addOns.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"+ ",
										a.name,
										" — ",
										formatMxn(a.price)
									] }, a.name))
								}),
								line.isRenewal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 space-y-2 rounded-lg border border-border/60 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-[11px] font-bold uppercase tracking-widest text-muted-foreground",
										children: "Datos del equipo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenewalForm, {
										variantId: line.variantId,
										value: line.renewal,
										onChange: (info) => updateRenewal(line.id, info),
										errors: renewalErrors[line.id]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "icon",
												className: "h-6 w-6",
												onClick: () => updateQuantity(line.id, line.quantity - 1),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-8 text-center text-sm",
												children: line.quantity
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "icon",
												className: "h-6 w-6",
												onClick: () => updateQuantity(line.id, line.quantity + 1),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display font-bold text-primary",
										children: formatMxn(line.lineTotal)
									})]
								})
							]
						}, line.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerBlock, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xs font-bold uppercase tracking-widest text-muted-foreground",
									children: "Método de entrega"
								}),
								SHIPPING_OPTIONS.map((opt) => {
									const active = opt.id === shippingId;
									const Icon = opt.id === "local" ? MapPin : Truck;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setShipping(opt.id),
										className: `flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${active ? "border-primary bg-primary/10" : "border-border/60"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-sm font-semibold",
													children: opt.label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-xs text-muted-foreground",
													children: opt.description
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "shrink-0 font-display font-bold text-primary",
												children: opt.price === 0 ? "$0" : `+${formatMxn(opt.price)}`
											})
										]
									}, opt.id);
								}),
								shippingId === "local" && totals.lines.some((l) => !l.isRenewal) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 rounded-xl border border-border/60 p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-xs font-bold uppercase tracking-widest text-muted-foreground",
											children: "Datos de contacto para la entrega"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickupForm, {
											value: pickupInfo,
											onChange: setPickupInfo,
											errors: pickupErrors ?? void 0
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "Te contactamos para coordinar la entrega."
										})
									]
								}),
								shippingId === "national" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 rounded-xl border border-border/60 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-xs font-bold uppercase tracking-widest text-muted-foreground",
										children: "Datos de envío"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShippingForm, {
										value: shippingInfo,
										onChange: setShippingInfo,
										errors: errors ?? void 0
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 rounded-xl border border-border/60 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: wantsInvoice,
									onChange: (e) => setWantsInvoice(e.target.checked),
									className: "mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2 text-sm font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }), "Requiero factura (CFDI 4.0)"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: "Captura tus datos fiscales para emitirla al registrar tu compra."
									})]
								})]
							}), wantsInvoice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 border-t border-border/60 pt-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-xs font-bold uppercase tracking-widest text-muted-foreground",
										children: "Datos de facturación"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingForm, {
										value: billingInfo,
										onChange: setBillingInfo,
										errors: billingErrors ?? void 0
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConstanciaUpload, {
										value: constancia,
										rfc: billingInfo?.rfc,
										onChange: (file) => {
											setConstancia(file);
											if (file) setConstanciaError(null);
										},
										error: constanciaError ?? void 0
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Necesitamos razón social, RFC, régimen fiscal, uso de CFDI, C.P. fiscal y correo, además de tu Constancia de Situación Fiscal, para emitir tu factura."
									})
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-shrink-0 space-y-2 border-t border-border/60 bg-background pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Productos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMxn(totals.productsTotal) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Envío" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMxn(totals.shipping.price) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal sin IVA" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMxn(totals.subtotalWithoutIva) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "IVA (16%)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMxn(totals.iva) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-border/60 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg font-bold uppercase",
								children: "Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl font-bold text-primary",
								children: formatMxn(totals.total)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Precios en MXN: todos los paquetes ya incluyen el 16% de IVA y la factura se incluye al registrar la compra en sistema. Al realizar tu pedido aceptas el uso de datos y condiciones del sitio."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleWhatsappCheckout,
							className: "w-full",
							size: "lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "mr-2 h-4 w-4" }), "Realizar solicitud"]
						})
					]
				})] })
			})]
		})]
	});
}
var nav = [
	{
		to: "/",
		label: "Inicio"
	},
	{
		to: "/servicios",
		label: "Servicios"
	},
	{
		to: "/tienda",
		label: "Tienda"
	},
	{
		to: "/demo",
		label: "Demo"
	},
	{
		to: "/wialon",
		label: "Plataforma"
	},
	{
		to: "/contacto",
		label: "Contacto"
	}
];
function SiteHeader() {
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-[2000] border-b border-border/60 bg-background/95 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: orb_lite_logo_default,
						alt: "ORB-LITE rastreo GPS satelital",
						className: "h-16 w-auto drop-shadow-[0_0_20px_color-mix(in_oklab,var(--primary)_30%,transparent)] sm:h-20"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "inline-flex size-11 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary hover:text-primary sm:hidden",
					"aria-label": menuOpen ? "Cerrar menú" : "Abrir menú",
					"aria-expanded": menuOpen,
					onClick: () => setMenuOpen((open) => !open),
					children: menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: `${menuOpen ? "flex" : "hidden"} w-full flex-col items-stretch gap-1 border-t border-border/60 pt-3 font-display text-sm font-bold uppercase tracking-widest sm:flex sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-4 sm:gap-y-2 sm:border-0 sm:pt-0 sm:text-xs md:gap-6 md:text-sm`,
					children: [nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: "rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary sm:px-0 sm:py-1",
						activeProps: { className: "text-primary" },
						activeOptions: { exact: item.to === "/" },
						onClick: () => setMenuOpen(false),
						children: item.label
					}, item.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 py-2 sm:px-0 sm:py-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
					})]
				})
			]
		})
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border/60 py-10 text-center text-sm text-muted-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ORB-LITE · Rastreo GPS Satelital · Para personas, empresas y negocios" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "tel:+523318359421",
						className: "hover:text-primary",
						children: "33 1835 9421"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2 text-primary",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "mailto:ventas@orb-lite.com",
						className: "hover:text-primary",
						children: "ventas@orb-lite.com"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "https://api.whatsapp.com/send?phone=523318359421",
					target: "_blank",
					rel: "noreferrer",
					className: "hover:text-primary",
					children: "WhatsApp: 331 835 9421"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3 px-5 text-xs uppercase tracking-widest",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-full border border-primary/30 px-4 py-2 text-primary",
						children: "Soporte técnico incluido"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-full border border-primary/30 px-4 py-2 text-primary",
						children: "Entrega incluida en GDL/ZMG"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-full border border-primary/30 px-4 py-2 text-primary",
						children: "Envíos a todo México"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/servicios",
						className: "hover:text-primary",
						children: "Servicios"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2 text-primary",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tienda",
						className: "hover:text-primary",
						children: "Tienda"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/terminos",
				className: "mx-auto mt-6 inline-block rounded-md border border-border/60 px-4 py-2 font-display text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary",
				children: "Uso de datos y condiciones"
			})
		]
	});
}
function CtaBanner() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-5 pb-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl px-6 py-10 text-center",
			style: { background: "var(--gradient-lime)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-bold uppercase italic text-primary-foreground sm:text-4xl",
					children: "Solicita información hoy"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-xl text-primary-foreground/85",
					children: "Pregunta por paquetes, planes de servicio y precios de renovación anual, ya sea para un vehículo, tu flota o tu negocio."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/contacto",
					className: "rounded-md border-2 border-primary-foreground/70 px-6 py-2 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground",
					children: "Contactar ahora"
				})
			]
		})
	});
}
//#endregion
export { SiteFooter as a, formatRenewalInfo as c, validatePickup as d, validateRenewal as f, ShippingForm as i, formatShippingInfo as l, PickupForm as n, SiteHeader as o, validateShipping as p, RenewalForm as r, formatPickupInfo as s, CtaBanner as t, useCartStore as u };
