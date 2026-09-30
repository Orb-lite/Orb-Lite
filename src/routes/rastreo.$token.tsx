import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPublicUnitTracking } from "@/lib/unit-share.functions";
import { AlertCircle, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/rastreo/$token")({
  component: PublicTrackingPage,
});

function PublicTrackingPage() {
  const { token } = Route.useParams();
  const fetchPublicTracking = useServerFn(getPublicUnitTracking);

  const {
    data: linkData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["public-tracking", token],
    queryFn: () => fetchPublicTracking({ data: { token } }),
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] text-white">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 animate-spin text-cyan-400" />
          <p className="text-sm font-semibold tracking-wide text-slate-400">Cargando rastreo en vivo...</p>
        </div>
      </div>
    );
  }

  if (error || !linkData || linkData.isExpired || linkData.isRevoked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] p-4 text-white">
        <div className="max-w-md w-full rounded-2xl border border-red-500/20 bg-slate-900 p-6 text-center space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Enlace Inválido o Expirado</h2>
          <p className="text-xs text-slate-400">
            El enlace de rastreo compartido no está disponible o ha sido revocado.
          </p>
        </div>
      </div>
    );
  }

  return <PublicTrackingView linkData={linkData} />;
}

export function PublicTrackingView({ linkData }: { linkData: any }) {
  const units = React.useMemo(() => {
    if (linkData?.unitsData && Array.isArray(linkData.unitsData) && linkData.unitsData.length > 0) {
      return linkData.unitsData;
    }
    return [
      {
        unitId: linkData?.unitId ?? 1,
        unitName: linkData?.unitName ?? "Vehículo",
        position: linkData?.position,
      },
    ];
  }, [linkData]);

  const [selectedUnitId, setSelectedUnitId] = React.useState<string | number | undefined>(units[0]?.unitId);

  React.useEffect(() => {
    if (units.length > 0 && (!selectedUnitId || !units.some((u: any) => String(u.unitId) === String(selectedUnitId)))) {
      setSelectedUnitId(units[0].unitId);
    }
  }, [units, selectedUnitId]);

  const activeUnit = React.useMemo(() => {
    return units.find((u: any) => String(u.unitId) === String(selectedUnitId)) || units[0];
  }, [units, selectedUnitId]);

  const activePos = activeUnit?.position || linkData?.position;

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f19] text-white">
      {units.length > 1 && (
        <div className="flex items-center gap-2 p-3 bg-slate-900/80 border-b border-slate-800 overflow-x-auto">
          <span className="text-xs font-bold uppercase text-slate-400 mr-2">Unidad:</span>
          {units.map((u: any) => {
            const isSelected = String(selectedUnitId) === String(u.unitId);
            return (
              <button
                key={u.unitId}
                onClick={() => setSelectedUnitId(u.unitId)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {u.unitName}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col lg:flex-row flex-1 p-4 gap-4">
        <div className="flex-1 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 min-h-[400px]">
          {activePos?.lat && activePos?.lon ? (
            <iframe
              key={`${activeUnit?.unitId}-${activePos.lat}-${activePos.lon}`}
              title={`Mapa de ${activeUnit?.unitName}`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${activePos.lat},${activePos.lon}&z=15&output=embed`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500 text-sm">
              Sin coordenadas disponibles para esta unidad.
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vehículo Monitoreado</p>
                <h3 className="text-lg font-bold text-white mt-0.5">{activeUnit?.unitName}</h3>
              </div>
              <span
                className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase ${
                  (activePos?.speed ?? 0) > 0
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {(activePos?.speed ?? 0) > 0 ? "En Movimiento" : "Detenido"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/80">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Velocidad</p>
                <p className="text-lg font-bold font-mono text-cyan-400 mt-1">
                  {activePos?.speed ?? 0} <span className="text-xs font-normal text-slate-400">km/h</span>
                </p>
              </div>

              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/80">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Rumbo</p>
                <p className="text-lg font-bold font-mono text-cyan-400 mt-1">{activePos?.course ?? 0}°</p>
              </div>
            </div>

            {activePos?.lat && activePos?.lon && (
              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/80 space-y-1">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Ubicación Detectada</p>
                <p className="text-xs font-mono text-slate-300">
                  Lat: {Number(activePos.lat).toFixed(6)}, Lon: {Number(activePos.lon).toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicTrackingPage;
