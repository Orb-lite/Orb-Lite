import { createFileRoute } from '@tanstack/react-router'
import { sendTemplateEmail } from '@/lib/email-templates/send-email'

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

function summarizeItems(items: unknown): string {
  if (!Array.isArray(items)) return ''
  return items
    .map((raw) => {
      const it = raw as Record<string, any>
      const qty = Number(it['quantity'] ?? 1)
      const name = String(it['title'] ?? it['variantName'] ?? 'Producto')
      return `${qty} × ${name}`
    })
    .join(' · ')
}

async function handle(request: Request) {
  const secret = process.env['CRON_RESUMEN_SECRET'] ?? process.env['LOVABLE_CRON_SECRET']
  const provided =
    request.headers.get('x-cron-secret') ??
    (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')

  if (!secret || !provided || provided !== secret) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

  const { data, error } = await supabaseAdmin
    .from('solicitudes')
    .select(
      'order_id, customer_number, full_name, phone, email, items, shipping_label, wants_invoice, total, status, created_at'
    )
    .eq('status', 'pendiente')
    .order('created_at', { ascending: true })

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  const rows = data ?? []
  const orders = rows.map((r) => ({
    orderId: r.order_id,
    createdAt: fmt(r.created_at),
    customerNumber: r.customer_number,
    fullName: r.full_name,
    phone: r.phone,
    email: r.email,
    total: Number(r.total ?? 0),
    shippingLabel: r.shipping_label,
    wantsInvoice: r.wants_invoice,
    itemsSummary: summarizeItems(r.items),
    status: r.status,
  }))

  const totalPending = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)
  const now = new Date()
  const dateKey = now.toISOString().slice(0, 10)

  const panelToken = process.env['ADMIN_PANEL_TOKEN']
  const siteUrl = process.env['PUBLIC_SITE_URL'] ?? 'https://orb-lite.com'
  const panelUrl = panelToken ? `${siteUrl}/panel/${panelToken}` : ''

  const result = await sendTemplateEmail('resumen-pendientes', 'ventas@orb-lite.com', {
    idempotencyKey: `resumen-pendientes-${dateKey}-${Date.now()}`,
    templateData: {
      panelUrl,
      date: now.toLocaleDateString('es-MX', { timeZone: 'UTC' }),
      count: orders.length,
      totalPending,
      orders,
    },
  })

  return new Response(JSON.stringify({ ok: true, count: orders.length, ...result }), {
    headers: { 'content-type': 'application/json' },
  })
}

export const Route = createFileRoute('/api/public/cron/resumen-pendientes')({
  server: {
    handlers: {
      POST: async ({ request }) => handle(request),
      GET: async ({ request }) => handle(request),
    },
  },
})
