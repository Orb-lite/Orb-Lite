import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { $ as ExternalLink, A as MessageCircle, B as Layers, U as Infinity$1, Z as Eye, at as Clock, b as RefreshCw, g as Search, h as Share2, ht as Car, l as Square, mt as Check, p as ShieldCheck, rt as Copy, s as Trash2, u as SquareCheckBig, ut as CircleAlert, w as Plus } from "../_libs/lucide-react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CwLzEEob.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as listUnitShares, n as deleteUnitShare, o as revokeUnitShare, r as extendUnitShare, t as createUnitShare } from "./unit-share.functions-DUfawtKU.mjs";
import { b as wialonUnits } from "./wialon.functions-C37hcc8N.mjs";
import { t as WialonGuard } from "./wialon-guard-JCWFzsMD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.compartir-CLWFeiJx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WialonSharePageWrapper() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WialonSharePage, { session }) });
}
var PRESET_DURATIONS = [
	{
		label: "1 hora",
		hours: 1,
		isUnlimited: false
	},
	{
		label: "2 horas",
		hours: 2,
		isUnlimited: false
	},
	{
		label: "4 horas",
		hours: 4,
		isUnlimited: false
	},
	{
		label: "8 horas",
		hours: 8,
		isUnlimited: false
	},
	{
		label: "12 horas",
		hours: 12,
		isUnlimited: false
	},
	{
		label: "24 horas",
		hours: 24,
		isUnlimited: false
	},
	{
		label: "48 horas",
		hours: 48,
		isUnlimited: false
	},
	{
		label: "72 horas",
		hours: 72,
		isUnlimited: false
	},
	{
		label: "♾️ Sin Límite",
		hours: 0,
		isUnlimited: true
	}
];
function WialonSharePage({ session }) {
	const queryClient = useQueryClient();
	const fetchUnits = useServerFn(wialonUnits);
	const fetchShares = useServerFn(listUnitShares);
	const createShareFn = useServerFn(createUnitShare);
	const revokeShareFn = useServerFn(revokeUnitShare);
	const extendShareFn = useServerFn(extendUnitShare);
	const deleteShareFn = useServerFn(deleteUnitShare);
	const [createDialogOpen, setCreateDialogOpen] = import_react.useState(false);
	const [successLink, setSuccessLink] = import_react.useState(null);
	const [copiedToken, setCopiedToken] = import_react.useState(null);
	const [search, setSearch] = import_react.useState("");
	const [shareMode, setShareMode] = import_react.useState("single");
	const [selectedUnitId, setSelectedUnitId] = import_react.useState("custom");
	const [selectedMultiUnitIds, setSelectedMultiUnitIds] = import_react.useState([]);
	const [multiUnitFilter, setMultiUnitFilter] = import_react.useState("");
	const [customUnitName, setCustomUnitName] = import_react.useState("");
	const [durationHours, setDurationHours] = import_react.useState(24);
	const [isUnlimited, setIsUnlimited] = import_react.useState(false);
	const [clientName, setClientName] = import_react.useState("");
	const [clientPhone, setClientPhone] = import_react.useState("");
	const [clientEmail, setClientEmail] = import_react.useState("");
	const [notes, setNotes] = import_react.useState("");
	const [formError, setFormError] = import_react.useState(null);
	const unitsQuery = useQuery({
		queryKey: ["wialon-units", session.sid],
		queryFn: () => fetchUnits({ data: {
			host: session.host,
			sid: session.sid
		} }),
		staleTime: 6e4
	});
	const sharesQuery = useQuery({
		queryKey: ["unit-shares", session.host],
		queryFn: () => fetchShares({ data: {
			host: session.host,
			sid: session.sid
		} }),
		refetchInterval: 15e3
	});
	const units = unitsQuery.data?.units ?? [];
	const shares = sharesQuery.data?.links ?? [];
	const createMutation = useMutation({
		mutationFn: createShareFn,
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["unit-shares"] });
			setSuccessLink(res.link);
			setCreateDialogOpen(false);
			setClientName("");
			setClientPhone("");
			setClientEmail("");
			setNotes("");
			setSelectedMultiUnitIds([]);
			setFormError(null);
		},
		onError: (err) => {
			setFormError(err.message || "Error al generar enlace.");
		}
	});
	const revokeMutation = useMutation({
		mutationFn: revokeShareFn,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["unit-shares"] });
		}
	});
	const extendMutation = useMutation({
		mutationFn: extendShareFn,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["unit-shares"] });
		}
	});
	const deleteMutation = useMutation({
		mutationFn: deleteShareFn,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["unit-shares"] });
		}
	});
	const now = Date.now();
	const activeCount = shares.filter((s) => {
		const isUnlim = Boolean(s.isUnlimited || s.durationHours === 0);
		return s.status === "active" && (isUnlim || new Date(s.expiresAt).getTime() > now);
	}).length;
	const expiredCount = shares.filter((s) => {
		const isUnlim = Boolean(s.isUnlimited || s.durationHours === 0);
		return s.status !== "active" || !isUnlim && new Date(s.expiresAt).getTime() <= now;
	}).length;
	const totalViews = shares.reduce((acc, s) => acc + (s.viewCount || 0), 0);
	const filteredShares = import_react.useMemo(() => {
		const q = search.toLowerCase().trim();
		if (!q) return shares;
		return shares.filter((s) => s.unitName.toLowerCase().includes(q) || s.clientName && s.clientName.toLowerCase().includes(q) || s.notes && s.notes.toLowerCase().includes(q));
	}, [shares, search]);
	const filteredModalUnits = import_react.useMemo(() => {
		const q = multiUnitFilter.toLowerCase().trim();
		if (!q) return units;
		return units.filter((u) => u.name.toLowerCase().includes(q) || u.imei && u.imei.toLowerCase().includes(q) || String(u.id).includes(q));
	}, [units, multiUnitFilter]);
	function handleToggleMultiUnit(id) {
		setSelectedMultiUnitIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
	}
	function handleSelectAllMultiUnits() {
		setSelectedMultiUnitIds(units.map((u) => u.id));
	}
	function handleDeselectAllMultiUnits() {
		setSelectedMultiUnitIds([]);
	}
	function handleCreateSubmit(e) {
		e.preventDefault();
		setFormError(null);
		const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("wialon_token") : null;
		if (shareMode === "multi") {
			if (selectedMultiUnitIds.length === 0) {
				setFormError("Debes seleccionar al menos una unidad para compartir la flota.");
				return;
			}
			const selectedUnitsData = selectedMultiUnitIds.map((id) => {
				const found = units.find((u) => u.id === id);
				return {
					unitId: id,
					unitName: found?.name || `Unidad ${id}`,
					imei: found?.imei || null,
					initialPosition: found?.lat && found?.lon ? {
						lat: found.lat,
						lon: found.lon,
						speed: found.speed ?? 0,
						course: found.course ?? 0,
						time: found.lastMessage ?? Math.floor(Date.now() / 1e3)
					} : null
				};
			});
			const firstUnit = selectedUnitsData[0];
			const summaryName = selectedUnitsData.length > 1 ? `${selectedUnitsData.length} Unidades: ${selectedUnitsData.map((u) => u.unitName).slice(0, 2).join(", ")}${selectedUnitsData.length > 2 ? "..." : ""}` : firstUnit.unitName;
			createMutation.mutate({ data: {
				unitId: firstUnit.unitId,
				unitName: summaryName,
				imei: firstUnit.imei,
				units: selectedUnitsData,
				clientName: clientName.trim() || null,
				clientPhone: clientPhone.trim() || null,
				clientEmail: clientEmail.trim() || null,
				notes: notes.trim() || null,
				durationHours: isUnlimited ? 0 : durationHours,
				isUnlimited,
				host: session.host,
				sid: session.sid,
				wialonToken: tokenFromStorage,
				initialPosition: firstUnit.initialPosition
			} });
			return;
		}
		let unitName = customUnitName.trim();
		let imei = null;
		let initialPos = null;
		if (selectedUnitId !== "custom") {
			const found = units.find((u) => u.id === selectedUnitId);
			if (found) {
				unitName = found.name;
				imei = found.imei;
				if (found.lat && found.lon) initialPos = {
					lat: found.lat,
					lon: found.lon,
					speed: found.speed ?? 0,
					course: found.course ?? 0,
					time: found.lastMessage ?? Math.floor(Date.now() / 1e3)
				};
			}
		}
		if (!unitName) {
			setFormError("Debes seleccionar una unidad o escribir su nombre.");
			return;
		}
		const singleId = typeof selectedUnitId === "number" ? selectedUnitId : Math.floor(1e4 + Math.random() * 9e4);
		createMutation.mutate({ data: {
			unitId: singleId,
			unitName,
			imei,
			units: [{
				unitId: singleId,
				unitName,
				imei,
				initialPosition: initialPos
			}],
			clientName: clientName.trim() || null,
			clientPhone: clientPhone.trim() || null,
			clientEmail: clientEmail.trim() || null,
			notes: notes.trim() || null,
			durationHours: isUnlimited ? 0 : durationHours,
			isUnlimited,
			host: session.host,
			sid: session.sid,
			wialonToken: tokenFromStorage,
			initialPosition: initialPos
		} });
	}
	function copyShareUrl(token) {
		const url = `${window.location.origin}/rastreo/${token}`;
		navigator.clipboard.writeText(url);
		setCopiedToken(token);
		setTimeout(() => setCopiedToken(null), 3e3);
	}
	function getWhatsAppUrl(token, unitName, clientName, clientPhone) {
		const url = `${window.location.origin}/rastreo/${token}`;
		const msg = `${clientName ? `Hola ${clientName}, ` : "Hola, "}te comparto el enlace para seguir en tiempo real la unidad satelital *${unitName}*:\n\n${url}\n\nEnlace seguro con mapa en vivo y navegación Waze.`;
		const cleanPhone = clientPhone ? clientPhone.replace(/\D/g, "") : "";
		if (cleanPhone) return `https://api.whatsapp.com/send?phone=${cleanPhone.length === 10 ? `52${cleanPhone}` : cleanPhone}&text=${encodeURIComponent(msg)}`;
		return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-2xl font-bold uppercase tracking-wide flex items-center gap-2.5 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-6 text-primary" }), "Rastreo Compartido (Individual o Flota)"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Genera enlaces seguros temporales o permanentes con mapa en tiempo real para clientes o supervisores sin compartir tus credenciales."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setFormError(null);
						if (units.length > 0 && selectedUnitId === "custom") setSelectedUnitId(units[0].id);
						setCreateDialogOpen(true);
					},
					className: "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-lg hover:opacity-90 transition-all active:scale-95 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Compartir Unidad / Flota" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Enlaces Activos"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-2xl font-bold text-primary",
							children: activeCount
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Enlaces Expirados / Revocados"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-2xl font-bold text-muted-foreground",
							children: expiredCount
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Total Visualizaciones"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-2xl font-bold text-cyan-400",
							children: totalViews
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-5" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Buscar por unidad o cliente...",
						className: "w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => queryClient.invalidateQueries({ queryKey: ["unit-shares"] }),
					disabled: sharesQuery.isFetching,
					className: "flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors self-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-3.5 ${sharesQuery.isFetching ? "animate-spin text-primary" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Actualizar lista" })]
				})]
			}),
			sharesQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-[200px] items-center justify-center rounded-xl border border-border/60 bg-card/40 p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" })
			}) : filteredShares.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-dashed border-border/80 bg-card/40 p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "mx-auto size-12 text-muted-foreground/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-display text-base font-bold uppercase tracking-wider text-foreground",
						children: "No hay enlaces compartidos registrados"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground max-w-md mx-auto",
						children: search ? "No se encontraron enlaces con ese término de búsqueda." : "Genera un enlace para que tus clientes o supervisores puedan ver la unidad o flota en vivo en el mapa."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setCreateDialogOpen(true),
						className: "mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Crear Primer Enlace" })]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				children: filteredShares.map((link) => {
					const isUnlim = Boolean(link.isUnlimited || link.durationHours === 0);
					const isExpired = !isUnlim && (link.status === "expired" || new Date(link.expiresAt).getTime() <= now);
					const isRevoked = link.status === "revoked";
					const isActive = link.status === "active" && !isExpired && !isRevoked;
					const isMulti = link.units && link.units.length > 1;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `rounded-xl border transition-all p-5 bg-card/90 shadow-sm ${isActive ? "border-primary/40 hover:border-primary shadow-[0_0_15px_rgba(146,215,0,0.05)]" : "border-border/60 opacity-80"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-display text-base font-bold text-foreground flex items-center gap-2",
												children: [isMulti ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4 text-cyan-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { className: "size-4 text-primary" }), link.unitName]
											}),
											isMulti ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3" }),
													"Flota (",
													link.units?.length,
													" unidades)"
												]
											}) : null,
											isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-emerald-400 animate-pulse" }), "Activo en Vivo"]
											}) : isRevoked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-400",
												children: "Revocado"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400",
												children: "Expirado"
											}),
											isUnlim ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-0.5 text-xs font-bold text-emerald-300",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Infinity$1, { className: "size-3" }), "Sin Límite"]
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1 text-xs text-muted-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5 text-cyan-400" }),
													link.viewCount || 0,
													" visitas"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
										children: [
											link.clientName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: "Cliente:"
												}),
												" ",
												link.clientName
											] }) : null,
											link.clientPhone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: "Tel:"
												}),
												" ",
												link.clientPhone
											] }) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: "Vigencia:"
												}),
												" ",
												isUnlim ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald-400 font-semibold flex-inline items-center gap-1",
													children: "Permanente (Sin límite de tiempo)"
												}) : `${link.durationHours}h (expira ${new Date(link.expiresAt).toLocaleTimeString("es-MX", {
													hour: "2-digit",
													minute: "2-digit",
													day: "2-digit",
													month: "short"
												})})`
											] })
										]
									}),
									link.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground italic line-clamp-1",
										children: [
											"“",
											link.notes,
											"”"
										]
									}) : null
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => copyShareUrl(link.token),
										className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors",
										children: copiedToken === link.token ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary",
											children: "Copiado"
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copiar" })] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: getWhatsAppUrl(link.token, link.unitName, link.clientName, link.clientPhone),
										target: "_blank",
										rel: "noreferrer",
										className: "inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 transition-colors",
										title: "Enviar por WhatsApp",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden sm:inline",
											children: "WhatsApp"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: `/rastreo/${link.token}`,
										target: "_blank",
										rel: "noreferrer",
										className: "inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ver Mapa" })]
									}),
									isActive && !isUnlim ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => extendMutation.mutate({ data: {
											token: link.token,
											hours: 4
										} }),
										disabled: extendMutation.isPending,
										className: "rounded-lg border border-border bg-background px-2.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors",
										title: "Extender 4 horas más",
										children: "+4h"
									}) : null,
									isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											if (confirm(`¿Deseas revocar el enlace de "${link.unitName}" de inmediato?`)) revokeMutation.mutate({ data: { token: link.token } });
										},
										disabled: revokeMutation.isPending,
										className: "rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-colors",
										title: "Revocar enlace ahora",
										children: "Revocar"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											if (confirm(`¿Eliminar este registro de enlace compartido?`)) deleteMutation.mutate({ data: { token: link.token } });
										},
										disabled: deleteMutation.isPending,
										className: "rounded-lg border border-border bg-background p-2 text-muted-foreground hover:text-destructive transition-colors",
										title: "Eliminar registro",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
									})
								]
							})]
						})
					}, link.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createDialogOpen,
				onOpenChange: setCreateDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-xl max-h-[90vh] overflow-y-auto bg-card text-foreground border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display text-lg font-bold uppercase tracking-wider text-primary flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-5" }), "Compartir Ubicación Satelital en Vivo"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Genera un enlace público en tiempo real para clientes o proveedores. Puedes compartir una unidad o una flota completa."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateSubmit,
						className: "space-y-4 mt-2",
						children: [
							formError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formError })]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5 block",
								children: "Modalidad de Compartición *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/60 border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setShareMode("single"),
									className: `flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all ${shareMode === "single" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unidad Individual" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setShareMode("multi");
										if (selectedMultiUnitIds.length === 0 && units.length > 0) if (typeof selectedUnitId === "number") setSelectedMultiUnitIds([selectedUnitId]);
										else setSelectedMultiUnitIds(units.slice(0, 3).map((u) => u.id));
									},
									className: `flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all ${shareMode === "multi" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Multi-Unidad (Flota)" }),
										selectedMultiUnitIds.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-primary-foreground/20 px-1.5 py-0.5 text-[10px]",
											children: selectedMultiUnitIds.length
										}) : null
									]
								})]
							})] }),
							shareMode === "single" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold uppercase tracking-wider text-foreground",
									children: "Selecciona la Unidad *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: selectedUnitId,
									onChange: (e) => {
										const val = e.target.value;
										setSelectedUnitId(val === "custom" ? "custom" : Number(val));
									},
									className: "mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary",
									children: [units.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
										label: "Unidades de tu cuenta",
										children: units.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: u.id,
											children: [
												u.name,
												" ",
												u.online ? "(En línea 🟢)" : "(Última conexión)"
											]
										}, u.id))
									}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "custom",
										children: "+ Escribir nombre de unidad manualmente"
									})]
								})] }), selectedUnitId === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold uppercase tracking-wider text-foreground",
									children: "Nombre o Placa del Vehículo *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: customUnitName,
									onChange: (e) => setCustomUnitName(e.target.value),
									placeholder: "Ej. Nissan NP300 - JHL492",
									className: "mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary",
									required: true
								})] }) : null]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5 rounded-xl border border-border/80 bg-background/50 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3.5" }),
												"Seleccionar Unidades de la Flota (",
												selectedMultiUnitIds.length,
												" seleccionadas)"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: handleSelectAllMultiUnits,
													className: "text-[11px] font-semibold text-primary hover:underline",
													children: [
														"Todas (",
														units.length,
														")"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-border",
													children: "|"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: handleDeselectAllMultiUnits,
													className: "text-[11px] font-medium text-muted-foreground hover:text-foreground",
													children: "Limpiar"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: multiUnitFilter,
											onChange: (e) => setMultiUnitFilter(e.target.value),
											placeholder: "Filtrar unidades por nombre o IMEI...",
											className: "w-full rounded-md border border-input bg-background pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "max-h-48 overflow-y-auto space-y-1.5 pr-1 border border-border/60 rounded-lg p-2 bg-card/60",
										children: filteredModalUnits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground text-center py-4",
											children: "No se encontraron unidades en tu cuenta."
										}) : filteredModalUnits.map((u) => {
											const isChecked = selectedMultiUnitIds.includes(u.id);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												onClick: () => handleToggleMultiUnit(u.id),
												className: `flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-xs cursor-pointer transition-all border ${isChecked ? "bg-cyan-500/10 border-cyan-500/40 text-foreground" : "bg-background/80 border-border/60 text-muted-foreground hover:border-border"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5 min-w-0",
													children: [isChecked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "size-4 text-cyan-400 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "font-semibold text-xs truncate text-foreground flex items-center gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2 rounded-full shrink-0 ${u.online ? "bg-emerald-400" : "bg-slate-500"}` }), u.name]
														}), u.imei ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-[10px] text-muted-foreground font-mono",
															children: ["IMEI: ", u.imei]
														}) : null]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-right text-[10px] shrink-0 font-mono text-muted-foreground",
													children: u.speed ? `${Math.round(u.speed)} km/h` : "Detenido"
												})]
											}, u.id);
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-primary" }), "Vigencia del Enlace *"]
										}), isUnlimited ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] font-bold text-emerald-400 flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Infinity$1, { className: "size-3.5" }), "Sin límite (Permanente)"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] font-semibold text-cyan-400 font-mono",
											children: [durationHours, " horas"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-3 sm:grid-cols-5 gap-2",
										children: PRESET_DURATIONS.map((preset) => {
											const isSelected = preset.isUnlimited ? isUnlimited : !isUnlimited && durationHours === preset.hours;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setIsUnlimited(preset.isUnlimited);
													if (!preset.isUnlimited) setDurationHours(preset.hours);
												},
												className: `rounded-lg border px-2 py-2 text-xs font-bold uppercase transition-all ${isSelected ? preset.isUnlimited ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]" : "border-primary bg-primary/10 text-primary shadow-sm" : "border-border text-muted-foreground hover:bg-muted"}`,
												children: preset.label
											}, preset.label);
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: () => setIsUnlimited((prev) => !prev),
										className: `flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${isUnlimited ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300" : "bg-background border-border text-muted-foreground hover:border-border/80"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Infinity$1, { className: `size-4 ${isUnlimited ? "text-emerald-400" : "text-muted-foreground"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-foreground",
												children: "Acceso Permanente (Sin caducidad automática)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground",
												children: "El enlace se mantendrá activo hasta que lo revoques manualmente."
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: isUnlimited,
											onChange: (e) => setIsUnlimited(e.target.checked),
											className: "rounded border-border text-emerald-500 focus:ring-emerald-500"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-foreground",
									children: "Nombre del Cliente / Destinatario"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: clientName,
									onChange: (e) => setClientName(e.target.value),
									placeholder: "Ej. Distribuidora López",
									className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-foreground",
									children: "WhatsApp / Teléfono (opcional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "tel",
									value: clientPhone,
									onChange: (e) => setClientPhone(e.target.value),
									placeholder: "Ej. 3318359421",
									className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-foreground",
								children: "Motivo / Instrucciones de Monitoreo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: notes,
								onChange: (e) => setNotes(e.target.value),
								placeholder: "Ej. Seguimiento de entrega con ruta Vallarta - Guadalajara",
								rows: 2,
								className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-3 pt-3 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setCreateDialogOpen(false),
									className: "rounded-lg border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted",
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: createMutation.isPending,
									className: "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground shadow hover:opacity-90 disabled:opacity-50",
									children: createMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Generando..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Crear y Obtener Enlace" })] })
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(successLink),
				onOpenChange: () => setSuccessLink(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md bg-card text-foreground border-border text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-primary shadow-[0_0_25px_rgba(146,215,0,0.2)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-7" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-display text-xl font-bold uppercase tracking-wide text-foreground mt-3",
							children: "¡Enlace Generado con Éxito!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-xs text-muted-foreground mt-1",
							children: [
								"El enlace de rastreo en tiempo real para ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: successLink?.unitName }),
								" ya está activo y disponible."
							]
						}),
						successLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 mt-4 text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-border/80 bg-background p-3 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono break-all text-primary select-all",
										children: typeof window !== "undefined" ? `${window.location.origin}/rastreo/${successLink.token}` : ""
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Vigencia:" }),
										" ",
										successLink.isUnlimited || successLink.durationHours === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-400 font-semibold",
											children: "Permanente"
										}) : `${successLink.durationHours} horas`
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Estado:" }),
										" ",
										successLink.isUnlimited || successLink.durationHours === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-400",
											children: "Sin caducidad"
										}) : `Expira ${new Date(successLink.expiresAt).toLocaleTimeString("es-MX", {
											hour: "2-digit",
											minute: "2-digit"
										})}`
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => copyShareUrl(successLink.token),
										className: "flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 px-3 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground shadow hover:opacity-90",
										children: copiedToken === successLink.token ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "¡Copiado!" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copiar Enlace" })] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: getWhatsAppUrl(successLink.token, successLink.unitName, successLink.clientName, successLink.clientPhone),
										target: "_blank",
										rel: "noreferrer",
										className: "flex items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 py-2.5 px-3 text-xs font-semibold uppercase tracking-wider text-emerald-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mandar por WhatsApp" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `/rastreo/${successLink.token}`,
									target: "_blank",
									rel: "noreferrer",
									className: "flex items-center justify-center gap-1.5 text-xs text-cyan-400 hover:underline pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Probar y abrir vista de cliente" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
								})
							]
						}) : null
					]
				})
			})
		]
	});
}
//#endregion
export { WialonSharePageWrapper as component };
