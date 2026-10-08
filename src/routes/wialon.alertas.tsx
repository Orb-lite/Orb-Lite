import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Bell,
  ShieldAlert,
  Battery,
  Gauge,
  Thermometer,
  Zap,
  Radio,
  Car,
  AlertTriangle,
  Volume2,
  CheckCircle2,
  Play,
  RotateCcw,
  Save,
  Sliders,
  Sparkles,
  PhoneCall,
  Clock,
  Filter,
  Check,
  XCircle,
  HelpCircle,
  Activity,
  Layers,
  Info,
  RefreshCw,
  Cpu,
  Mail,
  Plus,
  Trash2,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { useWialonSession } from "@/lib/wialon-session";
import { wialonUnits, wialonUnitDetail } from "@/lib/wialon.functions";
import { sendAlertEmail } from "@/lib/alert-email.functions";
import { fetchReliableUnits, clientDirectFetchUnitDetail } from "@/lib/wialon-client-api";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/wialon/alertas")({
  head: () => ({
    meta: [
      {
        title: "Alertas y Sensores por Unidad | ORB-LITE",
      },
      {
        name: "description",
        content:
          "Consulta sensores disponibles por vehículo y configura alertas personalizadas: baja batería, velocidad, temperatura, sensores de riesgo, eco-driving y pánico.",
      },
    ],
  }),
  component: WialonAlertasView,
});

export interface AlertConfig {
  // 1. Baja Batería
  batteryAlertEnabled: boolean;
  batteryMinVoltage: number; // e.g. 11.8V
  batteryDisconnectAlert: boolean;
  batteryBackupLowAlert: boolean;

  // 2. Excesos de Velocidad
  speedAlertEnabled: boolean;
  speedLimitKmh: number; // e.g. 80 km/h
  speedHighwayLimitKmh: number; // e.g. 110 km/h
  speedToleranceSec: number; // seconds

  // 3. Baja o Alta Temperatura
  tempAlertEnabled: boolean;
  tempMinCelsius: number; // e.g. -20 C
  tempMaxCelsius: number; // e.g. 4 C
  tempEngineOverheatAlert: boolean; // > 95 C

  // 4. Situaciones de Riesgo de Sensores
  sensorDoorAlert: boolean;
  sensorFuelDropAlert: boolean;
  sensorImpactAlert: boolean;
  sensorJammerAlert: boolean;

  // 5. Conducción Errática
  harshBrakingAlert: boolean;
  harshAccelAlert: boolean;
  harshCorneringAlert: boolean;
  ecoDrivingSensitivity: "baja" | "media" | "alta";

  // 6. Botón de Pánico
  sosAlertEnabled: boolean;
  sosAudioAlarm: boolean;
  sosEmergencyPhone: string;
  sosAutoStopEngine: boolean;

  // 7. Notificaciones por Correo Electrónico
  emailAlertsEnabled: boolean;
  additionalEmails: string[];
}

const DEFAULT_CONFIG: AlertConfig = {
  batteryAlertEnabled: true,
  batteryMinVoltage: 11.8,
  batteryDisconnectAlert: true,
  batteryBackupLowAlert: true,

  speedAlertEnabled: true,
  speedLimitKmh: 80,
  speedHighwayLimitKmh: 110,
  speedToleranceSec: 5,

  tempAlertEnabled: true,
  tempMinCelsius: -18,
  tempMaxCelsius: 4,
  tempEngineOverheatAlert: true,

  sensorDoorAlert: true,
  sensorFuelDropAlert: true,
  sensorImpactAlert: true,
  sensorJammerAlert: true,

  harshBrakingAlert: true,
  harshAccelAlert: true,
  harshCorneringAlert: true,
  ecoDrivingSensitivity: "media",

  sosAlertEnabled: true,
  sosAudioAlarm: true,
  sosEmergencyPhone: "3318359421",
  sosAutoStopEngine: false,

  emailAlertsEnabled: true,
  additionalEmails: [],
};

interface AlertLogItem {
  id: string;
  timestamp: string;
  unitName: string;
  type: string;
  message: string;
  severity: "critica" | "alta" | "media";
}

interface UnitSensorInfo {
  id: number;
  name: string;
  type: string;
  metrics: string;
  value: string;
  paramKey?: string;
}

interface UnitDetailState {
  loading: boolean;
  unitName: string;
  imei: string | null;
  sensors: UnitSensorInfo[];
  rawParams: Array<{ key: string; value: string }>;
  speed: number | null;
  batteryVoltage: number | null;
  ignition: boolean | null;
  hasTempSensor: boolean;
  hasFuelSensor: boolean;
  hasDoorSensor: boolean;
  hasPanicSensor: boolean;
}

function playAlertSound(type: "sos" | "warning") {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "sos") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch {}
}

