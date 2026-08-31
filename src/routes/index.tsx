import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Power,
  Bell,
  RadioTower,
  ShieldCheck,
  Users,
  CalendarCheck,
  HardHat,
  Store,
  Car,
  Truck,
} from "lucide-react";

import heroImg from "@/assets/hero-gps.jpg";

import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ORB-LITE | Rastreo GPS Satelital para Autos, Flotas y Negocios" },
      {
        name: "description",
        content:
          "Rastreo GPS satelital ORB-LITE para particulares, empresas y negocios: equipo OL-01, plataforma en tiempo real, SIM con datos incluidos y soporte técnico en todo México.",
      },
      {
        property: "og:title",
        content: "ORB-LITE | Rastreo GPS Satelital para Autos, Flotas y Negocios",
      },
      {
        property: "og:description",
        content:
          "Protege y controla tus vehículos en tiempo real. Equipos, plataforma y datos para personas, empresas, flotas y negocios.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const highlights = [
  { icon: MapPin, title: "Tiempo real", text: "Ubicación minuto a minuto desde tu celular o computadora, donde estés." },
  { icon: Power, title: "Paro de motor", text: "Apaga el vehículo a distancia en caso de robo o uso no autorizado." },
  { icon: Bell, title: "Alertas", text: "Batería desconectada, exceso de velocidad y más, notificadas al instante." },
  { icon: RadioTower, title: "Multi Carrier", text: "Cobertura nacional sin interrupciones: siempre la mejor señal disponible." },
  { icon: CalendarCheck, title: "Datos incluidos", text: "1 año de plataforma y SIM incluidos con el equipo; renovación anual sencilla." },
  { icon: Car, title: "Un auto o cien", text: "Igual de fácil para tu vehículo personal que para toda una flota de trabajo." },
  { icon: HardHat, title: "Instalación flexible", text: "Instalación en Guadalajara o envío a todo México para instalarlo con tu taller." },
  { icon: ShieldCheck, title: "Soporte técnico", text: "Asesoría real, garantía del equipo y acompañamiento después de la compra." },
];

function Index() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase italic leading-[1.05] sm:text-6xl">
            Protege lo que
            <br />
            <span className="text-gradient-lime">más te mueve</span>
          </h1>
          <p className="mt-3 font-display text-lg uppercase tracking-wide text-muted-foreground sm:text-2xl">
            Rastreo GPS satelital para autos, flotas y negocios
          </p>
          <div className="mt-4 h-px w-40 bg-primary/60" />
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            <strong className="text-primary">Ubicación en tiempo real</strong>, paro de motor y
            alertas al instante. Equipo OL-01, plataforma lista para usar y un año de datos
            incluido: ideal para tu vehículo personal, para las unidades de tu empresa o para
            sumarlo a los servicios de tu negocio.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/contacto"
              className="rounded-md px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground"
              style={{ background: "var(--gradient-lime)" }}
            >
              Solicita información hoy
            </Link>
            <Link
              to="/tienda"
              className="rounded-md border border-primary/60 px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary"
            >
              Ver equipos
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-5 text-sm">
            {[
              { icon: Users, label: "Particulares" },
              { icon: Truck, label: "Empresas y flotas" },
              { icon: Store, label: "Negocios" },
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

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="flex flex-wrap gap-4">
          {["Uso personal", "Empresas y flotas", "Negocios y mayoreo"].map((t) => (
            <div
              key={t}
              className="rounded-lg border border-primary/40 bg-card/60 px-6 py-3 font-display text-xl font-bold uppercase text-primary"
            >
              {t}
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-3xl font-bold uppercase italic sm:text-4xl">
          Todo lo que necesitas <span className="text-gradient-lime">para rastrear con confianza</span>
        </h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-xl border border-border/70 bg-card/50 p-6">
              <Icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display font-bold uppercase tracking-wide">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
        <Link
          to="/servicios"
          className="mt-7 inline-block font-display text-sm font-bold uppercase tracking-widest text-primary"
        >
          Conocer todos los servicios →
        </Link>
      </section>

      <CtaBanner />
    </div>
  );
}
