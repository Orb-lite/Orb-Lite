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

/* ================== Ventas fuera de la página y registro de clientes ================== */

const saleItemSchema = z.object({
  variantId: z.string().min(1),
  customName: z.string().trim().max(200).optional().or(z.literal('')),
  quantity: z.number().int().min(1).max(100),
  unitPrice: z.number().finite().min(0).max(10_000_000),
})

const manualBillingSchema = z.object({
  legalName: z.string().trim().min(1).max(200),
  rfc: z.string().trim().min(1).max(20),
  taxRegime: z.string().trim().max(200).optional().or(z.literal('')),
  cfdiUse: z.string().trim().max(200).optional().or(z.literal('')),
  fiscalZip: z.string().trim().max(10).optional().or(z.literal('')),
  email: z.string().trim().max(150).optional().or(z.literal('')),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  fiscalAddress: z.string().trim().max(250).optional().or(z.literal('')),
})

function randomCustomerNumber() {
  return 500 + Math.floor(Math.random() * 99_500)
}

async function upsertCustomerRecord(
  supabaseAdmin: any,
  input: {
    customerNumber?: number | null
    fullName: string
    phone: string
    email?: string | null
    contact?: Record<string, unknown> | null
    billing?: Record<string, unknown> | null
    orderId?: string | null
    orderTotal?: number
  },
) {
  const payload: Record<string, unknown> = {
    full_name: input.fullName,
    phone: input.phone,
    email: input.email ?? null,
    ...(input.contact ? { contact: input.contact } : {}),
    ...(input.billing ? { billing: input.billing } : {}),
    ...(input.orderId ? { last_order_id: input.orderId } : {}),
  }
  const orderTotal = input.orderTotal ?? 0
  const counts = input.orderId ? 1 : 0

  if (input.customerNumber) {
    const { data: existing } = await supabaseAdmin
      .from('customers')
      .select('orders_count, total_spent, billing, contact')
      .eq('customer_number', input.customerNumber)
      .maybeSingle()

    if (existing) {
      const { error } = await supabaseAdmin
        .from('customers')
        .update({
          ...payload,
          contact: input.contact ?? existing.contact,
          billing: input.billing ?? existing.billing,
          orders_count: Number(existing.orders_count ?? 0) + counts,
          total_spent: Number(existing.total_spent ?? 0) + orderTotal,
          updated_at: new Date().toISOString(),
        })
        .eq('customer_number', input.customerNumber)
      if (error) throw new Error(error.message)
      return { customerNumber: input.customerNumber, isNew: false as const }
    }
  }

  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate = input.customerNumber ?? randomCustomerNumber()
    const { data: inserted, error } = await supabaseAdmin
      .from('customers')
      .insert({
        ...payload,
        customer_number: candidate,
        orders_count: counts,
        total_spent: orderTotal,
      })
      .select('customer_number')
      .single()
    if (!error && inserted) return { customerNumber: inserted.customer_number, isNew: true as const }
    if (input.customerNumber) throw new Error('No se pudo registrar el cliente')
  }
  throw new Error('No se pudo generar un número de cliente')
}

