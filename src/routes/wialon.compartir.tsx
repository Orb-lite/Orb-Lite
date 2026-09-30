import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Share2,
  Plus,
  Clock,
  Car,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Trash2,
  Calendar,
  MessageCircle,
  RefreshCw,
  Search,
  AlertCircle,
  Infinity as InfinityIcon,
  CheckSquare,
  Square,
  ChevronDown,
} from "lucide-react";
import { WialonGuard } from "@/components/wialon-guard";
import { type WialonSession } from "@/lib/wialon-session";
import { wialonUnits } from "@/lib/wialon.functions";
import {
  createUnitShare,
  listUnitShares,
  revokeUnitShare,
  extendUnitShare,
  deleteUnitShare,
  type SharedUnitLink,
} from "@/lib/unit-share.functions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/wialon/compartir")({
  head: () => ({
    meta: [
      { title: "Enlaces de Rastreo Compartido | ORB-LITE" },
      {
        name: "description",
        content: "Comparte temporalmente la ubicación en tiempo real de cualquier unidad satelital.",
      },
      { property: "og:title", content: "Enlaces de Rastreo Compartido | ORB-LITE" },
    ],
  }),
  component: WialonSharePageWrapper,
});

function WialonSharePageWrapper() {
  return <WialonGuard>{(session) => <WialonSharePage session={session} />}</WialonGuard>;
}

const PRESET_DURATIONS = [
  { label: "1 hora", hours: 1 },
  { label: "2 horas", hours: 2 },
  { label: "4 horas", hours: 4 },
  { label: "8 horas", hours: 8 },
  { label: "12 horas", hours: 12 },
  { label: "24 horas", hours: 24 },
  { label: "48 horas", hours: 48 },
  { label: "72 horas", hours: 72 },
  { label: "Sin Límite", hours: 876000 }, // ~100 años (Permanente)
];

