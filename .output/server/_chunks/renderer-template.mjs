import { o as HTTPResponse } from "../_libs/h3+rou3+srvx.mjs";
//#region #nitro/virtual/renderer-template
var rendererTemplate = () => new HTTPResponse("<!doctype html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"UTF-8\" />\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\r\n    <title>ORB-LITE | Rastreo GPS Satelital</title>\r\n    <meta name=\"description\" content=\"Sistema de rastreo satelital GPS en tiempo real para vehículos, flotas y empresas. Monitoreo en vivo, apagado de motor, reportes, gestión de rutas y catálogo oficial.\" />\r\n    <meta property=\"og:title\" content=\"ORB-LITE | Rastreo GPS Satelital\" />\r\n    <meta property=\"og:description\" content=\"Sistema de rastreo satelital GPS en tiempo real para vehículos, flotas y empresas. Monitoreo en vivo, apagado de motor, reportes, gestión de rutas y catálogo oficial.\" />\r\n    <meta property=\"og:type\" content=\"website\" />\r\n    <meta name=\"twitter:card\" content=\"summary_large_image\" />\r\n  </head>\r\n  <body>\r\n    <div id=\"root\"></div>\r\n    <script type=\"module\" src=\"/src/main.tsx\"><\/script>\r\n  </body>\r\n</html>\r\n\r\n", { headers: { "content-type": "text/html; charset=utf-8" } });
//#endregion
//#region node_modules/nitro/dist/runtime/internal/routes/renderer-template.mjs
function renderIndexHTML(event) {
	return rendererTemplate(event.req);
}
//#endregion
export { renderIndexHTML as default };
