// src/config/wialon.ts

export const WIALON_CONFIG = {
  // URLs base para peticiones AJAX de Wialon
  HOSTS: {
    full: "https://hst-api.wialon.com",
    kit: "https://kit-api.wialon.com",
  },
  
  // Archivo JS del SDK de Wialon si usas la librería cliente global
  SDK_URLS: {
    full: "https://hst-api.wialon.com/wsdk/script/wialon.js",
    kit: "https://kit-api.wialon.com/wsdk/script/wialon.js",
  },

  // Claves de almacenamiento local (localStorage / cookies)
  STORAGE_KEYS: {
    SESSION_ID: "wialon_sid",
    HOST_TYPE: "wialon_host_type",
    USER_DATA: "wialon_user_data",
  },

  // Banderas de búsqueda por defecto (Flags)
  SEARCH_FLAGS: {
    RESOURCE_GEOFENCES: 0x00000001 | 0x00000020, // Datos generales + Geocercas
    UNIT_BASE: 0x00000001 | 0x00000400,          // Datos generales + Última posición
  },

  // Colores por defecto para capas y rutas trazadas
  DEFAULT_COLORS: {
    ROUTE: "#92d700",
    ORIGIN_MARKER: "#2563eb",
    STOP_MARKER: "#dc2626",
    GEOFENCE_FILL: "#92d70033",
  },
} as const;

export type WialonHostType = "full" | "kit";

/**
 * Retorna la URL completa de la API AJAX según el host seleccionado.
 */
export function getWialonApiUrl(host: WialonHostType = "full"): string {
  const baseUrl = WIALON_CONFIG.HOSTS[host] || WIALON_CONFIG.HOSTS.full;
  return `${baseUrl}/wialon/ajax.html`;
}

/**
 * Formatea la distancia en metros a kilómetros o metros legibles.
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}

/**
 * Formatea la duración en segundos a horas y minutos.
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }
  return `${minutes} min`;
}

/**
 * Valida si un SID (Session ID) de Wialon sigue siendo estructuralmente válido.
 */
export function isValidWialonSid(sid?: string | null): boolean {
  return typeof sid === "string" && sid.trim().length > 0;
}
