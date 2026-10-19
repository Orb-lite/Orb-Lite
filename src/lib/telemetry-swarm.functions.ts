import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { wialonCall, WialonError, type WialonHost } from "@/lib/wialon.server";

export interface WialonApiDefinition {
  id: string;
  category: "auth" | "units" | "history" | "commands" | "geofences" | "reports" | "video" | "account";
  svc: string;
  name: string;
  description: string;
  httpMethod: "POST" | "GET (JSONP / AJAX)";
  baseUrl: string;
  requiredParams: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: string;
  }>;
  flagsExplained?: Array<{
    hex: string;
    dec: number;
    description: string;
  }>;
  payloadTemplate: Record<string, any>;
  sampleResponse: Record<string, any>;
  wialonRequirements: string[];
}

export const WIALON_API_CATALOG: WialonApiDefinition[] = [
  {
    id: "token-login",
    category: "auth",
    svc: "token/login",
    name: "Autenticación por Token (Login)",
    description:
      "Genera una sesión de acceso temporal en Wialon y devuelve el identificador de sesión (eid / sid) y el ID del usuario.",
    httpMethod: "POST",
    baseUrl: "https://hst-api.wialon.com/wialon/ajax.html?svc=token/login",
    requiredParams: [
      {
        name: "token",
        type: "string",
        required: true,
        description: "Token de acceso generado en Wialon con permisos adecuados.",
        example: "7d0d0...42e7",
      },
      {
        name: "fl",
        type: "integer (bitmask)",
        required: false,
        description: "Banderas de retorno de sesión. 2 = Retornar datos extendidos del usuario.",
        example: "2",
      },
      {
        name: "appName",
        type: "string",
        required: false,
        description: "Nombre de la aplicación cliente para auditoría de conexiones.",
        example: "ORB-LITE CRM",
      },
    ],
    payloadTemplate: {
      token: "<WIALON_TOKEN>",
      fl: 2,
    },
    sampleResponse: {
      eid: "08013d2975c63ef933bb0749e7b23555",
      gis_sid: "08013d2975c63ef933bb0749e7b23555",
      au: "orblite_admin",
      user: {
        id: 284192,
        nm: "orblite_admin",
        cls: 2,
        bact: 1,
      },
      tm: 1713531200,
    },
    wialonRequirements: [
      "El token debe crearse desde el panel de Wialon con permisos 'Actuar como usuario'.",
      "La respuesta entrega 'eid' (Session ID) obligatorio para todas las llamadas posteriores.",
      "Si la llamada devuelve error 4, el token fue revocado o tiene caracteres inválidos.",
    ],
  },
  {
    id: "core-search-units",
    category: "units",
    svc: "core/search_items",
    name: "Búsqueda y Telemetría de Unidades",
    description:
      "Consulta la flota completa de unidades GPS asociadas a la cuenta con coordenadas en vivo, velocidad y último reporte.",
    httpMethod: "POST",
    baseUrl: "https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items",
    requiredParams: [
      {
        name: "spec.itemsType",
        type: "string",
        required: true,
        description: "Tipo de elementos a buscar: 'avl_unit' para unidades/vehículos.",
        example: "avl_unit",
      },
      {
        name: "spec.propName",
        type: "string",
        required: true,
        description: "Campo de filtro ('sys_name', 'sys_id', etc.).",
        example: "sys_name",
      },
      {
        name: "spec.propValueMask",
        type: "string",
        required: true,
        description: "Máscara comodín para filtrar los nombres (* para todos).",
        example: "*",
      },
      {
        name: "flags",
        type: "integer (bitmask)",
        required: true,
        description: "Máscara de bits con las capas de datos requeridas.",
        example: "1025 (0x401)",
      },
      {
        name: "force",
        type: "integer",
        required: true,
        description: "1 para forzar búsqueda inmediata sin esperar actualización de caché interna.",
        example: "1",
      },
    ],
    flagsExplained: [
      { hex: "0x1", dec: 1, description: "Propiedades base de la unidad (ID, nombre, uid/IMEI)" },
      { hex: "0x400", dec: 1024, description: "Posición GPS actual (lat, lng, speed, course, time)" },
      { hex: "0x401", dec: 1025, description: "Combinación de 1 + 1024 (Base + Posición satelital)" },
      { hex: "0x1000", dec: 4096, description: "Sensores configurados en la unidad" },
      { hex: "0x400000", dec: 4194304, description: "Campos personalizados de la unidad" },
    ],
    payloadTemplate: {
      spec: {
        itemsType: "avl_unit",
        propName: "sys_name",
        propValueMask: "*",
        sortType: "sys_name",
      },
      force: 1,
      flags: 1025,
      from: 0,
      to: 0,
    },
    sampleResponse: {
      searchSpec: { itemsType: "avl_unit", propName: "sys_name" },
      dataFlags: 1025,
      totalItemsCount: 42,
      index: 0,
      items: [
        {
          id: 28491823,
          nm: "Tracto 104 - Kenworth",
          cls: 2,
          uid: "867451059283712",
          pos: {
            t: 1713531180,
            y: 19.4326,
            x: -99.1332,
            s: 64,
            c: 180,
            sc: 14,
          },
          lmsg: { t: 1713531180 },
          cnm: 48920150,
        },
      ],
    },
    wialonRequirements: [
      "Wialon exige 'flags' numérico (entero decimal). No enviar strings hexadecimales.",
      "El valor 'from: 0, to: 0' solicita todos los registros disponibles sin paginación truncada.",
      "Las coordenadas vienen en formato WGS84: 'x' = Longitud, 'y' = Latitud, 's' = km/h.",
    ],
  },
  {
    id: "messages-load-interval",
    category: "history",
    svc: "messages/load_interval",
    name: "Historial de Mensajes y Recorrido",
    description:
      "Carga la secuencia temporal de mensajes sinópticos y puntos de rastreo dentro de una ventana de tiempo UNIX.",
    httpMethod: "POST",
    baseUrl: "https://hst-api.wialon.com/wialon/ajax.html?svc=messages/load_interval",
    requiredParams: [
      {
        name: "itemId",
        type: "integer",
        required: true,
        description: "ID único de la unidad (avl_unit) en Wialon.",
        example: "28491823",
      },
      {
        name: "timeFrom",
        type: "integer (timestamp)",
        required: true,
        description: "Inicio del intervalo en segundos UNIX (UTC).",
        example: "1713484800",
      },
      {
        name: "timeTo",
        type: "integer (timestamp)",
        required: true,
        description: "Fin del intervalo en segundos UNIX (UTC).",
        example: "1713531200",
      },
      {
        name: "flags",
        type: "integer",
        required: true,
        description: "0x0000 = Mensajes de datos estándar con parámetros y posición.",
        example: "0",
      },
      {
        name: "flagsMask",
        type: "integer",
        required: true,
        description: "Máscara de filtrado sobre el tipo de mensaje.",
        example: "65280",
      },
      {
        name: "loadCount",
        type: "integer",
        required: true,
        description: "Cantidad máxima de mensajes por página (máx. 10,000 en Wialon).",
        example: "5000",
      },
    ],
    payloadTemplate: {
      itemId: 28491823,
      timeFrom: 1713484800,
      timeTo: 1713531200,
      flags: 0,
      flagsMask: 65280,
      loadCount: 5000,
    },
    sampleResponse: {
      count: 320,
      messages: [
        {
          t: 1713484860,
          f: 3,
          tp: "ud",
          pos: { x: -99.1332, y: 19.4326, z: 2240, s: 45, c: 90, sc: 12 },
          p: { pwr_ext: 12.6, battery: 4.1, hdop: 0.9 },
        },
      ],
    },
    wialonRequirements: [
      "El rango timeTo - timeFrom no debe superar los 31 días en una sola llamada.",
      "Los timestamps siempre deben estar expresados en segundos (no milisegundos).",
      "Los parámetros del dispositivo (voltaje, sensores) se alojan en el subobjeto 'p'.",
    ],
  },
  {
    id: "unit-exec-cmd",
    category: "commands",
    svc: "unit/exec_cmd",
    name: "Ejecución de Comandos GPRS / SMS",
    description:
      "Envía una orden remota a un equipo GPS (paro de motor, apertura de seguros, reinicio o consulta de estado).",
    httpMethod: "POST",
    baseUrl: "https://hst-api.wialon.com/wialon/ajax.html?svc=unit/exec_cmd",
    requiredParams: [
      {
        name: "itemId",
        type: "integer",
        required: true,
        description: "ID de la unidad que recibirá el comando.",
        example: "28491823",
      },
      {
        name: "commandName",
        type: "string",
        required: true,
        description: "Nombre de la plantilla de comando definida en la unidad.",
        example: "Paro de Motor",
      },
      {
        name: "linkType",
        type: "string",
        required: true,
        description: "Canal de transmisión: 'tcp', 'udp', 'sms' o 'virtual'.",
        example: "tcp",
      },
      {
        name: "param",
        type: "string",
        required: false,
        description: "Parámetro o comando AT crudo requerido por el tipo de orden.",
        example: "relay,1#",
      },
      {
        name: "timeout",
        type: "integer",
        required: false,
        description: "Tiempo máximo de espera en segundos (0 para encolar en servidor).",
        example: "60",
      },
    ],
    payloadTemplate: {
      itemId: 28491823,
      commandName: "Paro de Motor",
      linkType: "tcp",
      param: "1",
      timeout: 60,
      flags: 0,
    },
    sampleResponse: {
      result: 0,
      eventHash: "cmd_exec_28491823_1713531200",
    },
    wialonRequirements: [
      "El comando debe estar previamente configurado en la unidad ('unit/update_command_definition').",
      "El usuario autenticado debe tener el flag de acceso 0x00010000 (Ejecutar comandos).",
      "Si la unidad está fuera de línea y timeout es 0, Wialon encola el comando hasta el próximo contacto.",
    ],
  },
  {
    id: "unit-update-command-definition",
    category: "commands",
    svc: "unit/update_command_definition",
    name: "Definición / Creación de Comandos",
    description:
      "Crea o actualiza una plantilla de comando reutilizable en la unidad GPS.",
    httpMethod: "POST",
    baseUrl: "https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_command_definition",
    requiredParams: [
      {
        name: "itemId",
        type: "integer",
        required: true,
        description: "ID de la unidad GPS.",
        example: "28491823",
      },
      {
        name: "id",
        type: "integer",
        required: true,
        description: "ID de la definición de comando (0 para crear uno nuevo).",
        example: "0",
      },
      {
        name: "n",
        type: "string",
        required: true,
        description: "Nombre legible de la orden.",
        example: "Corte de Corriente",
      },
      {
        name: "c",
        type: "string",
        required: true,
        description: "Tipo de comando estándar de Wialon ('custom_msg', 'output_on', etc.).",
        example: "custom_msg",
      },
      {
        name: "l",
        type: "string",
        required: true,
        description: "Tipo de enlace ('tcp', 'udp', 'sms').",
        example: "tcp",
      },
      {
        name: "f",
        type: "integer",
        required: true,
        description: "Flags de comando obligatorios por Wialon (0 por defecto).",
        example: "0",
      },
      {
        name: "callMode",
        type: "string",
        required: true,
        description: "Modo de llamada: 'create', 'update' o 'delete'.",
        example: "create",
      },
    ],
    payloadTemplate: {
      itemId: 28491823,
      id: 0,
      n: "Corte de Corriente",
      c: "custom_msg",
      l: "tcp",
      p: "RELAY,1#",
      a: 0,
      f: 0,
      callMode: "create",
    },
    sampleResponse: [0, { id: 14, n: "Corte de Corriente", c: "custom_msg" }],
    wialonRequirements: [
      "Wialon exige estrictamente el atributo 'f: 0' en el payload. Omitirlo provoca el Error 4.",
      "Para eliminar, se debe pasar 'callMode: delete' y el 'id' asignado.",
    ],
  },
  {
    id: "resource-update-zone",
    category: "geofences",
    svc: "resource/update_zone",
    name: "Gestión de Geocercas (Polígonos / Círculos)",
    description:
      "Crea, modifica o elimina geocercas dentro del recurso (resource/account) de Wialon.",
    httpMethod: "POST",
    baseUrl: "https://hst-api.wialon.com/wialon/ajax.html?svc=resource/update_zone",
    requiredParams: [
      {
        name: "itemId",
        type: "integer",
        required: true,
        description: "ID del recurso (avl_resource) donde se almacena la geocerca.",
        example: "284192",
      },
      {
        name: "id",
        type: "integer",
        required: true,
        description: "ID de la geocerca (0 para nueva creación).",
        example: "0",
      },
      {
        name: "n",
        type: "string",
        required: true,
        description: "Nombre descriptivo de la geocerca.",
        example: "CEDIS Guadalajara",
      },
      {
        name: "t",
        type: "integer",
        required: true,
        description: "Tipo de geocerca: 1 = Línea/Ruta, 2 = Polígono, 3 = Círculo.",
        example: "3",
      },
      {
        name: "p",
        type: "array",
        required: true,
        description: "Puntos geográficos [{x, y, r}] (r = radio en metros para círculos).",
        example: "[{x: -103.3496, y: 20.6597, r: 250}]",
      },
      {
        name: "callMode",
        type: "string",
        required: true,
        description: "Acción a realizar: 'create', 'update' o 'delete'.",
        example: "create",
      },
    ],
    payloadTemplate: {
      itemId: 284192,
      id: 0,
      n: "CEDIS Guadalajara",
      d: "Geocerca de almacén principal",
      t: 3,
      w: 0,
      f: 16,
      c: 2569011,
      tc: 0,
      ts: 12,
      min: 0,
      max: 18,
      p: [{ x: -103.3496, y: 20.6597, r: 250 }],
      callMode: "create",
    },
    sampleResponse: [1, { id: 891, n: "CEDIS Guadalajara", t: 3 }],
    wialonRequirements: [
      "Las geocercas pertenecen a un 'avl_resource' (no a una unidad directamente).",
      "Para polígonos, 'p' requiere mínimo 3 vértices {x, y}.",
      "Los colores se representan como enteros de 24 bits (RGBA sin alfa o formato BGR según versión).",
    ],
  },
  {
    id: "report-exec-report",
    category: "reports",
    svc: "report/exec_report",
    name: "Motor de Reportes y Auditoría",
    description:
      "Ejecuta una plantilla de reporte sobre una unidad o grupo (viajes, combustible, excesos de velocidad) y genera tablas en el servidor.",
    httpMethod: "POST",
    baseUrl: "https://hst-api.wialon.com/wialon/ajax.html?svc=report/exec_report",
    requiredParams: [
      {
        name: "reportResourceId",
        type: "integer",
        required: true,
        description: "ID del recurso que contiene la plantilla de reporte.",
        example: "284192",
      },
      {
        name: "reportTemplateId",
        type: "integer",
        required: true,
        description: "ID de la plantilla de reporte.",
        example: "1",
      },
      {
        name: "reportObjectId",
        type: "integer",
        required: true,
        description: "ID del elemento analizado (unidad o grupo).",
        example: "28491823",
      },
      {
        name: "interval.from",
        type: "integer",
        required: true,
        description: "Fecha de inicio en timestamp UNIX.",
        example: "1713484800",
      },
      {
        name: "interval.to",
        type: "integer",
        required: true,
        description: "Fecha de término en timestamp UNIX.",
        example: "1713531200",
      },
    ],
    payloadTemplate: {
      reportResourceId: 284192,
      reportTemplateId: 1,
      reportObjectId: 28491823,
      reportObjectIntId: 0,
      interval: {
        flags: 0,
        from: 1713484800,
        to: 1713531200,
      },
    },
    sampleResponse: {
      reportResult: {
        tables: [
          {
            name: "unit_trips",
            label: "Viajes",
            flags: 16,
            rows: 12,
            cols: 7,
          },
        ],
      },
    },
    wialonRequirements: [
      "Ejecutar un reporte mantiene el resultado en memoria temporal de Wialon.",
      "Para paginar las filas generadas, se debe llamar seguidamente a 'report/get_result_rows'.",
      "Al terminar, siempre se debe invocar 'report/cleanup_result' para liberar memoria en el servidor Wialon.",
    ],
  },
  {
    id: "core-get-account-data",
    category: "account",
    svc: "core/get_account_data",
    name: "Datos de Cuenta, Facturación y Límites",
    description:
      "Obtiene el estado de la cuenta, plan de facturación, balance, servicios contratados y banderas administrativas en Wialon.",
    httpMethod: "POST",
    baseUrl: "https://hst-api.wialon.com/wialon/ajax.html?svc=core/get_account_data",
    requiredParams: [
      {
        name: "type",
        type: "integer",
        required: true,
        description: "Tipo de datos requeridos: 1 = Datos completos de facturación y balance.",
        example: "1",
      },
    ],
    payloadTemplate: {
      type: 1,
    },
    sampleResponse: {
      id: 284192,
      nm: "orblite_telematics",
      plan: "Standard Cloud Fleet",
      bal: 4850.0,
      days: 365,
      historyPeriod: 90,
      flags: 1,
    },
    wialonRequirements: [
      "Requiere sesión con permisos de operador o administrador sobre la cuenta.",
      "El valor 'type: 1' devuelve la cuota de unidades permitidas y días restantes de vigencia.",
    ],
  },
  {
    id: "messages-get-messages",
    category: "history",
    svc: "messages/get_messages",
    name: "Paginación de Mensajes de Telemetría",
    description:
      "Obtiene un segmento de mensajes GPS/sensores previamente cargados en la memoria del servidor con messages/load_interval.",
    httpMethod: "POST",
    baseUrl: "https://hst-api.wialon.com/wialon/ajax.html?svc=messages/get_messages",
    requiredParams: [
      {
        name: "indexFrom",
        type: "integer",
        required: true,
        description: "Índice inicial dentro del buffer en memoria (0-indexed).",
        example: "0",
      },
      {
        name: "indexTo",
        type: "integer",
        required: true,
        description: "Índice final del lote de mensajes a descargar.",
        example: "99",
      },
    ],
    payloadTemplate: {
      indexFrom: 0,
      indexTo: 99,
    },
    sampleResponse: [
      {
        t: 1713484900,
        f: 3,
        tp: "ud",
        pos: { x: -99.1332, y: 19.4326, z: 2240, s: 52, c: 110, sc: 14 },
        p: { pwr_ext: 12.8, battery: 4.2 },
      },
    ],
    wialonRequirements: [
      "Solo funciona después de haber invocado con éxito 'messages/load_interval'.",
      "Permite paginación ultra rápida porque los datos residen en la RAM del servidor de Wialon.",
    ],
  },
  {
    id: "messages-unload",
    category: "history",
    svc: "messages/unload",
    name: "Liberación de Memoria de Mensajes",
    description:
      "Descarga y libera el buffer de mensajes de telemetría de la memoria de Wialon.",
    httpMethod: "POST",
    baseUrl: "https://hst-api.wialon.com/wialon/ajax.html?svc=messages/unload",
    requiredParams: [],
    payloadTemplate: {},
    sampleResponse: { error: 0 },
    wialonRequirements: [
      "Práctica recomendada por Gurtam para evitar fugas de memoria en la sesión del cliente.",
    ],
  },
  {
    id: "core-logout",
    category: "auth",
    svc: "core/logout",
    name: "Cierre de Sesión (Logout)",
    description:
      "Invalida inmediatamente el Session ID (eid) activo en los servidores de Wialon.",
    httpMethod: "POST",
    baseUrl: "https://hst-api.wialon.com/wialon/ajax.html?svc=core/logout",
    requiredParams: [],
    payloadTemplate: {},
    sampleResponse: { error: 0 },
    wialonRequirements: [
      "Libera el hilo de concurrencia y previene el error 1003 en llamadas futuras.",
    ],
  },
  {
    id: "unit-get-video-settings",
    category: "video",
    svc: "unit/get_video_settings",
    name: "Configuración de Video y Cámaras",
    description:
      "Consulta los canales de video (dashcam, cabina, reversa) configurados para streaming en vivo.",
    httpMethod: "POST",
    baseUrl: "https://hst-api.wialon.com/wialon/ajax.html?svc=unit/get_video_settings",
    requiredParams: [
      {
        name: "itemId",
        type: "integer",
        required: true,
        description: "ID de la unidad con módulo de video / MDVR.",
        example: "28491823",
      },
    ],
    payloadTemplate: {
      itemId: 28491823,
    },
    sampleResponse: {
      channels: [
        { id: 1, name: "Cámara Frontal (Carretera)", active: 1 },
        { id: 2, name: "Cámara Cabina (Conductor)", active: 1 },
      ],
    },
    wialonRequirements: [
      "La unidad debe contar con hardware MDVR soportado por el protocolo de video de Wialon.",
    ],
  },
];

