/**
 * Geocodificador híbrido y gratuito basado en OpenStreetMap + Photon + Detección inteligente de Google Maps.
 * Resuelve direcciones escritas, enlaces de Google Maps y coordenadas directas.
 */

export type GeocodedLocation = {
  query: string;
  label: string;
  lat: number;
  lon: number;
};

/** Intenta extraer coordenadas numéricas directas o contenidas en un enlace de Google Maps */
export function extractCoordinatesFromText(
  input: string,
): { lat: number; lon: number; labelHint?: string } | null {
  const text = input.trim();

  // 1. Coordenadas directas separadas por coma o espacio: "20.6736, -103.344" o "20.6736 -103.344"
  const directCoordMatch = text.match(
    /^([+-]?\d{1,2}(?:\.\d+)?)[,\s]+([+-]?\d{1,3}(?:\.\d+)?)$/,
  );
  if (directCoordMatch) {
    const lat = parseFloat(directCoordMatch[1]!);
    const lon = parseFloat(directCoordMatch[2]!);
    if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      return {
        lat,
        lon,
        labelHint: `Coordenadas: ${lat.toFixed(5)}, ${lon.toFixed(5)}`,
      };
    }
  }

  // 2. Coordenadas dentro de URLs de Google Maps (@lat,lon,zoom)
  const atMatch = text.match(
    /@([+-]?\d{1,2}(?:\.\d+)?),([+-]?\d{1,3}(?:\.\d+)?)/,
  );
  if (atMatch) {
    const lat = parseFloat(atMatch[1]!);
    const lon = parseFloat(atMatch[2]!);
    if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      return {
        lat,
        lon,
        labelHint: `Punto Google Maps: ${lat.toFixed(5)}, ${lon.toFixed(5)}`,
      };
    }
  }

  // 3. Parámetros de query en URLs de Google Maps (?q=lat,lon o ?query=lat,lon o ?ll=lat,lon)
  const qMatch = text.match(
    /[?&](?:q|query|ll|destination|origin)=([+-]?\d{1,2}(?:\.\d+)?)[,\s]+([+-]?\d{1,3}(?:\.\d+)?)/,
  );
  if (qMatch) {
    const lat = parseFloat(qMatch[1]!);
    const lon = parseFloat(qMatch[2]!);
    if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      return {
        lat,
        lon,
        labelHint: `Punto Google Maps: ${lat.toFixed(5)}, ${lon.toFixed(5)}`,
      };
    }
  }

  return null;
}

/** Geocodificación inversa para obtener el nombre legible de una coordenada */
export async function reverseGeocodeCoordinates(
  lat: number,
  lon: number,
): Promise<string | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", lat.toString());
    url.searchParams.set("lon", lon.toString());
    url.searchParams.set("zoom", "17");
    url.searchParams.set("addressdetails", "1");

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "ORB-LITE-App/2.0 (GPS Satelital)",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = (await res.json()) as { display_name?: string };
      if (data?.display_name) return data.display_name.trim();
    }
  } catch {
    // Si falla la geocodificación inversa, se usan las coordenadas
  }
  return null;
}

/** Palabras que no ayudan a distinguir un lugar de otro */
const STOP_WORDS = new Set([
  "de", "del", "la", "el", "los", "las", "y", "en", "a", "al",
  "calle", "av", "av.", "avenida", "blvd", "blvd.", "col", "col.",
  "colonia", "fracc", "fracc.", "num", "num.", "no", "no.", "cp",
  "mexico", "méxico", "jalisco", "guadalajara", "zapopan", "mx",
]);

/** Normaliza texto para comparar: minúsculas, sin acentos */
function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Tokens significativos de la búsqueda (sin palabras genéricas) */
function queryTokens(query: string): string[] {
  return normalizeText(query)
    .split(" ")
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}

/**
 * Puntúa qué tan bien un resultado corresponde a la búsqueda.
 * Cuenta cuántos tokens significativos aparecen en el texto del resultado.
 */
function relevanceScore(query: string, candidateText: string): number {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return 1;
  const haystack = ` ${normalizeText(candidateText)} `;
  let hits = 0;
  for (const token of tokens) {
    if (haystack.includes(` ${token}`) || haystack.includes(` ${token} `) || haystack.includes(token)) {
      hits += 1;
    }
  }
  return hits / tokens.length;
}

