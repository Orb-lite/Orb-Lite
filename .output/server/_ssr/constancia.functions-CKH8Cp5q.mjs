import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { o as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/constancia.functions-CKH8Cp5q.js
var MAX_BYTES = 10485760;
var schema = objectType({
	fileName: stringType().trim().min(1).max(160),
	contentType: enumType([
		"application/pdf",
		"image/jpeg",
		"image/png",
		"image/webp"
	]),
	/** Contenido del archivo en base64 (sin prefijo data:). */
	base64: stringType().min(10),
	rfc: stringType().trim().max(20).optional()
});
/**
* Sube la Constancia de Situación Fiscal a un bucket privado y devuelve
* la ruta interna más un enlace firmado (30 días) para el equipo de ventas.
*/
var uploadConstanciaFiscal_createServerFn_handler = createServerRpc({
	id: "a8f0f685d1e724fbbc17b224d341d9fa0477c2f386a9269b483b843b14752253",
	name: "uploadConstanciaFiscal",
	filename: "src/lib/constancia.functions.ts"
}, (opts) => uploadConstanciaFiscal.__executeServer(opts));
var uploadConstanciaFiscal = createServerFn({ method: "POST" }).inputValidator((data) => schema.parse(data)).handler(uploadConstanciaFiscal_createServerFn_handler, async ({ data }) => {
	const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
	if (bytes.byteLength > MAX_BYTES) throw new Error("El archivo supera 10 MB");
	const { analizarConstancia } = await import("./constancia-analisis.server-Bekf1Axm.mjs");
	const analisis = await analizarConstancia(data.base64, data.contentType);
	if (!analisis.esConstancia) throw new Error(analisis.motivo ?? "El archivo no parece ser una Constancia de Situación Fiscal del SAT. Sube el documento correcto.");
	const rfcCapturado = (data.rfc ?? "").toUpperCase().replace(/[^A-ZÑ&0-9]/g, "");
	if (rfcCapturado && analisis.rfc && analisis.rfc !== rfcCapturado) throw new Error(`La constancia es del RFC ${analisis.rfc} y capturaste ${rfcCapturado}. Verifica los datos.`);
	const { revisarFechaEmision } = await import("./constancia-validez-DGGWBZS_.mjs").then((n) => n.r).then((n) => n.r);
	const emision = revisarFechaEmision(analisis.fechaEmision);
	if (!emision.ok) throw new Error(emision.motivo);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const ext = data.fileName.includes(".") ? data.fileName.split(".").pop().toLowerCase() : "pdf";
	const path = `${(analisis.rfc || data.rfc || "sin-rfc").replace(/[^A-Za-z0-9]/g, "").toUpperCase()}/${Date.now()}-constancia.${ext}`;
	const { error } = await supabaseAdmin.storage.from("constancias-fiscales").upload(path, bytes, {
		contentType: data.contentType,
		upsert: false
	});
	if (error) throw new Error("No se pudo subir la constancia: " + error.message);
	const { data: signed } = await supabaseAdmin.storage.from("constancias-fiscales").createSignedUrl(path, 2592e3);
	return {
		path,
		fileName: data.fileName,
		signedUrl: signed?.signedUrl ?? null,
		rfc: analisis.rfc,
		razonSocial: analisis.razonSocial,
		regimenFiscal: analisis.regimenFiscal,
		cpFiscal: analisis.cpFiscal,
		fechaEmision: emision.fechaISO ?? analisis.fechaEmision
	};
});
//#endregion
export { uploadConstanciaFiscal_createServerFn_handler };
