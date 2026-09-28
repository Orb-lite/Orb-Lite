import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as PRODUCTS } from "./catalog-BhuVKh9L.mjs";
import { d as crmListRenovaciones, h as crmSaveRenovacion, s as crmDeleteRenovacion } from "./crm.functions-BYRGz6Qn.mjs";
import { u as mxn } from "./solicitud-card-DcH36p1l.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/renovaciones-D4to3Ycj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/renovaciones.tsx?tsr-split=component";
var STATUSES = [
	"activa",
	"por_vencer",
	"adeudo",
	"cancelada"
];
var STATUS_LABEL = {
	activa: "Activa",
	por_vencer: "Por vencer",
	adeudo: "Con adeudo",
	cancelada: "Cancelada"
};
var PERIOD_LABEL = {
	monthly: "Mensual",
	annual: "Anual"
};
/** Mensual: día 1 del mes siguiente. Anual: día 1 del mismo mes del año siguiente. */
function nextRenewalDate(period, from = /* @__PURE__ */ new Date()) {
	const y = from.getUTCFullYear();
	const m = from.getUTCMonth();
	return (period === "monthly" ? new Date(Date.UTC(y, m + 1, 1)) : new Date(Date.UTC(y + 1, m, 1))).toISOString().slice(0, 10);
}
var RENOVATION_VARIANTS = PRODUCTS.find((p) => p.category === "RENOVATION")?.variants ?? [];
function emptyForm(platform) {
	const first = RENOVATION_VARIANTS.find((v) => (v.platform ?? "ORB-LITE") === platform);
	return {
		id: null,
		customerNumber: "",
		customerName: "",
		customerEmail: "",
		customerPhone: "",
		variantId: first?.id ?? RENOVATION_VARIANTS[0]?.id ?? "",
		platform,
		renewalKind: first?.renewal_kind ?? "platform",
		renewalPeriod: first?.renewal_period ?? "annual",
		unitName: "",
		imei: "",
		iccid: "",
		simPhone: "",
		amount: String(first?.price ?? 0),
		renewalDate: nextRenewalDate(first?.renewal_period ?? "annual"),
		status: "activa"
	};
}
function RenovacionesPage() {
	const queryClient = useQueryClient();
	const list = useServerFn(crmListRenovaciones);
	const save = useServerFn(crmSaveRenovacion);
	const remove = useServerFn(crmDeleteRenovacion);
	const [platform, setPlatform] = import_react.useState("ORB-LITE");
	const [q, setQ] = import_react.useState("");
	const [form, setForm] = import_react.useState(() => emptyForm("ORB-LITE"));
	const [showForm, setShowForm] = import_react.useState(false);
	const query = useQuery({
		queryKey: ["crm-renovaciones"],
		queryFn: () => list({ data: void 0 }),
		refetchInterval: 3e4
	});
	const mutation = useMutation({
		mutationFn: () => save({ data: {
			id: form.id,
			customerNumber: form.customerNumber ? Number(form.customerNumber) : null,
			customerName: form.customerName || null,
			customerEmail: form.customerEmail || null,
			customerPhone: form.customerPhone || null,
			variantId: form.variantId,
			variantName: RENOVATION_VARIANTS.find((v) => v.id === form.variantId)?.name ?? form.variantId,
			platform: form.platform,
			renewalKind: form.renewalKind,
			renewalPeriod: form.renewalPeriod,
			unitName: form.unitName || null,
			imei: form.imei || null,
			iccid: form.iccid || null,
			simPhone: form.simPhone || null,
			amount: Number(form.amount || 0),
			renewalDate: form.renewalDate,
			status: form.status
		} }),
		onSuccess: (res) => {
			toast.success(res?.created ? "Renovación registrada" : "Renovación actualizada");
			setShowForm(false);
			setForm(emptyForm(platform));
			queryClient.invalidateQueries({ queryKey: ["crm-renovaciones"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo guardar la renovación")
	});
	const removal = useMutation({
		mutationFn: (id) => remove({ data: { id } }),
		onSuccess: () => {
			toast.success("Renovación eliminada");
			queryClient.invalidateQueries({ queryKey: ["crm-renovaciones"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo eliminar")
	});
	const rows = query.data?.rows ?? [];
	const term = q.trim().toLowerCase();
	const forPlatform = rows.filter((r) => {
		return (r.platform ?? "ORB-LITE") === platform || platform === "ORB-LITE" && !r.platform;
	});
	const visible = term ? forPlatform.filter((r) => [
		r.customer_name,
		r.imei,
		r.iccid,
		r.sim_phone,
		r.unit_name,
		String(r.customer_number)
	].filter(Boolean).some((v) => String(v).toLowerCase().includes(term))) : forPlatform;
	const monthly = visible.filter((r) => r.renewal_period === "monthly");
	const annual = visible.filter((r) => r.renewal_period !== "monthly");
	const totalMonto = visible.reduce((s, r) => s + Number(r.amount ?? 0), 0);
	function startEdit(row) {
		setForm({
			id: row.id,
			customerNumber: row.customer_number ? String(row.customer_number) : "",
			customerName: row.customer_name ?? "",
			customerEmail: row.customer_email ?? "",
			customerPhone: row.customer_phone ?? "",
			variantId: row.variant_id,
			platform: row.platform ?? "ORB-LITE",
			renewalKind: row.renewal_kind ?? "platform",
			renewalPeriod: row.renewal_period ?? "annual",
			unitName: row.unit_name ?? "",
			imei: row.imei ?? "",
			iccid: row.iccid ?? "",
			simPhone: row.sim_phone ?? "",
			amount: String(row.amount ?? 0),
			renewalDate: String(row.renewal_date ?? "").slice(0, 10),
			status: STATUSES.includes(row.status) ? row.status : "activa"
		});
		setShowForm(true);
	}
	function pickVariant(id) {
		const v = RENOVATION_VARIANTS.find((x) => x.id === id);
		setForm((f) => {
			const period = v?.renewal_period ?? f.renewalPeriod;
			return {
				...f,
				variantId: id,
				platform: v?.platform ?? f.platform,
				renewalKind: v?.renewal_kind ?? f.renewalKind,
				renewalPeriod: period,
				amount: String(v?.price ?? f.amount),
				renewalDate: f.id ? f.renewalDate : nextRenewalDate(period)
			};
		});
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "min-h-screen bg-background px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto max-w-5xl space-y-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs tracking-[0.2em] text-primary",
								children: "CRM ORB-LITE"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 187,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "font-display text-2xl text-foreground",
								children: "Panel de renovaciones"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 188,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-sm text-muted-foreground",
								children: "Control de plataforma ORB-LITE y ORB-FULL: IMEI, ICCID, teléfono y fecha de renovación."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 189,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 186,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/crm",
									children: "Solicitudes"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 196,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 195,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/clientes",
									children: "Clientes"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 199,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 198,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								onClick: () => {
									setForm(emptyForm(platform));
									setShowForm((s) => !s);
								},
								children: showForm ? "Cerrar formulario" : "Nueva renovación"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 201,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 194,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 185,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap gap-2 border-b border-border pb-3",
					children: ["ORB-LITE", "ORB-FULL"].map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						variant: platform === p ? "default" : "ghost",
						onClick: () => setPlatform(p),
						children: ["Plataforma ", p]
					}, p, true, {
						fileName: _jsxFileName,
						lineNumber: 211,
						columnNumber: 57
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 210,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							label: "Renovaciones",
							value: String(visible.length),
							note: `Plataforma ${platform}`
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 217,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							label: "Mensuales",
							value: String(monthly.length),
							note: "Corte cada mes"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 218,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							label: "Importe registrado",
							value: mxn(totalMonto),
							note: "Suma de renovaciones"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 219,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 216,
					columnNumber: 9
				}, this),
				showForm ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "space-y-4 rounded-xl border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-base text-foreground",
							children: form.id ? "Editar renovación" : "Registrar renovación"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 223,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
									label: "Tipo de renovación",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
										value: form.variantId,
										onChange: (e) => pickVariant(e.target.value),
										className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground",
										children: RENOVATION_VARIANTS.map((v) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: v.id,
											children: v.name
										}, v.id, false, {
											fileName: _jsxFileName,
											lineNumber: 230,
											columnNumber: 49
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 229,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 228,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
									label: "Periodo",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
										value: form.renewalPeriod,
										onChange: (e) => setForm((f) => ({
											...f,
											renewalPeriod: e.target.value
										})),
										className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "monthly",
											children: "Mensual"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 241,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "annual",
											children: "Anual"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 242,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 237,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 236,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
									label: "Plataforma",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
										value: form.platform,
										onChange: (e) => setForm((f) => ({
											...f,
											platform: e.target.value
										})),
										className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "ORB-LITE",
											children: "ORB-LITE"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 251,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "ORB-FULL",
											children: "ORB-FULL"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 252,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 247,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 246,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
									label: "Mes de renovación (siempre corre el día 1)",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										type: "month",
										value: form.renewalDate.slice(0, 7),
										onChange: (e) => setForm((f) => ({
											...f,
											renewalDate: e.target.value ? `${e.target.value}-01` : ""
										}))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 257,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 256,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
									label: "Nombre del equipo en plataforma",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										value: form.unitName,
										onChange: (e) => setForm((f) => ({
											...f,
											unitName: e.target.value
										})),
										placeholder: "Ej. Camioneta Nissan"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 264,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 263,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
									label: "IMEI",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										value: form.imei,
										onChange: (e) => setForm((f) => ({
											...f,
											imei: e.target.value
										})),
										placeholder: "15 dígitos"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 271,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 270,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
									label: "ICCID del chip",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										value: form.iccid,
										onChange: (e) => setForm((f) => ({
											...f,
											iccid: e.target.value
										})),
										placeholder: "ICCID de la SIM"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 278,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 277,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
									label: "Teléfono del chip (opcional)",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										value: form.simPhone,
										onChange: (e) => setForm((f) => ({
											...f,
											simPhone: e.target.value
										})),
										placeholder: "Opcional"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 285,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 284,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
									label: "Número de cliente (opcional)",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										value: form.customerNumber,
										onChange: (e) => setForm((f) => ({
											...f,
											customerNumber: e.target.value
										})),
										placeholder: "Ej. 512"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 292,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 291,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
									label: "Nombre del cliente",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										value: form.customerName,
										onChange: (e) => setForm((f) => ({
											...f,
											customerName: e.target.value
										}))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 299,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 298,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
									label: "Correo del cliente",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										type: "email",
										value: form.customerEmail,
										onChange: (e) => setForm((f) => ({
											...f,
											customerEmail: e.target.value
										}))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 306,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 305,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
									label: "Teléfono del cliente (opcional)",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										value: form.customerPhone,
										onChange: (e) => setForm((f) => ({
											...f,
											customerPhone: e.target.value
										}))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 313,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 312,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
									label: "Importe",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										type: "number",
										min: 0,
										value: form.amount,
										onChange: (e) => setForm((f) => ({
											...f,
											amount: e.target.value
										}))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 320,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 319,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
									label: "Estado",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
										value: form.status,
										onChange: (e) => setForm((f) => ({
											...f,
											status: e.target.value
										})),
										className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground",
										children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: s,
											children: STATUS_LABEL[s]
										}, s, false, {
											fileName: _jsxFileName,
											lineNumber: 331,
											columnNumber: 38
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 327,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 326,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 227,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								onClick: () => mutation.mutate(),
								disabled: mutation.isPending || !form.renewalDate,
								children: mutation.isPending ? "Guardando…" : form.id ? "Guardar cambios" : "Registrar"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 339,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								onClick: () => {
									setShowForm(false);
									setForm(emptyForm(platform));
								},
								children: "Cancelar"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 342,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 338,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 222,
					columnNumber: 21
				}, this) : null,
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Buscar por cliente, IMEI, ICCID, teléfono o equipo"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 351,
					columnNumber: 9
				}, this),
				query.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: "Cargando renovaciones…"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 353,
					columnNumber: 28
				}, this) : query.isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-destructive",
					children: "No se pudieron cargar las renovaciones. Verifica que iniciaste sesión con ventas@orb-lite.com."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 353,
					columnNumber: 118
				}, this) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Sin renovaciones registradas para la plataforma ",
						platform,
						"."
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 356,
					columnNumber: 41
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Group, {
						title: `Mensuales · ${platform}`,
						rows: monthly,
						onEdit: startEdit,
						onDelete: (id) => removal.mutate(id),
						pending: removal.isPending
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 359,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Group, {
						title: `Anuales · ${platform}`,
						rows: annual,
						onEdit: startEdit,
						onDelete: (id) => removal.mutate(id),
						pending: removal.isPending
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 360,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 358,
					columnNumber: 18
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 184,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 183,
		columnNumber: 10
	}, this);
}
function Group({ title, rows, onEdit, onDelete, pending }) {
	if (rows.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
			className: "text-sm uppercase tracking-wide text-primary",
			children: [
				title,
				" (",
				rows.length,
				")"
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 380,
			columnNumber: 7
		}, this), rows.map((row) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
			className: "space-y-2 rounded-xl border border-border bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-sm text-primary",
							children: [
								row.platform ?? "ORB-LITE",
								" ·",
								" ",
								PERIOD_LABEL[row.renewal_period ?? "annual"]
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 386,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-base text-foreground",
							children: row.variant_name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 390,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-sm text-muted-foreground",
							children: [row.customer_name || "Sin cliente", row.customer_number ? ` · Cliente #${row.customer_number}` : ""]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 391,
							columnNumber: 15
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 385,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-right",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-base font-semibold text-foreground",
								children: mxn(Number(row.amount ?? 0))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 397,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Renueva:",
									" ",
									(/* @__PURE__ */ new Date(`${String(row.renewal_date).slice(0, 10)}T12:00:00Z`)).toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" })
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 400,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: STATUS_LABEL[row.status ?? "activa"] ?? row.status
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 406,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 396,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 384,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid gap-1 text-sm sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
							label: "Equipo en plataforma",
							value: row.unit_name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 413,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
							label: "IMEI",
							value: row.imei
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 414,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
							label: "ICCID",
							value: row.iccid
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 415,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
							label: "Teléfono del chip",
							value: row.sim_phone
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 416,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
							label: "Correo",
							value: row.customer_email
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 417,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
							label: "Teléfono del cliente",
							value: row.customer_phone
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 418,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 412,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex gap-2 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => onEdit(row),
						children: "Editar"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 422,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						variant: "destructive",
						disabled: pending,
						onClick: () => onDelete(row.id),
						children: "Borrar"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 425,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 421,
					columnNumber: 11
				}, this)
			]
		}, row.id, true, {
			fileName: _jsxFileName,
			lineNumber: 383,
			columnNumber: 24
		}, this))]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 379,
		columnNumber: 10
	}, this);
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
		className: "flex flex-wrap justify-between gap-2 text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: label }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 440,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-right text-foreground",
			children: value || "—"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 441,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 439,
		columnNumber: 10
	}, this);
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: label }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 452,
			columnNumber: 7
		}, this), children]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 451,
		columnNumber: 10
	}, this);
}
function Stat({ label, value, note }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-xl border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-xs uppercase tracking-wide text-muted-foreground",
				children: label
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 466,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "font-display text-2xl text-foreground",
				children: value
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 467,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground",
				children: note
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 468,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 465,
		columnNumber: 10
	}, this);
}
//#endregion
export { RenovacionesPage as component };
