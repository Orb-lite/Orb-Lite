import { createFileRoute } from '@tanstack/react-router'
import { sendTemplateEmail } from '@/lib/email-templates/send-email'

const VENTAS = 'ventas@orb-lite.com'
const REMINDER_DAYS = [10, 5, 3, 1]

function daysBetween(from: Date, to: Date) {
  const a = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate())
  const b = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate())
  return Math.round((b - a) / 86_400_000)
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
    .from('renovaciones')
    .select('*')
    .neq('status', 'baja')

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  const today = new Date()
  const sent: string[] = []
  const skipped: string[] = []

  for (const row of data ?? []) {
    const renewalDate = new Date(`${row.renewal_date}T00:00:00Z`)
    const diff = daysBetween(today, renewalDate) // >0 faltan días, <0 atrasado
    const overdue = -diff

    const base = {
      customerName: row.customer_name,
      customerNumber: row.customer_number,
      variantName: row.variant_name,
      platform: row.platform,
      period: row.renewal_period,
      renewalDate: row.renewal_date,
      amount: Number(row.amount ?? 0),
      unitName: row.unit_name,
      imei: row.imei,
      iccid: row.iccid,
      simPhone: row.sim_phone,
    }

    let templateName: 'aviso-renovacion' | 'aviso-adeudo' | null = null
    let noticeKey = ''
    let templateData: Record<string, unknown> = {}
    let newStatus: string | null = null

    if (diff > 0 && REMINDER_DAYS.includes(diff)) {
      templateName = 'aviso-renovacion'
      noticeKey = `prev-${row.renewal_date}-${diff}`
      templateData = { ...base, daysLeft: diff }
    } else if (overdue >= 60) {
      templateName = 'aviso-adeudo'
      noticeKey = `baja-${row.renewal_date}`
      templateData = { ...base, stage: 'baja', daysOverdue: overdue }
      newStatus = 'baja'
    } else if (overdue >= 30) {
      templateName = 'aviso-adeudo'
      noticeKey = `segundo-mes-${row.renewal_date}`
      templateData = { ...base, stage: 'segundo-mes', daysOverdue: overdue }
      newStatus = 'cancelacion'
    } else if (overdue >= 20) {
      templateName = 'aviso-adeudo'
      noticeKey = `bloqueo-${row.renewal_date}`
      templateData = { ...base, stage: 'bloqueo', daysOverdue: overdue }
      newStatus = 'adeudo'
    }

    if (!templateName) continue

    const notices: string[] = Array.isArray(row.notices) ? (row.notices as string[]) : []
    if (notices.includes(noticeKey)) {
      skipped.push(`${row.id}:${noticeKey}`)
      continue
    }

    const targets = [
      { to: VENTAS, internal: true },
      ...(row.customer_email ? [{ to: row.customer_email as string, internal: false }] : []),
    ]

    for (const target of targets) {
      try {
        await sendTemplateEmail(templateName, target.to, {
          idempotencyKey: `${templateName}-${row.id}-${noticeKey}-${target.internal ? 'ventas' : 'cliente'}`,
          templateData: { ...templateData, isInternal: target.internal },
        })
        sent.push(`${target.to}:${noticeKey}`)
      } catch (err) {
        console.error('No se pudo enviar el aviso de renovación', err)
      }
    }

    await supabaseAdmin
      .from('renovaciones')
      .update({
        notices: [...notices, noticeKey],
        ...(newStatus ? { status: newStatus } : {}),
      })
      .eq('id', row.id)
  }

  return new Response(JSON.stringify({ ok: true, sent, skipped, reviewed: (data ?? []).length }), {
    headers: { 'content-type': 'application/json' },
  })
}

export const Route = createFileRoute('/api/public/cron/avisos-renovacion')({
  server: {
    handlers: {
      POST: ({ request }) => handle(request),
      GET: ({ request }) => handle(request),
    },
  },
})
