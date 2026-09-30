import * as React from "react";
import { Share2, Clock, Check, Copy, X, CheckSquare, Square, Infinity as InfinityIcon } from "lucide-react";

interface Unit {
  id: number;
  name: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: Unit[];
}

const DURATIONS = [
  { label: "1 HORA", value: "1" },
  { label: "2 HORAS", value: "2" },
  { label: "4 HORAS", value: "4" },
  { label: "8 HORAS", value: "8" },
  { label: "12 HORAS", value: "12" },
  { label: "24 HORAS", value: "24" },
  { label: "48 HORAS", value: "48" },
  { label: "72 HORAS", value: "72" },
  { label: "SIN LÍMITE", value: "never" }, // Opción permanente agregada
];

export function ShareModal({ isOpen, onClose, units }: ShareModalProps) {
  const [selectedUnits, setSelectedUnits] = React.useState<number[]>([]);
  const [duration, setDuration] = React.useState("24");
  const [clientName, setClientName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [instructions, setInstructions] = React.useState("");
  
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [generatedUrl, setGeneratedUrl] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const toggleUnit = (id: number) => {
    setSelectedUnits((prev) =>
      prev.includes(id) ? prev.filter((uId) => uId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUnits.length === units.length) {
      setSelectedUnits([]);
    } else {
      setSelectedUnits(units.map((u) => u.id));
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUnits.length === 0) return;

    const token = crypto.randomUUID();
    const expiresAt = duration === "never" ? 0 : Date.now() + Number(duration) * 3600 * 1000;
    const unitsParam = selectedUnits.join(",");

    const publicLink = `${window.location.origin}/rastreo-publico?token=${token}&units=${unitsParam}${
      expiresAt > 0 ? `&exp=${expiresAt}` : "&perm=1"
    }`;

    setGeneratedUrl(publicLink);
  };

  const copyToClipboard = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-xl border border-slate-700/60 bg-[#0b1329] p-6 text-slate-100 shadow-2xl">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-2.5 mb-1">
          <Share2 className="size-6 text-[#a3e635]" />
          <h2 className="font-display text-lg font-bold tracking-wide text-[#a3e635] uppercase">
            Compartir Unidad Por Tiempo Limitado
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Genera un enlace público y temporal con ubicación en tiempo real para clientes o proveedores.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          
          {/* Seleccionar Unidades (Multi-selección) */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              SELECCIONA LAS UNIDADES * ({selectedUnits.length} seleccionada{selectedUnits.length !== 1 ? "s" : ""})
            </label>
            
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between w-full rounded-lg border border-slate-700 bg-[#111a36] px-3.5 py-2.5 text-xs cursor-pointer hover:border-slate-500"
            >
              <span className="truncate text-slate-200 font-medium">
                {selectedUnits.length === 0
                  ? "Seleccionar unidades..."
                  : selectedUnits.length === units.length
                  ? "Todas las unidades seleccionadas"
                  : units
                      .filter((u) => selectedUnits.includes(u.id))
                      .map((u) => u.name)
                      .join(", ")}
              </span>
              <span className="text-slate-400 text-[10px]">▼</span>
            </div>

            {/* Menú desplegable con Checkboxes */}
            {dropdownOpen && (
              <div className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-700 bg-[#111a36] p-2 shadow-xl space-y-1">
                <div
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#a3e635] font-bold cursor-pointer hover:bg-slate-800/60 rounded"
                >
                  {selectedUnits.length === units.length ? <CheckSquare className="size-4" /> : <Square className="size-4" />}
                  <span>SELECCIONAR TODAS</span>
                </div>
                <hr className="border-slate-700/60 my-1" />
                {units.map((u) => {
                  const isSelected = selectedUnits.includes(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() => toggleUnit(u.id)}
                      className={`flex items-center gap-2 px-2 py-1.5 text-xs rounded cursor-pointer transition ${
                        isSelected ? "bg-[#a3e635]/10 text-[#a3e635] font-semibold" : "text-slate-300 hover:bg-slate-800/40"
                      }`}
                    >
                      {isSelected ? <CheckSquare className="size-4 text-[#a3e635]" /> : <Square className="size-4 text-slate-500" />}
                      <span>{u.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Vigencia del Enlace */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
              <Clock className="size-3.5 text-[#a3e635]" />
              VIGENCIA DEL ENLACE *
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {DURATIONS.map((item) => {
                const isActive = duration === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setDuration(item.value)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all border ${
                      isActive
                        ? "border-[#a3e635] bg-[#a3e635]/10 text-[#a3e635] shadow-[0_0_12px_rgba(163,230,53,0.15)]"
                        : "border-slate-700/80 bg-[#111a36]/60 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    {item.value === "never" && <InfinityIcon className="size-3.5" />}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cliente / WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Nombre del Cliente / Destinatario</label>
              <input
                type="text"
                placeholder="Ej. Distribuidora López"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111a36] px-3 py-2 text-xs text-slate-100 outline-none focus:border-[#a3e635]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">WhatsApp / Teléfono (opcional)</label>
              <input
                type="text"
                placeholder="Ej. 3318359421"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111a36] px-3 py-2 text-xs text-slate-100 outline-none focus:border-[#a3e635]"
              />
            </div>
          </div>

          {/* Motivo */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Motivo / Instrucciones de Monitoreo</label>
            <textarea
              rows={2}
              placeholder="Ej. Entrega programada ruta Vallarta - Guadalajara"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#111a36] px-3 py-2 text-xs text-slate-100 outline-none focus:border-[#a3e635] resize-none"
            />
          </div>

          {/* Enlace generado */}
          {generatedUrl && (
            <div className="rounded-lg border border-[#a3e635]/40 bg-[#a3e635]/10 p-3 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#a3e635]">Enlace Encriptado Generado</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedUrl}
                  className="w-full rounded border border-slate-700 bg-[#0b1329] px-2.5 py-1.5 text-xs text-slate-200 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1 rounded bg-[#a3e635] px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-[#8cee25]"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={selectedUnits.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-[#a3e635] px-5 py-2 text-xs font-bold text-slate-950 hover:bg-[#8cee25] transition disabled:opacity-50"
            >
              <Share2 className="size-3.5" />
              CREAR Y OBTENER ENLACE
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