function WialonSharePage({ session }: { session: WialonSession }) {
  const queryClient = useQueryClient();
  const fetchUnits = useServerFn(wialonUnits);
  const fetchShares = useServerFn(listUnitShares);
  const createShareFn = useServerFn(createUnitShare);
  const revokeShareFn = useServerFn(revokeUnitShare);
  const extendShareFn = useServerFn(extendUnitShare);
  const deleteShareFn = useServerFn(deleteUnitShare);

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [successLinks, setSuccessLinks] = React.useState<SharedUnitLink[]>([]);
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  // Form State (Soporte Multi-Selección)
  const [selectedUnitIds, setSelectedUnitIds] = React.useState<(number | "custom")[]>([]);
  const [customUnitName, setCustomUnitName] = React.useState("");
  const [durationHours, setDurationHours] = React.useState<number>(24);
  const [clientName, setClientName] = React.useState("");
  const [clientPhone, setClientPhone] = React.useState("");
  const [clientEmail, setClientEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Queries
  const unitsQuery = useQuery({
    queryKey: ["wialon-units", session.sid],
    queryFn: () => fetchUnits({ data: { host: session.host, sid: session.sid } }),
    staleTime: 60000,
  });

  const sharesQuery = useQuery({
    queryKey: ["unit-shares", session.host],
    queryFn: () => fetchShares({ data: { host: session.host, sid: session.sid } }),
    refetchInterval: 15000,
  });

  const units = unitsQuery.data?.units ?? [];
  const shares = sharesQuery.data?.links ?? [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: createShareFn,
  });

  const revokeMutation = useMutation({
    mutationFn: revokeShareFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["unit-shares"] }),
  });

  const extendMutation = useMutation({
    mutationFn: extendShareFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["unit-shares"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteShareFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["unit-shares"] }),
  });

  // Toggle selection
  const toggleUnitSelection = (id: number | "custom") => {
    setSelectedUnitIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUnitIds.length === units.length) {
      setSelectedUnitIds([]);
    } else {
      setSelectedUnitIds(units.map((u) => u.id));
    }
  };

  // Statistics
  const activeCount = shares.filter((s) => s.status === "active").length;
  const expiredCount = shares.filter((s) => s.status !== "active").length;
  const totalViews = shares.reduce((acc, s) => acc + (s.viewCount || 0), 0);

  const filteredShares = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return shares;
    return shares.filter(
      (s) =>
        s.unitName.toLowerCase().includes(q) ||
        (s.clientName && s.clientName.toLowerCase().includes(q)) ||
        (s.notes && s.notes.toLowerCase().includes(q))
    );
  }, [shares, search]);

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (selectedUnitIds.length === 0) {
      setFormError("Debes seleccionar al menos una unidad o escribir su nombre.");
      return;
    }

    try {
      const createdLinks: SharedUnitLink[] = [];

      for (const unitId of selectedUnitIds) {
        let unitName = customUnitName.trim();
        let imei: string | null = null;
        let initialPos: any = null;

        if (unitId !== "custom") {
          const found = units.find((u) => u.id === unitId);
          if (found) {
            unitName = found.name;
            imei = found.imei;
            if (found.lat && found.lon) {
              initialPos = {
                lat: found.lat,
                lon: found.lon,
                speed: found.speed ?? 0,
                course: found.course ?? 0,
                time: found.lastMessage ?? Math.floor(Date.now() / 1000),
              };
            }
          }
        }

        if (!unitName) continue;

        const res = await createMutation.mutateAsync({
          data: {
            unitId: typeof unitId === "number" ? unitId : Math.floor(10000 + Math.random() * 90000),
            unitName,
            imei,
            clientName: clientName.trim() || null,
            clientPhone: clientPhone.trim() || null,
            clientEmail: clientEmail.trim() || null,
            notes: notes.trim() || null,
            durationHours,
            host: session.host,
            sid: session.sid,
            initialPosition: initialPos,
          },
        });

        if (res?.link) {
          createdLinks.push(res.link);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["unit-shares"] });
      setSuccessLinks(createdLinks);
      setCreateDialogOpen(false);

      // Reset Form
      setSelectedUnitIds([]);
      setCustomUnitName("");
      setClientName("");
      setClientPhone("");
      setClientEmail("");
      setNotes("");
    } catch (err: any) {
      setFormError(err.message || "Error al generar enlaces.");
    }
  }

  function copyShareUrl(token: string) {
    const url = `${window.location.origin}/rastreo/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 3000);
  }

  function getWhatsAppUrl(token: string, unitName: string, clientName?: string | null, clientPhone?: string | null) {
    const url = `${window.location.origin}/rastreo/${token}`;
    const greeting = clientName ? `Hola ${clientName}, ` : "Hola, ";
    const msg = `${greeting}te comparto el enlace para seguir en tiempo real la unidad satelital *${unitName}*:\n\n${url}\n\nEnlace seguro con mapa en vivo y navegación Waze.`;
    const cleanPhone = clientPhone ? clientPhone.replace(/\D/g, "") : "";
    if (cleanPhone) {
      return `https://api.whatsapp.com/send?phone=${cleanPhone.length === 10 ? `52${cleanPhone}` : cleanPhone}&text=${encodeURIComponent(msg)}`;
    }
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide flex items-center gap-2.5 text-foreground">
            <Share2 className="size-6 text-primary" />
            Rastreo Compartido por Tiempo Limitado
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Genera enlaces temporales seguros con mapa en vivo para clientes o supervisores sin compartir tus credenciales.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setCreateDialogOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-lg hover:opacity-90 transition-all active:scale-95 shrink-0"
        >
          <Plus className="size-4" />
          <span>Nuevo Enlace Temporal</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Enlaces Activos</p>
            <p className="mt-1 font-mono text-2xl font-bold text-primary">{activeCount}</p>
          </div>
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="size-5" />
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Enlaces Expirados / Revocados</p>
            <p className="mt-1 font-mono text-2xl font-bold text-muted-foreground">{expiredCount}</p>
          </div>
          <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Clock className="size-5" />
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Visualizaciones</p>
            <p className="mt-1 font-mono text-2xl font-bold text-cyan-400">{totalViews}</p>
          </div>
          <div className="size-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <Eye className="size-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por unidad o cliente..."
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["unit-shares"] })}
          disabled={sharesQuery.isFetching}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors self-end"
        >
          <RefreshCw className={`size-3.5 ${sharesQuery.isFetching ? "animate-spin text-primary" : ""}`} />
          <span>Actualizar lista</span>
        </button>
      </div>

      {/* Shared Links List */}
      {sharesQuery.isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border/60 bg-card/40 p-8">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filteredShares.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
          <Share2 className="mx-auto size-12 text-muted-foreground/60" />
          <h3 className="mt-4 font-display text-base font-bold uppercase tracking-wider text-foreground">
            No hay enlaces compartidos registrados
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
            {search
              ? "No se encontraron enlaces con ese término de búsqueda."
              : "Genera un enlace temporal para que tus clientes o supervisores puedan ver la unidad en vivo en el mapa."}
          </p>
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
          >
            <Plus className="size-4" />
            <span>Crear Primer Enlace</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredShares.map((link) => {
            const isExpired = link.status === "expired" || new Date(link.expiresAt).getTime() <= Date.now();
            const isRevoked = link.status === "revoked";
            const isActive = link.status === "active" && !isExpired;
            const isPermanent = link.durationHours >= 800000;

            return (
              <div
                key={link.id}
                className={`rounded-xl border transition-all p-5 bg-card/90 shadow-sm ${
                  isActive
                    ? "border-primary/40 hover:border-primary shadow-[0_0_15px_rgba(146,215,0,0.05)]"
                    : "border-border/60 opacity-80"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-display text-base font-bold text-foreground flex items-center gap-2">
                        <Car className="size-4 text-primary" />
                        {link.unitName}
                      </span>

                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Activo
                        </span>
                      ) : isRevoked ? (
                        <span className="rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-400">
                          Revocado
                        </span>
                      ) : (
                        <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400">
                          Expirado
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="size-3.5 text-cyan-400" />
                        {link.viewCount || 0} visitas
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {link.clientName ? (
                        <p>
                          <strong className="text-foreground">Cliente:</strong> {link.clientName}
                        </p>
                      ) : null}
                      {link.clientPhone ? (
                        <p>
                          <strong className="text-foreground">Tel:</strong> {link.clientPhone}
                        </p>
                      ) : null}
                      <p>
                        <strong className="text-foreground">Vigencia:</strong>{" "}
                        {isPermanent ? (
                          <span className="text-primary font-bold">Sin Límite (Permanente)</span>
                        ) : (
                          `${link.durationHours}h (expira ${new Date(link.expiresAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })})`
                        )}
                      </p>
                    </div>

                    {link.notes ? (
                      <p className="text-xs text-muted-foreground italic line-clamp-1">&ldquo;{link.notes}&rdquo;</p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyShareUrl(link.token)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      {copiedToken === link.token ? (
                        <>
                          <Check className="size-3.5 text-primary" />
                          <span className="text-primary">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>

                    <a
                      href={getWhatsAppUrl(link.token, link.unitName, link.clientName, link.clientPhone)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 transition-colors"
                    >
                      <MessageCircle className="size-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>

                    <a
                      href={`/rastreo/${link.token}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all"
                    >
                      <ExternalLink className="size-3.5" />
                      <span>Ver Mapa</span>
                    </a>

                    {isActive && !isPermanent ? (
                      <button
                        onClick={() => extendMutation.mutate({ data: { token: link.token, hours: 4 } })}
                        disabled={extendMutation.isPending}
                        className="rounded-lg border border-border bg-background px-2.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        title="Extender 4 horas más"
                      >
                        +4h
                      </button>
                    ) : null}

                    {isActive ? (
                      <button
                        onClick={() => {
                          if (confirm(`¿Deseas revocar el enlace de "${link.unitName}" de inmediato?`)) {
                            revokeMutation.mutate({ data: { token: link.token } });
                          }
                        }}
                        disabled={revokeMutation.isPending}
                        className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-colors"
                      >
                        Revocar
                      </button>
                    ) : null}

                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar este enlace del registro?`)) {
                          deleteMutation.mutate({ data: { token: link.token } });
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg border border-red-500/20 p-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog: Create New Share Link */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg bg-card text-foreground border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Share2 className="size-5" />
              Compartir Unidad por Tiempo Limitado
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Genera un enlace público y temporal con ubicación en tiempo real para clientes o proveedores.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 mt-2">
            {formError ? (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{formError}</span>
              </div>
            ) : null}

            {/* Select Units (Multi-select dropdown) */}
            <div className="space-y-1.5 relative" ref={dropdownRef}>
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Selecciona la(s) Unidad(es) * {selectedUnitIds.length > 0 && `(${selectedUnitIds.length} seleccionadas)`}
              </label>

              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-xs cursor-pointer hover:border-primary"
              >
                <span className="truncate text-foreground font-medium">
                  {selectedUnitIds.length === 0
                    ? "-- Selecciona una o varias unidades --"
                    : selectedUnitIds.length === units.length
                    ? "Todas las unidades seleccionadas"
                    : selectedUnitIds
                        .map((id) => (id === "custom" ? "Personalizada" : units.find((u) => u.id === id)?.name))
                        .filter(Boolean)
                        .join(", ")}
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </div>

              {dropdownOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-lg border border-border bg-card p-2 shadow-2xl space-y-1">
                  <div
                    onClick={toggleSelectAll}
                    className="flex items-center gap-2 px-2 py-1.5 text-xs text-primary font-bold cursor-pointer hover:bg-muted rounded"
                  >
                    {selectedUnitIds.length === units.length ? <CheckSquare className="size-4" /> : <Square className="size-4" />}
                    <span>SELECCIONAR TODAS</span>
                  </div>
                  <hr className="border-border my-1" />
                  {units.map((u) => {
                    const isSelected = selectedUnitIds.includes(u.id);
                    return (
                      <div
                        key={u.id}
                        onClick={() => toggleUnitSelection(u.id)}
                        className={`flex items-center gap-2 px-2 py-1.5 text-xs rounded cursor-pointer transition ${
                          isSelected ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {isSelected ? <CheckSquare className="size-4 text-primary" /> : <Square className="size-4 text-muted-foreground" />}
                        <span>{u.name} {u.online ? "(En línea)" : "(Última conexión)"}</span>
                      </div>
                    );
                  })}
                  <hr className="border-border my-1" />
                  <div
                    onClick={() => toggleUnitSelection("custom")}
                    className={`flex items-center gap-2 px-2 py-1.5 text-xs rounded cursor-pointer transition ${
                      selectedUnitIds.includes("custom") ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {selectedUnitIds.includes("custom") ? <CheckSquare className="size-4 text-primary" /> : <Square className="size-4 text-muted-foreground" />}
                    <span>+ Nombre manual de unidad</span>
                  </div>
                </div>
              )}
            </div>

            {/* Custom unit name if selected */}
            {selectedUnitIds.includes("custom") ? (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Nombre o Placa del Vehículo Manual *
                </label>
                <input
                  type="text"
                  value={customUnitName}
                  onChange={(e) => setCustomUnitName(e.target.value)}
                  placeholder="Ej. Nissan NP300 - JHL492"
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            ) : null}

            {/* Duration Selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" />
                Vigencia del Enlace *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 mt-2">
                {PRESET_DURATIONS.map((preset) => {
                  const isSelected = durationHours === preset.hours;
                  const isPermanent = preset.hours >= 800000;
                  return (
                    <button
                      key={preset.hours}
                      type="button"
                      onClick={() => setDurationHours(preset.hours)}
                      className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs font-bold uppercase transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border text-muted-foreground hover:bg-muted"
                      } ${isPermanent ? "col-span-3 sm:col-span-1 bg-primary/5" : ""}`}
                    >
                      {isPermanent && <InfinityIcon className="size-3.5 text-primary" />}
                      <span>{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client / Destination info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-medium text-foreground">Nombre del Cliente / Destinatario</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Distribuidora López"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">WhatsApp / Teléfono (opcional)</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Ej. 3318359421"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-foreground">Motivo / Instrucciones de Monitoreo</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Entrega programada ruta Vallarta - Guadalajara"
                rows={2}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setCreateDialogOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || selectedUnitIds.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground shadow hover:opacity-90 disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    <span>Generando...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="size-3.5" />
                    <span>Crear y Obtener Enlace</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Success Result */}
      <Dialog open={successLinks.length > 0} onOpenChange={() => setSuccessLinks([])}>
        <DialogContent className="max-w-md bg-card text-foreground border-border text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-primary shadow-[0_0_25px_rgba(146,215,0,0.2)]">
            <Check className="size-7" />
          </div>

          <DialogTitle className="font-display text-xl font-bold uppercase tracking-wide text-foreground mt-3">
            ¡{successLinks.length > 1 ? `${successLinks.length} Enlaces Generados` : "Enlace Generado con Éxito"}!
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Los enlaces de rastreo temporal se encuentran activos y disponibles.
          </DialogDescription>

          <div className="space-y-3 mt-4 text-left max-h-60 overflow-y-auto p-1">
            {successLinks.map((link) => (
              <div key={link.id} className="rounded-xl border border-border/80 bg-background p-3 text-xs space-y-2">
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <Car className="size-3.5 text-primary" /> {link.unitName}
                </p>
                <p className="font-mono break-all text-primary select-all">
                  {typeof window !== "undefined" ? `${window.location.origin}/rastreo/${link.token}` : ""}
                </p>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => copyShareUrl(link.token)}
                    className="flex-1 flex items-center justify-center gap-1 rounded bg-primary py-1.5 px-2 font-display text-[11px] font-bold uppercase text-primary-foreground"
                  >
                    {copiedToken === link.token ? <Check className="size-3" /> : <Copy className="size-3" />}
                    <span>{copiedToken === link.token ? "Copiado" : "Copiar Enlace"}</span>
                  </button>

                  <a
                    href={getWhatsAppUrl(link.token, link.unitName, link.clientName, link.clientPhone)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 py-1.5 px-2 text-[11px] font-semibold uppercase"
                  >
                    <MessageCircle className="size-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
