import { t as GoogleGenAI } from "../_libs/@google/genai.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/constancia-analisis.server-6ByHpqG8.js
var PROMPT = `Eres un validador documental del SAT (México). Analiza el documento adjunto y determina si es una "Constancia de Situación Fiscal" emitida por el SAT (suele incluir el escudo nacional, "Cédula de Identificación Fiscal" o "Constancia de Situación Fiscal", RFC, idCIF, régimen(es), domicilio fiscal y código QR).
Rechaza cualquier otro documento (identificaciones, facturas, CFDI, comprobantes de domicilio, estados de cuenta, fotos aleatorias, capturas de pantalla, documentos ilegibles).
Responde SOLO con JSON válido, sin texto extra ni bloques markdown, con esta forma exacta:
{"esConstancia": boolean, "motivo": string|null, "rfc": string|null, "razonSocial": string|null, "regimenFiscal": string|null, "cpFiscal": string|null, "fechaEmision": string|null}
"motivo" explica en español y en una frase breve por qué se rechaza (null si se acepta). Fechas en formato YYYY-MM-DD si son legibles.`;
async function analizarConstancia(base64, contentType) {
	const geminiKey = process.env["GEMINI_API_KEY"];
	if (geminiKey) try {
		const cleaned = ((await new GoogleGenAI({ apiKey: geminiKey }).models.generateContent({
			model: "gemini-2.5-flash",
			contents: [{
				role: "user",
				parts: [{ text: PROMPT }, { inlineData: {
					mimeType: contentType,
					data: base64
				} }]
			}]
		})).text || "").trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
		const parsed = JSON.parse(cleaned);
		return {
			esConstancia: Boolean(parsed.esConstancia),
			motivo: parsed.motivo ?? null,
			rfc: parsed.rfc ? String(parsed.rfc).toUpperCase().trim() : null,
			razonSocial: parsed.razonSocial ? String(parsed.razonSocial).trim() : null,
			regimenFiscal: parsed.regimenFiscal ? String(parsed.regimenFiscal).trim() : null,
			cpFiscal: parsed.cpFiscal ? String(parsed.cpFiscal).trim() : null,
			fechaEmision: parsed.fechaEmision ? String(parsed.fechaEmision).trim() : null
		};
	} catch (err) {
		console.error("[analizarConstancia] Error con Gemini API:", err);
	}
	return {
		esConstancia: true,
		motivo: null,
		rfc: null,
		razonSocial: null
	};
}
//#endregion
export { analizarConstancia };
