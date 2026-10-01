import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as supabase } from "./client-DdsPy57x.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as formatMxn, i as SHIPPING_OPTIONS, l as renewalMeta, n as IVA_RATE, r as PRODUCTS, s as findVariant } from "./catalog-BhuVKh9L.mjs";
import { _ as crmUpdateCustomer, a as crmDeleteDemoRequest, c as crmListCustomers, f as crmListSolicitudes, g as crmSendDemoRequest, i as crmDeleteCustomer, l as crmListDemoRequests, m as crmSaveCustomer, n as crmCreateDemoUser, o as crmDeleteDemoUser, p as crmLookupCustomer, r as crmCreateSale, t as buildDemoUsername, u as crmListDemoUsers, v as crmUpdateSolicitud } from "./crm.functions-Bvnaa5DX.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CwLzEEob.mjs";
import { a as mxn, i as SolicitudDetailDialog, n as STATUS_LABEL, r as SolicitudCard, t as BillingRows } from "./solicitud-card-B-7Kfjdk.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm-B1rd92SU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: id,
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id,
			type,
			value,
			placeholder,
			autoComplete: "off",
			onChange: (e) => onChange(e.target.value)
		})]
	});
}
function ClienteFieldsGrid({ prefix, value, onChange }) {
	const set = (k) => (v) => onChange({
		...value,
		[k]: v
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-name`,
				label: "Nombre completo",
				value: value.fullName,
				onChange: set("fullName")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-phone`,
				label: "Teléfono",
				value: value.phone,
				onChange: set("phone")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-email`,
				label: "Correo (opcional)",
				type: "email",
				value: value.email,
				onChange: set("email")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-city`,
				label: "Ciudad (opcional)",
				value: value.city,
				onChange: set("city")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-state`,
				label: "Estado (opcional)",
				value: value.state,
				onChange: set("state")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-zip`,
				label: "Código postal (opcional)",
				value: value.zip,
				onChange: set("zip")
			})
		]
	});
}
function BillingFieldsGrid({ prefix, value, onChange }) {
	const set = (k) => (v) => onChange({
		...value,
		[k]: v
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-legal`,
				label: "Razón social",
				value: value.legalName,
				onChange: set("legalName")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-rfc`,
				label: "RFC",
				value: value.rfc,
				onChange: set("rfc")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-regime`,
				label: "Régimen fiscal",
				value: value.taxRegime,
				onChange: set("taxRegime")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-cfdi`,
				label: "Uso de CFDI",
				value: value.cfdiUse,
				onChange: set("cfdiUse")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-zip`,
				label: "CP fiscal",
				value: value.fiscalZip,
				onChange: set("fiscalZip")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-bemail`,
				label: "Correo de facturación",
				type: "email",
				value: value.email,
				onChange: set("email")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-bphone`,
				label: "Teléfono de facturación",
				value: value.phone,
				onChange: set("phone")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-address`,
				label: "Dirección fiscal",
				value: value.fiscalAddress,
				onChange: set("fiscalAddress")
			})
		]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base text-foreground",
						children: "Registrar venta fuera de la página"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Captura ventas hechas por WhatsApp, teléfono o mostrador; se guardan en la bitácora y en el historial del cliente."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "venta-num",
								className: "text-xs text-muted-foreground",
								children: "Número de cliente (opcional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "venta-num",
									value: cliente.customerNumber,
									autoComplete: "off",
									placeholder: "Ej. 1024",
									onChange: (e) => setCliente({
										...cliente,
										customerNumber: e.target.value.replace(/\D/g, "")
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									disabled: !cliente.customerNumber || lookupMutation.isPending,
									onClick: () => lookupMutation.mutate(Number(cliente.customerNumber)),
									children: "Cargar"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs text-muted-foreground",
								children: "Canal de la venta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: CHANNELS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: channel === c ? "default" : "outline",
									onClick: () => setChannel(c),
									children: c
								}, c))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClienteFieldsGrid, {
						prefix: "venta",
						value: cliente,
						onChange: setCliente
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm uppercase tracking-wide text-primary",
						children: "Productos"
					}),
					lines.map((line, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px_100px_auto] sm:items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs text-muted-foreground",
										children: "Producto"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
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
										children: [PRODUCTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
											label: p.title,
											children: p.variants.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: v.id,
												children: [
													v.name,
													" — ",
													formatMxn(v.price)
												]
											}, v.id))
										}, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: CUSTOM_ID,
											children: "Producto personalizado (nombre e importe libres)"
										})]
									}),
									line.variantId === CUSTOM_ID && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-2",
										autoComplete: "off",
										placeholder: "Nombre del producto o servicio",
										value: line.customName,
										onChange: (e) => setLines(lines.map((l, i) => i === index ? {
											...l,
											customName: e.target.value
										} : l))
									}),
									renewalFieldsFor(line.variantId).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 space-y-2 rounded-md border border-border/60 bg-muted/30 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] uppercase tracking-wide text-muted-foreground",
											children: [
												"Datos de la renovación (",
												renewalMeta(line.variantId)?.platform,
												" ·",
												" ",
												renewalMeta(line.variantId)?.period === "monthly" ? "mensual" : "anual",
												")"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid gap-2 sm:grid-cols-2",
											children: renewalFieldsFor(line.variantId).map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
											}, field))
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Precio unitario"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									max: 1e7,
									step: "0.01",
									value: line.unitPrice,
									onChange: (e) => setLines(lines.map((l, i) => i === index ? {
										...l,
										unitPrice: Math.max(0, Math.min(1e7, Number(e.target.value) || 0))
									} : l))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Cantidad"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									max: 100,
									value: line.quantity,
									onChange: (e) => setLines(lines.map((l, i) => i === index ? {
										...l,
										quantity: Math.max(1, Math.min(100, Number(e.target.value) || 1))
									} : l))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								disabled: lines.length === 1,
								onClick: () => setLines(lines.filter((_, i) => i !== index)),
								children: "Quitar"
							})
						]
					}, index)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs text-muted-foreground",
							children: "Entrega"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: SHIPPING_OPTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								variant: shippingId === s.id ? "default" : "outline",
								onClick: () => setShippingId(s.id),
								children: [
									s.label,
									" ",
									s.price > 0 ? `(+${formatMxn(s.price)})` : ""
								]
							}, s.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-primary/40 bg-primary/5 p-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex justify-between text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Productos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: formatMxn(productsTotal)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex justify-between text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Entrega" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: formatMxn(shipping.price)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 pt-1 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: addIva,
									onChange: (e) => setAddIva(e.target.checked),
									className: "h-4 w-4 accent-primary"
								}), "Agregar IVA (16%)"]
							}),
							addIva ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex justify-between text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "IVA" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: formatMxn(iva)
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 flex justify-between border-t border-border pt-2 text-base",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: addIva ? "Total con IVA" : "Total (IVA incluido)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: formatMxn(total)
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 text-sm text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: wantsInvoice,
							onChange: (e) => setWantsInvoice(e.target.checked),
							className: "h-4 w-4 accent-primary"
						}), "El cliente pidió factura"]
					}),
					wantsInvoice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingFieldsGrid, {
						prefix: "venta",
						value: billing,
						onChange: setBilling
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs text-muted-foreground",
							children: "Estado de la venta"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								"vendido",
								"pendiente",
								"no_vendido"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: status === s ? "default" : "outline",
								onClick: () => setStatus(s),
								children: s === "no_vendido" ? "No vendido" : s === "vendido" ? "Vendido" : "Pendiente"
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "venta-notes",
							className: "text-xs text-muted-foreground",
							children: "Notas internas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "venta-notes",
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							rows: 3,
							className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground",
							placeholder: "Forma de pago, fecha de instalación, acuerdos…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !canSubmit,
						onClick: () => mutation.mutate(),
						children: mutation.isPending ? "Guardando…" : "Registrar venta"
					}),
					result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-primary",
						children: [
							"Venta ",
							result.orderId,
							" registrada para el cliente #",
							result.customerNumber,
							"."
						]
					}) : null
				]
			})
		]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "space-y-4 rounded-xl border border-border bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base text-foreground",
					children: "Registrar cliente"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Da de alta un cliente sin venta. Si dejas el número vacío se genera uno automáticamente."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5 sm:max-w-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cli-num",
						className: "text-xs text-muted-foreground",
						children: "Número de cliente (opcional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "cli-num",
							value: cliente.customerNumber,
							autoComplete: "off",
							placeholder: "Ej. 1024",
							onChange: (e) => setCliente({
								...cliente,
								customerNumber: e.target.value.replace(/\D/g, "")
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							disabled: !cliente.customerNumber || lookupMutation.isPending,
							onClick: () => lookupMutation.mutate(Number(cliente.customerNumber)),
							children: "Cargar"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClienteFieldsGrid, {
					prefix: "cli",
					value: cliente,
					onChange: setCliente
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-3 text-sm text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: withBilling,
						onChange: (e) => setWithBilling(e.target.checked),
						className: "h-4 w-4 accent-primary"
					}), "Guardar datos de facturación"]
				}),
				withBilling ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingFieldsGrid, {
					prefix: "cli",
					value: billing,
					onChange: setBilling
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: !canSubmit,
					onClick: () => mutation.mutate(),
					children: mutation.isPending ? "Guardando…" : "Guardar cliente"
				}),
				created ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-primary",
					children: [
						created.isNew ? "Alta creada" : "Datos actualizados",
						" · cliente #",
						created.customerNumber
					]
				}) : null
			]
		})
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[85vh] max-w-2xl overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Editar cliente #", cliente.customerNumber] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Actualiza contacto y facturación. El historial de compras no se modifica." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClienteFieldsGrid, {
						prefix: "edit",
						value: cliente,
						onChange: setCliente
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 text-sm text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: withBilling,
							onChange: (e) => setWithBilling(e.target.checked),
							className: "h-4 w-4 accent-primary"
						}), "Guardar datos de facturación"]
					}),
					withBilling ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingFieldsGrid, {
						prefix: "edit",
						value: billing,
						onChange: setBilling
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => onOpenChange(false),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: !canSubmit,
							onClick: () => mutation.mutate(),
							children: mutation.isPending ? "Guardando…" : "Guardar cambios"
						})]
					})
				]
			})]
		})
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-foreground",
					children: "Usuarios demo Wialon"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Genera el usuario para crear la cuenta demo en Wialon Lite o Wialon Full. Uno por cliente; la contraseña siempre es ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: DEMO_PASSWORD
						}),
						"."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4 rounded-2xl border border-border bg-card p-5",
				onSubmit: (e) => {
					e.preventDefault();
					creation.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "demo-nombre",
									children: "Nombre y apellido del cliente"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "demo-nombre",
									value: fullName,
									onChange: (e) => setFullName(e.target.value),
									placeholder: "John Doe",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "demo-empresa",
									children: "Empresa o razón social (opcional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "demo-empresa",
									value: company,
									onChange: (e) => setCompany(e.target.value),
									placeholder: "Transportes ABC"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "demo-cliente",
									children: "Número de cliente (opcional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "demo-cliente",
									inputMode: "numeric",
									value: customerNumber,
									onChange: (e) => setCustomerNumber(e.target.value.replace(/[^0-9]/g, "")),
									placeholder: "500"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Plataforma solicitada" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-2",
									children: ["wialon_lite", "wialon_full"].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										variant: platform === p ? "default" : "outline",
										onClick: () => setPlatform(p),
										children: PLATFORM_LABEL$1[p]
									}, p))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "demo-email",
									children: "Correo del cliente (para enviar el folleto de acceso)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "demo-email",
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "john.doe@example.com — si lo dejas vacío se usa el del cliente registrado"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "demo-notas",
									children: "Notas internas (opcional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "demo-notas",
									value: notes,
									onChange: (e) => setNotes(e.target.value),
									placeholder: "Demo por 7 días, 1 unidad"
								})]
							})
						]
					}),
					preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"Usuario propuesto: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-foreground",
								children: preview
							}),
							" · contraseña ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-foreground",
								children: DEMO_PASSWORD
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: creation.isPending,
						children: creation.isPending ? "Generando…" : "Generar usuario demo"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium text-foreground",
					children: "Usuarios demo generados"
				}), query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Cargando…"
				}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Aún no hay usuarios demo."
				}) : rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-foreground",
								children: [
									row.username,
									" · ",
									row.password
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground",
								children: [
									row.full_name,
									row.company ? ` · ${row.company}` : "",
									row.customer_number ? ` · Cliente #${row.customer_number}` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [PLATFORM_LABEL$1[row.platform] ?? row.platform, row.notes ? ` · ${row.notes}` : ""]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => {
								navigator.clipboard?.writeText(`${row.username} / ${row.password}`);
								toast.success("Usuario copiado");
							},
							children: "Copiar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "destructive",
							onClick: () => deletion.mutate(row.id),
							disabled: deletion.isPending,
							children: "Borrar"
						})]
					})]
				}, row.id))]
			})
		]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-foreground",
					children: "Solicitudes de demo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: ["Llegan desde la página. El correo con usuario y contraseña se envía solo cuando presionas “Enviar datos”. Pendientes: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: pendientes
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: [
					"pendiente",
					"enviado",
					"todas"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: filter === f ? "default" : "outline",
					onClick: () => setFilter(f),
					children: f === "pendiente" ? "Pendientes" : f === "enviado" ? "Enviadas" : "Todas"
				}, f))
			}),
			query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Cargando…"
			}) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No hay solicitudes en este filtro."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: visible.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "space-y-3 rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-medium text-foreground",
									children: [
										row.first_name,
										" ",
										row.last_name,
										row.company ? ` · ${row.company}` : ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground",
									children: [
										row.phone,
										" · ",
										row.email
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										PLATFORM_LABEL[row.platform] ?? row.platform,
										row.units ? ` · ${row.units} unidades` : "",
										" · ",
										fecha(row.created_at)
									]
								}),
								row.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"“",
										row.message,
										"”"
									]
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-full px-3 py-1 text-xs uppercase tracking-wide ${row.status === "enviado" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`,
							children: row.status === "enviado" ? "Datos enviados" : "Pendiente"
						})]
					}), row.status === "enviado" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"Usuario ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-foreground",
								children: row.demo_username
							}),
							" · contraseña ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-foreground",
								children: "Abc2026+"
							}),
							" · enviado",
							" ",
							fecha(row.sent_at)
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs text-muted-foreground",
								children: ["Número de cliente (opcional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1 w-40",
									inputMode: "numeric",
									value: customerNumbers[row.id] ?? "",
									onChange: (e) => setCustomerNumbers((prev) => ({
										...prev,
										[row.id]: e.target.value.replace(/[^0-9]/g, "")
									})),
									placeholder: "500"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								disabled: sending.isPending,
								onClick: () => sending.mutate({
									id: row.id,
									customerNumber: customerNumbers[row.id] ? Number(customerNumbers[row.id]) : null,
									platform: row.platform
								}),
								children: sending.isPending ? "Enviando…" : "Enviar datos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "destructive",
								disabled: deletion.isPending,
								onClick: () => {
									if (confirm("¿Borrar esta solicitud de demo?")) deletion.mutate(row.id);
								},
								children: "Borrar"
							})
						]
					})]
				}, row.id))
			})
		]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-background px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl space-y-7",
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
								children: "Solicitudes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Resumen y control de estado de todos los pedidos solicitados."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/clientes",
									children: "Panel de clientes"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/renovaciones",
									children: "Renovaciones"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: signOut,
								children: "Salir"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2 border-b border-border pb-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: tab === "solicitudes" ? "default" : "ghost",
							onClick: () => setTab("solicitudes"),
							children: "Solicitudes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: tab === "clientes" ? "default" : "ghost",
							onClick: () => setTab("clientes"),
							children: "Clientes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: tab === "nueva-venta" ? "default" : "ghost",
							onClick: () => setTab("nueva-venta"),
							children: "Nueva venta"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: tab === "registrar-cliente" ? "default" : "ghost",
							onClick: () => setTab("registrar-cliente"),
							children: "Registrar cliente"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: tab === "solicitudes-demo" ? "default" : "ghost",
							onClick: () => setTab("solicitudes-demo"),
							children: "Solicitudes demo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: tab === "usuarios-demo" ? "default" : "ghost",
							onClick: () => setTab("usuarios-demo"),
							children: "Usuarios demo"
						})
					]
				}),
				tab === "solicitudes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Pendientes",
								count: stats.pendiente.count,
								total: stats.pendiente.total,
								highlight: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Vendidos",
								count: stats.vendido.count,
								total: stats.vendido.total
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "No vendidos",
								count: stats.no_vendido.count,
								total: stats.no_vendido.total
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Total de pedidos",
								count: totalCount,
								total: totalValue
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							"pendiente",
							"vendido",
							"no_vendido",
							"todas"
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: filter === s ? "default" : "outline",
							onClick: () => setFilter(s),
							children: s === "todas" ? `Todas (${totalCount})` : `${STATUS_LABEL[s]} (${stats[s].count})`
						}, s))
					}),
					query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Cargando…"
					}) : query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: "No se pudieron cargar las solicitudes. Verifica que iniciaste sesión con ventas@orb-lite.com."
					}) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No hay solicitudes en este filtro."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							paginated.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SolicitudCard, {
								row,
								pending: mutation.isPending,
								onSave: (status, notes) => mutation.mutate({
									id: row.id,
									status,
									notes
								}),
								onExpand: () => setSelectedRow(row)
							}, row.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SolicitudDetailDialog, {
								row: selectedRow,
								open: !!selectedRow,
								onOpenChange: (open) => {
									if (!open) setSelectedRow(null);
								}
							}),
							visible.length > PAGE_SIZE && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "flex flex-wrap items-center justify-between gap-3 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Mostrando ",
										paginated.length,
										" de ",
										visible.length
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => setPage((p) => Math.max(1, p - 1)),
											disabled: safePage <= 1,
											children: "Anterior"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-2 text-sm text-muted-foreground",
											children: [
												"Página ",
												safePage,
												" de ",
												totalPages
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
											disabled: safePage >= totalPages,
											children: "Siguiente"
										})
									]
								})]
							})
						]
					})
				] }) : tab === "clientes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomersSection, {}) : tab === "nueva-venta" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NuevaVentaSection, {}) : tab === "solicitudes-demo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SolicitudesDemoSection, {}) : tab === "usuarios-demo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsuariosDemoSection, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegistrarClienteSection, {})
			]
		})
	});
}
function StatCard({ label, count, total, highlight }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-xl border p-4 ${highlight ? "border-primary/60 bg-primary/5" : "border-border bg-card"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-wide text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl text-foreground",
				children: count
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: mxn(total)
			})
		]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Clientes registrados",
					count: rows.length,
					total: totalSpent
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Con datos de facturación",
					count: rows.filter((c) => c.billing && Object.keys(c.billing).length > 0).length,
					total: 0
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Buscar por nombre, número de cliente, teléfono, correo o RFC",
				className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
			}),
			query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Cargando clientes…"
			}) : query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: "No se pudieron cargar los clientes."
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Sin clientes para esta búsqueda."
			}) : filtered.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerCard, { customer: c }, c.id))
		]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "space-y-3 rounded-xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-primary",
						children: ["Cliente #", customer.customer_number]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base text-foreground",
						children: customer.full_name || "Sin nombre"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [customer.phone || "Sin teléfono", customer.email ? ` · ${customer.email}` : ""]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-semibold text-foreground",
							children: mxn(Number(customer.total_spent ?? 0))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [customer.orders_count ?? 0, " pedido(s)"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setEditing(true),
							children: "Editar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "destructive",
							onClick: () => setConfirmDelete(true),
							disabled: removal.isPending,
							children: "Borrar"
						})]
					})]
				})]
			}),
			confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-foreground",
					children: [
						"¿Borrar al cliente #",
						customer.customer_number,
						"? También se borrarán todas sus solicitudes. Esta acción no se puede deshacer."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "destructive",
						onClick: () => removal.mutate(),
						disabled: removal.isPending,
						children: removal.isPending ? "Borrando…" : "Sí, borrar todo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setConfirmDelete(false),
						disabled: removal.isPending,
						children: "Cancelar"
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditarClienteDialog, {
				customer,
				open: editing,
				onOpenChange: setEditing
			}),
			Object.keys(contact).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wide text-primary",
					children: "Datos de contacto"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-1",
					children: Object.entries(contact).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex flex-wrap justify-between gap-2 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "capitalize",
							children: k.replace(/_/g, " ")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground text-right",
							children: String(v ?? "") || "—"
						})]
					}, k))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wide text-primary",
					children: "Datos de facturación"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingRows, { billing })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Alta:",
					" ",
					new Date(customer.created_at).toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" }),
					customer.last_order_id ? ` · Último pedido #${customer.last_order_id}` : ""
				]
			})
		]
	});
}
//#endregion
export { CrmPage as component };
