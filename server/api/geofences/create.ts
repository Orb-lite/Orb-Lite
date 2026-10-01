import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // 1. Obtener la sesión / ID del usuario actual (ejemplo desde headers o token JWT)
  // Reemplaza esto con tu método habitual de autenticación/sesión
  const userId = event.context.auth?.user?.id || body.currentUserId 
  const userName = event.context.auth?.user?.name || body.currentUserName

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Usuario no autenticado' })
  }

  // 2. Inicializar cliente Supabase
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)

  // 3. Insertar la geocerca asignando el creador
  const { data, error } = await supabase
    .from('geofences')
    .insert([
      {
        name: body.name,
        description: body.description || '',
        color: body.color || '#3b82f6',
        type: body.type || 'polygon',
        geometry: body.geometry, // Objeto JSON con las coordenadas
        created_by_id: String(userId),
        created_by_name: userName || ''
      }
    ])
    .select()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { success: true, data: data[0] }
})
