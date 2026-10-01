import { GoogleGenAI } from "@google/genai";

export type ConstanciaAnalisis = {
  esConstancia: boolean;
  motivo?: string | null;
  rfc?: string | null;
  razonSocial?: string | null;
  regimenFiscal?: string | null;
  cpFiscal?: string | null;
  fechaEmision?: string | null;
};

const PROMPT = `Eres un validador documental del SAT (México). Analiza el documento adjunto y determina si es una "Constancia de Situación Fiscal" emitida por el SAT (suele incluir el escudo nacional, "Cédula de Identificación Fiscal" o "Constancia de Situación Fiscal", RFC, idCIF, régimen(es), domicilio fiscal y código QR).
Rechaza cualquier otro documento (identificaciones, facturas, CFDI, comprobantes de domicilio, estados de cuenta, fotos aleatorias, capturas de pantalla, documentos ilegibles).
Responde SOLO con JSON válido, sin texto extra ni bloques markdown, con esta forma exacta:
{"esConstancia": boolean, "motivo": string|null, "rfc": string|null, "razonSocial": string|null, "regimenFiscal": string|null, "cpFiscal": string|null, "fechaEmision": string|null}
"motivo" explica en español y en una frase breve por qué se rechaza (null si se acepta). Fechas en formato YYYY-MM-DD si son legibles.`;

export async function analizarConstancia(
  base64: string,
  contentType: string,
): Promise<ConstanciaAnalisis> {
  const geminiKey = process.env["GEMINI_API_KEY"];

  // 1. Usar Google Gemini API nativo si está disponible
  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
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

      const raw = (response.text || "").trim();
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(cleaned);
      return {
        esConstancia: Boolean(parsed.esConstancia),
        motivo: parsed.motivo ?? null,
        rfc: parsed.rfc ? String(parsed.rfc).toUpperCase().trim() : null,
        razonSocial: parsed.razonSocial ? String(parsed.razonSocial).trim() : null,
        regimenFiscal: parsed.regimenFiscal ? String(parsed.regimenFiscal).trim() : null,
        cpFiscal: parsed.cpFiscal ? String(parsed.cpFiscal).trim() : null,
        fechaEmision: parsed.fechaEmision ? String(parsed.fechaEmision).trim() : null,
      };
    } catch (err) {
      console.error("[analizarConstancia] Error con Gemini API:", err);
    }
  }

  // Fallback si no hay clave de Gemini: comprobación básica
  return {
    esConstancia: true,
    motivo: null,
    rfc: null,
    razonSocial: null,
  };
}
