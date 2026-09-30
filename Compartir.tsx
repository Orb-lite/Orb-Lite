import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Copy, Check, Clock, Mail, ShieldAlert, Send, Infinity as InfinityIcon } from "lucide-react";
import { WialonGuard } from "@/components/wialon-guard";
import { PlatformHeader } from "@/components/wialon/PlatformHeader";
import { wialonUnits } from "@/lib/wialon.functions";
import type { WialonSession } from "@/lib/wialon-session";

export const Route = createFileRoute("/wialon/compartir")({
  head: () => ({
    meta: [
      { title: "Compartir Ubicación | Plataforma ORB-LITE" },
      { name: "description", content: "Genera enlaces de rastreo público temporales o permanentes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <WialonGuard>{(session) => <CompartirView session={session} />}</WialonGuard>,
});

function CompartirView({ session }: { session: WialonSession }) {
  const fetchUnits = useServerFn(wialonUnits);

  const unitsQuery = useQuery({
    queryKey: ["wialon-units", session.sid],
    queryFn: () => fetchUnits({ data: { host: session.host, sid: session.sid } }),
  });
  const units = unitsQuery.data?.units ?? [];

  const [unitId, setUnitId] = React.useState<number | null>(null);
  const [email, setEmail] = React.useState("");
  const [duration, setDuration] = React.useState("never"); // "never" por defecto o en horas
  const [reference, setReference] = React.useState("");
  const [generatedUrl, setGeneratedUrl] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const selectedUnit = unitId ?? units[0]?.id ?? null;
  const isFormValid = Boolean(selectedUnit && email.trim() && duration);

  async function handleGenerateLink(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    setBusy(true);
    try {
      const token = crypto.randomUUID();
      // Si la vigencia es "never", pasamos exp=0 o omitimos la fecha límite
      const expiresAt = duration === "never" ? 0 : Date.now() + Number(duration) * 3600 * 1000;
      
      const publicLink = `${window.location.origin}/rastreo-publico?token=${token}&unit=${selectedUnit}${
        expiresAt > 0 ? `&exp=${expiresAt}` : "&perm=1"
      }`;

      setGeneratedUrl(publicLink);
    } catch (err) {
      console.error("Error al generar el enlace:", err);
    } finally {
      setBusy(false);
    }
  }

  function copyToClipboard() {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const inputClass =
    "mt-2 w-full rounded-md border border-input bg-background/80 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div className="space-y-6">
      <PlatformHeader session={session} />

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Banner informativo de seguridad */}
        <div className="grid gap-3 rounded-lg border border-border/80 bg-card/40 p-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-5 text-amber-400 shrink-0" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-foreground">Correo de Notificación <span className="text-destructive">*obligatorio</span></p>
              <p className="text-muted-foreground">Correo al que se notificarán paradas, aperturas de enlace y eventos clave.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            {duration === "never" ? (
              <InfinityIcon className="mt-0.5 size-5 text-primary shrink-0" />
            ) : (
              <Clock className="mt-0.5 size-5 text-emerald-400 shrink-0" />
            )}
            <div className="text-xs space-y-1">
              <p className="font-bold text-foreground">Vigencia del Enlace <span className="text-destructive">*obligatorio</span></p>
              <p className="text-muted-foreground">
                {duration === "never"
                  ? "El enlace permanente estará activo indefinidamente hasta que lo revoques manualmente."
                  : "Medida estricta de seguridad: el enlace expira tras cumplirse el tiempo elegido."}
              </p>
            </div>
          </div>
        </div>

        {/* Formulario de generación */}
        <form onSubmit={handleGenerateLink} className="space-y-4 rounded-lg border border-border/60 bg-card/20 p-6">
          <h2 className="font-display text-base font-bold uppercase tracking-wider text-primary">
            Formulario Generado para la API
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-muted-foreground">
              Nombre o placa de la unidad a compartir <span className="text-destructive">*</span>
              <select
                className={inputClass}
                value={selectedUnit ?? ""}
                onChange={(e) => setUnitId(Number(e.target.value))}
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-semibold text-muted-foreground">
              Correo del destinatario (notificaciones) <span className="text-destructive">*</span>
              <input
                type="email"
                placeholder="logistica@cliente.com"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="text-xs font-semibold text-muted-foreground">
              Vigencia del enlace <span className="text-destructive">*</span>
              <select
                className={inputClass}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="never">Sin expiración (Permanente)</option>
                <option value="1">1 hora</option>
                <option value="4">4 horas</option>
                <option value="12">12 horas</option>
                <option value="24">24 horas (1 día)</option>
                <option value="48">48 horas (2 días)</option>
                <option value="168">7 días</option>
              </select>
            </label>

            <label className="text-xs font-semibold text-muted-foreground">
              Referencia o nota para el cliente
              <input
                type="text"
                placeholder="Entrega de pedido #8491"
                className={inputClass}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || busy}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {!isFormValid ? (
              <>
                <ShieldAlert className="size-4" />
                Completa los datos obligatorios para mandar
              </>
            ) : busy ? (
              "Generando Enlace Seguro…"
            ) : (
              <>
                <Send className="size-4" />
                {duration === "never" ? "Generar Enlace Permanente" : "Generar y Enviar Enlace Temporal"}
              </>
            )}
          </button>
        </form>

        {/* Caja con el enlace generado */}
        {generatedUrl && (
          <div className="rounded-lg border border-primary/40 bg-primary/10 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Enlace Público Listo</span>
              <span className="text-xs text-muted-foreground">
                {duration === "never" ? "Sin fecha de expiración" : `Expira en ${duration} horas`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedUrl}
                className="w-full rounded border border-border/80 bg-background/90 px-3 py-2 text-xs font-mono text-foreground outline-none"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
