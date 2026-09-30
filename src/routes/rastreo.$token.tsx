import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

// Registra la ruta dinámica /rastreo/$token en TanStack Router
export const Route = createFileRoute("/rastreo/$token")({
  component: PublicTrackingPage,
});

function PublicTrackingPage() {
  const { token } = Route.useParams();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      {/* Pasa el token directamente a la vista */}
      <PublicTrackingView linkData={{ token }} />
    </div>
  );
}

export function PublicTrackingView({ linkData }: { linkData: any }) {
  // Arreglo de unidades adjuntas al enlace
  const units =
    linkData?.unitsData && linkData.unitsData.length > 0
      ? linkData.unitsData
      : [
          {
            unitId: linkData?.unitId ?? 1,
            unitName: linkData?.unitName ?? "Unidad de Rastreo",
            position: linkData?.initialPosition ?? { lat: 0, lon: 0, speed: 0, course: 0 },
          },
        ];

  // Estado para la unidad seleccionada actualmente
  const [selectedUnitId, setSelectedUnitId] = React.useState<number>(
    units[0]?.unitId
  );

  // Obtener los datos dinámicos de la unidad activa
  const activeUnit = React.useMemo(() => {
    return units.find((u: any) => u.unitId === selectedUnitId) || units[0];
  }, [units, selectedUnitId]);

  const activePos = activeUnit?.position || activeUnit?.initialPosition;

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f19] text-white">
      {/* Selector de Unidades Superior (Pestañas) */}
      {units.length > 1 && (
        <div className="flex items-center gap-2 p-3 bg-slate-900/80 border-b border-slate-800 overflow-x-auto">
          <span className="text-xs font-bold uppercase text-slate-400 mr-2">
            Unidad:
          </span>
          {units.map((u: any) => (
            <button
              key={u.unitId}
              onClick={() => setSelectedUnitId(u.unitId)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                selectedUnitId === u.unitId
                  ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {u.unitName}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row flex-1 p-4 gap-4">
        {/* Sección del Mapa */}
        <div className="flex-1 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 min-h-[400px]">
          {activePos ? (
            <iframe
              title={`Mapa ${activeUnit?.unitName}`}
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

        {/* Panel Lateral - Métricas de la unidad seleccionada */}
        <div className="w-full lg:w-80 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Vehículo Monitoreado
                </p>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {activeUnit?.unitName}
                </h3>
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
                <p className="text-[10px] text-slate-400 uppercase font-semibold">
                  Velocidad
                </p>
                <p className="text-lg font-bold font-mono text-cyan-400 mt-1">
                  {activePos?.speed ?? 0}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    km/h
                  </span>
                </p>
              </div>

              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/80">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">
                  Rumbo
                </p>
                <p className="text-lg font-bold font-mono text-cyan-400 mt-1">
                  {activePos?.course ?? 0}°
                </p>
              </div>
            </div>

            {activePos && (
              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/80 space-y-1">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">
                  Ubicación Detectada
                </p>
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
