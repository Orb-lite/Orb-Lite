import L from "leaflet";

export type MapTileProviderKey =
  "googleStreets" | "googleHybrid" | "googleSatellite" | "osm" | "cartoDark";

export interface MapTileProviderConfig {
  id: MapTileProviderKey;
  name: string;
  url: string;
  subdomains?: string[] | string;
  maxZoom: number;
  attribution: string;
}

export const MAP_PROVIDERS: Record<MapTileProviderKey, MapTileProviderConfig> =
  {
    googleStreets: {
      id: "googleStreets",
      name: "Google Calles (Gratis)",
      url: "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      subdomains: ["0", "1", "2", "3"],
      maxZoom: 20,
      attribution: "&copy; Google Maps &bull; Capa Libre",
    },
    googleHybrid: {
      id: "googleHybrid",
      name: "Google Híbrido",
      url: "https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
      subdomains: ["0", "1", "2", "3"],
      maxZoom: 20,
      attribution: "&copy; Google Maps &bull; Satélite con calles",
    },
    googleSatellite: {
      id: "googleSatellite",
      name: "Google Satélite",
      url: "https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      subdomains: ["0", "1", "2", "3"],
      maxZoom: 20,
      attribution: "&copy; Google Maps",
    },
    osm: {
      id: "osm",
      name: "OpenStreetMap",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      subdomains: ["a", "b", "c"],
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    },
    cartoDark: {
      id: "cartoDark",
      name: "Modo Oscuro",
      // Esri Dark Gray Canvas: capa oscura real, gratuita y sin clave.
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      maxZoom: 19,
      attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
    },
  };

/**
 * Capa oscura gratuita (Esri Dark Gray Canvas).
 * Las losetas nativas llegan a zoom 16; Leaflet las escala más allá.
 */
export const DARK_BASE_CONFIG = {
  url: MAP_PROVIDERS.cartoDark.url,
  attribution: MAP_PROVIDERS.cartoDark.attribution,
  maxZoom: 19,
  maxNativeZoom: 16,
};

/** Rótulos (nombres de calles y lugares) de la misma capa oscura de Esri. */
export const DARK_LABELS_CONFIG = {
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
  maxZoom: 19,
  maxNativeZoom: 16,
};

/** Crea la capa Leaflet oscura (base + rótulos) */
export function createDarkLeafletTileLayer(): L.LayerGroup {
  const base = L.tileLayer(DARK_BASE_CONFIG.url, {
    maxZoom: DARK_BASE_CONFIG.maxZoom,
    maxNativeZoom: DARK_BASE_CONFIG.maxNativeZoom,
    attribution: DARK_BASE_CONFIG.attribution,
    crossOrigin: true,
  });
  const labels = L.tileLayer(DARK_LABELS_CONFIG.url, {
    maxZoom: DARK_LABELS_CONFIG.maxZoom,
    maxNativeZoom: DARK_LABELS_CONFIG.maxNativeZoom,
    crossOrigin: true,
  });
  return L.layerGroup([base, labels]);
}

/** Crea capas Leaflet estándar (solo layout oscuro) */
export function createLeafletTileLayers(): {
  defaultLayer: L.LayerGroup;
  baseLayers: Record<string, L.LayerGroup>;
} {
  const dark = createDarkLeafletTileLayer();

  return {
    defaultLayer: dark,
    baseLayers: {
      Oscuro: dark,
    },
  };
}
