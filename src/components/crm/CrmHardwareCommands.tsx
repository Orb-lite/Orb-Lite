import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Cpu,
  Terminal,
  RotateCcw,
  Settings,
  Radio,
  Send,
  Copy,
  ExternalLink,
  Check,
  AlertCircle,
  Smartphone,
  ShieldAlert,
  Server,
  Key,
  Calendar,
  Layers,
  Search,
  RefreshCw,
  Info,
} from "lucide-react";
import {
  HARDWARE_CATALOG,
  COMMON_APNS,
  detectHardwareFromUnit,
  type HardwareBrandId,
  type YearRange,
  type ApnPreset,
} from "@/lib/wialon-hardware-catalog";
import {
  wialonExecuteUnitCommand,
  getCrmCommandHistory,
  logManualCommandDispatch,
  type WialonCommandLogEntry,
} from "@/lib/wialon-commands.functions";
import { wialonUnits, type WialonUnit } from "@/lib/wialon.functions";
import {
  readSession,
  writeSession,
  useWialonSession,
  PLATFORM_LABEL,
  type WialonSession,
} from "@/lib/wialon-session";
import { Button } from "@/components/ui/button";

export function CrmHardwareCommands() {
  const session = useWialonSession();
  const [selectedHost, setSelectedHost] = React.useState<"full" | "lite">("full");
  const [manualSid, setManualSid] = React.useState("");
  const [loginExpanded, setLoginExpanded] = React.useState(false);

  // Unidades de Wialon
  const fetchUnitsFn = useServerFn(wialonUnits);
  const unitsQuery = useQuery({
    queryKey: ["crm-wialon-units", session?.sid, session?.host],
    queryFn: () => {
      if (!session?.sid) return { units: [] as WialonUnit[] };
      return fetchUnitsFn({ data: { host: session.host, sid: session.sid } });
    },
    enabled: !!session?.sid,
  });

  const units = unitsQuery.data?.units ?? [];

  // Filtro de búsqueda de unidades
  const [searchUnit, setSearchUnit] = React.useState("");
  const filteredUnits = React.useMemo(() => {
    if (!searchUnit.trim()) return units;
    const q = searchUnit.toLowerCase();
    return units.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.imei && u.imei.toLowerCase().includes(q)) ||
        (u.creatorName && u.creatorName.toLowerCase().includes(q)),
    );
  }, [units, searchUnit]);

  // Unidad seleccionada
  const [selectedUnit, setSelectedUnit] = React.useState<WialonUnit | null>(null);

  // Parámetros de Hardware
  const [brandId, setBrandId] = React.useState<HardwareBrandId>("teltonika");
  const [modelId, setModelId] = React.useState<string>("fmb920");
  const [yearRange, setYearRange] = React.useState<YearRange>("modern_2022_plus");
  const [customPassword, setCustomPassword] = React.useState("");

  // Pestaña de comando activa
  const [activeTab, setActiveTab] = React.useState<
    "reset" | "apn" | "server" | "intervals" | "security" | "custom"
  >("reset");

  // Configuración de APN
  const [selectedApnPreset, setSelectedApnPreset] = React.useState<string>(COMMON_APNS[0].carrier);
  const [customApn, setCustomApn] = React.useState<ApnPreset>({ ...COMMON_APNS[0] });

  // Configuración de Servidor
  const [serverHost, setServerHost] = React.useState("193.193.165.165");
  const [serverPort, setServerPort] = React.useState<number>(20275);
  const [serverProtocol, setServerProtocol] = React.useState<"tcp" | "udp">("tcp");

  // Intervalos
  const [movingSec, setMovingSec] = React.useState(60);
  const [stoppedSec, setStoppedSec] = React.useState(300);

  // Entrada libre
  const [customCommandInput, setCustomCommandInput] = React.useState("");

  // Teléfono del técnico / SIM para SMS
  const [simPhone, setSimPhone] = React.useState("");

  // Historial de comandos
  const getHistoryFn = useServerFn(getCrmCommandHistory);
  const historyQuery = useQuery({
    queryKey: ["crm-command-history"],
    queryFn: () => getHistoryFn(),
    refetchInterval: 15000,
  });

  const queryClient = useQueryClient();
  const executeCmdFn = useServerFn(wialonExecuteUnitCommand);
  const logManualFn = useServerFn(logManualCommandDispatch);

  const executeMutation = useMutation({
    mutationFn: (args: Parameters<typeof executeCmdFn>[0]["data"]) =>
      executeCmdFn({ data: args }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.resultMessage);
      } else {
        toast.warning(data.resultMessage);
      }
      void queryClient.invalidateQueries({ queryKey: ["crm-command-history"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al despachar comando");
    },
  });

  // Cuando cambia la unidad seleccionada, auto-detectamos marca y modelo
  React.useEffect(() => {
    if (selectedUnit) {
      const detected = detectHardwareFromUnit(selectedUnit.name, selectedUnit.imei);
      setBrandId(detected.brand);
      const brandDef = HARDWARE_CATALOG[detected.brand];
      const modelExists = brandDef.models.some((m) => m.id === detected.modelId);
      const resolvedModelId = modelExists ? detected.modelId : brandDef.models[0]?.id || "generic";
      setModelId(resolvedModelId);

      const model = brandDef.models.find((m) => m.id === resolvedModelId);
      if (model?.wialonHwPort) {
        setServerPort(model.wialonHwPort);
      }
      setCustomPassword(brandDef.defaultPass || "");
    }
  }, [selectedUnit]);

  // Cuando cambia la marca o modelo manualmente
  React.useEffect(() => {
    const brandDef = HARDWARE_CATALOG[brandId];
    if (brandDef) {
      if (!brandDef.models.some((m) => m.id === modelId)) {
        const first = brandDef.models[0]?.id || "generic";
        setModelId(first);
        const m = brandDef.models[0];
        if (m?.wialonHwPort) setServerPort(m.wialonHwPort);
      } else {
        const m = brandDef.models.find((item) => item.id === modelId);
        if (m?.wialonHwPort) setServerPort(m.wialonHwPort);
      }
      setCustomPassword(brandDef.defaultPass || "");
    }
  }, [brandId]);

  // Cuando se selecciona un preset de APN
  const handleApnPresetChange = (carrier: string) => {
    setSelectedApnPreset(carrier);
    const found = COMMON_APNS.find((a) => a.carrier === carrier);
    if (found) {
      setCustomApn({ ...found });
    }
  };

  const currentBrandDef = HARDWARE_CATALOG[brandId] || HARDWARE_CATALOG.teltonika;
  const currentModel =
    currentBrandDef.models.find((m) => m.id === modelId) || currentBrandDef.models[0];

  // Cálculo del comando activo a generar según pestaña
  const activeGeneratedCommand = React.useMemo(() => {
    const imei = selectedUnit?.imei || "000000000000000";
    const pass = customPassword;

    switch (activeTab) {
      case "reset":
        return currentBrandDef.buildResetCommand(modelId, yearRange, pass, imei);
      case "apn":
        return currentBrandDef.buildApnCommand(modelId, yearRange, pass, customApn, imei);
      case "server":
        return currentBrandDef.buildServerCommand(
          modelId,
          yearRange,
          pass,
          serverHost,
          serverPort,
          serverProtocol,
          imei,
        );
      case "intervals":
        return currentBrandDef.buildIntervalCommand(
          modelId,
          yearRange,
          pass,
          movingSec,
          stoppedSec,
          imei,
        );
      case "security":
        return currentBrandDef.buildEngineCutCommand(modelId, yearRange, pass, true, imei);
      case "custom": {
        let text = customCommandInput;
        text = text.replaceAll("{IMEI}", imei);
        text = text.replaceAll("{APN}", customApn.apn);
        text = text.replaceAll("{IP}", serverHost);
        text = text.replaceAll("{PORT}", String(serverPort));
        text = text.replaceAll("{PASS}", pass || currentBrandDef.defaultPass || "");
        return text;
      }
      default:
        return "";
    }
  }, [
    activeTab,
    currentBrandDef,
    modelId,
    yearRange,
    customPassword,
    selectedUnit,
    customApn,
    serverHost,
    serverPort,
    serverProtocol,
    movingSec,
    stoppedSec,
    customCommandInput,
  ]);

  // Copiar comando al portapapeles
  const handleCopyCommand = async (type: "sms" | "gprs") => {
    if (!activeGeneratedCommand) return;
    try {
      await navigator.clipboard.writeText(activeGeneratedCommand);
      toast.success(`Comando ${type.toUpperCase()} copiado al portapapeles`);
      if (selectedUnit) {
        await logManualFn({
          data: {
            unitId: selectedUnit.id,
            unitName: selectedUnit.name,
            brand: currentBrandDef.name,
            model: currentModel?.name || modelId,
            commandType: activeTab,
            commandText: activeGeneratedCommand,
            channel: type,
          },
        });
        void queryClient.invalidateQueries({ queryKey: ["crm-command-history"] });
      }
    } catch {
      window.prompt("Copia el comando:", activeGeneratedCommand);
    }
  };

  // Despachar vía Wialon API
  const handleSendViaWialon = () => {
    if (!session?.sid) {
      toast.error("Debes iniciar sesión en Wialon (Full o Lite) para enviar vía API.");
      return;
    }
    if (!selectedUnit) {
      toast.error("Selecciona una unidad de la lista.");
      return;
    }
    if (!activeGeneratedCommand.trim()) {
      toast.error("El comando no puede estar vacío.");
      return;
    }

    executeMutation.mutate({
      host: session.host,
      sid: session.sid,
      unitId: selectedUnit.id,
      unitName: selectedUnit.name,
      brand: currentBrandDef.name,
      model: currentModel?.name || modelId,
      commandType: activeTab,
      commandText: activeGeneratedCommand,
      linkType: "",
    });
  };

  // Generar link SMS directo
  const smsHref = React.useMemo(() => {
    if (!activeGeneratedCommand) return "#";
    const encodedBody = encodeURIComponent(activeGeneratedCommand);
    const phone = simPhone.trim().replace(/[^0-9+]/g, "");
    return phone ? `sms:${phone}?body=${encodedBody}` : `sms:?body=${encodedBody}`;
  }, [activeGeneratedCommand, simPhone]);

  return (
    <div className="space-y-6">
      {/* Encabezado y Login Wialon */}
      <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
              <Terminal className="size-6" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold uppercase tracking-wider text-foreground">
                Centro de Comandos GPS Hardware
              </h2>
              <p className="text-xs text-muted-foreground">
                Envío de comandos, resets, configuración de APN y diagramas de fabricantes
                homologados en Wialon.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {session?.sid ? (
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs">
                <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-foreground">
                  Sesión activa:{" "}
                  <strong className="text-primary">{PLATFORM_LABEL[session.host]}</strong> (
                  {session.userName})
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[11px] text-muted-foreground hover:text-destructive"
                  onClick={() => writeSession(null)}
                >
                  Cerrar
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    const url =
                      selectedHost === "full"
                        ? "https://hosting.wialon.com"
                        : "https://lite.wialon.us";
                    window.open(url, "_blank");
                  }}
                >
                  <ExternalLink className="mr-1.5 size-3.5" />
                  Abrir Wialon {selectedHost === "full" ? "Full" : "Lite"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setLoginExpanded(!loginExpanded)}
                >
                  {loginExpanded ? "Ocultar acceso" : "Conectar sesión"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Formulario rápido de sesión si no hay activa o se desea cambiar */}
        {(!session?.sid || loginExpanded) && (
          <div className="mt-4 rounded-lg border border-border/70 bg-muted/40 p-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Conexión de Sesión Wialon
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Selecciona a cuál plataforma entrar (Full o Lite) e ingresa el Token o Session ID
              (SID).
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex rounded-md border border-border bg-background p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedHost("full")}
                  className={`rounded px-3 py-1 font-semibold transition-colors ${
                    selectedHost === "full"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ORB-FULL (Wialon Hosting)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedHost("lite")}
                  className={`rounded px-3 py-1 font-semibold transition-colors ${
                    selectedHost === "lite"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ORB-LITE (Wialon Lite)
                </button>
              </div>

              <input
                type="text"
                placeholder="Ingresa SID de Wialon o Token..."
                value={manualSid}
                onChange={(e) => setManualSid(e.target.value)}
                className="min-w-[260px] flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />

              <Button
                size="sm"
                onClick={() => {
                  if (!manualSid.trim()) {
                    toast.error("Ingresa un SID o Token válido.");
                    return;
                  }
                  writeSession({
                    sid: manualSid.trim(),
                    host: selectedHost,
                    userId: 1,
                    userName: "Administrador CRM",
                  });
                  toast.success("Sesión de Wialon configurada correctamente.");
                  setLoginExpanded(false);
                }}
              >
                Conectar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Selector de Unidad y Detección Automática */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Columna Izquierda: Lista de Unidades */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm lg:col-span-4 flex flex-col h-[650px]">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="size-4 text-primary" />
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
                Unidades Wialon
              </h3>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-primary">
              {filteredUnits.length}
            </span>
          </div>

          <div className="mt-3 relative">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre o IMEI..."
              value={searchUnit}
              onChange={(e) => setSearchUnit(e.target.value)}
              className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="mt-3 flex-1 overflow-y-auto space-y-1.5 pr-1">
            {unitsQuery.isLoading ? (
              <div className="py-10 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                <RefreshCw className="size-4 animate-spin text-primary" />
                Cargando unidades desde Wialon...
              </div>
            ) : filteredUnits.length === 0 ? (
              <div className="py-10 text-center text-xs text-muted-foreground">
                {session?.sid
                  ? "No se encontraron unidades."
                  : "Inicia sesión en Wialon arriba para cargar la lista de unidades."}
              </div>
            ) : (
              filteredUnits.map((unit) => {
                const isSelected = selectedUnit?.id === unit.id;
                const detected = detectHardwareFromUnit(unit.name, unit.imei);
                const brandDef = HARDWARE_CATALOG[detected.brand];

                return (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => setSelectedUnit(unit)}
                    className={`w-full text-left rounded-lg p-2.5 transition-all border ${
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/40 shadow-sm"
                        : "border-border/60 bg-background/50 hover:bg-muted hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-semibold text-xs truncate text-foreground">
                        {unit.name}
                      </span>
                      <span
                        className={`size-2 rounded-full shrink-0 ${
                          unit.online ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" : "bg-muted-foreground/40"
                        }`}
                        title={unit.online ? "En línea" : "Desconectado"}
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-mono text-[10px] truncate">
                        {unit.imei ? `IMEI: ${unit.imei}` : "Sin IMEI visible"}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.2 font-medium text-[10px] text-primary">
                        {brandDef.name.split(" ")[0]}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => void unitsQuery.refetch()}
              disabled={unitsQuery.isLoading}
            >
              <RefreshCw className={`mr-1.5 size-3 ${unitsQuery.isLoading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <span>{selectedUnit ? `Seleccionada: ${selectedUnit.name}` : "Ninguna seleccionada"}</span>
          </div>
        </div>

        {/* Columna Derecha: Configuración de Hardware y Generador de Comandos */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm lg:col-span-8 space-y-5">
          {/* Ficha del Dispositivo y Fabricante */}
          <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Equipo Activo en CRM
                </span>
                <h3 className="font-display text-base font-bold text-foreground">
                  {selectedUnit ? selectedUnit.name : "Selecciona una unidad de Wialon"}
                </h3>
                {selectedUnit?.imei && (
                  <p className="font-mono text-xs text-muted-foreground">
                    IMEI: {selectedUnit.imei}
                  </p>
                )}
              </div>

              {/* Selector Manual de Marca / Modelo */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">
                    Fabricante
                  </label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value as HardwareBrandId)}
                    className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    {Object.values(HARDWARE_CATALOG).map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.country})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">
                    Modelo
                  </label>
                  <select
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                    className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    {currentBrandDef.models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">
                    Año / Revisión
                  </label>
                  <select
                    value={yearRange}
                    onChange={(e) => setYearRange(e.target.value as YearRange)}
                    className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    {currentModel?.supportedYears.map((y) => (
                      <option key={y.id} value={y.id}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">
                    Password / PIN
                  </label>
                  <input
                    type="text"
                    value={customPassword}
                    placeholder={currentBrandDef.defaultPass || "Sin pass"}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    className="w-24 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Diagrama de Comandos y Sintaxis del Fabricante */}
            <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-md border border-border/50 bg-background/80 p-3">
                <span className="font-semibold text-primary flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Layers className="size-3.5" /> Diagrama y Estructura ({currentBrandDef.name})
                </span>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {currentBrandDef.headerRule}
                </p>
                <div className="mt-2 space-y-1 font-mono text-[11px]">
                  <div className="text-muted-foreground">
                    <span className="text-foreground font-semibold">Separador:</span>{" "}
                    {currentBrandDef.diagram.delimiter}
                  </div>
                  <div className="text-muted-foreground">
                    <span className="text-foreground font-semibold">Estructura:</span>{" "}
                    <code className="text-primary bg-primary/10 px-1 rounded">
                      {currentBrandDef.diagram.structure}
                    </code>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-border/50 bg-background/80 p-3">
                <span className="font-semibold text-foreground flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Info className="size-3.5 text-primary" /> Puerto Wialon y Homologación
                </span>
                <p className="mt-1 text-[11px] text-muted-foreground">{currentBrandDef.notes}</p>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-foreground">Puerto Wialon sugerido:</span>
                  <span className="rounded bg-primary/15 px-2 py-0.5 font-mono font-bold text-primary">
                    {currentModel?.wialonHwPort || 20275}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Selector de Tipo de Comando */}
          <div className="flex flex-wrap gap-1.5 border-b border-border/60 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("reset")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "reset"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <RotateCcw className="size-3.5" /> Reinicio (Reset)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("apn")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "apn"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Smartphone className="size-3.5" /> Configurar APN
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("server")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "server"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Server className="size-3.5" /> Servidor & Puerto Wialon
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("intervals")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "intervals"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Settings className="size-3.5" /> Intervalos de Reporte
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "security"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <ShieldAlert className="size-3.5" /> Paro de Motor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "custom"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Terminal className="size-3.5" /> Input Libre (Manual)
            </button>
          </div>

          {/* Paneles de Contenido según pestaña */}
          <div className="space-y-4">
            {activeTab === "reset" && (
              <div className="rounded-lg border border-border/70 p-4 space-y-3">
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wide">
                  Comandos de Reinicio
                </h4>
                <p className="text-xs text-muted-foreground">
                  Envía una orden de reset al microcontrolador del equipo GPS o al módulo GNSS para
                  forzar una reconexión a la red celular y búsqueda satelital en frío.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const cmd = currentBrandDef.buildResetCommand(
                        modelId,
                        yearRange,
                        customPassword,
                        selectedUnit?.imei || undefined,
                      );
                      setCustomCommandInput(cmd);
                    }}
                  >
                    <RotateCcw className="mr-1.5 size-3.5 text-primary" />
                    Reset CPU / Reinicio General
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const cmd = currentBrandDef.buildGpsResetCommand(
                        modelId,
                        yearRange,
                        customPassword,
                        selectedUnit?.imei || undefined,
                      );
                      setCustomCommandInput(cmd);
                    }}
                  >
                    <Radio className="mr-1.5 size-3.5 text-primary" />
                    Reset Módulo GPS / GNSS
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "apn" && (
              <div className="rounded-lg border border-border/70 p-4 space-y-3">
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wide">
                  Configuración de APN y Operador Celular
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Operador / Red Preconfigurada
                    </label>
                    <select
                      value={selectedApnPreset}
                      onChange={(e) => handleApnPresetChange(e.target.value)}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    >
                      {COMMON_APNS.map((a) => (
                        <option key={a.carrier} value={a.carrier}>
                          {a.carrier} ({a.apn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">APN</label>
                    <input
                      type="text"
                      value={customApn.apn}
                      onChange={(e) => setCustomApn({ ...customApn, apn: e.target.value })}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Usuario APN
                    </label>
                    <input
                      type="text"
                      value={customApn.user}
                      onChange={(e) => setCustomApn({ ...customApn, user: e.target.value })}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "server" && (
              <div className="rounded-lg border border-border/70 p-4 space-y-3">
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wide">
                  Servidor y Puerto de Destino Wialon
                </h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Dirección IP / Host Wialon
                    </label>
                    <input
                      type="text"
                      value={serverHost}
                      onChange={(e) => setServerHost(e.target.value)}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                      placeholder="193.193.165.165"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Puerto Wialon para {currentModel?.name || modelId}
                    </label>
                    <input
                      type="number"
                      value={serverPort}
                      onChange={(e) => setServerPort(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Protocolo de Transmisión
                    </label>
                    <select
                      value={serverProtocol}
                      onChange={(e) => setServerProtocol(e.target.value as "tcp" | "udp")}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="tcp">TCP (Recomendado)</option>
                      <option value="udp">UDP (Menor consumo de datos)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "intervals" && (
              <div className="rounded-lg border border-border/70 p-4 space-y-3">
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wide">
                  Frecuencia de Reporte y Heartbeat
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Intervalo en Movimiento (segundos)
                    </label>
                    <input
                      type="number"
                      value={movingSec}
                      onChange={(e) => setMovingSec(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                    />
                    <p className="mt-1 text-[10px] text-muted-foreground">Recomendado: 30 a 60 segundos.</p>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Intervalo Detenido / Motor Apagado (segundos)
                    </label>
                    <input
                      type="number"
                      value={stoppedSec}
                      onChange={(e) => setStoppedSec(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                    />
                    <p className="mt-1 text-[10px] text-muted-foreground">Recomendado: 300 a 600 segundos.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="rounded-lg border border-border/70 p-4 space-y-3">
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wide">
                  Seguridad y Apagado Remoto de Motor
                </h4>
                <p className="text-xs text-muted-foreground">
                  Acciona la salida digital (DO / Relevador) conectada a la ignición o bomba de
                  combustible de la unidad.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      const cmd = currentBrandDef.buildEngineCutCommand(
                        modelId,
                        yearRange,
                        customPassword,
                        true,
                        selectedUnit?.imei || undefined,
                      );
                      setCustomCommandInput(cmd);
                    }}
                  >
                    <ShieldAlert className="mr-1.5 size-3.5" />
                    Paro de Motor (Cortar Corriente)
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const cmd = currentBrandDef.buildEngineCutCommand(
                        modelId,
                        yearRange,
                        customPassword,
                        false,
                        selectedUnit?.imei || undefined,
                      );
                      setCustomCommandInput(cmd);
                    }}
                  >
                    <Check className="mr-1.5 size-3.5 text-emerald-500" />
                    Restablecer Encendido
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const cmd = currentBrandDef.buildStatusCommand(
                        modelId,
                        yearRange,
                        customPassword,
                        selectedUnit?.imei || undefined,
                      );
                      setCustomCommandInput(cmd);
                    }}
                  >
                    <Radio className="mr-1.5 size-3.5 text-primary" />
                    Consultar Estado / Diagnóstico
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "custom" && (
              <div className="rounded-lg border border-border/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-foreground uppercase tracking-wide">
                    Input Libre para Comando Manual
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span>Variables disponibles:</span>
                    <button
                      type="button"
                      onClick={() => setCustomCommandInput((prev) => prev + "{IMEI}")}
                      className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-primary hover:bg-primary/10"
                    >
                      {"{IMEI}"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomCommandInput((prev) => prev + "{APN}")}
                      className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-primary hover:bg-primary/10"
                    >
                      {"{APN}"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomCommandInput((prev) => prev + "{IP}")}
                      className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-primary hover:bg-primary/10"
                    >
                      {"{IP}"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomCommandInput((prev) => prev + "{PORT}")}
                      className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-primary hover:bg-primary/10"
                    >
                      {"{PORT}"}
                    </button>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={customCommandInput}
                  onChange={(e) => setCustomCommandInput(e.target.value)}
                  placeholder={`Escribe aquí el comando exacto del fabricante para ${currentBrandDef.name}...`}
                  className="w-full rounded-md border border-border bg-background p-2.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Caja de Comando Generado y Acciones de Despacho */}
          <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Terminal className="size-4" /> Comando Sintáctico Listo para Enviar
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                Longitud: {activeGeneratedCommand.length} caracteres
              </span>
            </div>

            <div className="rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground select-all break-all overflow-x-auto shadow-inner">
              {activeGeneratedCommand || "(Selecciona una acción o escribe un comando)"}
            </div>

            {/* Fila de Acciones Rápidas */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleSendViaWialon}
                  disabled={executeMutation.isPending || !activeGeneratedCommand.trim()}
                  className="shadow-sm"
                >
                  <Send className="mr-1.5 size-3.5" />
                  {executeMutation.isPending ? "Despachando…" : "Enviar por Wialon API"}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyCommand("sms")}
                  disabled={!activeGeneratedCommand.trim()}
                >
                  <Copy className="mr-1.5 size-3.5" /> Copiar Comando SMS
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyCommand("gprs")}
                  disabled={!activeGeneratedCommand.trim()}
                >
                  <Copy className="mr-1.5 size-3.5" /> Copiar GPRS
                </Button>
              </div>

              {/* Enlace directo SMS para móviles */}
              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  placeholder="Tel SIM (+52...)"
                  value={simPhone}
                  onChange={(e) => setSimPhone(e.target.value)}
                  className="w-32 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                />
                <Button size="sm" variant="secondary" asChild disabled={!activeGeneratedCommand.trim()}>
                  <a href={smsHref}>
                    <Smartphone className="mr-1.5 size-3.5 text-primary" /> Abrir SMS
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de Comandos Enviados */}
      <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="size-4 text-primary" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Historial de Comandos Recientes
            </h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={() => void historyQuery.refetch()}
          >
            <RefreshCw className="mr-1.5 size-3" /> Actualizar log
          </Button>
        </div>

        <div className="overflow-x-auto">
          {historyQuery.data?.logs && historyQuery.data.logs.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-[11px] text-muted-foreground uppercase font-semibold">
                  <th className="py-2 pr-3">Fecha y Hora</th>
                  <th className="py-2 pr-3">Unidad</th>
                  <th className="py-2 pr-3">Fabricante / Modelo</th>
                  <th className="py-2 pr-3">Canal</th>
                  <th className="py-2 pr-3">Comando Ejecutado</th>
                  <th className="py-2 pr-3">Resultado / Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {historyQuery.data.logs.map((log: WialonCommandLogEntry) => (
                  <tr key={log.id} className="hover:bg-muted/30">
                    <td className="py-2.5 pr-3 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("es-MX", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 pr-3 font-semibold text-foreground">{log.unitName}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">
                      {log.brand} · {log.model}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono uppercase font-semibold">
                        {log.channel}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 font-mono text-primary text-[11px] max-w-[280px] truncate" title={log.commandText}>
                      {log.commandText}
                    </td>
                    <td className="py-2.5 pr-3 text-muted-foreground">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium ${
                          log.status === "sent_to_wialon"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : log.status === "copied"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {log.status === "sent_to_wialon" && <Check className="size-3" />}
                        {log.resultMessage || log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Aún no se han enviado comandos en esta sesión.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
