import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Shield,
  Route as RouteIcon,
  Layers,
  Share2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { WialonGuard } from "@/components/wialon-guard";
import {
  syncWialonPlatformUser,
  updateSubuserPermissions,
  type PlatformUserProfile,
  type SubuserInfo,
} from "@/lib/platform-user.functions";
import { writeSession, type WialonSession } from "@/lib/wialon-session";

export const Route = createFileRoute("/wialon/usuarios")({
  head: () => ({
    meta: [
      { title: "Sub-Cuentas y Accesos | ORB-LITE" },
      {
        name: "description",
        content: "Gestión de sub-usuarios, visibilidad de rutas, geocercas y enlaces de rastreo.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <WialonGuard>{(session) => <UsuariosView session={session} />}</WialonGuard>,
});

function UsuariosView({ session }: { session: WialonSession }) {
  const queryClient = useQueryClient();
  const syncUserFn = useServerFn(syncWialonPlatformUser);
  const updatePermsFn = useServerFn(updateSubuserPermissions);

  const [currentProfile, setCurrentProfile] = React.useState<PlatformUserProfile | null>(
    session.profile ?? null,
  );

  // Consulta en tiempo real de subcuentas y perfil
  const { data: profile, isLoading, refetch, isFetching } = useQuery<PlatformUserProfile | null>({
    queryKey: ["platform-user-profile", session.userId],
    queryFn: async (): Promise<PlatformUserProfile | null> => {
      const res = (await syncUserFn({
        data: {
          wialonUserId: session.userId,
          wialonUsername: session.userName,
          host: session.host,
          sid: session.sid,
        },
      })) as PlatformUserProfile | null;
      setCurrentProfile(res);
      // Actualizar sesión en local
      writeSession({
        ...session,
        profile: res,
      });
      return res;
    },
    initialData: session.profile ?? null,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      subuserId,
      permissions,
    }: {
      subuserId: number;
      permissions: { routes: boolean; geofences: boolean; tracking_links: boolean };
    }) => {
      return await updatePermsFn({
        data: {
          parentUserId: session.userId,
          subuserId,
          permissions,
        },
      });
    },
    onSuccess: (_, variables) => {
      toast.success("Permisos de visibilidad actualizados.");
      void refetch();
      void queryClient.invalidateQueries({ queryKey: ["user-routes"] });
      void queryClient.invalidateQueries({ queryKey: ["wialon-geofences"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al guardar permisos.");
    },
  });

  const handleToggle = (
    subuser: SubuserInfo,
    field: "routes" | "geofences" | "tracking_links",
  ) => {
    const current = subuser.permissions;
    const nextPerms = {
      ...current,
      [field]: !current[field],
    };
    updateMutation.mutate({
      subuserId: subuser.wialonUserId,
      permissions: nextPerms,
    });
  };

  const isParent = profile?.isParent || (profile?.subusers && profile.subusers.length > 0);
  const subusers = profile?.subusers ?? [];

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-4.5" />
            </span>
            <h1 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
              Jerarquía de Sub-Cuentas y Accesos
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Control de usuarios dependientes, sincronización automática en base de datos y visibilidad compartida.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin text-primary" : ""}`} />
          <span>{isFetching ? "Sincronizando…" : "Escanear en Wialon"}</span>
        </button>
      </div>

      {/* Regla de Oro de Visibilidad Bidireccional */}
      <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 text-xs text-foreground">
        <div className="flex items-start gap-3">
          <Shield className="size-5 shrink-0 text-primary mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold uppercase tracking-wider text-primary">
              Regla de Visibilidad Bidireccional Activa
            </p>
            <p className="text-muted-foreground leading-relaxed">
              • <strong>De Subcuenta a Padre:</strong> Cualquier ruta, geocerca o link de rastreo que genere una subcuenta es <strong>visible automáticamente</strong> para esta cuenta padre sin restricciones.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              • <strong>De Padre a Subcuenta:</strong> Tú decides mediante los interruptores inferiores si cada subcuenta puede ver tus rutas, geocercas o enlaces compartidos.
            </p>
          </div>
        </div>
      </div>

      {/* Listado de subcuentas */}
      {!isParent || subusers.length === 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Users className="size-6" />
          </div>
          <h2 className="mt-4 font-display text-base font-bold uppercase tracking-wide text-foreground">
            Sin Subcuentas Detectadas en Wialon
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground leading-relaxed">
            Tu cuenta actual no tiene usuarios hijos creados en Wialon o está registrada como cuenta individual.
            Si creas nuevos usuarios operadores en el gestor CMS de Wialon, pulsa <strong>"Escanear en Wialon"</strong> y aparecerán aquí automáticamente.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <a
              href={session.host === "full" ? "https://cms.wialon.com/" : "https://cms-lite.wialon.us/"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow hover:opacity-90 transition-opacity"
            >
              <span>Abrir Gestor CMS Wialon</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {subusers.length} {subusers.length === 1 ? "Subcuenta Vinculada" : "Subcuentas Vinculadas"}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              Cuenta Padre: #{session.userId} ({session.userName})
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {subusers.map((subuser: SubuserInfo) => {
              const perms = subuser.permissions ?? {
                routes: true,
                geofences: true,
                tracking_links: true,
              };

              return (
                <div
                  key={subuser.wialonUserId}
                  className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40"
                >
                  {/* Info subcuenta */}
                  <div className="flex items-start justify-between border-b border-border/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-mono font-bold text-primary">
                          ID: {subuser.wialonUserId}
                        </span>
                        <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                          {subuser.role}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                        {subuser.wialonUsername}
                      </h3>
                    </div>

                    <div className="flex size-9 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
                      <KeyRound className="size-4.5" />
                    </div>
                  </div>

                  {/* Permisos que la cuenta padre le concede */}
                  <div className="space-y-2.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Permitir que este sub-usuario vea:
                    </p>

                    {/* Toggle: Rutas */}
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <RouteIcon className="size-4 text-amber-500" />
                        <div>
                          <p className="text-xs font-semibold text-foreground">Rutas del Padre</p>
                          <p className="text-[10px] text-muted-foreground">
                            Ver rutas y paradas generadas por la cuenta principal
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle(subuser, "routes")}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          perms.routes ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block size-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                            perms.routes ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle: Geocercas */}
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <Layers className="size-4 text-emerald-500" />
                        <div>
                          <p className="text-xs font-semibold text-foreground">Geocercas del Padre</p>
                          <p className="text-[10px] text-muted-foreground">
                            Visualizar zonas y perímetros creados por la cuenta principal
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle(subuser, "geofences")}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          perms.geofences ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block size-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                            perms.geofences ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle: Links Compartidos */}
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <Share2 className="size-4 text-cyan-500" />
                        <div>
                          <p className="text-xs font-semibold text-foreground">Links Compartidos</p>
                          <p className="text-[10px] text-muted-foreground">
                            Ver y copiar enlaces de rastreo temporal creados por el padre
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle(subuser, "tracking_links")}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          perms.tracking_links ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block size-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                            perms.tracking_links ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="size-3" />
                      Tus reportes y rutas se ven en tu panel
                    </span>
                    <span>{subuser.lastLoginAt ? "Activo" : "Registrado"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
