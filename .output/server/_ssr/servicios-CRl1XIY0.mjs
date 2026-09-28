import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as CircleQuestionMark, A as MapPin, W as FileSpreadsheet, X as Clock, at as Car, c as Store, dt as ArrowRight, et as CircleCheck, g as RefreshCw, l as SignalHigh, lt as Bell, m as Route, o as Truck, r as Video, st as CalendarCheck, t as Zap, v as RadioTower, y as Power } from "../_libs/lucide-react.mjs";
import { t as CtaBanner } from "./site-chrome-DLgFUEGX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/servicios-CRl1XIY0.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/servicios.tsx?tsr-split=component";
/** Las 8 bondades técnicas y operativas detalladas de la plataforma */
var coreServices = [
	{
		icon: MapPin,
		title: "1. Monitoreo Telemático en Tiempo Real",
		kicker: "Visibilidad satelital segundo a segundo",
		description: "La plataforma se actualiza de manera continua con la ubicación exacta de tus unidades. No solo ves un punto en el mapa: accedes a telemetría en vivo con velocidad real, rumbo de brújula, odómetro virtual acumulado y cantidad de satélites conectados.",
		details: [
			"Detección instantánea de ignición: sabe si el motor está encendido, apagado o en ralentí.",
			"Voltímetro en tiempo real: monitorea el voltaje de la batería del auto y de la batería de respaldo para prevenir quedarte sin marcha.",
			"Capas de mapas intercambiables: alterna entre OpenStreetMap para carga ligera, vista Satelital de alta resolución y Google Maps.",
			"Acceso multiplataforma: consulta desde cualquier smartphone (Android / iOS) o computadora."
		]
	},
	{
		icon: Power,
		title: "2. Paro de Motor Remoto Inteligente",
		kicker: "Seguridad activa ante robo o uso indebido",
		description: "En situaciones de emergencia, asalto o uso fuera de horario, puedes cortar la marcha del vehículo a distancia desde la aplicación o el portal web. La orden viaja de forma cifrada al rastreador, activando el relevador de corte de combustible o ignición.",
		details: [
			"Inmovilización efectiva: el motor se apaga y no vuelve a encender hasta que autorices la reactivación.",
			"Relevador automotriz de 12V/24V de grado industrial que protege la computadora y arnés del vehículo.",
			"Comando de reactivación inmediata una vez que la unidad ha sido recuperada y verificada.",
			"Tranquilidad total para conductores particulares y protección patrimonial para flotillas."
		]
	},
	{
		icon: Route,
		title: "3. Planeación y Optimización de Rutas",
		kicker: "Ahorra hasta un 30% en combustible y tiempo",
		description: "Diseñado especialmente para empresas con repartos o técnicos en campo. Ingresa múltiples paradas o direcciones y el algoritmo inteligente de ORB-LITE reorganiza la ruta calculando el orden más eficiente para recorrer menos kilómetros.",
		details: [
			"Exportación directa a Google Maps y Waze con un solo toque para que el chofer navegue sin complicaciones.",
			"Enlaces de ruta públicos y compartibles: envía la ruta al operador por WhatsApp sin necesidad de darle acceso a toda tu cuenta.",
			"Estimación precisa de kilometraje total y tiempo estimado de llegada.",
			"Evita tráfico innecesario, vueltas en falso y sobrecostos operativos."
		]
	},
	{
		icon: Clock,
		title: "4. Historial de Recorridos y Auditoría de Viajes",
		kicker: "Reproducción interactiva de cada trayecto",
		description: "Consulta el registro histórico de cualquier día, semana o mes. El sistema reproduce paso a paso los viajes realizados sobre el mapa, indicando la velocidad exacta en cada tramo y el tiempo transcurrido.",
		details: [
			"Detalle de paradas: hora exacta de llegada, tiempo detenido y dirección aproximada de cada parada.",
			"Control de tiempos en ralentí: identifica cuánto tiempo estuvo el vehículo con el clima y motor encendido sin avanzar.",
			"Trazado con código de colores según rangos de velocidad para detectar excesos fácilmente.",
			"Comprobación de entregas ante clientes y aclaración de quejas o incidentes viales."
		]
	},
	{
		icon: Bell,
		title: "5. Geocercas Perimetrales y Alertas Automáticas",
		kicker: "Supervisión automatizada sin estar pegado a la pantalla",
		description: "Delimita zonas de interés como bodegas, sucursales, domicilios de clientes o áreas de riesgo. El sistema vigila automáticamente cada unidad y te notifica de inmediato ante cualquier evento relevante.",
		details: [
			"Geocercas poligonales, circulares y de ruta sobre carreteras específicas.",
			"Notificaciones instantáneas de entrada y salida de cada geocerca programada.",
			"Alerta por desconexión o sabotaje de batería del auto (el GPS continúa operando con su batería interna).",
			"Alarma configurable de exceso de velocidad para promover una conducción segura."
		]
	},
	{
		icon: FileSpreadsheet,
		title: "6. Reportes Ejecutivos y Exportación a Excel",
		kicker: "Información estructurada para tu administración",
		description: "Transforma los datos de rastreo en reportes claros y descargables en formato Excel (.xlsx formateado con gráficas) o PDF. Ideal para auditorías internas, liquidación de viáticos y control de horas de trabajo.",
		details: [
			"Resumen de kilometraje acumulado por unidad, chofer o fecha.",
			"Reporte de viajes, horarios de primera ignición en la mañana y última en la noche.",
			"Estadísticas de excesos de velocidad y hábitos de manejo.",
			"Archivos compatibles con Excel, Google Sheets y sistemas ERP para cruce de información."
		]
	},
	{
		icon: Video,
		title: "7. Supervisión Oficial de Cámaras y Video (ORB-FULL)",
		kicker: "Videovigilancia móvil integrada con Wialon Hosting",
		description: "Para flotillas que cuentan con dashcams, MDVRs o cámaras de seguridad vehicular. La plataforma consulta de forma oficial las cámaras y canales configurados en cada unidad mediante la API certificada.",
		details: [
			"Detección oficial de canales y hardware mediante unit/get_video_settings.",
			"Acceso directo y seguro al visor oficial de Wialon Hosting (pestaña de video).",
			"Reproducción en vivo y descarga de grabaciones con respaldo seguro y control estricto de permisos.",
			"Soporte para equipos con cámaras frontales, de cabina, ADAS y DMS."
		]
	},
	{
		icon: RadioTower,
		title: "8. Conectividad Multi-Carrier Sin Recargas",
		kicker: "Siempre la mejor señal disponible en todo México",
		description: "Nuestros equipos incluyen una SIM card M2M multi-operador que se conecta de manera automática a la red celular de mayor potencia (Telcel, AT&T o Movistar), garantizando que el vehículo nunca pierda comunicación.",
		details: [
			"Sin recargas en tiendas de conveniencia: 1 año de datos incluido desde el primer día.",
			"Roaming nacional inteligente: conmutación transparente entre antenas celulares en autopistas y zonas remotas.",
			"Sin riesgo de que la línea se cancele o expire por falta de saldo.",
			"Renovación anual económica y sin contratos forzosos al concluir los 12 meses."
		]
	}
];
/** Especificaciones del Hardware Teltonika FTC927 */
var hardwareFeatures = [
	{
		title: "Tecnología 4G LTE Cat 1",
		desc: "Conexión veloz y moderna con compatibilidad de respaldo 2G para no perder cobertura en ninguna zona de México."
	},
	{
		title: "Acelerómetro de 3 Ejes",
		desc: "Detecta accidentes o colisiones, frenadas bruscas, aceleraciones agresivas y movimiento por remolque o grúa."
	},
	{
		title: "Batería Interna de Respaldo",
		desc: "Si un ladrón desconecta la batería del coche, el GPS sigue transmitiendo su ubicación y envía una alerta de sabotaje."
	},
	{
		title: "Consumo Ultra Bajo (Sleep Mode)",
		desc: "Modo de ahorro de energía inteligente que evita que la batería del auto se descargue, incluso si no se usa por semanas."
	},
	{
		title: "Fabricación Europea Homologada",
		desc: "Estándares automotrices de alta calidad (Teltonika), con tolerancia a altas temperaturas y vibraciones severas."
	},
	{
		title: "Entradas/Salidas Digitales",
		desc: "Conexión a relevador para paro de motor y detección de botón de pánico, sensores de puerta o ignición física."
	}
];
/** Planes y perfiles de cliente */
var audiencePlans = [
	{
		icon: Car,
		name: "Uso Personal y Familiar",
		kicker: "Tu patrimonio y tu familia protegidos",
		text: "Pensado para autos particulares, camionetas familiares y motocicletas. Monitorea desde tu celular cuándo salen tus hijos, dónde está estacionado el coche y apágalo al instante si intentan robarlo.",
		includes: [
			"Rastreador GPS Teltonika 4G LTE Cat 1",
			"1 año completo de plataforma móvil y web",
			"SIM multi-carrier con 1 año de datos incluido",
			"Paro de motor seguro con relevador automotriz",
			"Opción de instalación profesional en Guadalajara o envío nacional"
		],
		link: "/tienda",
		linkLabel: "Comprar para auto"
	},
	{
		icon: Truck,
		name: "Empresas y Flotillas",
		kicker: "Eficiencia logística y reducción de gastos",
		text: "Ideal para empresas con unidades de reparto, servicio técnico, transporte de carga o vehículos utilitarios. Centraliza la operación, reduce gastos de combustible y audita horarios de tus trabajadores.",
		includes: [
			"Panel de control multiunidad en tiempo real",
			"Optimizador de rutas con exportación a Waze y Google Maps",
			"Geocercas de clientes, CEDIS y almacenes",
			"Reportes de rendimiento y excesos de velocidad en Excel",
			"Disponibilidad en versiones ORB-LITE y ORB-FULL"
		],
		link: "/demo",
		linkLabel: "Solicitar demo para flota"
	},
	{
		icon: Store,
		name: "Instaladores y Negocios B2B",
		kicker: "Venta por mayoreo y equipamiento para talleres",
		text: "Para talleres mecánicos, autoeléctricos, instaladores independientes y empresas de seguridad privada que desean comercializar rastreo satelital con excelente margen y respaldo.",
		includes: [
			"Precios preferenciales por volumen y paquetes",
			"Opciones de compra: solo equipo, con SIM o con plataforma",
			"Soporte técnico directo de ingeniería para activación",
			"Facturación fiscal inmediata con desglose de IVA (SAT)",
			"Envíos consolidados a todo el territorio nacional"
		],
		link: "/contacto",
		linkLabel: "Cotizar como instalador"
	}
];
/** Beneficios del esquema de datos */
var dataPerks = [
	{
		icon: SignalHigh,
		title: "Cobertura Nacional",
		text: "Conexión en toda la República Mexicana"
	},
	{
		icon: CalendarCheck,
		title: "1 Año de Datos",
		text: "Incluido con el equipo sin recargas mensuales"
	},
	{
		icon: RefreshCw,
		title: "Renovación Transparente",
		text: "Solo $160 plataforma y $590 SIM al año (IVA inc.)"
	},
	{
		icon: Zap,
		title: "Cero Plazos Forzosos",
		text: "Eres dueño del equipo desde el primer día"
	}
];
/** Preguntas frecuentes bien parafraseadas */
var faqs = [
	{
		q: "¿Qué sucede en caso de robo de mi vehículo?",
		a: "Abres tu aplicación o el portal web de ORB-LITE, localizas en tiempo real dónde se desplaza el auto y presionas el botón de Paro de Motor. El vehículo cortará la inyección de combustible o la marcha y no podrá volver a encender. Puedes compartir la ubicación exacta y el link de seguimiento con las autoridades policiacas para una recuperación inmediata."
	},
	{
		q: "¿Por qué no tengo que hacer recargas mensuales en tiendas?",
		a: "A diferencia de rastreadores caseros que requieren que les compres saldo prepago cada mes, los equipos ORB-LITE incluyen una SIM card M2M para telemetría con 12 meses de datos activos. No te preocupas por cortes inesperados ni fechas de vencimiento durante todo un año."
	},
	{
		q: "¿Cómo funciona el optimizador de rutas con Google Maps y Waze?",
		a: "En la pestaña de 'Rutas' de la plataforma agregas las paradas de entrega del día. El sistema calcula matemáticamente el trayecto más corto y ordenado para ahorrar gasolina. Luego, con un clic, abres la ruta calculada en Google Maps o Waze en el teléfono del chofer o le compartes un enlace directo de visualización."
	},
	{
		q: "¿Puedo instalarlo yo mismo o en mi taller de confianza?",
		a: "Sí. El equipo Teltonika FTC927 utiliza conexiones estándar automotrices (positivo, tierra, ignición y relevador). Entregamos el diagrama de instalación claro y asistimos vía soporte técnico. Si te encuentras en Guadalajara (ZMG), ofrecemos instalación profesional directa."
	},
	{
		q: "¿Qué costo tienen las renovaciones después del primer año?",
		a: "Nuestra política es de absoluta transparencia: la plataforma anual ORB-LITE cuesta solo $160 MXN y el chip anual de datos $590 MXN (IVA incluido). Si adquieres el paquete de renovación completa pagas solo $750 MXN al año, lo que representa solo ~$63 pesos al mes sin contratos forzosos."
	}
];
function Servicios() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-20 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "mx-auto max-w-6xl px-5 pt-8 sm:pt-14",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "font-display text-xs font-bold uppercase tracking-[0.3em] text-primary",
							children: "Servicios y Soluciones Telemáticas"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 144,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "mt-3 font-display text-4xl font-bold uppercase italic leading-tight sm:text-5xl",
							children: [
								"Tecnología satelital que protege tu vehículo y",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-gradient-lime",
									children: "optimiza cada kilómetro"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 149,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 147,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg",
							children: "ORB-LITE fusiona hardware europeo de grado industrial, conectividad celular multi-carrier sin recargas mensuales y una plataforma en la nube diseñada para responder en segundos ante cualquier eventualidad. Conoce a detalle cómo cada herramienta cuida tu inversión."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 151,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-8 flex flex-wrap gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/tienda",
								className: "inline-flex items-center gap-2 rounded-lg px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground shadow transition hover:opacity-90",
								style: { background: "var(--gradient-lime)" },
								children: ["Ver equipos y precios", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "size-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 162,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 158,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/demo",
								className: "inline-flex items-center gap-2 rounded-lg border border-primary/60 bg-card/40 px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary transition hover:bg-primary/10",
								children: "Solicitar demo gratuita"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 164,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 157,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 143,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 142,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "mx-auto max-w-6xl px-5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-display text-xs font-bold uppercase tracking-[0.25em] text-primary",
							children: "Arquitectura de Funciones"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 174,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "mt-2 font-display text-3xl font-bold uppercase italic sm:text-4xl",
							children: ["Bondades y módulos ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-gradient-lime",
								children: "de la plataforma"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 178,
								columnNumber: 32
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 177,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-3 text-sm text-muted-foreground sm:text-base",
							children: "Diseñamos cada función para resolver problemas reales: evitar robos, abatir el consumo de gasolina, auditar tiempos de entrega y tener certeza absoluta de la ubicación de cada unidad."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 180,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 173,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-10 grid gap-8 md:grid-cols-2",
					children: coreServices.map(({ icon: Icon, title, kicker, description, details }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
						className: "flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-7 shadow-sm transition hover:border-primary/50 hover:bg-card/80",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "size-6" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 198,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 197,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-primary",
									children: kicker
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 201,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "font-display text-xl font-bold uppercase text-foreground",
									children: title
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 204,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 200,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 196,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-4 text-sm leading-relaxed text-muted-foreground",
								children: description
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 210,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-5 space-y-2 border-t border-border/50 pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs font-bold uppercase tracking-wider text-foreground",
									children: "Características destacadas:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 213,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
									className: "space-y-2 text-xs text-muted-foreground",
									children: details.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "size-3.5 shrink-0 text-primary mt-0.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 218,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: item }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 219,
											columnNumber: 25
										}, this)]
									}, item, true, {
										fileName: _jsxFileName,
										lineNumber: 217,
										columnNumber: 42
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 216,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 212,
								columnNumber: 17
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 195,
							columnNumber: 15
						}, this)
					}, title, false, {
						fileName: _jsxFileName,
						lineNumber: 194,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 187,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 172,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "mx-auto max-w-6xl px-5",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-3xl border border-primary/40 bg-card/60 p-8 sm:p-12",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "max-w-3xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "rounded bg-primary/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-primary",
								children: "Hardware Homologado de Calidad"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 232,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "mt-3 font-display text-3xl font-bold uppercase italic sm:text-4xl text-foreground",
								children: ["Rastreador Profesional ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-gradient-lime",
									children: "Teltonika FTC927 4G"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 236,
									columnNumber: 38
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 235,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base",
								children: [
									"No arriesgamos tu seguridad con rastreadores genéricos de baja calidad. Trabajamos con",
									" ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
										className: "text-foreground",
										children: "Teltonika"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 240,
										columnNumber: 15
									}, this),
									", fabricante europeo líder mundial en telemática, ofreciendo robustez comprobada bajo las condiciones más exigentes de temperatura, vibración y señal en México."
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 238,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 231,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: hardwareFeatures.map(({ title, desc }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-xl border border-border/70 bg-background/50 p-5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "font-display text-base font-bold uppercase tracking-wide text-foreground",
								children: title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 251,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-2 text-xs leading-relaxed text-muted-foreground",
								children: desc
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 254,
								columnNumber: 17
							}, this)]
						}, title, true, {
							fileName: _jsxFileName,
							lineNumber: 250,
							columnNumber: 17
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 246,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 230,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 229,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "mx-auto max-w-6xl px-5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-center max-w-3xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "font-display text-xs font-bold uppercase tracking-[0.25em] text-primary",
							children: "Soluciones para Cada Perfil"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 263,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "mt-2 font-display text-3xl font-bold uppercase italic sm:text-4xl",
							children: ["Elige el plan ideal para ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-gradient-lime",
								children: "tu operación"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 267,
								columnNumber: 38
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 266,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-3 text-sm text-muted-foreground sm:text-base",
							children: "Ya sea que busques proteger un vehículo particular o equipar una flotilla de cientos de unidades, tenemos el esquema adecuado para ti."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 269,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 262,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-10 grid gap-6 lg:grid-cols-3",
					children: audiencePlans.map(({ icon: Icon, name, kicker, text, includes, link, linkLabel }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
						className: "flex flex-col justify-between rounded-2xl border border-primary/40 bg-card/60 p-7 shadow-sm transition hover:border-primary hover:bg-card/80",
						style: { boxShadow: "var(--shadow-glow)" },
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "size-6" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 289,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 288,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "mt-4 font-display text-2xl font-bold uppercase italic text-foreground",
								children: name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 291,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-primary",
								children: kicker
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 294,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-3 text-sm leading-relaxed text-muted-foreground",
								children: text
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 297,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-6 border-t border-border/50 pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs font-bold uppercase tracking-wider text-foreground",
									children: "El paquete incluye:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 300,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
									className: "mt-3 space-y-2 text-xs text-muted-foreground",
									children: includes.map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "size-3.5 shrink-0 text-primary mt-0.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 305,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: i }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 306,
											columnNumber: 25
										}, this)]
									}, i, true, {
										fileName: _jsxFileName,
										lineNumber: 304,
										columnNumber: 40
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 303,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 299,
								columnNumber: 17
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 287,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-8 pt-4",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: link,
								className: "flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-3 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition shadow",
								children: [linkLabel, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "size-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 315,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 313,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 312,
							columnNumber: 15
						}, this)]
					}, name, true, {
						fileName: _jsxFileName,
						lineNumber: 284,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 275,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 261,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "mx-auto max-w-6xl px-5",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-3xl border-2 border-primary/60 bg-card/60 p-8 sm:p-12",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid gap-8 lg:grid-cols-12 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "lg:col-span-7 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-display text-xs font-bold uppercase tracking-[0.25em] text-primary",
									children: "Ahorro Real y Transparencia"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 327,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "font-display text-3xl font-bold uppercase italic sm:text-4xl text-foreground",
									children: "¡Dile adiós a las recargas y a las rentas caras!"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 330,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-base text-muted-foreground leading-relaxed",
									children: [
										"Otras empresas de rastreo te atan con contratos forzosos a 24 meses o te cobran rentas mensuales de $350 a $600 pesos (que terminan sumando hasta $7,200 pesos al año). En ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
											className: "text-foreground",
											children: "ORB-LITE"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 336,
											columnNumber: 26
										}, this),
										" adquieres tu equipo con",
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
											className: "text-primary",
											children: "1 año completo de servicio telemático y datos incluido"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 338,
											columnNumber: 17
										}, this),
										"."
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 333,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm text-muted-foreground leading-relaxed",
									children: "Y cuando termine tu primer año, renuevas a precio justo sin penalizaciones:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 343,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid gap-3 sm:grid-cols-2 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "rounded-xl border border-border/80 bg-background/60 p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "font-display text-lg font-bold text-foreground",
												children: "$160 MXN / año"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 348,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-xs text-primary font-semibold",
												children: "Renovación Plataforma ORB-LITE"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 349,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-[11px] text-muted-foreground mt-1",
												children: "Acceso a app móvil y web por 12 meses (IVA inc.)"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 352,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 347,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "rounded-xl border border-border/80 bg-background/60 p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "font-display text-lg font-bold text-foreground",
												children: "$590 MXN / año"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 357,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-xs text-primary font-semibold",
												children: "Renovación Anual SIM M2M"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 358,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-[11px] text-muted-foreground mt-1",
												children: "Línea de datos multi-carrier por 12 meses (IVA inc.)"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 359,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 356,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 346,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-primary font-medium",
									children: [
										"* Paquete combinado de renovación anual completa (Plataforma + Chip) por solo",
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
											className: "underline",
											children: "$750 MXN al año"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 366,
											columnNumber: 17
										}, this),
										" (IVA incluido)."
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 364,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 326,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "lg:col-span-5 grid gap-4",
							children: dataPerks.map(({ icon: Icon, title, text }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-4 rounded-xl border border-border/60 bg-background/40 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "size-5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 377,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 376,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "font-display text-sm font-bold uppercase text-foreground",
									children: title
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 380,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground",
									children: text
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 383,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 379,
									columnNumber: 19
								}, this)]
							}, title, true, {
								fileName: _jsxFileName,
								lineNumber: 375,
								columnNumber: 19
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 370,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 325,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 324,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 323,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "mx-auto max-w-6xl px-5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "font-display text-xs font-bold uppercase tracking-[0.25em] text-primary",
							children: "Resolvemos tus Dudas"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 394,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "mt-2 font-display text-3xl font-bold uppercase italic sm:text-4xl",
							children: ["Preguntas Frecuentes ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-gradient-lime",
								children: "sobre el Servicio"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 398,
								columnNumber: 34
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 397,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: "Todo lo que necesitas saber antes de contratar o adquirir tus equipos GPS."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 400,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 393,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-8 space-y-4",
					children: faqs.map(({ q, a }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-xl border border-border/70 bg-card/50 p-6",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "flex items-start gap-2.5 font-display text-base font-bold uppercase tracking-wide text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleQuestionMark, { className: "size-5 shrink-0 text-primary mt-0.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 411,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: q }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 412,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 410,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground pl-7",
							children: a
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 414,
							columnNumber: 15
						}, this)]
					}, q, true, {
						fileName: _jsxFileName,
						lineNumber: 409,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 405,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 392,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CtaBanner, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 420,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 140,
		columnNumber: 10
	}, this);
}
//#endregion
export { Servicios as component };
