import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const STATUSES = ['pendiente', 'vendido', 'no_vendido'] as const

function assertToken(token: string) {
  const expected = process.env['ADMIN_PANEL_TOKEN']
  if (!expected) throw new Error('Panel no configurado')
  if (token !== expected) throw new Error('No autorizado')
}

export const listSolicitudes = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z
      .object({
        token: z.string().min(8),
        status: z.enum(['todas', ...STATUSES]).default('todas'),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    assertToken(data.token)
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    let query = supabaseAdmin
      .from('solicitudes')
      .select(
        'id, order_id, customer_number, full_name, phone, email, items, shipping_label, wants_invoice, total, status, notes, created_at',
      )
      .order('created_at', { ascending: false })
      .limit(300)

    if (data.status !== 'todas') query = query.eq('status', data.status)

    const { data: rows, error } = await query
    if (error) throw new Error(error.message)
    return { rows: rows ?? [] }
  })

export const updateSolicitudStatus = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z
      .object({
        token: z.string().min(8),
        id: z.string().uuid(),
        status: z.enum(STATUSES),
        notes: z.string().max(2000).nullish(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    assertToken(data.token)
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const { error } = await supabaseAdmin
      .from('solicitudes')
      .update({
        status: data.status,
        notes: data.notes ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.id)

    if (error) throw new Error(error.message)
    return { ok: true as const }
  })
