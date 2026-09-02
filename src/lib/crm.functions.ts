import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

const STATUSES = ['pendiente', 'vendido', 'no_vendido'] as const

export const CRM_EMAIL = 'ventas@orb-lite.com'

function assertCrmUser(claims: any) {
  const email = String(claims?.email ?? '').toLowerCase()
  if (email !== CRM_EMAIL) throw new Error('Acceso restringido')
}

export const crmListSolicitudes = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ status: z.enum(['todas', ...STATUSES]).default('todas') })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertCrmUser(context.claims)
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

export const crmUpdateSolicitud = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(STATUSES),
        notes: z.string().max(2000).nullish(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertCrmUser(context.claims)
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
