import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface DatabaseGeofence {
  id: string;
  name: string;
  description: string | null;
  color: string;
  type: string;
  geometry: any;
  createdById: string;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Obtiene las geocercas guardadas en la base de datos para un usuario */
export const getDatabaseGeofences = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        userId: z.string().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Geocercas creadas directamente por el usuario
    const { data: ownFences, error: ownErr } = await supabaseAdmin
      .from("geofences")
      .select("*")
      .eq("created_by_id", data.userId)
      .order("created_at", { ascending: false });

    if (ownErr) throw new Error(ownErr.message);

    // 2. Geocercas asignadas al usuario via geofence_assignments
    const { data: assignments, error: assignErr } = await supabaseAdmin
      .from("geofence_assignments")
      .select("geofence_id")
      .eq("assigned_user_id", data.userId);

    let assignedFences: any[] = [];
    if (!assignErr && assignments && assignments.length > 0) {
      const fenceIds = assignments.map((a) => a.geofence_id);
      const { data: assigned } = await supabaseAdmin
        .from("geofences")
        .select("*")
        .in("id", fenceIds);
      assignedFences = assigned ?? [];
    }

    const allMap = new Map<string, any>();
    for (const f of ownFences ?? []) allMap.set(f.id, f);
    for (const f of assignedFences) allMap.set(f.id, f);

    const geofences: DatabaseGeofence[] = Array.from(allMap.values()).map((f) => ({
      id: f.id,
      name: f.name,
      description: f.description,
      color: f.color || "#3b82f6",
      type: f.type || "polygon",
      geometry: f.geometry,
      createdById: f.created_by_id,
      createdByName: f.created_by_name,
      createdAt: f.created_at,
      updatedAt: f.updated_at,
    }));

    return { geofences };
  });

/** Guarda una nueva geocerca en Supabase y opcionalmente la asigna a un usuario */
export const saveDatabaseGeofence = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        name: z.string().trim().min(2).max(100),
        description: z.string().trim().max(500).optional().or(z.literal("")),
        color: z.string().trim().max(20).default("#3b82f6"),
        type: z.enum(["polygon", "circle", "line"]).default("polygon"),
        geometry: z.any(),
        userId: z.string().min(1),
        userName: z.string().trim().max(100).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: inserted, error } = await supabaseAdmin
      .from("geofences")
      .insert({
        name: data.name,
        description: data.description || null,
        color: data.color,
        type: data.type,
        geometry: data.geometry,
        created_by_id: data.userId,
        created_by_name: data.userName || null,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return { ok: true, geofence: inserted };
  });
