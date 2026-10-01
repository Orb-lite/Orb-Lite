import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { C as Power, P as MapPin, S as RadioTower, X as FileSpreadsheet, _t as CalendarCheck, at as Clock, c as Store, ft as ChevronRight, ht as Car, lt as CircleCheck, nt as Cpu, o as Truck, p as ShieldCheck, v as Route, xt as ArrowRight, yt as Bell } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as CtaBanner } from "./site-chrome-C_0ylVFU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Do5Hrp-p.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var hero_gps_default = "/assets/hero-gps-M5T_qAhN.jpg";
var _jsxFileName = "/app/applet/src/routes/index.tsx?tsr-split=component";
/** Las 6 bondades clave de la plataforma ORB-LITE */
var coreBenefits = [
	{
		icon: MapPin,
		title: "Monitoreo en Vivo 24/7",
		subtitle: "Precisión satelital continua",
		text: "Visualiza la posición exacta de cada unidad minuto a minuto sobre mapas interactivos (OpenStreetMap, Satelital y Google Maps). Conoce velocidad real, si el motor está encendido o apagado, nivel de batería y satélites activos."
	},
	{
		icon: Power,
		title: "Paro de Motor Remoto",
		subtitle: "Protección inmediata antirobo",
		text: "En caso de robo o uso no autorizado, envía la orden de apagado seguro directamente desde tu celular o computadora. El vehículo detiene la marcha mediante corte de combustible o ignición sin riesgo de daño eléctrico."
	},
	{
		icon: Route,
		title: "Optimizador de Rutas Logísticas",
		subtitle: "Ahorra combustible y tiempo",
		text: "Planifica tus paradas de entrega y deja que la plataforma ordene la secuencia más rápida y económica. Exporta la ruta con un solo clic a Google Maps o Waze y comparte enlaces directos con tus conductores."
	},
	{
		icon: Clock,
		title: "Historial de Recorridos y Viajes",
		subtitle: "Auditoría paso a paso",
		text: "Reproduce los trayectos realizados en cualquier fecha: consulta paradas realizadas, tiempos con motor encendido en ralentí, velocidades alcanzadas y kilometraje acumulado para evitar desvíos no autorizados."
	},
	{
		icon: Bell,
		title: "Geocercas y Alertas al Instante",
		subtitle: "Notificaciones automáticas",
		text: "Dibuja zonas de seguridad (bodegas, clientes, talleres) y recibe alertas inmediatas cuando un vehículo entre o salga de ellas, si excede el límite de velocidad o si intentan desconectar la batería."
	},
	{
		icon: FileSpreadsheet,
		title: "Reportes Ejecutivos en Excel",
		subtitle: "Datos listos para tomar decisiones",
		text: "Genera informes detallados y visuales en formato Excel con gráficos profesionales de distancias, horas de motor, excesos de velocidad y consumo estimado para respaldar la administración de tu negocio."
	}
];
/** Segmentos de clientes parafraseados con claridad */
var audiences = [
	{
		icon: Car,
		title: "Uso Personal y Familiar",
		kicker: "Tranquilidad para tu patrimonio",
		text: "Diseñado para quien cuida su auto, camioneta o motocicleta. Si alguien mueve tu vehículo o intenta manipularlo, recibes una alerta inmediata y puedes apagar el motor al instante desde tu teléfono.",
		points: [
			"App móvil fácil de usar en iOS y Android",
			"Paro de motor seguro ante emergencias",
			"Alerta por desconexión de batería del auto",
			"1 año de servicio y datos incluido sin recargas"
		],
		actionLink: "/tienda",
		actionLabel: "Ver equipo para auto"
	},
	{
		icon: Truck,
		title: "Empresas, Flotas y Transporte",
		kicker: "Control operativo y ahorro de costos",
		text: "Centraliza todas tus unidades en una sola pantalla. Audita la puntualidad de tus operadores, reduce el desgaste mecánico, controla tiempos muertos y optimiza los repartos con exportación a Waze y Google Maps.",
		points: [
			"Monitoreo multiunidad simultáneo",
			"Planificador inteligente de rutas logísticas",
			"Reportes de rendimiento descargables en Excel",
			"Geocercas de almacenes, rutas y clientes"
		],
		actionLink: "/demo",
		actionLabel: "Solicitar demo de flota"
	},
	{
		icon: Store,
		title: "Instaladores, Negocios y Mayoreo",
		kicker: "Hardware Teltonika de grado industrial",
		text: "Suministro confiable para talleres eléctricos, distribuidores y empresas de seguridad. Kits profesionales listos para instalar con hardware europeo 4G LTE y esquemas con o sin SIM.",
		points: [
			"Equipos Teltonika FTC927 homologados",
			"Precios escalonados por volumen",
			"SIMs multi-carrier dedicadas para telemetría",
			"Facturación fiscal mexicana (SAT) inmediata"
		],
		actionLink: "/contacto",
		actionLabel: "Cotizar por mayoreo"
	}
];
/** Pilares tecnológicos */
var techPillars = [
	{
		icon: RadioTower,
		title: "Conectividad Multi-Carrier",
		desc: "El chip SIM incluido se enlaza automáticamente a la red con mejor señal (Telcel, AT&T o Movistar), asegurando cobertura en carretera y ciudades sin interrupciones."
	},
	{
		icon: CalendarCheck,
		title: "1 Año de Datos Sin Recargas",
		desc: "Olvídate de ir a pagar recargas mensuales a tiendas de conveniencia. Tu equipo incluye 12 meses continuos de servicio y línea de datos lista para operar."
	},
	{
		icon: Cpu,
		title: "Hardware Europeo Teltonika",
		desc: "Dispositivo 4G LTE Cat 1 con respaldo 2G, sensores de choque, aceleración brusca, detección de remolque en grúa y consumo eléctrico ultra bajo."
	},
	{
		icon: ShieldCheck,
		title: "Soporte y Garantía Directa",
		desc: "Asesoría personalizada en activación y configuración. Entrega sin costo en la ZMG de Guadalajara y envíos asegurados a toda la República Mexicana."
	}
];
function Index() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-20 pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "mx-auto grid max-w-6xl items-center gap-12 px-5 pt-8 lg:grid-cols-12 lg:pt-14",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RadioTower, { className: "size-4 animate-pulse" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 89,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Rastreo GPS Satelital 4G en México" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 90,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "mt-3 font-display text-4xl font-bold uppercase italic leading-[1.08] sm:text-6xl",
							children: [
								"Protege lo que",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 95,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-gradient-lime",
									children: "más te mueve"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 96,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 93,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-4 font-display text-lg uppercase tracking-wide text-foreground/90 sm:text-2xl",
							children: "La plataforma inteligente de monitoreo, seguridad y logística vehicular"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 99,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 h-1 w-24 bg-primary/70 rounded-full" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 103,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg",
							children: [
								"ORB-LITE te brinda",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-foreground",
									children: "ubicación satelital en tiempo real"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 107,
									columnNumber: 13
								}, this),
								",",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-foreground",
									children: "paro de motor a distancia"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 108,
									columnNumber: 13
								}, this),
								" y",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-foreground",
									children: "optimización de rutas de reparto"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 109,
									columnNumber: 13
								}, this),
								". Con hardware Teltonika 4G de grado automotriz y un año completo de datos multi-carrier incluido, mantén la custodia de tu auto personal, de tu flotilla de trabajo o de los clientes de tu taller sin complicaciones ni recargas mensuales."
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 105,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-8 flex flex-wrap items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/servicios",
									className: "inline-flex items-center gap-2 rounded-lg px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-lg transition hover:opacity-95",
									style: { background: "var(--gradient-lime)" },
									children: ["Conoce los servicios", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "size-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 120,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 116,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/demo",
									className: "inline-flex items-center gap-2 rounded-lg border border-primary/60 bg-card/40 px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary transition hover:bg-primary/10",
									children: "Solicitar demo gratis"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 122,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/tienda",
									className: "inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background/50 px-5 py-3 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:border-primary/50 hover:text-foreground",
									children: "Comprar equipo"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 125,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 115,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-8 flex flex-wrap items-center gap-6 border-t border-border/60 pt-6 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-1.5 font-medium text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "size-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 132,
										columnNumber: 15
									}, this), " 1 año de datos y plataforma incluidos"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 131,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-1.5 font-medium text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "size-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 135,
										columnNumber: 15
									}, this), " Sin plazos forzosos"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 134,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-1.5 font-medium text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "size-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 138,
										columnNumber: 15
									}, this), " Conectividad Multi-Carrier nacional"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 137,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 87,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-5",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "relative mx-auto max-w-md lg:max-w-none",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "absolute -inset-1 rounded-2xl opacity-40 blur-xl",
							style: { background: "var(--gradient-lime)" }
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 145,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "relative overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
								src: hero_gps_default,
								alt: "Plataforma de rastreo satelital ORB-LITE en tiempo real",
								width: 1280,
								height: 960,
								className: "w-full object-cover transition duration-300 hover:scale-[1.02]"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 149,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "p-4 border-t border-border/60 bg-card/95",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "size-2.5 rounded-full bg-emerald-500 animate-ping" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 153,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-xs font-semibold uppercase tracking-wider text-foreground",
											children: "Monitoreo activo"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 154,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 152,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs font-mono text-primary font-bold",
										children: "4G LTE · Wialon Engine"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 158,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 151,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Telemetría precisa con velocidad, ignición, odómetro y corte de marcha al instante."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 162,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 150,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 148,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 144,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 143,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 86,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "mx-auto max-w-6xl px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-display text-xs font-bold uppercase tracking-[0.25em] text-primary",
								children: "Capacidades del Sistema"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 175,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "mt-2 font-display text-3xl font-bold uppercase italic sm:text-4xl",
								children: ["Todo lo que puedes hacer ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-gradient-lime",
									children: "desde tu plataforma"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 179,
									columnNumber: 38
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 178,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-3 text-muted-foreground",
								children: "Diseñamos una interfaz ágil, moderna y en español que convierte datos de telemetría complejos en acciones sencillas para proteger tus unidades y optimizar cada viaje."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 181,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 174,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
						children: coreBenefits.map(({ icon: Icon, title, subtitle, text }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
							className: "group flex flex-col justify-between rounded-xl border border-border/70 bg-card/60 p-6 transition hover:border-primary/50 hover:bg-card/90 hover:shadow-lg",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "size-6" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 196,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 195,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "mt-4 font-display text-lg font-bold uppercase tracking-wide text-foreground",
									children: title
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 198,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-0.5 text-xs font-semibold text-primary/90",
									children: subtitle
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 201,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-3 text-sm leading-relaxed text-muted-foreground",
									children: text
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 202,
									columnNumber: 17
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 194,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-5 pt-3 border-t border-border/40 flex items-center text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Ver detalles de servicio" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 206,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "size-3.5 ml-1" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 207,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 205,
								columnNumber: 15
							}, this)]
						}, title, true, {
							fileName: _jsxFileName,
							lineNumber: 193,
							columnNumber: 15
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 187,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-8 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/servicios",
							className: "inline-flex items-center gap-2 rounded-lg border border-primary/50 bg-primary/5 px-6 py-3 font-display text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10 transition",
							children: "Explorar todas las funciones y especificaciones →"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 213,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 212,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 173,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "mx-auto max-w-6xl px-5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-center max-w-3xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "font-display text-xs font-bold uppercase tracking-[0.25em] text-primary",
							children: "Adaptabilidad Comprobada"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 222,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "mt-2 font-display text-3xl font-bold uppercase italic sm:text-4xl",
							children: ["Una solución hecha para ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-gradient-lime",
								children: "tu necesidad real"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 226,
								columnNumber: 37
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 225,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-3 text-sm text-muted-foreground sm:text-base",
							children: "Tanto si buscas cuidar el auto de tu familia, coordinar una flota comercial o incorporar rastreo a los servicios de tu taller, ORB-LITE te ofrece la modalidad exacta."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 228,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 221,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-10 grid gap-6 lg:grid-cols-3",
					children: audiences.map(({ icon: Icon, title, kicker, text, points, actionLink, actionLabel }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
						className: "flex flex-col justify-between rounded-2xl border border-primary/30 bg-card/60 p-7 shadow-sm transition hover:border-primary/70 hover:bg-card/80",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "size-5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 247,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 246,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-primary",
									children: kicker
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 250,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "font-display text-xl font-bold uppercase text-foreground",
									children: title
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 253,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 249,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 245,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-4 text-sm leading-relaxed text-muted-foreground",
								children: text
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 259,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
								className: "mt-5 space-y-2.5 text-xs text-foreground/90",
								children: points.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "size-4 shrink-0 text-primary mt-0.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 263,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: p }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 264,
										columnNumber: 23
									}, this)]
								}, p, true, {
									fileName: _jsxFileName,
									lineNumber: 262,
									columnNumber: 36
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 261,
								columnNumber: 17
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 244,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-7 pt-5 border-t border-border/60",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: actionLink,
								className: "flex items-center justify-center gap-2 w-full rounded-md bg-muted px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-foreground hover:bg-primary hover:text-primary-foreground transition",
								children: [actionLabel, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "size-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 272,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 270,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 269,
							columnNumber: 15
						}, this)]
					}, title, true, {
						fileName: _jsxFileName,
						lineNumber: 243,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 234,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 220,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "mx-auto max-w-6xl px-5",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-3xl border border-primary/40 bg-card/50 p-8 sm:p-12",
					style: { boxShadow: "var(--shadow-glow)" },
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid gap-10 lg:grid-cols-12 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "lg:col-span-5 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "rounded bg-primary/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-primary",
									children: "Cero Letras Pequeñas"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 286,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "font-display text-3xl font-bold uppercase italic sm:text-4xl text-foreground",
									children: [
										"Todo incluido desde el primer día:",
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-gradient-lime",
											children: "sin sorpresas"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 291,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 289,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm leading-relaxed text-muted-foreground",
									children: [
										"A diferencia de otras empresas de GPS que cobran rentas mensuales forzosas de $300 a $600 pesos o te obligan a firmar contratos por 24 meses, en ORB-LITE adquieres tu equipo con el",
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
											className: "text-foreground",
											children: "primer año completo de plataforma y SIM incluido"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 297,
											columnNumber: 17
										}, this),
										"."
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 293,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "rounded-xl border border-border/80 bg-background/60 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs font-semibold uppercase tracking-wider text-primary",
											children: "Costo de renovación anual transparente:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 303,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "mt-1 font-display text-xl font-bold text-foreground",
											children: "Plataforma $160 MXN/año · SIM $590 MXN/año"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 306,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												"O llévate el paquete completo de renovación por solo",
												" ",
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
													className: "text-primary",
													children: "$750 MXN al año"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 311,
													columnNumber: 19
												}, this),
												" (IVA incluido). Un promedio de solo ~$63 pesos al mes."
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 309,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 302,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "pt-2",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/tienda",
										className: "inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition shadow",
										children: ["Ver paquetes en tienda", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "size-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 318,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 316,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 315,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 285,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "lg:col-span-7 grid gap-4 sm:grid-cols-2",
							children: techPillars.map(({ icon: Icon, title, desc }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-xl border border-border/70 bg-card/70 p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "size-5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 330,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 329,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "mt-3 font-display text-base font-bold uppercase tracking-wide text-foreground",
										children: title
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 332,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-1 text-xs leading-relaxed text-muted-foreground",
										children: desc
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 335,
										columnNumber: 19
									}, this)
								]
							}, title, true, {
								fileName: _jsxFileName,
								lineNumber: 328,
								columnNumber: 19
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 323,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 284,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 281,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 280,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CtaBanner, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 343,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 84,
		columnNumber: 10
	}, this);
}
//#endregion
export { Index as component };
