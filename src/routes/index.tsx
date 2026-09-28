import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Power,
  Bell,
  RadioTower,
  ShieldCheck,
  CalendarCheck,
  HardHat,
  Store,
  Car,
  Truck,
  Route as RouteIcon,
  Navigation,
  FileSpreadsheet,
  Cpu,
  Video,
  Gauge,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Clock,
  Layers,
} from "lucide-react";

import heroImg from "@/assets/hero-gps.jpg";
import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ORB-LITE | Rastreo GPS Satelital en Tiempo Real para Autos, Flotas y Negocios" },
      {
        name: "description",
        content:
          "Descubre las bondades de la plataforma ORB-LITE: rastreo satelital en vivo, paro de motor remoto, optimización de rutas para Google Maps y Waze, alertas inmediatas y chip multi-carrier con 1 año de datos incluido.",
      },
      {
        property: "og:title",
        content: "ORB-LITE | Rastreo GPS Satelital en Tiempo Real para Autos, Flotas y Negocios",
      },
      {
        property: "og:description",
        content:
          "Protege tu vehículo, optimiza la logística de tu flota y ahorra combustible con la plataforma de rastreo GPS satelital más confiable de México.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/** Las 6 bondades clave de la plataforma ORB-LITE */
const coreBenefits = [
  {
    icon: MapPin,
    title: "Monitoreo en Vivo 24/7",
    subtitle: "Precisión satelital continua",
    text: "Visualiza la posición exacta de cada unidad minuto a minuto sobre mapas interactivos (OpenStreetMap, Satelital y Google Maps). Conoce velocidad real, si el motor está encendido o apagado, nivel de batería y satélites activos.",
  },
  {
    icon: Power,
    title: "Paro de Motor Remoto",
    subtitle: "Protección inmediata antirobo",
    text: "En caso de robo o uso no autorizado, envía la orden de apagado seguro directamente desde tu celular o computadora. El vehículo detiene la marcha mediante corte de combustible o ignición sin riesgo de daño eléctrico.",
  },
  {
    icon: RouteIcon,
    title: "Optimizador de Rutas Logísticas",
    subtitle: "Ahorra combustible y tiempo",
    text: "Planifica tus paradas de entrega y deja que la plataforma ordene la secuencia más rápida y económica. Exporta la ruta con un solo clic a Google Maps o Waze y comparte enlaces directos con tus conductores.",
  },
  {
    icon: Clock,
    title: "Historial de Recorridos y Viajes",
    subtitle: "Auditoría paso a paso",
    text: "Reproduce los trayectos realizados en cualquier fecha: consulta paradas realizadas, tiempos con motor encendido en ralentí, velocidades alcanzadas y kilometraje acumulado para evitar desvíos no autorizados.",
  },
  {
    icon: Bell,
    title: "Geocercas y Alertas al Instante",
    subtitle: "Notificaciones automáticas",
    text: "Dibuja zonas de seguridad (bodegas, clientes, talleres) y recibe alertas inmediatas cuando un vehículo entre o salga de ellas, si excede el límite de velocidad o si intentan desconectar la batería.",
  },
  {
    icon: FileSpreadsheet,
    title: "Reportes Ejecutivos en Excel",
    subtitle: "Datos listos para tomar decisiones",
    text: "Genera informes detallados y visuales en formato Excel con gráficos profesionales de distancias, horas de motor, excesos de velocidad y consumo estimado para respaldar la administración de tu negocio.",
  },
];

/** Segmentos de clientes parafraseados con claridad */
const audiences = [
  {
    icon: Car,
    title: "Uso Personal y Familiar",
    kicker: "Tranquilidad para tu patrimonio",
    text: "Diseñado para quien cuida su auto, camioneta o motocicleta. Si alguien mueve tu vehículo o intenta manipularlo, recibes una alerta inmediata y puedes apagar el motor al instante desde tu teléfono.",
    points: [
      "App móvil fácil de usar en iOS y Android",
      "Paro de motor seguro ante emergencias",
      "Alerta por desconexión de batería del auto",
      "1 año de servicio y datos incluido sin recargas",
    ],
    actionLink: "/tienda",
    actionLabel: "Ver equipo para auto",
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
      "Geocercas de almacenes, rutas y clientes",
    ],
    actionLink: "/demo",
    actionLabel: "Solicitar demo de flota",
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
      "Facturación fiscal mexicana (SAT) inmediata",
    ],
    actionLink: "/contacto",
    actionLabel: "Cotizar por mayoreo",
  },
];

