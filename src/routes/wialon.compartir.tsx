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
  Layers,
  Infinity as InfinityIcon,
  CheckSquare,
  Square,
  Users,
} from "lucide-react";
import { WialonGuard } from "@/components/wialon-guard";
import { type WialonSession } from "@/lib/wialon-session";
import { wialonUnits } from "@/lib/wialon.functions";
import { fetchReliableUnits } from "@/lib/wialon-client-api";
import {
  createUnitShare,
  listUnitShares,
  revokeUnitShare,
  extendUnitShare,
  deleteUnitShare,
  type SharedUnitLink,
} from "@/lib/unit-share.functions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/wialon/compartir")({
  head: () => ({
    meta: [
      { title: "Enlaces de Rastreo Compartido | ORB-LITE" },
      {
        name: "description",
        content:
          "Comparte temporalmente o de forma permanente la ubicación en tiempo real de una o múltiples unidades satelitales.",
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
  { label: "1 hora", hours: 1, isUnlimited: false },
  { label: "2 horas", hours: 2, isUnlimited: false },
  { label: "4 horas", hours: 4, isUnlimited: false },
  { label: "8 horas", hours: 8, isUnlimited: false },
  { label: "12 horas", hours: 12, isUnlimited: false },
  { label: "24 horas", hours: 24, isUnlimited: false },
  { label: "48 horas", hours: 48, isUnlimited: false },
  { label: "72 horas", hours: 72, isUnlimited: false },
  { label: "♾️ Sin Límite", hours: 0, isUnlimited: true },
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
  const [shareMode, setShareMode] = React.useState<"single" | "multi">("single");
  const [selectedUnitId, setSelectedUnitId] = React.useState<number | "custom">("custom");
  const [selectedMultiUnitIds, setSelectedMultiUnitIds] = React.useState<number[]>([]);
  const [multiUnitFilter, setMultiUnitFilter] = React.useState("");
  const [customUnitName, setCustomUnitName] = React.useState("");
  const [durationHours, setDurationHours] = React.useState<number>(24);
  const [isUnlimited, setIsUnlimited] = React.useState<boolean>(false);
  const [clientName, setClientName] = React.useState("");
  const [clientPhone, setClientPhone] = React.useState("");
  const [clientEmail, setClientEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);

  // Queries
  const unitsQuery = useQuery({
    queryKey: ["wialon-units", session.sid, session.host],
    queryFn: () => fetchReliableUnits({ session, fetchUnitsServerFn: fetchUnits }),
    staleTime: 30000,
  });

  const units = unitsQuery.data?.units ?? [];

  const sharesQuery = useQuery({
    queryKey: ["unit-shares", session.userId, session.host],
    queryFn: () =>
      fetchShares({
        data: {
          host: session.host,
          sid: session.sid,
          userId: session.userId,
        },
      }),
    refetchInterval: 15000,
  });

  React.useEffect(() => {
    if (units.length > 0 && selectedUnitId === "custom") {
      setSelectedUnitId(units[0]!.id);
    }
  }, [units, selectedUnitId]);
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
      setSelectedMultiUnitIds([]);
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
  const now = Date.now();
  const activeCount = shares.filter((s) => {
    const isUnlim = Boolean(s.isUnlimited || s.durationHours === 0);
    return s.status === "active" && (isUnlim || new Date(s.expiresAt).getTime() > now);
  }).length;
  const expiredCount = shares.filter((s) => {
    const isUnlim = Boolean(s.isUnlimited || s.durationHours === 0);
    return s.status !== "active" || (!isUnlim && new Date(s.expiresAt).getTime() <= now);
  }).length;
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

  const filteredModalUnits = React.useMemo(() => {
    const q = multiUnitFilter.toLowerCase().trim();
    if (!q) return units;
    return units.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.imei && u.imei.toLowerCase().includes(q)) ||
        String(u.id).includes(q),
    );
  }, [units, multiUnitFilter]);

  function handleToggleMultiUnit(id: number) {
    setSelectedMultiUnitIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function handleSelectAllMultiUnits() {
    setSelectedMultiUnitIds(units.map((u) => u.id));
  }

  function handleDeselectAllMultiUnits() {
    setSelectedMultiUnitIds([]);
  }

  function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const tokenFromStorage =
      typeof window !== "undefined" ? localStorage.getItem("wialon_token") : null;

    if (shareMode === "multi") {
      if (selectedMultiUnitIds.length === 0) {
        setFormError("Debes seleccionar al menos una unidad para compartir la flota.");
        return;
      }

      const selectedUnitsData = selectedMultiUnitIds.map((id) => {
        const found = units.find((u) => u.id === id);
        return {
          unitId: id,
          unitName: found?.name || `Unidad ${id}`,
          imei: found?.imei || null,
          initialPosition:
            found?.lat && found?.lon
              ? {
                  lat: found.lat,
                  lon: found.lon,
                  speed: found.speed ?? 0,
                  course: found.course ?? 0,
                  time: found.lastMessage ?? Math.floor(Date.now() / 1000),
                }
              : null,
        };
      });

      const firstUnit = selectedUnitsData[0];
      if (!firstUnit) return;
      const summaryName =
        selectedUnitsData.length > 1
          ? `${selectedUnitsData.length} Unidades: ${selectedUnitsData
              .map((u) => u.unitName)
              .slice(0, 2)
              .join(", ")}${selectedUnitsData.length > 2 ? "..." : ""}`
          : firstUnit.unitName;

      createMutation.mutate({
        data: {
          unitId: firstUnit.unitId,
          unitName: summaryName,
          imei: firstUnit.imei,
          units: selectedUnitsData,
          clientName: clientName.trim() || null,
          clientPhone: clientPhone.trim() || null,
          clientEmail: clientEmail.trim() || null,
          notes: notes.trim() || null,
          createdByUserId: session.userId,
          createdByUsername: session.userName,
          durationHours: isUnlimited ? 0 : durationHours,
          isUnlimited,
          host: session.host,
          sid: session.sid,
          wialonToken: tokenFromStorage,
          initialPosition: firstUnit.initialPosition,
        },
      });
      return;
    }

    // Modo Individual
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

    const singleId =
      typeof selectedUnitId === "number"
        ? selectedUnitId
        : Math.floor(10000 + Math.random() * 90000);

    createMutation.mutate({
      data: {
        unitId: singleId,
        unitName,
        imei,
        units: [
          {
            unitId: singleId,
            unitName,
            imei,
            initialPosition: initialPos,
          },
        ],
        clientName: clientName.trim() || null,
        clientPhone: clientPhone.trim() || null,
        clientEmail: clientEmail.trim() || null,
        notes: notes.trim() || null,
        createdByUserId: session.userId,
        createdByUsername: session.userName,
        durationHours: isUnlimited ? 0 : durationHours,
        isUnlimited,
        host: session.host,
        sid: session.sid,
        wialonToken: tokenFromStorage,
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

  function getWhatsAppUrl(
    token: string,
    unitName: string,
    clientName?: string | null,
    clientPhone?: string | null,
  ) {
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
            Rastreo Compartido (Individual o Flota)
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Genera enlaces seguros temporales o permanentes con mapa en tiempo real para clientes o
            supervisores sin compartir tus credenciales.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            if (units[0] && selectedUnitId === "custom") {
              setSelectedUnitId(units[0].id);
            }
            setCreateDialogOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-lg hover:opacity-90 transition-all active:scale-95 shrink-0"
        >
          <Plus className="size-4" />
          <span>Compartir Unidad / Flota</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Enlaces Activos
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-primary">{activeCount}</p>
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
          <RefreshCw
            className={`size-3.5 ${sharesQuery.isFetching ? "animate-spin text-primary" : ""}`}
          />
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
              : "Genera un enlace para que tus clientes o supervisores puedan ver la unidad o flota en vivo en el mapa."}
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
            const isUnlim = Boolean(link.isUnlimited || link.durationHours === 0);
            const isExpired =
              !isUnlim && (link.status === "expired" || new Date(link.expiresAt).getTime() <= now);
            const isRevoked = link.status === "revoked";
            const isActive = link.status === "active" && !isExpired && !isRevoked;
            const isMulti = link.units && link.units.length > 1;

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
                        {isMulti ? (
                          <Layers className="size-4 text-cyan-400" />
                        ) : (
                          <Car className="size-4 text-primary" />
                        )}
                        {link.unitName}
                      </span>

                      {isMulti ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                          <Layers className="size-3" />
                          Flota ({link.units?.length} unidades)
                        </span>
                      ) : null}

                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Activo en Vivo
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

                      {isUnlim ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                          <InfinityIcon className="size-3" />
                          Sin Límite
                        </span>
                      ) : null}

                      {link.createdByUsername && link.createdByUserId !== session.userId ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          <Users className="size-3" />
                          Subcuenta: {link.createdByUsername}
                        </span>
                      ) : null}

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
                        {isUnlim ? (
                          <span className="text-emerald-400 font-semibold flex-inline items-center gap-1">
                            Permanente (Sin límite de tiempo)
                          </span>
                        ) : (
                          `${link.durationHours}h (expira ${new Date(link.expiresAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })})`
                        )}
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
                      href={getWhatsAppUrl(
                        link.token,
                        link.unitName,
                        link.clientName,
                        link.clientPhone,
                      )}
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

                    {/* Extend Duration (only if not unlimited) */}
                    {isActive && !isUnlim ? (
                      <button
                        onClick={() =>
                          extendMutation.mutate({ data: { token: link.token, hours: 4 } })
                        }
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
                          if (
                            confirm(`¿Deseas revocar el enlace de "${link.unitName}" de inmediato?`)
                          ) {
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
                        if (confirm(`¿Eliminar este registro de enlace compartido?`)) {
                          deleteMutation.mutate({ data: { token: link.token } });
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg border border-border bg-background p-2 text-muted-foreground hover:text-destructive transition-colors"
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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card text-foreground border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Share2 className="size-5" />
              Compartir Ubicación Satelital en Vivo
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Genera un enlace público en tiempo real para clientes o proveedores. Puedes compartir
              una unidad o una flota completa.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 mt-2">
            {formError ? (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{formError}</span>
              </div>
            ) : null}

            {/* Mode Switcher: Single vs Multi Unit */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5 block">
                Modalidad de Compartición *
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/60 border border-border">
                <button
                  type="button"
                  onClick={() => setShareMode("single")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all ${
                    shareMode === "single"
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Car className="size-4" />
                  <span>Unidad Individual</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShareMode("multi");
                    if (selectedMultiUnitIds.length === 0 && units.length > 0) {
                      if (typeof selectedUnitId === "number") {
                        setSelectedMultiUnitIds([selectedUnitId]);
                      } else {
                        setSelectedMultiUnitIds(units.slice(0, 3).map((u) => u.id));
                      }
                    }
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all ${
                    shareMode === "multi"
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Layers className="size-4" />
                  <span>Multi-Unidad (Flota)</span>
                  {selectedMultiUnitIds.length > 0 ? (
                    <span className="rounded-full bg-primary-foreground/20 px-1.5 py-0.5 text-[10px]">
                      {selectedMultiUnitIds.length}
                    </span>
                  ) : null}
                </button>
              </div>
            </div>

            {/* Single Unit Selector */}
            {shareMode === "single" ? (
              <div className="space-y-3">
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
                            {u.name} {u.online ? "(En línea 🟢)" : "(Última conexión)"}
                          </option>
                        ))}
                      </optgroup>
                    ) : null}
                    <option value="custom">+ Escribir nombre de unidad manualmente</option>
                  </select>
                </div>

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
              </div>
            ) : (
              /* Multi Unit Selector */
              <div className="space-y-2.5 rounded-xl border border-border/80 bg-background/50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Layers className="size-3.5" />
                    Seleccionar Unidades de la Flota ({selectedMultiUnitIds.length} seleccionadas)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllMultiUnits}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      Todas ({units.length})
                    </button>
                    <span className="text-border">|</span>
                    <button
                      type="button"
                      onClick={handleDeselectAllMultiUnits}
                      className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>

                {/* Filter inside modal */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={multiUnitFilter}
                    onChange={(e) => setMultiUnitFilter(e.target.value)}
                    placeholder="Filtrar unidades por nombre o IMEI..."
                    className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Checkbox list */}
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 border border-border/60 rounded-lg p-2 bg-card/60">
                  {filteredModalUnits.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No se encontraron unidades en tu cuenta.
                    </p>
                  ) : (
                    filteredModalUnits.map((u) => {
                      const isChecked = selectedMultiUnitIds.includes(u.id);
                      return (
                        <div
                          key={u.id}
                          onClick={() => handleToggleMultiUnit(u.id)}
                          className={`flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-xs cursor-pointer transition-all border ${
                            isChecked
                              ? "bg-cyan-500/10 border-cyan-500/40 text-foreground"
                              : "bg-background/80 border-border/60 text-muted-foreground hover:border-border"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isChecked ? (
                              <CheckSquare className="size-4 text-cyan-400 shrink-0" />
                            ) : (
                              <Square className="size-4 text-muted-foreground shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-xs truncate text-foreground flex items-center gap-1.5">
                                <span
                                  className={`size-2 rounded-full shrink-0 ${
                                    u.online ? "bg-emerald-400" : "bg-slate-500"
                                  }`}
                                />
                                {u.name}
                              </p>
                              {u.imei ? (
                                <p className="text-[10px] text-muted-foreground font-mono">
                                  IMEI: {u.imei}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="text-right text-[10px] shrink-0 font-mono text-muted-foreground">
                            {u.speed ? `${Math.round(u.speed)} km/h` : "Detenido"}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Duration Selector with "Sin límite" */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5 text-primary" />
                  Vigencia del Enlace *
                </label>
                {isUnlimited ? (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <InfinityIcon className="size-3.5" />
                    Sin límite (Permanente)
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-cyan-400 font-mono">
                    {durationHours} horas
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {PRESET_DURATIONS.map((preset) => {
                  const isSelected = preset.isUnlimited
                    ? isUnlimited
                    : !isUnlimited && durationHours === preset.hours;

                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setIsUnlimited(preset.isUnlimited);
                        if (!preset.isUnlimited) {
                          setDurationHours(preset.hours);
                        }
                      }}
                      className={`rounded-lg border px-2 py-2 text-xs font-bold uppercase transition-all ${
                        isSelected
                          ? preset.isUnlimited
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                            : "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Toggle switch for unlimited */}
              <div
                onClick={() => setIsUnlimited((prev) => !prev)}
                className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                  isUnlimited
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                    : "bg-background border-border text-muted-foreground hover:border-border/80"
                }`}
              >
                <div className="flex items-center gap-2">
                  <InfinityIcon
                    className={`size-4 ${isUnlimited ? "text-emerald-400" : "text-muted-foreground"}`}
                  />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Acceso Permanente (Sin caducidad automática)
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      El enlace se mantendrá activo hasta que lo revoques manualmente.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isUnlimited}
                  onChange={(e) => setIsUnlimited(e.target.checked)}
                  className="rounded border-border text-emerald-500 focus:ring-emerald-500"
                />
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
                placeholder="Ej. Seguimiento de entrega con ruta Vallarta - Guadalajara"
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
            El enlace de rastreo en tiempo real para <strong>{successLink?.unitName}</strong> ya
            está activo y disponible.
          </DialogDescription>

          {successLink ? (
            <div className="space-y-4 mt-4 text-left">
              <div className="rounded-xl border border-border/80 bg-background p-3 text-xs">
                <p className="font-mono break-all text-primary select-all">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/rastreo/${successLink.token}`
                    : ""}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <p>
                  <strong>Vigencia:</strong>{" "}
                  {successLink.isUnlimited || successLink.durationHours === 0 ? (
                    <span className="text-emerald-400 font-semibold">Permanente</span>
                  ) : (
                    `${successLink.durationHours} horas`
                  )}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {successLink.isUnlimited || successLink.durationHours === 0 ? (
                    <span className="text-emerald-400">Sin caducidad</span>
                  ) : (
                    `Expira ${new Date(successLink.expiresAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`
                  )}
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
                  href={getWhatsAppUrl(
                    successLink.token,
                    successLink.unitName,
                    successLink.clientName,
                    successLink.clientPhone,
                  )}
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
