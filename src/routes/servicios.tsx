import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Power,
  Bell,
  Route as RouteIcon,
  RadioTower,
  Infinity as InfinityIcon,
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
} from "lucide-react";

import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios de Rastreo GPS para Autos, Flotas y Negocios | ORB-LITE" },
      {
        name: "description",
        content:
          "Rastreo GPS satelital para uso personal, empresas con flotas y negocios: equipo OL-01, plataforma en tiempo real, SIM con datos, renovaciones y soporte técnico.",
      },
      {
        property: "og:title",
        content: "Servicios de Rastreo GPS para Autos, Flotas y Negocios | ORB-LITE",
      },
      {
        property: "og:description",
        content:
          "Equipo OL-01, plataforma, datos incluidos y soporte: rastreo GPS para personas, empresas y negocios.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Servicios,
});

const features = [
  {
    icon: MapPin,
    title: "Rastreo en Tiempo Real",
    text: "Ubicación exacta minuto a minuto desde tu smartphone o PC, para uno o varios vehículos.",
  },
  {
    icon: Power,
    title: "Paro de Motor Remoto",
    text: "Apaga el vehículo a distancia desde la app en caso de robo o uso no autorizado.",
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    text: "Notificaciones por desconexión de batería, encendido no autorizado o exceso de velocidad.",
  },
  {
    icon: RouteIcon,
    title: "Historial y Rutas",
    text: "Revisa recorridos, paradas y hábitos de manejo con reportes claros y descargables.",
  },
  {
    icon: RadioTower,
    title: "CONECTIVIDAD MULTI CARRIER",
    text: "Conexión estable e ininterrumpida gracias a la red móvil de cobertura nacional; elige automáticamente la mejor señal disponible en cada momento.",
  },
  {
    icon: ShieldCheck,
    title: "Soporte y Garantía",
    text: "Asesoría para configurar y usar la plataforma, garantía del equipo y respaldo real.",
  },
];

const dataPerks = [
  { icon: InfinityIcon, title: "Sin recargas", text: "ni complicaciones" },
  { icon: CalendarCheck, title: "Vigencia 1 año", text: "renovable" },
  { icon: RefreshCw, title: "Renovables", text: "renovación anual simple y económica" },
  { icon: SignalHigh, title: "Conectividad", text: "garantizada en territorio nacional" },
];

const plans = [
  {
    icon: Car,
    name: "Uso personal",
    text: "Para tu auto, camioneta o moto: tranquilidad para ti y tu familia con ubicación en tiempo real y paro de motor.",
    items: ["Equipo OL-01", "App móvil y web", "1 año de datos incluido"],
  },
  {
    icon: Truck,
    name: "Empresas y flotas",
    text: "Control de unidades de trabajo con reportes de rutas, geocercas y hábitos de manejo desde un solo panel.",
    items: ["Multiunidad", "Historial y reportes", "Soporte técnico"],
  },
  {
    icon: Store,
    name: "Negocios y mayoreo",
    text: "Suma el rastreo GPS a los servicios que ya ofreces o compra por volumen con mejores condiciones.",
    items: ["Precios especiales", "Envío consolidado", "Atención de cuenta"],
  },
];

const reasons = [
  {
    icon: HardHat,
    title: "Instalación flexible",
    text: "Instálalo con nosotros en Guadalajara, con tu taller de confianza o con tus propios técnicos: tú decides.",
  },
  {
    icon: MonitorSmartphone,
    title: "Plataforma lista para usar",
    text: "Interfaz moderna y configurable para empezar a monitorear desde el primer día.",
  },
  {
    icon: Zap,
    title: "Costo claro",
    text: "Precio único del equipo con un año incluido y renovación anual transparente de plataforma y SIM.",
  },
];

function Servicios() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Personas · Empresas · Negocios
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase italic sm:text-5xl">
          Rastreo GPS satelital <span className="text-gradient-lime">a tu medida</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Un mismo sistema para cuidar tu auto, controlar las unidades de tu empresa o sumar el
          servicio a tu negocio: equipo OL-01, plataforma, datos incluidos y respaldo técnico.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="font-display text-3xl font-bold uppercase italic text-primary">
          Características principales
        </h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-xl border border-border/70 bg-card/50 p-6">
              <Icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display font-bold uppercase tracking-wide">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="font-display text-3xl font-bold uppercase italic">
          Planes para <span className="text-gradient-lime">cada necesidad</span>
        </h2>
        <div className="mt-7 grid gap-5 lg:grid-cols-3">
          {plans.map(({ icon: Icon, name, text, items }) => (
            <article
              key={name}
              className="rounded-2xl border border-primary/40 bg-card/60 p-7"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              <Icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-display text-xl font-bold uppercase italic">{name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary">▸</span>
                    {i}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          Pregunta por paquetes individuales, planes multiunidad y condiciones por volumen.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="rounded-2xl border-2 border-primary/60 bg-card/50 p-7 sm:p-10">
          <p className="font-display text-2xl font-bold uppercase italic text-primary">
            ¡Ya no necesitas recargar!
          </p>
          <p className="mt-2 max-w-xl text-muted-foreground">
            El primer año de línea de datos celular va incluido con cada equipo.
          </p>
          <p className="font-display mt-5 text-3xl font-bold uppercase italic sm:text-4xl">1 año</p>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-primary">
            incluido · renovación: plataforma $406/año · SIM $580/año (IVA incluido)
          </p>

          <div className="mt-6">
            <Link
              to="/tienda"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Comprar equipo con SIM
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dataPerks.map(({ icon: Icon, title, text }) => (
              <div key={title} className="border-t border-border pt-4">
                <Icon className="h-7 w-7 text-primary" />
                <p className="mt-3 font-display text-sm font-bold uppercase tracking-wide">
                  {title}
                </p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="font-display text-3xl font-bold uppercase italic">
          ¿Por qué elegir <span className="text-gradient-lime">ORB-LITE?</span>
        </h2>
        <div className="mt-7 grid gap-6 sm:grid-cols-3">
          {reasons.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border-l-2 border-primary/70 pl-5">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-display font-bold uppercase tracking-wide">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
