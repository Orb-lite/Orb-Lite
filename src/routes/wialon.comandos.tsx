import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Terminal,
  Cpu,
  Plus,
  Send,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  Check,
  AlertTriangle,
  Copy,
  Info,
  Power,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Radio,
  ExternalLink,
} from "lucide-react";
import { WialonGuard } from "@/components/wialon-guard";
import type { WialonSession } from "@/lib/wialon-session";
import { wialonUnits } from "@/lib/wialon.functions";
import { fetchReliableUnits } from "@/lib/wialon-client-api";
import {
  wialonGetUnitCommands,
  wialonSaveUnitCommand,
  wialonDeleteUnitCommand,
  wialonBatchAddTeltonikaCommands,
  wialonSendTcpCommand,
  wialonGetRecentTcpLogs,
  TELTONIKA_COMMAND_PRESETS,
  type WialonUnitCommand,
  type TeltonikaCommandPreset,
} from "@/lib/wialon-unit-commands.functions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/wialon/comandos")({
  head: () => ({
    meta: [
      { title: "Comandos TCP para Equipos Teltonika | ORB-LITE" },
      {
        name: "description",
        content:
          "Registra, guarda y ejecuta comandos personalizados vía TCP en Wialon para equipos Teltonika y GPS satelitales.",
      },
      { property: "og:title", content: "Comandos TCP para Equipos | ORB-LITE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <WialonGuard>{(session) => <WialonComandosView session={session} />}</WialonGuard>
  ),
});

function WialonComandosView({ session }: { session: WialonSession }) {
  const queryClient = useQueryClient();
  const fetchUnits = useServerFn(wialonUnits);
  const getCommandsFn = useServerFn(wialonGetUnitCommands);
  const saveCommandFn = useServerFn(wialonSaveUnitCommand);
  const deleteCommandFn = useServerFn(wialonDeleteUnitCommand);
  const batchTeltonikaFn = useServerFn(wialonBatchAddTeltonikaCommands);
  const sendTcpCommandFn = useServerFn(wialonSendTcpCommand);
  const getRecentLogsFn = useServerFn(wialonGetRecentTcpLogs);

  // Estados de navegación y selección
  const [selectedUnitId, setSelectedUnitId] = React.useState<number | null>(null);
  const [unitSearch, setUnitSearch] = React.useState("");
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  // Diálogos
  const [isNewDialogOpen, setIsNewDialogOpen] = React.useState(false);
  const [isEditingId, setIsEditingId] = React.useState<number | null>(null);
  const [isSendDialogOpen, setIsSendDialogOpen] = React.useState(false);
  const [commandToSend, setCommandToSend] = React.useState<WialonUnitCommand | null>(null);
  const [customSendParam, setCustomSendParam] = React.useState("");
  const [isTerminalOpen, setIsTerminalOpen] = React.useState(false);
  const [terminalText, setTerminalText] = React.useState(" setdigout 1");

  // Formulario de creación / edición
  const [formName, setFormName] = React.useState("");
  const [formType, setFormType] = React.useState("custom_msg");
  const [formLinkType, setFormLinkType] = React.useState("tcp");
  const [formParam, setFormParam] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);

  // Consulta de unidades disponibles en la cuenta
  const unitsQuery = useQuery({
    queryKey: ["wialon-units", session.sid, session.host],
    queryFn: () => fetchReliableUnits({ session, fetchUnitsServerFn: fetchUnits }),
    staleTime: 30000,
  });

  const units = unitsQuery.data?.units ?? [];

  // Leer parámetro unitId de la URL si se provee
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlUnitId = params.get("unitId");
      if (urlUnitId) {
        const parsed = Number(urlUnitId);
        if (!Number.isNaN(parsed) && parsed > 0) {
          setSelectedUnitId(parsed);
          return;
        }
      }
    }
    if (units.length > 0 && selectedUnitId === null) {
      setSelectedUnitId(units[0]!.id);
    }
  }, [units, selectedUnitId]);

  const currentUnit = units.find((u) => u.id === selectedUnitId) || units[0] || null;

  // Consulta de comandos registrados en Wialon para la unidad seleccionada
  const commandsQuery = useQuery({
    queryKey: ["wialon-unit-commands", session.sid, session.host, selectedUnitId],
    queryFn: async () => {
      if (!selectedUnitId) return null;
      return getCommandsFn({
        data: {
          host: session.host,
          sid: session.sid,
          unitId: selectedUnitId,
        },
      });
    },
    enabled: Boolean(selectedUnitId),
  });

  // Historial de logs recientes
  const logsQuery = useQuery({
    queryKey: ["recent-tcp-logs"],
    queryFn: () => getRecentLogsFn(),
    refetchInterval: 5000,
  });

  // Mutación: Guardar / Editar comando en Wialon
  const saveMutation = useMutation({
    mutationFn: saveCommandFn,
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: ["wialon-unit-commands"] });
      void commandsQuery.refetch();
      toast.success(`Comando "${res.command?.name ?? 'TCP'}" guardado exitosamente en Wialon`);
      setIsNewDialogOpen(false);
      setIsEditingId(null);
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err?.message || "Error al guardar el comando en Wialon.");
      toast.error(err?.message || "Error al guardar el comando en Wialon.");
    },
  });

  // Mutación: Eliminar comando de Wialon
  const deleteMutation = useMutation({
    mutationFn: deleteCommandFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wialon-unit-commands"] });
      void commandsQuery.refetch();
      toast.success("Comando eliminado exitosamente de Wialon");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al eliminar el comando en Wialon.");
    },
  });

  // Mutación: Cargar Pack Teltonika
  const batchTeltonikaMutation = useMutation({
    mutationFn: batchTeltonikaFn,
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: ["wialon-unit-commands"] });
      void commandsQuery.refetch();
      toast.success(`Pack Teltonika: ${res.addedCount} comandos agregados en Wialon (${res.skippedCount} ya existían)`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al registrar pack Teltonika en Wialon.");
    },
  });

  // Mutación: Enviar comando TCP
  const sendTcpMutation = useMutation({
    mutationFn: sendTcpCommandFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recent-tcp-logs"] });
      setIsSendDialogOpen(false);
    },
  });

  function resetForm() {
    setFormName("");
    setFormType("custom_msg");
    setFormLinkType("tcp");
    setFormParam("");
    setFormDescription("");
    setFormError(null);
  }

  function handleOpenCreate(preset?: TeltonikaCommandPreset) {
    setIsEditingId(null);
    setFormError(null);
    if (preset) {
      setFormName(preset.name);
      setFormType(preset.commandType);
      setFormLinkType(preset.linkType);
      setFormParam(preset.param);
      setFormDescription(preset.description);
    } else {
      resetForm();
    }
    setIsNewDialogOpen(true);
  }

  function handleOpenEdit(cmd: WialonUnitCommand) {
    setIsEditingId(cmd.id);
    setFormName(cmd.name);
    setFormType(cmd.type);
    setFormLinkType(cmd.linkType || "tcp");
    setFormParam(cmd.param);
    setFormDescription(cmd.description || "");
    setFormError(null);
    setIsNewDialogOpen(true);
  }

  function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUnitId) return;
    if (!formName.trim()) {
      setFormError("Debes especificar un nombre para el comando.");
      return;
    }

    saveMutation.mutate({
      data: {
        host: session.host,
        sid: session.sid,
        unitId: selectedUnitId,
        commandId: isEditingId || 0,
        name: formName.trim(),
        commandType: formType,
        linkType: formLinkType,
        param: formParam,
        description: formDescription.trim(),
      },
    });
  }

  function handleConfirmSend() {
    if (!selectedUnitId || !commandToSend) return;
    sendTcpMutation.mutate({
      data: {
        host: session.host,
        sid: session.sid,
        unitId: selectedUnitId,
        unitName: currentUnit?.name || "Unidad",
        commandName: commandToSend.name,
        commandType: commandToSend.type,
        linkType: commandToSend.linkType || "tcp",
        param: customSendParam.trim() ? customSendParam : commandToSend.param,
      },
    });
  }

  function handleSendTerminal() {
    if (!selectedUnitId || !terminalText.trim()) return;
    sendTcpMutation.mutate({
      data: {
        host: session.host,
        sid: session.sid,
        unitId: selectedUnitId,
        unitName: currentUnit?.name || "Unidad",
        commandName: "custom_msg",
        commandType: "custom_msg",
        linkType: "tcp",
        param: terminalText,
      },
    });
  }

  function copyToClipboard(text: string) {
    void navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2500);
  }

  const filteredUnits = units.filter(
    (u) =>
      u.name.toLowerCase().includes(unitSearch.toLowerCase()) ||
      (u.imei && u.imei.includes(unitSearch)),
  );

  const commandsList = commandsQuery.data?.commands ?? [];

  return (
    <div className="space-y-6">
      {/* Header con título y descripción */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Terminal className="size-5" />
            <span className="text-xs font-bold tracking-widest uppercase">
              Protocolo TCP & GPRS Wialon
            </span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-wide text-foreground">
            Comandos TCP por Equipo
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Registra, edita y sincroniza comandos en el apartado oficial de comandos de Wialon
            para equipos Teltonika y hardware GPS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsTerminalOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Radio className="size-3.5" />
            <span>Terminal Rápida TCP</span>
          </button>
          <button
            onClick={() => handleOpenCreate()}
            disabled={!selectedUnitId}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Plus className="size-3.5" />
            <span>Nuevo Comando TCP</span>
          </button>
        </div>
      </div>

      {/* Selector de Equipo y Buscador */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Columna Izquierda: Lista de Equipos */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Equipos Disponibles ({units.length})
            </h3>
            <button
              onClick={() => void unitsQuery.refetch()}
              className="text-xs text-muted-foreground hover:text-primary"
              title="Actualizar unidades"
            >
              <RefreshCw className={`size-3.5 ${unitsQuery.isFetching ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre o IMEI..."
              value={unitSearch}
              onChange={(e) => setUnitSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="max-h-[460px] overflow-y-auto space-y-1.5 rounded-lg border border-border/50 bg-card/40 p-1.5">
            {filteredUnits.map((u) => {
              const isSelected = u.id === selectedUnitId;
              return (
                <button
                  key={u.id}
                  onClick={() => setSelectedUnitId(u.id)}
                  className={`w-full text-left rounded-md px-3 py-2 text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-primary/15 text-primary border border-primary/30 font-semibold"
                      : "hover:bg-muted/70 text-foreground"
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="font-medium truncate">{u.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {u.imei ? `IMEI: ${u.imei}` : `ID: ${u.id}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`size-2 rounded-full ${
                        u.online ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"
                      }`}
                      title={u.online ? "En línea" : "Desconectado"}
                    />
                  </div>
                </button>
              );
            })}
            {filteredUnits.length === 0 && (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No se encontraron equipos con esa búsqueda.
              </p>
            )}
          </div>
        </div>

        {/* Columna Derecha: Comandos del Equipo Seleccionado */}
        <div className="md:col-span-2 space-y-4">
          {currentUnit ? (
            <>
              {/* Tarjeta de Resumen del Equipo */}
              <div className="rounded-xl border border-border/60 bg-card p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Cpu className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-base font-bold uppercase tracking-wide">
                        {currentUnit.name}
                      </h3>
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-mono font-bold text-primary">
                        ID: {currentUnit.id}
                      </span>
                      {commandsQuery.data?.hardware && (
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-blue-400">
                          {commandsQuery.data.hardware}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      IMEI: {currentUnit.imei || "—"} · Estado:{" "}
                      <span className={currentUnit.online ? "text-emerald-400 font-semibold" : "text-muted-foreground"}>
                        {currentUnit.online ? "En línea (Socket TCP Activo)" : "Sin señal"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => void commandsQuery.refetch()}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    title="Recargar comandos desde Wialon"
                  >
                    <RefreshCw className={`size-3 ${commandsQuery.isFetching ? "animate-spin" : ""}`} />
                    <span>Sincronizar</span>
                  </button>
                  <Link
                    to="/wialon/unidades"
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="size-3" />
                    <span>Ver unidad</span>
                  </Link>
                </div>
              </div>

              {/* Banner / Catálogo de Comandos Teltonika */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="size-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-amber-300">
                        Catálogo Preconfigurado para Teltonika (FMB965, FMB920, FMC130)
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Incluye Reinicio (cpureset), Corte (setdigout 1), Restaurar (setdigout 0), Ping, Estado y Consulta GPS.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!selectedUnitId) return;
                      batchTeltonikaMutation.mutate({
                        data: {
                          host: session.host,
                          sid: session.sid,
                          unitId: selectedUnitId,
                        },
                      });
                    }}
                    disabled={batchTeltonikaMutation.isPending}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-all shrink-0 disabled:opacity-60"
                  >
                    <Layers className="size-3.5" />
                    <span>
                      {batchTeltonikaMutation.isPending
                        ? "Registrando en Wialon…"
                        : "Cargar Pack Teltonika Completo"}
                    </span>
                  </button>
                </div>

                {/* Chips de comandos rápidos para agregar individualmente */}
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-amber-500/20 pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1 self-center">
                    Atajos rápidos:
                  </span>
                  {TELTONIKA_COMMAND_PRESETS.slice(0, 6).map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleOpenCreate(preset)}
                      className="inline-flex items-center gap-1 rounded bg-background/80 hover:bg-muted border border-border/80 px-2 py-1 text-[11px] font-mono transition-colors"
                      title={preset.description}
                    >
                      <span>{preset.name}</span>
                      <span className="text-primary font-bold">({preset.param.trim()})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terminal TCP Rápida Inline (Desplegable) */}
              {isTerminalOpen && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Terminal className="size-3.5" />
                      Envío Directo por Socket TCP
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      canal: tcp · timeout: 60s
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Ej:  setdigout 1,  cpureset,  getstatus..."
                      value={terminalText}
                      onChange={(e) => setTerminalText(e.target.value)}
                      className="font-mono text-xs bg-background"
                    />
                    <button
                      onClick={handleSendTerminal}
                      disabled={sendTcpMutation.isPending || !terminalText.trim()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold uppercase text-primary-foreground hover:bg-primary/90 transition-all shrink-0 disabled:opacity-50"
                    >
                      <Send className="size-3.5" />
                      <span>{sendTcpMutation.isPending ? "Enviando…" : "Enviar TCP"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de Comandos Registrados en Wialon */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Comandos Guardados en Wialon ({commandsList.length})
                  </h4>
                  <span className="text-[11px] text-muted-foreground">
                    Almacenados directamente en el perfil del equipo
                  </span>
                </div>

                {commandsQuery.isLoading ? (
                  <div className="rounded-xl border border-border/50 bg-card p-8 text-center text-sm text-muted-foreground">
                    <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-primary" />
                    Cargando comandos desde la plataforma Wialon…
                  </div>
                ) : commandsList.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/80 bg-card/40 p-8 text-center space-y-3">
                    <Terminal className="size-8 mx-auto text-muted-foreground/60" />
                    <div>
                      <p className="font-semibold text-sm">
                        Este equipo no tiene comandos registrados en Wialon todavía.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                        Haz clic en &ldquo;Cargar Pack Teltonika Completo&rdquo; para registrar los
                        comandos oficiales de corte, reinicio y GPS, o crea un comando TCP personalizado.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenCreate(TELTONIKA_COMMAND_PRESETS[1])}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 border border-primary/40 px-3.5 py-2 text-xs font-bold uppercase text-primary hover:bg-primary/30 transition-all"
                    >
                      <Plus className="size-3.5" />
                      <span>Agregar Primer Comando TCP</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-2.5">
                    {commandsList.map((cmd) => (
                      <div
                        key={cmd.id}
                        className="rounded-lg border border-border/70 bg-card p-3.5 transition-all hover:border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-foreground">
                              {cmd.name}
                            </span>
                            <span className="rounded bg-primary/10 border border-primary/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-primary uppercase">
                              {cmd.linkType || "TCP"}
                            </span>
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                              tipo: {cmd.type}
                            </span>
                          </div>

                          {/* Payload del comando */}
                          <div className="flex items-center gap-2">
                            <code className="rounded bg-zinc-950 px-2 py-0.5 font-mono text-xs text-emerald-400 border border-zinc-800">
                              {cmd.param ? cmd.param : "— (sin parámetro fijo)"}
                            </code>
                            {cmd.param && (
                              <button
                                onClick={() => copyToClipboard(cmd.param)}
                                className="text-muted-foreground hover:text-foreground text-[11px]"
                                title="Copiar comando al portapapeles"
                              >
                                {copiedText === cmd.param ? (
                                  <Check className="size-3 text-emerald-400" />
                                ) : (
                                  <Copy className="size-3" />
                                )}
                              </button>
                            )}
                          </div>

                          {cmd.description && (
                            <p className="text-xs text-muted-foreground leading-snug">
                              {cmd.description}
                            </p>
                          )}
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => {
                              setCommandToSend(cmd);
                              setCustomSendParam(cmd.param);
                              setIsSendDialogOpen(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all"
                            title="Despachar comando hacia el equipo vía TCP"
                          >
                            <Send className="size-3.5" />
                            <span>Enviar TCP</span>
                          </button>

                          <button
                            onClick={() => handleOpenEdit(cmd)}
                            className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                            title="Editar comando en Wialon"
                          >
                            <Edit2 className="size-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `¿Estás seguro de eliminar el comando "${cmd.name}" de Wialon?`,
                                )
                              ) {
                                deleteMutation.mutate({
                                  data: {
                                    host: session.host,
                                    sid: session.sid,
                                    unitId: selectedUnitId,
                                    commandId: cmd.id,
                                  },
                                });
                              }
                            }}
                            className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                            title="Eliminar comando de Wialon"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
              Selecciona un equipo para gestionar sus comandos TCP.
            </div>
          )}
        </div>
      </div>

      {/* Historial Reciente de Comandos TCP Despachados */}
      <div className="rounded-xl border border-border/60 bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wider">
              Historial de Comandos TCP Despachados
            </h3>
          </div>
          <button
            onClick={() => void logsQuery.refetch()}
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <RefreshCw className={`size-3 ${logsQuery.isFetching ? "animate-spin" : ""}`} />
            <span>Actualizar logs</span>
          </button>
        </div>

        {logsQuery.data?.logs && logsQuery.data.logs.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-border/50">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border/50">
                <tr>
                  <th className="px-3.5 py-2.5">Fecha / Hora</th>
                  <th className="px-3.5 py-2.5">Equipo</th>
                  <th className="px-3.5 py-2.5">Comando</th>
                  <th className="px-3.5 py-2.5">Canal</th>
                  <th className="px-3.5 py-2.5">Parámetro / Payload</th>
                  <th className="px-3.5 py-2.5">Estado</th>
                  <th className="px-3.5 py-2.5">Respuesta de Wialon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {logsQuery.data.logs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30">
                    <td className="px-3.5 py-2 text-muted-foreground font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString("es-MX", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="px-3.5 py-2 font-semibold text-foreground whitespace-nowrap">
                      {log.unitName}
                    </td>
                    <td className="px-3.5 py-2 font-medium">{log.commandName}</td>
                    <td className="px-3.5 py-2 font-mono text-[11px] text-primary uppercase">
                      {log.linkType}
                    </td>
                    <td className="px-3.5 py-2 font-mono text-emerald-400 max-w-[220px] truncate">
                      {log.param}
                    </td>
                    <td className="px-3.5 py-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          log.status === "success"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-destructive/15 text-destructive border border-destructive/30"
                        }`}
                      >
                        {log.status === "success" ? "Enviado" : "Error"}
                      </span>
                    </td>
                    <td className="px-3.5 py-2 text-muted-foreground text-[11px] max-w-[320px] truncate">
                      {log.resultMessage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground py-4 text-center">
            No se han enviado comandos en esta sesión aún.
          </p>
        )}
      </div>

      {/* Diálogo: Crear / Editar Comando en Wialon */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold uppercase tracking-wide">
              {isEditingId ? "Editar Comando en Wialon" : "Registrar Comando TCP en Wialon"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              El comando quedará guardado directamente en las propiedades del equipo en Wialon
              (apartado &ldquo;Comandos&rdquo;).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-3.5 mt-2">
            {/* Selector de plantilla Teltonika si es nuevo */}
            {!isEditingId && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Plantilla Rápida Teltonika
                </label>
                <select
                  onChange={(e) => {
                    const preset = TELTONIKA_COMMAND_PRESETS.find((p) => p.id === e.target.value);
                    if (preset) {
                      setFormName(preset.name);
                      setFormType(preset.commandType);
                      setFormLinkType(preset.linkType);
                      setFormParam(preset.param);
                      setFormDescription(preset.description);
                    }
                  }}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                >
                  <option value="">-- Seleccionar plantilla de Teltonika --</option>
                  {TELTONIKA_COMMAND_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.param.trim()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Nombre del comando */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Nombre del Comando *
              </label>
              <Input
                type="text"
                required
                placeholder="Ej: Paro de Motor (Corte), Reinicio GPS..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Tipo de comando y canal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Tipo en Wialon
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                >
                  <option value="custom_msg">custom_msg (Texto TCP)</option>
                  <option value="output_on">output_on (Salida ON)</option>
                  <option value="output_off">output_off (Salida OFF)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Canal / Enlace
                </label>
                <select
                  value={formLinkType}
                  onChange={(e) => setFormLinkType(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono"
                >
                  <option value="tcp">tcp (Recomendado)</option>
                  <option value="udp">udp</option>
                  <option value="gsm">gsm (SMS)</option>
                  <option value="auto">auto</option>
                </select>
              </div>
            </div>

            {/* Comando / Parámetro TCP */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Comando / Parámetro TCP *
                </label>
                <span className="text-[10px] text-muted-foreground">
                  Teltonika requiere espacio inicial
                </span>
              </div>
              <Input
                type="text"
                required
                placeholder="Ej:  setdigout 1,  cpureset,  ping"
                value={formParam}
                onChange={(e) => setFormParam(e.target.value)}
                className="font-mono text-xs text-emerald-400 bg-background"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Descripción (opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Explica qué hace este comando en el vehículo..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full rounded-md border border-border bg-background p-2 text-xs"
              />
            </div>

            {formError && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive">
                {formError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewDialogOpen(false)}
                className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {saveMutation.isPending ? "Guardando en Wialon…" : "Guardar en Wialon"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo: Confirmar Envío de Comando TCP */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold uppercase tracking-wide flex items-center gap-2">
              <Send className="size-4 text-emerald-400" />
              Enviar Comando vía TCP
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Se enviará este comando por socket TCP hacia la unidad{" "}
              <strong className="text-foreground">{currentUnit?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          {commandToSend && (
            <div className="space-y-4 mt-2">
              <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comando:</span>
                  <span className="font-bold text-foreground">{commandToSend.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Canal de transporte:</span>
                  <span className="font-mono font-bold text-primary uppercase">
                    {commandToSend.linkType || "TCP"}
                  </span>
                </div>
                {commandToSend.description && (
                  <p className="text-muted-foreground border-t border-border/40 pt-1.5 mt-1.5">
                    {commandToSend.description}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Parámetro a Enviar (puedes ajustarlo antes de enviar)
                </label>
                <Input
                  type="text"
                  value={customSendParam}
                  onChange={(e) => setCustomSendParam(e.target.value)}
                  className="font-mono text-xs text-emerald-400 bg-background"
                />
              </div>

              {commandToSend.param.includes("setdigout 1") && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 flex items-start gap-2.5 text-xs text-red-400">
                  <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Advertencia de Seguridad:</span> Este comando
                    activará el relevador de corte de motor (DOUT1). Asegúrate de que el vehículo
                    se encuentre en condiciones seguras antes de proceder.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSendDialogOpen(false)}
                  className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSend}
                  disabled={sendTcpMutation.isPending}
                  className="rounded-lg bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-xs font-bold uppercase text-white shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="size-3.5" />
                  <span>{sendTcpMutation.isPending ? "Transmitiendo…" : "Transmitir vía TCP"}</span>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
