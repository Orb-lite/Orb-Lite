import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/acceso-crm-BvAiONx7.js
var $$splitComponentImporter = () => import("./acceso-crm-asQ7VUYk.mjs");
var Route = createFileRoute("/acceso-crm")({
	validateSearch: (search) => ({ olvide: search["olvide"] === "1" || search["olvide"] === true }),
	head: () => ({ meta: [
		{ title: "Crear contraseña del CRM · ORB-LITE" },
		{
			name: "robots",
			content: "noindex, nofollow"
		},
		{
			name: "description",
			content: "Página privada de ORB-LITE para crear la contraseña del CRM con un código de un solo uso enviado por correo."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
