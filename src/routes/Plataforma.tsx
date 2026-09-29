import { createFileRoute } from '@tanstack/react-router'
import { Route as WialonIndexRoute } from './wialon.index'

export const Route = createFileRoute('/plataforma')({
  // Utiliza el componente definido en la ruta principal de Wialon
  component: WialonIndexRoute.options.component,
})
