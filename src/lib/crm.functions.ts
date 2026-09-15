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

const saleRenewalSchema = z.object({
  fullName: z.string().trim().max(120).optional().or(z.literal('')),
  unitName: z.string().trim().max(120).optional().or(z.literal('')),
  imei: z.string().trim().max(25).optional().or(z.literal('')),
  iccid: z.string().trim().max(25).optional().or(z.literal('')),
  simPhone: z.string().trim().max(25).optional().or(z.literal('')),
})

const saleItemSchema = z.object({
  variantId: z.string().min(1),
  customName: z.string().trim().max(200).optional().or(z.literal('')),
  quantity: z.number().int().min(1).max(100),
  unitPrice: z.number().finite().min(0).max(10_000_000),
  renewal: saleRenewalSchema.nullish(),
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
        addIva: z.boolean().default(false),
        notes: z.string().trim().max(2000).nullish(),
        channel: z.string().trim().max(60).optional().or(z.literal('')),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertCrmUser(context.claims)
    const { IVA_RATE, SHIPPING_OPTIONS, findVariant } = await import('@/data/catalog')
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const shipping = SHIPPING_OPTIONS.find((s) => s.id === data.shippingId) ?? SHIPPING_OPTIONS[0]!

    let productsTotal = 0
    const lines = data.items.flatMap((item) => {
      const lineTotal = item.unitPrice * item.quantity
      const isCustom = item.variantId === '__custom__'
      const found = isCustom ? null : findVariant(item.variantId)
      if (!isCustom && !found) return []
      const customName = (item.customName ?? '').trim()
      if (isCustom && customName.length === 0) return []
      // Datos del equipo/chip que se renueva (IMEI y nombre en plataforma, o ICCID y teléfono)
      const r = item.renewal ?? null
      const renewalEntries = r
        ? Object.entries(r).filter(([, v]) => typeof v === 'string' && v.trim().length > 0)
        : []
      const renewalData =
        !isCustom && found!.product.category === 'RENOVATION' && renewalEntries.length > 0
          ? (Object.fromEntries(renewalEntries.map(([k, v]) => [k, String(v).trim()])) as Record<
              string,
              string
            >)
          : null
      productsTotal += lineTotal
      return [
        {
          variantName: isCustom ? customName : found!.variant.name,
          title: isCustom ? 'Producto personalizado' : found!.product.title,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal,
          addOns: [] as { name: string; price: number }[],
          isRenewal: isCustom ? false : found!.product.category === 'RENOVATION',
          renewal: renewalData,
        },
      ]
    })
    if (lines.length === 0) throw new Error('Selecciona al menos un producto válido')

    const subtotal = productsTotal + shipping.price
    const total = data.addIva ? Math.round(subtotal * (1 + IVA_RATE) * 100) / 100 : subtotal
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

    const notes = [
      `Canal: ${channel}`,
      data.addIva ? 'IVA agregado (16%)' : '',
      data.notes ?? '',
    ]
      .filter(Boolean)
      .join(' · ')

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

    // Programa los avisos de renovación (10, 5, 3 y 1 día antes del corte).
    try {
      const { registerRenewals } = await import('@/lib/renovaciones.server')
      const renewalLines = data.items.flatMap((item) => {
        if (item.variantId === '__custom__') return []
        const found = findVariant(item.variantId)
        if (!found || found.product.category !== 'RENOVATION') return []
        return [
          {
            variantId: item.variantId,
            variantName: found.variant.name,
            amount: item.unitPrice * item.quantity,
            renewal: (item.renewal ?? null) as Record<string, string | null | undefined> | null,
          },
        ]
      })
      if (renewalLines.length > 0) {
        await registerRenewals(
          supabaseAdmin,
          {
            orderId,
            customerNumber,
            customerName: data.fullName,
            customerEmail: data.email ?? data.billing?.email ?? null,
            customerPhone: data.phone,
          },
          renewalLines,
        )
      }
    } catch (error) {
      console.error('No se pudieron programar los avisos de renovación', error)
    }

    // Comprobante de venta + resumen por correo (cliente y ventas@orb-lite.com)
    const subtotalWithoutIva = data.addIva ? subtotal : total / (1 + IVA_RATE)
    const iva = total - subtotalWithoutIva
    const customerEmail = data.email ?? data.billing?.email ?? null
    try {
      const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')

      const comprobanteData = {
        orderId,
        issuedAt: new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
        channel,
        customerName: data.fullName,
        customerNumber,
        customerEmail,
        customerPhone: data.phone,
        lines,
        shippingLabel: shipping.label,
        shippingPrice: shipping.price,
        productsTotal,
        subtotalWithoutIva,
        iva,
        total,
        wantsInvoice: data.wantsInvoice,
        billingInfo: data.wantsInvoice ? (data.billing ?? null) : null,
      }

      const sends: Array<Promise<unknown>> = [
        sendTemplateEmail('comprobante-venta', 'ventas@orb-lite.com', {
          idempotencyKey: `comprobante-${orderId}-ventas`,
          templateData: comprobanteData,
        }),
        // Resumen de la venta para ventas@orb-lite.com
        sendTemplateEmail('nuevo-pedido', 'ventas@orb-lite.com', {
          idempotencyKey: `nuevo-pedido-${orderId}`,
          templateData: {
            orderId,
            customerNumber,
            lines,
            shippingLabel: shipping.label,
            shippingPrice: shipping.price,
            productsTotal,
            subtotalWithoutIva,
            iva,
            total,
            totalItems: data.items.reduce((sum, i) => sum + i.quantity, 0),
            isNational: data.shippingId === 'national',
            shippingInfo: null,
            pickupInfo: { fullName: data.fullName, phone: data.phone },
            wantsInvoice: data.wantsInvoice,
            billingInfo: data.wantsInvoice ? (data.billing ?? null) : null,
          },
        }),
      ]

      if (customerEmail) {
        sends.push(
          sendTemplateEmail('comprobante-venta', customerEmail, {
            idempotencyKey: `comprobante-${orderId}-cliente`,
            templateData: comprobanteData,
          }),
          // Resumen de la venta para el cliente
          sendTemplateEmail('confirmacion-pedido', customerEmail, {
            idempotencyKey: `confirmacion-${orderId}-cliente`,
            templateData: {
              orderId,
              customerName: data.fullName,
              customerNumber,
              lines,
              shippingLabel: shipping.label,
              shippingPrice: shipping.price,
              productsTotal,
              subtotalWithoutIva,
              iva,
              total,
              isNational: data.shippingId === 'national',
              wantsInvoice: data.wantsInvoice,
            },
          }),
        )
      }

      const results = await Promise.allSettled(sends)
      for (const r of results) {
        if (r.status === 'rejected') console.error('No se pudo enviar correo de la venta', r.reason)
      }
    } catch (sendError) {
      console.error('No se pudieron enviar los correos de la venta', sendError)
    }

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

/** Edita los datos de un cliente existente sin tocar su historial de compras. */
export const crmUpdateCustomer = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        customerNumber: z.number().int().min(500).max(9_999_999),
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

    const { data: updated, error } = await supabaseAdmin
      .from('customers')
      .update({
        full_name: data.fullName,
        phone: data.phone,
        email: data.email ?? data.billing?.email ?? null,
        contact,
        billing: data.billing ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('customer_number', data.customerNumber)
      .select('customer_number')
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (!updated) throw new Error('No se encontró el cliente')
    return { ok: true as const, customerNumber: updated.customer_number }
  })

/** Borra un cliente y todas sus solicitudes asociadas. */
export const crmDeleteCustomer = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ customerNumber: z.number().int().min(500).max(9_999_999) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    assertCrmUser(context.claims)
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const { data: existing, error: findError } = await supabaseAdmin
      .from('customers')
      .select('customer_number')
      .eq('customer_number', data.customerNumber)
      .maybeSingle()
    if (findError) throw new Error(findError.message)
    if (!existing) throw new Error('No se encontró el cliente')

    const { data: deletedSolicitudes, error: solError } = await supabaseAdmin
      .from('solicitudes')
      .delete()
      .eq('customer_number', data.customerNumber)
      .select('id')
    if (solError) throw new Error(solError.message)

    const { error: delError } = await supabaseAdmin
      .from('customers')
      .delete()
      .eq('customer_number', data.customerNumber)
    if (delError) throw new Error(delError.message)

    return {
      ok: true as const,
      customerNumber: data.customerNumber,
      deletedSolicitudes: deletedSolicitudes?.length ?? 0,
    }
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

/* ------------------------- Panel de renovaciones ------------------------- */

const RENOVACION_STATUSES = ['activa', 'por_vencer', 'adeudo', 'cancelada'] as const

const renovacionSchema = z.object({
  id: z.string().uuid().nullish(),
  customerNumber: z.number().int().min(500).max(9_999_999).nullish(),
  customerName: z.string().trim().max(150).nullish(),
  customerEmail: z.string().trim().email().max(150).nullish().or(z.literal('')),
  customerPhone: z.string().trim().max(30).nullish(),
  variantId: z.string().trim().min(1).max(80),
  variantName: z.string().trim().min(1).max(150),
  platform: z.enum(['ORB-LITE', 'ORB-FULL']).nullish(),
  renewalKind: z.enum(['platform', 'sim', 'both']).default('platform'),
  renewalPeriod: z.enum(['monthly', 'annual']).default('annual'),
  unitName: z.string().trim().max(120).nullish(),
  imei: z.string().trim().max(40).nullish(),
  iccid: z.string().trim().max(40).nullish(),
  simPhone: z.string().trim().max(30).nullish(),
  amount: z.number().finite().min(0).max(10_000_000).default(0),
  renewalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(RENOVACION_STATUSES).default('activa'),
})

const nullish = (v: unknown) => {
  const s = typeof v === 'string' ? v.trim() : ''
  return s.length > 0 ? s : null
}

/** Lista todas las renovaciones registradas para el panel de control. */
export const crmListRenovaciones = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    assertCrmUser(context.claims)
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const { data: rows, error } = await supabaseAdmin
      .from('renovaciones')
      .select(
        'id, customer_number, customer_name, customer_email, customer_phone, variant_id, variant_name, platform, renewal_kind, renewal_period, unit_name, imei, iccid, sim_phone, amount, renewal_date, last_paid_at, status, last_order_id, created_at',
      )
      .order('renewal_date', { ascending: true })
      .limit(500)

    if (error) throw new Error(error.message)
    return { rows: rows ?? [] }
  })

