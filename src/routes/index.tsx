import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Power,
  Bell,
  RadioTower,
  ShieldCheck,
  Users,
  Lock,
  CalendarCheck,
  HardHat,
} from "lucide-react";

import heroImg from "@/assets/hero-gps.jpg";
import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ORB-LITE | Rastreo GPS Satelital en Tiempo Real" },
      {
        name: "description",
        content:
          "Protege tu vehículo o flota con rastreo GPS satelital en tiempo real 24/7: paro de motor remoto, alertas y datos incluidos hasta 5 años.",
      },
      { property: "og:title", content: "ORB-LITE | Rastreo GPS Satelital" },
      {
        property: "og:description",
        content:
          "Tecnología de localización en tiempo real para tu vehículo o flota. Instalación profesional y soporte con garantía.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const highlights = [
  { icon: MapPin, title: "Tiempo real", text: "Ubicación minuto a minuto desde tu celular o PC." },
  { icon: Power, title: "Paro de motor", text: "Apaga el vehículo a distancia ante un robo." },
  { icon: Bell, title: "Alertas", text: "Batería desconectada, exceso de velocidad y más." },
  { icon: RadioTower, title: "Multirred", text: "Cobertura nacional sin interrupciones." },
  { icon: CalendarCheck, title: "Datos incluidos", text: "Hasta 5 años sin recargas ni trámites." },
  { icon: HardHat, title: "Instalación pro", text: "Discreta, sin afectar la garantía de tu auto." },
];

function Index() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 lg:grid-cols-2">
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
            Tecnología de localización en <strong className="text-primary">tiempo real</strong> para
            tu vehículo o flota. Mantén el <strong className="text-foreground">control total</strong>{" "}
            desde tu celular, las 24 horas del día, los 365 días del año.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/contacto"
              className="rounded-md px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground"
              style={{ background: "var(--gradient-lime)" }}
            >
              Solicitar instalación
            </Link>
            <Link
              to="/servicios"
              className="rounded-md border border-primary/60 px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary"
            >
              Ver servicios
            </Link>
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

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="flex flex-wrap gap-4">
          {["24/7", "365 días", "5 años de datos"].map((t) => (
            <div
              key={t}
              className="rounded-lg border border-primary/40 bg-card/60 px-6 py-3 font-display text-xl font-bold uppercase text-primary"
            >
              {t}
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-3xl font-bold uppercase italic sm:text-4xl">
          Control total <span className="text-gradient-lime">en tu bolsillo</span>
        </h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
