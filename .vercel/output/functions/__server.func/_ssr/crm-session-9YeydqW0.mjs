import { t as supabase } from "./client-jASsqEMI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm-session-9YeydqW0.js
var fresh = null;
/**
* Fuerza que cada carga o recarga de página empiece sin sesión:
* la primera vez que se ejecuta en el navegador cierra cualquier sesión
* guardada. Después de eso es un no-op durante la misma carga de página,
* así el login normal sigue funcionando.
*/
function ensureFreshSession() {
	if (typeof window === "undefined") return Promise.resolve();
	if (!fresh) fresh = (async () => {
		try {
			await supabase.auth.signOut({ scope: "local" });
		} catch {}
	})();
	return fresh;
}
//#endregion
export { ensureFreshSession as t };