/** Pilares tecnológicos */
const techPillars = [
  {
    icon: RadioTower,
    title: "Conectividad Multi-Carrier",
    desc: "El chip SIM incluido se enlaza automáticamente a la red con mejor señal (Telcel, AT&T o Movistar), asegurando cobertura en carretera y ciudades sin interrupciones.",
  },
  {
    icon: CalendarCheck,
    title: "1 Año de Datos Sin Recargas",
    desc: "Olvídate de ir a pagar recargas mensuales a tiendas de conveniencia. Tu equipo incluye 12 meses continuos de servicio y línea de datos lista para operar.",
  },
  {
    icon: Cpu,
    title: "Hardware Europeo Teltonika",
    desc: "Dispositivo 4G LTE Cat 1 con respaldo 2G, sensores de choque, aceleración brusca, detección de remolque en grúa y consumo eléctrico ultra bajo.",
  },
  {
    icon: ShieldCheck,
    title: "Soporte y Garantía Directa",
    desc: "Asesoría personalizada en activación y configuración. Entrega sin costo en la ZMG de Guadalajara y envíos asegurados a toda la República Mexicana.",
  },
];

function Index() {
  return (
    <div className="space-y-20 pb-10">
      {/* HERO SECTION */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-8 lg:grid-cols-12 lg:pt-14">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <RadioTower className="size-4 animate-pulse" />
            <span>Rastreo GPS Satelital 4G en México</span>
          </div>

          <h1 className="mt-3 font-display text-4xl font-bold uppercase italic leading-[1.08] sm:text-6xl">
            Protege lo que
            <br />
            <span className="text-gradient-lime">más te mueve</span>
          </h1>

          <p className="mt-4 font-display text-lg uppercase tracking-wide text-foreground/90 sm:text-2xl">
            La plataforma inteligente de monitoreo, seguridad y logística vehicular
          </p>

          <div className="mt-4 h-1 w-24 bg-primary/70 rounded-full" />

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            ORB-LITE te brinda <strong className="text-foreground">ubicación satelital en tiempo real</strong>,{" "}
            <strong className="text-foreground">paro de motor a distancia</strong> y{" "}
            <strong className="text-foreground">optimización de rutas de reparto</strong>. Con hardware Teltonika 4G de grado
            automotriz y un año completo de datos multi-carrier incluido, mantén la custodia de tu auto personal, de tu flotilla de
            trabajo o de los clientes de tu taller sin complicaciones ni recargas mensuales.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/servicios"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-lg transition hover:opacity-95"
              style={{ background: "var(--gradient-lime)" }}
            >
              Conoce los servicios
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/60 bg-card/40 px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary transition hover:bg-primary/10"
            >
              Solicitar demo gratis
            </Link>
            <Link
              to="/tienda"
              className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background/50 px-5 py-3 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
            >
              Comprar equipo
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-border/60 pt-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <CheckCircle2 className="size-4 text-primary" /> 1 año de datos y plataforma incluidos
            </span>
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <CheckCircle2 className="size-4 text-primary" /> Sin plazos forzosos
            </span>
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <CheckCircle2 className="size-4 text-primary" /> Conectividad Multi-Carrier nacional
            </span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div
              className="absolute -inset-1 rounded-2xl opacity-40 blur-xl"
              style={{ background: "var(--gradient-lime)" }}
            />
            <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-2xl">
              <img
                src={heroImg}
                alt="Plataforma de rastreo satelital ORB-LITE en tiempo real"
                width={1280}
                height={960}
                className="w-full object-cover transition duration-300 hover:scale-[1.02]"
              />
              <div className="p-4 border-t border-border/60 bg-card/95">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Monitoreo activo
                    </span>
                  </div>
                  <span className="text-xs font-mono text-primary font-bold">4G LTE · Wialon Engine</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Telemetría precisa con velocidad, ignición, odómetro y corte de marcha al instante.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BONDADES PRINCIPALES DE LA PLATAFORMA */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Capacidades del Sistema
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase italic sm:text-4xl">
            Todo lo que puedes hacer <span className="text-gradient-lime">desde tu plataforma</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Diseñamos una interfaz ágil, moderna y en español que convierte datos de telemetría complejos en acciones
            sencillas para proteger tus unidades y optimizar cada viaje.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coreBenefits.map(({ icon: Icon, title, subtitle, text }) => (
            <article
              key={title}
              className="group flex flex-col justify-between rounded-xl border border-border/70 bg-card/60 p-6 transition hover:border-primary/50 hover:bg-card/90 hover:shadow-lg"
            >
              <div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-wide text-foreground">
                  {title}
                </h3>
                <p className="mt-0.5 text-xs font-semibold text-primary/90">{subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-border/40 flex items-center text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                <span>Ver detalles de servicio</span>
                <ChevronRight className="size-3.5 ml-1" />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/servicios"
            className="inline-flex items-center gap-2 rounded-lg border border-primary/50 bg-primary/5 px-6 py-3 font-display text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10 transition"
          >
            Explorar todas las funciones y especificaciones →
          </Link>
        </div>
      </section>

      {/* SOLUCIONES A LA MEDIDA: PARA QUIÉN ES */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="text-center max-w-3xl mx-auto">
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Adaptabilidad Comprobada
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase italic sm:text-4xl">
            Una solución hecha para <span className="text-gradient-lime">tu necesidad real</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Tanto si buscas cuidar el auto de tu familia, coordinar una flota comercial o incorporar rastreo a los servicios de
            tu taller, ORB-LITE te ofrece la modalidad exacta.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {audiences.map(({ icon: Icon, title, kicker, text, points, actionLink, actionLabel }) => (
            <article
              key={title}
              className="flex flex-col justify-between rounded-2xl border border-primary/30 bg-card/60 p-7 shadow-sm transition hover:border-primary/70 hover:bg-card/80"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
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

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{text}</p>

                <ul className="mt-5 space-y-2.5 text-xs text-foreground/90">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 pt-5 border-t border-border/60">
                <Link
                  to={actionLink}
                  className="flex items-center justify-center gap-2 w-full rounded-md bg-muted px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-foreground hover:bg-primary hover:text-primary-foreground transition"
                >
                  {actionLabel}
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROPUESTA DE VALOR: POR QUÉ ORB-LITE */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="rounded-3xl border border-primary/40 bg-card/50 p-8 sm:p-12" style={{ boxShadow: "var(--shadow-glow)" }}>
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="rounded bg-primary/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-primary">
                Cero Letras Pequeñas
              </span>
              <h2 className="font-display text-3xl font-bold uppercase italic sm:text-4xl text-foreground">
                Todo incluido desde el primer día: <span className="text-gradient-lime">sin sorpresas</span>
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A diferencia de otras empresas de GPS que cobran rentas mensuales forzosas de $300 a $600 pesos o te obligan a
                firmar contratos por 24 meses, en ORB-LITE adquieres tu equipo con el{" "}
                <strong className="text-foreground">primer año completo de plataforma y SIM incluido</strong>.
              </p>
              <div className="rounded-xl border border-border/80 bg-background/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Costo de renovación anual transparente:
                </p>
                <p className="mt-1 font-display text-xl font-bold text-foreground">
                  Plataforma $160 MXN/año · SIM $590 MXN/año
                </p>
                <p className="text-xs text-muted-foreground">
                  O llévate el paquete completo de renovación por solo <strong className="text-primary">$750 MXN al año</strong>{" "}
                  (IVA incluido). Un promedio de solo ~$63 pesos al mes.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/tienda"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition shadow"
                >
                  Ver paquetes en tienda
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
              {techPillars.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-xl border border-border/70 bg-card/70 p-5">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold uppercase tracking-wide text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA DE CIERRE */}
      <CtaBanner />
    </div>
  );
}
