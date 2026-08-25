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
} from "lucide-react";

import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios de Rastreo GPS | ORB-LITE" },
      {
        name: "description",
        content:
          "Rastreo en tiempo real, paro de motor remoto, alertas inteligentes, historial de rutas y datos incluidos con 1 año renovable para vehículos y flotas.",
      },
      { property: "og:title", content: "Servicios de Rastreo GPS | ORB-LITE" },
      {
        property: "og:description",
        content:
          "Conoce nuestros servicios de rastreo GPS satelital: tiempo real, paro de motor, alertas y soporte con garantía.",
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
    text: "Ubicación exacta minuto a minuto desde tu smartphone (iOS / Android) o PC.",
  },
  {
    icon: Power,
    title: "Paro de Motor Remoto",
    text: "Apaga el vehículo a distancia desde la aplicación en caso de robo o emergencia.",
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    text: "Notificaciones inmediatas por desconexión de batería, encendido no autorizado o exceso de velocidad.",
  },
  {
    icon: RouteIcon,
    title: "Historial y Rutas",
    text: "Revisa recorridos pasados, paradas realizadas y hábitos de manejo.",
  },
  {
    icon: RadioTower,
    title: "CONECTIVIDAD MULTI CARRIER",
    text: "Conexión estable e ininterrumpida gracias a la red móvil de cobertura nacional; elige automáticamente la mejor señal disponible en cada momento.",
  },
  {
    icon: ShieldCheck,
    title: "Soporte y Garantía",
    text: "Asesoría especializada, garantía del equipo y respaldo real cuando lo necesitas.",
  },
];

const dataPerks = [
  { icon: InfinityIcon, title: "Sin recargas", text: "ni complicaciones" },
  { icon: CalendarCheck, title: "Vigencia 1 año", text: "renovable" },
  { icon: RefreshCw, title: "Renovables", text: "para que siempre estés conectado" },
  { icon: SignalHigh, title: "Conectividad", text: "garantizada en territorio nacional" },
];

const plans = [
  {
    icon: Car,
    name: "Vehículo particular",
    text: "Ideal para autos y motos personales. Rastreo en tiempo real, alertas y paro de motor.",
    items: ["1 equipo instalado", "App móvil y web", "Alertas configurables"],
  },
  {
    icon: Truck,
    name: "Flota comercial",
    text: "Control de unidades de trabajo con reportes de rutas y hábitos de manejo.",
    items: ["Multiunidad", "Historial y reportes", "Geocercas y velocidad"],
  },
];

const reasons = [
  {
    icon: HardHat,
    title: "Instalación Profesional",
    text: "Cableado limpio y discreto sin alterar la garantía ni el sistema eléctrico de tu auto.",
  },
  {
    icon: MonitorSmartphone,
    title: "Plataforma Ágil y Fácil de Usar",
    text: "Interfaz moderna, rápida y configurable para ti y tus unidades.",
  },
  {
    icon: Zap,
    title: "Respuesta Inmediata",
    text: "Control absoluto en la palma de tu mano, sin intermediarios.",
  },
];

function Servicios() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">Servicios</p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase italic sm:text-5xl">
          Rastreo GPS satelital <span className="text-gradient-lime">a tu medida</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Todo lo que necesitas para vigilar tu vehículo o tu flota las 24 horas del día, los 365
          días del año, con línea de datos incluida.
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
          Planes de <span className="text-gradient-lime">servicio</span>
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
          Pregunta por precios y paquetes vigentes.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="rounded-2xl border-2 border-primary/60 bg-card/50 p-7 sm:p-10">
          <p className="font-display text-2xl font-bold uppercase italic text-primary">
            ¡Ya no necesitas recargar!
          </p>
          <p className="mt-2 max-w-xl text-muted-foreground">
            El primer año de línea de datos celular va incluido con tu equipo.
          </p>
          <p className="font-display mt-5 text-3xl font-bold uppercase italic sm:text-4xl">1 año</p>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-primary">
            incluido · renovación: plataforma $350/año · SIM $550/año
          </p>
          <div className="mt-6">
            <Link
              to="/tienda"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Compra tu equipo con SIM
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
          ¿Por qué instalar <span className="text-gradient-lime">con nosotros?</span>
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
