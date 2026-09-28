
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client.server";
import { wialonUnitDetail } from "@/lib/wialon.functions";
import { wialonCall, type WialonHost } from "@/lib/wialon.server";

export const getHardwareCommands = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({
      unitId: z.number().int().positive(),
      host: z.enum(["lite", "full"]),
      sid: z.string().min(1),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    // 1. Get unit details
    const unitDetail = await wialonUnitDetail({
        data: { unitId: data.unitId, host: data.host, sid: data.sid }
    });

    if (!unitDetail.hwTypeId) {
        throw new Error("No se pudo determinar el tipo de hardware de la unidad.");
    }

    // 2. Get hardware type name
    const hwTypes = await wialonCall<Array<{ id: number; name: string }>>(
      data.host as WialonHost,
      "core/get_hw_types",
      {
        filterType: "id",
        filterValue: [unitDetail.hwTypeId],
        includeType: true,
        ignoreRename: true,
      },
      data.sid,
    );
    
    const hwTypeName = (Array.isArray(hwTypes) ? hwTypes[0]?.name : undefined) ?? "";

    // 3. Simple brand mapping (can be enhanced)
    // This assumes hardware_command_definitions.hardware_brand matches the brand/type
    const brand = hwTypeName;

    // 4. Fetch commands
    const { data: commands, error } = await supabase
      .from("hardware_command_definitions")
      .select("*")
      .eq("hardware_brand", brand);

    if (error) throw error;
    return { commands };
  });

export const addHardwareCommand = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({
      hardwareBrand: z.string(),
      commandName: z.string(),
      commandCode: z.string(),
      description: z.string().optional(),
      requiresInput: z.boolean().default(false),
      inputLabel: z.string().optional(),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const { data: command, error } = await supabase
      .from("hardware_command_definitions")
      .insert([
        {
          hardware_brand: data.hardwareBrand,
          command_name: data.commandName,
          command_code: data.commandCode,
          description: data.description,
          requires_input: data.requiresInput,
          input_label: data.inputLabel,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { command };
  });
