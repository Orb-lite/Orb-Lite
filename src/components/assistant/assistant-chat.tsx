import * as React from "react";
import {
  X,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  Zap,
  Users,
  Radio,
  Share2,
  MapPin,
  Package,
} from "lucide-react";
import {
  assistantChat,
  assistantExecuteProcess,
} from "@/lib/assistant.functions";
import type {
  AssistantProcessData,
  RequirementsAnalysis,
} from "@/lib/assistant.server";

export function GreenDotAvatar({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const containerSize =
    size === "sm" ? "h-6 w-6" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const coreSize =
    size === "sm" ? "h-2 w-2" : size === "lg" ? "h-3.5 w-3.5" : "h-2.5 w-2.5";
  const haloSize =
    size === "sm" ? "h-4 w-4" : size === "lg" ? "h-7 w-7" : "h-5 w-5";

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.35)] ${containerSize} ${className}`}
    >
      {/* Halo de radar con animación suave */}
      <span
        className={`absolute inline-flex rounded-full bg-emerald-500/30 animate-ping ${haloSize}`}
      />
      {/* Anillo de pulso interno */}
      <span
        className={`absolute inline-flex rounded-full border border-emerald-400/50 bg-emerald-500/20 ${coreSize} scale-150`}
      />
      {/* Dot verde central brillante */}
      <span
        className={`relative inline-flex rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] ${coreSize}`}
      />
    </div>
  );
}

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  process?: AssistantProcessData | null;
  executedResult?: {
    ok: boolean;
    processTitle: string;
    id: string;
    message: string;
    link?: string;
    summary?: Record<string, any>;
  } | null;
};

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "¡Hola! Soy tu **Copilot de Operaciones de ORB-LITE**.\n\nPuedo guiarte en cualquier proceso de la plataforma, analizar los datos que exige cada trámite, generar el formulario listo y mandarlo directamente a las APIs del sistema.",
};

const QUICK_ACTIONS = [
  { label: "⚡ Renovación GPS", prompt: "Quiero registrar una renovación de GPS" },
  { label: "👤 Nuevo Cliente CRM", prompt: "Dar de alta un nuevo cliente en el CRM" },
  { label: "🚀 Solicitar Demo", prompt: "Quiero solicitar una demo de la plataforma" },
  { label: "📍 Crear Geocerca", prompt: "Ayúdame a crear una geocerca para un patio" },
  { label: "🔗 Compartir Rastreo", prompt: "Generar un enlace temporal para compartir una unidad" },
  { label: "📦 Cotizar Equipos", prompt: "Quiero cotizar equipos GPS FMB920" },
];

export function AssistantChat() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([INITIAL_MESSAGE]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt ?? input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await assistantChat({
        data: {
          message: textToSend,
          history,
        },
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.reply,
        process: res.process ?? null,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (msgId: string, fieldKey: string, value: any) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId || !msg.process) return msg;

        const updatedFields = { ...msg.process.fields, [fieldKey]: value };

        // Recalcular requisitos localmente
        const updatedChecklist = msg.process.requirementsAnalysis.items.map((item) => {
          if (item.field === fieldKey) {
            const hasVal =
              value !== undefined &&
              value !== null &&
              String(value).trim().length > 0;
            return { ...item, isComplete: hasVal };
          }
          return item;
        });

        const reqItems = updatedChecklist.filter((i) => i.isRequired);
        const compReq = reqItems.filter((i) => i.isComplete).length;
        const isReady = compReq === reqItems.length;

        const updatedAnalysis: RequirementsAnalysis = {
          ...msg.process.requirementsAnalysis,
          completedRequired: compReq,
          isReady,
          items: updatedChecklist,
          summary: isReady
            ? "✓ Todos los requisitos obligatorios están completos y validados para ejecutar el proceso contra la API."
            : `Faltan ${reqItems.length - compReq} dato(s) obligatorio(s) para poder ejecutar el proceso.`,
        };

        return {
          ...msg,
          process: {
            ...msg.process,
            fields: updatedFields,
            readyToSubmit: isReady,
            requirementsAnalysis: updatedAnalysis,
          },
        };
      }),
    );
  };

  const handleExecuteProcess = async (msgId: string, processData: AssistantProcessData) => {
    setIsLoading(true);
    try {
      const result = await assistantExecuteProcess({
        data: {
          processId: processData.id,
          fields: processData.fields,
        },
      });

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== msgId) return msg;
          return {
            ...msg,
            executedResult: result,
          };
        }),
      );
    } catch (err: any) {
      alert(`No se pudo ejecutar el proceso: ${err.message || "Error desconocido"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante del Asistente */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 rounded-full border border-cyan-500/40 bg-slate-950/90 px-4 py-3 text-sm font-medium text-slate-100 shadow-[0_0_25px_rgba(6,182,212,0.35)] backdrop-blur-md transition-all hover:scale-105 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] focus:outline-none active:scale-95"
            aria-label="Abrir Asistente de Operaciones"
          >
            <GreenDotAvatar size="md" />
            <div className="text-left leading-tight hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Copilot ORB-LITE
              </p>
              <p className="text-[11px] text-slate-400">Asistente de Procesos</p>
            </div>
          </button>
        )}
      </div>

      {/* Ventana flotante de Chat */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[620px] max-h-[88vh] w-[94vw] max-w-[460px] flex-col overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950/95 shadow-2xl backdrop-blur-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <GreenDotAvatar size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-100">
                    ORB-LITE Copilot
                  </h3>
                  <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                    En línea
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Analiza requisitos y manda a la API
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([INITIAL_MESSAGE])}
                title="Reiniciar conversación"
                className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Cerrar asistente"
                className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex gap-1.5 overflow-x-auto border-b border-slate-800/60 bg-slate-900/40 p-2 scrollbar-none">
            {QUICK_ACTIONS.map((qa) => (
              <button
                key={qa.label}
                onClick={() => handleSend(qa.prompt)}
                disabled={isLoading}
                className="shrink-0 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:border-cyan-500/50 hover:bg-cyan-950/30 hover:text-cyan-300 disabled:opacity-50"
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start items-start"}`}
              >
                {msg.role === "assistant" && (
                  <GreenDotAvatar size="sm" className="mt-1" />
                )}
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-tr-xs bg-cyan-600 text-white shadow-md"
                      : "rounded-tl-xs border border-slate-800 bg-slate-900/90 text-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-line text-xs">{msg.content}</p>

                  {/* Proceso y Formulario Interactivo */}
                  {msg.process && (
                    <ProcessFormCard
                      processData={msg.process}
                      executedResult={msg.executedResult}
                      isLoading={isLoading}
                      onFieldChange={(fieldKey, value) =>
                        handleFormChange(msg.id, fieldKey, value)
                      }
                      onExecute={() => handleExecuteProcess(msg.id, msg.process!)}
                    />
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-xs text-cyan-400">
                <GreenDotAvatar size="sm" />
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Analizando requerimientos y procesando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="border-t border-slate-800 bg-slate-900/90 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe el proceso o datos necesarios..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 transition-all hover:bg-cyan-400 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-1.5 text-center text-[10px] text-slate-500">
              ORB-LITE AI Copilot · Ejecuta acciones reales en el sistema
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function ProcessFormCard({
  processData,
  executedResult,
  isLoading,
  onFieldChange,
  onExecute,
}: {
  processData: AssistantProcessData;
  executedResult?: Message["executedResult"];
  isLoading: boolean;
  onFieldChange: (fieldKey: string, value: any) => void;
  onExecute: () => void;
}) {
  const [showAnalysis, setShowAnalysis] = React.useState(true);
  const analysis = processData.requirementsAnalysis;

  const getProcessIcon = () => {
    switch (processData.id) {
      case "renewal":
        return <Zap className="h-4 w-4 text-amber-400" />;
      case "crm_customer":
        return <Users className="h-4 w-4 text-cyan-400" />;
      case "demo_request":
        return <Radio className="h-4 w-4 text-emerald-400" />;
      case "route_share":
        return <Share2 className="h-4 w-4 text-indigo-400" />;
      case "geofence":
        return <MapPin className="h-4 w-4 text-red-400" />;
      case "quick_quote":
        return <Package className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-950/80 p-3 shadow-inner">
      {/* Encabezado del Formulario */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          {getProcessIcon()}
          <div>
            <h4 className="text-xs font-bold text-slate-100">
              {processData.title}
            </h4>
            <p className="text-[10px] text-slate-400">{processData.description}</p>
          </div>
        </div>

        {/* Badge de estado de validación */}
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
            analysis.isReady
              ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
              : "border-amber-500/40 bg-amber-500/20 text-amber-300"
          }`}
        >
          {analysis.isReady ? "✓ Requisitos Listos" : "⚠️ Datos Pendientes"}
        </span>
      </div>

      {/* BLOQUE: Análisis de Requisitos del Proceso */}
      <div className="mt-2.5 rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5">
        <button
          type="button"
          onClick={() => setShowAnalysis((prev) => !prev)}
          className="flex w-full items-center justify-between text-left text-[11px] font-semibold text-cyan-300 hover:text-cyan-200"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>
              Análisis de Requisitos: {analysis.completedRequired} de{" "}
              {analysis.totalRequired} obligatorios
            </span>
          </div>
          {showAnalysis ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Barra de progreso de requisitos */}
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full transition-all duration-300 ${
              analysis.isReady ? "bg-emerald-500" : "bg-amber-400"
            }`}
            style={{
              width: `${(analysis.completedRequired / Math.max(analysis.totalRequired, 1)) * 100}%`,
            }}
          />
        </div>

        {/* Desglose explicativo de cada dato y por qué lo pide el proceso */}
        {showAnalysis && (
          <div className="mt-2.5 space-y-1.5 border-t border-slate-800/60 pt-2 text-[10px]">
            <p className="font-medium text-slate-300 italic">{analysis.summary}</p>
            <div className="space-y-1 pt-1">
              {analysis.items.map((item) => (
                <div
                  key={item.field}
                  className="flex items-start gap-1.5 rounded bg-slate-950/60 p-1.5"
                >
                  {item.isComplete ? (
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                  ) : item.isRequired ? (
                    <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" />
                  ) : (
                    <span className="mt-0.5 h-3 w-3 shrink-0 text-center font-bold text-slate-500">
                      ○
                    </span>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-200">
                      {item.label}{" "}
                      {item.isRequired ? (
                        <span className="text-rose-400">*obligatorio</span>
                      ) : (
                        <span className="text-slate-500">(opcional)</span>
                      )}
                    </p>
                    <p className="text-slate-400">{item.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FORMULARIO EDITABLE */}
      {!executedResult && (
        <div className="mt-3 space-y-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Formulario Generado para la API:
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {processData.fieldDefinitions.map((field) => (
              <div
                key={field.key}
                className={field.type === "textarea" ? "sm:col-span-2" : ""}
              >
                <label className="mb-0.5 block text-[10px] font-medium text-slate-300">
                  {field.label}{" "}
                  {field.required && <span className="text-rose-400">*</span>}
                </label>

                {field.type === "select" ? (
                  <select
                    value={String(processData.fields[field.key] ?? field.value ?? "")}
                    onChange={(e) => onFieldChange(field.key, e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    rows={2}
                    value={String(processData.fields[field.key] ?? field.value ?? "")}
                    onChange={(e) => onFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={String(processData.fields[field.key] ?? field.value ?? "")}
                    onChange={(e) => onFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>

          {/* BOTÓN: MANDAR AL API */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onExecute}
              disabled={isLoading || !analysis.isReady}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all shadow-md ${
                analysis.isReady
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 active:scale-98 shadow-cyan-500/20"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Mandando solicitud a la API...</span>
                </>
              ) : analysis.isReady ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>🚀 Mandar al API / Ejecutar Proceso</span>
                </>
              ) : (
                <span>⚠️ Completa los datos obligatorios para mandar</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* RESULTADO DE LA EJECUCIÓN DEL API */}
      {executedResult && (
        <div className="mt-3 space-y-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <h5 className="font-bold text-xs">
              Proceso ejecutado y confirmado en la plataforma
            </h5>
          </div>

          <p className="text-xs text-slate-200">{executedResult.message}</p>

          {executedResult.summary && (
            <div className="rounded-lg border border-emerald-500/20 bg-slate-950/80 p-2 text-[10px]">
              <p className="mb-1 font-semibold text-emerald-300 uppercase tracking-wider">
                Resumen registrado en API:
              </p>
              <div className="grid grid-cols-2 gap-1 text-slate-300">
                {Object.entries(executedResult.summary).map(([k, v]) => (
                  <div key={k} className="flex flex-col">
                    <span className="text-slate-500">{k}:</span>
                    <span className="font-medium text-slate-200">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {executedResult.link && (
            <a
              href={executedResult.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/30"
            >
              <span>Abrir Enlace Generado</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
