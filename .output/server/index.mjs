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
		"mtime": "2026-09-28T09:09:22.634Z",
		"size": 7622,
		"path": "../public/favicon.png"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-09-28T09:09:22.634Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/PlatformHeader-BL9l5YQn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11fe-LWsevtdMVGAdaUUIr2SO/LREqNM\"",
		"mtime": "2026-09-28T09:09:18.987Z",
		"size": 4606,
		"path": "../public/assets/PlatformHeader-BL9l5YQn.js"
	},
	"/assets/SharedRouteMap-DGNQPw_e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1720-9s28iWMM+EPXu+4VRoAyyLBhqlk\"",
		"mtime": "2026-09-28T09:09:18.987Z",
		"size": 5920,
		"path": "../public/assets/SharedRouteMap-DGNQPw_e.js"
	},
	"/assets/acceso-crm-B9VgUTNY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"130e-4HlG2TNEs+ffRyR8yh2G6b+fP+8\"",
		"mtime": "2026-09-28T09:09:18.987Z",
		"size": 4878,
		"path": "../public/assets/acceso-crm-B9VgUTNY.js"
	},
	"/assets/auth-By9CVjsU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dbc-L6WR/sbOdeJMm4jPKFqzNuc+paY\"",
		"mtime": "2026-09-28T09:09:18.987Z",
		"size": 3516,
		"path": "../public/assets/auth-By9CVjsU.js"
	},
	"/assets/check-D3930YT-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72-WRUxwq6gWUVZkFgyvUHCMV9ASws\"",
		"mtime": "2026-09-28T09:09:18.987Z",
		"size": 114,
		"path": "../public/assets/check-D3930YT-.js"
	},
	"/assets/clientes-Dwjp6vJd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c54-nO1R1Yo2NuuAyZw7skebZ62DdDw\"",
		"mtime": "2026-09-28T09:09:18.987Z",
		"size": 11348,
		"path": "../public/assets/clientes-Dwjp6vJd.js"
	},
	"/assets/clock-q6NhSj1r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f-f9KQ3it6WMHu3LeNWLaEbh/j63k\"",
		"mtime": "2026-09-28T09:09:18.987Z",
		"size": 159,
		"path": "../public/assets/clock-q6NhSj1r.js"
	},
	"/assets/contacto-Cid7tdoX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e62-gwwLp9IAsKiQfEU4L20J/T9pS0o\"",
		"mtime": "2026-09-28T09:09:18.987Z",
		"size": 7778,
		"path": "../public/assets/contacto-Cid7tdoX.js"
	},
	"/assets/cpu-CfyTAJ6P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"278-118ijcOQE1w4vfMa1WpnCXQu0sU\"",
		"mtime": "2026-09-28T09:09:18.987Z",
		"size": 632,
		"path": "../public/assets/cpu-CfyTAJ6P.js"
	},
	"/assets/crm-DEcOlZKZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d31e-6xhxvOdjnGF2/FjA4Q+2EqznvjE\"",
		"mtime": "2026-09-28T09:09:18.987Z",
		"size": 54046,
		"path": "../public/assets/crm-DEcOlZKZ.js"
	},
	"/assets/crm.functions-Bs7YmOeK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a6-5YyOZzjvjuJ5O53PXd+vP6ULmmA\"",
		"mtime": "2026-09-28T09:09:18.987Z",
		"size": 2470,
		"path": "../public/assets/crm.functions-Bs7YmOeK.js"
	},
	"/assets/demo-CXCHbj_F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2708-NyXbAEhb6mfWLuc7g92pqCp5uks\"",
		"mtime": "2026-09-28T09:09:18.987Z",
		"size": 9992,
		"path": "../public/assets/demo-CXCHbj_F.js"
	},
	"/assets/equipo-gps-BlFdWJpM.jpg": {
		"type": "image/jpeg",
		"etag": "\"17382-feUxPY57T/4i/0uDdhAzaz8Fa7w\"",
		"mtime": "2026-09-28T09:09:18.992Z",
		"size": 95106,
		"path": "../public/assets/equipo-gps-BlFdWJpM.jpg"
	},
	"/assets/excel-export-C8UQHiZn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c8c-7ZaEqEkXBnnJOmZ+SOW13cWZZ0k\"",
		"mtime": "2026-09-28T09:09:18.987Z",
		"size": 11404,
		"path": "../public/assets/excel-export-C8UQHiZn.js"
	},
	"/assets/external-link-Bs5pnsCg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-Jwxt7ZS3/l0lajvGJCuaaE3G8Xg\"",
		"mtime": "2026-09-28T09:09:18.988Z",
		"size": 241,
		"path": "../public/assets/external-link-Bs5pnsCg.js"
	},
	"/assets/hero-gps-M5T_qAhN.jpg": {
		"type": "image/jpeg",
		"etag": "\"2f9a1-XmWsfmyEtBcTor/8xFkpdj2dMxE\"",
		"mtime": "2026-09-28T09:09:18.994Z",
		"size": 194977,
		"path": "../public/assets/hero-gps-M5T_qAhN.jpg"
	},
	"/assets/input-DDVWVIcq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"306-A6mNwoUiF+QAmc9zczaiwCEStqo\"",
		"mtime": "2026-09-28T09:09:18.988Z",
		"size": 774,
		"path": "../public/assets/input-DDVWVIcq.js"
	},
	"/assets/jsx-dev-runtime-QuDwkETu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6667-cdFJsC5p+3dZzMjNXVyd2pOGBGo\"",
		"mtime": "2026-09-28T09:09:18.988Z",
		"size": 26215,
		"path": "../public/assets/jsx-dev-runtime-QuDwkETu.js"
	},
	"/assets/jsx-runtime-1Nj9nn90.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1627-xITlhotrTWbcy8+NBRS6Br3+ras\"",
		"mtime": "2026-09-28T09:09:18.988Z",
		"size": 5671,
		"path": "../public/assets/jsx-runtime-1Nj9nn90.js"
	},
	"/assets/exceljs.min-CqiXvXX6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e2f1b-tzlbl5bklg+PB/c25FuDGpbzeug\"",
		"mtime": "2026-09-28T09:09:18.988Z",
		"size": 929563,
		"path": "../public/assets/exceljs.min-CqiXvXX6.js"
	},
	"/assets/equipo-gps-nosim-C31ZHkY7.jpg": {
		"type": "image/jpeg",
		"etag": "\"134792-l0eYqHWfSqnXu5Z/cu9GVkosfwM\"",
		"mtime": "2026-09-28T09:09:18.993Z",
		"size": 1263506,
		"path": "../public/assets/equipo-gps-nosim-C31ZHkY7.jpg"
	},
	"/assets/equipo-gps-sim-D9xGk7K_.jpg": {
		"type": "image/jpeg",
		"etag": "\"1377a7-iWxygPHRkr0yfEyqEbpESJIi6gE\"",
		"mtime": "2026-09-28T09:09:18.994Z",
		"size": 1275815,
		"path": "../public/assets/equipo-gps-sim-D9xGk7K_.jpg"
	},
	"/assets/index-BzCrAFsn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"113fa7-7RRDzeuuGfmxuLn1Xrx40GH+S5c\"",
		"mtime": "2026-09-28T09:09:18.987Z",
		"size": 1130407,
		"path": "../public/assets/index-BzCrAFsn.js"
	},
	"/assets/jszip.min-CuYkEcaG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176e4-8sLcC5hjFA+Xhzd2cx5NlRpuXc4\"",
		"mtime": "2026-09-28T09:09:18.988Z",
		"size": 95972,
		"path": "../public/assets/jszip.min-CuYkEcaG.js"
	},
	"/assets/key-round-EeTpdsHY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"159-9sHI7wgg9wfZib5hBNO/qx2ja9o\"",
		"mtime": "2026-09-28T09:09:18.988Z",
		"size": 345,
		"path": "../public/assets/key-round-EeTpdsHY.js"
	},
	"/assets/label-DepxQ8pH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35b-d4RbQDkCLOE30KKcYcnXDuKkWMs\"",
		"mtime": "2026-09-28T09:09:18.988Z",
		"size": 859,
		"path": "../public/assets/label-DepxQ8pH.js"
	},
	"/assets/link-DjAUG4Ce.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19f6-k06S/0YAyeO7xFKvo/wioC+QvbE\"",
		"mtime": "2026-09-28T09:09:18.988Z",
		"size": 6646,
		"path": "../public/assets/link-DjAUG4Ce.js"
	},
	"/assets/log-out-BwHWemaC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-kqCuZainDHmxa84zdaQPpWfbygw\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 220,
		"path": "../public/assets/log-out-BwHWemaC.js"
	},
	"/assets/map-layers-Dl5vHaL4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24907-J2GdXVQCUoIsOLu50+wzX7lZm00\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 149767,
		"path": "../public/assets/map-layers-Dl5vHaL4.js"
	},
	"/assets/map-layers-vh-t_kPv.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"3af7-hJRdDJQQrsTdSxJ69xb7a611WZ4\"",
		"mtime": "2026-09-28T09:09:18.994Z",
		"size": 15095,
		"path": "../public/assets/map-layers-vh-t_kPv.css"
	},
	"/assets/matchContext-Dm6svprO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be-oWCC3sY15CXhgtz8gd9tbXivaPE\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 190,
		"path": "../public/assets/matchContext-Dm6svprO.js"
	},
	"/assets/panel._token-Bp8eg4GK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17f6-wapTgYUHf0EPbsKmMlKiolih3hA\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 6134,
		"path": "../public/assets/panel._token-Bp8eg4GK.js"
	},
	"/assets/radio-DPyYeel9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16c-wTK+LpikK5Hx5dy/HuBs9DpPEFo\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 364,
		"path": "../public/assets/radio-DPyYeel9.js"
	},
	"/assets/react-dom-D3ljPNMk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25a6-oeW0NBYJwJToE4oFbDcW/L3oveM\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 9638,
		"path": "../public/assets/react-dom-D3ljPNMk.js"
	},
	"/assets/redirect-CaDPrkdo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b2-9bBwbwrhH/PEZYK8mBAWNTld9MU\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 946,
		"path": "../public/assets/redirect-CaDPrkdo.js"
	},
	"/assets/refresh-cw-DwmG-wcj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137-NaWBYX4sUd58PFgkT5MPI3a9Eq4\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 311,
		"path": "../public/assets/refresh-cw-DwmG-wcj.js"
	},
	"/assets/renovaciones-DKBPYV3v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"47fb-mohGJjhdRVI3ea+Q2+CYs9a9tJM\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 18427,
		"path": "../public/assets/renovaciones-DKBPYV3v.js"
	},
	"/assets/rolldown-runtime-Dd_uD5pT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"452-sZl5y+VnYZJIxKNwHO0DTqczPH0\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 1106,
		"path": "../public/assets/rolldown-runtime-Dd_uD5pT.js"
	},
	"/assets/root-DLTE-HSj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20-vSYConOtSP6ciwr9zKsPixNwWmc\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 32,
		"path": "../public/assets/root-DLTE-HSj.js"
	},
	"/assets/rotate-ccw-N29eW5iv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c9-ZRmg56WHsa7LEi2w8X4kTcFdun0\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 713,
		"path": "../public/assets/rotate-ccw-N29eW5iv.js"
	},
	"/assets/route-BtdAf9cA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118-FzSEONuVJM8/uZAEukr8LuwTt7Q\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 280,
		"path": "../public/assets/route-BtdAf9cA.js"
	},
	"/assets/route-CrfR7pTy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-LcefKZ1Av5jcTDlt9NoLSxIov5M\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 244,
		"path": "../public/assets/route-CrfR7pTy.js"
	},
	"/assets/route-share.functions-CMjxzLQz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"320-mz7HI+TLqfUQ+Pguh9nli3+H75M\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 800,
		"path": "../public/assets/route-share.functions-CMjxzLQz.js"
	},
	"/assets/orb-lite-logo-DRyoWmI5.png": {
		"type": "image/png",
		"etag": "\"8d066-AfOtK5sIu56ht4LzOQeqwTwYoy0\"",
		"mtime": "2026-09-28T09:09:18.995Z",
		"size": 577638,
		"path": "../public/assets/orb-lite-logo-DRyoWmI5.png"
	},
	"/assets/routes-B3Z_xnG3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a5c-GFe4EIEBm8XI4Q7X5lEjky3o1/0\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 23132,
		"path": "../public/assets/routes-B3Z_xnG3.js"
	},
	"/assets/ruta._token-C5YbcP_C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b36-dHEORpE8qx/myKqcVt80Yl3hfus\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 15158,
		"path": "../public/assets/ruta._token-C5YbcP_C.js"
	},
	"/assets/servicios-DrTTnth4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7723-QknkQ+MIViTgjSOGAKibVLDlXZU\"",
		"mtime": "2026-09-28T09:09:18.989Z",
		"size": 30499,
		"path": "../public/assets/servicios-DrTTnth4.js"
	},
	"/assets/shield-check-e9E23qZ2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-b2yNQeqGLGNt4TmJQJvXUghQG9w\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 310,
		"path": "../public/assets/shield-check-e9E23qZ2.js"
	},
	"/assets/solicitud-card-DY5FqsJa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32c4-3y9XPuzdHz5TNT8g8OBJJGK1grA\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 12996,
		"path": "../public/assets/solicitud-card-DY5FqsJa.js"
	},
	"/assets/store-INWqUcOw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"905-ZspUnOJunfPmdP3IL8m5Ku6u8xw\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 2309,
		"path": "../public/assets/store-INWqUcOw.js"
	},
	"/assets/styles-2PMQNZmU.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"19765-KSK48yy9UITN9bj6zckNkVy71As\"",
		"mtime": "2026-09-28T09:09:18.995Z",
		"size": 104293,
		"path": "../public/assets/styles-2PMQNZmU.css"
	},
	"/assets/terminos-CwKUjJMQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2075-XJHxG2vk+p4/qoha5IfwJ3Ofw9o\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 8309,
		"path": "../public/assets/terminos-CwKUjJMQ.js"
	},
	"/assets/tienda-Bqy4ZmJV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4706-SE2tUvbcGBcHbOZEiwtvgr2wEbw\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 18182,
		"path": "../public/assets/tienda-Bqy4ZmJV.js"
	},
	"/assets/useMutation-Cc89taPM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95f-RJAlINvDGRiah6DjGZVNkq/5agU\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 2399,
		"path": "../public/assets/useMutation-Cc89taPM.js"
	},
	"/assets/useQuery-Dmqeqm3s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21f4-Za6bGeycE36jamgIOzSG2C7pDYk\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 8692,
		"path": "../public/assets/useQuery-Dmqeqm3s.js"
	},
	"/assets/useRouter-D6ISqIgv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-PYyBkTAAxSt9gzpnQSegPhIbOb8\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 310,
		"path": "../public/assets/useRouter-D6ISqIgv.js"
	},
	"/assets/useServerFn-DLJsEU4r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c8-/tbBn5GMxtR6ruaw3prOOhFLn0Y\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 456,
		"path": "../public/assets/useServerFn-DLJsEU4r.js"
	},
	"/assets/useStore-CFXMRSzj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"51e1-pnFlhtDcQ8d+C3pvTwstldIR59k\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 20961,
		"path": "../public/assets/useStore-CFXMRSzj.js"
	},
	"/assets/video-QspmxNQu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ee-2kx5NCsuMcTdpss1pkk2dsf64SM\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 238,
		"path": "../public/assets/video-QspmxNQu.js"
	},
	"/assets/wialon-1dkcTCFQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ea4-rL0HutmDPtqGXwHBzNL98LsvUB0\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 3748,
		"path": "../public/assets/wialon-1dkcTCFQ.js"
	},
	"/assets/wialon-guard-Cq2Ch6AT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"898-CXxKkoPUQx8HbqF9rWL3sRZ+0Z0\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 2200,
		"path": "../public/assets/wialon-guard-Cq2Ch6AT.js"
	},
	"/assets/wialon-map-BWtgCEfM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"433e-yDMpD60zJLaa8/CgSWm1JphlXt0\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 17214,
		"path": "../public/assets/wialon-map-BWtgCEfM.js"
	},
	"/assets/wialon-session-HdNO3Ta7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"596-BRMyWDzsCiEJpst3h35QezDXtRc\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 1430,
		"path": "../public/assets/wialon-session-HdNO3Ta7.js"
	},
	"/assets/wialon-visibility-BiXSA5wR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9fa-pOswolHleNp0npXA75cxMSsMTV4\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 2554,
		"path": "../public/assets/wialon-visibility-BiXSA5wR.js"
	},
	"/assets/wialon.callback-DWy7yN4X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c3-7h/qzEhR4VdlnsuxEEs4gjE9uBk\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 1987,
		"path": "../public/assets/wialon.callback-DWy7yN4X.js"
	},
	"/assets/wialon.cms-Cm3LW9AB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cb6-HSL45KJYctVOEb/2Ulta1GiNhTs\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 7350,
		"path": "../public/assets/wialon.cms-Cm3LW9AB.js"
	},
	"/assets/wialon.functions-Xl21wWqH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d4f-rOGRSPlmCfVwJMMrse6nbQilrSA\"",
		"mtime": "2026-09-28T09:09:18.990Z",
		"size": 3407,
		"path": "../public/assets/wialon.functions-Xl21wWqH.js"
	},
	"/assets/wialon.geocercas-FURj_fIv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d9b-ROEoAdjQozecbk9GB34SWH66pVI\"",
		"mtime": "2026-09-28T09:09:18.991Z",
		"size": 19867,
		"path": "../public/assets/wialon.geocercas-FURj_fIv.js"
	},
	"/assets/wialon.historial-CFImfg6u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2583-5+kP6XqxNIjIm4mzo0UpoB9ggeg\"",
		"mtime": "2026-09-28T09:09:18.991Z",
		"size": 9603,
		"path": "../public/assets/wialon.historial-CFImfg6u.js"
	},
	"/assets/wialon.index-CnQGgjVb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1332-lnLudZrejH0x793GDdQ7qcimHo8\"",
		"mtime": "2026-09-28T09:09:18.991Z",
		"size": 4914,
		"path": "../public/assets/wialon.index-CnQGgjVb.js"
	},
	"/assets/wialon.mapa-KwbSUkGF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27e5-ossa8FSAVqpQ04QDALaO+22Rkpo\"",
		"mtime": "2026-09-28T09:09:18.991Z",
		"size": 10213,
		"path": "../public/assets/wialon.mapa-KwbSUkGF.js"
	},
	"/assets/wialon.reportes-DWnNRIMx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"726e4-p0OS/21vvEXNZJ3g5xVvsgbicBk\"",
		"mtime": "2026-09-28T09:09:18.991Z",
		"size": 468708,
		"path": "../public/assets/wialon.reportes-DWnNRIMx.js"
	},
	"/assets/wialon.rutas-CCfsg2rt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2cb-nOHVLok2VVCIHEknSidUw5/ZJ9M\"",
		"mtime": "2026-09-28T09:09:18.991Z",
		"size": 45771,
		"path": "../public/assets/wialon.rutas-CCfsg2rt.js"
	},
	"/assets/wialon.unidades-DmS8C4PM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34e7-2EFDuvxmkE6MAdNDcPUP5l2mmxM\"",
		"mtime": "2026-09-28T09:09:18.991Z",
		"size": 13543,
		"path": "../public/assets/wialon.unidades-DmS8C4PM.js"
	},
	"/assets/wialon.video-lFFeZlpX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3d75-xjPqCUcCorBT6bIMLkEOCWO0aDw\"",
		"mtime": "2026-09-28T09:09:18.991Z",
		"size": 15733,
		"path": "../public/assets/wialon.video-lFFeZlpX.js"
	},
	"/images/wialon-car.webp": {
		"type": "image/webp",
		"etag": "\"3c46e-gi00x1245BrygKZWzC4BlhITTgE\"",
		"mtime": "2026-09-28T09:09:22.634Z",
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
