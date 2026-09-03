import { useRef, useState } from "react";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadConstanciaFiscal } from "@/lib/constancia.functions";
import type { ConstanciaFile } from "@/stores/cartStore";

const ALLOWED = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.readAsDataURL(file);
  });
}

export function ConstanciaUpload({
  value,
  rfc,
  onChange,
  error,
}: {
  value: ConstanciaFile | null;
  rfc?: string | undefined;
  onChange: (file: ConstanciaFile | null) => void;
  error?: string | undefined;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    if (!ALLOWED.includes(file.type)) {
      toast.error("Sube tu constancia en PDF, JPG, PNG o WEBP");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("El archivo supera 10 MB");
      return;
    }
    setLoading(true);
    try {
      const base64 = await toBase64(file);
      const result = await uploadConstanciaFiscal({
        data: {
          fileName: file.name.slice(0, 160),
          contentType: file.type as (typeof ALLOWED)[number],
          base64,
          ...(rfc ? { rfc } : {}),
        },
      });
      onChange({
        path: result.path,
        fileName: result.fileName,
        signedUrl: result.signedUrl,
      });
      toast.success("Constancia de situación fiscal recibida");
    } catch (err) {
      console.error("No se pudo subir la constancia", err);
      toast.error("No se pudo subir la constancia, intenta de nuevo");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2 rounded-lg border border-border/60 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Constancia de Situación Fiscal (obligatoria)
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/50 px-3 py-2 text-sm font-semibold text-primary disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : value ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {loading ? "Subiendo…" : value ? "Reemplazar archivo" : "Subir constancia (PDF o imagen)"}
      </button>
      {value && (
        <p className="truncate text-[11px] text-muted-foreground">Archivo: {value.fileName}</p>
      )}
      <p className="text-[11px] text-muted-foreground">
        Se guarda de forma privada y solo la usamos para emitir tu CFDI. Máximo 10 MB.
      </p>
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
