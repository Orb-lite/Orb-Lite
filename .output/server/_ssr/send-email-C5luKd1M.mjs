import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as render } from "../_libs/@react-email/render+[...].mjs";
import { n as sendLovableEmail, t as EmailAPIError } from "../_libs/lovable.dev__email-js.mjs";
import { t as Body } from "../_libs/react-email__body.mjs";
import { t as Button } from "../_libs/react-email__button.mjs";
import { t as Column } from "../_libs/react-email__column.mjs";
import { t as Container } from "../_libs/react-email__container.mjs";
import { t as Head } from "../_libs/react-email__head.mjs";
import { t as Heading } from "../_libs/react-email__heading.mjs";
import { t as Hr } from "../_libs/react-email__hr.mjs";
import { t as Html } from "../_libs/react-email__html.mjs";
import { t as Link } from "../_libs/react-email__link.mjs";
import { t as Preview } from "../_libs/react-email__preview.mjs";
import { t as Row } from "../_libs/react-email__row.mjs";
import { t as Section } from "../_libs/react-email__section.mjs";
import { t as Text } from "../_libs/react-email__text.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/send-email-C5luKd1M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var mxn$3 = (n) => `$${(n ?? 0).toLocaleString("es-MX", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})}`;
var NuevoPedidoEmail = (p) => {
	const lines = p.lines ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
		lang: "es",
		dir: "ltr",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: `Nuevo pedido ${p.orderId ?? ""} — ${p.totalItems ?? 0} artículo(s) — ${mxn$3(p.total)} MXN` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
				style: main$7,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
					style: container$7,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							style: header$2,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
								style: logo$2,
								children: "ORB-LITE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								style: headerSub$2,
								children: "Rastreo GPS Satelital · Bitácora de ventas"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Heading, {
							as: "h2",
							style: h2$3,
							children: ["Nuevo pedido ", p.orderId ? `#${p.orderId}` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
							style: muted$4,
							children: [
								"Entrega: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: p.shippingLabel ?? "—" }),
								p.isNational ? " (envío foráneo)" : " (entrega local)"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							style: card$4,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: sectionTitle$2,
									children: "CLIENTE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: ["Número de cliente: ", p.customerNumber ? `#${p.customerNumber}` : "Sin asignar"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: detail$1,
									children: p.isFirstPurchase === null || p.isFirstPurchase === void 0 ? "Historial no disponible" : p.isFirstPurchase ? "Primera compra: SÍ" : "Primera compra: No"
								}),
								p.isFirstPurchase === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: ["Compras acumuladas: ", p.ordersCount ?? 0]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: [
										"Total histórico comprado: ",
										mxn$3(p.totalSpent ?? 0),
										" MXN"
									]
								})] }) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							style: card$4,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: sectionTitle$2,
									children: "PAQUETES"
								}),
								lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									style: lineBlock$2,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Column, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
											style: lineName$2,
											children: [
												l.variantName,
												" ×",
												l.quantity
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
											style: lineDetail$2,
											children: l.title
										}),
										l.addOns?.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
											style: lineDetail$2,
											children: [
												"+ ",
												a.name,
												" — ",
												mxn$3(a.price)
											]
										}, a.name)),
										l.isRenewal && l.renewal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail$2,
												children: ["Titular: ", l.renewal.fullName]
											}),
											l.renewal.unitName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail$2,
												children: ["Equipo en plataforma: ", l.renewal.unitName]
											}) : null,
											l.renewal.imei ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail$2,
												children: ["IMEI: ", l.renewal.imei]
											}) : null,
											l.renewal.iccid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail$2,
												children: ["ICCID: ", l.renewal.iccid]
											}) : null,
											l.renewal.simPhone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail$2,
												children: ["Tel. del chip: ", l.renewal.simPhone]
											}) : null
										] }) : null
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
										align: "right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
											style: linePrice$2,
											children: mxn$3(l.lineTotal)
										})
									})] })
								}, i)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr$6 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: totalRow$2,
									children: "Productos"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										style: totalRow$2,
										children: mxn$3(p.productsTotal)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: totalRow$2,
									children: "Envío"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										style: totalRow$2,
										children: mxn$3(p.shippingPrice)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: totalRow$2,
									children: "Subtotal sin IVA"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										style: totalRow$2,
										children: mxn$3(p.subtotalWithoutIva)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: totalRow$2,
									children: "IVA (16%)"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										style: totalRow$2,
										children: mxn$3(p.iva)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: grandTotal$2,
									children: "TOTAL"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
										style: grandTotal$2,
										children: [mxn$3(p.total), " MXN"]
									})
								})] })
							]
						}),
						p.isNational && p.shippingInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							style: card$4,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: sectionTitle$2,
									children: "DATOS DE ENVÍO (FORÁNEO)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: ["Nombre: ", p.shippingInfo.fullName]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: ["Teléfono: ", p.shippingInfo.phone]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: [
										p.shippingInfo.city,
										", ",
										p.shippingInfo.state,
										" — C.P. ",
										p.shippingInfo.zip
									]
								})
							]
						}) : null,
						!p.isNational && p.pickupInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							style: card$4,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: sectionTitle$2,
									children: "CONTACTO PARA ENTREGA LOCAL"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: ["Nombre: ", p.pickupInfo.fullName]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: ["Teléfono: ", p.pickupInfo.phone]
								})
							]
						}) : null,
						p.wantsInvoice && p.billingInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							style: card$4,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: sectionTitle$2,
									children: "FACTURACIÓN (CFDI 4.0)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: ["Razón social: ", p.billingInfo.legalName]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: ["RFC: ", p.billingInfo.rfc]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: ["Régimen fiscal: ", p.billingInfo.taxRegime]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: ["Uso de CFDI: ", p.billingInfo.cfdiUse]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: ["C.P. fiscal: ", p.billingInfo.fiscalZip]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: ["Correo: ", p.billingInfo.email]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: ["Teléfono: ", p.billingInfo.phone]
								}),
								p.billingInfo.constanciaUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail$1,
									children: [
										"Constancia fiscal:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											href: p.billingInfo.constanciaUrl,
											style: { color: "#A3E635" },
											children: p.billingInfo.constanciaFileName ?? "Descargar archivo"
										}),
										" ",
										"(enlace válido 30 días)"
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: detail$1,
									children: "Constancia fiscal: no adjuntada"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							style: muted$4,
							children: "El cliente no requiere factura."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr$6 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							style: footer$3,
							children: "Correo automático de orb-lite.com · Cada pedido finalizado por WhatsApp queda registrado aquí como bitácora de venta."
						})
					]
				})
			})
		]
	});
};
var template$8 = {
	component: NuevoPedidoEmail,
	subject: (d) => `Nuevo pedido ORB-LITE${d["orderId"] ? ` #${d["orderId"]}` : ""} — ${mxn$3(d["total"])} MXN`,
	displayName: "Notificación de nuevo pedido",
	to: "ventas@orb-lite.com",
	previewData: {
		orderId: "ABC123",
		customerNumber: 69228,
		ordersCount: 3,
		totalSpent: 5400,
		isFirstPurchase: false,
		lines: [{
			variantName: "Kit con SIM global M2M",
			title: "Equipo GPS ORB-LITE OL-01",
			quantity: 1,
			unitPrice: 1500,
			lineTotal: 1500,
			addOns: [],
			isRenewal: false
		}],
		shippingLabel: "Envío nacional",
		shippingPrice: 450,
		productsTotal: 1500,
		subtotalWithoutIva: 1681.03,
		iva: 268.97,
		total: 1950,
		totalItems: 1,
		isNational: true,
		shippingInfo: {
			fullName: "Isaac Gómez",
			phone: "3318359421",
			zip: "44100",
			city: "Guadalajara",
			state: "Jalisco"
		},
		wantsInvoice: false,
		billingInfo: null
	}
};
var main$7 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container$7 = {
	padding: "24px",
	maxWidth: "560px",
	margin: "0 auto"
};
var header$2 = {
	backgroundColor: "#0B0E14",
	borderRadius: "12px",
	padding: "20px 24px",
	marginBottom: "20px"
};
var logo$2 = {
	color: "#A3E635",
	fontSize: "24px",
	margin: "0",
	letterSpacing: "2px"
};
var headerSub$2 = {
	color: "#94A3B8",
	fontSize: "12px",
	margin: "4px 0 0"
};
var h2$3 = {
	color: "#0B0E14",
	fontSize: "20px",
	margin: "0 0 8px"
};
var muted$4 = {
	color: "#64748B",
	fontSize: "13px",
	margin: "4px 0 16px"
};
var card$4 = {
	border: "1px solid #E2E8F0",
	borderRadius: "12px",
	padding: "16px",
	marginBottom: "16px"
};
var sectionTitle$2 = {
	color: "#0B0E14",
	fontSize: "11px",
	fontWeight: "bold",
	letterSpacing: "1.5px",
	margin: "0 0 10px"
};
var lineBlock$2 = { marginBottom: "10px" };
var lineName$2 = {
	color: "#0B0E14",
	fontSize: "14px",
	fontWeight: "bold",
	margin: "0"
};
var lineDetail$2 = {
	color: "#64748B",
	fontSize: "12px",
	margin: "2px 0 0"
};
var linePrice$2 = {
	color: "#0B0E14",
	fontSize: "14px",
	fontWeight: "bold",
	margin: "0"
};
var hr$6 = {
	borderColor: "#E2E8F0",
	margin: "12px 0"
};
var totalRow$2 = {
	color: "#475569",
	fontSize: "13px",
	margin: "2px 0"
};
var grandTotal$2 = {
	color: "#0B0E14",
	fontSize: "16px",
	fontWeight: "bold",
	margin: "8px 0 0"
};
var detail$1 = {
	color: "#334155",
	fontSize: "13px",
	margin: "3px 0"
};
var footer$3 = {
	color: "#94A3B8",
	fontSize: "11px",
	textAlign: "center"
};
var mxn$2 = (n) => `$${(n ?? 0).toLocaleString("es-MX", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})}`;
var navy = "#0B0E14";
var lime = "#A3E635";
var border = "#22262F";
var muted$3 = "#9BA3AF";
function ResumenPendientesEmail({ date = "", count = 0, totalPending = 0, orders = [], panelUrl = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
		lang: "es",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: `${count} solicitud(es) pendientes por revisar` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
				style: {
					backgroundColor: navy,
					margin: 0,
					fontFamily: "Barlow, Arial, sans-serif"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Container, {
					style: {
						maxWidth: "640px",
						margin: "0 auto",
						padding: "24px"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						style: {
							border: `1px solid ${border}`,
							borderRadius: "12px",
							padding: "24px",
							backgroundColor: "#11151D"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								style: {
									color: lime,
									fontSize: "12px",
									letterSpacing: "2px",
									margin: 0
								},
								children: "ORB-LITE · BITÁCORA DIARIA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
								style: {
									color: "#FFFFFF",
									fontSize: "22px",
									margin: "8px 0 4px"
								},
								children: "Solicitudes pendientes por revisar"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: {
									color: muted$3,
									fontSize: "13px",
									margin: "0 0 16px"
								},
								children: [
									"Corte del ",
									date,
									" (00:00 GMT)"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: {
									color: "#FFFFFF",
									fontSize: "15px",
									margin: "0 0 4px"
								},
								children: ["Pendientes: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									style: { color: lime },
									children: count
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: {
									color: "#FFFFFF",
									fontSize: "15px",
									margin: "0 0 16px"
								},
								children: ["Valor total pendiente: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									style: { color: lime },
									children: mxn$2(totalPending)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: {
								borderColor: border,
								margin: "16px 0"
							} }),
							count === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								style: {
									color: muted$3,
									fontSize: "14px"
								},
								children: "No hay solicitudes pendientes. Todo está marcado como vendido o no vendido."
							}) : orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
								style: {
									border: `1px solid ${border}`,
									borderRadius: "10px",
									padding: "14px",
									marginBottom: "12px"
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
										style: {
											color: lime,
											fontSize: "13px",
											margin: "0 0 6px"
										},
										children: [
											"Pedido #",
											o.orderId,
											o.customerNumber ? ` · Cliente #${o.customerNumber}` : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
										style: {
											color: "#FFFFFF",
											fontSize: "14px",
											margin: "0 0 4px"
										},
										children: [
											o.fullName || "Sin nombre",
											" · ",
											o.phone || "Sin teléfono"
										]
									}),
									o.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										style: {
											color: muted$3,
											fontSize: "13px",
											margin: "0 0 4px"
										},
										children: o.email
									}) : null,
									o.itemsSummary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										style: {
											color: muted$3,
											fontSize: "13px",
											margin: "0 0 4px"
										},
										children: o.itemsSummary
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
										style: {
											color: muted$3,
											fontSize: "13px",
											margin: "0 0 4px"
										},
										children: [
											"Entrega: ",
											o.shippingLabel || "Entrega local",
											" · Factura:",
											" ",
											o.wantsInvoice ? "Sí" : "No"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
										style: {
											color: "#FFFFFF",
											fontSize: "14px",
											margin: "4px 0 0"
										},
										children: ["Total: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: mxn$2(o.total) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
										style: {
											color: muted$3,
											fontSize: "12px",
											margin: "4px 0 0"
										},
										children: ["Recibido: ", o.createdAt]
									})
								]
							}, o.orderId)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: {
								borderColor: border,
								margin: "16px 0"
							} }),
							panelUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
								style: { marginBottom: "12px" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									href: panelUrl,
									style: {
										display: "inline-block",
										backgroundColor: lime,
										color: navy,
										fontSize: "14px",
										fontWeight: 700,
										padding: "12px 20px",
										borderRadius: "8px",
										textDecoration: "none"
									},
									children: "Actualizar estados de solicitudes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: {
										color: muted$3,
										fontSize: "12px",
										margin: "8px 0 0"
									},
									children: "Enlace privado y no listado en el sitio: no lo compartas."
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								style: {
									color: muted$3,
									fontSize: "12px",
									margin: 0
								},
								children: "Estas solicitudes seguirán apareciendo en el resumen diario hasta que cambies su estado a vendido o no vendido (desde el enlace de arriba o en la base de datos)."
							})
						]
					})
				})
			})
		]
	});
}
var template$7 = {
	component: ResumenPendientesEmail,
	subject: (data) => `ORB-LITE · ${data["count"] ?? 0} solicitudes pendientes por revisar`,
	displayName: "Resumen diario de pendientes",
	to: "ventas@orb-lite.com",
	previewData: {
		panelUrl: "https://orb-lite.com/panel/token-privado",
		date: "02/09/2026",
		count: 1,
		totalPending: 2490,
		orders: [{
			orderId: "ABC123",
			createdAt: "01/09/2026 18:20",
			customerNumber: 500,
			fullName: "Juan Pérez",
			phone: "3318359421",
			email: "juan@example.com",
			total: 2490,
			shippingLabel: "Envío foráneo (ocurre)",
			wantsInvoice: true,
			itemsSummary: "1 × Equipo GPS con SIM",
			status: "pendiente"
		}]
	}
};
var Email$4 = ({ code = "000000", minutes = 20, url }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "es",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: "Tu código de un solo uso para crear la contraseña del CRM" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$6,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$6,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: brand$4,
						children: "ORB-LITE · RASTREO GPS SATELITAL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$3,
						children: "Código de acceso al CRM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: p$2,
						children: [
							"Usa este código de un solo uso para crear (o restablecer) la contraseña de la cuenta",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: " ventas@orb-lite.com" }),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						style: codeBox,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							style: codeText,
							children: code
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: p$2,
						children: [
							"Vence en ",
							minutes,
							" minutos y solo puede usarse una vez."
						]
					}),
					url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: p$2,
						children: [
							"Abre esta página para usarlo: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: link$1,
								children: url
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: small$2,
						children: "Si no solicitaste este código, ignora este correo: nadie puede entrar al CRM sin él."
					})
				]
			})
		})
	]
});
var template$6 = {
	component: Email$4,
	subject: "Código de un solo uso · CRM ORB-LITE",
	displayName: "Código de acceso CRM",
	previewData: {
		code: "482913",
		minutes: 20,
		url: "https://orb-lite.com/acceso-crm"
	},
	to: "ventas@orb-lite.com"
};
var main$6 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, Helvetica, sans-serif"
};
var container$6 = {
	padding: "28px 26px",
	maxWidth: "560px"
};
var brand$4 = {
	fontSize: "11px",
	letterSpacing: "2px",
	color: "#65a30d",
	margin: "0 0 6px",
	fontWeight: 700
};
var h1$3 = {
	fontSize: "22px",
	color: "#0B0E14",
	margin: "0 0 14px"
};
var p$2 = {
	fontSize: "15px",
	color: "#1f2937",
	lineHeight: "22px",
	margin: "0 0 14px"
};
var codeBox = {
	backgroundColor: "#0B0E14",
	borderRadius: "12px",
	padding: "18px",
	textAlign: "center",
	margin: "0 0 16px"
};
var codeText = {
	fontSize: "32px",
	letterSpacing: "8px",
	color: "#A3E635",
	fontWeight: 700,
	margin: "0"
};
var link$1 = {
	fontSize: "14px",
	color: "#65a30d",
	wordBreak: "break-all"
};
var small$2 = {
	fontSize: "12px",
	color: "#6b7280",
	margin: "18px 0 0"
};
var mxn$1 = (n) => `$${(n ?? 0).toLocaleString("es-MX", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})}`;
var ConfirmacionPedidoEmail = (p) => {
	const lines = p.lines ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
		lang: "es",
		dir: "ltr",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: `Recibimos tu solicitud ${p.orderId ? `#${p.orderId}` : ""} — ${mxn$1(p.total)} MXN` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
				style: main$5,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
					style: container$5,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							style: header$1,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
								style: logo$1,
								children: "ORB-LITE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								style: headerSub$1,
								children: "Rastreo GPS Satelital"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
							as: "h2",
							style: h2$2,
							children: p.customerName ? `¡Gracias, ${p.customerName}!` : "¡Gracias por tu solicitud!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
							style: muted$2,
							children: [
								"Recibimos tu solicitud ",
								p.orderId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["#", p.orderId] }) : null,
								" y nuestro equipo te contactará por WhatsApp para confirmar la entrega y el pago."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							style: numberCard,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: numberLabel,
									children: "TU NÚMERO DE CLIENTE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: numberValue,
									children: p.customerNumber ? `#${p.customerNumber}` : "Se asignará al confirmar tu compra"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: numberNote,
									children: ["Guárdalo y menciónalo en tus próximas compras: con tus compras acumuladas se activan descuentos y promociones exclusivas para clientes ORB-LITE.", p.ordersCount ? ` Llevas ${p.ordersCount} compra(s) registrada(s).` : ""]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							style: card$3,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: sectionTitle$1,
									children: "RESUMEN DE TU SOLICITUD"
								}),
								lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									style: lineBlock$1,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Column, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
											style: lineName$1,
											children: [
												l.variantName,
												" ×",
												l.quantity
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
											style: lineDetail$1,
											children: l.title
										}),
										l.addOns?.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
											style: lineDetail$1,
											children: [
												"+ ",
												a.name,
												" — ",
												mxn$1(a.price)
											]
										}, a.name)),
										l.isRenewal && l.renewal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail$1,
												children: ["Titular: ", l.renewal.fullName]
											}),
											l.renewal.unitName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail$1,
												children: ["Equipo en plataforma: ", l.renewal.unitName]
											}) : null,
											l.renewal.imei ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail$1,
												children: ["IMEI: ", l.renewal.imei]
											}) : null,
											l.renewal.iccid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail$1,
												children: ["ICCID: ", l.renewal.iccid]
											}) : null,
											l.renewal.simPhone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail$1,
												children: ["Tel. del chip: ", l.renewal.simPhone]
											}) : null
										] }) : null
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
										align: "right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
											style: linePrice$1,
											children: mxn$1(l.lineTotal)
										})
									})] })
								}, i)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr$5 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: totalRow$1,
									children: "Productos"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										style: totalRow$1,
										children: mxn$1(p.productsTotal)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: totalRow$1,
									children: ["Entrega", p.shippingLabel ? ` — ${p.shippingLabel}` : ""]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										style: totalRow$1,
										children: mxn$1(p.shippingPrice)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: totalRow$1,
									children: "Subtotal sin IVA"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										style: totalRow$1,
										children: mxn$1(p.subtotalWithoutIva)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: totalRow$1,
									children: "IVA (16%)"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										style: totalRow$1,
										children: mxn$1(p.iva)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: grandTotal$1,
									children: "TOTAL"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
										style: grandTotal$1,
										children: [mxn$1(p.total), " MXN"]
									})
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							style: muted$2,
							children: p.wantsInvoice ? "Registramos tu solicitud de factura con los datos fiscales que capturaste." : "No solicitaste factura en este pedido. Si la necesitas, avísanos por WhatsApp."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr$5 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							style: footer$2,
							children: "ORB-LITE · ventas@orb-lite.com · WhatsApp 33 1835 9421 · orb-lite.com"
						})
					]
				})
			})
		]
	});
};
var template$5 = {
	component: ConfirmacionPedidoEmail,
	subject: (d) => `Recibimos tu solicitud ORB-LITE${d["orderId"] ? ` #${d["orderId"]}` : ""}`,
	displayName: "Confirmación de pedido (cliente)",
	previewData: {
		orderId: "ABC123",
		customerName: "Isaac Gómez",
		customerNumber: 69228,
		ordersCount: 2,
		lines: [{
			variantName: "Kit con SIM global M2M",
			title: "Equipo GPS ORB-LITE OL-01",
			quantity: 1,
			unitPrice: 1500,
			lineTotal: 1500,
			addOns: [],
			isRenewal: false
		}],
		shippingLabel: "Envío nacional",
		shippingPrice: 450,
		productsTotal: 1500,
		subtotalWithoutIva: 1681.03,
		iva: 268.97,
		total: 1950,
		isNational: true,
		wantsInvoice: false
	}
};
var main$5 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container$5 = {
	padding: "24px",
	maxWidth: "560px",
	margin: "0 auto"
};
var header$1 = {
	backgroundColor: "#0B0E14",
	borderRadius: "12px",
	padding: "20px 24px",
	marginBottom: "20px"
};
var logo$1 = {
	color: "#A3E635",
	fontSize: "24px",
	margin: "0",
	letterSpacing: "2px"
};
var headerSub$1 = {
	color: "#94A3B8",
	fontSize: "12px",
	margin: "4px 0 0"
};
var h2$2 = {
	color: "#0B0E14",
	fontSize: "20px",
	margin: "0 0 8px"
};
var muted$2 = {
	color: "#64748B",
	fontSize: "13px",
	margin: "4px 0 16px"
};
var card$3 = {
	border: "1px solid #E2E8F0",
	borderRadius: "12px",
	padding: "16px",
	marginBottom: "16px"
};
var numberCard = {
	backgroundColor: "#F7FEE7",
	border: "1px solid #A3E635",
	borderRadius: "12px",
	padding: "16px",
	marginBottom: "16px"
};
var numberLabel = {
	color: "#3F6212",
	fontSize: "11px",
	fontWeight: "bold",
	letterSpacing: "1.5px",
	margin: "0 0 4px"
};
var numberValue = {
	color: "#0B0E14",
	fontSize: "26px",
	fontWeight: "bold",
	margin: "0 0 6px"
};
var numberNote = {
	color: "#3F6212",
	fontSize: "12px",
	margin: "0"
};
var sectionTitle$1 = {
	color: "#0B0E14",
	fontSize: "11px",
	fontWeight: "bold",
	letterSpacing: "1.5px",
	margin: "0 0 10px"
};
var lineBlock$1 = { marginBottom: "10px" };
var lineName$1 = {
	color: "#0B0E14",
	fontSize: "14px",
	fontWeight: "bold",
	margin: "0"
};
var lineDetail$1 = {
	color: "#64748B",
	fontSize: "12px",
	margin: "2px 0 0"
};
var linePrice$1 = {
	color: "#0B0E14",
	fontSize: "14px",
	fontWeight: "bold",
	margin: "0"
};
var hr$5 = {
	borderColor: "#E2E8F0",
	margin: "12px 0"
};
var totalRow$1 = {
	color: "#475569",
	fontSize: "13px",
	margin: "2px 0"
};
var grandTotal$1 = {
	color: "#0B0E14",
	fontSize: "16px",
	fontWeight: "bold",
	margin: "8px 0 0"
};
var footer$2 = {
	color: "#94A3B8",
	fontSize: "11px",
	textAlign: "center"
};
var mxn = (n) => `$${(n ?? 0).toLocaleString("es-MX", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})}`;
var ComprobanteVentaEmail = (p) => {
	const lines = p.lines ?? [];
	const billing = p.wantsInvoice ? p.billingInfo ?? null : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
		lang: "es",
		dir: "ltr",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: `Comprobante de venta ${p.orderId ? `#${p.orderId}` : ""} — ${mxn(p.total)} MXN` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
				style: main$4,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
					style: container$4,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							style: header,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Column, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
								style: logo,
								children: "ORB-LITE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								style: headerSub,
								children: "Rastreo GPS Satelital"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Column, {
								align: "right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: docType,
									children: "COMPROBANTE DE VENTA"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: headerSub,
									children: p.orderId ? `Folio ${p.orderId}` : ""
								})]
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							style: card$2,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Column, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: sectionTitle,
									children: "DATOS DE LA VENTA"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail,
									children: ["Folio: ", p.orderId ?? "—"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail,
									children: ["Fecha: ", p.issuedAt ?? "—"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail,
									children: ["Canal: ", p.channel ?? "Tienda en línea"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail,
									children: ["Entrega: ", p.shippingLabel ?? "—"]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Column, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: sectionTitle,
									children: "CLIENTE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: detail,
									children: p.customerName ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail,
									children: ["Número de cliente: ", p.customerNumber ? `#${p.customerNumber}` : "Por asignar"]
								}),
								p.customerPhone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail,
									children: ["Tel: ", p.customerPhone]
								}) : null,
								p.customerEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: detail,
									children: p.customerEmail
								}) : null
							] })] })
						}),
						billing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							style: card$2,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: sectionTitle,
									children: "DATOS FISCALES PARA FACTURA"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail,
									children: ["Razón social: ", billing.legalName ?? "—"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail,
									children: ["RFC: ", billing.rfc ?? "—"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail,
									children: ["Régimen fiscal: ", billing.taxRegime ?? "—"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail,
									children: ["Uso de CFDI: ", billing.cfdiUse ?? "—"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail,
									children: ["C.P. fiscal: ", billing.fiscalZip ?? "—"]
								}),
								billing.fiscalAddress ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail,
									children: ["Domicilio: ", billing.fiscalAddress]
								}) : null,
								billing.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail,
									children: ["Correo fiscal: ", billing.email]
								}) : null,
								billing.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: detail,
									children: ["Teléfono: ", billing.phone]
								}) : null
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							style: card$2,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: sectionTitle,
									children: "CONCEPTOS"
								}),
								lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									style: lineBlock,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Column, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
											style: lineName,
											children: [
												l.variantName,
												" ×",
												l.quantity
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
											style: lineDetail,
											children: l.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
											style: lineDetail,
											children: ["Precio unitario: ", mxn(l.unitPrice)]
										}),
										l.addOns?.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
											style: lineDetail,
											children: [
												"+ ",
												a.name,
												" — ",
												mxn(a.price)
											]
										}, a.name)),
										l.renewal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											l.renewal.fullName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail,
												children: ["Titular: ", l.renewal.fullName]
											}) : null,
											l.renewal.unitName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail,
												children: ["Equipo en plataforma: ", l.renewal.unitName]
											}) : null,
											l.renewal.imei ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail,
												children: ["IMEI: ", l.renewal.imei]
											}) : null,
											l.renewal.iccid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail,
												children: ["ICCID: ", l.renewal.iccid]
											}) : null,
											l.renewal.simPhone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
												style: lineDetail,
												children: ["Tel. del chip: ", l.renewal.simPhone]
											}) : null
										] }) : null
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
										align: "right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
											style: linePrice,
											children: mxn(l.lineTotal)
										})
									})] })
								}, i)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr$4 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: totalRow,
									children: "Productos"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										style: totalRow,
										children: mxn(p.productsTotal)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: totalRow,
									children: "Entrega"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										style: totalRow,
										children: mxn(p.shippingPrice)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: totalRow,
									children: "Subtotal sin IVA"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										style: totalRow,
										children: mxn(p.subtotalWithoutIva)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: totalRow,
									children: "IVA (16%)"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										style: totalRow,
										children: mxn(p.iva)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: grandTotal,
									children: "TOTAL"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
										style: grandTotal,
										children: [mxn(p.total), " MXN"]
									})
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							style: muted$1,
							children: billing ? "Este documento es el comprobante interno de la venta. El CFDI (factura fiscal) se emite con los datos fiscales de arriba y se envía por correo una vez confirmado el pago." : "Este documento es el comprobante de tu venta. Si necesitas factura fiscal (CFDI), respóndenos con tu constancia de situación fiscal vigente."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr$4 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							style: footer$1,
							children: "ORB-LITE · ventas@orb-lite.com · WhatsApp 33 1835 9421 · orb-lite.com"
						})
					]
				})
			})
		]
	});
};
var template$4 = {
	component: ComprobanteVentaEmail,
	subject: (d) => `Comprobante de venta ORB-LITE${d["orderId"] ? ` #${d["orderId"]}` : ""}`,
	displayName: "Comprobante de venta (factura)",
	previewData: {
		orderId: "MAN-ABC123",
		issuedAt: "14 de septiembre de 2026, 10:20",
		channel: "Venta directa",
		customerName: "Isaac Gómez",
		customerNumber: 512,
		customerEmail: "cliente@correo.com",
		customerPhone: "33 1835 9421",
		lines: [{
			variantName: "Kit con SIM global M2M",
			title: "Equipo GPS ORB-LITE OL-01",
			quantity: 1,
			unitPrice: 1500,
			lineTotal: 1500,
			addOns: [],
			isRenewal: false
		}],
		shippingLabel: "Envío nacional",
		shippingPrice: 450,
		productsTotal: 1500,
		subtotalWithoutIva: 1681.03,
		iva: 268.97,
		total: 1950,
		wantsInvoice: false
	}
};
var main$4 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container$4 = {
	padding: "24px",
	maxWidth: "600px",
	margin: "0 auto"
};
var header = {
	backgroundColor: "#0B0E14",
	borderRadius: "12px",
	padding: "20px 24px",
	marginBottom: "20px"
};
var logo = {
	color: "#A3E635",
	fontSize: "24px",
	margin: "0",
	letterSpacing: "2px"
};
var headerSub = {
	color: "#94A3B8",
	fontSize: "12px",
	margin: "4px 0 0"
};
var docType = {
	color: "#ffffff",
	fontSize: "12px",
	fontWeight: "bold",
	letterSpacing: "1.5px",
	margin: "0"
};
var card$2 = {
	border: "1px solid #E2E8F0",
	borderRadius: "12px",
	padding: "16px",
	marginBottom: "16px"
};
var sectionTitle = {
	color: "#0B0E14",
	fontSize: "11px",
	fontWeight: "bold",
	letterSpacing: "1.5px",
	margin: "0 0 8px"
};
var detail = {
	color: "#475569",
	fontSize: "12px",
	margin: "2px 0"
};
var lineBlock = { marginBottom: "10px" };
var lineName = {
	color: "#0B0E14",
	fontSize: "14px",
	fontWeight: "bold",
	margin: "0"
};
var lineDetail = {
	color: "#64748B",
	fontSize: "12px",
	margin: "2px 0 0"
};
var linePrice = {
	color: "#0B0E14",
	fontSize: "14px",
	fontWeight: "bold",
	margin: "0"
};
var hr$4 = {
	borderColor: "#E2E8F0",
	margin: "12px 0"
};
var totalRow = {
	color: "#475569",
	fontSize: "13px",
	margin: "2px 0"
};
var grandTotal = {
	color: "#0B0E14",
	fontSize: "16px",
	fontWeight: "bold",
	margin: "8px 0 0"
};
var muted$1 = {
	color: "#64748B",
	fontSize: "12px",
	margin: "4px 0 16px"
};
var footer$1 = {
	color: "#94A3B8",
	fontSize: "11px",
	textAlign: "center"
};
var money$1 = (n) => `$${Number(n ?? 0).toLocaleString("es-MX", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})} MXN`;
var Email$3 = ({ customerName, customerNumber, variantName = "Renovación de servicio", platform, period, renewalDate, amount, daysLeft = 10, unitName, imei, iccid, simPhone, isInternal }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "es",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: `Tu renovación vence en ${daysLeft} día(s) — ${variantName}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$3,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$3,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: brand$3,
						children: "ORB-LITE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$2,
						children: isInternal ? `Aviso interno: renovación en ${daysLeft} día(s)` : `Tu renovación vence en ${daysLeft} día(s)`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: p$1,
						children: [
							customerName ? `Hola ${customerName}, ` : "Hola, ",
							"te recordamos que el servicio ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: variantName }),
							platform ? ` (plataforma ${platform})` : "",
							" se renueva el ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: renewalDate }),
							". Las renovaciones se aplican el día primero del mes de renovación."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						style: card$1,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row$2,
								children: ["Servicio: ", variantName]
							}),
							period && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row$2,
								children: ["Periodo: ", period === "monthly" ? "Mensual" : "Anual"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row$2,
								children: ["Importe a renovar: ", money$1(amount)]
							}),
							customerNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row$2,
								children: ["Cliente #", customerNumber]
							}),
							unitName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row$2,
								children: ["Equipo en plataforma: ", unitName]
							}),
							imei && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row$2,
								children: ["IMEI: ", imei]
							}),
							iccid && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row$2,
								children: ["ICCID: ", iccid]
							}),
							simPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row$2,
								children: ["Teléfono del chip: ", simPhone]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr$3 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						as: "h2",
						style: h2$1,
						children: "Condiciones de renovación"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: small$1,
						children: [
							"• Tienes ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "20 días" }),
							" a partir de la fecha de renovación para pagar. Al pasar ese plazo se ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "bloquea el acceso" }),
							" a la plataforma y se cobra el mes en curso."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: small$1,
						children: "• El adeudo puede acumularse al mes siguiente; si no se cubre, el servicio se da de baja."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: small$1,
						children: [
							"• Si no registramos tu pago, la cuenta se",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "cancela al segundo mes de adeudo" }),
							". Tienes todo ese segundo mes para ponerte al corriente; al cumplir el tercer mes se da de baja definitiva."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: small$1,
						children: "Para renovar responde este correo o escríbenos a ventas@orb-lite.com con tu comprobante de pago."
					})
				]
			})
		})
	]
});
var template$3 = {
	component: Email$3,
	subject: (data) => `Renovación en ${data["daysLeft"] ?? 10} día(s) — ${data["variantName"] ?? "ORB-LITE"}`,
	displayName: "Aviso de renovación próxima",
	previewData: {
		customerName: "Juan Pérez",
		customerNumber: 512,
		variantName: "Renovación de Plataforma ORB-FULL (mensual)",
		platform: "ORB-FULL",
		period: "monthly",
		renewalDate: "2026-10-01",
		amount: 290,
		daysLeft: 10,
		unitName: "Camioneta 4",
		imei: "356938035643809"
	}
};
var main$3 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, Helvetica, sans-serif"
};
var container$3 = {
	padding: "24px",
	maxWidth: "600px"
};
var brand$3 = {
	color: "#84cc16",
	fontWeight: 700,
	letterSpacing: "2px",
	fontSize: "13px"
};
var h1$2 = {
	fontSize: "22px",
	color: "#0f172a",
	margin: "8px 0 12px"
};
var h2$1 = {
	fontSize: "15px",
	color: "#0f172a",
	margin: "16px 0 8px"
};
var p$1 = {
	fontSize: "14px",
	color: "#334155",
	lineHeight: "22px"
};
var card$1 = {
	backgroundColor: "#f8fafc",
	borderRadius: "10px",
	padding: "14px 16px",
	margin: "16px 0"
};
var row$2 = {
	fontSize: "13px",
	color: "#0f172a",
	margin: "4px 0"
};
var small$1 = {
	fontSize: "12px",
	color: "#475569",
	lineHeight: "19px",
	margin: "6px 0"
};
var hr$3 = {
	borderColor: "#e2e8f0",
	margin: "18px 0"
};
var money = (n) => `$${Number(n ?? 0).toLocaleString("es-MX", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})} MXN`;
var TITLES = {
	bloqueo: "Acceso bloqueado por falta de pago",
	"segundo-mes": "Aviso de cancelación — segundo mes de adeudo",
	baja: "Servicio dado de baja"
};
var Email$2 = ({ stage = "bloqueo", customerName, customerNumber, variantName = "Renovación de servicio", platform, renewalDate, amount, daysOverdue = 20, unitName, imei, iccid, simPhone, isInternal }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "es",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: TITLES[stage] ?? "Aviso de adeudo" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$2,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$2,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: brand$2,
						children: "ORB-LITE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$1,
						children: isInternal ? `Aviso interno: ${TITLES[stage] ?? "adeudo"}` : TITLES[stage] ?? "Aviso de adeudo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: p,
						children: [
							customerName ? `Hola ${customerName}, ` : "Hola, ",
							"el servicio ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: variantName }),
							platform ? ` (plataforma ${platform})` : "",
							" tenía fecha de renovación el",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: renewalDate }),
							" y registra ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [daysOverdue, " días"] }),
							" de atraso."
						]
					}),
					stage === "bloqueo" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: p,
						children: [
							"Pasaron los 20 días de plazo, por lo que el ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "acceso quedó bloqueado" }),
							" y se cobra el mes en curso. El adeudo puede acumularse al mes siguiente; si no se cubre, el servicio se dará de baja."
						]
					}),
					stage === "segundo-mes" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: p,
						children: [
							"Al no registrar tu pago, la cuenta entra en ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "proceso de cancelación" }),
							". Tienes todo este segundo mes para ponerte al corriente. Envíanos el",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "comprobante de pago" }),
							" a ventas@orb-lite.com para reactivar el servicio."
						]
					}),
					stage === "baja" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: p,
						children: [
							"Al cumplirse el tercer mes de adeudo, el servicio se ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "dio de baja" }),
							". Si deseas reactivarlo, responde este correo con tu comprobante de pago y validaremos la reactivación."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						style: card,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row$1,
								children: ["Importe pendiente: ", money(amount)]
							}),
							customerNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row$1,
								children: ["Cliente #", customerNumber]
							}),
							unitName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row$1,
								children: ["Equipo en plataforma: ", unitName]
							}),
							imei && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row$1,
								children: ["IMEI: ", imei]
							}),
							iccid && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row$1,
								children: ["ICCID: ", iccid]
							}),
							simPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row$1,
								children: ["Teléfono del chip: ", simPhone]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr$2 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: small,
						children: "Envía tu comprobante de pago a ventas@orb-lite.com. Las renovaciones se aplican el día primero del mes de renovación."
					})
				]
			})
		})
	]
});
var template$2 = {
	component: Email$2,
	subject: (data) => `${TITLES[String(data["stage"] ?? "bloqueo")] ?? "Aviso de adeudo"} — ${data["variantName"] ?? "ORB-LITE"}`,
	displayName: "Aviso de adeudo / cancelación",
	previewData: {
		stage: "segundo-mes",
		customerName: "Juan Pérez",
		customerNumber: 512,
		variantName: "Renovación de Plataforma ORB-FULL (mensual)",
		renewalDate: "2026-09-01",
		amount: 290,
		daysOverdue: 35
	}
};
var main$2 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, Helvetica, sans-serif"
};
var container$2 = {
	padding: "24px",
	maxWidth: "600px"
};
var brand$2 = {
	color: "#84cc16",
	fontWeight: 700,
	letterSpacing: "2px",
	fontSize: "13px"
};
var h1$1 = {
	fontSize: "22px",
	color: "#0f172a",
	margin: "8px 0 12px"
};
var p = {
	fontSize: "14px",
	color: "#334155",
	lineHeight: "22px"
};
var card = {
	backgroundColor: "#f8fafc",
	borderRadius: "10px",
	padding: "14px 16px",
	margin: "16px 0"
};
var row$1 = {
	fontSize: "13px",
	color: "#0f172a",
	margin: "4px 0"
};
var small = {
	fontSize: "12px",
	color: "#475569",
	lineHeight: "19px",
	margin: "6px 0"
};
var hr$2 = {
	borderColor: "#e2e8f0",
	margin: "18px 0"
};
var ACCESS = {
	wialon_lite: {
		label: "Wialon Lite",
		platformUrl: "https://lite.wialon.us/",
		unitsUrl: "https://cms-lite.wialon.us"
	},
	wialon_full: {
		label: "Wialon",
		platformUrl: "https://hosting.wialon.com/",
		unitsUrl: "https://cms.wialon.com/"
	}
};
var Email$1 = ({ name, username, platform = "wialon_lite" }) => {
	const access = ACCESS[platform] ?? ACCESS.wialon_lite;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
		lang: "es",
		dir: "ltr",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Preview, { children: [
				"Tus claves de acceso a la plataforma ",
				access.label,
				" — ORB-LITE"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
				style: main$1,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
					style: container$1,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
							style: brand$1,
							children: "ORB-LITE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
							style: text,
							children: [
								"Buen día",
								name ? ` ${name}` : "",
								","
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							style: text,
							children: "Te detallo el link de acceso así como las claves nuevas solicitadas."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							style: block,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Heading, {
									as: "h2",
									style: h2,
									children: ["Plataforma ", access.label]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: text,
									children: "Link de acceso:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									style: button,
									href: access.platformUrl,
									children: access.platformUrl
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							style: block,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
									as: "h2",
									style: h2,
									children: "Dar de alta unidades"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: text,
									children: "Link de acceso:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									style: button,
									href: access.unitsUrl,
									children: access.unitsUrl
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr$1 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							style: block,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
									as: "h2",
									style: h2,
									children: "Claves de acceso y link"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: text,
									children: ["Usuario: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										style: mono,
										children: username ?? "tu-usuario"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
									style: text,
									children: ["Contraseña: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										style: mono,
										children: "Abc2026+"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									style: note,
									children: "La contraseña es provisional; en el primer ingreso solicitará su reemplazo."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr$1 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
							style: text,
							children: [
								"App móvil disponible en iOS, Android o AppGallery Huawei:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: access.label === "Wialon Lite" ? "Wialon Lite" : "Wialon" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
							style: footer,
							children: [
								"ORB-LITE · Rastreo GPS y telemetría ·",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									href: "https://orb-lite.com",
									style: link,
									children: "orb-lite.com"
								})
							]
						})
					]
				})
			})
		]
	});
};
var template$1 = {
	component: Email$1,
	subject: (data) => `Tus accesos ${data?.["platform"] === "wialon_full" ? "Wialon" : "Wialon Lite"} — ORB-LITE`,
	displayName: "Accesos demo Wialon",
	previewData: {
		name: "Juan Pérez",
		username: "juan.transportesabc",
		platform: "wialon_lite"
	}
};
var main$1 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container$1 = {
	padding: "24px 28px",
	maxWidth: "560px"
};
var brand$1 = {
	color: "#0b1f3a",
	fontSize: "22px",
	letterSpacing: "2px",
	margin: "0 0 16px"
};
var h2 = {
	color: "#0b1f3a",
	fontSize: "16px",
	margin: "0 0 8px"
};
var text = {
	color: "#1f2937",
	fontSize: "14px",
	lineHeight: "22px",
	margin: "6px 0"
};
var note = {
	color: "#6b7280",
	fontSize: "13px",
	lineHeight: "20px",
	margin: "6px 0"
};
var block = { margin: "14px 0" };
var hr$1 = {
	borderColor: "#e5e7eb",
	margin: "16px 0"
};
var mono = {
	fontFamily: "monospace",
	color: "#0b1f3a"
};
var link = { color: "#16a34a" };
var button = {
	backgroundColor: "#16a34a",
	color: "#ffffff",
	fontSize: "14px",
	padding: "10px 18px",
	borderRadius: "8px",
	textDecoration: "none",
	display: "inline-block",
	margin: "4px 0"
};
var footer = {
	color: "#9ca3af",
	fontSize: "12px",
	marginTop: "24px"
};
function fmt(iso) {
	if (!iso) return "Sin visitar";
	return new Date(iso).toLocaleString("es-MX", {
		timeZone: "America/Mexico_City",
		day: "2-digit",
		month: "short",
		hour: "2-digit",
		minute: "2-digit"
	});
}
var Email = ({ routeName = "Ruta", stops = [] }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "es",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: `Reporte de visitas: ${routeName}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: brand,
						children: "ORB-LITE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1,
						children: "Reporte de visitas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: muted,
						children: [
							routeName,
							" · ",
							stops.filter((s) => s.visitedAt).length,
							" de ",
							stops.length,
							" paradas visitadas"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr }),
					stops.map((stop, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						style: row,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: label,
								children: [
									i === 0 ? "Salida" : `Parada ${i}`,
									": ",
									stop.label
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								style: muted,
								children: fmt(stop.visitedAt)
							}),
							stop.comment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: comment,
								children: [
									"“",
									stop.comment,
									"”"
								]
							}) : null
						]
					}, i)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: muted,
						children: "Resumen del viaje enviado por el operador al terminar las visitas."
					})
				]
			})
		})
	]
});
var template = {
	component: Email,
	subject: (d) => `Reporte de visitas: ${d["routeName"] ?? "Ruta"}`,
	displayName: "Reporte de visitas de ruta",
	previewData: {
		routeName: "Ruta Centro",
		stops: [{
			label: "Bodega",
			visitedAt: "2026-09-25T15:00:00Z",
			comment: null
		}, {
			label: "Cliente A",
			visitedAt: "2026-09-25T16:10:00Z",
			comment: "Entregado en recepción"
		}]
	}
};
var main = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, sans-serif"
};
var container = {
	padding: "24px 28px",
	maxWidth: "560px"
};
var brand = {
	color: "#0b1f3a",
	fontWeight: 700,
	letterSpacing: "3px",
	fontSize: "12px"
};
var h1 = {
	color: "#0b1f3a",
	fontSize: "22px",
	margin: "8px 0"
};
var muted = {
	color: "#6b7280",
	fontSize: "13px",
	margin: "2px 0"
};
var label = {
	color: "#111827",
	fontSize: "14px",
	fontWeight: 700,
	margin: "0"
};
var comment = {
	color: "#374151",
	fontSize: "13px",
	fontStyle: "italic",
	margin: "4px 0 0"
};
var row = {
	padding: "10px 0",
	borderBottom: "1px solid #eef0f3"
};
var hr = {
	borderColor: "#e5e7eb",
	margin: "16px 0"
};
/**
* Template registry — maps template names to their React Email components.
* Import and register new templates here after creating them in this directory.
*/
var TEMPLATES = {
	"nuevo-pedido": template$8,
	"resumen-pendientes": template$7,
	"codigo-acceso-crm": template$6,
	"confirmacion-pedido": template$5,
	"comprobante-venta": template$4,
	"aviso-renovacion": template$3,
	"aviso-adeudo": template$2,
	"demo-wialon": template$1,
	"reporte-visitas": template
};
var send_email_exports = /* @__PURE__ */ __exportAll({ sendTemplateEmail: () => sendTemplateEmail });
var SITE_NAME = "ORB-LITE";
var SENDER_DOMAIN = "notify.orb-lite.com";
var FROM_DOMAIN = "orb-lite.com";
/**
* Renders a registered template and sends it through Lovable's managed email
* API. Suppression, retries, and rate limits are enforced by Lovable
* server-side. A suppressed recipient is an expected outcome
* ({ sent: false }); any other failure throws — EmailAPIError exposes
* .code and .status for branching.
*/
async function sendTemplateEmail(templateName, to, options = {}) {
	const apiKey = process.env["LOVABLE_API_KEY"];
	if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");
	const template = TEMPLATES[templateName];
	if (!template) throw new Error(`Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(", ")}`);
	const recipient = template.to || to;
	if (!recipient) throw new Error("Recipient is required (the template defines no fixed recipient)");
	const templateData = options.templateData ?? {};
	const element = import_react.createElement(template.component, templateData);
	const html = await render(element);
	const text = await render(element, { plainText: true });
	const subject = typeof template.subject === "function" ? template.subject(templateData) : template.subject;
	try {
		await sendLovableEmail({
			to: recipient,
			from: `${SITE_NAME} <ventas@${FROM_DOMAIN}>`,
			sender_domain: SENDER_DOMAIN,
			subject,
			html,
			text,
			purpose: "transactional",
			label: templateName,
			idempotency_key: options.idempotencyKey || crypto.randomUUID(),
			...options.replyTo ? { reply_to: options.replyTo } : {}
		}, {
			apiKey,
			sendUrl: process.env["LOVABLE_SEND_URL"]
		});
	} catch (error) {
		console.error("Error sending email:", error);
		if (error instanceof EmailAPIError && error.code === "recipient_suppressed") return {
			sent: false,
			reason: "recipient_suppressed"
		};
		throw error;
	}
	return { sent: true };
}
//#endregion
export { send_email_exports as n, TEMPLATES as r, sendTemplateEmail as t };
