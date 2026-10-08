import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getUserRoutes,
  saveUserRoute,
  deleteUserRoute,
  wialonGeofences,
  wialonCreateRoute,
  wialonDeleteGeofence,
  wialonGeocodeAddresses,
  wialonPlanRoute,
} from "@/lib/wialon.functions";

export function useUserRoutes(userId: string) {
  return useQuery({
    queryKey: ["user-routes", userId],
    queryFn: () => getUserRoutes({ data: { userId } }),
    enabled: !!userId,
  });
}

export function useWialonGeofences(host: string, sid: string) {
  return useQuery({
    queryKey: ["wialon-geofences", host, sid],
    queryFn: () => wialonGeofences({ data: { host, sid } }),
    enabled: !!host && !!sid,
  });
}

export function usePlanRoute() {
  return useMutation({
    mutationFn: (payload: {
      origin: string;
      addresses: string[];
      returnToOrigin: boolean;
    }) => wialonPlanRoute({ data: payload }),
  });
}

export function useGeocodeAddresses() {
  return useMutation({
    mutationFn: (addresses: string[]) =>
      wialonGeocodeAddresses({ data: { addresses } }),
  });
}

export function useSaveUserRoute() {
  return useMutation({
    mutationFn: (payload: Parameters<typeof saveUserRoute>[0]["data"]) =>
      saveUserRoute({ data: payload }),
  });
}

export function useCreateWialonRoute() {
  return useMutation({
    mutationFn: (payload: Parameters<typeof wialonCreateRoute>[0]["data"]) =>
      wialonCreateRoute({ data: payload }),
  });
}

export function useDeleteUserRoute() {
  return useMutation({
    mutationFn: (payload: { userId: string; routeId: string }) =>
      deleteUserRoute({ data: payload }),
  });
}

export function useDeleteWialonGeofence() {
  return useMutation({
    mutationFn: (payload: Parameters<typeof wialonDeleteGeofence>[0]["data"]) =>
      wialonDeleteGeofence({ data: payload }),
  });
}
