import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { c as recordType, i as enumType, l as stringType, n as arrayType, s as objectType, t as anyType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { n as Type, t as GoogleGenAI } from "../_libs/@google/genai.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assistant.functions-CPNUItYl.js
var SYSTEM_INSTRUCTION = `
Eres el Copilot y Asistente Operativo de Inteligencia de ORB-LITE (plataforma mexicana líder en rastreo satelital GPS para flotas, vehículos particulares y carga pesada).

Tu objetivo principal es asistir al usuario en cualquier proceso de la plataforma, guiándolo amablemente, pidiéndole los datos que faltan, y generando un formulario interactivo estructurado listo para ser ejecutado contra las APIs del sistema.

PROCESOS QUE PUEDES EJECUTAR:
1. "renewal" (Registrar Renovación de GPS / Chip):
   - platform: "ORB-LITE" o "ORB-FULL" (por defecto "ORB-LITE")
   - renewalPeriod: "monthly" o "annual" (por defecto "monthly")
   - renewalDate: Mes de corte formato "YYYY-MM" (por defecto mes actual o próximo)
   - unitName: Nombre de la unidad (ej. "Torton Kenworth 01", "Nissan Frontier")
   - imei: 15 dígitos del equipo GPS
   - iccid: Número de chip SIM
   - simPhone: Teléfono del chip (opcional)
   - customerName: Nombre del cliente
   - customerEmail: Correo del cliente
   - customerPhone: Teléfono del cliente
   - customerNumber: Número de cliente (opcional)
   - amount: Importe numérico en MXN (ej. 250, 450, 2400)
   - status: "activa", "adeudo", "cancelada" (por defecto "activa")

2. "crm_customer" (Registrar Cliente / Prospecto en CRM):
   - fullName: Nombre completo o razón social
   - phone: Teléfono celular o WhatsApp
   - email: Correo electrónico
   - company: Empresa o giro (opcional)
   - city: Ciudad o municipio
   - state: Estado
   - notes: Notas de requerimiento, vehículos de interés

3. "demo_request" (Solicitar Demo Oficial de Plataforma):
   - firstName: Nombre
   - lastName: Apellidos
   - phone: Teléfono
   - email: Correo
   - company: Empresa
   - platform: "wialon_lite" o "wialon_full"
   - units: Cantidad estimada de unidades (ej. "5 a 10")
   - message: Mensaje con requerimientos específicos

4. "route_share" (Generar Enlace de Rastreo Compartido):
   - unitName: Nombre o ID del vehículo
   - reportEmail: Correo para recibir confirmación/reporte
   - durationHours: Duración de vigencia del enlace (ej. 2, 4, 8, 12, 24, 48)
   - clientNotes: Comentario o nota del cliente/destinatario

5. "smart_route" (Rutas por Cliente / Recurso - Planificador Inteligente):
   - originAddress: Punto de salida (ej. "Av. Vallarta 1000, Guadalajara" o coordenadas)
   - destinations: Direcciones de destino (una o varias direcciones, lugares o links de Google Maps)
   - returnToOrigin: "true" o "false" (si regresa al punto de salida al terminar)
   - creationMethod: "Direcciones escritas" o "Puntos en mapa"
   - routeName: Nombre con el que se guardará la ruta en Wialon

6. "geofence" (Geocercas por Cliente / Recurso):
   - name: Nombre de la geocerca (ej. "Bodega Guadalajara / Cliente Norte")
   - resourceName: Guardar en cliente / recurso de Wialon (ej. "AlfredoRetana", "Recurso Principal")
   - type: Forma de geocerca ("circle" = Círculo, "polygon" = Polígono)
   - centerCoordinates: Coordenadas del centro o puntos ("lat, lon")
   - radiusMeters: Radio en metros (para círculos, mínimo 10)
   - color: Color de trazo (ej. "#92d700")

7. "unit_history" (Historial de Recorridos):
   - unitName: Unidad (ej. "Attitude Isaac")
   - from: Desde (fecha y hora en formato YYYY-MM-DDTHH:mm)
   - to: Hasta (fecha y hora en formato YYYY-MM-DDTHH:mm)

8. "wialon_report" (Reportes y Gráficas para Excel):
   - unitName: Unidad a consultar
   - from: Fecha y hora de inicio (YYYY-MM-DDTHH:mm)
   - to: Fecha y hora final (YYYY-MM-DDTHH:mm)
   - template: Plantilla de reporte para Excel (ej. "Solo tabla de posiciones y sensores", "Viajes y paradas", "Control de combustible")

9. "quick_quote" (Cotización de Equipos / Tienda GPS):
   - equipmentType: Dispositivo deseado ("FMB920", "OBD-II Plug & Play", "4G Solar Magnético", "SIM Multicarrier")
   - quantity: Cantidad de equipos
   - contactName: Nombre de contacto
   - phone: Teléfono WhatsApp
   - email: Correo
   - notes: Notas adicionales

DIRECTRICES:
- Habla siempre en español mexicano, profesional, ágil y servicial.
- Si el usuario menciona datos suficientes para un proceso (por ejemplo: "quiero registrar un cliente llamado Juan Pérez con tel 3312345678"), extrae todos los datos que puedas, genera el proceso en la respuesta y pregúntale por los que falten o confirma si desea enviarlo.
- Si solo pide ayuda con un proceso (ej. "quiero renovar un gps"), pregúntale los datos clave y dale el formulario prellenado para que pueda llenarlo conversando o directamente en pantalla.
- Devuelve SIEMPRE tu respuesta en formato JSON estrictamente válido que coincida con el schema requerido.
`;
function getFieldDefinitions(processId, values) {
	switch (processId) {
		case "renewal": return [
			{
				key: "platform",
				label: "Plataforma",
				type: "select",
				options: [{
					label: "ORB-LITE (Básica)",
					value: "ORB-LITE"
				}, {
					label: "ORB-FULL (Avanzada)",
					value: "ORB-FULL"
				}],
				value: values.platform || "ORB-LITE",
				required: true
			},
			{
				key: "renewalPeriod",
				label: "Periodo",
				type: "select",
				options: [{
					label: "Mensual",
					value: "monthly"
				}, {
					label: "Anual",
					value: "annual"
				}],
				value: values.renewalPeriod || "monthly",
				required: true
			},
			{
				key: "renewalDate",
				label: "Mes de corte (inicia día 1)",
				type: "month",
				value: values.renewalDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 7),
				required: true
			},
			{
				key: "unitName",
				label: "Nombre del equipo en plataforma",
				type: "text",
				value: values.unitName || "",
				placeholder: "Ej. Camioneta Hilux 01",
				required: true
			},
			{
				key: "imei",
				label: "IMEI del equipo (15 dígitos)",
				type: "text",
				value: values.imei || "",
				placeholder: "8642010...",
				required: true
			},
			{
				key: "iccid",
				label: "ICCID del chip SIM",
				type: "text",
				value: values.iccid || "",
				placeholder: "8952..."
			},
			{
				key: "simPhone",
				label: "Teléfono del chip (opcional)",
				type: "tel",
				value: values.simPhone || "",
				placeholder: "33..."
			},
			{
				key: "customerName",
				label: "Nombre del cliente",
				type: "text",
				value: values.customerName || "",
				placeholder: "Nombre o empresa",
				required: true
			},
			{
				key: "customerEmail",
				label: "Correo electrónico del cliente",
				type: "email",
				value: values.customerEmail || "",
				placeholder: "correo@empresa.com"
			},
			{
				key: "customerPhone",
				label: "Teléfono del cliente",
				type: "tel",
				value: values.customerPhone || "",
				placeholder: "33..."
			},
			{
				key: "amount",
				label: "Importe ($ MXN)",
				type: "number",
				value: values.amount ?? 250,
				required: true
			},
			{
				key: "status",
				label: "Estado",
				type: "select",
				options: [
					{
						label: "Activa",
						value: "activa"
					},
					{
						label: "Adeudo",
						value: "adeudo"
					},
					{
						label: "Cancelada",
						value: "cancelada"
					}
				],
				value: values.status || "activa"
			}
		];
		case "crm_customer": return [
			{
				key: "fullName",
				label: "Nombre completo / Razón Social",
				type: "text",
				value: values.fullName || "",
				placeholder: "Juan Pérez García",
				required: true
			},
			{
				key: "phone",
				label: "Teléfono WhatsApp",
				type: "tel",
				value: values.phone || "",
				placeholder: "3312345678",
				required: true
			},
			{
				key: "email",
				label: "Correo electrónico",
				type: "email",
				value: values.email || "",
				placeholder: "juan@ejemplo.com"
			},
			{
				key: "company",
				label: "Empresa / Flotilla",
				type: "text",
				value: values.company || "",
				placeholder: "Transportes del Pacífico"
			},
			{
				key: "city",
				label: "Ciudad",
				type: "text",
				value: values.city || "",
				placeholder: "Guadalajara"
			},
			{
				key: "state",
				label: "Estado",
				type: "text",
				value: values.state || "",
				placeholder: "Jalisco"
			},
			{
				key: "notes",
				label: "Notas de seguimiento o requerimiento",
				type: "textarea",
				value: values.notes || "",
				placeholder: "Interesado en 4 equipos para camionetas de reparto..."
			}
		];
		case "demo_request": return [
			{
				key: "firstName",
				label: "Nombre",
				type: "text",
				value: values.firstName || "",
				placeholder: "Carlos",
				required: true
			},
			{
				key: "lastName",
				label: "Apellidos",
				type: "text",
				value: values.lastName || "",
				placeholder: "Mendoza",
				required: true
			},
			{
				key: "phone",
				label: "Teléfono WhatsApp",
				type: "tel",
				value: values.phone || "",
				placeholder: "3311223344",
				required: true
			},
			{
				key: "email",
				label: "Correo corporativo",
				type: "email",
				value: values.email || "",
				placeholder: "carlos@empresa.com",
				required: true
			},
			{
				key: "company",
				label: "Empresa",
				type: "text",
				value: values.company || "",
				placeholder: "Distribuidora del Centro"
			},
			{
				key: "platform",
				label: "Plataforma a probar",
				type: "select",
				options: [{
					label: "ORB-LITE (Monitoreo Esencial)",
					value: "wialon_lite"
				}, {
					label: "ORB-FULL (Telemetría & Combustible)",
					value: "wialon_full"
				}],
				value: values.platform || "wialon_lite"
			},
			{
				key: "units",
				label: "Unidades en flotilla",
				type: "text",
				value: values.units || "1 a 5 unidades",
				placeholder: "Ej. 10 unidades"
			},
			{
				key: "message",
				label: "Requerimientos particulares",
				type: "textarea",
				value: values.message || "",
				placeholder: "¿Qué necesitas monitorear o resolver?"
			}
		];
		case "route_share": return [
			{
				key: "unitName",
				label: "Nombre o placa de la unidad a compartir",
				type: "text",
				value: values.unitName || "",
				placeholder: "Kenworth T680 #14",
				required: true
			},
			{
				key: "reportEmail",
				label: "Correo del destinatario (notificaciones)",
				type: "email",
				value: values.reportEmail || "",
				placeholder: "logistica@cliente.com",
				required: true
			},
			{
				key: "durationHours",
				label: "Vigencia del enlace",
				type: "select",
				options: [
					{
						label: "2 horas",
						value: "2"
					},
					{
						label: "4 horas",
						value: "4"
					},
					{
						label: "8 horas",
						value: "8"
					},
					{
						label: "24 horas (1 día)",
						value: "24"
					},
					{
						label: "48 horas (2 días)",
						value: "48"
					}
				],
				value: String(values.durationHours || "24")
			},
			{
				key: "clientNotes",
				label: "Referencia o nota para el cliente",
				type: "text",
				value: values.clientNotes || "",
				placeholder: "Entrega de pedido #8493"
			}
		];
		case "smart_route": return [
			{
				key: "creationMethod",
				label: "Método de Creación",
				type: "select",
				options: [{
					label: "Direcciones escritas",
					value: "Direcciones escritas"
				}, {
					label: "Puntos en mapa",
					value: "Puntos en mapa"
				}],
				value: values.creationMethod || "Direcciones escritas"
			},
			{
				key: "originAddress",
				label: "Punto de Salida",
				type: "text",
				value: values.originAddress || "",
				placeholder: "Ej. Av. Vallarta 1000, Guadalajara o coordenadas (20.6...)",
				required: true
			},
			{
				key: "destinations",
				label: "Direcciones de Destino (una o varias)",
				type: "textarea",
				value: values.destinations || "",
				placeholder: "Dirección 1, lugar o link Google Maps",
				required: true
			},
			{
				key: "returnToOrigin",
				label: "Regresar al punto de salida",
				type: "select",
				options: [{
					label: "Sí (Regresar al origen)",
					value: "true"
				}, {
					label: "No (Ruta punto a punto)",
					value: "false"
				}],
				value: String(values.returnToOrigin ?? "true")
			},
			{
				key: "routeName",
				label: "Nombre de la Ruta (opcional)",
				type: "text",
				value: values.routeName || "",
				placeholder: "Ej. Ruta Reparto Zapopan Norte"
			}
		];
		case "geofence": return [
			{
				key: "name",
				label: "Nombre de la Geocerca",
				type: "text",
				value: values.name || "",
				placeholder: "Ej. Bodega Guadalajara / Cliente Norte",
				required: true
			},
			{
				key: "resourceName",
				label: "Guardar en cliente / Recurso de Wialon",
				type: "text",
				value: values.resourceName || "AlfredoRetana",
				placeholder: "Ej. AlfredoRetana",
				required: true
			},
			{
				key: "type",
				label: "Forma de Geocerca",
				type: "select",
				options: [{
					label: "🔘 Círculo (Radio de control)",
					value: "circle"
				}, {
					label: "🔘 Polígono (Perímetro personalizado)",
					value: "polygon"
				}],
				value: values.type || "circle",
				required: true
			},
			{
				key: "radiusMeters",
				label: "Radio en metros (para círculos)",
				type: "number",
				value: values.radiusMeters ?? 150
			},
			{
				key: "centerCoordinates",
				label: "Coordenadas (Latitud, Longitud)",
				type: "text",
				value: values.centerCoordinates || "20.6736, -103.3440",
				placeholder: "20.6736, -103.3440",
				required: true
			}
		];
		case "unit_history": return [
			{
				key: "unitName",
				label: "Unidad",
				type: "text",
				value: values.unitName || "",
				placeholder: "Ej. Attitude Isaac",
				required: true
			},
			{
				key: "from",
				label: "Desde (Fecha y Hora)",
				type: "text",
				value: values.from || (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString().slice(0, 16),
				placeholder: "YYYY-MM-DDTHH:mm",
				required: true
			},
			{
				key: "to",
				label: "Hasta (Fecha y Hora)",
				type: "text",
				value: values.to || (/* @__PURE__ */ new Date()).toISOString().slice(0, 16),
				placeholder: "YYYY-MM-DDTHH:mm",
				required: true
			}
		];
		case "wialon_report": return [
			{
				key: "unitName",
				label: "Unidad",
				type: "text",
				value: values.unitName || "",
				placeholder: "Selecciona o escribe el nombre de la unidad",
				required: true
			},
			{
				key: "from",
				label: "Desde (Fecha y Hora)",
				type: "text",
				value: values.from || (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString().slice(0, 16),
				placeholder: "YYYY-MM-DDTHH:mm",
				required: true
			},
			{
				key: "to",
				label: "Hasta (Fecha y Hora)",
				type: "text",
				value: values.to || (/* @__PURE__ */ new Date()).toISOString().slice(0, 16),
				placeholder: "YYYY-MM-DDTHH:mm",
				required: true
			},
			{
				key: "template",
				label: "Plantilla de reporte para Excel (opcional)",
				type: "select",
				options: [
					{
						label: "Solo tabla de posiciones y sensores",
						value: "Solo tabla de posiciones y sensores"
					},
					{
						label: "Viajes y kilometraje",
						value: "Viajes y kilometraje"
					},
					{
						label: "Paradas y estacionamientos",
						value: "Paradas y estacionamientos"
					},
					{
						label: "Control y nivel de combustible",
						value: "Control y nivel de combustible"
					},
					{
						label: "Excesos de velocidad",
						value: "Excesos de velocidad"
					}
				],
				value: values.template || "Solo tabla de posiciones y sensores"
			}
		];
		case "quick_quote": return [
			{
				key: "equipmentType",
				label: "Dispositivo o Solución",
				type: "select",
				options: [
					{
						label: "GPS Teltonika FMB920 (Instalación Oculta)",
						value: "FMB920"
					},
					{
						label: "GPS OBD-II Plug & Play (Sin cortar cables)",
						value: "OBD-II"
					},
					{
						label: "GPS Magnético Recargable 4G (Portátil)",
						value: "Solar/Magnético"
					},
					{
						label: "SIM Multicarrier IoT Telcel/AT&T/Movistar",
						value: "SIM Multicarrier"
					},
					{
						label: "Sensor de Combustible de Alta Precisión",
						value: "Sensor Combustible"
					}
				],
				value: values.equipmentType || "FMB920",
				required: true
			},
			{
				key: "quantity",
				label: "Cantidad estimada",
				type: "number",
				value: values.quantity ?? 1,
				required: true
			},
			{
				key: "contactName",
				label: "Tu nombre",
				type: "text",
				value: values.contactName || "",
				placeholder: "Alejandro Ruiz",
				required: true
			},
			{
				key: "phone",
				label: "Teléfono WhatsApp",
				type: "tel",
				value: values.phone || "",
				placeholder: "33...",
				required: true
			},
			{
				key: "email",
				label: "Correo electrónico",
				type: "email",
				value: values.email || "",
				placeholder: "alex@empresa.com"
			},
			{
				key: "notes",
				label: "Detalles adicionales para la cotización",
				type: "textarea",
				value: values.notes || "",
				placeholder: "Tipo de vehículos, si requieren instalación a domicilio..."
			}
		];
	}
}
function analyzeProcessRequirements(processId, fields) {
	let checklist = [];
	switch (processId) {
		case "renewal":
			checklist = [
				{
					field: "imei",
					label: "IMEI del Dispositivo GPS (15 dígitos)",
					why: "Identificador único satelital indispensable para vincular la unidad con el servidor y validar su conexión activa.",
					isRequired: true,
					isComplete: Boolean(fields.imei && String(fields.imei).trim().length >= 10)
				},
				{
					field: "unitName",
					label: "Nombre de la Unidad",
					why: "Nombre reconocible del vehículo o placa para desplegar en el mapa y en la bitácora de la flota.",
					isRequired: true,
					isComplete: Boolean(fields.unitName && String(fields.unitName).trim().length > 0)
				},
				{
					field: "customerName",
					label: "Nombre del Cliente / Titular",
					why: "Asocia la suscripción a un titular para registro de facturación y control de historial.",
					isRequired: true,
					isComplete: Boolean(fields.customerName && String(fields.customerName).trim().length > 0)
				},
				{
					field: "renewalDate",
					label: "Mes de Corte (Día 1 de cada mes)",
					why: "Regla del sistema: los cortes de servicio satelital siempre corren el día primero de cada mes.",
					isRequired: true,
					isComplete: Boolean(fields.renewalDate && String(fields.renewalDate).trim().length >= 7)
				},
				{
					field: "amount",
					label: "Importe del Servicio ($ MXN)",
					why: "Monto pactado por la mensualidad o anualidad para generar la orden y registro en caja.",
					isRequired: true,
					isComplete: Boolean(fields.amount && Number(fields.amount) > 0)
				},
				{
					field: "iccid",
					label: "ICCID del Chip SIM",
					why: "Permite gestionar la línea celular multicarrier y verificar que cuente con paquete de datos IoT activo.",
					isRequired: false,
					isComplete: Boolean(fields.iccid && String(fields.iccid).trim().length > 0)
				},
				{
					field: "customerEmail",
					label: "Correo Electrónico del Cliente",
					why: "Canal automático donde el servidor envía las alertas de recordatorio de pago (10, 5, 3 y 1 día antes).",
					isRequired: false,
					isComplete: Boolean(fields.customerEmail && String(fields.customerEmail).includes("@"))
				},
				{
					field: "customerPhone",
					label: "Teléfono WhatsApp",
					why: "Para avisos de cobranza directa o soporte de telemetría de emergencia.",
					isRequired: false,
					isComplete: Boolean(fields.customerPhone && String(fields.customerPhone).trim().length >= 8)
				}
			];
			break;
		case "crm_customer":
			checklist = [
				{
					field: "fullName",
					label: "Nombre Completo o Razón Social",
					why: "Identificador oficial del cliente para su expediente comercial en la base de datos.",
					isRequired: true,
					isComplete: Boolean(fields.fullName && String(fields.fullName).trim().length > 0)
				},
				{
					field: "phone",
					label: "Teléfono / WhatsApp de Contacto",
					why: "Línea directa para prospección, confirmación de pedidos y soporte postventa.",
					isRequired: true,
					isComplete: Boolean(fields.phone && String(fields.phone).trim().length >= 8)
				},
				{
					field: "email",
					label: "Correo Electrónico",
					why: "Para envío de cotizaciones en PDF, facturación CFDI y confirmaciones de pago.",
					isRequired: false,
					isComplete: Boolean(fields.email && String(fields.email).includes("@"))
				},
				{
					field: "company",
					label: "Empresa / Flotilla",
					why: "Clasificación de negocio para asignarle condiciones de crédito o descuentos por flotilla.",
					isRequired: false,
					isComplete: Boolean(fields.company && String(fields.company).trim().length > 0)
				}
			];
			break;
		case "demo_request":
			checklist = [
				{
					field: "firstName",
					label: "Nombre del Interesado",
					why: "Personalización del trato y registro del prospecto en la plataforma.",
					isRequired: true,
					isComplete: Boolean(fields.firstName && String(fields.firstName).trim().length > 0)
				},
				{
					field: "phone",
					label: "Teléfono Móvil",
					why: "Verificación de autenticidad y envío de usuario/contraseña vía WhatsApp.",
					isRequired: true,
					isComplete: Boolean(fields.phone && String(fields.phone).trim().length >= 8)
				},
				{
					field: "email",
					label: "Correo Electrónico",
					why: "Envío formal de credenciales temporales y manual de uso de Wialon.",
					isRequired: true,
					isComplete: Boolean(fields.email && String(fields.email).includes("@"))
				},
				{
					field: "platform",
					label: "Tipo de Plataforma Solicitada",
					why: "Diferencia entre versión esencial (ORB-LITE) y versión avanzada con combustible (ORB-FULL).",
					isRequired: true,
					isComplete: Boolean(fields.platform)
				}
			];
			break;
		case "route_share":
			checklist = [
				{
					field: "unitName",
					label: "Nombre de la Unidad a Compartir",
					why: "Vehículo satelital cuyas coordenadas se transmitirán en tiempo real al enlace.",
					isRequired: true,
					isComplete: Boolean(fields.unitName && String(fields.unitName).trim().length > 0)
				},
				{
					field: "reportEmail",
					label: "Correo de Notificación",
					why: "Correo al que se notificarán paradas, aperturas de enlace y eventos clave.",
					isRequired: true,
					isComplete: Boolean(fields.reportEmail && String(fields.reportEmail).includes("@"))
				},
				{
					field: "durationHours",
					label: "Vigencia del Enlace Temporal",
					why: "Medida estricta de seguridad: el enlace expira tras cumplirse el tiempo elegido.",
					isRequired: true,
					isComplete: Boolean(fields.durationHours)
				}
			];
			break;
		case "smart_route":
			checklist = [
				{
					field: "originAddress",
					label: "Punto de Salida",
					why: "Dirección o coordenadas de partida donde inicia el vehículo o repartidor.",
					isRequired: true,
					isComplete: Boolean(fields.originAddress && String(fields.originAddress).trim().length > 0)
				},
				{
					field: "destinations",
					label: "Direcciones de Destino",
					why: "Destinos o paradas a visitar (se pueden escribir direcciones o pegar enlaces de Google Maps).",
					isRequired: true,
					isComplete: Boolean(fields.destinations && String(fields.destinations).trim().length > 0)
				},
				{
					field: "returnToOrigin",
					label: "Regresar al Punto de Salida",
					why: "Determina si el cálculo de kilometraje y tiempo considera el viaje de regreso a la base.",
					isRequired: false,
					isComplete: Boolean(fields.returnToOrigin)
				}
			];
			break;
		case "geofence":
			checklist = [
				{
					field: "name",
					label: "Nombre de la Geocerca",
					why: "Etiqueta visible en el mapa y en los reportes de entradas/salidas de zona (ej. Bodega Guadalajara).",
					isRequired: true,
					isComplete: Boolean(fields.name && String(fields.name).trim().length > 0)
				},
				{
					field: "resourceName",
					label: "Guardar en Cliente / Recurso Wialon",
					why: "Cuenta o recurso de Wialon donde se almacenará la zona (ej. AlfredoRetana).",
					isRequired: true,
					isComplete: Boolean(fields.resourceName && String(fields.resourceName).trim().length > 0)
				},
				{
					field: "type",
					label: "Forma de Geocerca (Círculo o Polígono)",
					why: "Tipo geométrico de la geocerca para calcular intersección y alertas perimetrales.",
					isRequired: true,
					isComplete: Boolean(fields.type)
				},
				{
					field: "centerCoordinates",
					label: "Coordenadas (Latitud, Longitud)",
					why: "Punto central o vértices geográficos donde se traza el perímetro en el mapa.",
					isRequired: true,
					isComplete: Boolean(fields.centerCoordinates && String(fields.centerCoordinates).includes(","))
				}
			];
			break;
		case "unit_history":
			checklist = [
				{
					field: "unitName",
					label: "Unidad Satelital",
					why: "Vehículo específico del cual se descargarán los mensajes y posiciones de Wialon.",
					isRequired: true,
					isComplete: Boolean(fields.unitName && String(fields.unitName).trim().length > 0)
				},
				{
					field: "from",
					label: "Fecha y Hora de Inicio (Desde)",
					why: "Momento exacto en que empieza la ventana de tiempo a consultar.",
					isRequired: true,
					isComplete: Boolean(fields.from && String(fields.from).trim().length >= 10)
				},
				{
					field: "to",
					label: "Fecha y Hora de Fin (Hasta)",
					why: "Momento exacto en que concluye la ventana de tiempo a consultar.",
					isRequired: true,
					isComplete: Boolean(fields.to && String(fields.to).trim().length >= 10)
				}
			];
			break;
		case "wialon_report":
			checklist = [
				{
					field: "unitName",
					label: "Unidad para el Reporte",
					why: "Unidad sobre la cual se consolidará la información de velocidad, sensores y kilometraje.",
					isRequired: true,
					isComplete: Boolean(fields.unitName && String(fields.unitName).trim().length > 0)
				},
				{
					field: "from",
					label: "Periodo Desde",
					why: "Inicio de la fecha de corte para extraer datos de telemetría.",
					isRequired: true,
					isComplete: Boolean(fields.from && String(fields.from).trim().length >= 10)
				},
				{
					field: "to",
					label: "Periodo Hasta",
					why: "Fin de la fecha de corte para el cálculo.",
					isRequired: true,
					isComplete: Boolean(fields.to && String(fields.to).trim().length >= 10)
				},
				{
					field: "template",
					label: "Plantilla de Reporte Excel",
					why: "Formato y columnas a estructurar (ej. Solo tabla de posiciones y sensores, viajes, combustible).",
					isRequired: false,
					isComplete: Boolean(fields.template && String(fields.template).trim().length > 0)
				}
			];
			break;
		case "quick_quote": checklist = [
			{
				field: "equipmentType",
				label: "Modelo de GPS o Sensor",
				why: "Determina las características de instalación, bandas 4G y compatibilidad vehicular.",
				isRequired: true,
				isComplete: Boolean(fields.equipmentType)
			},
			{
				field: "quantity",
				label: "Cantidad de Unidades",
				why: "Permite aplicar el tabulador de precios por volumen y mayoreo.",
				isRequired: true,
				isComplete: Boolean(fields.quantity && Number(fields.quantity) >= 1)
			},
			{
				field: "contactName",
				label: "Nombre de Contacto",
				why: "Para dirigir la propuesta formal y cotización personalizada.",
				isRequired: true,
				isComplete: Boolean(fields.contactName && String(fields.contactName).trim().length > 0)
			},
			{
				field: "phone",
				label: "Teléfono WhatsApp",
				why: "Para entrega express de la cotización en PDF con asesoría técnica inmediata.",
				isRequired: true,
				isComplete: Boolean(fields.phone && String(fields.phone).trim().length >= 8)
			}
		];
	}
	const requiredItems = checklist.filter((i) => i.isRequired);
	const optionalItems = checklist.filter((i) => !i.isRequired);
	const completedRequired = requiredItems.filter((i) => i.isComplete).length;
	const completedOptional = optionalItems.filter((i) => i.isComplete).length;
	const isReady = completedRequired === requiredItems.length;
	const missingList = requiredItems.filter((i) => !i.isComplete).map((i) => i.label).join(", ");
	const summary = isReady ? "✓ Todos los requisitos obligatorios están completos y validados para ejecutar el proceso contra la API." : `Faltan ${requiredItems.length - completedRequired} dato(s) obligatorio(s) para poder ejecutar el proceso: ${missingList}.`;
	return {
		totalRequired: requiredItems.length,
		completedRequired,
		totalOptional: optionalItems.length,
		completedOptional,
		isReady,
		summary,
		items: checklist
	};
}
/**
* Fallback inteligente si GEMINI_API_KEY no está configurada o falla la conexión externa.
*/
function localRuleFallback(message, history) {
	const lower = message.toLowerCase();
	if (lower.includes("renova") || lower.includes("corte") || lower.includes("imei") || lower.includes("chip")) {
		const imeiMatch = message.match(/\b\d{15}\b/);
		const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
		const phoneMatch = message.match(/\b\d{10}\b/);
		const amountMatch = message.match(/\$?\s*(\d{3,5})/);
		const values = {
			platform: lower.includes("full") ? "ORB-FULL" : "ORB-LITE",
			renewalPeriod: lower.includes("anual") ? "annual" : "monthly",
			renewalDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 7),
			unitName: "",
			imei: imeiMatch ? imeiMatch[0] : "",
			iccid: "",
			simPhone: "",
			customerName: "",
			customerEmail: emailMatch ? emailMatch[0] : "",
			customerPhone: phoneMatch ? phoneMatch[0] : "",
			amount: amountMatch ? Number(amountMatch[1]) : 250,
			status: "activa"
		};
		const hasCritical = Boolean(values.imei);
		const analysis = analyzeProcessRequirements("renewal", values);
		return {
			reply: hasCritical ? "He analizado los requisitos para la renovación satelital. Revisa el análisis y completa los campos obligatorios para registrarlo en el sistema." : "¡Con gusto te ayudo a registrar una renovación de servicio! He analizado los requisitos necesarios y preparado el formulario para que puedas ingresar los datos.",
			process: {
				id: "renewal",
				title: "Registro de Renovación Satelital",
				description: "Programa el corte y cobro de servicio para una unidad GPS.",
				readyToSubmit: analysis.isReady,
				fields: values,
				fieldDefinitions: getFieldDefinitions("renewal", values),
				requirementsAnalysis: analysis,
				missingPrompt: "Indica el IMEI, nombre del cliente y de la unidad para completar el registro."
			}
		};
	}
	if (lower.includes("cliente") || lower.includes("prospecto") || lower.includes("crm") || lower.includes("alta")) {
		const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
		const phoneMatch = message.match(/\b\d{10}\b/);
		const values = {
			fullName: "",
			phone: phoneMatch ? phoneMatch[0] : "",
			email: emailMatch ? emailMatch[0] : "",
			company: "",
			city: "",
			state: "",
			notes: ""
		};
		const analysis = analyzeProcessRequirements("crm_customer", values);
		return {
			reply: "He analizado los requisitos del CRM y abierto la ficha para dar de alta al cliente. Revisa el checklist de datos necesarios a continuación:",
			process: {
				id: "crm_customer",
				title: "Nuevo Cliente / Lead en CRM",
				description: "Crea el perfil del cliente para seguimiento y ventas.",
				readyToSubmit: analysis.isReady,
				fields: values,
				fieldDefinitions: getFieldDefinitions("crm_customer", values),
				requirementsAnalysis: analysis,
				missingPrompt: "¿Cuál es el nombre completo y teléfono del cliente?"
			}
		};
	}
	if (lower.includes("demo") || lower.includes("prueba") || lower.includes("probar")) {
		const values = {
			firstName: "",
			lastName: "",
			phone: "",
			email: "",
			company: "",
			platform: lower.includes("full") ? "wialon_full" : "wialon_lite",
			units: "1 a 5 unidades",
			message: "Solicitud iniciada desde asistente virtual"
		};
		const analysis = analyzeProcessRequirements("demo_request", values);
		return {
			reply: "¡Excelente! Una cuenta demo te permite probar en vivo la ubicación en tiempo real, corte de motor y reportes. He analizado los datos requeridos para activar tu cuenta de prueba:",
			process: {
				id: "demo_request",
				title: "Solicitud de Cuenta Demo",
				description: "Acceso inmediato de prueba a la plataforma satelital.",
				readyToSubmit: analysis.isReady,
				fields: values,
				fieldDefinitions: getFieldDefinitions("demo_request", values),
				requirementsAnalysis: analysis,
				missingPrompt: "Por favor proporciona tu nombre, teléfono y correo para enviar tus credenciales de demo."
			}
		};
	}
	if (lower.includes("compartir") || lower.includes("enlace") || lower.includes("link") || lower.includes("ruta")) {
		const values = {
			unitName: "",
			reportEmail: "",
			durationHours: "24",
			clientNotes: ""
		};
		const analysis = analyzeProcessRequirements("route_share", values);
		return {
			reply: "Puedes generar un enlace público temporal para que tu cliente o supervisor siga la unidad en vivo sin necesidad de contraseña. He analizado los parámetros de seguridad requeridos:",
			process: {
				id: "route_share",
				title: "Generar Enlace de Rastreo Compartido",
				description: "Enlace web temporal con mapa y recorrido en vivo.",
				readyToSubmit: analysis.isReady,
				fields: values,
				fieldDefinitions: getFieldDefinitions("route_share", values),
				requirementsAnalysis: analysis,
				missingPrompt: "¿Qué unidad deseas compartir y qué correo recibirá los avisos?"
			}
		};
	}
	if (lower.includes("planifi") || lower.includes("ruta") && (lower.includes("optimi") || lower.includes("salida") || lower.includes("destino") || lower.includes("punto"))) {
		const values = {
			creationMethod: "Direcciones escritas",
			originAddress: "",
			destinations: "",
			returnToOrigin: "true",
			routeName: ""
		};
		const analysis = analyzeProcessRequirements("smart_route", values);
		return {
			reply: "He preparado el **Planificador Inteligente de Rutas**. Puedes ingresar tu punto de partida y destinos para trazar y optimizar el recorrido en Wialon:",
			process: {
				id: "smart_route",
				title: "Planificador Inteligente de Rutas",
				description: "Optimiza trayectos, calcula kilometraje y traza paradas en Wialon.",
				readyToSubmit: analysis.isReady,
				fields: values,
				fieldDefinitions: getFieldDefinitions("smart_route", values),
				requirementsAnalysis: analysis,
				missingPrompt: "Indica el punto de salida y al menos una dirección de destino."
			}
		};
	}
	if (lower.includes("geocerca") || lower.includes("zona") || lower.includes("perímetro") || lower.includes("perimetro")) {
		const values = {
			name: "",
			resourceName: "AlfredoRetana",
			type: "circle",
			radiusMeters: 150,
			centerCoordinates: "20.6736, -103.3440"
		};
		const analysis = analyzeProcessRequirements("geofence", values);
		return {
			reply: "He abierto el formulario para **Crear Geocerca en Wialon**. Permite delimitar perímetros circulares o polígonos y asignarlos a un cliente/recurso:",
			process: {
				id: "geofence",
				title: "Nueva Geocerca en Wialon",
				description: "Crea y sincroniza zonas de control perimetral en la cuenta del cliente.",
				readyToSubmit: analysis.isReady,
				fields: values,
				fieldDefinitions: getFieldDefinitions("geofence", values),
				requirementsAnalysis: analysis,
				missingPrompt: "¿Cuál es el nombre de la geocerca y en qué coordenadas o dirección se ubica?"
			}
		};
	}
	if (lower.includes("historial") || lower.includes("recorrido") || lower.includes("viaje") || lower.includes("donde anduvo")) {
		const values = {
			unitName: "",
			from: (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString().slice(0, 16),
			to: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16)
		};
		const analysis = analyzeProcessRequirements("unit_history", values);
		return {
			reply: "He preparado la consulta de **Historial de Recorridos**. Indica qué unidad satelital y el intervalo de fechas que necesitas trazar en el mapa:",
			process: {
				id: "unit_history",
				title: "Historial de Recorridos por Unidad",
				description: "Recupera puntos satelitales, velocidad y paradas del vehículo.",
				readyToSubmit: analysis.isReady,
				fields: values,
				fieldDefinitions: getFieldDefinitions("unit_history", values),
				requirementsAnalysis: analysis,
				missingPrompt: "¿De qué unidad deseas consultar el recorrido y qué fechas abarcará?"
			}
		};
	}
	if (lower.includes("reporte") || lower.includes("excel") || lower.includes("grafica") || lower.includes("sensores") || lower.includes("combustible")) {
		const values = {
			unitName: "",
			from: (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString().slice(0, 16),
			to: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16),
			template: "Solo tabla de posiciones y sensores"
		};
		const analysis = analyzeProcessRequirements("wialon_report", values);
		return {
			reply: "He preparado el generador de **Reportes para Excel**. Puedes consolidar posiciones, sensores de telemetría y descargas tabulares:",
			process: {
				id: "wialon_report",
				title: "Reportes y Gráficas para Excel",
				description: "Genera tablas de sensores, kilometraje y velocidad exportables.",
				readyToSubmit: analysis.isReady,
				fields: values,
				fieldDefinitions: getFieldDefinitions("wialon_report", values),
				requirementsAnalysis: analysis,
				missingPrompt: "¿Para qué unidad deseas generar el reporte?"
			}
		};
	}
	if (lower.includes("cotiz") || lower.includes("precio") || lower.includes("fmb920") || lower.includes("comprar") || lower.includes("costo")) {
		const values = {
			equipmentType: lower.includes("obd") ? "OBD-II" : "FMB920",
			quantity: 1,
			contactName: "",
			phone: "",
			email: "",
			notes: ""
		};
		const analysis = analyzeProcessRequirements("quick_quote", values);
		return {
			reply: "Ofrecemos equipos homologados con garantía y configuración satelital lista para funcionar. He analizado los campos necesarios para tu cotización personalizada:",
			process: {
				id: "quick_quote",
				title: "Cotización Rápida de Equipos GPS",
				description: "Calcula costos con envío express e instalación.",
				readyToSubmit: analysis.isReady,
				fields: values,
				fieldDefinitions: getFieldDefinitions("quick_quote", values),
				requirementsAnalysis: analysis,
				missingPrompt: "¿Para cuántas unidades necesitas equipo y a qué número te enviamos la propuesta?"
			}
		};
	}
	return {
		reply: "¡Hola! Soy tu asistente de operaciones de **ORB-LITE**. Puedo ayudarte a realizar cualquier proceso en la plataforma, pedirte los datos y enviarlo directamente a las APIs del sistema:\n\n• **⚡ Registrar Renovación**: Carga cortes de GPS, IMEI y cobros.\n• **👤 Alta en CRM**: Registra clientes y prospectos con un clic.\n• **🚀 Solicitar Demo**: Activa accesos de prueba a la plataforma.\n• **🔗 Compartir Rastreo**: Genera enlaces temporales de seguimiento.\n• **📍 Crear Geocerca**: Configura zonas seguras y alertas de perímetro.\n• **📦 Cotizar Equipos**: FMB920, OBD-II, GPS Solar o SIMs Multicarrier.\n\n¿Qué proceso deseas realizar hoy?",
		process: null
	};
}
async function processAssistantMessage(message, history) {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) return localRuleFallback(message, history);
	try {
		const ai = new GoogleGenAI({
			apiKey,
			httpOptions: { headers: { "User-Agent": "aistudio-build" } }
		});
		const conversationTurns = history.slice(-6).map((turn) => `${turn.role === "user" ? "Usuario" : "Asistente"}: ${turn.content}`).join("\n\n");
		const currentPrompt = `${conversationTurns ? `HISTORIAL DE LA CONVERSACIÓN:\n${conversationTurns}\n\n` : ""}MENSAJE DEL USUARIO AHORA:\n${message}`;
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: currentPrompt,
			config: {
				systemInstruction: SYSTEM_INSTRUCTION,
				responseMimeType: "application/json",
				responseSchema: {
					type: Type.OBJECT,
					properties: {
						reply: {
							type: Type.STRING,
							description: "Mensaje explicativo y cortés para el usuario en español"
						},
						processId: {
							type: Type.STRING,
							description: "Uno de: renewal, crm_customer, demo_request, route_share, smart_route, geofence, unit_history, wialon_report, quick_quote, o null si solo es charla general"
						},
						processTitle: {
							type: Type.STRING,
							description: "Título corto del proceso"
						},
						extractedFields: {
							type: Type.OBJECT,
							description: "Objeto clave-valor con todos los campos extraídos o predefinidos",
							properties: {
								platform: { type: Type.STRING },
								renewalPeriod: { type: Type.STRING },
								renewalDate: { type: Type.STRING },
								unitName: { type: Type.STRING },
								imei: { type: Type.STRING },
								iccid: { type: Type.STRING },
								simPhone: { type: Type.STRING },
								customerName: { type: Type.STRING },
								customerEmail: { type: Type.STRING },
								customerPhone: { type: Type.STRING },
								customerNumber: { type: Type.STRING },
								amount: { type: Type.NUMBER },
								status: { type: Type.STRING },
								fullName: { type: Type.STRING },
								phone: { type: Type.STRING },
								email: { type: Type.STRING },
								company: { type: Type.STRING },
								city: { type: Type.STRING },
								state: { type: Type.STRING },
								notes: { type: Type.STRING },
								firstName: { type: Type.STRING },
								lastName: { type: Type.STRING },
								units: { type: Type.STRING },
								message: { type: Type.STRING },
								reportEmail: { type: Type.STRING },
								durationHours: { type: Type.STRING },
								clientNotes: { type: Type.STRING },
								name: { type: Type.STRING },
								resourceName: { type: Type.STRING },
								type: { type: Type.STRING },
								radiusMeters: { type: Type.NUMBER },
								centerCoordinates: { type: Type.STRING },
								color: { type: Type.STRING },
								creationMethod: { type: Type.STRING },
								originAddress: { type: Type.STRING },
								destinations: { type: Type.STRING },
								returnToOrigin: { type: Type.STRING },
								routeName: { type: Type.STRING },
								from: { type: Type.STRING },
								to: { type: Type.STRING },
								unitName: { type: Type.STRING },
								template: { type: Type.STRING },
								equipmentType: { type: Type.STRING },
								quantity: { type: Type.NUMBER },
								contactName: { type: Type.STRING }
							}
						},
						readyToSubmit: {
							type: Type.BOOLEAN,
							description: "true si se tienen los datos esenciales para enviar a la API"
						},
						missingPrompt: {
							type: Type.STRING,
							description: "Pregunta corta si falta algún dato crítico, o null"
						}
					},
					required: ["reply"]
				}
			}
		});
		const parsed = JSON.parse(response.text?.trim() || "{}");
		if (parsed.processId && [
			"renewal",
			"crm_customer",
			"demo_request",
			"route_share",
			"smart_route",
			"geofence",
			"unit_history",
			"wialon_report",
			"quick_quote"
		].includes(parsed.processId)) {
			const pId = parsed.processId;
			const fields = parsed.extractedFields || {};
			const analysis = analyzeProcessRequirements(pId, fields);
			return {
				reply: parsed.reply || "He preparado el proceso solicitado.",
				process: {
					id: pId,
					title: parsed.processTitle || "Proceso de Plataforma",
					description: "Generado por Asistente ORB-LITE",
					readyToSubmit: analysis.isReady,
					fields,
					fieldDefinitions: getFieldDefinitions(pId, fields),
					requirementsAnalysis: analysis,
					missingPrompt: parsed.missingPrompt || null
				}
			};
		}
		return {
			reply: parsed.reply || "Estoy a tu servicio para cualquier operación en ORB-LITE.",
			process: null
		};
	} catch (error) {
		console.error("Gemini assistant error, falling back to rule engine:", error);
		return localRuleFallback(message, history);
	}
}
var assistantChat_createServerFn_handler = createServerRpc({
	id: "c18f9ec8914193a4d17f1d1ffbf2408ec34f3938140dd58d7b767410509e881f",
	name: "assistantChat",
	filename: "src/lib/assistant.functions.ts"
}, (opts) => assistantChat.__executeServer(opts));
var assistantChat = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	message: stringType().trim().min(1).max(2e3),
	history: arrayType(objectType({
		role: enumType(["user", "assistant"]),
		content: stringType().max(3e3)
	})).default([])
}).parse(input)).handler(assistantChat_createServerFn_handler, async ({ data }) => {
	return await processAssistantMessage(data.message, data.history);
});
var assistantExecuteProcess_createServerFn_handler = createServerRpc({
	id: "4616c65b0e716e3073c29769d73262bca30f03b8671ea305b48c58073e3d28be",
	name: "assistantExecuteProcess",
	filename: "src/lib/assistant.functions.ts"
}, (opts) => assistantExecuteProcess.__executeServer(opts));
var assistantExecuteProcess = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	processId: enumType([
		"renewal",
		"crm_customer",
		"demo_request",
		"route_share",
		"smart_route",
		"geofence",
		"unit_history",
		"wialon_report",
		"quick_quote"
	]),
	fields: recordType(anyType())
}).parse(input)).handler(assistantExecuteProcess_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-CFLkNUaG.mjs").then((n) => n.t).then((n) => n.t);
	switch (data.processId) {
		case "renewal": {
			const fields = data.fields;
			if (!fields.customerName || !fields.unitName || !fields.imei) throw new Error("Faltan datos obligatorios: Nombre de cliente, Nombre de unidad o IMEI.");
			const renewalDateRaw = String(fields.renewalDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
			const renewalDate = renewalDateRaw.includes("-") ? `${renewalDateRaw.slice(0, 7)}-01` : `${(/* @__PURE__ */ new Date()).toISOString().slice(0, 7)}-01`;
			const payload = {
				customer_number: fields.customerNumber ? Number(fields.customerNumber) : null,
				customer_name: String(fields.customerName).trim(),
				customer_email: fields.customerEmail ? String(fields.customerEmail).trim() : null,
				customer_phone: fields.customerPhone ? String(fields.customerPhone).trim() : null,
				variant_id: fields.platform === "ORB-FULL" ? "full-mensual" : "lite-mensual",
				variant_name: `Plataforma ${fields.platform || "ORB-LITE"} (${fields.renewalPeriod === "annual" ? "Anual" : "Mensual"})`,
				platform: String(fields.platform || "ORB-LITE"),
				renewal_kind: "platform",
				renewal_period: String(fields.renewalPeriod || "monthly"),
				unit_name: String(fields.unitName).trim(),
				imei: String(fields.imei).trim(),
				iccid: fields.iccid ? String(fields.iccid).trim() : null,
				sim_phone: fields.simPhone ? String(fields.simPhone).trim() : null,
				amount: Number(fields.amount || 250),
				renewal_date: renewalDate,
				status: String(fields.status || "activa"),
				last_paid_at: (/* @__PURE__ */ new Date()).toISOString(),
				notices: []
			};
			const { data: inserted, error } = await supabaseAdmin.from("renovaciones").insert(payload).select("id").maybeSingle();
			if (error) throw new Error(`Error en base de datos: ${error.message}`);
			return {
				ok: true,
				processTitle: "Renovación de Servicio Satelital",
				id: inserted?.id ?? "REG-OK",
				message: `Renovación registrada exitosamente para la unidad "${fields.unitName}" (IMEI: ${fields.imei}). Corte programado para el día 1 de ${renewalDateRaw.slice(0, 7)}.`,
				summary: {
					Unidad: fields.unitName,
					IMEI: fields.imei,
					Cliente: fields.customerName,
					Plataforma: fields.platform,
					Importe: `$${fields.amount || 250} MXN`,
					"Próximo Corte": renewalDate
				}
			};
		}
		case "crm_customer": {
			const fields = data.fields;
			if (!fields.fullName || !fields.phone) throw new Error("Faltan datos obligatorios: Nombre completo y teléfono.");
			const candidateNumber = 500 + Math.floor(Math.random() * 99500);
			const payload = {
				customer_number: candidateNumber,
				full_name: String(fields.fullName).trim(),
				phone: String(fields.phone).trim(),
				email: fields.email ? String(fields.email).trim() : null,
				contact: {
					fullName: String(fields.fullName).trim(),
					phone: String(fields.phone).trim(),
					email: fields.email ? String(fields.email).trim() : void 0,
					city: fields.city ? String(fields.city).trim() : void 0,
					state: fields.state ? String(fields.state).trim() : void 0
				},
				orders_count: 0,
				total_spent: 0
			};
			const { data: inserted, error } = await supabaseAdmin.from("customers").insert(payload).select("customer_number").maybeSingle();
			if (error) throw new Error(`No se pudo registrar el cliente: ${error.message}`);
			return {
				ok: true,
				processTitle: "Alta de Cliente en CRM",
				id: String(inserted?.customer_number ?? candidateNumber),
				message: `Cliente "${fields.fullName}" registrado exitosamente en el CRM con el número de cliente #${inserted?.customer_number ?? candidateNumber}.`,
				summary: {
					"Número de Cliente": `#${inserted?.customer_number ?? candidateNumber}`,
					Nombre: fields.fullName,
					Teléfono: fields.phone,
					Correo: fields.email || "No registrado",
					Empresa: fields.company || "No especificada"
				}
			};
		}
		case "demo_request": {
			const fields = data.fields;
			if (!fields.firstName || !fields.phone || !fields.email) throw new Error("Faltan datos obligatorios: Nombre, Teléfono y Correo.");
			const { error } = await supabaseAdmin.from("demo_requests").insert({
				first_name: String(fields.firstName).trim(),
				last_name: String(fields.lastName || "").trim(),
				phone: String(fields.phone).trim(),
				email: String(fields.email).toLowerCase().trim(),
				company: fields.company ? String(fields.company).trim() : null,
				platform: fields.platform === "wialon_full" ? "wialon_full" : "wialon_lite",
				units: fields.units ? String(fields.units).trim() : "1 a 5 unidades",
				message: fields.message ? String(fields.message).trim() : "Generado por Asistente de Operaciones",
				status: "pendiente"
			});
			if (error) throw new Error(`No se pudo enviar la demo: ${error.message}`);
			return {
				ok: true,
				processTitle: "Solicitud de Demo Oficial",
				id: "DEMO-" + Math.floor(1e3 + Math.random() * 9e3),
				message: `Solicitud de demo enviada exitosamente para ${fields.firstName} ${fields.lastName || ""}. El equipo de soporte activará los accesos y contactará vía WhatsApp/correo.`,
				summary: {
					Interesado: `${fields.firstName} ${fields.lastName || ""}`,
					Teléfono: fields.phone,
					Correo: fields.email,
					Plataforma: fields.platform === "wialon_full" ? "ORB-FULL" : "ORB-LITE"
				}
			};
		}
		case "route_share": {
			const fields = data.fields;
			if (!fields.unitName || !fields.reportEmail) throw new Error("Faltan datos obligatorios: Nombre de la unidad y correo de reporte.");
			const durationHours = Number(fields.durationHours || 24);
			const { createSharedUnitLink } = await import("./unit-share.server-CQH7UbHI.mjs");
			const { saveUserRouteToStorage, setRouteShare } = await import("./user-routes.server-CAiyBJKg.mjs");
			const token = (await createSharedUnitLink({
				unitId: 1e3 + Math.floor(Math.random() * 9e3),
				unitName: fields.unitName,
				clientEmail: fields.reportEmail,
				clientName: fields.clientName || null,
				clientPhone: fields.clientPhone || null,
				durationHours,
				host: "lite",
				notes: fields.notes || `Rastreo solicitado para ${fields.unitName}`
			})).token;
			const link = `/rastreo/${token}`;
			try {
				const stops = [{
					label: `Base de Operaciones (${fields.unitName})`,
					lat: 20.6736,
					lon: -103.344
				}, {
					label: `Punto de Entrega / Supervisión (${fields.unitName})`,
					lat: 20.7086,
					lon: -103.369
				}];
				await setRouteShare(1, (await saveUserRouteToStorage({
					userId: 1,
					userName: "Operaciones ORB-LITE",
					name: `Rastreo Compartido - ${fields.unitName}`,
					color: "#92d700",
					points: [{
						lat: 20.6736,
						lon: -103.344,
						radius: 100
					}, {
						lat: 20.7086,
						lon: -103.369,
						radius: 100
					}],
					origin: `Base (${fields.unitName})`,
					addresses: [`Base (${fields.unitName})`, `Destino (${fields.unitName})`],
					shareToken: token,
					stops,
					reportEmail: String(fields.reportEmail).trim()
				})).id, token, stops, String(fields.reportEmail).trim());
			} catch {}
			return {
				ok: true,
				processTitle: "Enlace de Rastreo Compartido Registrado",
				id: token,
				message: `Enlace temporal de rastreo generado y registrado con éxito para "${fields.unitName}". Válido por ${durationHours} horas. Los clientes o supervisores pueden abrir el mapa en vivo de inmediato sin necesidad de iniciar sesión.`,
				link,
				summary: {
					Unidad: fields.unitName,
					Destinatario: fields.reportEmail,
					Vigencia: `${durationHours} horas`,
					Estado: "Activo y con mapa en vivo",
					"Enlace en Vivo": `/rastreo/${token}`
				}
			};
		}
		case "smart_route": {
			const fields = data.fields;
			if (!fields.originAddress || !fields.destinations) throw new Error("Faltan datos obligatorios: Punto de salida y al menos una dirección de destino.");
			return {
				ok: true,
				processTitle: "Planificador Inteligente de Rutas",
				id: "RUTA-" + Math.floor(1e3 + Math.random() * 9e3),
				message: `Ruta optimizada con éxito. Punto de salida: "${fields.originAddress}" con destino(s): "${fields.destinations}". ${fields.returnToOrigin === "true" || fields.returnToOrigin === true ? "(Circuito con regreso al origen)" : ""}`,
				link: `/wialon/rutas?origin=${encodeURIComponent(fields.originAddress)}&dest=${encodeURIComponent(fields.destinations)}`,
				summary: {
					"Punto de Salida": fields.originAddress,
					Destinos: fields.destinations,
					"Regreso al Origen": fields.returnToOrigin === "true" || fields.returnToOrigin === true ? "Sí" : "No",
					Método: fields.creationMethod || "Direcciones escritas",
					Estado: "Lista para navegación en Wialon"
				}
			};
		}
		case "geofence": {
			const fields = data.fields;
			if (!fields.name || !fields.centerCoordinates) throw new Error("Faltan datos obligatorios: Nombre de la geocerca y coordenadas.");
			const resource = fields.resourceName || "AlfredoRetana";
			return {
				ok: true,
				processTitle: "Geocerca Satelital Wialon",
				id: "GEO-" + Math.floor(1e3 + Math.random() * 9e3),
				message: `Geocerca "${fields.name}" configurada para el recurso "${resource}" (${fields.type === "polygon" ? "Polígono" : `Círculo ${fields.radiusMeters || 150}m`}) en coordenadas [${fields.centerCoordinates}].`,
				link: `/wialon/geocercas`,
				summary: {
					Nombre: fields.name,
					"Recurso / Cliente": resource,
					Forma: fields.type === "polygon" ? "Polígono" : "Círculo",
					Radio: fields.type === "polygon" ? "Perímetro trazado" : `${fields.radiusMeters || 150} metros`,
					Coordenadas: fields.centerCoordinates
				}
			};
		}
		case "unit_history": {
			const fields = data.fields;
			if (!fields.unitName) throw new Error("Falta indicar la unidad satelital a consultar.");
			return {
				ok: true,
				processTitle: "Historial de Recorridos",
				id: "HIST-" + Math.floor(1e3 + Math.random() * 9e3),
				message: `Parámetros de historial cargados para "${fields.unitName}". Periodo: Desde ${fields.from} hasta ${fields.to}.`,
				link: `/wialon/historial`,
				summary: {
					Unidad: fields.unitName,
					Desde: fields.from || "Últimas 24 horas",
					Hasta: fields.to || "Tiempo actual",
					Acceso: "Ver recorrido en mapa de Wialon"
				}
			};
		}
		case "wialon_report": {
			const fields = data.fields;
			if (!fields.unitName) throw new Error("Falta indicar la unidad para generar el reporte.");
			return {
				ok: true,
				processTitle: "Reportes y Gráficas para Excel",
				id: "REP-" + Math.floor(1e3 + Math.random() * 9e3),
				message: `Reporte configurado para la unidad "${fields.unitName}" con plantilla "${fields.template || "Solo tabla de posiciones y sensores"}". Listo para generar y exportar a Excel.`,
				link: `/wialon/reportes`,
				summary: {
					Unidad: fields.unitName,
					Plantilla: fields.template || "Solo tabla de posiciones y sensores",
					Rango: `${fields.from} al ${fields.to}`,
					Formato: "Excel (.xlsx) y Gráficas Recharts"
				}
			};
		}
		case "quick_quote": {
			const fields = data.fields;
			if (!fields.contactName || !fields.phone) throw new Error("Faltan datos obligatorios: Nombre y teléfono de contacto.");
			const unitPrice = {
				FMB920: 1250,
				"OBD-II": 1490,
				"Solar/Magnético": 1890,
				"SIM Multicarrier": 120,
				"Sensor Combustible": 2800
			}[fields.equipmentType] || 1250;
			const total = unitPrice * Number(fields.quantity || 1);
			return {
				ok: true,
				processTitle: "Cotización Generada",
				id: "COT-" + Math.floor(1e3 + Math.random() * 9e3),
				message: `Cotización preparada para ${fields.contactName}. Total estimado: $${total.toLocaleString("es-MX")} MXN (${fields.quantity || 1}x ${fields.equipmentType}).`,
				summary: {
					Equipo: fields.equipmentType,
					Cantidad: fields.quantity || 1,
					"Precio Unitario": `$${unitPrice.toLocaleString("es-MX")} MXN`,
					"Total Estimado": `$${total.toLocaleString("es-MX")} MXN`,
					Contacto: `${fields.contactName} (${fields.phone})`
				}
			};
		}
	}
});
//#endregion
export { assistantChat_createServerFn_handler, assistantExecuteProcess_createServerFn_handler };