/** Registra una venta hecha fuera de la página (WhatsApp, mostrador, teléfono). */
export const crmCreateSale = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        customerNumber: z.number().int().min(500).max(9_999_999).nullish(),
        fullName: z.string().trim().min(1).max(150),
        phone: z.string().trim().min(1).max(30),
        email: z.string().trim().email().max(150).nullish(),
        city: z.string().trim().max(120).optional().or(z.literal('')),
        state: z.string().trim().max(120).optional().or(z.literal('')),
        zip: z.string().trim().max(10).optional().or(z.literal('')),
        items: z.array(saleItemSchema).min(1).max(50),
        shippingId: z.enum(['local', 'national']),
        wantsInvoice: z.boolean().default(false),
        billing: manualBillingSchema.nullish(),
        status: z.enum(STATUSES).default('vendido'),
        notes: z.string().trim().max(2000).nullish(),
        channel: z.string().trim().max(60).optional().or(z.literal('')),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertCrmUser(context.claims)
    const { ADD_ONS: _unused, SHIPPING_OPTIONS, findVariant } = await import('@/data/catalog')
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const shipping = SHIPPING_OPTIONS.find((s) => s.id === data.shippingId) ?? SHIPPING_OPTIONS[0]!

    let productsTotal = 0
    const lines = data.items.flatMap((item) => {
      const found = findVariant(item.variantId)
      if (!found) return []
       const lineTotal = item.unitPrice * item.quantity
      productsTotal += lineTotal
      return [
        {
          variantName: found.variant.name,
          title: found.product.title,
          quantity: item.quantity,
           unitPrice: item.unitPrice,
          lineTotal,
          addOns: [] as { name: string; price: number }[],
          isRenewal: found.product.category === 'RENOVATION',
          renewal: null,
        },
      ]
    })
    if (lines.length === 0) throw new Error('Selecciona al menos un producto válido')

    const total = productsTotal + shipping.price
    const orderId = `MAN-${Date.now().toString(36).toUpperCase()}`
    const channel = data.channel && data.channel.length > 0 ? data.channel : 'Venta directa'

    const contact = {
      fullName: data.fullName,
      phone: data.phone,
      ...(data.email ? { email: data.email } : {}),
      ...(data.city ? { city: data.city } : {}),
      ...(data.state ? { state: data.state } : {}),
      ...(data.zip ? { zip: data.zip } : {}),
    }

    const { customerNumber, isNew } = await upsertCustomerRecord(supabaseAdmin, {
      customerNumber: data.customerNumber ?? null,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email ?? data.billing?.email ?? null,
      contact,
      billing: data.wantsInvoice && data.billing ? data.billing : null,
      orderId,
      orderTotal: total,
    })

    const notes = [`Canal: ${channel}`, data.notes ?? ''].filter(Boolean).join(' · ')

    const { error } = await supabaseAdmin.from('solicitudes').insert({
      order_id: orderId,
      customer_number: customerNumber,
      full_name: data.fullName,
      phone: data.phone,
      email: data.email ?? data.billing?.email ?? null,
      items: lines,
      shipping_label: shipping.label,
      wants_invoice: data.wantsInvoice,
      billing: data.wantsInvoice ? (data.billing ?? null) : null,
      total,
      status: data.status,
      notes,
    })
    if (error) throw new Error(error.message)

    return { ok: true as const, orderId, customerNumber, isNewCustomer: isNew, total }
  })

/** Registra o actualiza un cliente sin generar una venta. */
export const crmSaveCustomer = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        customerNumber: z.number().int().min(500).max(9_999_999).nullish(),
        fullName: z.string().trim().min(1).max(150),
        phone: z.string().trim().min(1).max(30),
        email: z.string().trim().email().max(150).nullish(),
        city: z.string().trim().max(120).optional().or(z.literal('')),
        state: z.string().trim().max(120).optional().or(z.literal('')),
        zip: z.string().trim().max(10).optional().or(z.literal('')),
        billing: manualBillingSchema.nullish(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertCrmUser(context.claims)
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const contact = {
      fullName: data.fullName,
      phone: data.phone,
      ...(data.email ? { email: data.email } : {}),
      ...(data.city ? { city: data.city } : {}),
      ...(data.state ? { state: data.state } : {}),
      ...(data.zip ? { zip: data.zip } : {}),
    }

    const result = await upsertCustomerRecord(supabaseAdmin, {
      customerNumber: data.customerNumber ?? null,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email ?? data.billing?.email ?? null,
      contact,
      billing: data.billing ?? null,
    })

    return { ok: true as const, ...result }
  })

/** Consulta un cliente por número para precargar los formularios del CRM. */
export const crmLookupCustomer = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ customerNumber: z.number().int().min(500).max(9_999_999) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    assertCrmUser(context.claims)
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { data: row, error } = await supabaseAdmin
      .from('customers')
      .select('customer_number, full_name, phone, email, contact, billing, orders_count, total_spent')
      .eq('customer_number', data.customerNumber)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return { customer: row ?? null }
  })
