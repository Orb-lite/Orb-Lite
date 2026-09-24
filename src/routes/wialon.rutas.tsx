import * as React from "react";
import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Trash2, Undo2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WialonGuard } from "@/components/wialon-guard";
import { wialonDeleteRoute, wialonRouteResources, wialonSaveRoute } from "@/lib/wialon.functions";
import type { WialonSession } from "@/lib/wialon-session";

const RouteBuilderMap = React.lazy(() => import("@/components/wialon/RouteBuilderMap"));

export const Route = createFileRoute("/wialon/rutas")({
  head: () => ({
    meta: [
      { title: "Creador de rutas | Plataforma ORB-LITE" },
      { name: "description", content: "Dibuja rutas en el mapa y guárdalas en tu cuenta ORB-LITE u ORB-FULL." },
      { property: "og:title", content: "Creador de rutas | Plataforma ORB-LITE" },
      { property: "og:description", content: "Dibuja y guarda rutas para tus unidades." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <WialonGuard>{(session) => <RutasView session={session} />}</WialonGuard>,
});

type Point = { lat: number; lon: number };

function distanceKm(points: Point[]) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    const rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad;
    const dLon = (b.lon - a.lon) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
    total += 2 * 6371 * Math.asin(Math.sqrt(h));
  }
  return total;
}

function RutasView({ session }: { session: WialonSession }) {
  const qc = useQueryClient();
  const fetchData = useServerFn(wialonRouteResources);
  const saveRoute = useServerFn(wialonSaveRoute);
  const deleteRoute = useServerFn(wialonDeleteRoute);

  const query = useQuery({
    queryKey: ["wialon-routes", session.host, session.sid],
    queryFn: () => fetchData({ data: { host: session.host, sid: session.sid } }),
  });
  const resources = query.data?.resources ?? [];
  const routes = query.data?.routes ?? [];

  const [points, setPoints] = React.useState<Point[]>([]);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [width, setWidth] = React.useState(50);
  const [color, setColor] = React.useState("#a3e635");
  const [resourceId, setResourceId] = React.useState<number | null>(null);
  const [preview, setPreview] = React.useState<Point[] | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<{ ok: boolean; text: string } | null>(null);

  const selectedResource = resourceId ?? resources[0]?.id ?? null;
  const inputClass = "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedResource || points.length < 2 || !name.trim()) return;
    setBusy(true);
    setMessage(null);
    try {
      await saveRoute({
        data: { host: session.host, sid: session.sid, resourceId: selectedResource, name, description, width, color, points },
      });
      setMessage({ ok: true, text: `Ruta "${name}" guardada en la plataforma.` });
      setPoints([]);
      setName("");
      setDescription("");
      await qc.invalidateQueries({ queryKey: ["wialon-routes"] });
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "No se pudo guardar la ruta." });
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(resId: number, routeId: number, routeName: string) {
    if (!confirm(`¿Borrar la ruta "${routeName}"?`)) return;
    try {
      await deleteRoute({ data: { host: session.host, sid: session.sid, resourceId: resId, routeId } });
      await qc.invalidateQueries({ queryKey: ["wialon-routes"] });
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "No se pudo borrar la ruta." });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Haz clic en el mapa para agregar puntos. Arrastra un punto para moverlo.
        </p>
        <ClientOnly fallback={<div className="h-[520px] rounded-lg border border-border/60 bg-card/40" />}>
          <React.Suspense fallback={<div className="h-[520px] rounded-lg border border-border/60 bg-card/40" />}>
            <RouteBuilderMap
              points={points}
              color={color}
              preview={preview}
              onAddPoint={(p) => setPoints((prev) => [...prev, p])}
              onMovePoint={(i, p) => setPoints((prev) => prev.map((old, idx) => (idx === i ? p : old)))}
            />
          </React.Suspense>
        </ClientOnly>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            {points.length} puntos · {distanceKm(points).toFixed(2)} km
          </span>
          <Button type="button" variant="outline" size="sm" disabled={!points.length} onClick={() => setPoints((p) => p.slice(0, -1))}>
            <Undo2 /> Deshacer punto
          </Button>
          <Button type="button" variant="outline" size="sm" disabled={!points.length} onClick={() => setPoints([])}>
            <Trash2 /> Limpiar
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <form onSubmit={onSave} className="space-y-4 rounded-lg border border-border/60 p-4">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide">Nueva ruta</h2>
          <label className="block text-sm">
            Nombre
            <input className={inputClass} value={name} maxLength={100} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="block text-sm">
            Descripción (opcional)
            <input className={inputClass} value={description} maxLength={500} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label className="block text-sm">
            Guardar en
            <select className={inputClass} value={selectedResource ?? ""} onChange={(e) => setResourceId(Number(e.target.value))}>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              Ancho (m)
              <input type="number" min={10} max={2000} className={inputClass} value={width} onChange={(e) => setWidth(Number(e.target.value) || 50)} />
            </label>
            <label className="block text-sm">
              Color
              <input type="color" className={`${inputClass} h-10 p-1`} value={color} onChange={(e) => setColor(e.target.value)} />
            </label>
          </div>
          <Button type="submit" className="w-full" disabled={busy || points.length < 2 || !name.trim() || !selectedResource}>
            {busy ? <LoaderCircle className="animate-spin" /> : null} Guardar ruta
          </Button>
          {points.length < 2 ? <p className="text-xs text-muted-foreground">Marca al menos 2 puntos en el mapa.</p> : null}
          {message ? <p className={`text-sm ${message.ok ? "text-primary" : "text-destructive"}`}>{message.text}</p> : null}
        </form>

        <div className="space-y-2 rounded-lg border border-border/60 p-4">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide">Rutas guardadas</h2>
          {query.isLoading ? <p className="text-sm text-muted-foreground">Cargando…</p> : null}
          {query.isError ? <p className="text-sm text-destructive">No se pudieron cargar las rutas.</p> : null}
          {!query.isLoading && routes.length === 0 ? <p className="text-sm text-muted-foreground">Aún no hay rutas.</p> : null}
          <ul className="divide-y divide-border/50">
            {routes.map((r) => (
              <li key={`${r.resourceId}-${r.id}`} className="flex items-center justify-between gap-2 py-2 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{r.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.resource} · {distanceKm(r.points).toFixed(2)} km
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button type="button" size="icon" variant="ghost" aria-label="Ver en mapa" onClick={() => setPreview(r.points)}>
                    <Eye />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" aria-label="Borrar ruta" onClick={() => onDelete(r.resourceId, r.id, r.name)}>
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
