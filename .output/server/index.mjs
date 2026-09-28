globalThis.__nitro_main__ = import.meta.url;
import { i as serve, r as NodeResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
import { a as HTTPError, i as toEventHandler, n as defineHandler, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
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
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"1dc6-LSQQXRsiN1/7kwfcM80v759GafY\"",
		"mtime": "2026-09-28T07:05:20.818Z",
		"size": 7622,
		"path": "../public/favicon.png"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-09-28T07:05:20.820Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/assets/acceso-crm-CHVqXowg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e50-dIbiRl801jjuwzvMvfH3yvWINcQ\"",
		"mtime": "2026-09-28T20:36:07.882Z",
		"size": 3664,
		"path": "../public/assets/acceso-crm-CHVqXowg.js"
	},
	"/assets/auth-C8as3oDb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97f-BOUNPWcndz/lLBiB0Ju7Q1+Gzk8\"",
		"mtime": "2026-09-28T20:36:07.883Z",
		"size": 2431,
		"path": "../public/assets/auth-C8as3oDb.js"
	},
	"/assets/check-DQYZNiTv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72-CKxPWbzVeyDvL5MOzLi3hyNMD4Y\"",
		"mtime": "2026-09-28T20:36:07.883Z",
		"size": 114,
		"path": "../public/assets/check-DQYZNiTv.js"
	},
	"/assets/clientes-fZH7CssI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c59-+OePuL5VJNIxXmLyLz5yuotWDUs\"",
		"mtime": "2026-09-28T20:36:07.884Z",
		"size": 7257,
		"path": "../public/assets/clientes-fZH7CssI.js"
	},
	"/assets/clock-BNdHFeMt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f-dauj4M8lmdXr1Ey+vSO5v+/48Ng\"",
		"mtime": "2026-09-28T20:36:07.884Z",
		"size": 159,
		"path": "../public/assets/clock-BNdHFeMt.js"
	},
	"/assets/contacto-YI3FXNvl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1569-KmFqMmq6qQ5bVU1I/nRbpH00RF4\"",
		"mtime": "2026-09-28T20:36:07.884Z",
		"size": 5481,
		"path": "../public/assets/contacto-YI3FXNvl.js"
	},
	"/assets/cpu-CP6J8oU2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"278-Mgr9uI9IiC6Tw+sep83WXMpQGIQ\"",
		"mtime": "2026-09-28T20:36:07.884Z",
		"size": 632,
		"path": "../public/assets/cpu-CP6J8oU2.js"
	},
	"/assets/crm-j_Qqrsy8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9100-GVUbbnjQNp0ysKc9RRCHMpyQp18\"",
		"mtime": "2026-09-28T20:36:07.884Z",
		"size": 37120,
		"path": "../public/assets/crm-j_Qqrsy8.js"
	},
	"/assets/crm.functions-DDtY0PaJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a6-rkzHp3fkqLoDwdodagZSwA1Qqy4\"",
		"mtime": "2026-09-28T20:36:07.886Z",
		"size": 2470,
		"path": "../public/assets/crm.functions-DDtY0PaJ.js"
	},
	"/assets/demo-BrVv2oxe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b30-RCF8PaDNVTXTRFR/g8BIsnKpZZc\"",
		"mtime": "2026-09-28T20:36:07.886Z",
		"size": 6960,
		"path": "../public/assets/demo-BrVv2oxe.js"
	},
	"/assets/equipo-gps-BlFdWJpM.jpg": {
		"type": "image/jpeg",
		"etag": "\"17382-feUxPY57T/4i/0uDdhAzaz8Fa7w\"",
		"mtime": "2026-09-28T20:36:07.914Z",
		"size": 95106,
		"path": "../public/assets/equipo-gps-BlFdWJpM.jpg"
	},
	"/assets/external-link-Bn3xuYMg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-aCyGl9hvrtrOvp+JRqLjnlMyeqU\"",
		"mtime": "2026-09-28T20:36:07.887Z",
		"size": 241,
		"path": "../public/assets/external-link-Bn3xuYMg.js"
	},
	"/assets/hero-gps-M5T_qAhN.jpg": {
		"type": "image/jpeg",
		"etag": "\"2f9a1-XmWsfmyEtBcTor/8xFkpdj2dMxE\"",
		"mtime": "2026-09-28T20:36:07.916Z",
		"size": 194977,
		"path": "../public/assets/hero-gps-M5T_qAhN.jpg"
	},
	"/assets/jsx-runtime-DKj5X9O4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2033-fcJvwSaK3kkGakce3jCNJ7gQik8\"",
		"mtime": "2026-09-28T20:36:07.895Z",
		"size": 8243,
		"path": "../public/assets/jsx-runtime-DKj5X9O4.js"
	},
	"/assets/invariant-DEEwAagU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c-eVh/3DMi1s3cxf4N/OJar+ew1jA\"",
		"mtime": "2026-09-28T20:36:07.894Z",
		"size": 60,
		"path": "../public/assets/invariant-DEEwAagU.js"
	},
	"/assets/jszip.min-CuYkEcaG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176e4-8sLcC5hjFA+Xhzd2cx5NlRpuXc4\"",
		"mtime": "2026-09-28T20:36:07.895Z",
		"size": 95972,
		"path": "../public/assets/jszip.min-CuYkEcaG.js"
	},
	"/assets/key-round-ALh6TKWZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"159-X96bKzFpCzsIK3CLanljrNGZ/Uo\"",
		"mtime": "2026-09-28T20:36:07.896Z",
		"size": 345,
		"path": "../public/assets/key-round-ALh6TKWZ.js"
	},
	"/assets/excel-export-Bp1NC3fW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c8c-OuUKtBo7ywLMdntn0/fj4c2VdVs\"",
		"mtime": "2026-09-28T20:36:07.886Z",
		"size": 11404,
		"path": "../public/assets/excel-export-Bp1NC3fW.js"
	},
	"/assets/input-Cs0W2AEf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"299-DcBPnQabCs1Y3gtk2CUdGhmqhd0\"",
		"mtime": "2026-09-28T20:36:07.887Z",
		"size": 665,
		"path": "../public/assets/input-Cs0W2AEf.js"
	},
	"/assets/exceljs.min-CqiXvXX6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e2f1b-tzlbl5bklg+PB/c25FuDGpbzeug\"",
		"mtime": "2026-09-28T20:36:07.887Z",
		"size": 929563,
		"path": "../public/assets/exceljs.min-CqiXvXX6.js"
	},
	"/assets/index-Bm_dj92Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e0031-GjutYPK9JkKX0W9wh5kxXjR//+Q\"",
		"mtime": "2026-09-28T20:36:07.856Z",
		"size": 917553,
		"path": "../public/assets/index-Bm_dj92Y.js"
	},
	"/assets/equipo-gps-nosim-C31ZHkY7.jpg": {
		"type": "image/jpeg",
		"etag": "\"134792-l0eYqHWfSqnXu5Z/cu9GVkosfwM\"",
		"mtime": "2026-09-28T20:36:07.915Z",
		"size": 1263506,
		"path": "../public/assets/equipo-gps-nosim-C31ZHkY7.jpg"
	},
	"/assets/equipo-gps-sim-D9xGk7K_.jpg": {
		"type": "image/jpeg",
		"etag": "\"1377a7-iWxygPHRkr0yfEyqEbpESJIi6gE\"",
		"mtime": "2026-09-28T20:36:07.916Z",
		"size": 1275815,
		"path": "../public/assets/equipo-gps-sim-D9xGk7K_.jpg"
	},
	"/assets/log-out-B7BOzbc1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-GarZpM/bxCGyYoEW85V+ljf3BmI\"",
		"mtime": "2026-09-28T20:36:07.897Z",
		"size": 220,
		"path": "../public/assets/log-out-B7BOzbc1.js"
	},
	"/assets/link-B7w8R2bX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1172-mOaHJsYFvbWWpBwUiKT4IVLRyVo\"",
		"mtime": "2026-09-28T20:36:07.897Z",
		"size": 4466,
		"path": "../public/assets/link-B7w8R2bX.js"
	},
	"/assets/label-k7hNc_8p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b9-fu9rhN3IZ1zSkEsefpL2OcS8PCU\"",
		"mtime": "2026-09-28T20:36:07.896Z",
		"size": 697,
		"path": "../public/assets/label-k7hNc_8p.js"
	},
	"/assets/map-layers-vh-t_kPv.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"3af7-hJRdDJQQrsTdSxJ69xb7a611WZ4\"",
		"mtime": "2026-09-28T20:36:07.916Z",
		"size": 15095,
		"path": "../public/assets/map-layers-vh-t_kPv.css"
	},
	"/assets/matchContext-WrdTYFnU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ba-o9C6oIlM3ABzTVOT9pcbx5cg1NY\"",
		"mtime": "2026-09-28T20:36:07.898Z",
		"size": 186,
		"path": "../public/assets/matchContext-WrdTYFnU.js"
	},
	"/assets/panel._token-XP6pb6Jx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10a0-1zWbT7TSxo7PDjKewyOvpHuQoAA\"",
		"mtime": "2026-09-28T20:36:07.898Z",
		"size": 4256,
		"path": "../public/assets/panel._token-XP6pb6Jx.js"
	},
	"/assets/PlatformHeader-DqERTBIK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d74-+ncE4Do7R9n0waidw4QmqEbL3cQ\"",
		"mtime": "2026-09-28T20:36:07.857Z",
		"size": 3444,
		"path": "../public/assets/PlatformHeader-DqERTBIK.js"
	},
	"/assets/radio-Cuc3K9Eo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16c-xvN+LZTQDumzupdl4jY2PmjZ6Y0\"",
		"mtime": "2026-09-28T20:36:07.899Z",
		"size": 364,
		"path": "../public/assets/radio-Cuc3K9Eo.js"
	},
	"/assets/react-dom-B1EygJpe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f43-0FQjQJ8IatAGkn071g7dAeGEmDE\"",
		"mtime": "2026-09-28T20:36:07.899Z",
		"size": 3907,
		"path": "../public/assets/react-dom-B1EygJpe.js"
	},
	"/assets/redirect-CaDPrkdo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b2-9bBwbwrhH/PEZYK8mBAWNTld9MU\"",
		"mtime": "2026-09-28T20:36:07.899Z",
		"size": 946,
		"path": "../public/assets/redirect-CaDPrkdo.js"
	},
	"/assets/refresh-cw-Rzc5HEaj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137-v1WX1JRLLUlE7+mYyNjILyi3L/Q\"",
		"mtime": "2026-09-28T20:36:07.900Z",
		"size": 311,
		"path": "../public/assets/refresh-cw-Rzc5HEaj.js"
	},
	"/assets/map-layers-Dl5vHaL4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24907-J2GdXVQCUoIsOLu50+wzX7lZm00\"",
		"mtime": "2026-09-28T20:36:07.898Z",
		"size": 149767,
		"path": "../public/assets/map-layers-Dl5vHaL4.js"
	},
	"/assets/renovaciones-DxzdUkpx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"306c-yEpztCpmK67q/qfqG4t6Uy3KJ7k\"",
		"mtime": "2026-09-28T20:36:07.900Z",
		"size": 12396,
		"path": "../public/assets/renovaciones-DxzdUkpx.js"
	},
	"/assets/rolldown-runtime-Dd_uD5pT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"452-sZl5y+VnYZJIxKNwHO0DTqczPH0\"",
		"mtime": "2026-09-28T20:36:07.900Z",
		"size": 1106,
		"path": "../public/assets/rolldown-runtime-Dd_uD5pT.js"
	},
	"/assets/root-DLTE-HSj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20-vSYConOtSP6ciwr9zKsPixNwWmc\"",
		"mtime": "2026-09-28T20:36:07.901Z",
		"size": 32,
		"path": "../public/assets/root-DLTE-HSj.js"
	},
	"/assets/rotate-ccw-8LeZ7B_m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c9-MQ/rBwYJKxG713Q0i5mBxMOnfSs\"",
		"mtime": "2026-09-28T20:36:07.901Z",
		"size": 713,
		"path": "../public/assets/rotate-ccw-8LeZ7B_m.js"
	},
	"/assets/route-CLfjfXLN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-Tmso6DSKp/9ggmU1oTUFeomcUGM\"",
		"mtime": "2026-09-28T20:36:07.902Z",
		"size": 244,
		"path": "../public/assets/route-CLfjfXLN.js"
	},
	"/assets/route-CP_v9T72.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-ePkrswOXJ90+ME0hrnRAm+uqTUU\"",
		"mtime": "2026-09-28T20:36:07.902Z",
		"size": 142,
		"path": "../public/assets/route-CP_v9T72.js"
	},
	"/assets/route-share.functions-DPto2qBs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"320-eQjZwSyXbgZFY/kQ6/VuQWvR4tU\"",
		"mtime": "2026-09-28T20:36:07.903Z",
		"size": 800,
		"path": "../public/assets/route-share.functions-DPto2qBs.js"
	},
	"/assets/routes-BPJgzZyE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"410c-aISD2v+w29CCneNi597+41IGHLQ\"",
		"mtime": "2026-09-28T20:36:07.903Z",
		"size": 16652,
		"path": "../public/assets/routes-BPJgzZyE.js"
	},
	"/assets/orb-lite-logo-DRyoWmI5.png": {
		"type": "image/png",
		"etag": "\"8d066-AfOtK5sIu56ht4LzOQeqwTwYoy0\"",
		"mtime": "2026-09-28T20:36:07.917Z",
		"size": 577638,
		"path": "../public/assets/orb-lite-logo-DRyoWmI5.png"
	},
	"/assets/ruta._token-DyJGAb6t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c1d-/LmURuNXjqYPgjTygAZIMjp4mp0\"",
		"mtime": "2026-09-28T20:36:07.903Z",
		"size": 11293,
		"path": "../public/assets/ruta._token-DyJGAb6t.js"
	},
	"/assets/servicios-8Iy_OOg2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ce5-IQYXG/3uiWZjSndK1gUfXu/5VCc\"",
		"mtime": "2026-09-28T20:36:07.903Z",
		"size": 23781,
		"path": "../public/assets/servicios-8Iy_OOg2.js"
	},
	"/assets/shield-check-CmYpAPhd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-KYeipZROJGwz0mlEAGi/0nqE4M0\"",
		"mtime": "2026-09-28T20:36:07.904Z",
		"size": 310,
		"path": "../public/assets/shield-check-CmYpAPhd.js"
	},
	"/assets/SharedRouteMap-2QFfNvoL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1547-Sl2FfPL8Iao8wnrBsTQZrVu5cuo\"",
		"mtime": "2026-09-28T20:36:07.882Z",
		"size": 5447,
		"path": "../public/assets/SharedRouteMap-2QFfNvoL.js"
	},
	"/assets/store-BFfv-QZ9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"905-OG5YzXlaEmFRhUqBa2BUNkpRcoU\"",
		"mtime": "2026-09-28T20:36:07.904Z",
		"size": 2309,
		"path": "../public/assets/store-BFfv-QZ9.js"
	},
	"/assets/solicitud-card-8Uy1bj4N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2251-oKSItjQmEVAF03HhK1yv1l2X99w\"",
		"mtime": "2026-09-28T20:36:07.904Z",
		"size": 8785,
		"path": "../public/assets/solicitud-card-8Uy1bj4N.js"
	},
	"/assets/tienda-CzT0fi-u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"356c-1rSFvck5YCQZBGvDNzTNeW7xrIo\"",
		"mtime": "2026-09-28T20:36:07.905Z",
		"size": 13676,
		"path": "../public/assets/tienda-CzT0fi-u.js"
	},
	"/assets/useMutation-CbVnW7WT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95b-sZ4Yx7iD98GYn3swE9jrMHGg2qM\"",
		"mtime": "2026-09-28T20:36:07.906Z",
		"size": 2395,
		"path": "../public/assets/useMutation-CbVnW7WT.js"
	},
	"/assets/styles-DReGGc5C.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"19711-4dvOfAtC2sb8+2P4FmgiS6I4oKQ\"",
		"mtime": "2026-09-28T20:36:07.917Z",
		"size": 104209,
		"path": "../public/assets/styles-DReGGc5C.css"
	},
	"/assets/terminos-D-2pc0df.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"182d-7K4tcfg0WeWJmGGptrr+GBk13es\"",
		"mtime": "2026-09-28T20:36:07.905Z",
		"size": 6189,
		"path": "../public/assets/terminos-D-2pc0df.js"
	},
	"/assets/useServerFn-BuTCyry1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c4-T2CCWjyDrjJ2zC6fbbgGSaYgFfc\"",
		"mtime": "2026-09-28T20:36:07.907Z",
		"size": 452,
		"path": "../public/assets/useServerFn-BuTCyry1.js"
	},
	"/assets/useRouter-CpseURTG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-hCZDl/qVk5VDGlWJ7SlM6m7XxAo\"",
		"mtime": "2026-09-28T20:36:07.906Z",
		"size": 195,
		"path": "../public/assets/useRouter-CpseURTG.js"
	},
	"/assets/video-CDhduJTz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ee-wZgVzaMsaXvq+v6WWHtODmxA7Zo\"",
		"mtime": "2026-09-28T20:36:07.907Z",
		"size": 238,
		"path": "../public/assets/video-CDhduJTz.js"
	},
	"/assets/wialon-Fx_6E9bQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b5d-qHH5zqSKbscQsAB2lwfvXvmFIjQ\"",
		"mtime": "2026-09-28T20:36:07.907Z",
		"size": 2909,
		"path": "../public/assets/wialon-Fx_6E9bQ.js"
	},
	"/assets/useStore-CHkVrBL3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ab7-1+PmVDAOBZOorRbIFs7hHyjW+BY\"",
		"mtime": "2026-09-28T20:36:07.907Z",
		"size": 19127,
		"path": "../public/assets/useStore-CHkVrBL3.js"
	},
	"/assets/useQuery-BrIhT6Nb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f53-KvF+CM5m828R4/aC5dFSwnbrf4s\"",
		"mtime": "2026-09-28T20:36:07.906Z",
		"size": 8019,
		"path": "../public/assets/useQuery-BrIhT6Nb.js"
	},
	"/assets/wialon-guard-BcbWJKTO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"60c-IiMK//p5fOsJOsHVuuMl078DdoY\"",
		"mtime": "2026-09-28T20:36:07.908Z",
		"size": 1548,
		"path": "../public/assets/wialon-guard-BcbWJKTO.js"
	},
	"/assets/wialon-map-BVgZlsDF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3fb1-cBoFBLq1PfQU5QRlY8i6R7gevLU\"",
		"mtime": "2026-09-28T20:36:07.908Z",
		"size": 16305,
		"path": "../public/assets/wialon-map-BVgZlsDF.js"
	},
	"/assets/wialon-session-G9vRbMzI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"592-au1VJCKLPkHJWCPlWEX81dFGj28\"",
		"mtime": "2026-09-28T20:36:07.909Z",
		"size": 1426,
		"path": "../public/assets/wialon-session-G9vRbMzI.js"
	},
	"/assets/wialon.cms-Brzf54g_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12cc-/Lx9tWs8x67ehN1ZRWsnmP3j+RM\"",
		"mtime": "2026-09-28T20:36:07.910Z",
		"size": 4812,
		"path": "../public/assets/wialon.cms-Brzf54g_.js"
	},
	"/assets/wialon-visibility-LBDix72x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90b-Jr6XHzZ6QSWYRSXKxZMFCccfxns\"",
		"mtime": "2026-09-28T20:36:07.909Z",
		"size": 2315,
		"path": "../public/assets/wialon-visibility-LBDix72x.js"
	},
	"/assets/wialon.geocercas-P0xirwSi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38bd-CSbVOpN250986X0OnCnu0zCvPIc\"",
		"mtime": "2026-09-28T20:36:07.911Z",
		"size": 14525,
		"path": "../public/assets/wialon.geocercas-P0xirwSi.js"
	},
	"/assets/wialon.callback-CyEhPK-u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"68b-e/6SyDtB+YeZf7LmdVGqch/Ukuc\"",
		"mtime": "2026-09-28T20:36:07.910Z",
		"size": 1675,
		"path": "../public/assets/wialon.callback-CyEhPK-u.js"
	},
	"/assets/wialon.functions-BEX1F6_u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d4f-X/RPusnu6qY3+VEun9wjeInKvnI\"",
		"mtime": "2026-09-28T20:36:07.910Z",
		"size": 3407,
		"path": "../public/assets/wialon.functions-BEX1F6_u.js"
	},
	"/assets/wialon.historial-DXnVJQT4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b2c-xL8soRc+Jsgkqf0nUIFFpJHNznI\"",
		"mtime": "2026-09-28T20:36:07.911Z",
		"size": 6956,
		"path": "../public/assets/wialon.historial-DXnVJQT4.js"
	},
	"/assets/wialon.index-k_kqOJPe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"efc-/DKYcyelQv1qLeTDrwd7BroS0J4\"",
		"mtime": "2026-09-28T20:36:07.912Z",
		"size": 3836,
		"path": "../public/assets/wialon.index-k_kqOJPe.js"
	},
	"/assets/wialon.mapa-9YcI8ios.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cb6-oKOW1TuWJYHTxIJ6KbpBCZ8eVLE\"",
		"mtime": "2026-09-28T20:36:07.912Z",
		"size": 7350,
		"path": "../public/assets/wialon.mapa-9YcI8ios.js"
	},
	"/assets/wialon.rutas-DjfQ0ziJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"848c-KwMrSr35F18Thz2bj4kohXSWcTc\"",
		"mtime": "2026-09-28T20:36:07.913Z",
		"size": 33932,
		"path": "../public/assets/wialon.rutas-DjfQ0ziJ.js"
	},
	"/assets/wialon.reportes-D6VGg9Sq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6cdee-kdsD6gaMIBWej65whpsNDoJqjBU\"",
		"mtime": "2026-09-28T20:36:07.913Z",
		"size": 445934,
		"path": "../public/assets/wialon.reportes-D6VGg9Sq.js"
	},
	"/assets/wialon.unidades-DwYfb69b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21f0-44/1wVs8fInQFzRe1WQiluh3zPc\"",
		"mtime": "2026-09-28T20:36:07.913Z",
		"size": 8688,
		"path": "../public/assets/wialon.unidades-DwYfb69b.js"
	},
	"/assets/wialon.video-DNkTws2j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a1f-puwydqUVEsOuunepcG7lL9RpUBU\"",
		"mtime": "2026-09-28T20:36:07.914Z",
		"size": 10783,
		"path": "../public/assets/wialon.video-DNkTws2j.js"
	},
	"/images/wialon-car.webp": {
		"type": "image/webp",
		"etag": "\"3c46e-gi00x1245BrygKZWzC4BlhITTgE\"",
		"mtime": "2026-09-28T07:05:20.820Z",
		"size": 246894,
		"path": "../public/images/wialon-car.webp"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
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
var _lazy_Nq_je1 = defineLazyEventHandler(() => import("./_chunks/renderer-template.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_Nq_je1
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
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
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
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
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
