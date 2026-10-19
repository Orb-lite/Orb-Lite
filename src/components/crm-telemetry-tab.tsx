import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Activity,
  AlertCircle,
  Binary,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  ExternalLink,
  FileCode,
  Flame,
  HelpCircle,
  Key,
  Layers,
  Play,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  WIALON_API_CATALOG,
  WIALON_ERROR_CODES,
  SWARM_ARCHITECTURE,
  getWialonApiCatalog,
  testWialonApiEndpoint,
  type WialonApiDefinition,
} from "@/lib/telemetry-swarm.functions";
import { useWialonSession } from "@/lib/wialon-session";

const CATEGORY_LABELS: Record<string, string> = {
  all: "Todas las APIs",
  auth: "Autenticación & Sesión",
  units: "Búsqueda & Unidades",
  history: "Historial & Telemetría",
  commands: "Comandos Hardware",
  geofences: "Geocercas & Rutas",
  reports: "Reportes & Tablas",
  account: "Cuenta & Límites",
  video: "Video & Streaming",
};

export function CrmTelemetryTab() {
  const fetchCatalog = useServerFn(getWialonApiCatalog);
  const runEndpointTest = useServerFn(testWialonApiEndpoint);
  const wialonSession = useWialonSession();

  const [activeSection, setActiveSection] = React.useState<
    "catalog" | "architecture" | "calculator" | "errors" | "tester"
  >("catalog");

  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedApiId, setSelectedApiId] = React.useState<string>("token-login");

  // Tester state
  const [testHost, setTestHost] = React.useState<"full" | "lite">("full");
  const [testSvc, setTestSvc] = React.useState("core/search_items");
  const [testParamsJson, setTestParamsJson] = React.useState(
    JSON.stringify(
      {
        spec: {
          itemsType: "avl_unit",
          propName: "sys_name",
          propValueMask: "*",
          sortType: "sys_name",
        },
        force: 1,
        flags: 1025,
        from: 0,
        to: 0,
      },
      null,
      2,
    ),
  );
  const [testResult, setTestResult] = React.useState<any>(null);
  const [isTesting, setIsTesting] = React.useState(false);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Bitmask Calculator state
  const [selectedFlags, setSelectedFlags] = React.useState<number[]>([1, 1024]);

  const query = useQuery({
    queryKey: ["wialon-api-catalog"],
    queryFn: () => fetchCatalog(),
    staleTime: 1000 * 60 * 30,
  });

  // Always guarantee full catalog immediately without waiting for async query
  const catalog: WialonApiDefinition[] =
    query.data?.catalog && query.data.catalog.length > 0
      ? query.data.catalog
      : WIALON_API_CATALOG;

  const errorCodes =
    query.data?.errorCodes && query.data.errorCodes.length > 0
      ? query.data.errorCodes
      : WIALON_ERROR_CODES;

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: catalog.length };
    for (const item of catalog) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [catalog]);

  const filteredCatalog = React.useMemo(() => {
    return catalog.filter((api) => {
      const matchesCategory = selectedCategory === "all" || api.category === selectedCategory;
      const matchesSearch =
        search.trim() === "" ||
        api.name.toLowerCase().includes(search.toLowerCase()) ||
        api.svc.toLowerCase().includes(search.toLowerCase()) ||
        api.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [catalog, selectedCategory, search]);

  const selectedApi = React.useMemo(() => {
    const foundInFiltered = filteredCatalog.find((a) => a.id === selectedApiId);
    if (foundInFiltered) return foundInFiltered;
    return filteredCatalog[0] ?? catalog[0];
  }, [catalog, filteredCatalog, selectedApiId]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`Copiado: ${label}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleLoadInTester = (api: WialonApiDefinition) => {
    setTestSvc(api.svc);
    setTestParamsJson(JSON.stringify(api.payloadTemplate, null, 2));
    setActiveSection("tester");
    toast.info(`Cargado ${api.svc} en la consola de pruebas`);
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      let parsedParams = {};
      if (testParamsJson.trim()) {
        parsedParams = JSON.parse(testParamsJson);
      }
      const res = await runEndpointTest({
        data: {
          host: testHost,
          svc: testSvc.trim(),
          params: parsedParams,
          sid: wialonSession?.sid || undefined,
        },
      });
      setTestResult(res);
      if (res.success) {
        toast.success(`Respuesta 200 OK (${res.latencyMs}ms)`);
      } else {
        toast.error(`Wialon Error ${res.statusCode}: ${res.error}`);
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        statusCode: 500,
        latencyMs: 0,
        error: e.message || "Error al parsear JSON o conectar con el servidor",
      });
      toast.error(e.message || "Error al ejecutar petición");
    } finally {
      setIsTesting(false);
    }
  };

  const totalCalculatedBitmask = React.useMemo(() => {
    return selectedFlags.reduce((acc, curr) => acc | curr, 0);
  }, [selectedFlags]);

  const toggleFlag = (flagVal: number) => {
    setSelectedFlags((prev) =>
      prev.includes(flagVal) ? prev.filter((f) => f !== flagVal) : [...prev, flagVal],
    );
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Principal del Swarm */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-border/70 bg-card p-5 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="font-display text-lg font-bold text-foreground">
              Swarm de APIs Wialon · Arquitectura y Estructura de Integración
            </h2>
            <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
              Inspector de Contratos &amp; Esquemas
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-3xl">
            Módulo técnico de la Remote API de Wialon consumida por ORB-Lite. Inspección de endpoints, parámetros obligatorios, cálculo de bitmasks (flags), serialización URL-encoded y mitigación de límites de rate-limit.
          </p>
        </div>

        {/* Estado de Conexión de Sesión */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-1.5 text-xs">
            <span className="text-muted-foreground">Sesión Wialon: </span>
            {wialonSession?.sid ? (
              <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                {wialonSession.sid.substring(0, 8)}... ({wialonSession.host || "full"})
              </span>
            ) : (
              <span className="font-mono text-amber-600 dark:text-amber-400">No autenticado</span>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => query.refetch()}
            disabled={query.isFetching}
            className="gap-1.5 text-xs h-8"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${query.isFetching ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Navegación por Pestañas Secundarias del Swarm */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 pb-3">
        <Button
          size="sm"
          variant={activeSection === "catalog" ? "default" : "ghost"}
          onClick={() => setActiveSection("catalog")}
          className="gap-2 text-xs"
        >
          <BookOpen className="h-4 w-4" />
          Catálogo &amp; Esquemas de APIs ({catalog.length})
        </Button>
        <Button
          size="sm"
          variant={activeSection === "architecture" ? "default" : "ghost"}
          onClick={() => setActiveSection("architecture")}
          className="gap-2 text-xs"
        >
          <Server className="h-4 w-4" />
          Arquitectura Serverless Swarm
        </Button>
        <Button
          size="sm"
          variant={activeSection === "calculator" ? "default" : "ghost"}
          onClick={() => setActiveSection("calculator")}
          className="gap-2 text-xs"
        >
          <Binary className="h-4 w-4" />
          Calculadora de Flags (Bitmasks)
        </Button>
        <Button
          size="sm"
          variant={activeSection === "errors" ? "default" : "ghost"}
          onClick={() => setActiveSection("errors")}
          className="gap-2 text-xs"
        >
          <ShieldAlert className="h-4 w-4" />
          Diccionario de Errores Wialon
        </Button>
        <Button
          size="sm"
          variant={activeSection === "tester" ? "default" : "ghost"}
          onClick={() => setActiveSection("tester")}
          className="gap-2 text-xs"
        >
          <Terminal className="h-4 w-4" />
          Consola / Tester en Vivo
        </Button>
      </div>

      {/* SECCIÓN 1: CATÁLOGO & ESQUEMAS */}
      {activeSection === "catalog" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Filtros y Lista de APIs */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar servicio (ej. search_items, exec_cmd)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            {/* Categorías */}
            <div className="flex flex-wrap gap-1">
              {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => {
                const count = categoryCounts[catKey] ?? 0;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setSelectedCategory(catKey)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      selectedCategory === catKey
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {catLabel} <span className="opacity-75 font-mono text-[10px]">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Lista de Endpoints */}
            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredCatalog.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground space-y-2">
                  <p>No se encontraron endpoints con ese filtro.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearch("");
                    }}
                    className="text-xs h-7"
                  >
                    Mostrar todas las APIs ({catalog.length})
                  </Button>
                </div>
              ) : (
                filteredCatalog.map((api) => {
                  const isSelected = api.id === selectedApi?.id;
                  return (
                    <div
                      key={api.id}
                      onClick={() => setSelectedApiId(api.id)}
                      className={`cursor-pointer rounded-lg border p-3 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-2xs"
                          : "border-border/60 bg-card hover:border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[11px] font-bold text-foreground">
                          svc={api.svc}
                        </span>
                        <Badge variant="outline" className="text-[10px] uppercase font-mono">
                          {api.category}
                        </Badge>
                      </div>
                      <p className="text-xs font-medium text-foreground/90 mt-1">{api.name}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {api.description}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Columna Derecha: Detalle Técnico del Esquema Seleccionado */}
          <div className="lg:col-span-8 space-y-5">
            {selectedApi ? (
              <div className="space-y-5 rounded-xl border border-border/80 bg-card p-5 shadow-xs">
                {/* Cabecera del Endpoint */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border/60 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/90 text-[11px]">{selectedApi.httpMethod}</Badge>
                      <span className="font-mono text-sm font-bold text-foreground">
                        svc={selectedApi.svc}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground">{selectedApi.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedApi.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLoadInTester(selectedApi)}
                      className="gap-1.5 text-xs"
                    >
                      <Play className="h-3 w-3 text-emerald-500" />
                      Probar en Tester
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(selectedApi.baseUrl, "URL Base")}
                      className="gap-1 text-xs"
                      title="Copiar URL Base"
                    >
                      {copiedKey === "URL Base" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>

                {/* URL y Endpoint Base */}
                <div className="rounded-lg bg-muted/40 p-3 space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    URL de Conexión Wialon Remote API
                  </span>
                  <div className="flex items-center justify-between gap-2 font-mono text-xs text-foreground bg-background/80 p-2 rounded border border-border/50">
                    <span className="break-all">{selectedApi.baseUrl}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedApi.baseUrl, "URL")}
                      className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Parámetros Requeridos */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Code2 className="h-4 w-4 text-primary" /> Parámetros del Servicio (JSON en body params)
                    </h4>
                    <span className="text-[11px] text-muted-foreground">
                      {selectedApi.requiredParams.length} parámetros definidos
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-border/60">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase border-b border-border/50">
                        <tr>
                          <th className="p-2.5">Parámetro</th>
                          <th className="p-2.5">Tipo</th>
                          <th className="p-2.5">Requerido</th>
                          <th className="p-2.5">Descripción &amp; Ejemplo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {selectedApi.requiredParams.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-3 text-center text-muted-foreground">
                              Este servicio no requiere parámetros adicionales en params (solo sid activo).
                            </td>
                          </tr>
                        ) : (
                          selectedApi.requiredParams.map((param) => (
                            <tr key={param.name} className="hover:bg-muted/20">
                              <td className="p-2.5 font-mono font-bold text-foreground">
                                {param.name}
                              </td>
                              <td className="p-2.5 font-mono text-muted-foreground">
                                {param.type}
                              </td>
                              <td className="p-2.5">
                                {param.required ? (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-destructive/10 text-destructive">
                                    Obligatorio
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                                    Opcional
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5 space-y-0.5">
                                <p className="text-foreground">{param.description}</p>
                                {param.example && (
                                  <p className="font-mono text-[11px] text-primary">
                                    ej: {param.example}
                                  </p>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Banderas de Bits si aplica */}
                {selectedApi.flagsExplained && selectedApi.flagsExplained.length > 0 && (
                  <div className="space-y-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5">
                    <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <Binary className="h-4 w-4" /> Desglose de Flags / Bitmasks de Datos
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Wialon utiliza máscaras de bits binarias sumadas como entero decimal para determinar qué campos serializar:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {selectedApi.flagsExplained.map((flag) => (
                        <div
                          key={flag.dec}
                          className="flex items-center justify-between rounded bg-background/80 p-2 border border-border/50 text-xs"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-foreground">{flag.description}</span>
                            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                              <span>Hex: {flag.hex}</span>
                              <span>Dec: {flag.dec}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reglas Técnicas y Requisitos de Wialon */}
                <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-3.5">
                  <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> Requisitos de Validación en Wialon
                  </h4>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {selectedApi.wialonRequirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Esquema de Petición (Payload) vs Esquema de Respuesta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Payload Request */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                        Esquema de Payload (Body params)
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(JSON.stringify(selectedApi.payloadTemplate, null, 2), "Payload")
                        }
                        className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" /> Copiar
                      </button>
                    </div>
                    <pre className="rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-56 border border-zinc-800">
                      {JSON.stringify(selectedApi.payloadTemplate, null, 2)}
                    </pre>
                  </div>

                  {/* Sample Response */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                        Respuesta Wialon (Sample Response)
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(JSON.stringify(selectedApi.sampleResponse, null, 2), "Respuesta")
                        }
                        className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" /> Copiar
                      </button>
                    </div>
                    <pre className="rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-sky-400 overflow-x-auto max-h-56 border border-zinc-800">
                      {JSON.stringify(selectedApi.sampleResponse, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: ARQUITECTURA SERVERLESS SWARM */}
      {activeSection === "architecture" && (
        <div className="space-y-6">
          {/* Tarjeta de Resumen Arquitectónico */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-foreground">
                Arquitectura del Swarm Serverless (ORB-LITE CRM &amp; Wialon)
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-4xl">
              El Swarm es un orquestador middleware sin estado (Stateless Serverless Proxy) diseñado para resolver los tres problemas estructurales de la Remote API de Wialon: la invalidación de sesiones efímeras (Error 1), el bloqueo por saturación de concurrencia (Error 1003) y el límite de llamadas por minuto (Error 1004).
            </p>

            {/* Diagrama de Pipeline de Datos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
                <span className="inline-block rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                  Paso 1: Cliente
                </span>
                <h4 className="text-sm font-semibold text-foreground">CRM en orb-lite.com/auth</h4>
                <p className="text-[11px] text-muted-foreground">
                  El operador o vista del CRM despacha la acción solicitada usando TanStack Start `serverFn` con token de seguridad.
                </p>
              </div>

              <div className="rounded-lg border border-border/80 bg-muted/30 p-4 space-y-2">
                <span className="inline-block rounded bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground uppercase">
                  Paso 2: Swarm Gateway
                </span>
                <h4 className="text-sm font-semibold text-foreground">Caché Warm &amp; Mutex</h4>
                <p className="text-[11px] text-muted-foreground">
                  Verifica el SID activo en memoria. Si no existe o expiró, ejecuta login atómico protegiendo contra peticiones duplicadas.
                </p>
              </div>

              <div className="rounded-lg border border-border/80 bg-muted/30 p-4 space-y-2">
                <span className="inline-block rounded bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground uppercase">
                  Paso 3: Sanitización
                </span>
                <h4 className="text-sm font-semibold text-foreground">Form-UrlEncoded Wrapper</h4>
                <p className="text-[11px] text-muted-foreground">
                  Wialon rechaza JSON directo en el body HTTP. El Swarm empaqueta `params=JSON.stringify()` en `application/x-www-form-urlencoded`.
                </p>
              </div>

              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
                <span className="inline-block rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 uppercase">
                  Paso 4: Resiliencia
                </span>
                <h4 className="text-sm font-semibold text-foreground">Auto-Retry on Error 1/1003</h4>
                <p className="text-[11px] text-muted-foreground">
                  Si Wialon responde error 1 (sesión expirada) o 1003 (concurrencia), reintenta automáticamente con backoff sin romper la UI.
                </p>
              </div>
            </div>
          </div>

          {/* Comparativa: Cómo Wialon Exige las Peticiones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <h4 className="text-sm font-bold">Petición Incorrecta (Dispara Error 2 o Error 4)</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Enviar JSON nativo en el body de HTTP POST o enviar parámetros planos sin la llave `params`:
              </p>
              <pre className="rounded bg-zinc-950 p-3 font-mono text-[11px] text-destructive overflow-x-auto">
{`POST /wialon/ajax.html?svc=unit/update_command_definition HTTP/1.1
Host: hst-api.wialon.com
Content-Type: application/json

{
  "itemId": 28491823,
  "n": "Paro Motor",
  "callMode": "create"
}
--> ERROR 4: Invalid input (falta f:0, formato urlencoded)`}
              </pre>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <h4 className="text-sm font-bold">Estructura Oficial Swarm (Aceptada por Wialon)</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                POST form-urlencoded con JSON stringified en el parámetro `params` y el SID en la URL o body:
              </p>
              <pre className="rounded bg-zinc-950 p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto">
{`POST /wialon/ajax.html?svc=unit/update_command_definition&sid=08013... HTTP/1.1
Host: hst-api.wialon.com
Content-Type: application/x-www-form-urlencoded

params=%7B%22itemId%22%3A28491823%2C%22id%22%3A0%2C%22n%22%3A%22Paro%20Motor%22%2C%22c%22%3A%22custom_msg%22%2C%22l%22%3A%22tcp%22%2C%22p%22%3A%221%22%2C%22a%22%3A0%2C%22f%22%3A0%2C%22callMode%22%3A%22create%22%7D
--> STATUS 200 OK: [0, {"id": 14, "n": "Paro Motor"}]`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN 3: CALCULADORA DE FLAGS */}
      {activeSection === "calculator" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Binary className="h-5 w-5 text-primary" />
                  Calculadora y Compositor de Flags de Wialon
                </h3>
                <p className="text-xs text-muted-foreground">
                  Wialon exige valores decimales resultantes de la operación binaria OR (`|`) para determinar qué componentes devolver en `core/search_items`.
                </p>
              </div>

              <div className="rounded-xl border border-primary/40 bg-primary/10 p-3 text-right">
                <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
                  Valor Total a Enviar
                </span>
                <p className="font-mono text-2xl font-bold text-foreground mt-0.5">
                  {totalCalculatedBitmask}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  Hex: 0x{totalCalculatedBitmask.toString(16).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Selector de Flags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {[
                { dec: 1, hex: "0x1", name: "Propiedades Base", desc: "ID, nombre, uid/IMEI, teléfono y clase de unidad." },
                { dec: 2, hex: "0x2", name: "Campos Personalizados", desc: "Campos de texto libre definidos por el usuario." },
                { dec: 4, hex: "0x4", name: "Parámetros de Facturación", desc: "Planes y contadores de mensajes facturables." },
                { dec: 8, hex: "0x8", name: "Mensajes de Notificación", desc: "Alertas y disparadores de eventos vinculados." },
                { dec: 16, hex: "0x10", name: "Propiedades de Conductor", desc: "Asignación actual de chofer / tag iButton/RFID." },
                { dec: 1024, hex: "0x400", name: "Posición GPS en Vivo", desc: "Última coordenada {x: lng, y: lat, s: speed, t: time}." },
                { dec: 4096, hex: "0x1000", name: "Sensores Configurados", desc: "Calibración de combustible, ignición y temperatura." },
                { dec: 65536, hex: "0x10000", name: "Comandos de Hardware", desc: "Lista de plantillas de comando disponibles para ejecutar." },
                { dec: 1048576, hex: "0x100000", name: "Buffer de Mensajes", desc: "Últimos paquetes sinópticos almacenados en RAM." },
              ].map((flag) => {
                const isActive = selectedFlags.includes(flag.dec);
                return (
                  <div
                    key={flag.dec}
                    onClick={() => toggleFlag(flag.dec)}
                    className={`cursor-pointer rounded-lg border p-3.5 transition-all ${
                      isActive
                        ? "border-primary bg-primary/5 shadow-2xs"
                        : "border-border/60 bg-muted/20 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-foreground">{flag.name}</span>
                      <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-bold ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {flag.hex}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">{flag.desc}</p>
                    <div className="mt-2 text-[10px] font-mono text-muted-foreground">
                      Decimal: +{flag.dec}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Código generado para usar en código TS */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                Código TypeScript / JSON Resultante
              </span>
              <pre className="rounded-lg bg-zinc-950 p-3 font-mono text-xs text-emerald-400 overflow-x-auto">
{`// Payload para core/search_items con las banderas seleccionadas
const payload = {
  spec: { itemsType: "avl_unit", propName: "sys_name", propValueMask: "*", sortType: "sys_name" },
  force: 1,
  flags: ${totalCalculatedBitmask}, // 0x${totalCalculatedBitmask.toString(16).toUpperCase()} (${selectedFlags.join(" + ")})
  from: 0,
  to: 0
};`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN 4: DICCIONARIO DE ERRORES WIALON */}
      {activeSection === "errors" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Diccionario Oficial de Códigos de Error Wialon Remote API
            </h3>
            <p className="text-xs text-muted-foreground">
              Wialon no utiliza códigos de estado HTTP estándar (responde casi siempre HTTP 200 con `{`{ error: <código> }`}`). A continuación se detalla la causa técnica y cómo el Swarm previene o mitiga cada caso:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {errorCodes.map((err) => (
              <div
                key={err.code}
                className="rounded-xl border border-border/80 bg-card p-4 space-y-2 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-6 w-10 rounded bg-destructive/10 font-mono text-xs font-bold text-destructive">
                      #{err.code}
                    </span>
                    <span className="font-bold text-sm text-foreground">{err.name}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{err.desc}</p>
                <div className="rounded bg-muted/40 p-2 text-[11px] text-foreground space-y-1">
                  <span className="font-semibold text-primary">Solución implementada en Swarm:</span>
                  <p className="text-muted-foreground">
                    {err.code === 1 && "Renovación atómica de sesión vía token/login en memoria warm sin interrumpir la operación del CRM."}
                    {err.code === 2 && "Validación previa de nombres de servicios en el catálogo antes de despachar hacia hst-api.wialon.com."}
                    {err.code === 4 && "Inyección obligatoria de propiedades de protocolo (ej. f:0, flags decimales, linkType) para cumplir el validador estricto de Wialon."}
                    {err.code === 1003 && "Manejo de mutex de concurrencia: el Swarm encola llamadas simultáneas con backoff de 300ms."}
                    {err.code === 1004 && "Caché de consultas de corta duración (TTL 10s) para evitar que operadores disparando clics repetidos agoten la cuota de la cuenta."}
                    {![1, 2, 4, 1003, 1004].includes(err.code) && "Mapeo a excepción estructurada WialonError para registro en auditoría."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 5: TESTER / CONSOLA INTERACTIVA */}
      {activeSection === "tester" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4 rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" /> Ejecutar Consulta hacia el Swarm
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground">Servidor / Datacenter</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant={testHost === "full" ? "default" : "outline"}
                    onClick={() => setTestHost("full")}
                    className="text-xs h-8"
                  >
                    Hosting Full (hst-api.wialon.com)
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={testHost === "lite" ? "default" : "outline"}
                    onClick={() => setTestHost("lite")}
                    className="text-xs h-8"
                  >
                    Lite (hst-api.wialon.us)
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Nombre del Servicio (svc)</label>
                <Input
                  value={testSvc}
                  onChange={(e) => setTestSvc(e.target.value)}
                  placeholder="ej. core/search_items o unit/exec_cmd"
                  className="font-mono text-xs mt-1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">
                    Parámetros del Payload (JSON)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(testParamsJson);
                        setTestParamsJson(JSON.stringify(parsed, null, 2));
                      } catch {
                        toast.error("JSON inválido");
                      }
                    }}
                    className="text-[11px] text-primary hover:underline"
                  >
                    Formatear JSON
                  </button>
                </div>
                <textarea
                  value={testParamsJson}
                  onChange={(e) => setTestParamsJson(e.target.value)}
                  rows={10}
                  className="w-full mt-1 rounded-lg border border-border bg-zinc-950 p-3 font-mono text-xs text-emerald-400 focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <Button
                onClick={handleRunTest}
                disabled={isTesting}
                className="w-full gap-2 text-xs"
              >
                <Play className={`h-3.5 w-3.5 ${isTesting ? "animate-spin" : ""}`} />
                {isTesting ? "Procesando en Swarm..." : "Despachar Petición a Wialon"}
              </Button>
            </div>
          </div>

          {/* Consola de Resultados */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" /> Respuesta de Wialon Remote API
                </h3>
                {testResult && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {testResult.latencyMs}ms
                    </span>
                    <Badge
                      variant={testResult.success ? "default" : "destructive"}
                      className="text-[10px] font-mono"
                    >
                      {testResult.success ? "200 OK" : `Error ${testResult.statusCode}`}
                    </Badge>
                  </div>
                )}
              </div>

              {!testResult && !isTesting && (
                <div className="rounded-lg border border-dashed border-border p-12 text-center text-xs text-muted-foreground space-y-2">
                  <Terminal className="mx-auto h-8 w-8 opacity-40" />
                  <p>Configura los parámetros y haz clic en &quot;Despachar Petición a Wialon&quot;.</p>
                  <p className="text-[11px]">La respuesta cruda del servidor Wialon aparecerá aquí formateada en tiempo real.</p>
                </div>
              )}

              {isTesting && (
                <div className="rounded-lg border border-border bg-muted/20 p-12 text-center text-xs text-muted-foreground space-y-2">
                  <RefreshCw className="mx-auto h-6 w-6 animate-spin text-primary" />
                  <p>Consultando clúster de Wialon a través del Swarm Serverless...</p>
                </div>
              )}

              {testResult && (
                <div className="space-y-3">
                  {testResult.error && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                      <strong>Fallo en la llamada:</strong> {testResult.error}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Cuerpo de respuesta JSON:</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            JSON.stringify(testResult.data || testResult, null, 2),
                            "Respuesta",
                          )
                        }
                        className="hover:text-foreground flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" /> Copiar respuesta
                      </button>
                    </div>
                    <pre className="rounded-lg bg-zinc-950 p-4 font-mono text-xs text-sky-400 overflow-x-auto max-h-[460px] border border-zinc-800">
                      {JSON.stringify(testResult.data ?? testResult, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
