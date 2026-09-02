import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const CRM_EMAIL = 'ventas@orb-lite.com'
const CODE_TTL_MINUTES = 20

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function randomCode() {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return String(100000 + (buf[0]! % 900000))
}

/**
 * Genera un código de un solo uso y lo envía a ventas@orb-lite.com.
 * El código es lo único que permite crear/restablecer la contraseña del CRM.
 */
export const requestCrmAccessCode = createServerFn({ method: 'POST' }).handler(async () => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

  // Anti-abuso: máximo 1 código por minuto.
  const { data: recent } = await supabaseAdmin
    .from('crm_access_codes')
    .select('created_at')
    .eq('email', CRM_EMAIL)
    .order('created_at', { ascending: false })
    .limit(1)

  const last = recent?.[0]?.created_at
  if (last && Date.now() - new Date(last).getTime() < 60_000) {
    return { ok: false as const, reason: 'espera' as const }
  }

  const code = randomCode()
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60_000).toISOString()

  const { error } = await supabaseAdmin.from('crm_access_codes').insert({
    email: CRM_EMAIL,
    code_hash: await sha256(code),
    expires_at: expiresAt,
  })
  if (error) throw new Error(error.message)

  const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
  const site = process.env['SITE_URL'] ?? 'https://orb-lite.com'
  await sendTemplateEmail('codigo-acceso-crm', CRM_EMAIL, {
    templateData: { code, minutes: CODE_TTL_MINUTES, url: `${site}/acceso-crm` },
  })

  return { ok: true as const }
})

/** Valida el código de un solo uso y define la contraseña del CRM. */
export const redeemCrmAccessCode = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z
      .object({
        code: z.string().trim().regex(/^\d{6}$/),
        password: z.string().min(8).max(72),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const hash = await sha256(data.code)

    const { data: rows, error: readError } = await supabaseAdmin
      .from('crm_access_codes')
      .select('id, expires_at, used_at')
      .eq('email', CRM_EMAIL)
      .eq('code_hash', hash)
      .limit(1)
    if (readError) throw new Error(readError.message)

    const row = rows?.[0]
    if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) {
      throw new Error('Código inválido o vencido')
    }

    const { data: listed, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    })
    if (listError) throw new Error(listError.message)
    const existing = listed.users.find((u) => (u.email ?? '').toLowerCase() === CRM_EMAIL)

    if (existing) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password: data.password,
        email_confirm: true,
      })
      if (error) throw new Error(error.message)
    } else {
      const { error } = await supabaseAdmin.auth.admin.createUser({
        email: CRM_EMAIL,
        password: data.password,
        email_confirm: true,
      })
      if (error) throw new Error(error.message)
    }

    await supabaseAdmin
      .from('crm_access_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', row.id)

    return { ok: true as const, email: CRM_EMAIL }
  })
