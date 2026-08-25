import { Link } from "@tanstack/react-router";
import logo from "@/assets/orb-lite-logo.jpeg.asset.json";
import { CartDrawer } from "@/components/cart-drawer";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/tienda", label: "Tienda" },
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
            className="h-12 w-auto rounded-md"
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
    <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
      <p>ORB-LITE · Rastreo GPS Satelital · Tu vehículo, tu familia, tu tranquilidad</p>
      <p className="mt-2">
        <a href="tel:+523318359421" className="hover:text-primary">
          33 1835 9421
        </a>
        <span className="px-2 text-primary">|</span>
        <a href="mailto:ventas@orb-lite.com" className="hover:text-primary">
          ventas@orb-lite.com
        </a>
      </p>
    </footer>
  );
}

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div
        className="flex flex-col items-center gap-4 rounded-2xl px-6 py-10 text-center"
        style={{ background: "var(--gradient-lime)" }}
      >
        <h2 className="font-display text-3xl font-bold uppercase italic text-primary-foreground sm:text-4xl">
          ¡Solicita tu instalación hoy!
        </h2>
        <p className="max-w-xl text-primary-foreground/85">
          Pregunta por nuestros paquetes, planes de servicio y demostración en vivo con prueba de
          ubicación en tiempo real.
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
