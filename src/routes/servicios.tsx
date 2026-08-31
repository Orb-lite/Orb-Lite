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
  Package,
} from "lucide-react";

import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios GPS para Distribuidores e Instaladores | ORB-LITE" },
      {
        name: "description",
        content:
          "Soluciones de rastreo GPS satelital para negocios de alarmas: equipos, plataforma, SIM, soporte técnico y planes para que revendas a clientes finales.",
      },
      { property: "og:title", content: "Servicios GPS para Distribuidores e Instaladores | ORB-LITE" },
      {
        property: "og:description",
        content:
          "Todo lo que tu negocio de alarmas necesita para ofrecer rastreo GPS: equipos OL-01, plataforma, datos y soporte.",
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
    text: "Ubicación exacta minuto a minuto desde smartphone o PC para los clientes de tus instaladores.",
  },
  {
    icon: Power,
    title: "Paro de Motor Remoto",
    text: "Apaga el vehículo a distancia desde la app; un diferencial clave frente a la competencia.",
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    text: "Notificaciones por desconexión de batería, encendido no autorizado o exceso de velocidad.",
  },
  {
    icon: RouteIcon,
    title: "Historial y Rutas",
    text: "Revisa recorridos, paradas y hábitos de manejo para ofrecer reportes de valor agregado.",
  },
  {
    icon: RadioTower,
    title: "CONECTIVIDAD MULTI CARRIER",
    text: "Conexión estable e ininterrumpida gracias a la red móvil de cobertura nacional; elige automáticamente la mejor señal disponible en cada momento.",
  },
  {
    icon: ShieldCheck,
    title: "Soporte y Garantía",
    text: "Asesoría especializada para tu equipo de instalación, garantía del equipo y respaldo real.",
  },
];

const dataPerks = [
  { icon: InfinityIcon, title: "Sin recargas", text: "ni complicaciones" },
  { icon: CalendarCheck, title: "Vigencia 1 año", text: "renovable" },
  { icon: RefreshCw, title: "Renovables", text: "ingreso recurrente para tu negocio" },
  { icon: SignalHigh, title: "Conectividad", text: "garantizada en territorio nacional" },
];

const plans = [
  {
    icon: Store,
    name: "Negocios de seguridad",
    text: "Ideal para autoalarmas, cerrajerías, accesorios y electrónica vehicular. Agrega GPS como servicio adicional y crece tu cartera.",
    items: ["Equipo OL-01", "App móvil y web", "Guía y soporte técnico"],
  },
  {
    icon: Truck,
    name: "Flotas comerciales",
    text: "Control de unidades de trabajo con reportes de rutas, geocercas y hábitos de manejo.",
    items: ["Multiunidad", "Historial y reportes", "Soporte técnico"],
  },
  {
    icon: Package,
    name: "Mayoreo",
    text: "Compra por volumen para revender a otros instaladores o centros de alarmas con mejores condiciones.",
    items: ["Precios especiales", "Envío consolidado", "Atención de cuenta"],
  },
];

const reasons = [
  {
    icon: HardHat,
    title: "Operación flexible",
    text: "Tú decides cómo atender a tu cliente: con tu propio equipo técnico o aliado. Nosotros te respaldamos con equipos y soporte.",
  },
  {
    icon: MonitorSmartphone,
    title: "Plataforma lista para usar",
    text: "Interfaz moderna y configurable para que tus clientes operen desde el primer día.",
  },
  {
    icon: Zap,
    title: "Margen y recurrencia",
    text: "Gana por la instalación y por las renovaciones anuales de plataforma y SIM.",
  },
];

function Servicios() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">Alianza comercial</p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase italic sm:text-5xl">
          Suma GPS a tu negocio <span className="text-gradient-lime">con ORB-LITE</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Trabaja con ORB-LITE para ofrecer rastreo GPS satelital a tus clientes: equipos OL-01,
          plataforma, datos incluidos y respaldo técnico.
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
          Planes para <span className="text-gradient-lime">tu negocio</span>
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
          Pregunta por precios mayoristas, paquetes para instaladores y condiciones por volumen.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="rounded-2xl border-2 border-primary/60 bg-card/50 p-7 sm:p-10">
          <p className="font-display text-2xl font-bold uppercase italic text-primary">
            ¡Ya no necesitas recargar!
          </p>
          <p className="mt-2 max-w-xl text-muted-foreground">
            El primer año de línea de datos celular va incluido con cada equipo que vendas o instales.
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
          ¿Por qué hacer mancuerna <span className="text-gradient-lime">con ORB-LITE?</span>
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
