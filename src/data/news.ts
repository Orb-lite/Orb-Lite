export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: "Plataforma" | "Seguridad" | "Logística" | "Tecnología" | "Economía" | "B2B & Talleres";
  date: string;
  isoDate: string;
  readTime: string;
  author: string;
  featured?: boolean;
  content: string[];
  keyTakeaways: string[];
}

export const newsArticles: NewsArticle[] = [
  {
    id: "final-release-orb-lite",
    slug: "final-release-plataforma-orb-lite-nuevas-alertas",
    title: "Lanzamiento Oficial: Final Release de la Plataforma ORB-LITE y Alertas Configurables",
    summary:
      "Celebramos el lanzamiento oficial de nuestra plataforma definitiva y anunciamos la suite completa de alertas configurables: baja batería, excesos de velocidad, baja o alta temperatura, situaciones de riesgo de algún sensor, conducción errática y botón de pánico.",
    category: "Plataforma",
    date: "06 de Octubre, 2026",
    isoDate: "2026-10-06",
    readTime: "4 min de lectura",
    author: "Equipo de Producto & Ingeniería ORB-LITE",
    featured: true,
    keyTakeaways: [
      "Lanzamiento oficial del Final Release de la plataforma ORB-LITE con soporte 24/7 en todo México.",
      "Alertas de baja batería: monitoreo del acumulador vehicular (aviso si baja de 11.8V) y corte de batería externa.",
      "Alertas de excesos de velocidad: límites en km/h personalizables por unidad para ciudad y autopista.",
      "Alertas de baja o alta temperatura: protección de cadena de frío y sobrecalentamiento crítico de motor.",
      "Situaciones de riesgo de sensores: sensores de puertas, desconexión de arnés, combustible e impactos.",
      "Conducción errática: detección en tiempo real de frenadas bruscas, aceleraciones agresivas y virajes violentos.",
      "Botón de pánico (SOS): alerta silenciosa y sonora inmediata para auxilio en situaciones de asalto o peligro.",
    ],
    content: [
      "¡Es oficial! Hoy celebramos un hito trascendental con el Final Release de la plataforma ORB-LITE, nuestra versión de producción telemática y de rastreo GPS satelital concebida para brindar máxima velocidad de respuesta, estabilidad ininterrumpida y control total sobre vehículos particulares, comerciales y flotas de transporte en México.",
      "Tras meses de rigurosas pruebas de campo, optimización de protocolos y retroalimentación de nuestros clientes, empresas y talleres aliados, la plataforma entra en su versión definitiva, lista para operar con soporte de hardware Teltonika 4G, conectividad multi-carrier y paro de motor remoto inmediato.",
      "Como parte de este lanzamiento y en nuestro compromiso de ofrecer la mejor experiencia de usuario, integramos la suite de Alertas Configurables de última generación, donde cada usuario y administrador puede parametrizar las siguientes reglas de seguridad:",
      "1. Alertas de Baja Batería: Supervisión continua del voltaje del acumulador automotriz con aviso preventivo (ej. si cae por debajo de 11.8V) para evitar que el vehículo no encienda por la mañana, además de aviso prioritario inmediato si la batería externa es desconectada o saboteada.",
      "2. Alertas de Excesos de Velocidad: Umbrales en km/h totalmente configurables por vehículo o tipo de ruta. Permite fijar límites para zonas urbanas (ej. 60-80 km/h) y tramos carreteros (ej. 100-110 km/h), reduciendo accidentes, multas y consumo excesivo de gasolina o diésel.",
      "3. Alertas por Baja o Alta Temperatura: Monitoreo telemático con sensores térmicos Bluetooth/1-Wire. Esencial tanto para la preservación de cadena de frío (cámaras de refrigeración de alimentos y farmacéutica entre -20°C y 4°C) como para alertar sobrecalentamiento anormal en el motor (>95°C) antes de una avería costosa.",
      "4. Situaciones de Riesgo de Algún Sensor: Detección inteligente ante anomalías reportadas por sensores del vehículo, incluyendo apertura no autorizada de puertas de cabina o caja, variaciones abruptas de combustible, corte intencional de líneas de alimentación o sensores de impacto/choque.",
      "5. Conducción Errática (Eco-Driving y Seguridad): Sensores giroscópicos y acelerómetros configurados para registrar eventos de frenado brusco, aceleraciones intempestivas y curvas tomadas a velocidad peligrosa, protegiendo tanto la vida del conductor como la integridad de la carga.",
      "6. Botón de Pánico (Botón SOS): Protocolo de emergencia inmediata. Al ser presionado el botón físico oculto en cabina o activado desde la plataforma, emite una notificación acústica y visual de máxima prioridad al centro de monitoreo, celular y correo de emergencia con coordenadas vivas para pronta reacción policial.",
      "En ORB-LITE continuamos innovando día a día para que cuentes con la herramienta de rastreo y telemática más rápida, segura y transparente del mercado.",
    ],
  },
  {
    id: "1",
    slug: "monitoreo-avanzado-bateria-alertas-desconexion",
    title: "Monitoreo Avanzado de Batería de Respaldo y Alertas por Sabotaje",
    summary:
      "Conoce cómo funciona la batería interna de respaldo en los rastreadores 4G y por qué emite avisos prioritarios ante intentos de corte de corriente.",
    category: "Tecnología",
    date: "28 de Septiembre, 2026",
    isoDate: "2026-09-28",
    readTime: "4 min de lectura",
    author: "Ingeniería ORB-LITE",
    featured: false,
    keyTakeaways: [
      "Notificación en menos de 3 segundos si el arnés o la batería principal es desconectada.",
      "La batería de respaldo interna de 170 mAh mantiene la transmisión satelital activa.",
      "Visualización del voltaje exacto en tiempo real desde la app móvil y plataforma web.",
    ],
    content: [
      "Uno de los métodos más habituales empleados por delincuentes al intentar sustraer un vehículo o equipo de transporte es cortar de inmediato los cables de la batería principal para intentar apagar alarmas convencionales.",
      "Con los dispositivos Teltonika FTC927 integrados a ORB-LITE, el hardware detecta la caída abrupta de voltaje externo al instante y conmuta de forma automática a su batería interna de iones de litio.",
      "En el mismo milisegundo en que ocurre el corte, el servidor de telemetría de ORB-LITE emite un evento prioritario catalogado como 'Alerta de Sabotaje de Energía'. El propietario o monitorista recibe una alerta sonora crítica en su smartphone, un correo electrónico y registro en la bitácora de eventos.",
      "Esta función es vital porque otorga una ventana de acción inmediata de hasta 4 horas para activar el paro de motor remoto y notificar al 911 o a la policía con la ubicación en vivo mientras el coche aún está en el lugar o en plena marcha.",
      "Para activar esta visualización, ingresa a la pestaña 'Plataforma' en tu cuenta; dentro de los detalles de cada unidad verás ahora el indicador de Voltaje del Vehículo (ej. 12.6V o 14.1V con alternador activo) y el estado de la batería de respaldo.",
    ],
  },
  {
    id: "2",
    slug: "estrategias-prevencion-robo-vehicular-carreteras-mexico",
    title: "Estrategias Clave para Evitar el Robo de Vehículos y Carga en Carreteras de México",
    summary:
      "Guía práctica de prevención: uso de geocercas en tramos de alto riesgo, botones de pánico silenciosos y la efectividad del paro de motor remoto en los primeros 10 minutos.",
    category: "Seguridad",
    date: "15 de Septiembre, 2026",
    isoDate: "2026-09-15",
    readTime: "6 min de lectura",
    author: "Seguridad & Prevención Patrimonial",
    featured: true,
    keyTakeaways: [
      "El 82% de las recuperaciones exitosas ocurren cuando el reporte se genera dentro de los primeros 15 minutos.",
      "Las geocercas de desviación de ruta alertan antes de que el vehículo ingrese a zonas sin cobertura.",
      "El enlace temporal de rastreo permite a las corporaciones de policía ubicar la unidad sin compartir tu contraseña.",
    ],
    content: [
      "La seguridad en el transporte privado y comercial en México exige herramientas proactivas más que reactivas. Contar únicamente con una alarma sonora es insuficiente frente a bandas organizadas.",
      "En este informe detallamos las tres medidas telemáticas más efectivas implementadas por clientes de ORB-LITE para blindar sus operaciones:",
      "1. Geocercas de Corredores Seguros: En lugar de solo marcar el punto de partida y llegada, define polígonos a lo largo de las autopistas autorizadas. Si el chofer se desvía más de 200 metros de la ruta trazada, el sistema genera una alerta instantánea.",
      "2. Enlaces Públicos Temporales de Ubicación: Cuando una unidad reporta una anomalía o siniestro, no es necesario entregar usuario y contraseña a la policía. Desde la plataforma ORB-LITE puedes generar un enlace seguro válido por 2, 6 o 24 horas que muestra el mapa satelital en vivo con actualización segundo a segundo.",
      "3. Paro de Motor Seguro: El inmovilizador de combustible instalado en conjunto con el relevador automotriz de 12V/24V permite cortar la marcha. Al activarse cuando el vehículo se detiene o reduce velocidad en un semáforo o caseta, se neutraliza el movimiento del vehículo sin poner en riesgo la integridad de los ocupantes.",
      "Recomendamos revisar mensualmente el historial de paradas no autorizadas y verificar que el relevador responda adecuadamente a las pruebas de rutina.",
    ],
  },
  {
    id: "3",
    slug: "optimizacion-rutas-google-maps-waze-ahorro-combustible",
    title: "Optimización de Rutas con Google Maps y Waze: Cómo Ahorrar hasta un 30% en Combustible",
    summary:
      "Descubre cómo el algoritmo inteligente de ORB-LITE reorganiza automáticamente tus puntos de entrega para reducir kilómetros muertos y tiempos de espera en tráfico.",
    category: "Logística",
    date: "04 de Septiembre, 2026",
    isoDate: "2026-09-04",
    readTime: "5 min de lectura",
    author: "Operaciones & Logística",
    featured: true,
    keyTakeaways: [
      "Reducción comprobada del 25% al 30% en consumo mensual de gasolina y diésel.",
      "Exportación directa a Google Maps y Waze en el teléfono del conductor con un solo clic.",
      "Cálculo matemático del orden óptimo de paradas (Traveling Salesperson Problem optimizado).",
    ],
    content: [
      "Para cualquier negocio que realice entregas locales, repartos de última milla o visitas técnicas a clientes, el combustible y el desgaste mecánico representan uno de los mayores costos operativos.",
      "El despachador a menudo entrega una lista desordenada de 10 o 15 direcciones al chofer, quien decide por intuición qué camino tomar, generando vueltas innecesarias, retrocesos en U y tiempos muertos en congestiones vehiculares.",
      "En el módulo de Rutas de ORB-LITE, simplemente ingresas las direcciones o coordenadas de las paradas programadas. El algoritmo evalúa las distancias y genera la secuencia óptima para recorrer el menor número de kilómetros posibles.",
      "Una vez generada la ruta, cuentas con dos botones directos: 'Abrir en Google Maps' y 'Abrir en Waze'. El chofer recibe las indicaciones giro a giro con tráfico en vivo sin tener que teclear manualmente cada destino en su celular.",
      "Además, la plataforma permite enviar la ruta generada directamente por WhatsApp con el enlace de seguimiento para que el cliente final conozca la hora estimada de llegada.",
    ],
  },
  {
    id: "4",
    slug: "por-que-elegir-chips-multi-carrier-m2m",
    title: "Por Qué Elegir Chips Multi-Carrier M2M sobre Tarjetas SIM Prepago Convencionales",
    summary:
      "Análisis técnico de conectividad: itinerancia automática entre Telcel, AT&T y Movistar sin caídas de señal y sin la necesidad de recargar saldo mensual.",
    category: "Tecnología",
    date: "22 de Agosto, 2026",
    isoDate: "2026-08-22",
    readTime: "5 min de lectura",
    author: "Telecomunicaciones ORB-LITE",
    keyTakeaways: [
      "Conexión automática a la red más fuerte en cada zona (Telcel, AT&T o Movistar).",
      "Cero riesgo de que la línea se corte o caduque por olvido de recargas en tiendas.",
      "APN privado de telemetría optimizado para transmisión continua y baja latencia.",
    ],
    content: [
      "Muchos usuarios que compran localizadores GPS genéricos cometen el error de insertar una tarjeta SIM comercial prepago de $50 pesos. A las pocas semanas, la línea se queda sin saldo, se bloquea por falta de uso de voz o pierde señal al salir a carretera.",
      "En ORB-LITE todos nuestros equipos con conectividad incluyen una SIM card industrial M2M (Machine to Machine) especialmente diseñada para telemática y telemetría de misión crítica.",
      "¿Cuál es la gran diferencia técnica? La itinerancia nacional multi-carrier. Si tu vehículo sale de Guadalajara hacia Colima o transita por la sierra, la SIM detecta automáticamente si la antena de Telcel se debilita y conmuta de inmediato a AT&T o Movistar sin que el usuario tenga que hacer nada.",
      "Adicionalmente, el primer año de datos viene 100% cubierto. No tienes que acudir a tiendas de conveniencia cada 30 días ni recordar fechas de corte. Y al concluir los 12 meses, la renovación anual es de solo $590 MXN (IVA incluido), asegurando un servicio profesional ininterrumpido.",
    ],
  },
  {
    id: "5",
    slug: "renovaciones-transparentes-sin-plazos-forzosos",
    title: "Renovaciones Transparentes en GPS: El Fin de los Contratos Forzosos y Rentas Abusivas",
    summary:
      "En ORB-LITE eres dueño de tu equipo. Te explicamos cómo funciona nuestro esquema anual de solo $160 MXN de plataforma y $590 MXN de SIM con IVA incluido.",
    category: "Economía",
    date: "10 de Agosto, 2026",
    isoDate: "2026-08-10",
    readTime: "3 min de lectura",
    author: "Dirección Comercial",
    keyTakeaways: [
      "El equipo es 100% tuyo desde el momento de compra.",
      "Costo de renovación total: solo $750 MXN al año (equivalente a ~$63 MXN mensuales).",
      "Cero letras pequeñas, penalizaciones por cancelación o contratos a 24 meses.",
    ],
    content: [
      "El modelo tradicional de las empresas de rastreo satelital en México ha estado basado durante años en obligar al cliente a firmar contratos de 18 a 36 meses, cobrando rentas que oscilan entre los $350 y $700 pesos mensuales por unidad.",
      "Si una familia tiene dos autos o una empresa tiene 5 camionetas, terminan pagando más de $30,000 pesos anuales en cuotas recurrentes, y al cancelar el servicio muchas veces les exigen devolver los equipos.",
      "En ORB-LITE rompimos con ese esquema: tú compras tu equipo Teltonika 4G original de grado automotriz y te pertenece por completo. El primer año ya incluye la plataforma satelital y el chip de datos.",
      "Cuando llega el momento de renovar al año siguiente, el costo es transparente y accesible para todos: $160 MXN por el acceso anual a la plataforma y $590 MXN por la línea multi-carrier. Si renuevas ambos juntos, pagas solo $750 MXN al año con factura fiscal incluida.",
      "Sin ataduras, sin contratos abusivos y con la mejor tecnología europea a tu servicio.",
    ],
  },
  {
    id: "6",
    slug: "integracion-wialon-cms-talleres-e-instaladores",
    title: "Integración Wialon CMS: Gestión Centralizada para Talleres e Instaladores Asociados",
    summary:
      "Herramientas exclusivas para integradores: creación de subcuentas, configuración masiva de comandos de hardware y comisiones por volumen.",
    category: "B2B & Talleres",
    date: "29 de Julio, 2026",
    isoDate: "2026-07-29",
    readTime: "5 min de lectura",
    author: "Red de Distribuidores ORB-LITE",
    keyTakeaways: [
      "Portal administrativo CMS para gestionar clientes y flotillas de manera independiente.",
      "Envío de comandos SMS/GPRS para calibración de hardware en 1 clic.",
      "Precios especiales de mayoreo en equipos Teltonika y chips M2M.",
    ],
    content: [
      "Para talleres mecánicos, negocios de autoestéreos, autoeléctricos y empresas de seguridad privada, ofrecer rastreo satelital es una de las vías más rentables para generar ingresos recurrentes y fidelizar clientes.",
      "A través de nuestra plataforma compatible con el ecosistema Wialon CMS, los distribuidores e instaladores autorizados de ORB-LITE tienen acceso a un panel integral de administración.",
      "Desde este panel pueden dar de alta nuevos clientes, asignarles usuarios y contraseñas personalizados, configurar los parámetros de corte de motor y consultar bitácoras técnicas de conexión sin depender de soporte externo.",
      "Además, ponemos a disposición nuestro catálogo de hardware con precios de mayoreo escalonados, arneses pre-ensamblados y asesoría directa de nuestros ingenieros de campo para resolver cualquier duda en instalaciones complejas.",
    ],
  },
];