/** Geocodifica una dirección o enlace de Google Maps con múltiples motores libres */
export async function smartGeocode(
  addressInput: string,
): Promise<GeocodedLocation> {
  const cleanInput = addressInput.trim();
  if (!cleanInput) {
    throw new Error("La dirección no puede estar vacía.");
  }

  // A. ¿Viene como coordenadas o URL de Google Maps?
  const direct = extractCoordinatesFromText(cleanInput);
  if (direct) {
    const reverseLabel = await reverseGeocodeCoordinates(
      direct.lat,
      direct.lon,
    );
    return {
      query: cleanInput,
      label:
        reverseLabel ||
        direct.labelHint ||
        `${direct.lat.toFixed(5)}, ${direct.lon.toFixed(5)}`,
      lat: direct.lat,
      lon: direct.lon,
    };
  }

  // B. Si es un enlace corto de Google Maps (goo.gl / maps.app.goo.gl), intentar resolver la redirección
  if (cleanInput.startsWith("http://") || cleanInput.startsWith("https://")) {
    try {
      const redirectRes = await fetch(cleanInput, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(6000),
      });
      const finalUrl = redirectRes.url || cleanInput;
      const redirectDirect = extractCoordinatesFromText(finalUrl);
      if (redirectDirect) {
        const reverseLabel = await reverseGeocodeCoordinates(
          redirectDirect.lat,
          redirectDirect.lon,
        );
        return {
          query: cleanInput,
          label:
            reverseLabel ||
            redirectDirect.labelHint ||
            `${redirectDirect.lat.toFixed(5)}, ${redirectDirect.lon.toFixed(5)}`,
          lat: redirectDirect.lat,
          lon: redirectDirect.lon,
        };
      }
    } catch {
      // Continuar con búsqueda de texto
    }
  }

  // C. Probar con Photon (Komoot OSM ElasticSearch - excelente para nombres coloquiales, POIs y calles tipo Google)
  try {
    const photonUrl = new URL("https://photon.komoot.io/api/");
    photonUrl.searchParams.set("q", cleanInput);
    photonUrl.searchParams.set("limit", "5");
    // Sesgo hacia Guadalajara/México (Photon no acepta lang=es).
    photonUrl.searchParams.set("lat", "20.67");
    photonUrl.searchParams.set("lon", "-103.35");

    const photonRes = await fetch(photonUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(7000),
    });

    if (photonRes.ok) {
      const photonData = (await photonRes.json()) as {
        features?: Array<{
          geometry?: { coordinates?: [number, number] };
          properties?: {
            name?: string;
            street?: string;
            housenumber?: string;
            city?: string;
            state?: string;
            country?: string;
            countrycode?: string;
          };
        }>;
      };

      const features = photonData.features ?? [];
      // Preferir resultados de México cuando existan, pero aceptar cualquier país.
      const match =
        features.find(
          (f) =>
            f.properties?.countrycode?.toUpperCase() === "MX" ||
            f.properties?.country === "México" ||
            f.properties?.country === "Mexico",
        ) ?? features[0];
      const coords = match?.geometry?.coordinates;
      if (coords && coords.length >= 2) {
        const lon = Number(coords[0]);
        const lat = Number(coords[1]);
        if (Number.isFinite(lat) && Number.isFinite(lon)) {
          const props = match.properties ?? {};
          const parts = [
            props.name ||
              [props.street, props.housenumber].filter(Boolean).join(" "),
            props.city,
            props.state,
            props.country,
          ].filter(Boolean);
          const label = parts.length > 0 ? parts.join(", ") : cleanInput;

          return {
            query: cleanInput,
            label,
            lat,
            lon,
          };
        }
      }
    }
  } catch {
    // Si Photon falla, continuar a Nominatim
  }

  // D. Fallback con OpenStreetMap Nominatim (global), con reintento
  // usando solo el nombre del lugar cuando la búsqueda completa no da resultados.
  const nominatimQueries = [cleanInput];
  const shortName = cleanInput.split(",")[0]?.trim();
  if (shortName && shortName.length >= 3 && shortName !== cleanInput) {
    nominatimQueries.push(shortName);
  }

  for (const [i, query] of nominatimQueries.entries()) {
    if (i > 0) await new Promise((r) => setTimeout(r, 1100));
    try {
      const nominatimUrl = new URL("https://nominatim.openstreetmap.org/search");
      nominatimUrl.searchParams.set("format", "jsonv2");
      nominatimUrl.searchParams.set("limit", "1");
      nominatimUrl.searchParams.set("q", query);
      nominatimUrl.searchParams.set("addressdetails", "1");

      const nominatimRes = await fetch(nominatimUrl, {
        headers: {
          Accept: "application/json",
          "User-Agent": "ORB-LITE-App/2.0 (GPS Satelital)",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (nominatimRes.ok) {
        const matches = (await nominatimRes.json()) as Array<{
          lat?: string;
          lon?: string;
          display_name?: string;
        }>;
        const match = matches[0];
        const lat = Number(match?.lat);
        const lon = Number(match?.lon);
        if (match && Number.isFinite(lat) && Number.isFinite(lon)) {
          return {
            query: cleanInput,
            label: match.display_name?.trim() || cleanInput,
            lat,
            lon,
          };
        }
      }
    } catch {
      // Continuar con la siguiente variante
    }
  }

  throw new Error(
    `No se encontró la dirección "${cleanInput}". Puedes escribir el nombre del lugar, calle y ciudad, o pegar coordenadas directas.`,
  );
}
