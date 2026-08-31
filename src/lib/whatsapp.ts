import { WHATSAPP_NUMBER } from "@/data/catalog";

/**
 * Abre WhatsApp de forma confiable.
 * window.open puede ser bloqueado (popup blockers, iframes con sandbox),
 * por eso usamos un <a target="_blank"> y, si falla, navegamos en la misma pestaña.
 */
export function openWhatsApp(message: string, phone: string = WHATSAPP_NUMBER) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

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
