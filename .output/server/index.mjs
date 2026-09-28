globalThis.__nitro_main__ = import.meta.url;
import { n as defineLazyEventHandler, r as HTTPError, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"1dc6-LSQQXRsiN1/7kwfcM80v759GafY\"",
		"mtime": "2026-09-28T07:20:49.831Z",
		"size": 7622,
		"path": "../public/favicon.png"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-09-28T07:20:49.831Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/PlatformHeader-CGDAXxAT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d74-VRQoxvzLcdzmqlnfx9z+6r0REXY\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 3444,
		"path": "../public/assets/PlatformHeader-CGDAXxAT.js"
	},
	"/assets/SharedRouteMap-2QFfNvoL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1547-Sl2FfPL8Iao8wnrBsTQZrVu5cuo\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 5447,
		"path": "../public/assets/SharedRouteMap-2QFfNvoL.js"
	},
	"/assets/acceso-crm-KZkT5yj5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dec-GIs9Ch+6MFHyXiUOX7+eaNdDXz8\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 3564,
		"path": "../public/assets/acceso-crm-KZkT5yj5.js"
	},
	"/assets/auth-2JsYAZeo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97f-Miye8owitk0JHXXnQjo3T+YhGkA\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 2431,
		"path": "../public/assets/auth-2JsYAZeo.js"
	},
	"/assets/check-CgkFFhIr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72-bHtGmatJlaykh+8B735Sfupd6fQ\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 114,
		"path": "../public/assets/check-CgkFFhIr.js"
	},
	"/assets/clientes-B1a6ibJR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c59-zD/kQu5NgaV7WqBHesBEPUrJOJI\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 7257,
		"path": "../public/assets/clientes-B1a6ibJR.js"
	},
	"/assets/clock-DQVjxdbg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f-cfUdu7I8UGNawShdziS8PEDQQNE\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 159,
		"path": "../public/assets/clock-DQVjxdbg.js"
	},
	"/assets/contacto-D2N6d2ol.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1569-l4IOk3pqvvuzsG9A4VlHd/73/Ww\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 5481,
		"path": "../public/assets/contacto-D2N6d2ol.js"
	},
	"/assets/cpu-CTq2T7F3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"278-VeXT20LeE5Hb+rGg8MVtoyu4LCo\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 632,
		"path": "../public/assets/cpu-CTq2T7F3.js"
	},
	"/assets/crm-nzVenr_b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9100-w5LsV0DB+rbknWrX0dx0uPDfsl0\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 37120,
		"path": "../public/assets/crm-nzVenr_b.js"
	},
	"/assets/crm.functions-jIB5TKPs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a6-6paqGFMna2RTz2Sh+fDXkqzQdOw\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 2470,
		"path": "../public/assets/crm.functions-jIB5TKPs.js"
	},
	"/assets/demo-B9-zcXfI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b30-6hrgqHS6zf91v55L9EeopvxK5+U\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 6960,
		"path": "../public/assets/demo-B9-zcXfI.js"
	},
	"/assets/equipo-gps-BlFdWJpM.jpg": {
		"type": "image/jpeg",
		"etag": "\"17382-feUxPY57T/4i/0uDdhAzaz8Fa7w\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 95106,
		"path": "../public/assets/equipo-gps-BlFdWJpM.jpg"
	},
	"/assets/excel-export-BKNXDdjO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c8c-4+NRXtnwDsahbK4xR7fj3SKZKPI\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 11404,
		"path": "../public/assets/excel-export-BKNXDdjO.js"
	},
	"/assets/external-link-DlqKMxKO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-fdaVpb6Aopw63IILbv7Msn6TzkI\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 241,
		"path": "../public/assets/external-link-DlqKMxKO.js"
	},
	"/assets/invariant-DEEwAagU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c-eVh/3DMi1s3cxf4N/OJar+ew1jA\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 60,
		"path": "../public/assets/invariant-DEEwAagU.js"
	},
	"/assets/input-B5Dw0E3Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"299-M3zMHx2k0Cz+9tZ6lZcA1P2LxFU\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 665,
		"path": "../public/assets/input-B5Dw0E3Z.js"
	},
	"/assets/jsx-runtime-DKj5X9O4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2033-fcJvwSaK3kkGakce3jCNJ7gQik8\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 8243,
		"path": "../public/assets/jsx-runtime-DKj5X9O4.js"
	},
	"/assets/hero-gps-M5T_qAhN.jpg": {
		"type": "image/jpeg",
		"etag": "\"2f9a1-XmWsfmyEtBcTor/8xFkpdj2dMxE\"",
		"mtime": "2026-09-28T07:20:46.520Z",
		"size": 194977,
		"path": "../public/assets/hero-gps-M5T_qAhN.jpg"
	},
	"/assets/exceljs.min-CqiXvXX6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e2f1b-tzlbl5bklg+PB/c25FuDGpbzeug\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 929563,
		"path": "../public/assets/exceljs.min-CqiXvXX6.js"
	},
	"/assets/equipo-gps-sim-D9xGk7K_.jpg": {
		"type": "image/jpeg",
		"etag": "\"1377a7-iWxygPHRkr0yfEyqEbpESJIi6gE\"",
		"mtime": "2026-09-28T07:20:46.520Z",
		"size": 1275815,
		"path": "../public/assets/equipo-gps-sim-D9xGk7K_.jpg"
	},
	"/assets/equipo-gps-nosim-C31ZHkY7.jpg": {
		"type": "image/jpeg",
		"etag": "\"134792-l0eYqHWfSqnXu5Z/cu9GVkosfwM\"",
		"mtime": "2026-09-28T07:20:46.520Z",
		"size": 1263506,
		"path": "../public/assets/equipo-gps-nosim-C31ZHkY7.jpg"
	},
	"/assets/index-BZFkqLKv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e0191-4IOPruXSXtoqM4/USv74uSIEuJk\"",
		"mtime": "2026-09-28T07:20:46.516Z",
		"size": 917905,
		"path": "../public/assets/index-BZFkqLKv.js"
	},
	"/assets/key-round-BwaFBnbF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"159-/wUf2XttJOKpX5Ucl1nhgP5B9NA\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 345,
		"path": "../public/assets/key-round-BwaFBnbF.js"
	},
	"/assets/label-7CLEhkm8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b9-9J8U/wv/iw5qdzsGr56rHvtBO4A\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 697,
		"path": "../public/assets/label-7CLEhkm8.js"
	},
	"/assets/link-B7w8R2bX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1172-mOaHJsYFvbWWpBwUiKT4IVLRyVo\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 4466,
		"path": "../public/assets/link-B7w8R2bX.js"
	},
	"/assets/log-out-BIY_oQLk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-kM3XtcemdZ8dEVLFvqklbyDkVmc\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 220,
		"path": "../public/assets/log-out-BIY_oQLk.js"
	},
	"/assets/map-layers-Dl5vHaL4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24907-J2GdXVQCUoIsOLu50+wzX7lZm00\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 149767,
		"path": "../public/assets/map-layers-Dl5vHaL4.js"
	},
	"/assets/map-layers-vh-t_kPv.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"3af7-hJRdDJQQrsTdSxJ69xb7a611WZ4\"",
		"mtime": "2026-09-28T07:20:46.521Z",
		"size": 15095,
		"path": "../public/assets/map-layers-vh-t_kPv.css"
	},
	"/assets/matchContext-WrdTYFnU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ba-o9C6oIlM3ABzTVOT9pcbx5cg1NY\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 186,
		"path": "../public/assets/matchContext-WrdTYFnU.js"
	},
	"/assets/radio-BG-JxxII.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16c-io9nJ45eGbE79QK8Mgb+ip7eFIo\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 364,
		"path": "../public/assets/radio-BG-JxxII.js"
	},
	"/assets/panel._token-DWPSexM4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10a0-T933/g8Ov9veGdwJwqjfD85ln/4\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 4256,
		"path": "../public/assets/panel._token-DWPSexM4.js"
	},
	"/assets/renovaciones-yGIj1V_Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"306c-3dd9onG8IAtMbUpw7KMpdry5Ofo\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 12396,
		"path": "../public/assets/renovaciones-yGIj1V_Z.js"
	},
	"/assets/refresh-cw-GGphHtk4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137-C/zgaKr5X83KnzdBsFNUjJ+CTNM\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 311,
		"path": "../public/assets/refresh-cw-GGphHtk4.js"
	},
	"/assets/redirect-CaDPrkdo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b2-9bBwbwrhH/PEZYK8mBAWNTld9MU\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 946,
		"path": "../public/assets/redirect-CaDPrkdo.js"
	},
	"/assets/react-dom-B1EygJpe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f43-0FQjQJ8IatAGkn071g7dAeGEmDE\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 3907,
		"path": "../public/assets/react-dom-B1EygJpe.js"
	},
	"/assets/rolldown-runtime-Dd_uD5pT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"452-sZl5y+VnYZJIxKNwHO0DTqczPH0\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 1106,
		"path": "../public/assets/rolldown-runtime-Dd_uD5pT.js"
	},
	"/assets/root-DLTE-HSj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20-vSYConOtSP6ciwr9zKsPixNwWmc\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 32,
		"path": "../public/assets/root-DLTE-HSj.js"
	},
	"/assets/rotate-ccw-BR7Cahkm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c9-URQBEEdNvEK/U5DW5DBiRXFklhQ\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 713,
		"path": "../public/assets/rotate-ccw-BR7Cahkm.js"
	},
	"/assets/route-3J-PPed5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-MrRtDk7MWRYEbthzN1PjCjH/zq0\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 142,
		"path": "../public/assets/route-3J-PPed5.js"
	},
	"/assets/route-CVDqxuuv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-N0lpsjWkNNpS76fT3BZ0tvz4V68\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 244,
		"path": "../public/assets/route-CVDqxuuv.js"
	},
	"/assets/jszip.min-CuYkEcaG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176e4-8sLcC5hjFA+Xhzd2cx5NlRpuXc4\"",
		"mtime": "2026-09-28T07:20:46.517Z",
		"size": 95972,
		"path": "../public/assets/jszip.min-CuYkEcaG.js"
	},
	"/assets/route-share.functions-6hkRJeqF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"320-pikii5pv+O7w9LUAwFQOrOzg3Sg\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 800,
		"path": "../public/assets/route-share.functions-6hkRJeqF.js"
	},
	"/assets/orb-lite-logo-DRyoWmI5.png": {
		"type": "image/png",
		"etag": "\"8d066-AfOtK5sIu56ht4LzOQeqwTwYoy0\"",
		"mtime": "2026-09-28T07:20:46.521Z",
		"size": 577638,
		"path": "../public/assets/orb-lite-logo-DRyoWmI5.png"
	},
	"/assets/routes-DZB9OtFw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"410c-gUdLn7AGAZmY7jsDTdu36Htz4Vk\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 16652,
		"path": "../public/assets/routes-DZB9OtFw.js"
	},
	"/assets/ruta._token-Dl3JVtKk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c1d-X4byZD87b6HvXgwoDrliUbyy0MM\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 11293,
		"path": "../public/assets/ruta._token-Dl3JVtKk.js"
	},
	"/assets/servicios-3OEWgQ6_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ce5-W9Qt5zAhyIPF25ziD594H3QFCCo\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 23781,
		"path": "../public/assets/servicios-3OEWgQ6_.js"
	},
	"/assets/shield-check-B6N4Z0QG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-tSNuGM+4Bj3CQ21q9UwUsQPoU2A\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 310,
		"path": "../public/assets/shield-check-B6N4Z0QG.js"
	},
	"/assets/solicitud-card-C_WsxG9N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2251-2Ypl9rL/0aFmDsSAfkvlE3xxZxo\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 8785,
		"path": "../public/assets/solicitud-card-C_WsxG9N.js"
	},
	"/assets/store-DvbmdUnL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"905-Aa2xRYCND2ZoDWLdU+o2cinGajM\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 2309,
		"path": "../public/assets/store-DvbmdUnL.js"
	},
	"/assets/styles-DReGGc5C.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"19711-4dvOfAtC2sb8+2P4FmgiS6I4oKQ\"",
		"mtime": "2026-09-28T07:20:46.521Z",
		"size": 104209,
		"path": "../public/assets/styles-DReGGc5C.css"
	},
	"/assets/terminos-D-2pc0df.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"182d-7K4tcfg0WeWJmGGptrr+GBk13es\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 6189,
		"path": "../public/assets/terminos-D-2pc0df.js"
	},
	"/assets/useRouter-CpseURTG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-hCZDl/qVk5VDGlWJ7SlM6m7XxAo\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 195,
		"path": "../public/assets/useRouter-CpseURTG.js"
	},
	"/assets/useServerFn-BuTCyry1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c4-T2CCWjyDrjJ2zC6fbbgGSaYgFfc\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 452,
		"path": "../public/assets/useServerFn-BuTCyry1.js"
	},
	"/assets/useStore-CHkVrBL3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ab7-1+PmVDAOBZOorRbIFs7hHyjW+BY\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 19127,
		"path": "../public/assets/useStore-CHkVrBL3.js"
	},
	"/assets/video-D5_vbV11.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ee-n5xL+aYY7MoF9FRplMlHD7W999I\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 238,
		"path": "../public/assets/video-D5_vbV11.js"
	},
	"/assets/wialon-DVqBjWle.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b5d-UocZXJwQhUH0PU+I2la5B4bb4dw\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 2909,
		"path": "../public/assets/wialon-DVqBjWle.js"
	},
	"/assets/wialon-guard-BnciJDYT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"60c-XmiGF/y2aE/lfIM/m41g9pcxGrU\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 1548,
		"path": "../public/assets/wialon-guard-BnciJDYT.js"
	},
	"/assets/wialon-map-CJqgr8Hx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3fb1-gJ9VpZBrIT2ydyqZtAu/1OwbStw\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 16305,
		"path": "../public/assets/wialon-map-CJqgr8Hx.js"
	},
	"/assets/wialon-session-G9vRbMzI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"592-au1VJCKLPkHJWCPlWEX81dFGj28\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 1426,
		"path": "../public/assets/wialon-session-G9vRbMzI.js"
	},
	"/assets/wialon-visibility-Dx_r7EKP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90b-451dgzCdUIZdOc5f/GEvRJhagLY\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 2315,
		"path": "../public/assets/wialon-visibility-Dx_r7EKP.js"
	},
	"/assets/wialon.callback-C6CxnUIp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"68b-OnVUeWlK/WklgND6mkqj8/lT3lI\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 1675,
		"path": "../public/assets/wialon.callback-C6CxnUIp.js"
	},
	"/assets/useMutation-BlyL7-7p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95b-0s/dYcJl7DSc1iE0+igd9rV241w\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 2395,
		"path": "../public/assets/useMutation-BlyL7-7p.js"
	},
	"/assets/wialon.functions-DZ-OZOpX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d4f-2Nl/7IGJWkQJIGb8nIWvzJWYgok\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 3407,
		"path": "../public/assets/wialon.functions-DZ-OZOpX.js"
	},
	"/assets/wialon.cms-BcYRQcFE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12cc-3LqB0uh15RzNLy9xeyQPSdCFN0o\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 4812,
		"path": "../public/assets/wialon.cms-BcYRQcFE.js"
	},
	"/assets/useQuery-DBKw998X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f53-70t5R52tyuCkmzduem0RrgRMW2c\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 8019,
		"path": "../public/assets/useQuery-DBKw998X.js"
	},
	"/assets/tienda-IvbXZyFo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"356c-xgQhmE23n1GQqKopANML8NTB/fw\"",
		"mtime": "2026-09-28T07:20:46.518Z",
		"size": 13676,
		"path": "../public/assets/tienda-IvbXZyFo.js"
	},
	"/assets/wialon.geocercas-cCftaslj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38bd-QEF4/QPniHa7q/9cPpsnkg5cKlc\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 14525,
		"path": "../public/assets/wialon.geocercas-cCftaslj.js"
	},
	"/assets/wialon.historial-BV740Dh8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b2c-V5YIXbcWeMshwSbFUv64qp8DjF8\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 6956,
		"path": "../public/assets/wialon.historial-BV740Dh8.js"
	},
	"/assets/wialon.index-CUrwbhA6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"efc-eCGUE5K+QuhwW1z8moSWhT6zCVE\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 3836,
		"path": "../public/assets/wialon.index-CUrwbhA6.js"
	},
	"/assets/wialon.mapa-CnunAADd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cb6-d+xrmKThVDwZVPrtW5l6z/0IOaA\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 7350,
		"path": "../public/assets/wialon.mapa-CnunAADd.js"
	},
	"/assets/wialon.reportes-BKCKlBfq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6cdee-XwX6gu+OSGgmgRJGauOnLYzECM0\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 445934,
		"path": "../public/assets/wialon.reportes-BKCKlBfq.js"
	},
	"/assets/wialon.rutas-DMdpG2MJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"848c-4vqaE7NpKguCwlq10/wVaQ1P8LI\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 33932,
		"path": "../public/assets/wialon.rutas-DMdpG2MJ.js"
	},
	"/assets/wialon.video-_NAbXnf4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a1f-v2VT+gwcLTb2/hg5xNT7eamIrP0\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 10783,
		"path": "../public/assets/wialon.video-_NAbXnf4.js"
	},
	"/images/wialon-car.webp": {
		"type": "image/webp",
		"etag": "\"3c46e-gi00x1245BrygKZWzC4BlhITTgE\"",
		"mtime": "2026-09-28T07:20:49.831Z",
		"size": 246894,
		"path": "../public/images/wialon-car.webp"
	},
	"/assets/wialon.unidades-C8vTgL4Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21f0-2xKNwfFvWXPmipKKakYgNI1e2WU\"",
		"mtime": "2026-09-28T07:20:46.519Z",
		"size": 8688,
		"path": "../public/assets/wialon.unidades-C8vTgL4Z.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_6qWkqV = defineLazyEventHandler(() => import("./_chunks/renderer-template.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_6qWkqV
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
