import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { wialonUnits, type WialonUnit } from "@/lib/wialon.functions";
import { clientFetchUnits } from "@/lib/wialon-client-api";
import { writeSession, type WialonSession } from "@/lib/wialon-session";

const SELECTED_UNIT_KEY = "orblite.selected_unit_id";

/** Hook global que sincroniza y comparte las unidades satelitales en todas las pestañas de la plataforma. */
export function useWialonUnitsData(session: WialonSession | null | undefined) {
  const fetchUnitsServer = useServerFn(wialonUnits);
  const [selectedUnitId, setSelectedUnitIdState] = React.useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = window.localStorage.getItem(SELECTED_UNIT_KEY);
      return stored ? Number(stored) : null;
    } catch {
      return null;
    }
  });

  const query = useQuery({
    queryKey: ["wialon-units", session?.sid, session?.host],
    queryFn: async (): Promise<WialonUnit[]> => {
      if (!session?.sid || !session?.host) return [];

      // 1. Intentar por función de servidor / Cloudflare Worker
      try {
        const res = await fetchUnitsServer({ data: { host: session.host, sid: session.sid } });
        if (res?.units && res.units.length > 0) {
          if ((res as any).detectedHost && (res as any).detectedHost !== session.host) {
            writeSession({ ...session, host: (res as any).detectedHost });
          }
          return res.units;
        }
      } catch (serverErr) {
        console.warn("[useWialonUnitsData] Error en servidor, usando cliente directo:", serverErr);
      }

      // 2. Fallback por JSONP directo al cluster de Wialon (sin CORS)
      try {
        const clientRes = await clientFetchUnits(session.host, session.sid);
        if (clientRes?.units && clientRes.units.length > 0) {
          if (clientRes.detectedHost && clientRes.detectedHost !== session.host) {
            writeSession({ ...session, host: clientRes.detectedHost });
          }
          return clientRes.units;
        }
      } catch (clientErr) {
        console.warn("[useWialonUnitsData] Error en cliente directo:", clientErr);
      }

      return [];
    },
    enabled: Boolean(session?.sid),
    staleTime: 15_000,
    refetchInterval: 15_000,
  });

  const units = query.data ?? [];

  // Mantener una unidad seleccionada por defecto si la actual no es válida o está vacía
  React.useEffect(() => {
    if (units.length > 0) {
      if (selectedUnitId == null || !units.some((u) => u.id === selectedUnitId)) {
        setSelectedUnitIdState(units[0].id);
        try {
          window.localStorage.setItem(SELECTED_UNIT_KEY, String(units[0].id));
        } catch {}
      }
    }
  }, [units, selectedUnitId]);

  const selectUnit = React.useCallback((id: number | null) => {
    setSelectedUnitIdState(id);
    if (typeof window !== "undefined") {
      try {
        if (id != null) {
          window.localStorage.setItem(SELECTED_UNIT_KEY, String(id));
        } else {
          window.localStorage.removeItem(SELECTED_UNIT_KEY);
        }
      } catch {}
    }
  }, []);

  const selectedUnit = React.useMemo(() => {
    if (!selectedUnitId) return units[0] ?? null;
    return units.find((u) => u.id === selectedUnitId) ?? units[0] ?? null;
  }, [units, selectedUnitId]);

  return {
    units,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    selectedUnitId,
    selectUnit,
    selectedUnit,
  };
}
