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

      <p className="mt-4 text-sm text-muted-foreground">
        Última actualización: 31 de agosto de 2026
      </p>

      <section className="mt-8 space-y-6 text-muted-foreground">
        <div>
          <h2 className="font-display text-xl font-bold uppercase italic text-foreground">
            Uso de datos personales
          </h2>
          <p className="mt-2">
            La información que compartas con ORB-LITE (nombre, teléfono, correo,
            datos de envío, datos fiscales o de tu negocio) se utiliza
            exclusivamente para: atender tus cotizaciones, procesar tus compras,
            coordinar entregas, emitir facturas, activar renovaciones y brindarte
            soporte técnico sobre nuestros productos y servicios.
          </p>
          <p className="mt-2">
            ORB-LITE no vende, alquila ni comparte tus datos personales con
            terceros ajenos a la operación. Tu información se maneja con acceso
            limitado y nos comprometemos a no hacer mal uso de ella. Puedes
            solicitar la corrección o eliminación de tus datos escribiendo a{" "}
            <a href="mailto:ventas@orb-lite.com" className="text-primary underline">
              ventas@orb-lite.com
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold uppercase italic text-foreground">
            Datos de facturación (CFDI)
          </h2>
          <p className="mt-2">
            Si solicitas factura, los datos fiscales que captures en el carrito
            (razón social, RFC, régimen fiscal, uso del CFDI, código postal
            fiscal, correo y teléfono) se utilizan únicamente para emitir y
            enviarte el comprobante fiscal correspondiente.
          </p>
          <p className="mt-2">
            Todos los paquetes publicados ya incluyen el 16% de IVA y la factura
            se emite al registrar tu compra en sistema. Es responsabilidad del
            cliente proporcionar datos fiscales correctos y vigentes; las
            correcciones fuera del mes de facturación pueden no ser posibles
            conforme a las reglas del SAT.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold uppercase italic text-foreground">
            Datos de envío
          </h2>
          <p className="mt-2">
            Los datos de envío (nombre completo, teléfono, ciudad, estado y
            código postal) se comparten únicamente con la paquetería encargada de
            la entrega. Los envíos foráneos tienen un costo adicional indicado en
            el carrito y los tiempos de entrega dependen de la paquetería.
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
          <p className="mt-2">
            Quien instala o administra un equipo es responsable de contar con el
            consentimiento del propietario del vehículo o de la persona
            monitoreada, cuando la ley lo requiera.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold uppercase italic text-foreground">
            Servicio, plataforma y renovaciones
          </h2>
          <p className="mt-2">
            El servicio de plataforma y, en su caso, el SIM se entregan con un año
            incluido a partir de la activación. A partir del segundo año la
            renovación es anual: plataforma $406 MXN, SIM $580 MXN o renovación
            completa (plataforma + SIM) $928 MXN, con IVA incluido.
          </p>
          <p className="mt-2">
            Si la renovación no se cubre, el servicio de monitoreo puede
            suspenderse hasta que se regularice. Para renovar es necesario
            indicar el nombre del titular y el nombre de la unidad registrada en
            plataforma.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold uppercase italic text-foreground">
            Condiciones de uso
          </h2>
          <p className="mt-2">
            Al comprar, instalar o usar los equipos y servicios ORB-LITE, el
            usuario se obliga a utilizarlos de manera lícita y conforme a la ley.
            El mal uso de los equipos, la plataforma o la información de rastreo
            — incluyendo actividades ilícitas, no autorizadas o que violen
            derechos de terceros — queda bajo la responsabilidad del usuario o
            instalador final.
          </p>
          <p className="mt-2">
            ORB-LITE se deslinda de cualquier uso indebido, ilícito o no
            autorizado de sus productos y servicios, así como de daños derivados
            de instalaciones realizadas por terceros. La cobertura de la red móvil
            y la disponibilidad de la señal satelital dependen de las condiciones
            de cada zona.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold uppercase italic text-foreground">
            Aceptación
          </h2>
          <p className="mt-2">
            Al realizar una compra, solicitar factura, contratar un plan o usar
            nuestros servicios, el cliente acepta estos términos y condiciones,
            así como el uso de datos descrito en esta página.
          </p>
        </div>
      </section>
    </main>
  );
}
