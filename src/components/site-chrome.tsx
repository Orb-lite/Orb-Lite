import { Link } from "@tanstack/react-router";
import logo from "@/assets/orb-lite-logo.png";
import { CartDrawer } from "@/components/cart-drawer";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/tienda", label: "Tienda" },
  { to: "/demo", label: "Demo" },
  { to: "/wialon", label: "Plataforma" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex items-center">
          <img
            src={logo.url}
            alt="ORB-LITE rastreo GPS satelital"
            className="h-16 w-auto drop-shadow-[0_0_20px_color-mix(in_oklab,var(--primary)_30%,transparent)] sm:h-20"
          />
        </Link>

        <nav className="flex items-center gap-6 font-display text-sm font-bold uppercase tracking-widest">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          <CartDrawer />
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
      <p>ORB-LITE · Rastreo GPS Satelital · Para personas, empresas y negocios</p>
      <p className="mt-2">
        <a href="tel:+523318359421" className="hover:text-primary">
          33 1835 9421
        </a>
        <span className="px-2 text-primary">|</span>
        <a href="mailto:ventas@orb-lite.com" className="hover:text-primary">
          ventas@orb-lite.com
        </a>
      </p>
      <p className="mt-2">
        <a
          href="https://api.whatsapp.com/send?phone=523318359421"
          target="_blank"
          rel="noreferrer"
          className="hover:text-primary"
        >
          WhatsApp: 331 835 9421
        </a>
      </p>

      <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3 px-5 text-xs uppercase tracking-widest">
        <li className="rounded-full border border-primary/30 px-4 py-2 text-primary">Soporte técnico incluido</li>
        <li className="rounded-full border border-primary/30 px-4 py-2 text-primary">Entrega incluida en GDL/ZMG</li>
        <li className="rounded-full border border-primary/30 px-4 py-2 text-primary">Envíos a todo México</li>
      </ul>

      <p className="mt-6">
        <Link to="/servicios" className="hover:text-primary">
          Servicios
        </Link>
        <span className="px-2 text-primary">|</span>
        <Link to="/tienda" className="hover:text-primary">
          Tienda
        </Link>
      </p>

      <Link
        to="/terminos"
        className="mx-auto mt-6 inline-block rounded-md border border-border/60 px-4 py-2 font-display text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        Uso de datos y condiciones
      </Link>
    </footer>
  );
}

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div
        className="relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl px-6 py-10 text-center"
        style={{ background: "var(--gradient-lime)" }}
      >
        <h2 className="font-display text-3xl font-bold uppercase italic text-primary-foreground sm:text-4xl">
          Solicita información hoy
        </h2>
        <p className="max-w-xl text-primary-foreground/85">
          Pregunta por paquetes, planes de servicio y precios de renovación anual, ya sea para un vehículo, tu flota o
          tu negocio.
        </p>

        <Link
          to="/contacto"
          className="rounded-md border-2 border-primary-foreground/70 px-6 py-2 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground"
        >
          Contactar ahora
        </Link>
      </div>
    </section>
  );
}