/** Crea o edita una renovación desde el panel de control. */
export const crmSaveRenovacion = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => renovacionSchema.parse(data))
  .handler(async ({ data, context }) => {
    assertCrmUser(context.claims)
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const payload = {
      customer_number: data.customerNumber ?? null,
      customer_name: nullish(data.customerName),
      customer_email: nullish(data.customerEmail),
      customer_phone: nullish(data.customerPhone),
      variant_id: data.variantId,
      variant_name: data.variantName,
      platform: data.platform ?? null,
      renewal_kind: data.renewalKind,
      renewal_period: data.renewalPeriod,
      unit_name: nullish(data.unitName),
      imei: nullish(data.imei),
      iccid: nullish(data.iccid),
      sim_phone: nullish(data.simPhone),
      amount: data.amount,
      // Las renovaciones siempre corren el día primero del mes.
      renewal_date: `${data.renewalDate.slice(0, 7)}-01`,
      status: data.status,
      updated_at: new Date().toISOString(),
    }

    if (data.id) {
      const { data: updated, error } = await supabaseAdmin
        .from('renovaciones')
        .update(payload)
        .eq('id', data.id)
        .select('id')
        .maybeSingle()
      if (error) throw new Error(error.message)
      if (!updated) throw new Error('No se encontró la renovación')
      return { ok: true as const, id: updated.id, created: false }
    }

    const { data: inserted, error } = await supabaseAdmin
      .from('renovaciones')
      .insert({ ...payload, notices: [] })
      .select('id')
      .maybeSingle()
    if (error) throw new Error(error.message)
    return { ok: true as const, id: inserted?.id ?? null, created: true }
  })

