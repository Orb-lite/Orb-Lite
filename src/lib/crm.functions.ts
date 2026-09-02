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
        'id, order_id, customer_number, full_name, phone, email, items, shipping_label, wants_invoice, billing, total, status, notes, created_at',
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

export const crmListCustomers = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    assertCrmUser(context.claims)
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const { data: rows, error } = await supabaseAdmin
      .from('customers')
      .select(
        'id, customer_number, full_name, phone, email, contact, billing, orders_count, total_spent, last_order_id, created_at, updated_at',
      )
      .order('customer_number', { ascending: true })
      .limit(500)

    if (error) throw new Error(error.message)

    const { data: sols, error: solError } = await supabaseAdmin
      .from('solicitudes')
      .select('customer_number, status, total, created_at')
      .not('customer_number', 'is', null)
      .limit(5000)
    if (solError) throw new Error(solError.message)

    const agg = new Map<
      number,
      { first_order_at: string | null; pending: number; pending_total: number; orders: number; total: number }
    >()
    for (const s of sols ?? []) {
      const key = Number(s.customer_number)
      const cur =
        agg.get(key) ?? { first_order_at: null, pending: 0, pending_total: 0, orders: 0, total: 0 }
      cur.orders += 1
      cur.total += Number(s.total ?? 0)
      if (s.status === 'pendiente') {
        cur.pending += 1
        cur.pending_total += Number(s.total ?? 0)
      }
      if (!cur.first_order_at || new Date(s.created_at) < new Date(cur.first_order_at)) {
        cur.first_order_at = s.created_at
      }
      agg.set(key, cur)
    }

    return {
      rows: (rows ?? []).map((r) => {
        const a = agg.get(Number(r.customer_number))
        return {
          ...r,
          first_order_at: a?.first_order_at ?? r.created_at,
          pending_count: a?.pending ?? 0,
          pending_total: a?.pending_total ?? 0,
          solicitudes_count: a?.orders ?? 0,
        }
      }),
    }
  })
