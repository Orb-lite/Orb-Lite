import { o as __toESM } from "../_runtime.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as formatMxn, i as SHIPPING_OPTIONS, r as PRODUCTS } from "./catalog-BhuVKh9L.mjs";
import { A as MapPin, E as MessageCircle, Y as Cpu, d as ShieldCheck, et as CircleCheck, o as Truck, p as Satellite, u as ShoppingCart } from "../_libs/lucide-react.mjs";
import { t as openWhatsApp } from "./whatsapp-k5-h86dD.mjs";
import { c as formatRenewalInfo, d as validatePickup, f as validateRenewal, i as ShippingForm, l as formatShippingInfo, n as PickupForm, p as validateShipping, r as RenewalForm, s as formatPickupInfo, t as CtaBanner, u as useCartStore } from "./site-chrome-BvyCz3JB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tienda-B1dVxcP8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
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
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "aspect-[4/3] overflow-hidden bg-secondary/20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: product.image_url,
				alt: product.title,
				className: "h-full w-full object-cover transition-transform duration-500 hover:scale-105",
				loading: "lazy"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-4 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-bold uppercase italic leading-tight",
						children: product.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: product.description
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-wrap gap-2",
					children: product.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-full border border-primary/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary",
						children: f
					}, f))
				}),
				product.variants.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: product.variants.map((v) => {
						const active = v.id === variantId;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setVariantId(v.id),
							className: `w-full rounded-xl border p-3 text-left transition-colors ${active ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/50"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold",
										children: v.name
									}), v.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] uppercase tracking-wide text-primary",
										children: v.badge
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "shrink-0 text-right",
									children: [v.original_price && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground line-through",
										children: formatMxn(v.original_price)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display font-bold text-primary",
										children: formatMxn(v.price)
									})]
								})]
							})
						}, v.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					mode: "wait",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.ul, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						exit: { opacity: 0 },
						className: "space-y-1 text-sm text-muted-foreground",
						children: variant.includes.map((inc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inc })]
						}, inc))
					}, variant.id)
				}),
				isDigital && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 rounded-xl border border-border/60 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs font-bold uppercase tracking-widest text-muted-foreground",
							children: "Datos de renovación (por equipo)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenewalForm, {
							variantId,
							value: renewal,
							onChange: setRenewal,
							errors: renewalErrors ?? void 0
						}, `${variantId}-${renewalKey}`),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "Agrega un paquete por equipo: cada uno guarda sus propios datos en el carrito."
						})
					]
				}),
				!isDigital && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 rounded-xl border border-border/60 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex cursor-pointer items-start gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: needsShipping,
							onChange: (e) => {
								setNeedsShipping(e.target.checked);
								setErrors(null);
								setShipping(e.target.checked ? "national" : "local");
							},
							className: "mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2 font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-primary" }), "Envío fuera de Guadalajara"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xs text-muted-foreground",
								children: [
									NATIONAL.description,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-primary",
										children: ["+", formatMxn(NATIONAL.price)]
									})
								]
							})]
						})]
					}), needsShipping ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShippingForm, {
						value: info,
						onChange: setInfo,
						errors: errors ?? void 0
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 border-t border-border/60 pt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xs font-bold uppercase tracking-widest text-muted-foreground",
								children: "Datos de contacto para la entrega"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickupForm, {
								value: pickup,
								onChange: setPickup,
								errors: pickupErrors ?? void 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Te contactamos para coordinar la entrega en Guadalajara."
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto space-y-3 border-t border-border/60 pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: "Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-2xl font-bold text-primary",
									children: formatMxn(total)
								}), variant.price_note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: variant.price_note
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Todos los paquetes ya incluyen el 16% de IVA. La factura se incluye al registrar tu compra en sistema."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleAdd,
							className: "w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "mr-2 h-4 w-4" }), "Agregar al carrito"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleWhatsapp,
							variant: "outline",
							className: "w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "mr-2 h-4 w-4" }), "Comprar por WhatsApp"]
						})
					]
				})
			]
		})]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [showTabs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap justify-center gap-2",
			children: TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setFilter(tab.id),
				className: `rounded-full border px-4 py-2 font-display text-xs font-bold uppercase tracking-widest transition-colors ${filter === tab.id ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary"}`,
				children: tab.label
			}, tab.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			layout: true,
			className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "popLayout",
				children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product }, product.id))
			})
		})]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-5 pb-10 pt-14 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-4xl font-bold uppercase italic sm:text-5xl",
					children: ["Tienda ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: "ORB-LITE"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-4 max-w-2xl text-muted-foreground",
					children: "Kits para instaladores y flotillas, servicio llave en mano para usuario final y renovaciones anuales — todo en un solo lugar. Teltonika FTC927 4G LTE CAT 1."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-3",
					children: BADGES.map(({ icon: Icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), label]
					}, label))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-6xl px-5 pb-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogGrid, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaBanner, {})
	] });
}
//#endregion
export { TiendaPage as component };
