import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rastreo._token-D4s8hl6n.js
var $$splitComponentImporter = () => import("./rastreo._token-4qan52DS.mjs");
var Route = createFileRoute("/rastreo/$token")({
	head: () => ({ meta: [
		{ title: "Rastreo Satelital en Vivo | ORB-LITE" },
		{
			name: "description",
			content: "Monitoreo satelital temporal en vivo con mapa interactivo y navegación Waze."
		},
		{
			property: "og:title",
			content: "Rastreo Satelital en Vivo | ORB-LITE"
		},
		{
			property: "og:description",
			content: "Consulta la ubicación en tiempo real de la unidad asignada."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
