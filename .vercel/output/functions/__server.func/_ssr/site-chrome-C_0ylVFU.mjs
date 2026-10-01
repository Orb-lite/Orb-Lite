import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { A as MessageCircle, K as Gift, P as MapPin, R as LoaderCircle, Y as FileText, a as Upload, bt as BadgeCheck, f as ShoppingCart, g as Search, j as Menu, k as Minus, lt as CircleCheck, n as X, o as Truck, s as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as DialogOverlay, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C6PhiXEn.mjs";
import { a as literalType, i as enumType, l as stringType, n as arrayType, o as numberType, r as booleanType, s as objectType } from "../_libs/zod.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as formatMxn, i as SHIPPING_OPTIONS, l as renewalMeta, n as IVA_RATE, s as findVariant, t as ADD_ONS } from "./catalog-BhuVKh9L.mjs";
import { i as formatFechaEmision, n as constanciaVigente, t as constanciaVenceEl } from "./constancia-validez-DGGWBZS_.mjs";
import { t as openWhatsApp } from "./whatsapp-k5-h86dD.mjs";
import { t as orb_lite_logo_default } from "./orb-lite-logo-CEgq-Hxq.mjs";
import { t as motion } from "../_libs/framer-motion+[...].mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-chrome-C_0ylVFU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$9 = "/app/applet/src/components/ui/badge.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$9,
		lineNumber: 29,
		columnNumber: 10
	}, this);
}
var _jsxFileName$8 = "/app/applet/src/components/ui/sheet.tsx";
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 22,
	columnNumber: 3
}, void 0));
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
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SheetOverlay, {}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 62,
	columnNumber: 5
}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$8,
			lineNumber: 65,
			columnNumber: 9
		}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "sr-only",
			children: "Close"
		}, void 0, false, {
			fileName: _jsxFileName$8,
			lineNumber: 66,
			columnNumber: 9
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$8,
		lineNumber: 64,
		columnNumber: 7
	}, void 0), children]
}, void 0, true, {
	fileName: _jsxFileName$8,
	lineNumber: 63,
	columnNumber: 5
}, void 0)] }, void 0, true, {
	fileName: _jsxFileName$8,
	lineNumber: 61,
	columnNumber: 3
}, void 0));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 75,
	columnNumber: 3
}, void 0);
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 80,
	columnNumber: 3
}, void 0);
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 91,
	columnNumber: 3
}, void 0));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 103,
	columnNumber: 3
}, void 0));
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
var _jsxFileName$7 = "/app/applet/src/components/pickup-form.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
		children: FIELDS$1.map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
			className: f.full ? "sm:col-span-2" : void 0,
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
					children: f.label
				}, void 0, false, {
					fileName: _jsxFileName$7,
					lineNumber: 47,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					type: "text",
					value: local[f.name] ?? "",
					onChange: (e) => update(f.name, e.target.value),
					maxLength: 150,
					className: "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
				}, void 0, false, {
					fileName: _jsxFileName$7,
					lineNumber: 50,
					columnNumber: 11
				}, this),
				errors?.[f.name] && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("span", {
					className: "mt-1 block text-[11px] text-destructive",
					children: errors[f.name]
				}, void 0, false, {
					fileName: _jsxFileName$7,
					lineNumber: 58,
					columnNumber: 13
				}, this)
			]
		}, f.name, true, {
			fileName: _jsxFileName$7,
			lineNumber: 46,
			columnNumber: 9
		}, this))
	}, void 0, false, {
		fileName: _jsxFileName$7,
		lineNumber: 44,
		columnNumber: 5
	}, this);
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
var _jsxFileName$6 = "/app/applet/src/components/billing-form.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
		className: field.full ? "sm:col-span-2" : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
				children: field.label
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 110,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
				type: "text",
				value: local[field.name] ?? "",
				placeholder: field.placeholder,
				onChange: (e) => update(field.name, e.target.value),
				maxLength: 250,
				className: inputClass$1
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 113,
				columnNumber: 7
			}, this),
			errors?.[field.name] && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("span", {
				className: "mt-1 block text-[11px] text-destructive",
				children: errors[field.name]
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 122,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$6,
		lineNumber: 109,
		columnNumber: 5
	}, this);
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
		children: [
			TEXT_FIELDS.slice(0, 3).map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextField, {
				field: f,
				local,
				errors,
				update
			}, f.name, false, {
				fileName: _jsxFileName$6,
				lineNumber: 148,
				columnNumber: 9
			}, this)),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
				className: "sm:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Régimen fiscal"
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 152,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
						value: local.taxRegime,
						onChange: (e) => update("taxRegime", e.target.value),
						className: inputClass$1,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: "",
							children: "Selecciona…"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 160,
							columnNumber: 11
						}, this), REGIMENES_FISCALES.map((r) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: r,
							children: r
						}, r, false, {
							fileName: _jsxFileName$6,
							lineNumber: 162,
							columnNumber: 13
						}, this))]
					}, void 0, true, {
						fileName: _jsxFileName$6,
						lineNumber: 155,
						columnNumber: 9
					}, this),
					errors?.taxRegime && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("span", {
						className: "mt-1 block text-[11px] text-destructive",
						children: errors.taxRegime
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 168,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 151,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
				className: "sm:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Uso del CFDI"
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 173,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
						value: local.cfdiUse,
						onChange: (e) => update("cfdiUse", e.target.value),
						className: inputClass$1,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: "",
							children: "Selecciona…"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 181,
							columnNumber: 11
						}, this), USOS_CFDI.map((u) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: u,
							children: u
						}, u, false, {
							fileName: _jsxFileName$6,
							lineNumber: 183,
							columnNumber: 13
						}, this))]
					}, void 0, true, {
						fileName: _jsxFileName$6,
						lineNumber: 176,
						columnNumber: 9
					}, this),
					errors?.cfdiUse && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("span", {
						className: "mt-1 block text-[11px] text-destructive",
						children: errors.cfdiUse
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 189,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 172,
				columnNumber: 7
			}, this),
			TEXT_FIELDS.slice(3).map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextField, {
				field: f,
				local,
				errors,
				update
			}, f.name, false, {
				fileName: _jsxFileName$6,
				lineNumber: 194,
				columnNumber: 9
			}, this))
		]
	}, void 0, true, {
		fileName: _jsxFileName$6,
		lineNumber: 146,
		columnNumber: 5
	}, this);
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
var _jsxFileName$5 = "/app/applet/src/components/renewal-form.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid grid-cols-1 gap-3",
		children: [meta && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
			className: "text-[11px] text-muted-foreground",
			children: [
				"Plataforma ",
				meta.platform,
				" ·",
				" ",
				meta.period === "monthly" ? "Renovación mensual" : "Renovación anual"
			]
		}, void 0, true, {
			fileName: _jsxFileName$5,
			lineNumber: 91,
			columnNumber: 9
		}, this), fields.map((name) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
				children: LABELS[name]
			}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 98,
				columnNumber: 11
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
				type: "text",
				inputMode: name === "imei" || name === "iccid" ? "numeric" : "text",
				value: local[name] ?? "",
				onChange: (e) => update(name, e.target.value),
				maxLength: 100,
				className: "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
			}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 101,
				columnNumber: 11
			}, this),
			errors?.[name] && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("span", {
				className: "mt-1 block text-[11px] text-destructive",
				children: errors[name]
			}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 110,
				columnNumber: 13
			}, this)
		] }, name, true, {
			fileName: _jsxFileName$5,
			lineNumber: 97,
			columnNumber: 9
		}, this))]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 89,
		columnNumber: 5
	}, this);
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
var _jsxFileName$4 = "/app/applet/src/components/shipping-form.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
		children: FIELDS.map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
			className: f.full ? "sm:col-span-2" : void 0,
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
					children: f.label
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 63,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					type: "text",
					value: local[f.name] ?? "",
					onChange: (e) => update(f.name, e.target.value),
					maxLength: 150,
					className: "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 66,
					columnNumber: 11
				}, this),
				errors?.[f.name] && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("span", {
					className: "mt-1 block text-[11px] text-destructive",
					children: errors[f.name]
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 74,
					columnNumber: 13
				}, this)
			]
		}, f.name, true, {
			fileName: _jsxFileName$4,
			lineNumber: 62,
			columnNumber: 9
		}, this))
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 60,
		columnNumber: 5
	}, this);
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
var _jsxFileName$3 = "/app/applet/src/components/customer-block.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-3 rounded-xl border border-border/60 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "font-display text-xs font-bold uppercase tracking-widest text-muted-foreground",
				children: "Cliente ORB-LITE"
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 49,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					type: "checkbox",
					checked: isFirstPurchase,
					onChange: (e) => setIsFirstPurchase(e.target.checked),
					className: "mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 54,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BadgeCheck, { className: "h-4 w-4 text-primary" }, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 62,
							columnNumber: 13
						}, this), "Es mi primera compra"]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 61,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "block text-xs text-muted-foreground",
						children: "Te asignamos un número de cliente al finalizar tu solicitud."
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 65,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 60,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 53,
				columnNumber: 7
			}, this),
			!isFirstPurchase && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("div", {
				className: "space-y-2 border-t border-border/60 pt-3",
				children: [
					/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("span", {
						className: "block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Tu número de cliente"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 73,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("input", {
							type: "text",
							inputMode: "numeric",
							value: input,
							placeholder: "Ej. 1043",
							onChange: (e) => setInput(e.target.value.replace(/\D/g, "").slice(0, 7)),
							className: inputClass
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 77,
							columnNumber: 13
						}, this), /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV(Button, {
							type: "button",
							variant: "outline",
							onClick: handleLookup,
							disabled: loading,
							className: "shrink-0",
							children: [loading ? /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 93,
								columnNumber: 17
							}, this) : /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV(Search, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 95,
								columnNumber: 17
							}, this), /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("span", {
								className: "ml-2",
								children: "Cargar datos"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 97,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 85,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 76,
						columnNumber: 11
					}, this),
					customerNumber && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
						className: "text-[11px] font-semibold text-primary",
						children: [
							"Cliente #",
							customerNumber,
							" identificado."
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 101,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 72,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "flex items-start gap-2 rounded-lg bg-primary/10 p-2 text-[11px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Gift, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 109,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Usa siempre el mismo número de cliente: acumulando compras eres acreedor a promociones, mejores precios y prioridad en soporte." }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 110,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 108,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 48,
		columnNumber: 5
	}, this);
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
var _jsxFileName$2 = "/app/applet/src/components/constancia-upload.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-2 rounded-lg border border-border/60 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
				children: "Constancia de Situación Fiscal (obligatoria)"
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 94,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
				ref: inputRef,
				type: "file",
				accept: ".pdf,image/jpeg,image/png,image/webp",
				className: "hidden",
				onChange: (e) => {
					const file = e.target.files?.[0];
					if (file) handleFile(file);
				}
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 97,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				type: "button",
				disabled: loading,
				onClick: () => inputRef.current?.click(),
				className: "flex w-full items-center justify-center gap-2 rounded-lg border border-primary/50 px-3 py-2 text-sm font-semibold text-primary disabled:opacity-60",
				children: [loading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 114,
					columnNumber: 11
				}, this) : vigente ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 116,
					columnNumber: 11
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 118,
					columnNumber: 11
				}, this), loading ? "Revisando documento…" : vigente ? "Reemplazar archivo" : value ? "Actualizar constancia (venció)" : "Subir constancia (PDF o imagen)"]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 107,
				columnNumber: 7
			}, this),
			value && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
				className: "truncate text-[11px] text-muted-foreground",
				children: ["Archivo: ", value.fileName]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 129,
				columnNumber: 9
			}, this),
			value && detected && (detected.rfc || detected.razonSocial) && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
				className: "text-[11px] text-muted-foreground",
				children: [
					"Datos leídos:",
					" ",
					/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("span", {
						className: "font-semibold text-foreground",
						children: [detected.razonSocial, detected.rfc].filter(Boolean).join(" · ")
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 134,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 132,
				columnNumber: 9
			}, this),
			value && detected?.fechaEmision && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
				className: "text-[11px] text-muted-foreground",
				children: ["Emitida el ", /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("span", {
					className: "font-semibold text-foreground",
					children: detected.fechaEmision
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 141,
					columnNumber: 22
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 140,
				columnNumber: 9
			}, this),
			value && vigente && vence && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
				className: "text-[11px] text-primary",
				children: [
					"Validada. Vigente hasta el ",
					vence,
					"."
				]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 145,
				columnNumber: 9
			}, this),
			value && !vigente && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
				className: "text-[11px] text-destructive",
				children: "Tu constancia tiene más de un mes. Sube una actualizada para facturar esta compra."
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 149,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-[11px] text-muted-foreground",
				children: "Debe estar emitida en los últimos 30 días. Queda ligada a tu número de cliente y es válida por un mes: si entre compras pasa más de un mes, te pediremos una constancia actualizada. Se guarda de forma privada y solo la usamos para emitir tu CFDI. Máximo 10 MB."
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 153,
				columnNumber: 7
			}, this),
			error && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
				className: "text-[11px] text-destructive",
				children: error
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 158,
				columnNumber: 17
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 93,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/cart-drawer.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sheet, {
		open: isOpen,
		onOpenChange: setIsOpen,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SheetTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "outline",
				size: "icon",
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingCart, { className: "h-5 w-5" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 273,
					columnNumber: 11
				}, this), totals.totalItems > 0 && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV(Badge, {
					className: "absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full p-0 text-xs",
					children: totals.totalItems
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 275,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 272,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 271,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SheetContent, {
			className: "flex h-full w-full flex-col sm:max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SheetHeader, {
				className: "flex-shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SheetTitle, { children: "Tu carrito" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 283,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SheetDescription, { children: totals.totalItems === 0 ? "Tu carrito está vacío" : `${totals.totalItems} artículo${totals.totalItems !== 1 ? "s" : ""} · ${formatMxn(totals.total)}` }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 284,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 282,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex min-h-0 flex-1 flex-col pt-4",
				children: totals.lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-1 items-center justify-center text-center",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingCart, { className: "mx-auto mb-4 h-12 w-12 text-muted-foreground" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 295,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-muted-foreground",
						children: "Agrega un kit para comenzar"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 296,
						columnNumber: 17
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 294,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 293,
					columnNumber: 13
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "min-h-0 flex-1 space-y-4 overflow-y-auto pr-2",
					children: [
						totals.lines.map((line) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
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
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-sm font-semibold",
											children: line.variantName
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 312,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: line.title
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 313,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 311,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-6 w-6 shrink-0",
										onClick: () => removeItem(line.id),
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-3 w-3" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 321,
											columnNumber: 25
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 315,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 310,
									columnNumber: 21
								}, this),
								line.addOns.length > 0 && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("ul", {
									className: "mt-2 space-y-1 text-xs text-muted-foreground",
									children: line.addOns.map((a) => /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("li", { children: [
										"+ ",
										a.name,
										" — ",
										formatMxn(a.price)
									] }, a.name, true, {
										fileName: _jsxFileName$1,
										lineNumber: 328,
										columnNumber: 27
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 326,
									columnNumber: 23
								}, this),
								line.isRenewal && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("div", {
									className: "mt-3 space-y-2 rounded-lg border border-border/60 p-3",
									children: [/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
										className: "font-display text-[11px] font-bold uppercase tracking-widest text-muted-foreground",
										children: "Datos del equipo"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 337,
										columnNumber: 25
									}, this), /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV(RenewalForm, {
										variantId: line.variantId,
										value: line.renewal,
										onChange: (info) => updateRenewal(line.id, info),
										errors: renewalErrors[line.id]
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 340,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 336,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-3 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "outline",
												size: "icon",
												className: "h-6 w-6",
												onClick: () => updateQuantity(line.id, line.quantity - 1),
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Minus, { className: "h-3 w-3" }, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 357,
													columnNumber: 27
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 351,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "w-8 text-center text-sm",
												children: line.quantity
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 359,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "outline",
												size: "icon",
												className: "h-6 w-6",
												onClick: () => updateQuantity(line.id, line.quantity + 1),
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-3 w-3" }, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 366,
													columnNumber: 27
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 360,
												columnNumber: 25
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 350,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-display font-bold text-primary",
										children: formatMxn(line.lineTotal)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 369,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 349,
									columnNumber: 21
								}, this)
							]
						}, line.id, true, {
							fileName: _jsxFileName$1,
							lineNumber: 303,
							columnNumber: 19
						}, this)),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CustomerBlock, {}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 376,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "font-display text-xs font-bold uppercase tracking-widest text-muted-foreground",
									children: "Método de entrega"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 379,
									columnNumber: 19
								}, this),
								SHIPPING_OPTIONS.map((opt) => {
									const active = opt.id === shippingId;
									const Icon = opt.id === "local" ? MapPin : Truck;
									return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => setShipping(opt.id),
										className: `flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${active ? "border-primary bg-primary/10" : "border-border/60"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 394,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "block text-sm font-semibold",
													children: opt.label
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 396,
													columnNumber: 27
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "block text-xs text-muted-foreground",
													children: opt.description
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 397,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 395,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "shrink-0 font-display font-bold text-primary",
												children: opt.price === 0 ? "$0" : `+${formatMxn(opt.price)}`
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 401,
												columnNumber: 25
											}, this)
										]
									}, opt.id, true, {
										fileName: _jsxFileName$1,
										lineNumber: 386,
										columnNumber: 23
									}, this);
								}),
								shippingId === "local" && totals.lines.some((l) => !l.isRenewal) && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("div", {
									className: "space-y-3 rounded-xl border border-border/60 p-3",
									children: [
										/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
											className: "font-display text-xs font-bold uppercase tracking-widest text-muted-foreground",
											children: "Datos de contacto para la entrega"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 410,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV(PickupForm, {
											value: pickupInfo,
											onChange: setPickupInfo,
											errors: pickupErrors ?? void 0
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 413,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
											className: "text-[11px] text-muted-foreground",
											children: "Te contactamos para coordinar la entrega."
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 418,
											columnNumber: 23
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 409,
									columnNumber: 21
								}, this),
								shippingId === "national" && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("div", {
									className: "space-y-3 rounded-xl border border-border/60 p-3",
									children: [/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
										className: "font-display text-xs font-bold uppercase tracking-widest text-muted-foreground",
										children: "Datos de envío"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 426,
										columnNumber: 23
									}, this), /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV(ShippingForm, {
										value: shippingInfo,
										onChange: setShippingInfo,
										errors: errors ?? void 0
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 429,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 425,
									columnNumber: 21
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 378,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-3 rounded-xl border border-border/60 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									type: "checkbox",
									checked: wantsInvoice,
									onChange: (e) => setWantsInvoice(e.target.checked),
									className: "mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 440,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "flex items-center gap-2 text-sm font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileText, { className: "h-4 w-4 text-primary" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 448,
											columnNumber: 25
										}, this), "Requiero factura (CFDI 4.0)"]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 447,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "block text-xs text-muted-foreground",
										children: "Captura tus datos fiscales para emitirla al registrar tu compra."
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 451,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 446,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 439,
								columnNumber: 19
							}, this), wantsInvoice && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("div", {
								className: "space-y-3 border-t border-border/60 pt-3",
								children: [
									/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
										className: "font-display text-xs font-bold uppercase tracking-widest text-muted-foreground",
										children: "Datos de facturación"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 459,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV(BillingForm, {
										value: billingInfo,
										onChange: setBillingInfo,
										errors: billingErrors ?? void 0
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 462,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV(ConstanciaUpload, {
										value: constancia,
										rfc: billingInfo?.rfc,
										onChange: (file) => {
											setConstancia(file);
											if (file) setConstanciaError(null);
										},
										error: constanciaError ?? void 0
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 467,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Necesitamos razón social, RFC, régimen fiscal, uso de CFDI, C.P. fiscal y correo, además de tu Constancia de Situación Fiscal, para emitir tu factura."
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 476,
										columnNumber: 23
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 458,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 438,
							columnNumber: 17
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 301,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex-shrink-0 space-y-2 border-t border-border/60 bg-background pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex justify-between text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Productos" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 487,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: formatMxn(totals.productsTotal) }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 488,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 486,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex justify-between text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Envío" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 491,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: formatMxn(totals.shipping.price) }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 492,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 490,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex justify-between text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Subtotal sin IVA" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 495,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: formatMxn(totals.subtotalWithoutIva) }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 496,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 494,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex justify-between text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "IVA (16%)" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 499,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: formatMxn(totals.iva) }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 500,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 498,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between border-t border-border/60 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-display text-lg font-bold uppercase",
								children: "Total"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 503,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-display text-2xl font-bold text-primary",
								children: formatMxn(totals.total)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 504,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 502,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "Precios en MXN: todos los paquetes ya incluyen el 16% de IVA y la factura se incluye al registrar la compra en sistema. Al realizar tu pedido aceptas el uso de datos y condiciones del sitio."
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 508,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: handleWhatsappCheckout,
							className: "w-full",
							size: "lg",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { className: "mr-2 h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 515,
								columnNumber: 19
							}, this), "Realizar solicitud"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 514,
							columnNumber: 17
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 485,
					columnNumber: 15
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 300,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 291,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 281,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 270,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/components/site-chrome.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
		className: "sticky top-0 z-[2000] border-b border-border/60 bg-background/95 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: "/",
					className: "flex items-center",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
						src: orb_lite_logo_default,
						alt: "ORB-LITE rastreo GPS satelital",
						className: "h-16 w-auto drop-shadow-[0_0_20px_color-mix(in_oklab,var(--primary)_30%,transparent)] sm:h-20"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 23,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 22,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					className: "inline-flex size-11 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary hover:text-primary sm:hidden",
					"aria-label": menuOpen ? "Cerrar menú" : "Abrir menú",
					"aria-expanded": menuOpen,
					onClick: () => setMenuOpen((open) => !open),
					children: menuOpen ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "size-5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 37,
						columnNumber: 23
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Menu, { className: "size-5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 37,
						columnNumber: 50
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 30,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
					className: `${menuOpen ? "flex" : "hidden"} w-full flex-col items-stretch gap-1 border-t border-border/60 pt-3 font-display text-sm font-bold uppercase tracking-widest sm:flex sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-4 sm:gap-y-2 sm:border-0 sm:pt-0 sm:text-xs md:gap-6 md:text-sm`,
					children: [nav.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: item.to,
						className: "rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary sm:px-0 sm:py-1",
						activeProps: { className: "text-primary" },
						activeOptions: { exact: item.to === "/" },
						onClick: () => setMenuOpen(false),
						children: item.label
					}, item.to, false, {
						fileName: _jsxFileName,
						lineNumber: 46,
						columnNumber: 13
					}, this)), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "px-3 py-2 sm:px-0 sm:py-1",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CartDrawer, {}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 58,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 57,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 40,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 21,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 20,
		columnNumber: 5
	}, this);
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
		className: "border-t border-border/60 py-10 text-center text-sm text-muted-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "ORB-LITE · Rastreo GPS Satelital · Para personas, empresas y negocios" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 69,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "tel:+523318359421",
						className: "hover:text-primary",
						children: "33 1835 9421"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 71,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "px-2 text-primary",
						children: "|"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 74,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "mailto:ventas@orb-lite.com",
						className: "hover:text-primary",
						children: "ventas@orb-lite.com"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 75,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 70,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-2",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
					href: "https://api.whatsapp.com/send?phone=523318359421",
					target: "_blank",
					rel: "noreferrer",
					className: "hover:text-primary",
					children: "WhatsApp: 331 835 9421"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 80,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 79,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
				className: "mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3 px-5 text-xs uppercase tracking-widest",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
						className: "rounded-full border border-primary/30 px-4 py-2 text-primary",
						children: "Soporte técnico incluido"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 91,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
						className: "rounded-full border border-primary/30 px-4 py-2 text-primary",
						children: "Entrega incluida en GDL/ZMG"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 94,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
						className: "rounded-full border border-primary/30 px-4 py-2 text-primary",
						children: "Envíos a todo México"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 97,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 90,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/servicios",
						className: "hover:text-primary",
						children: "Servicios"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 103,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "px-2 text-primary",
						children: "|"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 106,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/tienda",
						className: "hover:text-primary",
						children: "Tienda"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 107,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 102,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/terminos",
				className: "mx-auto mt-6 inline-block rounded-md border border-border/60 px-4 py-2 font-display text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary",
				children: "Uso de datos y condiciones"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 112,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 68,
		columnNumber: 5
	}, this);
}
function CtaBanner() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "mx-auto max-w-6xl px-5 pb-20",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl px-6 py-10 text-center",
			style: { background: "var(--gradient-lime)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "font-display text-3xl font-bold uppercase italic text-primary-foreground sm:text-4xl",
					children: "Solicita información hoy"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 129,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "max-w-xl text-primary-foreground/85",
					children: "Pregunta por paquetes, planes de servicio y precios de renovación anual, ya sea para un vehículo, tu flota o tu negocio."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 132,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: "/contacto",
					className: "rounded-md border-2 border-primary-foreground/70 px-6 py-2 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground",
					children: "Contactar ahora"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 137,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 125,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 124,
		columnNumber: 5
	}, this);
}
//#endregion
export { SiteFooter as a, formatRenewalInfo as c, validatePickup as d, validateRenewal as f, ShippingForm as i, formatShippingInfo as l, PickupForm as n, SiteHeader as o, validateShipping as p, RenewalForm as r, formatPickupInfo as s, CtaBanner as t, useCartStore as u };
