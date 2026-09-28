import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ruta._token-D2xgqtiX.js
var $$splitComponentImporter = () => import("./ruta._token-DvlXKr5N.mjs");
var Route = createFileRoute("/ruta/$token")({
	head: () => ({ meta: [
		{ title: "Ruta asignada | ORB-LITE" },
		{
			name: "description",
			content: "Consulta tu ruta, marca tus visitas y abre cada parada en Waze."
		},
		{
			property: "og:title",
			content: "Ruta asignada | ORB-LITE"
		},
		{
			property: "og:description",
			content: "Consulta tu ruta y registra las visitas del recorrido."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
