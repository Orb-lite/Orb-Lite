import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MAX_BYTES = 10 * 1024 * 1024;

const ALLOWED = ["application/pdf", "image/jpeg", "image/png", "image/webp"] as const;

const schema = z.object({
  fileName: z.string().trim().min(1).max(160),
  contentType: z.enum(ALLOWED),
  /** Contenido del archivo en base64 (sin prefijo data:). */
  base64: z.string().min(10),
  rfc: z.string().trim().max(20).optional(),
});

/**
 * Sube la Constancia de Situación Fiscal a un bucket privado y devuelve
 * la ruta interna más un enlace firmado (30 días) para el equipo de ventas.
 */
export const uploadConstanciaFiscal = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    if (bytes.byteLength > MAX_BYTES) {
      throw new Error("El archivo supera 10 MB");
    }

    // 1) Validamos con IA que realmente sea una Constancia de Situación Fiscal.
    const { analizarConstancia } = await import("@/lib/constancia-analisis.server");
    const analisis = await analizarConstancia(data.base64, data.contentType);

    if (!analisis.esConstancia) {
      throw new Error(
        analisis.motivo ??
          "El archivo no parece ser una Constancia de Situación Fiscal del SAT. Sube el documento correcto.",
      );
    }

    const rfcCapturado = (data.rfc ?? "").toUpperCase().replace(/[^A-ZÑ&0-9]/g, "");
    if (rfcCapturado && analisis.rfc && analisis.rfc !== rfcCapturado) {
      throw new Error(
        `La constancia es del RFC ${analisis.rfc} y capturaste ${rfcCapturado}. Verifica los datos.`,
      );
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const ext = data.fileName.includes(".") ? data.fileName.split(".").pop()!.toLowerCase() : "pdf";
    const safeRfc = (analisis.rfc || data.rfc || "sin-rfc").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const path = `${safeRfc}/${Date.now()}-constancia.${ext}`;

    const { error } = await supabaseAdmin.storage
      .from("constancias-fiscales")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });

    if (error) throw new Error("No se pudo subir la constancia: " + error.message);

    const { data: signed } = await supabaseAdmin.storage
      .from("constancias-fiscales")
      .createSignedUrl(path, 60 * 60 * 24 * 30);

    return {
      path,
      fileName: data.fileName,
      signedUrl: signed?.signedUrl ?? null,
      rfc: analisis.rfc,
      razonSocial: analisis.razonSocial,
      regimenFiscal: analisis.regimenFiscal,
      cpFiscal: analisis.cpFiscal,
      fechaEmision: analisis.fechaEmision,
    };
  });

