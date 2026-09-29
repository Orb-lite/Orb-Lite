import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/wialon/callback')({
  component: WialonCallbackComponent,
})

function WialonCallbackComponent() {
  const navigate = useNavigate()

  useEffect(() => {
    // Extrae el token de la URL que devuelve Wialon
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'))
    const searchParams = new URLSearchParams(window.location.search)
    
    const token = hashParams.get('access_token') || searchParams.get('access_token')

    if (token) {
      // Guarda el token en localStorage para que la plataforma lo use en sus peticiones
      localStorage.setItem('wialon_token', token)
      
      // Redirige directamente al módulo principal de la plataforma
      navigate({ to: '/wialon' })
    } else {
      // Si no se detectó token, envía de vuelta a iniciar sesión
      navigate({ to: '/auth' })
    }
  }, [navigate])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <h2 className="text-xl font-bold text-white">Cargando plataforma de rastreo...</h2>
      <p className="mt-2 text-sm text-gray-400">Por favor espera un momento.</p>
    </div>
  )
}
