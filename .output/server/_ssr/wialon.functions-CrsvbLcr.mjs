import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DqD-MaFI.mjs";
import { a as numberType, n as booleanType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.functions-CrsvbLcr.js
var hostSchema = enumType(["lite", "full"]);
var sessionSchema = objectType({
	host: hostSchema,
	sid: stringType().min(1)
});
/** Inicia sesión en Wialon exclusivamente con un token generado por su API. */
var wialonLogin = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	host: hostSchema,
	token: stringType().trim().min(1, "Captura tu token de acceso.")
}).parse(input)).handler(createSsrRpc("e8130a7536237b54feb1f29fb84ad2db41dcbaa0a823954af7c9035b75f2191e"));
createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	host: hostSchema,
	sid: stringType().trim().min(1),
	userName: stringType().optional(),
	userId: numberType().optional()
}).parse(input)).handler(createSsrRpc("4640f260293a7373fb550031ad9d4509843cc47dfaff5c3159f384eeab8320f8"));
var wialonLogout = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(createSsrRpc("633a8793fccf92caaa7cdfc6d708e6247ffb414d47d8eb50d89bb4b06507c2dd"));
/** Lista de unidades con su última posición, IMEI y usuario creador. */
var wialonUnits = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(createSsrRpc("5d217cd5601aa3f18d5c6670fbc6ec91a48b35eefa3b4c634359f41634a835fb"));
/** Detecta el fabricante de las cámaras por el tipo de dispositivo y nombres. */
/** Consulta oficial de cámaras de una unidad exclusivamente mediante unit/get_video_settings. */
var wialonVideoSettings = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({ unitId: numberType().int().positive() }).parse(input)).handler(createSsrRpc("32c520e26e8c5953fd4994cd955f51cfd65e35679e11a3331e07d154c3ff30e6"));
/** Unidades con soporte de cámaras y video consultadas con unit/get_video_settings. */
var wialonVideoUnits = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(createSsrRpc("83eb70f56db72dc98be83232c1a2d8230794a9eaf435318068f544145894788d"));
/** Historial de mensajes/recorrido de una unidad en un intervalo. */
var wialonHistory = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	unitId: numberType().int().positive(),
	timeFrom: numberType().int().positive(),
	timeTo: numberType().int().positive()
}).parse(input)).handler(createSsrRpc("ffd76469f6ceddba536fa5e0f42691d56011cc9b41e1a531fede1bfce1ca716f"));
createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(createSsrRpc("ec23ae0d27f7bac3971d576d5ba9be177a64ac3c03253faf2f3587487fac6a67"));
createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({ search: stringType().trim().optional() }).parse(input)).handler(createSsrRpc("04a6cc270cbcbc04d5b9c159ebdc399f215000953559d1cc89bdf78e9e9148c4"));
createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	creatorId: numberType().int().positive(),
	name: stringType().trim().min(4).max(60),
	hwTypeId: numberType().int().positive(),
	uniqueId: stringType().trim().max(60).optional(),
	phone: stringType().trim().max(30).optional()
}).parse(input)).handler(createSsrRpc("8f5286762355603f86b84707077eadeecf0887d8a082f7177627104badf8e795"));
createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	creatorId: numberType().int().positive(),
	name: stringType().trim().min(4).max(60),
	password: stringType().min(6).max(64)
}).parse(input)).handler(createSsrRpc("869ea90495c39c8ba633e4a0a3fb047ad2ed3ddab9e0c176697633c97cfaf7ac"));
createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({ userId: numberType().int() }).parse(input)).handler(createSsrRpc("099a54ac21f13cef6e0252eab13030fcc450092fc5250c80b7e86f330a17d7dd"));
createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	userId: numberType().int().positive(),
	unitIds: arrayType(numberType().int().positive()).max(200),
	level: enumType(["consulta", "completo"])
}).parse(input)).handler(createSsrRpc("c30c3e3417efded93e004100d8da417b5cc0e85693e80370a5cda1ce143152b7"));
/** Mantiene viva la sesión y confirma si sigue siendo válida. */
var wialonPing = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(createSsrRpc("8cd87c5b2ee7eb4c5c79ee41a3545f8e94f3837892d5317beb4dc7c9a15381a4"));
/** Detalle completo de una unidad: posición, sensores con su último valor y comandos. */
var wialonUnitDetail = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({ unitId: numberType().int().positive() }).parse(input)).handler(createSsrRpc("95641175dee2227c8c876cb315ae3fb227dca3fde72974357b3915a68ab46696"));
/** Ejecuta un comando en la unidad (bloqueo de motor, salidas, etc.). */
var wialonSendCommand = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	unitId: numberType().int().positive(),
	commandName: stringType().trim().min(1).max(80),
	linkType: stringType().trim().max(20).optional(),
	param: stringType().trim().max(200).optional()
}).parse(input)).handler(createSsrRpc("6d0aac2f894afdee3eee7e706bcc8fb0a6b3c5bea7f10978b3a3f58649409800"));
var wialonGeofences = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(createSsrRpc("339bb0c546d3ba8f051f5c9af27a1bdd19b5a207a2b2ff0f2cfbff0375b2e117"));
var wialonCreateGeofence = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	resourceId: numberType().int().positive(),
	name: stringType().trim().min(2, "Captura un nombre para la geocerca.").max(100),
	type: enumType(["circle", "polygon"]),
	color: numberType().int().min(0).max(16777215),
	points: arrayType(objectType({
		lat: numberType().finite(),
		lon: numberType().finite(),
		radius: numberType().finite().nonnegative().max(1e6)
	})).min(1).max(1e3)
}).parse(input)).handler(createSsrRpc("476249603d6dd8ee6d44bed6776c60ab03eb6674c8df2df3b8c89205331af3ea"));
var wialonCreateRoute = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	resourceId: numberType().int().positive(),
	name: stringType().trim().min(2, "Captura un nombre para la ruta.").max(100),
	color: numberType().int().min(0).max(16777215),
	points: arrayType(objectType({
		lat: numberType().finite(),
		lon: numberType().finite(),
		radius: numberType().finite().nonnegative().max(1e6)
	})).min(2, "Una ruta necesita al menos dos puntos.").max(1e3)
}).parse(input)).handler(createSsrRpc("0aaa2a32f3788c9e860e26601d2c1953b04a45796619ecdd8ad8f1e12eda866a"));
var wialonDeleteGeofence = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	resourceId: numberType().int().positive(),
	zoneId: numberType().int().positive()
}).parse(input)).handler(createSsrRpc("a92f6c5732a42ee79c142516bd2f010ef768d73da2e7fa078303627314b88a4f"));
/**
* Usuarios visibles según los permisos que Wialon le dio a la sesión:
* core/search_items solo devuelve los usuarios a los que la cuenta tiene
* acceso. Las rutas se muestran exactamente con ese criterio.
*/
var getUserRoutes = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	userId: numberType().int(),
	host: stringType().optional(),
	sid: stringType().optional()
}).parse(input)).handler(createSsrRpc("6f1f66077f96fdaddcc9be28851a9f6bc1eb8c2543ac53cbe8415c8a82e83f4a"));
var saveUserRoute = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	userId: numberType().int(),
	userName: stringType().optional(),
	name: stringType().trim().min(2, "Captura un nombre para la ruta.").max(100),
	color: stringType().default("#f59e0b"),
	points: arrayType(objectType({
		lat: numberType().finite(),
		lon: numberType().finite(),
		radius: numberType().finite().nonnegative().default(0)
	})).min(2, "Una ruta necesita al menos dos puntos."),
	routeStops: arrayType(objectType({
		lat: numberType().finite(),
		lon: numberType().finite(),
		label: stringType()
	})).optional(),
	origin: stringType().optional(),
	addresses: arrayType(stringType()).optional(),
	distanceMeters: numberType().optional(),
	durationSeconds: numberType().optional(),
	syncToWialon: booleanType().default(false),
	host: stringType().optional(),
	sid: stringType().optional(),
	resourceId: numberType().int().optional()
}).parse(input)).handler(createSsrRpc("3fcacfd6e95e348f6c00a4020d1173c66a11efd431d29a436cf43ba58772eaab"));
var deleteUserRoute = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	userId: numberType().int(),
	routeId: stringType()
}).parse(input)).handler(createSsrRpc("9fcc34dad0d21654eb2458924ea2ce5ca8f067753b2d4e0011f8728343d2c66e"));
var plannedLocationSchema = objectType({
	query: stringType().trim().min(3),
	label: stringType().trim().min(1),
	lat: numberType().finite(),
	lon: numberType().finite()
});
/** Busca las direcciones escritas para mostrar sus puntos en el mapa antes de crear la ruta. */
var wialonGeocodeAddresses = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ addresses: arrayType(stringType().trim().min(3, "Cada punto necesita una dirección.")).min(1, "Captura al menos una dirección.").max(101, "Puedes ubicar hasta 101 puntos a la vez.") }).parse(input)).handler(createSsrRpc("b31c8464bdf963d852e7e7e83c40a20fbd26e07561151f257d9468cfdad84adf"));
var wialonPlanRoute = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	origin: stringType().trim().min(3, "Captura el punto de salida."),
	addresses: arrayType(stringType().trim().min(3, "Cada parada necesita una dirección.")).min(1, "Captura al menos una dirección.").max(100, "Puedes planificar hasta 100 paradas por ruta."),
	returnToOrigin: booleanType(),
	locations: arrayType(plannedLocationSchema).max(101).optional()
}).parse(input)).handler(createSsrRpc("da52fe00c7955fbf326dfe45358ae052e272ead30a5467254ead71a6324ad5be"));
createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(createSsrRpc("02326eb16fcfd5449a48c262c249138cb68ee825dab0cc00f28f208483171a86"));
createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(createSsrRpc("1f0df0c27095e20f6f95308cebaf0ca6916d477186b54001e409bed7c6bdb4aa"));
createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	unitId: numberType().int().positive(),
	name: stringType().trim().min(4).max(60)
}).parse(input)).handler(createSsrRpc("c01cc92ee386bd62a086c4f420c838b53127e3d3955afeedd495c0177ad08b53"));
/**
* Reporte de posición por unidad. En ORB-FULL agrega el valor de cada sensor
* en su tiempo de medición (se toma el parámetro configurado del sensor).
*/
var wialonReportData = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	unitId: numberType().int().positive(),
	timeFrom: numberType().int().positive(),
	timeTo: numberType().int().positive(),
	withSensors: booleanType().default(false)
}).parse(input)).handler(createSsrRpc("e7542c7cee466c4e1d9b59b7029a5907945b346895a80ca34182781f3dd55d7f"));
/** Plantillas de reporte disponibles en los recursos de la cuenta. */
var wialonReportTemplates = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(createSsrRpc("d556dd57716be959bfbf7b7273441c56fe52d0b5bc0cdb3f24262c155d7b1bec"));
/** Ejecuta report/exec_report y devuelve las tablas tabulares para exportar. */
var wialonExecReport = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	resourceId: numberType().int().positive(),
	templateId: numberType().int().positive(),
	unitId: numberType().int().positive(),
	timeFrom: numberType().int().positive(),
	timeTo: numberType().int().positive()
}).parse(input)).handler(createSsrRpc("5c9f24567aca8371515b0b2a34b56359e315d67e65b3abfd95aa10d42c877d14"));
/** Lee las rutas creadas en Wialon Logistics (solo disponible en ORB-FULL). */
var wialonLogisticsRoutes = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(createSsrRpc("7c40ec3ab00f4b9c79ab0845a31ba3fe3bf2f93633ba23cbd2fa810dab18adea"));
//#endregion
export { wialonVideoUnits as S, wialonReportTemplates as _, wialonCreateRoute as a, wialonUnits as b, wialonGeocodeAddresses as c, wialonLogin as d, wialonLogisticsRoutes as f, wialonReportData as g, wialonPlanRoute as h, wialonCreateGeofence as i, wialonGeofences as l, wialonPing as m, getUserRoutes as n, wialonDeleteGeofence as o, wialonLogout as p, saveUserRoute as r, wialonExecReport as s, deleteUserRoute as t, wialonHistory as u, wialonSendCommand as v, wialonVideoSettings as x, wialonUnitDetail as y };