function WialonAlertasView() {
  const session = useWialonSession();
  const getUnits = useServerFn(wialonUnits);
  const getUnitDetail = useServerFn(wialonUnitDetail);
  const sendAlertMail = useServerFn(sendAlertEmail);

  const [units, setUnits] = React.useState<Array<{ id: number; name: string }>>([]);
  const [selectedUnitId, setSelectedUnitId] = React.useState<string>("todas");
  const [unitDetail, setUnitDetail] = React.useState<UnitDetailState | null>(null);

  const [newEmailInput, setNewEmailInput] = React.useState("");
  const [sendingTestEmail, setSendingTestEmail] = React.useState(false);

  const [config, setConfig] = React.useState<AlertConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("orb_lite_alert_config");
        if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      } catch {}
    }
    return DEFAULT_CONFIG;
  });

  const [activeCategory, setActiveCategory] = React.useState<
    "todas" | "bateria" | "velocidad" | "temperatura" | "sensores" | "conduccion" | "sos"
  >("todas");

  const [alertLogs, setAlertLogs] = React.useState<AlertLogItem[]>([
    {
      id: "log-1",
      timestamp: "Hace 12 min",
      unitName: "Nissan NP300 #04",
      type: "Exceso de Velocidad",
      message: "Alcanzó 94 km/h en tramo urbano (Límite configurado: 80 km/h)",
      severity: "media",
    },
    {
      id: "log-2",
      timestamp: "Hace 45 min",
      unitName: "Thermo King Van #02",
      type: "Temperatura de Cadena de Frío",
      message: "Temperatura subió a 7.2°C (Rango máx: 4.0°C). Posible puerta abierta.",
      severity: "alta",
    },
    {
      id: "log-3",
      timestamp: "Hace 2 horas",
      unitName: "Tracto Kenworth T680",
      type: "Batería Vehicular Baja",
      message: "Voltaje del acumulador descendió a 11.4V con motor apagado.",
      severity: "media",
    },
  ]);

  // Cargar lista de unidades con fallback resiliente
  React.useEffect(() => {
    if (!session) return;
    let active = true;
    fetchReliableUnits({ session, fetchUnitsServerFn: getUnits })
      .then((res) => {
        if (!active) return;
        if (res?.units && Array.isArray(res.units)) {
          const loadedUnits = res.units.map((u: any) => ({
            id: u.id,
            name: u.name,
          }));
          setUnits(loadedUnits);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [session, getUnits]);

  // Cargar configuración guardada por unidad si cambia la selección
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const key =
      selectedUnitId === "todas"
        ? "orb_lite_alert_config"
        : `orb_lite_alert_config_unit_${selectedUnitId}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(saved) });
      } else {
        // Fallback a configuración general
        const general = localStorage.getItem("orb_lite_alert_config");
        if (general) setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(general) });
        else setConfig(DEFAULT_CONFIG);
      }
    } catch {}
  }, [selectedUnitId]);

  // Cargar detalle y sensores de la unidad seleccionada
  const fetchUnitSensors = React.useCallback(
    async (unitIdNum: number) => {
      if (!session) return;
      setUnitDetail((prev) => ({
        loading: true,
        unitName: prev?.unitName || "Cargando...",
        imei: prev?.imei || null,
        sensors: prev?.sensors || [],
        rawParams: prev?.rawParams || [],
        speed: prev?.speed || 0,
        batteryVoltage: prev?.batteryVoltage || null,
        ignition: prev?.ignition || null,
        hasTempSensor: prev?.hasTempSensor || false,
        hasFuelSensor: prev?.hasFuelSensor || false,
        hasDoorSensor: prev?.hasDoorSensor || false,
        hasPanicSensor: prev?.hasPanicSensor || false,
      }));

      try {
        let detail: any = null;
        try {
          detail = await getUnitDetail({
            data: { host: session.host, sid: session.sid, unitId: unitIdNum },
          });
        } catch {}

        if (!detail || !detail.sensors?.length) {
          const direct = await clientDirectFetchUnitDetail(session.host, session.sid, unitIdNum);
          if (direct) {
            detail = direct;
          }
        }

        if (detail) {
          const sensorsList: UnitSensorInfo[] = (detail.sensors || []).map((s: any) => ({
            id: s.id,
            name: s.name,
            type: s.type,
            metrics: s.metrics || "",
            value: s.value,
          }));

          const rawParams = detail.params || [];

          // Detección inteligente de voltaje
          let batteryVoltage: number | null = null;
          const voltageSensor = sensorsList.find(
            (s) =>
              s.type?.toLowerCase().includes("voltage") ||
              s.type?.toLowerCase().includes("volt") ||
              s.name?.toLowerCase().includes("bater") ||
              s.name?.toLowerCase().includes("volt"),
          );
          if (voltageSensor && !isNaN(parseFloat(voltageSensor.value))) {
            batteryVoltage = parseFloat(voltageSensor.value);
          } else {
            const pwrParam = rawParams.find(
              (p) =>
                p.key === "pwr_ext" ||
                p.key === "battery" ||
                p.key === "external_voltage" ||
                p.key === "ext_v",
            );
            if (pwrParam && !isNaN(parseFloat(pwrParam.value))) {
              batteryVoltage = parseFloat(pwrParam.value);
            }
          }

          // Detección de temperatura
          const hasTempSensor =
            sensorsList.some(
              (s) =>
                s.type?.toLowerCase().includes("temp") || s.name?.toLowerCase().includes("temp"),
            ) || rawParams.some((p) => p.key.toLowerCase().includes("temp"));

          // Detección de combustible
          const hasFuelSensor =
            sensorsList.some(
              (s) =>
                s.type?.toLowerCase().includes("fuel") ||
                s.type?.toLowerCase().includes("nivel") ||
                s.name?.toLowerCase().includes("combust"),
            ) || rawParams.some((p) => p.key.toLowerCase().includes("fuel"));

          // Detección de puertas
          const hasDoorSensor =
            sensorsList.some(
              (s) =>
                s.type?.toLowerCase().includes("door") || s.name?.toLowerCase().includes("puerta"),
            ) || rawParams.some((p) => p.key.toLowerCase().includes("door"));

          // Detección de botón de pánico
          const hasPanicSensor =
            sensorsList.some(
              (s) =>
                s.type?.toLowerCase().includes("panic") ||
                s.type?.toLowerCase().includes("sos") ||
                s.name?.toLowerCase().includes("panico") ||
                s.name?.toLowerCase().includes("sos"),
            ) ||
            rawParams.some(
              (p) => p.key.toLowerCase().includes("sos") || p.key.toLowerCase().includes("panic"),
            );

          // Ignición
          const ignSensor = sensorsList.find(
            (s) =>
              s.type?.toLowerCase().includes("ign") || s.name?.toLowerCase().includes("ignic"),
          );
          let ignition: boolean | null = null;
          if (ignSensor) {
            ignition = ignSensor.value === "1" || ignSensor.value.toLowerCase() === "activo";
          }

          setUnitDetail({
            loading: false,
            unitName: detail.unit?.name || `Unidad ${unitIdNum}`,
            imei: detail.uniqueId,
            sensors: sensorsList,
            rawParams,
            speed: detail.unit?.speed ?? null,
            batteryVoltage,
            ignition,
            hasTempSensor,
            hasFuelSensor,
            hasDoorSensor,
            hasPanicSensor,
          });
        }
      } catch (err) {
        setUnitDetail((prev) => (prev ? { ...prev, loading: false } : null));
      }
    },
    [session, getUnitDetail],
  );

  React.useEffect(() => {
    if (selectedUnitId !== "todas" && !isNaN(parseInt(selectedUnitId, 10))) {
      fetchUnitSensors(parseInt(selectedUnitId, 10));
    } else {
      setUnitDetail(null);
    }
  }, [selectedUnitId, fetchUnitSensors]);

  const handleSaveForUnit = async () => {
    try {
      const key =
        selectedUnitId === "todas"
          ? "orb_lite_alert_config"
          : `orb_lite_alert_config_unit_${selectedUnitId}`;
      localStorage.setItem(key, JSON.stringify(config));
      const targetLabel =
        selectedUnitId === "todas"
          ? "todas las unidades"
          : units.find((u) => String(u.id) === selectedUnitId)?.name || "la unidad seleccionada";
      toast.success(`Reglas guardadas exitosamente para ${targetLabel}`);

      // Sincronizar en Supabase para persistencia y respaldo en la nube
      try {
        const token = `alert_cfg_${selectedUnitId}_${session?.userId || "user"}`;
        const { data: existing } = await supabase
          .from("shared_links")
          .select("id")
          .eq("token", token)
          .maybeSingle();

        const rowId = existing?.id || crypto.randomUUID();
        await supabase.from("shared_links").upsert({
          id: rowId,
          token,
          unit_id: `alert_config_${selectedUnitId}`,
          name: JSON.stringify(config),
          created_by_name: session?.userName || null,
          created_by_id: session?.userId ? String(session.userId) : null,
          is_active: true,
        });
      } catch (err) {
        console.warn("[alertas] Supabase sync alert config:", err);
      }
    } catch {
      toast.error("No se pudo guardar la configuración");
    }
  };

  const handleApplyToAllUnits = async () => {
    try {
      localStorage.setItem("orb_lite_alert_config", JSON.stringify(config));
      for (const u of units) {
        localStorage.setItem(`orb_lite_alert_config_unit_${u.id}`, JSON.stringify(config));
      }
      toast.success("Reglas replicadas y aplicadas a todas las unidades");

      // Sincronizar regla general en Supabase
      try {
        const token = `alert_cfg_todas_${session?.userId || "user"}`;
        const { data: existing } = await supabase
          .from("shared_links")
          .select("id")
          .eq("token", token)
          .maybeSingle();

        const rowId = existing?.id || crypto.randomUUID();
        await supabase.from("shared_links").upsert({
          id: rowId,
          token,
          unit_id: "alert_config_todas",
          name: JSON.stringify(config),
          created_by_name: session?.userName || null,
          created_by_id: session?.userId ? String(session.userId) : null,
          is_active: true,
        });
      } catch (err) {
        console.warn("[alertas] Supabase sync all alert configs:", err);
      }
    } catch {
      toast.error("Error al replicar las reglas");
    }
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    const key =
      selectedUnitId === "todas"
        ? "orb_lite_alert_config"
        : `orb_lite_alert_config_unit_${selectedUnitId}`;
    localStorage.removeItem(key);
    toast.info("Valores restablecidos a los recomendados");
  };

  const handleAddEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newEmailInput.trim().toLowerCase();
    if (!clean) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      toast.error("Ingresa un correo electrónico válido");
      return;
    }
    if (clean === "ventas@orb-lite.com") {
      toast.info("ventas@orb-lite.com ya está configurado como correo central por defecto");
      setNewEmailInput("");
      return;
    }
    if (config.additionalEmails.includes(clean)) {
      toast.info("Este correo ya está registrado");
      return;
    }
    setConfig((prev) => ({
      ...prev,
      additionalEmails: [...prev.additionalEmails, clean],
    }));
    setNewEmailInput("");
    toast.success(`Correo ${clean} agregado a la lista`);
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setConfig((prev) => ({
      ...prev,
      additionalEmails: prev.additionalEmails.filter((e) => e !== emailToRemove),
    }));
    toast.info(`Correo ${emailToRemove} eliminado`);
  };

  const handleSendTestEmail = async () => {
    setSendingTestEmail(true);
    const unitName =
      selectedUnitId === "todas"
        ? units[0]?.name || "Vehículo Demo"
        : units.find((u) => String(u.id) === selectedUnitId)?.name || "Vehículo Seleccionado";

    try {
      const res = await sendAlertMail({
        data: {
          unitName,
          alertType: "Verificación de Canal de Alertas por Correo",
          message:
            "Esta es una prueba del sistema de notificaciones automáticas de ORB-LITE. Si recibes este correo, tus alertas vehiculares están correctamente enlazadas.",
          severity: "media",
          additionalEmails: config.additionalEmails,
          details: {
            Vehículo: unitName,
            "Destinatario central": "ventas@orb-lite.com",
            "Destinatarios adicionales":
              config.additionalEmails.length > 0
                ? config.additionalEmails.join(", ")
                : "Ninguno registrado",
            Estado: "Canal verificado y activo",
          },
        },
      });

      if (res?.success) {
        toast.success(
          `Correo de prueba enviado a ventas@orb-lite.com ${
            config.additionalEmails.length > 0
              ? `y a ${config.additionalEmails.length} correo(s) adicional(es)`
              : ""
          }`,
        );
      }
    } catch (err: any) {
      toast.error(err?.message || "Error al enviar correo de prueba");
    } finally {
      setSendingTestEmail(false);
    }
  };

  const handleSimulateAlert = (
    type: string,
    message: string,
    severity: "critica" | "alta" | "media",
  ) => {
    const unitName =
      selectedUnitId === "todas"
        ? units[0]?.name || "Vehículo Demo"
        : units.find((u) => String(u.id) === selectedUnitId)?.name || "Vehículo Seleccionado";

    if (severity === "critica") {
      playAlertSound("sos");
    } else {
      playAlertSound("warning");
    }

    const newLog: AlertLogItem = {
      id: `sim-${Date.now()}`,
      timestamp: "Ahora mismo",
      unitName,
      type,
      message,
      severity,
    };

    setAlertLogs((prev) => [newLog, ...prev.slice(0, 19)]);

    if (severity === "critica") {
      toast.error(`🚨 [ALERTA SOS] ${unitName}: ${message}`, { duration: 8000 });
    } else if (severity === "alta") {
      toast.warning(`⚠️ [ALERTA PRIORITARIA] ${unitName}: ${message}`, { duration: 6000 });
    } else {
      toast.info(`🔔 [AVISO] ${unitName}: ${message}`, { duration: 5000 });
    }

    // Envío automático de correo a ventas@orb-lite.com y destinatarios adicionales
    if (config.emailAlertsEnabled) {
      sendAlertMail({
        data: {
          unitName,
          alertType: type,
          message,
          severity,
          additionalEmails: config.additionalEmails,
          details: {
            Vehículo: unitName,
            "Tipo de Alerta": type,
            Severidad: severity.toUpperCase(),
            "Destinatario central": "ventas@orb-lite.com",
            "Destinatarios adicionales":
              config.additionalEmails.length > 0
                ? config.additionalEmails.join(", ")
                : "Ninguno registrado",
          },
        },
      })
        .then((res) => {
          if (res?.success) {
            toast.success(
              `Notificación de alerta enviada por correo a ventas@orb-lite.com ${
                config.additionalEmails.length > 0
                  ? `y ${config.additionalEmails.length} correo(s) adicional(es)`
                  : ""
              }`,
            );
          }
        })
        .catch(() => {});
    }
  };

  return (
    <div className="space-y-8">
      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Bell className="size-3.5" />
            <span>Configuración de Alertas y Diagnóstico de Sensores</span>
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold uppercase text-foreground">
            Alertas y Sensores <span className="text-gradient-lime">por Unidad</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Inspecciona los sensores disponibles por vehículo y personaliza umbrales específicos:
            voltaje de batería, excesos de velocidad, temperatura, sensores de cabina, eco-driving y
            botón de pánico.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-foreground transition"
            title="Restablecer valores recomendados"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Restablecer</span>
          </button>
          <button
            type="button"
            onClick={handleSaveForUnit}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition shadow"
          >
            <Save className="size-3.5" />
            <span>Guardar Unidad</span>
          </button>
          {selectedUnitId !== "todas" && (
            <button
              type="button"
              onClick={handleApplyToAllUnits}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/50 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition"
              title="Copiar estas reglas a todos los autos"
            >
              <Sliders className="size-3.5" />
              <span className="hidden sm:inline">Aplicar a Todas</span>
            </button>
          )}
        </div>
      </div>

      {/* SELECTOR PRINCIPAL DE UNIDAD */}
      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Car className="size-6" />
            </div>
            <div>
              <label
                htmlFor="unit-picker"
                className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Vehículo a inspeccionar y configurar:
              </label>
              <div className="mt-1 flex items-center gap-2">
                <select
                  id="unit-picker"
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none min-w-[240px]"
                >
                  <option value="todas">
                    🌐 Todas las unidades ({units.length} vehículos en cuenta)
                  </option>
                  {units.map((u) => (
                    <option key={u.id} value={String(u.id)}>
                      🚗 {u.name} (ID: {u.id})
                    </option>
                  ))}
                </select>

                {selectedUnitId !== "todas" && (
                  <button
                    type="button"
                    onClick={() => fetchUnitSensors(parseInt(selectedUnitId, 10))}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground hover:text-primary transition"
                    title="Refrescar sensores"
                  >
                    <RefreshCw className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* FILTRO DE CATEGORÍAS */}
          <div className="flex flex-wrap items-center gap-1.5 border-t sm:border-t-0 pt-3 sm:pt-0">
            {[
              { id: "todas", label: "Todas las Alertas" },
              { id: "bateria", label: "Batería" },
              { id: "velocidad", label: "Velocidad" },
              { id: "temperatura", label: "Temperatura" },
              { id: "sensores", label: "Sensores" },
              { id: "conduccion", label: "Conducción" },
              { id: "sos", label: "Botón SOS" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FICHA DIAGNÓSTICA DE SENSORES DE LA UNIDAD SELECCIONADA */}
        {selectedUnitId !== "todas" && (
          <div className="rounded-xl border border-primary/30 bg-background/60 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-primary" />
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
                  Diagnóstico de Telemetría: {unitDetail?.unitName || "Cargando..."}
                </h3>
                {unitDetail?.imei && (
                  <span className="font-mono text-[10px] text-muted-foreground">
                    (IMEI: {unitDetail.imei})
                  </span>
                )}
              </div>

              {unitDetail?.loading && (
                <span className="inline-flex items-center gap-1.5 text-xs text-primary animate-pulse font-semibold">
                  <RefreshCw className="size-3 animate-spin" />
                  Consultando sensores en vivo...
                </span>
              )}
            </div>

            {/* RESUMEN DE COMPATIBILIDAD POR ALERTA */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              {/* Batería */}
              <div className="rounded-lg border border-border/60 bg-card/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Battery className="size-3.5 text-amber-400" />
                    Batería Vehicular
                  </span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    Compatible
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {unitDetail?.batteryVoltage != null
                    ? `Voltaje actual detectado: ${unitDetail.batteryVoltage} V`
                    : "Línea de alimentación de arnés 12V/24V activa"}
                </p>
              </div>

              {/* Velocidad */}
              <div className="rounded-lg border border-border/60 bg-card/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Gauge className="size-3.5 text-blue-400" />
                    Velocidad GPS
                  </span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    100% Nativo
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {unitDetail?.speed != null
                    ? `Velocidad actual: ${Math.round(unitDetail.speed)} km/h`
                    : "Módulo satelital GNSS 4G habilitado"}
                </p>
              </div>

              {/* Temperatura */}
              <div className="rounded-lg border border-border/60 bg-card/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Thermometer className="size-3.5 text-cyan-400" />
                    Sensor Temperatura
                  </span>
                  {unitDetail?.hasTempSensor ? (
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      Instalado
                    </span>
                  ) : (
                    <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                      Opcional BLE
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {unitDetail?.hasTempSensor
                    ? "Sensor térmico configurado para cadena de frío/motor"
                    : "Requiere sensor BLE / 1-Wire para alertas de frío"}
                </p>
              </div>

              {/* Sensores de Riesgo */}
              <div className="rounded-lg border border-border/60 bg-card/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Radio className="size-3.5 text-purple-400" />
                    Sensores de Riesgo
                  </span>
                  <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-bold text-purple-400">
                    Habilitado
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {unitDetail?.hasDoorSensor
                    ? "Entrada digital de puertas activa"
                    : "Detección de corte de corriente e impactos activa"}
                </p>
              </div>

              {/* Eco-Driving */}
              <div className="rounded-lg border border-border/60 bg-card/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Zap className="size-3.5 text-orange-400" />
                    Conducción Errática
                  </span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    Acelerómetro
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Hardware Teltonika 4G con giroscopio para frenadas y curvas
                </p>
              </div>

              {/* Botón SOS */}
              <div className="rounded-lg border border-border/60 bg-card/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldAlert className="size-3.5 text-red-400" />
                    Botón de Pánico (SOS)
                  </span>
                  <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                    {unitDetail?.hasPanicSensor ? "Pulsador Físico" : "App / Virtual"}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {unitDetail?.hasPanicSensor
                    ? "Botón físico oculto en cabina conectado a entrada digital"
                    : "Alerta SOS virtual desde panel web y smartphone"}
                </p>
              </div>
            </div>

            {/* TABLA DE SENSORES ESPECÍFICOS REGISTRADOS EN WIALON */}
            {unitDetail?.sensors && unitDetail.sensors.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Sensores configurados en Wialon ({unitDetail.sensors.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {unitDetail.sensors.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-2 rounded-md border border-border/80 bg-card px-2.5 py-1 text-xs"
                    >
                      <Activity className="size-3 text-primary" />
                      <span className="font-semibold text-foreground">{s.name}</span>
                      <span className="text-muted-foreground font-mono">
                        ({s.value} {s.metrics})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CANAL DE NOTIFICACIONES POR CORREO ELECTRÓNICO */}
      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Mail className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold uppercase text-foreground">
                  Canal de Notificaciones por Correo Electrónico
                </h3>
                <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                  Activo
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Cada vez que se genere una alerta, se enviará una notificación detallada
                automáticamente a <strong className="text-foreground">ventas@orb-lite.com</strong> y a
                los correos adicionales registrados.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              disabled={sendingTestEmail}
              onClick={handleSendTestEmail}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted hover:border-primary transition disabled:opacity-50"
            >
              <Send className="size-3 text-primary" />
              <span>{sendingTestEmail ? "Enviando..." : "Enviar Correo de Prueba"}</span>
            </button>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.emailAlertsEnabled}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, emailAlertsEnabled: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* LISTA DE CORREOS */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Correo central fijo */}
            <div className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-xs font-semibold text-primary">
              <Mail className="size-3.5" />
              <span>ventas@orb-lite.com</span>
              <span className="rounded bg-primary/20 px-1.5 py-0.2 text-[9px] uppercase tracking-wider font-bold">
                Central Permanente
              </span>
            </div>

            {/* Correos adicionales */}
            {config.additionalEmails.map((email) => (
              <div
                key={email}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground group hover:border-destructive/60 transition"
              >
                <span>{email}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveEmail(email)}
                  className="text-muted-foreground hover:text-destructive transition p-0.5"
                  title={`Eliminar ${email}`}
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Formulario para agregar más correos */}
          <form
            onSubmit={handleAddEmail}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-lg pt-1"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="email"
                value={newEmailInput}
                onChange={(e) => setNewEmailInput(e.target.value)}
                placeholder="Registrar correo adicional (ej: seguridad@miempresa.com)"
                className="w-full rounded-lg border border-border bg-background py-1.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-muted px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition shrink-0"
            >
              <Plus className="size-3.5" />
              <span>Agregar Correo</span>
            </button>
          </form>
        </div>
      </div>

      {/* TARJETAS DE LAS 6 ALERTAS CONFIGURABLES */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 1. BAJA BATERÍA */}
        {(activeCategory === "todas" || activeCategory === "bateria") && (
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/70 p-5 shadow-sm hover:border-primary/50 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                    <Battery className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Energía & Voltaje
                      </span>
                      <span className="rounded bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                        100% Viable
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold uppercase text-foreground">
                      Baja Batería
                    </h3>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.batteryAlertEnabled}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, batteryAlertEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Status de sensor en unidad */}
              <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Sensor vinculado:</span>
                <span className="font-semibold text-foreground">
                  {unitDetail?.batteryVoltage != null
                    ? `Línea 12V/24V (${unitDetail.batteryVoltage}V actual)`
                    : "Sensor de Voltaje / Arnés principal"}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Supervisa el acumulador del vehículo para prevenir descarga profunda y emite aviso
                urgente si cortan la batería externa.
              </p>

              <div className="space-y-3 rounded-xl border border-border/60 bg-background/50 p-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold">
                    <span>Umbral Mínimo de Voltaje:</span>
                    <span className="text-primary font-mono">{config.batteryMinVoltage}V</span>
                  </div>
                  <input
                    type="range"
                    min="10.5"
                    max="12.5"
                    step="0.1"
                    value={config.batteryMinVoltage}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        batteryMinVoltage: parseFloat(e.target.value),
                      }))
                    }
                    className="mt-1.5 w-full accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>10.5V (Crítico)</span>
                    <span>11.8V (Recomendado)</span>
                    <span>12.5V</span>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1 border-t border-border/40">
                  <input
                    type="checkbox"
                    checked={config.batteryDisconnectAlert}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, batteryDisconnectAlert: e.target.checked }))
                    }
                    className="rounded text-primary focus:ring-primary size-3.5"
                  />
                  <span className="text-foreground">Alerta de sabotaje / desconexión de arnés</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.batteryBackupLowAlert}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, batteryBackupLowAlert: e.target.checked }))
                    }
                    className="rounded text-primary focus:ring-primary size-3.5"
                  />
                  <span className="text-foreground">Batería interna de respaldo baja (&lt;20%)</span>
                </label>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Prueba acústica</span>
              <button
                type="button"
                onClick={() =>
                  handleSimulateAlert(
                    "Baja Batería Vehicular",
                    `Voltaje descendió a ${config.batteryMinVoltage - 0.3}V (Umbral: ${config.batteryMinVoltage}V)`,
                    "media",
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                <Play className="size-3 text-primary" />
                <span>Simular Alerta</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. EXCESOS DE VELOCIDAD */}
        {(activeCategory === "todas" || activeCategory === "velocidad") && (
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/70 p-5 shadow-sm hover:border-primary/50 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Gauge className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        Seguridad Vial
                      </span>
                      <span className="rounded bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                        100% Viable
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold uppercase text-foreground">
                      Exceso de Velocidad
                    </h3>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.speedAlertEnabled}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, speedAlertEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Status de sensor en unidad */}
              <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Sensor vinculado:</span>
                <span className="font-semibold text-foreground">Módulo Satelital GNSS 4G</span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Control de velocidad por vehículo con límites independientes para tránsito urbano y
                carreteras federales.
              </p>

              <div className="space-y-3 rounded-xl border border-border/60 bg-background/50 p-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold">
                    <span>Límite Urbano:</span>
                    <span className="text-primary font-mono">{config.speedLimitKmh} km/h</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="120"
                    step="5"
                    value={config.speedLimitKmh}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        speedLimitKmh: parseInt(e.target.value, 10),
                      }))
                    }
                    className="mt-1.5 w-full accent-primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold">
                    <span>Límite Carretera / Autopista:</span>
                    <span className="text-primary font-mono">{config.speedHighwayLimitKmh} km/h</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="140"
                    step="5"
                    value={config.speedHighwayLimitKmh}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        speedHighwayLimitKmh: parseInt(e.target.value, 10),
                      }))
                    }
                    className="mt-1.5 w-full accent-primary"
                  />
                </div>

                <div className="pt-1 border-t border-border/40 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Tolerancia antes de disparar:</span>
                  <span className="font-semibold text-foreground">
                    {config.speedToleranceSec} seg
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Prueba acústica</span>
              <button
                type="button"
                onClick={() =>
                  handleSimulateAlert(
                    "Exceso de Velocidad",
                    `Velocidad registrada de ${config.speedLimitKmh + 18} km/h (Límite: ${config.speedLimitKmh} km/h)`,
                    "media",
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                <Play className="size-3 text-primary" />
                <span>Simular Alerta</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. BAJA O ALTA TEMPERATURA */}
        {(activeCategory === "todas" || activeCategory === "temperatura") && (
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/70 p-5 shadow-sm hover:border-primary/50 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Thermometer className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                        Cadena de Frío & Motor
                      </span>
                      {selectedUnitId !== "todas" && !unitDetail?.hasTempSensor ? (
                        <span className="rounded bg-amber-500/15 px-1.5 py-0.2 text-[9px] font-bold text-amber-400">
                          Sensor no instalado
                        </span>
                      ) : (
                        <span className="rounded bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                          Compatible
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-base font-bold uppercase text-foreground">
                      Baja / Alta Temperatura
                    </h3>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.tempAlertEnabled}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, tempAlertEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Status de sensor en unidad */}
              <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Sensor vinculado:</span>
                <span className="font-semibold text-foreground">
                  {selectedUnitId !== "todas" && !unitDetail?.hasTempSensor
                    ? "Sensor BLE / 1-Wire pendiente"
                    : "Sonda térmica calibrada"}
                </span>
              </div>

              {selectedUnitId !== "todas" && !unitDetail?.hasTempSensor && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-[11px] text-amber-300">
                  ⚠️ Esta unidad no tiene sensor térmico reportando actualmente. La alerta se
                  mantendrá en espera para evitar falsos avisos.
                </div>
              )}

              <p className="text-xs text-muted-foreground leading-relaxed">
                Supervisa el rango térmico para mercancía refrigerada (alimentos y medicamentos) y
                alerta sobrecalentamiento crítico de motor (&gt;95°C).
              </p>

              <div className="space-y-3 rounded-xl border border-border/60 bg-background/50 p-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold">
                    <span>Rango Permitido en Caja Fría:</span>
                    <span className="text-cyan-400 font-mono">
                      {config.tempMinCelsius}°C a {config.tempMaxCelsius}°C
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-muted-foreground">Mínimo:</span>
                      <input
                        type="number"
                        value={config.tempMinCelsius}
                        onChange={(e) =>
                          setConfig((c) => ({
                            ...c,
                            tempMinCelsius: parseFloat(e.target.value) || -20,
                          }))
                        }
                        className="w-full rounded border border-border bg-background px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground">Máximo:</span>
                      <input
                        type="number"
                        value={config.tempMaxCelsius}
                        onChange={(e) =>
                          setConfig((c) => ({
                            ...c,
                            tempMaxCelsius: parseFloat(e.target.value) || 5,
                          }))
                        }
                        className="w-full rounded border border-border bg-background px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-border/40">
                  <input
                    type="checkbox"
                    checked={config.tempEngineOverheatAlert}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        tempEngineOverheatAlert: e.target.checked,
                      }))
                    }
                    className="rounded text-primary focus:ring-primary size-3.5"
                  />
                  <span className="text-foreground">Sobrecalentamiento de motor (&gt;95°C)</span>
                </label>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Prueba acústica</span>
              <button
                type="button"
                onClick={() =>
                  handleSimulateAlert(
                    "Desviación Térmica Crítica",
                    `Temperatura en caja subió a ${config.tempMaxCelsius + 3.8}°C (Máx permitido: ${config.tempMaxCelsius}°C)`,
                    "alta",
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                <Play className="size-3 text-cyan-400" />
                <span>Simular Alerta</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. SITUACIONES DE RIESGO DE SENSORES */}
        {(activeCategory === "todas" || activeCategory === "sensores") && (
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/70 p-5 shadow-sm hover:border-primary/50 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <Radio className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                        Entradas Telemáticas
                      </span>
                      <span className="rounded bg-purple-500/15 px-1.5 py-0.2 text-[9px] font-bold text-purple-400">
                        Activo
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold uppercase text-foreground">
                      Riesgo en Sensores
                    </h3>
                  </div>
                </div>

                <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                  Activo
                </span>
              </div>

              {/* Status de sensor en unidad */}
              <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Sensores detectados:</span>
                <span className="font-semibold text-foreground">
                  {unitDetail?.hasDoorSensor
                    ? "Puertas + Impacto + Red"
                    : "Impacto + Sabotaje Eléctrico"}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Supervisión proactiva ante anomalías reportadas por sensores de cabina, combustible,
                líneas de arnés e impactos.
              </p>

              <div className="space-y-2.5 rounded-xl border border-border/60 bg-background/50 p-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.sensorDoorAlert}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, sensorDoorAlert: e.target.checked }))
                    }
                    className="rounded text-primary focus:ring-primary size-3.5"
                  />
                  <span className="text-foreground">Apertura no autorizada de puertas</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.sensorFuelDropAlert}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, sensorFuelDropAlert: e.target.checked }))
                    }
                    className="rounded text-primary focus:ring-primary size-3.5"
                  />
                  <span className="text-foreground">Caída súbita de combustible (robo/ordeña)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.sensorImpactAlert}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, sensorImpactAlert: e.target.checked }))
                    }
                    className="rounded text-primary focus:ring-primary size-3.5"
                  />
                  <span className="text-foreground">Sensor de choque / impacto vehicular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.sensorJammerAlert}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, sensorJammerAlert: e.target.checked }))
                    }
                    className="rounded text-primary focus:ring-primary size-3.5"
                  />
                  <span className="text-foreground">Detección de intento de inhibidor (Jammer)</span>
                </label>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Prueba acústica</span>
              <button
                type="button"
                onClick={() =>
                  handleSimulateAlert(
                    "Sensor de Combustible Anómalo",
                    "Descenso abrupto del 24% en nivel de tanque con motor apagado.",
                    "alta",
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                <Play className="size-3 text-purple-400" />
                <span>Simular Alerta</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. CONDUCCIÓN ERRÁTICA */}
        {(activeCategory === "todas" || activeCategory === "conduccion") && (
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/70 p-5 shadow-sm hover:border-primary/50 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                    <Zap className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                        Eco-Driving & Maniobras
                      </span>
                      <span className="rounded bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                        100% Viable
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold uppercase text-foreground">
                      Conducción Errática
                    </h3>
                  </div>
                </div>

                <span className="rounded bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                  Activo
                </span>
              </div>

              {/* Status de sensor en unidad */}
              <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Sensor vinculado:</span>
                <span className="font-semibold text-foreground">
                  Acelerómetro 3D de grado automotriz
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Identifica maniobras peligrosas de choferes: frenadas violentas, arrancadas bruscas
                y giros intempestivos para cuidar la carga.
              </p>

              <div className="space-y-2.5 rounded-xl border border-border/60 bg-background/50 p-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.harshBrakingAlert}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, harshBrakingAlert: e.target.checked }))
                    }
                    className="rounded text-primary focus:ring-primary size-3.5"
                  />
                  <span className="text-foreground">Frenado brusco repentino</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.harshAccelAlert}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, harshAccelAlert: e.target.checked }))
                    }
                    className="rounded text-primary focus:ring-primary size-3.5"
                  />
                  <span className="text-foreground">Aceleración intempestiva (arrancón)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.harshCorneringAlert}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, harshCorneringAlert: e.target.checked }))
                    }
                    className="rounded text-primary focus:ring-primary size-3.5"
                  />
                  <span className="text-foreground">Giro o curva violenta a velocidad</span>
                </label>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                  <span className="text-muted-foreground">Sensibilidad de detección:</span>
                  <select
                    value={config.ecoDrivingSensitivity}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        ecoDrivingSensitivity: e.target.value as any,
                      }))
                    }
                    className="rounded border border-border bg-background px-2 py-1 text-xs"
                  >
                    <option value="baja">Baja (Solo extremos)</option>
                    <option value="media">Media (Equilibrada)</option>
                    <option value="alta">Alta (Muy estricta)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Prueba acústica</span>
              <button
                type="button"
                onClick={() =>
                  handleSimulateAlert(
                    "Conducción Errática Detectada",
                    "Frenado brusco severo de 88 km/h a 0 km/h en 2.2 segundos.",
                    "media",
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                <Play className="size-3 text-orange-400" />
                <span>Simular Alerta</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. BOTÓN DE PÁNICO (SOS) */}
        {(activeCategory === "todas" || activeCategory === "sos") && (
          <div className="flex flex-col justify-between rounded-2xl border border-red-500/40 bg-card/70 p-5 shadow-sm hover:border-red-500 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 animate-pulse">
                    <ShieldAlert className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                        Emergencia Máxima
                      </span>
                      <span className="rounded bg-red-500/15 px-1.5 py-0.2 text-[9px] font-bold text-red-400">
                        {unitDetail?.hasPanicSensor ? "Pulsador Físico" : "App / Virtual"}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold uppercase text-foreground">
                      Botón de Pánico (SOS)
                    </h3>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.sosAlertEnabled}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, sosAlertEnabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>

              {/* Status de sensor en unidad */}
              <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Modo de activación:</span>
                <span className="font-semibold text-foreground">
                  {unitDetail?.hasPanicSensor
                    ? "Pulsador Físico Oculto + App"
                    : "Botón Virtual en App Móvil"}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Dispara sirena de emergencia inmediata en la plataforma, llamada o WhatsApp a
                contactos clave y ubicación en vivo al 911.
              </p>

              <div className="space-y-2.5 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.sosAudioAlarm}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, sosAudioAlarm: e.target.checked }))
                    }
                    className="rounded text-red-500 focus:ring-red-500 size-3.5"
                  />
                  <span className="font-semibold text-foreground">
                    Alarma sonora de sirena en navegador
                  </span>
                </label>

                <div>
                  <span className="text-[10px] text-muted-foreground">Teléfono de auxilio SOS:</span>
                  <input
                    type="text"
                    value={config.sosEmergencyPhone}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, sosEmergencyPhone: e.target.value }))
                    }
                    placeholder="3318359421"
                    className="mt-1 w-full rounded border border-border bg-background px-2.5 py-1 text-xs font-mono"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1 border-t border-red-500/20">
                  <input
                    type="checkbox"
                    checked={config.sosAutoStopEngine}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, sosAutoStopEngine: e.target.checked }))
                    }
                    className="rounded text-red-500 focus:ring-red-500 size-3.5"
                  />
                  <span className="text-foreground">
                    Sugerir paro de motor asistido tras 60 seg
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] text-red-400 font-semibold">Alarma prioritaria</span>
              <button
                type="button"
                onClick={() =>
                  handleSimulateAlert(
                    "BOTÓN DE PÁNICO (SOS)",
                    "¡Alerta de auxilio activada por el conductor! Coordenadas GPS fijadas.",
                    "critica",
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-md bg-red-500/10 border border-red-500/40 px-3 py-1 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition"
              >
                <ShieldAlert className="size-3.5" />
                <span>Simular Pánico</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BITÁCORA DE EVENTOS EN VIVO */}
      <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            <h3 className="font-display text-base font-bold uppercase text-foreground">
              Bitácora de Eventos y Alertas
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {alertLogs.length} registros en la sesión actual
          </span>
        </div>

        <div className="space-y-2.5">
          {alertLogs.map((log) => {
            const badgeColor =
              log.severity === "critica"
                ? "bg-red-500/20 text-red-400 border-red-500/30"
                : log.severity === "alta"
                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                : "bg-blue-500/20 text-blue-400 border-blue-500/30";

            return (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/50 p-3.5 text-xs transition hover:border-primary/40"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${badgeColor}`}
                  >
                    {log.severity}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{log.unitName}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="font-semibold text-primary">{log.type}</span>
                    </div>
                    <p className="mt-0.5 text-muted-foreground text-[11px] sm:text-xs">
                      {log.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-muted-foreground text-[11px]">
                  <span>{log.timestamp}</span>
                  <Link
                    to="/wialon/mapa"
                    className="rounded bg-muted px-2 py-1 font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition"
                  >
                    Ver en Mapa
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
