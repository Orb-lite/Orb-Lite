import * as React from "react";
import RouteBuilderMap from "@/components/maps/RouteBuilderMap";
import { formatDistance, formatDuration } from "@/config/wialon";
import { usePlanRoute, useSaveUserRoute } from "@/hooks/useWialonRoutes";

type Point = { lat: number; lon: number };

type RouteBuilderModalProps = {
  userId: string;
  userName?: string;
  host?: string;
  sid?: string;
  resourceId?: number;
};

export default function RouteBuilderModal({
  userId,
  userName,
  host,
  sid,
  resourceId,
}: RouteBuilderModalProps) {
  const [points, setPoints] = React.useState<Point[]>([]);
  const [calculatedPath, setCalculatedPath] = React.useState<Point[] | null>(null);
  const [routeName, setRouteName] = React.useState("");
  const [syncToWialon, setSyncToWialon] = React.useState(false);
  const [stats, setStats] = React.useState<{ distance: number; duration: number } | null>(null);

  const planRouteMutation = usePlanRoute();
  const saveRouteMutation = useSaveUserRoute();

  const handleAddPoint = (p: Point) => {
    setPoints((prev) => [...prev, p]);
    setCalculatedPath(null);
  };

  const handleMovePoint = (index: number, newP: Point) => {
    setPoints((prev) => {
      const updated = [...prev];
      updated[index] = newP;
      return updated;
    });
    setCalculatedPath(null);
  };

  const handleCalculateOSRM = () => {
    if (points.length < 2) return;

    const addresses = points.map((p) => `${p.lat}, ${p.lon}`);
    const [origin, ...destinations] = addresses;

    planRouteMutation.mutate(
      {
        origin: origin!,
        addresses: destinations,
        returnToOrigin: false,
      },
      {
        onSuccess: (data) => {
          setCalculatedPath(data.points);
          setStats({
            distance: data.distanceMeters,
            duration: data.durationSeconds,
          });
        },
      },
    );
  };

  const handleSave = () => {
    if (!routeName || points.length < 2) return;

    saveRouteMutation.mutate(
      {
        userId,
        userName,
        name: routeName,
        color: "#92d700",
        points: calculatedPath || points,
        routeStops: points.map((p, i) => ({
          lat: p.lat,
          lon: p.lon,
          label: i === 0 ? "Origen" : `Parada ${i}`,
        })),
        distanceMeters: stats?.distance,
        durationSeconds: stats?.duration,
        syncToWialon,
        host,
        sid,
        resourceId,
      },
      {
        onSuccess: () => {
          setPoints([]);
          setCalculatedPath(null);
          setRouteName("");
          setStats(null);
        },
      },
    );
  };

  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-[#090d16] p-6 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Nombre de la ruta..."
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          className="rounded-md border border-border bg-slate-900/80 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#92d700]"
        />

        <div className="flex items-center gap-3">
          {host && sid && resourceId && (
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={syncToWialon}
                onChange={(e) => setSyncToWialon(e.target.checked)}
                className="rounded border-slate-700 text-[#92d700] focus:ring-[#92d700]"
              />
              Sincronizar a Wialon
            </label>
          )}

          <button
            type="button"
            onClick={() => {
              setPoints([]);
              setCalculatedPath(null);
              setStats(null);
            }}
            className="rounded-md border border-border px-3 py-1.5 text-xs text-slate-300 transition-colors hover:bg-slate-800"
          >
            Limpiar Puntos
          </button>

          <button
            type="button"
            onClick={handleCalculateOSRM}
            disabled={points.length < 2 || planRouteMutation.isPending}
            className="rounded-md bg-[#92d700] px-4 py-1.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-[#83c200] disabled:opacity-50"
          >
            {planRouteMutation.isPending ? "Trazando..." : "Calcular por Calles"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!routeName || points.length < 2 || saveRouteMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
          >
            {saveRouteMutation.isPending ? "Guardando..." : "Guardar Ruta"}
          </button>
        </div>
      </div>

      {stats && (
        <div className="flex items-center gap-6 rounded-md border border-border/40 bg-slate-900/50 p-3 text-xs">
          <span>
            Distancia:{" "}
            <strong className="text-[#92d700]">
              {formatDistance(stats.distance)}
            </strong>
          </span>
          <span>
            Tiempo estimado:{" "}
            <strong className="text-[#92d700]">
              {formatDuration(stats.duration)}
            </strong>
          </span>
        </div>
      )}

      <RouteBuilderMap
        points={points}
        path={calculatedPath}
        onAddPoint={handleAddPoint}
        onMovePoint={handleMovePoint}
      />
    </div>
  );
}
