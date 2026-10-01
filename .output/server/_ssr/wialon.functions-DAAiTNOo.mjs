import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { i as enumType, l as stringType, n as arrayType, o as numberType, r as booleanType, s as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { n as smartGeocode } from "./geocoding-iXk1aMC_.mjs";
import { n as isSessionExpired, r as wialonCall, t as WialonError } from "./wialon.server-BCJ564Wz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.functions-DAAiTNOo.js
var hostSchema = enumType(["lite", "full"]);
var sessionSchema = objectType({
	host: hostSchema,
	sid: stringType().min(1)
});
var ONLINE_WINDOW = 600;
var MAX_HISTORY_MESSAGES = 3e3;
function normalizeUnit(item, userNames) {
	const pos = item.pos ?? null;
	const last = pos?.t ?? item.lmsg?.t ?? null;
	const now = Math.floor(Date.now() / 1e3);
	const creatorId = typeof item.crt === "number" && item.crt > 0 ? item.crt : null;
	return {
		id: item.id,
		name: item.nm ?? `Unidad ${item.id}`,
		lat: pos?.y ?? null,
		lon: pos?.x ?? null,
		speed: pos?.s ?? null,
		course: pos?.c ?? null,
		lastMessage: last,
		online: last != null && now - last <= ONLINE_WINDOW,
		imei: item.uid?.trim() || null,
		creatorId,
		creatorName: creatorId != null ? userNames?.get(creatorId) ?? null : null
	};
}
/** Inicia sesión en Wialon exclusivamente con un token generado por su API. */
var wialonLogin_createServerFn_handler = createServerRpc({
	id: "e8130a7536237b54feb1f29fb84ad2db41dcbaa0a823954af7c9035b75f2191e",
	name: "wialonLogin",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonLogin.__executeServer(opts));
var wialonLogin = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	host: hostSchema,
	token: stringType().trim().min(1, "Captura tu token de acceso.")
}).parse(input)).handler(wialonLogin_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	try {
		const result = await wialonCall(host, "token/login", {
			token: data.token,
			fl: 1
		});
		if (result?.eid) return {
			sid: result.eid,
			host: data.host,
			userId: result.user?.id ?? 0,
			userName: result.user?.nm ?? "Usuario"
		};
	} catch (primaryErr) {
		const altHost = host === "lite" ? "full" : "lite";
		try {
			const altResult = await wialonCall(altHost, "token/login", {
				token: data.token,
				fl: 1
			});
			if (altResult?.eid) return {
				sid: altResult.eid,
				host: altHost,
				userId: altResult.user?.id ?? 0,
				userName: altResult.user?.nm ?? "Usuario"
			};
		} catch {}
		throw primaryErr;
	}
	throw new Error("No se pudo iniciar sesión en la plataforma.");
});
var wialonLoginWithSid_createServerFn_handler = createServerRpc({
	id: "4640f260293a7373fb550031ad9d4509843cc47dfaff5c3159f384eeab8320f8",
	name: "wialonLoginWithSid",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonLoginWithSid.__executeServer(opts));
var wialonLoginWithSid = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	host: hostSchema,
	sid: stringType().trim().min(1),
	userName: stringType().optional(),
	userId: numberType().optional()
}).parse(input)).handler(wialonLoginWithSid_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	try {
		const res = await wialonCall(host, "core/get_account_data", {}, data.sid);
		return {
			sid: data.sid,
			host: data.host,
			userId: res?.user?.id ?? data.userId ?? 0,
			userName: res?.user?.nm ?? data.userName ?? "Usuario"
		};
	} catch {
		return {
			sid: data.sid,
			host: data.host,
			userId: data.userId ?? 0,
			userName: data.userName ?? "Usuario"
		};
	}
});
var wialonLogout_createServerFn_handler = createServerRpc({
	id: "633a8793fccf92caaa7cdfc6d708e6247ffb414d47d8eb50d89bb4b06507c2dd",
	name: "wialonLogout",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonLogout.__executeServer(opts));
var wialonLogout = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(wialonLogout_createServerFn_handler, async ({ data }) => {
	try {
		await wialonCall(data.host, "core/logout", {}, data.sid);
	} catch {}
	return { ok: true };
});
var wialonUnits_createServerFn_handler = createServerRpc({
	id: "5d217cd5601aa3f18d5c6670fbc6ec91a48b35eefa3b4c634359f41634a835fb",
	name: "wialonUnits",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonUnits.__executeServer(opts));
var wialonUnits = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(wialonUnits_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	const searchSpec = (itemsType) => ({
		itemsType,
		propName: "sys_name",
		propValueMask: "*",
		sortType: "sys_name"
	});
	const [unitsRes, usersRes] = await Promise.all([wialonCall(host, "core/search_items", {
		spec: searchSpec("avl_unit"),
		force: 1,
		flags: 1285,
		from: 0,
		to: 0
	}, data.sid), wialonCall(host, "core/search_items", {
		spec: searchSpec("user"),
		force: 1,
		flags: 1,
		from: 0,
		to: 0
	}, data.sid).catch((error) => {
		if (isSessionExpired(error)) throw error;
		return { items: [] };
	})]);
	const userNames = /* @__PURE__ */ new Map();
	for (const user of usersRes.items ?? []) if (user.nm) userNames.set(user.id, user.nm);
	return { units: (unitsRes.items ?? []).map((item) => normalizeUnit(item, userNames)) };
});
/** Detecta el fabricante de las cámaras por el tipo de dispositivo y nombres. */
function detectCameraBrand(...texts) {
	const haystack = texts.filter(Boolean).join(" ").toLowerCase();
	if (!haystack) return null;
	for (const [pattern, brand] of [
		[/cmsv6|cmsv7|icarvisions|icar vision/, "CMSV6 (iCarVisions)"],
		[/streamax/, "Streamax"],
		[/howen/, "Howen"],
		[/jimi|concox|jimiilab/, "Jimi/Concox"],
		[/queclink/, "Queclink"],
		[/teltonika/, "Teltonika"],
		[/ruptela/, "Ruptela"],
		[/fifotrack/, "Fifotrack"],
		[/topflytech|topfly/, "Topflytech"],
		[/meitrack/, "Meitrack"],
		[/hikvision/, "Hikvision"],
		[/dahua/, "Dahua"],
		[/mdvr|mobile dvr/, "MDVR genérico"],
		[/adas|dms/, "Cámara ADAS/DMS"]
	]) if (pattern.test(haystack)) return brand;
	return null;
}
/** Consulta oficial de cámaras de una unidad exclusivamente mediante unit/get_video_settings. */
var wialonVideoSettings_createServerFn_handler = createServerRpc({
	id: "32c520e26e8c5953fd4994cd955f51cfd65e35679e11a3331e07d154c3ff30e6",
	name: "wialonVideoSettings",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonVideoSettings.__executeServer(opts));
var wialonVideoSettings = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({ unitId: numberType().int().positive() }).parse(input)).handler(wialonVideoSettings_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	let cameras = [];
	try {
		cameras = ((await wialonCall(host, "unit/get_video_settings", { itemId: data.unitId }, data.sid)).settings ?? []).map((camera, index) => {
			const flags = camera.flags ?? 0;
			return {
				index: index + 1,
				name: camera.name?.trim() || `Cámara ${index + 1}`,
				active: true,
				recording: (flags & 2) !== 0,
				flags
			};
		});
	} catch (error) {
		console.error("[video] get_video_settings error:", error);
	}
	return { cameras };
});
var wialonVideoUnits_createServerFn_handler = createServerRpc({
	id: "83eb70f56db72dc98be83232c1a2d8230794a9eaf435318068f544145894788d",
	name: "wialonVideoUnits",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonVideoUnits.__executeServer(opts));
var wialonVideoUnits = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(wialonVideoUnits_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	const hwNames = /* @__PURE__ */ new Map();
	try {
		const hwRes = await wialonCall(host, "core/search_items", {
			spec: {
				itemsType: "avl_hw",
				propName: "sys_name",
				propValueMask: "*",
				sortType: "sys_name"
			},
			force: 1,
			flags: 1,
			from: 0,
			to: 0
		}, data.sid);
		for (const hw of hwRes.items ?? []) if (hw.id != null && hw.nm) hwNames.set(hw.id, hw.nm);
	} catch (reason) {
		console.error("[video] search avl_hw error:", reason);
	}
	const specs = [
		{
			itemsType: "avl_unit",
			propName: "sys_name",
			propValueMask: "*",
			sortType: "sys_name"
		},
		{
			itemsType: "avl_unit",
			propName: "rel_user_creator_name",
			propValueMask: "*",
			sortType: "sys_name",
			propType: "creatortree"
		},
		{
			itemsType: "avl_unit",
			propName: "rel_account_name",
			propValueMask: "*",
			sortType: "sys_name",
			propType: "accounttree"
		}
	];
	const byId = /* @__PURE__ */ new Map();
	for (const spec of specs) try {
		const res = await wialonCall(host, "core/search_items", {
			spec,
			force: 1,
			flags: 8193,
			from: 0,
			to: 0
		}, data.sid);
		for (const item of res.items ?? []) if (item.id != null) byId.set(item.id, {
			id: item.id,
			...item.nm != null ? { nm: item.nm } : {},
			...item.hw != null ? { hw: item.hw } : {}
		});
	} catch (reason) {
		console.error("[video] search_items error:", reason);
	}
	const items = [...byId.values()];
	const units = [];
	for (let i = 0; i < items.length; i += 40) {
		const chunk = items.slice(i, i + 40);
		let answers = [];
		try {
			const r = await wialonCall(host, "core/batch", {
				params: chunk.map((item) => ({
					svc: "unit/get_video_settings",
					params: { itemId: item.id }
				})),
				flags: 0
			}, data.sid);
			answers = Array.isArray(r) ? r : [];
		} catch (reason) {
			console.error("[video] batch get_video_settings error:", reason);
			answers = [];
		}
		for (let j = 0; j < chunk.length; j++) {
			const item = chunk[j];
			const answer = answers[j];
			const settings = answer != null && typeof answer === "object" && !Array.isArray(answer) ? answer.settings : void 0;
			const cameraCount = settings?.length ?? 0;
			const hwName = item.hw != null ? hwNames.get(item.hw) : void 0;
			const cameraNames = (settings ?? []).map((c) => c?.name).filter(Boolean);
			units.push({
				id: item.id,
				name: item.nm ?? `Unidad ${item.id}`,
				cameraCount,
				brand: detectCameraBrand(hwName, ...cameraNames, item.nm)
			});
		}
	}
	return { units };
});
var wialonHistory_createServerFn_handler = createServerRpc({
	id: "ffd76469f6ceddba536fa5e0f42691d56011cc9b41e1a531fede1bfce1ca716f",
	name: "wialonHistory",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonHistory.__executeServer(opts));
var wialonHistory = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	unitId: numberType().int().positive(),
	timeFrom: numberType().int().positive(),
	timeTo: numberType().int().positive()
}).parse(input)).handler(wialonHistory_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	await wialonCall(host, "core/search_item", {
		id: data.unitId,
		flags: 1025
	}, data.sid);
	const interval = await wialonCall(host, "messages/load_interval", {
		itemId: data.unitId,
		timeFrom: data.timeFrom,
		timeTo: data.timeTo,
		flags: 1,
		flagsMask: 65281,
		loadCount: MAX_HISTORY_MESSAGES
	}, data.sid);
	const count = Math.min(interval.count ?? 0, MAX_HISTORY_MESSAGES);
	let messages = [];
	if (count > 0) {
		const res = await wialonCall(host, "messages/get_messages", {
			indexFrom: 0,
			indexTo: count - 1
		}, data.sid);
		messages = (Array.isArray(res) ? res : []).map((m) => ({
			time: m.t ?? 0,
			lat: m.pos?.y ?? null,
			lon: m.pos?.x ?? null,
			speed: m.pos?.s ?? null,
			course: m.pos?.c ?? null
		}));
	}
	try {
		await wialonCall(host, "messages/unload", {}, data.sid);
	} catch {}
	const withPos = messages.filter((m) => m.lat != null && m.lon != null);
	const maxSpeed = withPos.reduce((acc, m) => Math.max(acc, m.speed ?? 0), 0);
	return {
		total: interval.count ?? 0,
		messages,
		maxSpeed,
		points: withPos.length
	};
});
var wialonCmsOverview_createServerFn_handler = createServerRpc({
	id: "ec23ae0d27f7bac3971d576d5ba9be177a64ac3c03253faf2f3587487fac6a67",
	name: "wialonCmsOverview",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonCmsOverview.__executeServer(opts));
var wialonCmsOverview = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(wialonCmsOverview_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	async function search(itemsType, flags) {
		return ((await wialonCall(host, "core/search_items", {
			spec: {
				itemsType,
				propName: "sys_name",
				propValueMask: "*",
				sortType: "sys_name"
			},
			force: 1,
			flags,
			from: 0,
			to: 0
		}, data.sid)).items ?? []).map((i) => ({
			id: i.id,
			name: i.nm ?? `#${i.id}`
		}));
	}
	const [resources, users, units] = await Promise.all([
		search("avl_resource", 1),
		search("user", 1),
		search("avl_unit", 1)
	]);
	return {
		resources,
		users,
		units
	};
});
var wialonHwTypes_createServerFn_handler = createServerRpc({
	id: "04a6cc270cbcbc04d5b9c159ebdc399f215000953559d1cc89bdf78e9e9148c4",
	name: "wialonHwTypes",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonHwTypes.__executeServer(opts));
var wialonHwTypes = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({ search: stringType().trim().optional() }).parse(input)).handler(wialonHwTypes_createServerFn_handler, async ({ data }) => {
	const res = await wialonCall(data.host, "core/get_hw_types", {
		filterType: "name",
		filterValue: [data.search ?? ""],
		includeType: true,
		ignoreRename: true
	}, data.sid);
	return { types: (Array.isArray(res) ? res : []).map((h) => ({
		id: h.id,
		name: h.name
	})).slice(0, 400) };
});
var wialonCreateUnit_createServerFn_handler = createServerRpc({
	id: "8f5286762355603f86b84707077eadeecf0887d8a082f7177627104badf8e795",
	name: "wialonCreateUnit",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonCreateUnit.__executeServer(opts));
var wialonCreateUnit = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	creatorId: numberType().int().positive(),
	name: stringType().trim().min(4).max(60),
	hwTypeId: numberType().int().positive(),
	uniqueId: stringType().trim().max(60).optional(),
	phone: stringType().trim().max(30).optional()
}).parse(input)).handler(wialonCreateUnit_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	const created = await wialonCall(host, "core/create_unit", {
		creatorId: data.creatorId,
		name: data.name,
		hwTypeId: data.hwTypeId,
		dataFlags: 1
	}, data.sid);
	const id = created.item?.id;
	if (!id) throw new Error("La unidad no se pudo crear.");
	if (data.uniqueId) await wialonCall(host, "unit/update_device_type", {
		itemId: id,
		deviceTypeId: data.hwTypeId,
		uniqueId: data.uniqueId
	}, data.sid);
	if (data.phone) await wialonCall(host, "unit/update_phone", {
		itemId: id,
		phoneNumber: data.phone
	}, data.sid);
	return {
		id,
		name: created.item?.nm ?? data.name
	};
});
var wialonCreateUser_createServerFn_handler = createServerRpc({
	id: "869ea90495c39c8ba633e4a0a3fb047ad2ed3ddab9e0c176697633c97cfaf7ac",
	name: "wialonCreateUser",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonCreateUser.__executeServer(opts));
var wialonCreateUser = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	creatorId: numberType().int().positive(),
	name: stringType().trim().min(4).max(60),
	password: stringType().min(6).max(64)
}).parse(input)).handler(wialonCreateUser_createServerFn_handler, async ({ data }) => {
	const created = await wialonCall(data.host, "core/create_user", {
		creatorId: data.creatorId,
		name: data.name,
		password: data.password,
		dataFlags: 1
	}, data.sid);
	const id = created.item?.id;
	if (!id) throw new Error("El usuario no se pudo crear.");
	return {
		id,
		name: created.item?.nm ?? data.name
	};
});
var ACCESS_MASKS = {
	consulta: 33,
	completo: 1895
};
var wialonPermissions_createServerFn_handler = createServerRpc({
	id: "099a54ac21f13cef6e0252eab13030fcc450092fc5250c80b7e86f330a17d7dd",
	name: "wialonPermissions",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonPermissions.__executeServer(opts));
var wialonPermissions = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({ userId: numberType().int() }).parse(input)).handler(wialonPermissions_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	let userFlags = 0;
	let accountId = null;
	try {
		const me = await wialonCall(host, "core/search_item", {
			id: data.userId,
			flags: 261
		}, data.sid);
		userFlags = me.item?.fl ?? 0;
		accountId = me.item?.bact ?? null;
	} catch {
		userFlags = 0;
	}
	let account = {};
	try {
		account = await wialonCall(host, "account/get_account_data", {
			itemId: accountId ?? data.userId,
			type: 1
		}, data.sid);
	} catch {
		try {
			account = await wialonCall(host, "core/get_account_data", { type: 1 }, data.sid);
		} catch {
			account = {};
		}
	}
	const services = {
		...(typeof account.plan === "object" && account.plan !== null ? account.plan.services : void 0) ?? {},
		...account.services ?? {}
	};
	const findService = (...names) => {
		return names.map((name) => services[name]).find(Boolean) ?? null;
	};
	const serviceEnabled = (...names) => {
		const service = findService(...names);
		if (!service) return null;
		const raw = service.val ?? service.value ?? service.enabled;
		if (raw == null) return true;
		return typeof raw === "boolean" ? raw : Number(raw) !== 0;
	};
	const serviceLimit = (...names) => {
		const service = findService(...names);
		if (service?.max == null) return null;
		const limit = Number(service.max);
		return Number.isFinite(limit) ? limit : null;
	};
	const hasCreateItemsFlag = (userFlags & 4) !== 0;
	const isAdministrator = (userFlags & 64) !== 0;
	const canCreateItems = hasCreateItemsFlag || isAdministrator;
	const unitsSvc = serviceEnabled("create_units", "create_unit", "avl_unit");
	const usersSvc = serviceEnabled("create_users", "create_user", "users");
	return {
		plan: typeof account.plan === "string" ? account.plan : account.plan?.name ?? null,
		accountEnabled: (account.enabled ?? 1) !== 0,
		accountId,
		isAdministrator,
		canCreateItems,
		canCreateUnits: canCreateItems && unitsSvc !== false,
		canCreateUsers: canCreateItems && usersSvc !== false,
		limits: {
			units: serviceLimit("create_units", "create_unit", "avl_unit"),
			users: serviceLimit("create_users", "create_user", "users")
		}
	};
});
var wialonGrantUnits_createServerFn_handler = createServerRpc({
	id: "c30c3e3417efded93e004100d8da417b5cc0e85693e80370a5cda1ce143152b7",
	name: "wialonGrantUnits",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonGrantUnits.__executeServer(opts));
var wialonGrantUnits = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	userId: numberType().int().positive(),
	unitIds: arrayType(numberType().int().positive()).max(200),
	level: enumType(["consulta", "completo"])
}).parse(input)).handler(wialonGrantUnits_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	const mask = ACCESS_MASKS[data.level];
	for (const unitId of data.unitIds) await wialonCall(host, "user/update_item_access", {
		userId: data.userId,
		itemId: unitId,
		accessMask: mask
	}, data.sid);
	return { granted: data.unitIds.length };
});
var wialonPing_createServerFn_handler = createServerRpc({
	id: "8cd87c5b2ee7eb4c5c79ee41a3545f8e94f3837892d5317beb4dc7c9a15381a4",
	name: "wialonPing",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonPing.__executeServer(opts));
var wialonPing = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(wialonPing_createServerFn_handler, async ({ data }) => {
	try {
		await wialonCall(data.host, "core/get_account_data", { type: 0 }, data.sid);
		return { valid: true };
	} catch (error) {
		if (isSessionExpired(error)) return { valid: false };
		throw error;
	}
});
var wialonUnitDetail_createServerFn_handler = createServerRpc({
	id: "95641175dee2227c8c876cb315ae3fb227dca3fde72974357b3915a68ab46696",
	name: "wialonUnitDetail",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonUnitDetail.__executeServer(opts));
var wialonUnitDetail = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({ unitId: numberType().int().positive() }).parse(input)).handler(wialonUnitDetail_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	const item = (await wialonCall(host, "core/search_item", {
		id: data.unitId,
		flags: 5889
	}, data.sid)).item;
	if (!item) throw new Error("La unidad no está disponible en tu cuenta.");
	const params = item.lmsg?.p ?? {};
	const sensors = Object.values(item.sens ?? {}).map((s) => {
		const raw = s.p ? params[s.p] : void 0;
		return {
			id: s.id,
			name: s.n ?? `Sensor ${s.id}`,
			type: s.t ?? "",
			metrics: s.m ?? "",
			value: raw == null ? "—" : String(raw)
		};
	});
	const commands = Object.values(item.cmds ?? {}).map((c) => ({
		id: c.id,
		name: c.n ?? `Comando ${c.id}`,
		type: c.c ?? "",
		link: c.l ?? "auto"
	}));
	return {
		unit: normalizeUnit(item),
		uniqueId: item.uid ?? null,
		phone: item.ph ?? null,
		hwTypeId: item.hw ?? null,
		sensors,
		commands,
		params: Object.entries(params).map(([key, value]) => ({
			key,
			value: String(value)
		}))
	};
});
var wialonSendCommand_createServerFn_handler = createServerRpc({
	id: "6d0aac2f894afdee3eee7e706bcc8fb0a6b3c5bea7f10978b3a3f58649409800",
	name: "wialonSendCommand",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonSendCommand.__executeServer(opts));
var wialonSendCommand = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	unitId: numberType().int().positive(),
	commandName: stringType().trim().min(1).max(80),
	linkType: stringType().trim().max(20).optional(),
	param: stringType().trim().max(200).optional()
}).parse(input)).handler(wialonSendCommand_createServerFn_handler, async ({ data }) => {
	await wialonCall(data.host, "unit/exec_cmd", {
		itemId: data.unitId,
		commandName: data.commandName,
		linkType: data.linkType ?? "",
		param: data.param ?? "",
		timeout: 60,
		flags: 0
	}, data.sid);
	return { sent: true };
});
var wialonGeofences_createServerFn_handler = createServerRpc({
	id: "339bb0c546d3ba8f051f5c9af27a1bdd19b5a207a2b2ff0f2cfbff0375b2e117",
	name: "wialonGeofences",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonGeofences.__executeServer(opts));
var wialonGeofences = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(wialonGeofences_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	const specs = [
		{
			itemsType: "avl_resource",
			propName: "sys_name",
			propValueMask: "*",
			sortType: "sys_name"
		},
		{
			itemsType: "avl_resource",
			propName: "rel_user_creator_name",
			propValueMask: "*",
			sortType: "sys_name",
			propType: "creatortree"
		},
		{
			itemsType: "avl_resource",
			propName: "rel_account_name",
			propValueMask: "*",
			sortType: "sys_name",
			propType: "accounttree"
		}
	];
	const byId = /* @__PURE__ */ new Map();
	const results = [];
	for (const spec of specs) try {
		const value = await wialonCall(host, "core/search_items", {
			spec,
			force: 1,
			flags: 4097,
			from: 0,
			to: 0
		}, data.sid);
		results.push({
			status: "fulfilled",
			value
		});
	} catch (reason) {
		console.error("[geocercas] search_items", spec.propType ?? "direct", reason);
		results.push({
			status: "rejected",
			reason
		});
	}
	for (const r of results) {
		if (r.status !== "fulfilled") continue;
		for (const item of r.value.items ?? []) {
			const prev = byId.get(item.id);
			byId.set(item.id, {
				...prev,
				...item,
				zl: {
					...prev?.zl ?? {},
					...item.zl ?? {}
				}
			});
		}
	}
	if (byId.size === 0) {
		const failed = results.find((r) => r.status === "rejected");
		if (failed) throw failed.reason;
	}
	const resources = { items: [...byId.values()] };
	console.log("[geocercas] recursos", resources.items.length);
	const zones = [];
	const loadResource = async (resource, res) => {
		try {
			if (!Array.isArray(res)) throw new Error("sin datos");
			for (const zone of res) {
				const points = (zone.p ?? []).filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y)).map((point) => ({
					lat: point.y,
					lon: point.x,
					radius: point.r ?? 0
				}));
				if (points.length === 0 && zone.b?.cen_x != null && zone.b.cen_y != null) points.push({
					lat: zone.b.cen_y,
					lon: zone.b.cen_x,
					radius: 0
				});
				const rawColor = zone.c ?? 3718648;
				zones.push({
					id: zone.id,
					resourceId: resource.id,
					name: zone.n ?? `Zona ${zone.id}`,
					resource: resource.nm ?? `#${resource.id}`,
					type: zone.t === 1 || zone.t === 2 || zone.t === 3 ? zone.t : 2,
					color: `#${(rawColor & 16777215).toString(16).padStart(6, "0")}`,
					points
				});
			}
		} catch {
			for (const zone of Object.values(resource.zl ?? {})) {
				const rawColor = zone.c ?? 3718648;
				const cx = zone.b?.cen_x;
				const cy = zone.b?.cen_y;
				const radius = zone.b?.min_x != null && zone.b.max_x != null ? Math.abs(zone.b.max_x - zone.b.min_x) * 55660 : 100;
				zones.push({
					id: zone.id,
					resourceId: resource.id,
					name: zone.n ?? `Zona ${zone.id}`,
					resource: resource.nm ?? `#${resource.id}`,
					type: zone.t === 1 || zone.t === 2 || zone.t === 3 ? zone.t : 3,
					color: `#${(rawColor & 16777215).toString(16).padStart(6, "0")}`,
					points: cx != null && cy != null ? [{
						lat: cy,
						lon: cx,
						radius
					}] : []
				});
			}
		}
	};
	const list = resources.items;
	const conZonas = list.filter((r) => Object.keys(r.zl ?? {}).length > 0);
	console.log("[geocercas] recursos con zonas en lista:", conZonas.length, "de", list.length);
	for (let i = 0; i < list.length; i += 40) {
		const chunk = list.slice(i, i + 40);
		let answers = [];
		try {
			const r = await wialonCall(host, "core/batch", {
				params: chunk.map((resource) => ({
					svc: "resource/get_zone_data",
					params: {
						itemId: resource.id,
						col: Object.keys(resource.zl ?? {}).map(Number),
						flags: 28
					}
				})),
				flags: 0
			}, data.sid);
			answers = Array.isArray(r) ? r : [];
		} catch (reason) {
			console.error("[geocercas] batch get_zone_data", reason);
			answers = [];
		}
		for (let j = 0; j < chunk.length; j++) {
			const answer = answers[j];
			if (answer != null && !Array.isArray(answer)) console.error("[geocercas] get_zone_data recurso", chunk[j].id, JSON.stringify(answer).slice(0, 200));
			await loadResource(chunk[j], answer);
		}
	}
	console.log("[geocercas] zonas cargadas:", zones.length);
	return {
		zones,
		resources: (resources.items ?? []).map((resource) => ({
			id: resource.id,
			name: resource.nm ?? `#${resource.id}`
		}))
	};
});
var wialonCreateGeofence_createServerFn_handler = createServerRpc({
	id: "476249603d6dd8ee6d44bed6776c60ab03eb6674c8df2df3b8c89205331af3ea",
	name: "wialonCreateGeofence",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonCreateGeofence.__executeServer(opts));
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
}).parse(input)).handler(wialonCreateGeofence_createServerFn_handler, async ({ data }) => {
	if (data.type === "circle" && data.points.length !== 1) throw new Error("Un círculo necesita centro y radio.");
	if (data.type === "circle" && (data.points[0]?.radius ?? 0) < 10) throw new Error("El círculo debe medir al menos 10 metros.");
	if (data.type === "polygon" && data.points.length < 3) throw new Error("El polígono necesita al menos tres puntos.");
	const result = await wialonCall(data.host, "resource/update_zone", {
		itemId: data.resourceId,
		id: 0,
		callMode: "create",
		n: data.name,
		d: "",
		t: data.type === "circle" ? 3 : 2,
		w: 3,
		f: 32,
		c: data.color,
		tc: 16777215,
		ts: 12,
		p: data.points.map((point) => ({
			x: point.lon,
			y: point.lat,
			r: point.radius
		}))
	}, data.sid);
	const id = Array.isArray(result) && typeof result[0] === "number" ? result[0] : null;
	if (!id) throw new Error("La geocerca no se pudo crear.");
	return {
		id,
		name: data.name
	};
});
var wialonCreateRoute_createServerFn_handler = createServerRpc({
	id: "0aaa2a32f3788c9e860e26601d2c1953b04a45796619ecdd8ad8f1e12eda866a",
	name: "wialonCreateRoute",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonCreateRoute.__executeServer(opts));
var wialonCreateRoute = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	resourceId: numberType().int().positive(),
	name: stringType().trim().min(2, "Captura un nombre para la ruta.").max(100),
	color: numberType().int().min(0).max(16777215),
	points: arrayType(objectType({
		lat: numberType().finite(),
		lon: numberType().finite(),
		radius: numberType().finite().nonnegative().max(1e6)
	})).min(2, "Una ruta necesita al menos dos puntos.").max(1e3)
}).parse(input)).handler(wialonCreateRoute_createServerFn_handler, async ({ data }) => {
	const result = await wialonCall(data.host, "resource/update_zone", {
		itemId: data.resourceId,
		id: 0,
		callMode: "create",
		n: data.name,
		d: "",
		t: 1,
		w: 4,
		f: 32,
		c: data.color,
		tc: 16777215,
		ts: 12,
		p: data.points.map((point) => ({
			x: point.lon,
			y: point.lat,
			r: 0
		}))
	}, data.sid);
	const id = Array.isArray(result) && typeof result[0] === "number" ? result[0] : null;
	if (!id) throw new Error("La ruta no se pudo crear.");
	return {
		id,
		name: data.name
	};
});
var wialonDeleteGeofence_createServerFn_handler = createServerRpc({
	id: "a92f6c5732a42ee79c142516bd2f010ef768d73da2e7fa078303627314b88a4f",
	name: "wialonDeleteGeofence",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonDeleteGeofence.__executeServer(opts));
var wialonDeleteGeofence = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	resourceId: numberType().int().positive(),
	zoneId: numberType().int().positive()
}).parse(input)).handler(wialonDeleteGeofence_createServerFn_handler, async ({ data }) => {
	await wialonCall(data.host, "resource/update_zone", {
		itemId: data.resourceId,
		id: data.zoneId,
		callMode: "delete"
	}, data.sid);
	return {
		ok: true,
		zoneId: data.zoneId
	};
});
/**
* Usuarios visibles según los permisos que Wialon le dio a la sesión:
* core/search_items solo devuelve los usuarios a los que la cuenta tiene
* acceso. Las rutas se muestran exactamente con ese criterio.
*/
async function resolveAccessibleUserIds(host, sid, userId) {
	const ids = /* @__PURE__ */ new Set([userId]);
	try {
		const result = await wialonCall(host, "core/search_items", {
			spec: {
				itemsType: "avl_user",
				propName: "sys_name",
				propValueMask: "*",
				sortType: "sys_name"
			},
			force: 1,
			flags: 1,
			from: 0,
			to: 0
		}, sid);
		for (const item of result?.items ?? []) if (typeof item.id === "number" && item.id > 0) ids.add(item.id);
	} catch {}
	return [...ids];
}
var getUserRoutes_createServerFn_handler = createServerRpc({
	id: "6f1f66077f96fdaddcc9be28851a9f6bc1eb8c2543ac53cbe8415c8a82e83f4a",
	name: "getUserRoutes",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => getUserRoutes.__executeServer(opts));
var getUserRoutes = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	userId: numberType().int(),
	host: stringType().optional(),
	sid: stringType().optional()
}).parse(input)).handler(getUserRoutes_createServerFn_handler, async ({ data }) => {
	const { getUserRoutesFromStorage } = await import("./user-routes.server-CAiyBJKg.mjs");
	let visibleIds = [data.userId];
	if (data.host && data.sid) try {
		visibleIds = await resolveAccessibleUserIds(data.host, data.sid, data.userId);
	} catch {}
	return { routes: await getUserRoutesFromStorage(visibleIds) };
});
var saveUserRoute_createServerFn_handler = createServerRpc({
	id: "3fcacfd6e95e348f6c00a4020d1173c66a11efd431d29a436cf43ba58772eaab",
	name: "saveUserRoute",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => saveUserRoute.__executeServer(opts));
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
}).parse(input)).handler(saveUserRoute_createServerFn_handler, async ({ data }) => {
	const { saveUserRouteToStorage } = await import("./user-routes.server-CAiyBJKg.mjs");
	const stored = await saveUserRouteToStorage({
		userId: data.userId,
		name: data.name,
		color: data.color,
		points: data.points,
		...data.routeStops !== void 0 && { routeStops: data.routeStops },
		...data.userName !== void 0 && { userName: data.userName },
		...data.origin !== void 0 && { origin: data.origin },
		...data.addresses !== void 0 && { addresses: data.addresses },
		...data.distanceMeters !== void 0 && { distanceMeters: data.distanceMeters },
		...data.durationSeconds !== void 0 && { durationSeconds: data.durationSeconds }
	});
	let wialonId = null;
	if (data.syncToWialon && data.host && data.sid && data.resourceId) try {
		const hexColor = Number.parseInt(data.color.replace("#", ""), 16) || 16096779;
		const res = await wialonCall(data.host, "resource/update_zone", {
			itemId: data.resourceId,
			id: 0,
			callMode: "create",
			n: data.name,
			d: `Ruta de usuario ${data.userName ?? data.userId}`,
			t: 1,
			w: 4,
			f: 32,
			c: hexColor,
			tc: 16777215,
			ts: 12,
			p: data.points.map((p) => ({
				x: p.lon,
				y: p.lat,
				r: 0
			}))
		}, data.sid);
		wialonId = Array.isArray(res) && typeof res[0] === "number" ? res[0] : null;
	} catch (err) {
		console.warn("No se pudo reflejar en Wialon:", err);
	}
	return {
		route: stored,
		wialonId
	};
});
var deleteUserRoute_createServerFn_handler = createServerRpc({
	id: "9fcc34dad0d21654eb2458924ea2ce5ca8f067753b2d4e0011f8728343d2c66e",
	name: "deleteUserRoute",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => deleteUserRoute.__executeServer(opts));
var deleteUserRoute = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	userId: numberType().int(),
	routeId: stringType()
}).parse(input)).handler(deleteUserRoute_createServerFn_handler, async ({ data }) => {
	const { deleteUserRouteFromStorage } = await import("./user-routes.server-CAiyBJKg.mjs");
	return { ok: await deleteUserRouteFromStorage(data.userId, data.routeId) };
});
var plannedLocationSchema = objectType({
	query: stringType().trim().min(3),
	label: stringType().trim().min(1),
	lat: numberType().finite(),
	lon: numberType().finite()
});
var geocodeQueue = Promise.resolve();
async function geocodeAddress(address) {
	const run = geocodeQueue.then(async () => {
		try {
			const { googleGeocodePlace } = await import("./google-maps.server-DI0jyeyu.mjs");
			const google = await googleGeocodePlace(address);
			if (google) return google;
		} catch {}
		try {
			return await smartGeocode(address);
		} catch {
			await new Promise((r) => setTimeout(r, 1200));
			return await smartGeocode(address);
		}
	});
	geocodeQueue = run.catch(() => void 0);
	const result = await run;
	return {
		query: address,
		label: result.label,
		lat: result.lat,
		lon: result.lon
	};
}
/** Busca las direcciones escritas para mostrar sus puntos en el mapa antes de crear la ruta. */
var wialonGeocodeAddresses_createServerFn_handler = createServerRpc({
	id: "b31c8464bdf963d852e7e7e83c40a20fbd26e07561151f257d9468cfdad84adf",
	name: "wialonGeocodeAddresses",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonGeocodeAddresses.__executeServer(opts));
var wialonGeocodeAddresses = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ addresses: arrayType(stringType().trim().min(3, "Cada punto necesita una dirección.")).min(1, "Captura al menos una dirección.").max(101, "Puedes ubicar hasta 101 puntos a la vez.") }).parse(input)).handler(wialonGeocodeAddresses_createServerFn_handler, async ({ data }) => ({ locations: await Promise.all(data.addresses.map((address) => geocodeAddress(address))) }));
var wialonPlanRoute_createServerFn_handler = createServerRpc({
	id: "da52fe00c7955fbf326dfe45358ae052e272ead30a5467254ead71a6324ad5be",
	name: "wialonPlanRoute",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonPlanRoute.__executeServer(opts));
var wialonPlanRoute = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	origin: stringType().trim().min(3, "Captura el punto de salida."),
	addresses: arrayType(stringType().trim().min(3, "Cada parada necesita una dirección.")).min(1, "Captura al menos una dirección.").max(100, "Puedes planificar hasta 100 paradas por ruta."),
	returnToOrigin: booleanType(),
	locations: arrayType(plannedLocationSchema).max(101).optional()
}).parse(input)).handler(wialonPlanRoute_createServerFn_handler, async ({ data }) => {
	const requestedLocations = [{
		query: data.origin,
		label: data.origin
	}, ...data.addresses.map((address) => ({
		query: address,
		label: address
	}))];
	const locations = data.locations?.length === requestedLocations.length && data.locations.every((location, index) => location.query === requestedLocations[index]?.query) ? data.locations : [await geocodeAddress(data.origin), ...await Promise.all(data.addresses.map((address) => geocodeAddress(address)))];
	const toStop = (location, index) => ({
		label: location.query,
		lat: location.lat,
		lon: location.lon,
		isOrigin: index === 0
	});
	const stopLocations = locations.slice(1);
	if (stopLocations.length >= 1 && stopLocations.length <= 25) try {
		const { googleComputeOptimizedRoute } = await import("./google-maps.server-DI0jyeyu.mjs");
		const googleRoute = await googleComputeOptimizedRoute({
			origin: locations[0],
			intermediates: stopLocations,
			returnToOrigin: data.returnToOrigin
		});
		if (googleRoute) {
			const order = googleRoute.optimizedIntermediateOrder;
			const orderedStops = order.length === (data.returnToOrigin ? stopLocations.length : stopLocations.length - 1) ? [
				toStop(locations[0], 0),
				...order.map((stopIndex) => toStop(stopLocations[stopIndex], stopIndex + 1)),
				...data.returnToOrigin ? [] : [toStop(stopLocations[stopLocations.length - 1], stopLocations.length)]
			] : locations.map(toStop);
			return {
				points: googleRoute.points,
				distanceMeters: googleRoute.distanceMeters,
				durationSeconds: googleRoute.durationSeconds,
				stops: orderedStops,
				returnToOrigin: data.returnToOrigin
			};
		}
	} catch {}
	const coordinates = locations.map((location) => `${location.lon},${location.lat}`).join(";");
	const routeServices = ["https://router.project-osrm.org/trip/v1/driving/", "https://routing.openstreetmap.de/routed-car/trip/v1/driving/"];
	let trip = null;
	let lastRouteCode = null;
	for (const service of routeServices) {
		const routeUrl = new URL(`${service}${coordinates}`);
		routeUrl.searchParams.set("overview", "full");
		routeUrl.searchParams.set("geometries", "geojson");
		routeUrl.searchParams.set("source", "first");
		routeUrl.searchParams.set("roundtrip", data.returnToOrigin ? "true" : "false");
		if (!data.returnToOrigin) routeUrl.searchParams.set("destination", "last");
		try {
			const routeResponse = await fetch(routeUrl, {
				headers: {
					Accept: "application/json",
					"User-Agent": "ORB-LITE route planner"
				},
				signal: AbortSignal.timeout(2e4)
			});
			const payload = await routeResponse.json();
			lastRouteCode = payload.code ?? `HTTP_${routeResponse.status}`;
			if (routeResponse.ok && payload.code === "Ok") {
				trip = payload;
				break;
			}
		} catch {
			lastRouteCode = "TIMEOUT_OR_NETWORK_ERROR";
		}
	}
	if (!trip) throw new Error(lastRouteCode === "NoRoute" ? "No se encontró una ruta entre las direcciones indicadas." : "El servicio de optimización de rutas no está disponible. Intenta de nuevo en unos segundos.");
	const selectedTrip = trip.trips?.[0];
	const coordinatesForMap = selectedTrip?.geometry?.coordinates ?? [];
	if (trip.code !== "Ok" || !selectedTrip || coordinatesForMap.length < 2) throw new Error("No se pudo encontrar una ruta entre las direcciones indicadas.");
	const samplingStep = Math.max(1, Math.ceil(coordinatesForMap.length / 900));
	const sampledCoordinates = coordinatesForMap.filter((_, index) => index % samplingStep === 0 || index === coordinatesForMap.length - 1);
	const orderedIndexes = (trip.waypoints ?? []).map((waypoint, index) => ({
		index,
		order: waypoint.waypoint_index ?? index
	})).sort((left, right) => left.order - right.order);
	return {
		points: sampledCoordinates.map(([lon, lat]) => ({
			lat,
			lon
		})),
		distanceMeters: Math.round(selectedTrip.distance ?? 0),
		durationSeconds: Math.round(selectedTrip.duration ?? 0),
		stops: orderedIndexes.map(({ index }) => toStop(locations[index], index)),
		returnToOrigin: data.returnToOrigin
	};
});
var wialonDrivers_createServerFn_handler = createServerRpc({
	id: "02326eb16fcfd5449a48c262c249138cb68ee825dab0cc00f28f208483171a86",
	name: "wialonDrivers",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonDrivers.__executeServer(opts));
var wialonDrivers = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(wialonDrivers_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	const resources = await wialonCall(host, "core/search_items", {
		spec: {
			itemsType: "avl_resource",
			propName: "sys_name",
			propValueMask: "*",
			sortType: "sys_name"
		},
		force: 1,
		flags: 257,
		from: 0,
		to: 0
	}, data.sid);
	const drivers = [];
	for (const resource of resources.items ?? []) for (const driver of Object.values(resource.drvrs ?? {})) drivers.push({
		id: driver.id,
		name: driver.n ?? `Chofer ${driver.id}`,
		phone: driver.p ?? null,
		resource: resource.nm ?? `#${resource.id}`
	});
	return { drivers };
});
var wialonAccount_createServerFn_handler = createServerRpc({
	id: "1f0df0c27095e20f6f95308cebaf0ca6916d477186b54001e409bed7c6bdb4aa",
	name: "wialonAccount",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonAccount.__executeServer(opts));
var wialonAccount = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(wialonAccount_createServerFn_handler, async ({ data }) => {
	const account = await wialonCall(data.host, "core/get_account_data", { type: 1 }, data.sid);
	return {
		plan: account.plan ?? null,
		enabled: (account.enabled ?? 1) !== 0,
		balance: account.balance ?? null,
		daysLeft: account.daysCounter ?? null,
		createdAt: account.created ?? null
	};
});
var wialonRenameUnit_createServerFn_handler = createServerRpc({
	id: "c01cc92ee386bd62a086c4f420c838b53127e3d3955afeedd495c0177ad08b53",
	name: "wialonRenameUnit",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonRenameUnit.__executeServer(opts));
var wialonRenameUnit = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	unitId: numberType().int().positive(),
	name: stringType().trim().min(4).max(60)
}).parse(input)).handler(wialonRenameUnit_createServerFn_handler, async ({ data }) => {
	await wialonCall(data.host, "item/update_name", {
		itemId: data.unitId,
		name: data.name
	}, data.sid);
	return { ok: true };
});
function numeric(value) {
	const n = typeof value === "string" ? Number(value) : value;
	return typeof n === "number" && Number.isFinite(n) ? n : null;
}
/**
* Reporte de posición por unidad. En ORB-FULL agrega el valor de cada sensor
* en su tiempo de medición (se toma el parámetro configurado del sensor).
*/
var wialonReportData_createServerFn_handler = createServerRpc({
	id: "e7542c7cee466c4e1d9b59b7029a5907945b346895a80ca34182781f3dd55d7f",
	name: "wialonReportData",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonReportData.__executeServer(opts));
var wialonReportData = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	unitId: numberType().int().positive(),
	timeFrom: numberType().int().positive(),
	timeTo: numberType().int().positive(),
	withSensors: booleanType().default(false)
}).parse(input)).handler(wialonReportData_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	const withSensors = data.withSensors && host === "full";
	const unit = await wialonCall(host, "core/search_item", {
		id: data.unitId,
		flags: 1025 + (withSensors ? 4096 : 0)
	}, data.sid);
	const sensors = Object.values(unit.item?.sens ?? {}).filter((s) => s && s.n && s.p);
	const interval = await wialonCall(host, "messages/load_interval", {
		itemId: data.unitId,
		timeFrom: data.timeFrom,
		timeTo: data.timeTo,
		flags: 1,
		flagsMask: 65281,
		loadCount: MAX_HISTORY_MESSAGES
	}, data.sid);
	const count = Math.min(interval.count ?? 0, MAX_HISTORY_MESSAGES);
	let rows = [];
	if (count > 0) {
		const res = await wialonCall(host, "messages/get_messages", {
			indexFrom: 0,
			indexTo: count - 1
		}, data.sid);
		rows = (Array.isArray(res) ? res : []).filter((m) => m && m.pos && m.pos.y != null && m.pos.x != null).sort((a, b) => (a.t ?? 0) - (b.t ?? 0)).map((m) => {
			const params = m.p ?? {};
			const values = {};
			if (withSensors) {
				for (const sensor of sensors) {
					const raw = numeric(params[sensor.p]);
					if (raw != null) values[sensor.n] = raw;
				}
				if (sensors.length === 0) for (const [key, value] of Object.entries(params)) {
					const raw = numeric(value);
					if (raw != null) values[key] = raw;
				}
			}
			return {
				time: m.t ?? 0,
				lat: m.pos?.y ?? null,
				lon: m.pos?.x ?? null,
				speed: m.pos?.s ?? null,
				course: m.pos?.c ?? null,
				sensors: values
			};
		});
	}
	try {
		await wialonCall(host, "messages/unload", {}, data.sid);
	} catch {}
	const sensorNames = withSensors ? Array.from(new Set(rows.flatMap((row) => Object.keys(row.sensors)))).slice(0, 8) : [];
	return {
		unitName: unit.item?.nm ?? `Unidad ${data.unitId}`,
		rows,
		sensorNames,
		sensorUnits: Object.fromEntries(sensors.filter((s) => s.n).map((s) => [s.n, s.m ?? ""])),
		total: interval.count ?? 0
	};
});
var wialonReportTemplates_createServerFn_handler = createServerRpc({
	id: "d556dd57716be959bfbf7b7273441c56fe52d0b5bc0cdb3f24262c155d7b1bec",
	name: "wialonReportTemplates",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonReportTemplates.__executeServer(opts));
var wialonReportTemplates = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(wialonReportTemplates_createServerFn_handler, async ({ data }) => {
	return { templates: ((await wialonCall(data.host, "core/search_items", {
		spec: {
			itemsType: "avl_resource",
			propName: "sys_name",
			propValueMask: "*",
			sortType: "sys_name"
		},
		force: 1,
		flags: 8193,
		from: 0,
		to: 200
	}, data.sid)).items ?? []).flatMap((resource) => Object.values(resource.rep ?? {}).map((tpl) => ({
		resourceId: resource.id,
		resourceName: resource.nm ?? `Recurso ${resource.id}`,
		templateId: tpl.id,
		name: tpl.n ?? `Reporte ${tpl.id}`,
		objectType: tpl.ct ?? "avl_unit"
	}))).filter((tpl) => tpl.objectType === "avl_unit") };
});
var wialonExecReport_createServerFn_handler = createServerRpc({
	id: "5c9f24567aca8371515b0b2a34b56359e315d67e65b3abfd95aa10d42c877d14",
	name: "wialonExecReport",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonExecReport.__executeServer(opts));
var wialonExecReport = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.extend({
	resourceId: numberType().int().positive(),
	templateId: numberType().int().positive(),
	unitId: numberType().int().positive(),
	timeFrom: numberType().int().positive(),
	timeTo: numberType().int().positive()
}).parse(input)).handler(wialonExecReport_createServerFn_handler, async ({ data }) => {
	const host = data.host;
	try {
		await wialonCall(host, "report/cleanup_result", {}, data.sid);
	} catch {}
	const rawTables = (await wialonCall(host, "report/exec_report", {
		reportResourceId: data.resourceId,
		reportTemplateId: data.templateId,
		reportObjectId: data.unitId,
		reportObjectSecId: 0,
		interval: {
			from: data.timeFrom,
			to: data.timeTo,
			flags: 0
		}
	}, data.sid)).reportResult?.tables ?? [];
	const tables = [];
	for (let index = 0; index < rawTables.length; index += 1) {
		const table = rawTables[index];
		const rowCount = Math.min(table.rows ?? 0, 2e3);
		let rows = [];
		if (rowCount > 0) {
			const result = await wialonCall(host, "report/select_result_rows", {
				tableIndex: index,
				config: {
					type: "range",
					data: {
						from: 0,
						to: rowCount - 1,
						level: 0
					}
				}
			}, data.sid);
			rows = (Array.isArray(result) ? result : []).map((row) => (row.c ?? []).map((cell) => {
				if (cell == null) return "";
				if (typeof cell === "object" && "t" in cell) return String(cell.t ?? "");
				return String(cell);
			}));
		}
		tables.push({
			label: table.label ?? table.name ?? `Tabla ${index + 1}`,
			header: table.header ?? [],
			rows
		});
	}
	try {
		await wialonCall(host, "report/cleanup_result", {}, data.sid);
	} catch {}
	return { tables };
});
var LOGISTICS_BASE = "https://kit-api.wialon.com";
async function logisticsCall(svc, params, eid) {
	const url = new URL(LOGISTICS_BASE);
	url.searchParams.set("svc", svc);
	url.searchParams.set("sid", eid);
	const res = await fetch(url.toString(), {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({ params: JSON.stringify(params ?? {}) }).toString(),
		signal: AbortSignal.timeout(2e4)
	});
	if (!res.ok) throw new Error("Wialon Logistics no responde en este momento.");
	const json = await res.json();
	if (json && typeof json === "object" && "error" in json) {
		const code = Number(json.error);
		if (Number.isFinite(code) && code !== 0) throw new WialonError(code, json.reason);
	}
	return json;
}
function mapLogisticsPoint(raw) {
	const lat = raw.y ?? raw.lat ?? raw.lt;
	const lon = raw.x ?? raw.lon ?? raw.ln;
	if (typeof lat !== "number" || typeof lon !== "number") return null;
	if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
	return {
		lat,
		lon,
		label: raw.n ?? raw.a ?? null
	};
}
/** Lee las rutas creadas en Wialon Logistics (solo disponible en ORB-FULL). */
var wialonLogisticsRoutes_createServerFn_handler = createServerRpc({
	id: "7c40ec3ab00f4b9c79ab0845a31ba3fe3bf2f93633ba23cbd2fa810dab18adea",
	name: "wialonLogisticsRoutes",
	filename: "src/lib/wialon.functions.ts"
}, (opts) => wialonLogisticsRoutes.__executeServer(opts));
var wialonLogisticsRoutes = createServerFn({ method: "POST" }).inputValidator((input) => sessionSchema.parse(input)).handler(wialonLogisticsRoutes_createServerFn_handler, async ({ data }) => {
	if (data.host !== "full") return { routes: [] };
	const eid = (await wialonCall("full", "core/duplicate", {
		operateAs: "",
		continueCurrentSession: true
	}, data.sid)).eid;
	if (!eid) return { routes: [] };
	let raw;
	try {
		raw = await logisticsCall("route/get", {
			uid: 0,
			f: 0
		}, eid);
	} catch (error) {
		if (error instanceof WialonError && (error.code === 7 || error.code === 3)) return { routes: [] };
		throw error;
	}
	const list = Array.isArray(raw) ? raw : raw && typeof raw === "object" && Array.isArray(raw.routes) ? raw.routes : [];
	const routes = [];
	for (const item of list) {
		if (!item || typeof item !== "object") continue;
		const route = item;
		const points = (route.p ?? route.points ?? []).map(mapLogisticsPoint).filter((point) => point !== null);
		routes.push({
			id: String(route.uid ?? route.id ?? routes.length + 1),
			name: route.n ?? route.nm ?? "Ruta de Logistics",
			status: route.st != null ? String(route.st) : route.state != null ? String(route.state) : null,
			ordersCount: Array.isArray(route.orders) ? route.orders.length : 0,
			points
		});
	}
	return { routes };
});
//#endregion
export { deleteUserRoute_createServerFn_handler, getUserRoutes_createServerFn_handler, saveUserRoute_createServerFn_handler, wialonAccount_createServerFn_handler, wialonCmsOverview_createServerFn_handler, wialonCreateGeofence_createServerFn_handler, wialonCreateRoute_createServerFn_handler, wialonCreateUnit_createServerFn_handler, wialonCreateUser_createServerFn_handler, wialonDeleteGeofence_createServerFn_handler, wialonDrivers_createServerFn_handler, wialonExecReport_createServerFn_handler, wialonGeocodeAddresses_createServerFn_handler, wialonGeofences_createServerFn_handler, wialonGrantUnits_createServerFn_handler, wialonHistory_createServerFn_handler, wialonHwTypes_createServerFn_handler, wialonLoginWithSid_createServerFn_handler, wialonLogin_createServerFn_handler, wialonLogisticsRoutes_createServerFn_handler, wialonLogout_createServerFn_handler, wialonPermissions_createServerFn_handler, wialonPing_createServerFn_handler, wialonPlanRoute_createServerFn_handler, wialonRenameUnit_createServerFn_handler, wialonReportData_createServerFn_handler, wialonReportTemplates_createServerFn_handler, wialonSendCommand_createServerFn_handler, wialonUnitDetail_createServerFn_handler, wialonUnits_createServerFn_handler, wialonVideoSettings_createServerFn_handler, wialonVideoUnits_createServerFn_handler };
