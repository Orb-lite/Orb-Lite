import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Battery,
  Gauge,
  Thermometer,
  Radio,
  Zap,
  PhoneCall,
  Power,
  MapPin,
  Route as RouteIcon,
  CreditCard,
  Wrench,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { openWhatsApp } from "@/lib/whatsapp";
import { CtaBanner } from "@/components/site-chrome";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      {
        title: "Preguntas Frecuentes (FAQ) | ORB-LITE Rastreo GPS Satelital",
      },
      {
        name: "description",
        content:
          "Resuelve todas tus dudas sobre la plataforma ORB-LITE: alertas configurables, paro de motor remoto, costos de renovación anual, cobertura 4G e instalación.",
      },
      {
        property: "og:title",
        content: "Preguntas Frecuentes (FAQ) | ORB-LITE Rastreo GPS Satelital",
      },
      {
        property: "og:description",
        content:
          "Todo lo que necesitas saber sobre telemetría, alertas de sensores, batería vehicular, excesos de velocidad y botón de pánico en México.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

interface FaqItem {
  id: string;
  category: "Alertas" | "Plataforma" | "Costos & Planes" | "Instalación & Hardware" | "Seguridad";
  question: string;
  answer: string;
  highlights?: string[];
  icon?: any;
}

const faqData: FaqItem[] = [
  {
    id: "alertas-configurables",
    category: "Alertas",
    icon: ShieldAlert,
    question: "¿Qué alertas configurables incluye la plataforma en su versión definitiva?",
    answer:
      "La plataforma ORB-LITE integra una suite completa de alertas inteligentes que puedes personalizar por vehículo o por grupo de unidades:",
    highlights: [
      "Baja Batería: Supervisión del voltaje del auto (<11.8V) para evitar que no encienda y aviso de corte de arnés/sabotaje.",
      "Excesos de Velocidad: Umbrales en km/h configurables para áreas urbanas (ej. 60 km/h) y carreteras (ej. 110 km/h).",
      "Baja o Alta Temperatura: Monitoreo para cadena de frío (-20°C a 4°C) y alerta de sobrecalentamiento crítico de motor (>95°C).",
      "Situaciones de Riesgo de Sensores: Apertura no autorizada de puertas, desconexión de arnés, variaciones anómalas de combustible e impacto.",
      "Conducción Errática: Detección giroscópica de frenadas bruscas, aceleraciones agresivas y virajes violentos (Eco-driving).",
      "Botón de Pánico (SOS): Señal silenciosa y sonora de auxilio inmediato con reporte a contactos de emergencia y monitoreo.",
    ],
  },
  {
    id: "paro-motor",
    category: "Seguridad",
    icon: Power,
    question: "¿Cómo funciona el Paro de Motor Remoto en caso de emergencia?",
    answer:
      "El paro de motor se activa directamente desde la plataforma web o la aplicación móvil. El comando viaja mediante conexión de datos y SMS de respaldo hacia el relevador de corte automotriz de 12V/24V instalado de manera invisible. Por seguridad vial, el inmovilizador se ejecuta de forma segura cortando la ignición o el paso de combustible cuando el vehículo se detiene o disminuye la marcha, evitando maniobras peligrosas a alta velocidad.",
    highlights: [
      "Comando inmediato en menos de 3 segundos.",
      "Corte mediante relevador automotriz de grado industrial sellado contra polvo y humedad.",
      "Puede reactivarse con un solo clic desde tu panel una vez recuperada la unidad.",
    ],
  },
  {
    id: "costos-renovacion",
    category: "Costos & Planes",
    icon: CreditCard,
    question: "¿Cuáles son los costos reales de renovación y existen mensualidades forzosas?",
    answer:
      "En ORB-LITE no creemos en contratos forzosos ni rentas mensuales excesivas de $300 a $600 pesos. Al comprar tu equipo tienes el primer año completo incluido. A partir del segundo año las tarifas anuales son transparentes:",
    highlights: [
      "Acceso a Plataforma Web y App: $160 MXN al año por unidad.",
      "SIM Multi-Carrier 4G con datos ilimitados para telemetría: $590 MXN al año.",
      "Paquete Anual Completo (Plataforma + SIM): Solo $750 MXN al año (IVA incluido), equivalente a unos ~$63 pesos mensuales.",
      "Sin plazos forzosos, sin penalizaciones por cancelación.",
    ],
  },
  {
    id: "instalacion-vehiculos",
    category: "Instalación & Hardware",
    icon: Wrench,
    question: "¿En qué tipo de vehículos se puede instalar y cuánto tiempo toma?",
    answer:
      "Nuestros rastreadores Teltonika 4G con homologación oficial son universales y operan en rangos de voltaje de 10V a 30V. Son compatibles con automóviles particulares, camionetas, SUV, motocicletas, camiones de carga de 24V, tractocamiones y maquinaria agrícola o de construcción. La instalación toma entre 45 y 60 minutos, es totalmente oculta tras el tablero y no altera la garantía eléctrica original del vehículo.",
    highlights: [
      "Instalación profesional a domicilio en Guadalajara / Zona Metropolitana.",
      "Envíos de kits preconfigurados 'Plug & Track' a cualquier estado de la República Mexicana.",
      "Diagrama de instalación incluido con asesoría técnica por videollamada o WhatsApp.",
    ],
  },
  {
    id: "cobertura-sin-senal",
    category: "Plataforma",
    icon: Radio,
    question: "¿Qué cobertura tiene en México y qué ocurre si el vehículo entra a un sótano o zona sin señal celular?",
    answer:
      "Utilizamos chips multi-carrier inteligentes con conmutación dinámica que se conectan automáticamente a la mejor red disponible (Telcel, Movistar o AT&T). Si el vehículo ingresa a una zona sin cobertura celular (como un túnel, estacionamiento subterráneo profundo o serranía), el dispositivo continúa registrando la posición satelital en su memoria flash interna (hasta 100,000 registros con fecha, velocidad y coordenadas). En cuanto recupera red, descarga todo el historial sin perder un solo metro de recorrido.",
    highlights: [
      "Conectividad 4G LTE Cat-1 con respaldo 2G en todo el país.",
      "Memoria 'Blackbox' que almacena hasta 100,000 eventos fuera de línea.",
      "Batería interna de respaldo de 170 mAh para seguir transmitiendo si cortan la batería principal.",
    ],
  },
  {
    id: "enlaces-compartidos",
    category: "Seguridad",
    icon: MapPin,
    question: "¿Puedo compartir la ubicación de mi auto con la policía o con un cliente sin prestar mi contraseña?",
    answer:
      "Sí, con la función de 'Compartir Rastreo' puedes generar un enlace público temporal protegido por un token seguro. Puedes definir la vigencia del enlace (2 horas, 6 horas, 12 horas, 24 horas o permanente). Quien reciba el link podrá ver el mapa en vivo en cualquier navegador web o smartphone sin necesidad de iniciar sesión ni ver el resto de tus vehículos.",
    highlights: [
      "Ideal para emergencias y despachos policiales ante robo.",
      "Permite a clientes de fletes o entregas monitorear la llegada de su pedido en tiempo real.",
      "Revocación instantánea en cualquier momento desde tu panel.",
    ],
  },
  {
    id: "optimizacion-rutas",
    category: "Plataforma",
    icon: RouteIcon,
    question: "¿Cómo funciona el optimizador de rutas y la integración con Google Maps y Waze?",
    answer:
      "En el módulo de Rutas de ORB-LITE puedes cargar los destinos o clientes que necesitas visitar en el día. El algoritmo telemático resuelve el problema de la ruta más corta (TSP), reorganizando las paradas para recorrer el menor kilometraje posible y evitar tráfico. Con un solo toque, el conductor puede exportar la ruta directamente a Google Maps o Waze en su teléfono celular.",
    highlights: [
      "Ahorro de hasta un 30% en combustible mensual.",
      "Reduce tiempos muertos y retrasos con clientes.",
      "Comparte la hoja de ruta con el operador mediante link directo.",
    ],
  },
  {
    id: "cuentas-multiusuario",
    category: "Plataforma",
    icon: Sparkles,
    question: "¿Puedo crear subcuentas para empleados, choferes o clientes?",
    answer:
      "Sí. Si administras una empresa o flota, tu usuario funciona como Cuenta Padre. Desde la pestaña de 'Sub-Cuentas' puedes dar de alta usuarios secundarios (choferes, despachadores, clientes) y asignarles únicamente los vehículos que deben supervisar, sin que tengan acceso a configuraciones críticas o facturación.",
    highlights: [
      "Control granular de permisos por unidad.",
      "Visualización simultánea de decenas de unidades en mapa en vivo.",
      "Auditoría y bitácora de actividad de cada subcuenta.",
    ],
  },
];

const categories = ["Todas", "Alertas", "Plataforma", "Seguridad", "Costos & Planes", "Instalación & Hardware"] as const;

function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "alertas-configurables": true,
    "paro-motor": true,
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory = selectedCategory === "Todas" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.highlights &&
          item.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-16 pb-12">
      {/* HERO FAQ */}
      <section className="mx-auto max-w-6xl px-5 pt-8 sm:pt-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <HelpCircle className="size-3.5" />
            <span>Centro de Ayuda y Preguntas Frecuentes</span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold uppercase italic sm:text-5xl md:text-6xl text-foreground">
            Preguntas <span className="text-gradient-lime">Frecuentes</span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Todo lo que necesitas saber sobre el funcionamiento de los equipos GPS, alertas
            configurables, paro de motor remoto, cobertura y costos de renovación en México.
          </p>
        </div>

        {/* FILTROS Y BÚSQUEDA */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-y border-border/60 py-6">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3.5 py-1.5 font-display text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border/80 bg-card/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px] max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar en preguntas frecuentes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/80 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* LISTA DE PREGUNTAS ACORDEÓN */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <HelpCircle className="mx-auto size-10 text-muted-foreground" />
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                No encontramos preguntas para "{searchQuery}"
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Intenta con otra palabra clave o pregúntanos directamente por WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => openWhatsApp("523318359421", "Hola, tengo una pregunta sobre el rastreo GPS ORB-LITE")}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-display text-xs font-bold uppercase text-primary-foreground"
              >
                <MessageCircle className="size-4" />
                Contactar por WhatsApp
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = Boolean(openIds[faq.id]);
              const Icon = faq.icon || HelpCircle;
              return (
                <div
                  key={faq.id}
                  className={`overflow-hidden rounded-2xl border transition-all ${
                    isOpen
                      ? "border-primary/50 bg-card/90 shadow-md"
                      : "border-border/70 bg-card/40 hover:border-primary/30"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                          {faq.category}
                        </span>
                        <h3 className="font-display text-base font-bold uppercase text-foreground sm:text-lg">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-background/50 text-muted-foreground">
                      {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-border/60 px-5 pb-6 pt-4 sm:px-6">
                      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {faq.answer}
                      </p>

                      {faq.highlights && faq.highlights.length > 0 && (
                        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                            Aspectos destacados:
                          </p>
                          <ul className="mt-2 space-y-2 text-xs text-foreground/90 sm:text-sm">
                            {faq.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* BANNER DE CONTACTO RÁPIDO */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-primary/40 bg-card/60 p-6 sm:p-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              ¿Tienes alguna duda específica?
            </span>
            <h2 className="mt-1 font-display text-xl font-bold uppercase text-foreground sm:text-2xl">
              Nuestro equipo técnico te atiende en menos de 5 minutos
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Escríbenos directamente para cotizaciones de flotas, talleres mecánicos o dudas sobre tu auto.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openWhatsApp("523318359421", "Hola, tengo dudas sobre el servicio de rastreo GPS ORB-LITE")}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition shadow"
            >
              <MessageCircle className="size-4" />
              WhatsApp Directo
            </button>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary transition"
            >
              Formulario de Contacto
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
