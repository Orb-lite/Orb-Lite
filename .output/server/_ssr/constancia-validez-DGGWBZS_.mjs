import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/constancia-validez-DGGWBZS_.js
var constancia_validez_DGGWBZS__exports = /* @__PURE__ */ __exportAll({
	i: () => formatFechaEmision,
	n: () => constanciaVigente,
	r: () => constancia_validez_exports,
	t: () => constanciaVenceEl
});
var constancia_validez_exports = /* @__PURE__ */ __exportAll$1({
	CONSTANCIA_DIAS_EMISION: () => 30,
	CONSTANCIA_DIAS_VIGENCIA: () => 30,
	constanciaVenceEl: () => constanciaVenceEl,
	constanciaVigente: () => constanciaVigente,
	formatFechaEmision: () => formatFechaEmision,
	parseFechaEmision: () => parseFechaEmision,
	revisarFechaEmision: () => revisarFechaEmision
});
var MS_DIA = 864e5;
function constanciaVigente(uploadedAt) {
	if (!uploadedAt) return false;
	const ts = new Date(uploadedAt).getTime();
	if (Number.isNaN(ts)) return false;
	return Date.now() - ts < 30 * MS_DIA;
}
function constanciaVenceEl(uploadedAt) {
	if (!uploadedAt) return null;
	const ts = new Date(uploadedAt).getTime();
	if (Number.isNaN(ts)) return null;
	return new Date(ts + 30 * MS_DIA).toLocaleDateString("es-MX", {
		day: "2-digit",
		month: "long",
		year: "numeric"
	});
}
function parseFechaEmision(fecha) {
	if (!fecha) return null;
	const iso = fecha.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (iso) {
		const d = /* @__PURE__ */ new Date(`${iso[1]}-${iso[2]}-${iso[3]}T12:00:00Z`);
		return Number.isNaN(d.getTime()) ? null : d;
	}
	const dmy = fecha.trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
	if (dmy) {
		const d = /* @__PURE__ */ new Date(`${dmy[3]}-${String(dmy[2]).padStart(2, "0")}-${String(dmy[1]).padStart(2, "0")}T12:00:00Z`);
		return Number.isNaN(d.getTime()) ? null : d;
	}
	const fallback = new Date(fecha);
	return Number.isNaN(fallback.getTime()) ? null : fallback;
}
/**
* Revisa la fecha de emisión impresa en la constancia: debe ser legible, no
* futura y con menos de un mes de antigüedad.
*/
function revisarFechaEmision(fecha) {
	const d = parseFechaEmision(fecha);
	if (!d) return {
		ok: false,
		motivo: "No pudimos leer la fecha de emisión de la constancia. Sube el documento completo y legible."
	};
	const ahora = Date.now();
	if (d.getTime() - ahora > MS_DIA) return {
		ok: false,
		motivo: "La fecha de emisión de la constancia es futura, verifica el documento."
	};
	const dias = Math.floor((ahora - d.getTime()) / MS_DIA);
	if (dias > 30) return {
		ok: false,
		motivo: `La constancia fue emitida hace ${dias} días. Descarga una nueva en el portal del SAT (máximo 30 días de antigüedad).`
	};
	return {
		ok: true,
		fechaISO: d.toISOString().slice(0, 10)
	};
}
function formatFechaEmision(fecha) {
	const d = parseFechaEmision(fecha);
	if (!d) return null;
	return d.toLocaleDateString("es-MX", {
		day: "2-digit",
		month: "long",
		year: "numeric"
	});
}
//#endregion
export { formatFechaEmision as i, constanciaVigente as n, constancia_validez_DGGWBZS__exports as r, constanciaVenceEl as t };
