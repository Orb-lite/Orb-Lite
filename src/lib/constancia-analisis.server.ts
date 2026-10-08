/**
 * Server-only: analiza el archivo subido para confirmar que es
 * una Constancia de Situación Fiscal del SAT y extraer sus datos clave.
 */
import { GoogleGenAI } from "@google/genai";

export interface ConstanciaAnalisis {
  esConstancia: boolean;
  motivo: string | null;
  rfc: string | null;
  razonSocial: string | null;
  regimenFiscal: string | null;
  cpFiscal: string | null;
  fechaEmision: string | null;
}

const PROMPT = `Eres un validador documental del SAT (México). Analiza el documento adjunto y determina si es una "Constancia de Situación Fiscal" emitida por el SAT (suele incluir el escudo nacional, "Cédula de Identificación Fiscal" o "Constancia de Situación Fiscal", RFC, idCIF, régimen(es), domicilio fiscal y código QR).
Rechaza cualquier otro documento (identificaciones, facturas, CFDI, comprobantes de domicilio, estados de cuenta, fotos aleatorias, capturas de pantalla, documentos ilegibles).
Responde SOLO con JSON válido, sin texto extra, con esta forma exacta:
{"esConstancia": boolean, "motivo": string|null, "rfc": string|null, "razonSocial": string|null, "regimenFiscal": string|null, "cpFiscal": string|null, "fechaEmision": string|null}
"motivo" explica en español y en una frase breve por qué se rechaza (null si se acepta). Fechas en formato YYYY-MM-DD si son legibles.`;

export async function analizarConstancia(
  base64: string,
  contentType: string,
): Promise<ConstanciaAnalisis> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return {
      esConstancia: true,
      motivo: null,
      rfc: null,
      razonSocial: null,
      regimenFiscal: null,
      cpFiscal: null,
      fechaEmision: null,
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: PROMPT },
          {
            inlineData: {
              mimeType: contentType,
              data: base64,
            },
          },
        ],
      },
    ],
  });

  const raw = response.text || "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No pudimos leer el documento, intenta con un archivo más claro");

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(match[0]) as Record<string, unknown>;
  } catch {
    throw new Error("No pudimos leer el documento, intenta con un archivo más claro");
  }

  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

  return {
    esConstancia: parsed["esConstancia"] === true,
    motivo: str(parsed["motivo"]),
    rfc: str(parsed["rfc"])?.toUpperCase().replace(/\s+/g, "") ?? null,
    razonSocial: str(parsed["razonSocial"]),
    regimenFiscal: str(parsed["regimenFiscal"]),
    cpFiscal: str(parsed["cpFiscal"]),
    fechaEmision: str(parsed["fechaEmision"]),
  };
}
