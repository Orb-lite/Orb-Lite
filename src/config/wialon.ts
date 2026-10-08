export const WIALON_CONFIG = {
  HOSTS: {
    full: "https://hst-api.wialon.com",
    kit: "https://kit-api.wialon.com",
  },
  SDK_URLS: {
    full: "https://hst-api.wialon.com/wsdk/script/wialon.js",
    kit: "https://kit-api.wialon.com/wsdk/script/wialon.js",
  },
  STORAGE_KEYS: {
    SESSION_ID: "wialon_sid",
    HOST_TYPE: "wialon_host_type",
    USER_DATA: "wialon_user_data",
  },
  SEARCH_FLAGS: {
    RESOURCE_GEOFENCES: 0x00000001 | 0x00000020,
    UNIT_BASE: 0x00000001 | 0x00000400,
  },
  DEFAULT_COLORS: {
    ROUTE: "#92d700",
    ORIGIN_MARKER: "#2563eb",
    STOP_MARKER: "#dc2626",
    GEOFENCE_FILL: "#92d70033",
  },
} as const;

export type WialonHostType = "full" | "kit";

export function getWialonApiUrl(host: WialonHostType = "full"): string {
  const baseUrl = WIALON_CONFIG.HOSTS[host] || WIALON_CONFIG.HOSTS.full;
  return `${baseUrl}/wialon/ajax.html`;
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }
  return `${minutes} min`;
}

export function isValidWialonSid(sid?: string | null): boolean {
  return typeof sid === "string" && sid.trim().length > 0;
}
