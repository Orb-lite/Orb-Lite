import * as React from "react";
import { toast } from "sonner";
import {
  Bell,
  Flame,
  ShieldAlert,
  PowerOff,
  ZapOff,
  MapPinOff,
  Gauge,
  Play,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { WialonUnit } from "@/lib/wialon.functions";

export type CriticalAlert = {
  id: string;
  type:
    | "engine_overheat"
    | "unauthorized_movement"
    | "remote_cut"
    | "battery_disconnect"
    | "geofence_exit"
    | "speeding";
  title: string;
  unitName: string;
  unitId?: number;
  time: string;
  status: "CRÍTICO" | "SEGURIDAD" | "CONTROL" | "ALERTA" | "TELEMETRÍA";
  statusColor: string;
  description: string;
  metric?: string;
  read: boolean;
};

const SAMPLE_VEHICLES = [
  "Kenworth T680 #104",
  "Freightliner Cascadia #22",
  "Nissan Versa Flota #08",
  "Ford F-250 Operativa #15",
  "Isuzu ELF 400 Reparto #03",
  "Tractocamión Volvo #31",
];

function playAlertSound(isCritical = false) {
  try {
    if (typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isCritical ? "sawtooth" : "sine";
    osc.frequency.setValueAtTime(isCritical ? 880 : 587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(isCritical ? 440 : 880, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.23);
  } catch {}
}

export function AlertNotificationCenter({
  units = [],
  onSelectUnit,
}: {
  units?: WialonUnit[];
  onSelectUnit?: (unitId: number) => void;
}) {
  const [alerts, setAlerts] = React.useState<CriticalAlert[]>([]);
  const [autoSimulate, setAutoSimulate] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const getVehicleName = () => {
    if (units.length > 0) {
      const randomUnit = units[Math.floor(Math.random() * units.length)];
      return { name: randomUnit?.name || "Unidad GPS", id: randomUnit?.id };
    }
    const sample = SAMPLE_VEHICLES[Math.floor(Math.random() * SAMPLE_VEHICLES.length)];
    return { name: sample || "Unidad #01", id: undefined };
  };

  const triggerAlert = React.useCallback(
    (type: CriticalAlert["type"], customUnit?: { name: string; id?: number }) => {
      const v = customUnit || getVehicleName();
      const now = new Date();
      const timeStr = now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      let alertData: CriticalAlert;

      switch (type) {
        case "engine_overheat":
          alertData = {
            id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: "engine_overheat",
            title: "Sobrecalentamiento de Motor",
            unitName: v.name,
            unitId: v.id,
            time: timeStr,
            status: "CRÍTICO",
            statusColor: "bg-red-500/20 text-red-400 border-red-500/50",
            description: "Temperatura del refrigerante excedió el umbral seguro.",
            metric: "109 °C (Máx. 98°C)",
            read: false,
          };
          break;

        case "unauthorized_movement":
          alertData = {
            id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: "unauthorized_movement",
            title: "Movimiento No Autorizado",
            unitName: v.name,
            unitId: v.id,
            time: timeStr,
            status: "SEGURIDAD",
            statusColor: "bg-amber-500/20 text-amber-400 border-amber-500/50",
            description: "Vehículo en movimiento fuera del horario permitido.",
            metric: "Velocidad: 46 km/h",
            read: false,
          };
          break;

        case "remote_cut":
          alertData = {
            id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: "remote_cut",
            title: "Paro de Motor Remoto Activado",
            unitName: v.name,
            unitId: v.id,
            time: timeStr,
            status: "CONTROL",
            statusColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
            description: "Relevador de corte activado exitosamente.",
            metric: "Bomba inhabilitada",
            read: false,
          };
          break;

        case "battery_disconnect":
          alertData = {
            id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: "battery_disconnect",
            title: "Corte de Batería Principal",
            unitName: v.name,
            unitId: v.id,
            time: timeStr,
            status: "ALERTA",
            statusColor: "bg-purple-500/20 text-purple-400 border-purple-500/50",
            description: "Alimentación 12V/24V desconectada. Batería interna activa.",
            metric: "3.8V Backup",
            read: false,
          };
          break;

        case "geofence_exit":
          alertData = {
            id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: "geofence_exit",
            title: "Salida de Geocerca",
            unitName: v.name,
            unitId: v.id,
            time: timeStr,
            status: "SEGURIDAD",
            statusColor: "bg-blue-500/20 text-blue-400 border-blue-500/50",
            description: "La unidad abandonó la geocerca 'Base Guadalajara'.",
            metric: "20.6736, -103.3440",
            read: false,
          };
          break;

        case "speeding":
        default:
          alertData = {
            id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: "speeding",
            title: "Exceso de Velocidad Crítico",
            unitName: v.name,
            unitId: v.id,
            time: timeStr,
            status: "TELEMETRÍA",
            statusColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
            description: "La unidad superó el límite de velocidad establecido.",
            metric: "123 km/h (Límite 85)",
            read: false,
          };
          break;
      }

      setAlerts((prev) => [alertData, ...prev.slice(0, 24)]);

      if (soundEnabled) {
        playAlertSound(alertData.status === "CRÍTICO" || alertData.status === "SEGURIDAD");
      }

      toast.custom(
        (t) => (
          <div className="flex w-full max-w-md items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md">
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${
                alertData.status === "CRÍTICO"
                  ? "bg-red-500/20 text-red-400 border-red-500/40"
                  : alertData.status === "SEGURIDAD"
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    : alertData.status === "CONTROL"
                      ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                      : "bg-primary/20 text-primary border-primary/40"
              }`}
            >
              {alertData.type === "engine_overheat" && <Flame className="size-5" />}
              {alertData.type === "unauthorized_movement" && <ShieldAlert className="size-5" />}
              {alertData.type === "remote_cut" && <PowerOff className="size-5" />}
              {alertData.type === "battery_disconnect" && <ZapOff className="size-5" />}
              {alertData.type === "geofence_exit" && <MapPinOff className="size-5" />}
              {alertData.type === "speeding" && <Gauge className="size-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase border ${alertData.statusColor}`}
                >
                  {alertData.status}
                </span>
                <span className="text-[11px] text-slate-400">{alertData.time}</span>
              </div>

              <h4 className="mt-1 font-semibold text-xs text-slate-100 truncate">{alertData.title}</h4>
              <p className="text-[11px] font-medium text-cyan-300 truncate">{alertData.unitName}</p>
              <p className="mt-0.5 text-[10px] text-slate-400 leading-tight">{alertData.description}</p>

              {alertData.metric ? (
                <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-200">
                  <span>{alertData.metric}</span>
                </div>
              ) : null}

              {alertData.unitId && onSelectUnit ? (
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectUnit(alertData.unitId!);
                      toast.dismiss(t);
                    }}
                    className="rounded bg-primary/20 px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/30 transition-colors"
                  >
                    Ver en mapa
                  </button>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => toast.dismiss(t)}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1"
              aria-label="Cerrar notificación"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ),
        { duration: 6500 },
      );
    },
    [units, soundEnabled, onSelectUnit],
  );

  React.useEffect(() => {
    if (!autoSimulate) return;
    const interval = setInterval(() => {
      const types: CriticalAlert["type"][] = [
        "engine_overheat",
        "unauthorized_movement",
        "battery_disconnect",
        "speeding",
        "geofence_exit",
      ];
      const randomType = types[Math.floor(Math.random() * types.length)] || "engine_overheat";
      triggerAlert(randomType);
    }, 38000);

    return () => clearInterval(interval);
  }, [autoSimulate, triggerAlert]);

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-lg border border-border/80 bg-card/60 p-2 text-foreground transition-all hover:border-primary/50 hover:bg-card hover:text-primary"
          title="Centro de Alertas y Simulación en Vivo"
          aria-label="Centro de alertas telemáticas"
        >
          <Bell className="size-4" />
          {unreadCount > 0 ? (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 font-mono text-[9px] font-black text-white shadow-sm animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : (
            <span className="absolute top-1 right-1 size-1.5 rounded-full bg-emerald-500" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-96 rounded-2xl border border-border/80 bg-slate-950 p-4 text-foreground shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Alertas Telemáticas
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled((s) => !s)}
              className={`rounded p-1 text-xs transition-colors ${
                soundEnabled ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:bg-muted"
              }`}
              title={soundEnabled ? "Sonido activado" : "Sonido silenciado"}
            >
              {soundEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
            </button>

            {alerts.length > 0 ? (
              <button
                type="button"
                onClick={() => setAlerts([])}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Limpiar
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Play className="size-3" />
              <span>Simulador de Eventos Críticos</span>
            </p>
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-muted-foreground">
              <input
                type="checkbox"
                checked={autoSimulate}
                onChange={(e) => setAutoSimulate(e.target.checked)}
                className="rounded accent-primary size-3"
              />
              <span>Auto (40s)</span>
            </label>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => triggerAlert("engine_overheat")}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/40 px-2 py-1.5 text-left text-[11px] font-semibold text-red-300 hover:border-red-500 hover:bg-red-900/50 transition-colors"
            >
              <Flame className="size-3.5 text-red-400 shrink-0" />
              <span className="truncate">Engine Overheat</span>
            </button>

            <button
              type="button"
              onClick={() => triggerAlert("unauthorized_movement")}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/40 px-2 py-1.5 text-left text-[11px] font-semibold text-amber-300 hover:border-amber-500 hover:bg-amber-900/50 transition-colors"
            >
              <ShieldAlert className="size-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Mov. No Autorizado</span>
            </button>

            <button
              type="button"
              onClick={() => triggerAlert("remote_cut")}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2 py-1.5 text-left text-[11px] font-semibold text-cyan-300 hover:border-cyan-500 hover:bg-cyan-900/50 transition-colors"
            >
              <PowerOff className="size-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">Paro Remoto</span>
            </button>

            <button
              type="button"
              onClick={() => triggerAlert("battery_disconnect")}
              className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 px-2 py-1.5 text-left text-[11px] font-semibold text-purple-300 hover:border-purple-500 hover:bg-purple-900/50 transition-colors"
            >
              <ZapOff className="size-3.5 text-purple-400 shrink-0" />
              <span className="truncate">Corte Batería</span>
            </button>
          </div>
        </div>

        <div className="mt-3 max-h-60 overflow-y-auto space-y-2 pr-1">
          {alerts.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              <CheckCircle2 className="mx-auto size-7 text-emerald-400/60 mb-1.5" />
              <p>Sin alertas críticas pendientes.</p>
              <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                Haz clic en los botones de arriba para simular eventos en vivo.
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 p-2.5 text-xs transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase border ${alert.statusColor}`}
                  >
                    {alert.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">{alert.time}</span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <h4 className="font-semibold text-foreground text-xs">{alert.title}</h4>
                  {alert.metric ? (
                    <span className="font-mono text-[10px] font-bold text-cyan-400">{alert.metric}</span>
                  ) : null}
                </div>

                <p className="text-[11px] text-muted-foreground truncate">{alert.unitName}</p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
