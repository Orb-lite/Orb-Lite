import { i as HTTPResponse } from "../_libs/h3+rou3+srvx.mjs";

var rendererTemplate = () => new HTTPResponse("<!doctype html>\n<html lang=\"es\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>ORB-LITE | Rastreo GPS Satelital</title>\n    <meta name=\"description\" content=\"Sistema de rastreo satelital GPS en tiempo real para vehículos, flotas y empresas. Monitoreo en vivo, apagado de motor, reportes, gestión de rutas y catálogo oficial.\" />\n    <meta property=\"og:title\" content=\"ORB-LITE | Rastreo GPS Satelital\" />\n    <meta property=\"og:description\" content=\"Sistema de rastreo satelital GPS en tiempo real para vehículos, flotas y empresas. Monitoreo en vivo, apagado de motor, reportes, gestión de rutas y catálogo oficial.\" />\n    <meta property=\"og:type\" content=\"website\" />\n    <meta name=\"twitter:card\" content=\"summary_large_image\" />\n    <link rel=\"icon\" type=\"image/png\" href=\"/favicon.png\" />\n    <link rel=\"stylesheet\" href=\"/assets/styles-BcNj_6Gj.css\" />\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/assets/index-C-GYm9PH.js\"></script>\n  </body>\n</html>", { headers: { "content-type": "text/html; charset=utf-8" } });

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

export { renderIndexHTML as default };
