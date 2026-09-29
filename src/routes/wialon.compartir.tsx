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
  const [successLink, setSuccessLink] = React.useState<SharedUnitLink | null>(null);
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  // Form State
  const [selectedUnitId, setSelectedUnitId] = React.useState<number | "custom">("custom");
  const [customUnitName, setCustomUnitName] = React.useState("");
  const [durationHours, setDurationHours] = React.useState<number>(24);
  const [clientName, setClientName] = React.useState("");
  const [clientPhone, setClientPhone] = React.useState("");
  const [clientEmail, setClientEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);

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
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["unit-shares"] });
      setSuccessLink(res.link);
      setCreateDialogOpen(false);
      // Reset form
      setClientName("");
      setClientPhone("");
      setClientEmail("");
      setNotes("");
      setFormError(null);
    },
    onError: (err: any) => {
      setFormError(err.message || "Error al generar enlace.");
    },
  });

  const revokeMutation = useMutation({
    mutationFn: revokeShareFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unit-shares"] });
    },
  });

  const extendMutation = useMutation({
    mutationFn: extendShareFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unit-shares"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteShareFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unit-shares"] });
    },
  });

  // Calculate statistics
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
        (s.notes && s.notes.toLowerCase().includes(q)),
    );
  }, [shares, search]);

  function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    let unitName = customUnitName.trim();
    let imei: string | null = null;
    let initialPos: any = null;

    if (selectedUnitId !== "custom") {
      const found = units.find((u) => u.id === selectedUnitId);
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

    if (!unitName) {
      setFormError("Debes seleccionar una unidad o escribir su nombre.");
      return;
    }

    createMutation.mutate({
      data: {
        unitId: typeof selectedUnitId === "number" ? selectedUnitId : Math.floor(10000 + Math.random() * 90000),
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
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Enlaces Activos
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-primary">
              {activeCount}
            </p>
          </div>
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="size-5" />
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Enlaces Expirados / Revocados
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-muted-foreground">
              {expiredCount}
            </p>
          </div>
          <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Clock className="size-5" />
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Visualizaciones
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-cyan-400">
              {totalViews}
            </p>
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
                  {/* Left: Unit & Info */}
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
                        <strong className="text-foreground">Vigencia:</strong> {link.durationHours}h
                        (expira {new Date(link.expiresAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })})
                      </p>
                    </div>

                    {link.notes ? (
                      <p className="text-xs text-muted-foreground italic line-clamp-1">
                        &ldquo;{link.notes}&rdquo;
                      </p>
                    ) : null}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Copy Link Button */}
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

                    {/* WhatsApp Button */}
                    <a
                      href={getWhatsAppUrl(link.token, link.unitName, link.clientName, link.clientPhone)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 transition-colors"
                      title="Enviar por WhatsApp"
                    >
                      <MessageCircle className="size-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>

                    {/* Open Tracking Page */}
                    <a
                      href={`/rastreo/${link.token}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all"
                    >
                      <ExternalLink className="size-3.5" />
                      <span>Ver Mapa</span>
                    </a>

                    {/* Extend Duration */}
                    {isActive ? (
                      <button
                        onClick={() => extendMutation.mutate({ data: { token: link.token, hours: 4 } })}
                        disabled={extendMutation.isPending}
                        className="rounded-lg border border-border bg-background px-2.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        title="Extender 4 horas más"
                      >
                        +4h
                      </button>
                    ) : null}

                    {/* Revoke */}
                    {isActive ? (
                      <button
                        onClick={() => {
                          if (confirm(`¿Deseas revocar el enlace de "${link.unitName}" de inmediato?`)) {
                            revokeMutation.mutate({ data: { token: link.token } });
                          }
                        }}
                        disabled={revokeMutation.isPending}
                        className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-colors"
                        title="Revocar enlace ahora"
                      >
                        Revocar
                      </button>
                    ) : null}

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar este enlace del registro?`)) {
                          deleteMutation.mutate({ data: { token: link.token } });
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg border border-red-500/20 p-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Eliminar registro"
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

            {/* Select Unit */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Selecciona la Unidad *
              </label>
              <select
                value={selectedUnitId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedUnitId(val === "custom" ? "custom" : Number(val));
                }}
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {units.length > 0 ? (
                  <optgroup label="Unidades de tu cuenta">
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} {u.online ? "(En línea)" : "(Última conexión)"}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
                <option value="custom">+ Escribir nombre de unidad manualmente</option>
              </select>
            </div>

            {/* Custom unit name if selected */}
            {selectedUnitId === "custom" ? (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Nombre o Placa del Vehículo *
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
              <div className="grid grid-cols-4 gap-2 mt-2">
                {PRESET_DURATIONS.map((preset) => (
                  <button
                    key={preset.hours}
                    type="button"
                    onClick={() => setDurationHours(preset.hours)}
                    className={`rounded-lg border px-2 py-2 text-xs font-bold uppercase transition-all ${
                      durationHours === preset.hours
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Client / Destination info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-medium text-foreground">
                  Nombre del Cliente / Destinatario
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Distribuidora López"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">
                  WhatsApp / Teléfono (opcional)
                </label>
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
              <label className="text-xs font-medium text-foreground">
                Motivo / Instrucciones de Monitoreo
              </label>
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
                disabled={createMutation.isPending}
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

      {/* Dialog: Success Result with Direct Link */}
      <Dialog open={Boolean(successLink)} onOpenChange={() => setSuccessLink(null)}>
        <DialogContent className="max-w-md bg-card text-foreground border-border text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-primary shadow-[0_0_25px_rgba(146,215,0,0.2)]">
            <Check className="size-7" />
          </div>

          <DialogTitle className="font-display text-xl font-bold uppercase tracking-wide text-foreground mt-3">
            ¡Enlace Generado con Éxito!
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground mt-1">
            El enlace temporal de rastreo para <strong>{successLink?.unitName}</strong> ya está activo y disponible.
          </DialogDescription>

          {successLink ? (
            <div className="space-y-4 mt-4 text-left">
              <div className="rounded-xl border border-border/80 bg-background p-3 text-xs">
                <p className="font-mono break-all text-primary select-all">
                  {typeof window !== "undefined" ? `${window.location.origin}/rastreo/${successLink.token}` : ""}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <p>
                  <strong>Vigencia:</strong> {successLink.durationHours} horas
                </p>
                <p>
                  <strong>Expira:</strong>{" "}
                  {new Date(successLink.expiresAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => copyShareUrl(successLink.token)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 px-3 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground shadow hover:opacity-90"
                >
                  {copiedToken === successLink.token ? (
                    <>
                      <Check className="size-4" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      <span>Copiar Enlace</span>
                    </>
                  )}
                </button>

                <a
                  href={getWhatsAppUrl(successLink.token, successLink.unitName, successLink.clientName, successLink.clientPhone)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 py-2.5 px-3 text-xs font-semibold uppercase tracking-wider text-emerald-300"
                >
                  <MessageCircle className="size-4" />
                  <span>Mandar por WhatsApp</span>
                </a>
              </div>

              <a
                href={`/rastreo/${successLink.token}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 text-xs text-cyan-400 hover:underline pt-1"
              >
                <span>Probar y abrir vista de cliente</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
