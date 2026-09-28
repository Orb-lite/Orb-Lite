import { n as toast } from "../_libs/sonner.mjs";
import { a as WHATSAPP_NUMBER } from "./catalog-BhuVKh9L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/whatsapp-k5-h86dD.js
function isMobileDevice() {
	if (typeof navigator === "undefined") return false;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function buildWhatsAppUrl(phone, message) {
	const encoded = encodeURIComponent(message);
	if (isMobileDevice()) return `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
	return `https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`;
}
async function copyMessage(message) {
	try {
		await navigator.clipboard.writeText(message);
		return true;
	} catch {
		return false;
	}
}
/**
* Abre WhatsApp de forma confiable dentro del gesto del usuario.
* Si el navegador bloquea la ventana emergente (común en escritorio),
* copia el mensaje al portapapeles y avisa al usuario.
*/
function openWhatsApp(message, phone = WHATSAPP_NUMBER) {
	const url = buildWhatsAppUrl(phone, message);
	const isMobile = isMobileDevice();
	const win = window.open(url, "_blank", "noopener,noreferrer");
	if (win && !win.closed) {
		if (isMobile) setTimeout(() => {
			try {
				win.close();
			} catch {}
		}, 500);
		return;
	}
	try {
		const a = document.createElement("a");
		a.href = url;
		a.target = "_blank";
		a.rel = "noopener noreferrer";
		document.body.appendChild(a);
		a.click();
		a.remove();
		return;
	} catch {}
	copyMessage(message).then((copied) => {
		if (copied) toast.error("No se pudo abrir WhatsApp", {
			description: "El mensaje se copió al portapapeles. Ábrelo en WhatsApp y pégalo.",
			duration: 6e3
		});
		else toast.error("No se pudo abrir WhatsApp", {
			description: "Por favor copia el mensaje manualmente y envíalo al 33 1835 9421.",
			duration: 6e3
		});
	});
}
//#endregion
export { openWhatsApp as t };
