import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/wialon/callback')({
  component: WialonCallbackComponent,
})

function WialonCallbackComponent() {
  const navigate = useNavigate()

  useEffect(() => {
    // Extrae el token que envía Wialon en la URL
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'))
    const searchParams = new URLSearchParams(window.location.search)
    
    const token = hashParams.get('access_token') || searchParams.get('access_token')

    if (token) {
      localStorage.setItem('wialon_token', token)
      
      // Redirige al panel dinámico usando el token obtenido
      navigate({ 
        to: '/panel/$token', 
        params: { token } 
      })
    } else {
      // Si no hay token en parámetros, redirige al índice de wialon
      navigate({ to: '/wialon' })
    }
  }, [navigate])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <h2 className="text-xl font-bold text-white">Iniciando sesión en Wialon...</h2>
      <p className="mt-2 text-sm text-gray-400">Por favor espera un momento.</p>
    </div>
  )
}
