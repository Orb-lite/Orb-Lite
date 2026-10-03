import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Route as RouteIcon,
  Plus,
  Search,
  MapPin,
  CheckCircle2,
} from "lucide-react";

// Importa tus componentes y botones correspondientes
// import { RouteList } from "@/components/routes/RouteList";
// import { RouteFormModal } from "@/components/routes/RouteFormModal";

export const Route = createFileRoute("/_authenticated/routes")({
  head: () => ({
    meta: [
      { title: "Gestión de Rutas | ORB-LITE" },
      {
        name: "description",
        content: "Administra las rutas logísticas y puntos de control de tu flota.",
      },
    ],
  }),
  component: RoutesPage,
});

function RoutesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenCreateModal = () => {
    setSelectedRouteId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (id: string) => {
    setSelectedRouteId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRouteId(null);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER PAGE */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <RouteIcon className="size-4" />
            <span>Módulo de Logística</span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold uppercase italic sm:text-4xl text-foreground">
            Gestión de <span className="text-gradient-lime">Rutas</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Planifica, asigna y optimiza los trayectos de tus unidades con integración GPS.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-lg transition hover:opacity-95"
          style={{ background: "var(--gradient-lime)" }}
        >
          <Plus className="size-4" />
          Nueva Ruta
        </button>
      </div>

      {/* SEARCH BAR & FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por nombre, origen o destino..."
            className="w-full rounded-lg border border-border/70 bg-card/60 pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground self-start sm:self-auto">
          <CheckCircle2 className="size-4 text-primary" />
          <span>Optimizador de Google Maps & Waze Activo</span>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL / LISTA */}
      <div className="rounded-2xl border border-border/70 bg-card/60 p-6 shadow-sm">
        {/* Descomenta cuando tengas tu componente RouteList */}
        {/* <RouteList searchQuery={searchQuery} onEdit={handleOpenEditModal} /> */}
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MapPin className="size-10 text-muted-foreground/60 mb-3" />
          <p className="text-base font-semibold text-foreground">Lista de Rutas</p>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            Conecta tu componente <code className="text-primary font-mono">&lt;RouteList /&gt;</code> para desplegar los trayectos configurados.
          </p>
        </div>
      </div>

      {/* MODAL CREAR / EDITAR */}
      {/* <RouteFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        routeId={selectedRouteId}
      /> */}
    </div>
  );
}
