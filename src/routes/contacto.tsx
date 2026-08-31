import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto | ORB-LITE Rastreo GPS Satelital" },
      {
        name: "description",
        content:
          "Solicita información y cotización de equipos GPS ORB-LITE: uso personal, flotas de empresa, negocios y precios por volumen.",
      },
      { property: "og:title", content: "Contacto | ORB-LITE Rastreo GPS Satelital" },
      {
        property: "og:description",
        content:
          "Escríbenos por WhatsApp o envía tu solicitud para cotizar equipos GPS y planes de servicio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contacto,
});

const WHATSAPP = "523318359421";
const TEL = "3318359421";
const EMAIL = "ventas@orb-lite.com";

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [negocio, setNegocio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [mensaje, setMensaje] = useState("");

  const texto = `Hola, soy ${nombre || "(nombre)"}${negocio ? ` de ${negocio}` : ""}. Tel: ${telefono || "(teléfono)"}. Equipos estimados: ${cantidad || "(cantidad)"}. ${mensaje}`;

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Solicita información hoy
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase italic sm:text-5xl">
          Cotiza tu <span className="text-gradient-lime">rastreo GPS</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Déjanos tus datos y te compartimos paquetes, planes de servicio y condiciones por volumen,
          ya sea para un vehículo, para las unidades de tu empresa o para tu negocio. Renovación
          anual: plataforma <span className="font-bold text-primary">$406/año</span> y SIM{" "}
          <span className="font-bold text-primary">$580/año</span> (IVA incluido).
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-20 lg:grid-cols-[1.2fr_1fr]">
        <form
          className="rounded-2xl border border-border/70 bg-card/50 p-7"
          onSubmit={(e) => {
            e.preventDefault();
            window.open(
              `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`,
              "_blank",
              "noopener",
            );
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm">
              <span className="font-display uppercase tracking-wide">Nombre</span>
              <input
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary"
                placeholder="Tu nombre completo"
              />
            </label>
            <label className="text-sm">
              <span className="font-display uppercase tracking-wide">Teléfono</span>
              <input
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary"
                placeholder="10 dígitos"
              />
            </label>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-sm">
              <span className="font-display uppercase tracking-wide">
                Empresa o negocio (opcional)
              </span>
              <input
                value={negocio}
                onChange={(e) => setNegocio(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary"
                placeholder="Si aplica"
              />
            </label>
            <label className="text-sm">
              <span className="font-display uppercase tracking-wide">Cantidad estimada</span>
              <input
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary"
                placeholder="Ej. 1, 5, 20 equipos"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm">
            <span className="font-display uppercase tracking-wide">Mensaje</span>
            <textarea
              rows={4}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary"
              placeholder="Cuéntanos qué necesitas: rastreo para tu auto, control de flota, instalación, condiciones por volumen, etc."
            />
          </label>

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground"
            style={{ background: "var(--gradient-lime)" }}
          >
            <MessageCircle className="h-4 w-4" />
            Enviar por WhatsApp
          </button>
          <p className="mt-3 text-xs text-muted-foreground">
            Al enviar se abrirá WhatsApp con tus datos listos para mandar.
          </p>
        </form>

        <aside className="space-y-4">
          {[
            { icon: Phone, title: "Teléfono", text: TEL, href: `tel:+52${TEL}` },
            {
              icon: MessageCircle,
              title: "WhatsApp",
              text: TEL,
              href: `https://wa.me/${WHATSAPP}`,
            },
            { icon: Mail, title: "Correo", text: EMAIL, href: `mailto:${EMAIL}` },
            { icon: MapPin, title: "Cobertura", text: "Todo el territorio nacional", href: null },
            { icon: Clock, title: "Horario", text: "Lunes a sábado, 9:00 a 19:00 h", href: null },
          ].map(({ icon: Icon, title, text, href }) => (
            <div
              key={title}
              className="flex gap-4 rounded-xl border border-border/70 bg-card/50 p-5"
            >
              <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-wide">{title}</p>
                {href ? (
                  <a href={href} className="text-muted-foreground hover:text-primary">
                    {text}
                  </a>
                ) : (
                  <p className="text-muted-foreground">{text}</p>
                )}
              </div>
            </div>
          ))}
        </aside>
      </section>
    </div>
  );
}
