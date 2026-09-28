import { useRef, useState, type RefObject } from "react";
import { Download, FileImage, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ExportFormat = "png" | "pdf";

interface ExportButtonProps {
  /** Ref al elemento que se va a capturar (el lienzo del editor visual). */
  targetRef: RefObject<HTMLElement | null>;
  /** Nombre base del archivo descargado (sin extensión). */
  fileName?: string;
  /** Factor de escala de captura; mayor = más nitidez. Por defecto 2. */
  scale?: number;
  className?: string;
}

async function captureElement(
  el: HTMLElement,
  scale: number,
): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import("html2canvas");
  return html2canvas(el, {
    scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    logging: false,
  });
}

export function ExportButton({
  targetRef,
  fileName = "flyer",
  scale = 2,
  className,
}: ExportButtonProps) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const busyRef = useRef(false);

  const handleExport = async (format: ExportFormat) => {
    const el = targetRef.current;
    if (!el || busyRef.current) return;
    busyRef.current = true;
    setExporting(format);
    try {
      const canvas = await captureElement(el, scale);
      const stamp = new Date().toISOString().slice(0, 10);
      const base = `${fileName}-${stamp}`;

      if (format === "png") {
        const link = document.createElement("a");
        link.download = `${base}.png`;
        link.href = canvas.toDataURL("image/png", 1);
        link.click();
        return;
      }

      const { jsPDF } = await import("jspdf");
      const imgData = canvas.toDataURL("image/png", 1);
      const orientation =
        canvas.width >= canvas.height ? "landscape" : "portrait";
      const pdf = new jsPDF({ orientation, unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2;
      const ratio = Math.min(maxW / canvas.width, maxH / canvas.height);
      const w = canvas.width * ratio;
      const h = canvas.height * ratio;
      pdf.addImage(
        imgData,
        "PNG",
        (pageW - w) / 2,
        (pageH - h) / 2,
        w,
        h,
        undefined,
        "FAST",
      );
      pdf.save(`${base}.pdf`);
    } finally {
      busyRef.current = false;
      setExporting(null);
    }
  };

  const busy = exporting !== null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={className}
          disabled={busy}
        >
          {busy ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Download className="mr-2 size-4" />
          )}
          {busy
            ? exporting === "pdf"
              ? "Generando PDF…"
              : "Generando PNG…"
            : "Exportar"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Descargar como</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void handleExport("png")}>
          <FileImage className="mr-2 size-4" />
          Imagen PNG (alta resolución)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => void handleExport("pdf")}>
          <FileText className="mr-2 size-4" />
          Documento PDF (A4)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
