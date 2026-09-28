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

/** Define (o restablece) la contraseña del CRM para ventas@orb-lite.com. */
export const setCrmPassword = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z
      .object({
        token: z.string().min(8),
        password: z.string().min(8).max(72),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    assertToken(data.token)
    const email = 'ventas@orb-lite.com'
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const { data: listed, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    })
    if (listError) throw new Error(listError.message)

    const existing = listed.users.find((u) => (u.email ?? '').toLowerCase() === email)

    if (existing) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password: data.password,
        email_confirm: true,
      })
      if (error) throw new Error(error.message)
      return { ok: true as const, created: false }
    }

    const { error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
    })
    if (error) throw new Error(error.message)
    return { ok: true as const, created: true }
  })
