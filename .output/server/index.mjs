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
		"mtime": "2026-09-28T06:47:22.801Z",
		"size": 7622,
		"path": "../public/favicon.png"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-09-28T06:47:22.801Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/PlatformHeader-B_J0ZzIe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d74-X2wF2OgBOmymCmrojgOZLbcWGLc\"",
		"mtime": "2026-09-28T06:47:19.280Z",
		"size": 3444,
		"path": "../public/assets/PlatformHeader-B_J0ZzIe.js"
	},
	"/assets/SharedRouteMap-2QFfNvoL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1547-Sl2FfPL8Iao8wnrBsTQZrVu5cuo\"",
		"mtime": "2026-09-28T06:47:19.280Z",
		"size": 5447,
		"path": "../public/assets/SharedRouteMap-2QFfNvoL.js"
	},
	"/assets/acceso-crm-C5HiVQXM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d87-tO3ze0/y2oN0Bvxh2/+TN0v2C1M\"",
		"mtime": "2026-09-28T06:47:19.280Z",
		"size": 3463,
		"path": "../public/assets/acceso-crm-C5HiVQXM.js"
	},
	"/assets/auth-DMb9RPAV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97f-wgdKKn8fQoKHXIhzT6UIxF8WCEU\"",
		"mtime": "2026-09-28T06:47:19.280Z",
		"size": 2431,
		"path": "../public/assets/auth-DMb9RPAV.js"
	},
	"/assets/check-D2_Y3TcY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72-KIWUtwKfaRInrkIfzjrxexc/LGI\"",
		"mtime": "2026-09-28T06:47:19.280Z",
		"size": 114,
		"path": "../public/assets/check-D2_Y3TcY.js"
	},
	"/assets/clientes-B-KVEkag.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c59-Bqqys/i2hJwpVr4fNTEFcXNyGRs\"",
		"mtime": "2026-09-28T06:47:19.281Z",
		"size": 7257,
		"path": "../public/assets/clientes-B-KVEkag.js"
	},
	"/assets/clock-BQKBUh1I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f-+33mFh/9gCwt1VMcGJ/oOp0SbMU\"",
		"mtime": "2026-09-28T06:47:19.281Z",
		"size": 159,
		"path": "../public/assets/clock-BQKBUh1I.js"
	},
	"/assets/contacto-BfLeCpVw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1569-othdxfR+s3LcTPkrwDS1bNYJ+Us\"",
		"mtime": "2026-09-28T06:47:19.281Z",
		"size": 5481,
		"path": "../public/assets/contacto-BfLeCpVw.js"
	},
	"/assets/cpu-Ca1qt682.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"278-BjxIO3FxSjeeG1X+Tj41u7+y5sM\"",
		"mtime": "2026-09-28T06:47:19.281Z",
		"size": 632,
		"path": "../public/assets/cpu-Ca1qt682.js"
	},
	"/assets/crm-DEIQjrhG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90fd-N1uiBBMMEOQd5FFLCYDjLJ9hO9Y\"",
		"mtime": "2026-09-28T06:47:19.281Z",
		"size": 37117,
		"path": "../public/assets/crm-DEIQjrhG.js"
	},
	"/assets/crm.functions-CFSeIFAA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a6-UJ6llNg5wyIbmBU+FIHcU/0YFxo\"",
		"mtime": "2026-09-28T06:47:19.281Z",
		"size": 2470,
		"path": "../public/assets/crm.functions-CFSeIFAA.js"
	},
	"/assets/demo-e6-ioVsV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b30-e9AgqC4lOywID5rCTR+HhtP1Nco\"",
		"mtime": "2026-09-28T06:47:19.281Z",
		"size": 6960,
		"path": "../public/assets/demo-e6-ioVsV.js"
	},
	"/assets/equipo-gps-BlFdWJpM.jpg": {
		"type": "image/jpeg",
		"etag": "\"17382-feUxPY57T/4i/0uDdhAzaz8Fa7w\"",
		"mtime": "2026-09-28T06:47:19.284Z",
		"size": 95106,
		"path": "../public/assets/equipo-gps-BlFdWJpM.jpg"
	},
	"/assets/excel-export-D3Cdc29n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c8c-H9eehwi9J2eGuQ5Spw4UhaupQKY\"",
		"mtime": "2026-09-28T06:47:19.281Z",
		"size": 11404,
		"path": "../public/assets/excel-export-D3Cdc29n.js"
	},
	"/assets/external-link-BvouXIdD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-Lw7yFTTJE5KlGxw3oM+z4ma/QJA\"",
		"mtime": "2026-09-28T06:47:19.281Z",
		"size": 241,
		"path": "../public/assets/external-link-BvouXIdD.js"
	},
	"/assets/hero-gps-M5T_qAhN.jpg": {
		"type": "image/jpeg",
		"etag": "\"2f9a1-XmWsfmyEtBcTor/8xFkpdj2dMxE\"",
		"mtime": "2026-09-28T06:47:19.286Z",
		"size": 194977,
		"path": "../public/assets/hero-gps-M5T_qAhN.jpg"
	},
	"/assets/input-BiRWfof3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"299-dt9xyv9+188a7dCkxq6fE7ZnO3I\"",
		"mtime": "2026-09-28T06:47:19.281Z",
		"size": 665,
		"path": "../public/assets/input-BiRWfof3.js"
	},
	"/assets/invariant-DEEwAagU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c-eVh/3DMi1s3cxf4N/OJar+ew1jA\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 60,
		"path": "../public/assets/invariant-DEEwAagU.js"
	},
	"/assets/jsx-runtime-DKj5X9O4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2033-fcJvwSaK3kkGakce3jCNJ7gQik8\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 8243,
		"path": "../public/assets/jsx-runtime-DKj5X9O4.js"
	},
	"/assets/exceljs.min-CqiXvXX6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e2f1b-tzlbl5bklg+PB/c25FuDGpbzeug\"",
		"mtime": "2026-09-28T06:47:19.281Z",
		"size": 929563,
		"path": "../public/assets/exceljs.min-CqiXvXX6.js"
	},
	"/assets/index-DN6H4neO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e0205-McW4hYqTkAs9PyZyHLpphwb2S14\"",
		"mtime": "2026-09-28T06:47:19.280Z",
		"size": 918021,
		"path": "../public/assets/index-DN6H4neO.js"
	},
	"/assets/equipo-gps-nosim-C31ZHkY7.jpg": {
		"type": "image/jpeg",
		"etag": "\"134792-l0eYqHWfSqnXu5Z/cu9GVkosfwM\"",
		"mtime": "2026-09-28T06:47:19.285Z",
		"size": 1263506,
		"path": "../public/assets/equipo-gps-nosim-C31ZHkY7.jpg"
	},
	"/assets/equipo-gps-sim-D9xGk7K_.jpg": {
		"type": "image/jpeg",
		"etag": "\"1377a7-iWxygPHRkr0yfEyqEbpESJIi6gE\"",
		"mtime": "2026-09-28T06:47:19.286Z",
		"size": 1275815,
		"path": "../public/assets/equipo-gps-sim-D9xGk7K_.jpg"
	},
	"/assets/jszip.min-CuYkEcaG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176e4-8sLcC5hjFA+Xhzd2cx5NlRpuXc4\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 95972,
		"path": "../public/assets/jszip.min-CuYkEcaG.js"
	},
	"/assets/key-round-DOU7TWVz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"159-Vg6xOpE/LhUQZRZ+u5GBAz5O0FU\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 345,
		"path": "../public/assets/key-round-DOU7TWVz.js"
	},
	"/assets/label-CsQahKng.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b9-st7zAEdCpSAWRJs30xBgqylJA7c\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 697,
		"path": "../public/assets/label-CsQahKng.js"
	},
	"/assets/link-B7w8R2bX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1172-mOaHJsYFvbWWpBwUiKT4IVLRyVo\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 4466,
		"path": "../public/assets/link-B7w8R2bX.js"
	},
	"/assets/log-out-5sbhqcA9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-Dobgh/Gm5C59SFUoGwV7ahGAWK4\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 220,
		"path": "../public/assets/log-out-5sbhqcA9.js"
	},
	"/assets/map-layers-Dl5vHaL4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24907-J2GdXVQCUoIsOLu50+wzX7lZm00\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 149767,
		"path": "../public/assets/map-layers-Dl5vHaL4.js"
	},
	"/assets/map-layers-vh-t_kPv.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"3af7-hJRdDJQQrsTdSxJ69xb7a611WZ4\"",
		"mtime": "2026-09-28T06:47:19.286Z",
		"size": 15095,
		"path": "../public/assets/map-layers-vh-t_kPv.css"
	},
	"/assets/matchContext-WrdTYFnU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ba-o9C6oIlM3ABzTVOT9pcbx5cg1NY\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 186,
		"path": "../public/assets/matchContext-WrdTYFnU.js"
	},
	"/assets/panel._token-zNF5ZN6J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10a0-1BaP1Z1pyQL+a1dLUhQfxjpIYdw\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 4256,
		"path": "../public/assets/panel._token-zNF5ZN6J.js"
	},
	"/assets/radio-C-EGdrEq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16c-057rXMKqqVrGppDJVK4C8ONCoe0\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 364,
		"path": "../public/assets/radio-C-EGdrEq.js"
	},
	"/assets/react-dom-B1EygJpe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f43-0FQjQJ8IatAGkn071g7dAeGEmDE\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 3907,
		"path": "../public/assets/react-dom-B1EygJpe.js"
	},
	"/assets/redirect-CaDPrkdo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b2-9bBwbwrhH/PEZYK8mBAWNTld9MU\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 946,
		"path": "../public/assets/redirect-CaDPrkdo.js"
	},
	"/assets/refresh-cw-DjvD_G8t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137-Mq4XBgg8bC+BpblODJIQH2LsAq0\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 311,
		"path": "../public/assets/refresh-cw-DjvD_G8t.js"
	},
	"/assets/renovaciones-ybnqwi_A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3069-KnGCW5JeZXCUZ3oHs3uz7lpTBbc\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 12393,
		"path": "../public/assets/renovaciones-ybnqwi_A.js"
	},
	"/assets/rolldown-runtime-Dd_uD5pT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"452-sZl5y+VnYZJIxKNwHO0DTqczPH0\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 1106,
		"path": "../public/assets/rolldown-runtime-Dd_uD5pT.js"
	},
	"/assets/root-DLTE-HSj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20-vSYConOtSP6ciwr9zKsPixNwWmc\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 32,
		"path": "../public/assets/root-DLTE-HSj.js"
	},
	"/assets/rotate-ccw-wqUBGU-g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c9-0nmfF7VlIKPsIw3WMNxNZFe5AqM\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 713,
		"path": "../public/assets/rotate-ccw-wqUBGU-g.js"
	},
	"/assets/route-BrgwLgC9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-4b+dLTg1WvAln9AKGzdeFws8H/Y\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 142,
		"path": "../public/assets/route-BrgwLgC9.js"
	},
	"/assets/route-DuvDZSju.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-tNeXksgjIAObi8vHaQVUVVlBb0U\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 244,
		"path": "../public/assets/route-DuvDZSju.js"
	},
	"/assets/route-share.functions-dKYMynJq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"320-NoIceeREQidPwL9UtUZLg4Jph+g\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 800,
		"path": "../public/assets/route-share.functions-dKYMynJq.js"
	},
	"/assets/orb-lite-logo-DRyoWmI5.png": {
		"type": "image/png",
		"etag": "\"8d066-AfOtK5sIu56ht4LzOQeqwTwYoy0\"",
		"mtime": "2026-09-28T06:47:19.286Z",
		"size": 577638,
		"path": "../public/assets/orb-lite-logo-DRyoWmI5.png"
	},
	"/assets/routes-COykwveG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4106-LRygd82d0zW+f6+7yyBulti4/Do\"",
		"mtime": "2026-09-28T06:47:19.282Z",
		"size": 16646,
		"path": "../public/assets/routes-COykwveG.js"
	},
	"/assets/ruta._token-5baTP3qp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c1d-vRKwC4PRQ8iISx44ntTOqkMWKgs\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 11293,
		"path": "../public/assets/ruta._token-5baTP3qp.js"
	},
	"/assets/servicios-CnTpGUch.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ce2-CrgaKUxergggpBYDO4ZMF+1WfBE\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 23778,
		"path": "../public/assets/servicios-CnTpGUch.js"
	},
	"/assets/shield-check-DEKGUZ0q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-WgQ4ErPJOJRvC1YAP2MRhWqp4QQ\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 310,
		"path": "../public/assets/shield-check-DEKGUZ0q.js"
	},
	"/assets/solicitud-card-D1lRYcDf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2251-Z9vAc18xXyAEGf6sRIFkKw0SugY\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 8785,
		"path": "../public/assets/solicitud-card-D1lRYcDf.js"
	},
	"/assets/tienda-M-fDwYOP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"356c-3gJE0l7LXCOf3mWkoboYJJyeeaM\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 13676,
		"path": "../public/assets/tienda-M-fDwYOP.js"
	},
	"/assets/useMutation-DPnp2z3C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95b-4funjmB28R7xEBNvm1lz2LGpJxE\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 2395,
		"path": "../public/assets/useMutation-DPnp2z3C.js"
	},
	"/assets/useQuery-B0FmJWpI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f53-rYU+MR8qv6Uq6dbiPUQjk6nD2dA\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 8019,
		"path": "../public/assets/useQuery-B0FmJWpI.js"
	},
	"/assets/useRouter-CpseURTG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-hCZDl/qVk5VDGlWJ7SlM6m7XxAo\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 195,
		"path": "../public/assets/useRouter-CpseURTG.js"
	},
	"/assets/useServerFn-BuTCyry1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c4-T2CCWjyDrjJ2zC6fbbgGSaYgFfc\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 452,
		"path": "../public/assets/useServerFn-BuTCyry1.js"
	},
	"/assets/useStore-CHkVrBL3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ab7-1+PmVDAOBZOorRbIFs7hHyjW+BY\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 19127,
		"path": "../public/assets/useStore-CHkVrBL3.js"
	},
	"/assets/video-DbTsfIRu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ee-Lh91kp50JZRhMdvMrnuQTnf6dsE\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 238,
		"path": "../public/assets/video-DbTsfIRu.js"
	},
	"/assets/wialon-BnHPdS7D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b5d-AUJ7u+LkRvNXtD5pN9oB0o6pCbk\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 2909,
		"path": "../public/assets/wialon-BnHPdS7D.js"
	},
	"/assets/wialon-guard-B9mwzUuC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"60c-hS5YYPk3+8EXFpgRjidhypZr6BM\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 1548,
		"path": "../public/assets/wialon-guard-B9mwzUuC.js"
	},
	"/assets/wialon-map-CDVhLXnG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3fb1-EJ0zlkniPN26uEDRAz+lNPDfMa0\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 16305,
		"path": "../public/assets/wialon-map-CDVhLXnG.js"
	},
	"/assets/store-Bt1-JSQk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"905-dNu26oEs2aqfjluGlBKgAowVLIY\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 2309,
		"path": "../public/assets/store-Bt1-JSQk.js"
	},
	"/assets/styles-DReGGc5C.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"19711-4dvOfAtC2sb8+2P4FmgiS6I4oKQ\"",
		"mtime": "2026-09-28T06:47:19.286Z",
		"size": 104209,
		"path": "../public/assets/styles-DReGGc5C.css"
	},
	"/assets/terminos-D-2pc0df.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"182d-7K4tcfg0WeWJmGGptrr+GBk13es\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 6189,
		"path": "../public/assets/terminos-D-2pc0df.js"
	},
	"/assets/wialon-session-G9vRbMzI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"592-au1VJCKLPkHJWCPlWEX81dFGj28\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 1426,
		"path": "../public/assets/wialon-session-G9vRbMzI.js"
	},
	"/assets/wialon-visibility-CmKy3sqP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90b-aCQZ8GoKDTOc3r1aqORgtUFlH/M\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 2315,
		"path": "../public/assets/wialon-visibility-CmKy3sqP.js"
	},
	"/assets/wialon.callback-trYPCA4E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"68b-/PcsXWw1ghf72EBdw8gDdPaLWdI\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 1675,
		"path": "../public/assets/wialon.callback-trYPCA4E.js"
	},
	"/assets/wialon.cms-B7SOQuRl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12c3-OAItjrvVoR415xhsztJkTDfaHno\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 4803,
		"path": "../public/assets/wialon.cms-B7SOQuRl.js"
	},
	"/assets/wialon.functions-CUgtHc1q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d4f-C5SGLzpRf9Ej3VanlWlaC42onME\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 3407,
		"path": "../public/assets/wialon.functions-CUgtHc1q.js"
	},
	"/assets/wialon.geocercas-Du0m9udl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38c0-RxATqNu7+kbVZM/mOTAGy39l7JE\"",
		"mtime": "2026-09-28T06:47:19.283Z",
		"size": 14528,
		"path": "../public/assets/wialon.geocercas-Du0m9udl.js"
	},
	"/assets/wialon.historial-DkOBeu_c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b2c-vGuLPURkW40Rs8s0k92eguLJbc8\"",
		"mtime": "2026-09-28T06:47:19.284Z",
		"size": 6956,
		"path": "../public/assets/wialon.historial-DkOBeu_c.js"
	},
	"/assets/wialon.index-Dh2orPsy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"efc-wH+3+HtoMrKwTLpcuZGapxY6xNs\"",
		"mtime": "2026-09-28T06:47:19.284Z",
		"size": 3836,
		"path": "../public/assets/wialon.index-Dh2orPsy.js"
	},
	"/assets/wialon.mapa-D5gbPs1X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cb6-YV2nFxF/S02t3ryGRP8r8rVksAY\"",
		"mtime": "2026-09-28T06:47:19.284Z",
		"size": 7350,
		"path": "../public/assets/wialon.mapa-D5gbPs1X.js"
	},
	"/assets/wialon.reportes-BnTWR_kM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6cdf4-qyNlDVMHvAqYGikOCeLjUVkUGak\"",
		"mtime": "2026-09-28T06:47:19.284Z",
		"size": 445940,
		"path": "../public/assets/wialon.reportes-BnTWR_kM.js"
	},
	"/assets/wialon.rutas-NVoHZtca.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"848f-/YXU8MdhYIpmR3uOFIe1gu4urAk\"",
		"mtime": "2026-09-28T06:47:19.284Z",
		"size": 33935,
		"path": "../public/assets/wialon.rutas-NVoHZtca.js"
	},
	"/assets/wialon.unidades-CtYHXaRc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21c6-/cLesd63wuAXVqtNjSuj5sVa3pk\"",
		"mtime": "2026-09-28T06:47:19.284Z",
		"size": 8646,
		"path": "../public/assets/wialon.unidades-CtYHXaRc.js"
	},
	"/assets/wialon.video-yGRaxD17.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a1f-cBGhcjLK9dTaHWLTEODApW+JhPg\"",
		"mtime": "2026-09-28T06:47:19.284Z",
		"size": 10783,
		"path": "../public/assets/wialon.video-yGRaxD17.js"
	},
	"/images/wialon-car.webp": {
		"type": "image/webp",
		"etag": "\"3c46e-gi00x1245BrygKZWzC4BlhITTgE\"",
		"mtime": "2026-09-28T06:47:22.801Z",
		"size": 246894,
		"path": "../public/images/wialon-car.webp"
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
