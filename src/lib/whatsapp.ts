import { WHATSAPP_NUMBER } from "@/data/catalog";
import { toast } from "sonner";

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

function buildWhatsAppUrl(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  // En móvil usamos el esquema universal que abre la app.
  // En escritorio preferimos WhatsApp Web para evitar redirects bloqueados.
  if (isMobileDevice()) {
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
  }
  return `https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`;
}

async function copyMessage(message: string) {
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
export function openWhatsApp(message: string, phone: string = WHATSAPP_NUMBER) {
  const url = buildWhatsAppUrl(phone, message);
  const isMobile = isMobileDevice();

  // Intento principal: abrir desde el gesto del usuario.
  const win = window.open(url, "_blank", "noopener,noreferrer");

  // Si window.open funcionó y no fue bloqueado, listo.
  if (win && !win.closed) {
    // En móvil a veces la ventana queda abierta vacía; la cerramos.
    if (isMobile) {
      setTimeout(() => {
        try {
          win.close();
        } catch {
          /* ignorar cross-origin */
        }
      }, 500);
    }
    return;
  }

  // Fallback: click en un <a> real (algunos navegadores lo permiten aunque bloqueen window.open).
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
    /* continúa con el fallback final */
  }

  // Último recurso: copiar el mensaje.
  copyMessage(message).then((copied) => {
    if (copied) {
      toast.error("No se pudo abrir WhatsApp", {
        description: "El mensaje se copió al portapapeles. Ábrelo en WhatsApp y pégalo.",
        duration: 6000,
      });
    } else {
      toast.error("No se pudo abrir WhatsApp", {
        description: "Por favor copia el mensaje manualmente y envíalo al 33 1835 9421.",
        duration: 6000,
      });
    }
  });
}

