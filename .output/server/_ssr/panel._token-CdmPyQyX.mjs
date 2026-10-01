import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/panel._token-CdmPyQyX.js
var $$splitComponentImporter = () => import("./panel._token-5ilxLVPT.mjs");
var Route = createFileRoute("/panel/$token")({
	head: () => ({ meta: [
		{ title: "Panel interno de solicitudes · ORB-LITE" },
		{
			name: "robots",
			content: "noindex, nofollow"
		},
		{
			name: "description",
			content: "Panel privado para actualizar el estado de las solicitudes de ORB-LITE."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
