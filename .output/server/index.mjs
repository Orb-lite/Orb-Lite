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
		"mtime": "2026-10-01T03:43:59.703Z",
		"size": 7622,
		"path": "../public/favicon.png"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-10-01T03:43:59.703Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/PlatformHeader-DbdNoynd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b9a-Nk5jhYV+2/uZjZvjjJPC3AvX/hE\"",
		"mtime": "2026-10-01T03:43:55.271Z",
		"size": 2970,
		"path": "../public/assets/PlatformHeader-DbdNoynd.js"
	},
	"/assets/SharedRouteMap-CLjUy7GK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc9-g16M76tEfmMbbsqoRiYD1jMP0OQ\"",
		"mtime": "2026-10-01T03:43:55.271Z",
		"size": 3529,
		"path": "../public/assets/SharedRouteMap-CLjUy7GK.js"
	},
	"/assets/SharedUnitLiveMap-DqllvQDa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c05-8DgzGQErJbWvSRKQx9ds8qwFX4g\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 7173,
		"path": "../public/assets/SharedUnitLiveMap-DqllvQDa.js"
	},
	"/assets/TileLayer-BtRFXDLF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1390-pyUvCcABBEMtWZo8X6f7NiNCv/M\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 5008,
		"path": "../public/assets/TileLayer-BtRFXDLF.js"
	},
	"/assets/acceso-crm-BTQA83ii.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e4b-ki5uE4XL2PsNY9xTbNP/HZu5ydM\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 3659,
		"path": "../public/assets/acceso-crm-BTQA83ii.js"
	},
	"/assets/auth-BNSLCTjn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97a-uiETAR3cJAWzeNatflnJTzKnVtQ\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 2426,
		"path": "../public/assets/auth-BNSLCTjn.js"
	},
	"/assets/building-2-Bzau63B8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"175-8FzuiKc+z1JBfEGmWxT1Ru5EZDA\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 373,
		"path": "../public/assets/building-2-Bzau63B8.js"
	},
	"/assets/car-Djr-d9jK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18d-9BefdDkjtdib5NyYDG60bizWvYw\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 397,
		"path": "../public/assets/car-Djr-d9jK.js"
	},
	"/assets/check-T5qJrOoy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72-ws4CZzJZSQy+eaF45piXzr8b4sA\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 114,
		"path": "../public/assets/check-T5qJrOoy.js"
	},
	"/assets/clientes-Df3ZCSeY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c59-IBipwTdF0x8Zq7YLGCPYmnpEgO4\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 7257,
		"path": "../public/assets/clientes-Df3ZCSeY.js"
	},
	"/assets/clock-SDPXbCYO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f-69M5r8MnlXbW+5ISDESGuNnaJCo\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 159,
		"path": "../public/assets/clock-SDPXbCYO.js"
	},
	"/assets/contacto-D0h7W9SJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1569-FsDnWUF4xhwJgaV0qK9ngUdiKgU\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 5481,
		"path": "../public/assets/contacto-D0h7W9SJ.js"
	},
	"/assets/cpu-Dy4PKbWr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"278-/Bj10WFXrgpk4blDWeiFHDboye0\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 632,
		"path": "../public/assets/cpu-Dy4PKbWr.js"
	},
	"/assets/crm-rYeUpuDX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9121-aJ0tsGkk5xAk2ZkNrqLJHIdkdz4\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 37153,
		"path": "../public/assets/crm-rYeUpuDX.js"
	},
	"/assets/crm.functions-DDRk5HTj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a6-FmCmTAQDz5sJAUAkNc1BQuJ8MZc\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 2470,
		"path": "../public/assets/crm.functions-DDRk5HTj.js"
	},
	"/assets/demo-BdTxGtav.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1afa-d1gs41jzaPcSz977fUjlVIveinw\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 6906,
		"path": "../public/assets/demo-BdTxGtav.js"
	},
	"/assets/dialog-DqkRQsq0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"835-ik6ZOiagQyhQjzm1t5GyPSlNkfQ\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 2101,
		"path": "../public/assets/dialog-DqkRQsq0.js"
	},
	"/assets/equipo-gps-BlFdWJpM.jpg": {
		"type": "image/jpeg",
		"etag": "\"17382-feUxPY57T/4i/0uDdhAzaz8Fa7w\"",
		"mtime": "2026-10-01T03:43:55.275Z",
		"size": 95106,
		"path": "../public/assets/equipo-gps-BlFdWJpM.jpg"
	},
	"/assets/excel-export-Ci2T5PLr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c97-wjGcz3KOTLNtT4lbkfGQfpsLP6g\"",
		"mtime": "2026-10-01T03:43:55.272Z",
		"size": 11415,
		"path": "../public/assets/excel-export-Ci2T5PLr.js"
	},
	"/assets/eye-AMqdkBwF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-LL4C5rPiZ3yS/ML1pGnmHLTZ3Ms\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 246,
		"path": "../public/assets/eye-AMqdkBwF.js"
	},
	"/assets/exceljs.min-CqiXvXX6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e2f1b-tzlbl5bklg+PB/c25FuDGpbzeug\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 929563,
		"path": "../public/assets/exceljs.min-CqiXvXX6.js"
	},
	"/assets/equipo-gps-nosim-C31ZHkY7.jpg": {
		"type": "image/jpeg",
		"etag": "\"134792-l0eYqHWfSqnXu5Z/cu9GVkosfwM\"",
		"mtime": "2026-10-01T03:43:55.276Z",
		"size": 1263506,
		"path": "../public/assets/equipo-gps-nosim-C31ZHkY7.jpg"
	},
	"/assets/equipo-gps-sim-D9xGk7K_.jpg": {
		"type": "image/jpeg",
		"etag": "\"1377a7-iWxygPHRkr0yfEyqEbpESJIi6gE\"",
		"mtime": "2026-10-01T03:43:55.276Z",
		"size": 1275815,
		"path": "../public/assets/equipo-gps-sim-D9xGk7K_.jpg"
	},
	"/assets/hero-gps-M5T_qAhN.jpg": {
		"type": "image/jpeg",
		"etag": "\"2f9a1-XmWsfmyEtBcTor/8xFkpdj2dMxE\"",
		"mtime": "2026-10-01T03:43:55.276Z",
		"size": 194977,
		"path": "../public/assets/hero-gps-M5T_qAhN.jpg"
	},
	"/assets/input-DsNOAngG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"299-L/VGIyJYAbY6ynttIY+Hhd7jgdM\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 665,
		"path": "../public/assets/input-DsNOAngG.js"
	},
	"/assets/jszip.min-CuYkEcaG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176e4-8sLcC5hjFA+Xhzd2cx5NlRpuXc4\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 95972,
		"path": "../public/assets/jszip.min-CuYkEcaG.js"
	},
	"/assets/invariant-DEEwAagU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c-eVh/3DMi1s3cxf4N/OJar+ew1jA\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 60,
		"path": "../public/assets/invariant-DEEwAagU.js"
	},
	"/assets/label-B7KIxJVc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b9-xAgMuvNj+4Bhp/TAvqhZLWrEa0w\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 697,
		"path": "../public/assets/label-B7KIxJVc.js"
	},
	"/assets/layers-BxScO-pe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19b-AbZb3EiCFRT66kfUEGoJf6McgOs\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 411,
		"path": "../public/assets/layers-BxScO-pe.js"
	},
	"/assets/link-B7w8R2bX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1172-mOaHJsYFvbWWpBwUiKT4IVLRyVo\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 4466,
		"path": "../public/assets/link-B7w8R2bX.js"
	},
	"/assets/log-out-CUZx_l4_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-k8Z5uon+QqWf4JAX3vLyQCCc6gs\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 220,
		"path": "../public/assets/log-out-CUZx_l4_.js"
	},
	"/assets/map-layers-Dl5vHaL4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24907-J2GdXVQCUoIsOLu50+wzX7lZm00\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 149767,
		"path": "../public/assets/map-layers-Dl5vHaL4.js"
	},
	"/assets/map-layers-vh-t_kPv.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"3af7-hJRdDJQQrsTdSxJ69xb7a611WZ4\"",
		"mtime": "2026-10-01T03:43:55.276Z",
		"size": 15095,
		"path": "../public/assets/map-layers-vh-t_kPv.css"
	},
	"/assets/matchContext-WrdTYFnU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ba-o9C6oIlM3ABzTVOT9pcbx5cg1NY\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 186,
		"path": "../public/assets/matchContext-WrdTYFnU.js"
	},
	"/assets/plataforma-DIMbfeb8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40e-RedwQiYaYaim9zQWTgvSINNrtUo\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 1038,
		"path": "../public/assets/plataforma-DIMbfeb8.js"
	},
	"/assets/react-dom-B1EygJpe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f43-0FQjQJ8IatAGkn071g7dAeGEmDE\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 3907,
		"path": "../public/assets/react-dom-B1EygJpe.js"
	},
	"/assets/redirect-CaDPrkdo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b2-9bBwbwrhH/PEZYK8mBAWNTld9MU\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 946,
		"path": "../public/assets/redirect-CaDPrkdo.js"
	},
	"/assets/refresh-cw-C-803tme.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137-jwqK0Hdeccf+l3ivUazkfvy7erA\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 311,
		"path": "../public/assets/refresh-cw-C-803tme.js"
	},
	"/assets/renovaciones-IELsb3aA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"306c-oGsuCe1SKuustXWJbMwFi6Kq6i8\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 12396,
		"path": "../public/assets/renovaciones-IELsb3aA.js"
	},
	"/assets/rastreo._token-DEjhw_nv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4834-E5D4TBsxMomBaa0duVXrBbR0h0Y\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 18484,
		"path": "../public/assets/rastreo._token-DEjhw_nv.js"
	},
	"/assets/jsx-runtime-DKj5X9O4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2033-fcJvwSaK3kkGakce3jCNJ7gQik8\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 8243,
		"path": "../public/assets/jsx-runtime-DKj5X9O4.js"
	},
	"/assets/panel._token-GFtiYgdN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109b-Sk+eYgt6bCgN8Lka9VGBlE0gHxA\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 4251,
		"path": "../public/assets/panel._token-GFtiYgdN.js"
	},
	"/assets/orb-lite-logo-DRyoWmI5.png": {
		"type": "image/png",
		"etag": "\"8d066-AfOtK5sIu56ht4LzOQeqwTwYoy0\"",
		"mtime": "2026-10-01T03:43:55.277Z",
		"size": 577638,
		"path": "../public/assets/orb-lite-logo-DRyoWmI5.png"
	},
	"/assets/rolldown-runtime-Dd_uD5pT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"452-sZl5y+VnYZJIxKNwHO0DTqczPH0\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 1106,
		"path": "../public/assets/rolldown-runtime-Dd_uD5pT.js"
	},
	"/assets/index-BEZBSw63.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e5c2a-OUS/PM9iXwKtpfZicl20xRwTy8o\"",
		"mtime": "2026-10-01T03:43:55.271Z",
		"size": 941098,
		"path": "../public/assets/index-BEZBSw63.js"
	},
	"/assets/key-round-DEp0MeDa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"159-nb+4GA21lCzQXIMhSLQRdj+ZS5I\"",
		"mtime": "2026-10-01T03:43:55.273Z",
		"size": 345,
		"path": "../public/assets/key-round-DEp0MeDa.js"
	},
	"/assets/root-DLTE-HSj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20-vSYConOtSP6ciwr9zKsPixNwWmc\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 32,
		"path": "../public/assets/root-DLTE-HSj.js"
	},
	"/assets/route--CgRLxd2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-z4IHJbEfkUPcEXI6sPPDy3hs5Vo\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 244,
		"path": "../public/assets/route--CgRLxd2.js"
	},
	"/assets/route-B_L_rFgz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-PktUyrXYPjniiu2piI4gjnrc0TM\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 142,
		"path": "../public/assets/route-B_L_rFgz.js"
	},
	"/assets/route-share.functions-CxN12XM_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2be-e8+3ZN/i5l1mli0B928AkG3AQlg\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 702,
		"path": "../public/assets/route-share.functions-CxN12XM_.js"
	},
	"/assets/routes-CBn_OFvF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"410f-lbpVHBVV7YAxCYu//7klzC62CIE\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 16655,
		"path": "../public/assets/routes-CBn_OFvF.js"
	},
	"/assets/ruta._token-Dsf4yJ8i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c59-R4D6hwUyXH7+3mZjCiMaabghUwo\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 11353,
		"path": "../public/assets/ruta._token-Dsf4yJ8i.js"
	},
	"/assets/servicios-DSZl75KM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5c52-QQy7kmrpMloVJITSOtE1PPqQJzc\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 23634,
		"path": "../public/assets/servicios-DSZl75KM.js"
	},
	"/assets/solicitud-card-74JYAYEh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b13-oeDCfRzaMcEKHYa1ohvq5rEcSpg\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 6931,
		"path": "../public/assets/solicitud-card-74JYAYEh.js"
	},
	"/assets/store-ZlSd03zA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"636-96MHo/VBBABF/0HGLSR45Tch4sE\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 1590,
		"path": "../public/assets/store-ZlSd03zA.js"
	},
	"/assets/terminos-D-2pc0df.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"182d-7K4tcfg0WeWJmGGptrr+GBk13es\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 6189,
		"path": "../public/assets/terminos-D-2pc0df.js"
	},
	"/assets/unit-share.functions-Cp3cVwXp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32e-axO4eJ0D29vGcVV762rlNaks5UA\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 814,
		"path": "../public/assets/unit-share.functions-Cp3cVwXp.js"
	},
	"/assets/useMutation-v0u5GQCM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95b-BUKbN/i7oZIpm1YQTWhHAoswfwA\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 2395,
		"path": "../public/assets/useMutation-v0u5GQCM.js"
	},
	"/assets/useQuery-E-dldV66.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f53-g/PEigN9P+IyHjlS07ToecryTgc\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 8019,
		"path": "../public/assets/useQuery-E-dldV66.js"
	},
	"/assets/useRouter-CpseURTG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-hCZDl/qVk5VDGlWJ7SlM6m7XxAo\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 195,
		"path": "../public/assets/useRouter-CpseURTG.js"
	},
	"/assets/useServerFn-BuTCyry1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c4-T2CCWjyDrjJ2zC6fbbgGSaYgFfc\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 452,
		"path": "../public/assets/useServerFn-BuTCyry1.js"
	},
	"/assets/useStore-CHkVrBL3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ab7-1+PmVDAOBZOorRbIFs7hHyjW+BY\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 19127,
		"path": "../public/assets/useStore-CHkVrBL3.js"
	},
	"/assets/video-Ddcmzw-l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ee-WFaJSJ5+rnr5Mh/wE4mDVi5gMWo\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 238,
		"path": "../public/assets/video-Ddcmzw-l.js"
	},
	"/assets/wialon-DN0CJX_I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b94-KzJgK6DvbRZVFys6jFW4WNprfq8\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 2964,
		"path": "../public/assets/wialon-DN0CJX_I.js"
	},
	"/assets/tienda-BSWF88Hv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3546-Y5Kyyyu/+yJPUrio2nMLgsVoE/w\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 13638,
		"path": "../public/assets/tienda-BSWF88Hv.js"
	},
	"/assets/styles-BacHjYhS.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1f720-JbLB35QZuvCxK/Eiu5JS359KbHQ\"",
		"mtime": "2026-10-01T03:43:55.277Z",
		"size": 128800,
		"path": "../public/assets/styles-BacHjYhS.css"
	},
	"/assets/wialon-map-BAP3quzv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3fb1-6oRuojzoMHp/GRDRUOVpaMb1ItI\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 16305,
		"path": "../public/assets/wialon-map-BAP3quzv.js"
	},
	"/assets/wialon-session-G9vRbMzI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"592-au1VJCKLPkHJWCPlWEX81dFGj28\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 1426,
		"path": "../public/assets/wialon-session-G9vRbMzI.js"
	},
	"/assets/wialon-visibility-_h4GK9RU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90b-bI7aOOE8QsXUN1jIp4PdBnZNAhE\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 2315,
		"path": "../public/assets/wialon-visibility-_h4GK9RU.js"
	},
	"/assets/wialon-guard-In-Y1AsO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"60c-S+8VjrzUAeu6Up5LSI3WFdMmeDI\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 1548,
		"path": "../public/assets/wialon-guard-In-Y1AsO.js"
	},
	"/assets/wialon.callback-2u27yXE6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95d-vBejHZ2vOXraNflfeK9abpJhI2o\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 2397,
		"path": "../public/assets/wialon.callback-2u27yXE6.js"
	},
	"/assets/wialon.cms-DIYE4Hqv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1282-hcZZxGtQJTiJQucC5BU5zvNE8gs\"",
		"mtime": "2026-10-01T03:43:55.274Z",
		"size": 4738,
		"path": "../public/assets/wialon.cms-DIYE4Hqv.js"
	},
	"/assets/wialon.compartir-BiGSit38.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7342-34M3lF58FYxZQD+r3Ct7b0A69ow\"",
		"mtime": "2026-10-01T03:43:55.275Z",
		"size": 29506,
		"path": "../public/assets/wialon.compartir-BiGSit38.js"
	},
	"/assets/wialon.functions-DpsrzKHj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d4f-2e0WGuhmavCgPAlRk2B1ygS79VE\"",
		"mtime": "2026-10-01T03:43:55.275Z",
		"size": 3407,
		"path": "../public/assets/wialon.functions-DpsrzKHj.js"
	},
	"/assets/wialon.geocercas-BPaZtTdm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38dd-vsRM6bJE7JO0nE1fS0C86/svbqI\"",
		"mtime": "2026-10-01T03:43:55.275Z",
		"size": 14557,
		"path": "../public/assets/wialon.geocercas-BPaZtTdm.js"
	},
	"/assets/wialon.historial-8aNxVmjt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b2c-TXwgArZAk3J4+4zGh1MSGjtWqF0\"",
		"mtime": "2026-10-01T03:43:55.275Z",
		"size": 6956,
		"path": "../public/assets/wialon.historial-8aNxVmjt.js"
	},
	"/assets/wialon.index-DlTxcvHH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ed5-l1CtTnC75t1oaRC7hIITf1ixiIs\"",
		"mtime": "2026-10-01T03:43:55.275Z",
		"size": 3797,
		"path": "../public/assets/wialon.index-DlTxcvHH.js"
	},
	"/assets/wialon.mapa-D4xMHH9w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c7f-G6JDagWpOZlGmBmnQLZgYc1e1nU\"",
		"mtime": "2026-10-01T03:43:55.275Z",
		"size": 7295,
		"path": "../public/assets/wialon.mapa-D4xMHH9w.js"
	},
	"/assets/wialon.reportes-D6vkyXQn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6cdf0-kr8sMwpfCZmM7WGulH4NDXHbqgk\"",
		"mtime": "2026-10-01T03:43:55.275Z",
		"size": 445936,
		"path": "../public/assets/wialon.reportes-D6vkyXQn.js"
	},
	"/assets/wialon.rutas-Bz_s3STA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8423-QbjRlzTXMnEY0cl+1S3U39U0mJ4\"",
		"mtime": "2026-10-01T03:43:55.275Z",
		"size": 33827,
		"path": "../public/assets/wialon.rutas-Bz_s3STA.js"
	},
	"/assets/wialon.unidades-DWV_HRHL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21f0-csJT+mFqplkAD8LZkchLMT4GZEg\"",
		"mtime": "2026-10-01T03:43:55.275Z",
		"size": 8688,
		"path": "../public/assets/wialon.unidades-DWV_HRHL.js"
	},
	"/assets/wialon.video-BUUSeCLi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29b0-wVZQGPbea5LwsqyZPMm0Q62phYU\"",
		"mtime": "2026-10-01T03:43:55.275Z",
		"size": 10672,
		"path": "../public/assets/wialon.video-BUUSeCLi.js"
	},
	"/images/wialon-car.webp": {
		"type": "image/webp",
		"etag": "\"3c46e-gi00x1245BrygKZWzC4BlhITTgE\"",
		"mtime": "2026-10-01T03:43:59.703Z",
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
