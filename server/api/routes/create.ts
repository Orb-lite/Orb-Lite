import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userId = event.context.auth?.user?.id || body.currentUserId

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Usuario no autenticado' })
  }

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)

  const { data, error } = await supabase
    .from('user_routes')
    .insert([
      {
        id: body.id || `route_${Date.now()}`,
        user_id: userId, // ID del usuario creador
        user_name: body.currentUserName || '',
        name: body.name,
        color: body.color || '#f59e0b',
        points: body.points || [],
        origin: body.origin || '',
        distance_meters: body.distanceMeters || 0,
        duration_seconds: body.durationSeconds || 0
      }
    ])
    .select()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { success: true, data: data[0] }
})