/** Borra una renovación del panel de control. */
export const crmDeleteRenovacion = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    assertCrmUser(context.claims)
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { error } = await supabaseAdmin.from('renovaciones').delete().eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })

/* ------------------------- Usuarios demo Wialon ------------------------- */

const DEMO_PLATFORMS = ['wialon_lite', 'wialon_full'] as const

function slugPart(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

/** Construye el usuario demo: nombre + apellido, o nombre + empresa/razón social. */
export function buildDemoUsername(fullName: string, company?: string | null) {
  const words = fullName.trim().split(/\s+/).filter(Boolean)
  const first = slugPart(words[0] ?? '')
  const companySlug = company ? slugPart(company).slice(0, 14) : ''
  const second = companySlug || slugPart(words[1] ?? '')
  const base = [first, second].filter(Boolean).join('.')
  return (base || 'demo').slice(0, 30)
}

/** Lista los usuarios demo generados. */
export const crmListDemoUsers = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    assertCrmUser(context.claims)
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { data: rows, error } = await supabaseAdmin
      .from('demo_users')
      .select('id, customer_number, full_name, company, platform, username, password, notes, created_at')
      .order('created_at', { ascending: false })
      .limit(500)
    if (error) throw new Error(error.message)
    return { rows: rows ?? [] }
  })