export const getWialonApiCatalog = createServerFn({ method: "GET" }).handler(async () => {
  return {
    catalog: WIALON_API_CATALOG,
    errorCodes: [
      { code: 1, name: "Invalid session", desc: "El SID expiró o no existe. El Swarm debe renovar sesión." },
      { code: 2, name: "Invalid service name", desc: "El parámetro svc no existe en la Remote API." },
      { code: 3, name: "Invalid result", desc: "La respuesta generada por Wialon no pudo serializarse." },
      { code: 4, name: "Invalid input", desc: "Parámetros obligatorios faltantes o tipos incorrectos (ej. falta f:0)." },
      { code: 5, name: "Error performing request", desc: "Fallo interno en el cluster de Wialon." },
      { code: 7, name: "Access denied", desc: "El token o usuario no tiene permisos ACL para este objeto." },
      { code: 1001, name: "No messages for selected interval", desc: "Sin telemetría en el rango solicitado." },
      { code: 1003, name: "Only one request is allowed at the moment", desc: "Wialon rechaza ráfagas concurrentes sobre la misma sesión." },
      { code: 1004, name: "Limit of messages has been reached", desc: "Límite de tasa de consultas por minuto excedido." },
    ],
    swarmArchitecture: {
      name: "ORB-LITE Serverless Telemetry Swarm",
      engine: "Nitro / TanStack Start Serverless Functions",
      wialonEndpoint: "https://hst-api.wialon.com/wialon/ajax.html",
      features: [
        "Warm SID Reuse (Caché en contenedor serverless con TTL 90 min)",
        "Auto-Recover on Error 1 (Renovación atómica sin interrupción al CRM)",
        "Rate-Limit Serializer (Cola anti-error 1003/1004)",
        "Fallback JSONP Directo para el navegador si el proxy backend es bloqueado",
      ],
    },
  };
});

export const testWialonApiEndpoint = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        host: z.enum(["lite", "full"]).default("full"),
        svc: z.string(),
        params: z.record(z.any()),
        sid: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const startTime = Date.now();
    try {
      const res = await wialonCall(
        data.host as WialonHost,
        data.svc,
        data.params,
        data.sid,
      );
      return {
        success: true,
        statusCode: 200,
        latencyMs: Date.now() - startTime,
        data: res,
      };
    } catch (err: any) {
      return {
        success: false,
        statusCode: err instanceof WialonError ? err.code : 500,
        latencyMs: Date.now() - startTime,
        error: err.message,
        details: err instanceof WialonError ? err.raw : undefined,
      };
    }
  });
