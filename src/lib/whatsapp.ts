import { WHATSAPP_NUMBER } from "@/data/catalog";

/**
 * Abre WhatsApp de forma confiable.
 * window.open puede ser bloqueado (popup blockers, iframes con sandbox),
 * por eso usamos un <a target="_blank"> y, si falla, navegamos en la misma pestaña.
 */
export function openWhatsApp(message: string, phone: string = WHATSAPP_NUMBER) {
  // api.whatsapp.com es el destino final de wa.me: evitamos el redirect,
  // que algunos navegadores/redes bloquean ("wa.me rechazó la conexión").
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;


  try {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  } catch {
    /* continúa con el fallback */
  }

  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) window.location.href = url;
}