/** Genera un usuario demo (uno por cliente) con contraseña fija Abc2026+. */
export const crmCreateDemoUser = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        customerNumber: z.number().int().min(500).max(9_999_999).nullish(),
        fullName: z.string().trim().min(2).max(150),
        company: z.string().trim().max(150).nullish(),
        platform: z.enum(DEMO_PLATFORMS).default('wialon_lite'),
        notes: z.string().trim().max(500).nullish(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertCrmUser(context.claims)
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    if (data.customerNumber) {
      const { data: existing, error: exErr } = await supabaseAdmin
        .from('demo_users')
        .select('id, username')
        .eq('customer_number', data.customerNumber)
        .maybeSingle()
      if (exErr) throw new Error(exErr.message)
      if (existing)
        throw new Error(
          `El cliente #${data.customerNumber} ya tiene un usuario demo: ${existing.username}`,
        )
    }

    const base = buildDemoUsername(data.fullName, data.company)
    let username = base
    for (let i = 2; i < 50; i += 1) {
      const { data: taken, error } = await supabaseAdmin
        .from('demo_users')
        .select('id')
        .eq('username', username)
        .maybeSingle()
      if (error) throw new Error(error.message)
      if (!taken) break
      username = `${base}${i}`
    }

    const { data: inserted, error } = await supabaseAdmin
      .from('demo_users')
      .insert({
        customer_number: data.customerNumber ?? null,
        full_name: data.fullName.trim(),
        company: nullish(data.company),
        platform: data.platform,
        username,
        password: 'Abc2026+',
        notes: nullish(data.notes),
      })
      .select('id, username, password, platform')
      .maybeSingle()
    if (error) throw new Error(error.message)
    return { ok: true as const, user: inserted }
  })

/** Borra un usuario demo. */
export const crmDeleteDemoUser = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    assertCrmUser(context.claims)
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { error } = await supabaseAdmin.from('demo_users').delete().eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })
