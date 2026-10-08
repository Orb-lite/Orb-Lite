import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Power,
  Bell,
  Route as RouteIcon,
  RadioTower,
  CalendarCheck,
  RefreshCw,
  SignalHigh,
  HardHat,
  MonitorSmartphone,
  Zap,
  ShieldCheck,
  Truck,
  Car,
  Store,
  FileSpreadsheet,
  Clock,
  Navigation,
  Video,
  Cpu,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  Sliders,
  Compass,
} from "lucide-react";

import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      {
        title: "Servicios de Rastreo GPS y Telemetría Satelital | ORB-LITE México",
      },
      {
        name: "description",
        content:
          "Conoce a detalle las bondades y servicios de la plataforma ORB-LITE: rastreo satelital 4G en tiempo real, apagado de motor remoto, optimización de rutas para Google Maps y Waze, historial de viajes, geocercas, reportes en Excel y conectividad multi-carrier sin recargas.",
      },
      {
        property: "og:title",
        content: "Servicios de Rastreo GPS y Telemetría Satelital | ORB-LITE México",
      },
      {
        property: "og:description",
        content:
          "Solución telemática integral con hardware Teltonika 4G, plataforma en la nube y 1 año de datos incluido para particulares, flotas y empresas en todo México.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Servicios,
});

/** Las 8 bondades técnicas y operativas detalladas de la plataforma */
const coreServices = [
  {
    icon: MapPin,
    title: "1. Monitoreo Telemático en Tiempo Real",
    kicker: "Visibilidad satelital segundo a segundo",
    description:
      "La plataforma se actualiza de manera continua con la ubicación exacta de tus unidades. No solo ves un punto en el mapa: accedes a telemetría en vivo con velocidad real, rumbo de brújula, odómetro virtual acumulado y cantidad de satélites conectados.",
    details: [
      "Detección instantánea de ignición: sabe si el motor está encendido, apagado o en ralentí.",
      "Voltímetro en tiempo real: monitorea el voltaje de la batería del auto y de la batería de respaldo para prevenir quedarte sin marcha.",
      "Capas de mapas intercambiables: alterna entre OpenStreetMap para carga ligera, vista Satelital de alta resolución y Google Maps.",
      "Acceso multiplataforma: consulta desde cualquier smartphone (Android / iOS) o computadora.",
    ],
  },
  {
    icon: Power,
    title: "2. Paro de Motor Remoto Inteligente",
    kicker: "Seguridad activa ante robo o uso indebido",
    description:
      "En situaciones de emergencia, asalto o uso fuera de horario, puedes cortar la marcha del vehículo a distancia desde la aplicación o el portal web. La orden viaja de forma cifrada al rastreador, activando el relevador de corte de combustible o ignición.",
    details: [
      "Inmovilización efectiva: el motor se apaga y no vuelve a encender hasta que autorices la reactivación.",
      "Relevador automotriz de 12V/24V de grado industrial que protege la computadora y arnés del vehículo.",
      "Comando de reactivación inmediata una vez que la unidad ha sido recuperada y verificada.",
      "Tranquilidad total para conductores particulares y protección patrimonial para flotillas.",
    ],
  },
  {
    icon: RouteIcon,
    title: "3. Planeación y Optimización de Rutas",
    kicker: "Ahorra hasta un 30% en combustible y tiempo",
    description:
      "Diseñado especialmente para empresas con repartos o técnicos en campo. Ingresa múltiples paradas o direcciones y el algoritmo inteligente de ORB-LITE reorganiza la ruta calculando el orden más eficiente para recorrer menos kilómetros.",
    details: [
      "Exportación directa a Google Maps y Waze con un solo toque para que el chofer navegue sin complicaciones.",
      "Enlaces de ruta públicos y compartibles: envía la ruta al operador por WhatsApp sin necesidad de darle acceso a toda tu cuenta.",
      "Estimación precisa de kilometraje total y tiempo estimado de llegada.",
      "Evita tráfico innecesario, vueltas en falso y sobrecostos operativos.",
    ],
  },
  {
    icon: Clock,
    title: "4. Historial de Recorridos y Auditoría de Viajes",
    kicker: "Reproducción interactiva de cada trayecto",
    description:
      "Consulta el registro histórico de cualquier día, semana o mes. El sistema reproduce paso a paso los viajes realizados sobre el mapa, indicando la velocidad exacta en cada tramo y el tiempo transcurrido.",
    details: [
      "Detalle de paradas: hora exacta de llegada, tiempo detenido y dirección aproximada de cada parada.",
      "Control de tiempos en ralentí: identifica cuánto tiempo estuvo el vehículo con el clima y motor encendido sin avanzar.",
      "Trazado con código de colores según rangos de velocidad para detectar excesos fácilmente.",
      "Comprobación de entregas ante clientes y aclaración de quejas o incidentes viales.",
    ],
  },
  {
    icon: Bell,
    title: "5. Geocercas Perimetrales y Alertas Automáticas",
    kicker: "Supervisión automatizada sin estar pegado a la pantalla",
    description:
      "Delimita zonas de interés como bodegas, sucursales, domicilios de clientes o áreas de riesgo. El sistema vigila automáticamente cada unidad y te notifica de inmediato ante cualquier evento relevante.",
    details: [
      "Geocercas poligonales, circulares y de ruta sobre carreteras específicas.",
      "Notificaciones instantáneas de entrada y salida de cada geocerca programada.",
      "Alerta por desconexión o sabotaje de batería del auto (el GPS continúa operando con su batería interna).",
      "Alarma configurable de exceso de velocidad para promover una conducción segura.",
    ],
  },
  {
    icon: FileSpreadsheet,
    title: "6. Reportes Ejecutivos y Exportación a Excel",
    kicker: "Información estructurada para tu administración",
    description:
      "Transforma los datos de rastreo en reportes claros y descargables en formato Excel (.xlsx formateado con gráficas) o PDF. Ideal para auditorías internas, liquidación de viáticos y control de horas de trabajo.",
    details: [
      "Resumen de kilometraje acumulado por unidad, chofer o fecha.",
      "Reporte de viajes, horarios de primera ignición en la mañana y última en la noche.",
      "Estadísticas de excesos de velocidad y hábitos de manejo.",
      "Archivos compatibles con Excel, Google Sheets y sistemas ERP para cruce de información.",
    ],
  },
  {
    icon: Video,
    title: "7. Supervisión Oficial de Cámaras y Video (ORB-FULL)",
    kicker: "Videovigilancia móvil integrada con Wialon Hosting",
    description:
      "Para flotillas que cuentan con dashcams, MDVRs o cámaras de seguridad vehicular. La plataforma consulta de forma oficial las cámaras y canales configurados en cada unidad mediante la API certificada.",
    details: [
      "Detección oficial de canales y hardware mediante unit/get_video_settings.",
      "Acceso directo y seguro al visor oficial de Wialon Hosting (pestaña de video).",
      "Reproducción en vivo y descarga de grabaciones con respaldo seguro y control estricto de permisos.",
      "Soporte para equipos con cámaras frontales, de cabina, ADAS y DMS.",
    ],
  },
  {
    icon: RadioTower,
    title: "8. Conectividad Multi-Carrier Sin Recargas",
    kicker: "Siempre la mejor señal disponible en todo México",
    description:
      "Nuestros equipos incluyen una SIM card M2M multi-operador que se conecta de manera automática a la red celular de mayor potencia (Telcel, AT&T o Movistar), garantizando que el vehículo nunca pierda comunicación.",
    details: [
      "Sin recargas en tiendas de conveniencia: 1 año de datos incluido desde el primer día.",
      "Roaming nacional inteligente: conmutación transparente entre antenas celulares en autopistas y zonas remotas.",
      "Sin riesgo de que la línea se cancele o expire por falta de saldo.",
      "Renovación anual económica y sin contratos forzosos al concluir los 12 meses.",
    ],
  },
];

/** Especificaciones del Hardware Teltonika FTC927 */
const hardwareFeatures = [
  {
    title: "Tecnología 4G LTE Cat 1",
    desc: "Conexión veloz y moderna con compatibilidad de respaldo 2G para no perder cobertura en ninguna zona de México.",
  },
  {
    title: "Acelerómetro de 3 Ejes",
    desc: "Detecta accidentes o colisiones, frenadas bruscas, aceleraciones agresivas y movimiento por remolque o grúa.",
  },
  {
    title: "Batería Interna de Respaldo",
    desc: "Si un ladrón desconecta la batería del coche, el GPS sigue transmitiendo su ubicación y envía una alerta de sabotaje.",
  },
  {
    title: "Consumo Ultra Bajo (Sleep Mode)",
    desc: "Modo de ahorro de energía inteligente que evita que la batería del auto se descargue, incluso si no se usa por semanas.",
  },
  {
    title: "Fabricación Europea Homologada",
    desc: "Estándares automotrices de alta calidad (Teltonika), con tolerancia a altas temperaturas y vibraciones severas.",
  },
  {
    title: "Entradas/Salidas Digitales",
    desc: "Conexión a relevador para paro de motor y detección de botón de pánico, sensores de puerta o ignición física.",
  },
];

/** Planes y perfiles de cliente */
const audiencePlans = [
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
      "Opción de instalación profesional en Guadalajara o envío nacional",
    ],
    link: "/tienda",
    linkLabel: "Comprar para auto",
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
      "Disponibilidad en versiones ORB-LITE y ORB-FULL",
    ],
    link: "/demo",
    linkLabel: "Solicitar demo para flota",
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
      "Envíos consolidados a todo el territorio nacional",
    ],
    link: "/contacto",
    linkLabel: "Cotizar como instalador",
  },
];

/** Beneficios del esquema de datos */
const dataPerks = [
  { icon: SignalHigh, title: "Cobertura Nacional", text: "Conexión en toda la República Mexicana" },
  {
    icon: CalendarCheck,
    title: "1 Año de Datos",
    text: "Incluido con el equipo sin recargas mensuales",
  },
  {
    icon: RefreshCw,
    title: "Renovación Transparente",
    text: "Solo $160 plataforma y $590 SIM al año (IVA inc.)",
  },
  { icon: Zap, title: "Cero Plazos Forzosos", text: "Eres dueño del equipo desde el primer día" },
];

/** Preguntas frecuentes bien parafraseadas */
const faqs = [
  {
    q: "¿Qué sucede en caso de robo de mi vehículo?",
    a: "Abres tu aplicación o el portal web de ORB-LITE, localizas en tiempo real dónde se desplaza el auto y presionas el botón de Paro de Motor. El vehículo cortará la inyección de combustible o la marcha y no podrá volver a encender. Puedes compartir la ubicación exacta y el link de seguimiento con las autoridades policiacas para una recuperación inmediata.",
  },
  {
    q: "¿Por qué no tengo que hacer recargas mensuales en tiendas?",
    a: "A diferencia de rastreadores caseros que requieren que les compres saldo prepago cada mes, los equipos ORB-LITE incluyen una SIM card M2M para telemetría con 12 meses de datos activos. No te preocupas por cortes inesperados ni fechas de vencimiento durante todo un año.",
  },
  {
    q: "¿Cómo funciona el optimizador de rutas con Google Maps y Waze?",
    a: "En la pestaña de 'Rutas' de la plataforma agregas las paradas de entrega del día. El sistema calcula matemáticamente el trayecto más corto y ordenado para ahorrar gasolina. Luego, con un clic, abres la ruta calculada en Google Maps o Waze en el teléfono del chofer o le compartes un enlace directo de visualización.",
  },
  {
    q: "¿Puedo instalarlo yo mismo o en mi taller de confianza?",
    a: "Sí. El equipo Teltonika FTC927 utiliza conexiones estándar automotrices (positivo, tierra, ignición y relevador). Entregamos el diagrama de instalación claro y asistimos vía soporte técnico. Si te encuentras en Guadalajara (ZMG), ofrecemos instalación profesional directa.",
  },
  {
    q: "¿Qué costo tienen las renovaciones después del primer año?",
    a: "Nuestra política es de absoluta transparencia: la plataforma anual ORB-LITE cuesta solo $160 MXN y el chip anual de datos $590 MXN (IVA incluido). Si adquieres el paquete de renovación completa pagas solo $750 MXN al año, lo que representa solo ~$63 pesos al mes sin contratos forzosos.",
  },
];

