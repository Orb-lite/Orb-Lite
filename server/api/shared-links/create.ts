import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userId = event.context.auth?.user?.id || body.currentUserId

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Usuario no autenticado' })
  }

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)

  // Generar un token único para la URL pública/compartida
  const token = randomUUID()

  const { data, error } = await supabase
    .from('shared_links')
    .insert([
      {
        name: body.name,
        token: token,
        unit_id: body.unitId || null,
        route_id: body.routeId || null,
        expires_at: body.expiresAt || null, // Fecha de expiración opcional
        created_by_id: String(userId),
        created_by_name: body.currentUserName || ''
      }
    ])
    .select()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { success: true, data: data[0] }
})
