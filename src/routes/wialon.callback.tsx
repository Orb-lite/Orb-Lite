import { createFileRoute } from '@tanstack/react-router'
import { Route as WialonRoute } from './wialon.index'

export const Route = createFileRoute('/plataforma')({
  component: WialonRoute.options.component,
})
