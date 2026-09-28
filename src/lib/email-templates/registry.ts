import type { ComponentType } from 'react'
import { template as nuevoPedidoTemplate } from './nuevo-pedido'
import { template as resumenPendientesTemplate } from './resumen-pendientes'
import { template as codigoAccesoCrmTemplate } from './codigo-acceso-crm'
import { template as confirmacionPedidoTemplate } from './confirmacion-pedido'
import { template as comprobanteVentaTemplate } from './comprobante-venta'
import { template as avisoRenovacionTemplate } from './aviso-renovacion'
import { template as avisoAdeudoTemplate } from './aviso-adeudo'
import { template as demoWialonTemplate } from './demo-wialon'
import { template as reporteVisitasTemplate } from './reporte-visitas'

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
  'codigo-acceso-crm': codigoAccesoCrmTemplate,
  'confirmacion-pedido': confirmacionPedidoTemplate,
  'comprobante-venta': comprobanteVentaTemplate,
  'aviso-renovacion': avisoRenovacionTemplate,
  'aviso-adeudo': avisoAdeudoTemplate,
  'demo-wialon': demoWialonTemplate,
  'reporte-visitas': reporteVisitasTemplate,
}
