/**
 * Acceso server-side a Google Maps Platform (Places New + Routes API)
 * a través del gateway de conectores. Solo se usa en el backend.
 */

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

function gatewayHeaders(): Record<string, string> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const mapsKey = process.env["GOOGLE_MAPS_API_KEY"];
  if (!lovableKey || !mapsKey) {
    throw new Error("La conexión de Google Maps no está configurada.");
  }
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": mapsKey,
    "Content-Type": "application/json",
  };
}

async function assertOk(response: Response, context: string): Promise<void> {
  if (response.ok) return;
  const body = await response.text();
  if (response.status === 403) {
    throw new Error(
      `Google Maps rechazó la solicitud de ${context} (403): ${body}`,
    );
  }
  throw new Error(`Google Maps ${context} falló (${response.status}): ${body}`);
}

export type GoogleGeocodedPlace = {
  label: string;
  lat: number;
  lon: number;
};

/** Busca una dirección con Places API (New): nombres de lugares, calles y negocios. */
export async function googleGeocodePlace(
  query: string,
): Promise<GoogleGeocodedPlace | null> {
  const response = await fetch(`${GATEWAY_URL}/places/v1/places:searchText`, {
    method: "POST",
    headers: {
      ...gatewayHeaders(),
      "X-Goog-FieldMask":
        "places.displayName,places.formattedAddress,places.location",
    },
    body: JSON.stringify({ textQuery: query, pageSize: 1 }),
    signal: AbortSignal.timeout(10000),
  });
  await assertOk(response, "búsqueda de direcciones");
  const payload = (await response.json()) as {
    places?: Array<{
      displayName?: { text?: string };
      formattedAddress?: string;
      location?: { latitude?: number; longitude?: number };
    }>;
  };
  const place = payload.places?.[0];
  const lat = place?.location?.latitude;
  const lon = place?.location?.longitude;
  if (!place || typeof lat !== "number" || typeof lon !== "number") {
    return null;
  }
  const name = place.displayName?.text?.trim();
  const address = place.formattedAddress?.trim();
  return {
    label: name && address ? `${name}, ${address}` : address || name || query,
    lat,
    lon,
  };
}

export type GoogleRouteResult = {
  points: Array<{ lat: number; lon: number }>;
  distanceMeters: number;
  durationSeconds: number;
  /** Índices de las paradas (sin el origen) en el orden óptimo calculado. */
  optimizedIntermediateOrder: number[];
};

/** Decodifica una polyline codificada de Google (formato Encoded Polyline). */
export function decodeGooglePolyline(encoded: string): Array<{ lat: number; lon: number }> {
  const points: Array<{ lat: number; lon: number }> = [];
  let index = 0;
  let lat = 0;
  let lon = 0;
  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20 && index < encoded.length);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20 && index < encoded.length);
    lon += result & 1 ? ~(result >> 1) : result >> 1;
    points.push({ lat: lat / 1e5, lon: lon / 1e5 });
  }
  return points;
}

/**
 * Calcula la ruta óptima por calles con la Routes API de Google.
 * Reordena las paradas intermedias para minimizar el recorrido.
 * Máximo 25 paradas intermedias (límite de la API con optimización).
 */
export async function googleComputeOptimizedRoute(input: {
  origin: { lat: number; lon: number };
  intermediates: Array<{ lat: number; lon: number }>;
  returnToOrigin: boolean;
}): Promise<GoogleRouteResult | null> {
  if (input.intermediates.length === 0 || input.intermediates.length > 25) {
    return null;
  }
  const toWaypoint = (point: { lat: number; lon: number }) => ({
    location: {
      latLng: { latitude: point.lat, longitude: point.lon },
    },
  });
  const destination = input.returnToOrigin
    ? input.origin
    : input.intermediates[input.intermediates.length - 1]!;
  const intermediates = input.returnToOrigin
    ? input.intermediates
    : input.intermediates.slice(0, -1);

  const response = await fetch(
    `${GATEWAY_URL}/routes/directions/v2:computeRoutes`,
    {
      method: "POST",
      headers: {
        ...gatewayHeaders(),
        "X-Goog-FieldMask":
          "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.optimizedIntermediateWaypointIndex",
      },
      body: JSON.stringify({
        origin: toWaypoint(input.origin),
        destination: toWaypoint(destination),
        intermediates: intermediates.map(toWaypoint),
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        optimizeWaypointOrder: true,
      }),
      signal: AbortSignal.timeout(20000),
    },
  );
  await assertOk(response, "cálculo de rutas");
  const payload = (await response.json()) as {
    routes?: Array<{
      distanceMeters?: number;
      duration?: string;
      polyline?: { encodedPolyline?: string };
      optimizedIntermediateWaypointIndex?: number[];
    }>;
  };
  const route = payload.routes?.[0];
  const encoded = route?.polyline?.encodedPolyline;
  if (!route || !encoded) return null;

  const points = decodeGooglePolyline(encoded);
  if (points.length < 2) return null;

  return {
    points,
    distanceMeters: Math.round(route.distanceMeters ?? 0),
    durationSeconds: Math.round(Number(route.duration?.replace("s", "")) || 0),
    optimizedIntermediateOrder: route.optimizedIntermediateWaypointIndex ?? [],
  };
}
