import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as render } from "../_libs/@react-email/render+[...].mjs";
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
//#region node_modules/.nitro/vite/services/ssr/assets/send-email-CpQ5TbHh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$8 = "/app/applet/src/lib/email-templates/nuevo-pedido.tsx";
var mxn$3 = (n) => `$${(n ?? 0).toLocaleString("es-MX", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})}`;
var NuevoPedidoEmail = (p) => {
	const lines = p.lines ?? [];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Html, {
		lang: "es",
		dir: "ltr",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Head, {}, void 0, false, {
				fileName: _jsxFileName$8,
				lineNumber: 79,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Preview, { children: `Nuevo pedido ${p.orderId ?? ""} — ${p.totalItems ?? 0} artículo(s) — ${mxn$3(p.total)} MXN` }, void 0, false, {
				fileName: _jsxFileName$8,
				lineNumber: 80,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Body, {
				style: main$7,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container, {
					style: container$7,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: header$2,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
								style: logo$2,
								children: "ORB-LITE"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 86,
								columnNumber: 13
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
								style: headerSub$2,
								children: "Rastreo GPS Satelital · Bitácora de ventas"
							}, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 87,
								columnNumber: 13
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 85,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
							as: "h2",
							style: h2$3,
							children: ["Nuevo pedido ", p.orderId ? `#${p.orderId}` : ""]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 90,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
							style: muted$4,
							children: [
								"Entrega: ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: p.shippingLabel ?? "—" }, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 94,
									columnNumber: 22
								}, void 0),
								p.isNational ? " (envío foráneo)" : " (entrega local)"
							]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 93,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: card$4,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: sectionTitle$2,
									children: "CLIENTE"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 99,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: ["Número de cliente: ", p.customerNumber ? `#${p.customerNumber}` : "Sin asignar"]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 100,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: p.isFirstPurchase === null || p.isFirstPurchase === void 0 ? "Historial no disponible" : p.isFirstPurchase ? "Primera compra: SÍ" : "Primera compra: No"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 103,
									columnNumber: 13
								}, void 0),
								p.isFirstPurchase === false ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: ["Compras acumuladas: ", p.ordersCount ?? 0]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 112,
									columnNumber: 17
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: [
										"Total histórico comprado: ",
										mxn$3(p.totalSpent ?? 0),
										" MXN"
									]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 113,
									columnNumber: 17
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 111,
									columnNumber: 15
								}, void 0) : null
							]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 98,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: card$4,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: sectionTitle$2,
									children: "PAQUETES"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 119,
									columnNumber: 13
								}, void 0),
								lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
									style: lineBlock$2,
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
											style: lineName$2,
											children: [
												l.variantName,
												" ×",
												l.quantity
											]
										}, void 0, true, {
											fileName: _jsxFileName$8,
											lineNumber: 124,
											columnNumber: 21
										}, void 0),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
											style: lineDetail$2,
											children: l.title
										}, void 0, false, {
											fileName: _jsxFileName$8,
											lineNumber: 127,
											columnNumber: 21
										}, void 0),
										l.addOns?.map((a) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
											style: lineDetail$2,
											children: [
												"+ ",
												a.name,
												" — ",
												mxn$3(a.price)
											]
										}, a.name, true, {
											fileName: _jsxFileName$8,
											lineNumber: 129,
											columnNumber: 23
										}, void 0)),
										l.isRenewal && l.renewal ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail$2,
												children: ["Titular: ", l.renewal.fullName]
											}, void 0, true, {
												fileName: _jsxFileName$8,
												lineNumber: 135,
												columnNumber: 25
											}, void 0),
											l.renewal.unitName ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail$2,
												children: ["Equipo en plataforma: ", l.renewal.unitName]
											}, void 0, true, {
												fileName: _jsxFileName$8,
												lineNumber: 137,
												columnNumber: 27
											}, void 0) : null,
											l.renewal.imei ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail$2,
												children: ["IMEI: ", l.renewal.imei]
											}, void 0, true, {
												fileName: _jsxFileName$8,
												lineNumber: 140,
												columnNumber: 27
											}, void 0) : null,
											l.renewal.iccid ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail$2,
												children: ["ICCID: ", l.renewal.iccid]
											}, void 0, true, {
												fileName: _jsxFileName$8,
												lineNumber: 143,
												columnNumber: 27
											}, void 0) : null,
											l.renewal.simPhone ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail$2,
												children: ["Tel. del chip: ", l.renewal.simPhone]
											}, void 0, true, {
												fileName: _jsxFileName$8,
												lineNumber: 146,
												columnNumber: 27
											}, void 0) : null
										] }, void 0, true, {
											fileName: _jsxFileName$8,
											lineNumber: 134,
											columnNumber: 23
										}, void 0) : null
									] }, void 0, true, {
										fileName: _jsxFileName$8,
										lineNumber: 123,
										columnNumber: 19
									}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
										align: "right",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
											style: linePrice$2,
											children: mxn$3(l.lineTotal)
										}, void 0, false, {
											fileName: _jsxFileName$8,
											lineNumber: 152,
											columnNumber: 21
										}, void 0)
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 151,
										columnNumber: 19
									}, void 0)] }, void 0, true, {
										fileName: _jsxFileName$8,
										lineNumber: 122,
										columnNumber: 17
									}, void 0)
								}, i, false, {
									fileName: _jsxFileName$8,
									lineNumber: 121,
									columnNumber: 15
								}, void 0)),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hr, { style: hr$6 }, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 157,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: totalRow$2,
									children: "Productos"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 160,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 159,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: totalRow$2,
										children: mxn$3(p.productsTotal)
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 163,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 162,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 158,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: totalRow$2,
									children: "Envío"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 168,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 167,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: totalRow$2,
										children: mxn$3(p.shippingPrice)
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 171,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 170,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 166,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: totalRow$2,
									children: "Subtotal sin IVA"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 176,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 175,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: totalRow$2,
										children: mxn$3(p.subtotalWithoutIva)
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 179,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 178,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 174,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: totalRow$2,
									children: "IVA (16%)"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 184,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 183,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: totalRow$2,
										children: mxn$3(p.iva)
									}, void 0, false, {
										fileName: _jsxFileName$8,
										lineNumber: 187,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 186,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 182,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: grandTotal$2,
									children: "TOTAL"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 192,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 191,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: grandTotal$2,
										children: [mxn$3(p.total), " MXN"]
									}, void 0, true, {
										fileName: _jsxFileName$8,
										lineNumber: 195,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 194,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 190,
									columnNumber: 13
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 118,
							columnNumber: 11
						}, void 0),
						p.isNational && p.shippingInfo ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: card$4,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: sectionTitle$2,
									children: "DATOS DE ENVÍO (FORÁNEO)"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 202,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: ["Nombre: ", p.shippingInfo.fullName]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 203,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: ["Teléfono: ", p.shippingInfo.phone]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 204,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: [
										p.shippingInfo.city,
										", ",
										p.shippingInfo.state,
										" — C.P. ",
										p.shippingInfo.zip
									]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 205,
									columnNumber: 15
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 201,
							columnNumber: 13
						}, void 0) : null,
						!p.isNational && p.pickupInfo ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: card$4,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: sectionTitle$2,
									children: "CONTACTO PARA ENTREGA LOCAL"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 213,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: ["Nombre: ", p.pickupInfo.fullName]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 214,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: ["Teléfono: ", p.pickupInfo.phone]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 215,
									columnNumber: 15
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 212,
							columnNumber: 13
						}, void 0) : null,
						p.wantsInvoice && p.billingInfo ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: card$4,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: sectionTitle$2,
									children: "FACTURACIÓN (CFDI 4.0)"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 221,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: ["Razón social: ", p.billingInfo.legalName]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 222,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: ["RFC: ", p.billingInfo.rfc]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 223,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: ["Régimen fiscal: ", p.billingInfo.taxRegime]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 224,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: ["Uso de CFDI: ", p.billingInfo.cfdiUse]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 225,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: ["C.P. fiscal: ", p.billingInfo.fiscalZip]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 226,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: ["Correo: ", p.billingInfo.email]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 227,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: ["Teléfono: ", p.billingInfo.phone]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 228,
									columnNumber: 15
								}, void 0),
								p.billingInfo.constanciaUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: [
										"Constancia fiscal:",
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
											href: p.billingInfo.constanciaUrl,
											style: { color: "#A3E635" },
											children: p.billingInfo.constanciaFileName ?? "Descargar archivo"
										}, void 0, false, {
											fileName: _jsxFileName$8,
											lineNumber: 232,
											columnNumber: 19
										}, void 0),
										" ",
										"(enlace válido 30 días)"
									]
								}, void 0, true, {
									fileName: _jsxFileName$8,
									lineNumber: 230,
									columnNumber: 17
								}, void 0) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail$1,
									children: "Constancia fiscal: no adjuntada"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 238,
									columnNumber: 17
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 220,
							columnNumber: 13
						}, void 0) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
							style: muted$4,
							children: "El cliente no requiere factura."
						}, void 0, false, {
							fileName: _jsxFileName$8,
							lineNumber: 242,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hr, { style: hr$6 }, void 0, false, {
							fileName: _jsxFileName$8,
							lineNumber: 245,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
							style: footer$3,
							children: "Correo automático de orb-lite.com · Cada pedido finalizado por WhatsApp queda registrado aquí como bitácora de venta."
						}, void 0, false, {
							fileName: _jsxFileName$8,
							lineNumber: 246,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$8,
					lineNumber: 84,
					columnNumber: 9
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$8,
				lineNumber: 83,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$8,
		lineNumber: 78,
		columnNumber: 5
	}, void 0);
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
var _jsxFileName$7 = "/app/applet/src/lib/email-templates/resumen-pendientes.tsx";
var mxn$2 = (n) => `$${(n ?? 0).toLocaleString("es-MX", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})}`;
var navy = "#0B0E14";
var lime = "#A3E635";
var border = "#22262F";
var muted$3 = "#9BA3AF";
function ResumenPendientesEmail({ date = "", count = 0, totalPending = 0, orders = [], panelUrl = "" }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Html, {
		lang: "es",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Head, {}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 55,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Preview, { children: `${count} solicitud(es) pendientes por revisar` }, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 56,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Body, {
				style: {
					backgroundColor: navy,
					margin: 0,
					fontFamily: "Barlow, Arial, sans-serif"
				},
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container, {
					style: {
						maxWidth: "640px",
						margin: "0 auto",
						padding: "24px"
					},
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
						style: {
							border: `1px solid ${border}`,
							borderRadius: "12px",
							padding: "24px",
							backgroundColor: "#11151D"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
								style: {
									color: lime,
									fontSize: "12px",
									letterSpacing: "2px",
									margin: 0
								},
								children: "ORB-LITE · BITÁCORA DIARIA"
							}, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 67,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
								style: {
									color: "#FFFFFF",
									fontSize: "22px",
									margin: "8px 0 4px"
								},
								children: "Solicitudes pendientes por revisar"
							}, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 70,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
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
							}, void 0, true, {
								fileName: _jsxFileName$7,
								lineNumber: 73,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
								style: {
									color: "#FFFFFF",
									fontSize: "15px",
									margin: "0 0 4px"
								},
								children: ["Pendientes: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									style: { color: lime },
									children: count
								}, void 0, false, {
									fileName: _jsxFileName$7,
									lineNumber: 78,
									columnNumber: 27
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$7,
								lineNumber: 77,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
								style: {
									color: "#FFFFFF",
									fontSize: "15px",
									margin: "0 0 16px"
								},
								children: ["Valor total pendiente: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									style: { color: lime },
									children: mxn$2(totalPending)
								}, void 0, false, {
									fileName: _jsxFileName$7,
									lineNumber: 81,
									columnNumber: 38
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$7,
								lineNumber: 80,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hr, { style: {
								borderColor: border,
								margin: "16px 0"
							} }, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 84,
								columnNumber: 13
							}, this),
							count === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
								style: {
									color: muted$3,
									fontSize: "14px"
								},
								children: "No hay solicitudes pendientes. Todo está marcado como vendido o no vendido."
							}, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 87,
								columnNumber: 15
							}, this) : orders.map((o) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
								style: {
									border: `1px solid ${border}`,
									borderRadius: "10px",
									padding: "14px",
									marginBottom: "12px"
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
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
									}, void 0, true, {
										fileName: _jsxFileName$7,
										lineNumber: 101,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
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
									}, void 0, true, {
										fileName: _jsxFileName$7,
										lineNumber: 105,
										columnNumber: 19
									}, this),
									o.email ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: {
											color: muted$3,
											fontSize: "13px",
											margin: "0 0 4px"
										},
										children: o.email
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 109,
										columnNumber: 21
									}, this) : null,
									o.itemsSummary ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: {
											color: muted$3,
											fontSize: "13px",
											margin: "0 0 4px"
										},
										children: o.itemsSummary
									}, void 0, false, {
										fileName: _jsxFileName$7,
										lineNumber: 114,
										columnNumber: 21
									}, this) : null,
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
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
									}, void 0, true, {
										fileName: _jsxFileName$7,
										lineNumber: 118,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: {
											color: "#FFFFFF",
											fontSize: "14px",
											margin: "4px 0 0"
										},
										children: ["Total: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: mxn$2(o.total) }, void 0, false, {
											fileName: _jsxFileName$7,
											lineNumber: 123,
											columnNumber: 28
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$7,
										lineNumber: 122,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: {
											color: muted$3,
											fontSize: "12px",
											margin: "4px 0 0"
										},
										children: ["Recibido: ", o.createdAt]
									}, void 0, true, {
										fileName: _jsxFileName$7,
										lineNumber: 125,
										columnNumber: 19
									}, this)
								]
							}, o.orderId, true, {
								fileName: _jsxFileName$7,
								lineNumber: 92,
								columnNumber: 17
							}, this)),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hr, { style: {
								borderColor: border,
								margin: "16px 0"
							} }, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 132,
								columnNumber: 13
							}, this),
							panelUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
								style: { marginBottom: "12px" },
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
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
								}, void 0, false, {
									fileName: _jsxFileName$7,
									lineNumber: 135,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: {
										color: muted$3,
										fontSize: "12px",
										margin: "8px 0 0"
									},
									children: "Enlace privado y no listado en el sitio: no lo compartas."
								}, void 0, false, {
									fileName: _jsxFileName$7,
									lineNumber: 150,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$7,
								lineNumber: 134,
								columnNumber: 15
							}, this) : null,
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
								style: {
									color: muted$3,
									fontSize: "12px",
									margin: 0
								},
								children: "Estas solicitudes seguirán apareciendo en el resumen diario hasta que cambies su estado a vendido o no vendido (desde el enlace de arriba o en la base de datos)."
							}, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 155,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$7,
						lineNumber: 59,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$7,
					lineNumber: 58,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 57,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$7,
		lineNumber: 54,
		columnNumber: 5
	}, this);
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
var _jsxFileName$6 = "/app/applet/src/lib/email-templates/codigo-acceso-crm.tsx";
var Email$4 = ({ code = "000000", minutes = 20, url }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Html, {
	lang: "es",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Head, {}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 22,
			columnNumber: 5
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Preview, { children: "Tu código de un solo uso para crear la contraseña del CRM" }, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 23,
			columnNumber: 5
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Body, {
			style: main$6,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container, {
				style: container$6,
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: brand$4,
						children: "ORB-LITE · RASTREO GPS SATELITAL"
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 26,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
						style: h1$3,
						children: "Código de acceso al CRM"
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 27,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: p$2,
						children: [
							"Usa este código de un solo uso para crear (o restablecer) la contraseña de la cuenta",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: " ventas@orb-lite.com" }, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 30,
								columnNumber: 11
							}, void 0),
							"."
						]
					}, void 0, true, {
						fileName: _jsxFileName$6,
						lineNumber: 28,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
						style: codeBox,
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
							style: codeText,
							children: code
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 34,
							columnNumber: 11
						}, void 0)
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 33,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: p$2,
						children: [
							"Vence en ",
							minutes,
							" minutos y solo puede usarse una vez."
						]
					}, void 0, true, {
						fileName: _jsxFileName$6,
						lineNumber: 37,
						columnNumber: 9
					}, void 0),
					url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: p$2,
						children: [
							"Abre esta página para usarlo: ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 41,
								columnNumber: 43
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								style: link$1,
								children: url
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 42,
								columnNumber: 13
							}, void 0)
						]
					}, void 0, true, {
						fileName: _jsxFileName$6,
						lineNumber: 40,
						columnNumber: 11
					}, void 0) : null,
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: small$2,
						children: "Si no solicitaste este código, ignora este correo: nadie puede entrar al CRM sin él."
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 46,
						columnNumber: 9
					}, void 0)
				]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 25,
				columnNumber: 7
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 24,
			columnNumber: 5
		}, void 0)
	]
}, void 0, true, {
	fileName: _jsxFileName$6,
	lineNumber: 21,
	columnNumber: 3
}, void 0);
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
var _jsxFileName$5 = "/app/applet/src/lib/email-templates/confirmacion-pedido.tsx";
var mxn$1 = (n) => `$${(n ?? 0).toLocaleString("es-MX", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})}`;
var ConfirmacionPedidoEmail = (p) => {
	const lines = p.lines ?? [];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Html, {
		lang: "es",
		dir: "ltr",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Head, {}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 57,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Preview, { children: `Recibimos tu solicitud ${p.orderId ? `#${p.orderId}` : ""} — ${mxn$1(p.total)} MXN` }, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 58,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Body, {
				style: main$5,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container, {
					style: container$5,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: header$1,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
								style: logo$1,
								children: "ORB-LITE"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 64,
								columnNumber: 13
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
								style: headerSub$1,
								children: "Rastreo GPS Satelital"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 65,
								columnNumber: 13
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 63,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
							as: "h2",
							style: h2$2,
							children: p.customerName ? `¡Gracias, ${p.customerName}!` : "¡Gracias por tu solicitud!"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 68,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
							style: muted$2,
							children: [
								"Recibimos tu solicitud ",
								p.orderId ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: ["#", p.orderId] }, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 72,
									columnNumber: 49
								}, void 0) : null,
								" y nuestro equipo te contactará por WhatsApp para confirmar la entrega y el pago."
							]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 71,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: numberCard,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: numberLabel,
									children: "TU NÚMERO DE CLIENTE"
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 77,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: numberValue,
									children: p.customerNumber ? `#${p.customerNumber}` : "Se asignará al confirmar tu compra"
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 78,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: numberNote,
									children: ["Guárdalo y menciónalo en tus próximas compras: con tus compras acumuladas se activan descuentos y promociones exclusivas para clientes ORB-LITE.", p.ordersCount ? ` Llevas ${p.ordersCount} compra(s) registrada(s).` : ""]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 81,
									columnNumber: 13
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 76,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: card$3,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: sectionTitle$1,
									children: "RESUMEN DE TU SOLICITUD"
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 89,
									columnNumber: 13
								}, void 0),
								lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
									style: lineBlock$1,
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
											style: lineName$1,
											children: [
												l.variantName,
												" ×",
												l.quantity
											]
										}, void 0, true, {
											fileName: _jsxFileName$5,
											lineNumber: 94,
											columnNumber: 21
										}, void 0),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
											style: lineDetail$1,
											children: l.title
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 97,
											columnNumber: 21
										}, void 0),
										l.addOns?.map((a) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
											style: lineDetail$1,
											children: [
												"+ ",
												a.name,
												" — ",
												mxn$1(a.price)
											]
										}, a.name, true, {
											fileName: _jsxFileName$5,
											lineNumber: 99,
											columnNumber: 23
										}, void 0)),
										l.isRenewal && l.renewal ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail$1,
												children: ["Titular: ", l.renewal.fullName]
											}, void 0, true, {
												fileName: _jsxFileName$5,
												lineNumber: 105,
												columnNumber: 25
											}, void 0),
											l.renewal.unitName ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail$1,
												children: ["Equipo en plataforma: ", l.renewal.unitName]
											}, void 0, true, {
												fileName: _jsxFileName$5,
												lineNumber: 107,
												columnNumber: 27
											}, void 0) : null,
											l.renewal.imei ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail$1,
												children: ["IMEI: ", l.renewal.imei]
											}, void 0, true, {
												fileName: _jsxFileName$5,
												lineNumber: 110,
												columnNumber: 27
											}, void 0) : null,
											l.renewal.iccid ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail$1,
												children: ["ICCID: ", l.renewal.iccid]
											}, void 0, true, {
												fileName: _jsxFileName$5,
												lineNumber: 113,
												columnNumber: 27
											}, void 0) : null,
											l.renewal.simPhone ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail$1,
												children: ["Tel. del chip: ", l.renewal.simPhone]
											}, void 0, true, {
												fileName: _jsxFileName$5,
												lineNumber: 116,
												columnNumber: 27
											}, void 0) : null
										] }, void 0, true, {
											fileName: _jsxFileName$5,
											lineNumber: 104,
											columnNumber: 23
										}, void 0) : null
									] }, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 93,
										columnNumber: 19
									}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
										align: "right",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
											style: linePrice$1,
											children: mxn$1(l.lineTotal)
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 122,
											columnNumber: 21
										}, void 0)
									}, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 121,
										columnNumber: 19
									}, void 0)] }, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 92,
										columnNumber: 17
									}, void 0)
								}, i, false, {
									fileName: _jsxFileName$5,
									lineNumber: 91,
									columnNumber: 15
								}, void 0)),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hr, { style: hr$5 }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 127,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: totalRow$1,
									children: "Productos"
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 130,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 129,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: totalRow$1,
										children: mxn$1(p.productsTotal)
									}, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 133,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 132,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 128,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: totalRow$1,
									children: ["Entrega", p.shippingLabel ? ` — ${p.shippingLabel}` : ""]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 138,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 137,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: totalRow$1,
										children: mxn$1(p.shippingPrice)
									}, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 143,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 142,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 136,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: totalRow$1,
									children: "Subtotal sin IVA"
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 148,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 147,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: totalRow$1,
										children: mxn$1(p.subtotalWithoutIva)
									}, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 151,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 150,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 146,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: totalRow$1,
									children: "IVA (16%)"
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 156,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 155,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: totalRow$1,
										children: mxn$1(p.iva)
									}, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 159,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 158,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 154,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: grandTotal$1,
									children: "TOTAL"
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 164,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 163,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: grandTotal$1,
										children: [mxn$1(p.total), " MXN"]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 167,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 166,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 162,
									columnNumber: 13
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 88,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
							style: muted$2,
							children: p.wantsInvoice ? "Registramos tu solicitud de factura con los datos fiscales que capturaste." : "No solicitaste factura en este pedido. Si la necesitas, avísanos por WhatsApp."
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 172,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hr, { style: hr$5 }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 178,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
							style: footer$2,
							children: "ORB-LITE · ventas@orb-lite.com · WhatsApp 33 1835 9421 · orb-lite.com"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 179,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 62,
					columnNumber: 9
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 61,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 56,
		columnNumber: 5
	}, void 0);
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
var _jsxFileName$4 = "/app/applet/src/lib/email-templates/comprobante-venta.tsx";
var mxn = (n) => `$${(n ?? 0).toLocaleString("es-MX", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})}`;
var ComprobanteVentaEmail = (p) => {
	const lines = p.lines ?? [];
	const billing = p.wantsInvoice ? p.billingInfo ?? null : null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Html, {
		lang: "es",
		dir: "ltr",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Head, {}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 70,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Preview, { children: `Comprobante de venta ${p.orderId ? `#${p.orderId}` : ""} — ${mxn(p.total)} MXN` }, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 71,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Body, {
				style: main$4,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container, {
					style: container$4,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: header,
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
								style: logo,
								children: "ORB-LITE"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 79,
								columnNumber: 17
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
								style: headerSub,
								children: "Rastreo GPS Satelital"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 80,
								columnNumber: 17
							}, void 0)] }, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 78,
								columnNumber: 15
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
								align: "right",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: docType,
									children: "COMPROBANTE DE VENTA"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 83,
									columnNumber: 17
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: headerSub,
									children: p.orderId ? `Folio ${p.orderId}` : ""
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 84,
									columnNumber: 17
								}, void 0)]
							}, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 82,
								columnNumber: 15
							}, void 0)] }, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 77,
								columnNumber: 13
							}, void 0)
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 76,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: card$2,
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: sectionTitle,
									children: "DATOS DE LA VENTA"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 92,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: ["Folio: ", p.orderId ?? "—"]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 93,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: ["Fecha: ", p.issuedAt ?? "—"]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 94,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: ["Canal: ", p.channel ?? "Tienda en línea"]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 95,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: ["Entrega: ", p.shippingLabel ?? "—"]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 96,
									columnNumber: 17
								}, void 0)
							] }, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 91,
								columnNumber: 15
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: sectionTitle,
									children: "CLIENTE"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 99,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: p.customerName ?? "—"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 100,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: ["Número de cliente: ", p.customerNumber ? `#${p.customerNumber}` : "Por asignar"]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 101,
									columnNumber: 17
								}, void 0),
								p.customerPhone ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: ["Tel: ", p.customerPhone]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 104,
									columnNumber: 36
								}, void 0) : null,
								p.customerEmail ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: p.customerEmail
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 105,
									columnNumber: 36
								}, void 0) : null
							] }, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 98,
								columnNumber: 15
							}, void 0)] }, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 90,
								columnNumber: 13
							}, void 0)
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 89,
							columnNumber: 11
						}, void 0),
						billing ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: card$2,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: sectionTitle,
									children: "DATOS FISCALES PARA FACTURA"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 112,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: ["Razón social: ", billing.legalName ?? "—"]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 113,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: ["RFC: ", billing.rfc ?? "—"]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 114,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: ["Régimen fiscal: ", billing.taxRegime ?? "—"]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 115,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: ["Uso de CFDI: ", billing.cfdiUse ?? "—"]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 116,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: ["C.P. fiscal: ", billing.fiscalZip ?? "—"]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 117,
									columnNumber: 15
								}, void 0),
								billing.fiscalAddress ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: ["Domicilio: ", billing.fiscalAddress]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 119,
									columnNumber: 17
								}, void 0) : null,
								billing.email ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: ["Correo fiscal: ", billing.email]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 121,
									columnNumber: 32
								}, void 0) : null,
								billing.phone ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: detail,
									children: ["Teléfono: ", billing.phone]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 122,
									columnNumber: 32
								}, void 0) : null
							]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 111,
							columnNumber: 13
						}, void 0) : null,
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: card$2,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: sectionTitle,
									children: "CONCEPTOS"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 127,
									columnNumber: 13
								}, void 0),
								lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
									style: lineBlock,
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
											style: lineName,
											children: [
												l.variantName,
												" ×",
												l.quantity
											]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 132,
											columnNumber: 21
										}, void 0),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
											style: lineDetail,
											children: l.title
										}, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 135,
											columnNumber: 21
										}, void 0),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
											style: lineDetail,
											children: ["Precio unitario: ", mxn(l.unitPrice)]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 136,
											columnNumber: 21
										}, void 0),
										l.addOns?.map((a) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
											style: lineDetail,
											children: [
												"+ ",
												a.name,
												" — ",
												mxn(a.price)
											]
										}, a.name, true, {
											fileName: _jsxFileName$4,
											lineNumber: 138,
											columnNumber: 23
										}, void 0)),
										l.renewal ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
											l.renewal.fullName ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail,
												children: ["Titular: ", l.renewal.fullName]
											}, void 0, true, {
												fileName: _jsxFileName$4,
												lineNumber: 145,
												columnNumber: 27
											}, void 0) : null,
											l.renewal.unitName ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail,
												children: ["Equipo en plataforma: ", l.renewal.unitName]
											}, void 0, true, {
												fileName: _jsxFileName$4,
												lineNumber: 148,
												columnNumber: 27
											}, void 0) : null,
											l.renewal.imei ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail,
												children: ["IMEI: ", l.renewal.imei]
											}, void 0, true, {
												fileName: _jsxFileName$4,
												lineNumber: 151,
												columnNumber: 27
											}, void 0) : null,
											l.renewal.iccid ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail,
												children: ["ICCID: ", l.renewal.iccid]
											}, void 0, true, {
												fileName: _jsxFileName$4,
												lineNumber: 154,
												columnNumber: 27
											}, void 0) : null,
											l.renewal.simPhone ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
												style: lineDetail,
												children: ["Tel. del chip: ", l.renewal.simPhone]
											}, void 0, true, {
												fileName: _jsxFileName$4,
												lineNumber: 157,
												columnNumber: 27
											}, void 0) : null
										] }, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 143,
											columnNumber: 23
										}, void 0) : null
									] }, void 0, true, {
										fileName: _jsxFileName$4,
										lineNumber: 131,
										columnNumber: 19
									}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
										align: "right",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
											style: linePrice,
											children: mxn(l.lineTotal)
										}, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 163,
											columnNumber: 21
										}, void 0)
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 162,
										columnNumber: 19
									}, void 0)] }, void 0, true, {
										fileName: _jsxFileName$4,
										lineNumber: 130,
										columnNumber: 17
									}, void 0)
								}, i, false, {
									fileName: _jsxFileName$4,
									lineNumber: 129,
									columnNumber: 15
								}, void 0)),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hr, { style: hr$4 }, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 168,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: totalRow,
									children: "Productos"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 171,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 170,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: totalRow,
										children: mxn(p.productsTotal)
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 174,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 173,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 169,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: totalRow,
									children: "Entrega"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 179,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 178,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: totalRow,
										children: mxn(p.shippingPrice)
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 182,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 181,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 177,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: totalRow,
									children: "Subtotal sin IVA"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 187,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 186,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: totalRow,
										children: mxn(p.subtotalWithoutIva)
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 190,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 189,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 185,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: totalRow,
									children: "IVA (16%)"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 195,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 194,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: totalRow,
										children: mxn(p.iva)
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 198,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 197,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 193,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: grandTotal,
									children: "TOTAL"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 203,
									columnNumber: 17
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 202,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Column, {
									align: "right",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
										style: grandTotal,
										children: [mxn(p.total), " MXN"]
									}, void 0, true, {
										fileName: _jsxFileName$4,
										lineNumber: 206,
										columnNumber: 17
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 205,
									columnNumber: 15
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 201,
									columnNumber: 13
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 126,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
							style: muted$1,
							children: billing ? "Este documento es el comprobante interno de la venta. El CFDI (factura fiscal) se emite con los datos fiscales de arriba y se envía por correo una vez confirmado el pago." : "Este documento es el comprobante de tu venta. Si necesitas factura fiscal (CFDI), respóndenos con tu constancia de situación fiscal vigente."
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 211,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hr, { style: hr$4 }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 217,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
							style: footer$1,
							children: "ORB-LITE · ventas@orb-lite.com · WhatsApp 33 1835 9421 · orb-lite.com"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 218,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 75,
					columnNumber: 9
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 74,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 69,
		columnNumber: 5
	}, void 0);
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
var _jsxFileName$3 = "/app/applet/src/lib/email-templates/aviso-renovacion.tsx";
var money$1 = (n) => `$${Number(n ?? 0).toLocaleString("es-MX", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})} MXN`;
var Email$3 = ({ customerName, customerNumber, variantName = "Renovación de servicio", platform, period, renewalDate, amount, daysLeft = 10, unitName, imei, iccid, simPhone, isInternal }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Html, {
	lang: "es",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Head, {}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 50,
			columnNumber: 5
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Preview, { children: `Tu renovación vence en ${daysLeft} día(s) — ${variantName}` }, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 51,
			columnNumber: 5
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Body, {
			style: main$3,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container, {
				style: container$3,
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: brand$3,
						children: "ORB-LITE"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 54,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
						style: h1$2,
						children: isInternal ? `Aviso interno: renovación en ${daysLeft} día(s)` : `Tu renovación vence en ${daysLeft} día(s)`
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 55,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: p$1,
						children: [
							customerName ? `Hola ${customerName}, ` : "Hola, ",
							"te recordamos que el servicio ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: variantName }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 62,
								columnNumber: 41
							}, void 0),
							platform ? ` (plataforma ${platform})` : "",
							" se renueva el ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: renewalDate }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 63,
								columnNumber: 71
							}, void 0),
							". Las renovaciones se aplican el día primero del mes de renovación."
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 60,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
						style: card$1,
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
								style: row$2,
								children: ["Servicio: ", variantName]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 68,
								columnNumber: 11
							}, void 0),
							period && /* @__PURE__ */ (void 0)(Text, {
								style: row$2,
								children: ["Periodo: ", period === "monthly" ? "Mensual" : "Anual"]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 69,
								columnNumber: 22
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
								style: row$2,
								children: ["Importe a renovar: ", money$1(amount)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 70,
								columnNumber: 11
							}, void 0),
							customerNumber && /* @__PURE__ */ (void 0)(Text, {
								style: row$2,
								children: ["Cliente #", customerNumber]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 71,
								columnNumber: 30
							}, void 0),
							unitName && /* @__PURE__ */ (void 0)(Text, {
								style: row$2,
								children: ["Equipo en plataforma: ", unitName]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 72,
								columnNumber: 24
							}, void 0),
							imei && /* @__PURE__ */ (void 0)(Text, {
								style: row$2,
								children: ["IMEI: ", imei]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 73,
								columnNumber: 20
							}, void 0),
							iccid && /* @__PURE__ */ (void 0)(Text, {
								style: row$2,
								children: ["ICCID: ", iccid]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 74,
								columnNumber: 21
							}, void 0),
							simPhone && /* @__PURE__ */ (void 0)(Text, {
								style: row$2,
								children: ["Teléfono del chip: ", simPhone]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 75,
								columnNumber: 24
							}, void 0)
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 67,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hr, { style: hr$3 }, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 78,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
						as: "h2",
						style: h2$1,
						children: "Condiciones de renovación"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 79,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: small$1,
						children: [
							"• Tienes ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "20 días" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 83,
								columnNumber: 20
							}, void 0),
							" a partir de la fecha de renovación para pagar. Al pasar ese plazo se ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "bloquea el acceso" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 84,
								columnNumber: 24
							}, void 0),
							" a la plataforma y se cobra el mes en curso."
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 82,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: small$1,
						children: "• El adeudo puede acumularse al mes siguiente; si no se cubre, el servicio se da de baja."
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 87,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: small$1,
						children: [
							"• Si no registramos tu pago, la cuenta se",
							" ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "cancela al segundo mes de adeudo" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 92,
								columnNumber: 11
							}, void 0),
							". Tienes todo ese segundo mes para ponerte al corriente; al cumplir el tercer mes se da de baja definitiva."
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 90,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: small$1,
						children: "Para renovar responde este correo o escríbenos a ventas@orb-lite.com con tu comprobante de pago."
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 95,
						columnNumber: 9
					}, void 0)
				]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 53,
				columnNumber: 7
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 52,
			columnNumber: 5
		}, void 0)
	]
}, void 0, true, {
	fileName: _jsxFileName$3,
	lineNumber: 49,
	columnNumber: 3
}, void 0);
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
var _jsxFileName$2 = "/app/applet/src/lib/email-templates/aviso-adeudo.tsx";
var money = (n) => `$${Number(n ?? 0).toLocaleString("es-MX", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})} MXN`;
var TITLES = {
	bloqueo: "Acceso bloqueado por falta de pago",
	"segundo-mes": "Aviso de cancelación — segundo mes de adeudo",
	baja: "Servicio dado de baja"
};
var Email$2 = ({ stage = "bloqueo", customerName, customerNumber, variantName = "Renovación de servicio", platform, renewalDate, amount, daysOverdue = 20, unitName, imei, iccid, simPhone, isInternal }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Html, {
	lang: "es",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Head, {}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 56,
			columnNumber: 5
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Preview, { children: TITLES[stage] ?? "Aviso de adeudo" }, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 57,
			columnNumber: 5
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Body, {
			style: main$2,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container, {
				style: container$2,
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: brand$2,
						children: "ORB-LITE"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 60,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
						style: h1$1,
						children: isInternal ? `Aviso interno: ${TITLES[stage] ?? "adeudo"}` : TITLES[stage] ?? "Aviso de adeudo"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 61,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: p,
						children: [
							customerName ? `Hola ${customerName}, ` : "Hola, ",
							"el servicio ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: variantName }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 68,
								columnNumber: 23
							}, void 0),
							platform ? ` (plataforma ${platform})` : "",
							" tenía fecha de renovación el",
							" ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: renewalDate }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 70,
								columnNumber: 11
							}, void 0),
							" y registra ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: [daysOverdue, " días"] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 70,
								columnNumber: 53
							}, void 0),
							" de atraso."
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 66,
						columnNumber: 9
					}, void 0),
					stage === "bloqueo" && /* @__PURE__ */ (void 0)(Text, {
						style: p,
						children: [
							"Pasaron los 20 días de plazo, por lo que el ",
							/* @__PURE__ */ (void 0)("strong", { children: "acceso quedó bloqueado" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 75,
								columnNumber: 57
							}, void 0),
							" y se cobra el mes en curso. El adeudo puede acumularse al mes siguiente; si no se cubre, el servicio se dará de baja."
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 74,
						columnNumber: 11
					}, void 0),
					stage === "segundo-mes" && /* @__PURE__ */ (void 0)(Text, {
						style: p,
						children: [
							"Al no registrar tu pago, la cuenta entra en ",
							/* @__PURE__ */ (void 0)("strong", { children: "proceso de cancelación" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 82,
								columnNumber: 57
							}, void 0),
							". Tienes todo este segundo mes para ponerte al corriente. Envíanos el",
							" ",
							/* @__PURE__ */ (void 0)("strong", { children: "comprobante de pago" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 84,
								columnNumber: 13
							}, void 0),
							" a ventas@orb-lite.com para reactivar el servicio."
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 81,
						columnNumber: 11
					}, void 0),
					stage === "baja" && /* @__PURE__ */ (void 0)(Text, {
						style: p,
						children: [
							"Al cumplirse el tercer mes de adeudo, el servicio se ",
							/* @__PURE__ */ (void 0)("strong", { children: "dio de baja" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 89,
								columnNumber: 66
							}, void 0),
							". Si deseas reactivarlo, responde este correo con tu comprobante de pago y validaremos la reactivación."
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 88,
						columnNumber: 11
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
						style: card,
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
								style: row$1,
								children: ["Importe pendiente: ", money(amount)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 96,
								columnNumber: 11
							}, void 0),
							customerNumber && /* @__PURE__ */ (void 0)(Text, {
								style: row$1,
								children: ["Cliente #", customerNumber]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 97,
								columnNumber: 30
							}, void 0),
							unitName && /* @__PURE__ */ (void 0)(Text, {
								style: row$1,
								children: ["Equipo en plataforma: ", unitName]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 98,
								columnNumber: 24
							}, void 0),
							imei && /* @__PURE__ */ (void 0)(Text, {
								style: row$1,
								children: ["IMEI: ", imei]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 99,
								columnNumber: 20
							}, void 0),
							iccid && /* @__PURE__ */ (void 0)(Text, {
								style: row$1,
								children: ["ICCID: ", iccid]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 100,
								columnNumber: 21
							}, void 0),
							simPhone && /* @__PURE__ */ (void 0)(Text, {
								style: row$1,
								children: ["Teléfono del chip: ", simPhone]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 101,
								columnNumber: 24
							}, void 0)
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 95,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hr, { style: hr$2 }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 104,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: small,
						children: "Envía tu comprobante de pago a ventas@orb-lite.com. Las renovaciones se aplican el día primero del mes de renovación."
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 105,
						columnNumber: 9
					}, void 0)
				]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 59,
				columnNumber: 7
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 58,
			columnNumber: 5
		}, void 0)
	]
}, void 0, true, {
	fileName: _jsxFileName$2,
	lineNumber: 55,
	columnNumber: 3
}, void 0);
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
var _jsxFileName$1 = "/app/applet/src/lib/email-templates/demo-wialon.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Html, {
		lang: "es",
		dir: "ltr",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Head, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 40,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Preview, { children: [
				"Tus claves de acceso a la plataforma ",
				access.label,
				" — ORB-LITE"
			] }, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 41,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Body, {
				style: main$1,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container, {
					style: container$1,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
							style: brand$1,
							children: "ORB-LITE"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 44,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
							style: text,
							children: [
								"Buen día",
								name ? ` ${name}` : "",
								","
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 45,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
							style: text,
							children: "Te detallo el link de acceso así como las claves nuevas solicitadas."
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 46,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: block,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
									as: "h2",
									style: h2,
									children: ["Plataforma ", access.label]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 51,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: text,
									children: "Link de acceso:"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 54,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									style: button,
									href: access.platformUrl,
									children: access.platformUrl
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 55,
									columnNumber: 13
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 50,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: block,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
									as: "h2",
									style: h2,
									children: "Dar de alta unidades"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 61,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: text,
									children: "Link de acceso:"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 64,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									style: button,
									href: access.unitsUrl,
									children: access.unitsUrl
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 65,
									columnNumber: 13
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 60,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hr, { style: hr$1 }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 70,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
							style: block,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
									as: "h2",
									style: h2,
									children: "Claves de acceso y link"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 73,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: text,
									children: ["Usuario: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
										style: mono,
										children: username ?? "tu-usuario"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 77,
										columnNumber: 24
									}, void 0)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 76,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: text,
									children: ["Contraseña: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
										style: mono,
										children: "Abc2026+"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 80,
										columnNumber: 27
									}, void 0)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 79,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
									style: note,
									children: "La contraseña es provisional; en el primer ingreso solicitará su reemplazo."
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 82,
									columnNumber: 13
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 72,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hr, { style: hr$1 }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 87,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
							style: text,
							children: [
								"App móvil disponible en iOS, Android o AppGallery Huawei:",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: access.label === "Wialon Lite" ? "Wialon Lite" : "Wialon" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 91,
									columnNumber: 13
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 89,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
							style: footer,
							children: [
								"ORB-LITE · Rastreo GPS y telemetría ·",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									href: "https://orb-lite.com",
									style: link,
									children: "orb-lite.com"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 96,
									columnNumber: 13
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 94,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 43,
					columnNumber: 9
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 42,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 39,
		columnNumber: 5
	}, void 0);
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
var _jsxFileName = "/app/applet/src/lib/email-templates/reporte-visitas.tsx";
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
var Email = ({ routeName = "Ruta", stops = [] }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Html, {
	lang: "es",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Head, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 38,
			columnNumber: 5
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Preview, { children: `Reporte de visitas: ${routeName}` }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 39,
			columnNumber: 5
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Body, {
			style: main,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container, {
				style: container,
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: brand,
						children: "ORB-LITE"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 42,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heading, {
						style: h1,
						children: "Reporte de visitas"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 43,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: muted,
						children: [
							routeName,
							" · ",
							stops.filter((s) => s.visitedAt).length,
							" de ",
							stops.length,
							" paradas visitadas"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 44,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hr, { style: hr }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 48,
						columnNumber: 9
					}, void 0),
					stops.map((stop, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Section, {
						style: row,
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
								style: label,
								children: [
									i === 0 ? "Salida" : `Parada ${i}`,
									": ",
									stop.label
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 51,
								columnNumber: 13
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
								style: muted,
								children: fmt(stop.visitedAt)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 54,
								columnNumber: 13
							}, void 0),
							stop.comment ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
								style: comment,
								children: [
									"“",
									stop.comment,
									"”"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 55,
								columnNumber: 29
							}, void 0) : null
						]
					}, i, true, {
						fileName: _jsxFileName,
						lineNumber: 50,
						columnNumber: 11
					}, void 0)),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hr, { style: hr }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 58,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, {
						style: muted,
						children: "Resumen del viaje enviado por el operador al terminar las visitas."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 59,
						columnNumber: 9
					}, void 0)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 41,
				columnNumber: 7
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 40,
			columnNumber: 5
		}, void 0)
	]
}, void 0, true, {
	fileName: _jsxFileName,
	lineNumber: 37,
	columnNumber: 3
}, void 0);
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
var DEFAULT_FROM = process.env.EMAIL_FROM || `${SITE_NAME} <ventas@orb-lite.com>`;
/**
* Módulo de envío de correos 100% compatible con Vercel.
*
* Detecta y utiliza automáticamente en orden de preferencia:
* 1. Resend (Recomendado oficial en Vercel -> RESEND_API_KEY)
* 2. Servidor SMTP propio (Google Workspace, Titan, cPanel, Outlook -> SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT)
* 3. SendGrid (SENDGRID_API_KEY)
* 4. Brevo / Sendinblue (BREVO_API_KEY)
* 5. Lovable Managed API (LOVABLE_API_KEY como fallback)
* 6. Simulación segura en consola si aún no configuras variables en Vercel
*/
async function sendTemplateEmail(templateName, to, options = {}) {
	const template = TEMPLATES[templateName];
	if (!template) throw new Error(`Template '${templateName}' no encontrado. Disponibles: ${Object.keys(TEMPLATES).join(", ")}`);
	const recipient = template.to || to;
	if (!recipient) throw new Error("El destinatario es obligatorio (la plantilla no define un destinatario fijo)");
	const templateData = options.templateData ?? {};
	const element = import_react.createElement(template.component, templateData);
	const html = await render(element);
	const text = await render(element, { plainText: true });
	const subject = typeof template.subject === "function" ? template.subject(templateData) : template.subject;
	const fromAddress = process.env.EMAIL_FROM || DEFAULT_FROM;
	const resendApiKey = process.env.RESEND_API_KEY;
	if (resendApiKey) try {
		const response = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${resendApiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				from: fromAddress,
				to: recipient,
				subject,
				html,
				text,
				...options.replyTo ? { reply_to: options.replyTo } : {},
				...options.attachments && options.attachments.length > 0 ? { attachments: options.attachments } : {},
				...options.tags && options.tags.length > 0 ? { tags: options.tags } : {}
			})
		});
		const data = await response.json();
		if (!response.ok) {
			console.error("[send-email] Error en Resend API:", data);
			return {
				sent: false,
				reason: data.message || "Error al enviar con Resend"
			};
		}
		return {
			sent: true,
			id: data.id
		};
	} catch (err) {
		console.error("[send-email] Excepción al llamar a Resend:", err);
		return {
			sent: false,
			reason: err.message
		};
	}
	const smtpHost = process.env.SMTP_HOST;
	const smtpUser = process.env.SMTP_USER;
	const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
	if (smtpHost && smtpUser && smtpPass) try {
		const nodemailer = await import("nodemailer").then((m) => m.default || m);
		const port = Number(process.env.SMTP_PORT || 465);
		return {
			sent: true,
			id: (await nodemailer.createTransport({
				host: smtpHost,
				port,
				secure: port === 465,
				auth: {
					user: smtpUser,
					pass: smtpPass
				}
			}).sendMail({
				from: fromAddress,
				to: recipient,
				subject,
				html,
				text,
				replyTo: options.replyTo
			})).messageId
		};
	} catch (err) {
		console.error("[send-email] Error en envío SMTP:", err);
		return {
			sent: false,
			reason: err.message
		};
	}
	const sendgridApiKey = process.env.SENDGRID_API_KEY;
	if (sendgridApiKey) try {
		const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${sendgridApiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				personalizations: [{ to: [{ email: recipient }] }],
				from: {
					email: fromAddress.match(/<([^>]+)>/)?.[1] || fromAddress,
					name: SITE_NAME
				},
				subject,
				content: [{
					type: "text/plain",
					value: text
				}, {
					type: "text/html",
					value: html
				}],
				...options.replyTo ? { reply_to: { email: options.replyTo } } : {}
			})
		});
		if (!response.ok) {
			const errorText = await response.text();
			console.error("[send-email] Error en SendGrid:", errorText);
			return {
				sent: false,
				reason: errorText
			};
		}
		return { sent: true };
	} catch (err) {
		console.error("[send-email] Excepción en SendGrid:", err);
		return {
			sent: false,
			reason: err.message
		};
	}
	const brevoApiKey = process.env.BREVO_API_KEY;
	if (brevoApiKey) try {
		const response = await fetch("https://api.brevo.com/v3/smtp/email", {
			method: "POST",
			headers: {
				"api-key": brevoApiKey,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				sender: {
					name: SITE_NAME,
					email: fromAddress.match(/<([^>]+)>/)?.[1] || fromAddress
				},
				to: [{ email: recipient }],
				subject,
				htmlContent: html,
				textContent: text,
				...options.replyTo ? { replyTo: { email: options.replyTo } } : {}
			})
		});
		const data = await response.json();
		if (!response.ok) {
			console.error("[send-email] Error en Brevo:", data);
			return {
				sent: false,
				reason: data.message || "Error en Brevo"
			};
		}
		return {
			sent: true,
			id: data.messageId
		};
	} catch (err) {
		console.error("[send-email] Excepción en Brevo:", err);
		return {
			sent: false,
			reason: err.message
		};
	}
	console.warn(`[send-email] ⚠️ No se detectó RESEND_API_KEY ni configuración SMTP alternativa.`);
	console.log(`[send-email] Correo simulado exitoso para: ${recipient} | Asunto: "${subject}"`);
	return { sent: true };
}
//#endregion
export { send_email_exports as n, TEMPLATES as r, sendTemplateEmail as t };
