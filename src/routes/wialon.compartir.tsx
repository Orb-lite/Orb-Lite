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
  Eye,
  Trash2,
  MessageCircle,
  RefreshCw,
  Search,
  AlertCircle,
  Infinity as InfinityIcon,
  CheckSquare,
  Square,
  ChevronDown,
  Layers,
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
        content: "Comparte temporalmente la ubicación en tiempo real de múltiples unidades satelitales.",
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
  { label: "Sin Límite", hours: 720 }, // 30 días límite según backend
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
  const [createdLink, setCreatedLink] = React.useState<SharedUnitLink | null>(null);
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  const [selectedUnitIds, setSelectedUnitIds] = React.useState<number[]>([]);
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

  const createMutation = useMutation({ mutationFn: createShareFn });
  const revokeMutation = useMutation({
    mutationFn: revokeShareFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["unit-shares"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteShareFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["unit-shares"] }),
  });

  const toggleUnitSelection = (id: number) => {
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
      setFormError("Debes seleccionar al menos una unidad.");
      return;
    }

    try {
      const selectedUnitsData = selectedUnitIds
        .map((id) => {
          const found: any = units.find((u) => u.id === id);
          if (!found) return null;

          const lat = found.lat ?? found.pos?.y ?? found.position?.lat ?? null;
          const lon = found.lon ?? found.pos?.x ?? found.position?.lon ?? null;
          const speed = found.speed ?? found.pos?.s ?? found.position?.speed ?? 0;
          const course = found.course ?? found.pos?.c ?? found.position?.course ?? 0;
          const time = found.lastMessage ?? found.pos?.t ?? found.position?.time ?? Math.floor(Date.now() / 1000);

          return {
            unitId: found.id,
            unitName: found.name,
            imei: found.imei ?? null,
            initialPosition: (lat !== null && lon !== null) ? {
              lat: Number(lat),
              lon: Number(lon),
              speed: Number(speed),
              course: Number(course),
              time: Number(time),
            } : null,
          };
        })
        .filter(Boolean);

      const compositeUnitName = selectedUnitsData.map((u) => u?.unitName).join(", ");
      const primaryUnit = selectedUnitsData[0];

      const res = await createMutation.mutateAsync({
        data: {
          unitId: primaryUnit?.unitId ?? 0,
          unitName: compositeUnitName,
          unitIds: selectedUnitIds,
          unitsData: selectedUnitsData,
          imei: primaryUnit?.imei ?? null,
          clientName: clientName.trim() || null,
          clientPhone: clientPhone.trim() || null,
          clientEmail: clientEmail.trim() || null,
          notes: notes.trim() || null,
          durationHours,
          host: session.host,
          sid: session.sid,
          initialPosition: primaryUnit?.initialPosition ?? null,
        },
      });

      if (res?.link) {
        queryClient.invalidateQueries({ queryKey: ["unit-shares"] });
        setCreatedLink(res.link);
        setCreateDialogOpen(false);

        setSelectedUnitIds([]);
        setClientName("");
        setClientPhone("");
        setClientEmail("");
        setNotes("");
      }
    } catch (err: any) {
      setFormError(err.message || "Error al generar el enlace compartido.");
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
    const msg = `${greeting}te comparto el enlace multi-mapa para seguir tus unidades (*${unitName}*):\n\n${url}`;
    const cleanPhone = clientPhone ? clientPhone.replace(/\D/g, "") : "";
    if (cleanPhone) {
      return `https://api.whatsapp.com/send?phone=${cleanPhone.length === 10 ? `52${cleanPhone}` : cleanPhone}&text=${encodeURIComponent(msg)}`;
    }
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide flex items-center gap-2.5 text-foreground">
            <Share2 className="size-6 text-primary" />
            Rastreo Multi-Mapa Compartido
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Genera un único enlace que muestra cada unidad seleccionada en su propio mapa independiente o pestaña.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setCreateDialogOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-lg hover:opacity-90 transition-all shrink-0"
        >
          <Plus className="size-4" />
          <span>Nuevo Enlace Compartido</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Enlaces Activos</p>
            <p className="mt-1 font-mono text-2xl font-bold text-primary">{activeCount}</p>
          </div>
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Layers className="size-5" />
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Expirados / Revocados</p>
            <p className="mt-1 font-mono text-2xl font-bold text-muted-foreground">{expiredCount}</p>
          </div>
          <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Clock className="size-5" />
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Visualizaciones</p>
            <p className="mt-1 font-mono text-2xl font-bold text-cyan-400">{totalViews}</p>
          </div>
          <div className="size-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <Eye className="size-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por unidades o cliente..."
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["unit-shares"] })}
          disabled={sharesQuery.isFetching}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`size-3.5 ${sharesQuery.isFetching ? "animate-spin text-primary" : ""}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {sharesQuery.isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border/60 bg-card/40 p-8">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filteredShares.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
          <Share2 className="mx-auto size-12 text-muted-foreground/60" />
          <h3 className="mt-4 font-display text-base font-bold uppercase tracking-wider text-foreground">
            Sin enlaces registrados
          </h3>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredShares.map((link) => {
            const isExpired = link.status === "expired" || new Date(link.expiresAt).getTime() <= Date.now();
            const isActive = link.status === "active" && !isExpired;

            return (
              <div
                key={link.id}
                className={`rounded-xl border transition-all p-5 bg-card/90 shadow-sm ${
                  isActive ? "border-primary/40 hover:border-primary" : "border-border/60 opacity-80"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-display text-base font-bold text-foreground flex items-center gap-2">
                        <Car className="size-4 text-primary" />
                        {link.unitName}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {link.clientName && <p><strong className="text-foreground">Cliente:</strong> {link.clientName}</p>}
                      {link.clientPhone && <p><strong className="text-foreground">Tel:</strong> {link.clientPhone}</p>}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyShareUrl(link.token)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold uppercase text-foreground hover:border-primary"
                    >
                      {copiedToken === link.token ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
                      <span>{copiedToken === link.token ? "Copiado" : "Copiar Enlace"}</span>
                    </button>

                    <a
                      href={getWhatsAppUrl(link.token, link.unitName, link.clientName, link.clientPhone)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold uppercase text-emerald-300"
                    >
                      <MessageCircle className="size-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`/rastreo/${link.token}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-2 text-xs font-semibold uppercase text-white"
                    >
                      <ExternalLink className="size-3.5" />
                      <span>Abrir Multi-Mapa</span>
                    </a>

                    {isActive && (
                      <button
                        onClick={() => {
                          if (confirm(`¿Deseas revocar el enlace?`)) revokeMutation.mutate({ data: { token: link.token } });
                        }}
                        className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 text-xs text-amber-400"
                      >
                        Revocar
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar enlace?`)) deleteMutation.mutate({ data: { token: link.token } });
                      }}
                      className="rounded-lg border border-red-500/20 p-2 text-xs text-red-400"
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

      {/* Modal Formulario */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg bg-card text-foreground border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold uppercase text-primary flex items-center gap-2">
              <Share2 className="size-5" />
              Crear Enlace Multi-Mapa
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Las unidades seleccionadas se compartirán mediante 1 solo enlace con un selector de mapas individual.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 mt-2">
            {formError && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-1.5 relative" ref={dropdownRef}>
              <label className="text-xs font-semibold uppercase text-foreground">
                SELECCIONA LA(S) UNIDAD(ES) * {selectedUnitIds.length > 0 && `(${selectedUnitIds.length} SELECCIONADAS)`}
              </label>

              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-xs cursor-pointer hover:border-primary"
              >
                <span className="truncate text-foreground font-medium">
                  {selectedUnitIds.length === 0
                    ? "-- Selecciona las unidades --"
                    : selectedUnitIds.length === units.length
                    ? "Todas las unidades seleccionadas"
                    : selectedUnitIds.map((id) => units.find((u) => u.id === id)?.name).filter(Boolean).join(", ")}
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
                        className={`flex items-center gap-2 px-2 py-1.5 text-xs rounded cursor-pointer ${
                          isSelected ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {isSelected ? <CheckSquare className="size-4 text-primary" /> : <Square className="size-4 text-muted-foreground" />}
                        <span>{u.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-foreground flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" />
                VIGENCIA DEL ENLACE *
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {PRESET_DURATIONS.map((preset) => (
                  <button
                    key={preset.hours}
                    type="button"
                    onClick={() => setDurationHours(preset.hours)}
                    className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs font-bold uppercase ${
                      durationHours === preset.hours ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                    }`}
                  >
                    {preset.hours >= 720 && <InfinityIcon className="size-3.5 text-primary" />}
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-medium text-foreground">Nombre del Destinatario</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Mamá"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Teléfono</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="3310201931"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Notas</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Instrucciones o motivo de viaje..."
                rows={2}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setCreateDialogOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-semibold uppercase text-muted-foreground"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || selectedUnitIds.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-bold uppercase text-primary-foreground"
              >
                {createMutation.isPending ? <RefreshCw className="size-3.5 animate-spin" /> : <Share2 className="size-3.5" />}
                <span>Crear Enlace Unificado</span>
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Resultado */}
      <Dialog open={!!createdLink} onOpenChange={() => setCreatedLink(null)}>
        <DialogContent className="max-w-md bg-card text-foreground border-border text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-primary">
            <Check className="size-7" />
          </div>

          <DialogTitle className="font-display text-xl font-bold uppercase mt-3">
            ¡Enlace Listo!
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Se generó 1 enlace que incluye mapas separados para todas las unidades seleccionadas.
          </DialogDescription>

          {createdLink && (
            <div className="rounded-xl border border-border/80 bg-background p-4 text-xs space-y-3 mt-3 text-left">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <Car className="size-4 text-primary" /> {createdLink.unitName}
              </p>
              <p className="font-mono text-primary select-all break-all bg-card p-2 rounded border border-border">
                {typeof window !== "undefined" ? `${window.location.origin}/rastreo/${createdLink.token}` : ""}
              </p>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => copyShareUrl(createdLink.token)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded bg-primary py-2 px-3 text-xs font-bold uppercase text-primary-foreground"
                >
                  {copiedToken === createdLink.token ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  <span>{copiedToken === createdLink.token ? "¡Copiado!" : "Copiar Enlace"}</span>
                </button>

                <a
                  href={getWhatsAppUrl(createdLink.token, createdLink.unitName, createdLink.clientName, createdLink.clientPhone)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 py-2 px-3 text-xs font-semibold uppercase"
                >
                  <MessageCircle className="size-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
