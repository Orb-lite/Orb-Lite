import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Uso de datos y condiciones | ORB-LITE" },
      {
        name: "description",
        content:
          "Conoce cómo ORB-LITE utiliza tus datos personales y las condiciones de uso de nuestros equipos y servicios de rastreo GPS.",
      },
      {
        property: "og:title",
        content: "Uso de datos y condiciones | ORB-LITE",
      },
      {
        property: "og:description",
        content:
          "Conoce cómo ORB-LITE utiliza tus datos personales y las condiciones de uso de nuestros equipos y servicios de rastreo GPS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TerminosPage,
});

function TerminosPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <Link
        to="/"
        className="text-sm text-muted-foreground underline hover:text-primary"
      >
        ← Volver al inicio
      </Link>

      <h1 className="mt-4 font-display text-4xl font-bold uppercase italic sm:text-5xl">
        Uso de datos y <span className="text-primary">condiciones</span>
      </h1>

      <section className="mt-8 space-y-6 text-muted-foreground">
        <div>
          <h2 className="font-display text-xl font-bold uppercase italic text-foreground">
            Uso de datos personales
          </h2>
          <p className="mt-2">
            La información que compartas con ORB-LITE (nombre, teléfono, correo,
            datos de facturación o de tu negocio) se utiliza exclusivamente para:
            atender tus cotizaciones, procesar tus compras, emitir facturas y
            brindarte soporte técnico sobre nuestros productos y servicios.
          </p>
          <p className="mt-2">
            ORB-LITE no vende, alquila ni comparte tus datos personales con
            terceros ajenos a la operación. Tu información se maneja con acceso
            limitado y nos comprometemos a no hacer mal uso de ella.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold uppercase italic text-foreground">
            Datos de rastreo y privacidad
          </h2>
          <p className="mt-2">
            Los datos generados por los equipos GPS (ubicación, rutas, alertas y
            eventos del vehículo) son propiedad del cliente o usuario final que
            contrata el servicio. ORB-LITE únicamente los almacena y procesa para
            hacer funcionar la plataforma de monitoreo y brindar soporte técnico.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold uppercase italic text-foreground">
            Condiciones de uso
          </h2>
          <p className="mt-2">
            Al comprar, instalar o usar los equipos y servicios ORB-LITE, el
            usuario se obliga a utilizarlos de manera lícita y conforme a la ley.
            El mal uso de los equipos, la plataforma o la información de
            rastreo — incluyendo actividades ilícitas, no autorizadas o que
            violen derechos de terceros — queda bajo la responsabilidad del
            usuario o instalador final.
          </p>
          <p className="mt-2">
            ORB-LITE se deslinda de cualquier uso indebido, ilícito o no
            autorizado de sus productos y servicios. En caso de requerir
            factura, los precios mostrados se cotizan más IVA; contáctanos para
            generarla.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold uppercase italic text-foreground">
            Aceptación
          </h2>
          <p className="mt-2">
            Al realizar una compra, contratar un plan o usar nuestros servicios,
            el cliente acepta estos términos y condiciones, así como el uso de
            datos descrito en esta página.
          </p>
        </div>
      </section>
    </main>
  );
}