function Servicios() {
  return (
    <div className="space-y-20 pb-12">
      {/* HEADER HERO DE SERVICIOS */}
      <section className="mx-auto max-w-6xl px-5 pt-8 sm:pt-14">
        <div className="max-w-3xl">
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Servicios y Soluciones Telemáticas
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase italic leading-tight sm:text-5xl">
            Tecnología satelital que protege tu vehículo y{" "}
            <span className="text-gradient-lime">optimiza cada kilómetro</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            ORB-LITE fusiona hardware europeo de grado industrial, conectividad celular
            multi-carrier sin recargas mensuales y una plataforma en la nube diseñada para responder
            en segundos ante cualquier eventualidad. Conoce a detalle cómo cada herramienta cuida tu
            inversión.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/tienda"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground shadow transition hover:opacity-90"
              style={{ background: "var(--gradient-lime)" }}
            >
              Ver equipos y precios
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/60 bg-card/40 px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary transition hover:bg-primary/10"
            >
              Solicitar demo gratuita
            </Link>
          </div>
        </div>
      </section>

      {/* LAS 8 BONDADES CLAVE DESGLOSADAS A PROFUNDIDAD */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Arquitectura de Funciones
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase italic sm:text-4xl">
            Bondades y módulos <span className="text-gradient-lime">de la plataforma</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Diseñamos cada función para resolver problemas reales: evitar robos, abatir el consumo
            de gasolina, auditar tiempos de entrega y tener certeza absoluta de la ubicación de cada
            unidad.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {coreServices.map(({ icon: Icon, title, kicker, description, details }) => (
            <article
              key={title}
              className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-7 shadow-sm transition hover:border-primary/50 hover:bg-card/80"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                      {kicker}
                    </span>
                    <h3 className="font-display text-xl font-bold uppercase text-foreground">
                      {title}
                    </h3>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>

                <div className="mt-5 space-y-2 border-t border-border/50 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Características destacadas:
                  </p>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {details.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 shrink-0 text-primary mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* HARDWARE TELTONIKA EUROPEO */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="rounded-3xl border border-primary/40 bg-card/60 p-8 sm:p-12">
          <div className="max-w-3xl">
            <span className="rounded bg-primary/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-primary">
              Hardware Homologado de Calidad
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase italic sm:text-4xl text-foreground">
              Rastreador Profesional <span className="text-gradient-lime">Teltonika FTC927 4G</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              No arriesgamos tu seguridad con rastreadores genéricos de baja calidad. Trabajamos con{" "}
              <strong className="text-foreground">Teltonika</strong>, fabricante europeo líder
              mundial en telemática, ofreciendo robustez comprobada bajo las condiciones más
              exigentes de temperatura, vibración y señal en México.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hardwareFeatures.map(({ title, desc }) => (
              <div key={title} className="rounded-xl border border-border/70 bg-background/50 p-5">
                <h3 className="font-display text-base font-bold uppercase tracking-wide text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARATIVA DE PLANES Y AUDIENCIAS */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="text-center max-w-3xl mx-auto">
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Soluciones para Cada Perfil
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase italic sm:text-4xl">
            Elige el plan ideal para <span className="text-gradient-lime">tu operación</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Ya sea que busques proteger un vehículo particular o equipar una flotilla de cientos de
            unidades, tenemos el esquema adecuado para ti.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {audiencePlans.map(({ icon: Icon, name, kicker, text, includes, link, linkLabel }) => (
            <article
              key={name}
              className="flex flex-col justify-between rounded-2xl border border-primary/40 bg-card/60 p-7 shadow-sm transition hover:border-primary hover:bg-card/80"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              <div>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold uppercase italic text-foreground">
                  {name}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {kicker}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>

                <div className="mt-6 border-t border-border/50 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                    El paquete incluye:
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                    {includes.map((i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 shrink-0 text-primary mt-0.5" />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  to={link}
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-3 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition shadow"
                >
                  {linkLabel}
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROPUESTA DE DATOS Y RENOVACIONES SIN ENGAÑOS */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="rounded-3xl border-2 border-primary/60 bg-card/60 p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Ahorro Real y Transparencia
              </span>
              <h2 className="font-display text-3xl font-bold uppercase italic sm:text-4xl text-foreground">
                ¡Dile adiós a las recargas y a las rentas caras!
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Otras empresas de rastreo te atan con contratos forzosos a 24 meses o te cobran
                rentas mensuales de $350 a $600 pesos (que terminan sumando hasta $7,200 pesos al
                año). En <strong className="text-foreground">ORB-LITE</strong> adquieres tu equipo
                con{" "}
                <strong className="text-primary">
                  1 año completo de servicio telemático y datos incluido
                </strong>
                .
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Y cuando termine tu primer año, renuevas a precio justo sin penalizaciones:
              </p>
              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                <div className="rounded-xl border border-border/80 bg-background/60 p-4">
                  <p className="font-display text-lg font-bold text-foreground">$160 MXN / año</p>
                  <p className="text-xs text-primary font-semibold">
                    Renovación Plataforma ORB-LITE
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Acceso a app móvil y web por 12 meses (IVA inc.)
                  </p>
                </div>
                <div className="rounded-xl border border-border/80 bg-background/60 p-4">
                  <p className="font-display text-lg font-bold text-foreground">$590 MXN / año</p>
                  <p className="text-xs text-primary font-semibold">Renovación Anual SIM M2M</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Línea de datos multi-carrier por 12 meses (IVA inc.)
                  </p>
                </div>
              </div>
              <p className="text-xs text-primary font-medium">
                * Paquete combinado de renovación anual completa (Plataforma + Chip) por solo{" "}
                <strong className="underline">$750 MXN al año</strong> (IVA incluido).
              </p>
            </div>

            <div className="lg:col-span-5 grid gap-4">
              {dataPerks.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 rounded-xl border border-border/60 bg-background/40 p-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase text-foreground">
                      {title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES BIEN PARAFRASEADAS */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="max-w-3xl">
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Resolvemos tus Dudas
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase italic sm:text-4xl">
            Preguntas Frecuentes <span className="text-gradient-lime">sobre el Servicio</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Todo lo que necesitas saber antes de contratar o adquirir tus equipos GPS.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-border/70 bg-card/50 p-6">
              <h3 className="flex items-start gap-2.5 font-display text-base font-bold uppercase tracking-wide text-foreground">
                <HelpCircle className="size-5 shrink-0 text-primary mt-0.5" />
                <span>{q}</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground pl-7">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BANNER FINAL */}
      <CtaBanner />
    </div>
  );
}
