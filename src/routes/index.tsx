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
} from "lucide-react";

import heroImg from "@/assets/hero-gps.jpg";

import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ORB-LITE | Tecnología GPS para tu Negocio de Alarmas" },
      {
        name: "description",
        content:
          "Distribuye e instala rastreo GPS satelital ORB-LITE en tu negocio de alarmas. Equipo OL-01, plataforma, SIM y soporte técnico para que revendas a clientes finales.",
      },
      { property: "og:title", content: "ORB-LITE | Tecnología GPS para tu Negocio de Alarmas" },
      {
        property: "og:description",
        content:
          "Aumenta tus ingresos ofreciendo rastreo GPS satelital. Equipos, plataforma y datos para instaladores y distribuidores.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const highlights = [
  { icon: Store, title: "Nuevo servicio", text: "Suma rastreo GPS a tu catálogo de seguridad y genera un ingreso adicional." },
  { icon: MapPin, title: "Tiempo real", text: "Ubicación minuto a minuto desde la app o PC que tú ofrezcas a tus clientes." },
  { icon: Power, title: "Paro de motor", text: "Control remoto que diferencia tu oferta de la competencia." },
  { icon: Bell, title: "Alertas", text: "Batería desconectada, exceso de velocidad y más, notificadas al instante." },
  { icon: RadioTower, title: "Multi Carrier", text: "Cobertura nacional sin interrupciones para tus clientes en cualquier zona." },
  { icon: CalendarCheck, title: "Datos incluidos", text: "1 año de plataforma y SIM incluidos con el equipo; renovaciones generan ingreso recurrente." },
  { icon: HardHat, title: "Instalación flexible", text: "Tus técnicos lo instalan o lo integras con tus aliados; tú decides cómo operar." },
  { icon: ShieldCheck, title: "Soporte técnico", text: "Respaldamos a tu equipo y a tus clientes con asesoría y garantía real." },
];

function Index() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase italic leading-[1.05] sm:text-6xl">
            Haz mancuerna
            <br />
            <span className="text-gradient-lime">con ORB-LITE</span>
          </h1>
          <p className="mt-3 font-display text-lg uppercase tracking-wide text-muted-foreground sm:text-2xl">
            y crece con rastreo GPS satelital
          </p>
          <div className="mt-4 h-px w-40 bg-primary/60" />
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Ofrece <strong className="text-primary">rastreo GPS en tiempo real</strong> a tus
            clientes sin complicaciones. Equipos OL-01, plataforma lista, datos incluidos y el
            respaldo para que tu negocio sume un servicio rentable y recurrente.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/contacto"
              className="rounded-md px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground"
              style={{ background: "var(--gradient-lime)" }}
            >
              Cotizar alianza
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
              { icon: Store, label: "Tu negocio" },
              { icon: Users, label: "Tus clientes" },
              { icon: HardHat, label: "Crecimiento conjunto" },
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
          {["Alianza comercial", "Mayoreo", "Soporte"].map((t) => (
            <div
              key={t}
              className="rounded-lg border border-primary/40 bg-card/60 px-6 py-3 font-display text-xl font-bold uppercase text-primary"
            >
              {t}
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-3xl font-bold uppercase italic sm:text-4xl">
          Todo lo que necesitas <span className="text-gradient-lime">para sumar GPS a tu negocio</span>
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
