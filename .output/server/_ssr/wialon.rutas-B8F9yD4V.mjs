import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { b as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { C as Navigation, F as Link2, G as Eye, K as EyeOff, N as Lock, O as Map, Z as Clock3, b as Plus, ct as Building2, g as RefreshCw, h as RotateCcw, it as Check, m as Route, q as ExternalLink, s as Trash2 } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { o as shareUserRoute, r as getReportEmails } from "./route-share.functions-Bx8zfbBm.mjs";
import { a as wialonCreateRoute, c as wialonGeocodeAddresses, f as wialonLogisticsRoutes, h as wialonPlanRoute, l as wialonGeofences, n as getUserRoutes, o as wialonDeleteGeofence, r as saveUserRoute, t as deleteUserRoute } from "./wialon.functions-CrsvbLcr.mjs";
import { t as WialonGuard } from "./wialon-guard-JCWFzsMD.mjs";
import { t as PlatformHeader } from "./PlatformHeader-DCauCIy8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wialon.rutas-B8F9yD4V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inputClass = "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary";
function formatDistance(meters) {
	return meters >= 1e3 ? `${(meters / 1e3).toFixed(1)} km` : `${Math.round(meters)} m`;
}
function formatDuration(seconds) {
	const minutes = Math.max(1, Math.round(seconds / 60));
	if (minutes < 60) return `${minutes} min`;
	const hours = Math.floor(minutes / 60);
	const remaining = minutes % 60;
	return remaining > 0 ? `${hours} h ${remaining} min` : `${hours} h`;
}
function stopCoordinates(stop) {
	return `${stop.lat},${stop.lon}`;
}
function buildGoogleMapsUrls(route) {
	const origin = route.stops.find((stop) => stop.isOrigin) ?? route.stops[0];
	const destinations = route.stops.filter((stop) => !stop.isOrigin);
	if (!origin || destinations.length === 0) return [];
	const sequence = route.returnToOrigin ? [
		origin,
		...destinations,
		origin
	] : [origin, ...destinations];
	const urls = [];
	const maxWaypoints = 9;
	for (let start = 0; start < sequence.length - 1;) {
		const end = Math.min(start + maxWaypoints + 1, sequence.length - 1);
		const params = new URLSearchParams({
			api: "1",
			origin: stopCoordinates(sequence[start]),
			destination: stopCoordinates(sequence[end]),
			travelmode: "driving"
		});
		const waypoints = sequence.slice(start + 1, end).map((stop) => stopCoordinates(stop)).join("|");
		if (waypoints) params.set("waypoints", waypoints);
		urls.push(`https://www.google.com/maps/dir/?${params.toString()}`);
		start = end;
	}
	return urls;
}
function buildGoogleMapsUrlForPoints(points) {
	if (points.length < 2) return null;
	const origin = `${points[0].lat},${points[0].lon}`;
	const dest = `${points[points.length - 1].lat},${points[points.length - 1].lon}`;
	const waypoints = points.slice(1, -1).slice(0, 8).map((p) => `${p.lat},${p.lon}`).join("|");
	const params = new URLSearchParams({
		api: "1",
		origin,
		destination: dest,
		travelmode: "driving"
	});
	if (waypoints) params.set("waypoints", waypoints);
	return `https://www.google.com/maps/dir/?${params.toString()}`;
}
function buildWazeUrl(stop) {
	return `https://www.waze.com/ul?${new URLSearchParams({
		ll: stopCoordinates(stop),
		navigate: "yes"
	}).toString()}`;
}
function RutasView({ session }) {
	const fetchGeofences = useServerFn(wialonGeofences);
	useServerFn(wialonCreateRoute);
	const deleteRoute = useServerFn(wialonDeleteGeofence);
	const geocodeAddresses = useServerFn(wialonGeocodeAddresses);
	const planRoute = useServerFn(wialonPlanRoute);
	const fetchUserRoutes = useServerFn(getUserRoutes);
	const saveUserRouteFn = useServerFn(saveUserRoute);
	const deleteUserRouteFn = useServerFn(deleteUserRoute);
	const queryClient = useQueryClient();
	const [name, setName] = import_react.useState("");
	const ROUTE_COLOR = "#92d700";
	const [filterResourceId, setFilterResourceId] = import_react.useState("all");
	const [resourceId, setResourceId] = import_react.useState(null);
	const [focusedRouteId, setFocusedRouteId] = import_react.useState(null);
	const [focusedUserRouteId, setFocusedUserRouteId] = import_react.useState(null);
	const [origin, setOrigin] = import_react.useState("");
	const [addresses, setAddresses] = import_react.useState([""]);
	const [returnToOrigin, setReturnToOrigin] = import_react.useState(true);
	const [inputMode, setInputMode] = import_react.useState("addresses");
	const [geocodedAddresses, setGeocodedAddresses] = import_react.useState([]);
	const [plannedRoute, setPlannedRoute] = import_react.useState(null);
	const [drawing, setDrawing] = import_react.useState(false);
	const [, setDrawingResetKey] = import_react.useState(0);
	const [draft, setDraft] = import_react.useState(null);
	const [busy, setBusy] = import_react.useState(false);
	const [deletingId, setDeletingId] = import_react.useState(null);
	const [deletingUserRouteId, setDeletingUserRouteId] = import_react.useState(null);
	const [sharingUserRouteId, setSharingUserRouteId] = import_react.useState(null);
	const [copiedUserRouteId, setCopiedUserRouteId] = import_react.useState(null);
	const [confirmDeleteUserRouteId, setConfirmDeleteUserRouteId] = import_react.useState(null);
	const [confirmDeleteWialonRouteId, setConfirmDeleteWialonRouteId] = import_react.useState(null);
	const [syncToWialon, setSyncToWialon] = import_react.useState(false);
	const [geocoding, setGeocoding] = import_react.useState(false);
	const [planning, setPlanning] = import_react.useState(false);
	const [message, setMessage] = import_react.useState(null);
	const [error, setError] = import_react.useState(null);
	const userRoutesQuery = useQuery({
		queryKey: ["user-routes", session.userId],
		queryFn: () => fetchUserRoutes({ data: {
			userId: session.userId,
			host: session.host,
			sid: session.sid
		} })
	});
	const userRoutes = userRoutesQuery.data?.routes ?? [];
	const query = useQuery({
		queryKey: ["wialon-geofences", session.sid],
		queryFn: () => fetchGeofences({ data: {
			host: session.host,
			sid: session.sid
		} }),
		refetchInterval: 6e4
	});
	const allRoutes = (query.data?.zones ?? []).filter((zone) => zone.type === 1);
	const resources = query.data?.resources ?? [];
	const logisticsQuery = useQuery({
		queryKey: ["wialon-logistics-routes", session.sid],
		queryFn: () => wialonLogisticsRoutes({ data: {
			host: session.host,
			sid: session.sid
		} }),
		enabled: session.host === "full",
		refetchInterval: 6e4,
		retry: false
	});
	const logisticsRoutes = logisticsQuery.data?.routes ?? [];
	const [shownLogisticsIds, setShownLogisticsIds] = import_react.useState(/* @__PURE__ */ new Set());
	function toggleLogisticsRoute(id) {
		setShownLogisticsIds((current) => {
			const next = new Set(current);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}
	const visibleRoutes = filterResourceId === "all" ? allRoutes : allRoutes.filter((r) => r.resourceId === filterResourceId);
	const selectedResourceId = resourceId ?? (filterResourceId !== "all" ? filterResourceId : resources[0]?.id ?? null);
	const userMapRoutes = userRoutes.map((route) => ({
		id: route.id,
		name: route.name,
		resource: `Mi cuenta (${session.userName || "Privada"})`,
		type: 1,
		color: ROUTE_COLOR,
		points: route.points,
		...route.routeStops?.length ? { markerPoints: route.routeStops } : {}
	}));
	const mapRoutes = visibleRoutes.map((route) => ({
		id: route.id,
		name: route.name,
		resource: route.resource,
		type: route.type,
		color: ROUTE_COLOR,
		points: route.points
	}));
	const googleMapsUrls = plannedRoute ? buildGoogleMapsUrls(plannedRoute) : [];
	const nextWazeStop = plannedRoute?.stops.find((stop) => !stop.isOrigin) ?? null;
	function clearPlan(clearDraft = true) {
		setPlannedRoute(null);
		setGeocodedAddresses([]);
		if (clearDraft) setDraft(null);
		setMessage(null);
	}
	function updateOrigin(value) {
		setOrigin(value);
		setGeocodedAddresses([]);
		clearPlan();
	}
	function updateAddress(index, value) {
		setAddresses((current) => current.map((address, currentIndex) => currentIndex === index ? value : address));
		setGeocodedAddresses([]);
		clearPlan();
	}
	function addAddress() {
		setAddresses((current) => [...current, ""]);
	}
	function removeAddress(index) {
		setAddresses((current) => current.filter((_, currentIndex) => currentIndex !== index));
		setGeocodedAddresses([]);
		clearPlan();
	}
	function selectInputMode(mode) {
		setInputMode(mode);
		setError(null);
	}
	async function handleGeocodeAddresses() {
		const stops = addresses.map((address) => address.trim()).filter(Boolean);
		if (origin.trim().length < 3) {
			setError("Captura el punto de salida.");
			return;
		}
		if (stops.length === 0) {
			setError("Captura al menos una dirección de destino.");
			return;
		}
		setGeocoding(true);
		setError(null);
		setMessage(null);
		try {
			const result = await geocodeAddresses({ data: { addresses: [origin.trim(), ...stops] } });
			setGeocodedAddresses(result.locations.map((location, index) => ({
				...location,
				isOrigin: index === 0
			})));
			setMessage(`${result.locations.length} puntos ubicados en el mapa.`);
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "No se pudieron ubicar las direcciones.");
		} finally {
			setGeocoding(false);
		}
	}
	function startDrawing() {
		setError(null);
		setMessage(null);
		setPlannedRoute(null);
		setDraft({ points: [] });
		setDrawing(true);
		setDrawingResetKey((value) => value + 1);
	}
	function resetDrawing() {
		setPlannedRoute(null);
		setGeocodedAddresses([]);
		setDraft(null);
		setDrawing(false);
		setDrawingResetKey((value) => value + 1);
	}
	async function handlePlanRoute() {
		const drawnPoints = draft?.points ?? [];
		const isMapPlan = inputMode === "map";
		const stops = isMapPlan ? drawnPoints.slice(1).map((_, index) => `Punto ${index + 2}`) : addresses.map((address) => address.trim()).filter(Boolean);
		const planOrigin = isMapPlan ? "Punto 1" : origin.trim();
		const mapLocations = isMapPlan ? drawnPoints.map((point, index) => ({
			query: `Punto ${index + 1}`,
			label: `Punto ${index + 1}`,
			lat: point.lat,
			lon: point.lon
		})) : [];
		if (!isMapPlan && planOrigin.length < 3) {
			setError("Captura el punto de salida.");
			return;
		}
		if (stops.length === 0) {
			setError(isMapPlan ? "Dibuja al menos dos puntos en el mapa." : "Captura al menos una dirección de destino.");
			return;
		}
		setPlanning(true);
		setError(null);
		setMessage(null);
		try {
			const cachedLocations = !isMapPlan && geocodedAddresses.length === stops.length + 1 && geocodedAddresses[0]?.query === planOrigin && geocodedAddresses.slice(1).every((location, index) => location.query === stops[index]);
			const result = await planRoute({ data: {
				origin: planOrigin,
				addresses: stops,
				returnToOrigin,
				...isMapPlan ? { locations: mapLocations } : cachedLocations ? { locations: geocodedAddresses } : {}
			} });
			setPlannedRoute(result);
			setGeocodedAddresses(result.stops.map((stop) => ({
				query: stop.label,
				label: stop.label,
				lat: stop.lat,
				lon: stop.lon,
				isOrigin: stop.isOrigin
			})));
			setDraft({ points: result.points.map((point) => ({
				...point,
				radius: 0
			})) });
			setDrawing(false);
			setDrawingResetKey((value) => value + 1);
			if (!name.trim()) setName("Ruta optimizada");
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "No se pudo optimizar la ruta.");
		} finally {
			setPlanning(false);
		}
	}
	async function saveRoute(event) {
		event.preventDefault();
		if (!draft || draft.points.length < 2) {
			setError("Dibuja al menos dos puntos o genera una ruta antes de guardar.");
			return;
		}
		if (syncToWialon && !selectedResourceId) {
			setError("Selecciona un recurso de Wialon para sincronizar la ruta.");
			return;
		}
		setBusy(true);
		setError(null);
		setMessage(null);
		try {
			const isMapPlan = inputMode === "map";
			const originStr = isMapPlan ? "Punto 1 (Mapa)" : origin.trim();
			const stopsArr = isMapPlan ? [] : addresses.map((a) => a.trim()).filter(Boolean);
			const MAX_ROUTE_POINTS = 250;
			let routePoints = draft.points;
			if (routePoints.length > MAX_ROUTE_POINTS) {
				const step = (routePoints.length - 1) / 249;
				const sampled = [];
				for (let i = 0; i < MAX_ROUTE_POINTS; i++) sampled.push(routePoints[Math.round(i * step)]);
				routePoints = sampled;
			}
			const res = await saveUserRouteFn({ data: {
				userId: session.userId,
				userName: session.userName,
				name: name.trim(),
				color: ROUTE_COLOR,
				points: routePoints,
				routeStops: plannedRoute?.stops.map((stop) => ({
					lat: stop.lat,
					lon: stop.lon,
					label: stop.label
				})) ?? (isMapPlan ? draft.points.map((point, index) => ({
					lat: point.lat,
					lon: point.lon,
					label: index === 0 ? "Salida" : `Parada ${index}`
				})) : void 0),
				origin: originStr || void 0,
				addresses: stopsArr.length > 0 ? stopsArr : void 0,
				distanceMeters: plannedRoute?.distanceMeters,
				durationSeconds: plannedRoute?.durationSeconds,
				syncToWialon,
				host: session.host,
				sid: session.sid,
				resourceId: syncToWialon && selectedResourceId ? selectedResourceId : void 0
			} });
			setMessage(syncToWialon && res.wialonId ? `Ruta "${res.route.name}" guardada en tu cuenta y sincronizada en Wialon (#${res.wialonId}).` : `Ruta "${res.route.name}" guardada exitosamente en tu cuenta de usuario (privada).`);
			setName("");
			resetDrawing();
			clearPlan();
			await queryClient.invalidateQueries({ queryKey: ["user-routes", session.userId] });
			if (syncToWialon) await queryClient.invalidateQueries({ queryKey: ["wialon-geofences", session.sid] });
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "No se pudo guardar la ruta.");
		} finally {
			setBusy(false);
		}
	}
	async function handleRefresh() {
		setError(null);
		setMessage(null);
		await Promise.all([userRoutesQuery.refetch(), query.refetch()]);
		setMessage("Rutas sincronizadas.");
		setTimeout(() => setMessage(null), 3e3);
	}
	const [shareFormRouteId, setShareFormRouteId] = import_react.useState(null);
	const [shareEmail, setShareEmail] = import_react.useState("");
	const reportEmailsQuery = useQuery({
		queryKey: ["route-report-emails", session.userId],
		queryFn: () => getReportEmails({ data: { userId: session.userId } }),
		enabled: shareFormRouteId !== null
	});
	const savedReportEmails = reportEmailsQuery.data?.emails ?? [];
	function openShareForm(route) {
		setShareFormRouteId((current) => current === route.id ? null : route.id);
		setShareEmail(route.reportEmail ?? "");
	}
	async function handleShareUserRoute(route) {
		const email = shareEmail.trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Escribe el correo que recibirá el resumen del viaje.");
			return;
		}
		setSharingUserRouteId(route.id);
		setError(null);
		setMessage(null);
		try {
			const result = await shareUserRoute({ data: {
				userId: session.userId,
				routeId: route.id,
				reportEmail: email
			} });
			setShareFormRouteId(null);
			reportEmailsQuery.refetch();
			userRoutesQuery.refetch();
			const url = `${window.location.origin}/ruta/${result.token}`;
			try {
				await navigator.clipboard.writeText(url);
				setMessage(`Enlace de "${route.name}" copiado. Los operadores no necesitan iniciar sesión.`);
			} catch {
				window.prompt("Copia el enlace de la ruta:", url);
			}
			setCopiedUserRouteId(route.id);
			window.setTimeout(() => setCopiedUserRouteId(null), 4e3);
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "No se pudo generar el enlace de la ruta.");
		} finally {
			setSharingUserRouteId(null);
		}
	}
	async function handleDeleteUserRoute(route) {
		if (confirmDeleteUserRouteId !== route.id) {
			setConfirmDeleteUserRouteId(route.id);
			return;
		}
		setDeletingUserRouteId(route.id);
		setConfirmDeleteUserRouteId(null);
		setError(null);
		setMessage(null);
		try {
			await deleteUserRouteFn({ data: {
				userId: session.userId,
				routeId: route.id
			} });
			setMessage(`Ruta "${route.name}" eliminada de tu cuenta.`);
			if (focusedUserRouteId === route.id) setFocusedUserRouteId(null);
			await queryClient.invalidateQueries({ queryKey: ["user-routes", session.userId] });
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "No se pudo eliminar la ruta de tu cuenta.");
		} finally {
			setDeletingUserRouteId(null);
		}
	}
	async function handleDeleteWialonRoute(route) {
		if (confirmDeleteWialonRouteId !== route.id) {
			setConfirmDeleteWialonRouteId(route.id);
			return;
		}
		setDeletingId(route.id);
		setConfirmDeleteWialonRouteId(null);
		setError(null);
		setMessage(null);
		try {
			await deleteRoute({ data: {
				host: session.host,
				sid: session.sid,
				resourceId: route.resourceId,
				zoneId: route.id
			} });
			setMessage(`Ruta "${route.name}" eliminada de Wialon.`);
			if (focusedRouteId === route.id) setFocusedRouteId(null);
			await queryClient.invalidateQueries({ queryKey: ["wialon-geofences", session.sid] });
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "No se pudo eliminar la ruta de Wialon.");
		} finally {
			setDeletingId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformHeader, { session }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 rounded-xl border border-border/70 bg-card/60 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-sm font-bold uppercase tracking-wider text-foreground",
						children: "Rutas por Cliente / Recurso"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							resources.length,
							" recurso",
							resources.length !== 1 ? "s" : "",
							" disponible",
							resources.length !== 1 ? "s" : "",
							" en Wialon"
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "route-client-filter",
							className: "sr-only",
							children: "Filtrar por cliente o recurso"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "route-client-filter",
							className: "rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary sm:text-sm",
							value: filterResourceId,
							onChange: (e) => {
								const val = e.target.value;
								setFilterResourceId(val === "all" ? "all" : Number(val));
								setFocusedRouteId(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: "all",
								children: [
									"🌐 Todos los clientes (",
									allRoutes.length,
									" rutas)"
								]
							}), resources.map((res) => {
								const count = allRoutes.filter((r) => r.resourceId === res.id).length;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: res.id,
									children: [
										"👤 ",
										res.name,
										" (",
										count,
										" ruta",
										count !== 1 ? "s" : "",
										")"
									]
								}, res.id);
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleRefresh,
							disabled: query.isFetching,
							className: "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50",
							title: "Sincronizar y recargar rutas desde Wialon",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-3.5 ${query.isFetching ? "animate-spin text-primary" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: query.isFetching ? "Cargando…" : "Sincronizar" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.85fr)] xl:grid-cols-[minmax(0,1.45fr)_minmax(420px,0.8fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-xl border border-border/60 bg-card/40 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border/50 bg-background/50 px-4 py-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Mostrando ",
							userMapRoutes.length + mapRoutes.length,
							" ruta",
							userMapRoutes.length + mapRoutes.length !== 1 ? "s" : "",
							" en el mapa",
							userMapRoutes.length > 0 ? ` (${userMapRoutes.length} en tu cuenta)` : ""
						] }), focusedRouteId || focusedUserRouteId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setFocusedRouteId(null);
								setFocusedUserRouteId(null);
							},
							className: "text-primary hover:underline",
							children: "Restablecer vista general"
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[560px] rounded-lg border border-border/60 bg-card/40" }) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: saveRoute,
					className: "min-w-0 rounded-lg border border-border/60 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border/60 bg-card/40 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
								children: "Método de creación"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => selectInputMode("addresses"),
									className: `rounded-md border px-3 py-2 text-sm font-semibold ${inputMode === "addresses" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`,
									children: "Direcciones escritas"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => selectInputMode("map"),
									className: `rounded-md border px-3 py-2 text-sm font-semibold ${inputMode === "map" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`,
									children: "Puntos en mapa"
								})]
							})]
						}),
						inputMode === "addresses" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "mt-0.5 size-5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-sm font-bold uppercase tracking-widest",
										children: "Planificador inteligente"
									}) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mt-4 block text-sm",
									children: ["Punto de salida", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: origin,
										onChange: (event) => updateOrigin(event.target.value),
										className: inputClass,
										placeholder: "Ej. Av. Vallarta 1000, Guadalajara o coordenadas (20.67, -103.34)",
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm",
											children: "Direcciones de destino"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: addAddress,
											className: "inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Agregar"]
										})]
									}), addresses.map((address, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-5 shrink-0 text-center text-xs text-muted-foreground",
												children: index + 1
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: address,
												onChange: (event) => updateAddress(index, event.target.value),
												className: "min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary",
												placeholder: `Dirección ${index + 1}, lugar o link Google Maps`,
												required: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => removeAddress(index),
												disabled: addresses.length === 1,
												className: "rounded-md p-2 text-muted-foreground hover:text-destructive disabled:opacity-30",
												"aria-label": `Eliminar dirección ${index + 1}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
											})
										]
									}, index))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => void handleGeocodeAddresses(),
										disabled: geocoding,
										className: "w-full rounded-md border border-primary px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 disabled:cursor-wait disabled:opacity-60",
										children: geocoding ? "Buscando direcciones…" : "Buscar puntos en el mapa"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mt-4 flex cursor-pointer items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: returnToOrigin,
										onChange: (event) => {
											setReturnToOrigin(event.target.checked);
											clearPlan();
										},
										className: "size-4 accent-primary"
									}), "Regresar al punto de salida"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void handlePlanRoute(),
									disabled: planning,
									className: "mt-4 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:cursor-wait disabled:opacity-60",
									children: planning ? "Calculando ruta…" : "Optimizar ruta"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, { className: "mt-0.5 size-5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-sm font-bold uppercase tracking-widest",
										children: "Puntos en mapa"
									}) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: startDrawing,
									className: "mt-4 w-full rounded-md border border-primary px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10",
									children: drawing ? "Dibujando en el mapa…" : "Comenzar a dibujar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mt-4 flex cursor-pointer items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: returnToOrigin,
										onChange: (event) => {
											setReturnToOrigin(event.target.checked);
											clearPlan(false);
										},
										className: "size-4 accent-primary"
									}), "Regresar al punto de salida"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void handlePlanRoute(),
									disabled: planning || (draft?.points.length ?? 0) < 2,
									className: "mt-4 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60",
									children: planning ? "Calculando ruta…" : "Optimizar ruta"
								})
							]
						}),
						plannedRoute ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-lg border border-border/60 bg-card/40 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDistance(plannedRoute.distanceMeters) })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDuration(plannedRoute.durationSeconds) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
									children: "Orden recomendado"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "mt-2 max-h-40 space-y-1 overflow-auto text-xs",
									children: plannedRoute.stops.map((stop, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-5 shrink-0 text-right text-muted-foreground",
											children: stop.isOrigin ? "S" : index
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "truncate",
											children: [stop.isOrigin ? "Salida · " : "", stop.label]
										})]
									}, `${stop.lat}-${stop.lon}-${index}`))
								}),
								plannedRoute.returnToOrigin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-primary",
									children: "La ruta considera el regreso al origen."
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 border-t border-border/60 pt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
										children: "Exportar navegación"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap gap-2",
										children: [googleMapsUrls.length === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: googleMapsUrls[0],
											target: "_blank",
											rel: "noreferrer",
											className: "inline-flex items-center gap-1.5 rounded-md border border-primary/50 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), " Abrir en Google Maps"]
										}) : googleMapsUrls.map((url, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: url,
											target: "_blank",
											rel: "noreferrer",
											className: "inline-flex items-center gap-1.5 rounded-md border border-primary/50 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }),
												" Google Maps · tramo ",
												index + 1
											]
										}, url)), nextWazeStop ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: buildWazeUrl(nextWazeStop),
											target: "_blank",
											rel: "noreferrer",
											className: "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), " Abrir siguiente parada en Waze"]
										}) : null]
									})]
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-sm font-bold uppercase tracking-widest",
								children: "Nueva ruta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [draft?.points.length ?? 0, " puntos dibujados"]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: resetDrawing,
								className: "rounded-md border border-border p-2 text-muted-foreground hover:border-primary hover:text-primary",
								"aria-label": "Borrar ruta actual",
								title: "Borrar ruta actual",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-5 block text-sm",
							children: ["Nombre", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (event) => setName(event.target.value),
								className: inputClass,
								placeholder: "Ej. Ruta centro - almacén",
								required: true,
								minLength: 2,
								maxLength: 100
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 flex cursor-pointer items-center gap-2 text-sm text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: syncToWialon,
								onChange: (e) => setSyncToWialon(e.target.checked),
								className: "size-4 rounded border-border accent-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sincronizar también en Wialon (recurso del cliente)" })]
						}),
						syncToWialon ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 block text-sm",
							children: ["Recurso de Wialon", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: inputClass,
								value: selectedResourceId ?? "",
								onChange: (event) => setResourceId(Number(event.target.value)),
								required: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									disabled: true,
									children: "Selecciona un recurso"
								}), resources.map((resource) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: resource.id,
									children: resource.name
								}, resource.id))]
							})]
						}) : null,
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-destructive",
							children: error
						}) : null,
						message ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 flex items-center gap-2 text-sm text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), message]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy || !name.trim() || syncToWialon && !selectedResourceId || !draft || draft.points.length < 2,
							className: "mt-5 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50",
							children: busy ? "Guardando…" : syncToWialon ? "Guardar en cuenta y Wialon" : "Guardar en mi cuenta"
						})
					]
				})]
			}),
			session.host === "full" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-base font-bold uppercase tracking-wide text-foreground",
							children: "Rutas de Wialon Logistics"
						}) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary",
						children: [
							logisticsRoutes.length,
							" ruta",
							logisticsRoutes.length !== 1 ? "s" : ""
						]
					})]
				}), logisticsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-10 text-center text-sm text-muted-foreground",
					children: "Cargando rutas de Logistics…"
				}) : logisticsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-10 text-center text-sm text-muted-foreground",
					children: "No se pudieron leer las rutas de Logistics. Verifica que tu cuenta tenga acceso a la aplicación Logistics."
				}) : logisticsRoutes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-10 text-center text-sm text-muted-foreground",
					children: "No hay rutas creadas en Wialon Logistics para esta cuenta."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: logisticsRoutes.map((route) => {
						const isShown = shownLogisticsIds.has(route.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex flex-col justify-between rounded-lg border bg-background/60 p-3.5 transition-colors ${isShown ? "border-primary ring-1 ring-primary/40 shadow-sm" : "border-border/70 hover:border-primary/50"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-3.5 shrink-0 items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full border border-white bg-[#92d700] shadow-[0_0_6px_rgba(146,215,0,0.6)]" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "truncate font-semibold text-sm text-foreground",
									title: route.name,
									children: route.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded bg-muted/50 px-1.5 py-0.5 font-mono",
										children: [
											route.points.length,
											" punto",
											route.points.length !== 1 ? "s" : ""
										]
									}),
									route.ordersCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded bg-muted/50 px-1.5 py-0.5 font-mono",
										children: [
											route.ordersCount,
											" pedido",
											route.ordersCount !== 1 ? "s" : ""
										]
									}) : null,
									route.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-muted/50 px-1.5 py-0.5",
										children: route.status
									}) : null
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex items-center justify-end border-t border-border/40 pt-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => toggleLogisticsRoute(route.id),
									disabled: route.points.length === 0,
									className: `inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${isShown ? "bg-primary text-primary-foreground font-semibold" : "text-primary hover:bg-primary/10"}`,
									title: route.points.length === 0 ? "Esta ruta no tiene puntos para dibujar" : isShown ? "Quitar del mapa" : "Ver en el mapa",
									children: [isShown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isShown ? "En el mapa" : "Ver en mapa" })]
								})
							})]
						}, route.id);
					})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-base font-bold uppercase tracking-wide text-foreground",
							children: "Rutas guardadas"
						}) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary",
						children: [
							userRoutes.length + visibleRoutes.length,
							" ruta",
							userRoutes.length + visibleRoutes.length !== 1 ? "s" : ""
						]
					})]
				}), userRoutes.length === 0 && visibleRoutes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-10 text-center text-sm text-muted-foreground",
					children: userRoutesQuery.isLoading || query.isLoading ? "Cargando rutas…" : "Aún no hay rutas guardadas. Traza o genera una arriba."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: [userRoutes.map((route) => {
						const isDeleting = deletingUserRouteId === route.id;
						const isFocused = focusedUserRouteId === route.id;
						const isConfirming = confirmDeleteUserRouteId === route.id;
						const gmapsUrl = buildGoogleMapsUrlForPoints(route.routeStops?.length ? route.routeStops : route.points);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex flex-col justify-between rounded-lg border bg-background/60 p-3.5 transition-colors ${isFocused ? "border-primary ring-1 ring-primary/40 shadow-sm" : "border-border/70 hover:border-primary/50"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-start justify-between gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex size-3.5 shrink-0 items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full border border-white bg-[#92d700] shadow-[0_0_6px_rgba(146,215,0,0.6)]" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "truncate font-semibold text-sm text-foreground",
												title: route.name,
												children: route.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [new Date(route.createdAt).toLocaleDateString("es-MX", {
													day: "2-digit",
													month: "short",
													year: "numeric"
												}), route.distanceMeters ? ` · ${formatDistance(route.distanceMeters)}` : ""]
											})]
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-muted/50 px-1.5 py-0.5 font-mono",
										children: route.addresses && route.addresses.length > 0 ? `${route.addresses.length} parada${route.addresses.length === 1 ? "" : "s"}` : `${route.points.length} puntos`
									}), route.origin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "truncate max-w-[200px]",
										title: route.origin,
										children: ["📍 ", route.origin]
									}) : null]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center justify-between border-t border-border/40 pt-2.5 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													setFocusedRouteId(null);
													setFocusedUserRouteId(route.id);
												},
												className: `inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${isFocused ? "bg-primary text-primary-foreground font-semibold" : "text-primary hover:bg-primary/10"}`,
												title: "Ver trazo en el mapa",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isFocused ? "Viendo" : "Ver" })]
											}),
											gmapsUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: gmapsUrl,
												target: "_blank",
												rel: "noreferrer",
												className: "inline-flex items-center gap-1 rounded px-1.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
												title: "Abrir en Google Maps",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => openShareForm(route),
												disabled: sharingUserRouteId === route.id,
												className: `inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors disabled:opacity-50 ${copiedUserRouteId === route.id ? "bg-primary/15 text-primary font-semibold" : "text-primary hover:bg-primary/10"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sharingUserRouteId === route.id ? "…" : copiedUserRouteId === route.id ? "¡Copiado!" : "Enlace" })]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => handleDeleteUserRoute(route),
										disabled: isDeleting,
										className: `inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${isConfirming ? "bg-destructive text-destructive-foreground font-bold" : "text-destructive hover:bg-destructive/10"} disabled:opacity-50`,
										title: isConfirming ? "Confirmar eliminación" : "Eliminar de tu cuenta",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isDeleting ? "…" : isConfirming ? "¿Seguro?" : "Borrar" })]
									})]
								}),
								shareFormRouteId === route.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									className: "mt-3 flex flex-wrap items-center gap-2 border-t border-border/50 pt-3",
									onSubmit: (e) => {
										e.preventDefault();
										handleShareUserRoute(route);
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "email",
											required: true,
											"aria-label": "Correo para el resumen del viaje y notas",
											list: `report-emails-${route.id}`,
											value: shareEmail,
											onChange: (e) => setShareEmail(e.target.value),
											placeholder: "Correo para resumen y notas",
											className: "min-w-0 flex-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
											id: `report-emails-${route.id}`,
											children: savedReportEmails.map((email) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: email }, email))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											disabled: sharingUserRouteId === route.id,
											className: "rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50",
											children: sharingUserRouteId === route.id ? "…" : "Generar enlace"
										})
									]
								}) : null
							]
						}, route.id);
					}), visibleRoutes.map((route) => {
						const isDeleting = deletingId === route.id;
						const isFocused = focusedRouteId === route.id;
						const isConfirming = confirmDeleteWialonRouteId === route.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex flex-col justify-between rounded-lg border bg-background/60 p-3.5 transition-colors ${isFocused ? "border-primary ring-1 ring-primary/40 shadow-sm" : "border-border/70 hover:border-primary/50"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-start justify-between gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-3.5 shrink-0 items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full border border-white bg-[#92d700] shadow-[0_0_6px_rgba(146,215,0,0.6)]" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "truncate font-semibold text-sm text-foreground",
											title: route.name,
											children: route.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-xs text-muted-foreground",
											title: route.resource,
											children: ["👤 ", route.resource]
										})]
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between border-t border-border/40 pt-2.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [route.points.length, " puntos"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											setFocusedUserRouteId(null);
											setFocusedRouteId(route.id);
										},
										className: `inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${isFocused ? "bg-primary text-primary-foreground font-semibold" : "text-primary hover:bg-primary/10"}`,
										title: "Ver trazo en el mapa",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isFocused ? "Viendo" : "Ver" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => handleDeleteWialonRoute(route),
										disabled: isDeleting,
										className: `inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${isConfirming ? "bg-destructive text-destructive-foreground font-bold" : "text-destructive hover:bg-destructive/10"} disabled:opacity-50`,
										title: isConfirming ? "Confirmar eliminación en Wialon" : "Eliminar de Wialon",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isDeleting ? "…" : isConfirming ? "¿Seguro?" : "Borrar" })]
									})]
								})]
							})]
						}, `${route.resourceId}-${route.id}`);
					})]
				})]
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WialonGuard, { children: (session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RutasView, { session }) });
//#endregion
export { SplitComponent as component };
