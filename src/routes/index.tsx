import { createFileRoute } from "@tanstack/react-router";
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
  Users,
  Lock,
  Send,
} from "lucide-react";

import logo from "@/assets/orb-lite-logo.jpeg.asset.json";
import heroImg from "@/assets/hero-gps.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ORB-LITE | Rastreo GPS Satelital en Tiempo Real" },
      {
        name: "description",
        content:
          "Rastreo GPS satelital para tu vehículo o flota: ubicación en tiempo real, paro de motor remoto, alertas y datos incluidos hasta 5 años.",
      },
      { property: "og:title", content: "ORB-LITE | Rastreo GPS Satelital" },
      {
        property: "og:description",
        content:
          "Protege lo que más quieres con rastreo GPS en tiempo real 24/7. Instalación profesional y datos incluidos hasta 5 años.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
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
    title: "Conectividad Multirred",
    text: "Transmisión continua sin interrupciones gracias a la red móvil de cobertura nacional.",
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
    text: "Interfaz moderna, rápida y configurable para ti y tu familia.",
  },
  {
    icon: Zap,
    title: "Respuesta Inmediata",
    text: "Control absoluto en la palma de tu mano, sin intermediarios.",
  },
  {
    icon: ShieldCheck,
    title: "Soporte y Garantía",
    text: "Asesoría especializada, garantía y respaldo real.",
  },
];

const dataPerks = [
  { icon: InfinityIcon, title: "Sin recargas", text: "ni complicaciones" },
  { icon: CalendarCheck, title: "Vigencia hasta 5 años", text: "ininterrumpidos" },
  { icon: RefreshCw, title: "Renovables", text: "para que siempre estés conectado" },
  { icon: SignalHigh, title: "Conectividad", text: "garantizada en territorio nacional" },
];

function Index() {
  return (
    <div className="min-h-screen surface-deep">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <img src={logo.url} alt="ORB-LITE rastreo GPS satelital" className="h-14 w-auto rounded-md" />
        <a
          href="#contacto"
          className="rounded-md px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground"
          style={{ background: "var(--gradient-lime)" }}
        >
          Solicitar instalación
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-6 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase italic leading-[1.05] sm:text-6xl">
            Protege
            <br />
            <span className="text-gradient-lime">lo que más quieres</span>
          </h1>
          <p className="mt-3 font-display text-lg uppercase tracking-wide text-muted-foreground sm:text-2xl">
            con rastreo GPS satelital
          </p>
          <div className="mt-4 h-px w-40 bg-primary/60" />
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Tecnología de localización en <strong className="text-primary">tiempo real</strong> para tu
            vehículo o flota. Mantén el <strong className="text-foreground">control total</strong> desde
            tu celular, las 24 horas del día, los 365 días del año.
          </p>

          <div className="mt-7 flex gap-4">
            {["24/7", "365"].map((t) => (
              <div
                key={t}
                className="rounded-lg border border-primary/40 bg-card/60 px-6 py-3 font-display text-2xl font-bold text-primary"
              >
                {t}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-5 text-sm">
            {[
              { icon: ShieldCheck, label: "Tu vehículo" },
              { icon: Users, label: "Tu familia" },
              { icon: Lock, label: "Tu tranquilidad" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 uppercase tracking-widest">
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <img
          src={heroImg}
          alt="Aplicación de rastreo GPS mostrando un vehículo en movimiento sobre el mapa"
          width={1280}
          height={960}
          className="w-full rounded-2xl border border-border/60"
          style={{ boxShadow: "var(--shadow-glow)" }}
        />
      </section>

      {/* Datos incluidos */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="rounded-2xl border-2 border-primary/60 bg-card/50 p-7 sm:p-10">
          <p className="font-display text-2xl font-bold uppercase italic text-primary">
            ¡Ya no ocupas recargar!
          </p>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Cuenta con línea de datos celular incluida con vigencia de hasta
          </p>
          <p className="font-display text-5xl font-bold uppercase italic text-foreground sm:text-6xl">
            5 años
          </p>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-primary">
            ininterrumpidos y renovables
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dataPerks.map(({ icon: Icon, title, text }) => (
              <div key={title} className="border-t border-border pt-4">
                <Icon className="h-7 w-7 text-primary" />
                <p className="mt-3 font-display text-sm font-bold uppercase tracking-wide">{title}</p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Una sola instalación, conexión por años.{" "}
            <span className="text-primary">Tranquilidad total.</span>
          </p>
        </div>
      </section>

      {/* Características + por qué */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold uppercase italic text-primary sm:text-4xl">
            Características principales
          </h2>
          <ul className="mt-7 space-y-4">
            {features.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex gap-4 rounded-xl border border-border/70 bg-card/50 p-5"
              >
                <Icon className="mt-1 h-6 w-6 shrink-0 text-primary" />
                <div>
                  <p className="font-display font-bold uppercase tracking-wide">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-3xl font-bold uppercase italic sm:text-4xl">
            ¿Por qué instalar <span className="text-gradient-lime">con nosotros?</span>
          </h2>
          <ul className="mt-7 space-y-4">
            {reasons.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 border-l-2 border-primary/70 pl-5">
                <Icon className="mt-1 h-6 w-6 shrink-0 text-primary" />
                <div>
                  <p className="font-display font-bold uppercase tracking-wide">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section id="contacto" className="mx-auto max-w-6xl px-5 pb-20">
        <div
          className="flex flex-col items-center gap-4 rounded-2xl px-6 py-10 text-center"
          style={{ background: "var(--gradient-lime)" }}
        >
          <Send className="h-8 w-8 text-primary-foreground" />
          <h2 className="font-display text-3xl font-bold uppercase italic text-primary-foreground sm:text-4xl">
            ¡Solicita tu instalación hoy!
          </h2>
          <p className="max-w-xl text-primary-foreground/85">
            Pregunta en recepción por nuestros paquetes, planes de servicio y demostración en vivo con
            prueba de ubicación en tiempo real.
          </p>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        ORB-LITE · Rastreo GPS Satelital · Tu vehículo, tu familia, tu tranquilidad
      </footer>
    </div>
  );
}
