import type { ComponentType } from 'react'
import { template as nuevoPedidoTemplate } from './nuevo-pedido'
import { template as resumenPendientesTemplate } from './resumen-pendientes'
import { template as codigoAccesoCrmTemplate } from './codigo-acceso-crm'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'nuevo-pedido': nuevoPedidoTemplate,
  'resumen-pendientes': resumenPendientesTemplate,
}
