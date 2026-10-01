import { i as HTTPResponse } from "../_libs/h3+rou3+srvx.mjs";
//#region #nitro/virtual/renderer-template
var rendererTemplate = () => new HTTPResponse("<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>ORB-LITE | Rastreo GPS Satelital</title>\n    <meta name=\"description\" content=\"Sistema de rastreo satelital GPS en tiempo real para vehículos, flotas y empresas. Monitoreo en vivo, apagado de motor, reportes, gestión de rutas y catálogo oficial.\" />\n    <meta property=\"og:title\" content=\"ORB-LITE | Rastreo GPS Satelital\" />\n    <meta property=\"og:description\" content=\"Sistema de rastreo satelital GPS en tiempo real para vehículos, flotas y empresas. Monitoreo en vivo, apagado de motor, reportes, gestión de rutas y catálogo oficial.\" />\n    <meta property=\"og:type\" content=\"website\" />\n    <meta name=\"twitter:card\" content=\"summary_large_image\" />\n  </head>\n  <body>\n    <!--ssr-outlet-->\n  </body>\n</html>\n\n", { headers: { "content-type": "text/html; charset=utf-8" } });
//#endregion
//#region node_modules/nitro/dist/runtime/internal/routes/renderer-template.mjs
async function renderIndexHTML(event) {
	const ssr = globalThis.__nitro_vite_envs__?.["ssr"];
	if (ssr) {
		try {
			const res = await ssr.fetch(event.req);
			if (res && res.status < 400) return res;
		} catch (err) {
			console.error("[SSR error in renderIndexHTML]:", err);
		}
	}
	return rendererTemplate(event.req);
}
//#endregion
export { renderIndexHTML as default };
