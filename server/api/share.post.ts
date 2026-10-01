import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { resourceType, resourceId, targetUserId } = body

  // Validar campos requeridos
  if (!resourceType || !resourceId || !targetUserId) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan parámetros requeridos' })
  }

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)

  // Mapear el tipo de recurso a su tabla correspondiente
  const tableMap: Record<string, { table: string; col: string }> = {
    geofence: { table: 'geofence_assignments', col: 'geofence_id' },
    route: { table: 'user_route_assignments', col: 'route_id' },
    link: { table: 'shared_link_assignments', col: 'shared_link_id' }
  }

  const target = tableMap[resourceType]
  if (!target) {
    throw createError({ statusCode: 400, statusMessage: 'Tipo de recurso no válido' })
  }

  const { data, error } = await supabase
    .from(target.table)
    .insert([
      {
        [target.col]: resourceId,
        assigned_user_id: targetUserId
      }
    ])

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { success: true, data }
})
