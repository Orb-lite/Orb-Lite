
CREATE TABLE IF NOT EXISTS public.hardware_command_definitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hardware_brand TEXT NOT NULL,
    command_name TEXT NOT NULL,
    command_code TEXT NOT NULL, -- El código real a enviar (ej: '{"type":"reboot"}')
    description TEXT,
    requires_input BOOLEAN DEFAULT false,
    input_label TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
