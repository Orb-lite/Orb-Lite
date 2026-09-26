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
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      subdomains: ["a", "b", "c", "d"],
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap &copy; CARTO",
    },
  };

/** Crea la capa Leaflet con layout oscuro exclusivo */
export function createDarkLeafletTileLayer(): L.TileLayer {
  return L.tileLayer(MAP_PROVIDERS.cartoDark.url, {
    subdomains: MAP_PROVIDERS.cartoDark.subdomains,
    maxZoom: MAP_PROVIDERS.cartoDark.maxZoom,
    attribution: MAP_PROVIDERS.cartoDark.attribution,
    crossOrigin: true,
  });
}

/** Crea capas Leaflet estándar (solo layout oscuro) */
export function createLeafletTileLayers(): {
  defaultLayer: L.TileLayer;
  baseLayers: Record<string, L.TileLayer>;
} {
  const dark = createDarkLeafletTileLayer();

  return {
    defaultLayer: dark,
    baseLayers: {
      Oscuro: dark,
    },
  };
}
