import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface HardwareCommand {
  id: string;
  hardwareBrand: string;
  commandName: string;
  commandCode: string;
  description: string | null;
  requiresInput: boolean;
  inputLabel: string | null;
  createdAt: string;
}

/** Consulta las definiciones de comandos por marca de hardware o lista todas */
export const getHardwareCommandDefinitions = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        brand: z.string().trim().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let query = supabaseAdmin
      .from("hardware_command_definitions")
      .select("id, hardware_brand, command_name, command_code, description, requires_input, input_label, created_at")
      .order("hardware_brand", { ascending: true })
      .order("command_name", { ascending: true });

    if (data.brand) {
      query = query.ilike("hardware_brand", `%${data.brand}%`);
    }

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);

    const commands: HardwareCommand[] = (rows ?? []).map((r: any) => ({
      id: r.id,
      hardwareBrand: r.hardware_brand,
      commandName: r.command_name,
      commandCode: r.command_code,
      description: r.description,
      requiresInput: Boolean(r.requires_input),
      inputLabel: r.input_label,
      createdAt: r.created_at,
    }));

    return { commands };
  });

/** Agrega una nueva definición de comando para una marca de GPS */
export const addHardwareCommandDefinition = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        hardwareBrand: z.string().trim().min(2).max(100),
        commandName: z.string().trim().min(2).max(100),
        commandCode: z.string().trim().min(1).max(250),
        description: z.string().trim().max(500).optional().or(z.literal("")),
        requiresInput: z.boolean().default(false),
        inputLabel: z.string().trim().max(100).optional().or(z.literal("")),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: inserted, error } = await supabaseAdmin
      .from("hardware_command_definitions")
      .insert({
        hardware_brand: data.hardwareBrand,
        command_name: data.commandName,
        command_code: data.commandCode,
        description: data.description || null,
        requires_input: data.requiresInput,
        input_label: data.inputLabel || null,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return { ok: true, command: inserted };
  });

/** Actualiza una definición de comando de hardware existente */
export const updateHardwareCommandDefinition = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        hardwareBrand: z.string().trim().min(2).max(100),
        commandName: z.string().trim().min(2).max(100),
        commandCode: z.string().trim().min(1).max(250),
        description: z.string().trim().max(500).optional().or(z.literal("")),
        requiresInput: z.boolean().default(false),
        inputLabel: z.string().trim().max(100).optional().or(z.literal("")),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: updated, error } = await supabaseAdmin
      .from("hardware_command_definitions")
      .update({
        hardware_brand: data.hardwareBrand,
        command_name: data.commandName,
        command_code: data.commandCode,
        description: data.description || null,
        requires_input: data.requiresInput,
        input_label: data.inputLabel || null,
      })
      .eq("id", data.id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return { ok: true, command: updated };
  });

/** Elimina una definición de comando de hardware */
export const deleteHardwareCommandDefinition = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin
      .from("hardware_command_definitions")
      .delete()
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

