import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

/** Solicitud pública de demo — se guarda para revisarla en el CRM. No envía correo al cliente. */
export const createDemoRequest = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z
      .object({
        firstName: z.string().trim().min(2).max(80),
        lastName: z.string().trim().min(2).max(80),
        phone: z.string().trim().min(8).max(25),
        email: z.string().trim().email().max(200),
        company: z.string().trim().max(150).optional().or(z.literal('')),
        platform: z.enum(['wialon_lite', 'wialon_full']).default('wialon_lite'),
        units: z.string().trim().max(30).optional().or(z.literal('')),
        message: z.string().trim().max(1000).optional().or(z.literal('')),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const { error } = await supabaseAdmin.from('demo_requests').insert({
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      email: data.email.toLowerCase(),
      company: data.company?.trim() || null,
      platform: data.platform,
      units: data.units?.trim() || null,
      message: data.message?.trim() || null,
      status: 'pendiente',
    })
    if (error) throw new Error('No se pudo registrar la solicitud. Inténtalo de nuevo.')

    return { ok: true as const }
  })
