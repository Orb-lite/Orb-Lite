/**
 * Server-only: analiza el archivo subido con Lovable AI para confirmar que es
 * una Constancia de Situación Fiscal del SAT y extraer sus datos clave.
 */
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
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("LOVABLE_API_KEY no está configurada");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            { type: "image_url", image_url: { url: `data:${contentType};base64,${base64}` } },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Fallo al analizar la constancia", res.status, detail.slice(0, 300));
    throw new Error("No pudimos analizar el documento, intenta de nuevo en un momento");
  }

  const payload = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = payload.choices?.[0]?.message?.content ?? "";
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
