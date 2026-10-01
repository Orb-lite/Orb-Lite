import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { A as MessageCircle, P as MapPin, _ as Satellite, f as ShoppingCart, lt as CircleCheck, nt as Cpu, o as Truck, p as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as formatMxn, i as SHIPPING_OPTIONS, r as PRODUCTS } from "./catalog-BhuVKh9L.mjs";
import { t as openWhatsApp } from "./whatsapp-k5-h86dD.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion+[...].mjs";
import { c as formatRenewalInfo, d as validatePickup, f as validateRenewal, i as ShippingForm, l as formatShippingInfo, n as PickupForm, p as validateShipping, r as RenewalForm, s as formatPickupInfo, t as CtaBanner, u as useCartStore } from "./site-chrome-C_0ylVFU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tienda-BxOnUyk6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$2 = "/app/applet/src/components/product-card.tsx";
var NATIONAL = SHIPPING_OPTIONS.find((s) => s.id === "national");
function ProductCard({ product }) {
	const addItem = useCartStore((s) => s.addItem);
	const setShipping = useCartStore((s) => s.setShipping);
	const setShippingInfo = useCartStore((s) => s.setShippingInfo);
	const setPickupInfo = useCartStore((s) => s.setPickupInfo);
	const [variantId, setVariantId] = (0, import_react.useState)(product.variants[0].id);
	const [needsShipping, setNeedsShipping] = (0, import_react.useState)(false);
	const [info, setInfo] = (0, import_react.useState)(null);
	const [errors, setErrors] = (0, import_react.useState)(null);
	const [pickup, setPickup] = (0, import_react.useState)(null);
	const [pickupErrors, setPickupErrors] = (0, import_react.useState)(null);
	const [renewal, setRenewal] = (0, import_react.useState)(null);
	const [renewalKey, setRenewalKey] = (0, import_react.useState)(0);
	const [renewalErrors, setRenewalErrors] = (0, import_react.useState)(null);
	const variant = product.variants.find((v) => v.id === variantId);
	const isDigital = product.category === "RENOVATION";
	const total = variant.price + (!isDigital && needsShipping ? NATIONAL.price : 0);
	const commitShipping = () => {
		if (isDigital) {
			setShipping("local");
			setErrors(null);
			const { data, errors: nextErrors } = validateRenewal(variantId, renewal);
			if (!data) {
				setRenewalErrors(nextErrors);
				toast.error("Completa los datos de renovación");
				return false;
			}
			setRenewalErrors(null);
			return data;
		}
		if (!needsShipping) {
			setShipping("local");
			setErrors(null);
			const { data, errors: nextErrors } = validatePickup(pickup);
			if (!data) {
				setPickupErrors(nextErrors);
				toast.error("Déjanos tu nombre y teléfono para coordinar la entrega");
				return false;
			}
			setPickupErrors(null);
			setPickupInfo(data);
			return null;
		}
		const { data, errors: nextErrors } = validateShipping(info);
		if (!data) {
			setErrors(nextErrors);
			toast.error("Revisa los datos de envío");
			return false;
		}
		setErrors(null);
		setShipping("national");
		setShippingInfo(data);
		return null;
	};
	const handleAdd = () => {
		const result = commitShipping();
		if (result === false) return;
		addItem({
			variant_id: variant.id,
			quantity: 1,
			add_ons: [],
			renewal: result
		});
		toast.success("Agregado al carrito", { description: result ? `${variant.name} · ${result.unitName}` : variant.name });
		if (isDigital) {
			setRenewal(null);
			setRenewalKey((k) => k + 1);
		}
	};
	const handleWhatsapp = () => {
		const result = commitShipping();
		if (result === false) return;
		const shippingLine = isDigital ? "" : needsShipping ? `\n+ ${NATIONAL.label} — ${formatMxn(NATIONAL.price)}` : `\n+ ${SHIPPING_OPTIONS[0].label} — sin costo`;
		const details = isDigital ? result ? formatRenewalInfo(result) : "" : needsShipping && info ? formatShippingInfo(info) : pickup ? formatPickupInfo(pickup) : "";
		const text = `Hola ORB-LITE, me interesa:\n\n*${product.title}*\n· ${variant.name} — ${formatMxn(variant.price)}${shippingLine}\n\nTotal estimado: ${formatMxn(total)} MXN${details}`;
		openWhatsApp(text);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.article, {
		layout: true,
		initial: {
			opacity: 0,
			y: 16
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { duration: .35 },
		className: "flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_8%,transparent)] backdrop-blur transition-shadow hover:border-primary/60 hover:shadow-[0_0_35px_-10px_color-mix(in_oklab,var(--primary)_45%,transparent)]",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "aspect-[4/3] overflow-hidden bg-secondary/20",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
				src: product.image_url,
				alt: product.title,
				className: "h-full w-full object-cover transition-transform duration-500 hover:scale-105",
				loading: "lazy"
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 123,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 122,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex flex-1 flex-col gap-4 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
						className: "font-display text-lg font-bold uppercase italic leading-tight",
						children: product.title
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 133,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-muted-foreground",
						children: product.description
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 136,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 132,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
					className: "flex flex-wrap gap-2",
					children: product.features.map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
						className: "rounded-full border border-primary/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary",
						children: f
					}, f, false, {
						fileName: _jsxFileName$2,
						lineNumber: 141,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 139,
					columnNumber: 9
				}, this),
				product.variants.length > 1 && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("div", {
					className: "space-y-2",
					children: product.variants.map((v) => {
						return /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("button", {
							type: "button",
							onClick: () => setVariantId(v.id),
							className: `w-full rounded-xl border p-3 text-left transition-colors ${v.id === variantId ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/50"}`,
							children: /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
										className: "truncate text-sm font-semibold",
										children: v.name
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 167,
										columnNumber: 23
									}, this), v.badge && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
										className: "text-[11px] uppercase tracking-wide text-primary",
										children: v.badge
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 169,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 166,
									columnNumber: 21
								}, this), /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("div", {
									className: "shrink-0 text-right",
									children: [v.original_price && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
										className: "text-xs text-muted-foreground line-through",
										children: formatMxn(v.original_price)
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 176,
										columnNumber: 25
									}, this), /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
										className: "font-display font-bold text-primary",
										children: formatMxn(v.price)
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 180,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 174,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 165,
								columnNumber: 19
							}, this)
						}, v.id, false, {
							fileName: _jsxFileName$2,
							lineNumber: 155,
							columnNumber: 17
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 151,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatePresence, {
					mode: "wait",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.ul, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						exit: { opacity: 0 },
						className: "space-y-1 text-sm text-muted-foreground",
						children: variant.includes.map((inc) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 199,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: inc }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 200,
								columnNumber: 17
							}, this)]
						}, inc, true, {
							fileName: _jsxFileName$2,
							lineNumber: 198,
							columnNumber: 15
						}, this))
					}, variant.id, false, {
						fileName: _jsxFileName$2,
						lineNumber: 190,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 189,
					columnNumber: 9
				}, this),
				isDigital && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("div", {
					className: "space-y-3 rounded-xl border border-border/60 p-3",
					children: [
						/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
							className: "font-display text-xs font-bold uppercase tracking-widest text-muted-foreground",
							children: "Datos de renovación (por equipo)"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 208,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV(RenewalForm, {
							variantId,
							value: renewal,
							onChange: setRenewal,
							errors: renewalErrors ?? void 0
						}, `${variantId}-${renewalKey}`, false, {
							fileName: _jsxFileName$2,
							lineNumber: 211,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
							className: "text-[11px] text-muted-foreground",
							children: "Agrega un paquete por equipo: cada uno guarda sus propios datos en el carrito."
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 218,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 207,
					columnNumber: 11
				}, this),
				!isDigital && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("div", {
					className: "space-y-3 rounded-xl border border-border/60 p-3",
					children: [/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("label", {
						className: "flex cursor-pointer items-start gap-2 text-sm",
						children: [/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("input", {
							type: "checkbox",
							checked: needsShipping,
							onChange: (e) => {
								setNeedsShipping(e.target.checked);
								setErrors(null);
								setShipping(e.target.checked ? "national" : "local");
							},
							className: "mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 227,
							columnNumber: 15
						}, this), /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("span", {
								className: "flex items-center gap-2 font-semibold",
								children: [/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV(Truck, { className: "h-4 w-4 text-primary" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 239,
									columnNumber: 19
								}, this), "Envío fuera de Guadalajara"]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 238,
								columnNumber: 17
							}, this), /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("span", {
								className: "block text-xs text-muted-foreground",
								children: [
									NATIONAL.description,
									" ",
									/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("span", {
										className: "font-semibold text-primary",
										children: ["+", formatMxn(NATIONAL.price)]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 244,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 242,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 237,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 226,
						columnNumber: 13
					}, this), needsShipping ? /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV(ShippingForm, {
						value: info,
						onChange: setInfo,
						errors: errors ?? void 0
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 250,
						columnNumber: 15
					}, this) : /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("div", {
						className: "space-y-2 border-t border-border/60 pt-3",
						children: [
							/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
								className: "font-display text-xs font-bold uppercase tracking-widest text-muted-foreground",
								children: "Datos de contacto para la entrega"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 253,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV(PickupForm, {
								value: pickup,
								onChange: setPickup,
								errors: pickupErrors ?? void 0
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 256,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Te contactamos para coordinar la entrega en Guadalajara."
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 261,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 252,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 225,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-auto space-y-3 border-t border-border/60 pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-baseline justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: "Total"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 271,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-display text-2xl font-bold text-primary",
									children: formatMxn(total)
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 273,
									columnNumber: 15
								}, this), variant.price_note && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("p", {
									className: "text-[11px] text-muted-foreground",
									children: variant.price_note
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 277,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 272,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 270,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "Todos los paquetes ya incluyen el 16% de IVA. La factura se incluye al registrar tu compra en sistema."
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 281,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: handleAdd,
							className: "w-full",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingCart, { className: "mr-2 h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 286,
								columnNumber: 13
							}, this), "Agregar al carrito"]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 285,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: handleWhatsapp,
							variant: "outline",
							className: "w-full",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { className: "mr-2 h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 290,
								columnNumber: 13
							}, this), "Comprar por WhatsApp"]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 289,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 269,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 131,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 115,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/catalog-grid.tsx";
var TABS = [
	{
		id: "ALL",
		label: "Todos"
	},
	{
		id: "B2B",
		label: "Para Instaladores / Flotillas"
	},
	{
		id: "B2C",
		label: "Para Usuario Final"
	},
	{
		id: "RENOVATION",
		label: "Renovaciones"
	}
];
function CatalogGrid({ initialFilter = "ALL", showTabs = true }) {
	const [filter, setFilter] = (0, import_react.useState)(initialFilter);
	const products = PRODUCTS.filter((p) => filter === "ALL" || p.category === filter);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-8",
		children: [showTabs && /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("div", {
			className: "flex flex-wrap justify-center gap-2",
			children: TABS.map((tab) => /* @__PURE__ */ import_jsx_dev_runtime.jsxDEV("button", {
				type: "button",
				onClick: () => setFilter(tab.id),
				className: `rounded-full border px-4 py-2 font-display text-xs font-bold uppercase tracking-widest transition-colors ${filter === tab.id ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary"}`,
				children: tab.label
			}, tab.id, false, {
				fileName: _jsxFileName$1,
				lineNumber: 30,
				columnNumber: 13
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 28,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			layout: true,
			className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatePresence, {
				mode: "popLayout",
				children: products.map((product) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ProductCard, { product }, product.id, false, {
					fileName: _jsxFileName$1,
					lineNumber: 49,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 47,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 46,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 26,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/tienda.tsx?tsr-split=component";
var BADGES = [
	{
		icon: Satellite,
		label: "4G LTE confiable"
	},
	{
		icon: MapPin,
		label: "Tiempo real"
	},
	{
		icon: ShieldCheck,
		label: "Seguro"
	},
	{
		icon: Cpu,
		label: "Fácil instalación"
	}
];
function TiendaPage() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "mx-auto max-w-6xl px-5 pb-10 pt-14 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "font-display text-4xl font-bold uppercase italic sm:text-5xl",
					children: ["Tienda ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-primary",
						children: "ORB-LITE"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 21,
						columnNumber: 18
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 20,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mx-auto mt-4 max-w-2xl text-muted-foreground",
					children: "Kits para instaladores y flotillas, servicio llave en mano para usuario final y renovaciones anuales — todo en un solo lugar. Teltonika FTC927 4G LTE CAT 1."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 23,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-3",
					children: BADGES.map(({ icon: Icon, label }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 32,
							columnNumber: 15
						}, this), label]
					}, label, true, {
						fileName: _jsxFileName,
						lineNumber: 31,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 27,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 19,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "mx-auto max-w-6xl px-5 pb-20",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CatalogGrid, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 39,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 38,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CtaBanner, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 42,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 18,
		columnNumber: 10
	}, this);
}
//#endregion
export { TiendaPage as component };
